// Supabase bootstrap (non-module)
// Ensures a Supabase client is available on window.__supabaseClient (UMD fallback)
// and dispatches a `userDataUpdated` event with the user's profile when available.
(async function(){
  try {
    if (window.__supabaseClient) return;

    const resolvedUrl = window.SUPABASE_URL;
    const resolvedKey = window.SUPABASE_ANON_KEY;
    console.debug('supabase-bootstrap: resolvedUrl present?', !!resolvedUrl, 'resolvedKey present?', !!resolvedKey);
    if (!resolvedUrl || !resolvedKey) {
      console.debug('supabase-bootstrap: SUPABASE_URL/ANON_KEY not set');
      return;
    }

    async function createClientFromUMD() {
      if (window.supabase && window.supabase.createClient) {
        try {
          const c = window.supabase.createClient(resolvedUrl, resolvedKey, { auth: { persistSession: true } });
          window.__supabaseClient = c;
          try { window.supabase = c; } catch (e) {}
          return c;
        } catch(e){ console.warn('supabase-bootstrap: window.supabase.createClient failed', e); }
      }

      // Inject UMD script
      const UMD_SRC = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/dist/umd/supabase.js';
      if (!document.querySelector('script[data-supabase-umd]')) {
        const s = document.createElement('script');
        s.src = UMD_SRC;
        s.setAttribute('data-supabase-umd','1');
        document.head.appendChild(s);
        await new Promise((res, rej) => { s.onload = res; s.onerror = () => rej(new Error('UMD load failed')); });
      } else {
        // wait until window.supabase available
        await new Promise((res, rej) => {
          const start = Date.now();
          (function waitFor(){
            if (window.supabase && window.supabase.createClient) return res();
            if (Date.now() - start > 8000) return rej(new Error('Timed out waiting for supabase UMD'));
            setTimeout(waitFor, 100);
          })();
        });
      }

      if (window.supabase && window.supabase.createClient) {
        const c = window.supabase.createClient(resolvedUrl, resolvedKey, { auth: { persistSession: true } });
        window.__supabaseClient = c;
        try { window.supabase = c; } catch(e) {}
        return c;
      }
      throw new Error('supabase-bootstrap: failed to create client');
    }

    const client = await createClientFromUMD();

    // Helper to fetch profile and dispatch update
    async function fetchAndDispatchProfile(user) {
      if (!user) return;
      try {
        const { data: profile } = await client.from('profiles').select('*').eq('id', user.id).maybeSingle();
        const userData = {
          id: user.id,
          email: user.email,
          displayName: profile?.username || profile?.full_name || (user.email||'').split('@')[0] || 'Student',
          level: profile?.level || 'SS 3',
          photoURL: profile?.avatar_url || null,
          profile: profile || null,
        };
        window.preloadedUserData = userData;
        // Dispatch the update and schedule a short retry to catch late listeners
        const ev = new CustomEvent('userDataUpdated', { detail: userData });
        try { window.dispatchEvent(ev); } catch (e) {}
        setTimeout(() => { try { window.dispatchEvent(ev); } catch (e) {} }, 500);
      } catch (e) { console.debug('supabase-bootstrap: failed to fetch profile', e); }
    }

    // Try to get current user via multiple auth APIs (v2/v1) and fallbacks
    try {
      let user = null;
      // v2: auth.getUser()
      if (client.auth && client.auth.getUser) {
        try {
          const res = await client.auth.getUser();
          user = res?.data?.user || res?.user || null;
        } catch(e) { /* ignore individual failure */ }
      }

      // v2: auth.getSession()
      if (!user && client.auth && client.auth.getSession) {
        try {
          const sres = await client.auth.getSession();
          user = sres?.data?.session?.user || sres?.user || user;
        } catch(e) { /* ignore */ }
      }

      // v1: auth.user()
      if (!user && client.auth && client.auth.user) {
        try { user = client.auth.user(); } catch(e) { /* ignore */ }
      }

      // If we already have preloaded data (set by another bootstrap or server-side render), dispatch it
      if (!user && window.preloadedUserData) {
        try {
          const ev = new CustomEvent('userDataUpdated', { detail: window.preloadedUserData });
          window.dispatchEvent(ev);
          // Retry shortly in case pages attach listeners later
          setTimeout(() => { try { window.dispatchEvent(ev); } catch(e) {} }, 500);
        } catch(e) { /* ignore */ }
      }

      if (user) {
        await fetchAndDispatchProfile(user);
      }

      // Subscribe to auth state changes and react
      if (client.auth && client.auth.onAuthStateChange) {
        try {
          client.auth.onAuthStateChange(async (event, session) => {
            const u = session?.user || session?.data?.user || null;
            if (u) await fetchAndDispatchProfile(u);
            else {
              // If signed out, dispatch null to let pages clear UI
              try { window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: null })); } catch(e) {}
            }
          });
        } catch(e) { console.debug('supabase-bootstrap: onAuthStateChange registration failed', e); }
      }
    } catch(e) { console.debug('supabase-bootstrap: auth check failed', e); }

  } catch (err) {
    console.debug('supabase-bootstrap error', err);
  }
})();
