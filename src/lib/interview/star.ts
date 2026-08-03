/** Evaluación local STAR para entrevista (sin inventar hechos). */

export type StarScores = {
  situation: number;
  task: number;
  action: number;
  result: number;
  total: number;
  tips: string[];
};

const SIT = /\b(cuando|en\s+\d{4}|en\s+mi\s+(rol|puesto|trabajo)|durante|en\s+la\s+empresa|contexto)\b/i;
const TASK = /\b(objetivo|meta|me\s+pidieron|responsabilidad|desaf[ií]o|necesit[aá]bamos|mi\s+tarea)\b/i;
const ACT =
  /\b(implement[eé]|lider[eé]|coordin[eé]|diseñ[eé]|automatiz|negoci[eé]|organic[eé]|reduj|mejor[eé]|cre[eé]|desarroll)\w*/i;
const RES = /\b(\d+\s*%|\d+\s*(personas|clientes|d[ií]as|semanas)|\$\s*\d+|resultado|logré|impacto|ahor)\w*/i;

export function scoreStarAnswer(answer: string): StarScores {
  const t = answer.trim();
  const tips: string[] = [];
  const situation = SIT.test(t) ? 22 : t.length > 80 ? 10 : 4;
  const task = TASK.test(t) ? 22 : 8;
  const action = ACT.test(t) ? 28 : 12;
  const result = RES.test(t) ? 28 : 10;

  if (situation < 18) tips.push("Abre con el contexto (cuándo, dónde, rol) en 1–2 frases.");
  if (task < 18) tips.push("Deja claro el objetivo o el problema que te asignaron.");
  if (action < 20) tips.push("Usa verbos de acción en primera persona: qué hiciste tú.");
  if (result < 20) tips.push("Cierra con resultado medible (% , tiempo, $ , personas).");
  if (t.length < 120) tips.push("Desarrolla un poco más: STAR suele ser 45–90 segundos hablados.");
  if (t.length > 900) tips.push("Recorta: el entrevistador pierde el hilo después de ~2 minutos.");

  const total = Math.min(100, situation + task + action + result);
  return { situation, task, action, result, total, tips: tips.slice(0, 4) };
}

export const STAR_BANK = [
  {
    id: "logro",
    q: "Cuéntame de un logro reciente con impacto medible.",
    hint: "STAR: contexto → objetivo → qué hiciste → número.",
  },
  {
    id: "conflicto",
    q: "Describe un conflicto con un colega o área y cómo lo resolviste.",
    hint: "Enfócate en tu acción y el resultado, no en culpar.",
  },
  {
    id: "fracaso",
    q: "Cuéntame de un error profesional y qué aprendiste.",
    hint: "Dueño del error + cambio concreto que aplicaste después.",
  },
  {
    id: "prioridad",
    q: "¿Cómo priorizas cuando todo es urgente?",
    hint: "Criterio (impacto/urgencia) + ejemplo real + resultado.",
  },
  {
    id: "salida",
    q: "¿Por qué saliste (o quieres salir) de tu último empleo?",
    hint: "Positivo, breve, orientado al futuro. Sin hablar mal del jefe.",
  },
  {
    id: "por-que",
    q: "¿Por qué quieres este rol ahora?",
    hint: "Encaja tu historia con 2–3 requisitos de la vacante.",
  },
  {
    id: "debilidad",
    q: "¿Cuál es tu mayor debilidad y cómo la trabajas?",
    hint: "Debilidad real + plan de mejora + evidencia de progreso.",
  },
  {
    id: "liderazgo",
    q: "Dame un ejemplo de liderazgo sin autoridad formal.",
    hint: "Influencia, aliados, entregable y métrica.",
  },
];
