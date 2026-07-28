import { config } from '../../js/config.js';
import { initSupabase, getSupabase, onAuthStateChange } from '../../js/supabase-client.js';
import { initializeUserProfile, updateUserProfile, getRecentActivities, recordActivity } from './supabase-user.js';
import { handleSignup, syncUserData } from './supabase-signup.js';
import { getGlobalUserData } from '../../js/user-cache.js';

// Record config values for lazy loader and attempt to create client later
initSupabase(config.supabase.url, config.supabase.anonKey);
let supabase = null;
// Try to obtain a client if available synchronously (window.__supabaseClient)
if (typeof window !== 'undefined' && window.__supabaseClient) supabase = window.__supabaseClient;

// Load cached profile data if available
try {
  const cachedProfile = JSON.parse(localStorage.getItem('userProfile'));
  if (cachedProfile) {
    // Apply cached data for instant UI update
    setText('userName', cachedProfile.displayName);
    setText('topName', cachedProfile.displayName);
    setText('heroName', cachedProfile.displayName);
    if (cachedProfile.photoURL) {
      setImage('avatar-sm', cachedProfile.photoURL);
      setImage('topAvatar', cachedProfile.photoURL);
    }
    if (cachedProfile.progress) {
      setText('weeklyProgressLabel', `${cachedProfile.progress.weekly || 0}%`);
      setText('mockAvgLabel', `${cachedProfile.progress.mockAvg || 0}%`);
      setText('streakLabel', `${cachedProfile.progress.streak || 0} days`);
    }
  }
} catch (err) {
  console.warn('Failed to load cached profile:', err);
}

// Small helpers
function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
function setImage(id, url) { const el = document.getElementById(id); if (el) el.src = url; }
function showError(msg, time = 5000) {
  const toast = document.getElementById('error-toast'); const errorMsg = document.getElementById('error-message');
  if (toast && errorMsg) { errorMsg.textContent = msg; toast.classList.remove('hidden'); setTimeout(()=>toast.classList.add('hidden'), time); }
  else console.error(msg);
}

// Utility: return initials from a full name (e.g., "John Doe" -> "JD")
function getInitials(fullName) {
  if (!fullName || typeof fullName !== 'string') return '';
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  const take = parts.slice(0, 2).map(p => p[0].toUpperCase());
  return take.join('');
}

// Render helpers
function renderTasksList(tasks) {
  const el = document.getElementById('todayTasks'); el.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between p-3 border rounded-lg';
    li.innerHTML = `<div class="flex items-center gap-3"><input type="checkbox" data-id="${t.id}" ${t.done? 'checked':''} class="h-4 w-4"><div><div class="font-medium">${t.title}</div><div class="text-xs text-slate-400">${t.due}</div></div></div><div><button data-id="${t.id}" class="text-slate-500 hover:text-sky-600">Start</button></div>`;
    el.appendChild(li);
  });
  setText('taskCount', `${tasks.length} tasks`);
}

function renderActivity(items) {
  const el = document.getElementById('activityFeed'); el.innerHTML='';
  if (!items.length) { el.textContent = 'No recent activity'; return; }
  items.forEach(i => {
    const d = document.createElement('div'); d.className='flex items-start gap-3'; d.innerHTML = `<div class="w-2 h-2 rounded-full bg-sky-500 mt-2"></div><div><div class="text-sm">${i.text}</div><div class="text-xs text-slate-400">${i.time || ''}</div></div>`; el.appendChild(d);
  });
}

function renderUpcoming(items) {
  const el = document.getElementById('upcoming'); el.innerHTML='';
  if (!items.length) { el.textContent = 'No upcoming sessions'; return; }
  items.forEach(u => {
    const row = document.createElement('div'); row.className='flex items-center justify-between';
    row.innerHTML = `<div><div class="font-medium">${u.title}</div><div class="text-xs text-slate-400">${u.time || ''}</div></div><div><a href="${u.link || '#'}" class="text-sky-600 text-sm">Join</a></div>`;
    el.appendChild(row);
  });
}

// Track current signed-in user id for writes
let currentUid = null;

// Helper to ensure we have a Supabase client
async function ensureSupabase() {
  if (!supabase) supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  return supabase;
}

// Supabase data loaders
async function loadTasks(userId) {
  const sb = await ensureSupabase();
  try {
    const { data: tasks, error } = await sb
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return tasks || [];
  } catch (e) { console.warn('loadTasks failed', e); return []; }
}

async function loadActivities(userId) {
  const sb = await ensureSupabase();
  try {
    const { data: activities, error } = await sb
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) throw error;
    return activities || [];
  } catch (e) { console.warn('loadActivities failed', e); return []; }
}

