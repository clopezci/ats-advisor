"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { resolveContinueTarget } from "@/lib/engagement/focusPath";

/** Nav lean: Inicio · Continuar · Psicotécnicas · Cuenta */
export function MainNav() {
  const pathname = usePathname() || "/";
  const [hoyHref, setHoyHref] = useState("/");

  useEffect(() => {
    try {
      setHoyHref(resolveContinueTarget().href);
    } catch {
      setHoyHref("/");
    }
  }, [pathname]);

  const items = [
    { href: "/", label: "Inicio", active: pathname === "/" },
    {
      href: hoyHref,
      label: "Continuar",
      active: false,
    },
    {
      href: "/ats",
      label: "ATS",
      active: pathname === "/ats" || pathname.startsWith("/ats/"),
    },
    {
      href: "/outplacement/psicotecnicas",
      label: "Psicotécnicas",
      active: pathname.startsWith("/outplacement/psicotecnicas") || pathname === "/psicotecnicas",
    },
    { href: "/cuenta", label: "Cuenta", active: pathname.startsWith("/cuenta") },
  ];

  return (
    <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm" aria-label="Principal">
      {items.map((item) => (
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
    </nav>
  );
}
