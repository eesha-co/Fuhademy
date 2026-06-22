/**
 * Blue Horizon E-Learning — End-to-End Encryption (E2EE) Library
 * --------------------------------------------------------------------
 * WhatsApp-style E2EE for the messenger:
 *
 *   - Each user has an ECDH P-256 key pair (generated on registration).
 *   - Public key:  stored in the database (visible to contacts).
 *   - Private key: encrypted with the user's password
 *                  (PBKDF2 → AES-GCM), stored in the DB.
 *   - On login the edge function returns `encrypted_private_key` +
 *     the user's password is available in the login form. The
 *     frontend decrypts the private key using the password and
 *     stores it (base64 of PKCS8) in the session cookie.
 *   - To send a message: ECDH shared secret (own private + recipient
 *     public) → AES-GCM encrypt → send {ciphertext, iv} to the edge fn.
 *   - To receive: same ECDH shared secret → AES-GCM decrypt.
 *
 * The server NEVER sees the unencrypted private key — true E2EE.
 *
 * Loaded by:
 *   - blue-horizon/login.html             (decrypts private key on login)
 *   - blue-horizon/classes/*/messenger/*  (encrypt / decrypt messages)
 *
 * Exposes a single global `BHE2EE` object on window.
 */
(function () {
  'use strict';

  // -----------------------------------------------------------------
  // base64 helpers (binary-safe)
  // -----------------------------------------------------------------
  function bytesToBase64(bytes) {
    var arr = (bytes instanceof ArrayBuffer) ? new Uint8Array(bytes) : bytes;
    var bin = '';
    for (var i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
    return btoa(bin);
  }
  function base64ToBytes(b64) {
    var bin = atob(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  // -----------------------------------------------------------------
  // Decrypt the user's private key using their password.
  //
  // encryptedBlob = base64( salt[16] + iv[12] + ciphertext )
  // Returns an ArrayBuffer containing the PKCS8 private key.
  // -----------------------------------------------------------------
  async function decryptPrivateKey(encryptedBlob, password) {
    var bytes = base64ToBytes(encryptedBlob);
    var salt = bytes.slice(0, 16);
    var iv = bytes.slice(16, 28);
    var ciphertext = bytes.slice(28);

    var keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    var decryptionKey = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    var privateKeyBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      decryptionKey,
      ciphertext
    );
    return privateKeyBuf; // ArrayBuffer (PKCS8)
  }

  // -----------------------------------------------------------------
  // Import the raw private key bytes (PKCS8 ArrayBuffer) into a
  // CryptoKey usable for ECDH key derivation.
  // -----------------------------------------------------------------
  async function importPrivateKey(privateKeyBuf) {
    return crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuf,
      { name: 'ECDH', namedCurve: 'P-256' },
      false,
      ['deriveKey', 'deriveBits']
    );
  }

  // -----------------------------------------------------------------
  // Convenience: take a base64-encoded PKCS8 private key (the form
  // stored in the session cookie) and return a usable CryptoKey.
  // -----------------------------------------------------------------
  async function importPrivateKeyFromBase64(privateKeyB64) {
    var buf = base64ToBytes(privateKeyB64).buffer;
    return importPrivateKey(buf);
  }

  // -----------------------------------------------------------------
  // Import a recipient's public key (base64 SPKI/raw) into a
  // CryptoKey usable for ECDH.
  // -----------------------------------------------------------------
  async function importPublicKey(publicKeyB64) {
    var bytes = base64ToBytes(publicKeyB64);
    return crypto.subtle.importKey(
      'raw',
      bytes,
      { name: 'ECDH', namedCurve: 'P-256' },
      false,
      []
    );
  }

  // -----------------------------------------------------------------
  // Derive a shared AES-GCM key from own private key + recipient's
  // public key (ECDH). Same shared key is derived by both parties.
  // -----------------------------------------------------------------
  async function deriveSharedKey(privateKey, publicKey) {
    return crypto.subtle.deriveKey(
      { name: 'ECDH', public: publicKey },
      privateKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // -----------------------------------------------------------------
  // Encrypt a plaintext string. Returns { ciphertext, iv } as base64.
  // -----------------------------------------------------------------
  async function encryptMessage(plaintext, sharedKey) {
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var encoded = new TextEncoder().encode(plaintext);
    var ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      sharedKey,
      encoded
    );
    return {
      ciphertext: bytesToBase64(ciphertext),
      iv: bytesToBase64(iv)
    };
  }

  // -----------------------------------------------------------------
  // Decrypt a message given base64 ciphertext + iv.
  // -----------------------------------------------------------------
  async function decryptMessage(ciphertextB64, ivB64, sharedKey) {
    var ciphertext = base64ToBytes(ciphertextB64);
    var iv = base64ToBytes(ivB64);
    var decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      sharedKey,
      ciphertext
    );
    return new TextDecoder().decode(decrypted);
  }

  // -----------------------------------------------------------------
  // Detect (heuristically) whether a stored message looks like an
  // E2EE ciphertext (base64, no spaces, length ≥ 16) vs. legacy
  // plaintext. Used to fall back gracefully for users registered
  // before E2EE was added.
  // -----------------------------------------------------------------
  function looksLikeCiphertext(text) {
    if (!text || typeof text !== 'string') return false;
    if (text.length < 16) return false;
    if (/\s/.test(text)) return false;
    // base64 alphabet only
    return /^[A-Za-z0-9+/=]+$/.test(text);
  }

  // Expose
  window.BHE2EE = {
    decryptPrivateKey: decryptPrivateKey,
    importPrivateKey: importPrivateKey,
    importPrivateKeyFromBase64: importPrivateKeyFromBase64,
    importPublicKey: importPublicKey,
    deriveSharedKey: deriveSharedKey,
    encryptMessage: encryptMessage,
    decryptMessage: decryptMessage,
    looksLikeCiphertext: looksLikeCiphertext,
    _bytesToBase64: bytesToBase64,
    _base64ToBytes: base64ToBytes
  };
})();
