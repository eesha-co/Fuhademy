// Supabase-backed user helper (replacement for firebase-user.js)
import { initSupabase, getSupabase, onAuthStateChange } from './supabase-client.js';
import { getCachedUserData, cacheUserData, setGlobalUserData, getGlobalUserData } from './user-cache.js';

// Initialize supabase if window globals exist
try { initSupabase(window?.SUPABASE_URL, window?.SUPABASE_ANON_KEY); } catch (e) { /* ignore */ }

const PROJECT_URL = (typeof window !== 'undefined' && window.SUPABASE_URL) || '';

// Helper to fetch routed function endpoints
async function callApiPath(path, method = 'GET', token = null, body = null) {
    const url = `${PROJECT_URL.replace(/\/$/, '')}/functions/v1/api/${path}`;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const resp = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const text = await resp.text().catch(()=>null);
    let json = null;
    try { json = text ? JSON.parse(text) : null } catch(e){ json = null }
    return { ok: resp.ok, status: resp.status, body: json, raw: text };
}

// Prefetch and cache user profile via Supabase routed API
async function prefetchUserData(uid, token=null) {
    try {
        if (!uid) return null;
        const tokenToUse = token || (await (await getSupabase())?.auth.getSession().catch(()=>null))?.data?.session?.access_token;
        const res = await callApiPath(`users/${uid}`, 'GET', tokenToUse);
        const profile = res.body?.profile || null;
        const userData = {
            uid,
            displayName: profile?.full_name || profile?.username || 'Student',
            photoURL: profile?.avatar_url || '',
            profile: profile || {}
        };
        cacheUserData(uid, userData);
        setGlobalUserData(userData);
        return userData;
    } catch (e) {
        console.warn('prefetchUserData failed', e);
        return null;
    }
}

// Lightweight helpers for pages that only need to personalize UI
function onUserChange(handler) {
    // Initialize with global data if available
    const globalData = getGlobalUserData();
    if (globalData) handler(globalData);

    // Listen for Supabase auth changes
    onAuthStateChange(async (event, session) => {
        const user = session?.user || null;
        if (!user) { handler(null); return; }

        const uid = user.id;

        // Try cache first
        const cached = getCachedUserData(uid);
        if (cached) {
            handler(cached);
            // Prefetch in background
            prefetchUserData(uid, session?.access_token).catch(()=>{});
            return;
        }

        // Fetch from routed API
        try {
            const data = await prefetchUserData(uid, session?.access_token);
            if (data) { handler(data); return; }
        } catch (e) { console.warn('onUserChange: prefetch failed', e); }

        // Fallback to minimal user object
        handler({ uid, displayName: user.email?.split('@')[0] || 'Student', photoURL: user.user_metadata?.avatar_url || '', profile: {} });
    });
}

async function getUnreadNotificationsCount(uid) {
    try {
        if (!uid) return 0;
        const tokenToUse = (await getSupabase()) ? (await getSupabase()).auth.getSession().then(s=>s?.data?.session?.access_token).catch(()=>null) : null;
        const res = await callApiPath(`notifications/${uid}`, 'GET', await tokenToUse);
        const notifs = res.body?.notifications || [];
        const unread = Array.isArray(notifs) ? notifs.filter(n=>!n.read).length : 0;
        return unread;
    } catch (e) { console.warn('getUnreadNotificationsCount failed', e); return 0; }
}

export { onUserChange, getUnreadNotificationsCount };

// Utility: get two-letter initials from a display name (uppercase). Returns empty string if no name.
function initialsFromName(name) {
    if (!name || typeof name !== 'string') return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0] + (parts[1][0] || '')).slice(0,2).toUpperCase();
}

export { initialsFromName };

