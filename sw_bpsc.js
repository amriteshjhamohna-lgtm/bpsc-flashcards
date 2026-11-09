const CACHE_NAME = 'bpsc-flashcards-v2';
const ASSETS_TO_CACHE = [
  '/bpsc-flashcards/',
  '/bpsc-flashcards/index.html',
  '/bpsc-flashcards/manifest.json',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Flashcard.svg/192px-Flashcard.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Flashcard.svg/512px-Flashcard.svg.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => console.error('Cache addAll failed:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
                  .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found, else fetch from network
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      // If both fail (e.g., offline and not in cache), return index.html as fallback
       return caches.match('/bpsc-flashcards/index.html');
    })
  );
});
