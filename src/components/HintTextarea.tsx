"use client";

import { DictationButton } from "@/components/DictationButton";

/**
 * Ejemplo visible dentro del recuadro vacío.
 * Micrófono incluido por defecto.
 */
export function HintTextarea({
  value,
  onChange,
  example,
  hint,
  label,
  minClass = "min-h-32",
  withDictation = true,
  dictationLabel = "Dictar",
}: {
  value: string;
  onChange: (v: string) => void;
  example: string;
  hint?: string;
  label?: string;
  minClass?: string;
  withDictation?: boolean;
  dictationLabel?: string;
}) {
  const empty = !value.trim();
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium">{label}</label>}
      {hint && <p className="text-xs muted leading-relaxed">{hint}</p>}
      <div className="flex gap-2 items-start">
        <div className="relative flex-1 min-w-0">
          <textarea
            className={`field ${minClass}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={label || hint || "Texto"}
          />
          {empty && (
            <div
              className="pointer-events-none absolute inset-0 overflow-auto whitespace-pre-wrap text-sm"
              style={{ color: "#9a92ad", padding: "0.85rem 1rem" }}
              aria-hidden
            >
              {example}
            </div>
          )}
        </div>
        {withDictation && (
          <DictationButton
            label={dictationLabel}
            onResult={(t) => onChange(value ? `${value} ${t}`.trim() : t)}
          />
        )}
      </div>
    </div>
  );
}
