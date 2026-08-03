"use client";

import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { InstallPrompt } from "@/components/InstallPrompt";
import { OnboardingGate } from "@/components/OnboardingGate";
import { useEffect, useState } from "react";
import { readStreak } from "@/lib/engagement/streak";

function HomeInner() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(readStreak().count);
  }, []);

  const INTRO =
    "ATSAdvisor te ayuda a pasar filtros ATS y a reconstruir tu carrera. Elige solo una cosa para empezar.";

  return (
    <div className="flex flex-1 flex-col gap-6">
      <InstallPrompt />
      {streak > 0 && (
        <p className="text-center text-sm">
          <span className="pill-brand">Racha {streak} día{streak === 1 ? "" : "s"}</span>
        </p>
      )}
      <section className="bento-card space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="pill-brand">LOTIC · listo para usar</p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight">¿Qué quieres hacer ahora?</h1>
          </div>
          <SpeakButton
            text={`${INTRO} También puedes abrir el mapa completo de capacidades. Opción principal: analizar mi CV. Luego outplacement o tracker.`}
          />
        </div>
        <p className="muted text-sm leading-relaxed">{INTRO}</p>
      </section>

      <div className="flex flex-col gap-3">
        <Link
          href="/capacidades"
          className="btn-primary"
          style={{ minHeight: "4.5rem", fontSize: "1.2rem", lineHeight: 1.3 }}
        >
          Ver todo lo que puedes hacer
          <span className="block text-xs font-normal opacity-90">Persona, empresa RH, admin · estados reales</span>
        </Link>
        <Link href="/ats" className="btn-secondary">
          Analizar mi CV (ATS gratis)
        </Link>
        <Link href="/outplacement" className="btn-secondary">
          Ver outplacement
        </Link>
        <Link href="/tracker" className="btn-secondary">
          Tracker de postulaciones
        </Link>
      </div>

      <section className="grid grid-cols-2 gap-3">
        <Link href="/ats/historial" className="bento-card block">
          <p className="text-xs muted">Historial</p>
          <p className="mt-1 text-sm font-medium">Ver scores previos</p>
        </Link>
        <Link href="/ats/multi" className="bento-card block">
          <p className="text-xs muted">Multi-oferta</p>
          <p className="mt-1 text-sm font-medium">Prioriza vacantes</p>
        </Link>
        <Link href="/ats/portales" className="bento-card block">
          <p className="text-xs muted">LATAM</p>
          <p className="mt-1 text-sm font-medium">Portales y screening</p>
        </Link>
        <Link href="/blog" className="bento-card block">
          <p className="text-xs muted">Blog</p>
          <p className="mt-1 text-sm font-medium">Guías ATS gratis</p>
        </Link>
      </section>

      <Link href="/herramientas" className="text-center text-sm" style={{ color: "var(--brand)" }}>
        Herramientas gratis →
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <OnboardingGate>
      <HomeInner />
    </OnboardingGate>
  );
}
