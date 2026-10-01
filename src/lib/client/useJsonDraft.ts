"use client";

import { useEffect, useRef, useState } from "react";

/** Guarda un borrador liviano. No reescribe si el contenido no cambió. */
export function useJsonDraft<T>(key: string, value: T, onLoad: (saved: T) => void) {
  const [ready, setReady] = useState(false);
  const lastWritten = useRef("");
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;
  // Serial estable: evita efecto en cada render por identidad de objeto.
  const serial = (() => {
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  })();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        lastWritten.current = raw;
        const parsed = JSON.parse(raw) as T;
        if (parsed && typeof parsed === "object") onLoadRef.current(parsed);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready || !serial) return;
    if (serial === lastWritten.current) return;
    const id = window.setTimeout(() => {
      if (serial === lastWritten.current) return;
      try {
        localStorage.setItem(key, serial);
        lastWritten.current = serial;
      } catch {
        /* ignore quota */
      }
    }, 700);
    return () => window.clearTimeout(id);
  }, [key, ready, serial]);
}
