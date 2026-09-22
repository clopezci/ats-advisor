/** Carta / mensaje de postulación usable sin IA (plantilla fiel al CV). */

export function buildLocalCoverLetter(opts: {
  cvText: string;
  jobText: string;
  matched: string[];
  missing: string[];
  companyHint?: string;
}): string {
  const cv = opts.cvText || "";
  const job = opts.jobText || "";

  const nameLine =
    cv
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.length > 5 && l.length < 60 && !/@/.test(l) && !/perfil|experiencia|linkedin/i.test(l)) ||
    "Candidato/a";

  const roleMatch = job.match(
    /(?:gerente|director|l[ií]der|analista|ingenier[oa]|desarrollador|coordinador)[^\n.]{0,60}/i
  );
  const role = (roleMatch?.[0] || "la vacante").replace(/\s+/g, " ").trim().slice(0, 80);

  const company =
    opts.companyHint ||
    (job.match(/(?:compa[nñ][ií]a|empresa|cliente)[^\n,]{0,40}/i)?.[0] || "").slice(0, 60) ||
    "su organización";

  const strengths = (opts.matched || []).filter(Boolean).slice(0, 5);
  const gaps = (opts.missing || []).filter(Boolean).slice(0, 3);

  // Un logro con número si existe en el CV
  const metricLine =
    cv
      .split("\n")
      .map((l) => l.replace(/^[-•●*]\s*/, "").trim())
      .find((l) => l.length > 40 && l.length < 180 && /\d/.test(l)) ||
    cv
      .split("\n")
      .map((l) => l.replace(/^[-•●*]\s*/, "").trim())
      .find((l) => l.length > 50 && /lider|gestion|equipo|operacion|transform/i.test(l)) ||
    "";

  const strengthPhrase = strengths.length
    ? `En mi trayectoria destaco: ${strengths.join(", ")}.`
    : "Mi trayectoria combina liderazgo de operaciones TI y transformación digital.";

  const honestGap = gaps.length
    ? ` Sobre ${gaps.slice(0, 2).join(" y ")}: si aplica a su proceso, con gusto profundizo en entrevista con evidencia concreta (sin inventar dominio).`
    : "";

  return [
    `Estimado equipo de selección / ${company},`,
    "",
    `Me postulo al rol de ${role}. ${strengthPhrase}`,
    "",
    metricLine
      ? `Un ejemplo reciente de mi trabajo: ${metricLine.replace(/\s+/g, " ").trim()}`
      : "He liderado equipos multidisciplinarios y operaciones de alta exigencia, con foco en eficiencia, continuidad y resultados medibles.",
    "",
    `Estoy disponible para conversar sobre el encaje con ${role} y aportar desde el día uno con honestidad sobre lo que ya domino y lo que aprendería en el cargo.${honestGap}`,
    "",
    "Quedo atento/a a una conversación.",
    "",
    "Saludos cordiales,",
    nameLine,
    "",
    "(Borrador local — revísalo y ajústalo con tus datos reales antes de enviar.)",
  ].join("\n");
}

export function isFakeCoverLetter(text: string): boolean {
  const t = (text || "").trim();
  if (!t) return true;
  if (/checklist de buena postulaci[oó]n|sin claves ia|modo local\)|eres coach de postulaciones/i.test(t)) {
    return true;
  }
  if (/contexto:\s*eres /i.test(t)) return true;
  // Muy corto o solo tips
  if (t.length < 120) return true;
  if (!/estimad|hola|postul|saludos|quedo|atento/i.test(t) && /1\)|2\)|3\)/.test(t)) return true;
  return false;
}
