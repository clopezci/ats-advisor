"use client";


import { CourseWithTool } from "@/components/CourseWithTool";
import { toolCourseById } from "@/lib/courses/toolCourses";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { readProgress, saveProgress } from "@/lib/progress/courses";

const CODE = "MODE-90";

const DAYS = [
  { d: 1, t: "Escucha activa", c: "Agenda 1:1 con tu jefe: ¿cómo se ve el éxito a 30 días?" },
  { d: 15, t: "Primer aporte visible", c: "Entrega un quick win documentado y compártelo." },
  { d: 30, t: "Mapa de stakeholders", c: "Lista quién decide, quién influye y quién informa." },
  { d: 45, t: "Ritmo sostenible", c: "Ajusta carga: qué delegar, qué documentar, qué automatizar." },
  { d: 60, t: "Mejora de proceso", c: "Propón un cambio pequeño con métrica." },
  { d: 75, t: "Visibilidad", c: "Comparte progreso con stakeholders clave (no solo tu jefe)." },
  { d: 90, t: "Revisión de trayectoria", c: "Pide feedback formal y acuerda siguientes metas." },
];

function Dias90Tool() {
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    const p = readProgress()[CODE];
    setDone(p?.completed || []);
  }, []);

  function toggle(d: number) {
    const next = done.includes(d) ? done.filter((x) => x !== d) : [...done, d].sort((a, b) => a - b);
    setDone(next);
    saveProgress(CODE, Math.max(...next, 1), next);
  }

  const pct = Math.round((done.length / DAYS.length) * 100);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-semibold">Primeros 90 días</h1>
          <SpeakButton text="Modo onboarding: marca cada hito. Ideal al pausar outplacement cuando consigues trabajo." />
        </div>
        <p className="text-sm muted">Progreso {done.length}/{DAYS.length} · {pct}%</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </section>
      {DAYS.map((x) => (
        <button
          key={x.d}
          type="button"
          className="bento-card text-left"
          style={
            done.includes(x.d)
              ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
              : undefined
          }
          onClick={() => toggle(x.d)}
        >
          <p className="pill-brand">Día {x.d}{done.includes(x.d) ? " · hecho" : ""}</p>
          <h2 className="mt-2 font-semibold">{x.t}</h2>
          <p className="mt-1 text-sm muted">{x.c}</p>
        </button>
      ))}
      <Link href="/outplacement/certificado" className="btn-primary">
        Ver certificado de avance
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}


export default function Page() {
  const course = toolCourseById("primeros-90-dias");
  if (!course) return null;
  return (
    <CourseWithTool course={course}>
      <Dias90Tool />
    </CourseWithTool>
  );
}
