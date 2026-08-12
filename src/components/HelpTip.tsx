"use client";

import { useState } from "react";

/** Título + explicación al tocar (móvil) o pasar el cursor (PC). */
export function HelpTip({
  label,
  help,
  as = "h2",
}: {
  label: string;
  help: string;
  as?: "h2" | "h1" | "span";
}) {
  const [open, setOpen] = useState(false);
  const TitleTag = as;

  return (
    <div className="space-y-1">
      <div className="flex items-start gap-2">
        <TitleTag className="text-sm font-semibold flex-1">{label}</TitleTag>
        <button
          type="button"
          className="shrink-0 rounded-full border text-[11px] leading-none px-1.5 py-1 muted"
          style={{ borderColor: "var(--border)" }}
          aria-expanded={open}
          aria-label={`Qué significa: ${label}`}
          title={help}
          onClick={() => setOpen((v) => !v)}
        >
          ?
        </button>
      </div>
      {open && <p className="text-xs muted leading-relaxed">{help}</p>}
    </div>
  );
}
