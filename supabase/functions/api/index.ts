// Supabase Edge Function: routed API handling multiple endpoints (create-profile, users)
// Security features: simple IP-based rate limiting, auth verification, input validation
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const PROJECT_URL = Deno.env.get('PROJECT_URL') || Deno.env.get('SUPABASE_URL')

if (!SERVICE_ROLE_KEY || !PROJECT_URL) {
  console.warn('Warning: SERVICE_ROLE_KEY or PROJECT_URL not set in environment');
}

// Simple in-memory rate limiter (per-instance). Works as a lightweight protection.
const rateMap = new Map<string, {windowStart: number; count: number}>()
const RATE_WINDOW_SECONDS = 60
const RATE_MAX_REQUESTS = 30

function getClientIp(req: Request) {
  const fwd = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
  if (fwd) return fwd.split(',')[0].trim()
  try {
    const u = new URL(req.url)
    return u.hostname || 'unknown'
  } catch {
    return 'unknown'
  }
}

function checkRateLimit(ip: string) {
  const now = Math.floor(Date.now() / 1000)
  const entry = rateMap.get(ip)
  if (!entry || now - entry.windowStart >= RATE_WINDOW_SECONDS) {
    rateMap.set(ip, { windowStart: now, count: 1 })
    return true
  }
  if (entry.count >= RATE_MAX_REQUESTS) return false
  entry.count += 1
  return true
}

async function verifyUserWithAuthServer(token: string) {
  const url = `${PROJECT_URL}/auth/v1/user`
  const res = await fetch(url, { headers: { Authorization: token } })
  if (!res.ok) return null
  return res.json()
}

