#!/usr/bin/env node
/**
 * Guardrail: components must style through CAUI tokens only.
 * Fails on: Tailwind arbitrary hex `[#xxxxxx]`, hex fallbacks `var(--ca-x, #hex)`,
 * and `var(--ca-*)` names that tokens.css does not define (excluding locally-set vars).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const defined = new Set([...readFileSync(join(root, 'src/lib/tokens/tokens.css'), 'utf8').matchAll(/--ca-([a-z0-9-]+):/g)].map((m) => m[1]));
const walk = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
const files = walk(join(root, 'src/lib/components')).filter((f) => f.endsWith('.svelte'));

const problems = [];
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const local = new Set([...src.matchAll(/(?:style:)?--ca-([a-z0-9-]+)\s*[=:]/g)].map((m) => m[1]));
  src.split('\n').forEach((line, i) => {
    const at = `${relative(root, f)}:${i + 1}`;
    for (const m of line.matchAll(/\[#[0-9A-Fa-f]{3,8}\]/g)) problems.push(`${at}  arbitrary hex ${m[0]} → use [var(--ca-…)]`);
    for (const m of line.matchAll(/var\(--ca-[a-z0-9-]+,\s*#[0-9A-Fa-f]{3,8}\)/g)) problems.push(`${at}  hex fallback ${m[0]} → drop fallback`);
    for (const m of line.matchAll(/var\(--ca-([a-z0-9-]+)/g))
      if (!defined.has(m[1]) && !local.has(m[1])) problems.push(`${at}  undefined token --ca-${m[1]}`);
  });
}
if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n✗ ${problems.length} design-token violation(s)`);
  process.exit(1);
}
console.log(`✓ ${files.length} components use design tokens only`);
