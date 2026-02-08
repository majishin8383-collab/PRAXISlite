// sw.js — Praxis Lite (minimal + safe) — v2
const CACHE = "praxis-lite-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",

  "./styles/base.css",
  "./styles/components.css",
  "./styles/home.css",
  "./styles/flows.css",
  "./styles/redzone.css",
  "./styles/lite-mobile.css",

  "./js/lite/app.js",
  "./js/lite/router.js",
  "./js/lite/screens.home.js",
  "./js/lite/screens.stabilize.js",
  "./js/lite/screens.stopurge.js",
  "./js/lite/screens.emergency.js",
  "./js/lite/screens.moveforward.js",
  "./js/lite/screens.closure.js",

  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Allow page to force-activate an updated SW
self.addEventListener("message", (event) => {
  if (event?.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k)))))
      .then(() => self.clients.claim())
  );
});

// Network-first for navigations; cache-first for assets (query-safe)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin !== self.location.origin) return;
  if (req.method !== "GET") return;

  const accept = req.headers.get("accept") || "";
  const isNav = req.mode === "navigate" || accept.includes("text/html");

  if (isNav) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html", { ignoreSearch: true }))
    );
    return;
  }

  event.respondWith(
    caches.match(req, { ignoreSearch: true })
      .then((cached) => {
        if (cached) return cached;

        return fetch(req)
          .then((res) => {
            // Cache successful same-origin responses
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => cached || new Response("", { status: 504, statusText: "Offline" }));
      })
  );
});
