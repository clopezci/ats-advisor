/**
 * Radar de vacantes: criterios personales + lote de avisos (sin scrapear LinkedIn).
 * El usuario pega avisos; la app decide postula / revisa / descarta.
 */

import { quickMatch } from "@/lib/seo/quickMatch";

export type ModalityFilter = "any" | "remoto" | "hibrido" | "presencial";

export type RadarCriteria = {
  minSalaryCop: number | null;
  modality: ModalityFilter;
  /** Términos que la vacante debería mencionar (tus fortalezas / must). */
  mustHave: string[];
  /** Dealbreakers: si aparecen, tiende a descartar. */
  exclude: string[];
  /** Años máximos que aceptas que pidan (ej. 8). null = no filtrar. */
  maxYearsAsked: number | null;
};

export type RadarVerdict = "postula" | "revisa" | "descarta";

export type RadarFlag = {
  level: "ok" | "warn" | "bad";
  text: string;
};

export type RadarJobResult = {
  id: string;
  title: string;
  verdict: RadarVerdict;
  score: number;
  cvMatch: number | null;
  salaryDetected: number | null;
  flags: RadarFlag[];
  reasons: string[];
};

const STORAGE_KEY = "ats_radar_criteria_v1";

export const DEFAULT_CRITERIA: RadarCriteria = {
  minSalaryCop: null,
  modality: "any",
  mustHave: [],
  exclude: [],
  maxYearsAsked: null,
};

export function readRadarCriteria(): RadarCriteria {
  if (typeof window === "undefined") return DEFAULT_CRITERIA;
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!raw || typeof raw !== "object") return DEFAULT_CRITERIA;
    return {
      minSalaryCop: typeof raw.minSalaryCop === "number" ? raw.minSalaryCop : null,
      modality: (["any", "remoto", "hibrido", "presencial"] as ModalityFilter[]).includes(raw.modality)
        ? raw.modality
        : "any",
      mustHave: Array.isArray(raw.mustHave) ? raw.mustHave.map(String).filter(Boolean) : [],
      exclude: Array.isArray(raw.exclude) ? raw.exclude.map(String).filter(Boolean) : [],
      maxYearsAsked: typeof raw.maxYearsAsked === "number" ? raw.maxYearsAsked : null,
    };
  } catch {
    return DEFAULT_CRITERIA;
  }
}

export function writeRadarCriteria(c: RadarCriteria) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
}

export function parseTerms(raw: string): string[] {
  return raw
    .split(/[,;\n]+/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length >= 2)
    .slice(0, 20);
}

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/** Extrae un monto mensual COP aproximado del aviso (si lo menciona). */
export function detectSalaryCop(jobText: string): number | null {
  const millones = jobText.match(
    /(\d(?:[.,]\d)?)\s*(?:a|-|–)\s*(\d(?:[.,]\d)?)\s*millones/i
  );
  if (millones) {
    const a = Number(millones[1].replace(",", "."));
    const b = Number(millones[2].replace(",", "."));
    if (!Number.isNaN(a) && !Number.isNaN(b)) return Math.round(((a + b) / 2) * 1_000_000);
  }
  const oneMillon = jobText.match(/(\d(?:[.,]\d)?)\s*millones?\b/i);
  if (oneMillon) {
    const n = Number(oneMillon[1].replace(",", "."));
    if (!Number.isNaN(n) && n >= 1 && n <= 80) return Math.round(n * 1_000_000);
  }
  const digits = jobText.replace(/\./g, "").match(/\$?\s*(\d{7,9})\b/);
  if (digits) {
    const n = Number(digits[1]);
    if (!Number.isNaN(n) && n >= 1_500_000 && n <= 80_000_000) return n;
  }
  return null;
}

function detectModality(jobText: string): ModalityFilter | "unknown" {
  const t = norm(jobText);
  const remoto = /\bremoto\b|\bremote\b|\bwork from home\b|\bteletrabajo\b/.test(t);
  const hibrido = /\bhibrido\b|\bhíbrido\b|\bhybrid\b/.test(t);
  const presencial = /\bpresencial\b|\bon[- ]?site\b|\ben oficina\b/.test(t);
  if (hibrido) return "hibrido";
  if (remoto && !presencial) return "remoto";
  if (presencial && !remoto) return "presencial";
  if (remoto) return "remoto";
  return "unknown";
}

function detectYearsAsked(jobText: string): number | null {
  const m = jobText.match(/(\d{1,2})\s*(?:\+|o más|o mas)?\s*a[nñ]os(?:\s+de\s+experiencia)?/i);
  if (!m) return null;
  const n = Number(m[1]);
  if (Number.isNaN(n) || n < 1 || n > 40) return null;
  return n;
}

function termHit(jobNorm: string, term: string): boolean {
  const t = norm(term);
  if (t.length < 2) return false;
  return jobNorm.includes(t);
}

export function splitJobBatch(bulk: string): { title: string; text: string }[] {
  const chunks = bulk
    .split(/\n---+\n|\n={3,}\n/)
    .map((c) => c.trim())
    .filter((c) => c.length >= 40);
  return chunks.map((text) => ({
    title: text.split("\n").map((l) => l.trim()).find((l) => l.length > 4)?.slice(0, 80) || "Vacante",
    text,
  }));
}

