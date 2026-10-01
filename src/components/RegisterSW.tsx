"use client";

import { useEffect } from "react";

const HEAVY_KEYS = [
  "ats_wizard_draft",
  "ats_workspace",
  "ats_last_result",
  "ats_psico_draft",
];

/** Límite seguro: textos de CV+oferta caben; un result ATS enorme no debe vivir en cada tecla. */
const MAX_KEY_CHARS = 400_000;

function trimHeavyStorage() {
  try {
    for (const key of HEAVY_KEYS) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      if (raw.length > MAX_KEY_CHARS) {
        localStorage.removeItem(key);
        continue;
      }
      // Borrador ATS: si trae result enorme, guarda solo textos.
      if (key === "ats_wizard_draft" || key === "ats_workspace") {
        try {
          const parsed = JSON.parse(raw) as Record<string, unknown>;
          if (parsed && typeof parsed === "object" && parsed.result != null) {
            const light = { ...parsed, result: null };
            const next = JSON.stringify(light);
            if (next.length < raw.length * 0.7) localStorage.setItem(key, next);
          }
        } catch {
          /* ignore */
        }
      }
    }
  } catch {
    /* ignore */
  }
}

/**
 * Desregistra service workers viejos (causa #1 de pestaña congelada en Chrome)
 * y recorta localStorage hinchado.
 */
export function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    trimHeavyStorage();

    if (!("serviceWorker" in navigator)) return;
    let cancelled = false;

    (async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
        if (cancelled) return;
        // Una sola vez: instala SW asesino que limpia caches y se auto-borra.
        const killed = sessionStorage.getItem("ats_sw_cleaned");
        if (!killed) {
          await navigator.serviceWorker.register("/sw.js").catch(() => undefined);
          sessionStorage.setItem("ats_sw_cleaned", "1");
          // Tras activar, vuelve a desregistrar por si quedó colgado.
          window.setTimeout(async () => {
            try {
              const again = await navigator.serviceWorker.getRegistrations();
              await Promise.all(again.map((r) => r.unregister()));
            } catch {
              /* ignore */
            }
          }, 2500);
        }
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } catch {
        /* silencioso */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
