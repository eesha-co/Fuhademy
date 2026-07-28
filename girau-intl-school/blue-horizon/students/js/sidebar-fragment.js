// sidebar-fragment.js
// Injects or normalizes the sidebar for student pages and wires toggle + small UI sync
import { applyUserDataToUI } from './student-page-shared.js';

const canonicalInner = `
    <aside id="sidebar" class="w-64 md:w-72 lg:w-80 fixed left-0 top-0 h-full bg-white border-r border-slate-200 p-5 flex flex-col gap-6 overflow-auto z-40">
      <div class="flex items-center gap-3"><img src="/assets/images/logo.png" alt="logo" class="h-12 w-12 rounded-full shadow-sm"><div><div class="text-lg font-bold text-sky-700">JUANOVA CORTEX</div><div class="text-xs text-slate-500">Student Dashboard</div></div></div>
      <nav class="flex-1 overflow-auto"><ul class="space-y-1">
        <li><a href="student-dashboard.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-home text-sky-600"></i> Home</a></li>
        <li><a href="news-feed-gemini.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-newspaper text-pink-500"></i> News Feed</a></li>
        <li><a href="smart-note.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-note-sticky text-yellow-500"></i> Smart Notes</a></li>        
        <li><a href="textbooks.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-book text-indigo-500"></i> Textbooks</a></li>
        <li><a href="formula-bank.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-book-open text-teal-600"></i> All Formula</a></li>
        <li><a href="study-plan.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-calendar-check text-green-500"></i> Study Plan</a></li>
        <li><a href="video-library.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-photo-video text-cyan-600"></i> Video Library</a></li>
        <li><a href="digital-library.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-book text-indigo-500"></i> Digital Library</a></li>
        <li><a href="game.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-puzzle-piece text-purple-500"></i> Game</a></li>
        <li><a href="mock-exams.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-pencil-alt text-orange-500"></i> Mock Exams</a></li>
        <li><a href="cbt/cbt.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-computer text-red-500"></i> JAMB CBT</a></li>
        <li><a href="notifications.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-bell text-pink-600"></i> Notifications</a></li>
        <li><a href="student-live-session.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-chalkboard-teacher text-blue-400"></i> Live Sessions</a></li>
        <li><a href="Nobel-laureate.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 bg-sky-50"><i class="fas fa-award text-yellow-600"></i> Nobel Laureate</a></li>
      </ul></nav>
      <div class="text-sm text-slate-500 border-t pt-4"><div class="mb-2">Account</div><div class="flex items-center gap-3"><img id="avatar-sm" src="../assets/images/unnamed.jpg" alt="avatar" class="h-10 w-10 rounded-full border"><div><div id="userName" class="font-semibold">Student</div><div id="userLevel" class="text-xs text-slate-400"></div></div></div></div>

`;

function mountSidebar() {
  let aside = document.getElementById('sidebar');
  if (!aside) {
    aside = document.createElement('aside');
    aside.id = 'sidebar';
    aside.className = 'w-64 md:w-72 lg:w-80 fixed left-0 top-0 h-full bg-white border-r border-slate-200 p-5 flex flex-col gap-6 transition-transform duration-300 ease-in-out overflow-auto z-40 lg:translate-x-0';
    document.body.insertBefore(aside, document.body.firstChild);
  }

  // Replace inner if different to ensure canonical markup
  aside.innerHTML = canonicalInner;

  // Wire sidebar toggle behavior (matching dashboard logic)
  const sidebar = aside;
  const mainContent = document.getElementById('main-content');
  const toggleBtn = document.getElementById('toggleSidebar');
  const marginClasses = ['ml-64', 'md:ml-72', 'lg:ml-80'];

  function applyInitialState() {
    if (!mainContent) return;
    if (window.innerWidth < 1024) {
      sidebar.classList.add('-translate-x-full');
      mainContent.classList.remove(...marginClasses);
    } else {
      sidebar.classList.remove('-translate-x-full');
      mainContent.classList.add(...marginClasses);
    }
  }

  applyInitialState();

  if (toggleBtn && mainContent) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('-translate-x-full');
      if (sidebar.classList.contains('-translate-x-full')) mainContent.classList.remove(...marginClasses);
      else mainContent.classList.add(...marginClasses);
    });
  }

  if (mainContent) {
    mainContent.addEventListener('click', () => {
      if (window.innerWidth < 1024 && !sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.add('-translate-x-full');
        mainContent.classList.remove(...marginClasses);
      }
    });

    let lastIsDesktop = window.innerWidth >= 1024;
    window.addEventListener('resize', () => {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop !== lastIsDesktop) {
        lastIsDesktop = isDesktop;
        if (isDesktop) { sidebar.classList.remove('-translate-x-full'); mainContent.classList.add(...marginClasses); }
        else { sidebar.classList.add('-translate-x-full'); mainContent.classList.remove(...marginClasses); }
      }
    });
  }

  // Expose a small API to update profile UI
  function tryApply(user) {
    try { applyUserDataToUI(user); } catch (e) { /* ignore */ }
  }

  // If a global preloaded user exists, apply it
  if (window.preloadedUserData) tryApply(window.preloadedUserData);
  else {
    // Also check common localStorage keys used by login/signup flows
    try {
      const rawProfile = localStorage.getItem('userProfile') || localStorage.getItem('user');
      if (rawProfile) {
        const parsed = JSON.parse(rawProfile);
        if (parsed) tryApply(parsed);
      } else {
        const legacy = localStorage.getItem('cachedUserData_current');
        if (legacy) {
          try {
            const p = JSON.parse(legacy);
            const user = p && p.data ? p.data : p;
            if (user) tryApply(user);
          } catch (e) { /* ignore */ }
        }
      }
    } catch (e) { /* ignore parsing errors */ }
  }

  // Listen for common signals
  window.addEventListener('studentPageReady', (ev) => { tryApply(ev.detail.profile || ev.detail.user); });
  window.addEventListener('userDataUpdated', (ev) => { tryApply(ev.detail); });
}

// Mount immediately when imported
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountSidebar);
} else {
  mountSidebar();
}

export { mountSidebar };
