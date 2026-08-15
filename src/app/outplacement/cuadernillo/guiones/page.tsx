"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import {
  readWorkbook,
  writeWorkbook,
  type ScriptsData,
  type WorkbookState,
} from "@/lib/workbook/types";

const INTRO =
  "Vamos a dejar listos tres textos: tu pitch de presentación, tu razón de salida o cambio, y notas de matriz por audiencia. Cada público necesita un mensaje distinto: no copies el mismo párrafo a todos.";

const AUDIENCES = [
  "Reclutadores que ya te conocen",
  "Reclutadores que no te conocen",
  "Familia y amigos",
  "Excolegas / pares",
  "Excolaboradores",
  "Exlíderes",
  "Gerentes que contratan (empresa objetivo)",
  "Selección / HR (empresa objetivo)",
  "Contactos fríos en empresa objetivo",
];

export default function GuionesWizardPage() {
  const [wb, setWb] = useState<WorkbookState | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setWb(readWorkbook());
  }, []);

  if (!wb) return <p className="text-sm muted">Cargando…</p>;

  function patch(p: Partial<ScriptsData>) {
    const next = {
      ...wb!,
      scripts: { ...wb!.scripts, ...p, updatedAt: Date.now() },
    };
    setWb(next);
    writeWorkbook(next);
  }

  function markDone() {
    const next = {
      ...wb!,
      completed: { ...wb!.completed, guiones: true },
      scripts: { ...wb!.scripts, updatedAt: Date.now() },
    };
    setWb(next);
    writeWorkbook(next);
    setMsg("Guiones guardados. Úsalos en networking y entrevistas.");
  }

  const s = wb.scripts;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · paso guiado</p>
            <h1 className="text-2xl font-semibold">Guiones y matriz</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
      </section>

      <section className="bento-card space-y-3">
        <div className="flex justify-between gap-2">
          <h2 className="font-semibold text-sm">1. Pitch de presentación</h2>
          {s.pitch ? <SpeakButton text={s.pitch} /> : null}
        </div>
        <p className="text-xs muted">
          Nombre + expertise · valor con prueba · qué buscas · CTA (pregunta concreta). 60–90
          segundos al hablarlo.
        </p>
        <VoiceTextarea
          label="Tu pitch"
          value={s.pitch}
          onChange={(v) => patch({ pitch: v })}
          className="field min-h-28"
          placeholder="Hola, soy… Trabajo en… Logré… Ahora busco… ¿Tendrías 15 min para…?"
          dictationLabel="Dictar pitch"
        />
      </section>

      <section className="bento-card space-y-3">
        <div className="flex justify-between gap-2">
          <h2 className="font-semibold text-sm">2. Razón de salida / cambio</h2>
          {s.exitReason ? <SpeakButton text={s.exitReason} /> : null}
        </div>
        <p className="text-xs muted">
          Honesto y diplomático. Hechos + aprendizaje + qué buscas ahora. Sin atacar empleadores.
        </p>
        <VoiceTextarea
          label="Versión corta (2–4 frases)"
          value={s.exitReason}
          onChange={(v) => patch({ exitReason: v })}
          className="field min-h-24"
          dictationLabel="Dictar razón de salida"
        />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">3. Matriz por audiencia</h2>
        <p className="text-xs muted mb-2">
          Para cada grupo: mensaje clave, favor que pides, canal. Anota aquí tu plan:
        </p>
        <ul className="text-xs muted space-y-1 mb-2">
          {AUDIENCES.map((a) => (
            <li key={a}>• {a}</li>
          ))}
        </ul>
        <VoiceTextarea
          label="Notas de matriz"
          value={s.matrixNotes}
          onChange={(v) => patch({ matrixNotes: v })}
          className="field min-h-36"
          placeholder="Reclutadores: …&#10;Excolegas: favor = intro a 1 persona&#10;Empresa objetivo (frío): conversación de mercado…"
          dictationLabel="Dictar matriz"
        />
      </section>

      <CoachAsk
        coachModule="guiones de comunicación"
        placeholder="Ej.: ¿cómo suavizo la razón de salida si hubo diferencias culturales?"
      />

      <button type="button" className="btn-primary" onClick={markDone}>
        Marcar guiones como completos
      </button>
      {msg ? <p className="text-sm muted">{msg}</p> : null}

      <Link href="/outplacement/networking" className="btn-secondary">
        Ir a red de contactos
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
