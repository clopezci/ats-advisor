"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
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
          <h1 className="text-xl font-semibold">Multi-oferta</h1>
          <SpeakButton text="Compara tu CV contra varias vacantes y prioriza dónde postular." />
        </div>
        <p className="text-sm muted">Hasta 10 ofertas. Separa con una línea --- si pegas varias.</p>
      </section>

      <div className="bento-card space-y-2">
        <label className="text-sm font-medium">Tu CV</label>
        <textarea className="field min-h-28" value={cv} onChange={(e) => setCv(e.target.value)} />
        <label className="text-sm font-medium">
          Perfil ATS
          <select
            className="field mt-1"
            value={profile}
            onChange={(e) => setProfile(e.target.value as AtsProfile)}
          >
            <option value="generic">Genérico</option>
            <option value="workday">Workday</option>
            <option value="greenhouse">Greenhouse</option>
            <option value="taleo">Taleo</option>
            <option value="successfactors">SuccessFactors</option>
            <option value="lever">Lever</option>
            <option value="sap">SAP</option>
          </select>
        </label>
      </div>

      <div className="bento-card space-y-2">
        <label className="text-sm font-medium">Pegar oferta(s)</label>
        <textarea
          className="field min-h-32"
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          placeholder={"Oferta 1...\n---\nOferta 2..."}
        />
        <div className="flex flex-col gap-2">
          <button type="button" className="btn-secondary" onClick={addOne}>
            Agregar una
          </button>
          <button type="button" className="btn-secondary" onClick={parseBulk}>
            Agregar lote (separadas por ---)
          </button>
        </div>
        <p className="text-xs muted">{jobs.length} ofertas en cola</p>
      </div>

      <button type="button" className="btn-primary" disabled={cv.length < 40 || jobs.length < 1} onClick={run}>
        Rankear ofertas
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
            Optimizar esta vacante en ATS
          </button>
        </section>
      ))}

      <Link href="/ats" className="btn-secondary">
        Volver al ATS
      </Link>
    </div>
  );
}
