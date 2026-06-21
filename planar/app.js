// ============================================
// PlanAlarm v3 - Events + Daily Plans
// ============================================

// --- Data Model ---
// events: [{ id, name, date (YYYY-MM-DD), time (HH:MM or null), createdAt }]
// plans:  [{ id, eventId, task, time (HH:MM), alarm, done, dismissed, date (today str) }]

let events = [];
let plans = [];
let activeEventId = null;
let soundEnabled = true;
let currentFilter = 'all';
let editingPlanId = null;
let editingEventId = null;
let alarmEnabled = true;
let activeAlarmId = null;
let audioCtx = null;
let floatingOverlayEnabled = true;
let floatingExpanded = false;
let floatingPos = { x: 16, y: 100 };

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  updateDate();
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(checkAlarms, 1000);

  onboardingDone = localStorage.getItem('planAlarm_onboarded') === 'true';
  if (!onboardingDone) {
    document.getElementById('onboardingScreen').classList.remove('hidden');
    updatePermStatuses();
  } else {
    initFloatingOverlay();
  }

  renderAll();
  document.getElementById('timeInput').value = formatTimeValue(new Date());
});

// ============================================
// STORAGE
// ============================================

function loadData() {
  try {
    events = JSON.parse(localStorage.getItem('planAlarm_events') || '[]');
    plans = JSON.parse(localStorage.getItem('planAlarm_plans') || '[]');
    activeEventId = localStorage.getItem('planAlarm_activeEvent') || null;
    soundEnabled = localStorage.getItem('planAlarm_sound') !== 'false';
    updateSoundIcon();
    // If active event was deleted, pick first
    if (activeEventId && !events.find(e => e.id === activeEventId)) {
      activeEventId = events.length > 0 ? events[0].id : null;
    }
  } catch (e) { events = []; plans = []; }
}

function saveData() {
  localStorage.setItem('planAlarm_events', JSON.stringify(events));
  localStorage.setItem('planAlarm_plans', JSON.stringify(plans));
  localStorage.setItem('planAlarm_activeEvent', activeEventId || '');
  localStorage.setItem('planAlarm_sound', soundEnabled);
}

// ============================================
// HELPERS
// ============================================

