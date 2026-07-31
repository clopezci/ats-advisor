"use client";

import { useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { InstallPrompt } from "@/components/InstallPrompt";

const PLANS = [
  {
    id: "carrera",
    name: "Carrera",
    price: "$79.000 COP/mes",
    points: ["OUT-01 a OUT-08", "1× OUT-09 / mes", "Telegram", "Voz en toda la app"],
  },
  {
    id: "plus",
    name: "Carrera Plus",
    price: "$99.000 COP/mes",
    points: ["Todo Carrera", "2× OUT-09 / mes", "WhatsApp", "Más simulador"],
  },
  {
    id: "out09_extra",
    name: "OUT-09 extra",
    price: "$22.000 COP",
    points: ["1 curso personalizado adicional", "Misma entrega por microcápsulas"],
  },
] as const;

export default function PreciosPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function checkout(plan: "carrera" | "plus" | "out09_extra") {
    setLoading(plan);
    setMsg("");
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });
      const data = await res.json();
      if (data.mode === "demo") {
        setMsg(data.message);
      } else {
        setMsg(`Referencia ${data.reference}. Integra Widget Wompi con publicKey en el siguiente paso de deploy.`);
        localStorage.setItem("ats_last_checkout", JSON.stringify(data));
      }
    } catch {
      setMsg("No se pudo iniciar el checkout.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <InstallPrompt />
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold">Precios</h1>
          <SpeakButton text="Planes Carrera, Carrera Plus y curso OUT-09 extra. El ATS básico es gratis con límite diario." />
        </div>
        <p className="text-sm muted">ATS gratis: 5 análisis/día. Outplacement democratizado.</p>
        <input
          className="field"
          type="email"
          placeholder="Correo para el recibo (opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </section>

      {PLANS.map((p) => (
        <section key={p.id} className="bento-card space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{p.name}</h2>
            <span className="pill-brand">{p.price}</span>
          </div>
          <ul className="space-y-1 text-sm muted">
            {p.points.map((x) => (
              <li key={x}>• {x}</li>
            ))}
          </ul>
          <button
            type="button"
            className="btn-primary"
            disabled={loading === p.id}
            onClick={() => checkout(p.id)}
          >
            {loading === p.id ? "Preparando…" : `Elegir ${p.name}`}
          </button>
        </section>
      ))}

      {msg && <p className="text-sm muted">{msg}</p>}
      <Link href="/outplacement" className="btn-secondary">
        Ver outplacement
      </Link>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
