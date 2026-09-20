import { readEntitlement, type PlanId } from "@/lib/entitlements";

const KEY = "ats_role_review_usage_v1";

type Usage = { month: string; count: number };

function monthKey() {
  return new Date().toISOString().slice(0, 7);
}

function readUsage(): Usage {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (raw?.month === monthKey()) return raw;
  } catch {
    /* ignore */
  }
  return { month: monthKey(), count: 0 };
}

function writeUsage(u: Usage) {
  localStorage.setItem(KEY, JSON.stringify(u));
}

/** Cupo mensual de planes de repaso generados. */
export function roleReviewMonthlyQuota(plan: PlanId): number {
  if (plan === "tester" || plan === "plus") return 30;
  if (plan === "carrera") return 12;
  if (plan === "paused_90") return 4;
  return 1; // free: 1 plan/mes
}

export function canGenerateRoleReview(): {
  ok: boolean;
  remaining: number;
  used: number;
  quota: number;
  plan: PlanId;
  reason?: string;
} {
  const e = readEntitlement();
  const quota = roleReviewMonthlyQuota(e.plan);
  const u = readUsage();
  const remaining = Math.max(0, quota - u.count);
  if (remaining <= 0) {
    return {
      ok: false,
      remaining: 0,
      used: u.count,
      quota,
      plan: e.plan,
      reason:
        e.plan === "free"
          ? `Gratis: 1 repaso/mes. Ya lo usaste (${u.count}/${quota}). Mejora a Carrera en /precios o espera el próximo mes.`
          : `Llegaste al tope de repasos este mes (${u.count}/${quota}).`,
    };
  }
  return { ok: true, remaining, used: u.count, quota, plan: e.plan };
}

export function recordRoleReviewGenerate() {
  const u = readUsage();
  const next = { month: monthKey(), count: u.count + 1 };
  writeUsage(next);
  return next;
}

/** Free: plan corto (3 días). Paid: hasta 7. */
export function roleReviewMaxDays(plan: PlanId): number {
  if (plan === "free") return 3;
  return 7;
}
