"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS: {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
}[] = [
  { href: "/", label: "Inicio", match: (p) => p === "/" },
  { href: "/guia", label: "Mi plan", match: (p) => p.startsWith("/guia") },
  {
    href: "/herramientas",
    label: "Herramientas",
    match: (p) => p.startsWith("/herramientas") || p.startsWith("/ats"),
  },
  { href: "/capacidades", label: "Mapa", match: (p) => p.startsWith("/capacidades") },
  { href: "/tracker", label: "Tracker", match: (p) => p.startsWith("/tracker") },
  { href: "/precios", label: "Precios", match: (p) => p.startsWith("/precios") },
  { href: "/cuenta", label: "Cuenta", match: (p) => p.startsWith("/cuenta") },
];

export function MainNav() {
  const pathname = usePathname() || "/";

  return (
    <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm" aria-label="Principal">
      {LINKS.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={active ? "font-semibold" : "muted hover:opacity-80"}
            style={active ? { color: "var(--text)" } : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
