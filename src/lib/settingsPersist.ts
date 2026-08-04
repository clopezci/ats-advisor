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
    microlearning_footer: patch.microlearning_footer ?? base.microlearning_footer,
  };
}

/** Hydrate settings from Supabase app_settings when available. */
export async function hydrateSettingsFromCloud() {
  const sb = createServiceSupabase();
  if (!sb) return readSettings();
  try {
    const { data } = await sb.from("app_settings").select("value").eq("key", "main").maybeSingle();
    if (data?.value) {
      writeSettings(deepMerge(defaultSettings(), data.value as Partial<AppSettings>));
    }
  } catch {
    /* ignore */
  }
  return readSettings();
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
