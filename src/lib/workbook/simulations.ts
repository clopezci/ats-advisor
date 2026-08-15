/** Escenarios de simulación de entrevista (autoría ATSAdvisor). */

export type SimulationCase = {
  id: string;
  title: string;
  stage: string;
  prompt: string;
  lookFor: string[];
  rubric: { id: string; label: string }[];
};

export const SIMULATION_CASES: SimulationCase[] = [
  {
    id: "filtro_60",
    title: "Filtro 60 segundos",
    stage: "Filtro reclutador",
    prompt:
      "Cuéntame quién eres, qué buscas y por qué encajas en este rol. Tienes un minuto.",
    lookFor: ["Pitch claro", "Resultado medible", "Fit con el rol", "Cierre con pregunta"],
    rubric: [
      { id: "claridad", label: "Claridad del pitch" },
      { id: "evidencia", label: "Evidencia / número" },
      { id: "fit", label: "Fit al rol" },
      { id: "energia", label: "Energía profesional" },
    ],
  },
  {
    id: "star_conflicto",
    title: "STAR: conflicto en equipo",
    stage: "Hiring manager",
    prompt:
      "Cuéntame de un conflicto con un colega o stakeholder. ¿Qué hiciste y qué pasó?",
    lookFor: ["Situación breve", "Tu acción (no el equipo genérico)", "Resultado", "Aprendizaje"],
    rubric: [
      { id: "estructura", label: "Estructura STAR/SOAR" },
      { id: "ownership", label: "Ownership" },
      { id: "resultado", label: "Resultado" },
      { id: "madurez", label: "Madurez / sin culpar" },
    ],
  },
  {
    id: "panel_caso",
    title: "Caso de negocio corto",
    stage: "Panel / assessment",
    prompt:
      "Tu área bajó 20% en un KPI clave. En 5 minutos: hipótesis, datos que pedirías y 2 acciones de 30 días.",
    lookFor: ["Hipótesis", "Datos", "Priorización", "Comunicación ejecutiva"],
    rubric: [
      { id: "analisis", label: "Análisis" },
      { id: "datos", label: "Uso de datos" },
      { id: "accion", label: "Plan accionable" },
      { id: "comunicacion", label: "Comunicación" },
    ],
  },
  {
    id: "refs_prep",
    title: "Prep referencias",
    stage: "Referencias",
    prompt:
      "Resume en 4 bullets qué debería decir tu referencia sobre tu último rol (sin exagerar).",
    lookFor: ["Logros alineados", "Debilidades honestas", "Contexto de salida", "Disponibilidad"],
    rubric: [
      { id: "alineacion", label: "Alineación mensaje" },
      { id: "honestidad", label: "Honestidad" },
      { id: "relevancia", label: "Relevancia al rol" },
    ],
  },
  {
    id: "neg_obj",
    title: "Objeción de compensación",
    stage: "Oferta",
    prompt:
      "La oferta está 12% bajo tu meta. Responde sin ultimátum: ancla a mercado + paquete total.",
    lookFor: ["Gratitud", "Paquete total", "Dato de mercado", "Contraoferta concreta"],
    rubric: [
      { id: "tono", label: "Tono colaborativo" },
      { id: "dato", label: "Anclaje a datos" },
      { id: "paquete", label: "Negocia total" },
      { id: "cierre", label: "Próximo paso claro" },
    ],
  },
];

export type FeedbackScore = {
  id: string;
  caseId: string;
  caseTitle: string;
  scores: Record<string, number>;
  notes: string;
  createdAt: number;
};

const FB_KEY = "ats_interview_feedback_v1";

export function listFeedbackScores(): FeedbackScore[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(FB_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function saveFeedbackScore(entry: Omit<FeedbackScore, "id" | "createdAt"> & { id?: string }) {
  const all = listFeedbackScores();
  const item: FeedbackScore = {
    id: entry.id || `fb_${Date.now()}`,
    caseId: entry.caseId,
    caseTitle: entry.caseTitle,
    scores: entry.scores,
    notes: entry.notes,
    createdAt: Date.now(),
  };
  all.unshift(item);
  localStorage.setItem(FB_KEY, JSON.stringify(all.slice(0, 40)));
  return item;
}

export function deleteFeedbackScore(id: string) {
  localStorage.setItem(
    FB_KEY,
    JSON.stringify(listFeedbackScores().filter((x) => x.id !== id))
  );
}
