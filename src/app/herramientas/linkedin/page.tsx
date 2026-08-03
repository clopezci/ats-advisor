"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DictationButton } from "@/components/DictationButton";
import { SpeakButton } from "@/components/SpeakButton";

export default function LinkedInToolPage() {
  const [role, setRole] = useState("");
  const [value, setValue] = useState("");
  const [niche, setNiche] = useState("");
  const [jobContext, setJobContext] = useState("");
  const [missing, setMissing] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const last = JSON.parse(localStorage.getItem("ats_last_result") || "null");
      const ws = JSON.parse(localStorage.getItem("ats_workspace") || "null");
      const job = ws?.jobText || last?.jobText || "";
      if (job) {
        setJobContext(job.slice(0, 600));
        const first = job.split("\n").map((l: string) => l.trim()).find((l: string) => l.length > 8 && l.length < 80);
        if (first && !role) setRole(first.slice(0, 60));
      }
      const miss = last?.result?.mustHave?.missing || last?.result?.missingKeywords || [];
      if (miss.length) setMissing(miss.slice(0, 10).join(", "));
      const matched = last?.result?.hardSkills?.matched || [];
      if (matched.length && !value) setValue(matched.slice(0, 5).join(", "));
    } catch {
      /* ignore */
    }
  }, []);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "ats_suggest",
          useKnowledge: true,
          prompt: `Crea Headline + About de LinkedIn en español LATAM (ATS-friendly) alineado a ESTA vacante. Cargo: ${role}. Valor: ${value}. Nicho: ${niche}. Keywords a integrar solo si son creíbles: ${missing}. Oferta (extracto): ${jobContext}. Devuelve Headline (1 línea) y About (120-160 palabras) con 3 logros estilo impacto. No inventes empresas ni cargos.`,
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
          <SpeakButton text="Genera headline y extracto de LinkedIn alineados a la vacante del ATS." />
        </div>
        {jobContext && (
          <p className="text-xs muted">Prefill desde tu último análisis ATS (puedes editar).</p>
        )}
      </section>
      <label className="text-sm">
        Cargo objetivo
        <div className="mt-1 flex gap-2">
          <input className="field" value={role} onChange={(e) => setRole(e.target.value)} />
          <DictationButton onResult={(t) => setRole((p) => (p ? `${p} ${t}` : t))} />
        </div>
      </label>
      <label className="text-sm">
        Valor / skills a destacar
        <input className="field mt-1" value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <label className="text-sm">
        Nicho / industria
        <input className="field mt-1" value={niche} onChange={(e) => setNiche(e.target.value)} />
      </label>
      <label className="text-sm">
        Keywords de la vacante (opcionales)
        <input className="field mt-1" value={missing} onChange={(e) => setMissing(e.target.value)} />
      </label>
      <button type="button" className="btn-primary" disabled={loading || !role} onClick={generate}>
        {loading ? "Generando…" : "Generar"}
      </button>
      {out && (
        <section className="bento-card space-y-2">
          <SpeakButton text={out} />
          <p className="mt-2 text-sm muted whitespace-pre-wrap">{out}</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={async () => {
              await navigator.clipboard.writeText(out);
              try {
                localStorage.setItem("ats_linkedin_blurb", out);
              } catch {
                /* ignore */
              }
              alert("Copiado (lista para Pack ZIP)");
            }}
          >
            Copiar
          </button>
        </section>
      )}
      <Link href="/ats" className="btn-secondary">
        Volver al ATS
      </Link>
      <Link href="/herramientas" className="btn-secondary">
        Herramientas
      </Link>
    </div>
  );
}
