"use client";


import { CourseWithTool } from "@/components/CourseWithTool";
import { toolCourseById } from "@/lib/courses/toolCourses";
import { useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput, VoiceTextarea } from "@/components/VoiceField";
import { downloadText } from "@/lib/ats/report";

function PlantillaTool() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [achievement, setAchievement] = useState("");

  const doc = useMemo(() => {
    return [
      name || "[Tu nombre]",
      role || "[Cargo objetivo]",
      "Ciudad, País · correo@dominio.com · LinkedIn",
      "",
      "PERFIL",
      `Profesional orientado a resultados como ${role || "[cargo]"}. Experiencia aplicando ${skills || "[skills]"} para generar impacto medible.`,
      "",
      "EXPERIENCIA",
      "Empresa | Cargo | MM/AAAA – Actual",
      `• ${achievement || "Logro cuantificado (%, dinero, tiempo o alcance)."}`,
      "• Segunda viñeta con acción + resultado.",
      "",
      "EDUCACIÓN",
      "Título | Institución | Año",
      "",
      "SKILLS",
      skills || "Skill 1, Skill 2, Skill 3",
      "",
      "— Plantilla ATS-safe generada por ATSAdvisor (LOTIC). Una columna, sin tablas.",
    ].join("\n");
  }, [name, role, skills, achievement]);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Plantilla CV ATS</h1>
          <SpeakButton text="Arma una plantilla de una columna compatible con ATS y descárgala en texto." />
        </div>
      </section>

      <VoiceInput
        label="Nombre"
        value={name}
        onChange={setName}
        placeholder="Ejemplo: María Gómez"
        dictationLabel="Dictar nombre"
      />
      <VoiceInput
        label="Cargo objetivo"
        value={role}
        onChange={setRole}
        placeholder="Ejemplo: Analista de datos"
        dictationLabel="Dictar cargo"
      />
      <VoiceInput
        label="Skills (separadas por coma)"
        value={skills}
        onChange={setSkills}
        placeholder="Ejemplo: Excel, Power BI, SQL"
        dictationLabel="Dictar skills"
      />
      <VoiceTextarea
        label="Un logro STAR"
        value={achievement}
        onChange={setAchievement}
        className="field min-h-20"
        placeholder="Ejemplo: En el banco X reduje el cierre mensual de 8 a 3 días armando un tablero en Power BI."
        dictationLabel="Dictar logro"
      />

      <pre className="bento-card text-xs whitespace-pre-wrap muted">{doc}</pre>

      <button type="button" className="btn-primary" onClick={() => downloadText("cv-ats-plantilla.txt", doc)}>
        Descargar TXT
      </button>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => {
          localStorage.setItem("ats_cv_draft", doc);
          window.location.href = "/ats";
        }}
      >
        Usar en analizador ATS
      </button>
      <Link href="/herramientas" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}


export default function Page() {
  const course = toolCourseById("plantilla-cv-ats");
  if (!course) return null;
  return (
    <CourseWithTool course={course}>
      <PlantillaTool />
    </CourseWithTool>
  );
}