export default async (req: Request) => {
  const url = new URL(req.url)
  const path = url.pathname.replace(/^\/+/g, '') // remove leading /
  const ip = getClientIp(req)

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429, headers: { 'content-type': 'application/json' } })
  }

  // Route: POST /create-profile
  if ((path === 'create-profile' || path === 'api/create-profile' || path.endsWith('/create-profile')) && req.method === 'POST') {
    const auth = req.headers.get('authorization')
    if (!auth) return new Response(JSON.stringify({ error: 'missing_authorization' }), { status: 401, headers: { 'content-type': 'application/json' } })

    const user = await verifyUserWithAuthServer(auth)
    if (!user || !user.id) return new Response(JSON.stringify({ error: 'invalid_token' }), { status: 401, headers: { 'content-type': 'application/json' } })

    let body: any = {}
    try { body = await req.json() } catch { body = {} }

    // Minimal validation: require at least full_name or email
    const full_name = body.full_name || user.user_metadata?.full_name || user.user_metadata?.name || ''
    const email = body.email || user.email
    if (!full_name && !email) {
      return new Response(JSON.stringify({ error: 'missing_profile_fields' }), { status: 400, headers: { 'content-type': 'application/json' } })
    }

    // Use service_role key to insert into profiles table
    if (!SERVICE_ROLE_KEY || !PROJECT_URL) {
      return new Response(JSON.stringify({ error: 'server_misconfigured' }), { status: 500, headers: { 'content-type': 'application/json' } })
    }

    const svc = createClient(PROJECT_URL, SERVICE_ROLE_KEY, { global: { fetch } })

    try {
      const insertPayload = {
        id: user.id,
        full_name: full_name || null,
        email: email || null,
        updated_at: new Date().toISOString()
      }
      const { data, error } = await svc.from('profiles').upsert(insertPayload, { onConflict: 'id' }).select().single()
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'content-type': 'application/json' } })
      }
      return new Response(JSON.stringify({ profile: data }), { status: 201, headers: { 'content-type': 'application/json' } })
    } catch (err: any) {
      return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'content-type': 'application/json' } })
    }
  }

  // Route: GET /users/:id -> fetch profile (read-only)
  if ((path.startsWith('users/') || path.startsWith('api/users/')) && req.method === 'GET') {
    const parts = path.split('/')
    const id = parts[parts.length - 1]
    if (!id) return new Response(JSON.stringify({ error: 'missing_id' }), { status: 400, headers: { 'content-type': 'application/json' } })
    if (!SERVICE_ROLE_KEY || !PROJECT_URL) {
      return new Response(JSON.stringify({ error: 'server_misconfigured' }), { status: 500, headers: { 'content-type': 'application/json' } })
    }
    const svc = createClient(PROJECT_URL, SERVICE_ROLE_KEY, { global: { fetch } })
    const { data, error } = await svc.from('profiles').select('*').eq('id', id).single()
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'content-type': 'application/json' } })
    return new Response(JSON.stringify({ profile: data }), { status: 200, headers: { 'content-type': 'application/json' } })
  }

  // Route: GET /activities/:userId -> fetch recent activities for a user
  if ((path.startsWith('activities/') || path.startsWith('api/activities/')) && req.method === 'GET') {
    const parts = path.split('/')
    const userId = parts[parts.length - 1]
    if (!userId) return new Response(JSON.stringify({ error: 'missing_user_id' }), { status: 400, headers: { 'content-type': 'application/json' } })
    if (!SERVICE_ROLE_KEY || !PROJECT_URL) return new Response(JSON.stringify({ error: 'server_misconfigured' }), { status: 500, headers: { 'content-type': 'application/json' } })
    const svc = createClient(PROJECT_URL, SERVICE_ROLE_KEY, { global: { fetch } })
    const { data, error } = await svc.from('activities').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'content-type': 'application/json' } })
    return new Response(JSON.stringify({ activities: data }), { status: 200, headers: { 'content-type': 'application/json' } })
  }

  // Route: POST /activities -> create an activity for authenticated user
  if ((path === 'activities' || path.endsWith('/activities')) && req.method === 'POST') {
    const auth = req.headers.get('authorization')
    if (!auth) return new Response(JSON.stringify({ error: 'missing_authorization' }), { status: 401, headers: { 'content-type': 'application/json' } })
    const user = await verifyUserWithAuthServer(auth)
    if (!user || !user.id) return new Response(JSON.stringify({ error: 'invalid_token' }), { status: 401, headers: { 'content-type': 'application/json' } })
    let body: any = {}
    try { body = await req.json() } catch { body = {} }
    if (!body || !body.type || !body.description) return new Response(JSON.stringify({ error: 'missing_activity_fields' }), { status: 400, headers: { 'content-type': 'application/json' } })
    if (!SERVICE_ROLE_KEY || !PROJECT_URL) return new Response(JSON.stringify({ error: 'server_misconfigured' }), { status: 500, headers: { 'content-type': 'application/json' } })
    const svc = createClient(PROJECT_URL, SERVICE_ROLE_KEY, { global: { fetch } })
    try {
      const payload = {
        user_id: user.id,
        type: body.type,
        description: body.description,
        created_at: new Date().toISOString()
      }
      const { data, error } = await svc.from('activities').insert([payload]).select().single()
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'content-type': 'application/json' } })
      return new Response(JSON.stringify({ activity: data }), { status: 201, headers: { 'content-type': 'application/json' } })
    } catch (err: any) {
      return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'content-type': 'application/json' } })
    }
  }

  // Route: GET /notifications/:userId -> fetch unread notifications count/items
  if ((path.startsWith('notifications/') || path.startsWith('api/notifications/')) && req.method === 'GET') {
    const parts = path.split('/')
    const userId = parts[parts.length - 1]
    if (!userId) return new Response(JSON.stringify({ error: 'missing_user_id' }), { status: 400, headers: { 'content-type': 'application/json' } })
    if (!SERVICE_ROLE_KEY || !PROJECT_URL) return new Response(JSON.stringify({ error: 'server_misconfigured' }), { status: 500, headers: { 'content-type': 'application/json' } })
    const svc = createClient(PROJECT_URL, SERVICE_ROLE_KEY, { global: { fetch } })
    const { data, error } = await svc.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(100)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'content-type': 'application/json' } })
    return new Response(JSON.stringify({ notifications: data }), { status: 200, headers: { 'content-type': 'application/json' } })
  }

  // Route: POST /update-profile -> update profile for authenticated user
  if ((path === 'update-profile' || path.endsWith('/update-profile')) && req.method === 'POST') {
    const auth = req.headers.get('authorization')
    if (!auth) return new Response(JSON.stringify({ error: 'missing_authorization' }), { status: 401, headers: { 'content-type': 'application/json' } })

    const user = await verifyUserWithAuthServer(auth)
    if (!user || !user.id) return new Response(JSON.stringify({ error: 'invalid_token' }), { status: 401, headers: { 'content-type': 'application/json' } })

    let body: any = {}
    try { body = await req.json() } catch { body = {} }

    // Allow only specific updatable fields
    const allowed = ['username', 'full_name', 'avatar_url', 'level', 'email']
    const updatePayload: Record<string, any> = {}
    for (const k of allowed) if (typeof body[k] !== 'undefined') updatePayload[k] = body[k]
    if (!Object.keys(updatePayload).length) return new Response(JSON.stringify({ error: 'no_fields_to_update' }), { status: 400, headers: { 'content-type': 'application/json' } })

    if (!SERVICE_ROLE_KEY || !PROJECT_URL) {
      return new Response(JSON.stringify({ error: 'server_misconfigured' }), { status: 500, headers: { 'content-type': 'application/json' } })
    }

    const svc = createClient(PROJECT_URL, SERVICE_ROLE_KEY, { global: { fetch } })
    try {
      updatePayload.updated_at = new Date().toISOString()
      const { data, error } = await svc.from('profiles').update(updatePayload).eq('id', user.id).select().single()
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'content-type': 'application/json' } })
      }
      return new Response(JSON.stringify({ profile: data }), { status: 200, headers: { 'content-type': 'application/json' } })
    } catch (err: any) {
      return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'content-type': 'application/json' } })
    }
  }

  return new Response(JSON.stringify({ message: 'ok', routes: ['/create-profile (POST)', '/users/:id (GET)'] }), { status: 200, headers: { 'content-type': 'application/json' } })
}
