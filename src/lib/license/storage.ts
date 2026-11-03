import type { LicenseStorage } from './types';

export function localStorageAdapter(key = 'caui_license_token'): LicenseStorage {
  const ls = () => (typeof localStorage !== 'undefined' ? localStorage : null);
  return {
    get: () => ls()?.getItem(key) ?? null,
    set: (token) => ls()?.setItem(key, token),
    remove: () => ls()?.removeItem(key),
  };
}

export function memoryStorage(initial: string | null = null): LicenseStorage {
  let value = initial;
  return {
    get: () => value,
    set: (t) => {
      value = t;
    },
    remove: () => {
      value = null;
    },
  };
}
