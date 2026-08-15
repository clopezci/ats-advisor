"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import {
  ATS_COMPETENCIES,
  competencyLabel,
  topCompetencies,
} from "@/lib/workbook/competencies";
import { readWorkbook, writeWorkbook, type WorkbookState } from "@/lib/workbook/types";

const INTRO =
  "Autoevalúa 12 competencias de ATSAdvisor. Sé honesto: un 5 sin evidencia no sirve en entrevista. Lleva tu top 5 al mapa y al CV.";

export default function PruebasPage() {
  const [wb, setWb] = useState<WorkbookState | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const state = readWorkbook();
    const byId = new Map(state.competencies.ratings.map((r) => [r.id, r]));
    const ratings = ATS_COMPETENCIES.map((c) => byId.get(c.id) || { id: c.id, score: 0, evidence: "" });
    setWb({ ...state, competencies: { ...state.competencies, ratings } });
  }, []);

  const top = useMemo(
    () => (wb ? topCompetencies(wb.competencies.ratings, 5) : []),
    [wb]
  );

  if (!wb) return <p className="text-sm muted">Cargando…</p>;

  function save(next: WorkbookState) {
    setWb(next);
    writeWorkbook(next);
  }

  function setRating(id: string, patch: { score?: number; evidence?: string }) {
    const ratings = wb!.competencies.ratings.map((r) => (r.id === id ? { ...r, ...patch } : r));
    save({
      ...wb!,
      competencies: { ...wb!.competencies, ratings, updatedAt: Date.now() },
    });
  }

  function markDone() {
    save({
      ...wb!,
      completed: { ...wb!.completed, pruebas: true },
      competencies: { ...wb!.competencies, updatedAt: Date.now() },
    });
    setMsg("Competencias guardadas. Copia el top 5 a tu mapa y a SOAR.");
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · pruebas</p>
            <h1 className="text-2xl font-semibold">Competencias</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        <p className="text-xs muted">Escala 1–5. Framework propio ATSAdvisor (no de terceros).</p>
      </section>

      {ATS_COMPETENCIES.map((c) => {
        const r = wb.competencies.ratings.find((x) => x.id === c.id) || {
          id: c.id,
          score: 0,
          evidence: "",
        };
        return (
          <section key={c.id} className="bento-card space-y-3">
            <div>
              <h2 className="font-semibold text-sm">{c.name}</h2>
              <p className="text-xs muted">{c.blurb}</p>
            </div>
            <label className="block text-sm font-medium">
              Puntaje {r.score || "—"}/5
              <input
                className="w-full mt-2"
                type="range"
                min={0}
                max={5}
                step={1}
                value={r.score}
                onChange={(e) => setRating(c.id, { score: Number(e.target.value) })}
              />
            </label>
            <VoiceTextarea
              label="Evidencia (1 línea)"
              value={r.evidence}
              onChange={(v) => setRating(c.id, { evidence: v })}
              className="field min-h-16"
              placeholder="Logro o ejemplo concreto"
              dictationLabel="Dictar"
            />
          </section>
        );
      })}

      <section className="bento-card space-y-2">
        <h2 className="font-semibold text-sm">Tu top 5</h2>
        {top.length === 0 ? (
          <p className="text-sm muted">Puntúa al menos algunas competencias.</p>
        ) : (
          <ul className="text-sm space-y-1">
            {top.map((t) => (
              <li key={t.id}>
                • {competencyLabel(t.id)} ({t.score}/5)
                {t.evidence ? ` — ${t.evidence}` : ""}
              </li>
            ))}
          </ul>
        )}
        <VoiceTextarea
          label="Gap a cerrar en 30 días"
          value={wb.competencies.gap30Days}
          onChange={(v) =>
            save({
              ...wb,
              competencies: { ...wb.competencies, gap30Days: v, updatedAt: Date.now() },
            })
          }
          className="field min-h-16"
          dictationLabel="Dictar"
        />
      </section>

      <CoachAsk
        coachModule="mapa de carrera"
        placeholder="Ej.: ¿cómo convierto mi top competencia en una viñeta de CV?"
      />

      <button type="button" className="btn-primary" onClick={markDone}>
        Marcar competencias como completo
      </button>
      {msg ? <p className="text-sm muted">{msg}</p> : null}

      <Link href="/outplacement/cuadernillo/mapa" className="btn-secondary">
        Llevar al mapa
      </Link>
      <Link href="/outplacement/cuadernillo/soar" className="btn-secondary">
        Banco SOAR
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
