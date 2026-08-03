import {
  CHANNEL_CHOICE_INTRO,
  channelQuotes,
  formatCop,
  type LearningChannel,
  type WhatsappCostModel,
  whatsappFinalPriceCop,
} from "@/lib/channels/pricing";
import { readSettings, resolveWhatsappAddonCop } from "@/lib/settings";

/** Quotes usando settings actuales (precio final WA ya resuelto). */
export function liveChannelQuotes() {
  const s = readSettings();
  const model: WhatsappCostModel = {
    metaMidMonthlyCop: s.whatsapp_cost.meta_mid_monthly_cop,
    marginPercent: s.whatsapp_cost.margin_percent,
    msgsPerMonth: s.whatsapp_cost.msgs_per_month,
  };
  const quotes = channelQuotes(model);
  const finalWa = resolveWhatsappAddonCop(s);
  return quotes.map((q) =>
    q.channel === "whatsapp"
      ? {
          ...q,
          priceCop: finalWa,
          shortBadge: `${formatCop(finalWa)}/mes`,
          userMessage: [
            `WhatsApp: ${formatCop(finalWa)} al mes.`,
            "Ese valor ya incluye el sobrecosto de la mensajería que cobra Meta (y la operación del canal).",
            "Por eso WhatsApp no es gratis: Meta factura cada mensaje/plantilla que te enviamos.",
            "Si prefieres el mismo contenido sin ese sobrecosto, elige Telegram (gratis) o solo la app.",
          ].join(" "),
        }
      : q
  );
}

export {
  CHANNEL_CHOICE_INTRO,
  formatCop,
  whatsappFinalPriceCop,
  type LearningChannel,
  type WhatsappCostModel,
};
