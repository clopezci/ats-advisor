import type { AtsProfile } from "@/lib/ats/engine";

/** Cómo filtran los ATS reales — base de coaching (investigación 2025–2026). */
export const ATS_HOW_THEY_FILTER: Record<AtsProfile, string[]> = {
  generic: [
    "La mayoría de portales: 1) parsean el archivo a campos, 2) cruzan keywords/skills vs la vacante, 3) rankean y muestran a reclutadores solo los mejor puntuados.",
    "Hoy conviven keywords literales (Taleo legacy) + semántica/NLP (Workday) + revisión humana (Greenhouse).",
    "La estrategia segura: keywords exactas de la oferta dentro de viñetas de logros reales, formato 1 columna, sin inventar experiencia.",
  ],
  workday: [
    "Workday usa parse semántico: entiende contexto (“lideré 12 personas” ≈ liderazgo), pero sigue favoreciendo términos de la vacante.",
    "Castiga fuerte: columnas, encabezados en imagen, tablas y PDF escaneado sin texto.",
    "Prioriza títulos de cargo alineados y fechas consistentes (MM/AAAA).",
  ],
  greenhouse: [
    "Greenhouse parsea bien CV limpios; el filtro fuerte suele ser el scorecard humano del reclutador, no solo keywords.",
    "Aun así: skills y logros deben ser legibles en texto plano.",
    "Enfócate en evidencias medibles que un humano marque en el scorecard.",
  ],
  taleo: [
    "Taleo (legacy) es más literal: densidad y coincidencia exacta de keywords pesan mucho.",
    "Sinónimos ayudan poco: si pide “gestión de proyectos”, escríbelo así (no solo “PM”).",
    "DOCX o PDF texto; secciones estándar (Experiencia, Educación, Skills).",
  ],
  successfactors: [
    "SuccessFactors/SAP: parsers estrictos; evita tablas anidadas y diseños creativos.",
    "Sé literal con títulos de cargo y requisitos técnicos de la oferta.",
    "Un CV limpio supera a uno “bonito” que el parser destroza.",
  ],
  lever: [
    "Lever prioriza parse limpio y ranking por relevancia; keywords en contexto de experiencia cuentan más que un listado vacío.",
    "Una columna + skills reales + logros cuantificados.",
  ],
  sap: [
    "ATS SAP: formato simple, títulos literales, sin gráficos que reemplacen texto.",
    "Incluye términos ERP/módulo si la oferta los nombra (FI, CO, MM, etc.).",
  ],
};

export const APPLICATION_PLAYBOOK_BASE = [
  "Lee la oferta 2 veces: marca must-have (si no los cumples, no inventes; decide si postulas o no).",
  "Adapta el CV a ESTA vacante (no envíes el mismo PDF a 50 avisos distintos).",
  "Pon las 6–10 keywords críticas en Experiencia y Skills, en frases de logro, no en un párrafo de relleno.",
  "Usa el mismo lenguaje del aviso (español LATAM / términos del empleador).",
  "Archivo: PDF con texto seleccionable o DOCX; nombre apellido_cargo_empresa.pdf.",
  "Completa TODOS los campos del formulario del portal (muchos ATS rankean también el formulario, no solo el adjunto).",
  "Carta/mensaje corto (4–6 líneas): por qué tú + 1 logro relevante + disponibilidad.",
  "Si hay LinkedIn, alinea título y skills top con la vacante.",
  "Postula en los primeros días del aviso cuando sea posible.",
  "Tras postular: registra en tracker, prepara historias STAR de los requisitos clave.",
];

export const DISCLAIMER_CV_REWRITE =
  "Esto es un apoyo de redacción basado en cómo filtran los ATS y en tu texto actual. " +
  "NO inventa experiencia. Debes revisar cada frase y ajustar según lo que realmente hiciste. " +
  "Tú eres responsable de la veracidad de tu hoja de vida.";

export function buildNextSteps(opts: {
  score: number;
  exclusiveGaps: string[];
  missingMust: string[];
  formatAlerts: string[];
  hasMetrics: boolean;
}): string[] {
  const steps: string[] = [];
  if (opts.exclusiveGaps.length) {
    steps.push("1) Resuelve o declara con honestidad los requisitos excluyentes antes de optimizar keywords.");
  }
  if (opts.missingMust.length) {
    steps.push(
      `2) Integra en logros reales (si los tienes): ${opts.missingMust.slice(0, 6).join(", ")}.`
    );
  }
  if (opts.formatAlerts.length) {
    steps.push("3) Corrige formato ATS (1 columna, sin tablas/íconos que reemplacen texto).");
  }
  if (!opts.hasMetrics) {
    steps.push("4) Cuantifica 3–5 logros (%, $ COP, tiempo, personas, alcance).");
  }
  if (opts.score < 70) {
    steps.push("5) Reescribe el resumen profesional apuntando al cargo de la oferta.");
  } else {
    steps.push("5) Estás cerca del umbral típico de surfacing (~70%+): pulida final y postula.");
  }
  steps.push("6) Usa “Ajustar hoja de vida” solo para tejer keywords con verdad; luego “Buena postulación”.");
  return steps;
}

export function humanRecruiterTips(): string[] {
  return [
    "Tras el ATS, un humano hojea ~6–10 segundos: primeras viñetas deben gritar impacto.",
    "Prefiere verbos de acción + resultado (“reduje tiempo de cierre 30%”) vs listas de tareas.",
    "Evita clichés vacíos (“proactivo, dinámico”) sin prueba en un logro.",
    "Si cambias de industria, conecta transferibles con el vocabulario de la vacante.",
  ];
}
