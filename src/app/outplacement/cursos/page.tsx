"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import {
  EXTERNAL_COURSES,
  readCourseProgress,
  writeCourseProgress,
  type CourseProgressMap,
  type CourseProgressStatus,
} from "@/lib/outplacement/externalCourses";

const STATUS_LABEL: Record<CourseProgressStatus, string> = {
  todo: "Por hacer",
  doing: "En curso",
  done: "Hecho",
};

export default function CursosExternosPage() {
  const [progress, setProgress] = useState<CourseProgressMap>({});
  const [tag, setTag] = useState("all");

  useEffect(() => {
    setProgress(readCourseProgress());
  }, []);

  const tags = useMemo(() => {
    const s = new Set<string>();
    EXTERNAL_COURSES.forEach((c) => c.tags.forEach((t) => s.add(t)));
    return ["all", ...Array.from(s).sort()];
  }, []);

  const visible = EXTERNAL_COURSES.filter((c) => tag === "all" || c.tags.includes(tag));

  const counts = useMemo(() => {
    let done = 0;
    let doing = 0;
    EXTERNAL_COURSES.forEach((c) => {
      const st = progress[c.id] || "todo";
      if (st === "done") done += 1;
      if (st === "doing") doing += 1;
    });
    return { done, doing, total: EXTERNAL_COURSES.length };
  }, [progress]);

  function setStatus(id: string, status: CourseProgressStatus) {
    const next = { ...progress, [id]: status };
    setProgress(next);
    writeCourseProgress(next);
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 3 · Upskilling</p>
            <h1 className="mt-1 text-2xl font-semibold">Cursos externos low-cost</h1>
          </div>
          <SpeakButton text="Catálogo curado. Marca en curso o hecho para tu corte semanal de upskilling." />
        </div>
        <p className="text-sm muted">
          No son cursos de ATSAdvisor: son recomendaciones para cerrar gaps. El progreso se guarda
          en este dispositivo.
        </p>
        <p className="text-xs muted">
          Hechos {counts.done}/{counts.total} · En curso {counts.doing}
        </p>
      </section>

      <label className="block text-sm">
        Filtro
        <select className="field mt-1" value={tag} onChange={(e) => setTag(e.target.value)}>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "Todos" : t}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-3">
        {visible.map((c) => {
          const st = progress[c.id] || "todo";
          return (
            <article key={c.id} className="bento-card space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-semibold">{c.title}</h2>
                <span className="text-xs muted">{STATUS_LABEL[st]}</span>
              </div>
              <p className="text-xs muted">
                {c.provider} · {c.level} · {c.hours} · {c.costHint}
              </p>
              <p className="text-sm muted">{c.why}</p>
              <div className="flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span key={t} className="pill-brand text-xs">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Abrir curso
                </a>
                <button type="button" className="btn-secondary" onClick={() => setStatus(c.id, "doing")}>
                  En curso
                </button>
                <button type="button" className="btn-secondary" onClick={() => setStatus(c.id, "done")}>
                  Marcar hecho
                </button>
                <button type="button" className="btn-secondary" onClick={() => setStatus(c.id, "todo")}>
                  Reset
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <Link href="/outplacement/out09" className="btn-secondary">
        Preferir curso a tu medida (add-on)
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver a outplacement
      </Link>
    </div>
  );
}
