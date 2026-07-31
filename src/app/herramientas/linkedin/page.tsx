"use client";

import { useState } from "react";
import Link from "next/link";
import { DictationButton } from "@/components/DictationButton";
import { SpeakButton } from "@/components/SpeakButton";

export default function LinkedInToolPage() {
  const [role, setRole] = useState("");
  const [value, setValue] = useState("");
  const [niche, setNiche] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "general",
          prompt: `Crea headline + About de LinkedIn en español LATAM (ATS-friendly). Cargo: ${role}. Valor: ${value}. Nicho: ${niche}. Devuelve Headline (1 línea) y About (120-160 palabras) con 3 logros estilo STAR sin inventar empresas.`,
        }),
      });
      const data = await res.json();
      setOut(data.text || data.error || "Sin respuesta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Optimizador LinkedIn</h1>
          <SpeakButton text="Genera headline y extracto de LinkedIn alineados a ATS." />
        </div>
      </section>
      <label className="text-sm">
        Cargo objetivo
        <div className="mt-1 flex gap-2">
          <input className="field" value={role} onChange={(e) => setRole(e.target.value)} />
          <DictationButton onResult={(t) => setRole((p) => (p ? `${p} ${t}` : t))} />
        </div>
      </label>
      <label className="text-sm">
        Valor que entregas
        <input className="field mt-1" value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <label className="text-sm">
        Nicho / industria
        <input className="field mt-1" value={niche} onChange={(e) => setNiche(e.target.value)} />
      </label>
      <button type="button" className="btn-primary" disabled={loading || !role} onClick={generate}>
        {loading ? "Generando…" : "Generar"}
      </button>
      {out && (
        <section className="bento-card">
          <SpeakButton text={out} />
          <p className="mt-2 text-sm muted whitespace-pre-wrap">{out}</p>
        </section>
      )}
      <Link href="/herramientas" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
