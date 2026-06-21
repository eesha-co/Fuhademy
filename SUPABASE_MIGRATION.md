# Migrating authentication from Firebase to Supabase

This document outlines a recommended strategy to migrate your app's auth from Firebase Auth to Supabase Auth with minimal user friction.

Overview
--------
We recommend a staged migration:

1. Create a Supabase project.
2. Export your Firebase users (emails and metadata) — we provide a script at `migration/export-firebase-users.js`.
3. Create corresponding `profiles` rows in Supabase for each migrated user (no password yet).
4. Send password-reset emails via Supabase or a mail provider to let users set new passwords.
5. Update the client to use Supabase Auth (signUp / signIn) and switch DB access to Supabase.

Why staged migration?
- Firebase password hashes are not easily portable to Supabase; forcing users to reset passwords is the safest approach.
- Staged migration minimizes risk and gives you a rollback path.

Files added in this repo
------------------------
- `js/supabase-client.js` — client helper (init, signUp/signIn/signOut) using `@supabase/supabase-js` via ESM CDN.
- `migration/export-firebase-users.js` — Node script that exports Firebase Auth users to `migration/firebase-users-export.json` (requires Firebase service account JSON at `migration/serviceAccountKey.json`).
- `.env.example` — updated with Supabase variables.

High-level steps
-----------------
1) Create a Supabase project
   - Go to https://app.supabase.com and create a new project.
   - Note the `SUPABASE_URL` (project URL) and the `anon` key (public) and `service_role` key (server-only).

2) Export Firebase users
   - Place your Firebase service account JSON at `migration/serviceAccountKey.json` (do NOT commit this file).
   - Install dependencies and run the export script:

```cmd
cd c:\Users\Hp\Downloads\Exam-Prep100
npm init -y
npm install firebase-admin
node migration/export-firebase-users.js
```

   - The script creates `migration/firebase-users-export.json` with user emails and metadata.

3) Create Supabase tables
   - Using Supabase SQL Editor, create these tables (example):

```sql
create table profiles (
  id text primary key, -- use firebase uid or supabase id
  email text unique,
  display_name text,
  photo_url text,
  profile jsonb,
  created_at timestamptz default now()
);

create table tasks (
- `migration/import-firebase-to-supabase.js` — Node script that reads `migration/firebase-users-export.json` and upserts rows into the `profiles` table using the Supabase service role key.

Import helper script
--------------------
  id uuid primary key default gen_random_uuid(),
  user_id text references profiles(id) on delete cascade,
  title text,
  due text,
  done boolean default false,
  created_at timestamptz default now(),
  completed_at timestamptz
);
```

4) Import profiles (simple approach)
   - Read `migration/firebase-users-export.json` and insert rows into `profiles` (you can use Supabase SQL or `@supabase/supabase-js` server-side with the service role key).
   - Do NOT set passwords for users.

5) Run the import script
   - To run the import script, follow these steps:

```cmd
cd c:\Users\Hp\Downloads\Exam-Prep100
npm install @supabase/supabase-js dotenv
node migration/import-firebase-to-supabase.js
```

   - This creates `profiles` for every exported Firebase user. After that you should send password-reset emails so users can set new passwords.

5) Email users to reset password
   - For each user email, trigger a Supabase password reset or send a custom email with a link to your new login page.
   - This allows users to choose new passwords and activates their Supabase accounts.

6) Update client pages to use Supabase Auth
   - Use the `js/supabase-client.js` helper.
   - Example sign-in flow in a page:

```html
<script>
  window.SUPABASE_URL = 'https://your-project.supabase.co';
  window.SUPABASE_ANON_KEY = 'public-anon-key';
</script>
<script type="module">
  import { initSupabase, signIn } from '/js/supabase-client.js';
  const supabase = initSupabase(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const res = await signIn(supabase, email, pass);
    if (res.error) console.error(res.error.message);
    else console.log('Signed in', res.data.user);
  });
</script>
```

7) Replace Firestore calls with Supabase queries
   - Use `@supabase/supabase-js` to query `profiles`, `tasks`, etc., or create server endpoints that your client calls.
   - Consider Row-Level Security (RLS) policies in Supabase to enforce row ownership.

Notes about passwords and user experience
-----------------------------------------
- Because Firebase password hashes are not portable, the safest path is to import profiles and ask users to reset passwords.
- You can soften the transition by using an email template explaining why the reset is needed.

Server-side alternative (optional)
----------------------------------
- If you prefer to keep Firebase Auth for existing users temporarily, you can implement a server adapter that verifies Firebase ID tokens and proxies DB reads/writes to Supabase. This is useful for a gradual migration.

Questions & next steps I can perform for you
-------------------------------------------
- Create a server-side import script (Node) that reads `firebase-users-export.json` and inserts rows into Supabase using the service role key.
- Scaffold example updated login/signup pages that use Supabase Auth.
- Replace auth in a single page (e.g. `general/login.html`) as a test and show how to migrate the rest.

Tell me which of those you want me to do next and I'll implement it.
