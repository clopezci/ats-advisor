import type {
  RoleReviewFamily,
  RoleReviewLearnTopic,
  RoleReviewMode,
  RoleReviewPlan,
  RoleReviewStarPrompt,
} from "@/lib/roleReview/types";
import { detectRoleFamily, seedTicketsForFamily, seedWeek1Checklist } from "@/lib/roleReview/templates";

/** Ancla el reto a un requisito, no al párrafo de “estamos buscando”. */
export function jdAnchorFromJob(jobText: string): string {
  const t = (jobText || "").replace(/\s+/g, " ").trim();
  const must = t.match(
    /(?:qu[eé]\s+experiencia\s+debes\s+tener|requisitos?(?:\s+obligatorios)?|imprescindible)[:\s?.]*([\s\S]{30,220})/i
  );
  const slice = (must?.[1] || t).replace(/^[\s🔑⭐💼💰🏥📄🏢📩🚀]+/, "").trim();
  const clean = slice.replace(/estamos buscando|nuestro cliente|qu[eé] te ofrecemos|salario/gi, "").trim();
  return (clean || t).slice(0, 140);
}

export function isUsableRolePlan(plan: { days?: unknown[]; challenges?: unknown[] } | null): boolean {
  if (!plan || !Array.isArray(plan.days) || plan.days.length < 1) return false;
  if (!Array.isArray(plan.challenges) || plan.challenges.length < 1) return false;
  const blob = JSON.stringify(plan);
  if (/ATS_LOCAL_|eres un tutor de oficio|devuelve solo json|system prompt/i.test(blob)) return false;
  return plan.days.every((d) => {
    if (!d || typeof d !== "object") return false;
    const row = d as { title?: string; explain?: string };
    return (row.title || "").trim().length > 3 && (row.explain || "").trim().length > 20;
  });
}

export function buildRoleReviewPrompt(opts: {
  mode: RoleReviewMode;
  minutesPerDay: number;
  jobTitle: string;
  company: string;
  jobText: string;
  learnTopics: RoleReviewLearnTopic[];
  knownStrengths: string[];
  roleFamily?: RoleReviewFamily;
  maxDays?: number;
}): string {
  const toLearn = opts.learnTopics.filter((t) => t.optIn).map((t) => t.term);
  const known = opts.knownStrengths.slice(0, 12);
  const family = opts.roleFamily || detectRoleFamily(opts.jobTitle, opts.jobText);
  const maxDays = Math.min(7, Math.max(3, opts.maxDays || 7));

  return [
    "Eres un tutor de oficio (LATAM). Armas un plan de REPASO DEL ROL anclado a UNA vacante.",
    "Objetivo: que alguien en búsqueda de empleo no se enfríe y practique el trabajo real del aviso.",
    "",
    "Devuelve SOLO JSON válido con esta forma exacta:",
    JSON.stringify({
      title: "string",
      objective: "string",
      roleFamily: family,
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
          ticketId: "tk1",
          starId: "st1",
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
      tickets: [
        {
          id: "tk1",
          day: 1,
          title: "string",
          priority: "P1",
          type: "task",
          description: "como ticket de Jira",
          acceptance: ["criterio 1"],
          jdAnchor: "frase del aviso",
          timeMin: 25,
        },
      ],
      starBank: [
        {
          id: "st1",
          day: 1,
          question: "pregunta STAR ligada al aviso",
          hint: "qué evidenciar sin inventar",
          jdAnchor: "frase del aviso",
        },
      ],
      week1Checklist: [
        {
          id: "w1",
          dayHint: "Día 1",
          title: "string",
          why: "por qué importa",
        },
      ],
    }),
    "",
    `Modo: ${opts.mode}`,
    `Familia de rol: ${family}`,
    `Días del plan (exacto): ${maxDays}`,
    `Minutos/día objetivo: ${opts.minutesPerDay}`,
    `Cargo: ${opts.jobTitle || "N/D"} · Empresa: ${opts.company || "N/D"}`,
    `Fortalezas ya detectadas en CV (no reinventarlas como si faltaran): ${known.join(", ") || "N/D"}`,
    `Temas que el usuario MARCÓ para APRENDER (obligatorio incluirlos en el plan): ${toLearn.join(", ") || "(ninguno extra)"}`,
    "",
    "Oferta (texto):",
    opts.jobText.slice(0, 4500),
    "",
    "Reglas:",
    `- Exactamente ${maxDays} días (ni más ni menos).`,
    "- Cada día tiene UN reto (challenge) y UN ticket ligados.",
    "- starBank: 1 pregunta STAR por día (plantilla vacía; el usuario pone SU verdad).",
    "- week1Checklist: 5–7 ítems de primera semana (más detallado si modo=dia1).",
    "- Los temas opt-in DEBEN aparecer en learnTopics de al menos un día.",
    "- Retos y tickets = trabajo diario real. No teoría abstracta.",
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
  roleFamily?: RoleReviewFamily;
  maxDays?: number;
}): Omit<
  RoleReviewPlan,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "completedDays"
  | "completedChallenges"
  | "completedTickets"
  | "completedWeek1"
  | "starAnswers"
  | "jobId"
