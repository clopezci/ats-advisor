/** Extrae posibles preguntas de screening de una oferta y arma prompts de respuesta. */

export function extractScreeningQuestions(jobText: string): string[] {
  const lines = jobText.split("\n").map((l) => l.trim()).filter(Boolean);
  const qs: string[] = [];
  for (const line of lines) {
    if (/\?$/.test(line) && line.length > 15 && line.length < 200) qs.push(line);
    if (/^(¿|tiene|cuentas|dispones|hablas|eres|puedes|autorizaci|visa|salario|pretensi)/i.test(line) && line.length < 180) {
      if (!qs.includes(line)) qs.push(line.endsWith("?") ? line : `${line}?`);
    }
  }
  // Preguntas típicas LATAM si la oferta no trae ninguna
  if (qs.length < 2) {
    qs.push(
      "¿Cumples con los años de experiencia requeridos?",
      "¿Cuál es tu pretensión salarial (COP o moneda local)?",
      "¿Modalidad: presencial, híbrido o remoto? ¿En qué ciudad?",
      "¿Nivel de inglés (A2/B1/B2/C1) y evidencia?",
      "¿Disponibilidad para empezar?"
    );
  }
  return [...new Set(qs)].slice(0, 12);
}

export function buildScreeningPrompt(opts: {
  questions: string[];
  cvText: string;
  jobText: string;
}): string {
  return [
    "Eres coach de postulaciones LATAM. Responde cada pregunta de screening en español claro.",
    "REGLAS: no inventes experiencia, títulos, salarios falsos ni visas. Si el CV no soporta la respuesta, di qué falta o cómo responder con honestidad.",
    "Formato: para cada pregunta → Respuesta corta (1–3 frases) + Nota (si aplica).",
    "",
    "PREGUNTAS:",
    ...opts.questions.map((q, i) => `${i + 1}. ${q}`),
    "",
    `CV:\n${opts.cvText.slice(0, 3500)}`,
    "",
    `OFERTA:\n${opts.jobText.slice(0, 2000)}`,
  ].join("\n");
}
