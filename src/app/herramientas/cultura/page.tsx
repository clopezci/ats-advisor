"use client";

import { useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput, VoiceTextarea } from "@/components/VoiceField";

export default function CulturaPage() {
  const [company, setCompany] = useState("");
  const [jd, setJd] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "general",
          useKnowledge: true,
          prompt: `Eres coach de empleabilidad. Empresa: ${company || "N/D"}. Oferta:\n${jd.slice(0, 3000)}\n\nInfiere valores/cultura SOLO a partir del texto de la oferta (no inventes datos externos). Sugiere 5 ajustes de lenguaje al CV/LinkedIn alineados a esa cultura, sin inventar experiencia. Español LATAM.`,
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
          <h1 className="text-xl font-semibold">Ajuste cultural (oferta)</h1>
          <SpeakButton text="Analiza la oferta para inferir cultura y adaptar tu lenguaje sin inventar experiencia." />
        </div>
        <p className="text-sm muted">Basado en el texto de la vacante, no en scraping externo.</p>
      </section>
      <VoiceInput
        label="Empresa (opcional)"
        value={company}
        onChange={setCompany}
        placeholder="Ejemplo: Bancolombia"
        dictationLabel="Dictar empresa"
      />
      <VoiceTextarea
        label="El aviso de la vacante"
        hint="Pega el aviso completo. No es tu CV."
        value={jd}
        onChange={setJd}
        className="field min-h-40"
        placeholder="Ejemplo: Analista de datos, retail, Bogotá híbrido. Requisitos: Power BI, SQL…"
        dictationLabel="Dictar oferta"
      />
      <button type="button" className="btn-primary" disabled={loading || jd.length < 40} onClick={run}>
        {loading ? "Analizando…" : "Sugerir ajustes"}
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
