/**
 * Activación de plan en cloud tras pago (service role).
 * Idempotente por `reference`. Si no hay perfil aún, deja pending para /api/payments/claim.
 */
import { createServiceSupabase } from "@/lib/supabase/client";
import { notifyOwnerTelegram } from "@/lib/notify/channels";

export type PaidPlan = "carrera" | "plus" | "out09_extra";

export function mapPlanHint(hint: string | null | undefined): PaidPlan | null {
  if (!hint) return null;
  const h = hint.toLowerCase();
  if (h === "carrera" || h === "plus" || h === "out09_extra") return h;
  return null;
}

export async function recordPaymentIntent(opts: {
  reference: string;
  plan: string;
  email?: string | null;
  amount?: number;
  provider?: string;
  channel?: string;
}) {
  const sb = createServiceSupabase();
  if (!sb) return;
  await sb.from("audit_events").insert({
    kind: "payment_intent",
    detail: {
      reference: opts.reference,
      plan: opts.plan,
      email: (opts.email || "").trim().toLowerCase() || null,
      amount: opts.amount ?? null,
      provider: opts.provider || null,
      channel: opts.channel || null,
      at: new Date().toISOString(),
    },
  });
}

export async function lookupEmailForReference(reference: string): Promise<string | null> {
  const sb = createServiceSupabase();
  if (!sb || !reference) return null;
  const { data } = await sb
    .from("audit_events")
    .select("detail")
    .eq("kind", "payment_intent")
    .order("created_at", { ascending: false })
    .limit(80);
  for (const row of data || []) {
    const d = row.detail as { reference?: string; email?: string };
    if (d?.reference === reference && d.email?.includes("@")) return d.email.toLowerCase();
  }
  return null;
}

async function alreadyEntitled(reference: string): Promise<boolean> {
  const sb = createServiceSupabase();
  if (!sb) return false;
  const { data } = await sb
    .from("audit_events")
    .select("detail")
    .eq("kind", "payment_entitlement")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data || []).some((row) => (row.detail as { reference?: string })?.reference === reference);
}

/** True si el webhook (u otro origen confiable) ya registró pago aprobado para esa referencia. */
export async function wasPaymentApproved(reference: string): Promise<boolean> {
  const sb = createServiceSupabase();
  if (!sb || !reference) return false;
  const ref = reference.trim();
  if (/^(DUMMY|DEMO)-/i.test(ref)) return false;
  const { data } = await sb
    .from("audit_events")
    .select("detail, kind")
    .in("kind", ["payment_approved", "payment_entitlement"])
    .order("created_at", { ascending: false })
    .limit(120);
  return (data || []).some((row) => {
    const d = row.detail as { reference?: string; status?: string };
    if (d?.reference !== ref) return false;
    if (row.kind === "payment_entitlement") return true;
    return String(d.status || "").toUpperCase() === "APPROVED";
  });
}

export function isPaidCloudPlan(plan: string | null | undefined): boolean {
  return ["carrera", "plus", "tester"].includes(String(plan || "").toLowerCase());
}

/**
 * Activa plan en profiles por email.
 * out09_extra: baja out09_used_this_month en 1 (cupo extra).
 */
export async function activatePlanFromPayment(opts: {
  reference: string;
  planHint: string | null;
  email?: string | null;
  provider: string;
  status: string;
}) {
  const sb = createServiceSupabase();
  if (!sb) {
    await notifyOwnerTelegram(
      `Pago ${opts.status} ${opts.reference}: sin SUPABASE_SERVICE_ROLE_KEY — no se pudo activar plan en cloud.`
    );
    return { ok: false as const, reason: "no_supabase" };
  }

  const plan = mapPlanHint(opts.planHint);
  if (!plan) {
    await notifyOwnerTelegram(`Pago OK pero reference sin plan: ${opts.reference}`);
    return { ok: false as const, reason: "no_plan_in_reference" };
  }

  if (await alreadyEntitled(opts.reference)) {
    return { ok: true as const, reason: "already_applied", plan };
  }

  let email = (opts.email || "").trim().toLowerCase();
  if (!email.includes("@")) {
    email = (await lookupEmailForReference(opts.reference)) || "";
  }

  if (!email.includes("@")) {
    await notifyOwnerTelegram(
      `Pago ${plan} ${opts.reference}: sin email en checkout — el usuario debe entrar con magic link y reclamar en /cuenta o /api/payments/claim.`
    );
    await sb.from("audit_events").insert({
      kind: "payment_pending_email",
      detail: { ...opts, plan },
    });
    return { ok: false as const, reason: "no_email" };
  }

  const { data: profile } = await sb
    .from("profiles")
    .select("id, plan, out09_used_this_month")
    .eq("email", email)
    .maybeSingle();

  if (!profile) {
    await sb.from("audit_events").insert({
      kind: "payment_pending_profile",
      detail: { ...opts, plan, email },
    });
    await notifyOwnerTelegram(
      `Pago ${plan} para ${email}: perfil aún no existe. Al hacer magic link, claim aplicará el pago.`
    );
    return { ok: false as const, reason: "no_profile", email, plan };
  }

  if (plan === "out09_extra") {
    const used = Math.max(0, Number(profile.out09_used_this_month) || 0);
    await sb
      .from("profiles")
      .update({
        out09_used_this_month: Math.max(0, used - 1),
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);
  } else {
    await sb
      .from("profiles")
      .update({ plan, updated_at: new Date().toISOString() })
      .eq("id", profile.id);
  }

  await sb.from("audit_events").insert({
    kind: "payment_entitlement",
    detail: { ...opts, plan, email, profileId: profile.id },
  });

  await notifyOwnerTelegram(`✓ Plan ${plan} activado en cloud para ${email} · ${opts.reference}`);
  return { ok: true as const, plan, email };
}

/** Aplica entitlements pendientes al iniciar sesión / claim. */
export async function claimPendingPaymentsForEmail(email: string) {
  const sb = createServiceSupabase();
  if (!sb || !email.includes("@")) return { applied: 0 };
  const em = email.trim().toLowerCase();

  const { data: pending } = await sb
    .from("audit_events")
    .select("id, detail, kind")
    .in("kind", ["payment_pending_profile", "payment_pending_email"])
    .order("created_at", { ascending: false })
    .limit(40);

  let applied = 0;
  for (const row of pending || []) {
    const detail = row.detail as {
      email?: string;
      plan?: string;
      reference?: string;
      provider?: string;
      status?: string;
    };
    const rowEmail = (detail.email || "").toLowerCase();
    // pending_email may not have email; match by claiming user only if email was later known
    if (row.kind === "payment_pending_profile" && rowEmail !== em) continue;
    if (row.kind === "payment_pending_email" && rowEmail && rowEmail !== em) continue;

    const r = await activatePlanFromPayment({
      reference: String(detail.reference || `claim_${row.id}`),
      planHint: detail.plan || null,
      email: em,
      provider: String(detail.provider || "claim"),
      status: "APPROVED",
    });
    if (r.ok) {
      applied += 1;
      await sb.from("audit_events").delete().eq("id", row.id);
    }
  }
  return { applied };
}

export async function getCloudPlanByEmail(email: string) {
  const sb = createServiceSupabase();
  if (!sb || !email.includes("@")) return null;
  const { data } = await sb
    .from("profiles")
    .select("plan, out09_used_this_month, telegram_chat_id")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();
  return data;
}
