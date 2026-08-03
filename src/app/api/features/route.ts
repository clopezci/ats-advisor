import { NextResponse } from "next/server";
import { readSettings } from "@/lib/settings";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";

/** Flags públicos seguros para el cliente (sin secretos). */
export async function GET() {
  await hydrateSettingsFromCloud();
  const s = readSettings();
  return NextResponse.json({
    ads: Boolean(s.features.ads),
    telegram: Boolean(s.features.telegram),
    whatsapp: Boolean(s.features.whatsapp),
    guarantee: Boolean(s.features.guarantee),
    coach_chat: Boolean(s.features.coach_chat),
  });
}
