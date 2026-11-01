/**
 * Salfa Flow - Service Worker V1 (Android & Offline Terreno)
 * Ecosistema: Portales Salfa Pilotos · Salfa Montajes
 */

const CACHE_NAME = 'salfa-flow-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/apple-touch-icon.png',
  './assets/logo-salfa-montajes-claro.svg',
  './assets/logo-salfa-montajes-oscuro.svg',
  './assets/logo-salfa-montajes-mono-blanco.svg',
  './assets/logo-salfa-montajes-mono-rojo.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // No interceptar peticiones POST ni llamadas externas de APIs
  if (request.method !== 'GET') return;
  if (request.url.includes('script.google.com') || request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // En segundo plano intentamos actualizar el cache (Stale-while-revalidate)
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse.clone()));
          }
        }).catch(() => {
          // Si estamos offline en faena, no pasa nada, ya servimos el cachedResponse
        });
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Si falla la red y es navegación HTML, retornar index.html en cache
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
