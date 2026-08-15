"use client";

import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { InstallPrompt } from "@/components/InstallPrompt";
import { OnboardingGate } from "@/components/OnboardingGate";
import { AdSlot } from "@/components/AdSlot";
import { useEffect, useState } from "react";
import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";
import { readStreak } from "@/lib/engagement/streak";
import {
  readFocusPath,
  resolveContinueTarget,
  writeFocusPath,
  type ContinueTarget,
  type FocusPath,
} from "@/lib/engagement/focusPath";

function HomeInner() {
  const [streak, setStreak] = useState(0);
  const [paid, setPaid] = useState(false);
  const [path, setPath] = useState<FocusPath | null>(null);
  const [target, setTarget] = useState<ContinueTarget | null>(null);
  const [showSwitch, setShowSwitch] = useState(false);

  useEffect(() => {
    setStreak(readStreak().count);
    setPaid(canAccessOutplacement(readEntitlement().plan));
    setPath(readFocusPath());
    setTarget(resolveContinueTarget());
  }, []);

  function switchPath(next: FocusPath) {
    writeFocusPath(next);
    setPath(next);
    setTarget(resolveContinueTarget());
    setShowSwitch(false);
  }

  const INTRO =
    path === "ats"
      ? "Un solo botón. Analiza, ajusta, repite. El resto del menú puede esperar."
      : "Un solo botón Continuar. Cierras un entregable y vuelves. Así lo hacen las mejores apps de hábito.";

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

      <section className="bento-card space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="pill-brand">LOTIC · un paso a la vez</p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight">
              {path === "ats" ? "Tu ATS de hoy" : "Tu siguiente paso"}
            </h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="muted text-sm leading-relaxed">{INTRO}</p>
        {path === "carrera" && !paid ? (
          <p className="text-xs muted leading-relaxed">
            Tip de prueba: en <Link href="/cuenta" style={{ color: "var(--brand)" }}>Cuenta</Link>{" "}
            puedes activar plan local Tester / Carrera para recorrer el cuadernillo sin fricción.
          </p>
        ) : null}
      </section>

      {target ? (
        <Link
          href={target.href}
          className="btn-primary"
          style={{ minHeight: "4.75rem", fontSize: "1.15rem", lineHeight: 1.35 }}
        >
          {target.label}
          <span className="block text-xs font-normal opacity-90">{target.hint}</span>
        </Link>
      ) : (
        <Link href="/outplacement/cuadernillo" className="btn-primary">
          Continuar
        </Link>
      )}

      <button
        type="button"
        className="text-center text-sm muted"
        onClick={() => setShowSwitch((v) => !v)}
      >
        {showSwitch ? "Ocultar" : "Cambiar de camino"}
      </button>
      {showSwitch ? (
        <div className="flex flex-col gap-2">
          <button type="button" className="btn-secondary" onClick={() => switchPath("carrera")}>
            Camino Carrera (cuadernillo)
          </button>
          <button type="button" className="btn-secondary" onClick={() => switchPath("ats")}>
            Camino ATS gratis
          </button>
          <Link href="/tracker" className="btn-secondary">
            Solo anotar una postulación
          </Link>
        </div>
      ) : null}

      <AdSlot slot="home-free" />
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
