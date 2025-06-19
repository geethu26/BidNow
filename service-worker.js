const CACHE_NAME = "my-pwa-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/login.html",
  "/signup.html",
  "/contact.html",
  "/live-auction.html",
  "/user-homepage.html",
  "/mybid.html",
  "/dist/auction.js",
  "/js/auth.js",
  "/src/auction.js",
  "/data.json",
  "/images/hero.jpg",
  "/style.css",
  "/spa-router.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Install the service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Intercept fetch requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Activate the service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      )
    )
  );
});
