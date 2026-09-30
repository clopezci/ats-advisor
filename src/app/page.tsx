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
  const [picker, setPicker] = useState(false);

  useEffect(() => {
    setStreak(readStreak().count);
    setPaid(canAccessOutplacement(readEntitlement().plan));
    const p = readFocusPath();
    setPath(p);
    setTarget(resolveContinueTarget());
    if (!p) setPicker(true);
  }, []);

  function pick(next: FocusPath) {
    writeFocusPath(next);
    setPath(next);
    setPicker(false);
    setTarget(resolveContinueTarget());
  }

  function restart() {
    restartCurrentPath();
    setTarget(resolveContinueTarget());
  }

  const INTRO =
    "Dos caminos: ruta gratis (ATS, psicotécnicas, tracker) o Plan Carrera (cuadernillo guiado). Continúa donde ibas o cambia cuando quieras.";

  const freeIdx = readFreeStepIndex();

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
              {path ? pathLabel(path) : "Tu camino"}
            </h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="muted text-sm leading-relaxed">{INTRO}</p>
      </section>

      {picker || !path ? (
        <section className="space-y-3">
          <p className="text-sm font-medium">Elige tu camino</p>
          <button
            type="button"
            className="btn-primary w-full"
            style={{
              minHeight: "5rem",
              flexDirection: "column",
              gap: "0.25rem",
              textAlign: "center",
              lineHeight: 1.35,
            }}
            onClick={() => pick("gratis")}
          >
            <span>Ruta gratis</span>
            <span className="text-xs font-normal opacity-90">
              ATS · estudiar psicotécnicas · tracker · checklist
            </span>
          </button>
          <button
            type="button"
            className="btn-secondary w-full"
            style={{
              minHeight: "5rem",
              flexDirection: "column",
              gap: "0.25rem",
              textAlign: "center",
              lineHeight: 1.35,
            }}
            onClick={() => pick("carrera")}
          >
            <span>Plan Carrera</span>
            <span className="text-xs font-normal muted">
              Cuadernillo guiado · si no tienes plan, te llevamos a activarlo
            </span>
          </button>
        </section>
      ) : (
        <section className="space-y-3">
          {target ? (
            <Link
              href={target.href}
              className="btn-primary w-full"
              style={{
                minHeight: "5rem",
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

          <button type="button" className="btn-secondary w-full" onClick={restart}>
            Empezar esta ruta desde el principio
          </button>

          <button
            type="button"
            className="text-center text-sm underline muted w-full"
            onClick={() => setPicker(true)}
          >
            Cambiar de camino
          </button>

          {path === "gratis" ? (
            <section className="bento-card space-y-2">
              <h2 className="font-semibold text-sm">Pasos de la ruta gratis</h2>
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
              <p className="text-xs muted leading-relaxed">
                Estudiar psicotécnicas es gratis. Lo de pago es practicar con el método IA personalizado.
              </p>
            </section>
          ) : null}

          {path === "carrera" && !paid ? (
            <p className="text-sm muted leading-relaxed">
              Sin plan activo te llevamos a precios. Si eres dueño/tester, activa sin pago ahí mismo.
            </p>
          ) : null}
        </section>
      )}

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
