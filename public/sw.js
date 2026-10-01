/* ATSAdvisor — SW de limpieza.
 * Versiones anteriores cacheaban toda la app y congelaban Chrome.
 * Este SW se desregistra solo y borra caches; no intercepta fetch. */
const KILL = "atsadvisor-kill-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      try {
        await caches.open(KILL).then((c) => c.put("/__sw_killed", new Response("1")));
      } catch {
        /* ignore */
      }
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.navigate?.(client.url).catch?.(() => undefined);
      }
    })()
  );
});

/* Sin handler fetch: el navegador habla directo con la red. */
