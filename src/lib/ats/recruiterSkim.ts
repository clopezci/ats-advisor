/** Modo “ojo del reclutador”: qué ve en ~8 segundos. */

export type RecruiterSkim = {
  seconds: number;
  firstGlance: string[];
  redFlags: string[];
  greenFlags: string[];
  verdict: string;
  fixNow: string[];
};

export function recruiterSkim(cvText: string, jobTitleHint?: string): RecruiterSkim {
  const lines = cvText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const head = lines.slice(0, 12).join("\n");
  const firstGlance: string[] = [];
  const redFlags: string[] = [];
  const greenFlags: string[] = [];
  const fixNow: string[] = [];

  const name = lines[0]?.slice(0, 60) || "";
  if (name && name.length < 40 && !/@/.test(name)) {
    firstGlance.push(`Nombre / título visible: “${name}”`);
    greenFlags.push("Encabezado con identidad clara");
  } else {
    redFlags.push("No se ve un nombre claro en la primera línea");
    fixNow.push("Pon tu nombre completo en la primera línea, sin diseño raro.");
  }

  if (/@|linkedin\.com|tel|celular|\+\d/i.test(head)) greenFlags.push("Contacto visible arriba");
  else {
    redFlags.push("Contacto no aparece en los primeros renglones");
    fixNow.push("Email + LinkedIn + celular en el encabezado.");
  }

  if (/\d+\s*%|\d+\s*(personas|usuarios|clientes)|\$\s*\d+/i.test(head)) {
    greenFlags.push("Hay métricas tempranas (el reclutador las busca en 8s)");
  } else {
    redFlags.push("Sin números en la zona alta del CV");
    fixNow.push("Mueve 1–2 logros con %/$/personas a las primeras viñetas.");
  }

  if (jobTitleHint && !new RegExp(jobTitleHint.slice(0, 20), "i").test(head)) {
    redFlags.push("El cargo objetivo de la vacante no aparece arriba");
    fixNow.push(`Incluye “${jobTitleHint.slice(0, 40)}” (o equivalente) en resumen o título profesional.`);
  }

  if (cvText.length > 9000) {
    redFlags.push("CV muy largo para un skim rápido");
    fixNow.push("Recorta a 1–2 páginas enfocadas a esta vacante.");
  }

  if (/tabla|\t\t|\|/i.test(cvText.slice(0, 500))) {
    redFlags.push("Posible diseño multi-columna (malo para parse y para el ojo)");
  }

  const score = Math.max(0, 70 + greenFlags.length * 8 - redFlags.length * 12);
  const verdict =
    score >= 70
      ? "En 8 segundos pasas el filtro visual: el reclutador probablemente sigue leyendo."
      : score >= 45
        ? "Skim intermedio: hay señales, pero algo frena en la primera pantalla."
        : "Riesgo alto de descarte en 8 segundos. Arregla primero el encabezado y métricas.";

  firstGlance.push(...greenFlags.slice(0, 2), ...redFlags.slice(0, 2));

  return {
    seconds: 8,
    firstGlance: firstGlance.slice(0, 6),
    redFlags,
    greenFlags,
    verdict,
    fixNow: fixNow.slice(0, 5),
  };
}
