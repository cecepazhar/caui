/**
 * CAUI License Management - Offline-First
 */

export interface LocalLicense {
  key: string;
  product: string;
  tier: string;
  expires_at: number; // unix timestamp, 0 = lifetime
}

const STORAGE_KEY = 'caui_license';

export function saveLicense(lic: LocalLicense): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lic));
}

export function loadLicense(): LocalLicense | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LocalLicense;
  } catch {
    return null;
  }
}

export function removeLicense(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportKey(): string {
  const lic = loadLicense();
  return lic?.key ?? '';
}

export function isPro(): boolean {
  const lic = loadLicense();
  if (!lic) return false;
  if (lic.tier === '99') return true; // lifetime
  const now = Math.floor(Date.now() / 1000);
  return now <= lic.expires_at;
}

export function getExpiresAt(): number | null {
  return loadLicense()?.expires_at ?? null;
}

export function formatExpiry(expires_at: number): string {
  if (expires_at === 0) return 'Lifetime';
  const date = new Date(expires_at * 1000);
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Activate license via GCC API
 */
export async function activateLicense(key: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/v1/licenses/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        license_key: key,
        product_code: 'UI',
        device_id: navigator.userAgent,
        device_name: 'browser',
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.error || `HTTP ${res.status}` };
    }

    const data = await res.json();
    saveLicense({
      key: key.trim().toUpperCase(),
      product: data.product_code || 'UI',
      tier: data.tier || '12',
      expires_at: data.expires_at || 0,
    });
    return { success: true, message: 'Lisensi aktif!' };
  } catch (e: any) {
    return { success: false, message: e.message || 'Koneksi gagal' };
  }
}
