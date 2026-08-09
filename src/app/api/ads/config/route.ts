import { NextResponse } from "next/server";
import { publicAdConfig } from "@/lib/ads/config";
import { readSettings } from "@/lib/settings";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";

/** Config pública de ads (sin secretos). */
export async function GET() {
  await hydrateSettingsFromCloud();
  const s = readSettings();
  const cfg = publicAdConfig();
  return NextResponse.json({
    enabled: Boolean(s.features.ads),
    ...cfg,
  });
}
