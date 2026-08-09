/** Assessment RIASEC corto + mapa a roles típicos LATAM. */

export type RiasecCode = "R" | "I" | "A" | "S" | "E" | "C";

export const RIASEC_LABELS: Record<RiasecCode, { name: string; blurb: string }> = {
  R: {
    name: "Realista",
    blurb: "Prefieres lo concreto, herramientas, campo, operación o tech hands-on.",
  },
  I: {
    name: "Investigador",
    blurb: "Analizas, investigas, resuelves con datos y curiosidad sistemática.",
  },
  A: {
    name: "Artístico",
    blurb: "Creas, comunicas con estilo, diseñas experiencias o contenidos.",
  },
  S: {
    name: "Social",
    blurb: "Ayudas, enseñas, acompañas personas y equipos.",
  },
  E: {
    name: "Emprendedor",
    blurb: "Persuades, vendes, lideras iniciativas y tomas decisiones.",
  },
  C: {
    name: "Convencional",
    blurb: "Ordenas, documentas, cumples procesos y calidad.",
  },
};

export type RiasecQuestion = {
  id: string;
  text: string;
  code: RiasecCode;
};

/** 18 ítems (3 por letra). Escala 1–5. */
export const RIASEC_QUESTIONS: RiasecQuestion[] = [
  { id: "r1", code: "R", text: "Me motiva arreglar, ensamblar o mejorar algo tangible." },
  { id: "r2", code: "R", text: "Prefiero trabajo de campo / laboratorio / operación a solo reuniones." },
  { id: "r3", code: "R", text: "Disfruto usar herramientas técnicas (software, máquinas, kits)." },
  { id: "i1", code: "I", text: "Me atrae investigar por qué falló un proceso o un número." },
  { id: "i2", code: "I", text: "Leo papers, docs o datos por gusto, no solo por obligación." },
  { id: "i3", code: "I", text: "Me siento cómodo con hipótesis, experimentos y evidencia." },
  { id: "a1", code: "A", text: "Me gusta diseñar, escribir, ilustrar o contar historias." },
  { id: "a2", code: "A", text: "Valoro originalidad aunque el proceso sea imperfecto." },
  { id: "a3", code: "A", text: "Prefiero briefs creativos a checklists rígidos." },
  { id: "s1", code: "S", text: "Me energiza enseñar, coaching o atención a personas." },
  { id: "s2", code: "S", text: "Resuelvo conflictos escuchando antes de imponer." },
  { id: "s3", code: "S", text: "El impacto en bienestar de otros es un criterio de éxito." },
  { id: "e1", code: "E", text: "Me motiva cerrar acuerdos, vender ideas o liderar." },
  { id: "e2", code: "E", text: "Tomo la iniciativa aunque nadie me lo pida." },
  { id: "e3", code: "E", text: "Me atraen metas de crecimiento, revenue o influencia." },
  { id: "c1", code: "C", text: "Me gusta dejar procesos documentados y auditables." },
  { id: "c2", code: "C", text: "Prefiero reglas claras y calidad consistente." },
  { id: "c3", code: "C", text: "Organizar datos, archivos o compliance me resulta natural." },
];

export type LatamRoleHint = {
  title: string;
  codes: RiasecCode[];
  sectors: string[];
  note: string;
};

