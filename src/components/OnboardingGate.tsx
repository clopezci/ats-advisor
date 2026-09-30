"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { completeOnboarding, isOnboarded } from "@/lib/engagement/streak";
import { writeFocusPath, type FocusPath } from "@/lib/engagement/focusPath";
import { readSaveChoice, writeSaveChoice, type SaveChoice } from "@/lib/client/saveChoice";

/**
 * Primera vez: guardar o no · luego UNA decisión: Ruta gratis vs Plan Carrera.
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
          href="/auth?next=%2F"
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
          <span className="text-xs font-normal opacity-90">Queda guardado para consultarlo después</span>
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
    "Solo hay dos caminos. Elige uno: te guiamos paso a paso. Siempre puedes cambiar arriba en la barra de ruta.";

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Bienvenida · 1 decisión</p>
            <h1 className="text-2xl font-semibold">¿Qué camino tomas?</h1>
          </div>
          <SpeakButton text={intro} />
        </div>
        <p className="text-sm muted leading-relaxed">{intro}</p>
      </section>

      <Link
        href="/ats"
        className="btn-primary w-full"
        style={{
          minHeight: "5rem",
          fontSize: "1.1rem",
          lineHeight: 1.35,
          flexDirection: "column",
          gap: "0.25rem",
          textAlign: "center",
        }}
        onClick={() => choose("gratis")}
      >
        <span>Ruta gratis</span>
        <span className="text-xs font-normal opacity-90">
          ATS · psicotécnicas para estudiar · tracker · checklist
        </span>
      </Link>

      <Link
        href="/precios?plan=carrera&next=%2Foutplacement%2Fcuadernillo"
        className="btn-secondary w-full"
        style={{
          minHeight: "5rem",
          fontSize: "1.1rem",
          lineHeight: 1.35,
          flexDirection: "column",
          gap: "0.25rem",
          textAlign: "center",
        }}
        onClick={() => choose("carrera")}
      >
        <span>Plan Carrera</span>
        <span className="text-xs font-normal muted">
          Cuadernillo guiado · mapa, red, entrevistas, oferta
        </span>
      </Link>
    </div>
  );
}
