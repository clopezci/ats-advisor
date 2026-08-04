import { NextResponse } from "next/server";
import { readSettings, resolveWhatsappAddonCop } from "@/lib/settings";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";

/** Flags + precios públicos (sin secretos) para que el admin tenga efecto real en UI. */
export async function GET() {
  await hydrateSettingsFromCloud();
  const s = readSettings();
  return NextResponse.json({
    ads: Boolean(s.features.ads),
    telegram: Boolean(s.features.telegram),
    whatsapp: Boolean(s.features.whatsapp),
    guarantee: Boolean(s.features.guarantee),
    coach_chat: Boolean(s.features.coach_chat),
    outplacement: Boolean(s.features.outplacement),
    out09: Boolean(s.features.out09),
    pricing: {
      carrera: s.pricing.carrera,
      plus: s.pricing.plus,
      out09_extra: s.pricing.out09_extra,
      plan_90_dias: s.pricing.plan_90_dias,
      whatsapp_addon: resolveWhatsappAddonCop(s),
      currency: s.pricing.currency,
    },
    ai_limits: {
      free_ats_per_day: s.ai_limits.free_ats_per_day,
      out09_included_carrera: s.ai_limits.out09_included_carrera,
      out09_included_plus: s.ai_limits.out09_included_plus,
    },
  });
}
