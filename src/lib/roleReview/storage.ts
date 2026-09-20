import type { RoleReviewPlan } from "@/lib/roleReview/types";

const KEY = "ats_role_review_plans_v1";

export function listRoleReviewPlans(): RoleReviewPlan[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function saveRoleReviewPlans(plans: RoleReviewPlan[]) {
  localStorage.setItem(KEY, JSON.stringify(plans.slice(0, 40)));
}

export function getRoleReviewPlan(id: string): RoleReviewPlan | null {
  return listRoleReviewPlans().find((p) => p.id === id) || null;
}

export function getRoleReviewPlanByJobId(jobId: string): RoleReviewPlan | null {
  return listRoleReviewPlans().find((p) => p.jobId === jobId) || null;
}

export function upsertRoleReviewPlan(plan: RoleReviewPlan) {
  const list = listRoleReviewPlans().filter((p) => p.id !== plan.id);
  list.unshift({ ...plan, updatedAt: Date.now() });
  saveRoleReviewPlans(list);
  return plan;
}

export function markDayDone(planId: string, day: number) {
  const plan = getRoleReviewPlan(planId);
  if (!plan) return null;
  const completedDays = Array.from(new Set([...plan.completedDays, day])).sort((a, b) => a - b);
  return upsertRoleReviewPlan({ ...plan, completedDays });
}

export function markChallengeDone(planId: string, challengeId: string) {
  const plan = getRoleReviewPlan(planId);
  if (!plan) return null;
  const completedChallenges = Array.from(new Set([...plan.completedChallenges, challengeId]));
  return upsertRoleReviewPlan({ ...plan, completedChallenges });
}
