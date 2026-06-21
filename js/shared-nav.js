// Shared navigation component
const sharedNavigation = `
    <aside id="sidebar" class="w-64 md:w-72 lg:w-80 fixed left-0 top-0 h-full bg-white border-r border-slate-200 p-5 flex flex-col gap-6 overflow-auto z-40">
      <div class="flex items-center gap-3"><img src="/assets/images/logo.png" alt="logo" class="h-12 w-12 rounded-full shadow-sm"><div><div class="text-lg font-bold text-sky-700">JUANOVA CORTEX</div><div class="text-xs text-slate-500">Student Dashboard</div></div></div>
      <nav class="flex-1 overflow-auto"><ul class="space-y-1">
        <li><a href="student-dashboard.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-home text-sky-600"></i> Home</a></li>
        <li><a href="news-feed-gemini.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-newspaper text-pink-500"></i> News Feed</a></li>
        <li><a href="notes.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-note-sticky text-yellow-500"></i> Study Notes</a></li>
        <li><a href="textbooks.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-book text-indigo-500"></i> Textbooks</a></li>
        <li><a href="formula-bank.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-book-open text-teal-600"></i> All Formula</a></li>
        <li><a href="study-plan.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-calendar-check text-green-500"></i> Study Plan</a></li>
        <li><a href="video-library.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 bg-sky-50"><i class="fas fa-photo-video text-cyan-600"></i> Video Library</a></li>
        <li><a href="digital-library.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-book text-indigo-500"></i> Digital Library</a></li>
        <li><a href="game.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-puzzle-piece text-purple-500"></i> Game</a></li>
        <li><a href="mock-exams.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-pencil-alt text-orange-500"></i> Mock Exams</a></li>
        <li><a href="notifications.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-bell text-pink-600"></i> Notifications</a></li>
        <li><a href="student-live-session.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-chalkboard-teacher text-blue-400"></i> Live Sessions</a></li>
        <li><a href="Nobel-laureate.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50"><i class="fas fa-award text-yellow-600"></i> Nobel Laureate</a></li>
      </ul></nav>
      <div class="text-sm text-slate-500 border-t pt-4"><div class="mb-2">Account</div><div class="flex items-center gap-3"><img id="avatar-sm" src="../assets/images/unnamed.jpg" alt="avatar" class="h-10 w-10 rounded-full border"><div><div id="userName" class="font-semibold">Student</div><div id="userLevel" class="text-xs text-slate-400"></div></div></div></div>
    </aside>

// Function to initialize shared navigation
function initializeSharedNavigation() {
  // Find all sidebars in the document
  const sidebars = document.querySelectorAll('#sidebar');
  
  // Update each sidebar with the shared navigation
  sidebars.forEach(sidebar => {
    sidebar.innerHTML = sharedNavigation;
  });

  // Highlight current page in navigation
  const currentPage = window.location.pathname.split('/').pop() || 'student-dashboard.html';
  const currentLink = document.querySelector(`a[href="${currentPage}"]`);
  if (currentLink) {
    currentLink.classList.add('bg-slate-50', 'font-semibold');
  }
}

// Export the initialization function
export { initializeSharedNavigation };