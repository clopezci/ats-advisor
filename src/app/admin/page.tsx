"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import type { AppSettings } from "@/lib/settings";
import { EXPERT_SPECIALTIES } from "@/lib/experts/specialties";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [msg, setMsg] = useState("");
  const [health, setHealth] = useState<string>("…");
  const [testingAlert, setTestingAlert] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/admin/settings", {
        headers: { "x-admin-secret": secret },
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "No autorizado");
        return;
      }
      setSettings(data.settings);
      setAuthed(true);
      setMsg("");
      const h = await fetch("/api/health", { headers: { "x-admin-secret": secret } });
      const hj = await h.json();
      setHealth(
        hj.ok
          ? `OK · degradados: ${(hj.degraded || []).join(", ") || "ninguno"}`
          : `Degradado · ${JSON.stringify(hj.checks || {})}`
      );
    } catch {
      setMsg("Error de red al cargar admin");
    }
  }

  async function save() {
    if (!settings) return;
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      setMsg(res.ok ? `Guardado${data.cloud ? " (+ cloud)" : " (memoria/local)"}` : data.error || "Error");
      if (res.ok && data.settings) {
        setSettings(data.settings);
        try {
          localStorage.setItem("ats_feature_ads", data.settings.features.ads ? "1" : "0");
        } catch {
          /* ignore */
        }
      }
    } catch {
      setMsg("Error de red al guardar");
    }
  }

  async function runHealthAlert() {
    setTestingAlert(true);
    try {
      const res = await fetch("/api/admin/health-report", {
        method: "POST",
        headers: { "x-admin-secret": secret },
      });
      const data = await res.json();
      setMsg(res.ok ? (data.sent ? "Reporte de salud enviado a Telegram" : "Salud OK (sin envío)") : data.error);
    } catch {
      setMsg("No se pudo disparar el reporte");
    } finally {
      setTestingAlert(false);
    }
  }

  useEffect(() => {
    const s = sessionStorage.getItem("admin_secret");
    if (s) setSecret(s);
  }, []);

  if (!authed || !settings) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <h1 className="text-2xl font-semibold">Admin LOTIC</h1>
        <p className="text-sm muted">
          Entra con ADMIN_SECRET. En local (sin secret en env) usa <code>dev-admin</code>. En producción el fallback
          está desactivado.
        </p>
        <input
          className="field"
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="ADMIN_SECRET"
        />
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            sessionStorage.setItem("admin_secret", secret);
            load();
          }}
        >
          Entrar
        </button>
        {msg && (
          <p className="text-sm" style={{ color: "var(--danger)" }}>
            {msg}
          </p>
        )}
        <Link href="/" className="btn-secondary">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold">Panel owner</h1>
        <SpeakButton text="Administra precios, WhatsApp, límites IA, flags, LLM, promociones y salud." />
      </div>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Precios COP</h2>
        {(["carrera", "plus", "out09_extra", "whatsapp_addon"] as const).map((k) => (
          <label key={k} className="block text-sm">
            {k} {k === "whatsapp_addon" ? "(0 = fórmula costo Meta)" : ""}
            <input
              className="field mt-1"
              type="number"
              value={settings.pricing[k]}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  pricing: { ...settings.pricing, [k]: Number(e.target.value) },
                })
              }
            />
          </label>
        ))}
        <label className="block text-sm">
          Moneda
          <input
            className="field mt-1"
            value={settings.pricing.currency}
            onChange={(e) =>
              setSettings({ ...settings, pricing: { ...settings.pricing, currency: e.target.value } })
            }
          />
        </label>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Costo WhatsApp (interno)</h2>
        {(["meta_mid_monthly_cop", "margin_percent", "msgs_per_month"] as const).map((k) => (
          <label key={k} className="block text-sm">
            {k}
            <input
              className="field mt-1"
              type="number"
              value={settings.whatsapp_cost[k]}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  whatsapp_cost: { ...settings.whatsapp_cost, [k]: Number(e.target.value) },
                })
              }
            />
          </label>
        ))}
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Límites IA</h2>
        {(
          [
            "free_ats_per_day",
            "out09_included_carrera",
            "out09_included_plus",
            "quality_threshold",
            "max_paid_escalations",
            "max_ai_cost_cop_per_user_month",
            "max_out09_prompt_chars",
          ] as const
        ).map((k) => (
          <label key={k} className="block text-sm">
            {k}
            <input
              className="field mt-1"
              type="number"
              step={k === "quality_threshold" ? "0.01" : "1"}
              value={settings.ai_limits[k]}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  ai_limits: { ...settings.ai_limits, [k]: Number(e.target.value) },
                })
              }
            />
          </label>
        ))}
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Feature flags</h2>
        {(
          ["ads", "telegram", "whatsapp", "outplacement", "out09", "coach_chat", "experts"] as const
        ).map((k) => (
          <label key={k} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.features[k]}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  features: { ...settings.features, [k]: e.target.checked },
                })
              }
            />
            {k}
          </label>
        ))}
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Preferencias LLM</h2>
        {(["prefer_groq", "prefer_gemini", "prefer_openai"] as const).map((k) => (
          <label key={k} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.llm[k]}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  llm: { ...settings.llm, [k]: e.target.checked },
                })
              }
            />
            {k}
          </label>
        ))}
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Footer microlearning</h2>
        <textarea
          className="field min-h-20"
          value={settings.microlearning_footer}
          onChange={(e) => setSettings({ ...settings, microlearning_footer: e.target.value })}
        />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Testers</h2>
        <textarea
          className="field min-h-24"
          placeholder="uno@correo.com, dos@correo.com"
          value={(settings.tester_emails || []).join(", ")}
          onChange={(e) =>
            setSettings({
              ...settings,
              tester_emails: e.target.value
                .split(/[,;\n]/)
                .map((s) => s.trim().toLowerCase())
                .filter(Boolean),
            })
          }
        />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Aliados expertos</h2>
        <p className="text-xs muted">
          Precio de servicio + % comisión (el COP de comisión se calcula solo). Clientes ven el
          precio. Cortes en{" "}
          <Link href="/admin/expertos" className="underline">
            /admin/expertos
          </Link>
          .
        </p>
        <label className="block text-sm">
          Modo de cobro
          <select
            className="field mt-1"
            value={settings.expert_billing_mode}
            onChange={(e) =>
              setSettings({
                ...settings,
                expert_billing_mode: e.target.value as "platform_collect" | "ally_direct",
              })
            }
          >
            <option value="platform_collect">
              Recomendado: LOTIC cobra al cliente y liquida al aliado (neto)
            </option>
            <option value="ally_direct">
              Aliado cobra directo; LOTIC cobra comisión en corte semanal
            </option>
          </select>
        </label>
        <p className="text-xs muted">
          {settings.expert_billing_mode === "platform_collect"
            ? "Ingreso bruto en pasarela = precio completo; tu ingreso real = comisión. Liquidas al aliado el neto cada corte."
            : "No inflas facturación, pero dependes de que el aliado te pague la comisión tras confirmar el servicio."}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block text-sm">
            Precio servicio default (COP)
            <input
              className="field mt-1"
              type="number"
              min={0}
              value={settings.expert_default_service_price_cop}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  expert_default_service_price_cop: Number(e.target.value),
                })
              }
            />
          </label>
          <label className="block text-sm">
            Comisión default %
            <input
              className="field mt-1"
              type="number"
              min={0}
              max={100}
              value={settings.expert_default_commission_percent}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  expert_default_commission_percent: Number(e.target.value),
                })
              }
            />
          </label>
        </div>
        {(settings.allies || []).map((a, idx) => {
          const price = a.service_price_cop ?? settings.expert_default_service_price_cop;
          const pct = a.commission_percent ?? settings.expert_default_commission_percent;
          const commissionCop = Math.round(Math.max(0, price) * (Math.max(0, pct) / 100));
          const allyNet = Math.max(0, price - commissionCop);
          return (
          <div
            key={a.id}
            className="space-y-2 border-b pb-3"
            style={{ borderColor: "var(--border)" }}
          >
            <input
              className="field"
              placeholder="Nombre del aliado"
              value={a.name}
              onChange={(e) => {
                const allies = [...settings.allies];
                allies[idx] = { ...a, name: e.target.value };
                setSettings({ ...settings, allies });
              }}
            />
            <input
              className="field"
              type="email"
              placeholder="Correo (notificación)"
              value={a.email}
              onChange={(e) => {
                const allies = [...settings.allies];
                allies[idx] = { ...a, email: e.target.value };
                setSettings({ ...settings, allies });
              }}
            />
            <input
              className="field"
              placeholder="Telegram chat_id (opcional)"
              value={a.telegram_chat_id || ""}
              onChange={(e) => {
                const allies = [...settings.allies];
                allies[idx] = { ...a, telegram_chat_id: e.target.value };
                setSettings({ ...settings, allies });
              }}
            />
            <input
              className="field"
              placeholder="WhatsApp E.164 (ej. 573001234567)"
              value={a.whatsapp_phone || ""}
              onChange={(e) => {
                const allies = [...settings.allies];
                allies[idx] = { ...a, whatsapp_phone: e.target.value };
                setSettings({ ...settings, allies });
              }}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="block text-sm">
                Valor del servicio (COP)
                <input
                  className="field mt-1"
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => {
                    const allies = [...settings.allies];
                    allies[idx] = { ...a, service_price_cop: Number(e.target.value) };
                    setSettings({ ...settings, allies });
                  }}
                />
              </label>
              <label className="block text-sm">
                Comisión %
                <input
                  className="field mt-1"
                  type="number"
                  min={0}
                  max={100}
                  value={pct}
                  onChange={(e) => {
                    const allies = [...settings.allies];
                    allies[idx] = { ...a, commission_percent: Number(e.target.value) };
                    setSettings({ ...settings, allies });
                  }}
                />
              </label>
            </div>
            <p className="text-xs muted">
              Comisión LOTIC (auto): <strong>{commissionCop.toLocaleString("es-CO")} COP</strong>
              {" · "}
              Neto aliado: <strong>{allyNet.toLocaleString("es-CO")} COP</strong>
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              {(
                [
                  ["notify_email", "Email"],
                  ["notify_telegram", "Telegram"],
                  ["notify_whatsapp", "WhatsApp"],
                ] as const
              ).map(([k, label]) => (
                <label key={k} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={a[k] !== false}
                    onChange={(e) => {
                      const allies = [...settings.allies];
                      allies[idx] = { ...a, [k]: e.target.checked };
                      setSettings({ ...settings, allies });
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>
            <p className="text-xs muted">Especialidades</p>
            <div className="flex flex-wrap gap-2">
              {EXPERT_SPECIALTIES.map((s) => {
                const on = (a.specialties || []).includes(s.id);
                return (
                  <label key={s.id} className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => {
                        const allies = [...settings.allies];
                        const set = new Set(a.specialties || []);
                        if (on) set.delete(s.id);
                        else set.add(s.id);
                        allies[idx] = { ...a, specialties: [...set] };
                        setSettings({ ...settings, allies });
                      }}
                    />
                    {s.label}
                  </label>
                );
              })}
            </div>
            <textarea
              className="field min-h-16"
              placeholder="Notas públicas (bio corta)"
              value={a.notes || ""}
              onChange={(e) => {
                const allies = [...settings.allies];
                allies[idx] = { ...a, notes: e.target.value };
                setSettings({ ...settings, allies });
              }}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={a.active}
                onChange={(e) => {
                  const allies = [...settings.allies];
                  allies[idx] = { ...a, active: e.target.checked };
                  setSettings({ ...settings, allies });
                }}
              />
              Activo
            </label>
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                setSettings({
                  ...settings,
                  allies: settings.allies.filter((_, i) => i !== idx),
                })
              }
            >
              Quitar aliado
            </button>
          </div>
          );
        })}
        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            setSettings({
              ...settings,
              allies: [
                ...(settings.allies || []),
                {
                  id: `ally_${Date.now()}`,
                  name: "Nuevo aliado",
                  email: "",
                  telegram_chat_id: "",
                  whatsapp_phone: "",
                  specialties: ["cv", "carrera"],
                  active: true,
                  notes: "",
                  service_price_cop: settings.expert_default_service_price_cop,
                  commission_percent: settings.expert_default_commission_percent,
                  notify_email: true,
                  notify_telegram: true,
                  notify_whatsapp: true,
                },
              ],
            })
          }
        >
          Añadir aliado
        </button>
        <Link href="/admin/expertos" className="btn-primary">
          Abrir tablero de conciliación / cortes
        </Link>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Alumni / comunidad</h2>
        <input
          className="field"
          placeholder="URL Telegram comunidad"
          value={settings.alumni?.telegram_url || ""}
          onChange={(e) =>
            setSettings({
              ...settings,
              alumni: { ...settings.alumni, telegram_url: e.target.value },
            })
          }
        />
        <input
          className="field"
          placeholder="URL Discord (opcional)"
          value={settings.alumni?.discord_url || ""}
          onChange={(e) =>
            setSettings({
              ...settings,
              alumni: { ...settings.alumni, discord_url: e.target.value },
            })
          }
        />
        <textarea
          className="field min-h-16"
          placeholder="Nota AMA / comunidad"
          value={settings.alumni?.ama_note || ""}
          onChange={(e) =>
            setSettings({
              ...settings,
              alumni: { ...settings.alumni, ama_note: e.target.value },
            })
          }
        />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Promociones</h2>
        {(settings.promotions || []).map((p, idx) => (
          <div key={`${p.code}-${idx}`} className="space-y-2 border-b pb-3" style={{ borderColor: "var(--border)" }}>
            <input
              className="field"
              placeholder="Nombre"
              value={p.name}
              onChange={(e) => {
                const promotions = [...settings.promotions];
                promotions[idx] = { ...p, name: e.target.value };
                setSettings({ ...settings, promotions });
              }}
            />
            <input
              className="field"
              placeholder="Código"
              value={p.code || ""}
              onChange={(e) => {
                const promotions = [...settings.promotions];
                promotions[idx] = { ...p, code: e.target.value };
                setSettings({ ...settings, promotions });
              }}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className="field"
                type="number"
                placeholder="% dto"
                value={p.percent}
                onChange={(e) => {
                  const promotions = [...settings.promotions];
                  promotions[idx] = { ...p, percent: Number(e.target.value) };
                  setSettings({ ...settings, promotions });
                }}
              />
              <input
                className="field"
                type="number"
                placeholder="$ fijo"
                value={p.amount}
                onChange={(e) => {
                  const promotions = [...settings.promotions];
                  promotions[idx] = { ...p, amount: Number(e.target.value) };
                  setSettings({ ...settings, promotions });
                }}
              />
              <input
                className="field"
                type="date"
                value={p.starts || ""}
                onChange={(e) => {
                  const promotions = [...settings.promotions];
                  promotions[idx] = { ...p, starts: e.target.value };
                  setSettings({ ...settings, promotions });
                }}
              />
              <input
                className="field"
                type="date"
                value={p.ends || ""}
                onChange={(e) => {
                  const promotions = [...settings.promotions];
                  promotions[idx] = { ...p, ends: e.target.value };
                  setSettings({ ...settings, promotions });
                }}
              />
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                setSettings({
                  ...settings,
                  promotions: settings.promotions.filter((_, i) => i !== idx),
                })
              }
            >
              Quitar
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            setSettings({
              ...settings,
              promotions: [
                ...settings.promotions,
                { name: "PROMO", code: "PROMO10", percent: 10, amount: 0, starts: "", ends: "" },
              ],
            })
          }
        >
          Añadir promoción
        </button>
      </section>

      <section className="bento-card space-y-2 text-sm muted">
        <h2 className="font-semibold text-[var(--text)]">Salud / Sentry interno</h2>
        <p>API health: {health}</p>
        <p>
          Errores → log + envelope Sentry (si SENTRY_DSN) + Telegram al owner con throttle 15 min. Cron diario:{" "}
          <code>/api/cron/audit</code>.
        </p>
        <button type="button" className="btn-secondary" disabled={testingAlert} onClick={runHealthAlert}>
          {testingAlert ? "Enviando…" : "Enviar reporte de salud a Telegram ahora"}
        </button>
      </section>

      <button type="button" className="btn-primary" onClick={save}>
        Guardar todo
      </button>
      {msg && <p className="text-sm">{msg}</p>}
      <Link href="/admin/analytics" className="btn-secondary">
        Analytics
      </Link>
      <Link href="/" className="btn-secondary">
        Salir
      </Link>
    </div>
  );
}
