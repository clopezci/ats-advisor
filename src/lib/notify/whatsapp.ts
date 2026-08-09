/**
 * WhatsApp microlearning adapter (stub until Meta/BSP tokens exist).
 * Same capsule shape as Telegram so Plus can switch channels without rewriting content.
 */
export type CapsulePayload = {
  title: string;
  content: string;
  day?: number;
  quiz?: { question: string; options: string[]; answer: number };
};

export async function sendWhatsAppCapsule(to: string, capsule: CapsulePayload) {
  return sendWhatsAppText(
    to,
    `ATSAdvisor · ${capsule.title}\n\n${capsule.content}`.slice(0, 3500)
  );
}

/** Texto libre (avisos a aliados, etc.). */
export async function sendWhatsAppText(to: string, text: string) {
  const token = process.env.WHATSAPP_TOKEN || process.env.META_WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId || !to) {
    return { ok: false as const, skipped: true as const, reason: "whatsapp_not_configured" };
  }

  const body = {
    messaging_product: "whatsapp",
    to: to.replace(/\D/g, ""),
    type: "text",
    text: { body: text.slice(0, 3500) },
  };

  const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return { ok: res.ok, skipped: false as const };
}
