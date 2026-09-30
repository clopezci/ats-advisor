"use client";

import type { CSSProperties } from "react";
import { DictationButton } from "@/components/DictationButton";

type Common = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  /** Ejemplo en transparencia (solo visible si el campo está vacío). No se guarda. */
  example?: string;
  label?: string;
  hint?: string;
  dictationLabel?: string;
  className?: string;
  required?: boolean;
};

function ExampleGhost({ example, empty }: { example?: string; empty: boolean }) {
  if (!example || !empty) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-auto text-sm leading-relaxed whitespace-pre-wrap"
      style={{
        /* Texto legible tipo marca de agua (no usar opacity encima de --muted) */
        color: "rgba(31, 22, 48, 0.52)",
        padding: "0.85rem 1rem",
      }}
    >
      {example}
    </div>
  );
}

/** Campo vacío: fondo transparente para que se vea el ejemplo detrás. */
function emptyExampleStyle(empty: boolean, hasExample: boolean): CSSProperties | undefined {
  if (!empty || !hasExample) return undefined;
  return {
    background: "transparent",
    caretColor: "var(--text)",
    position: "relative",
    zIndex: 2,
  };
}

/** Campo de una línea con micrófono al lado. */
export function VoiceInput({
  value,
  onChange,
  placeholder,
  example,
  label,
  hint,
  dictationLabel = "Dictar",
  className = "field",
  type = "text",
  required,
}: Common & { type?: "text" | "url" | "search" | "tel" }) {
  const empty = !value.trim();
  const hasExample = Boolean(example);
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium">{label}</label>}
      {hint && <p className="text-xs muted leading-relaxed">{hint}</p>}
      {hasExample ? (
        <p className="text-[0.7rem] muted leading-relaxed">
          Ejemplo guía — escribe tu caso; el texto de ejemplo desaparece al escribir.
        </p>
      ) : null}
      <div className="flex gap-2 items-center">
        <div
          className="relative flex-1 min-w-0 rounded-[var(--radius)]"
          style={hasExample && empty ? { background: "#fff" } : undefined}
        >
          <ExampleGhost example={example} empty={empty} />
          <input
            className={`${className} w-full`}
            type={type}
            value={value}
            required={required}
            onChange={(e) => onChange(e.target.value)}
            placeholder={hasExample ? undefined : placeholder}
            style={emptyExampleStyle(empty, hasExample)}
          />
        </div>
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
  example,
  label,
  hint,
  dictationLabel = "Dictar",
  className = "field min-h-24",
  required,
  minLength,
}: Common & { minLength?: number }) {
  const empty = !value.trim();
  const hasExample = Boolean(example);
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium">{label}</label>}
      {hint && <p className="text-xs muted leading-relaxed">{hint}</p>}
      {hasExample ? (
        <p className="text-[0.7rem] muted leading-relaxed">
          Ejemplo guía — escribe tu caso; el texto de ejemplo desaparece al escribir.
        </p>
      ) : null}
      <div className="flex gap-2 items-start">
        <div
          className="relative flex-1 min-w-0 rounded-[var(--radius)]"
          style={hasExample && empty ? { background: "#fff" } : undefined}
        >
          <ExampleGhost example={example} empty={empty} />
          <textarea
            className={`${className} w-full`}
            value={value}
            required={required}
            minLength={minLength}
            onChange={(e) => onChange(e.target.value)}
            placeholder={hasExample ? undefined : placeholder}
            style={emptyExampleStyle(empty, hasExample)}
          />
        </div>
        <DictationButton
          label={dictationLabel}
          onResult={(t) => onChange(value ? `${value} ${t}`.trim() : t)}
        />
      </div>
    </div>
  );
}
