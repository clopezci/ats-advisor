import { textHasTerm } from "@/lib/ats/synonyms";
import { detectCvSections, parseCvPreview, splitJobSections } from "@/lib/ats/jdParse";
import {
  APPLICATION_PLAYBOOK_BASE,
  ATS_HOW_THEY_FILTER,
  buildNextSteps,
  humanRecruiterTips,
} from "@/lib/ats/coaching";
import { localTfidfScore, type EmbeddingProvider } from "@/lib/ats/embeddings";
import { buildKeywordHeatmap, sectionKeywordHits, type HeatCell } from "@/lib/ats/heatmap";
import { analyzeBullets } from "@/lib/ats/bulletQuality";
import { buildPlacementGuide, type PlacementTip } from "@/lib/ats/placementGuide";
import { analyzeAuthenticity } from "@/lib/ats/aiTells";
import { recruiterSkim, type RecruiterSkim } from "@/lib/ats/recruiterSkim";
import { isJunkPhrase, normalizePhrase, filterSkillTerms } from "@/lib/ats/phraseFilter";
import { normalizeJobText } from "@/lib/ats/jdNormalize";

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
  semanticOverride?: { score: number; provider: EmbeddingProvider; cloud?: boolean; warning?: string };
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
  bulletQuality: {
    avgScore: number;
    total: number;
    weakest: { text: string; score: number; tips: string[] }[];
  };
  placementGuide: PlacementTip[];
  parsePreview: ReturnType<typeof parseCvPreview>;
  authenticityScore: number;
  authenticityAlerts: string[];
  recruiterSkim: RecruiterSkim;
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
  "google analytics",
  "nómina",
  "nomina",
  "hcm",
  "fico",
  "abap",
  "netsuite",
  "oracle",
  "postgresql",
  "mysql",
  "mongodb",
  "ci/cd",
  "devops",
  "finops",
  "aiops",
  "mlops",
  "sre",
  "site reliability",
  "observabilidad",
  "monitoreo",
  "drp",
  "disaster recovery",
  "on-premise",
  "on premise",
  "híbrida",
  "hibrida",
  "infraestructura",
  "seguridad de la información",
  "iso 27001",
  "pmp",
  "itil",
  "itil 4",
  "cobit",
  "togaf",
  "six sigma",
  "lean",
  "okrs",
  "okr",
  "kpis",
  "kpi",
  "slas",
  "sla",
  "xlas",
  "xla",
  "team topologies",
  "servicios compartidos",
  "automatización",
  "automatizacion",
];

function normalize(text: string) {
  return normalizePhrase(text);
}

/** Match de término en texto normalizado (evita que "ui" pegue dentro de "digital"). */
function jobHasTerm(jobN: string, term: string) {
  const t = normalize(term);
  if (!t) return false;
  if (t.length <= 3) {
    return new RegExp(`(^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`).test(jobN);
  }
  return jobN.includes(t);
}

/** Keywords / skills: solo catálogo conocido presente de verdad en la oferta. */
function extractPhrases(job: string) {
  const n = normalize(job);
  const phrases = new Set<string>();
  for (const s of [...SOFT, ...HARD_HINTS]) {
    if (jobHasTerm(n, s) && !isJunkPhrase(s)) phrases.add(s);
  }
  return filterSkillTerms([...phrases]);
}

/**
 * Must-have: skills del catálogo + formación/años en sección de requisitos.
 * Nunca bigramas del intro (“estamos buscando…”) ni beneficios.
 */
function extractMustPhrases(mustSection: string, fullJob: string) {
  const corpus =
    mustSection.trim().length >= 40
      ? mustSection
      : fullJob
          .split("\n")
          .filter((l) => {
            const t = l.trim();
            if (t.length < 6) return false;
            if (/estamos buscando|nuestro cliente|ofrecemos|salario|bono|auxilio/i.test(t)) return false;
            return true;
          })
          .join("\n");
  const n = normalize(corpus);
  const phrases = new Set<string>();

  for (const s of [...HARD_HINTS, ...SOFT]) {
    if (jobHasTerm(n, s) && !isJunkPhrase(s)) phrases.add(s);
  }

  const eduHits = corpus.match(
    /\b(?:ingenier[ií]a(?:\s+(?:de\s+)?(?:sistemas|software|inform[aá]tica))?|licenciatura(?:\s+en\s+[a-záéíóúñü]+)?|tecn[oó]log[oa](?:\s+en\s+[a-záéíóúñü]+)?|maestr[ií]a(?:\s+en\s+[a-záéíóúñü]+)?|mba)\b/gi
  );
  for (const e of eduHits || []) {
    const cleaned = e.trim().toLowerCase();
    if (cleaned.length >= 8 && cleaned.length <= 50 && !isJunkPhrase(cleaned)) phrases.add(cleaned);
  }

  const yearHit = normalize(corpus).match(/(\d+)\s*\+?\s*(anos|años|years)/);
  if (yearHit) phrases.add(`${yearHit[1]} años`);

  // Frases de requisito largas (línea completa corta), no bigramas deslizantes
  for (const line of mustSection.split("\n")) {
    const t = line.replace(/^[-•●*🔑⭐]+\s*/, "").trim();
    if (t.length < 8 || t.length > 100 || isJunkPhrase(t)) continue;
    if (/^(devops|finops|aiops|itil|aws|azure|gcp|sre|observabilidad)/i.test(t) && t.length <= 40) {
      phrases.add(t.replace(/\s+/g, " "));
      continue;
    }
    for (const s of HARD_HINTS) {
      if (jobHasTerm(normalize(t), s) && !isJunkPhrase(s)) phrases.add(s);
    }
  }

  return filterSkillTerms([...phrases]).slice(0, 24);
}

