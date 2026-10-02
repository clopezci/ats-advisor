"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ChannelChooser } from "@/components/ChannelChooser";
import { canAccessOutplacement, planLabel, readEntitlement, setPlan, type PlanId } from "@/lib/entitlements";
import {
  CHANNEL_CHOICE_INTRO,
  CARRERA_PRICE_COP,
  formatCop,
  type LearningChannel,
} from "@/lib/channels/pricing";
import { CAREER_MODULE_PITCH, CAREER_PATH_LABEL } from "@/lib/outplacement/labels";
import { isValidEmail, safeAppPath } from "@/lib/validation";
import { grantPsicoPractica, PSICO_PRACTICA_PRICE_COP } from "@/lib/psicotecnicas/practicaAccess";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { applySessionPrivileges } from "@/lib/client/sessionPrivileges";

function isLocalHost() {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

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
  const [prices, setPrices] = useState({
    carrera: CARRERA_PRICE_COP,
    plus: 99000,
    out09_extra: 22000,
    psico_practica: PSICO_PRACTICA_PRICE_COP,
    whatsapp_addon: 0,
  });
  const [returnNext, setReturnNext] = useState("/guia?recorrido=1");
  const [demoAllowed, setDemoAllowed] = useState(false);
  const [privileged, setPrivileged] = useState(false);
  const [paymentsReady, setPaymentsReady] = useState(true);

  function activatePrivileged(kind: "carrera" | "psico_practica" | "both") {
    if (kind === "carrera" || kind === "both") {
      setPlan("tester", "admin");
      setCurrentPlan("tester");
    }
    if (kind === "psico_practica" || kind === "both") {
      grantPsicoPractica(90);
    }
    const label =
      kind === "both"
        ? "Carrera (Tester) + práctica psicotécnica activadas en este navegador."
        : kind === "carrera"
          ? "Plan Tester activo en este navegador (Carrera sin pagar)."
          : "Práctica psicotécnica activa 90 días en este navegador.";
    setMsg(label);
    // Ir a /outplacement (sin gate de middleware) para que el desbloqueo se vea al instante.
    if (kind === "both" || kind === "carrera") {
      window.setTimeout(() => {
        window.location.assign("/outplacement");
      }, 400);
    }
  }

  async function refreshPrivilege(em: string) {
    if (!isValidEmail(em)) {
      setPrivileged(false);
      return;
    }
    try {
      const r = await fetch(`/api/testers/check?email=${encodeURIComponent(em)}`);
      const d = await r.json();
      setPrivileged(Boolean(d?.tester || d?.owner));
    } catch {
      setPrivileged(false);
    }
  }

  useEffect(() => {
    setCurrentPlan(readEntitlement().plan);
    setDemoAllowed(isLocalHost());
    let em = "";
    try {
      const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
      if (p?.email) {
        em = String(p.email);
        setEmail(em);
      }
    } catch {
      /* ignore */
    }
    const sb = createBrowserSupabase();
    if (sb) {
      void sb.auth.getSession().then(({ data }) => {
        const mail = data.session?.user?.email?.trim().toLowerCase();
        if (mail) {
          setEmail(mail);
          void applySessionPrivileges(mail).then((plan) => {
            if (plan) setCurrentPlan(plan);
          });
          void refreshPrivilege(mail);
        } else if (em) {
          void refreshPrivilege(em);
        }
      });
    } else if (em) {
      void refreshPrivilege(em);
    }
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next) setReturnNext(safeAppPath(next, "/guia?recorrido=1"));
    fetch("/api/features")
      .then((r) => r.json())
      .then((d) => {
        if (d.pricing) {
          setPrices({
            carrera: d.pricing.carrera || CARRERA_PRICE_COP,
            plus: d.pricing.plus,
            out09_extra: d.pricing.out09_extra,
            psico_practica: d.pricing.psico_practica || PSICO_PRACTICA_PRICE_COP,
            whatsapp_addon: 0,
          });
        }
        if (d.payments) {
          setPaymentsReady(Boolean(d.payments.wompi || d.payments.mercadopago));
        }
      })
      .catch(() => undefined);

    if (params.get("paid") === "1") {
      void (async () => {
        try {
          const last = JSON.parse(localStorage.getItem("ats_last_checkout") || "null");
          const planHint = String(last?.plan || params.get("plan") || "carrera");
          const paidEmail = String(last?.email || "").trim().toLowerCase();
          const ret = safeAppPath(params.get("next"), returnNext);

          if (isLocalHost()) {
            if (planHint === "carrera" || planHint === "plus") {
              setPlan(planHint, "demo_checkout");
              setCurrentPlan(planHint);
            }
            if (planHint === "psico_practica") {
              grantPsicoPractica();
              setMsg("Práctica psicotécnica activa 31 días en este navegador.");
              window.location.href = ret;
              return;
            }
          }

          setMsg(
            "Pago recibido. Si el plan no se activa en unos segundos, reclámalo en Mi cuenta con el mismo correo."
          );

          if (isValidEmail(paidEmail) && last?.reference) {
            const act = await fetch("/api/payments/activate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: paidEmail, reference: last.reference, plan: last.plan }),
            });
            const data = await act.json().catch(() => ({}));
            if (act.ok && data.cloud?.plan === "psico_practica" && data.cloud?.ok) {
              grantPsicoPractica();
              setMsg("Práctica psicotécnica activa por 31 días.");
              window.location.href = ret;
              return;
            }
            if (act.ok && data.profile?.plan && ["carrera", "plus", "tester"].includes(data.profile.plan)) {
              setPlan(data.profile.plan as PlanId, "webhook");
              setCurrentPlan(data.profile.plan as PlanId);
              setMsg(`Plan ${planLabel(data.profile.plan)} sincronizado desde cloud.`);
              window.location.href = ret;
              return;
            }
            if (data.code === "NOT_APPROVED") {
              setMsg(
                "Aún no hay confirmación del proveedor. En unos minutos usa /cuenta → Reclamar pago con el mismo correo."
              );
            }
          }

          if (isLocalHost() && (planHint === "carrera" || planHint === "plus")) {
            window.location.href = ret;
          }
        } catch {
          setMsg("Pago recibido. Si el plan no aparece, reclámalo en /cuenta con tu correo.");
        }
      })();
    }
    if (params.get("demo") === "carrera") {
      if (isLocalHost()) {
        setPlan("carrera", "demo_checkout");
        setCurrentPlan("carrera");
        setMsg("Plan Carrera activado en este dispositivo (demo local).");
      } else {
        setMsg("La activación demo solo está disponible en localhost. Usa checkout real.");
      }
    }
  }, []);

  useEffect(() => {
    void refreshPrivilege(email);
  }, [email]);

  function returnAfterPay() {
    const next = safeAppPath(
      new URLSearchParams(window.location.search).get("next") || returnNext,
      "/guia?recorrido=1"
    );
    window.location.href = next;
    return true;
  }

  /** Solo localhost: simula pago real. */
  async function dummyPay(plan: "carrera" | "plus" = "carrera") {
    if (!isLocalHost()) {
      setMsg("El pago demo solo está disponible en localhost. Usa Checkout real Carrera.");
      return;
    }
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
        channel,
        whatsappAddon: 0,
        reference: `DUMMY-${plan.toUpperCase()}-${Date.now()}`,
        paidAt: new Date().toISOString(),
      })
    );
    setCurrentPlan(next.plan);
    setDummyPhase("done");
    setLoading(null);
    setMsg(`Pago simulado OK. Plan ${planLabel(plan)} activo (incluye psicotécnicas y WhatsApp).`);
    returnAfterPay();
  }

  async function checkout(plan: "carrera" | "plus" | "out09_extra" | "psico_practica") {
    setLoading(plan);
    setMsg("");
    if (!isValidEmail(email)) {
      setMsg("Ingresa un correo válido para asociar el pago y poder reclamarlo.");
      setLoading(null);
      return;
    }
    const em = email.trim().toLowerCase();
    try {
      // Dueño/tester: "Pagar" abre pasarela real. La activación sin cobro es solo con los botones de abajo.
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          email: em,
          provider,
          coupon,
          channel,
          next: returnNext,
        }),
      });
      const data = await res.json();
      if (data.mode === "demo" || data.ok === false) {
        setMsg(
          data.message ||
            "La pasarela aún no está configurada (faltan WOMPI_* o MP_ACCESS_TOKEN en Vercel). Si eres dueño, usa «Activar sin pago» abajo; si no, escribe a soporte."
        );
        localStorage.setItem("ats_last_checkout", JSON.stringify(data));
        return;
      }

      localStorage.setItem("ats_last_checkout", JSON.stringify({ ...data, email: em }));

      if (data.mode === "mercadopago" && data.initPoint) {
        window.location.href = data.initPoint;
        return;
      }

      if (data.mode === "wompi") {
        await loadWompiScript();
        if (!window.WidgetCheckout) {
          setMsg(`Referencia ${data.reference}. No se pudo cargar el widget de Wompi; revisa la red o prueba Mercado Pago.`);
          return;
        }
        const checkoutWidget = new window.WidgetCheckout({
          currency: data.currency || "COP",
          amountInCents: data.amountInCents,
          reference: data.reference,
          publicKey: data.publicKey,
          redirectUrl: data.redirectUrl,
          customerData: { email: em },
        });
        checkoutWidget.open((result) => {
          if (result?.status === "APPROVED") {
            setMsg(
              "Pago aprobado. Si el plan no se activa en unos segundos, reclámalo en Mi cuenta."
            );
            if (isLocalHost()) {
              if (plan === "psico_practica") grantPsicoPractica();
              const map: Record<string, PlanId> = {
                carrera: "carrera",
                plus: "plus",
                out09_extra: "carrera",
              };
              setPlan(map[plan] || "carrera", "demo_checkout");
              setCurrentPlan(map[plan] || "carrera");
            }
          } else {
            setMsg("Si el pago quedó aprobado y el plan no aparece, reclámalo en Mi cuenta.");
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
      {returnNext !== "/guia?recorrido=1" ? (
        <section className="bento-card space-y-2" style={{ borderColor: "var(--brand)" }}>
          <p className="text-sm font-medium">Después de pagar volverás a:</p>
          <Link href={returnNext} className="btn-primary">
            {returnNext.startsWith("/outplacement/cuadernillo") ? "Continuar cuadernillo" : "Continuar donde ibas"}
          </Link>
          <p className="text-xs muted break-all">{returnNext}</p>
        </section>
      ) : null}
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold">Precios</h1>
          <SpeakButton text="Gratis solo el analizador ATS, el encaje rápido y el tracker. Un solo plan: Carrera, con la ruta de 8 módulos, psicotécnicas y WhatsApp incluidos. El curso a tu medida se compra aparte." />
        </div>
        <p className="text-sm muted">
          Gratis (3): analizador ATS, encaje rápido, tracker. El resto va en Carrera o en add-ons
          sueltos.
        </p>
        <p className="text-sm leading-relaxed">
          <strong>Carrera</strong> incluye la {CAREER_PATH_LABEL}, herramientas, psicotécnicas con
          explicación/IA y WhatsApp (hasta 5 recordatorios/día). También puedes tomar solo práctica
          psicotécnica o un curso a medida (add-ons).
        </p>
        <p className="text-sm">
          Plan actual:{" "}
          <span className="font-medium" style={{ color: "var(--brand)" }}>
            {planLabel(currentPlan)}
          </span>
        </p>
        {!paymentsReady ? (
          <p className="text-sm rounded-xl border p-3" style={{ borderColor: "var(--brand)" }}>
            Pasarela aún no configurada en el servidor (Wompi / Mercado Pago). Los botones «Pagar» no
            abrirán cobro real hasta agregar las claves en Vercel. Si eres dueño, usa «Activar sin pago»
            más abajo.
          </p>
        ) : null}
      </section>

      <section
        className="bento-card space-y-4"
        style={{ borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-3xl font-semibold" style={{ color: "var(--brand)" }}>
            Plan Carrera
          </h2>
          <p className="text-4xl font-semibold tabular-nums" style={{ color: "var(--brand)" }}>
            {formatCop(prices.carrera)}
            <span className="text-base font-medium muted"> /mes</span>
          </p>
        </div>
        <p className="text-sm muted">Único plan completo · incluye {CAREER_PATH_LABEL}</p>
        <p className="text-sm font-medium">Qué incluye la ruta de 8 módulos</p>
        <ul className="space-y-2 text-sm muted">
          {CAREER_MODULE_PITCH.map((m) => (
            <li key={m.code}>
              <strong style={{ color: "var(--text)" }}>{m.short}</strong> — {m.value}
            </li>
          ))}
        </ul>
        <p className="text-sm font-medium">También incluido en Carrera</p>
        <ul className="space-y-1 text-sm muted">
          <li>• Cuadernillo, LinkedIn, carta, plantilla CV, multi-oferta, pack ZIP</li>
          <li>• Coach IA, filtro telefónico, red de contactos, negociación</li>
          <li>• Psicotécnicas: fichas + explicaciones + práctica con método IA</li>
          <li>• WhatsApp o Telegram: hasta 5 recordatorios/día (WhatsApp ya no se paga aparte)</li>
        </ul>
        <input
          className="field"
          type="email"
          placeholder="Tu correo, el mismo con el que vas a reclamar el plan"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <details className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
          <summary className="cursor-pointer text-sm font-medium muted">Cupón o pasarela</summary>
          <div className="mt-3 space-y-2">
            <input
              className="field"
              placeholder="Cupón (opcional)"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            {(
              [
                ["auto", "Automática"],
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
        </details>
        <button
          type="button"
          className="btn-primary"
          disabled={loading === "carrera"}
          onClick={() => checkout("carrera")}
        >
          {loading === "carrera" ? "Preparando…" : `Pagar Carrera · ${formatCop(prices.carrera)}/mes`}
        </button>
        {demoAllowed && (
          <details className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
            <summary className="cursor-pointer text-sm">Probar sin cobro (localhost)</summary>
            <button
              type="button"
              className="btn-secondary mt-3"
              disabled={dummyPhase === "processing" || loading === "dummy-carrera"}
              onClick={() => dummyPay("carrera")}
            >
              {loading === "dummy-carrera"
                ? "Procesando pago…"
                : dummyPhase === "done" && canAccessOutplacement(currentPlan)
                  ? "Carrera activo — volver al recorrido"
                  : "Activar Carrera en este equipo"}
            </button>
          </details>
        )}
      </section>

      <section className="bento-card space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-semibold">Solo práctica psicotécnica</h2>
          <span className="text-lg font-semibold" style={{ color: "var(--brand)" }}>
            {formatCop(prices.psico_practica)}
            <span className="text-sm font-medium muted"> /mes</span>
          </span>
        </div>
        <p className="text-xs muted">
          Add-on si no tomas Carrera. Con Carrera ya viene incluido: no pagues esto dos veces.
        </p>
        <ul className="space-y-1 text-sm muted">
          <li>• Explicaciones desde la 5.ª pregunta en «Pruebas por tipo»</li>
          <li>• Simulacro en vivo (texto/foto), pistas y casos aleatorios con IA</li>
          <li>• Hasta {180} preguntas/mes con IA</li>
        </ul>
        {demoAllowed && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              grantPsicoPractica();
              setMsg("Práctica psicotécnica activa 31 días en este navegador (demo).");
            }}
          >
            Activar práctica (demo local)
          </button>
        )}
        <button
          type="button"
          className="btn-secondary"
          disabled={loading === "psico_practica"}
          onClick={() => checkout("psico_practica")}
        >
          {loading === "psico_practica" ? "Preparando…" : "Pagar solo práctica"}
        </button>
      </section>

      <section className="bento-card space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-semibold">Curso a tu medida</h2>
          <span className="text-lg font-semibold" style={{ color: "var(--brand)" }}>
            {formatCop(prices.out09_extra)}
          </span>
        </div>
        <p className="text-xs muted">Add-on (no es otro plan mensual). Requiere Carrera.</p>
        <ul className="space-y-1 text-sm muted">
          <li>• Un curso sobre el tema que tú elijas</li>
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
          showIntro={false}
        />
      </section>

      {privileged ? (
        <section className="bento-card space-y-3">
          <h2 className="font-semibold text-sm">Activar sin pago (dueño / tester)</h2>
          <p className="text-xs muted leading-relaxed">
            Estos botones desbloquean Carrera en este navegador. «Pagar» arriba intenta la pasarela real
            (no te salta a activación automática). Whitelist de correos: Mi cuenta → Permisos dueño, o
            /admin.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={() => activatePrivileged("both")}>
              Activar Carrera + práctica
            </button>
            <button type="button" className="btn-secondary" onClick={() => activatePrivileged("carrera")}>
              Solo Carrera / Tester
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => activatePrivileged("psico_practica")}
            >
              Solo práctica
            </button>
          </div>
          <Link href="/cuenta" className="btn-secondary">
            Ir a Mi cuenta (admin y permisos)
          </Link>
        </section>
      ) : null}

      {demoAllowed && (
        <section className="bento-card space-y-2">
          <h2 className="font-semibold text-sm">Modo prueba (solo localhost)</h2>
          <p className="text-sm muted">
            El botón demo simula un cobro, activa el plan en este navegador y vuelve a tu recorrido. No
            aparece en producción.
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
      )}

      {msg && (
        <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--brand)" }}>
          {msg}
        </p>
      )}
      <Link href="/guia" className="btn-secondary">
        Quiero que me guíen (qué hacer primero)
      </Link>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
