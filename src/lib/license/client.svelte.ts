import { defaultDecoder, toPublicKeyBytes } from './codec';
import { webCryptoVerifier } from './verify';
import { localStorageAdapter } from './storage';
import type {
  ActivateResult,
  LicenseClaims,
  LicenseStatus,
  LicenseStorage,
  SignatureVerifier,
  TokenDecoder,
} from './types';

export interface LicenseClientOptions {
  /** Product code embedded in tokens, e.g. "CATERM". Compared case-insensitively. */
  productCode: string;
  /** Ed25519 public key of the GCC license signer (base64url or raw bytes). */
  publicKey: string | Uint8Array;
  /** Absolute GCC base URL, e.g. "https://gcc.fathforce.com". Required for activate(). */
  apiBase?: string;
  /** Returns a stable device id (Tauri: hardware fingerprint command). Required if tokens carry hwid. */
  getDeviceId?: () => string | Promise<string>;
  deviceName?: string;
  storage?: LicenseStorage;
  decode?: TokenDecoder;
  verify?: SignatureVerifier;
  /** Response field holding the signed token. Default "token". */
  tokenField?: string;
  /** Clock source in unix seconds (injectable for tests / trusted time). */
  now?: () => number;
  fetch?: typeof fetch;
}

export interface VerifyOutcome {
  status: LicenseStatus;
  claims: LicenseClaims | null;
}

/**
 * Verifies a token fully offline: signature → product → device → expiry.
 * Nothing stored on the client is trusted until this passes.
 */
export async function verifyLicenseToken(
  token: string,
  opts: Pick<LicenseClientOptions, 'productCode' | 'publicKey' | 'decode' | 'verify' | 'now'> & {
    deviceId?: string | null;
  }
): Promise<VerifyOutcome> {
  const decode = opts.decode ?? defaultDecoder;
  const verify = opts.verify ?? webCryptoVerifier;
  let decoded: ReturnType<TokenDecoder>;
  try {
    decoded = decode(token);
  } catch {
    return { status: 'malformed', claims: null };
  }
  let ok = false;
  try {
    ok = await verify(decoded.message, decoded.signature, toPublicKeyBytes(opts.publicKey));
  } catch {
    ok = false;
  }
  if (!ok) return { status: 'invalid-signature', claims: null };

  const c = decoded.claims;
  if (c.product.toUpperCase() !== opts.productCode.toUpperCase()) return { status: 'wrong-product', claims: c };
  if (c.hwid && c.hwid !== opts.deviceId) return { status: 'wrong-device', claims: c };
  const now = (opts.now ?? (() => Math.floor(Date.now() / 1000)))();
  if (c.tier !== 'lifetime' && c.exp !== 0 && now > c.exp) return { status: 'expired', claims: c };
  return { status: 'valid', claims: c };
}

/** Reactive (Svelte 5 runes) license client. One instance per app. */
export class LicenseClient {
  status = $state<LicenseStatus>('none');
  claims = $state<LicenseClaims | null>(null);
  busy = $state(false);

  /** True only for a verified, unexpired, correctly bound token. */
  isPro = $derived(this.status === 'valid' && this.claims !== null && this.claims.tier !== 'free');
  tier = $derived(this.status === 'valid' && this.claims ? this.claims.tier : 'free');

  readonly #opts: LicenseClientOptions;
  readonly #storage: LicenseStorage;

  constructor(opts: LicenseClientOptions) {
    this.#opts = opts;
    this.#storage = opts.storage ?? localStorageAdapter();
  }

  async #deviceId(): Promise<string | null> {
    return this.#opts.getDeviceId ? await this.#opts.getDeviceId() : null;
  }

  async #apply(token: string): Promise<VerifyOutcome> {
    const outcome = await verifyLicenseToken(token, { ...this.#opts, deviceId: await this.#deviceId() });
    this.status = outcome.status;
    this.claims = outcome.status === 'valid' ? outcome.claims : null;
    return outcome;
  }

  /** Load + re-verify the stored token. Call on app start and periodically (expiry). */
  async load(): Promise<LicenseStatus> {
    const token = await this.#storage.get();
    if (!token) {
      this.status = 'none';
      this.claims = null;
      return this.status;
    }
    return (await this.#apply(token)).status;
  }

  /** Install a token received out-of-band (offline import / file). Stored only if valid. */
  async importToken(token: string): Promise<ActivateResult> {
    const outcome = await this.#apply(token.trim());
    if (outcome.status !== 'valid') return { ok: false, status: outcome.status, message: outcome.status };
    await this.#storage.set(token.trim());
    return { ok: true, status: 'valid', message: 'valid' };
  }

  /** Online activation against GCC; the returned signed token is verified locally before storing. */
  async activate(licenseKey: string): Promise<ActivateResult> {
    const { apiBase, productCode, deviceName = 'unknown', tokenField = 'token' } = this.#opts;
    if (!apiBase) return { ok: false, status: 'rejected', message: 'apiBase not configured' };
    const doFetch = this.#opts.fetch ?? globalThis.fetch;
    this.busy = true;
    try {
      const res = await doFetch(new URL('/api/v1/licenses/activate', apiBase).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: licenseKey.trim(),
          product_code: productCode,
          device_id: await this.#deviceId(),
          device_name: deviceName,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) {
        return { ok: false, status: 'rejected', message: String(data.error ?? `HTTP ${res.status}`) };
      }
      const token = data[tokenField];
      if (typeof token !== 'string') return { ok: false, status: 'malformed', message: `response.${tokenField} missing` };
      return await this.importToken(token);
    } catch (e) {
      return { ok: false, status: 'network-error', message: e instanceof Error ? e.message : 'network error' };
    } finally {
      this.busy = false;
    }
  }

  /** Raw stored token, for user-initiated export/backup. */
  async exportToken(): Promise<string | null> {
    return (await this.#storage.get()) ?? null;
  }

  async deactivate(): Promise<void> {
    await this.#storage.remove();
    this.status = 'none';
    this.claims = null;
  }
}

export function createLicenseClient(opts: LicenseClientOptions): LicenseClient {
  return new LicenseClient(opts);
}
