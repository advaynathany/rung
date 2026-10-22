// Keeps the prototype working without a connection once it has loaded.
const CACHE = "rung-try-v1";
const FILES = ["./", "index.html", "app.css", "app.js", "ladders.js", "manifest.webmanifest", "../favicon.svg",
  "../fonts/hind-400-latin.woff2", "../fonts/hind-400-devanagari.woff2", "../fonts/hind-600-latin.woff2",
  "../fonts/hind-600-devanagari.woff2", "../fonts/kalam-700-latin.woff2", "../fonts/kalam-700-devanagari.woff2"];

self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first so updates arrive; the cache is the fallback when offline.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then((r) => {
    if (r.ok && new URL(e.request.url).origin === location.origin) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
