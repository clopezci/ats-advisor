export async function notifyOwnerTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_OWNER_CHAT_ID;
  if (!token || !chatId) return { ok: false as const, skipped: true };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: `ATSAdvisor\n${message}`.slice(0, 3500),
    }),
  });
  return { ok: res.ok, skipped: false };
}

/** Envía a un chat_id arbitrario (aliado experto). */
export async function notifyTelegramChat(chatId: string, message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const id = String(chatId || "").trim();
  if (!token || !id) return { ok: false as const, skipped: true };
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: id,
      text: `ATSAdvisor · solicitud experto\n${message}`.slice(0, 3500),
    }),
  });
  return { ok: res.ok, skipped: false };
}

export async function sendResendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "ATSAdvisor <onboarding@resend.dev>";
  if (!key) return { ok: false as const, skipped: true };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: opts.to, subject: opts.subject, html: opts.html }),
  });
  return { ok: res.ok, skipped: false };
}
