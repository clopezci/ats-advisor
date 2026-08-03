/** Preguntas típicas de filtro telefónico LATAM + score heurístico offline. */

export type FiltroQ = { q: string; tip: string };

export const FILTRO_BANK: FiltroQ[] = [
  {
    q: "Cuéntame brevemente tu experiencia relevante para este rol.",
    tip: "Buscan claridad en 60–90 s: rol actual, años, 1 logro.",
  },
  {
    q: "¿Cuál es tu expectativa salarial y disponibilidad para empezar?",
    tip: "Piso/meta/techo + aviso de preaviso. Sin inventar.",
  },
  {
    q: "¿Por qué quieres este rol / esta empresa ahora?",
    tip: "Encaje con 2 requisitos de la oferta + motivación real.",
  },
  {
    q: "¿Tienes experiencia con [skill clave de la oferta]?",
    tip: "Ejemplo concreto STAR corto; si no, honestidad + transferible.",
  },
  {
    q: "¿Estás en proceso con otras empresas?",
    tip: "Transparencia sin presión; muestra tracción ligera.",
  },
];

export function pickFiltroQuestions(jobText: string, n = 3): FiltroQ[] {
  const job = jobText.toLowerCase();
  const skillMatch = job.match(
    /\b(excel|sap|python|sql|power\s*bi|react|java|aws|ingl[eé]s|liderazgo|tesorer[ií]a|ventas)\b/i
  );
  const skill = skillMatch?.[0] || "la skill principal de la oferta";
  const customized: FiltroQ[] = [
    FILTRO_BANK[0],
    {
      q: `¿Tienes experiencia práctica con ${skill}? Dame un ejemplo reciente.`,
      tip: FILTRO_BANK[3].tip,
    },
    FILTRO_BANK[1],
    FILTRO_BANK[2],
    FILTRO_BANK[4],
  ];
  return customized.slice(0, n);
}

export function scoreFiltroAnswers(answers: string[]): {
  score: number;
  verdict: string;
  improve: string[];
} {
  const improve: string[] = [];
  let pts = 20;
  for (const a of answers) {
    const t = a.trim();
    if (t.length < 40) {
      improve.push("Respuesta demasiado corta para un filtro: apunta a 45–90 segundos hablados.");
      pts += 5;
      continue;
    }
    pts += 18;
    if (/\d+\s*%|\d+\s*(a[nñ]os|personas|meses)|\$\s*\d+/i.test(t)) pts += 8;
    else improve.push("Agrega al menos un número (años, %, personas, $).");
    if (/\b(yo|mi|lider[eé]|implement|coordin|mejor)\w*/i.test(t)) pts += 5;
    if (t.length > 700) {
      improve.push("Acorta: el filtro telefónico castiga monólogos.");
      pts -= 5;
    }
  }
  const score = Math.max(5, Math.min(98, Math.round(pts)));
  const verdict =
    score >= 75
      ? "Alta probabilidad de pasar a entrevista formal si el tono es claro."
      : score >= 55
        ? "Pasas con riesgo: refuerza métricas y concisión."
        : "Riesgo alto de descarte en filtro. Reescribe con STAR corto.";
  return { score, verdict, improve: improve.slice(0, 4) };
}
