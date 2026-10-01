/* ATSAdvisor service worker — solo offline mínimo.
 * No cachear navegación ni chunks de Next.js: eso hincha el caché y puede congelar Chrome. */
const CACHE = "atsadvisor-f24-offline-v1";
const PRECACHE = ["/offline", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // Navegación HTML / RSC / assets de la app: siempre red. Sin cache.put.
  const isNavigate = event.request.mode === "navigate";
  const isAppAsset =
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/ats") ||
    url.pathname.startsWith("/outplacement") ||
    url.pathname.startsWith("/herramientas") ||
    url.pathname === "/" ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css");

  if (isNavigate || isAppAsset) {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match("/offline").then((r) => r || new Response("Sin conexión", { status: 503 }))
      )
    );
    return;
  }

  // Solo iconos / estáticos chicos: network-first sin llenar el caché en cada visita.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request).then((r) => r || caches.match("/offline")))
  );
});
