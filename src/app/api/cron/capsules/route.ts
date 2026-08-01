import { NextResponse } from "next/server";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";
import { deliverCapsule } from "@/lib/notify/deliverCapsule";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { createServiceSupabase } from "@/lib/supabase/client";
import { readSettings } from "@/lib/settings";

/**
 * Daily microlearning push.
 * Auth: Authorization: Bearer CRON_SECRET
 * Recipients: TELEGRAM_BROADCAST_CHAT_IDS (comma) and/or profiles with learning_channel when Supabase is up.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") || "";
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const day = Math.floor(Date.now() / 86400000);
  const mod = OUTPLACEMENT_MODULES[day % OUTPLACEMENT_MODULES.length];
  const cap = mod.capsules[day % mod.capsules.length];
  const payload = {
    moduleCode: mod.code,
    day: cap.day,
    title: cap.title,
    content: cap.content,
    quiz: cap.quiz,
  };

  const results: { channel: string; ok: boolean; skipped?: boolean }[] = [];
  const settings = readSettings();

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
  if (sb) {
    const { data } = await sb.from("profiles").select("learning_channel, email").limit(200);
    // Cloud fan-out requires stored chat ids — log count for now
    await notifyOwnerTelegram(
      `Cron cápsulas: ${mod.code} · perfiles cloud ${data?.length || 0} · envíos ${results.filter((x) => x.ok).length}`
    );
  } else {
    await notifyOwnerTelegram(
      `Cron cápsulas: ${mod.code} · ${cap.title} · envíos ${results.filter((x) => x.ok).length}`
    );
  }

  return NextResponse.json({ ok: true, module: mod.code, capsule: cap.title, results });
}
