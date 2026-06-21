// Supabase User Management Module
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm';

export function initSupabase(url, key) {
  if (!url || !key) throw new Error('Supabase URL and anon key required');
  return createClient(url, key);
}

export async function initializeUserProfile(supabase, userData) {
  if (!userData?.id) throw new Error('User ID required');
  
  try {
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.id)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // Only insert if profile doesn't exist
    if (!existingProfile) {
      const payload = {
        id: userData.id,
        username: userData.user_metadata?.username || userData.email?.split('@')[0] || 'Student',
        full_name: userData.user_metadata?.full_name,
        email: userData.email,
        avatar_url: userData.user_metadata?.avatar_url,
        level: 'SS 3', // Default level
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Try client insert first
      const { data, error: insertError } = await supabase
        .from('profiles')
        .insert([payload])
        .select()
        .single();

      if (!insertError) return data;

      // If insert is blocked by RLS (e.g. error code 42501 or 403), fall back to server function
      if (insertError && (insertError.code === '42501' || insertError.status === 403)) {
        try {
          const SUPABASE_URL = (typeof window !== 'undefined' && window.SUPABASE_URL) ? window.SUPABASE_URL.replace(/\/$/, '') : null;
          let token = null;
          try { token = (await supabase.auth.getSession()).data.session?.access_token } catch (e) { token = null }
          if (!token && typeof window !== 'undefined' && window.__SUPABASE_ACCESS_TOKEN) token = window.__SUPABASE_ACCESS_TOKEN;

          if (SUPABASE_URL && token) {
            const resp = await fetch(`${SUPABASE_URL}/functions/v1/api/create-profile`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify(payload)
            });
            if (resp && resp.ok) {
              const j = await resp.json().catch(() => null);
              if (j?.profile) return j.profile;
            }
          }
        } catch (fnErr) {
          console.warn('initializeUserProfile: server function call failed', fnErr);
        }
      }

      // If we get here, rethrow original insert error
      throw insertError;
    }

    return existingProfile;
  } catch (err) {
    console.error('Failed to initialize user profile:', err);
    throw err;
  }
}

export async function updateUserProfile(supabase, userId, updates) {
  if (!userId || !updates) throw new Error('User ID and updates required');

  // Try client-side update first
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (!error) return data;

    // If update blocked by RLS, fall back to server function
    if (error && (error.code === '42501' || error.status === 403)) {
      try {
        const SUPABASE_URL = (typeof window !== 'undefined' && window.SUPABASE_URL) ? window.SUPABASE_URL.replace(/\/$/, '') : null;
        let token = null;
        try { token = (await supabase.auth.getSession()).data.session?.access_token } catch (e) { token = null }

        if (SUPABASE_URL && token) {
          const resp = await fetch(`${SUPABASE_URL}/functions/v1/api/update-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(updates)
          });
          if (resp && (resp.ok || resp.status === 201)) {
            const j = await resp.json().catch(() => null);
            if (j?.profile) return j.profile;
          }
        }
      } catch (fnErr) {
        console.warn('updateUserProfile: server function call failed', fnErr);
      }
    }

    throw error;
  } catch (err) {
    // propagate
    throw err;
  }
}

export async function getRecentActivities(supabase, userId, limit = 10) {
  if (!userId) throw new Error('User ID required');

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function recordActivity(supabase, userId, activity) {
  if (!userId || !activity) throw new Error('User ID and activity details required');

  const { data, error } = await supabase
    .from('activities')
    .insert([{
      user_id: userId,
      type: activity.type,
      description: activity.description,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}