import type { LicenseClaims, TokenDecoder } from './types';

export function base64UrlToBytes(input: string): Uint8Array {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Accepts a public key as base64url/base64 string or raw 32-byte array. */
export function toPublicKeyBytes(key: string | Uint8Array): Uint8Array {
  const bytes = typeof key === 'string' ? base64UrlToBytes(key.trim()) : key;
  if (bytes.length !== 32) throw new Error(`Ed25519 public key must be 32 bytes, got ${bytes.length}`);
  return bytes;
}

const VALID_TIERS = new Set(['free', 'pro', 'team', 'lifetime']);

function assertClaims(raw: unknown): LicenseClaims {
  if (!raw || typeof raw !== 'object') throw new Error('claims not an object');
  const c = raw as Record<string, unknown>;
  if (typeof c.key !== 'string') throw new Error('claims.key missing');
  if (typeof c.product !== 'string') throw new Error('claims.product missing');
  if (typeof c.tier !== 'string' || !VALID_TIERS.has(c.tier)) throw new Error('claims.tier invalid');
  if (typeof c.exp !== 'number' || c.exp < 0) throw new Error('claims.exp invalid');
  if (c.hwid !== undefined && typeof c.hwid !== 'string') throw new Error('claims.hwid invalid');
  if (c.features !== undefined && !(Array.isArray(c.features) && c.features.every((f) => typeof f === 'string')))
    throw new Error('claims.features invalid');
  return c as unknown as LicenseClaims;
}

/**
 * Default token format: `<base64url(JSON claims)>.<base64url(ed25519 signature)>`.
 * The signature covers the UTF-8 bytes of the first segment (as transmitted).
 * If GCC uses a different layout, pass a custom `decode` to createLicenseClient.
 */
export const defaultDecoder: TokenDecoder = (token) => {
  const parts = token.trim().split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) throw new Error('token must have 2 segments');
  const message = new TextEncoder().encode(parts[0]);
  const signature = base64UrlToBytes(parts[1]);
  if (signature.length !== 64) throw new Error('signature must be 64 bytes');
  const claims = assertClaims(JSON.parse(new TextDecoder().decode(base64UrlToBytes(parts[0]))));
  return { message, signature, claims };
};
