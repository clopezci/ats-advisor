/**
 * Metas en lenguaje de persona (no códigos internos).
 * El wizard arma un recorrido uno-a-uno según lo que marques o dictes.
 */

export type PersonGoal = {
  id: string;
  title: string;
  benefit: string;
  href: string;
  /** Palabras para auto-marcar desde texto/voz */
  keywords: string[];
  /** Si true, al abrir pide plan Carrera (el wizard igual lo muestra) */
  paid?: boolean;
};

export const PERSON_GOALS: PersonGoal[] = [
  {
    id: "cv",
    title: "Que mi CV pase el filtro automático",
    benefit: "Subes o pegas tu hoja de vida, la comparas con una oferta y ves qué mejorar.",
    href: "/ats",
    keywords: ["cv", "hoja de vida", "ats", "filtro", "puntaje", "score", "analizar"],
  },
  {
    id: "encaje",
    title: "Ver si encajo en una oferta (rápido)",
    benefit: "En un minuto ves un porcentaje de coincidencia, sin el análisis completo.",
    href: "/herramientas/calculadora",
    keywords: ["encaje", "match", "coincid", "rápido", "rapido", "calculadora"],
  },
  {
    id: "tracker",
    title: "Organizar mis postulaciones",
    benefit: "Anotas cargo y empresa y sigues el estado: interés, aplicado, entrevista, oferta.",
    href: "/tracker",
    keywords: ["postul", "tracker", "vacante", "organizar", "kanban", "seguimiento"],
  },
  {
    id: "carta",
    title: "Escribir una carta o mensaje de postulación",
    benefit: "Borrador alineado a la oferta, para revisar y enviar.",
    href: "/herramientas/carta",
    keywords: ["carta", "mensaje", "postulaci", "cover"],
  },
  {
    id: "linkedin",
    title: "Mejorar mi LinkedIn",
    benefit: "Headline y About más claros para reclutadores y filtros.",
    href: "/herramientas/linkedin",
    keywords: ["linkedin", "perfil", "headline", "marca personal"],
  },
  {
    id: "entrevista",
    title: "Preparar entrevistas",
    benefit: "Practicas con método STAR (situación, tarea, acción, resultado).",
    href: "/outplacement/entrevista",
    keywords: ["entrevista", "star", "simulador", "preguntas"],
    paid: true,
  },
  {
    id: "filtro",
    title: "Practicar el filtro telefónico",
    benefit: "Ensayas las 3 preguntas típicas de la primera llamada.",
    href: "/outplacement/filtro",
    keywords: ["filtro", "telefón", "telefon", "screening", "llamada"],
    paid: true,
  },
  {
    id: "rumbo",
    title: "Definir mi rumbo profesional",
    benefit: "Un test corto (RIASEC) y roles típicos en LATAM.",
    href: "/outplacement/assessment",
    keywords: ["rumbo", "carrera", "riasec", "vocaci", "qué estudiar", "que estudiar", "rol"],
    paid: true,
  },
  {
    id: "oferta",
    title: "Negociar salario u oferta",
    benefit: "Piso, meta y techo en pesos, más un texto de contraoferta.",
    href: "/outplacement/oferta",
    keywords: ["salario", "oferta", "negoci", "sueldo", "pretensi"],
    paid: true,
  },
  {
    id: "bienestar",
    title: "Estabilizarme en la transición",
    benefit: "Guía de ánimo y derechos laborales (orientativa, no es abogado).",
    href: "/outplacement/bienestar",
    keywords: ["bienestar", "ánimo", "animo", "estrés", "estres", "despido", "derechos"],
    paid: true,
  },
  {
    id: "red",
    title: "Activar mi red de contactos",
    benefit: "Anotas personas y el siguiente paso (mensaje, café, LinkedIn).",
    href: "/outplacement/networking",
    keywords: ["red", "network", "contactos", "referido"],
    paid: true,
  },
  {
    id: "ruta",
    title: "Seguir una ruta día a día",
    benefit: "Cápsulas cortas de la transición: estabilizarte, mercado, entrevistas, 90 días.",
    href: "/outplacement/ruta",
    keywords: ["ruta", "cápsula", "capsula", "diario", "outplacement", "módulo", "modulo"],
    paid: true,
  },
  {
    id: "curso",
    title: "Un curso a mi medida",
    benefit: "Tú dices el tema; la app arma lecciones cortas (incluido en Carrera Plus).",
    href: "/outplacement/out09",
    keywords: ["curso", "aprender", "skill", "capacita", "out-09", "out09", "personalizado"],
    paid: true,
  },
  {
    id: "experto",
    title: "Hablar con un experto humano",
    benefit: "Un aliado revisa CV o entrevista. El precio lo ves antes de pedir.",
    href: "/outplacement/experto",
    keywords: ["experto", "coach", "humano", "aliado", "revisión", "revision"],
  },
  {
    id: "90dias",
    title: "Ya conseguí empleo: primeros 90 días",
    benefit: "Checklist para no fallar el periodo de prueba (sin cobro extra).",
    href: "/outplacement/90-dias",
    keywords: ["90", "empleo nuevo", "prueba", "onboarding", "conseguí", "consegui"],
  },
];

const KEY = "ats_guide_plan_v1";

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

export function goalsByIds(ids: string[]) {
  return ids.map((id) => PERSON_GOALS.find((g) => g.id === id)).filter(Boolean) as PersonGoal[];
}
