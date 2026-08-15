/**
 * Metas en lenguaje de persona.
 * Solo 2–3 gratis; el valor está en el plan Carrera (ruta de 8 módulos + herramientas).
 */

export type GoalAccess = "free" | "carrera" | "curso" | "open";

export type PersonGoal = {
  id: string;
  title: string;
  benefit: string;
  href: string;
  keywords: string[];
  access: GoalAccess;
};

export const PERSON_GOALS: PersonGoal[] = [
  {
    id: "cv",
    title: "Probar el analizador ATS (gratis)",
    benefit: "Compara tu CV con una oferta y ve el puntaje. Tope diario.",
    href: "/ats",
    keywords: ["cv", "hoja de vida", "ats", "filtro", "puntaje", "score", "analizar", "gratis"],
    access: "free",
  },
  {
    id: "encaje",
    title: "Encaje rápido CV–oferta (gratis)",
    benefit: "Porcentaje de coincidencia en un minuto.",
    href: "/herramientas/calculadora",
    keywords: ["encaje", "match", "coincid", "rápido", "rapido", "calculadora"],
    access: "free",
  },
  {
    id: "tracker",
    title: "Anotar postulaciones (gratis)",
    benefit: "Cargo, empresa y estado: interés, aplicado, entrevista, oferta.",
    href: "/tracker",
    keywords: ["postul", "tracker", "vacante", "organizar", "kanban", "seguimiento"],
    access: "free",
  },
  {
    id: "ruta",
    title: "Cuadernillo Carrera (flujo guiado)",
    benefit:
      "6 fases con un solo Continuar: mapa, mercado, marca, entrevistas, oferta. El corazón práctico de Carrera.",
    href: "/outplacement/cuadernillo",
    keywords: ["ruta", "cápsula", "capsula", "diario", "outplacement", "módulo", "modulo", "8", "cuadernillo"],
    access: "carrera",
  },
  {
    id: "linkedin",
    title: "Optimizar LinkedIn",
    benefit: "Headline y About alineados a lo que buscan los reclutadores.",
    href: "/herramientas/linkedin",
    keywords: ["linkedin", "perfil", "headline", "marca personal"],
    access: "carrera",
  },
  {
    id: "carta",
    title: "Carta o mensaje de postulación",
    benefit: "Borrador fiel a tu CV y a esa oferta.",
    href: "/herramientas/carta",
    keywords: ["carta", "mensaje", "postulaci", "cover"],
    access: "carrera",
  },
  {
    id: "plantilla",
    title: "Plantilla CV ATS",
    benefit: "CV de una columna listo para pegar y analizar.",
    href: "/herramientas/plantilla",
    keywords: ["plantilla", "formato", "una columna"],
    access: "carrera",
  },
  {
    id: "entrevista",
    title: "Practicar entrevistas",
    benefit: "Banco de preguntas + feedback IA y simulador STAR.",
    href: "/outplacement/entrevista",
    keywords: ["entrevista", "star", "simulador", "preguntas", "practicar"],
    access: "carrera",
  },
  {
    id: "filtro",
    title: "Filtro telefónico",
    benefit: "Las 3 preguntas típicas de la primera llamada, con score.",
    href: "/outplacement/filtro",
    keywords: ["filtro", "telefón", "telefon", "screening", "llamada"],
    access: "carrera",
  },
  {
    id: "rumbo",
    title: "Definir mi rumbo profesional",
    benefit: "Test RIASEC y roles típicos en LATAM.",
    href: "/outplacement/assessment",
    keywords: ["rumbo", "carrera", "riasec", "vocaci", "qué estudiar", "que estudiar", "rol"],
    access: "carrera",
  },
  {
    id: "oferta",
    title: "Negociar salario u oferta",
    benefit: "Piso, meta, techo y texto de contraoferta.",
    href: "/outplacement/oferta",
    keywords: ["oferta", "negoci", "pretensi", "contraoferta", "salario", "sueldo"],
    access: "carrera",
  },
  {
    id: "bienestar",
    title: "Estabilizarme en la transición",
    benefit: "Curso completo: rutina, red, liquidación CO — con pasos, plantillas y tareas.",
    href: "/outplacement/bienestar",
    keywords: ["bienestar", "ánimo", "animo", "estrés", "estres", "despido", "derechos"],
    access: "carrera",
  },
  {
    id: "red",
    title: "Activar mi red de contactos",
    benefit: "Agenda de personas y siguientes pasos (mercado oculto).",
    href: "/outplacement/networking",
    keywords: ["red", "network", "contactos", "referido"],
    access: "carrera",
  },
  {
    id: "multi",
    title: "Comparar varias ofertas",
    benefit: "Rankea vacantes y elige dónde postular primero.",
    href: "/ats/multi",
    keywords: ["multi", "varias", "rank", "comparar ofertas"],
    access: "carrera",
  },
  {
    id: "curso",
    title: "Curso a mi medida",
    benefit: "Tú eliges el tema; la app arma lecciones. Se compra aparte (add-on).",
    href: "/outplacement/out09",
    keywords: ["curso", "aprender", "skill", "capacita", "personalizado"],
    access: "curso",
  },
  {
    id: "experto",
    title: "Hablar con un experto humano",
    benefit: "Aliado revisa CV o entrevista. Precio antes de pedir.",
    href: "/outplacement/experto",
    keywords: ["experto", "coach", "humano", "aliado", "revisión", "revision"],
    access: "open",
  },
  {
    id: "90dias",
    title: "Primeros 90 días en el empleo nuevo",
    benefit: "Checklist del periodo de prueba (con Carrera o en pausa post-empleo).",
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
      return "Extra";
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
    ids.add("ruta");
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

export function goalNeedsCarrera(g: PersonGoal, hasCarrera: boolean): boolean {
  if (g.access === "carrera") return !hasCarrera;
  if (g.access === "curso") return !hasCarrera;
  return false;
}