function pad(n) { return String(n).padStart(2, '0'); }
function truncate(s, n) { return s.length > n ? s.substring(0, n) + '..' : s; }
function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }
function formatTimeValue(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
function todayStr() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function escapeHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

function formatDisplayTime(time) {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${pad(m)} ${ampm}`;
}

function formatDateNice(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function updateDate() {
  document.getElementById('headerDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function getActiveEvent() { return events.find(e => e.id === activeEventId) || null; }

function getEventDateTime(ev) {
  const d = new Date(ev.date + 'T00:00:00');
  if (ev.time) { const [h, m] = ev.time.split(':').map(Number); d.setHours(h, m, 0, 0); }
  else d.setHours(23, 59, 59, 0);
  return d;
}

function getCountdown(target) {
  const now = new Date();
  let diff = target - now;
  if (diff < 0) diff = 0;
  const totalSec = Math.floor(diff / 1000);
  return {
    totalSec,
    weeks: Math.floor(totalSec / (7 * 86400)),
    days: Math.floor((totalSec % (7 * 86400)) / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    isPast: diff <= 0,
  };
}

function getPlansForEvent(eventId) {
  return plans.filter(p => p.eventId === eventId).sort((a, b) => a.time.localeCompare(b.time));
}

function getEventPlansToday() {
  if (!activeEventId) return [];
  return getPlansForEvent(activeEventId);
}

// ============================================
// CLOCK
// ============================================

function updateClock() {
  const now = new Date();
  document.getElementById('liveClock').textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  updateEventCountdown();
  updateNextUp();
  updateActiveTask();
  updateFloatingCountdown();
}

// ============================================
// RENDER ALL
// ============================================

function renderAll() {
  renderEventTabs();
  renderMainView();
}

function renderEventTabs() {
  const section = document.getElementById('eventTabsSection');
  const container = document.getElementById('eventTabs');
  if (events.length === 0) { section.classList.add('hidden'); return; }
  section.classList.remove('hidden');

  container.innerHTML = events.map(ev => {
    const isActive = ev.id === activeEventId;
    const cd = getCountdown(getEventDateTime(ev));
    let statusText = '';
    if (cd.isPast) statusText = 'Done';
    else if (cd.weeks > 0) statusText = `${cd.weeks}w ${cd.days}d`;
    else if (cd.days > 0) statusText = `${cd.days}d`;
    else statusText = `${cd.hours}h`;

    return `<button onclick="switchEvent('${ev.id}')" class="flex-shrink-0 px-3 py-2 rounded-xl text-left transition-all ${isActive ? 'bg-primary/20 border border-primary/30' : 'bg-surface border border-transparent hover:bg-surface-lighter'}">
      <p class="text-xs font-semibold truncate max-w-[100px] ${isActive ? 'text-primary' : 'text-gray-300'}">${escapeHtml(ev.name)}</p>
      <p class="text-[10px] ${cd.isPast ? 'text-success' : 'text-gray-500'}">${statusText}</p>
    </button>`;
  }).join('') + `<button onclick="openEventModal()" class="flex-shrink-0 w-9 h-9 rounded-xl bg-surface-lighter border border-dashed border-gray-600 flex items-center justify-center hover:border-primary/50 transition-colors">
    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
  </button>`;
}

function renderMainView() {
  const ev = getActiveEvent();
  const noEv = document.getElementById('noEventsState');
  const countdownSec = document.getElementById('countdownSection');
  const plansHeader = document.getElementById('plansHeader');
  const fabPlan = document.getElementById('fabPlan');
  const fabEvent = document.getElementById('fabEvent');

  if (!ev) {
    noEv.classList.remove('hidden');
    countdownSec.classList.add('hidden');
    plansHeader.classList.add('hidden');
    fabPlan.classList.add('hidden');
    fabEvent.classList.add('hidden');
    document.getElementById('plansList').innerHTML = '';
    document.getElementById('noPlansState').classList.add('hidden');
    document.getElementById('progressSection').classList.add('hidden');
    document.getElementById('nextUpSection').classList.add('hidden');
    document.getElementById('allDoneSection').classList.add('hidden');
    return;
  }

  noEv.classList.add('hidden');
  countdownSec.classList.remove('hidden');
  plansHeader.classList.remove('hidden');
  fabPlan.classList.remove('hidden');
  fabPlan.classList.remove('hidden');
  fabEvent.classList.remove('hidden');

  document.getElementById('countdownEventName').textContent = ev.name;
  document.getElementById('countdownEventDate').textContent = formatDateNice(ev.date);
  document.getElementById('countdownLabel').textContent = `counting down to ${ev.name}`;

  renderPlans();
}

function renderPlans() {
  const container = document.getElementById('plansList');
  const emptyState = document.getElementById('noPlansState');
  const progressSection = document.getElementById('progressSection');
  const todayPlans = getEventPlansToday();

  let filtered = todayPlans;
  if (currentFilter === 'pending') filtered = filtered.filter(p => !p.done);
  else if (currentFilter === 'done') filtered = filtered.filter(p => p.done);

  document.getElementById('planCount').textContent = `(${filtered.length})`;

  const doneCount = todayPlans.filter(p => p.done).length;
  const total = todayPlans.length;

  if (total > 0) {
    progressSection.classList.remove('hidden');
    document.getElementById('progressText').textContent = `${doneCount}/${total}`;
    document.getElementById('progressBar').style.width = `${(doneCount / total) * 100}%`;
  } else {
    progressSection.classList.add('hidden');
  }

  if (total === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  const now = new Date();
  const curMin = now.getHours() * 60 + now.getMinutes();

  container.innerHTML = filtered.map(p => {
    const [h, m] = p.time.split(':').map(Number);
    const pMin = h * 60 + m;
    const isPast = pMin < curMin && !p.done;
    const isActive = !p.done && !p.dismissed && pMin <= curMin && pMin >= curMin - 5;

    return `<div class="group bg-surface rounded-2xl p-3.5 transition-all hover:bg-surface-lighter ${p.done ? 'opacity-40' : ''} ${isActive ? 'ring-1 ring-success/30' : ''}">
      <div class="flex items-center gap-3">
        <button onclick="toggleDone('${p.id}')" class="flex-shrink-0">
          <div class="w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center transition-all ${p.done ? 'bg-success border-success' : 'border-gray-600 hover:border-primary'}">
            ${p.done ? '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
          </div>
        </button>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm ${p.done ? 'line-through text-gray-500' : 'text-white'} truncate">${escapeHtml(p.task)}</p>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="text-xs ${isPast ? 'text-danger' : 'text-gray-500'}">${formatDisplayTime(p.time)}</span>
            ${p.alarm ? '<svg class="w-3 h-3 text-orange-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' : ''}
            ${isPast && !p.done ? '<span class="text-[9px] text-danger font-medium">OVERDUE</span>' : ''}
            ${isActive ? '<span class="text-[9px] text-success font-medium animate-pulse">NOW</span>' : ''}
          </div>
        </div>
        <div class="flex gap-0.5 flex-shrink-0">
          <button onclick="openEditPlan('${p.id}')" class="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5"><svg class="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
          <button onclick="deletePlan('${p.id}')" class="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-danger/10"><svg class="w-3.5 h-3.5 text-gray-600 hover:text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ============================================
// EVENT COUNTDOWN
// ============================================

function updateEventCountdown() {
  const ev = getActiveEvent();
  if (!ev) return;
  const cd = getCountdown(getEventDateTime(ev));
  document.getElementById('evWeeks').textContent = cd.weeks;
  document.getElementById('evDays').textContent = cd.days;
  document.getElementById('evHours').textContent = pad(cd.hours);
  document.getElementById('evMins').textContent = pad(cd.minutes);
  document.getElementById('evSecs').textContent = pad(cd.seconds);
}

// ============================================
// NEXT UP / ACTIVE TASK
// ============================================

function updateNextUp() {
  const section = document.getElementById('nextUpSection');
  const allDone = document.getElementById('allDoneSection');
  const todayPlans = getEventPlansToday().filter(p => !p.done && !p.dismissed).sort((a, b) => a.time.localeCompare(b.time));
  const now = new Date();
  const curMin = now.getHours() * 60 + now.getMinutes();

  const current = todayPlans.find(p => { const [h,m] = p.time.split(':').map(Number); const pm = h*60+m; return pm <= curMin && pm >= curMin - 5; });
  if (current) { section.classList.add('hidden'); allDone.classList.add('hidden'); return; }

  const next = todayPlans.find(p => { const [h,m] = p.time.split(':').map(Number); return h*60+m > curMin; });
  if (next) {
    section.classList.remove('hidden'); allDone.classList.add('hidden');
    document.getElementById('nextUpTask').textContent = next.task;
    document.getElementById('nextUpTime').textContent = formatDisplayTime(next.time);
    const [h,m] = next.time.split(':').map(Number);
    let diff = h*60+m - curMin; if (diff < 0) diff += 1440;
    document.getElementById('nextUpCountdown').textContent = diff >= 60 ? `${Math.floor(diff/60)}h ${diff%60}m` : `${diff}m`;
  } else {
    section.classList.add('hidden');
    allDone.classList.toggle('hidden', todayPlans.length > 0);
  }
}

function updateActiveTask() {
  const section = document.getElementById('activeTaskSection');
  const todayPlans = getEventPlansToday().filter(p => !p.done && !p.dismissed);
  const now = new Date(); const curMin = now.getHours() * 60 + now.getMinutes();
  const active = todayPlans.find(p => { const [h,m] = p.time.split(':').map(Number); const pm = h*60+m; return pm <= curMin && pm >= curMin - 5; });
  if (active) {
    section.classList.remove('hidden');
    document.getElementById('activeTaskName').textContent = active.task;
    document.getElementById('activeTaskTime').textContent = formatDisplayTime(active.time);
  } else { section.classList.add('hidden'); }
}

// ============================================
// EVENT CRUD
// ============================================

function openEventModal(id) {
  editingEventId = id || null;
  const modal = document.getElementById('eventModal');
  const delBtn = document.getElementById('eventDeleteBtn');

  if (id) {
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    document.getElementById('eventModalTitle').textContent = 'Edit Event';
    document.getElementById('eventNameInput').value = ev.name;
    document.getElementById('eventDateInput').value = ev.date;
    document.getElementById('eventTimeInput').value = ev.time || '';
    delBtn.classList.remove('hidden');
  } else {
    document.getElementById('eventModalTitle').textContent = 'New Event';
    document.getElementById('eventNameInput').value = '';
    const future = new Date(); future.setDate(future.getDate() + 30);
    document.getElementById('eventDateInput').value = `${future.getFullYear()}-${pad(future.getMonth()+1)}-${pad(future.getDate())}`;
    document.getElementById('eventTimeInput').value = '';
    delBtn.classList.add('hidden');
  }

  modal.classList.remove('hidden');
  requestAnimationFrame(() => { document.getElementById('eventModalContent').style.transform = 'translateY(0)'; });
  setTimeout(() => document.getElementById('eventNameInput').focus(), 350);
}

function closeEventModal() {
  document.getElementById('eventModalContent').style.transform = 'translateY(100%)';
  setTimeout(() => { document.getElementById('eventModal').classList.add('hidden'); editingEventId = null; }, 300);
}

function saveEvent() {
  const name = document.getElementById('eventNameInput').value.trim();
  const date = document.getElementById('eventDateInput').value;
  const time = document.getElementById('eventTimeInput').value || null;

  if (!name) { shakeEl(document.getElementById('eventNameInput')); return; }
  if (!date) { shakeEl(document.getElementById('eventDateInput')); return; }

  if (editingEventId) {
    const ev = events.find(e => e.id === editingEventId);
    if (ev) { ev.name = name; ev.date = date; ev.time = time; }
  } else {
    const ev = { id: generateId(), name, date, time, createdAt: Date.now() };
    events.push(ev);
    activeEventId = ev.id;
  }

  saveData(); closeEventModal(); renderAll();
  showToast(editingEventId ? 'Event updated' : 'Event created');
}

function deleteEvent() {
  if (!editingEventId) return;
  const ev = events.find(e => e.id === editingEventId);
  if (!confirm(`Delete "${ev?.name}" and ALL its daily plans?`)) return;
  plans = plans.filter(p => p.eventId !== editingEventId);
  events = events.filter(e => e.id !== editingEventId);
  if (activeEventId === editingEventId) activeEventId = events.length > 0 ? events[0].id : null;
  saveData(); closeEventModal(); renderAll();
  showToast('Event deleted');
}

function switchEvent(id) {
  activeEventId = id;
  currentFilter = 'all';
  saveData(); renderAll();
}

// ============================================
// PLAN CRUD
// ============================================

function openAddPlan() {
  if (!activeEventId) { showToast('Select or create an event first'); return; }
  editingPlanId = null; alarmEnabled = true;
  document.getElementById('planModalTitle').textContent = 'Add Plan';
  document.getElementById('taskInput').value = '';
  const now = new Date(); const next = new Date(now.getTime() + 3600000);
  document.getElementById('timeInput').value = formatTimeValue(next);
  updateAlarmToggleUI();
  openPlanModal();
  setTimeout(() => document.getElementById('taskInput').focus(), 350);
}

function openEditPlan(id) {
  const p = plans.find(pl => pl.id === id);
  if (!p) return;
  editingPlanId = id; alarmEnabled = p.alarm !== false;
  document.getElementById('planModalTitle').textContent = 'Edit Plan';
  document.getElementById('taskInput').value = p.task;
  document.getElementById('timeInput').value = p.time;
  updateAlarmToggleUI();
  openPlanModal();
}

function openPlanModal() {
  document.getElementById('planModal').classList.remove('hidden');
  requestAnimationFrame(() => { document.getElementById('planModalContent').style.transform = 'translateY(0)'; });
}

function closeModal() {
  document.getElementById('planModalContent').style.transform = 'translateY(100%)';
  setTimeout(() => { document.getElementById('planModal').classList.add('hidden'); editingPlanId = null; }, 300);
}

function savePlan() {
  const task = document.getElementById('taskInput').value.trim();
  const time = document.getElementById('timeInput').value;
  if (!task) { shakeEl(document.getElementById('taskInput')); return; }
  if (!time) { shakeEl(document.getElementById('timeInput')); return; }

  if (editingPlanId) {
    const p = plans.find(pl => pl.id === editingPlanId);
    if (p) { p.task = task; p.time = time; p.alarm = alarmEnabled; }
  } else {
    plans.push({ id: generateId(), eventId: activeEventId, task, time, alarm: alarmEnabled, done: false, dismissed: false });
  }

  saveData(); closeModal(); renderAll();
  showToast(editingPlanId ? 'Plan updated' : 'Plan added');
}

function deletePlan(id) {
  plans = plans.filter(p => p.id !== id);
  saveData(); renderAll(); showToast('Plan deleted');
}

function toggleDone(id) {
  const p = plans.find(pl => pl.id === id);
  if (p) { p.done = !p.done; if (p.done) p.dismissed = true; saveData(); renderAll(); showToast(p.done ? 'Done!' : 'Pending'); }
}

function filterPlans(type) {
  currentFilter = type; renderPlans();
  ['All','Pending','Done'].forEach(f => {
    const btn = document.getElementById('filter' + f);
    btn.className = `text-[10px] px-2.5 py-0.5 rounded-full font-medium transition-colors ${f.toLowerCase() === type ? 'bg-primary/20 text-primary' : 'bg-surface text-gray-400'}`;
  });
}

function toggleAlarmInForm() { alarmEnabled = !alarmEnabled; updateAlarmToggleUI(); }
function updateAlarmToggleUI() {
  const t = document.getElementById('alarmToggle'), k = document.getElementById('alarmToggleKnob');
  t.className = `w-12 h-7 rounded-full relative transition-colors ${alarmEnabled ? 'bg-primary' : 'bg-surface-lighter'}`;
  k.className = `w-5 h-5 rounded-full absolute top-1 transition-all shadow-sm ${alarmEnabled ? 'bg-white right-1' : 'bg-gray-400 left-1'}`;
}

// ============================================
// ALARM SYSTEM
// ============================================

function checkAlarms() {
  if (activeAlarmId) return;
  const now = new Date();
  plans.forEach(p => {
    if (!p.alarm || p.done || p.dismissed) return;
    const ev = events.find(e => e.id === p.eventId);
    if (!ev) return;
    // Don't alarm if event is past
    if (getEventDateTime(ev) < now) return;
    const [h, m] = p.time.split(':').map(Number);
    if (h === now.getHours() && m === now.getMinutes() && now.getSeconds() < 2) triggerAlarm(p, ev);
  });
}

function triggerAlarm(p, ev) {
  activeAlarmId = p.id;
  document.getElementById('alarmOverlayTask').textContent = p.task;
  document.getElementById('alarmOverlayTime').textContent = formatDisplayTime(p.time);
  document.getElementById('alarmEventLabel').textContent = ev.name;
  document.getElementById('alarmOverlay').classList.remove('hidden');
  expandFloating();
  if (soundEnabled) playAlarmSound();
  sendNotification(ev.name, `TIME TO: ${p.task}`);
  if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
}

function dismissAlarm() {
  if (!activeAlarmId) return;
  const p = plans.find(pl => pl.id === activeAlarmId);
  if (p) { p.done = true; p.dismissed = true; saveData(); }
  stopAlarm(); collapseFloating(); renderAll(); showToast('Done!');
}

function snoozeAlarm() {
  if (!activeAlarmId) return;
  const p = plans.find(pl => pl.id === activeAlarmId);
  if (p) { const n = new Date(); n.setMinutes(n.getMinutes() + 5); p.time = formatTimeValue(n); p.dismissed = false; saveData(); }
  stopAlarm(); collapseFloating(); renderAll(); showToast('Snoozed 5 min');
}

function stopAlarm() {
  activeAlarmId = null;
  document.getElementById('alarmOverlay').classList.add('hidden');
  if (navigator.vibrate) navigator.vibrate(0);
}

function playAlarmSound() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playAlarmSeq();
  } catch (e) {}
}

function playAlarmSeq() {
  if (!activeAlarmId || !soundEnabled) return;
  const now = audioCtx.currentTime;
  for (let i = 0; i < 4; i++) {
    const base = now + i * 1.0;
    beep(base, 880, 0.12); beep(base + 0.15, 1100, 0.12); beep(base + 0.3, 1320, 0.18);
  }
  setTimeout(() => { if (activeAlarmId && soundEnabled) playAlarmSeq(); }, 3500);
}

function beep(start, freq, dur) {
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination);
  o.type = 'sine'; o.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0.35, start); g.gain.exponentialRampToValueAtTime(0.01, start + dur);
  o.start(start); o.stop(start + dur);
}