function matchPhrases(cvN: string, phrases: string[]) {
  const matched: string[] = [];
  const missing: string[] = [];
  for (const p of dedupeTerms(phrases)) {
    if (isJunkPhrase(p)) continue;
    if (textHasTerm(cvN, p) || jobHasTerm(cvN, p)) matched.push(p);
    else missing.push(p);
  }
  return { matched, missing };
}

/** Skills: solo términos del catálogo con match real en la oferta. */
function skillsFromCatalog(jobN: string, cvN: string, catalog: string[]) {
  const inJob = dedupeTerms(catalog.filter((h) => jobHasTerm(jobN, h)));
  const matched = inJob.filter((h) => textHasTerm(cvN, h) || jobHasTerm(cvN, h));
  const missing = inJob.filter((h) => !matched.includes(h));
  return { matched, missing };
}

function dedupeTerms(list: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of list) {
    const key = normalize(raw).replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(raw);
  }
  return out;
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
  if ((cv.match(/\|/g) || []).length >= 8 || /\t\t/.test(cv)) {
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
  const auth = analyzeAuthenticity(cv);
  alerts.push(...auth.alerts);
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
  const jobText = normalizeJobText(input.jobText);
  const cvN = normalize(input.cvText);
  const jobN = normalize(jobText);
  const sections = detectCvSections(input.cvText);
  const jobParts = splitJobSections(jobText);

  const allPhrases = extractPhrases(jobText);
  const { matched, missing } = matchPhrases(cvN, allPhrases);

  const mustPhrases = extractMustPhrases(jobParts.must, jobText);
  const nicePhrases = jobParts.nice ? extractPhrases(jobParts.nice) : [];
  const mustHave = matchPhrases(cvN, mustPhrases);
  const niceToHave = matchPhrases(cvN, nicePhrases);

  const hard = skillsFromCatalog(jobN, cvN, HARD_HINTS);
  const soft = skillsFromCatalog(jobN, cvN, SOFT);
  const hardMatched = filterSkillTerms(hard.matched);
  const hardMissing = filterSkillTerms(hard.missing);
  const softMatched = filterSkillTerms(soft.matched);
  const softMissing = filterSkillTerms(soft.missing);

  const exclusiveGaps: string[] = [];
  if (
    /ingles|inglés|english|bilingue|bilingüe/.test(jobN) &&
    !textHasTerm(cvN, "ingles") &&
    !/ingles|inglés|english|bilingue|bilingüe/.test(cvN)
  ) {
    exclusiveGaps.push("La oferta exige inglés y no aparece claramente en tu CV.");
  }
  const yr = yearsRequired(jobText);
  const yc = yearsInCv(input.cvText);
  if (yr && (yc === null || yc < yr)) {
    exclusiveGaps.push(`La oferta pide ~${yr} años de experiencia; en el CV se detectó ${yc ?? "poco claro"}.`);
  }
  const deg = degreeGap(jobN, cvN);
  if (deg) exclusiveGaps.push(deg);
  const loc = locationGap(jobN, cvN);
  if (loc) exclusiveGaps.push(loc);

  const mustMatched = filterSkillTerms(mustHave.matched);
  const mustMissing = filterSkillTerms(mustHave.missing);
  const niceMatched = filterSkillTerms(niceToHave.matched);
  const niceMissing = filterSkillTerms(niceToHave.missing);
  const kwMatched = filterSkillTerms(matched);
  const kwMissing = filterSkillTerms(missing);

  // Must-have coverage pesa más que nice-to-have
  const mustCov = mustPhrases.length ? mustMatched.length / mustPhrases.length : 0;
  const allCov = allPhrases.length ? kwMatched.length / allPhrases.length : 0.5;
  const niceCov = nicePhrases.length ? niceMatched.length / nicePhrases.length : 1;
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
    input.semanticOverride?.score ?? localTfidfScore(input.cvText, jobText);
  const w = profileWeights(profile);
  const score = Math.round(Math.max(0, Math.min(100, keywordScore * w.kw + semanticScore * w.sem)));

  const interviewProbability = Math.round(
    Math.max(
      5,
      Math.min(
        95,
        score * 0.82 +
          (softMatched.length > 0 ? 4 : 0) +
          (mustMatched.length > 3 ? 5 : 0) -
          exclusiveGaps.length * 8
      )
    )
  );

  const trainingSuggestions = hardMissing.slice(0, 5).map(
    (k) => `Si aún no manejas ${k}, un curso corto y un proyecto real en el CV sirven más que solo nombrarlo.`
  );

  const hasMetrics = /\d+%|\d+\s*(usuarios|clientes|millones|mil|personas|equipo)|\$\s*\d+|cop\s*\d+/i.test(
    input.cvText
  );

  const actions: string[] = [];
  if (mustMissing.length) {
    actions.push(
      `Si de verdad los cumples, déjalos ver en el CV: ${mustMissing.slice(0, 8).join(", ")}.`
    );
  } else if (kwMissing.length) {
    actions.push(`Si aplica a tu experiencia, menciona: ${kwMissing.slice(0, 8).join(", ")}.`);
  }
  if (exclusiveGaps.length) {
    actions.push("Primero resuelve con honestidad lo excluyente (idioma, años, título, ciudad). No lo inventes.");
  }
  if (!hasMetrics) actions.push("Pon números en al menos 3 logros (%, plata, tiempo, personas).");
  if (!sections.skills) actions.push("Agrega un bloque de habilidades con términos de la oferta que sí domines.");
  actions.push("Ajusta el CV a esta oferta y vuelve a analizar antes de postular.");

  const heatTerms = filterSkillTerms([
    ...mustMissing,
    ...mustMatched,
    ...hardMissing,
    ...hardMatched,
    ...kwMissing,
    ...kwMatched,
  ]);
  const heatmap = buildKeywordHeatmap(input.cvText, jobText, heatTerms, 28);
  const sectionHits = sectionKeywordHits(input.cvText, [...kwMatched, ...kwMissing].slice(0, 40));
  const bulletRaw = analyzeBullets(input.cvText, [...hardMatched, ...hardMissing, ...kwMatched].slice(0, 30));
  const bulletQuality = {
    avgScore: bulletRaw.avgScore,
    total: bulletRaw.total,
    weakest: bulletRaw.weakest.map((b) => ({ text: b.text, score: b.score, tips: b.tips })),
  };
  const placementGuide = buildPlacementGuide({
    missingMust: mustMissing,
    missingHard: hardMissing,
    missingSoft: softMissing,
    sectionHits,
  });
  const parsePreview = parseCvPreview(input.cvText);
  const authenticity = analyzeAuthenticity(input.cvText);
  const skim = recruiterSkim(input.cvText, mustMatched[0] || kwMatched[0]);

  const explanation = [
    `Cobertura ponderada (must-have + keywords): ${Math.round(coverage * 100)}%.`,
    `Solape semántico (${embeddingProvider}): ${semanticScore}%.`,
    `Autenticidad / anti-IA: ${authenticity.authenticityScore}%.`,
    `Pesos perfil ${profile}: keywords ${Math.round(w.kw * 100)}% / semántico ${Math.round(w.sem * 100)}%.`,
    exclusiveGaps.length
      ? "Hay brechas excluyentes que bajan fuerte la probabilidad de pasar el filtro."
      : "No se detectaron brechas excluyentes críticas.",
    `Secciones detectadas: Exp ${sections.experience ? "✓" : "✗"} · Edu ${sections.education ? "✓" : "✗"} · Skills ${sections.skills ? "✓" : "✗"} · Contacto ${sections.contact ? "✓" : "✗"}.`,
  ];

  const nextSteps = buildNextSteps({
    score,
    exclusiveGaps,
    missingMust: mustMissing,
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
    matchedKeywords: kwMatched.slice(0, 40),
    missingKeywords: kwMissing.slice(0, 40),
    hardSkills: { matched: hardMatched.slice(0, 25), missing: hardMissing.slice(0, 25) },
    softSkills: { matched: softMatched.slice(0, 25), missing: softMissing.slice(0, 25) },
    mustHave: {
      matched: mustMatched.slice(0, 25),
      missing: mustMissing.slice(0, 25),
    },
    niceToHave: {
      matched: niceMatched.slice(0, 20),
      missing: niceMissing.slice(0, 20),
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
    bulletQuality,
    placementGuide,
    parsePreview,
    authenticityScore: authenticity.authenticityScore,
    authenticityAlerts: authenticity.alerts,
    recruiterSkim: skim,
  };
}
