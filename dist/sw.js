const CACHE = 'autogoat-v2';
// use relative paths so it works under a subpath like /contrastive-goat/
const ASSETS = ['./', './index.html', './404.html', './manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(res =>
      res || fetch(e.request).catch(() => caches.match('./'))
    )
  );
});