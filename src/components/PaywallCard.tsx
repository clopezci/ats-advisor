"use client";

import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { planLabel, type PlanId } from "@/lib/entitlements";

export function PaywallCard({
  title = "Esto es parte de Carrera",
  reason,
  currentPlan = "free",
  nextHref,
}: {
  title?: string;
  reason: string;
  currentPlan?: PlanId;
  /** Ruta a retomar tras pagar (se codifica en /precios?next=). */
  nextHref?: string;
}) {
  const next = nextHref && nextHref.startsWith("/") ? nextHref : "/guia?recorrido=1";
  const preciosHref = `/precios?plan=carrera&next=${encodeURIComponent(next)}`;

  return (
    <section className="bento-card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="pill-brand">Plan actual: {planLabel(currentPlan)}</p>
          <h2 className="mt-2 text-lg font-semibold">{title}</h2>
        </div>
        <SpeakButton text={`${title}. ${reason}. Puedes ver precios del plan Carrera.`} />
      </div>
      <p className="text-sm muted">{reason}</p>
      <Link href={preciosHref} className="btn-primary">
        Ver precios / Activar Carrera
      </Link>
      <Link href="/ats" className="btn-secondary">
        Seguir con ATS gratis
      </Link>
    </section>
  );
}
