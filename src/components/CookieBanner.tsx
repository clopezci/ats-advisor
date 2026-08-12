"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const EVENT = "ats-open-cookie-prefs";

export function openCookiePrefs() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT));
}

export function CookiePrefsButton() {
  return (
    <button type="button" className="hover:opacity-80 underline-offset-2 hover:underline" onClick={openCookiePrefs}>
      Preferencias de cookies
    </button>
  );
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem("ats_cookie_ok");
      setChoice(v);
      if (!v) setShow(true);
    } catch {
      setShow(true);
    }
    const open = () => setShow(true);
    window.addEventListener(EVENT, open);
    return () => window.removeEventListener(EVENT, open);
  }, []);

  if (!show) return null;

  function save(value: "1" | "essential") {
    localStorage.setItem("ats_cookie_ok", value);
    setChoice(value);
    setShow(false);
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[80] mx-auto max-w-lg p-4"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="bento-card space-y-3 shadow-lg" style={{ background: "var(--surface, #fff)" }}>
        <p className="text-sm font-medium">Cookies y anuncios</p>
        <p className="text-sm muted">
          Usamos almacenamiento técnico para que la app funcione. Si aceptas, también podemos mostrar
          anuncios propios LOTIC (p. ej. ArriendoSeguro) y, cuando estén configurados, de Google u
          otros operadores.{" "}
          <Link href="/legal/cookies" style={{ color: "var(--brand)" }}>
            Más información
          </Link>
        </p>
        {choice && (
          <p className="text-xs muted">
            Elección actual: {choice === "essential" ? "solo esenciales" : "aceptadas (incluye anuncios)"}.
          </p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" className="btn-primary" onClick={() => save("1")}>
            Aceptar
          </button>
          <button type="button" className="btn-secondary" onClick={() => save("essential")}>
            Solo esenciales
          </button>
        </div>
      </div>
    </div>
  );
}