function testAlarmSound() {
  const prev = activeAlarmId; activeAlarmId = 'test';
  if (soundEnabled) playAlarmSound();
  setTimeout(() => { activeAlarmId = prev; }, 3000);
  showToast('Testing alarm...');
}

// ============================================
// FLOATING OVERLAY
// ============================================

function initFloatingOverlay() {
  const ov = document.getElementById('floatingOverlay');
  floatingOverlayEnabled = localStorage.getItem('planAlarm_floatEnabled') !== 'false';
  try { floatingPos = JSON.parse(localStorage.getItem('planAlarm_floatPos') || '{}'); } catch(e) {}
  updateOverlayToggleUI();
  if (floatingOverlayEnabled && events.length > 0) ov.classList.remove('hidden');
  applyFloatingPos();
  setupFloatingDrag();
}

function applyFloatingPos() {
  const ov = document.getElementById('floatingOverlay');
  const maxX = window.innerWidth - 140, maxY = window.innerHeight - 60;
  floatingPos.x = Math.max(0, Math.min(floatingPos.x || 16, maxX));
  floatingPos.y = Math.max(0, Math.min(floatingPos.y || 100, maxY));
  ov.style.left = floatingPos.x + 'px'; ov.style.top = floatingPos.y + 'px';
}

function setupFloatingDrag() {
  const ov = document.getElementById('floatingOverlay');
  let startX, startY, offX, offY, moved;
  function onS(e) {
    e.preventDefault(); moved = false;
    const t = e.touches ? e.touches[0] : e;
    const r = ov.getBoundingClientRect();
    offX = t.clientX - r.left; offY = t.clientY - r.top;
    ov.style.transition = 'none'; ov.classList.add('dragging');
  }
  function onM(e) {
    if (!ov.classList.contains('dragging')) return; e.preventDefault(); moved = true;
    const t = e.touches ? e.touches[0] : e;
    floatingPos.x = Math.max(0, Math.min(t.clientX - offX, window.innerWidth - ov.offsetWidth));
    floatingPos.y = Math.max(0, Math.min(t.clientY - offY, window.innerHeight - ov.offsetHeight));
    ov.style.left = floatingPos.x + 'px'; ov.style.top = floatingPos.y + 'px';
  }
  function onE() {
    if (!ov.classList.contains('dragging')) return;
    ov.style.transition = ''; ov.classList.remove('dragging');
    localStorage.setItem('planAlarm_floatPos', JSON.stringify(floatingPos));
    if (!moved) floatingExpanded ? collapseFloating() : expandFloating();
  }
  ov.addEventListener('mousedown', onS); ov.addEventListener('touchstart', onS, { passive: false });
  document.addEventListener('mousemove', onM); document.addEventListener('touchmove', onM, { passive: false });
  document.addEventListener('mouseup', onE); document.addEventListener('touchend', onE);
}

