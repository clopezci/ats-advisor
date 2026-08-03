/** Calidad de viñetas estilo Resume Worded (heurística ES, sin LLM). */

const ACTION_VERBS =
  /^(lider[eé]|dirig[ií]|coordin[eé]|implement[eé]|desarroll[eé]|optimiz[eé]|reduj|aument[eé]|mejor[eé]|gestion[eé]|diseñ[eé]|analic[eé]|cre[eé]|automatiz[eé]|negoci[eé]|form[eé]|mentor[eé]|lanz[eé]|migr[eé]|integr[eé]|supervis[eé]|ejecut[eé]|elabor[eé]|defin[eé]|establec[ií]|impuls[eé]|logré|logre|responsabiliz)/i;

const WEAK_START =
  /^(responsable de|encargado de|tareas de|apoyo en|ayud[eé] en|colabor[eé] en|particip[eé] en|me desempeñé|me desempene)/i;

export type BulletQuality = {
  text: string;
  score: number; // 0–100
  hasActionVerb: boolean;
  hasMetric: boolean;
  hasSkillSignal: boolean;
  weakOpener: boolean;
  tips: string[];
};

export function extractBullets(cvText: string): string[] {
  const lines = cvText
    .replace(/\r/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const bullets: string[] = [];
  for (const line of lines) {
    const cleaned = line.replace(/^[-•●▪◦*]\s*/, "").trim();
    if (cleaned.length < 28) continue;
    if (/^(experiencia|educaci|habilidades|skills|perfil|resumen|contacto|objetivo)/i.test(cleaned)) continue;
    // Prefer bullet-like or sentence-like achievement lines
    if (/^[-•●]/.test(line) || ACTION_VERBS.test(cleaned) || /\d/.test(cleaned)) {
      bullets.push(cleaned);
    } else if (cleaned.length > 60 && /[,.]/.test(cleaned)) {
      bullets.push(cleaned);
    }
  }
  return bullets.slice(0, 40);
}

export function scoreBullet(text: string, jobSkills: string[] = []): BulletQuality {
  const hasActionVerb = ACTION_VERBS.test(text.trim());
  const hasMetric = /\d+\s*%|\d+\s*(personas|usuarios|clientes|millones|mil|equipo|años|meses)|\$\s*\d+|cop\s*\d+/i.test(
    text
  );
  const lower = text.toLowerCase();
  const hasSkillSignal = jobSkills.some((s) => lower.includes(s.toLowerCase())) || /[a-z]{2,}(?:\.js|sql|sap|excel|python|aws)/i.test(text);
  const weakOpener = WEAK_START.test(text.trim());

  let score = 35;
  if (hasActionVerb) score += 25;
  if (hasMetric) score += 25;
  if (hasSkillSignal) score += 15;
  if (weakOpener) score -= 20;
  if (text.length > 220) score -= 10;
  if (text.length < 40) score -= 15;
  score = Math.max(0, Math.min(100, score));

  const tips: string[] = [];
  if (!hasActionVerb) tips.push("Empieza con verbo de acción (Lideré, Implementé, Reduje…).");
  if (!hasMetric) tips.push("Añade una métrica (%, tiempo, dinero, personas, alcance).");
  if (!hasSkillSignal && jobSkills.length) tips.push("Incluye un skill/herramienta de la oferta si es verdad.");
  if (weakOpener) tips.push("Evita abridores débiles (“responsable de…”); di el logro.");
  if (!tips.length) tips.push("Viñeta sólida: mantén verbo + contexto + resultado.");

  return { text, score, hasActionVerb, hasMetric, hasSkillSignal, weakOpener, tips };
}

export function analyzeBullets(cvText: string, jobSkills: string[] = []) {
  const bullets = extractBullets(cvText).map((b) => scoreBullet(b, jobSkills));
  bullets.sort((a, b) => a.score - b.score);
  const avg = bullets.length
    ? Math.round(bullets.reduce((s, b) => s + b.score, 0) / bullets.length)
    : 0;
  return {
    avgScore: avg,
    weakest: bullets.slice(0, 5),
    strongest: [...bullets].sort((a, b) => b.score - a.score).slice(0, 3),
    total: bullets.length,
  };
}
