/** Métricas locales del Repaso del rol (dispositivo). */

const KEY = "ats_role_review_metrics_v1";

export type RoleReviewMetrics = {
  plansCreated: number;
  plansCompleted: number;
  daysCompleted: number;
  ticketsClosed: number;
  challengesDone: number;
  coachSessions: number;
  lastPlanAt?: number;
  lastCompletedAt?: number;
};

function empty(): RoleReviewMetrics {
  return {
    plansCreated: 0,
    plansCompleted: 0,
    daysCompleted: 0,
    ticketsClosed: 0,
    challengesDone: 0,
    coachSessions: 0,
  };
}

export function readRoleReviewMetrics(): RoleReviewMetrics {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw || typeof raw !== "object") return empty();
    return { ...empty(), ...raw };
  } catch {
    return empty();
  }
}

function write(m: RoleReviewMetrics) {
  localStorage.setItem(KEY, JSON.stringify(m));
}

export function bumpRoleReviewMetric(
  key: keyof Omit<RoleReviewMetrics, "lastPlanAt" | "lastCompletedAt">,
  by = 1
) {
  const m = readRoleReviewMetrics();
  const next = { ...m, [key]: (m[key] || 0) + by };
  if (key === "plansCreated") next.lastPlanAt = Date.now();
  if (key === "plansCompleted") next.lastCompletedAt = Date.now();
  write(next);
  return next;
}

export function completionRatePct(m = readRoleReviewMetrics()): number {
  if (!m.plansCreated) return 0;
  return Math.round((m.plansCompleted / m.plansCreated) * 100);
}
