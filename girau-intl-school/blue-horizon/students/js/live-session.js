// Shared live session helpers: tab persistence and upload wiring
(function(){
  const storageKey = 'liveSession:tabs';
  const tabsEl = document.getElementById('tabs');
  const tabContent = document.getElementById('tabContent');
  if (!tabsEl || !tabContent) return;

  // Restore function assumes openTool/closeTab/activateTab are available globally
  function saveState(){
    try{
      const state = { tabs: [], active: null };
      // collect tab keys from data-key attribute if set
      const items = tabContent.querySelectorAll('[data-tab-key]');
      items.forEach(it=>{ state.tabs.push({ key: it.dataset.tabKey, html: it.innerHTML }); });
      const active = Array.from(tabsEl.querySelectorAll('.tab')).find(t=>t.classList.contains('active'));
      state.active = active ? active.dataset.tabKey : null;
      localStorage.setItem(storageKey, JSON.stringify(state));
    }catch(e){ console.warn('Could not save live session state', e); }
  }

  function restoreState(){
    try{
      const raw = localStorage.getItem(storageKey); if(!raw) return;
      const state = JSON.parse(raw);
      if(!state || !state.tabs) return;
      // clear existing dynamic tabs
      const existing = tabContent.querySelectorAll('[data-tab-key]');
      existing.forEach(n=>n.remove());
      const existingTabs = tabsEl.querySelectorAll('.tab');
      existingTabs.forEach(n=>n.remove());
      // open saved tabs
      for(const t of state.tabs){
        // use global openTool if available
        if (typeof openTool === 'function'){
          openTool(t.key, t.key, t.html);
          const panel = tabContent.querySelector('[data-tab-key="'+t.key+'"]');
          if (panel) panel.dataset.tabKey = t.key;
        } else {
          // fallback: recreate minimal UI
          const panel = document.createElement('div'); panel.dataset.tabKey = t.key; panel.innerHTML = t.html; panel.style.display = 'none'; tabContent.appendChild(panel);
          const tab = document.createElement('div'); tab.className='tab'; tab.textContent = t.key; tab.dataset.tabKey = t.key; tab.onclick = ()=>{ /* no-op */ }; tabsEl.appendChild(tab);
        }
      }
      // activate
      if (state.active && typeof activateTab === 'function') activateTab(state.active);
    }catch(e){ console.warn('Could not restore state', e); }
  }

  // Hook into openTool/closeTab if present to persist changes
  const originalOpen = window.openTool;
  window.openTool = function(key, title, html){
    const res = originalOpen.apply(this, arguments);
    // mark panel for persistence
    const panel = tabContent.lastElementChild;
    if (panel) panel.dataset.tabKey = key;
    saveState();
    return res;
  };
  const originalClose = window.closeTab;
  window.closeTab = function(key){
    const res = originalClose.apply(this, arguments);
    saveState();
    return res;
  };
  const originalActivate = window.activateTab;
  window.activateTab = function(key){
    const res = originalActivate.apply(this, arguments);
    saveState();
    return res;
  };

  // Upload helper: posts FormData to endpoint and returns JSON
  async function uploadFile(endpoint, file){
    const form = new FormData(); form.append('file', file);
    const res = await fetch(endpoint, { method: 'POST', body: form });
    return res.json();
  }

  // Find file inputs inside dynamic tab panels and wire them
  function wireFileInputs(){
    tabContent.addEventListener('change', async (e)=>{
      const el = e.target; if (el.tagName !== 'INPUT' || el.type !== 'file') return;
      const panel = el.closest('[data-tab-key]'); if(!panel) return;
      const key = panel.dataset.tabKey || 'uploaded';
      const file = el.files && el.files[0]; if(!file) return;
      try{
        const hint = panel.querySelector('.hint'); if (hint) hint.textContent = 'Uploading...';
        const endpoint = file.type.startsWith('image/') ? '/api/uploads/photo' : file.type.startsWith('video/') ? '/api/uploads/video' : '/api/uploads/photo';
        const data = await uploadFile(endpoint, file);
        if (data && data.ok){
          if (hint) hint.textContent = 'Uploaded: ' + data.url;
          // if image, show it inline
          if (file.type.startsWith('image/')){
            const img = document.createElement('img'); img.src = data.url; img.style.maxWidth='100%'; panel.appendChild(img);
          } else if (file.type.startsWith('video/')){
            const v = document.createElement('video'); v.controls = true; v.src = data.url; v.style.maxWidth='100%'; panel.appendChild(v);
          }
          saveState();
        } else {
          if (hint) hint.textContent = 'Upload failed';
        }
      }catch(err){ console.error('Upload failed', err); const hint = panel.querySelector('.hint'); if (hint) hint.textContent = 'Upload error'; }
    });
  }

  restoreState();
  wireFileInputs();
})();

