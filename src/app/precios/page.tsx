"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { InstallPrompt } from "@/components/InstallPrompt";
import { planLabel, readEntitlement, setPlan, type PlanId } from "@/lib/entitlements";

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
    WidgetCheckout?: new (opts: Record<string, unknown>) => {
      open: (cb: (result: { status?: string }) => void) => void;
    };
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
  const [coupon, setCoupon] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [provider, setProvider] = useState<"auto" | "wompi" | "mercadopago">("auto");
  const [currentPlan, setCurrentPlan] = useState<PlanId>("free");
  const [dummyPhase, setDummyPhase] = useState<"idle" | "processing" | "done">("idle");

  useEffect(() => {
    setCurrentPlan(readEntitlement().plan);
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") {
      try {
        const last = JSON.parse(localStorage.getItem("ats_last_checkout") || "null");
        const plan = String(last?.plan || params.get("plan") || "carrera") as PlanId;
        if (plan === "carrera" || plan === "plus") {
          setPlan(plan, "demo_checkout");
          setCurrentPlan(plan);
          setMsg(`Pago detectado. Plan ${planLabel(plan)} activado en este dispositivo. El webhook confirma en servidor.`);
        } else {
          setMsg("Si el pago fue aprobado, tu plan se actualiza al confirmar el webhook. También puedes activar demo local abajo.");
        }
      } catch {
        setMsg("Pago recibido. Activa Carrera demo si el plan no se reflejó aún.");
      }
    }
    if (params.get("demo") === "carrera") {
      setPlan("carrera", "demo_checkout");
      setCurrentPlan("carrera");
      setMsg("Plan Carrera activado en este dispositivo (demo).");
    }
  }, []);

  /** Simula pago real: delay → activa plan → desbloquea outplacement. */
  async function dummyPay(plan: "carrera" | "plus") {
    setDummyPhase("processing");
    setLoading(`dummy-${plan}`);
    setMsg("");
    await new Promise((r) => setTimeout(r, 1200));
    const next = setPlan(plan, "demo_checkout");
    localStorage.setItem(
      "ats_last_checkout",
      JSON.stringify({
        mode: "dummy",
        plan,
        reference: `DUMMY-${plan.toUpperCase()}-${Date.now()}`,
        paidAt: new Date().toISOString(),
      })
    );
    setCurrentPlan(next.plan);
    setDummyPhase("done");
    setLoading(null);
    setMsg(
      `Pago simulado OK. Plan ${planLabel(plan)} activo en este navegador. Ya puedes usar outplacement, OUT-09 y gates premium.`
    );
  }

  async function checkout(plan: "carrera" | "plus" | "out09_extra") {
    setLoading(plan);
    setMsg("");
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email, provider, coupon }),
      });
      const data = await res.json();
      if (data.mode === "demo") {
        setMsg(data.message + " Mientras tanto puedes activar Carrera demo local.");
        localStorage.setItem("ats_last_checkout", JSON.stringify(data));
        return;
      }

      localStorage.setItem("ats_last_checkout", JSON.stringify(data));

      if (data.mode === "mercadopago" && data.initPoint) {
        window.location.href = data.initPoint;
        return;
      }

      if (data.mode === "wompi") {
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
        return;
      }

      setMsg(data.error || "Respuesta de checkout desconocida.");
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
          <SpeakButton text="Planes Carrera, Carrera Plus y curso OUT-09 extra. Usa Pagar demo para probar sin pasarela real." />
        </div>
        <p className="text-sm muted">ATS gratis: 5 análisis/día. Outplacement democratizado.</p>
        <p className="text-sm">
          Plan actual:{" "}
          <span className="font-medium" style={{ color: "var(--brand)" }}>
            {planLabel(currentPlan)}
          </span>
        </p>
        <input
          className="field"
          type="email"
          placeholder="Correo para el recibo (opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="field"
          placeholder="Cupón (opcional)"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
        <p className="text-sm font-medium">Pasarela</p>
        <div className="flex flex-col gap-2">
          {(
            [
              ["auto", "Automática (Wompi o MP)"],
              ["wompi", "Wompi"],
              ["mercadopago", "Mercado Pago"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className="btn-secondary"
              style={
                provider === id ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" } : undefined
              }
              onClick={() => setProvider(id)}
            >
              {label}
            </button>
          ))}
        </div>
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
          {p.id !== "out09_extra" && (
            <button
              type="button"
              className="btn-primary"
              disabled={dummyPhase === "processing" || loading === `dummy-${p.id}`}
              onClick={() => dummyPay(p.id)}
            >
              {loading === `dummy-${p.id}`
                ? "Procesando pago…"
                : dummyPhase === "done" && currentPlan === p.id
                  ? `✓ ${p.name} activo — seguir`
                  : `Pagar ${p.name} (demo)`}
            </button>
          )}
          <button
            type="button"
            className="btn-secondary"
            disabled={loading === p.id}
            onClick={() => checkout(p.id)}
          >
            {loading === p.id ? "Preparando…" : `Checkout real ${p.name}`}
          </button>
        </section>
      ))}

      <section className="bento-card space-y-2">
        <h2 className="font-semibold text-sm">Modo prueba (sin Wompi / MP)</h2>
        <p className="text-sm muted">
          El botón <strong>Pagar (demo)</strong> simula un cobro (~1 s), activa el plan en este navegador y te deja
          entrar a outplacement. No cobra dinero. Cuando configures Wompi o Mercado Pago, usa “Checkout real”.
        </p>
        {dummyPhase === "processing" && (
          <p className="text-sm" style={{ color: "var(--brand)" }}>
            Simulando pasarela… no cierres esta pestaña.
          </p>
        )}
        {dummyPhase === "done" && (
          <Link href="/outplacement" className="btn-primary">
            Continuar a outplacement →
          </Link>
        )}
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
