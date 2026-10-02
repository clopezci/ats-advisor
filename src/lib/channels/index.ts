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
          shortBadge: finalWa > 0 ? `${formatCop(finalWa)}/mes` : "Incluido en Carrera",
          userMessage:
            finalWa > 0
              ? [
                  `WhatsApp: ${formatCop(finalWa)} al mes.`,
                  "Ese valor ya incluye el sobrecosto de Meta.",
                  "Si prefieres sin ese sobrecosto, elige Telegram o solo la app.",
                ].join(" ")
              : q.userMessage,
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