function expandFloating() {
  floatingExpanded = true;
  document.getElementById('floatingCompact').classList.add('hidden');
  document.getElementById('floatingExpanded').classList.remove('hidden');
}

function collapseFloating() {
  floatingExpanded = false;
  document.getElementById('floatingExpanded').classList.add('hidden');
  document.getElementById('floatingCompact').classList.remove('hidden');
}

function updateFloatingCountdown() {
  const ov = document.getElementById('floatingOverlay');
  const ev = getActiveEvent();
  if (!ev || !floatingOverlayEnabled) { ov.classList.add('hidden'); return; }

  const cd = getCountdown(getEventDateTime(ev));
  ov.classList.remove('hidden');
  ov.classList.toggle('floating-alarming', activeAlarmId !== null);

  // Compact
  const dot = document.getElementById('floatingDot');
  let compactTxt = '';
  if (cd.isPast) { compactTxt = 'PASSED'; dot.className = 'w-2.5 h-2.5 rounded-full flex-shrink-0 bg-success'; }
  else if (cd.weeks > 0) { compactTxt = `${cd.weeks}w ${cd.days}d`; dot.className = 'w-2.5 h-2.5 rounded-full flex-shrink-0 bg-primary'; }
  else if (cd.days > 0) { compactTxt = `${cd.days}d ${pad(cd.hours)}:${pad(cd.minutes)}`; dot.className = 'w-2.5 h-2.5 rounded-full flex-shrink-0 bg-primary'; }
  else { compactTxt = `${pad(cd.hours)}:${pad(cd.minutes)}:${pad(cd.seconds)}`; dot.className = 'w-2.5 h-2.5 rounded-full flex-shrink-0 bg-warning animate-pulse'; }
  document.getElementById('floatingTime').textContent = compactTxt;

  // Next plan label
  const todayPlans = getEventPlansToday().filter(p => !p.done && !p.dismissed).sort((a,b) => a.time.localeCompare(b.time));
  const now = new Date(); const curMin = now.getHours() * 60 + now.getMinutes();
  const next = todayPlans.find(p => { const [h,m] = p.time.split(':').map(Number); return h*60+m > curMin; });
  document.getElementById('floatingTaskLabel').textContent = next ? truncate(next.task, 15) : (cd.isPast ? 'Event passed' : 'No more plans');

  // Expanded
  document.getElementById('floatingEventLabel').textContent = ev.name;
  document.getElementById('cdWeeks').textContent = cd.weeks;
  document.getElementById('cdDays').textContent = cd.days;
  document.getElementById('cdHours').textContent = pad(cd.hours);
  document.getElementById('cdMinutes').textContent = pad(cd.minutes);
  document.getElementById('cdSeconds').textContent = pad(cd.seconds);
  document.getElementById('floatingTaskName').textContent = next ? next.task : (cd.isPast ? 'Event passed!' : 'All done');
  document.getElementById('floatingTaskTime').textContent = next ? formatDisplayTime(next.time) : '';
  document.getElementById('floatingAlarmActions').classList.toggle('hidden', !activeAlarmId);
}

