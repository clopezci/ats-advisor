import { textHasTerm } from "@/lib/ats/synonyms";
import { detectCvSections, splitJobSections } from "@/lib/ats/jdParse";
import {
  APPLICATION_PLAYBOOK_BASE,
  ATS_HOW_THEY_FILTER,
  buildNextSteps,
  humanRecruiterTips,
} from "@/lib/ats/coaching";
import { localTfidfScore, type EmbeddingProvider } from "@/lib/ats/embeddings";
import { buildKeywordHeatmap, sectionKeywordHits, type HeatCell } from "@/lib/ats/heatmap";

export type AtsProfile =
  | "generic"
  | "workday"
  | "greenhouse"
  | "taleo"
  | "successfactors"
  | "lever"
  | "sap";

export type AtsAnalyzeInput = {
  cvText: string;
  jobText: string;
  atsProfile?: AtsProfile;
  /** Si viene de embeddings cloud / TF-IDF async. */
  semanticOverride?: { score: number; provider: EmbeddingProvider };
};

export type AtsAnalyzeResult = {
  score: number;
  interviewProbability: number;
  semanticScore: number;
  embeddingProvider: EmbeddingProvider;
  matchedKeywords: string[];
  missingKeywords: string[];
  hardSkills: { matched: string[]; missing: string[] };
  softSkills: { matched: string[]; missing: string[] };
  mustHave: { matched: string[]; missing: string[] };
  niceToHave: { matched: string[]; missing: string[] };
  sectionCoverage: {
    experience: boolean;
    education: boolean;
    skills: boolean;
    contact: boolean;
    summary: boolean;
  };
  exclusiveGaps: string[];
  formatAlerts: string[];
  trapAlerts: string[];
  trainingSuggestions: string[];
  actions: string[];
  explanation: string[];
  /** Cómo filtra el perfil ATS elegido (investigación de mercado). */
  atsInsights: string[];
  /** Pasos priorizados. */
  nextSteps: string[];
  /** Tips para el humano tras pasar el filtro. */
  recruiterTips: string[];
  /** Checklist de buena postulación (estático + contextual). */
  applicationTips: string[];
  heatmap: HeatCell[];
  sectionHits: { section: string; hits: number; sample: string[] }[];
};

const SOFT = [
  "liderazgo",
  "comunicación",
  "comunicacion",
  "trabajo en equipo",
  "adaptabilidad",
  "proactividad",
  "negociación",
  "negociacion",
  "resolución de problemas",
  "resolucion de problemas",
  "empatía",
  "empatia",
  "organización",
  "organizacion",
  "pensamiento crítico",
  "pensamiento critico",
  "gestión del tiempo",
  "gestion del tiempo",
  "orientación a resultados",
  "orientacion a resultados",
  "atención al detalle",
  "atencion al detalle",
  "inteligencia emocional",
  "colaboración",
  "colaboracion",
  "influencia",
  "mentoría",
  "mentoria",
  "coaching",
  "servicio al cliente",
];

const HARD_HINTS = [
  "excel",
  "sap",
  "power bi",
  "powerbi",
  "python",
  "sql",
  "javascript",
  "typescript",
  "react",
  "node",
  "java",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "contabilidad",
  "tesorería",
  "tesoreria",
  "finanzas",
  "marketing",
  "crm",
  "erp",
  "tableau",
  "inglés",
  "ingles",
  "bilingüe",
  "bilingue",
  "scrum",
  "kanban",
  "jira",
  "autocad",
  "salesforce",
  "hubspot",
  "looker",
  "rpa",
  "nlp",
  "machine learning",
  "data warehouse",
  "etl",
  "figma",
  "ux",
  "ui",
  "seo",
  "sem",
  "google analytics",
  "nómina",
  "nomina",
  "hcm",
  "mm",
  "fi/co",
  "fico",
  "abap",
  "netsuite",
  "oracle",
  "postgresql",
  "mysql",
  "mongodb",
  "git",
  "ci/cd",
  "devops",
  "seguridad de la información",
  "iso 27001",
  "pmp",
  "itil",
  "six sigma",
  "lean",
  "okrs",
  "kpis",
];

