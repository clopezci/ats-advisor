import { NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/admin/auth";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";
import { createServiceSupabase } from "@/lib/supabase/client";
import { sendTelegramText, notifyOwnerTelegram } from "@/lib/notify/channels";
import { formatCuadernilloTelegramReply } from "@/lib/workbook/accountability";
import { reportError } from "@/lib/observability";

export const runtime = "nodejs";

/**
 * Accountability semanal del cuadernillo → Telegram (perfiles Carrera vinculados).
 * Programar 1×/semana en vercel.json.
 */
export async function GET(req: Request) {
  const auth = requireCronAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const settings = await hydrateSettingsFromCloud();
    if (!settings.features.telegram) {
      return NextResponse.json({ ok: true, skipped: "telegram_off" });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ats-advisor-two.vercel.app";
    const text = formatCuadernilloTelegramReply(appUrl);

    const sb = createServiceSupabase();
    const results: { chat: string; ok: boolean }[] = [];
    let sent = 0;

    if (sb) {
      const { data } = await sb
        .from("profiles")
        .select("telegram_chat_id, plan, email")
        .not("telegram_chat_id", "is", null)
        .limit(500);

      for (const p of data || []) {
        const chat = String(p.telegram_chat_id || "").trim();
        if (!chat) continue;
        const paid = ["carrera", "plus", "tester"].includes(String(p.plan || ""));
        if (!paid) continue;
        const r = await sendTelegramText(chat, text);
        results.push({ chat, ok: r.ok });
        if (r.ok) sent += 1;
      }
    }

    // Fallback: broadcast list / owner if no profiles
    if (sent === 0) {
      const ids = (process.env.TELEGRAM_BROADCAST_CHAT_IDS || process.env.TELEGRAM_OWNER_CHAT_ID || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      for (const id of ids) {
        const r = await sendTelegramText(id, text);
        results.push({ chat: id, ok: r.ok });
        if (r.ok) sent += 1;
      }
    }

    await notifyOwnerTelegram(`Cron cuadernillo: enviados ${sent}/${results.length}`);

    return NextResponse.json({ ok: true, sent, total: results.length });
  } catch (e) {
    await reportError({ where: "api/cron/cuadernillo", error: e, notifyOwner: true });
    return NextResponse.json({ error: "Cron cuadernillo falló" }, { status: 500 });
  }
}
