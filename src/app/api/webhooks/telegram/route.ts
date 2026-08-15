import { NextResponse } from "next/server";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";
import { notifyOwnerTelegram, sendResendEmail } from "@/lib/notify/channels";
import { formatCapsuleText } from "@/lib/notify/deliverCapsule";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";
import { createServiceSupabase } from "@/lib/supabase/client";
import { isValidEmail, escapeHtml } from "@/lib/validation";
import { buildCapsuleForCursor } from "@/lib/courses/capsuleForProfile";
import { outModuleShort } from "@/lib/outplacement/labels";

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

function otpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
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

/** Inicia OTP: guarda código en perfil + audit; envía correo. */
async function startTelegramLinkOtp(chatId: number, email: string) {
  const sb = createServiceSupabase();
  if (!sb) return { ok: false as const, reason: "no_supabase" };
  const em = email.trim().toLowerCase();
  if (!isValidEmail(em)) return { ok: false as const, reason: "bad_email" };

  const { data: profile } = await sb.from("profiles").select("id, email").eq("email", em).maybeSingle();
  if (!profile) return { ok: false as const, reason: "no_profile" };

  const code = otpCode();
  const expires = new Date(Date.now() + 15 * 60_000).toISOString();

  await sb
    .from("profiles")
    .update({
      telegram_link_code: code,
      telegram_link_expires: expires,
      telegram_link_chat_id: String(chatId),
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  await sb.from("audit_events").insert({
    kind: "telegram_link_otp",
    detail: { email: em, chat_id: String(chatId), expires, at: new Date().toISOString() },
  });

  const mail = await sendResendEmail({
    to: em,
    subject: "ATSAdvisor — código para vincular Telegram",
    html: `<p>Tu código para vincular Telegram es:</p><p style="font-size:28px;letter-spacing:4px"><strong>${escapeHtml(
      code
    )}</strong></p><p>En Telegram escribe: <code>/confirmar ${escapeHtml(code)}</code></p><p>Caduca en 15 minutos.</p>`,
  });

  if (!mail.ok && !mail.skipped) return { ok: false as const, reason: "email_fail" };
  if (mail.skipped) {
    // Sin Resend: notificar owner con el código (dev / fallback)
    await notifyOwnerTelegram(`OTP Telegram para ${em} (chat ${chatId}): ${code}`);
  }

  return { ok: true as const, emailed: mail.ok, skippedEmail: Boolean(mail.skipped) };
}

async function confirmTelegramLinkOtp(chatId: number, codeRaw: string) {
  const sb = createServiceSupabase();
  if (!sb) return { ok: false as const, reason: "no_supabase" };
  const code = String(codeRaw || "").trim();
  if (!/^\d{6}$/.test(code)) return { ok: false as const, reason: "bad_code" };

  const { data: profile } = await sb
    .from("profiles")
    .select("id, email, telegram_link_code, telegram_link_expires, telegram_link_chat_id")
    .eq("telegram_link_code", code)
    .maybeSingle();

  if (!profile) return { ok: false as const, reason: "not_found" };
  if (String(profile.telegram_link_chat_id || "") !== String(chatId)) {
    return { ok: false as const, reason: "chat_mismatch" };
  }
  const exp = profile.telegram_link_expires ? new Date(profile.telegram_link_expires).getTime() : 0;
  if (!exp || Date.now() > exp) return { ok: false as const, reason: "expired" };

  await sb
    .from("profiles")
    .update({
      telegram_chat_id: String(chatId),
      learning_channel: "telegram",
      telegram_link_code: null,
      telegram_link_expires: null,
      telegram_link_chat_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  return { ok: true as const, email: profile.email as string };
}

async function profileCursorForChat(chatId: number) {
  const sb = createServiceSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("profiles")
    .select("learning_course_id, learning_lesson_id, email, plan")
    .eq("telegram_chat_id", String(chatId))
    .maybeSingle();
  return data;
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

    let reply =
      "ATSAdvisor: /start /capsula /progreso /cuadernillo /vincular /confirmar /ayuda";
    if (text.startsWith("/start")) {
      if (chatId) await persistTelegramChat(chatId, username);
      reply =
        "Bienvenido a ATSAdvisor. Usa /capsula para tu microaprendizaje del día.\n" +
        "Usa /cuadernillo para el tip de accountability de transición.\n" +
        "Para vincular tu cuenta: /vincular tu@correo.com → te enviamos un código → /confirmar 123456\n" +
        "El progreso detallado vive en la PWA.";
    } else if (text.startsWith("/capsula")) {
      if (chatId) {
        const prof = await profileCursorForChat(chatId);
        const built = buildCapsuleForCursor(prof?.learning_course_id, prof?.learning_lesson_id);
        reply = formatCapsuleText({
          moduleCode: built.moduleCode,
          day: built.day,
          title: built.title,
          content: built.content,
          quiz: built.quiz,
        });
      } else {
        reply = formatCapsuleText({
          moduleCode: outModuleShort(mod.code),
          day: cap.day,
          title: cap.title,
          content: cap.content,
          quiz: cap.quiz,
        });
      }
    } else if (text.startsWith("/progreso")) {
      if (chatId) {
        const prof = await profileCursorForChat(chatId);
        if (prof?.learning_course_id && prof?.learning_lesson_id) {
          reply = `Continúa hoy: ${prof.learning_course_id} → ${prof.learning_lesson_id}.\nAbre Tablero en la PWA y marca la tarea.`;
        } else {
          reply = `Hoy te toca ${mod.title} (día ${cap.day}/${mod.days}: ${cap.title}).\nVincula tu cuenta y usa la PWA para guardar el cursor.`;
        }
      } else {
        reply = `Hoy te toca ${mod.title}.`;
      }
    } else if (text.startsWith("/vincular")) {
      const email = text.replace(/^\/vincular\s*/i, "").trim();
      if (!isValidEmail(email) || !chatId) {
        reply = "Uso: /vincular tu@correo.com (el mismo del magic link / checkout).";
      } else {
        const r = await startTelegramLinkOtp(chatId, email);
        if (r.ok) {
          reply = r.skippedEmail
            ? `Código generado para ${email.toLowerCase()}. Revisa correo (o avisa al owner si no llega Resend). Luego: /confirmar 123456`
            : `Te enviamos un código a ${email.toLowerCase()}. Cuando llegue, escribe: /confirmar 123456 (válido 15 min).`;
        } else if (r.reason === "no_profile") {
          reply = "No hay perfil con ese correo. Entra primero a la PWA con magic link y vuelve a /vincular.";
        } else if (r.reason === "bad_email") {
          reply = "Correo inválido. Ejemplo: /vincular tu@empresa.com";
        } else {
          reply = "No pude iniciar la vinculación (Supabase/email). Avisa al owner.";
        }
      }
    } else if (text.startsWith("/confirmar")) {
      const code = text.replace(/^\/confirmar\s*/i, "").trim();
      if (!chatId) {
        reply = "No pude leer tu chat.";
      } else {
        const r = await confirmTelegramLinkOtp(chatId, code);
        if (r.ok) {
          reply = `Listo. Telegram vinculado a ${r.email}. Ya puedes recibir cápsulas personalizadas.`;
        } else if (r.reason === "expired") {
          reply = "Código vencido. Pide otro con /vincular tu@correo.com";
        } else if (r.reason === "chat_mismatch") {
          reply = "Ese código no corresponde a este chat. Usa el mismo Telegram donde pediste /vincular.";
        } else if (r.reason === "not_found" || r.reason === "bad_code") {
          reply = "Código incorrecto. Revisa el correo o pide uno nuevo con /vincular.";
        } else {
          reply = "No pude confirmar (Supabase). Avisa al owner.";
        }
      }
    } else if (text.startsWith("/cuadernillo")) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ats-advisor-two.vercel.app";
      const { formatCuadernilloTelegramReply } = await import("@/lib/workbook/accountability");
      reply = formatCuadernilloTelegramReply(appUrl);
    } else if (text.startsWith("/ayuda")) {
      reply =
        "Comandos: /start /capsula /progreso /cuadernillo /vincular correo@x.com /confirmar 123456 /ayuda";
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
