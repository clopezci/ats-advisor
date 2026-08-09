"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("ats_cookie_ok")) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg p-4"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="bento-card space-y-3 shadow-lg">
        <p className="text-sm">
          Usamos cookies técnicas necesarias para la PWA. Si aceptas, también podemos mostrar
          anuncios propios LOTIC (p. ej. ArriendoSeguro) y, cuando estén configurados, de Google u
          otros operadores.{" "}
          <Link href="/legal/cookies" style={{ color: "var(--brand)" }}>
            Cookies
          </Link>{" "}
          ·{" "}
          <Link href="/legal/privacidad" style={{ color: "var(--brand)" }}>
            Privacidad
          </Link>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              localStorage.setItem("ats_cookie_ok", "1");
              setShow(false);
            }}
          >
            Aceptar
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              localStorage.setItem("ats_cookie_ok", "essential");
              setShow(false);
            }}
          >
            Solo esenciales
          </button>
        </div>
      </div>
    </div>
  );
}
