"use client";

import { useState } from "react";
import { DictationButton } from "@/components/DictationButton";
import { HintTextarea } from "@/components/HintTextarea";
import { CV_EXAMPLE, JOB_EXAMPLE } from "@/lib/copy/fieldExamples";

async function extractCvFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/ats/extract", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "No se pudo leer el archivo");
  return String(data.text || "");
}

export function CvPasteField({
  value,
  onChange,
  label = "Tu hoja de vida",
  hint = "Esto es el CV TUYO (PDF o Word), no el aviso de empleo. Súbelo, pégalo o dicta.",
  framed = true,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  hint?: string;
  framed?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      onChange(await extractCvFile(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setUploading(false);
    }
  }

  const body = (
    <>
      <HintTextarea value={value} onChange={onChange} example={CV_EXAMPLE} hint={hint} label={label} />
      <label className="btn-secondary cursor-pointer text-center">
        {uploading ? "Leyendo archivo…" : "Cargar CV (PDF o Word)"}
        <input
          type="file"
          className="sr-only"
          accept=".pdf,.docx,.txt,.md,application/pdf"
          onChange={(e) => {
            onFile(e.target.files?.[0] || null);
            e.target.value = "";
          }}
        />
      </label>
      {error && (
        <p className="text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <DictationButton label="Dictar texto del CV" onResult={(t) => onChange(value ? `${value} ${t}` : t)} />
        <span className="text-xs muted">O dicta el texto</span>
      </div>
    </>
  );

  if (!framed) return <div className="space-y-2">{body}</div>;
  return <div className="bento-card space-y-2">{body}</div>;
}

export function JobPasteField({
  value,
  onChange,
  label = "La oferta de empleo",
  hint = "Copia el aviso completo (título, requisitos y funciones) desde el portal o el correo. Esto NO es tu CV.",
  example = JOB_EXAMPLE,
  framed = true,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  hint?: string;
  example?: string;
  framed?: boolean;
}) {
  const body = (
    <>
      <HintTextarea value={value} onChange={onChange} example={example} hint={hint} label={label} />
      <div className="flex items-center gap-2">
        <DictationButton label="Dictar la oferta" onResult={(t) => onChange(value ? `${value} ${t}` : t)} />
        <span className="text-xs muted">O dicta el aviso</span>
      </div>
    </>
  );
  if (!framed) return <div className="space-y-2">{body}</div>;
  return <div className="bento-card space-y-2">{body}</div>;
}
