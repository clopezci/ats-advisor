"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import {
  EVAL_CHECKS,
  readWorkbook,
  writeWorkbook,
  type WorkbookState,
} from "@/lib/workbook/types";

const INTRO =
  "Cada etapa mide cosas distintas. Revisa la serie corta, marca el checklist y deja evidencia lista.";

const STAGES = [
  {
    id: "ats",
    title: "1. ATS / screening CV",
    tip: "Keywords honestas del JD, formato limpio, logros cuantificados. El bot no lee diseño fancy.",
  },
  {
    id: "filtro",
    title: "2. Filtro reclutador",
    tip: "Pitch 60s, disponibilidad, pretensión con rango, motivación sincera. Prueba logística.",
  },
  {
    id: "hm",
    title: "3. Hiring manager",
    tip: "Profundidad: 3 historias SOAR, ownership, cómo priorizas. Pregunta por éxito a 90 días.",
  },
  {
    id: "panel",
    title: "4. Panel / peers",
    tip: "Colaboración y estilo. Evita contradecir al HM; muestra cómo trabajas con otros.",
  },
  {
    id: "assess",
    title: "5. Assessment / caso",
    tip: "Estructura: hipótesis → datos → plan. Comunica trade-offs; no solo la respuesta 'correcta'.",
  },
  {
    id: "refs",
    title: "6. Referencias",
    tip: "Alinea a 2 personas: logros, contexto de salida, debilidad honesta. Avisa con anticipación.",
  },
];

export default function EvaluacionPage() {
  const [wb, setWb] = useState<WorkbookState | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setWb(readWorkbook());
  }, []);

  if (!wb) return <p className="text-sm muted">Cargando…</p>;

  function save(next: WorkbookState) {
    setWb(next);
    writeWorkbook(next);
  }

  function patch(p: Partial<WorkbookState["evaluation"]>) {
    save({ ...wb!, evaluation: { ...wb!.evaluation, ...p, updatedAt: Date.now() } });
  }

  function toggle(id: string) {
    const set = new Set(wb!.evaluation.checklistDone);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    patch({ checklistDone: [...set] });
  }

  function markDone() {
    save({
      ...wb!,
      completed: { ...wb!.completed, evaluacion: true },
      evaluation: { ...wb!.evaluation, updatedAt: Date.now() },
    });
    setMsg("Listo. Practica en Roleplay con Gabriel.");
  }

  const e = wb.evaluation;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · selección</p>
            <h1 className="text-2xl font-semibold">Cómo te evalúan</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Serie: cómo te evalúan</h2>
        {STAGES.map((s) => (
          <div key={s.id} className="space-y-1 border-t pt-3 first:border-0 first:pt-0" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm font-medium">{s.title}</p>
            <p className="text-xs muted leading-relaxed">{s.tip}</p>
          </div>
        ))}
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Checklist por etapa</h2>
        {EVAL_CHECKS.map((c) => (
          <label key={c.id} className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-1"
              checked={e.checklistDone.includes(c.id)}
              onChange={() => toggle(c.id)}
            />
            <span>{c.label}</span>
          </label>
        ))}
      </section>

      <VoiceTextarea
        label="Notas por etapa (ATS / filtro / HM / panel)"
        value={e.notesByStage}
        onChange={(v) => patch({ notesByStage: v })}
        className="field min-h-24"
        dictationLabel="Dictar"
      />
      <VoiceTextarea
        label="Tus 3 historias versátiles"
        value={e.threeStories}
        onChange={(v) => patch({ threeStories: v })}
        className="field min-h-24"
        placeholder="1) … 2) … 3) fracaso + aprendizaje"
        dictationLabel="Dictar"
      />
      <VoiceTextarea
        label="Preguntas listas (2 por etapa)"
        value={e.questionsReady}
        onChange={(v) => patch({ questionsReady: v })}
        className="field min-h-20"
        dictationLabel="Dictar"
      />

      <CoachAsk
        coachModule="entrevistas"
        placeholder="Ej.: ¿qué suele medir un hiring manager vs un reclutador de filtro?"
      />

      <button type="button" className="btn-primary" onClick={markDone}>
        Marcar evaluación como completo
      </button>
      {msg ? <p className="text-sm muted">{msg}</p> : null}

      <Link href="/outplacement/cuadernillo/simulaciones" className="btn-secondary">
        Simulaciones por caso
      </Link>
      <Link href="/outplacement/roleplay" className="btn-secondary">
        Roleplay de entrevista
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
