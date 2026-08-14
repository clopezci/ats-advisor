"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ChannelChooser } from "@/components/ChannelChooser";
import { canAccessOutplacement, planLabel, readEntitlement, setPlan, type PlanId } from "@/lib/entitlements";
import {
  CHANNEL_CHOICE_INTRO,
  formatCop,
  whatsappFinalPriceCop,
  type LearningChannel,
} from "@/lib/channels/pricing";
import { CAREER_MODULE_PITCH, CAREER_PATH_LABEL } from "@/lib/outplacement/labels";

const waPrice = whatsappFinalPriceCop();

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
  const [channel, setChannel] = useState<LearningChannel>("telegram");
  const [prices, setPrices] = useState({ carrera: 79000, plus: 99000, out09_extra: 22000, whatsapp_addon: waPrice });
  const [returnNext, setReturnNext] = useState("/guia?recorrido=1");

  useEffect(() => {
    setCurrentPlan(readEntitlement().plan);
    try {
      const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
      if (p?.email) setEmail(p.email);
    } catch {
      /* ignore */
    }
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next && next.startsWith("/")) setReturnNext(next);
    fetch("/api/features")
      .then((r) => r.json())
      .then((d) => {
        if (d.pricing) {
          setPrices({
            carrera: d.pricing.carrera,
            plus: d.pricing.plus,
            out09_extra: d.pricing.out09_extra,
            whatsapp_addon: d.pricing.whatsapp_addon || waPrice,
          });
        }
      })
      .catch(() => undefined);
    const isLocal =
      window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (params.get("paid") === "1") {
      try {
        const last = JSON.parse(localStorage.getItem("ats_last_checkout") || "null");
        const plan = String(last?.plan || params.get("plan") || "carrera") as PlanId;
        if (plan === "carrera" || plan === "plus") {
          setPlan(plan, "demo_checkout");
          setCurrentPlan(plan);
          setMsg(
            `Pago detectado. Plan ${planLabel(plan)} en este dispositivo. El webhook activa cloud si diste correo.`
          );
          const ret = params.get("next");
          if (ret && ret.startsWith("/")) {
            window.location.href = ret;
            return;
          }
        } else {
          setMsg(
            "Si el pago fue aprobado, el webhook activa el plan en servidor. Usa el mismo correo en /cuenta → Reclamar pago."
          );
        }
        const em = String(last?.email || email || "").trim();
        if (em.includes("@") && last?.reference) {
          fetch("/api/payments/activate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: em, reference: last.reference, plan: last.plan }),
          }).catch(() => undefined);
        }
      } catch {
        setMsg("Pago recibido. Activa Carrera demo si el plan no se reflejó aún.");
      }
    }
    if (params.get("demo") === "carrera") {
      if (isLocal) {
        setPlan("carrera", "demo_checkout");
        setCurrentPlan("carrera");
        setMsg("Plan Carrera activado en este dispositivo (demo local).");
      } else {
        setMsg("La activación ?demo=carrera solo está disponible en localhost. Usa checkout o el botón demo.");
      }
    }
  }, []);

  function returnAfterPay() {
    try {
      const next = new URLSearchParams(window.location.search).get("next");
      if (next && next.startsWith("/")) {
        window.location.href = next;
        return true;
      }
    } catch {
      /* ignore */
    }
    return false;
  }

  /** Simula pago real: delay → activa plan → vuelve al recorrido si venía de Mi plan. */
  async function dummyPay(plan: "carrera" | "plus" = "carrera") {
    setDummyPhase("processing");
    setLoading(`dummy-${plan}`);
    setMsg("");
    await new Promise((r) => setTimeout(r, 1200));
    const next = setPlan(plan, "demo_checkout");
    const addon = channel === "whatsapp" ? prices.whatsapp_addon : 0;
    localStorage.setItem(
      "ats_last_checkout",
      JSON.stringify({
        mode: "dummy",
        plan,
        channel,
        whatsappAddon: addon,
        reference: `DUMMY-${plan.toUpperCase()}-${Date.now()}`,
        paidAt: new Date().toISOString(),
      })
    );
    setCurrentPlan(next.plan);
    setDummyPhase("done");
    setLoading(null);
    setMsg(
      `Pago simulado OK. Plan ${planLabel(plan)} activo${
        addon ? ` + WhatsApp ${formatCop(addon)}/mes (registrado)` : ""
      }.`
    );
    if (returnAfterPay()) return;
  }

  async function checkout(plan: "carrera" | "plus" | "out09_extra") {
    setLoading(plan);
    setMsg("");
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email, provider, coupon, channel }),
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
          <SpeakButton text="Gratis solo el analizador ATS, el encaje rápido y el tracker. Un solo plan: Carrera, con la ruta de 8 módulos y todas las herramientas de acompañamiento. El curso a tu medida se compra aparte." />
        </div>
        <p className="text-sm muted">
          Gratis (3): analizador ATS, encaje rápido, tracker. Todo lo demás es Carrera.
        </p>
        <p className="text-sm leading-relaxed">
          Un solo plan: <strong>Carrera</strong>. El corazón es la {CAREER_PATH_LABEL}. Si necesitas un
          curso puntual sobre un tema tuyo, lo compras como add-on.
        </p>
        <p className="text-sm muted leading-relaxed">
          Carrera cuesta una mínima fracción del outplacement empresarial: la misma idea de guía,
          al alcance de una persona.
        </p>
        <p className="text-sm">
          Plan actual:{" "}
          <span className="font-medium" style={{ color: "var(--brand)" }}>
            {planLabel(currentPlan)}
          </span>
        </p>
        <input
          className="field"
          type="email"
          placeholder="Correo (recomendado: activa el plan en cloud tras el pago)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <p className="text-xs muted">
          Sin correo el pago se confirma, pero el plan cloud queda pendiente hasta que reclames en
          /cuenta con el mismo email.
        </p>
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

      <section className="bento-card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Carrera</h2>
          <span className="pill-brand">{formatCop(prices.carrera)}/mes</span>
        </div>
        <p className="text-xs muted">Único plan · incluye {CAREER_PATH_LABEL}</p>
        <p className="text-sm font-medium">Qué incluye la ruta de 8 módulos</p>
        <ul className="space-y-2 text-sm muted">
          {CAREER_MODULE_PITCH.map((m) => (
            <li key={m.code}>
              <strong style={{ color: "var(--text)" }}>{m.short}</strong> — {m.value}
            </li>
          ))}
        </ul>
        <p className="text-sm font-medium">También con Carrera</p>
        <ul className="space-y-1 text-sm muted">
          <li>• LinkedIn, carta, plantilla CV, multi-oferta, pack ZIP</li>
          <li>• Coach IA, filtro telefónico, red de contactos, negociación de oferta</li>
          <li>• Cápsulas y recordatorio de tarea por Telegram (gratis) o WhatsApp (add-on más alto)</li>
        </ul>
        <button
          type="button"
          className="btn-primary"
          disabled={dummyPhase === "processing" || loading === "dummy-carrera"}
          onClick={() => dummyPay("carrera")}
        >
          {loading === "dummy-carrera"
            ? "Procesando pago…"
            : dummyPhase === "done" && canAccessOutplacement(currentPlan)
              ? "✓ Carrera activo — volver al recorrido"
              : "Pagar Carrera (demo)"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={loading === "carrera"}
          onClick={() => checkout("carrera")}
        >
          {loading === "carrera" ? "Preparando…" : "Checkout real Carrera"}
        </button>
      </section>

      <section className="bento-card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Curso a tu medida</h2>
          <span className="pill-brand">{formatCop(prices.out09_extra)}</span>
        </div>
        <p className="text-xs muted">Add-on (no es otro plan mensual)</p>
        <ul className="space-y-1 text-sm muted">
          <li>• Un curso sobre el tema que tú elijas</li>
          <li>• Requiere tener Carrera activo</li>
          <li>• Lecciones cortas, las mismas del acompañamiento</li>
        </ul>
        <button
          type="button"
          className="btn-secondary"
          disabled={loading === "out09_extra"}
          onClick={() => checkout("out09_extra")}
        >
          {loading === "out09_extra" ? "Preparando…" : "Checkout curso extra"}
        </button>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Canal de microlearning</h2>
        <p className="text-sm muted">{CHANNEL_CHOICE_INTRO}</p>
        <ChannelChooser
          value={channel}
          onChange={(c) => {
            setChannel(c);
            try {
              const p = JSON.parse(localStorage.getItem("ats_profile") || "{}");
              localStorage.setItem("ats_profile", JSON.stringify({ ...p, channel: c }));
            } catch {
              /* ignore */
            }
          }}
          whatsappPriceCop={prices.whatsapp_addon}
          showIntro={false}
        />
        {channel === "whatsapp" && (
          <p className="text-sm font-medium" style={{ color: "var(--brand)" }}>
            Addon WhatsApp: {formatCop(prices.whatsapp_addon)}/mes. Se suma al checkout de Carrera.
          </p>
        )}
        <p className="text-xs muted">
          Total orientativo Carrera
          {channel === "whatsapp" ? " + WhatsApp" : ""}:{" "}
          {formatCop(prices.carrera + (channel === "whatsapp" ? prices.whatsapp_addon : 0))}
        </p>
      </section>

      <section className="bento-card space-y-2">
        <h2 className="font-semibold text-sm">Modo prueba (sin Wompi / MP)</h2>
        <p className="text-sm muted">
          El botón <strong>Pagar Carrera (demo)</strong> simula un cobro (~1 s), activa el plan en este
          navegador y, si venías de Mi plan, te devuelve al mismo paso. No cobra dinero.
        </p>
        {dummyPhase === "processing" && (
          <p className="text-sm" style={{ color: "var(--brand)" }}>
            Simulando pasarela… no cierres esta pestaña.
          </p>
        )}
        {dummyPhase === "done" && (
          <Link href={returnNext} className="btn-primary">
            Volver a mi recorrido →
          </Link>
        )}
      </section>

      {msg && <p className="text-sm muted">{msg}</p>}
      <Link href="/guia" className="btn-secondary">
        Quiero que me guíen (qué hacer primero)
      </Link>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
