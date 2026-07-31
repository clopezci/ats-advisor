"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

type Settings = {
  pricing: { carrera: number; plus: number; out09_extra: number; currency: string };
  features: { ads: boolean; whatsapp: boolean; telegram: boolean };
  ai_limits: { free_ats_per_day: number; quality_threshold: number };
  promotions: { name: string; percent: number; amount: number; starts: string; ends: string }[];
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

      <section className="bento-card space-y-2 text-sm muted">
        <h2 className="font-semibold text-[var(--text)]">Salud</h2>
        <p>Sentry/Telegram: configura SENTRY_DSN y TELEGRAM_* (ver MANUAL-ACCIONES.md).</p>
        <p>Auditoría cron: se activará con Supabase + job externo (Vercel Cron).</p>
      </section>

      <button type="button" className="btn-primary" onClick={save}>
        Guardar
      </button>
      {msg && <p className="text-sm">{msg}</p>}
      <Link href="/admin/analytics" className="btn-secondary">
        Ver analytics
      </Link>
      <Link href="/" className="btn-secondary">
        Salir al inicio
      </Link>
    </div>
  );
}
