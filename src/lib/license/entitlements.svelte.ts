import type { LicenseClient } from './client.svelte';
import type { LicenseTier } from './types';

/** Minimum tier required per feature id. Features not listed are Free. */
export type FeatureMap = Record<string, LicenseTier>;

const RANK: Record<LicenseTier, number> = { free: 0, pro: 1, team: 2, lifetime: 2 };

/**
 * Feature gating shared by all CA apps.
 *   const ent = createEntitlements(license, { 'caterm.sftp-split': 'pro' });
 *   <ProGate locked={!ent.has('caterm.sftp-split')}>…</ProGate>
 * Client-side gating is UX + deterrence only; server-backed Pro features must also be enforced server-side.
 */
export class Entitlements {
  readonly #license: LicenseClient;
  readonly #features: FeatureMap;

  constructor(license: LicenseClient, features: FeatureMap) {
    this.#license = license;
    this.#features = features;
  }

  /** Reactive: re-evaluates when the license state changes. */
  has(feature: string): boolean {
    const required = this.#features[feature] ?? 'free';
    if (required === 'free') return true;
    const claims = this.#license.claims;
    if (this.#license.status !== 'valid' || !claims) return false;
    if (claims.features?.includes(feature)) return true;
    // lifetime is a Pro-level purchase without expiry, not automatically Team.
    if (required === 'team') return claims.tier === 'team';
    return RANK[claims.tier] >= RANK[required];
  }

  requiredTier(feature: string): LicenseTier {
    return this.#features[feature] ?? 'free';
  }
}

export function createEntitlements(license: LicenseClient, features: FeatureMap): Entitlements {
  return new Entitlements(license, features);
}
