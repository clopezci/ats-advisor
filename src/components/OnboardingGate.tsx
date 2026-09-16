"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { completeOnboarding, isOnboarded } from "@/lib/engagement/streak";
import { writeFocusPath, type FocusPath } from "@/lib/engagement/focusPath";

/**
 * Primera pantalla: UNA decisión (Carrera vs ATS).
 * Después: solo Continuar en Inicio / Hoy.
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!isOnboarded());
    setReady(true);
  }, []);

  function choose(path: FocusPath) {
    writeFocusPath(path);
    completeOnboarding();
    setShow(false);
  }

  if (!ready) return null;
  if (!show) return <>{children}</>;

  const intro =
    "Elige por dónde empezar. Después solo sigues con Continuar — sin perderte en menús.";

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Bienvenida · 1 decisión</p>
            <h1 className="text-2xl font-semibold">¿Por dónde empiezas?</h1>
          </div>
          <SpeakButton text={intro} />
        </div>
        <p className="text-sm muted leading-relaxed">{intro}</p>
      </section>

      <Link
        href="/outplacement"
        className="btn-primary"
        style={{ minHeight: "4.75rem", fontSize: "1.1rem", lineHeight: 1.35 }}
        onClick={() => choose("carrera")}
      >
        Retomar mi carrera
        <span className="block text-xs font-normal opacity-90">
          Un paso a la vez, con Continuar
        </span>
      </Link>

      <Link
        href="/ats"
        className="btn-secondary"
        style={{ minHeight: "4.25rem", lineHeight: 1.35 }}
        onClick={() => choose("ats")}
      >
        Probar el analizador de CV (gratis)
        <span className="block text-xs font-normal muted">Tu CV contra una vacante · en 2 minutos</span>
      </Link>

      <p className="text-center text-xs muted">
        Puedes cambiar de camino en Cuenta. Si Carrera está bloqueado, activa el plan o Tester desde ahí.
      </p>
    </div>
  );
}
