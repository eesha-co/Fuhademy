// student-page-shared.js
// Shared functionality for student pages using Supabase

import { initSupabase, getSupabase, onAuthStateChange } from '../../js/supabase-client.js';
import { getGlobalUserData } from '../../js/user-cache.js';
import { initializeUserProfile, getRecentActivities } from './supabase-user.js';
import { syncUserData } from './supabase-signup.js';

// Helper: Get user initials from full name
export function getInitials(fullName) {
  try {
    return String(fullName || '').split(' ')
      .slice(0, 2)
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase();
  } catch (e) { return ''; }
}

// Normalize a cached entry into a plain user object
export function normalizeCachedEntry(entry) {
  if (!entry) return null;
  if (entry.uid || entry.displayName || entry.email) return entry;
  if (entry.data) return entry.data;
  return null;
}

// Initialize Supabase client
export function initializeSupabase() {
  const SUPABASE_URL = window.SUPABASE_URL || 'https://kruwfhzfqieuiuhqlutt.supabase.co';
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydXdmaHpmcWlldWl1aHFsdXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTk0OTAsImV4cCI6MjA3Nzc3NTQ5MH0.XD3-PDjDtKwCVsBILYgVrHF7Yc9tHkzpvpN2b7ojvB4';
  // Only initialize config values; actual client is created lazily via `getSupabase()`.
  initSupabase(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Load tasks for the current user
export async function loadUserTasks(userId) {
  const supabase = await getSupabase();
  if (!supabase) return [];
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return tasks || [];
  } catch (e) {
    console.warn('loadTasks failed', e);
    return [];
  }
}

// Load recent activities
export async function loadUserActivities(userId, limit = 10) {
  const supabase = await getSupabase();
  if (!supabase) return [];
  try {
    const { data: activities, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return activities || [];
  } catch (e) {
    console.warn('loadActivities failed', e);
    return [];
  }
}

// Load upcoming sessions
export async function loadUpcomingSessions(userId, limit = 5) {
  const supabase = await getSupabase();
  if (!supabase) return [];
  try {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .gt('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(limit);
    if (error) throw error;
    return sessions || [];
  } catch (e) {
    console.warn('loadUpcoming failed', e);
    return [];
  }
}

// Get unread notification count
export async function getUnreadNotificationCount(userId) {
  const supabase = await getSupabase();
  if (!supabase) return 0;
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
    if (error) throw error;
    return count || 0;
  } catch (e) {
    console.warn('getUnreadNotificationCount failed', e);
    return 0;
  }
}

// Apply user data to common UI elements
export function applyUserDataToUI(user) {
  if (!user) return;

  const fullName = user.displayName || 'Student';
  const name = fullName.split(' ')[0];
  const level = (user.profile?.level || '').startsWith('SS') ? user.profile.level : 'SS 3';
  const initials = getInitials(fullName);

  // Update text content
  const elements = {
    heroName: name,
    userName: name,
    userLevel: level,
    topName: fullName,
    topLevel: level
  };

  Object.entries(elements).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });

  // Update class-based elements
  document.querySelectorAll('.user-fullname').forEach(el => { el.textContent = fullName; });
  document.querySelectorAll('.user-firstname').forEach(el => { el.textContent = name; });

  // Update avatar
  const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=2563eb&color=fff&size=128`;
  ['avatar-sm', 'topAvatar', 'main-avatar'].forEach(id => {
    const avatar = document.getElementById(id);
    if (avatar) avatar.src = avatarUrl;
  });

  // Update progress indicators if available
  if (user.progress) {
    const progress = {
      weeklyProgressLabel: `${user.progress.weekly || 0}%`,
      mockAvgLabel: `${user.progress.mockAvg || 0}%`,
      streakLabel: `${user.progress.streak || 0} days`
    };

    Object.entries(progress).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });
  }

  // Update notification count
  if (user.unreadNotifications) {
    const notifCount = document.getElementById('notifCount');
    if (notifCount) notifCount.textContent = String(user.unreadNotifications.length || 0);
  }
}

// Initialize a student page with Supabase auth and data loading
export function initializeStudentPage() {
  // Initialize config values for the lazy client
  initializeSupabase();

  // Try to load cached user data first
  try {
    const global = getGlobalUserData();
    if (global) {
      window.preloadedUserData = global;
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => applyUserDataToUI(global));
      } else {
        applyUserDataToUI(global);
      }
    } else {
      // Fallback to localStorage cache
      const raw = localStorage.getItem('cachedUserData_current');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const user = normalizeCachedEntry(parsed);
          if (user) {
            window.preloadedUserData = user;
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', () => applyUserDataToUI(user));
            } else {
              applyUserDataToUI(user);
            }
          }
        } catch (e) {
          console.warn('Could not parse legacy cachedUserData_current', e);
        }
      }
    }
  } catch (err) {
    console.debug('Preload cache check failed', err);
  }

  // Set up auth state monitoring via the safe wrapper
  onAuthStateChange(async (event, session) => {
    // If we couldn't register the listener (client unavailable), onAuthStateChange may return null.
    // The wrapper will log a warning; attempt a one-time check instead.
    if (!session || !session.user) {
      // Try to fetch current session if client is available
      const supabase = await getSupabase();
      if (supabase && supabase.auth && supabase.auth.getSession) {
        try {
          const res = await supabase.auth.getSession();
          session = res?.data?.session || null;
        } catch (e) { /* ignore */ }
      }
    }

    if (!session || !session.user) {
      // No active session — redirect to login
      window.location.href = '../general/login.html';
      return;
    }

    // Verify email confirmation
    if (!session.user.email_confirmed_at) {
      alert('Please verify your email first. Check your inbox for the verification link.');
      const supabase = await getSupabase();
      if (supabase && supabase.auth && supabase.auth.signOut) await supabase.auth.signOut();
      window.location.href = '../general/login.html';
      return;
    }

    // Sync user data and update UI
    try {
      const synced = await syncUserData(session.user);
      applyUserDataToUI(synced?.profile || null);

      // Update cached data
      window.currentUser = session.user;
      window.currentProfile = synced?.profile || null;

      // Emit event for page-specific handlers
      window.dispatchEvent(new CustomEvent('studentPageReady', {
        detail: {
          user: session.user,
          profile: synced?.profile,
          activities: synced?.activities,
          upcoming: synced?.upcoming
        }
      }));
    } catch (err) {
      console.error('Error syncing user data:', err);
      // Still try to apply what we have from the session
      applyUserDataToUI({ displayName: session.user.email?.split('@')[0] });
    }
  });
}

// Error toast helper
export function showError(msg, time = 5000) {
  const toast = document.getElementById('error-toast');
  const errorMsg = document.getElementById('error-message');
  if (toast && errorMsg) {
    errorMsg.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), time);
  } else {
    console.error(msg);
  }
}

// Task management helpers
export async function addTaskForUser(userId, { title, due }) {
  const supabase = initializeSupabase();
  if (!userId) throw new Error('Not authenticated');
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    throw new Error('Task title must be at least 3 characters');
  }

  const payload = {
    user_id: userId,
    title: title.trim(),
    due: due ? String(due) : null,
    done: false,
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('tasks')
    .insert([payload])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function markAllTasksComplete(userId) {
  const supabase = initializeSupabase();
  if (!userId) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('tasks')
    .update({
      done: true,
      completed_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('done', false);
  
  if (error) throw error;
}

export async function updateTaskDone(userId, taskId, done) {
  const supabase = initializeSupabase();
  if (!userId) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('tasks')
    .update({
      done: !!done,
      completed_at: done ? new Date().toISOString() : null
    })
    .eq('id', taskId)
    .eq('user_id', userId);
  
  if (error) throw error;
}

// Listen for user data updates
window.addEventListener('userDataUpdated', (event) => {
  const user = event.detail;
  if (user) applyUserDataToUI(user);
});