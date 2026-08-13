/**
 * Metas en lenguaje de persona (no códigos internos).
 * El wizard arma un recorrido uno-a-uno: primero lo gratis, luego Carrera.
 */

export type GoalAccess = "free" | "carrera" | "curso" | "open";

export type PersonGoal = {
  id: string;
  title: string;
  benefit: string;
  href: string;
  /** Palabras para auto-marcar desde texto/voz */
  keywords: string[];
  /**
   * free = herramientas ATS sin pagar
   * carrera = acompañamiento (un solo plan)
   * curso = add-on “curso a tu medida”
   * open = marketplace / 90 días (sin suscripción)
   */
  access: GoalAccess;
};

export const PERSON_GOALS: PersonGoal[] = [
  {
    id: "cv",
    title: "Que mi CV pase el filtro automático",
    benefit: "Subes o pegas tu hoja de vida, la comparas con una oferta y ves qué mejorar.",
    href: "/ats",
    keywords: ["cv", "hoja de vida", "ats", "filtro", "puntaje", "score", "analizar"],
    access: "free",
  },
  {
    id: "encaje",
    title: "Ver si encajo en una oferta (rápido)",
    benefit: "En un minuto ves un porcentaje de coincidencia, sin el análisis completo.",
    href: "/herramientas/calculadora",
    keywords: ["encaje", "match", "coincid", "rápido", "rapido", "calculadora"],
    access: "free",
  },
  {
    id: "tracker",
    title: "Organizar mis postulaciones",
    benefit: "Anotas cargo y empresa y sigues el estado: interés, aplicado, entrevista, oferta.",
    href: "/tracker",
    keywords: ["postul", "tracker", "vacante", "organizar", "kanban", "seguimiento"],
    access: "free",
  },
  {
    id: "carta",
    title: "Escribir una carta o mensaje de postulación",
    benefit: "Borrador alineado a la oferta, para revisar y enviar.",
    href: "/herramientas/carta",
    keywords: ["carta", "mensaje", "postulaci", "cover"],
    access: "free",
  },
  {
    id: "linkedin",
    title: "Mejorar mi LinkedIn",
    benefit: "Headline y About más claros para reclutadores y filtros.",
    href: "/herramientas/linkedin",
    keywords: ["linkedin", "perfil", "headline", "marca personal"],
    access: "free",
  },
  {
    id: "entrevista",
    title: "Preparar entrevistas (práctica gratis)",
    benefit: "Banco de preguntas por perfil y feedback con IA. Lo mismo que en Herramientas.",
    href: "/herramientas/entrevistas",
    keywords: ["entrevista", "star", "simulador", "preguntas", "practicar"],
    access: "free",
  },
  {
    id: "plantilla",
    title: "Armar una plantilla de CV ATS",
    benefit: "CV de una columna listo para pegar y analizar.",
    href: "/herramientas/plantilla",
    keywords: ["plantilla", "formato", "una columna"],
    access: "free",
  },
  {
    id: "salario",
    title: "Ver una banda salarial orientativa",
    benefit: "Piso / meta / techo en pesos para negociar (orientativo).",
    href: "/herramientas/salario",
    keywords: ["salario", "banda", "sueldo", "cop"],
    access: "free",
  },
  {
    id: "filtro",
    title: "Practicar el filtro telefónico",
    benefit: "Ensayas las 3 preguntas típicas de la primera llamada, con score.",
    href: "/outplacement/filtro",
    keywords: ["filtro", "telefón", "telefon", "screening", "llamada"],
    access: "carrera",
  },
  {
    id: "rumbo",
    title: "Definir mi rumbo profesional",
    benefit: "Un test corto (RIASEC) y roles típicos en LATAM.",
    href: "/outplacement/assessment",
    keywords: ["rumbo", "carrera", "riasec", "vocaci", "qué estudiar", "que estudiar", "rol"],
    access: "carrera",
  },
  {
    id: "oferta",
    title: "Negociar salario u oferta",
    benefit: "Piso, meta y techo en pesos, más un texto de contraoferta.",
    href: "/outplacement/oferta",
    keywords: ["oferta", "negoci", "pretensi", "contraoferta"],
    access: "carrera",
  },
  {
    id: "bienestar",
    title: "Estabilizarme en la transición",
    benefit: "Guía de ánimo y derechos laborales (orientativa, no es abogado).",
    href: "/outplacement/bienestar",
    keywords: ["bienestar", "ánimo", "animo", "estrés", "estres", "despido", "derechos"],
    access: "carrera",
  },
  {
    id: "red",
    title: "Activar mi red de contactos",
    benefit: "Anotas personas y el siguiente paso (mensaje, café, LinkedIn).",
    href: "/outplacement/networking",
    keywords: ["red", "network", "contactos", "referido"],
    access: "carrera",
  },
  {
    id: "ruta",
    title: "Seguir una ruta día a día",
    benefit: "Cápsulas cortas: estabilizarte, mercado, entrevistas, primeros 90 días.",
    href: "/outplacement/ruta",
    keywords: ["ruta", "cápsula", "capsula", "diario", "outplacement", "módulo", "modulo"],
    access: "carrera",
  },
  {
    id: "star",
    title: "Simulador STAR completo",
    benefit: "Score local + feedback de coach IA sobre tus historias de entrevista.",
    href: "/outplacement/entrevista",
    keywords: ["star completo", "coach entrevista"],
    access: "carrera",
  },
  {
    id: "curso",
    title: "Un curso a mi medida",
    benefit: "Tú dices el tema; la app arma lecciones cortas. Se compra aparte (add-on).",
    href: "/outplacement/out09",
    keywords: ["curso", "aprender", "skill", "capacita", "out-09", "out09", "personalizado"],
    access: "curso",
  },
  {
    id: "experto",
    title: "Hablar con un experto humano",
    benefit: "Un aliado revisa CV o entrevista. El precio lo ves antes de pedir.",
    href: "/outplacement/experto",
    keywords: ["experto", "coach", "humano", "aliado", "revisión", "revision"],
    access: "open",
  },
  {
    id: "90dias",
    title: "Ya conseguí empleo: primeros 90 días",
    benefit: "Checklist para el periodo de prueba (sin cobro de suscripción).",
    href: "/outplacement/90-dias",
    keywords: ["90", "empleo nuevo", "prueba", "onboarding", "conseguí", "consegui"],
    access: "open",
  },
];

