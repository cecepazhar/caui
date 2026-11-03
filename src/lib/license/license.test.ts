import { describe, it, expect, beforeAll } from 'vitest';
import { bytesToBase64Url } from './codec';
import { createLicenseClient, verifyLicenseToken } from './client.svelte';
import { createEntitlements } from './entitlements.svelte';
import { memoryStorage } from './storage';
import type { LicenseClaims } from './types';

let privateKey: CryptoKey;
let publicKeyB64 = '';

async function sign(claims: LicenseClaims, key: CryptoKey = privateKey): Promise<string> {
  const payload = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(claims)));
  const sig = new Uint8Array(await crypto.subtle.sign('Ed25519', key, new TextEncoder().encode(payload)));
  return `${payload}.${bytesToBase64Url(sig)}`;
}

const NOW = 1_800_000_000;
const base: LicenseClaims = { key: 'CATERM-ABC', product: 'CATERM', tier: 'pro', exp: NOW + 3600 };
const opts = () => ({ productCode: 'CATERM', publicKey: publicKeyB64, now: () => NOW });

beforeAll(async () => {
  const kp = (await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
  privateKey = kp.privateKey;
  publicKeyB64 = bytesToBase64Url(new Uint8Array(await crypto.subtle.exportKey('raw', kp.publicKey)));
});

describe('verifyLicenseToken', () => {
  it('accepts a correctly signed, unexpired token', async () => {
    const r = await verifyLicenseToken(await sign(base), opts());
    expect(r.status).toBe('valid');
  });

  it('rejects forged JSON (the old localStorage tier=99 attack)', async () => {
    const forged = bytesToBase64Url(new TextEncoder().encode(JSON.stringify({ ...base, tier: 'lifetime' })));
    const r = await verifyLicenseToken(`${forged}.${'A'.repeat(86)}`, opts());
    expect(r.status).toBe('invalid-signature');
  });

  it('rejects tampered claims with a reused signature', async () => {
    const [, sig] = (await sign(base)).split('.');
    const tampered = bytesToBase64Url(new TextEncoder().encode(JSON.stringify({ ...base, exp: 0 })));
    expect((await verifyLicenseToken(`${tampered}.${sig}`, opts())).status).toBe('invalid-signature');
  });

  it('rejects tokens signed by another key', async () => {
    const other = (await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
    expect((await verifyLicenseToken(await sign(base, other.privateKey), opts())).status).toBe('invalid-signature');
  });

  it('rejects other products, expired tokens, other devices, garbage', async () => {
    expect((await verifyLicenseToken(await sign({ ...base, product: 'CAMARK' }), opts())).status).toBe('wrong-product');
    expect((await verifyLicenseToken(await sign({ ...base, exp: NOW - 1 }), opts())).status).toBe('expired');
    expect((await verifyLicenseToken(await sign({ ...base, hwid: 'HW-1' }), { ...opts(), deviceId: 'HW-2' })).status).toBe('wrong-device');
    expect((await verifyLicenseToken('not-a-token', opts())).status).toBe('malformed');
  });

  it('treats lifetime and exp=0 as non-expiring', async () => {
    expect((await verifyLicenseToken(await sign({ ...base, tier: 'lifetime', exp: 1 }), opts())).status).toBe('valid');
    expect((await verifyLicenseToken(await sign({ ...base, exp: 0 }), opts())).status).toBe('valid');
  });
});

describe('LicenseClient + Entitlements', () => {
  it('starts Free, becomes Pro only after a valid import, persists, and deactivates', async () => {
    const storage = memoryStorage();
    const client = createLicenseClient({ ...opts(), storage });
    const ent = createEntitlements(client, { 'caterm.split': 'pro', 'caterm.seats': 'team' });

    expect(await client.load()).toBe('none');
    expect(client.isPro).toBe(false);
    expect(ent.has('caterm.split')).toBe(false);
    expect(ent.has('caterm.basic')).toBe(true);

    expect((await client.importToken('garbage')).ok).toBe(false);
    expect(storage.get()).toBeNull();

    expect((await client.importToken(await sign(base))).ok).toBe(true);
    expect(client.isPro).toBe(true);
    expect(ent.has('caterm.split')).toBe(true);
    expect(ent.has('caterm.seats')).toBe(false);

    const reloaded = createLicenseClient({ ...opts(), storage });
    expect(await reloaded.load()).toBe('valid');

    await client.deactivate();
    expect(client.isPro).toBe(false);
    expect(storage.get()).toBeNull();
  });

  it('re-verifies stored tokens on load (tampered storage → Free)', async () => {
    const storage = memoryStorage('eyJ0aWVyIjoiOTkifQ.AAAA');
    const client = createLicenseClient({ ...opts(), storage });
    expect(await client.load()).toBe('malformed');
    expect(client.isPro).toBe(false);
  });

  it('activate(): calls absolute GCC URL and verifies returned token', async () => {
    const token = await sign(base);
    let calledUrl = '';
    const client = createLicenseClient({
      ...opts(),
      storage: memoryStorage(),
      apiBase: 'https://gcc.example.com',
      getDeviceId: () => 'HW-1',
      fetch: (async (url: string) => {
        calledUrl = url;
        return new Response(JSON.stringify({ token }), { status: 200 });
      }) as unknown as typeof fetch,
    });
    const r = await client.activate('CATERM-ABC');
    expect(calledUrl).toBe('https://gcc.example.com/api/v1/licenses/activate');
    expect(r.ok).toBe(true);
    expect(client.isPro).toBe(true);
  });

  it('activate(): server error and missing apiBase are reported, not thrown', async () => {
    const noBase = createLicenseClient({ ...opts(), storage: memoryStorage() });
    expect((await noBase.activate('X')).status).toBe('rejected');
    const err = createLicenseClient({
      ...opts(),
      storage: memoryStorage(),
      apiBase: 'https://gcc.example.com',
      fetch: (async () => new Response(JSON.stringify({ error: 'key revoked' }), { status: 403 })) as unknown as typeof fetch,
    });
    const r = await err.activate('X');
    expect(r).toMatchObject({ ok: false, status: 'rejected', message: 'key revoked' });
  });
});
