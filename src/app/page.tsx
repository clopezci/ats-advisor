"use client";

import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { InstallPrompt } from "@/components/InstallPrompt";
import { OnboardingGate } from "@/components/OnboardingGate";
import { AdSlot } from "@/components/AdSlot";
import { DailyCourseReminder } from "@/components/DailyCourseReminder";
import { QuickAccessGrid } from "@/components/QuickAccessGrid";
import { useEffect, useState } from "react";
import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";
import { readStreak } from "@/lib/engagement/streak";
import {
  FREE_STEPS,
  pathLabel,
  readFocusPath,
  readFreeStepIndex,
  resolveContinueTarget,
  restartCurrentPath,
  writeFocusPath,
  type ContinueTarget,
  type FocusPath,
} from "@/lib/engagement/focusPath";

function HomeInner() {
  const [streak, setStreak] = useState(0);
  const [paid, setPaid] = useState(false);
  const [path, setPath] = useState<FocusPath | null>(null);
  const [target, setTarget] = useState<ContinueTarget | null>(null);
  const [freeIdx, setFreeIdx] = useState(0);

  useEffect(() => {
    setStreak(readStreak().count);
    setPaid(canAccessOutplacement(readEntitlement().plan));
    const p = readFocusPath();
    setPath(p);
    setTarget(resolveContinueTarget());
    setFreeIdx(readFreeStepIndex());
  }, []);

  function pick(next: FocusPath) {
    writeFocusPath(next);
    setPath(next);
    setTarget(resolveContinueTarget());
    setFreeIdx(readFreeStepIndex());
  }

  function restart() {
    restartCurrentPath();
    setTarget(resolveContinueTarget());
    setFreeIdx(readFreeStepIndex());
  }

  const INTRO =
    "Elige ruta gratis o Plan Carrera. Abajo siempre tienes accesos: ATS, psicotécnicas, tracker y cuadernillo.";

  return (
    <div className="flex flex-1 flex-col gap-5">
      <InstallPrompt />
      {streak > 0 && (
        <p className="text-center text-sm">
          <span className="pill-brand">
            Racha {streak} día{streak === 1 ? "" : "s"}
          </span>
        </p>
      )}

      {paid && path === "carrera" ? <DailyCourseReminder /> : null}

      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="pill-brand">LOTIC · un paso a la vez</p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight">
              {path ? pathLabel(path) : "¿Por dónde sigues?"}
            </h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="muted text-sm leading-relaxed">{INTRO}</p>
      </section>

      {/* Dos caminos siempre visibles */}
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className={path === "gratis" ? "btn-primary" : "btn-secondary"}
          style={{
            minHeight: "4.5rem",
            flexDirection: "column",
            gap: "0.2rem",
            textAlign: "center",
            lineHeight: 1.3,
          }}
          onClick={() => pick("gratis")}
        >
          <span>Ruta gratis</span>
          <span className="text-xs font-normal opacity-90">ATS · psicotécnicas · tracker</span>
        </button>
        <button
          type="button"
          className={path === "carrera" ? "btn-primary" : "btn-secondary"}
          style={{
            minHeight: "4.5rem",
            flexDirection: "column",
            gap: "0.2rem",
            textAlign: "center",
            lineHeight: 1.3,
          }}
          onClick={() => pick("carrera")}
        >
          <span>Plan Carrera</span>
          <span className="text-xs font-normal opacity-90">Cuadernillo guiado</span>
        </button>
      </div>

      {path && target ? (
        <Link
          href={target.href}
          className="btn-primary w-full"
          style={{
            minHeight: "4.75rem",
            fontSize: "1.1rem",
            lineHeight: 1.35,
            flexDirection: "column",
            gap: "0.25rem",
            textAlign: "center",
          }}
        >
          <span>{target.label}</span>
          <span className="text-xs font-normal opacity-90">{target.hint}</span>
        </Link>
      ) : null}

      {path ? (
        <button type="button" className="btn-secondary w-full" onClick={restart}>
          Empezar esta ruta desde el principio
        </button>
      ) : null}

      {/* Accesos permanentes — psicotécnicas siempre aquí */}
      <QuickAccessGrid />

      {path === "gratis" ? (
        <section className="bento-card space-y-2">
          <h2 className="font-semibold text-sm">Orden sugerido (ruta gratis)</h2>
          <ol className="space-y-2">
            {FREE_STEPS.map((s, i) => (
              <li key={s.id}>
                <Link
                  href={s.href}
                  className="flex flex-col gap-0.5 rounded-lg border px-3 py-2 text-sm"
                  style={{
                    borderColor: i === freeIdx ? "var(--brand)" : "var(--border)",
                    boxShadow: i === freeIdx ? "var(--shadow-brand)" : undefined,
                  }}
                >
                  <span className="font-medium">
                    {i + 1}. {s.title}
                    {i < freeIdx ? " ✓" : i === freeIdx ? " ← ahora" : ""}
                  </span>
                  <span className="text-xs muted">{s.desc}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {path === "carrera" && !paid ? (
        <p className="text-sm muted leading-relaxed">
          Sin plan: activa en Precios (dueño/tester sin pago). Mientras tanto usa la ruta gratis arriba.
        </p>
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
