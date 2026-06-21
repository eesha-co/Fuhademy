# create-profile Supabase Edge Function

This function creates a `profiles` row for a user using the Supabase service_role key.

Overview
- The function verifies the incoming user's access token (passed as `Authorization: Bearer <token>`) by calling `/auth/v1/user` on your Supabase project.
- If the token is valid and matches the `id` in the request body, the function inserts a profile row using the service role key and returns the created profile.

Files
- `index.ts` - the function implementation (Deno / Supabase Edge Function)

Deployment steps (CLI)
1. Make sure you're logged in with `supabase login` (you already are).
2. Link your local project directory to a Supabase project (optional but helpful):
   ```powershell
   supabase link --project-ref <PROJECT_REF>
   ```
   Replace `<PROJECT_REF>` with the `ref` shown by `supabase projects list` (e.g. `kruwfhzfqieuiuhqlutt`).

3. Set the service role secret (required):
   The Supabase CLI does not allow secret names that start with `SUPABASE_`, so we use `SERVICE_ROLE_KEY` and `PROJECT_URL` instead. The function reads both `SERVICE_ROLE_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) and `PROJECT_URL` (or `SUPABASE_URL`).

   ```powershell
   supabase secrets set SERVICE_ROLE_KEY="<SERVICE_ROLE_KEY>" --project-ref <PROJECT_REF>
   supabase secrets set PROJECT_URL="https://<PROJECT_REF>.supabase.co" --project-ref <PROJECT_REF>
   ```
   Note: Do NOT commit or share the `SERVICE_ROLE_KEY`.

4. Deploy the function:
   ```powershell
   supabase functions deploy create-profile --project-ref <PROJECT_REF>
   ```

5. (Optional) Test the function locally or via the deployed endpoint. The Supabase Functions URL is:
   `https://<PROJECT_REF>.functions.supabase.co/create-profile`

Notes
- The function needs the `SUPABASE_SERVICE_ROLE_KEY` in its environment. `supabase secrets set` stores it securely.
- If you revert the policies (DROP POLICY), the function is still safe to use; it uses the service role key to insert rows even when RLS is enforced.

Security
- The service_role key must be kept secret. Using an Edge Function keeps it server-side and never exposed to browser clients.
