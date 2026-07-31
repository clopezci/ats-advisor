"use client";

import { useState } from "react";
import Link from "next/link";
import { DictationButton } from "@/components/DictationButton";
import { SpeakButton } from "@/components/SpeakButton";

export default function CartaPage() {
  const [cv, setCv] = useState("");
  const [job, setJob] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setOut("");
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "general",
          prompt: `Redacta una carta de presentación breve (180-260 palabras) en español LATAM, tono profesional y humano. No inventes experiencia. CV:\n${cv.slice(0, 2500)}\n\nOferta:\n${job.slice(0, 2500)}`,
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
          <h1 className="text-xl font-semibold">Carta de presentación</h1>
          <SpeakButton text="Genera una carta corta alineada a la oferta, sin inventar experiencia." />
        </div>
      </section>

      <div className="bento-card space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium">CV / perfil</label>
          <DictationButton onResult={(t) => setCv((p) => (p ? `${p} ${t}` : t))} />
        </div>
        <textarea className="field min-h-28" value={cv} onChange={(e) => setCv(e.target.value)} />
      </div>

      <div className="bento-card space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium">Oferta</label>
          <DictationButton onResult={(t) => setJob((p) => (p ? `${p} ${t}` : t))} />
        </div>
        <textarea className="field min-h-28" value={job} onChange={(e) => setJob(e.target.value)} />
      </div>

      <button
        type="button"
        className="btn-primary"
        disabled={loading || cv.length < 40 || job.length < 40}
        onClick={generate}
      >
        {loading ? "Redactando…" : "Generar carta"}
      </button>

      {out && (
        <section className="bento-card space-y-2">
          <div className="flex justify-between gap-2">
            <SpeakButton text={out} />
            <button
              type="button"
              className="btn-secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(out);
                alert("Copiada");
              }}
            >
              Copiar
            </button>
          </div>
          <p className="text-sm muted whitespace-pre-wrap">{out}</p>
        </section>
      )}

      <Link href="/herramientas" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
