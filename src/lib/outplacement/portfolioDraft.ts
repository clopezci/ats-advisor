/**
 * Genera borrador de caso / portfolio a partir de un logro STAR.
 */

export type PortfolioDraft = {
  title: string;
  linkedinPost: string;
  caseOnePager: string;
  bulletCv: string;
};

export function buildPortfolioDraft(input: {
  role: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  skills: string;
}): PortfolioDraft {
  const role = input.role.trim() || "Profesional";
  const s = input.situation.trim();
  const t = input.task.trim();
  const a = input.action.trim();
  const r = input.result.trim();
  const skills = input.skills.trim();

  const title = `${role}: ${r.slice(0, 60) || "caso de impacto"}`;
  const linkedinPost = [
    `Cómo resolví un reto como ${role}:`,
    ``,
    `Contexto: ${s}`,
    `Mi responsabilidad: ${t}`,
    `Qué hice: ${a}`,
    `Resultado: ${r}`,
    skills ? `Skills: ${skills}` : "",
    ``,
    `#empleo #carreralatam #ATSAdvisor`,
  ]
    .filter(Boolean)
    .join("\n");

  const caseOnePager = [
    `CASO — ${title}`,
    ``,
    `1. Situación`,
    s,
    ``,
    `2. Objetivo / tarea`,
    t,
    ``,
    `3. Acciones`,
    a,
    ``,
    `4. Resultado medible`,
    r,
    ``,
    skills ? `5. Competencias demostradas\n${skills}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const bulletCv = `• ${a.slice(0, 120)}${a.length > 120 ? "…" : ""} → ${r.slice(0, 80)}`;

  return { title, linkedinPost, caseOnePager, bulletCv };
}
