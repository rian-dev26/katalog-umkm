// Nama cache dan daftar file yang di-cache saat install
const CACHE_NAME = "katalog-umkm-v1";
const PRECACHE_URLS = [
  "/",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Install: simpan file penting ke cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: hapus cache lama
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first untuk navigasi, cache-first untuk aset statis
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Abaikan request non-GET
  if (request.method !== "GET") return;

  // Abaikan request ke Supabase atau API eksternal
  if (request.url.includes("supabase") || request.url.includes("/api/")) return;

  // Navigasi halaman: coba network dulu, fallback ke cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  // Aset statis (gambar, CSS, JS, font): cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Hanya cache response yang valid
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    })
  );
});
