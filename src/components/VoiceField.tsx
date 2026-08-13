"use client";

import { DictationButton } from "@/components/DictationButton";

type Common = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  dictationLabel?: string;
  className?: string;
  required?: boolean;
};

/** Campo de una línea con micrófono al lado. */
export function VoiceInput({
  value,
  onChange,
  placeholder,
  label,
  hint,
  dictationLabel = "Dictar",
  className = "field",
  type = "text",
  required,
}: Common & { type?: "text" | "url" | "search" | "tel" }) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium">{label}</label>}
      {hint && <p className="text-xs muted leading-relaxed">{hint}</p>}
      <div className="flex gap-2 items-center">
        <input
          className={`${className} flex-1 min-w-0`}
          type={type}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <DictationButton
          label={dictationLabel}
          onResult={(t) => onChange(value ? `${value} ${t}`.trim() : t)}
        />
      </div>
    </div>
  );
}

/** Área de texto con micrófono al lado. */
export function VoiceTextarea({
  value,
  onChange,
  placeholder,
  label,
  hint,
  dictationLabel = "Dictar",
  className = "field min-h-24",
  required,
  minLength,
}: Common & { minLength?: number }) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium">{label}</label>}
      {hint && <p className="text-xs muted leading-relaxed">{hint}</p>}
      <div className="flex gap-2 items-start">
        <textarea
          className={`${className} flex-1 min-w-0`}
          value={value}
          required={required}
          minLength={minLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <DictationButton
          label={dictationLabel}
          onResult={(t) => onChange(value ? `${value} ${t}`.trim() : t)}
        />
      </div>
    </div>
  );
}
