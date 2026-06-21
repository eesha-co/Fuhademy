Security steps for Firebase in this repo

1) Restrict the API key in Google Cloud Console
- Go to: https://console.cloud.google.com/apis/credentials
- Find the API key used by this project and set Application restrictions -> HTTP referrers (web sites)
- Add your production domains (e.g., https://yourdomain.com) and local dev hostnames if needed
- Save changes

2) Enable Firebase App Check (recommended)
- In the Firebase Console, go to App Check.
- Register a provider (reCAPTCHA v3 for web) and obtain your site key.
- Add the site key to `js/firebase-config.js` as `recaptchaSiteKey`.
- Optionally, set enforcement to 'test mode' first, then 'enforce' after testing.

3) Harden Firestore / Storage rules
- Firestore: ensure only authenticated users can access user-specific documents (see `firestore.rules`)
- Storage: only allow read/write when the user is authenticated and authorized (see `storage.rules`)
- Deploy rules with `firebase deploy --only firestore:rules,storage` or via Console

4) Remove any admin/service account credentials from client code
- Admin SDK credentials must reside on server or cloud functions only (see `functions/`)
- Do not commit service account JSON files to the repository. Use environment variables or Secret Manager instead.

5) Move privileged operations to server/cloud functions (optional but recommended)
- Create HTTPS endpoints in `functions/` or your server that perform admin actions.
- These endpoints run with admin privileges and use environment secrets.

6) Monitoring and alerts
- Enable Firebase Alerts and monitor usage in Google Cloud to detect anomalies.

If you want, I can:
- Fill `js/firebase-config.js` with the actual values you provide and add App Check initialization to other pages.
- Implement a Cloud Function endpoint for signup and migrate client to call it.
- Create deployable firewall/API key restriction instructions for your domain.

"Do not commit service account JSON or raw admin keys to this repository."