async function loadUpcoming(userId) {
  const sb = await ensureSupabase();
  try {
    const { data: sessions, error } = await sb
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .gt('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(5);
    if (error) throw error;
    return sessions || [];
  } catch (e) { console.warn('loadUpcoming failed', e); return []; }
}

async function loadNotificationCount(userId) {
  const sb = await ensureSupabase();
  try {
    const { count, error } = await sb
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
    if (error) throw error;
    return count || 0;
  } catch (e) { console.warn('loadNotificationCount failed', e); return 0; }
}

// Task create/update flows with Supabase
async function addTaskForUser(userId, { title, due }) {
  const sb = await ensureSupabase();
  if (!userId) throw new Error('Not authenticated');
  if (!title || typeof title !== 'string' || title.trim().length < 3) throw new Error('Task title must be at least 3 characters');
  const payload = {
    user_id: userId,
    title: title.trim(),
    due: due ? String(due) : null,
    done: false,
    created_at: new Date().toISOString()
  };
  const { data, error } = await sb
    .from('tasks')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function markAllTasksComplete(userId) {
  const sb = await ensureSupabase();
  if (!userId) throw new Error('Not authenticated');
  const { error } = await sb
    .from('tasks')
    .update({ 
      done: true,
      completed_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('done', false);
  if (error) throw error;
}

async function updateTaskDone(userId, taskId, done) {
  const sb = await ensureSupabase();
  if (!userId) throw new Error('Not authenticated');
  const { error } = await sb
    .from('tasks')
    .update({ 
      done: !!done,
      completed_at: done ? new Date().toISOString() : null
    })
    .eq('id', taskId)
    .eq('user_id', userId); // Ensure user owns task
  if (error) throw error;
}

// Handle Supabase auth state and session via onAuthStateChange helper (safe when client not yet created)
(async () => {
  const unsub = await onAuthStateChange(async (event, session) => {
    if (!session || !session.user) {
      // Not authenticated — redirect to login
      window.location.href = '../general/login.html';
      return;
    }

    // Verify email confirmation
    if (!session.user.email_confirmed_at) {
      alert('Please verify your email first. Check your inbox for the verification link.');
      await supabase.auth.signOut();
      window.location.href = '../general/login.html';
      return;
    }

    // Use the shared sync helper to fetch profile, activities and notification count
    try {
      const synced = await syncUserData(session);
      const profile = synced?.profile || null;

      if (!profile) {
        console.warn('No profile found for user');
        setText('heroMsg', 'Welcome! Please complete your profile setup.');
      }

      const displayName = profile?.username || profile?.full_name || session.user.email?.split('@')[0] || 'Student';
      setText('userName', displayName);
      setText('topName', displayName);
      setText('heroName', displayName);
      if (profile?.avatar_url) {
        setImage('avatar-sm', profile.avatar_url);
        setImage('topAvatar', profile.avatar_url);
      }

      if (profile?.level) {
        setText('userLevel', profile.level);
        setText('topLevel', profile.level);
      }

      currentUid = session.user.id;

      // Render activities from sync result if provided
      if (Array.isArray(synced.activities)) renderActivity(synced.activities);
      if (Array.isArray(synced.upcoming)) renderUpcoming(synced.upcoming);
      if (typeof synced.unreadNotifications !== 'undefined') setText('notifCount', String(synced.unreadNotifications));
    } catch (syncErr) {
      console.warn('Failed to sync user data using syncUserData():', syncErr);
      // Fallback: leave existing behavior below to load pieces individually
      currentUid = session.user.id;
    }
    // Wire task UI events that require auth
    const addBtn = document.getElementById('addTaskBtn');
    if (addBtn) {
      addBtn.onclick = async () => {
        try {
          const title = prompt('Task title (required)');
          if (!title) return;
          const due = prompt('Due (optional, e.g. Today 5pm)') || '';
          await addTaskForUser(currentUid, { title, due });
          const refreshed = await loadTasks(currentUid);
          renderTasksList(refreshed);
        } catch (err) { showError(err.message || 'Failed to add task'); }
      };
    }

    const markAllBtn = document.getElementById('markCompleteAll');
    if (markAllBtn) {
      markAllBtn.onclick = async () => {
        try {
          await markAllTasksComplete(currentUid);
          const refreshed = await loadTasks(currentUid);
          renderTasksList(refreshed);
        } catch (err) { showError(err.message || 'Failed to mark tasks'); }
      };
    }

    // Handle task checkbox changes and Start button clicks via delegation
    const tasksContainer = document.getElementById('todayTasks');
    if (tasksContainer) {
      tasksContainer.addEventListener('change', async (ev) => {
        const tgt = ev.target;
        if (tgt && tgt.matches('input[type="checkbox"]')) {
          const taskId = tgt.closest('li')?.querySelector('button[data-id]')?.getAttribute('data-id') || tgt.getAttribute('data-id');
          const id = taskId || tgt.getAttribute('data-id');
          if (id) await updateTaskDone(currentUid, id, tgt.checked);
        }
      });
      tasksContainer.addEventListener('click', async (ev) => {
        const btn = ev.target.closest('button[data-id]');
        if (!btn) return;
        const id = btn.getAttribute('data-id');
        // Start -> toggle done to true
        try {
          await updateTaskDone(currentUid, id, true);
          const refreshed = await loadTasks(currentUid);
          renderTasksList(refreshed);
        } catch (err) { showError('Failed to start task'); }
      });
    }

    // Update user data via cache system
    import('../../js/user-cache.js').then(() => {
      window.addEventListener('userDataUpdated', (event) => {
        const user = event.detail;
        if (user) {
          const fullName = user.displayName || 'Student';
          const name = fullName.split(' ')[0];
          const level = (user.profile?.level || '').startsWith('SS') ? user.profile.level : 'SS 3';
          const initials = getInitials(fullName);

          // Update welcome message
          const heading = document.querySelector('h1');
          if (heading) heading.textContent = `Welcome back, ${name}!`;

          // Update sidebar elements
          document.getElementById('userName').textContent = name;
          document.getElementById('userLevel').textContent = level;

          // Update topbar elements
          document.getElementById('topName').textContent = fullName;
          document.getElementById('topLevel').textContent = level;

          // Update hero name
          document.getElementById('heroName').textContent = name;

          // Update all user name instances
          document.querySelectorAll('.user-fullname').forEach(el => {
            el.textContent = fullName;
          });
          document.querySelectorAll('.user-firstname').forEach(el => {
            el.textContent = name;
          });

          // Update avatars with user photo or initials
          const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=2563eb&color=fff&size=128`;
          ['avatar-sm', 'topAvatar', 'main-avatar'].forEach(id => {
            const avatar = document.getElementById(id);
            if (avatar) avatar.setAttribute('src', avatarUrl);
          });

          // Update progress data if available
          if (user.progress) {
            const weeklyProgress = document.getElementById('weeklyProgressLabel');
            if (weeklyProgress) weeklyProgress.textContent = `${user.progress.weekly || 0}%`;
            
            const mockAvg = document.getElementById('mockAvgLabel');
            if (mockAvg) mockAvg.textContent = `${user.progress.mockAvg || 0}%`;
            
            const streak = document.getElementById('streakLabel');
            if (streak) streak.textContent = `${user.progress.streak || 0} days`;
          }

          // Update notification count
          if (user.unreadNotifications) {
            const notifCount = document.getElementById('notifCount');
            if (notifCount) notifCount.textContent = user.unreadNotifications.length;
          }
        }
      });
    });

    try {
      // Optional: update local profile cache using profile APIs
      // If you want to update the profile object from session metadata, you can call initializeUserProfile/updateUserProfile here.

      // load live lists (use currentUid set above)
      const [tasks, activities, upcoming] = await Promise.all([
        loadTasks(currentUid),
        loadActivities(currentUid),
        loadUpcoming(currentUid)
      ]);

      renderTasksList(tasks);
      renderActivity(activities);
      renderUpcoming(upcoming);

      // notification count was set earlier from syncUserData when available
    } catch (err) {
      console.error('Error loading user data:', err);
      showError('Failed to load your dashboard data.');
    }
    // Keep reference if we need to unsubscribe later
    if (!unsub) console.debug('onAuthStateChange not available yet');
  });
})();
// Sidebar toggle and quick actions (consolidated)
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const marginClasses = ['ml-64', 'md:ml-72', 'lg:ml-80'];

// Ensure elements exist before wiring handlers
if (sidebar && mainContent) {
  // Set sensible initial state depending on viewport
  if (window.innerWidth < 1024) {
    sidebar.classList.add('-translate-x-full');
    mainContent.classList.remove(...marginClasses);
  } else {
    sidebar.classList.remove('-translate-x-full');
    mainContent.classList.add(...marginClasses);
  }

  // Toggle handler (guarded)
  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('-translate-x-full');
      if (sidebar.classList.contains('-translate-x-full')) {
        mainContent.classList.remove(...marginClasses);
      } else {
        mainContent.classList.add(...marginClasses);
      }
    });
  }

  // Clicking main content on small screens should close the sidebar
  mainContent.addEventListener('click', () => {
    if (window.innerWidth < 1024 && !sidebar.classList.contains('-translate-x-full')) {
      sidebar.classList.add('-translate-x-full');
      mainContent.classList.remove(...marginClasses);
    }
  });

  // Keep sidebar/main-content in sync when resizing across breakpoint
  let lastIsDesktop = window.innerWidth >= 1024;
  window.addEventListener('resize', () => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop !== lastIsDesktop) {
      lastIsDesktop = isDesktop;
      if (isDesktop) {
        // moving to desktop: ensure sidebar visible and margins applied
        sidebar.classList.remove('-translate-x-full');
        mainContent.classList.add(...marginClasses);
      } else {
        // moving to mobile: hide sidebar and remove margins
        sidebar.classList.add('-translate-x-full');
        mainContent.classList.remove(...marginClasses);
      }
    }
  });
}
