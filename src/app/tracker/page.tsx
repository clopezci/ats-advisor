"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DictationButton } from "@/components/DictationButton";
import { SpeakButton } from "@/components/SpeakButton";
import { AdSlot } from "@/components/AdSlot";
import {
  STATUS_LABEL,
  deleteJob,
  listJobs,
  upsertJob,
  type JobItem,
  type JobStatus,
} from "@/lib/tracker/jobs";
import { FlowContinueBar } from "@/components/FlowContinueBar";

const STATUSES = Object.keys(STATUS_LABEL) as JobStatus[];

export default function TrackerPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<JobStatus | "todos">("todos");

  function refresh() {
    setJobs(listJobs());
  }

  useEffect(() => {
    refresh();
  }, []);

  const visible = useMemo(
    () => (filter === "todos" ? jobs : jobs.filter((j) => j.status === filter)),
    [jobs, filter]
  );

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-semibold">Tracker de postulaciones</h1>
          <SpeakButton text="Organiza tus vacantes por estado: interés, aplicado, entrevista, oferta o rechazo." />
        </div>
        <p className="text-sm muted">Kanban simple. Datos en este dispositivo hasta activar Supabase.</p>
      </section>

      <section className="bento-card space-y-3">
        <p className="text-sm font-medium">Nueva vacante</p>
        <div className="flex gap-2">
          <input
            className="field"
            placeholder="Ejemplo: Analista de datos"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <DictationButton label="Dictar cargo" onResult={(t) => setTitle((p) => (p ? `${p} ${t}` : t))} />
        </div>
        <div className="flex gap-2">
          <input
            className="field"
            placeholder="Ejemplo: Bancolombia"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <DictationButton label="Dictar empresa" onResult={(t) => setCompany((p) => (p ? `${p} ${t}` : t))} />
        </div>
        <div className="flex gap-2">
          <input
            className="field"
            placeholder="Enlace de la vacante (opcional)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <DictationButton label="Dictar enlace" onResult={(t) => setUrl((p) => (p ? `${p} ${t}` : t))} />
        </div>
        <div className="flex gap-2">
          <textarea
            className="field min-h-20"
            placeholder="Ejemplo: me escribieron el martes; entrevista el jueves 10 a.m."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <DictationButton label="Dictar notas" onResult={(t) => setNotes((p) => (p ? `${p} ${t}` : t))} />
        </div>
        <button
          type="button"
          className="btn-primary"
          disabled={!title.trim() || !company.trim()}
          onClick={() => {
            upsertJob({
              title: title.trim(),
              company: company.trim(),
              url: url.trim() || undefined,
              notes: notes.trim() || undefined,
              status: "interes",
            });
            setTitle("");
            setCompany("");
            setUrl("");
            setNotes("");
            refresh();
          }}
        >
          Guardar
        </button>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button type="button" className="pill-brand" onClick={() => setFilter("todos")}>
          Todos
        </button>
        {STATUSES.map((s) => (
          <button key={s} type="button" className="pill-brand whitespace-nowrap" onClick={() => setFilter(s)}>
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {visible.length === 0 && <p className="text-sm muted">Aún no hay postulaciones.</p>}

      {visible.map((job) => (
        <article key={job.id} className="bento-card space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold">{job.title}</h2>
              <p className="text-sm muted">{job.company}</p>
              {typeof job.score === "number" && (
                <p className="mt-1 text-xs" style={{ color: "var(--brand)" }}>
                  Score ATS {job.score}%
                </p>
              )}
            </div>
            <span className="pill-brand">{STATUS_LABEL[job.status]}</span>
          </div>
          <div className="flex gap-2">
            <textarea
              className="field min-h-16 text-sm"
              placeholder="Ejemplo: entrevista jueves 10 a.m."
              value={job.notes || ""}
              onChange={(e) => {
                upsertJob({ ...job, notes: e.target.value, id: job.id });
                refresh();
              }}
            />
            <DictationButton
              label="Dictar notas de esta vacante"
              onResult={(t) => {
                const notes = `${job.notes || ""} ${t}`.trim();
                upsertJob({ ...job, notes, id: job.id });
                refresh();
              }}
            />
          </div>
          <select
            className="field"
            value={job.status}
            onChange={(e) => {
              const nextStatus = e.target.value as JobStatus;
              upsertJob({ ...job, status: nextStatus, id: job.id });
              refresh();
            }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <Link
            href="/ats"
            className="btn-secondary"
            onClick={() => {
              try {
                localStorage.setItem(
                  "ats_tracker_context",
                  JSON.stringify({ jobId: job.id, title: job.title, company: job.company, score: job.score })
                );
              } catch {
                /* ignore */
              }
            }}
          >
            Re-analizar CV para esta vacante
          </Link>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              deleteJob(job.id);
              refresh();
            }}
          >
            Eliminar
          </button>
        </article>
      ))}

      <AdSlot slot="tracker" />

      <FlowContinueBar label="Seguir" />

      <Link href="/ats" className="btn-secondary">
        Analizar un CV para una vacante
      </Link>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
