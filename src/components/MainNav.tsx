"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { resolveContinueTarget } from "@/lib/engagement/focusPath";

/** Nav lean: Inicio, Hoy (Continuar), Cuenta + Más siempre visible. */
export function MainNav() {
  const pathname = usePathname() || "/";
  const [hoyHref, setHoyHref] = useState("/");
  const [more, setMore] = useState(false);

  useEffect(() => {
    try {
      setHoyHref(resolveContinueTarget().href);
    } catch {
      setHoyHref("/");
    }
  }, [pathname]);

  const primary = [
    { href: "/", label: "Inicio", active: pathname === "/" },
    {
      href: hoyHref,
      label: "Hoy",
      active:
        pathname.startsWith("/outplacement/cuadernillo") ||
        pathname.startsWith("/ats") ||
        pathname.startsWith("/outplacement/ruta"),
    },
    { href: "/cuenta", label: "Cuenta", active: pathname.startsWith("/cuenta") },
  ];

  const extras = [
    { href: "/ats", label: "ATS gratis" },
    { href: "/tracker", label: "Tracker" },
    { href: "/herramientas", label: "Herramientas" },
    { href: "/guia", label: "Mi plan" },
    { href: "/outplacement", label: "Carrera" },
    { href: "/capacidades", label: "Mapa" },
    { href: "/precios", label: "Precios" },
  ];

  return (
    <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm" aria-label="Principal">
      {primary.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={item.active ? "font-semibold" : "muted hover:opacity-80"}
          style={item.active ? { color: "var(--text)" } : undefined}
        >
          {item.label}
        </Link>
      ))}
      <button
        type="button"
        className="muted hover:opacity-80"
        onClick={() => setMore((v) => !v)}
        aria-expanded={more}
      >
        Más {more ? "▴" : "▾"}
      </button>
      {more
        ? extras.map((item) => (
            <Link key={item.href} href={item.href} className="muted hover:opacity-80">
              {item.label}
            </Link>
          ))
        : null}
    </nav>
  );
}
