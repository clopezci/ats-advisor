import { NextResponse } from "next/server";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";
import { deliverCapsule } from "@/lib/notify/deliverCapsule";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { createServiceSupabase } from "@/lib/supabase/client";
import { requireCronAuth } from "@/lib/admin/auth";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";
import { reportError } from "@/lib/observability";

/**
 * Daily microlearning push.
 * Auth: Authorization: Bearer CRON_SECRET (obligatorio en producción)
 */
export async function GET(req: Request) {
  const auth = requireCronAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const settings = await hydrateSettingsFromCloud();
    const day = Math.floor(Date.now() / 86400000);
    const mod = OUTPLACEMENT_MODULES[day % OUTPLACEMENT_MODULES.length];
    const cap = mod.capsules[day % mod.capsules.length];
    const payload = {
      moduleCode: mod.code,
      day: cap.day,
      title: cap.title,
      content: cap.content,
      quiz: cap.quiz,
      footer: settings.microlearning_footer,
    };

    const results: { channel: string; ok: boolean; skipped?: boolean }[] = [];

    const telegramIds = (process.env.TELEGRAM_BROADCAST_CHAT_IDS || process.env.TELEGRAM_OWNER_CHAT_ID || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (settings.features.telegram) {
      for (const id of telegramIds) {
        const r = await deliverCapsule("telegram", id, payload);
        results.push({ channel: `telegram:${id}`, ok: r.ok, skipped: "skipped" in r ? r.skipped : false });
      }
    }

    if (settings.features.whatsapp) {
      const waTo = process.env.WHATSAPP_BROADCAST_TO || "";
      if (waTo) {
        const r = await deliverCapsule("whatsapp", waTo, payload);
        results.push({ channel: "whatsapp", ok: r.ok, skipped: "skipped" in r ? r.skipped : false });
      }
    }

    const sb = createServiceSupabase();
    let cloudProfiles = 0;
    if (sb) {
      const { data } = await sb.from("profiles").select("learning_channel, email").limit(200);
      cloudProfiles = data?.length || 0;
    }

    await notifyOwnerTelegram(
      `Cron cápsulas: ${mod.code} · ${cap.title} · envíos OK ${results.filter((x) => x.ok).length} · perfiles cloud ${cloudProfiles}`
    );

    return NextResponse.json({ ok: true, module: mod.code, capsule: cap.title, results, cloudProfiles });
  } catch (e) {
    await reportError({ where: "api/cron/capsules", error: e, notifyOwner: true });
    return NextResponse.json({ error: "Cron cápsulas falló" }, { status: 500 });
  }
}
