/*
  Import Firebase users (exported by export-firebase-users.js) into Supabase `profiles` table.
  This script does NOT set passwords. It creates profile rows and marks them as needing password reset.

  Usage:
    1. Create a .env file in the repo root with these values (see .env.example):
       SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FIREBASE_SERVICE_ACCOUNT_PATH

    2. Ensure `migration/firebase-users-export.json` exists (run export-firebase-users.js first).

    3. Install dependencies in the repo root:
       npm install @supabase/supabase-js dotenv

    4. Run:
       node migration/import-firebase-to-supabase.js

  Behavior:
    - For each user in the export file the script will upsert a row into the `profiles` table using
      the Firebase UID as the primary key. Fields inserted: id, email, display_name, photo_url, profile (metadata), migrated_at
    - The script prints a summary at the end.
*/

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment. See .env.example');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const infile = path.join(__dirname, 'firebase-users-export.json');
  if (!fs.existsSync(infile)) {
    console.error('Missing migration/firebase-users-export.json. Run export-firebase-users.js first.');
    process.exit(1);
  }

  const raw = fs.readFileSync(infile, 'utf8');
  const users = JSON.parse(raw);
  console.log(`Importing ${users.length} users to Supabase profiles table...`);

  let created = 0;
  for (const u of users) {
    const profile = {
      id: u.uid,
      email: u.email || null,
      display_name: u.displayName || null,
      photo_url: u.photoURL || null,
      profile: JSON.stringify({ providerData: u.providerData || [], metadata: u.metadata || {} }),
      migrated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('profiles').upsert(profile, { onConflict: 'id' }).select('id');
      if (error) {
        console.warn('Upsert error for', u.uid, error.message || error);
      } else {
        created++;
      }
    } catch (e) {
      console.warn('Failed to insert user', u.uid, e.message || e);
    }
  }

  console.log(`Upserted ${created}/${users.length} profiles.`);
  console.log('Next step: send password reset emails via Supabase or your mailer to onboard users.');
}

main().catch(e => { console.error('Import failed', e); process.exit(2); });
