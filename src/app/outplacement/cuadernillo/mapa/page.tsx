"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import {
  readWorkbook,
  writeWorkbook,
  type CareerMapData,
  type WorkbookState,
} from "@/lib/workbook/types";

const INTRO =
  "Vamos a armar tu mapa de carrera. No es motivación vacía: saldrás con objetivo en una línea, propósito, visión y fortalezas que puedas defender en entrevista.";

export default function MapaWizardPage() {
  const [wb, setWb] = useState<WorkbookState | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setWb(readWorkbook());
  }, []);

  if (!wb) return <p className="text-sm muted">Cargando…</p>;

  function patch(p: Partial<CareerMapData>) {
    const next = {
      ...wb!,
      map: { ...wb!.map, ...p, updatedAt: Date.now() },
    };
    setWb(next);
    writeWorkbook(next);
  }

  function markDone() {
    const next = {
      ...wb!,
      completed: { ...wb!.completed, mapa: true },
      map: { ...wb!.map, updatedAt: Date.now() },
    };
    setWb(next);
    writeWorkbook(next);
    setMsg("Mapa guardado. Sigue con Mercado · 3 canales o Guiones.");
  }

  const m = wb.map;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · paso guiado</p>
            <h1 className="text-2xl font-semibold">Mapa de carrera</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">1. Fortalezas (con prueba)</h2>
        <p className="text-xs muted">
          Escribe 3 fortalezas. Cada una debe poder apoyarse en un logro (número o antes/después).
        </p>
        <VoiceTextarea
          label="Fortalezas"
          value={m.strengths}
          onChange={(v) => patch({ strengths: v })}
          className="field min-h-28"
          placeholder="1) …&#10;2) …&#10;3) …"
          dictationLabel="Dictar fortalezas"
        />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">2. Motivadores y valores</h2>
        <VoiceTextarea
          label="Motivadores (top 3)"
          value={m.motivators}
          onChange={(v) => patch({ motivators: v })}
          className="field min-h-20"
          placeholder="Logro, retos, avance, altruismo…"
          dictationLabel="Dictar motivadores"
        />
        <VoiceTextarea
          label="Valores (4 no negociables)"
          value={m.values}
          onChange={(v) => patch({ values: v })}
          className="field min-h-20"
          placeholder="Integridad, familia, aprendizaje…"
          dictationLabel="Dictar valores"
        />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">3. Propósito, visión y objetivo</h2>
        <VoiceTextarea
          label="Propósito (2–3 frases)"
          value={m.purpose}
          onChange={(v) => patch({ purpose: v })}
          className="field min-h-24"
          dictationLabel="Dictar propósito"
        />
        <VoiceTextarea
          label="Visión 3–5 años"
          value={m.vision}
          onChange={(v) => patch({ vision: v })}
          className="field min-h-20"
          dictationLabel="Dictar visión"
        />
        <VoiceTextarea
          label="Objetivo profesional (1 línea)"
          value={m.objective}
          onChange={(v) => patch({ objective: v })}
          className="field min-h-16"
          placeholder="Ej.: Dirección de operaciones en empresas de tecnología o servicios"
          dictationLabel="Dictar objetivo"
        />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">4. Columnas que sostienen el objetivo</h2>
        <VoiceTextarea
          label="Formación"
          value={m.pillarsEducation}
          onChange={(v) => patch({ pillarsEducation: v })}
          className="field min-h-16"
          dictationLabel="Dictar formación"
        />
        <VoiceTextarea
          label="Experiencia / logros"
          value={m.pillarsExperience}
          onChange={(v) => patch({ pillarsExperience: v })}
          className="field min-h-20"
          dictationLabel="Dictar experiencia"
        />
        <VoiceTextarea
          label="Competencias"
          value={m.pillarsSkills}
          onChange={(v) => patch({ pillarsSkills: v })}
          className="field min-h-16"
          dictationLabel="Dictar competencias"
        />
        <VoiceTextarea
          label="Encaje (fortalezas + motivadores + valores)"
          value={m.pillarsFit}
          onChange={(v) => patch({ pillarsFit: v })}
          className="field min-h-16"
          dictationLabel="Dictar encaje"
        />
      </section>

      <CoachAsk coachModule="mapa de carrera" />

      <button type="button" className="btn-primary" onClick={markDone}>
        Marcar mapa como completo
      </button>
      {msg ? <p className="text-sm muted">{msg}</p> : null}

      <Link href="/outplacement/cuadernillo/mercado" className="btn-secondary">
        Siguiente: Mercado · 3 canales
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
