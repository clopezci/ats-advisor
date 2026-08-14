"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PaywallCard } from "@/components/PaywallCard";
import {
  canAccessOutplacement,
  readEntitlement,
  type PlanId,
} from "@/lib/entitlements";
import { CAREER_PATH_LABEL } from "@/lib/outplacement/labels";

/** Rutas abiertas sin plan (hub, marketplace de expertos). */
function isOpenPath(path: string) {
  if (path === "/outplacement") return true;
  if (path.startsWith("/outplacement/experto")) return true;
  if (path.startsWith("/outplacement/marketplace")) return true;
  return false;
}

function isPaused90Allowed(path: string) {
  return path.startsWith("/outplacement/90-dias") || path.startsWith("/outplacement/certificado");
}

/**
 * Bloquea módulos de carrera si no hay plan pago.
 * El hub y expertos quedan abiertos (el hub ya muestra PaywallCard).
 */
export function OutplacementLayoutGate({ children }: { children: ReactNode }) {
  const path = usePathname() || "/outplacement";
  const [plan, setPlan] = useState<PlanId | null>(null);

  useEffect(() => {
    setPlan(readEntitlement().plan);
  }, [path]);

  if (isOpenPath(path)) return <>{children}</>;

  if (plan === null) {
    return <p className="text-sm muted">Cargando acceso…</p>;
  }

  if (plan === "paused_90" && isPaused90Allowed(path)) {
    return <>{children}</>;
  }

  if (!canAccessOutplacement(plan)) {
    return (
      <div className="flex flex-1 flex-col gap-5">
        <PaywallCard
          currentPlan={plan}
          title="Esto es parte del plan Carrera"
          reason={`Esta herramienta de acompañamiento está en el plan Carrera (${CAREER_PATH_LABEL} + práctica, red, oferta…). Gratis: analizador ATS, encaje rápido y tracker.`}
        />
      </div>
    );
  }

  return <>{children}</>;
}
