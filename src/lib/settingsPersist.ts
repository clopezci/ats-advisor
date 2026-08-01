import { createServiceSupabase } from "@/lib/supabase/client";
import { defaultSettings, readSettings, writeSettings, type AppSettings } from "@/lib/settings";

/** Hydrate settings from Supabase app_settings when available. */
export async function hydrateSettingsFromCloud() {
  const sb = createServiceSupabase();
  if (!sb) return readSettings();
  try {
    const { data } = await sb.from("app_settings").select("value").eq("key", "main").maybeSingle();
    if (data?.value) {
      writeSettings({ ...defaultSettings(), ...(data.value as AppSettings) });
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
