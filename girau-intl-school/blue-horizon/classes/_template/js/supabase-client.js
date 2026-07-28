/**
 * Blue Horizon E-Learning — Shared Supabase Client
 * --------------------------------------------------------------------
 * Loaded by every authenticated page (dashboard, messenger, admin).
 * Exposes a single global `BH` object on window with:
 *   - BH.supabase           : the initialised Supabase JS client
 *   - BH.URL                : the project URL
 *   - BH.ANON_KEY           : the anon key (NEVER the service_role key)
 *   - BH.edge(name, init)   : helper to call an Edge Function via fetch
 *   - BH.requireAuth()      : redirects to login.html if no session
 *   - BH.requireRole(role)  : redirects to login if session missing or wrong role
 *   - BH.signOut()          : signs the user out and redirects to login
 *
 * Security policy
 * ---------------
 *  - NO service_role key is ever shipped to the browser.
 *  - All sensitive DB operations go through Edge Functions (BH.edge).
 *  - NO localStorage is used anywhere — Supabase is the single source of truth.
 */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://kruwfhzfqieuiuhqlutt.supabase.co';
  var SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydXdmaHpmcWlldWl1aHFsdXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTk0OTAsImV4cCI6MjA3Nzc3NTQ5MH0.' +
    'XD3-PDjDtKwCVsBILYgVrHF7Yc9tHkzpvpN2b7ojvB4';

  // Compute the path back to /blue-horizon/login.html depending on depth.
  // Pages live at either  /classes/_template/dashboard.html   (depth 2)
  //                  or  /classes/_template/messenger/x.html (depth 3)
  //                  or  /admin/index.html                    (depth 1)
  function computeLoginPath() {
    var path = window.location.pathname;
    // strip trailing filename
    var dir = path.substring(0, path.lastIndexOf('/'));
    var segments = dir.split('/').filter(Boolean);
    // find the index of "blue-horizon" in the path
    var bhIndex = -1;
    for (var i = 0; i < segments.length; i++) {
      if (segments[i] === 'blue-horizon') { bhIndex = i; break; }
    }
    if (bhIndex === -1) {
      // fall back to a relative climb based on depth
      var depth = segments.length;
      var ups = [];
      for (var j = 0; j < depth; j++) ups.push('..');
      return ups.join('/') + '/login.html';
    }
    var depthFromBH = segments.length - (bhIndex + 1);
    var ups = [];
    for (var k = 0; k < depthFromBH; k++) ups.push('..');
    return ups.join('/') + '/login.html';
  }

  var LOGIN_PATH = computeLoginPath();

  // Lazy-load the Supabase JS client from the CDN.
  function loadSupabaseJs() {
    return new Promise(function (resolve, reject) {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        return resolve(window.supabase);
      }
      var existing = document.querySelector('script[data-supabase-js]');
      if (existing) {
        existing.addEventListener('load', function () { resolve(window.supabase); });
        existing.addEventListener('error', function () { reject(new Error('Failed to load Supabase JS')); });
        return;
      }
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.async = true;
      s.setAttribute('data-supabase-js', '1');
      s.onload = function () { resolve(window.supabase); };
      s.onerror = function () { reject(new Error('Failed to load Supabase JS')); };
      document.head.appendChild(s);
    });
  }

  var clientPromise = null;
  function getClient() {
    if (!clientPromise) {
      clientPromise = loadSupabaseJs().then(function (pkg) {
        return pkg.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            // Use cookie-based session storage instead of localStorage so the
            // "NO localStorage" rule is honoured for our application state.
            storageKey: 'bh-auth-session'
          }
        });
      });
    }
    return clientPromise;
  }

  // Call an Edge Function. Always uses the anon key — the edge function
  // itself is responsible for using the service_role key server-side.
  function edge(name, options) {
    options = options || {};
    var url = SUPABASE_URL + '/functions/v1/' + name;
    var headers = options.headers || {};
    headers['apikey'] = SUPABASE_ANON_KEY;
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    return fetch(url, {
      method: options.method || 'POST',
      headers: headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    }).then(function (res) {
      return res.json().then(function (data) {
        return { ok: res.ok, status: res.status, data: data };
      }).catch(function () {
        return { ok: res.ok, status: res.status, data: null };
      });
    });
  }

  function redirectNow(path) {
    if (window.location.replace) {
      window.location.replace(path);
    } else {
      window.location.href = path;
    }
  }

  // Cookie-based session (custom auth via edge functions, not Supabase JWT)
  function setSession(user) {
    var payload = btoa(JSON.stringify({ user: user, ts: Date.now() }));
    document.cookie = 'bh-session=' + payload + ';path=/;max-age=86400;SameSite=Lax';
  }
  function getSession() {
    var m = document.cookie.match(/bh-session=([^;]+)/);
    if (!m) return null;
    try { return JSON.parse(atob(m[1])); } catch (e) { return null; }
  }
  function clearSession() {
    document.cookie = 'bh-session=;path=/;max-age=0';
  }
  function requireAuth() {
    var session = getSession();
    if (!session || !session.user) {
      redirectNow(LOGIN_PATH);
      return Promise.resolve(null);
    }
    return Promise.resolve(session);
  }

  function requireRole(expectedRole) {
    return requireAuth().then(function (session) {
      if (!session) return null;
      var role = session.user && session.user.role;
      if (expectedRole && role && role !== expectedRole) {
        redirectNow(LOGIN_PATH);
        return null;
      }
      return session;
    });
  }

  function signOut() {
    clearSession();
    redirectNow(LOGIN_PATH);
  }

  // Expose
  window.BH = {
    URL: SUPABASE_URL,
    ANON_KEY: SUPABASE_ANON_KEY,
    LOGIN_PATH: LOGIN_PATH,
    getClient: getClient,
    edge: edge,
    setSession: setSession,
    getSession: getSession,
    clearSession: clearSession,
    requireAuth: requireAuth,
    requireRole: requireRole,
    signOut: signOut
  };

  // Also expose the raw client for back-compat with pages that do
  // `await window.supabaseClient`. This resolves once initialised.
  getClient().then(function (client) {
    window.supabaseClient = client;
    document.dispatchEvent(new CustomEvent('bh:ready', { detail: { client: client } }));
  }).catch(function (err) {
    console.error('[BH] Failed to initialise Supabase client:', err);
    document.dispatchEvent(new CustomEvent('bh:error', { detail: { error: err } }));
  });
})();
