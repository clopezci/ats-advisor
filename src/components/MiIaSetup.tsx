"use client";

import { useState } from "react";
import Link from "next/link";
import {
  USER_AI_KEY_GUIDES,
  hasUserAiKeys,
  loadUserAiKeys,
  maskUserAiKey,
  saveUserAiKeys,
  type UserAiKeys,
  type UserAiProvider,
} from "@/lib/ai/userKeysClient";

/**
 * Configuración BYOK al estilo Aquí Entiendes: Groq/Gemini gratis en el dispositivo.
 */
export function MiIaSetup({ onDone }: { onDone?: () => void }) {
  const [keys, setKeys] = useState<UserAiKeys>(() =>
    typeof window !== "undefined" ? loadUserAiKeys() : {}
  );
  const [open, setOpen] = useState<UserAiProvider | null>(null);
  const [draft, setDraft] = useState("");
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  async function testAndSave(id: UserAiProvider) {
    const value = draft.trim();
    if (!value || testing) return;
    setTesting(true);
    setError("");
    setOkMsg("");
    try {
      const res = await fetch("/api/ai/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-keys": JSON.stringify({ [id]: value }) },
        body: JSON.stringify({ provider: id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(
          data.error ||
            "Esa clave no funcionó. Revisa que esté completa y sea del proveedor correcto."
        );
        return;
      }
      const next = { ...keys, [id]: value };
      setKeys(next);
      saveUserAiKeys(next);
      setDraft("");
      setOpen(null);
      setOkMsg(`Listo: ${data.label || id} responde con tu clave.`);
      onDone?.();
    } catch {
      setError("No se pudo probar la clave. Revisa tu conexión.");
    } finally {
      setTesting(false);
    }
  }

  function removeKey(id: UserAiProvider) {
    const next = { ...keys };
    delete next[id];
    setKeys(next);
    saveUserAiKeys(next);
    onDone?.();
  }

  const freeGuides = USER_AI_KEY_GUIDES.filter((g) => !g.pago);
  const paidGuides = USER_AI_KEY_GUIDES.filter((g) => g.pago);
  const configured = Object.keys(keys) as UserAiProvider[];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Mi IA</h1>
        <p className="mt-1 text-sm muted leading-relaxed">
          En el plan gratis puedes usar <strong>tu propia clave</strong> (Groq o Gemini, en 2 minutos).
          Se guarda solo en este dispositivo: no la enviamos a nuestra base de datos. Así la app
          no gasta el cupo compartido cuando hay cientos de personas usándola.
        </p>
      </div>

      {!hasUserAiKeys() && (
        <p className="rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
          Sin tu clave, carta / tips / ajuste con IA usan modo local (plantillas útiles, sin modelo
          online). Con Groq gratis recuperas calidad de IA sin pagar plan Carrera.
        </p>
      )}

      {configured.length > 0 && (
        <div className="bento-card space-y-2">
          <h2 className="text-sm font-semibold">Claves en este dispositivo</h2>
          {configured.map((id) => {
            const g = USER_AI_KEY_GUIDES.find((x) => x.id === id);
            return (
              <div key={id} className="flex items-center justify-between gap-2 text-sm">
                <span>
                  {g?.name || id}: <code className="text-xs">{maskUserAiKey(keys[id] || "")}</code>
                </span>
                <button type="button" className="btn-secondary !py-1 !px-2 text-xs" onClick={() => removeKey(id)}>
                  Quitar
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Gratuitas (recomendadas)</h2>
        {freeGuides.map((g) => (
          <GuideCard
            key={g.id}
            guide={g}
            open={open === g.id}
            draft={open === g.id ? draft : ""}
            testing={testing && open === g.id}
            onToggle={() => {
              setOpen(open === g.id ? null : g.id);
              setDraft("");
              setError("");
            }}
            onDraft={setDraft}
            onSave={() => testAndSave(g.id)}
          />
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold">De pago (opcional)</h2>
        {paidGuides.map((g) => (
          <GuideCard
            key={g.id}
            guide={g}
            open={open === g.id}
            draft={open === g.id ? draft : ""}
            testing={testing && open === g.id}
            onToggle={() => {
              setOpen(open === g.id ? null : g.id);
              setDraft("");
              setError("");
            }}
            onDraft={setDraft}
            onSave={() => testAndSave(g.id)}
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {okMsg && <p className="text-sm text-emerald-700">{okMsg}</p>}

      <p className="text-xs muted leading-relaxed">
        Tip: ChatGPT Plus / Claude Pro / Cursor no entregan una API abierta. Si quieres esos
        modelos aquí, crea una clave de API aparte (OpenAI, etc.).
      </p>

      <Link href="/cuenta" className="btn-secondary inline-flex">
        Volver a Mi cuenta
      </Link>
    </div>
  );
}

function GuideCard(props: {
  guide: (typeof USER_AI_KEY_GUIDES)[number];
  open: boolean;
  draft: string;
  testing: boolean;
  onToggle: () => void;
  onDraft: (v: string) => void;
  onSave: () => void;
}) {
  const { guide: g, open, draft, testing, onToggle, onDraft, onSave } = props;
  return (
    <div className="bento-card space-y-2">
      <button type="button" className="flex w-full items-start justify-between gap-2 text-left" onClick={onToggle}>
        <div>
          <p className="font-medium text-sm">{g.name}</p>
          <p className="text-xs muted mt-0.5">{g.why}</p>
          <p className="text-xs mt-1" style={{ color: "var(--brand)" }}>
            {g.free}
          </p>
        </div>
        <span className="text-xs muted shrink-0">{open ? "Cerrar" : "Configurar"}</span>
      </button>
      {open && (
        <div className="space-y-2 border-t border-[var(--border)] pt-2">
          <ol className="list-decimal pl-4 text-xs muted space-y-1">
            {g.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <a href={g.url} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: "var(--brand)" }}>
            Abrir {g.name}
          </a>
          <p className="text-[11px] muted">La clave {g.looks.toLowerCase()}.</p>
          <input
            className="field text-sm font-mono"
            type="password"
            autoComplete="off"
            placeholder="Pega tu API key"
            value={draft}
            onChange={(e) => onDraft(e.target.value)}
          />
          <button type="button" className="btn-primary" disabled={testing || draft.trim().length < 20} onClick={onSave}>
            {testing ? "Probando…" : "Probar y guardar"}
          </button>
        </div>
      )}
    </div>
  );
}
