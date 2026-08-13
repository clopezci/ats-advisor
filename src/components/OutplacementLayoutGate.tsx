"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PaywallCard } from "@/components/PaywallCard";
import {
  canAccessOutplacement,
  readEntitlement,
  type PlanId,
} from "@/lib/entitlements";

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
          reason="Esta herramienta de acompañamiento (entrevistas, red, rumbo, bienestar, oferta…) está incluida en Carrera. Las herramientas gratis de CV y ATS siguen en Herramientas."
        />
      </div>
    );
  }

  return <>{children}</>;
}
