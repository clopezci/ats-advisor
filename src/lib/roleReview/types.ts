/** Tipos del Repaso del rol (plan anclado a una vacante). */

export type RoleReviewMode = "refuerzo" | "total" | "entrevista" | "dia1";

export type RoleReviewLearnTopic = {
  term: string;
  /** El usuario marcó “quiero aprenderlo” (no estaba en el CV / no lo domina). */
  optIn: boolean;
  source: "ats_missing" | "ats_hard" | "manual";
};

export type RoleReviewChallenge = {
  id: string;
  day: number;
  title: string;
  /** Qué pediría un jefe real. */
  brief: string;
  /** Ancla a un bullet del aviso. */
  jdAnchor: string;
  steps: string[];
  deliverable: string;
  timeMin: number;
  pitfalls: string[];
};

/** Ticket falso estilo Jira/Notion (práctica de empresa). */
export type RoleReviewTicket = {
  id: string;
  day: number;
  title: string;
  priority: "P0" | "P1" | "P2";
  type: "task" | "bug" | "spike" | "update";
  description: string;
  acceptance: string[];
  jdAnchor: string;
  timeMin: number;
};

/** Plantilla STAR vacía ligada al aviso (el usuario la llena con su verdad). */
export type RoleReviewStarPrompt = {
  id: string;
  day: number;
  question: string;
  hint: string;
  jdAnchor: string;
};

/** Checklist “primera semana en el cargo”. */
export type RoleReviewWeek1Item = {
  id: string;
  dayHint: string;
  title: string;
  why: string;
};

export type RoleReviewDay = {
  day: number;
  title: string;
  /** Temas de aprendizaje de este día (incl. opt-in). */
  learnTopics: string[];
  /** Qué / para qué / cómo en empresa. */
  explain: string;
  realWorld: string;
  practices: string[];
  interviewQ: string;
  doneWhen: string[];
  challengeId: string;
  ticketId?: string;
  starId?: string;
};

export type RoleReviewPlan = {
  id: string;
  jobId?: string;
  title: string;
  objective: string;
  mode: RoleReviewMode;
  learnTopics: RoleReviewLearnTopic[];
  days: RoleReviewDay[];
  challenges: RoleReviewChallenge[];
  tickets: RoleReviewTicket[];
  starBank: RoleReviewStarPrompt[];
  week1Checklist: RoleReviewWeek1Item[];
  /** Familia de rol detectada o elegida (plantillas Fase 4). */
  roleFamily?: RoleReviewFamily;
  createdAt: number;
  updatedAt: number;
  /** Días completados (1-based). */
  completedDays: number[];
  /** Retos completados por id. */
  completedChallenges: string[];
  /** Tickets cerrados. */
  completedTickets: string[];
  /** Checklist semana 1 tachada. */
  completedWeek1: string[];
  /** Respuestas STAR del usuario (id → texto). */
  starAnswers: Record<string, string>;
  /** Simulacro 1:1 (mensajes). */
  coachTranscript?: { role: "manager" | "you"; text: string; at: number }[];
  /** Hora local HH:MM para recordatorio del día (Fase 3). */
  remindAt?: string;
  remindersOn?: boolean;
};

export type RoleReviewFamily = "tech" | "data" | "finanzas" | "ops" | "comercial" | "general";

export const ROLE_REVIEW_MODE_LABEL: Record<RoleReviewMode, string> = {
  refuerzo: "Solo lo que me falta",
  total: "Repaso completo del aviso",
  entrevista: "Preparar entrevista",
  dia1: "Primera semana en el cargo",
};

export const ROLE_REVIEW_FAMILY_LABEL: Record<RoleReviewFamily, string> = {
  tech: "Tech / ingeniería",
  data: "Datos / analytics",
  finanzas: "Finanzas / contabilidad",
  ops: "Operaciones / supply",
  comercial: "Comercial / CS",
  general: "General / mixto",
};
