Firebase integration notes

What I changed
- Wired `students/student-dashboard-modern.html` to use the project's `js/firebase-config.js` and initialize Firebase auth + Firestore.
- Added `students/dashboard-styles.css` and linked it from the modern dashboard.
- Confirmed an existing `firestore.rules` file is present at repo root that enforces per-user reads/writes for `/students/{userId}` and related collections.

How per-user data is enforced (summary)
1. Authentication (Firebase Auth) issues a stable `uid` for each user.
2. Client code uses `onAuthStateChanged` to get the `uid` and reads/writes only `doc(db, 'students', uid)` and subcollections `students/{uid}/...`.
3. Firestore security rules require `request.auth.uid == userId` to allow read/write to those documents, preventing cross-user access.

Deploying Firestore rules
- Install Firebase CLI and login:

  npm install -g firebase-tools
  firebase login

- From the repository root run:

  firebase deploy --only firestore:rules

(Or use the Firebase Console: Firestore → Rules and paste the contents of `firestore.rules`)

App Check (recommended)
- The project has placeholders for `recaptchaSiteKey` in `js/firebase-config.js`.
- To enable App Check:
  1) Obtain a reCAPTCHA v3 site key from Google Cloud Console restricted to your domains.
  2) Add it to `js/firebase-config.js` as `recaptchaSiteKey`.
  3) Initialize App Check in pages that initialize Firebase (example present in `students/student-dashboard.html`).

What I need from you to finish server-hardening (optional but recommended)
- reCAPTCHA site key if you want me to enable App Check.
- Any server/admin service accounts you want to use for Cloud Functions that will write notifications or perform privileged tasks.

Next steps I can implement for you
- Replace mocks in `student-dashboard-modern.html` with real reads for tasks, upcoming sessions, progress.
- Add App Check initialization to the new dashboard (requires reCAPTCHA site key).
- Add a Cloud Function example to add notifications securely.

If you'd like me to proceed with one of the next steps, tell me which and provide any keys (reCAPTCHA site key) if needed.
