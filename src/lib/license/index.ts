// @cecepazhar/caui/license — headless, offline-verifiable licensing for CA apps.
export * from './types';
export { defaultDecoder, base64UrlToBytes, bytesToBase64Url, toPublicKeyBytes } from './codec';
export { webCryptoVerifier } from './verify';
export { localStorageAdapter, memoryStorage } from './storage';
export { LicenseClient, createLicenseClient, verifyLicenseToken, type LicenseClientOptions, type VerifyOutcome } from './client.svelte';
export { Entitlements, createEntitlements, type FeatureMap } from './entitlements.svelte';

/** Display helper. 0 = lifetime. */
export function formatExpiry(exp: number, locale: string = 'id-ID'): string {
  if (exp === 0) return locale.startsWith('id') ? 'Seumur hidup' : 'Lifetime';
  return new Date(exp * 1000).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}
