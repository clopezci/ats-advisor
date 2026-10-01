/* ATSAdvisor — sin service worker activo.
 * No interceptar red. No navegar clientes. No cachear.
 * Si Chrome aún tiene un SW viejo registrado, el cliente lo desregistra. */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch {
        /* ignore */
      }
      try {
        await self.registration.unregister();
      } catch {
        /* ignore */
      }
      // NUNCA client.navigate(): provoca recargas en bucle y congela Chrome.
    })()
  );
});
