"use client";

import {
  CHANNEL_CHOICE_INTRO,
  channelQuotes,
  formatCop,
  type LearningChannel,
  type WhatsappCostModel,
} from "@/lib/channels/pricing";

export function ChannelChooser({
  value,
  onChange,
  waModel,
  whatsappPriceCop,
  showIntro = true,
}: {
  value: LearningChannel;
  onChange: (c: LearningChannel) => void;
  waModel?: WhatsappCostModel;
  whatsappPriceCop?: number;
  showIntro?: boolean;
}) {
  const quotes = channelQuotes(waModel).map((q) => {
    if (q.channel !== "whatsapp" || whatsappPriceCop == null) return q;
    return {
      ...q,
      priceCop: whatsappPriceCop,
      shortBadge: `${formatCop(whatsappPriceCop)}/mes`,
      userMessage: [
        `WhatsApp: ${formatCop(whatsappPriceCop)} al mes.`,
        "Ese valor ya incluye el sobrecosto de la mensajería que cobra Meta (y la operación del canal).",
        "Por eso WhatsApp no es gratis: Meta factura cada mensaje/plantilla que te enviamos.",
        "Si prefieres el mismo contenido sin ese sobrecosto, elige Telegram (gratis) o solo la app.",
      ].join(" "),
    };
  });
  const selected = quotes.find((q) => q.channel === value) || quotes[0];

  return (
    <div className="space-y-3">
      {showIntro && <p className="text-sm muted">{CHANNEL_CHOICE_INTRO}</p>}
      <div className="flex flex-col gap-2">
        {quotes.map((q) => (
          <button
            key={q.channel}
            type="button"
            className="btn-secondary text-left"
            style={
              value === q.channel
                ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                : undefined
            }
            onClick={() => onChange(q.channel)}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="font-medium">{q.label}</span>
              <span className="text-xs pill-brand">{q.shortBadge}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs muted">{selected.userMessage}</p>
    </div>
  );
}
