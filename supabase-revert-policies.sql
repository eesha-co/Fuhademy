-- Revert the profile RLS policies you created
-- Run this in Supabase SQL editor or psql with appropriate privileges.

DROP POLICY IF EXISTS "Allow insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow select own profile" ON public.profiles;

-- Optional: Verify current policies
-- SELECT policyname, * FROM pg_policies WHERE tablename = 'profiles';
