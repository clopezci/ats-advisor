import { BLOQUES_PERFIL, PARES_CALIBRACION, textoPregunta } from "@/lib/psicotecnicas/cuestionario";

export type PerfilAnswers = Record<string, string>;

const KEY = "ats_psico_perfil_v1";
const HIST_KEY = "ats_psico_simulacros_v1";

export type SimulacroGuardado = {
  at: string;
  modo: "simulacro" | "aprendizaje" | "aleatorio";
  pregunta: string;
  respuesta: string;
  porque: string;
  tipo: string;
  fallo: boolean;
};

export function loadPerfil(): PerfilAnswers {
  if (typeof window === "undefined") return {};
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw || typeof raw !== "object") return {};
    const out: PerfilAnswers = {};
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, 1200);
    }
    return out;
  } catch {
    return {};
  }
}

export function savePerfil(answers: PerfilAnswers) {
  const slim: PerfilAnswers = {};
  for (const [k, v] of Object.entries(answers)) {
    const t = v.trim();
    if (t) slim[k] = t.slice(0, 1200);
  }
  localStorage.setItem(KEY, JSON.stringify(slim));
  return slim;
}

export function perfilLleno(answers: PerfilAnswers): number {
  return Object.values(answers).filter((v) => v.trim().length > 1).length;
}

export function perfilListo(answers: PerfilAnswers): boolean {
  return perfilLleno(answers) >= 15;
}

function linea(answers: PerfilAnswers, id: string): string {
  return (answers[id] || "").trim();
}

function bloqueTexto(answers: PerfilAnswers, bloqueId: string): string {
  const bloque = BLOQUES_PERFIL.find((b) => b.id === bloqueId);
  if (!bloque) return "";
  return bloque.preguntas
    .map((p) => {
      const v = linea(answers, p.id);
      if (!v) return "";
      return `- ${p.texto} ${v}`;
    })
    .filter(Boolean)
    .join("\n");
}

/** Una página de coherencia. La práctica la consulta en cada pregunta. No inventa rasgos. */
export function buildPersonalidadMd(answers: PerfilAnswers): string {
  const nombre = linea(answers, "trayectoria-1") || "la persona";
  const jerarquia = PARES_CALIBRACION.map((p) => {
    const side = linea(answers, p.id);
    if (side !== "A" && side !== "B") return "";
    const gana = side === "A" ? p.a : p.b;
    return `- Pesa más: ${gana} (frente a ${side === "A" ? p.b : p.a})`;
  })
    .filter(Boolean)
    .join("\n");
  const historia = linea(answers, "historia");
  const parts = [
    `# Perfil de ${nombre}`,
    "Este texto sale solo de lo que la persona declaró. No se agregan virtudes.",
    "## Identidad profesional",
    bloqueTexto(answers, "trayectoria") || "- Sin trayectoria declarada.",
    "## Estilo de liderazgo",
    bloqueTexto(answers, "liderazgo") || "- Sin estilo declarado.",
    "## Valores centrales",
    bloqueTexto(answers, "valores") || "- Sin valores declarados.",
    "## Jerarquía de decisión",
    jerarquia || "- Sin desempates marcados.",
    "## Decisiones y riesgo",
    bloqueTexto(answers, "decisiones") || "- Sin datos.",
    "## Conflicto, presión y errores",
    bloqueTexto(answers, "conflicto") || "- Sin datos.",
    "## Comunicación",
    bloqueTexto(answers, "comunicacion") || "- Sin datos.",
    "## Disciplina",
    bloqueTexto(answers, "disciplina") || "- Sin datos.",
    "## Motivadores",
    bloqueTexto(answers, "motivadores") || "- Sin datos.",
    "## Puntos de tensión conocidos",
    bloqueTexto(answers, "autoconciencia") || "- Sin debilidades declaradas.",
    "## Límites y balance",
    bloqueTexto(answers, "balance") || "- Sin datos.",
    "## Propósito",
    bloqueTexto(answers, "futuro") || "- Sin datos.",
    "## Historia de toque",
    historia || "- Sin relato.",
    "## Vacante activa",
    bloqueTexto(answers, "vacante") || "- Sin vacante cargada.",
    "## Criterio al responder",
    "1. Descartar opciones que contradigan un valor o una conducta ya declarada.",
    "2. Entre las restantes, usar la jerarquía de decisión.",
    "3. Si siguen empatadas, preferir entender antes de actuar y construir con otros solo si el perfil lo dice.",
    "4. En numérico, abstracto o verbal, la respuesta es la correcta del ejercicio, no una preferencia.",
    "5. Una sola línea de porqué. Sin saludo.",
  ];
  return parts.join("\n\n").slice(0, 14000);
}

export function loadSimulacros(): SimulacroGuardado[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(HIST_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.slice(-200) as SimulacroGuardado[];
  } catch {
    return [];
  }
}

export function saveSimulacro(row: SimulacroGuardado) {
  const all = loadSimulacros();
  all.push(row);
  const slim = all.slice(-200);
  localStorage.setItem(HIST_KEY, JSON.stringify(slim));
  return slim;
}

export function resumenFallos(rows: SimulacroGuardado[]): { tipo: string; n: number }[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    if (!row.fallo || (row.modo !== "aprendizaje" && row.modo !== "aleatorio")) continue;
    const tipo = (row.tipo || "otro").trim().toLowerCase() || "otro";
    map.set(tipo, (map.get(tipo) || 0) + 1);
  }
  return [...map.entries()]
    .map(([tipo, n]) => ({ tipo, n }))
    .sort((a, b) => b.n - a.n);
}

export function etiquetaPregunta(id: string): string {
  return textoPregunta(id);
}
