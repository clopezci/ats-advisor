"use client";


import { CourseWithTool } from "@/components/CourseWithTool";
import { toolCourseById } from "@/lib/courses/toolCourses";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import {
  assistBulletToEn,
  BULLET_GLOSSARY,
  EN_CV_RULES,
  REMOTE_CHECKLIST,
  REMOTE_STORAGE_KEY,
} from "@/lib/outplacement/remoteBilingual";

function RemotoTool() {
  const [esBullet, setEsBullet] = useState("");
  const [enBullet, setEnBullet] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(REMOTE_STORAGE_KEY) || "{}");
      if (raw && typeof raw === "object") setChecks(raw);
    } catch {
      /* ignore */
    }
  }, []);

  function toggle(id: string) {
    const next = { ...checks, [id]: !checks[id] };
    setChecks(next);
    localStorage.setItem(REMOTE_STORAGE_KEY, JSON.stringify(next));
  }

  const done = REMOTE_CHECKLIST.filter((c) => checks[c.id]).length;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 1 · remoto LATAM</p>
            <h1 className="mt-1 text-2xl font-semibold">CV bilingüe y remoto</h1>
          </div>
          <SpeakButton text="Checklist para empleo remoto y ayuda ES a EN para viñetas del CV. Revisa siempre con un humano." />
        </div>
        <p className="text-sm muted">
          No es traducción automática perfecta: glosario + reglas ATS en inglés.
        </p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Reglas CV en inglés</h2>
        <ul className="space-y-1 text-sm muted">
          {EN_CV_RULES.map((r) => (
            <li key={r.slice(0, 32)}>• {r}</li>
          ))}
        </ul>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Asistente de viñeta ES → EN</h2>
        <VoiceTextarea
          label="Viñeta en español"
          value={esBullet}
          onChange={setEsBullet}
          className="field min-h-[80px]"
          placeholder="Ejemplo: Reduje el cierre mensual de 8 a 3 días armando un tablero en Power BI."
          dictationLabel="Dictar viñeta"
        />
        <button
          type="button"
          className="btn-primary"
          onClick={() => setEnBullet(assistBulletToEn(esBullet))}
        >
          Sugerir inglés
        </button>
        {enBullet && (
          <div>
            <p className="text-sm font-medium">Sugerencia</p>
            <p className="text-sm muted leading-relaxed">{enBullet}</p>
            <button
              type="button"
              className="btn-secondary mt-2"
              onClick={() => navigator.clipboard?.writeText(enBullet)}
            >
              Copiar
            </button>
          </div>
        )}
        <details className="text-sm">
          <summary className="cursor-pointer font-medium">Glosario rápido</summary>
          <ul className="mt-2 space-y-1 muted">
            {BULLET_GLOSSARY.map((g) => (
              <li key={g.es}>
                {g.es} → {g.en}
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">
          Checklist remoto LATAM ({done}/{REMOTE_CHECKLIST.length})
        </h2>
        {REMOTE_CHECKLIST.map((c) => (
          <label key={c.id} className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={Boolean(checks[c.id])} onChange={() => toggle(c.id)} />
            <span>{c.label}</span>
          </label>
        ))}
      </section>

      <Link href="/ats" className="btn-primary">
        Validar CV en ATS
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}


export default function Page() {
  const course = toolCourseById("remoto-bilingue");
  if (!course) return null;
  return (
    <CourseWithTool course={course}>
      <RemotoTool />
    </CourseWithTool>
  );
}