function toggleFloatingOverlay() {
  floatingOverlayEnabled = !floatingOverlayEnabled;
  localStorage.setItem('planAlarm_floatEnabled', floatingOverlayEnabled);
  updateOverlayToggleUI();
  if (!floatingOverlayEnabled) document.getElementById('floatingOverlay').classList.add('hidden');
  else if (events.length > 0) document.getElementById('floatingOverlay').classList.remove('hidden');
  showToast(floatingOverlayEnabled ? 'Overlay on' : 'Overlay off');
}

function updateOverlayToggleUI() {
  const t = document.getElementById('overlayToggleBtn'), k = document.getElementById('overlayToggleKnob');
  t.className = `w-12 h-7 rounded-full relative transition-colors ${floatingOverlayEnabled ? 'bg-primary' : 'bg-surface-lighter'}`;
  k.className = `w-5 h-5 rounded-full absolute top-1 transition-all shadow-sm ${floatingOverlayEnabled ? 'bg-white right-1' : 'bg-gray-400 left-1'}`;
}

// ============================================
// ONBOARDING
// ============================================

function grantNotificationPerm() {
  if (!('Notification' in window)) { showToast('Not supported'); return; }
  Notification.requestPermission().then(p => {
    updatePermStatuses();
    showToast(p === 'granted' ? 'Notifications on!' : 'Denied');
  });
}

