"use client";

import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { InstallPrompt } from "@/components/InstallPrompt";
import { OnboardingGate } from "@/components/OnboardingGate";
import { AdSlot } from "@/components/AdSlot";
import { DailyCourseReminder } from "@/components/DailyCourseReminder";
import { useEffect, useState } from "react";
import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";
import { readStreak } from "@/lib/engagement/streak";

function HomeInner() {
  const [streak, setStreak] = useState(0);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setStreak(readStreak().count);
    setPaid(canAccessOutplacement(readEntitlement().plan));
  }, []);

  const INTRO =
    "Elige una sola cosa. Te guiamos paso a paso, con voz si quieres. No hace falta explorar todo el menú.";

  return (
    <div className="flex flex-1 flex-col gap-6">
      <InstallPrompt />
      {streak > 0 && (
        <p className="text-center text-sm">
          <span className="pill-brand">
            Racha {streak} día{streak === 1 ? "" : "s"}
          </span>
        </p>
      )}
      {paid && <DailyCourseReminder />}
      <section className="bento-card space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="pill-brand">LOTIC · un paso a la vez</p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight">¿Qué quieres hacer ahora?</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="muted text-sm leading-relaxed">{INTRO}</p>
      </section>

      <div className="flex flex-col gap-3">
        <Link
          href="/ats"
          className="btn-primary"
          style={{ minHeight: "4.5rem", fontSize: "1.15rem", lineHeight: 1.3 }}
        >
          Probar el analizador ATS
          <span className="block text-xs font-normal opacity-90">Gratis · CV vs una oferta</span>
        </Link>
        <Link
          href="/guia"
          className="btn-primary"
          style={{ minHeight: "4.5rem", fontSize: "1.15rem", lineHeight: 1.3 }}
        >
          Armar mi plan (Carrera)
          <span className="block text-xs font-normal opacity-90">
            Ruta de 8 módulos + herramientas · empiezas con lo gratis
          </span>
        </Link>
        <Link href="/tracker" className="btn-secondary">
          Anotar una postulación (gratis)
        </Link>
      </div>

      <AdSlot slot="home-free" />

      <p className="text-center text-xs muted">
        Si ya sabes el atajo:{" "}
        <Link href="/capacidades" style={{ color: "var(--brand)" }}>
          mapa
        </Link>
        {" · "}
        <Link href="/precios" style={{ color: "var(--brand)" }}>
          precios
        </Link>
        {" · "}
        <Link href="/herramientas" style={{ color: "var(--brand)" }}>
          herramientas
        </Link>
      </p>
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
