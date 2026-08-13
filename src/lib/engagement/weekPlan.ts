/** Alertas de búsqueda locales (criterios + última revisión). */

const KEY = "ats_job_alerts_v1";

export type JobAlert = {
  id: string;
  query: string;
  city: string;
  remoteOk: boolean;
  createdAt: number;
  lastCheckedAt?: number;
  notes: string;
};

export function readAlerts(): JobAlert[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as JobAlert[];
  } catch {
    return [];
  }
}

export function writeAlerts(list: JobAlert[]) {
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20)));
}

export function addAlert(partial: Omit<JobAlert, "id" | "createdAt">): JobAlert[] {
  const list = readAlerts();
  const next: JobAlert = {
    ...partial,
    id: `ja_${Date.now()}`,
    createdAt: Date.now(),
  };
  const out = [next, ...list];
  writeAlerts(out);
  return out;
}

export function touchAlert(id: string): JobAlert[] {
  const list = readAlerts().map((a) =>
    a.id === id ? { ...a, lastCheckedAt: Date.now() } : a
  );
  writeAlerts(list);
  return list;
}

export function removeAlert(id: string): JobAlert[] {
  const list = readAlerts().filter((a) => a.id !== id);
  writeAlerts(list);
  return list;
}

/** Plan semanal sugerido (7 slots). */
export type WeekSlot = {
  day: string;
  focus: string;
  href: string;
  minutes: number;
};

export function buildWeekPlan(opts?: { hasOut09?: boolean }): WeekSlot[] {
  const base: WeekSlot[] = [
    { day: "Lun", focus: "1 análisis ATS + actualizar tracker", href: "/ats", minutes: 25 },
    { day: "Mar", focus: "Cápsula OUT + quiz", href: "/outplacement/ruta", minutes: 20 },
    { day: "Mié", focus: "Networking: 2 mensajes / 1 café", href: "/outplacement/networking", minutes: 30 },
    { day: "Jue", focus: "Práctica filtro o STAR video", href: "/outplacement/filtro", minutes: 25 },
    { day: "Vie", focus: "Vacantes rankeadas + postular 2", href: "/outplacement/vacantes", minutes: 40 },
    { day: "Sáb", focus: "Curso externo o portfolio caso", href: "/outplacement/cursos", minutes: 45 },
    { day: "Dom", focus: "Bienestar + plan próxima semana", href: "/outplacement/bienestar", minutes: 15 },
  ];
  if (opts?.hasOut09) {
    base[5] = {
      day: "Sáb",
      focus: "Avanzar curso a tu medida",
      href: "/outplacement/out09",
      minutes: 40,
    };
  }
  return base;
}