function showOverlayInfo() {
  const m = document.getElementById('overlayInfoModal'); m.classList.remove('hidden');
  requestAnimationFrame(() => { document.getElementById('overlayInfoContent').style.transform = 'translateY(0)'; });
  localStorage.setItem('planAlarm_overlayInfoSeen', 'true');
  updatePermStatuses();
}

function closeOverlayInfo() {
  document.getElementById('overlayInfoContent').style.transform = 'translateY(100%)';
  setTimeout(() => { document.getElementById('overlayInfoModal').classList.add('hidden'); }, 300);
}

function updatePermStatuses() {
  const n = document.getElementById('permNotifStatus');
  if ('Notification' in window && Notification.permission === 'granted') { n.textContent = 'Granted'; n.className = 'inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 uppercase'; }
  else if ('Notification' in window && Notification.permission === 'denied') { n.textContent = 'Denied'; n.className = 'inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 uppercase'; }
  const o = document.getElementById('permOverlayStatus');
  if (localStorage.getItem('planAlarm_overlayInfoSeen') === 'true') { o.textContent = 'Info Seen'; o.className = 'inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 uppercase'; }
}

function finishOnboarding() {
  localStorage.setItem('planAlarm_onboarded', 'true');
  document.getElementById('onboardingScreen').style.animation = 'fadeOut 0.3s ease-out forwards';
  setTimeout(() => {
    document.getElementById('onboardingScreen').classList.add('hidden');
    document.getElementById('onboardingScreen').style.animation = '';
    initFloatingOverlay();
  }, 300);
}

