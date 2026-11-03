/**
 * CAUI License — shared types.
 * Headless: no UI, no framework coupling except Svelte runes in client.svelte.ts.
 */

/** Tier codes. Free is implicit (no valid license). */
export type LicenseTier = 'free' | 'pro' | 'team' | 'lifetime';

/** Claims carried inside a signed license token issued by GCC. */
export interface LicenseClaims {
  /** License key (display only, never trusted on its own). */
  key: string;
  /** Product code, e.g. "CATERM". Must match the client's productCode. */
  product: string;
  tier: LicenseTier;
  /** Unix seconds. 0 = never expires. */
  exp: number;
  /** Unix seconds, issued-at. */
  iat?: number;
  /** Hardware/device binding. When present it must match the client's device id. */
  hwid?: string;
  /** Optional explicit feature grants, e.g. ["caterm.sftp-split"]. */
  features?: string[];
  /** Seat count for team licenses. */
  seats?: number;
}

export type LicenseStatus =
  | 'none' // no license stored → Free
  | 'valid'
  | 'expired'
  | 'invalid-signature'
  | 'wrong-product'
  | 'wrong-device'
  | 'malformed';

export interface ActivateResult {
  ok: boolean;
  status: LicenseStatus | 'network-error' | 'rejected';
  message: string;
}

/** Pluggable persistence (localStorage on web, Tauri store/keyring on desktop). */
export interface LicenseStorage {
  get(): string | null | Promise<string | null>;
  set(token: string): void | Promise<void>;
  remove(): void | Promise<void>;
}

/** Splits a token into signed message + signature + decoded claims. */
export type TokenDecoder = (token: string) => {
  message: Uint8Array;
  signature: Uint8Array;
  claims: LicenseClaims;
};

/** Signature verifier. Default uses WebCrypto Ed25519; desktop apps may inject a Rust/Tauri command. */
export type SignatureVerifier = (
  message: Uint8Array,
  signature: Uint8Array,
  publicKey: Uint8Array
) => Promise<boolean>;
