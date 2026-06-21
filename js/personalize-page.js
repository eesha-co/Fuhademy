// Personalization helper: automatically apply cached user data and listen for updates
// Import this module early in any student page to enable personalization
// Usage: import './js/personalize-page.js'

import { getGlobalUserData } from './user-cache.js';
import { onAuthStateChange, getSupabase } from './supabase-client.js';

// Helper: returns initials safely
function getInitials(fullName) {
  try {
    return String(fullName || '').split(' ').slice(0, 2).map(n => n.charAt(0)).join('').toUpperCase();
  } catch (e) { return '' }
}

// Normalize a cached entry into a plain user object
function normalizeCachedEntry(entry) {
  if (!entry) return null;
  if (entry.uid || entry.displayName || entry.email) return entry;
  if (entry.data) return entry.data;
  return null;
}

// Apply user data to the page (update all known personalization IDs)
export function applyUserData(user) {
  if (!user) return;
  const fullName = user.displayName || user.full_name || 'Student';
  const name = fullName.split(' ')[0];
  const level = (user.profile?.level || user.level || '').startsWith('SS') ? (user.profile?.level || user.level) : 'SS 3';
  const initials = getInitials(fullName);

  // Update all possible sidebar/topbar IDs
  const idMap = {
    'userName': name,
    'userLevel': level,
    'topName': fullName,
    'topLevel': level,
    'heroName': name,
    'studentName': fullName,
    'studentLevel': level,
    'displayName': fullName,
  };
  
  Object.entries(idMap).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  // Update elements by class
  document.querySelectorAll('.user-fullname').forEach(el => { el.textContent = fullName; });
  document.querySelectorAll('.user-firstname').forEach(el => { el.textContent = name; });
  document.querySelectorAll('.user-displayname').forEach(el => { el.textContent = fullName; });

  // Update avatars
  const avatarUrl = user.photoURL || user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=2563eb&color=fff&size=128`;
  ['avatar-sm', 'topAvatar', 'main-avatar', 'avatar', 'user-avatar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.src = avatarUrl;
  });

  // Update progress if available
  if (user.progress) {
    const weekly = document.getElementById('weeklyProgressLabel');
    if (weekly) weekly.textContent = `${user.progress.weekly || 0}%`;
    const mockAvg = document.getElementById('mockAvgLabel');
    if (mockAvg) mockAvg.textContent = `${user.progress.mockAvg || 0}%`;
    const streak = document.getElementById('streakLabel');
    if (streak) streak.textContent = `${user.progress.streak || 0} days`;
  }

  // Update notification count
  if (user.unreadNotifications) {
    const notifCount = document.getElementById('notifCount');
    if (notifCount) notifCount.textContent = String(Array.isArray(user.unreadNotifications) ? user.unreadNotifications.length : user.unreadNotifications);
  }

  // Replace static occurrences of "Student" or "Student Name" in plain text nodes
  try {
    replaceStaticStudentText(fullName, name);
  } catch (err) {
    console.debug('replaceStaticStudentText failed', err);
  }
}

// Walk the DOM and replace standalone text nodes that equal "Student" or "Student Name"
function replaceStaticStudentText(fullName, firstName) {
  if (!document.body) return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  const replacements = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node || !node.nodeValue) continue;
    const text = node.nodeValue.trim();
    // Skip short, common text that isn't a match
    if (!text) continue;
    // exact matches only to avoid accidental replacements inside words (e.g., "students")
    if (/^Student Name$/i.test(text)) {
      replacements.push({ node, value: node.nodeValue.replace(/Student Name/i, fullName) });
      continue;
    }
    if (/^Student$/i.test(text)) {
      // Prefer first name for brief spots like avatars or headers
      replacements.push({ node, value: node.nodeValue.replace(/Student/i, firstName) });
      continue;
    }
  }
  // Apply replacements (separately to avoid modifying walker state)
  for (const r of replacements) r.node.nodeValue = r.value;
}

// Initialize personalization: preload from cache, listen for updates, and subscribe to auth changes
export function initializePersonalization() {
  // Step 1: Try to apply cached data immediately
  try {
    const global = getGlobalUserData();
    if (global) {
      window.preloadedUserData = global;
      applyUserData(global);
    }
  } catch (err) {
    console.debug('Preload cache check failed', err);
  }

  // Step 2: Listen for updates from other parts of the app (e.g., after login)
  window.addEventListener('userDataUpdated', (event) => {
    const user = event?.detail || window.preloadedUserData;
    if (user) applyUserData(user);
  });

  // Step 3: Subscribe to auth state changes
  (async () => {
    try {
      const sub = await onAuthStateChange(async (event, session) => {
        if (!session || !session.user) return; // Not logged in
        
        // User is logged in; try to get profile from Supabase
        try {
          const client = await getSupabase();
          if (!client) return;
          
          const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profile) {
            const userData = {
              id: session.user.id,
              email: session.user.email,
              displayName: profile.username || profile.full_name || 'Student',
              level: profile.level || 'SS 3',
              photoURL: profile.avatar_url,
              profile: profile,
              progress: {
                weekly: profile.weekly_progress || 0,
                mockAvg: profile.mock_avg || 0,
                streak: profile.streak || 0
              }
            };
            
            // Cache and apply
            // apply to runtime cache only (avoid persisting to localStorage in production)
            window.preloadedUserData = userData;
            applyUserData(userData);
            
            // Dispatch so other open pages can update
            window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData }));
          }
        } catch (err) {
          console.debug('Failed to fetch profile from auth state change', err);
        }
      });
      
      if (!sub) console.debug('onAuthStateChange not registered (client unavailable)');
    } catch (err) {
      console.debug('onAuthStateChange registration failed', err);
    }
  })();

  // Step 4: If a global (non-module) Supabase client exists on window, try to fetch profile
  (async () => {
    try {
      if (window.preloadedUserData) return; // already have data
      const client = window.__supabaseClient || (window.supabase && window.supabase.createClient && window.supabase);
      console.debug('personalize-page: global client exists?', !!client, 'window.__supabaseClient?', !!window.__supabaseClient, 'window.supabase?', !!window.supabase);
      if (!client) return;

      // Try to get current user
      let user = null;
      if (client.auth && client.auth.getUser) {
        try {
          const res = await client.auth.getUser();
          user = res?.data?.user || res?.user || null;
        } catch (e) { /* ignore */ }
      }
      if (!user && client.auth && client.auth.user) {
        try { user = client.auth.user(); } catch (e) { /* ignore */ }
      }
      if (!user) return;

      // Fetch the profile row
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
        applyUserData(userData);
        window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData }));
      } catch (e) { console.debug('personalize-page: fetch profile via global client failed', e); }
    } catch (e) {
      console.debug('personalize-page: global client check failed', e);
    }
  })();
}

// Auto-initialize when the module is imported (if DOM is ready)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePersonalization);
} else {
  initializePersonalization();
}
