/*
  Node script to export Firebase Authentication users to JSON.
  Usage:
    1. Place your Firebase service account JSON at `migration/serviceAccountKey.json` (do NOT commit it).
    2. From repo root run:
       node migration/export-firebase-users.js
    3. The script will create `migration/firebase-users-export.json` with exported user records

  Note: Password hashes cannot be migrated directly to Supabase. Use this export to:
    - Get the list of emails to send password reset emails,
    - Build a migration plan, or
    - Create placeholder Supabase profiles and prompt users to set passwords.
*/

const fs = require('fs');
const path = require('path');

async function main() {
  const adminPath = path.join(__dirname, 'serviceAccountKey.json');
  if (!fs.existsSync(adminPath)) {
    console.error('Missing Firebase service account at migration/serviceAccountKey.json');
    console.error('Place your service account JSON there (do NOT check it into git) and run again.');
    process.exit(1);
  }

  const admin = require('firebase-admin');
  admin.initializeApp({
    credential: admin.credential.cert(require(adminPath))
  });

  const out = [];
  let nextPageToken;
  try {
    do {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      result.users.forEach(userRecord => {
        out.push({
          uid: userRecord.uid,
          email: userRecord.email || null,
          displayName: userRecord.displayName || null,
          photoURL: userRecord.photoURL || null,
          phoneNumber: userRecord.phoneNumber || null,
          disabled: userRecord.disabled || false,
          providerData: userRecord.providerData || [],
          metadata: userRecord.metadata || {}
        });
      });
      nextPageToken = result.pageToken;
    } while (nextPageToken);

    const outfile = path.join(__dirname, 'firebase-users-export.json');
    fs.writeFileSync(outfile, JSON.stringify(out, null, 2), 'utf8');
    console.log('Export complete:', outfile);
    console.log('Next steps: use the export to create profiles in Supabase and email users to reset passwords.');
  } catch (err) {
    console.error('Error exporting users', err);
    process.exit(2);
  }
}

main();
