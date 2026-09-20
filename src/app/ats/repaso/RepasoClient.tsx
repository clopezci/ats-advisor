"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SpeakButton } from "@/components/SpeakButton";
import { DictationButton } from "@/components/DictationButton";
import { getJob, listJobs, upsertJob, type JobItem } from "@/lib/tracker/jobs";
import { upsertRoleReviewPlan } from "@/lib/roleReview/storage";
import {
  ROLE_REVIEW_MODE_LABEL,
  type RoleReviewLearnTopic,
  type RoleReviewMode,
  type RoleReviewPlan,
} from "@/lib/roleReview/types";

type GapRow = { term: string; source: RoleReviewLearnTopic["source"]; wantLearn: boolean };

export default function RepasoClient() {
  const params = useSearchParams();
  const jobIdParam = params.get("jobId") || "";

  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [jobId, setJobId] = useState(jobIdParam);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobText, setJobText] = useState("");
  const [mode, setMode] = useState<RoleReviewMode>("refuerzo");
  const [minutes, setMinutes] = useState(30);
  const [gaps, setGaps] = useState<GapRow[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const list = listJobs();
    setJobs(list);

    let fromAts: {
      missing?: string[];
      hardMissing?: string[];
      matched?: string[];
      hardMatched?: string[];
      jobText?: string;
      title?: string;
    } | null = null;
    try {
      const last = JSON.parse(localStorage.getItem("ats_last_result") || "null");
      if (last?.result) {
        fromAts = {
          missing: last.result.mustHave?.missing || [],
          hardMissing: last.result.hardSkills?.missing || [],
          matched: last.result.mustHave?.matched || [],
          hardMatched: last.result.hardSkills?.matched || [],
          jobText: last.jobText,
          title: last.companyName || last.title,
        };
      }
    } catch {
      /* ignore */
    }

    const jid = jobIdParam || "";
    const job = jid ? getJob(jid) : null;
    if (job) {
      setJobId(job.id);
      setJobTitle(job.title);
      setCompany(job.company);
      setJobText(job.jobText || fromAts?.jobText || "");
    } else if (fromAts?.jobText) {
      setJobText(fromAts.jobText);
      if (fromAts.title) setJobTitle(String(fromAts.title));
    }

    const terms = new Map<string, GapRow>();
    for (const t of fromAts?.missing || []) {
      const term = String(t).trim();
      if (term) terms.set(term.toLowerCase(), { term, source: "ats_missing", wantLearn: false });
    }
    for (const t of fromAts?.hardMissing || []) {
      const term = String(t).trim();
      if (term && !terms.has(term.toLowerCase())) {
        terms.set(term.toLowerCase(), { term, source: "ats_hard", wantLearn: false });
      }
    }
    for (const t of job?.learnTopics || []) {
      const term = String(t).trim();
      if (!term) continue;
      const prev = terms.get(term.toLowerCase());
      terms.set(term.toLowerCase(), {
        term: prev?.term || term,
        source: prev?.source || "manual",
        wantLearn: true,
      });
    }
    setGaps([...terms.values()]);

    const str = [...(fromAts?.matched || []), ...(fromAts?.hardMatched || [])]
      .map((s) => String(s).trim())
      .filter(Boolean);
    setStrengths([...new Set(str)].slice(0, 16));
  }, [jobIdParam]);

  const optInCount = useMemo(() => gaps.filter((g) => g.wantLearn).length, [gaps]);

  async function generate() {
    setMsg("");
    setLoading(true);
    try {
      const learnTopics: RoleReviewLearnTopic[] = gaps.map((g) => ({
        term: g.term,
        optIn: g.wantLearn,
        source: g.source,
      }));

      const res = await fetch("/api/role-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          minutesPerDay: minutes,
          jobTitle,
          company,
          jobText,
          learnTopics,
          knownStrengths: strengths,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "No se pudo generar el repaso.");
        return;
      }

      const now = Date.now();
      const plan: RoleReviewPlan = {
        id: `rr_${now}_${Math.random().toString(36).slice(2, 6)}`,
        jobId: jobId || undefined,
        title: data.plan.title,
        objective: data.plan.objective,
        mode: data.plan.mode,
        learnTopics: data.plan.learnTopics || learnTopics,
        days: data.plan.days,
        challenges: data.plan.challenges,
        createdAt: now,
        updatedAt: now,
        completedDays: [],
        completedChallenges: [],
      };
      upsertRoleReviewPlan(plan);

      if (jobId) {
        const job = getJob(jobId);
        if (job) {
          upsertJob({
            ...job,
            id: jobId,
            jobText,
            learnTopics: learnTopics.filter((t) => t.optIn).map((t) => t.term),
            roleReviewPlanId: plan.id,
          });
        }
      }

      window.location.href = `/ats/repaso/player?id=${encodeURIComponent(plan.id)}`;
    } catch {
      setMsg("Error de red al generar el repaso.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Gratis · anclado a tu vacante</p>
            <h1 className="text-xl font-semibold">Repaso del rol</h1>
          </div>
          <SpeakButton text="Arma un plan para practicar lo que pide la vacante, con retos del trabajo diario, sin inventar experiencia." />
        </div>
        <p className="text-sm muted leading-relaxed">
          Para no enfriar el oficio mientras buscas empleo: estudias lo del aviso y haces retos como
          los de un día real de trabajo. Si algo no lo sabes, márcalo y entra al plan.
        </p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="text-sm font-semibold">1. Vacante</h2>
        {jobs.length > 0 ? (
          <label className="text-sm block">
            Desde el tracker
            <select
              className="field mt-1"
              value={jobId}
              onChange={(e) => {
                const id = e.target.value;
                setJobId(id);
                const j = getJob(id);
                if (j) {
                  setJobTitle(j.title);
                  setCompany(j.company);
                  if (j.jobText) setJobText(j.jobText);
                }
              }}
            >
              <option value="">— Elegir o pegar abajo —</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} · {j.company}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <input
          className="field"
          placeholder="Cargo"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <input
          className="field"
          placeholder="Empresa"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <div className="flex gap-2">
          <textarea
            className="field min-h-36"
            placeholder="Pega aquí el aviso completo de la vacante"
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
          />
          <DictationButton label="Dictar aviso" onResult={(t) => setJobText((p) => `${p} ${t}`.trim())} />
        </div>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="text-sm font-semibold">2. Honestidad: ¿qué quieres aprender?</h2>
        <p className="text-xs muted leading-relaxed">
          Si el análisis ATS marcó algo que no dominas, no lo inventes en el CV. Márcalo aquí y lo
          metemos al plan de estudio + retos.
        </p>
        {gaps.length === 0 ? (
          <p className="text-sm muted">
            No hay gaps cargados. Analiza primero en{" "}
            <Link href="/ats" style={{ color: "var(--brand)" }}>
              /ats
            </Link>{" "}
            o agrega temas manualmente abajo.
          </p>
        ) : (
          <ul className="space-y-2">
            {gaps.map((g) => (
              <li
                key={g.term}
                className="flex items-start gap-2 text-sm rounded-lg p-2"
                style={{ border: "1px solid var(--border)" }}
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={g.wantLearn}
                  onChange={(e) => {
                    setGaps((prev) =>
                      prev.map((x) => (x.term === g.term ? { ...x, wantLearn: e.target.checked } : x))
                    );
                  }}
                />
                <div>
                  <p className="font-medium">{g.term}</p>
                  <p className="text-xs muted">
                    {g.wantLearn
                      ? "Entrará al plan: teoría corta + reto del trabajo diario."
                      : "¿Quieres comenzar a aprenderlo?"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            const term = window.prompt("Tema a aprender (ej. CI/CD, Power BI, Scrum):");
            if (!term?.trim()) return;
            setGaps((prev) => [...prev, { term: term.trim(), source: "manual", wantLearn: true }]);
          }}
        >
          Agregar tema manual
        </button>
        <p className="text-xs muted">Marcados para aprender: {optInCount}</p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="text-sm font-semibold">3. Modo y tiempo</h2>
        <label className="text-sm block">
          Modo
          <select
            className="field mt-1"
            value={mode}
            onChange={(e) => setMode(e.target.value as RoleReviewMode)}
          >
            {(Object.keys(ROLE_REVIEW_MODE_LABEL) as RoleReviewMode[]).map((m) => (
              <option key={m} value={m}>
                {ROLE_REVIEW_MODE_LABEL[m]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm block">
          Minutos por día
          <select
            className="field mt-1"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          >
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={45}>45</option>
          </select>
        </label>
        <button
          type="button"
          className="btn-primary"
          disabled={loading || jobText.trim().length < 40}
          onClick={generate}
        >
          {loading ? "Armando plan y retos…" : "Generar repaso del rol"}
        </button>
        {msg ? (
          <p className="text-sm" style={{ color: "var(--danger, #b42318)" }}>
            {msg}
          </p>
        ) : null}
      </section>

      <Link href="/tracker" className="btn-secondary">
        Volver al tracker
      </Link>
    </div>
  );
}