const NOISE = new Set([
  "para",
  "como",
  "entre",
  "sobre",
  "desde",
  "hasta",
  "donde",
  "cuando",
  "tiene",
  "deben",
  "experiencia",
  "años",
  "anos",
  "requisitos",
  "funciones",
  "empresa",
  "equipo",
  "trabajo",
  "personas",
  "colombia",
  "bogota",
  "remoto",
  "presencial",
  "hibrido",
  "híbrido",
]);

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9áéíóúñü+#.\s/-]/gi, " ")
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
  const tokens = tokenize(job);
  for (let i = 0; i < tokens.length - 1; i++) {
    const bigram = `${tokens[i]} ${tokens[i + 1]}`;
    if (bigram.length >= 6 && !NOISE.has(tokens[i])) phrases.add(bigram);
  }
  // Unigrams técnicos cortos (sql, sap, aws…)
  for (const t of tokens) {
    if (HARD_HINTS.some((h) => normalize(h) === t) || (t.length >= 4 && /[a-z]#|\d/.test(t))) {
      phrases.add(t);
    }
  }
  return [...phrases];
}

function matchPhrases(cvN: string, phrases: string[]) {
  const matched: string[] = [];
  const missing: string[] = [];
  for (const p of phrases) {
    if (textHasTerm(cvN, p) || cvN.includes(normalize(p))) matched.push(p);
    else missing.push(p);
  }
  return { matched, missing };
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

function degreeGap(jobN: string, cvN: string): string | null {
  const wants =
    /profesional|universitari|licenciatura|ingenier|maestr|mba|tecn[oó]log[oa]|t[eé]cnico/.test(jobN);
  if (!wants) return null;
  const has =
    /profesional|universitari|licenciatura|ingenier|maestr|mba|tecn[oó]log|t[eé]cnico|pregrado|posgrado/.test(
      cvN
    );
  if (!has) return "La oferta menciona formación académica y no se ve clara en tu CV.";
  return null;
}

function locationGap(jobN: string, cvN: string): string | null {
  if (!/presencial|en oficina|bogot|medell|cali|barranquill|remoto|h[ií]brido/.test(jobN)) return null;
  if (/remoto|h[ií]brido|presencial|bogot|medell|cali|disponibilidad|ubicaci[oó]n/.test(cvN)) return null;
  if (/100%\s*remoto|solo remoto/.test(jobN) && !/remoto|remote|trabajo remoto/.test(cvN)) {
    return "La oferta enfatiza modalidad (remoto/híbrido/presencial); declárala en tu CV o resumen.";
  }
  return null;
}

function formatAlerts(cv: string, profile: AtsProfile, sections: ReturnType<typeof detectCvSections>): string[] {
  const alerts: string[] = [];
  if (cv.length < 400) alerts.push("El CV parece muy corto; agrega logros cuantificados por rol.");
  if (cv.length > 12000) {
    alerts.push("CV muy largo: muchos parsers y reclutadores prefieren 1–2 páginas enfocadas a la vacante.");
  }
  if (/\|/.test(cv) || /\t\t/.test(cv)) {
    alerts.push("Posible diseño multi-columna o tablas: Workday/Taleo suelen fallar al parsear.");
  }
  if ((cv.match(/•|●|◆|★|✓/g) || []).length > 40) {
    alerts.push("Demasiados símbolos decorativos; preferible viñetas simples (-) o (•).");
  }
  if (/https?:\/\/|www\./i.test(cv) && (cv.match(/https?:\/\//gi) || []).length > 8) {
    alerts.push("Muchos hipervínculos pueden confundir parsers antiguos; deja 1–2 enlaces clave.");
  }
  if (!sections.experience) alerts.push("No se detectó sección de Experiencia con encabezado estándar.");
  if (!sections.education) alerts.push("No se detectó sección de Educación/Formación.");
  if (!sections.skills) alerts.push("No se detectó sección Skills/Habilidades (ayuda al parse de keywords).");
  if (!sections.contact) alerts.push("Contacto poco claro (email/tel/LinkedIn).");
  if (profile === "workday" || profile === "taleo") {
    alerts.push(`Perfil ${profile}: evita encabezados en imagen y columnas; fechas MM/AAAA consistentes.`);
  }
  if (profile === "greenhouse" || profile === "lever") {
    alerts.push(`Perfil ${profile}: una columna + secciones claras; el humano leerá scorecards.`);
  }
  if (profile === "successfactors" || profile === "sap") {
    alerts.push(`Perfil ${profile}: sé literal con títulos de cargo; evita tablas anidadas.`);
  }
  return alerts;
}

function trapAlerts(cv: string): string[] {
  const alerts: string[] = [];
  if (/color:\s*#?fff|color:\s*white|font-size:\s*1px/i.test(cv)) {
    alerts.push("Posible texto oculto / trampa ATS. Sistemas modernos pueden descartarte por fraude.");
  }
  const words = tokenize(cv);
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  const stuffed = [...freq.entries()].filter(([, c]) => c > 18).map(([w]) => w);
  if (stuffed.length) {
    alerts.push(`Posible keyword stuffing (${stuffed.slice(0, 3).join(", ")}). Usa lenguaje natural en logros.`);
  }
  return alerts;
}

function profileWeights(profile: AtsProfile): { kw: number; sem: number } {
  switch (profile) {
    case "taleo":
    case "sap":
    case "successfactors":
      return { kw: 0.9, sem: 0.1 };
    case "workday":
      return { kw: 0.72, sem: 0.28 };
    case "greenhouse":
    case "lever":
      return { kw: 0.78, sem: 0.22 };
    default:
      return { kw: 0.82, sem: 0.18 };
  }
}

export function analyzeAts(input: AtsAnalyzeInput): AtsAnalyzeResult {
  const profile = input.atsProfile || "generic";
  const cvN = normalize(input.cvText);
  const jobN = normalize(input.jobText);
  const sections = detectCvSections(input.cvText);
  const jobParts = splitJobSections(input.jobText);

  const allPhrases = extractPhrases(input.jobText);
  const { matched, missing } = matchPhrases(cvN, allPhrases);

  const mustPhrases = extractPhrases(jobParts.must);
  const nicePhrases = jobParts.nice ? extractPhrases(jobParts.nice) : [];
  const mustHave = matchPhrases(cvN, mustPhrases);
  const niceToHave = matchPhrases(cvN, nicePhrases.length ? nicePhrases : []);

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
  const deg = degreeGap(jobN, cvN);
  if (deg) exclusiveGaps.push(deg);
  const loc = locationGap(jobN, cvN);
  if (loc) exclusiveGaps.push(loc);

  // Must-have coverage pesa más que nice-to-have
  const mustCov = mustPhrases.length ? mustHave.matched.length / mustPhrases.length : 0;
  const allCov = allPhrases.length ? matched.length / allPhrases.length : 0.5;
  const niceCov = nicePhrases.length ? niceToHave.matched.length / nicePhrases.length : 1;
  const coverage = mustPhrases.length >= 3 ? mustCov * 0.7 + allCov * 0.25 + niceCov * 0.05 : allCov;

  const format = formatAlerts(input.cvText, profile, sections);
  const traps = trapAlerts(input.cvText);
  const exclusivePenalty = exclusiveGaps.length * 0.08;
  const formatPenalty = Math.min(0.15, format.length * 0.025 + traps.length * 0.05);
  const sectionPenalty =
    (!sections.experience ? 0.04 : 0) + (!sections.skills ? 0.03 : 0) + (!sections.education ? 0.02 : 0);

  const keywordScore = Math.max(
    0,
    Math.min(100, coverage * 100 * (1 - exclusivePenalty - formatPenalty - sectionPenalty))
  );
  const embeddingProvider: EmbeddingProvider = input.semanticOverride?.provider || "local-tfidf";
  const semanticScore =
    input.semanticOverride?.score ?? localTfidfScore(input.cvText, input.jobText);
  const w = profileWeights(profile);
  const score = Math.round(Math.max(0, Math.min(100, keywordScore * w.kw + semanticScore * w.sem)));

  const interviewProbability = Math.round(
    Math.max(
      5,
      Math.min(
        95,
        score * 0.82 +
          (softMatched.length > 0 ? 4 : 0) +
          (mustHave.matched.length > 3 ? 5 : 0) -
          exclusiveGaps.length * 8
      )
    )
  );

  const trainingSuggestions = hardMissing.slice(0, 5).map(
    (k) => `Si aún no dominas “${k}”, un curso corto + un mini-proyecto medible en el CV ayuda más que solo listarlo.`
  );

  const hasMetrics = /\d+%|\d+\s*(usuarios|clientes|millones|mil|personas|equipo)|\$\s*\d+|cop\s*\d+/i.test(
    input.cvText
  );

  const actions: string[] = [];
  if (mustHave.missing.length) {
    actions.push(`Prioridad must-have (si es tu experiencia real): ${mustHave.missing.slice(0, 8).join(", ")}.`);
  } else if (missing.length) {
    actions.push(`Integra de forma natural: ${missing.slice(0, 8).join(", ")}.`);
  }
  if (exclusiveGaps.length) actions.push("Resuelve primero los requisitos excluyentes (honestidad > keyword stuffing).");
  if (!hasMetrics) actions.push("Cuantifica logros (%, dinero, tiempo, alcance, personas).");
  if (!sections.skills) actions.push("Añade bloque Skills con términos literales de la oferta (sin inventar).");
  actions.push("Adapta el CV a esta oferta concreta; luego completa bien el formulario del portal.");

  const heatTerms = [...new Set([...mustHave.missing, ...mustHave.matched, ...hardMissing, ...hardMatched, ...missing, ...matched])];
  const heatmap = buildKeywordHeatmap(input.cvText, input.jobText, heatTerms, 28);
  const sectionHits = sectionKeywordHits(input.cvText, [...matched, ...missing].slice(0, 40));

  const explanation = [
    `Cobertura ponderada (must-have + keywords): ${Math.round(coverage * 100)}%.`,
    `Solape semántico (${embeddingProvider}): ${semanticScore}%.`,
    `Pesos perfil ${profile}: keywords ${Math.round(w.kw * 100)}% / semántico ${Math.round(w.sem * 100)}%.`,
    exclusiveGaps.length
      ? "Hay brechas excluyentes que bajan fuerte la probabilidad de pasar el filtro."
      : "No se detectaron brechas excluyentes críticas.",
    `Secciones detectadas: Exp ${sections.experience ? "✓" : "✗"} · Edu ${sections.education ? "✓" : "✗"} · Skills ${sections.skills ? "✓" : "✗"} · Contacto ${sections.contact ? "✓" : "✗"}.`,
  ];

  const nextSteps = buildNextSteps({
    score,
    exclusiveGaps,
    missingMust: mustHave.missing,
    formatAlerts: format,
    hasMetrics,
  });

  const applicationTips = [
    ...APPLICATION_PLAYBOOK_BASE.slice(0, 6),
    score < 65
      ? "Tu match aún es bajo: no multipliques postulaciones idénticas; ajusta el CV primero."
      : "Con este nivel de match, postula y prepara 3 historias STAR ligadas a los must-have.",
    profile === "taleo"
      ? "En Taleo: repite keywords exactas en Experiencia + Skills (sin stuffing)."
      : profile === "workday"
        ? "En Workday: keywords en contexto de logros (el parse semántico premia evidencia)."
        : "Completa el formulario del ATS con los mismos términos que tu PDF.",
  ];

  return {
    score,
    interviewProbability,
    semanticScore,
    embeddingProvider,
    matchedKeywords: matched.slice(0, 40),
    missingKeywords: missing.slice(0, 40),
    hardSkills: { matched: hardMatched.slice(0, 25), missing: hardMissing.slice(0, 25) },
    softSkills: { matched: softMatched.slice(0, 25), missing: softMissing.slice(0, 25) },
    mustHave: {
      matched: mustHave.matched.slice(0, 25),
      missing: mustHave.missing.slice(0, 25),
    },
    niceToHave: {
      matched: niceToHave.matched.slice(0, 20),
      missing: niceToHave.missing.slice(0, 20),
    },
    sectionCoverage: sections,
    exclusiveGaps,
    formatAlerts: format,
    trapAlerts: traps,
    trainingSuggestions,
    actions,
    explanation,
    atsInsights: ATS_HOW_THEY_FILTER[profile] || ATS_HOW_THEY_FILTER.generic,
    nextSteps,
    recruiterTips: humanRecruiterTips(),
    applicationTips,
    heatmap,
    sectionHits,
  };
}
