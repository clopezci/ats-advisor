import type { RoleReviewPlan } from "@/lib/roleReview/types";
import { bumpRoleReviewMetric } from "@/lib/roleReview/metrics";

const KEY = "ats_role_review_plans_v1";

function normalizePlan(raw: RoleReviewPlan): RoleReviewPlan {
  return {
    ...raw,
    tickets: raw.tickets || [],
    starBank: raw.starBank || [],
    week1Checklist: raw.week1Checklist || [],
    completedDays: raw.completedDays || [],
    completedChallenges: raw.completedChallenges || [],
    completedTickets: raw.completedTickets || [],
    completedWeek1: raw.completedWeek1 || [],
    starAnswers: raw.starAnswers || {},
    coachTranscript: raw.coachTranscript || [],
  };
}

export function listRoleReviewPlans(): RoleReviewPlan[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw.map((p) => normalizePlan(p)) : [];
  } catch {
    return [];
  }
}

export function saveRoleReviewPlans(plans: RoleReviewPlan[]) {
  localStorage.setItem(KEY, JSON.stringify(plans.slice(0, 40)));
}

export function getRoleReviewPlan(id: string): RoleReviewPlan | null {
  const p = listRoleReviewPlans().find((x) => x.id === id) || null;
  return p ? normalizePlan(p) : null;
}

export function getRoleReviewPlanByJobId(jobId: string): RoleReviewPlan | null {
  const p = listRoleReviewPlans().find((x) => x.jobId === jobId) || null;
  return p ? normalizePlan(p) : null;
}

export function upsertRoleReviewPlan(plan: RoleReviewPlan) {
  const list = listRoleReviewPlans().filter((p) => p.id !== plan.id);
  list.unshift(normalizePlan({ ...plan, updatedAt: Date.now() }));
  saveRoleReviewPlans(list);
  return plan;
}

export function markDayDone(planId: string, day: number) {
  const plan = getRoleReviewPlan(planId);
  if (!plan) return null;
  if (plan.completedDays.includes(day)) return plan;
  const completedDays = Array.from(new Set([...plan.completedDays, day])).sort((a, b) => a - b);
  const next = upsertRoleReviewPlan({ ...plan, completedDays });
  bumpRoleReviewMetric("daysCompleted");
  if (completedDays.length >= (plan.days?.length || 0) && (plan.days?.length || 0) > 0) {
    bumpRoleReviewMetric("plansCompleted");
  }
  return next;
}

export function markChallengeDone(planId: string, challengeId: string) {
  const plan = getRoleReviewPlan(planId);
  if (!plan) return null;
  if (plan.completedChallenges.includes(challengeId)) return plan;
  const completedChallenges = Array.from(new Set([...plan.completedChallenges, challengeId]));
  bumpRoleReviewMetric("challengesDone");
  return upsertRoleReviewPlan({ ...plan, completedChallenges });
}

export function markTicketDone(planId: string, ticketId: string) {
  const plan = getRoleReviewPlan(planId);
  if (!plan) return null;
  if (plan.completedTickets.includes(ticketId)) return plan;
  const completedTickets = Array.from(new Set([...plan.completedTickets, ticketId]));
  bumpRoleReviewMetric("ticketsClosed");
  return upsertRoleReviewPlan({ ...plan, completedTickets });
}

export function markWeek1Done(planId: string, itemId: string) {
  const plan = getRoleReviewPlan(planId);
  if (!plan) return null;
  const completedWeek1 = Array.from(new Set([...plan.completedWeek1, itemId]));
  return upsertRoleReviewPlan({ ...plan, completedWeek1 });
}

export function saveStarAnswer(planId: string, starId: string, text: string) {
  const plan = getRoleReviewPlan(planId);
  if (!plan) return null;
  return upsertRoleReviewPlan({
    ...plan,
    starAnswers: { ...plan.starAnswers, [starId]: text },
  });
}

export function setReminders(planId: string, on: boolean, remindAt?: string) {
  const plan = getRoleReviewPlan(planId);
  if (!plan) return null;
  return upsertRoleReviewPlan({
    ...plan,
    remindersOn: on,
    remindAt: remindAt || plan.remindAt || "09:00",
  });
}

export function appendCoachMessage(
  planId: string,
  msg: { role: "manager" | "you"; text: string }
) {
  const plan = getRoleReviewPlan(planId);
  if (!plan) return null;
  const coachTranscript = [
    ...(plan.coachTranscript || []),
    { ...msg, at: Date.now() },
  ].slice(-40);
  return upsertRoleReviewPlan({ ...plan, coachTranscript });
}

export function planProgressPct(plan: RoleReviewPlan): number {
  const total = Math.max(1, plan.days?.length || 0);
  return Math.round(((plan.completedDays?.length || 0) / total) * 100);
}
