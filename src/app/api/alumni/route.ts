import { NextResponse } from "next/server";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";
import { readSettings } from "@/lib/settings";

/** Enlaces públicos de comunidad alumni (configurables en /admin). */
export async function GET() {
  await hydrateSettingsFromCloud();
  const s = readSettings();
  return NextResponse.json({
    ok: true,
    alumni: {
      telegram_url: s.alumni?.telegram_url || "",
      discord_url: s.alumni?.discord_url || "",
      ama_note: s.alumni?.ama_note || "",
      ama_next: s.alumni?.ama_next || "",
      ama_topic: s.alumni?.ama_topic || "",
    },
  });
}
