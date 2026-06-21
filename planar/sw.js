// ============================================
// PlanAlarm Service Worker
// Handles background alarm notifications
// ============================================

const CACHE_NAME = 'planalarm-v1';

// Install - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/app.js',
        '/app.css',
        '/icon.png',
        '/manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch - serve from cache first, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

// Background alarm check - runs periodically
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_ALARMS') {
    checkAlarmsFromSW();
  }
});

// Periodic background sync if supported
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-alarms') {
    event.waitUntil(checkAlarmsFromSW());
  }
});

async function checkAlarmsFromSW() {
  // We can't access localStorage from SW, but we can show
  // a notification to prompt the user to open the app
  // The main alarm logic runs in the foreground
  try {
    const clients = await self.clients.matchAll({ type: 'window' });
    if (clients.length === 0) {
      // App is in background - send a reminder
      self.registration.showNotification('PlanAlarm', {
        body: 'Open the app to see your next plan!',
        icon: '/icon.png',
        badge: '/icon.png',
        tag: 'background-reminder',
        vibrate: [200, 100, 200],
      });
    }
  } catch (e) {}
}
