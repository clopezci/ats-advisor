import { NextResponse } from "next/server";
import { deliverCapsule } from "@/lib/notify/deliverCapsule";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { createServiceSupabase } from "@/lib/supabase/client";
import { requireCronAuth } from "@/lib/admin/auth";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";
import { reportError } from "@/lib/observability";
import { buildCapsuleForCursor, buildGlobalDayCapsule } from "@/lib/courses/capsuleForProfile";

/**
 * Daily microlearning push — lección del cursor del usuario (o del día global).
 */
export async function GET(req: Request) {
  const auth = requireCronAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const settings = await hydrateSettingsFromCloud();
    const fallback = buildGlobalDayCapsule(settings.microlearning_footer);

    const results: { channel: string; ok: boolean; skipped?: boolean }[] = [];

    const telegramIds = (process.env.TELEGRAM_BROADCAST_CHAT_IDS || process.env.TELEGRAM_OWNER_CHAT_ID || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (settings.features.telegram) {
      for (const id of telegramIds) {
        const r = await deliverCapsule("telegram", id, fallback);
        results.push({ channel: `telegram:${id}`, ok: r.ok, skipped: "skipped" in r ? r.skipped : false });
      }
    }

    if (settings.features.whatsapp) {
      const waTo = process.env.WHATSAPP_BROADCAST_TO || "";
      if (waTo) {
        const r = await deliverCapsule("whatsapp", waTo, fallback);
        results.push({ channel: "whatsapp", ok: r.ok, skipped: "skipped" in r ? r.skipped : false });
      }
    }

    const sb = createServiceSupabase();
    let cloudProfiles = 0;
    let personalized = 0;
    if (sb && settings.features.telegram) {
      const { data } = await sb
        .from("profiles")
        .select(
          "learning_channel, email, telegram_chat_id, plan, learning_course_id, learning_lesson_id"
        )
        .not("telegram_chat_id", "is", null)
        .limit(500);
      cloudProfiles = data?.length || 0;
      for (const p of data || []) {
        const chat = String(p.telegram_chat_id || "").trim();
        if (!chat) continue;
        const paid = ["carrera", "plus", "tester"].includes(String(p.plan || ""));
        if (!paid) continue;
        if (telegramIds.includes(chat)) continue;

        const payload = buildCapsuleForCursor(
          p.learning_course_id,
          p.learning_lesson_id,
          settings.microlearning_footer
        );
        if (p.learning_course_id && p.learning_lesson_id) personalized += 1;

        const r = await deliverCapsule("telegram", chat, payload);
        results.push({
          channel: `telegram:user:${chat}`,
          ok: r.ok,
          skipped: "skipped" in r ? r.skipped : false,
        });
      }
    } else if (sb) {
      const { data } = await sb.from("profiles").select("email").limit(200);
      cloudProfiles = data?.length || 0;
    }

    await notifyOwnerTelegram(
      `Cron cápsulas: ${fallback.moduleCode} · ${fallback.title} · OK ${results.filter((x) => x.ok).length} · perfiles ${cloudProfiles} · personalizadas ${personalized}`
    );

    return NextResponse.json({
      ok: true,
      fallback: { module: fallback.moduleCode, title: fallback.title },
      results,
      cloudProfiles,
      personalized,
    });
  } catch (e) {
    await reportError({ where: "api/cron/capsules", error: e, notifyOwner: true });
    return NextResponse.json({ error: "Cron cápsulas falló" }, { status: 500 });
  }
}
