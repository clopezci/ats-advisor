"use client";

import { useEffect } from "react";

export function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    let cancelled = false;
    (async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        // Fuerza tomar el SW nuevo (deja de cachear toda la app).
        await reg.update().catch(() => undefined);
        if (cancelled) return;
        if (reg.waiting) {
          reg.waiting.postMessage?.({ type: "SKIP_WAITING" });
        }
      } catch {
        /* silencioso en local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
