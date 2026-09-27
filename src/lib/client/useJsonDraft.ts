"use client";

import { useEffect, useState } from "react";

/** Guarda un borrador en este dispositivo y lo recupera al volver, incluso con atrás del navegador. */
export function useJsonDraft<T>(key: string, value: T, onLoad: (saved: T) => void) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        if (parsed && typeof parsed === "object") onLoad(parsed);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
    // onLoad is stable enough for mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    const serial = JSON.stringify(value);
    const write = () => {
      try {
        localStorage.setItem(key, serial);
      } catch {
        /* ignore */
      }
    };
    const id = window.setTimeout(write, 250);
    return () => {
      window.clearTimeout(id);
      write();
    };
  }, [key, ready, value]);
}
