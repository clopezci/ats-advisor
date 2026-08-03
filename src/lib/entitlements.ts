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

/** OUT-09 monthly quota by plan (mirrors settings defaults). */
export function out09Quota(plan: PlanId, limits?: { carrera: number; plus: number }) {
  const carrera = limits?.carrera ?? 1;
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

export function startGuarantee() {
  const e = readEntitlement();
  const next: Entitlement = {
    ...e,
    guaranteeStartedAt: new Date().toISOString(),
    interviewsLoggedSinceGuarantee: 0,
  };
  writeEntitlement(next);
  return next;
}

/** After 30 days with 0 interviews logged → claim free month flag (demo). */
export function canClaimGuarantee(e = readEntitlement()): { ok: boolean; reason: string } {
  if (!e.guaranteeStartedAt) return { ok: false, reason: "Activa la garantía desde outplacement." };
  if (e.guaranteeClaimedAt) return { ok: false, reason: "Ya reclamaste la garantía." };
  const started = new Date(e.guaranteeStartedAt).getTime();
  const days = (Date.now() - started) / 86400000;
  if (days < 30) return { ok: false, reason: `Llevas ${Math.floor(days)}/30 días.` };
  if ((e.interviewsLoggedSinceGuarantee || 0) > 0) {
    return { ok: false, reason: "Registraste entrevistas; la garantía aplica sin entrevistas en 30 días." };
  }
  return { ok: true, reason: "Elegible: mes de cortesía / revisión prioritaria (demo local)." };
}

export function claimGuarantee() {
  const check = canClaimGuarantee();
  if (!check.ok) return { ok: false as const, reason: check.reason };
  const e = readEntitlement();
  const next: Entitlement = {
    ...e,
    guaranteeClaimedAt: new Date().toISOString(),
    plan: e.plan === "paused_90" || e.plan === "free" ? "carrera" : e.plan,
    source: "admin",
  };
  writeEntitlement(next);
  return { ok: true as const, entitlement: next };
}

/** Incrementa contador cuando el tracker marca una entrevista (rompe elegibilidad de garantía). */
export function logInterviewForGuarantee() {
  const e = readEntitlement();
  if (!e.guaranteeStartedAt || e.guaranteeClaimedAt) return e;
  const next: Entitlement = {
    ...e,
    interviewsLoggedSinceGuarantee: (e.interviewsLoggedSinceGuarantee || 0) + 1,
  };
  writeEntitlement(next);
  return next;
}

export type GuaranteeProgress = {
  active: boolean;
  days: number;
  interviews: number;
  claim: { ok: boolean; reason: string };
};

export function guaranteeProgress(e = readEntitlement()): GuaranteeProgress {
  if (!e.guaranteeStartedAt) {
    return {
      active: false,
      days: 0,
      interviews: 0,
      claim: { ok: false, reason: "Inactiva" },
    };
  }
  const days = Math.floor((Date.now() - new Date(e.guaranteeStartedAt).getTime()) / 86400000);
  const interviews = e.interviewsLoggedSinceGuarantee || 0;
  return {
    active: true,
    days: Math.min(30, days),
    interviews,
    claim: canClaimGuarantee(e),
  };
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
      reason: "OUT-09 es premium. Activa Carrera o compra un OUT-09 extra.",
    };
  }
  const remaining = Math.max(0, quota - e.out09UsedMonth);
  if (remaining <= 0) {
    return {
      ok: false,
      remaining: 0,
      quota,
      reason: `Ya usaste tus ${quota} OUT-09 de este mes. Compra uno extra o espera al próximo ciclo.`,
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
