const CACHE = 'qa-v1';
const SOUBORY = [
  '/quality-alert/index.html',
  '/quality-alert/manifest.json',
  '/quality-alert/icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SOUBORY))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
      .catch(() => caches.match('/quality-alert/index.html'))
  );
});
