import { NextResponse } from "next/server";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { formatCapsuleText } from "@/lib/notify/deliverCapsule";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";
import { createServiceSupabase } from "@/lib/supabase/client";

function capsuleForChat(chatId: number) {
  const day = Math.floor(Date.now() / 86400000);
  const seed = Math.abs(chatId) + day;
  const mod = OUTPLACEMENT_MODULES[seed % OUTPLACEMENT_MODULES.length];
  const cap = mod.capsules[seed % mod.capsules.length];
  return { mod, cap };
}

function verifyTelegramSecret(req: Request): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) {
    const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
    return !isProd;
  }
  const got = req.headers.get("x-telegram-bot-api-secret-token");
  return Boolean(got && got === expected);
}

async function persistTelegramChat(chatId: number, username?: string) {
  const sb = createServiceSupabase();
  if (!sb) return;
  const id = String(chatId);
  const { data: profiles } = await sb
    .from("profiles")
    .select("id")
    .eq("telegram_chat_id", id)
    .limit(1);
  if (profiles?.length) return;
  await sb.from("audit_events").insert({
    kind: "telegram_subscriber",
    detail: { chat_id: id, username: username || null, at: new Date().toISOString() },
  });
}

async function linkTelegramToEmail(chatId: number, email: string) {
  const sb = createServiceSupabase();
  if (!sb) return { ok: false as const, reason: "no_supabase" };
  const em = email.trim().toLowerCase();
  const { data: profile } = await sb.from("profiles").select("id").eq("email", em).maybeSingle();
  if (!profile) return { ok: false as const, reason: "no_profile" };
  await sb
    .from("profiles")
    .update({
      telegram_chat_id: String(chatId),
      learning_channel: "telegram",
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);
  return { ok: true as const };
}

export async function POST(req: Request) {
  const limited = rateLimit(req, "tg-webhook", { limit: 60, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  if (!verifyTelegramSecret(req)) {
    return NextResponse.json({ error: "Webhook no autorizado" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: "TELEGRAM_BOT_TOKEN no configurado" }, { status: 503 });
  }

  try {
    const update = await req.json().catch(() => null);
    if (!update || typeof update !== "object") {
      return NextResponse.json({ error: "Body inválido" }, { status: 400 });
    }

    const chatId = update?.message?.chat?.id as number | undefined;
    const username = update?.message?.from?.username as string | undefined;
    const text = String(update?.message?.text || "");

    const { mod, cap } = capsuleForChat(Number(chatId || 0));

    let reply = "ATSAdvisor: /start /capsula /progreso /vincular /ayuda";
    if (text.startsWith("/start")) {
      if (chatId) await persistTelegramChat(chatId, username);
      reply =
        "Bienvenido a ATSAdvisor. Usa /capsula para tu microaprendizaje del día.\n" +
        "Para vincular tu cuenta: /vincular tu@correo.com\n" +
        "El progreso detallado vive en la PWA.";
    } else if (text.startsWith("/capsula")) {
      reply = formatCapsuleText({
        moduleCode: mod.code,
        day: cap.day,
        title: cap.title,
        content: cap.content,
        quiz: cap.quiz,
      });
    } else if (text.startsWith("/progreso")) {
      reply = `Hoy te toca ${mod.code} · ${mod.title} (día ${cap.day}/${mod.days}: ${cap.title}).\nCompleta quizzes en la PWA → Outplacement.`;
    } else if (text.startsWith("/vincular")) {
      const email = text.replace(/^\/vincular\s*/i, "").trim();
      if (!email.includes("@") || !chatId) {
        reply = "Uso: /vincular tu@correo.com (el mismo del magic link / checkout).";
      } else {
        const r = await linkTelegramToEmail(chatId, email);
        reply = r.ok
          ? `Listo. Telegram vinculado a ${email.toLowerCase()}.`
          : r.reason === "no_profile"
            ? "No hay perfil con ese correo. Entra primero a la PWA con magic link y vuelve a /vincular."
            : "No pude vincular (Supabase). Avisa al owner.";
      }
    } else if (text.startsWith("/ayuda")) {
      reply = "Comandos: /start /capsula /progreso /vincular correo@x.com /ayuda";
    } else if (text.startsWith("/alerta_owner_test")) {
      if (String(chatId) === String(process.env.TELEGRAM_OWNER_CHAT_ID || "")) {
        await notifyOwnerTelegram("Test de alerta desde bot Telegram");
        reply = "Alerta enviada al owner.";
      } else {
        reply = "Comando solo disponible para el owner.";
      }
    }

    if (chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: reply }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    await reportError({ where: "api/webhooks/telegram", error: e, notifyOwner: true });
    return NextResponse.json({ error: "Error procesando update" }, { status: 500 });
  }
}
