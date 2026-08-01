"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { InstallPrompt } from "@/components/InstallPrompt";
import { planLabel, setPlan, type PlanId } from "@/lib/entitlements";

const PLANS = [
  {
    id: "carrera" as const,
    name: "Carrera",
    price: "$79.000 COP/mes",
    points: ["OUT-01 a OUT-08", "1× OUT-09 / mes", "Telegram", "Voz en toda la app"],
  },
  {
    id: "plus" as const,
    name: "Carrera Plus",
    price: "$99.000 COP/mes",
    points: ["Todo Carrera", "2× OUT-09 / mes", "WhatsApp", "Más simulador"],
  },
  {
    id: "out09_extra" as const,
    name: "OUT-09 extra",
    price: "$22.000 COP",
    points: ["1 curso personalizado adicional", "Misma entrega por microcápsulas"],
  },
];

declare global {
  interface Window {
    WidgetCheckout?: new (opts: Record<string, unknown>) => { open: (cb: (result: { status?: string }) => void) => void };
  }
}

function loadWompiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.WidgetCheckout) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.wompi.co/widget.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("No se pudo cargar Wompi"));
    document.body.appendChild(s);
  });
}

export default function PreciosPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") {
      setMsg("Si el pago fue aprobado, tu plan se actualiza al confirmar el webhook. También puedes activar demo local abajo.");
    }
    if (params.get("demo") === "carrera") {
      setPlan("carrera", "demo_checkout");
      setMsg("Plan Carrera activado en este dispositivo (demo).");
    }
  }, []);

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
        setMsg(data.message + " Mientras tanto puedes activar Carrera demo local.");
        localStorage.setItem("ats_last_checkout", JSON.stringify(data));
        return;
      }

      localStorage.setItem("ats_last_checkout", JSON.stringify(data));
      await loadWompiScript();
      if (!window.WidgetCheckout) {
        setMsg(`Referencia ${data.reference}. Widget no disponible; revisa la red.`);
        return;
      }

      const checkoutWidget = new window.WidgetCheckout({
        currency: data.currency || "COP",
        amountInCents: data.amountInCents,
        reference: data.reference,
        publicKey: data.publicKey,
        redirectUrl: data.redirectUrl,
        customerData: email.includes("@") ? { email } : undefined,
      });

      checkoutWidget.open((result) => {
        if (result?.status === "APPROVED") {
          const map: Record<string, PlanId> = {
            carrera: "carrera",
            plus: "plus",
            out09_extra: "carrera",
          };
          setPlan(map[plan] || "carrera", "demo_checkout");
          setMsg(`Pago aprobado. Plan ${planLabel(map[plan] || "carrera")} activo en este dispositivo.`);
        } else {
          setMsg(`Checkout cerrado (${result?.status || "sin estado"}). Si pagaste, espera el webhook.`);
        }
      });
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

      <section className="bento-card space-y-2">
        <h2 className="font-semibold text-sm">Sin Wompi aún</h2>
        <p className="text-sm muted">Activa Carrera en este dispositivo para probar outplacement.</p>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setPlan("carrera", "demo_checkout");
            setMsg("Plan Carrera (demo local) activado.");
          }}
        >
          Activar Carrera demo
        </button>
      </section>

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
