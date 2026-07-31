"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DictationButton } from "@/components/DictationButton";
import { SpeakButton } from "@/components/SpeakButton";
import {
  STATUS_LABEL,
  deleteJob,
  listJobs,
  upsertJob,
  type JobItem,
  type JobStatus,
} from "@/lib/tracker/jobs";

const STATUSES = Object.keys(STATUS_LABEL) as JobStatus[];

export default function TrackerPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
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
          <input className="field" placeholder="Cargo" value={title} onChange={(e) => setTitle(e.target.value)} />
          <DictationButton onResult={(t) => setTitle((p) => (p ? `${p} ${t}` : t))} />
        </div>
        <input className="field" placeholder="Empresa" value={company} onChange={(e) => setCompany(e.target.value)} />
        <button
          type="button"
          className="btn-primary"
          disabled={!title.trim() || !company.trim()}
          onClick={() => {
            upsertJob({ title: title.trim(), company: company.trim(), status: "interes" });
            setTitle("");
            setCompany("");
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
            </div>
            <span className="pill-brand">{STATUS_LABEL[job.status]}</span>
          </div>
          <select
            className="field"
            value={job.status}
            onChange={(e) => {
              upsertJob({ ...job, status: e.target.value as JobStatus, id: job.id });
              refresh();
            }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
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

      <Link href="/ats" className="btn-secondary">
        Analizar un CV para una vacante
      </Link>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
