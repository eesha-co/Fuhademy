import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kruwfhzfqieuiuhqlutt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydXdmaHpmcWlldWl1aHFsdXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTk0OTAsImV4cCI6MjA3Nzc3NTQ5MH0.XD3-PDjDtKwCVsBILYgVrHF7Yc9tHkzpvpN2b7ojvB4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

export const SUPABASE_CONFIG = { URL: SUPABASE_URL, ANON_KEY: SUPABASE_ANON_KEY };

// Girau brand colors
export const GIRAU_COLORS = {
  primary: '#800020',    // Maroon
  primaryLight: '#a63d56',
  primaryDark: '#5c0017',
  navy: '#2c5282',
  white: '#ffffff',
  grayLight: '#f8f9fa',
  gray: '#e3e7ea',
};

// Session management (cookie-based, no localStorage)
export function setSession(user: any) {
  const payload = btoa(JSON.stringify({ user, ts: Date.now() }));
  document.cookie = `girau-session=${payload};path=/;max-age=86400;SameSite=Lax`;
}

export function getSession(): any | null {
  const m = document.cookie.match(/girau-session=([^;]+)/);
  if (!m) return null;
  try {
    return JSON.parse(atob(m[1]));
  } catch {
    return null;
  }
}

export function clearSession() {
  document.cookie = 'girau-session=;path=/;max-age=0';
}

export function requireAuth(): any | null {
  const session = getSession();
  if (!session || !session.user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/girau/login';
    }
    return null;
  }
  return session;
}

export function requireRole(role: string): any | null {
  const session = requireAuth();
  if (!session) return null;
  if (session.user.role !== role) {
    if (typeof window !== 'undefined') {
      window.location.href = '/girau/login';
    }
    return null;
  }
  return session;
}

// Edge function helper
export async function edge(name: string, options: any = {}) {
  const url = `${SUPABASE_URL}/functions/v1/${name}`;
  const headers: any = {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const res = await fetch(url, {
    method: options.method || 'POST',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  try {
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: res.ok, status: res.status, data: null };
  }
}
