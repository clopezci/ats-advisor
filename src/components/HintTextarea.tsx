"use client";

/**
 * Ejemplo visible dentro del recuadro vacío (no solo placeholder:
 * en varios celulares el placeholder multilínea no se ve y el campo parece en blanco).
 * Se oculta al escribir, dictar o cargar archivo.
 */
export function HintTextarea({
  value,
  onChange,
  example,
  hint,
  label,
  minClass = "min-h-32",
}: {
  value: string;
  onChange: (v: string) => void;
  example: string;
  hint?: string;
  label?: string;
  minClass?: string;
}) {
  const empty = !value.trim();
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium">{label}</label>}
      {hint && <p className="text-xs muted leading-relaxed">{hint}</p>}
      <div className="relative">
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
    </div>
  );
}
