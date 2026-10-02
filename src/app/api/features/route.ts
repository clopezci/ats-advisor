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
    guarantee: false,
    coach_chat: Boolean(s.features.coach_chat),
    outplacement: Boolean(s.features.outplacement),
    out09: Boolean(s.features.out09),
    experts: Boolean(s.features.experts),
    pricing: {
      carrera: s.pricing.carrera,
      plus: s.pricing.plus,
      out09_extra: s.pricing.out09_extra,
      psico_practica: s.pricing.psico_practica,
      whatsapp_addon: resolveWhatsappAddonCop(s),
      currency: s.pricing.currency,
    },
    payments: {
      wompi: Boolean(process.env.WOMPI_PUBLIC_KEY && process.env.WOMPI_PRIVATE_KEY),
      mercadopago: Boolean(process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN),
    },
    ai_limits: {
      free_ats_per_day: s.ai_limits.free_ats_per_day,
      out09_included_carrera: s.ai_limits.out09_included_carrera,
      out09_included_plus: s.ai_limits.out09_included_plus,
    },
  });
}
