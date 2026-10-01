"use client";

import { useEffect, useRef, useState } from "react";

/** Guarda un borrador en este dispositivo y lo recupera al volver, incluso con atrás del navegador. */
export function useJsonDraft<T>(key: string, value: T, onLoad: (saved: T) => void) {
  const [ready, setReady] = useState(false);
  const lastWritten = useRef("");
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        if (parsed && typeof parsed === "object") onLoadRef.current(parsed);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    let serial = "";
    try {
      serial = JSON.stringify(value);
    } catch {
      return;
    }
    if (serial === lastWritten.current) return;

    const write = () => {
      if (serial === lastWritten.current) return;
      try {
        localStorage.setItem(key, serial);
        lastWritten.current = serial;
      } catch {
        /* ignore quota */
      }
    };
    const id = window.setTimeout(write, 400);
    return () => {
      window.clearTimeout(id);
    };
  }, [key, ready, value]);
}
