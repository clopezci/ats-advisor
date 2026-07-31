"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { PaywallCard } from "@/components/PaywallCard";
import {
  canAccessOutplacement,
  planLabel,
  readEntitlement,
  type PlanId,
} from "@/lib/entitlements";

type Mod = { code: string; title: string; summary: string; days: number };

export default function OutplacementPage() {
  const [modules, setModules] = useState<Mod[]>([]);
  const [plan, setPlan] = useState<PlanId>("free");
  const unlocked = canAccessOutplacement(plan);

  useEffect(() => {
    setPlan(readEntitlement().plan);
    fetch("/api/outplacement/modules")
      .then((r) => r.json())
      .then((d) => setModules(d.modules || []))
      .catch(() => setModules([]));
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">
              Carrera · {planLabel(plan)}
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Outplacement</h1>
          </div>
          <SpeakButton text="Elige un módulo de la ruta o crea un curso personalizado OUT-09." />
        </div>
        <p className="muted text-sm">
          Ruta completa OUT-01 a OUT-08. Desde $79.000 COP/mes. También puedes crear un curso a
          tu medida.
        </p>
      </section>

      {!unlocked && (
        <PaywallCard
          currentPlan={plan}
          reason="El outplacement completo y OUT-09 están en Carrera / Plus. Puedes activar un plan en Precios (demo local si aún no tienes Wompi)."
        />
      )}

      <div className="flex flex-col gap-3">
        <Link href={unlocked ? "/outplacement/out09" : "/precios"} className="btn-primary">
          Crear curso personalizado (OUT-09)
        </Link>
        <Link href="/outplacement/entrevista" className="btn-secondary">
          Simulador de entrevista
        </Link>
        <Link href="/outplacement/90-dias" className="btn-secondary">
          Modo primeros 90 días
        </Link>
        <Link href={unlocked ? "/outplacement/ruta" : "/precios"} className="btn-secondary">
          Ver ruta OUT-01 a OUT-08
        </Link>
        <Link href="/precios" className="btn-secondary">
          Ver precios
        </Link>
      </div>

      {unlocked && (
        <div className="space-y-3">
          {modules.map((m) => (
            <Link key={m.code} href={`/outplacement/ruta?code=${m.code}`} className="bento-card block">
              <div className="flex items-center justify-between gap-2">
                <span className="pill-brand">{m.code}</span>
                <span className="text-xs muted">{m.days} días</span>
              </div>
              <h2 className="mt-2 text-base font-semibold">{m.title}</h2>
              <p className="mt-1 text-sm muted">{m.summary}</p>
            </Link>
          ))}
        </div>
      )}

      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
