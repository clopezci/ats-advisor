"use client";

import {
  CHANNEL_CHOICE_INTRO,
  channelQuotes,
  type LearningChannel,
  type WhatsappCostModel,
} from "@/lib/channels/pricing";

export function ChannelChooser({
  value,
  onChange,
  waModel,
  showIntro = true,
}: {
  value: LearningChannel;
  onChange: (c: LearningChannel) => void;
  waModel?: WhatsappCostModel;
  /** @deprecated WhatsApp ya no se cobra aparte. */
  whatsappPriceCop?: number;
  showIntro?: boolean;
}) {
  const quotes = channelQuotes(waModel);
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
            <span className="flex w-full items-center justify-between gap-2">
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
