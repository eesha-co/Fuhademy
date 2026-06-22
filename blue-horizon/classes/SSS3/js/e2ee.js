/**
 * Blue Horizon E-Learning — End-to-End Encryption (E2EE) Library
 * WhatsApp-style E2EE using Web Crypto API (ECDH P-256 + AES-GCM)
 * The server NEVER sees the unencrypted private key.
 */

// base64 helpers (binary-safe)
function _b64encode(bytes) {
  var binary = '';
  for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
function _b64decode(b64) {
  var binary = atob(b64);
  var bytes = new Uint8Array(binary.length);
  for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

window.BHE2EE = {
  // Decrypt the user's private key using their password
  // encryptedBlob = base64(salt[16] + iv[12] + ciphertext)
  decryptPrivateKey: async function(encryptedBlob, password) {
    var bytes = _b64decode(encryptedBlob);
    var salt = bytes.slice(0, 16);
    var iv = bytes.slice(16, 28);
    var ciphertext = bytes.slice(28);
    var keyMaterial = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]
    );
    var decryptionKey = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial, { name: "AES-GCM", length: 256 }, false, ["decrypt"]
    );
    var privateKeyBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv }, decryptionKey, ciphertext
    );
    return privateKeyBuf; // ArrayBuffer (PKCS8)
  },

  // Import raw private key bytes into a CryptoKey
  importPrivateKey: async function(privateKeyBuf) {
    return crypto.subtle.importKey(
      "pkcs8", privateKeyBuf, { name: "ECDH", namedCurve: "P-256" }, false, ["deriveKey", "deriveBits"]
    );
  },

  // Import private key from base64 string
  importPrivateKeyFromBase64: async function(privateKeyB64) {
    var bytes = _b64decode(privateKeyB64);
    return this.importPrivateKey(bytes.buffer);
  },

  // Import a recipient's public key (base64) into a CryptoKey
  importPublicKey: async function(publicKeyB64) {
    var bytes = _b64decode(publicKeyB64);
    return crypto.subtle.importKey(
      "raw", bytes, { name: "ECDH", namedCurve: "P-256" }, false, []
    );
  },

  // Derive a shared AES-GCM key from own private key + recipient's public key
  deriveSharedKey: async function(privateKey, publicKey) {
    return crypto.subtle.deriveKey(
      { name: "ECDH", public: publicKey }, privateKey,
      { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
  },

  // Encrypt a message → returns {ciphertext (base64), iv (base64)}
  encryptMessage: async function(plaintext, sharedKey) {
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var encoded = new TextEncoder().encode(plaintext);
    var ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv }, sharedKey, encoded
    );
    return {
      ciphertext: _b64encode(new Uint8Array(ciphertext)),
      iv: _b64encode(iv)
    };
  },

  // Decrypt a message
  decryptMessage: async function(ciphertextB64, ivB64, sharedKey) {
    var ciphertext = _b64decode(ciphertextB64);
    var iv = _b64decode(ivB64);
    var decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv }, sharedKey, ciphertext
    );
    return new TextDecoder().decode(decrypted);
  },

  // Check if a string looks like ciphertext (for fallback detection)
  looksLikeCiphertext: function(text) {
    if (!text || text.length < 16) return false;
    if (/\s/.test(text)) return false;
    return /^[A-Za-z0-9+/=]+$/.test(text);
  }
};
