import type { SignatureVerifier } from './types';

/** Ed25519 verification via WebCrypto (Chromium 113+/WebView2, Safari 17+, Firefox 129+, Node 20+). */
export const webCryptoVerifier: SignatureVerifier = async (message, signature, publicKey) => {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('WebCrypto unavailable — inject a custom verifier (e.g. Tauri command)');
  const key = await subtle.importKey('raw', publicKey as BufferSource, { name: 'Ed25519' }, false, ['verify']);
  return subtle.verify({ name: 'Ed25519' }, key, signature as BufferSource, message as BufferSource);
};
