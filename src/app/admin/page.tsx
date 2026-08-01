"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

type Settings = {
  pricing: { carrera: number; plus: number; out09_extra: number; currency: string };
  features: { ads: boolean; whatsapp: boolean; telegram: boolean };
  ai_limits: { free_ats_per_day: number; quality_threshold: number };
  promotions: { name: string; percent: number; amount: number; starts: string; ends: string; code?: string }[];
  tester_emails: string[];
};

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch(`/api/admin/settings?secret=${encodeURIComponent(secret)}`);
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "No autorizado");
      return;
    }
    setSettings(data.settings);
    setAuthed(true);
    setMsg("");
  }

  async function save() {
    if (!settings) return;
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    setMsg(res.ok ? "Guardado" : data.error || "Error");
  }

  useEffect(() => {
    const s = sessionStorage.getItem("admin_secret");
    if (s) setSecret(s);
  }, []);

  if (!authed || !settings) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <h1 className="text-2xl font-semibold">Admin LOTIC</h1>
        <p className="text-sm muted">Entra con tu ADMIN_SECRET (o `dev-admin` en local).</p>
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
        {msg && <p className="text-sm" style={{ color: "var(--danger)" }}>{msg}</p>}
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
        <SpeakButton text="Panel de administración: precios, límites de IA, canales y promociones." />
      </div>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Precios COP</h2>
        {(["carrera", "plus", "out09_extra"] as const).map((k) => (
          <label key={k} className="block text-sm">
            {k}
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
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Límites IA</h2>
        <label className="block text-sm">
          ATS free / día
          <input
            className="field mt-1"
            type="number"
            value={settings.ai_limits.free_ats_per_day}
            onChange={(e) =>
              setSettings({
                ...settings,
                ai_limits: { ...settings.ai_limits, free_ats_per_day: Number(e.target.value) },
              })
            }
          />
        </label>
        <label className="block text-sm">
          Umbral calidad (0-1)
          <input
            className="field mt-1"
            type="number"
            step="0.01"
            value={settings.ai_limits.quality_threshold}
            onChange={(e) =>
              setSettings({
                ...settings,
                ai_limits: { ...settings.ai_limits, quality_threshold: Number(e.target.value) },
              })
            }
          />
        </label>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Canales</h2>
        {(["ads", "telegram", "whatsapp"] as const).map((k) => (
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
        <h2 className="font-semibold">Testers (premium sin pago)</h2>
        <p className="text-sm muted">
          Correos con plan tester. También puedes usar env ADMIN_TESTER_EMAILS.
        </p>
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
        <h2 className="font-semibold">Promociones</h2>
        {(settings.promotions || []).map((p, idx) => (
          <div key={`${p.name}-${idx}`} className="space-y-2 border-b pb-3" style={{ borderColor: "var(--border)" }}>
            <input
              className="field"
              placeholder="Nombre cupón"
              value={p.name}
              onChange={(e) => {
                const promotions = [...settings.promotions];
                promotions[idx] = { ...p, name: e.target.value };
                setSettings({ ...settings, promotions });
              }}
            />
            <input
              className="field"
              placeholder="Código (ej. LOTIC10)"
              value={(p as { code?: string }).code || ""}
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
        <h2 className="font-semibold text-[var(--text)]">Salud</h2>
        <HealthPanel />
        <p>Sentry: opcional vía SENTRY_DSN (envelope sin SDK). Cron: /api/cron/audit y /api/cron/capsules.</p>
      </section>

      <button type="button" className="btn-primary" onClick={save}>
        Guardar
      </button>
      {msg && <p className="text-sm">{msg}</p>}
      <Link href="/admin/analytics" className="btn-secondary">
        Ver analytics
      </Link>
      <Link href="/admin/analytics/pro" className="btn-secondary">
        Analytics Pro
      </Link>
      <Link href="/" className="btn-secondary">
        Salir al inicio
      </Link>
    </div>
  );
}

function HealthPanel() {
  const [health, setHealth] = useState<string>("…");
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setHealth(d.ok ? `OK · ${d.service || "atsadvisor"}` : "Degradado"))
      .catch(() => setHealth("Sin respuesta"));
  }, []);
  return <p>API health: {health}</p>;
}
