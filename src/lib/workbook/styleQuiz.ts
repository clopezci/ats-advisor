/** Instrumento propio: estilo de comunicación en búsqueda (no MBTI/DISC de terceros). */

export const STYLE_QUESTIONS: {
  id: string;
  q: string;
  options: { id: string; label: string; trait: string }[];
}[] = [
  {
    id: "q1",
    q: "En un café de networking de 20 min, sueles…",
    options: [
      { id: "a", label: "Llegar con agenda y 2 preguntas", trait: "estructurado" },
      { id: "b", label: "Conectar primero; la agenda surge", trait: "relacional" },
      { id: "c", label: "Contar un caso concreto tuyo", trait: "evidencia" },
      { id: "d", label: "Explorar ideas y posibilidades", trait: "explorador" },
    ],
  },
  {
    id: "q2",
    q: "Ante un silencio incómodo en entrevista…",
    options: [
      { id: "a", label: "Resumes y confirmas el siguiente tema", trait: "estructurado" },
      { id: "b", label: "Preguntas cómo se siente el proceso", trait: "relacional" },
      { id: "c", label: "Aportas un dato o ejemplo extra", trait: "evidencia" },
      { id: "d", label: "Propones otra forma de abordar la pregunta", trait: "explorador" },
    ],
  },
  {
    id: "q3",
    q: "Tu mensaje de LinkedIn suele ser…",
    options: [
      { id: "a", label: "Corto, con CTA claro", trait: "estructurado" },
      { id: "b", label: "Cálido, con contexto personal", trait: "relacional" },
      { id: "c", label: "Con un logro medible al inicio", trait: "evidencia" },
      { id: "d", label: "Curioso, con hipótesis de valor", trait: "explorador" },
    ],
  },
  {
    id: "q4",
    q: "Cuando te piden pretensión salarial…",
    options: [
      { id: "a", label: "Das rango con piso/meta preparados", trait: "estructurado" },
      { id: "b", label: "Preguntas el rango de la empresa primero", trait: "relacional" },
      { id: "c", label: "Anclas a banda de mercado con fuente", trait: "evidencia" },
      { id: "d", label: "Hablas de paquete total y trade-offs", trait: "explorador" },
    ],
  },
];

export function summarizeStyle(answers: Record<string, string>): string {
  const counts: Record<string, number> = {};
  for (const q of STYLE_QUESTIONS) {
    const optId = answers[q.id];
    const opt = q.options.find((o) => o.id === optId);
    if (opt) counts[opt.trait] = (counts[opt.trait] || 0) + 1;
  }
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!ranked.length) return "";
  const [top, second] = ranked;
  const tips: Record<string, string> = {
    estructurado: "Tu fuerza: claridad y ritmo. Cuidado: no suenes rígido; deja 1 pregunta abierta.",
    relacional: "Tu fuerza: rapport. Cuidado: ancla cada charla a un favor concreto y fecha.",
    evidencia: "Tu fuerza: credibilidad. Cuidado: no bombardees números; elige 1 por historia.",
    explorador: "Tu fuerza: creatividad. Cuidado: cierra con un next step medible.",
  };
  return [
    `Estilo dominante: ${top[0]}${second ? ` (+ ${second[0]})` : ""}.`,
    tips[top[0]] || "",
  ]
    .filter(Boolean)
    .join(" ");
}
