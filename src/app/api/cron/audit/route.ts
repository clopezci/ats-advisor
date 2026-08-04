import { NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/admin/auth";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";
import { readSettings } from "@/lib/settings";
import { reportError, reportHealthToTelegram } from "@/lib/observability";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = requireCronAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    await hydrateSettingsFromCloud();
    const settings = readSettings();
    const health = await reportHealthToTelegram({ force: true });

    return NextResponse.json({
      ok: true,
      health: health.snap,
      telegramSent: health.sent,
      pricing: settings.pricing,
      features: settings.features,
    });
  } catch (e) {
    await reportError({ where: "api/cron/audit", error: e, notifyOwner: true });
    return NextResponse.json({ error: "Auditoría falló" }, { status: 500 });
  }
}
