export type PlanId = "free" | "carrera" | "plus" | "tester" | "paused_90";

export type Entitlement = {
  plan: PlanId;
  out09UsedMonth: number;
  out09Month: string; // YYYY-MM
  activatedAt?: string;
  source?: "local" | "demo_checkout" | "webhook" | "admin";
  pausedAt?: string;
  guaranteeClaimedAt?: string;
  guaranteeStartedAt?: string;
  interviewsLoggedSinceGuarantee?: number;
};

const KEY = "ats_entitlement";

function monthKey() {
  return new Date().toISOString().slice(0, 7);
}

export function defaultEntitlement(): Entitlement {
  return { plan: "free", out09UsedMonth: 0, out09Month: monthKey(), source: "local" };
}

export function readEntitlement(): Entitlement {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw?.plan) return defaultEntitlement();
    const e: Entitlement = { ...defaultEntitlement(), ...raw };
    if (e.out09Month !== monthKey()) {
      e.out09Month = monthKey();
      e.out09UsedMonth = 0;
      writeEntitlement(e);
    }
    return e;
  } catch {
    return defaultEntitlement();
  }
}

export function writeEntitlement(e: Entitlement) {
  localStorage.setItem(KEY, JSON.stringify(e));
}

export function setPlan(plan: PlanId, source: Entitlement["source"] = "local") {
  const e = readEntitlement();
  const next: Entitlement = {
    ...e,
    plan,
    activatedAt: new Date().toISOString(),
    source,
  };
  writeEntitlement(next);
  try {
    void import("@/lib/supabase/sync").then((m) => m.syncProfilePlan(plan)).catch(() => undefined);
  } catch {
    /* ignore */
  }
  return next;
}

/** OUT-09 monthly quota by plan (defaults; prefer settings when passed). */
export function out09Quota(plan: PlanId, limits?: { carrera: number; plus: number }) {
  const carrera = limits?.carrera ?? 0; // Carrera ya no incluye OUT-09
  const plus = limits?.plus ?? 2;
  if (plan === "tester" || plan === "plus") return plus;
  if (plan === "carrera") return carrera;
  return 0;
}

export function canAccessOutplacement(plan: PlanId) {
  return plan === "carrera" || plan === "plus" || plan === "tester";
}

export function pauseFor90Days() {
  const e = readEntitlement();
  const next: Entitlement = {
    ...e,
    plan: "paused_90",
    pausedAt: new Date().toISOString(),
    source: "local",
  };
  writeEntitlement(next);
  return next;
}

export function canGenerateOut09(
  e: Entitlement,
  limits?: { carrera: number; plus: number }
): { ok: boolean; remaining: number; quota: number; reason?: string } {
  if (!canAccessOutplacement(e.plan)) {
    return { ok: false, remaining: 0, quota: 0, reason: "Necesitas un plan Carrera o Plus." };
  }
  const quota = out09Quota(e.plan, limits);
  if (quota <= 0) {
    return {
      ok: false,
      remaining: 0,
      quota: 0,
      reason:
        "El curso a tu medida está en Carrera Plus (2/mes) o puedes comprar uno extra. Carrera incluye la ruta de 8 módulos sin cursos a medida.",
    };
  }
  const remaining = Math.max(0, quota - e.out09UsedMonth);
  if (remaining <= 0) {
    return {
      ok: false,
      remaining: 0,
      quota,
      reason: `Ya usaste tus ${quota} cursos a medida de este mes. Compra uno extra o espera al próximo ciclo.`,
    };
  }
  return { ok: true, remaining, quota };
}

export function recordOut09Use() {
  const e = readEntitlement();
  const next = { ...e, out09UsedMonth: e.out09UsedMonth + 1, out09Month: monthKey() };
  writeEntitlement(next);
  return next;
}

export function planLabel(plan: PlanId) {
  const map: Record<PlanId, string> = {
    free: "Gratis",
    carrera: "Carrera",
    plus: "Carrera Plus",
    tester: "Tester",
    paused_90: "Pausa · 90 días",
  };
  return map[plan];
}
