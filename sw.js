var staticCacheName = "pwa-GW" + new Date().getTime();
var filesToCache = [
    '/',
    'index.html',
    'offline.html',
    'about.html',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
    'build/css/style.css',

    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
    'build/js/script.js',

    'build/images/icons/app-icon-48x48.png',
    'build/images/icons/app-icon-96x96.png',
    'build/images/icons/app-icon-144x144.png',
    'build/images/icons/app-icon-192x192.png',
    'build/images/icons/app-icon-256x256.png',
    'build/images/icons/app-icon-384x384.png',
    'build/images/icons/app-icon-512x512.png',


    'build/images/pix1.jpg',
    'build/images/pix2.jpg',
];

// Cache on install
self.addEventListener("install", event => {
    console.log('[Service Worker] Installing Service Worker ...', event);
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating Service Worker ....', event);
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("pwa-GW")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('offline.html');
            })
    )
});