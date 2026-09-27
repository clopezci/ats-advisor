"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { completeOnboarding, isOnboarded } from "@/lib/engagement/streak";
import { writeFocusPath, type FocusPath } from "@/lib/engagement/focusPath";
import { readSaveChoice, writeSaveChoice, type SaveChoice } from "@/lib/client/saveChoice";

/**
 * Primera pantalla: UNA decisión (Carrera vs ATS).
 * Después: solo Continuar en Inicio / Hoy.
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [showPath, setShowPath] = useState(false);
  const [choice, setChoice] = useState<SaveChoice | null>(null);

  useEffect(() => {
    setChoice(readSaveChoice());
    setShowPath(!isOnboarded());
    setReady(true);
  }, []);

  function choose(path: FocusPath) {
    writeFocusPath(path);
    completeOnboarding();
    setShowPath(false);
  }

  if (!ready) return null;
  if (!choice) {
    const intro =
      "Si entras con tu correo, esto queda guardado y lo puedes consultar después. Si sigues sin cuenta, no queda guardado.";
    return (
      <div className="flex flex-1 flex-col gap-5">
        <section className="bento-card space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs muted">Antes de empezar · 1 decisión</p>
              <h1 className="text-2xl font-semibold">¿Guardamos tu recorrido?</h1>
            </div>
            <SpeakButton text={intro} />
          </div>
          <p className="text-sm muted leading-relaxed">{intro}</p>
        </section>
        <Link
          href="/auth"
          className="btn-primary w-full"
          style={{
            minHeight: "4.75rem",
            lineHeight: 1.35,
            flexDirection: "column",
            gap: "0.2rem",
            textAlign: "center",
          }}
          onClick={() => writeSaveChoice("correo")}
        >
          <span>Entrar con mi correo</span>
          <span className="text-xs font-normal opacity-90">Queda guardado y lo consultas después</span>
        </Link>
        <button
          type="button"
          className="btn-secondary w-full"
          style={{
            minHeight: "4.75rem",
            lineHeight: 1.35,
            flexDirection: "column",
            gap: "0.2rem",
            textAlign: "center",
          }}
          onClick={() => {
            writeSaveChoice("navegador");
            setChoice("navegador");
          }}
        >
          <span>Seguir sin cuenta</span>
          <span className="text-xs font-normal opacity-90">No queda guardado para consultarlo después</span>
        </button>
      </div>
    );
  }
  if (!showPath) return <>{children}</>;

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
        className="btn-primary w-full"
        style={{
          minHeight: "4.75rem",
          fontSize: "1.1rem",
          lineHeight: 1.35,
          flexDirection: "column",
          gap: "0.2rem",
          textAlign: "center",
        }}
        onClick={() => choose("carrera")}
      >
        <span>Retomar mi carrera</span>
        <span className="text-xs font-normal opacity-90">Un paso a la vez, con Continuar</span>
      </Link>

      <Link
        href="/ats"
        className="btn-secondary w-full"
        style={{
          minHeight: "4.25rem",
          lineHeight: 1.35,
          flexDirection: "column",
          gap: "0.2rem",
          textAlign: "center",
        }}
        onClick={() => choose("ats")}
      >
        <span>Probar el analizador de CV (gratis)</span>
        <span className="text-xs font-normal muted">Tu CV contra una vacante · en 2 minutos</span>
      </Link>

      <p className="text-center text-xs muted">
        Puedes cambiar de camino en Cuenta. Si Carrera está bloqueado, activa el plan o Tester desde ahí.
      </p>
    </div>
  );
}
