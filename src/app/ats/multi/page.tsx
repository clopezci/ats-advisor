"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { CvPasteField, JobPasteField } from "@/components/CvPasteField";
import { JOBS_MULTI_EXAMPLE } from "@/lib/copy/fieldExamples";
import { rankJobsAgainstCv, type MultiJobResult } from "@/lib/ats/multiMatch";
import type { AtsProfile } from "@/lib/ats/engine";

type JobDraft = { id: string; title: string; text: string };

export default function MultiMatchPage() {
  const [cv, setCv] = useState("");
  const [bulk, setBulk] = useState("");
  const [jobs, setJobs] = useState<JobDraft[]>([]);
  const [ranked, setRanked] = useState<MultiJobResult[]>([]);
  const [profile, setProfile] = useState<AtsProfile>("generic");

  useEffect(() => {
    try {
      const ws = JSON.parse(localStorage.getItem("ats_workspace") || "null");
      if (ws?.cvText) setCv(ws.cvText);
      const saved = JSON.parse(localStorage.getItem("ats_multi_jobs") || "[]");
      if (Array.isArray(saved) && saved.length) setJobs(saved);
    } catch {
      /* ignore */
    }
  }, []);

  function parseBulk() {
    const chunks = bulk
      .split(/\n---+\n|\n={3,}\n/)
      .map((c) => c.trim())
      .filter((c) => c.length >= 40);
    const next = chunks.map((text, i) => ({
      id: `job_${Date.now()}_${i}`,
      title: text.split("\n")[0].slice(0, 70),
      text,
    }));
    setJobs((prev) => {
      const merged = [...next, ...prev].slice(0, 10);
      localStorage.setItem("ats_multi_jobs", JSON.stringify(merged));
      return merged;
    });
    setBulk("");
  }

  function addOne() {
    if (bulk.trim().length < 40) return;
    const j = {
      id: `job_${Date.now()}`,
      title: bulk.split("\n")[0].slice(0, 70),
      text: bulk.trim(),
    };
    setJobs((prev) => {
      const merged = [j, ...prev].slice(0, 10);
      localStorage.setItem("ats_multi_jobs", JSON.stringify(merged));
      return merged;
    });
    setBulk("");
  }

  function run() {
    const r = rankJobsAgainstCv(cv, jobs, profile);
    setRanked(r);
    try {
      localStorage.setItem("ats_multi_rank", JSON.stringify(r));
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Comparar varias vacantes</h1>
          <SpeakButton text="Primero tu hoja de vida. Después las ofertas. Te dice en cuál encajas más. No postula por ti." />
        </div>
        <p className="text-sm muted leading-relaxed">
          Hay dos recuadros distintos: el de arriba es TU CV. El de abajo son los AVISOS de empleo.
        </p>
      </section>

      <CvPasteField
        value={cv}
        onChange={setCv}
        label="1. Tu hoja de vida"
        hint="Una sola vez: el CV tuyo. Sirve para compararlo con varias vacantes. No pongas aquí los avisos."
      />

      <div className="bento-card space-y-2">
        <JobPasteField
          framed={false}
          value={bulk}
          onChange={setBulk}
          label="2. Las vacantes (avisos de empleo)"
          hint="Copia el texto del aviso. Si tienes varias, pega todas y sepáralas con una línea que diga --- luego toca Agregar."
          example={JOBS_MULTI_EXAMPLE}
        />
        <div className="flex flex-col gap-2">
          <button type="button" className="btn-secondary" onClick={addOne}>
            Agregar esta vacante
          </button>
          <button type="button" className="btn-secondary" onClick={parseBulk}>
            Agregar varias (separadas por ---)
          </button>
        </div>
        <p className="text-xs muted">
          {jobs.length === 0
            ? "Aún no has agregado vacantes. Pega un aviso y toca Agregar."
            : `${jobs.length} vacante${jobs.length === 1 ? "" : "s"} lista${jobs.length === 1 ? "" : "s"} para comparar.`}
        </p>
        {jobs.map((j) => (
          <p key={j.id} className="text-xs muted">
            • {j.title}
          </p>
        ))}
      </div>

      <details className="bento-card text-sm">
        <summary className="cursor-pointer font-medium">Opcional: si sabes qué software usa la empresa</summary>
        <p className="mt-2 text-xs muted">
          Workday, Greenhouse, etc. son los programas con los que filtran CVs. Si no lo sabes, déjalo en “No lo sé”.
        </p>
        <select
          className="field mt-2"
          value={profile}
          onChange={(e) => setProfile(e.target.value as AtsProfile)}
        >
          <option value="generic">No lo sé</option>
          <option value="workday">Workday</option>
          <option value="greenhouse">Greenhouse</option>
          <option value="taleo">Taleo</option>
          <option value="successfactors">SuccessFactors</option>
          <option value="lever">Lever</option>
          <option value="sap">SAP</option>
        </select>
      </details>

      <button type="button" className="btn-primary" disabled={cv.length < 40 || jobs.length < 1} onClick={run}>
        Comparar y ordenar
      </button>

      {ranked.map((r, idx) => (
        <section key={r.id} className="bento-card space-y-2">
          <div className="flex justify-between gap-2">
            <h2 className="font-semibold text-sm">
              #{idx + 1} · {r.title}
            </h2>
            <span className="pill-brand">{r.score}%</span>
          </div>
          <p className="text-xs muted">Prob. entrevista ~{r.interviewProbability}%</p>
          <p className="text-sm">{r.recommendation}</p>
          {r.mustMissing.length > 0 && (
            <p className="text-xs muted">Must-have faltantes: {r.mustMissing.join(", ")}</p>
          )}
          {r.exclusiveGaps.length > 0 && (
            <p className="text-xs" style={{ color: "var(--danger, #b42318)" }}>
              {r.exclusiveGaps.join(" · ")}
            </p>
          )}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              const full = jobs.find((j) => j.id === r.id);
              if (full) {
                localStorage.setItem(
                  "ats_workspace",
                  JSON.stringify({ cvText: cv, jobText: full.text, atsProfile: profile, savedAt: Date.now() })
                );
              }
              window.location.href = "/ats";
            }}
          >
            Analizar esta vacante a fondo
          </button>
        </section>
      ))}

      <Link href="/ats" className="btn-secondary">
        Volver al ATS
      </Link>
    </div>
  );
}
