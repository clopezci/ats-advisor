"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PaywallCard } from "@/components/PaywallCard";
import {
  canAccessOutplacement,
  readEntitlement,
  type PlanId,
} from "@/lib/entitlements";
import { isFreeAppPath } from "@/lib/entitlements/freePaths";
import { CAREER_PATH_LABEL } from "@/lib/outplacement/labels";

/**
 * Bloquea herramientas / ATS avanzado si no hay Carrera.
 * Deja pasar las rutas gratis (ATS, encaje, tracker, checklist, salario, hubs).
 */
export function PaidToolGate({ children }: { children: ReactNode }) {
  const path = usePathname() || "/";
  const [plan, setPlan] = useState<PlanId | null>(null);

  useEffect(() => {
    setPlan(readEntitlement().plan);
  }, [path]);

  if (isFreeAppPath(path)) return <>{children}</>;

  if (plan === null) {
    return <p className="text-sm muted">Cargando acceso…</p>;
  }

  if (canAccessOutplacement(plan)) return <>{children}</>;

  const resume = path.startsWith("/") ? path : "/guia?recorrido=1";
  const preciosHref = `/precios?plan=carrera&next=${encodeURIComponent(resume)}`;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <PaywallCard
        currentPlan={plan}
        nextHref={resume}
        title="Incluido en el plan Carrera"
        reason={`Esta herramienta forma parte del acompañamiento Carrera (${CAREER_PATH_LABEL}, LinkedIn, carta, entrevistas, negociación…). Gratis: analizador de CV, encaje rápido, tracker, checklist y bandas salariales.`}
      />
      <Link href="/ats" className="btn-secondary">
        Seguir con el analizador gratis
      </Link>
    </div>
  );
}
