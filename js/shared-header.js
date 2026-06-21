// Shared header component
const sharedHeader = `
<header class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-30">
  <button id="menu-toggle" class="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
    <i class="fas fa-bars"></i>
  </button>
  
  <div class="flex items-center gap-4">
    <div class="flex items-center gap-2">
      <img id="topAvatar" src="../assets/images/unnamed.jpg" alt="User avatar" class="w-8 h-8 rounded-full border">
      <div class="hidden sm:block">
        <div id="topName" class="text-sm font-semibold">Student</div>
        <div id="topLevel" class="text-xs text-slate-500">SS3</div>
      </div>
    </div>
    
    <a href="notifications.html" class="p-2 hover:bg-slate-50 rounded-lg relative">
      <i class="fas fa-bell text-slate-600"></i>
      <span id="notifCount" class="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">0</span>
    </a>
  </div>
</header>`;

// Function to initialize shared header
function initializeSharedHeader() {
  // Find header placeholder in the document
  const headerPlaceholder = document.querySelector('#header-placeholder');
  if (headerPlaceholder) {
    headerPlaceholder.outerHTML = sharedHeader;
  }
}

// Export the initialization function
export { initializeSharedHeader };