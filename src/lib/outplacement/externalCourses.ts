/**
 * Catálogo curado de cursos externos low-cost (OUT-04).
 * Tracking de progreso es local (localStorage) — no es LMS propio.
 */

export type ExternalCourse = {
  id: string;
  title: string;
  provider: string;
  url: string;
  level: "intro" | "intermedio" | "aplicado";
  hours: string;
  tags: string[];
  why: string;
  costHint: string;
};

export const EXTERNAL_COURSES: ExternalCourse[] = [
  {
    id: "google-pm",
    title: "Fundamentos de gestión de proyectos",
    provider: "Google / Coursera",
    url: "https://www.coursera.org/professional-certificates/google-project-management",
    level: "intro",
    hours: "≈ 20–40 h (auditoría o certificado)",
    tags: ["pm", "transversal"],
    why: "Útil si pivoteas a coordinación / ops y necesitas vocabulario de entrega.",
    costHint: "Auditoría gratis · certificado de pago",
  },
  {
    id: "meta-digital",
    title: "Marketing digital (intro)",
    provider: "Meta / Coursera",
    url: "https://www.coursera.org/professional-certificates/meta-marketing-analytics",
    level: "intro",
    hours: "≈ 15–30 h",
    tags: ["marketing", "datos"],
    why: "Para roles comerciales / growth que piden analítica básica.",
    costHint: "Auditoría gratis · certificado de pago",
  },
  {
    id: "excel-analisis",
    title: "Análisis de datos con Excel",
    provider: "Microsoft / LinkedIn Learning (o equivalente)",
    url: "https://www.linkedin.com/learning/",
    level: "aplicado",
    hours: "≈ 8–12 h",
    tags: ["excel", "datos"],
    why: "Casi todo filtro LATAM pide tablas dinámicas y limpieza de datos.",
    costHint: "Suscripción o trial",
  },
  {
    id: "sql-basico",
    title: "SQL para no programadores",
    provider: "Mode / freeCodeCamp / similar",
    url: "https://www.freecodecamp.org/learn/relational-database/",
    level: "intermedio",
    hours: "≈ 20 h",
    why: "Abre puertas a analítica / BI junior sin bootcamp caro.",
    tags: ["sql", "datos"],
    costHint: "Gratis",
  },
  {
    id: "ingles-b2",
    title: "Inglés profesional B1→B2 (práctica)",
    provider: "British Council / Duolingo English Test prep",
    url: "https://www.britishcouncil.org/english",
    level: "aplicado",
    hours: "Continuo · 15 min/día",
    tags: ["ingles", "remoto"],
    why: "Remoto LATAM suele filtrar por inglés conversacional.",
    costHint: "Freemium",
  },
  {
    id: "star-storytelling",
    title: "Storytelling laboral / comunicación",
    provider: "TED-Ed + práctica ATSAdvisor",
    url: "https://ed.ted.com/",
    level: "intro",
    hours: "≈ 4–6 h + simulador",
    tags: ["entrevista", "marca"],
    why: "Complementa el simulador STAR de la app con ejemplos narrativos.",
    costHint: "Gratis",
  },
  {
    id: "linkedin-marca",
    title: "Marca personal en LinkedIn",
    provider: "LinkedIn Learning / guías oficiales",
    url: "https://www.linkedin.com/learning/",
    level: "aplicado",
    hours: "≈ 3–5 h",
    tags: ["marca", "networking"],
    why: "Alinea headline + about con el Career Brief de la app.",
    costHint: "Suscripción o trial",
  },
  {
    id: "wellbeing-transicion",
    title: "Manejo del estrés en transición laboral",
    provider: "Recursos públicos / OMS estilo mindfulness corto",
    url: "https://www.who.int/es",
    level: "intro",
    hours: "≈ 2–4 h",
    tags: ["bienestar"],
    why: "Estabilización emocional antes de acelerar aplicaciones.",
    costHint: "Gratis",
  },
];

export type CourseProgressStatus = "todo" | "doing" | "done";

export type CourseProgressMap = Record<string, CourseProgressStatus>;

const STORAGE_KEY = "ats_external_courses";

export function readCourseProgress(): CourseProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CourseProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeCourseProgress(map: CourseProgressMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}
