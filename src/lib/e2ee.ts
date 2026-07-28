/**
 * Girau International School — End-to-End Encryption (E2EE) Library
 * WhatsApp-style E2EE using Web Crypto API (ECDH P-256 + AES-GCM)
 */

function b64encode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function b64decode(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export const BHE2EE = {
  _bytesToBase64: b64encode,
  _base64ToBytes: b64decode,

  async decryptPrivateKey(encryptedBlob: string, password: string): Promise<ArrayBuffer> {
    const bytes = b64decode(encryptedBlob);
    const salt = bytes.slice(0, 16);
    const iv = bytes.slice(16, 28);
    const ciphertext = bytes.slice(28);
    const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    const decryptionKey = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
    );
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv }, decryptionKey, ciphertext);
  },

  async importPrivateKey(privateKeyBuf: ArrayBuffer): Promise<CryptoKey> {
    return crypto.subtle.importKey('pkcs8', privateKeyBuf, { name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveKey', 'deriveBits']);
  },

  async importPrivateKeyFromBase64(privateKeyB64: string): Promise<CryptoKey> {
    const bytes = b64decode(privateKeyB64);
    return this.importPrivateKey(bytes.buffer);
  },

  async importPublicKey(publicKeyB64: string): Promise<CryptoKey> {
    const bytes = b64decode(publicKeyB64);
    return crypto.subtle.importKey('raw', bytes, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  },

  async deriveSharedKey(privateKey: CryptoKey, publicKey: CryptoKey): Promise<CryptoKey> {
    return crypto.subtle.deriveKey(
      { name: 'ECDH', public: publicKey }, privateKey,
      { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
    );
  },

  async encryptMessage(plaintext: string, sharedKey: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, sharedKey, encoded);
    return { ciphertext: b64encode(new Uint8Array(ciphertext)), iv: b64encode(iv) };
  },

  async decryptMessage(ciphertextB64: string, ivB64: string, sharedKey: CryptoKey): Promise<string> {
    const ciphertext = b64decode(ciphertextB64);
    const iv = b64decode(ivB64);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, sharedKey, ciphertext);
    return new TextDecoder().decode(decrypted);
  },

  looksLikeCiphertext(text: string): boolean {
    if (!text || text.length < 16) return false;
    if (/\s/.test(text)) return false;
    return /^[A-Za-z0-9+/=]+$/.test(text);
  }
};
