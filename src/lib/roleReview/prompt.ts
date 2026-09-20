import type { RoleReviewLearnTopic, RoleReviewMode, RoleReviewPlan } from "@/lib/roleReview/types";

export function buildRoleReviewPrompt(opts: {
  mode: RoleReviewMode;
  minutesPerDay: number;
  jobTitle: string;
  company: string;
  jobText: string;
  learnTopics: RoleReviewLearnTopic[];
  knownStrengths: string[];
}): string {
  const toLearn = opts.learnTopics.filter((t) => t.optIn).map((t) => t.term);
  const known = opts.knownStrengths.slice(0, 12);

  return [
    "Eres un tutor de oficio (LATAM). Armas un plan de REPASO DEL ROL anclado a UNA vacante.",
    "Objetivo: que alguien en búsqueda de empleo no se enfríe y practique el trabajo real del aviso.",
    "",
    "Devuelve SOLO JSON válido con esta forma exacta:",
    JSON.stringify({
      title: "string",
      objective: "string",
      days: [
        {
          day: 1,
          title: "string",
          learnTopics: ["string"],
          explain: "qué es + para qué (corto)",
          realWorld: "cómo se vive en una empresa real",
          practices: ["buena práctica 1", "anti-patrón"],
          interviewQ: "pregunta de entrevista",
          doneWhen: ["criterio 1", "criterio 2"],
          challengeId: "ch1",
        },
      ],
      challenges: [
        {
          id: "ch1",
          day: 1,
          title: "string",
          brief: "pedido como de un jefe",
          jdAnchor: "frase corta del aviso",
          steps: ["paso 1", "paso 2"],
          deliverable: "qué debe producir",
          timeMin: 30,
          pitfalls: ["error común"],
        },
      ],
    }),
    "",
    `Modo: ${opts.mode}`,
    `Minutos/día objetivo: ${opts.minutesPerDay}`,
    `Cargo: ${opts.jobTitle || "N/D"} · Empresa: ${opts.company || "N/D"}`,
    `Fortalezas ya detectadas en CV (no reinventarlas como si faltaran): ${known.join(", ") || "N/D"}`,
    `Temas que el usuario MARCÓ para APRENDER (obligatorio incluirlos en el plan): ${toLearn.join(", ") || "(ninguno extra)"}`,
    "",
    "Oferta (texto):",
    opts.jobText.slice(0, 4500),
    "",
    "Reglas:",
    "- 5 a 7 días (no más).",
    "- Cada día tiene UN reto (challenge) ligado (mismo challengeId).",
    "- Los temas opt-in DEBEN aparecer en learnTopics de al menos un día.",
    "- Retos = trabajo diario real (ticket, update a jefe, análisis, checklist operativo). No teoría abstracta.",
    "- Español LATAM, frases cortas, sin relleno ni clichés de LinkedIn.",
    "- No inventes que el usuario ya tiene experiencia en los temas opt-in.",
    "- Cada jdAnchor debe parecerse a algo del aviso.",
    "- Solo JSON.",
  ].join("\n");
}

/** Fallback local si la IA falla: plan mínimo usable. */
export function buildFallbackRoleReviewPlan(opts: {
  mode: RoleReviewMode;
  jobTitle: string;
  learnTopics: RoleReviewLearnTopic[];
  jobText: string;
}): Omit<RoleReviewPlan, "id" | "createdAt" | "updatedAt" | "completedDays" | "completedChallenges" | "jobId"> {
  const topics = opts.learnTopics.filter((t) => t.optIn).map((t) => t.term);
  const seed = topics.length ? topics : ["responsabilidades del rol", "herramientas del aviso", "comunicación con el equipo"];
  const days = seed.slice(0, 5).map((term, i) => {
    const day = i + 1;
    const challengeId = `ch${day}`;
    return {
      day,
      title: `Práctica: ${term}`,
      learnTopics: [term],
      explain: `Hoy refuerzas “${term}” porque aparece (o lo elegiste) para esta vacante. Entiende qué es y para qué lo usa el equipo.`,
      realWorld: `En una empresa, “${term}” suele verse en el día a día del cargo ${opts.jobTitle || "objetivo"}: reuniones cortas, entregables y seguimiento.`,
      practices: ["Hazlo concreto con un ejemplo tuyo o un ejercicio", "Evita decir que lo dominas si aún lo estás aprendiendo"],
      interviewQ: `Cuéntame cómo aplicarías ${term} en las primeras semanas del rol.`,
      doneWhen: [`Puedes explicar ${term} en 1 minuto`, "Completaste el reto del día"],
      challengeId,
    };
  });

  const challenges = days.map((d) => ({
    id: d.challengeId,
    day: d.day,
    title: `Reto del día: ${d.learnTopics[0]}`,
    brief: `Como si tu jefe te pidiera avanzar hoy en “${d.learnTopics[0]}” sin reunión eterna.`,
    jdAnchor: (opts.jobText || "").slice(0, 120).replace(/\s+/g, " ").trim() || "Requisito del aviso",
    steps: [
      "Lee 10 minutos de referencia seria (docs oficiales o guía práctica)",
      "Haz un entregable mínimo (nota, checklist o ejemplo)",
      "Escribe 5 líneas: qué harías el lunes en el trabajo con esto",
    ],
    deliverable: `Una nota de media página o checklist sobre ${d.learnTopics[0]}`,
    timeMin: 30,
    pitfalls: ["Solo leer sin producir nada", "Copiar jerga sin entender el para qué"],
  }));

  return {
    title: `Repaso: ${opts.jobTitle || "vacante"}`,
    objective: "Mantener músculo del rol con práctica diaria anclada al aviso.",
    mode: opts.mode,
    learnTopics: opts.learnTopics,
    days,
    challenges,
  };
}
