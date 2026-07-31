import { textHasTerm } from "@/lib/ats/synonyms";

export type AtsProfile = "generic" | "workday" | "greenhouse" | "taleo" | "successfactors" | "lever" | "sap";

export type AtsAnalyzeInput = {
  cvText: string;
  jobText: string;
  atsProfile?: AtsProfile;
};

export type AtsAnalyzeResult = {
  score: number;
  interviewProbability: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  hardSkills: { matched: string[]; missing: string[] };
  softSkills: { matched: string[]; missing: string[] };
  exclusiveGaps: string[];
  formatAlerts: string[];
  trapAlerts: string[];
  trainingSuggestions: string[];
  actions: string[];
  explanation: string[];
};

const SOFT = [
  "liderazgo", "comunicación", "comunicacion", "trabajo en equipo", "adaptabilidad",
  "proactividad", "negociación", "negociacion", "resolución de problemas", "resolucion de problemas",
  "empatía", "empatia", "organización", "organizacion", "pensamiento crítico", "pensamiento critico",
];

const HARD_HINTS = [
  "excel", "sap", "power bi", "python", "sql", "javascript", "react", "java", "aws", "azure",
  "contabilidad", "tesorería", "tesoreria", "finanzas", "marketing", "crm", "erp", "tableau",
  "inglés", "ingles", "bilingüe", "bilingue", "scrum", "kanban", "jira", "autocad",
];

const NOISE = new Set([
  "para", "como", "entre", "sobre", "desde", "hasta", "donde", "cuando", "tiene", "deben",
  "experiencia", "años", "anos", "requisitos", "funciones", "empresa", "equipo", "trabajo",
]);

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9áéíóúñü+#.\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string) {
  return normalize(text)
    .split(" ")
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !NOISE.has(t));
}

function extractPhrases(job: string) {
  const n = normalize(job);
  const phrases = new Set<string>();
  for (const s of [...SOFT, ...HARD_HINTS]) {
    if (n.includes(normalize(s))) phrases.add(s);
  }
  // bigrams frecuentes de la oferta
  const tokens = tokenize(job);
  for (let i = 0; i < tokens.length - 1; i++) {
    const bigram = `${tokens[i]} ${tokens[i + 1]}`;
    if (bigram.length >= 6) phrases.add(bigram);
  }
  return [...phrases];
}

function yearsRequired(job: string): number | null {
  const m = normalize(job).match(/(\d+)\s*\+?\s*(anos|años|years)/);
  return m ? Number(m[1]) : null;
}

function yearsInCv(cv: string): number | null {
  const matches = [...normalize(cv).matchAll(/(\d+)\s*(anos|años|years)/g)].map((m) => Number(m[1]));
  if (!matches.length) return null;
  return Math.max(...matches);
}

function formatAlerts(cv: string, profile: AtsProfile): string[] {
  const alerts: string[] = [];
  if (cv.length < 400) alerts.push("El CV parece muy corto; agrega logros cuantificados.");
  if (/\|/.test(cv) || /\t\t/.test(cv)) {
    alerts.push("Posible diseño multi-columna o tablas: algunos ATS (Workday/Taleo) fallan al parsear.");
  }
  if ((cv.match(/•|●|◆/g) || []).length > 40) {
    alerts.push("Demasiados símbolos decorativos; preferible viñetas simples.");
  }
  if (profile === "workday" || profile === "taleo") {
    alerts.push(`Perfil ${profile}: evita encabezados en imagen y columnas; usa fechas consistentes (MM/AAAA).`);
  }
  if (profile === "greenhouse" || profile === "lever") {
    alerts.push(`Perfil ${profile}: prioriza secciones claras (Experiencia, Educación, Skills) en una columna.`);
  }
  return alerts;
}

function trapAlerts(cv: string): string[] {
  const alerts: string[] = [];
  if (/color:\s*#?fff|color:\s*white|font-size:\s*1px/i.test(cv)) {
    alerts.push("Posible texto oculto / trampa ATS. Los sistemas modernos pueden descartarte por fraude.");
  }
  const words = tokenize(cv);
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  const stuffed = [...freq.entries()].filter(([, c]) => c > 18).map(([w]) => w);
  if (stuffed.length) {
    alerts.push(`Posible keyword stuffing (${stuffed.slice(0, 3).join(", ")}). Usa lenguaje natural.`);
  }
  return alerts;
}

