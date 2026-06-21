Security checklist for Exam-Prep100

1) Per-user access: Firestore rules ensure documents under `/students/{uid}` are only readable/writable by that `uid`.
   - Confirm `firestore.rules` is deployed. (See `firestore.rules` in repo root.)

2) API Key restrictions:
   - The `apiKey` in `js/firebase-config.js` must be restricted to your site's HTTP referrers in Google Cloud Console.

3) App Check (recommended):
   - Add `recaptchaSiteKey` to `js/firebase-config.js` and enable App Check in your project.
   - This prevents unauthorized clients from calling your backend.

4) Privileged operations:
   - Any operation that should be server-authorized (writing global notifications, assigning roles) should be implemented in Cloud Functions using the Admin SDK.
   - Do not let clients write to `admin/*` or global notification collections; rules already deny that in `firestore.rules`.

5) Data encryption and PII handling:
   - Firestore data is encrypted at rest by Google; for extra-sensitive fields consider client-side encryption.

6) Monitoring and audit:
   - Enable Firebase logging, alerts, and review Cloud Audit Logs for suspicious activity.

What I need from you to finish hardening
- reCAPTCHA v3 site key (for App Check)
- If you want notification writes via backend, a GCP service account with appropriate roles or allow me to add a Cloud Function using the project's functions folder.

If you'd like, I can now:
- Add App Check initialization to `student-dashboard-modern.html` (requires reCAPTCHA key).
- Replace the mock reads in `student-dashboard-modern.html` with live Firestore reads for tasks and upcoming sessions (already wire to `students/{uid}`).
- Create a Cloud Function example to write notifications server-side.
