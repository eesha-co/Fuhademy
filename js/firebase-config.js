// Firebase configuration - central place for client SDK config.
// NOTE: These values are not secrets for the client SDK but should be
// restricted in the Google Cloud Console (API key HTTP referrer restrictions)
export const firebaseConfig = {
  apiKey: "AIzaSyCKEAsHk-Uh31U3O6Abq2E7HZQLJooa7S8",
  authDomain: "exam-prep100-v2.firebaseapp.com",
  projectId: "exam-prep100-v2",
  storageBucket: "exam-prep100-v2.firebasestorage.app",
  messagingSenderId: "197475339483",
  appId: "1:197475339483:web:1e2b6b804a08689a4f10fe",
  measurementId: "G-PYCY0C5XL3",
  // IMPORTANT: Replace this with your own reCAPTCHA v3 site key from the Google Cloud Console
  // This key is essential for enabling Firebase App Check to protect your backend from abuse.
  // For security, this key should be restricted to your website's domains in the Google Cloud Console.
  recaptchaSiteKey: "6LcpRagrAAAAAGO6Kh1E_QsWP7z38jjr1EJqeg6W"
};

// Initialize (modular) Firebase here in a safe, idempotent way and export `auth`.
// This centralizes initialization so pages can import `auth` directly from this module
// without duplicating initialization logic or mixing compat/modular SDKs.
import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const appInstance = app;
export const auth = getAuth(app);