export function analyzeAts(input: AtsAnalyzeInput): AtsAnalyzeResult {
  const profile = input.atsProfile || "generic";
  const cvN = normalize(input.cvText);
  const jobN = normalize(input.jobText);
  const phrases = extractPhrases(input.jobText);

  const matched: string[] = [];
  const missing: string[] = [];
  for (const p of phrases) {
    if (textHasTerm(cvN, p) || cvN.includes(normalize(p))) matched.push(p);
    else missing.push(p);
  }

  const hardMatched = matched.filter((p) => HARD_HINTS.some((h) => normalize(p).includes(normalize(h))));
  const hardMissing = missing.filter((p) => HARD_HINTS.some((h) => normalize(p).includes(normalize(h))));
  const softMatched = matched.filter((p) => SOFT.some((h) => normalize(p).includes(normalize(h))));
  const softMissing = missing.filter((p) => SOFT.some((h) => normalize(p).includes(normalize(h))));

  const exclusiveGaps: string[] = [];
  if (
    /ingles|inglés|english|bilingue|bilingüe/.test(jobN) &&
    !textHasTerm(cvN, "ingles") &&
    !/ingles|inglés|english|bilingue|bilingüe/.test(cvN)
  ) {
    exclusiveGaps.push("La oferta exige inglés y no aparece claramente en tu CV.");
  }
  const yr = yearsRequired(input.jobText);
  const yc = yearsInCv(input.cvText);
  if (yr && (yc === null || yc < yr)) {
    exclusiveGaps.push(`La oferta pide ~${yr} años de experiencia; en el CV se detectó ${yc ?? "poco claro"}.`);
  }

  const coverage = phrases.length ? matched.length / phrases.length : 0.5;
  const exclusivePenalty = exclusiveGaps.length * 0.08;
  const format = formatAlerts(input.cvText, profile);
  const traps = trapAlerts(input.cvText);
  const formatPenalty = Math.min(0.15, format.length * 0.03 + traps.length * 0.05);
  const score = Math.round(Math.max(0, Math.min(100, (coverage * 100) * (1 - exclusivePenalty - formatPenalty))));

  const interviewProbability = Math.round(
    Math.max(5, Math.min(95, score * 0.85 + (softMatched.length > 0 ? 5 : 0) - exclusiveGaps.length * 8))
  );

  const trainingSuggestions = hardMissing.slice(0, 5).map(
    (k) => `Refuerza “${k}” con un curso corto o un logro medible en tu CV.`
  );

  const actions: string[] = [];
  if (missing.length) actions.push(`Integra de forma natural: ${missing.slice(0, 8).join(", ")}.`);
  if (exclusiveGaps.length) actions.push("Resuelve primero los requisitos excluyentes.");
  if (!/\d+%|\d+\s*(usuarios|clientes|millones|mil)/i.test(input.cvText)) {
    actions.push("Cuantifica logros (%, dinero, tiempo, alcance).");
  }
  actions.push("Adapta el CV a esta oferta concreta antes de postular.");

  const explanation = [
    `Cobertura semántica de términos de la oferta: ${Math.round(coverage * 100)}%.`,
    `Perfil ATS aplicado: ${profile}.`,
    exclusiveGaps.length
      ? "Hay brechas excluyentes que bajan fuerte la probabilidad de pasar el filtro."
      : "No se detectaron brechas excluyentes críticas.",
  ];

  return {
    score,
    interviewProbability,
    matchedKeywords: matched.slice(0, 40),
    missingKeywords: missing.slice(0, 40),
    hardSkills: { matched: hardMatched, missing: hardMissing },
    softSkills: { matched: softMatched, missing: softMissing },
    exclusiveGaps,
    formatAlerts: format,
    trapAlerts: traps,
    trainingSuggestions,
    actions,
    explanation,
  };
}
