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
  createdAt: number;
  updatedAt: number;
  /** Días completados (1-based). */
  completedDays: number[];
  /** Retos completados por id. */
  completedChallenges: string[];
};

export const ROLE_REVIEW_MODE_LABEL: Record<RoleReviewMode, string> = {
  refuerzo: "Solo lo que me falta",
  total: "Repaso completo del aviso",
  entrevista: "Preparar entrevista",
  dia1: "Primera semana en el cargo",
};
