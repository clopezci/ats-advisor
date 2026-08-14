"use client";


import { CourseWithTool } from "@/components/CourseWithTool";
import { toolCourseById } from "@/lib/courses/toolCourses";
import { useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput, VoiceTextarea } from "@/components/VoiceField";
import { buildPortfolioDraft } from "@/lib/outplacement/portfolioDraft";

function PortfolioTool() {
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
        <VoiceInput
          label="En qué cargo ocurrió (tu rol, no el de la vacante)"
          value={role}
          onChange={setRole}
          placeholder="Ejemplo: Analista de datos en un banco"
          dictationLabel="Dictar cargo"
        />
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
          <VoiceTextarea
            key={label}
            label={label}
            value={val}
            onChange={set}
            className="field min-h-20"
            placeholder={example}
            dictationLabel={`Dictar ${label}`}
          />
        ))}
        <VoiceInput
          label="Habilidades que demostraste (opcional)"
          value={skills}
          onChange={setSkills}
          placeholder="Ejemplo: Power BI, Excel, coordinación con contabilidad"
          dictationLabel="Dictar habilidades"
        />
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


export default function Page() {
  const course = toolCourseById("portfolio-star");
  if (!course) return null;
  return (
    <CourseWithTool course={course}>
      <PortfolioTool />
    </CourseWithTool>
  );
}