export function evaluateJobAgainstCriteria(
  jobText: string,
  title: string,
  criteria: RadarCriteria,
  cvText?: string
): Omit<RadarJobResult, "id"> {
  const jobNorm = norm(jobText);
  const flags: RadarFlag[] = [];
  const reasons: string[] = [];
  let points = 50;

  const salaryDetected = detectSalaryCop(jobText);
  if (criteria.minSalaryCop && criteria.minSalaryCop > 0) {
    if (salaryDetected == null) {
      flags.push({ level: "warn", text: "No vimos salario en el aviso; confirma en LinkedIn o con RH." });
      points -= 5;
    } else if (salaryDetected < criteria.minSalaryCop * 0.92) {
      flags.push({
        level: "bad",
        text: `Salario detectado (~${fmtCop(salaryDetected)}) bajo tu piso (${fmtCop(criteria.minSalaryCop)}).`,
      });
      points -= 35;
      reasons.push("Salario por debajo de tu piso");
    } else {
      flags.push({ level: "ok", text: `Salario detectado ~${fmtCop(salaryDetected)} (cumple tu piso).` });
      points += 10;
    }
  }

  if (criteria.modality !== "any") {
    const mod = detectModality(jobText);
    if (mod === "unknown") {
      flags.push({ level: "warn", text: "No queda clara la modalidad (remoto/híbrido/presencial)." });
      points -= 4;
    } else if (mod !== criteria.modality) {
      flags.push({
        level: "bad",
        text: `Modalidad del aviso: ${mod}. Tú pediste: ${criteria.modality}.`,
      });
      points -= 25;
      reasons.push("Modalidad no encaja");
    } else {
      flags.push({ level: "ok", text: `Modalidad OK (${mod}).` });
      points += 8;
    }
  }

  const mustHits = criteria.mustHave.filter((t) => termHit(jobNorm, t));
  const mustMiss = criteria.mustHave.filter((t) => !termHit(jobNorm, t));
  if (criteria.mustHave.length) {
    if (mustMiss.length === 0) {
      flags.push({ level: "ok", text: `Menciona tus términos clave: ${mustHits.join(", ")}.` });
      points += 15;
    } else if (mustHits.length === 0) {
      flags.push({ level: "bad", text: `No menciona nada de tu lista: ${mustMiss.slice(0, 5).join(", ")}.` });
      points -= 20;
      reasons.push("Faltan términos que buscas en el aviso");
    } else {
      flags.push({
        level: "warn",
        text: `Parcial: hay ${mustHits.join(", ")}. Faltan: ${mustMiss.slice(0, 5).join(", ")}.`,
      });
      points -= 8;
    }
  }

  const excludeHits = criteria.exclude.filter((t) => termHit(jobNorm, t));
  if (excludeHits.length) {
    flags.push({ level: "bad", text: `Dealbreaker en el aviso: ${excludeHits.join(", ")}.` });
    points -= 40;
    reasons.push("Aparece algo que excluiste");
  }

  if (criteria.maxYearsAsked != null && criteria.maxYearsAsked > 0) {
    const years = detectYearsAsked(jobText);
    if (years != null && years > criteria.maxYearsAsked) {
      flags.push({
        level: "warn",
        text: `Piden ~${years} años y tu tope es ${criteria.maxYearsAsked}. Aún puedes postular si cumples el resto.`,
      });
      points -= 10;
    }
  }

  let cvMatch: number | null = null;
  if (cvText && cvText.trim().length >= 40) {
    cvMatch = quickMatch(cvText, jobText).score;
    if (cvMatch >= 70) {
      points += 12;
      flags.push({ level: "ok", text: `Encaje rápido CV↔aviso: ${cvMatch}%.` });
    } else if (cvMatch >= 45) {
      points += 4;
      flags.push({ level: "warn", text: `Encaje rápido CV↔aviso: ${cvMatch}% (mejorable).` });
    } else {
      points -= 12;
      flags.push({ level: "bad", text: `Encaje rápido CV↔aviso bajo: ${cvMatch}%.` });
      reasons.push("Bajo match léxico con tu CV");
    }
  }

  const score = Math.max(0, Math.min(100, Math.round(points)));
  let verdict: RadarVerdict = "revisa";
  if (score >= 70 && !flags.some((f) => f.level === "bad")) verdict = "postula";
  else if (score < 45 || flags.filter((f) => f.level === "bad").length >= 2) verdict = "descarta";
  else if (flags.some((f) => f.level === "bad" && /Dealbreaker|Salario detectado/.test(f.text)))
    verdict = "descarta";

  if (verdict === "postula" && !reasons.length) reasons.push("Cumple tus filtros principales");
  if (verdict === "revisa" && !reasons.length) reasons.push("Hay señales mixtas: abre el aviso y confirma");

  return {
    title: title.slice(0, 100),
    verdict,
    score,
    cvMatch,
    salaryDetected,
    flags,
    reasons,
  };
}

export function runRadarBatch(
  bulk: string,
  criteria: RadarCriteria,
  cvText?: string
): RadarJobResult[] {
  return splitJobBatch(bulk).map((j, i) => ({
    id: `radar_${Date.now()}_${i}`,
    ...evaluateJobAgainstCriteria(j.text, j.title, criteria, cvText),
  })).sort((a, b) => {
    const order = { postula: 0, revisa: 1, descarta: 2 };
    if (order[a.verdict] !== order[b.verdict]) return order[a.verdict] - order[b.verdict];
    return b.score - a.score;
  });
}

function fmtCop(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

export function verdictLabel(v: RadarVerdict): string {
  if (v === "postula") return "Postula";
  if (v === "descarta") return "Descarta";
  return "Revisa";
}
