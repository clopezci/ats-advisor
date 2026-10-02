import { createServiceSupabase } from "@/lib/supabase/client";
import { defaultSettings, readSettings, writeSettings, type AppSettings } from "@/lib/settings";

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
    psico_practica_emails: patch.psico_practica_emails ?? base.psico_practica_emails,
    microlearning_footer: patch.microlearning_footer ?? base.microlearning_footer,
    allies: patch.allies ?? base.allies,
    alumni: { ...base.alumni, ...(patch.alumni || {}) },
    expert_default_commission_percent:
      patch.expert_default_commission_percent ?? base.expert_default_commission_percent,
    expert_default_service_price_cop:
      patch.expert_default_service_price_cop ?? base.expert_default_service_price_cop,
    expert_billing_mode: patch.expert_billing_mode ?? base.expert_billing_mode,
  };
}

/** Una sola vez: Carrera 94.500 + WhatsApp incluido (addon 0). */
function migrateProductPricing(s: AppSettings): AppSettings {
  const pricing = { ...s.pricing };
  const whatsapp_cost = { ...s.whatsapp_cost };
  let changed = false;
  if (pricing.carrera === 79000 || pricing.carrera === 79900) {
    pricing.carrera = 94500;
    changed = true;
  }
  if (pricing.whatsapp_addon === 28800) {
    pricing.whatsapp_addon = 0;
    changed = true;
  }
  if (whatsapp_cost.msgs_per_month === 30 || whatsapp_cost.msgs_per_month === 60) {
    whatsapp_cost.msgs_per_month = 150;
    changed = true;
  }
  return changed ? { ...s, pricing, whatsapp_cost } : s;
}

/** Hydrate settings from Supabase app_settings when available. */
export async function hydrateSettingsFromCloud() {
  const sb = createServiceSupabase();
  if (!sb) return migrateProductPricing(readSettings());
  try {
    const { data } = await sb.from("app_settings").select("value").eq("key", "main").maybeSingle();
    if (data?.value) {
      writeSettings(migrateProductPricing(deepMerge(defaultSettings(), data.value as Partial<AppSettings>)));
    }
  } catch {
    /* ignore */
  }
  return migrateProductPricing(readSettings());
}

export async function persistSettingsToCloud(settings: AppSettings) {
  writeSettings(settings);
  const sb = createServiceSupabase();
  if (!sb) return { ok: true, cloud: false };
  const { error } = await sb.from("app_settings").upsert({
    key: "main",
    value: settings,
    updated_at: new Date().toISOString(),
  });
  return { ok: !error, cloud: true, error: error?.message };
}
