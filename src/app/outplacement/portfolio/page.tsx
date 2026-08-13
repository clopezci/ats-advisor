"use client";

import { useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { DictationButton } from "@/components/DictationButton";
import { buildPortfolioDraft } from "@/lib/outplacement/portfolioDraft";

export default function PortfolioPage() {
  const [role, setRole] = useState("");
  const [situation, setSituation] = useState("");
  const [task, setTask] = useState("");
  const [action, setAction] = useState("");
  const [result, setResult] = useState("");
  const [skills, setSkills] = useState("");
  const [draft, setDraft] = useState<ReturnType<typeof buildPortfolioDraft> | null>(null);

  function generate() {
    setDraft(buildPortfolioDraft({ role, situation, task, action, result, skills }));
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 4 · evidencia</p>
            <h1 className="mt-1 text-2xl font-semibold">Caso / portfolio STAR</h1>
          </div>
          <SpeakButton text="Convierte un logro en post LinkedIn, one-pager y viñeta de CV." />
        </div>
        <p className="text-sm muted">
          Ideal para pivotes y segunda carrera: demuestra dominio con un caso visible.
        </p>
      </section>

      <section className="bento-card space-y-3">
        <label className="block text-sm">
          En qué cargo ocurrió (tu rol, no el de la vacante)
          <input
            className="field mt-1"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Ejemplo: Analista de datos en un banco"
          />
        </label>
        {(
          [
            [
              "Situación",
              situation,
              setSituation,
              "¿Dónde estabas y cuál era el problema?\nEjemplo: El cierre mensual tardaba 8 días y gerencia no tenía tablero.",
            ],
            [
              "Tarea",
              task,
              setTask,
              "¿Qué te pidieron a ti?\nEjemplo: Me pidieron bajar el tiempo de cierre y armar un tablero.",
            ],
            [
              "Acción",
              action,
              setAction,
              "¿Qué hiciste tú (pasos concretos)?\nEjemplo: Armé un tablero en Power BI y un checklist de cierre.",
            ],
            [
              "Resultado",
              result,
              setResult,
              "¿Qué cambió, con número si lo tienes?\nEjemplo: El cierre pasó de 8 a 3 días.",
            ],
          ] as const
        ).map(([label, val, set, example]) => (
          <label key={label} className="block text-sm">
            {label}
            <textarea
              className="field mt-1 min-h-20"
              value={val}
              onChange={(e) => set(e.target.value)}
              placeholder={example}
            />
            <DictationButton onResult={(t) => set(`${val} ${t}`.trim())} />
          </label>
        ))}
        <label className="block text-sm">
          Habilidades que demostraste (opcional)
          <input
            className="field mt-1"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Ejemplo: Power BI, Excel, coordinación con contabilidad"
          />
        </label>
        <button type="button" className="btn-primary" onClick={generate}>
          Generar borradores
        </button>
      </section>

      {draft && (
        <section className="bento-card space-y-4 text-sm">
          <div>
            <h2 className="font-semibold">{draft.title}</h2>
            <p className="text-xs muted mt-2">Viñeta CV</p>
            <pre className="whitespace-pre-wrap font-sans muted">{draft.bulletCv}</pre>
          </div>
          <div>
            <p className="text-xs muted">Post LinkedIn</p>
            <pre className="whitespace-pre-wrap font-sans">{draft.linkedinPost}</pre>
          </div>
          <div>
            <p className="text-xs muted">One-pager</p>
            <pre className="whitespace-pre-wrap font-sans">{draft.caseOnePager}</pre>
          </div>
          <Link href="/outplacement/career-brief" className="btn-secondary">
            Ir al Career Brief
          </Link>
        </section>
      )}

      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
