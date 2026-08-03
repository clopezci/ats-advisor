export type AppSettings = {
  pricing: {
    carrera: number;
    plus: number;
    out09_extra: number;
    currency: string;
    plan_90_dias: number;
    /** Addon WhatsApp mensual (precio final al usuario). Si 0, se calcula por fórmula. */
    whatsapp_addon: number;
  };
  whatsapp_cost: {
    meta_mid_monthly_cop: number;
    margin_percent: number;
    msgs_per_month: number;
  };
  ai_limits: {
    free_ats_per_day: number;
    out09_included_carrera: number;
    out09_included_plus: number;
    quality_threshold: number;
    max_paid_escalations: number;
    max_ai_cost_cop_per_user_month: number;
    max_out09_prompt_chars: number;
  };
  features: {
    ads: boolean;
    whatsapp: boolean;
    telegram: boolean;
    outplacement: boolean;
    out09: boolean;
    coach_chat: boolean;
    guarantee: boolean;
  };
  llm: {
    prefer_groq: boolean;
    prefer_gemini: boolean;
    prefer_openai: boolean;
  };
  promotions: { name: string; percent: number; amount: number; starts: string; ends: string; code: string }[];
  tester_emails: string[];
  microlearning_footer: string;
};

const g = globalThis as unknown as { __atsSettings?: AppSettings };

export function defaultSettings(): AppSettings {
  return {
    pricing: {
      carrera: 79000,
      plus: 99000,
      out09_extra: 22000,
      plan_90_dias: 39000,
      whatsapp_addon: 0, // 0 = calcular: meta_mid × 1.5
      currency: "COP",
    },
    whatsapp_cost: {
      meta_mid_monthly_cop: 14000,
      margin_percent: 50,
      msgs_per_month: 45,
    },
    ai_limits: {
      free_ats_per_day: 5,
      out09_included_carrera: 1,
      out09_included_plus: 2,
      quality_threshold: 0.72,
      max_paid_escalations: 1,
      max_ai_cost_cop_per_user_month: 12000,
      max_out09_prompt_chars: 2000,
    },
    features: {
      ads: true,
      whatsapp: true,
      telegram: true,
      outplacement: true,
      out09: true,
      coach_chat: true,
      guarantee: true,
    },
    llm: { prefer_groq: true, prefer_gemini: true, prefer_openai: true },
    promotions: [],
    tester_emails: (process.env.ADMIN_TESTER_EMAILS || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
    microlearning_footer: "ATSAdvisor · LOTIC — practica 5–15 min al día.",
  };
}

export function readSettings(): AppSettings {
  if (!g.__atsSettings) return defaultSettings();
  return deepMerge(defaultSettings(), g.__atsSettings);
}

export function writeSettings(settings: AppSettings) {
  g.__atsSettings = settings;
}

export function applyPromotion(
  amount: number,
  code: string,
  promotions = readSettings().promotions
): { amount: number; applied: string | null; discount: number } {
  const now = new Date().toISOString().slice(0, 10);
  const promo = promotions.find((p) => {
    if (p.code.toLowerCase() !== code.trim().toLowerCase()) return false;
    if (p.starts && now < p.starts) return false;
    if (p.ends && now > p.ends) return false;
    return true;
  });
  if (!promo) return { amount, applied: null, discount: 0 };
  let next = amount;
  if (promo.percent > 0) next = Math.round(amount * (1 - promo.percent / 100));
  if (promo.amount > 0) next = Math.max(0, next - promo.amount);
  return { amount: next, applied: promo.code || promo.name, discount: amount - next };
}

function deepMerge(base: AppSettings, patch: Partial<AppSettings>): AppSettings {
  return {
    ...base,
    ...patch,
    pricing: { ...base.pricing, ...(patch.pricing || {}) },
    whatsapp_cost: { ...base.whatsapp_cost, ...(patch.whatsapp_cost || {}) },
    ai_limits: { ...base.ai_limits, ...(patch.ai_limits || {}) },
    features: { ...base.features, ...(patch.features || {}) },
    llm: { ...base.llm, ...(patch.llm || {}) },
    promotions: patch.promotions ?? base.promotions,
    tester_emails: patch.tester_emails ?? base.tester_emails,
    microlearning_footer: patch.microlearning_footer ?? base.microlearning_footer,
  };
}

/** Precio final WhatsApp al usuario (solo el número público). */
export function resolveWhatsappAddonCop(settings = readSettings()): number {
  if (settings.pricing.whatsapp_addon > 0) return settings.pricing.whatsapp_addon;
  const mid = settings.whatsapp_cost.meta_mid_monthly_cop;
  const margin = settings.whatsapp_cost.margin_percent;
  return Math.round(mid * (1 + margin / 100));
}
