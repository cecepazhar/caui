import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { CA_APPS_THEMES } from '../theme';
import tokens from './tokens.json';

const lum = (hex: string) => {
  const h = hex.replace('#', '');
  return [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((acc, c, i) => acc + c * [0.2126, 0.7152, 0.0722][i], 0);
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe('design tokens', () => {
  it('every CA app has unique id and a valid hex brand', () => {
    const ids = CA_APPS_THEMES.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const a of CA_APPS_THEMES) expect(a.color).toMatch(/^#[0-9a-f]{6}$/);
  });

  const exceptions = new Set(tokens.apps.filter((a) => 'aaException' in a).map((a) => a.id));

  it.each(CA_APPS_THEMES.filter((a) => !exceptions.has(a.id)).map((a) => [a.id, a.color, a.contrast]))(
    '%s: text on brand passes WCAG AA (≥ 4.5:1)',
    (_id, brand, onBrand) => {
      expect(ratio(brand, onBrand)).toBeGreaterThanOrEqual(4.5);
    }
  );

  it('documented AA exceptions still pass AA-large (≥ 3:1) and stay few', () => {
    expect(exceptions.size).toBeLessThanOrEqual(1);
    for (const a of CA_APPS_THEMES.filter((x) => exceptions.has(x.id))) {
      expect(ratio(a.color, a.contrast)).toBeGreaterThanOrEqual(3);
    }
  });

  it('primary text passes AA on every surface in both modes', () => {
    for (const mode of [tokens.modes.light, tokens.modes.dark]) {
      for (const s of ['surface', 'surface-elevated', 'surface-subtle'] as const) {
        expect(ratio(mode['text-primary'], mode[s])).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('tokens.css declares a theme block for every app', () => {
    const css = readFileSync(`${process.cwd()}/src/lib/tokens/tokens.css`, 'utf8');
    for (const a of CA_APPS_THEMES) expect(css).toContain(`[data-theme="${a.id}"]`);
  });
});