function showOnboarding() { closeSettings(); setTimeout(() => { document.getElementById('onboardingScreen').classList.remove('hidden'); updatePermStatuses(); }, 350); }

// ============================================
// NOTIFICATIONS
// ============================================

function requestNotificationPermission() {
  if (!('Notification' in window)) { showToast('Not supported'); return; }
  Notification.requestPermission().then(p => { updateNotifStatus(); showToast(p === 'granted' ? 'On!' : 'Denied'); });
}

function sendNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try { new Notification(title, { body, icon: 'icon.png', tag: 'plan-alarm', requireInteraction: true, vibrate: [200,100,200] }); } catch(e) {}
  }
}

function updateNotifStatus() {
  const el = document.getElementById('notifStatus');
  if (!('Notification' in window)) el.textContent = 'Not supported';
  else if (Notification.permission === 'granted') { el.textContent = 'Enabled'; el.classList.add('text-success'); }
  else if (Notification.permission === 'denied') el.textContent = 'Blocked';
  else el.textContent = 'Tap Enable';
}

// ============================================
// SOUND
// ============================================

function toggleSound() { soundEnabled = !soundEnabled; saveData(); updateSoundIcon(); showToast(soundEnabled ? 'Sound on' : 'Sound off'); }
function updateSoundIcon() {
  document.getElementById('soundOnIcon').classList.toggle('hidden', !soundEnabled);
  document.getElementById('soundOffIcon').classList.toggle('hidden', soundEnabled);
}

