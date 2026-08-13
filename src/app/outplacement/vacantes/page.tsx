"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { CvPasteField } from "@/components/CvPasteField";
import { rankJobs } from "@/lib/outplacement/jobFeed";

export default function VacantesPage() {
  const [cv, setCv] = useState("");
  const ranked = useMemo(() => rankJobs(cv), [cv]);

  useEffect(() => {
    try {
      const ws = JSON.parse(localStorage.getItem("ats_workspace") || "null");
      if (ws?.cvText) setCv(String(ws.cvText));
      else {
        const last = localStorage.getItem("ats_last_cv_text");
        if (last) setCv(last);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 2 · búsqueda</p>
            <h1 className="mt-1 text-2xl font-semibold">Vacantes rankeadas</h1>
          </div>
          <SpeakButton text="Feed curado LATAM ordenado por match con tu CV. Pega o reutiliza el texto del último análisis ATS." />
        </div>
        <p className="text-sm muted">
          Demo con vacantes tipo + score local. No scrapea portales en vivo (cumple ToS); úsalo para
          priorizar y luego postula en el portal oficial.
        </p>
      </section>

      <CvPasteField
        value={cv}
        onChange={setCv}
        label="Tu hoja de vida"
        hint="Con tu CV ordenamos estas vacantes de ejemplo. No postula por ti: después abres el enlace del aviso."
      />
      <Link href="/ats" className="btn-secondary">
        Analizar un CV a fondo
      </Link>

      {ranked.map(({ job, score }) => (
        <article key={job.id} className="bento-card space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold">{job.title}</h2>
              <p className="text-sm muted">
                {job.company} · {job.city} · {job.modality} · {job.seniority}
              </p>
            </div>
            <span className="pill-brand">{score}%</span>
          </div>
          <p className="text-xs muted">
            Keywords: {job.keywords.join(", ")} · {job.portal} · {job.postedLabel}
          </p>
          <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
            Abrir portal
          </a>
        </article>
      ))}

      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
