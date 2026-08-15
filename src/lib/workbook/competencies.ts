/** Autoevaluación de competencias — autoría ATSAdvisor (no frameworks de terceros). */

export type CompetencyId = string;

export type CompetencyDef = {
  id: CompetencyId;
  name: string;
  blurb: string;
  cluster: "entrega" | "personas" | "pensamiento" | "influencia";
};

/** Lista propia, práctica para transición LATAM. */
export const ATS_COMPETENCIES: CompetencyDef[] = [
  {
    id: "resultados",
    name: "Orientación a resultados",
    blurb: "Cierras entregables con impacto medible, no solo actividad.",
    cluster: "entrega",
  },
  {
    id: "prioridad",
    name: "Priorización bajo presión",
    blurb: "Eliges qué importa cuando el tiempo no alcanza.",
    cluster: "entrega",
  },
  {
    id: "calidad",
    name: "Calidad y rigor",
    blurb: "Detectas errores, documentas y dejas trabajo auditable.",
    cluster: "entrega",
  },
  {
    id: "aprendizaje",
    name: "Aprendizaje ágil",
    blurb: "Cierras gaps de skill con práctica corta y evidencia.",
    cluster: "pensamiento",
  },
  {
    id: "analisis",
    name: "Análisis y juicio",
    blurb: "Separas señal de ruido y decides con datos incompletos.",
    cluster: "pensamiento",
  },
  {
    id: "comunicacion",
    name: "Comunicación clara",
    blurb: "Explicas en 60s y por escrito sin jerga innecesaria.",
    cluster: "influencia",
  },
  {
    id: "influencia",
    name: "Influencia sin poder formal",
    blurb: "Logras apoyo de pares y líderes sin autoridad directa.",
    cluster: "influencia",
  },
  {
    id: "stakeholders",
    name: "Gestión de stakeholders",
    blurb: "Mapeas intereses y alineas expectativas a tiempo.",
    cluster: "personas",
  },
  {
    id: "colaboracion",
    name: "Colaboración",
    blurb: "Trabajas bien en equipo diverso; das y pides feedback.",
    cluster: "personas",
  },
  {
    id: "liderazgo",
    name: "Liderazgo de equipo / proyecto",
    blurb: "Orquestas personas o iniciativas hacia un objetivo.",
    cluster: "personas",
  },
  {
    id: "resiliencia",
    name: "Resiliencia profesional",
    blurb: "Te recuperas de setbacks sin quemar relaciones.",
    cluster: "personas",
  },
  {
    id: "etica",
    name: "Integridad y criterio ético",
    blurb: "Sostienes límites claros aunque cueste en el corto plazo.",
    cluster: "influencia",
  },
];

export type CompetencyRating = {
  id: CompetencyId;
  score: number; // 1–5
  evidence: string;
};

export function topCompetencies(ratings: CompetencyRating[], n = 5): CompetencyRating[] {
  return [...ratings]
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, n);
}

export function competencyLabel(id: string): string {
  return ATS_COMPETENCIES.find((c) => c.id === id)?.name || id;
}
