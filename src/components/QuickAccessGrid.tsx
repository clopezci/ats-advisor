"use client";

import Link from "next/link";

/** Accesos siempre visibles: cero fricción, sin depender de la ruta elegida. */
export const QUICK_LINKS = [
  {
    href: "/ats",
    title: "Analizar CV",
    desc: "Gratis · tu CV vs una vacante",
  },
  {
    href: "/outplacement/psicotecnicas",
    title: "Psicotécnicas",
    desc: "Gratis · fichas y pruebas para estudiar",
  },
  {
    href: "/tracker",
    title: "Tracker",
    desc: "Gratis · anota tus postulaciones",
  },
  {
    href: "/outplacement/cuadernillo",
    title: "Cuadernillo Carrera",
    desc: "Plan Carrera · paso a paso",
  },
] as const;

export function QuickAccessGrid({
  highlightHref,
}: {
  highlightHref?: string;
}) {
  return (
    <section className="space-y-2">
      <h2 className="font-semibold text-sm">Acceder ahora</h2>
      <p className="text-xs muted leading-relaxed">
        Todo a un toque. Estudiar psicotécnicas es gratis; la práctica con IA se paga aparte.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {QUICK_LINKS.map((l) => {
          const on = highlightHref && l.href.startsWith(highlightHref);
          return (
            <Link
              key={l.href}
              href={l.href}
              className="bento-card block !p-3 space-y-0.5"
              style={
                on
                  ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                  : undefined
              }
            >
              <span className="font-semibold text-sm">{l.title}</span>
              <span className="block text-xs muted">{l.desc}</span>
            </Link>
          );
        })}
      </div>
      <Link href="/herramientas" className="text-xs underline muted">
        Ver todas las herramientas
      </Link>
    </section>
  );
}
