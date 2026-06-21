// Fetch and inject the shared teachers sidebar into pages that have an aside.canvas-sidebar
document.addEventListener('DOMContentLoaded', async () => {
  const sidebarPath = 'teachers-sidebar.html';
  try {
    const res = await fetch(sidebarPath, { cache: 'no-store' });
    if (!res.ok) return console.warn('Could not load sidebar:', res.status);
    const text = await res.text();
    const temp = document.createElement('div');
    temp.innerHTML = text;
    const sharedSidebar = temp.querySelector('aside.canvas-sidebar');
    if (!sharedSidebar) return console.warn('Shared sidebar not found in file');

    // Replace all existing sidebars with the shared one
    const existing = document.querySelectorAll('aside.canvas-sidebar');
    if (existing.length) {
      existing.forEach((el, idx) => {
        const clone = sharedSidebar.cloneNode(true);
        // Preserve any data attributes from original aside
        for (const attr of el.attributes) {
          if (!clone.hasAttribute(attr.name)) clone.setAttribute(attr.name, attr.value);
        }
        el.replaceWith(clone);
      });
    } else {
      // If no placeholder, inject at top of body
      document.body.insertAdjacentElement('afterbegin', sharedSidebar.cloneNode(true));
    }

    // Optionally re-run theme toggle wiring if present in the page
    const toggle = document.getElementById('toggle-theme') || document.getElementById('toggle-theme-2');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('teacherTheme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
      });
    }
  } catch (err) {
    console.error('Error loading shared sidebar', err);
  }
});

