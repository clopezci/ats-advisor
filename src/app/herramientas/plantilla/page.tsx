"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DictationButton } from "@/components/DictationButton";
import { SpeakButton } from "@/components/SpeakButton";
import { downloadText } from "@/lib/ats/report";

export default function PlantillaPage() {
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

      <label className="text-sm">
        Nombre
        <div className="mt-1 flex gap-2">
          <input
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ejemplo: María Gómez"
          />
          <DictationButton onResult={(t) => setName((p) => (p ? `${p} ${t}` : t))} />
        </div>
      </label>
      <label className="text-sm">
        Cargo objetivo
        <input
          className="field mt-1"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Ejemplo: Analista de datos"
        />
      </label>
      <label className="text-sm">
        Skills (separadas por coma)
        <input
          className="field mt-1"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Ejemplo: Excel, Power BI, SQL"
        />
      </label>
      <label className="text-sm">
        Un logro STAR
        <textarea
          className="field mt-1 min-h-20"
          value={achievement}
          onChange={(e) => setAchievement(e.target.value)}
          placeholder="Ejemplo: En el banco X reduje el cierre mensual de 8 a 3 días armando un tablero en Power BI."
        />
      </label>

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
