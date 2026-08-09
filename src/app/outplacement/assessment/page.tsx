"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import {
  RIASEC_LABELS,
  RIASEC_QUESTIONS,
  type RiasecCode,
  saveRiasecResult,
  scoreRiasec,
} from "@/lib/outplacement/riasec";

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const result = useMemo(() => {
    if (!done) return null;
    return scoreRiasec(answers);
  }, [answers, done]);

  const answered = RIASEC_QUESTIONS.filter((q) => answers[q.id] >= 1).length;
  const ready = answered === RIASEC_QUESTIONS.length;

  function finish() {
    const r = scoreRiasec(answers);
    saveRiasecResult(r);
    setDone(true);
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 1 · OUT-02</p>
            <h1 className="mt-1 text-2xl font-semibold">Assessment RIASEC</h1>
          </div>
          <SpeakButton text="Responde 18 afirmaciones del uno al cinco. Te damos tu código Holland y roles típicos en LATAM." />
        </div>
        <p className="text-sm muted">
          Escala 1 (nada) a 5 (mucho). Orientativo — no es psicometría clínica.
        </p>
        <p className="text-xs muted">
          Progreso: {answered}/{RIASEC_QUESTIONS.length}
        </p>
      </section>

      {!done && (
        <div className="space-y-3">
          {RIASEC_QUESTIONS.map((q, i) => (
            <div key={q.id} className="bento-card space-y-2">
              <p className="text-sm font-medium">
                {i + 1}. {q.text}
              </p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className="btn-secondary"
                    style={
                      answers[q.id] === n
                        ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                        : undefined
                    }
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: n }))}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button type="button" className="btn-primary" disabled={!ready} onClick={finish}>
            Ver resultados
          </button>
        </div>
      )}

      {result && (
        <section className="bento-card space-y-4">
          <p className="pill-brand">Código Holland: {result.holland}</p>
          <div className="space-y-2">
            {result.ranked.map((c: RiasecCode) => (
              <div key={c}>
                <div className="flex justify-between text-sm">
                  <span>
                    {c} · {RIASEC_LABELS[c].name}
                  </span>
                  <span className="muted">{result.scores[c]}%</span>
                </div>
                <div
                  className="mt-1 h-2 rounded"
                  style={{
                    width: `${result.scores[c]}%`,
                    background: "var(--brand)",
                    maxWidth: "100%",
                  }}
                />
                <p className="mt-1 text-xs muted">{RIASEC_LABELS[c].blurb}</p>
              </div>
            ))}
          </div>
          <h2 className="font-semibold">Roles LATAM alineados</h2>
          <ul className="space-y-2 text-sm">
            {result.roles.map((r) => (
              <li key={r.title} className="bento-card">
                <p className="font-medium">{r.title}</p>
                <p className="text-xs muted">{r.note}</p>
                <p className="text-xs muted">Sectores: {r.sectors.join(" · ")}</p>
              </li>
            ))}
          </ul>
          <Link href="/outplacement/career-brief" className="btn-primary">
            Generar Career Brief PDF
          </Link>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setDone(false);
              setAnswers({});
            }}
          >
            Repetir assessment
          </button>
        </section>
      )}

      <Link href="/outplacement" className="btn-secondary">
        Volver a outplacement
      </Link>
    </div>
  );
}
