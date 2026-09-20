export type JobStatus = "interes" | "aplicado" | "entrevista" | "oferta" | "rechazo" | "archivado";

export type JobItem = {
  id: string;
  title: string;
  company: string;
  url?: string;
  status: JobStatus;
  notes?: string;
  score?: number;
  /** Texto del aviso (para repaso del rol). */
  jobText?: string;
  /** Epoch ms cuando el usuario marcó que postulé. */
  appliedAt?: number;
  /** Temas que marcó “quiero aprenderlos”. */
  learnTopics?: string[];
  /** Plan de repaso asociado. */
  roleReviewPlanId?: string;
  createdAt: number;
  updatedAt: number;
};

const KEY = "ats_job_tracker";

export function listJobs(): JobItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveJobs(jobs: JobItem[]) {
  localStorage.setItem(KEY, JSON.stringify(jobs));
}

export function getJob(id: string): JobItem | null {
  return listJobs().find((j) => j.id === id) || null;
}

export function upsertJob(job: Omit<JobItem, "id" | "createdAt" | "updatedAt"> & { id?: string }) {
  const jobs = listJobs();
  const now = Date.now();
  if (job.id) {
    const idx = jobs.findIndex((j) => j.id === job.id);
    if (idx >= 0) {
      jobs[idx] = { ...jobs[idx], ...job, id: job.id, updatedAt: now };
      saveJobs(jobs);
      return jobs[idx];
    }
  }
  const item: JobItem = {
    id: `job_${now}_${Math.random().toString(36).slice(2, 7)}`,
    title: job.title,
    company: job.company,
    url: job.url,
    status: job.status,
    notes: job.notes,
    score: job.score,
    jobText: job.jobText,
    appliedAt: job.appliedAt,
    learnTopics: job.learnTopics,
    roleReviewPlanId: job.roleReviewPlanId,
    createdAt: now,
    updatedAt: now,
  };
  jobs.unshift(item);
  saveJobs(jobs);
  return item;
}

/** Marca postulación con fecha (hoy o la indicada). */
export function markJobApplied(id: string, appliedAt = Date.now(), extra?: Partial<JobItem>) {
  const job = getJob(id);
  if (!job) return null;
  return upsertJob({
    ...job,
    ...extra,
    id,
    status: "aplicado",
    appliedAt,
  });
}

export function deleteJob(id: string) {
  saveJobs(listJobs().filter((j) => j.id !== id));
}

export const STATUS_LABEL: Record<JobStatus, string> = {
  interes: "Interés",
  aplicado: "Aplicado",
  entrevista: "Entrevista",
  oferta: "Oferta",
  rechazo: "Rechazo",
  archivado: "Archivado",
};

export function formatAppliedAt(ms?: number) {
  if (!ms) return "";
  try {
    return new Date(ms).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