export const LATAM_ROLE_MAP: LatamRoleHint[] = [
  {
    title: "Analista de datos / BI",
    codes: ["I", "C"],
    sectors: ["Fintech", "Retail", "Salud", "Gobierno"],
    note: "SQL, dashboards, storytelling con datos.",
  },
  {
    title: "Desarrollador / QA / DevOps",
    codes: ["R", "I", "C"],
    sectors: ["Productos digitales", "BPO tech", "Startups"],
    note: "Hands-on + investigación de bugs + procesos.",
  },
  {
    title: "Product / UX researcher",
    codes: ["I", "A", "S"],
    sectors: ["SaaS", "E-commerce", "EdTech"],
    note: "Descubrimiento, prototipos, voz del usuario.",
  },
  {
    title: "Diseño / contenido / marca",
    codes: ["A", "E"],
    sectors: ["Agencias", "Media", "Marcas D2C"],
    note: "Creatividad + pitch a stakeholders.",
  },
  {
    title: "HRBP / Talent / L&D",
    codes: ["S", "E", "C"],
    sectors: ["Corporativo", "Shared services"],
    note: "Personas + influencia + procesos de gente.",
  },
  {
    title: "Customer success / soporte senior",
    codes: ["S", "C", "E"],
    sectors: ["SaaS", "Telco", "Financiero"],
    note: "Empatía + orden + retención.",
  },
  {
    title: "Ventas B2B / Account management",
    codes: ["E", "S"],
    sectors: ["Software", "Industrial", "Servicios"],
    note: "Persuasión + relación de largo plazo.",
  },
  {
    title: "Operaciones / supply / calidad",
    codes: ["R", "C", "E"],
    sectors: ["Manufactura", "Logística", "Retail"],
    note: "Campo + procesos + mejora continua.",
  },
  {
    title: "Project / Scrum / PMO",
    codes: ["E", "C", "S"],
    sectors: ["TI", "Construcción", "Consultoría"],
    note: "Liderazgo de delivery + gobernanza.",
  },
  {
    title: "Contabilidad / auditoría / compliance",
    codes: ["C", "I"],
    sectors: ["Servicios financieros", "Outsourcing"],
    note: "Normativa + análisis.",
  },
  {
    title: "Docencia / facilitación / community",
    codes: ["S", "A"],
    sectors: ["EdTech", "ONG", "Corporativo L&D"],
    note: "Enseñar y crear experiencias de aprendizaje.",
  },
  {
    title: "Emprendimiento / growth",
    codes: ["E", "A", "I"],
    sectors: ["Startups", "Freelance"],
    note: "Hipótesis de mercado + ejecución comercial.",
  },
];

export type RiasecScores = Record<RiasecCode, number>;

export type RiasecResult = {
  scores: RiasecScores;
  ranked: RiasecCode[];
  holland: string;
  roles: LatamRoleHint[];
  answeredAt: string;
};

export function emptyScores(): RiasecScores {
  return { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
}

export function scoreRiasec(answers: Record<string, number>): RiasecResult {
  const scores = emptyScores();
  const counts = emptyScores();
  for (const q of RIASEC_QUESTIONS) {
    const v = Math.min(5, Math.max(1, Number(answers[q.id]) || 0));
    if (!v) continue;
    scores[q.code] += v;
    counts[q.code] += 1;
  }
  // Normalize to 0–100 if all answered
  const codes = Object.keys(scores) as RiasecCode[];
  for (const c of codes) {
    const n = counts[c] || 1;
    scores[c] = Math.round((scores[c] / (n * 5)) * 100);
  }
  const ranked = [...codes].sort((a, b) => scores[b] - scores[a]);
  const holland = ranked.slice(0, 3).join("");
  const top = new Set(ranked.slice(0, 3));
  const roles = LATAM_ROLE_MAP.map((r) => ({
    role: r,
    hit: r.codes.filter((c) => top.has(c)).length,
  }))
    .filter((x) => x.hit > 0)
    .sort((a, b) => b.hit - a.hit || b.role.codes.length - a.role.codes.length)
    .slice(0, 6)
    .map((x) => x.role);

  return {
    scores,
    ranked,
    holland,
    roles: roles.length ? roles : LATAM_ROLE_MAP.slice(0, 4),
    answeredAt: new Date().toISOString(),
  };
}

export const RIASEC_STORAGE_KEY = "ats_riasec_result";

export function saveRiasecResult(r: RiasecResult) {
  localStorage.setItem(RIASEC_STORAGE_KEY, JSON.stringify(r));
}

export function loadRiasecResult(): RiasecResult | null {
  try {
    return JSON.parse(localStorage.getItem(RIASEC_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}
