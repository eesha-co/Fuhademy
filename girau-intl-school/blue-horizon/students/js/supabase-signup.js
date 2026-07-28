// Supabase signup handler
import { initSupabase } from './supabase-client.js';
import { initializeUserProfile } from './supabase-user.js';

const supabase = initSupabase(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

export async function handleSignup(formData) {
  try {
    // First create the auth user
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username,
          full_name: formData.fullName
        }
      }
    });

    if (signupError) throw signupError;

    // Initialize the user profile in our profiles table (always create if missing)
    if (authData.user) {
      try {
        await initializeUserProfile(supabase, authData.user);
      } catch (err) {
        // If profile creation fails, log and continue (don't block signup)
        console.error('Profile creation failed during signup:', err);
      }
    }

    // Create initial activity record
    await supabase
      .from('activities')
      .insert([{
        user_id: authData.user.id,
        type: 'signup',
        description: 'Created account',
        created_at: new Date().toISOString()
      }]);

    return {
      success: true,
      user: authData.user
    };

  } catch (err) {
    console.error('Signup failed:', err);
    return {
      success: false,
      error: err.message
    };
  }
}

// Function to sync user data with session
// Accept either a `session` object (as passed from onAuthStateChange) or a `user` object.
export async function syncUserData(sessionOrUser) {
  try {
    // Normalize to user and capture access token if available
    let user = null;
    let accessToken = null;
    if (sessionOrUser?.user) {
      user = sessionOrUser.user;
      accessToken = sessionOrUser.access_token || (sessionOrUser?.data?.session?.access_token) || null;
    } else {
      user = sessionOrUser;
    }
    if (!user?.id) throw new Error('No user to sync');

    // Use maybeSingle() so we don't throw when the profile row doesn't exist yet
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    // If PostgREST returns an error indicating zero rows for single coercion,
    // maybeSingle avoids that; still treat other errors as fatal.
    if (profileError) throw profileError;

    // If profile is not found, attempt to initialize it so callers always receive a profile object
    let resolvedProfile = profile;
    if (!resolvedProfile) {
      try {
        resolvedProfile = await initializeUserProfile(supabase, user);
        console.debug('syncUserData: created missing profile for user', user.id);
      } catch (createErr) {
        console.warn('syncUserData: failed to create missing profile', createErr);
        // If the failure is due to Row Level Security (client cannot insert),
        // try to call a server-side Edge Function that uses the service role key.
        if (createErr && createErr.code === '42501') {
          try {
            if (!accessToken) {
              // Try to obtain session token from the client-side auth state if possible
              const sess = await supabase.auth.getSession().catch(()=>null);
              accessToken = sess?.data?.session?.access_token || sess?.access_token || accessToken;
            }
            if (accessToken && window?.SUPABASE_URL) {
              const fnUrl = `${window.SUPABASE_URL.replace(/\/$/, '')}/functions/v1/create-profile`;
              const resp = await fetch(fnUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ id: user.id, email: user.email, username: (user.email||'').split('@')[0], full_name: user.user_metadata?.full_name })
              }).catch(()=>null);
              if (resp && resp.ok) {
                const j = await resp.json().catch(()=>null);
                if (j?.profile) {
                  resolvedProfile = Array.isArray(j.profile) ? j.profile[0] : j.profile;
                }
              } else {
                console.debug('syncUserData: edge function create-profile did not succeed', resp && resp.status);
              }
            }
          } catch (fnErr) {
            console.warn('syncUserData: edge function call failed', fnErr);
          }

          // If edge function didn't create a server row, fall back to a local-only profile
          if (!resolvedProfile) {
            resolvedProfile = {
              id: user.id,
              username: (user.email || '').split('@')[0] || 'student',
              full_name: user.user_metadata?.full_name || null,
              email: user.email,
              avatar_url: null,
              level: 'SS 3',
              _localOnly: true
            };
            console.debug('syncUserData: using local-only fallback profile for UI');
          }
        }
        // otherwise keep resolvedProfile as null so caller can handle missing profile
      }
    }

    // Get user activities
    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get notifications
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

    return {
      profile: resolvedProfile,
      activities: activities || [],
      unreadNotifications: count || 0
    };

  } catch (err) {
    console.error('Failed to sync user data:', err);
    throw err;
  }
}