// ============================================
// SETTINGS
// ============================================

function openSettings() {
  document.getElementById('settingsModal').classList.remove('hidden'); updateNotifStatus(); updateOverlayToggleUI();
  requestAnimationFrame(() => { document.getElementById('settingsContent').style.transform = 'translateY(0)'; });
}
function closeSettings() {
  document.getElementById('settingsContent').style.transform = 'translateY(100%)';
  setTimeout(() => { document.getElementById('settingsModal').classList.add('hidden'); }, 300);
}

function clearAllData() {
  if (!confirm('Delete ALL events and plans? Cannot undo.')) return;
  events = []; plans = []; activeEventId = null; saveData(); renderAll(); showToast('All data cleared');
}

// ============================================
// UTILS
// ============================================

function shakeEl(el) { el.style.animation = 'shake 0.4s ease-in-out'; el.classList.add('border-danger'); setTimeout(() => { el.style.animation = ''; el.classList.remove('border-danger'); }, 500); }

function showToast(msg) {
  const old = document.getElementById('toast'); if (old) old.remove();
  const t = document.createElement('div'); t.id = 'toast';
  t.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[9999] bg-surface-lighter text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-xl border border-white/10';
  t.style.animation = 'toastIn 0.2s ease-out'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.animation = 'toastOut 0.2s ease-in forwards'; setTimeout(() => t.remove(), 200); }, 2000);
}

// Service Worker
if ('serviceWorker' in navigator) window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
