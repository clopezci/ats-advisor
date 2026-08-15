import { defaultSettings, type AppSettings } from "@/lib/settings";

function num(v: unknown, fallback: number, min = 0, max = 1_000_000_000): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function bool(v: unknown, fallback: boolean): boolean {
  if (typeof v === "boolean") return v;
  return fallback;
}

function str(v: unknown, fallback: string, max = 500): string {
  return String(v ?? fallback).slice(0, max);
}

/** Valida y normaliza un patch de settings (nunca confiar en el body crudo). */
export function sanitizeSettingsPatch(body: unknown): AppSettings {
  const base = defaultSettings();
  const b = (body && typeof body === "object" ? body : {}) as Partial<AppSettings>;

  const pricingIn = (b.pricing || {}) as Partial<AppSettings["pricing"]>;
  const waIn = (b.whatsapp_cost || {}) as Partial<AppSettings["whatsapp_cost"]>;
  const aiIn = (b.ai_limits || {}) as Partial<AppSettings["ai_limits"]>;
  const featIn = (b.features || {}) as Partial<AppSettings["features"]>;
  const llmIn = (b.llm || {}) as Partial<AppSettings["llm"]>;

  const promotionsRaw = Array.isArray(b.promotions) ? b.promotions : base.promotions;
  const promotions = promotionsRaw.slice(0, 50).map((p) => ({
    name: str((p as { name?: string }).name, "PROMO", 80),
    code: str((p as { code?: string }).code, "PROMO", 40).toUpperCase(),
    percent: num((p as { percent?: number }).percent, 0, 0, 100),
    amount: num((p as { amount?: number }).amount, 0, 0, 10_000_000),
    starts: str((p as { starts?: string }).starts, "", 16),
    ends: str((p as { ends?: string }).ends, "", 16),
  }));

  const emails = Array.isArray(b.tester_emails)
    ? b.tester_emails
        .map((e) => String(e).trim().toLowerCase())
        .filter((e) => e.includes("@") && e.length < 120)
        .slice(0, 100)
    : base.tester_emails;

  return {
    pricing: {
      carrera: num(pricingIn.carrera, base.pricing.carrera, 0, 5_000_000),
      plus: num(pricingIn.plus, base.pricing.plus, 0, 5_000_000),
      out09_extra: num(pricingIn.out09_extra, base.pricing.out09_extra, 0, 5_000_000),
      whatsapp_addon: num(pricingIn.whatsapp_addon, base.pricing.whatsapp_addon, 0, 500_000),
      currency: str(pricingIn.currency, base.pricing.currency, 8) || "COP",
    },
    whatsapp_cost: {
      meta_mid_monthly_cop: num(waIn.meta_mid_monthly_cop, base.whatsapp_cost.meta_mid_monthly_cop, 0, 500_000),
      margin_percent: num(waIn.margin_percent, base.whatsapp_cost.margin_percent, 0, 500),
      msgs_per_month: num(waIn.msgs_per_month, base.whatsapp_cost.msgs_per_month, 1, 5000),
    },
    ai_limits: {
      free_ats_per_day: num(aiIn.free_ats_per_day, base.ai_limits.free_ats_per_day, 1, 200),
      out09_included_carrera: num(aiIn.out09_included_carrera, base.ai_limits.out09_included_carrera, 0, 20),
      out09_included_plus: num(aiIn.out09_included_plus, base.ai_limits.out09_included_plus, 0, 20),
      quality_threshold: Math.min(1, Math.max(0, Number(aiIn.quality_threshold ?? base.ai_limits.quality_threshold) || 0.72)),
      max_paid_escalations: num(aiIn.max_paid_escalations, base.ai_limits.max_paid_escalations, 0, 5),
      max_ai_cost_cop_per_user_month: num(
        aiIn.max_ai_cost_cop_per_user_month,
        base.ai_limits.max_ai_cost_cop_per_user_month,
        0,
        1_000_000
      ),
      max_out09_prompt_chars: num(aiIn.max_out09_prompt_chars, base.ai_limits.max_out09_prompt_chars, 200, 20_000),
    },
    features: {
      ads: bool(featIn.ads, base.features.ads),
      whatsapp: bool(featIn.whatsapp, base.features.whatsapp),
      telegram: bool(featIn.telegram, base.features.telegram),
      outplacement: bool(featIn.outplacement, base.features.outplacement),
      out09: bool(featIn.out09, base.features.out09),
      coach_chat: bool(featIn.coach_chat, base.features.coach_chat),
      guarantee: false, // descontinuada
      experts: bool(featIn.experts, base.features.experts),
    },
    llm: {
      prefer_groq: bool(llmIn.prefer_groq, base.llm.prefer_groq),
      prefer_gemini: bool(llmIn.prefer_gemini, base.llm.prefer_gemini),
      prefer_openai: bool(llmIn.prefer_openai, base.llm.prefer_openai),
      prefer_openrouter: bool(llmIn.prefer_openrouter, base.llm.prefer_openrouter ?? true),
    },
    promotions,
    tester_emails: emails,
    microlearning_footer: str(b.microlearning_footer, base.microlearning_footer, 280),
    allies: (() => {
      const raw = Array.isArray(b.allies) ? b.allies : base.allies;
      return raw.slice(0, 40).map((a, i) => {
        const row = a as Partial<AppSettings["allies"][number]>;
        const specs = Array.isArray(row.specialties)
          ? row.specialties.map((s) => str(s, "", 40)).filter(Boolean).slice(0, 12)
          : [];
        return {
          id: str(row.id, `ally_${i}_${Date.now()}`, 64),
          name: str(row.name, "Aliado", 80),
          email: str(row.email, "", 120).trim().toLowerCase(),
          telegram_chat_id: str(row.telegram_chat_id, "", 40),
          whatsapp_phone: str(row.whatsapp_phone, "", 40).replace(/\s/g, ""),
          specialties: specs.length ? specs : ["carrera"],
          active: bool(row.active, true),
          notes: str(row.notes, "", 280),
          service_price_cop: num(
            row.service_price_cop,
            base.expert_default_service_price_cop,
            0,
            50_000_000
          ),
          commission_percent: num(row.commission_percent, base.expert_default_commission_percent, 0, 100),
          notify_email: bool(row.notify_email, true),
          notify_telegram: bool(row.notify_telegram, true),
          notify_whatsapp: bool(row.notify_whatsapp, true),
        };
      });
    })(),
    alumni: {
      telegram_url: str((b.alumni as { telegram_url?: string } | undefined)?.telegram_url, base.alumni.telegram_url, 300),
      discord_url: str((b.alumni as { discord_url?: string } | undefined)?.discord_url, base.alumni.discord_url, 300),
      ama_note: str((b.alumni as { ama_note?: string } | undefined)?.ama_note, base.alumni.ama_note, 400),
      ama_next: str((b.alumni as { ama_next?: string } | undefined)?.ama_next, base.alumni.ama_next || "", 80),
      ama_topic: str((b.alumni as { ama_topic?: string } | undefined)?.ama_topic, base.alumni.ama_topic || "", 160),
    },
    expert_default_commission_percent: num(
      b.expert_default_commission_percent,
      base.expert_default_commission_percent,
      0,
      100
    ),
    expert_default_service_price_cop: num(
      b.expert_default_service_price_cop,
      base.expert_default_service_price_cop,
      0,
      50_000_000
    ),
    expert_billing_mode:
      b.expert_billing_mode === "ally_direct" ? "ally_direct" : "platform_collect",
  };
}

export const PLANS_CHECKOUT = ["carrera", "plus", "out09_extra"] as const;
export type CheckoutPlan = (typeof PLANS_CHECKOUT)[number];

export function parseCheckoutPlan(v: unknown): CheckoutPlan | null {
  const s = String(v || "");
  return (PLANS_CHECKOUT as readonly string[]).includes(s) ? (s as CheckoutPlan) : null;
}

export function clampText(v: unknown, max: number): string {
  return String(v ?? "").slice(0, max);
}

/** Email usable (formato básico + longitud). */
export function isValidEmail(v: unknown): boolean {
  const s = String(v ?? "")
    .trim()
    .toLowerCase();
  if (s.length < 5 || s.length > 120) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/**
 * Ruta interna segura para ?next= (solo path relativo, sin // ni protocol-relative).
 */
export function safeAppPath(v: unknown, fallback = "/guia"): string {
  const s = String(v ?? "").trim();
  if (!s.startsWith("/") || s.startsWith("//") || s.includes("://")) return fallback;
  if (s.length > 400) return fallback;
  return s;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
