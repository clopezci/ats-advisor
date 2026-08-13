"use client";

import { useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { AdSlot } from "@/components/AdSlot";
import { CvPasteField, JobPasteField } from "@/components/CvPasteField";
import { quickMatch } from "@/lib/seo/quickMatch";

export function MatchCalculator() {
  const [cv, setCv] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState<ReturnType<typeof quickMatch> | null>(null);

  function run() {
    setResult(quickMatch(cv, job));
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Gratis · 1 minuto</p>
            <h1 className="mt-1 text-2xl font-semibold">¿Qué tan bien encaja tu CV?</h1>
          </div>
          <SpeakButton text="Pega tu CV y la oferta. Obtén un porcentaje rápido de coincidencia de palabras." />
        </div>
        <p className="text-sm muted">
          Comparación rápida y gratuita. Para el análisis completo (formato, requisitos
          indispensables, mapa de palabras) usa el analizador ATS.
        </p>
      </section>

      <AdSlot slot="herramientas-hub" />

      <CvPasteField
        value={cv}
        onChange={setCv}
        label="Tu hoja de vida"
        hint="El CV tuyo. No pongas aquí el aviso: eso va en el recuadro de abajo."
      />
      <JobPasteField
        value={job}
        onChange={setJob}
        label="El aviso de la vacante"
        hint="Copia el texto del empleo. Esto NO es tu CV."
      />
      <button type="button" className="btn-primary" onClick={run}>
        Calcular coincidencia
      </button>

      {result && (
        <section className="bento-card space-y-3">
          <p className="text-4xl font-semibold score-ring">{result.score}%</p>
          <p className="text-sm muted">{result.tip}</p>
          {result.matched.length > 0 && (
            <div>
              <p className="text-xs muted mb-1">Coinciden</p>
              <p className="text-sm">{result.matched.join(" · ")}</p>
            </div>
          )}
          {result.missing.length > 0 && (
            <div>
              <p className="text-xs muted mb-1">En la oferta, poco visibles en tu CV</p>
              <p className="text-sm">{result.missing.join(" · ")}</p>
            </div>
          )}
          <Link href="/ats" className="btn-primary">
            Abrir análisis ATS completo
          </Link>
        </section>
      )}

      <Link href="/herramientas" className="btn-secondary">
        Volver a herramientas
      </Link>
    </div>
  );
}
