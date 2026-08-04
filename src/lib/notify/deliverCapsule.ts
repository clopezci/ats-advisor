import type { CapsulePayload } from "@/lib/notify/whatsapp";
import { sendWhatsAppCapsule } from "@/lib/notify/whatsapp";

export type DeliveryChannel = "telegram" | "whatsapp" | "pwa";

export function formatCapsuleText(capsule: CapsulePayload & { moduleCode?: string; footer?: string }) {
  const head = capsule.moduleCode ? `${capsule.moduleCode} · ${capsule.title}` : capsule.title;
  let text = `${head}\n\n${capsule.content}`;
  if (capsule.quiz) {
    text += `\n\nQuiz: ${capsule.quiz.question}\n`;
    text += capsule.quiz.options.map((o, i) => `${i + 1}) ${o}`).join("\n");
  }
  if (capsule.day != null) text = `Día ${capsule.day} · ${text}`;
  if (capsule.footer) text += `\n\n—\n${capsule.footer}`;
  return text.slice(0, 3500);
}

export async function sendTelegramCapsule(chatId: string | number, capsule: CapsulePayload & { moduleCode?: string }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) return { ok: false as const, skipped: true, reason: "telegram_not_configured" };
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: formatCapsuleText(capsule) }),
  });
  return { ok: res.ok, skipped: false as const };
}

export async function deliverCapsule(
  channel: DeliveryChannel,
  to: string,
  capsule: CapsulePayload & { moduleCode?: string }
) {
  if (channel === "whatsapp") return sendWhatsAppCapsule(to, capsule);
  if (channel === "telegram") return sendTelegramCapsule(to, capsule);
  return { ok: true as const, skipped: true as const, reason: "pwa_only" };
}
