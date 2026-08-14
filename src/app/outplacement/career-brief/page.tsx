"use client";


import { CourseWithTool } from "@/components/CourseWithTool";
import { toolCourseById } from "@/lib/courses/toolCourses";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput, VoiceTextarea } from "@/components/VoiceField";
import { loadRiasecResult } from "@/lib/outplacement/riasec";
import { openCareerBriefPrint } from "@/lib/outplacement/careerBrief";

function CareerBriefTool() {
  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [city, setCity] = useState("Colombia");
  const [strengths, setStrengths] = useState("");
  const [gaps, setGaps] = useState("");
  const [next30, setNext30] = useState("");
  const [hasRiasec, setHasRiasec] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
      if (p?.name) setName(p.name);
      const r = loadRiasecResult();
      setHasRiasec(Boolean(r));
      if (r?.roles[0]) setTargetRole(r.roles[0].title);
    } catch {
      /* ignore */
    }
  }, []);

  function generate() {
    const riasec = loadRiasecResult();
    const ok = openCareerBriefPrint({
      name: name || "Candidato",
      targetRole,
      city,
      riasec,
      strengths,
      gaps,
      next30,
    });
    setMsg(
      ok
        ? "Abrimos el brief para imprimir / guardar PDF. Si no ves la ventana, permite pop-ups."
        : "El navegador bloqueó la ventana. Permite pop-ups o usa otro navegador."
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 1 · Autoevaluación y mercado</p>
            <h1 className="mt-1 text-2xl font-semibold">Career Brief</h1>
          </div>
          <SpeakButton text="Genera una página PDF con tu perfil RIASEC, roles LATAM y plan de 30 días." />
        </div>
        <p className="text-sm muted">
          Artefacto de 1 página para compartir con coach, familia o RH.{" "}
          {hasRiasec ? "Assessment detectado." : "Recomendado: haz antes el assessment RIASEC."}
        </p>
        {!hasRiasec && (
          <Link href="/outplacement/assessment" className="btn-secondary">
            Ir al assessment
          </Link>
        )}
      </section>

      <div className="bento-card space-y-3">
        <VoiceInput
          label="Tu nombre"
          value={name}
          onChange={setName}
          placeholder="Ejemplo: María Gómez"
          dictationLabel="Dictar nombre"
        />
        <VoiceInput
          label="Ciudad / país"
          value={city}
          onChange={setCity}
          placeholder="Ejemplo: Bogotá, Colombia"
          dictationLabel="Dictar ciudad"
        />
        <VoiceInput
          label="Cargo al que apuntas"
          value={targetRole}
          onChange={setTargetRole}
          placeholder="Ejemplo: Analista de datos"
          dictationLabel="Dictar cargo"
        />
        <VoiceTextarea
          label="Fortalezas (3 evidencias)"
          value={strengths}
          onChange={setStrengths}
          className="field min-h-[80px]"
          placeholder="Ejemplo: 3 años armando tableros; bajé el cierre de 8 a 3 días; coordino con gerencia."
          dictationLabel="Dictar fortalezas"
        />
        <VoiceTextarea
          label="Qué te falta o quieres aprender"
          value={gaps}
          onChange={setGaps}
          className="field min-h-[80px]"
          placeholder="Ejemplo: SQL más avanzado; inglés B2; práctica de entrevistas."
          dictationLabel="Dictar gaps"
        />
        <VoiceTextarea
          label="Qué harás en los próximos 30 días"
          value={next30}
          onChange={setNext30}
          className="field min-h-[80px]"
          placeholder="Ejemplo: 2 postulaciones al día; 1 práctica de entrevista; actualizar LinkedIn."
          dictationLabel="Dictar plan"
        />
        <button type="button" className="btn-primary" onClick={generate}>
          Generar / imprimir PDF
        </button>
        {msg && <p className="text-sm">{msg}</p>}
      </div>

      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}


export default function Page() {
  const course = toolCourseById("career-brief");
  if (!course) return null;
  return (
    <CourseWithTool course={course}>
      <CareerBriefTool />
    </CourseWithTool>
  );
}
