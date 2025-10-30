// API Master Service Worker
const CACHE_NAME = 'api-master-v1';
const urlsToCache = [
  './api-master.html',
  './api-master.css',
  './api-master.js',
  './manifest-api-master.json',
  './api-master-icon-192.png',
  './api-master-icon-512.png'
];

// Installation - Cache erstellen
self.addEventListener('install', (event) => {
  console.log('[SW] Installing API Master Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[SW] Cache installation failed:', error);
      })
  );
  self.skipWaiting();
});

// Aktivierung - Alte Caches löschen
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating API Master Service Worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - Cache-First-Strategie
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('[SW] Serving from cache:', request.url);
          return response;
        }

        // Clone the request
        const fetchRequest = request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching new resource:', request.url);
            cache.put(request, responseToCache);
          });

          return response;
        }).catch((error) => {
          console.error('[SW] Fetch failed:', error);
          // Return offline page or fallback if needed
          return new Response('Offline - Bitte überprüfe deine Internetverbindung', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Background sync for future features
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-api-keys') {
    console.log('[SW] Background sync triggered');
    // Future: Sync API keys with backend
  }
});

// Push notifications for future features
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log('[SW] Push notification received:', data);

    const options = {
      body: data.body,
      icon: './api-master-icon-192.png',
      badge: './api-master-icon-72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');
  event.notification.close();

  event.waitUntil(
    clients.openWindow('./api-master.html')
  );
});
