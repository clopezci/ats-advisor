"use client";

import { useEffect } from "react";

const HEAVY_KEYS = [
  "ats_wizard_draft",
  "ats_workspace",
  "ats_last_result",
  "ats_wizard_result_v1",
  "ats_psico_draft",
];

const MAX_KEY_CHARS = 250_000;

function trimHeavyStorage() {
  try {
    for (const key of HEAVY_KEYS) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      if (raw.length > MAX_KEY_CHARS) {
        localStorage.removeItem(key);
        continue;
      }
      if (key === "ats_wizard_draft" || key === "ats_workspace" || key === "ats_last_result") {
        try {
          const parsed = JSON.parse(raw) as Record<string, unknown>;
          if (parsed && typeof parsed === "object" && parsed.result != null) {
            const { result: _drop, ...rest } = parsed;
            localStorage.setItem(key, JSON.stringify(rest));
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
 * Solo LIMPIA service workers y storage hinchado.
 * Nunca vuelve a registrar un SW (el registro + navigate congelaba Chrome).
 */
export function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    trimHeavyStorage();

    // Parar voz colgada de visitas anteriores.
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }

    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;
    (async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister().catch(() => false)));
        if (cancelled) return;
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