> {
  const topics = opts.learnTopics.filter((t) => t.optIn).map((t) => t.term);
  const seed = topics.length
    ? topics
    : ["responsabilidades del rol", "herramientas del aviso", "comunicación con el equipo"];
  const family = opts.roleFamily || detectRoleFamily(opts.jobTitle, opts.jobText);
  const maxDays = Math.min(7, Math.max(3, opts.maxDays || 5));
  const tickets = seedTicketsForFamily(family, opts.jobTitle, jdAnchorFromJob(opts.jobText));
  const week1Checklist = seedWeek1Checklist(opts.jobTitle);

  const days = seed.slice(0, maxDays).map((term, i) => {
    const day = i + 1;
    const challengeId = `ch${day}`;
    const ticketId = tickets[i % tickets.length]?.id || `tk${day}`;
    const starId = `st${day}`;
    return {
      day,
      title: `Práctica: ${term}`,
      learnTopics: [term],
      explain: `Hoy refuerzas “${term}” porque aparece (o lo elegiste) para esta vacante. Entiende qué es y para qué lo usa el equipo.`,
      realWorld: `En una empresa, “${term}” suele verse en el día a día del cargo ${opts.jobTitle || "objetivo"}: reuniones cortas, entregables y seguimiento.`,
      practices: [
        "Hazlo concreto con un ejemplo tuyo o un ejercicio",
        "Evita decir que lo dominas si aún lo estás aprendiendo",
      ],
      interviewQ: `Cuéntame cómo aplicarías ${term} en las primeras semanas del rol.`,
      doneWhen: [`Puedes explicar ${term} en 1 minuto`, "Completaste el reto del día"],
      challengeId,
      ticketId,
      starId,
    };
  });

  // Si hay menos temas que días, rellena con tickets de familia
  while (days.length < maxDays) {
    const day = days.length + 1;
    const t = tickets[(day - 1) % tickets.length];
    const challengeId = `ch${day}`;
    const starId = `st${day}`;
    days.push({
      day,
      title: t?.title || `Práctica día ${day}`,
      learnTopics: [t?.title || "práctica del rol"],
      explain: `Sesión ${day}: práctica anclada al aviso (${family}).`,
      realWorld: "Trabajo real: entregable corto + update a jefe.",
      practices: ["Entregable mínimo", "No inventes experiencia"],
      interviewQ: "¿Cómo priorizarías el trabajo de esta semana en el rol?",
      doneWhen: ["Completaste el reto", "Cerraste el ticket"],
      challengeId,
      ticketId: t?.id || `tk${day}`,
      starId,
    });
  }

  const challenges = days.map((d) => ({
    id: d.challengeId,
    day: d.day,
    title: `Reto del día: ${d.learnTopics[0]}`,
    brief: `Como si tu jefe te pidiera avanzar hoy en “${d.learnTopics[0]}” sin reunión eterna.`,
    jdAnchor: jdAnchorFromJob(opts.jobText),
    steps: [
      "Lee 10 minutos de referencia seria (docs oficiales o guía práctica)",
      "Haz un entregable mínimo (nota, checklist o ejemplo)",
      "Escribe 5 líneas: qué harías el lunes en el trabajo con esto",
    ],
    deliverable: `Una nota de media página o checklist sobre ${d.learnTopics[0]}`,
    timeMin: 30,
    pitfalls: ["Solo leer sin producir nada", "Copiar jerga sin entender el para qué"],
  }));

  const starBank: RoleReviewStarPrompt[] = days.map((d) => ({
    id: d.starId!,
    day: d.day,
    question: `Cuéntame una situación (real tuya) relacionada con “${d.learnTopics[0]}” o, si aún no la tienes, cómo la practicarías en pequeño.`,
    hint: "S-T-A-R: Situación, Tarea, Acción, Resultado. No inventes números ni cargos.",
    jdAnchor: jdAnchorFromJob(opts.jobText),
  }));

  return {
    title: `Repaso: ${opts.jobTitle || "vacante"}`,
    objective:
      opts.mode === "dia1"
        ? "Sobrevivir la primera semana del cargo con checklist + práctica diaria."
        : "Mantener músculo del rol con práctica diaria anclada al aviso.",
    mode: opts.mode,
    learnTopics: opts.learnTopics,
    roleFamily: family,
    days,
    challenges,
    tickets: tickets.slice(0, Math.max(days.length, 3)),
    starBank,
    week1Checklist,
  };
}