const KEY = "ats_guide_plan_v1";
const RESUME_KEY = "ats_guide_resume_v1";

export function accessLabel(access: GoalAccess): string {
  switch (access) {
    case "free":
      return "Gratis";
    case "carrera":
      return "Plan Carrera";
    case "curso":
      return "Add-on";
    case "open":
      return "Sin suscripción";
  }
}

export function accessRank(access: GoalAccess): number {
  switch (access) {
    case "free":
      return 0;
    case "open":
      return 1;
    case "carrera":
      return 2;
    case "curso":
      return 3;
  }
}

/** Orden del recorrido: gratis → abiertos → Carrera → curso. */
export function orderGoalsForWalk(goals: PersonGoal[]): PersonGoal[] {
  return [...goals].sort((a, b) => accessRank(a.access) - accessRank(b.access));
}

export function matchGoalsFromText(text: string): string[] {
  const t = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const ids = new Set<string>();
  for (const g of PERSON_GOALS) {
    if (g.keywords.some((k) => t.includes(k))) ids.add(g.id);
  }
  if (!ids.size && t.trim().length > 8) {
    ids.add("cv");
    ids.add("rumbo");
  }
  return [...ids];
}

export function readGuidePlan(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw.map(String) : [];
  } catch {
    return [];
  }
}

export function writeGuidePlan(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

export type GuideResume = {
  ids: string[];
  idx: number;
  phase: "recorrido";
};

export function readGuideResume(): GuideResume | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = JSON.parse(localStorage.getItem(RESUME_KEY) || "null");
    if (!raw?.ids?.length || raw.phase !== "recorrido") return null;
    return { ids: raw.ids.map(String), idx: Number(raw.idx) || 0, phase: "recorrido" };
  } catch {
    return null;
  }
}

export function writeGuideResume(resume: GuideResume) {
  localStorage.setItem(RESUME_KEY, JSON.stringify(resume));
}

export function clearGuideResume() {
  localStorage.removeItem(RESUME_KEY);
}

export function goalsByIds(ids: string[]) {
  return ids.map((id) => PERSON_GOALS.find((g) => g.id === id)).filter(Boolean) as PersonGoal[];
}

/** ¿Este paso requiere desbloquear Carrera? */
export function goalNeedsCarrera(g: PersonGoal, hasCarrera: boolean): boolean {
  if (g.access === "carrera") return !hasCarrera;
  if (g.access === "curso") return !hasCarrera; // primero Carrera; el cupo del curso se resuelve en la pantalla
  return false;
}
