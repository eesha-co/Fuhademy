// Lightweight Supabase client helper (ES module)
// Usage:
// 1. Add these two lines before importing this module in your pages:
//    <script>window.SUPABASE_URL = 'https://xyz.supabase.co'; window.SUPABASE_ANON_KEY = 'public-anon-key';</script>
// 2. Then import and init:
//    import { initSupabase, signUp, signIn, signOut, getUser } from '/js/supabase-client.js';
//    const supabase = initSupabase(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
//    await signIn(supabase, email, pass);
import { config } from './config.js';

// Lazy-loaded Supabase client to avoid importing the whole SDK at module-evaluation time.
let _client = null;
let _resolvedUrl = null;
let _resolvedKey = null;

export function initSupabase(url, anonKey) {
  // Store resolved values for later use by the lazy loader
  _resolvedUrl = url || (typeof window !== 'undefined' && window.SUPABASE_URL) || (config && config.supabase && config.supabase.url);
  _resolvedKey = anonKey || (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY) || (config && config.supabase && config.supabase.anonKey);

  if (typeof window !== 'undefined') {
    try {
      console.debug('initSupabase resolving:', { fromArgs: { url: !!url, anonKey: !!anonKey }, fromWindow: { SUPABASE_URL: !!window.SUPABASE_URL, SUPABASE_ANON_KEY: !!window.SUPABASE_ANON_KEY }, fromConfig: { hasConfig: !!config && !!config.supabase } });
    } catch (e) { /* ignore */ }
  }

  if (!_resolvedUrl || !_resolvedKey) {
    if (typeof window !== 'undefined') console.warn('initSupabase: Missing SUPABASE_URL or SUPABASE_ANON_KEY. Supabase client will be created lazily when available.');
    return null;
  }

  // Do not import the SDK at top-level; creation happens lazily in getSupabase().
  return null;
}

export async function getSupabase() {
  if (_client) return _client;
  // If a non-module bootstrap has already created a client on the window, prefer it.
  if (typeof window !== 'undefined' && window.__supabaseClient) {
    _client = window.__supabaseClient;
    return _client;
  }
  // Re-resolve from window/config if initSupabase wasn't called with args
  const resolvedUrl = _resolvedUrl || (typeof window !== 'undefined' && window.SUPABASE_URL) || (config && config.supabase && config.supabase.url);
  const resolvedKey = _resolvedKey || (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY) || (config && config.supabase && config.supabase.anonKey);

  if (!resolvedUrl || !resolvedKey) {
    if (typeof window !== 'undefined') console.warn('getSupabase: Missing SUPABASE_URL or SUPABASE_ANON_KEY. Cannot create client.');
    return null;
  }

  // Dynamic import avoids executing wrapper.mjs at module-eval time and prevents
  // some early initialization errors, but the CDN +esm bundle can still fail
  // in certain dev environments. Try dynamic import first, then gracefully
  // fall back to a UMD bundle loaded onto window.supabase.
  try {
    const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
    const createClient = mod.createClient || (mod.default && mod.default.createClient) || null;
      if (createClient) {
        _client = createClient(resolvedUrl, resolvedKey, { auth: { persistSession: true } });
        if (typeof window !== 'undefined') {
          window.__supabaseClient = _client;
          // Also set `window.supabase` so older pages that expect a global still work
          try { window.supabase = _client; } catch (e) { /* ignore */ }
        }
        return _client;
      }
  } catch (impErr) {
    console.warn('Dynamic import of supabase-js failed:', impErr && impErr.message ? impErr.message : impErr);
    if (typeof window !== 'undefined' && window.__SUPABASE_DEBUG && window.__SUPABASE_DEBUG.content) {
      try { window.__SUPABASE_DEBUG.content.textContent += '\nDynamic import failed: ' + (impErr && impErr.message); } catch(e){}
    }
  }

  // Fallback: use UMD build on window.supabase (inject script if necessary)
  if (typeof window !== 'undefined') {
    if (window.supabase && window.supabase.createClient) {
      try {
        _client = window.supabase.createClient(resolvedUrl, resolvedKey, { auth: { persistSession: true } });
        window.__supabaseClient = _client;
        try { window.supabase = _client; } catch (e) {}
        return _client;
      } catch (e) { console.warn('window.supabase.createClient failed', e); }
    }

    // Inject UMD script and wait for it to load
    const UMD_SRC = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/dist/umd/supabase.js';
    try {
      await new Promise((resolve, reject) => {
        // If script already exists, wait for window.supabase
        if (window.supabase && window.supabase.createClient) return resolve();
        const existing = document.querySelector('script[data-supabase-umd]');
        if (existing) {
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', () => reject(new Error('Supabase UMD script failed to load')));
          return;
        }
        const s = document.createElement('script');
        s.src = UMD_SRC;
        s.setAttribute('data-supabase-umd', '1');
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Supabase UMD script failed to load'));
        document.head.appendChild(s);
      });
      if (window.supabase && window.supabase.createClient) {
        _client = window.supabase.createClient(resolvedUrl, resolvedKey, { auth: { persistSession: true } });
        window.__supabaseClient = _client;
        try { window.supabase = _client; } catch (e) {}
        return _client;
      }
    } catch (umdErr) {
      console.error('Failed to load Supabase UMD fallback:', umdErr);
      if (typeof window !== 'undefined' && window.__SUPABASE_DEBUG && window.__SUPABASE_DEBUG.content) {
        try { window.__SUPABASE_DEBUG.content.textContent += '\nUMD fallback failed: ' + (umdErr && umdErr.message); } catch(e){}
      }
    }
  }

  console.error('getSupabase: unable to create supabase client');
  return null;
}

export async function signUp(supabase, email, password) {
  if (!supabase) supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase client not initialised');
  return await supabase.auth.signUp({ email, password });
}

export async function signIn(supabase, email, password) {
  if (!supabase) supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase client not initialised');
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut(supabase) {
  if (!supabase) supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase client not initialised');
  return await supabase.auth.signOut();
}

export async function getUser(supabase) {
  if (!supabase) supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase client not initialised');
  return supabase.auth.getUser ? await supabase.auth.getUser() : { error: new Error('getUser not available in this SDK version') };
}

export async function resetPassword(supabase, email) {
  if (!supabase) supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase client not initialised');
  return supabase.auth.resetPasswordForEmail ? await supabase.auth.resetPasswordForEmail(email) : { error: new Error('resetPasswordForEmail not available in this SDK version') };
}

// Helper to register auth state change listeners safely
export async function onAuthStateChange(callback) {
  const supabase = await getSupabase();
  if (!supabase) {
    console.warn('onAuthStateChange: Supabase client not available');
    return null;
  }
  if (!supabase.auth || !supabase.auth.onAuthStateChange) {
    console.warn('onAuthStateChange: auth.onAuthStateChange not available on this SDK version');
    return null;
  }
  return supabase.auth.onAuthStateChange(callback);
}
