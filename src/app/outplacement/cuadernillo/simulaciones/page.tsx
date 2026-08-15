"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import { SIMULATION_CASES, saveFeedbackScore } from "@/lib/workbook/simulations";

const INTRO =
  "Simulaciones por caso: elige escenario, responde en voz alta o por escrito, y autoevalúa con la rúbrica. Guarda el score en historial.";

export default function SimulacionesPage() {
  const [caseId, setCaseId] = useState(SIMULATION_CASES[0].id);
  const [answer, setAnswer] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");

  const c = useMemo(
    () => SIMULATION_CASES.find((x) => x.id === caseId) || SIMULATION_CASES[0],
    [caseId]
  );

  function setScore(id: string, n: number) {
    setScores((s) => ({ ...s, [id]: n }));
  }

  function save() {
    saveFeedbackScore({
      caseId: c.id,
      caseTitle: c.title,
      scores,
      notes: notes || answer.slice(0, 200),
    });
    setMsg("Score guardado. Véelo en Historial de feedback.");
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · entrevistas</p>
            <h1 className="text-2xl font-semibold">Simulaciones</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        <label className="block text-sm">
          Caso
          <select
            className="field mt-1"
            value={caseId}
            onChange={(e) => {
              setCaseId(e.target.value);
              setScores({});
              setAnswer("");
              setMsg("");
            }}
          >
            {SIMULATION_CASES.map((x) => (
              <option key={x.id} value={x.id}>
                {x.title} · {x.stage}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">{c.title}</h2>
        <p className="text-sm leading-relaxed">{c.prompt}</p>
        <p className="text-xs muted">Busca: {c.lookFor.join(" · ")}</p>
        <VoiceTextarea
          label="Tu respuesta (opcional)"
          value={answer}
          onChange={setAnswer}
          className="field min-h-28"
          dictationLabel="Dictar respuesta"
        />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Rúbrica (1–5)</h2>
        {c.rubric.map((r) => (
          <label key={r.id} className="flex items-center justify-between gap-2 text-sm">
            <span>{r.label}</span>
            <select
              className="field w-20"
              value={scores[r.id] || 0}
              onChange={(e) => setScore(r.id, Number(e.target.value))}
            >
              <option value={0}>—</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        ))}
        <VoiceTextarea
          label="Notas del round"
          value={notes}
          onChange={setNotes}
          className="field min-h-16"
          dictationLabel="Dictar"
        />
        <button type="button" className="btn-primary" onClick={save}>
          Guardar score
        </button>
        {msg ? <p className="text-sm muted">{msg}</p> : null}
      </section>

      <CoachAsk
        coachModule="entrevistas"
        placeholder="Ej.: ¿cómo mejoro mi pitch de 60s sin sonar robótico?"
      />

      <Link href="/outplacement/cuadernillo/feedback" className="btn-secondary">
        Historial de feedback
      </Link>
      <Link href="/outplacement/roleplay" className="btn-secondary">
        Roleplay con coach
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
