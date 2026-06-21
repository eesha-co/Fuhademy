// Supabase Edge Function (Deno) - create-profile
// Deploy using the Supabase CLI (`supabase functions deploy create-profile`) or the Supabase UI.

// This function verifies the caller by checking the Authorization bearer token
// against the Auth REST endpoint, then uses the service_role key to insert
// a profile row into the `profiles` table. The service_role key must be set
// in the function's environment as SUPABASE_SERVICE_ROLE_KEY.

import { serve } from "https://deno.land/std@0.201.0/http/server.ts";

serve(async (req: Request) => {
  try {
    // Support multiple secret names because the CLI restricts names starting with SUPABASE_
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || Deno.env.get('PROJECT_URL') || Deno.env.get('SUPABASE_PROJECT_URL');
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_KEY');
    if (!SUPABASE_URL || !SERVICE_KEY) {
      return new Response(JSON.stringify({ error: 'Service not configured' }), { status: 500 });
    }

    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return new Response(JSON.stringify({ error: 'Missing access token' }), { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body || !body.id) return new Response(JSON.stringify({ error: 'Missing user id in body' }), { status: 400 });

    // Verify token by calling the auth endpoint to get the user for this token
    const userRes = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/user`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}`, 'apikey': SERVICE_KEY }
    });

    if (!userRes.ok) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }

    const userJson = await userRes.json().catch(() => null);
    const authenticatedUserId = userJson?.id;
    if (!authenticatedUserId || authenticatedUserId !== body.id) {
      return new Response(JSON.stringify({ error: 'Token does not match provided user id' }), { status: 403 });
    }

    // Build profile payload (only allow safe fields)
    const payload = {
      id: body.id,
      username: body.username || (body.email || '').split('@')[0] || null,
      full_name: body.full_name || null,
      email: body.email || null,
      avatar_url: body.avatar_url || null,
      level: body.level || 'SS 3',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert using the service role key to bypass RLS
    const insertRes = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!insertRes.ok) {
      const txt = await insertRes.text().catch(() => '');
      return new Response(JSON.stringify({ error: 'Insert failed', status: insertRes.status, body: txt }), { status: 500 });
    }

    const created = await insertRes.json().catch(() => null);
    return new Response(JSON.stringify({ success: true, profile: created }), { status: 200 });

  } catch (err) {
    console.error('create-profile function error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
