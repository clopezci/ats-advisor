/**
 * Observabilidad interna estilo “Sentry ligero”:
 * - log estructurado
 * - dedupe / throttle de alertas Telegram
 * - envelope Sentry opcional (SENTRY_DSN)
 * - health probe + reporte al owner
 */
import { notifyOwnerTelegram } from "@/lib/notify/channels";

type Severity = "error" | "warning" | "info";

type ReportOpts = {
  where: string;
  error?: unknown;
  message?: string;
  notifyOwner?: boolean;
  severity?: Severity;
  meta?: Record<string, unknown>;
};

type AlertState = {
  lastSent: Map<string, number>;
  counts: Map<string, number>;
};

const g = globalThis as unknown as { __atsAlertState?: AlertState };

function state(): AlertState {
  if (!g.__atsAlertState) {
    g.__atsAlertState = { lastSent: new Map(), counts: new Map() };
  }
  return g.__atsAlertState;
}

function messageOf(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error || "unknown");
}

/** Dedupe key: where + normalized message (15 min throttle). */
const THROTTLE_MS = 15 * 60 * 1000;

function shouldNotify(key: string): boolean {
  const s = state();
  const now = Date.now();
  const last = s.lastSent.get(key) || 0;
  s.counts.set(key, (s.counts.get(key) || 0) + 1);
  if (now - last < THROTTLE_MS) return false;
  s.lastSent.set(key, now);
  return true;
}

async function postSentryEnvelope(message: string, where: string, severity: Severity) {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return { ok: false as const, reason: "no_dsn" };
  try {
    // https://<public_key>@<host>/<project_id>
    const m = dsn.match(/^https:\/\/([^@]+)@([^/]+)\/(\d+)/);
    if (!m) return { ok: false as const, reason: "bad_dsn" };
    const [, key, host, projectId] = m;
    const eventId = crypto.randomUUID().replace(/-/g, "");
    const envelopeHeader = JSON.stringify({
      event_id: eventId,
      sent_at: new Date().toISOString(),
      dsn,
    });
    const itemHeader = JSON.stringify({ type: "event", content_type: "application/json" });
    const payload = JSON.stringify({
      event_id: eventId,
      timestamp: Date.now() / 1000,
      platform: "node",
      level: severity === "warning" ? "warning" : severity === "info" ? "info" : "error",
      message,
      tags: { where, app: "atsadvisor" },
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
      release: process.env.VERCEL_GIT_COMMIT_SHA || undefined,
    });
    const body = `${envelopeHeader}\n${itemHeader}\n${payload}\n`;
    const url = `https://${host}/api/${projectId}/envelope/`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-sentry-envelope",
        "X-Sentry-Auth": `Sentry sentry_version=7, sentry_key=${key}, sentry_client=atsadvisor-internal/1.0`,
      },
      body,
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false as const, reason: messageOf(e) };
  }
}

export async function reportError(opts: ReportOpts) {
  const severity = opts.severity || "error";
  const msg = opts.message || messageOf(opts.error);
  const line = `[ATSAdvisor:${opts.where}] ${msg}`;
  if (severity === "error") console.error(line, opts.error ?? "", opts.meta || "");
  else console.warn(line, opts.meta || "");

  await postSentryEnvelope(msg, opts.where, severity);

  if (opts.notifyOwner) {
    const key = `${opts.where}|${msg.slice(0, 80)}`;
    if (shouldNotify(key)) {
      const suppressed = state().counts.get(key) || 1;
      const extra = suppressed > 1 ? ` (×${suppressed} en ventana)` : "";
      await notifyOwnerTelegram(`⚠ ${severity.toUpperCase()} ${opts.where}: ${msg}${extra}`.slice(0, 500));
      state().counts.set(key, 0);
    }
  }
}

/** Alias explícito del módulo interno. */
export const internalSentry = { report: reportError };

export function clientReportError(where: string, error: unknown) {
  try {
    console.error(`[client:${where}]`, error);
    const msg = messageOf(error);
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const body = JSON.stringify({
        where,
        message: msg,
        kind: "client_error",
      });
      navigator.sendBeacon("/api/observability/client", new Blob([body], { type: "application/json" }));
    }
  } catch {
    /* ignore */
  }
}

export type HealthSnapshot = {
  ok: boolean;
  degraded: string[];
  checks: Record<string, boolean | number>;
  ts: string;
};

export function buildHealthSnapshot(): HealthSnapshot {
  const checks: Record<string, boolean | number> = {
    app: true,
    groq: Boolean(process.env.GROQ_API_KEY),
    gemini: Boolean(process.env.GOOGLE_AI_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
    openrouter: Boolean(process.env.OPENROUTER_API_KEY),
    telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_OWNER_CHAT_ID),
    whatsapp: Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
    supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    resend: Boolean(process.env.RESEND_API_KEY),
    wompi: Boolean(process.env.WOMPI_PUBLIC_KEY && process.env.WOMPI_PRIVATE_KEY),
    mercadopago: Boolean(process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN),
    cron_secret: Boolean(process.env.CRON_SECRET),
    admin_secret: Boolean(process.env.ADMIN_SECRET),
    sentry: Boolean(process.env.SENTRY_DSN),
  };
  const critical = ["app", "admin_secret"] as const;
  const degraded = Object.entries(checks)
    .filter(([k, v]) => typeof v === "boolean" && !v && !critical.includes(k as (typeof critical)[number]))
    .map(([k]) => k);
  const ok = Boolean(checks.app);
  return { ok, degraded, checks, ts: new Date().toISOString() };
}

/** Compara health y alerta solo si empeora (o es el primer reporte del día). */
export async function reportHealthToTelegram(opts?: { force?: boolean }) {
  const snap = buildHealthSnapshot();
  const s = state();
  const key = "health_digest";
  const fingerprint = `${snap.ok}|${snap.degraded.sort().join(",")}`;
  const prev = s.lastSent.get("health_fp");
  const changed = String(prev) !== fingerprint;
  // store fingerprint as number hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) hash = (hash * 31 + fingerprint.charCodeAt(i)) | 0;
  s.lastSent.set("health_fp", hash);

  if (!opts?.force && !changed && !shouldNotify(key)) {
    return { sent: false, snap, reason: "unchanged_throttled" as const };
  }

  const lines = [
    `🩺 Salud ATSAdvisor ${snap.ts}`,
    `Estado: ${snap.ok ? "OK" : "DEGRADADO"}`,
    snap.degraded.length ? `Faltantes/degradados: ${snap.degraded.join(", ")}` : "Integraciones críticas presentes.",
    `Groq:${snap.checks.groq ? "✓" : "✗"} Gemini:${snap.checks.gemini ? "✓" : "✗"} OR:${snap.checks.openrouter ? "✓" : "✗"} TG:${snap.checks.telegram ? "✓" : "✗"} SB:${snap.checks.supabase ? "✓" : "✗"}`,
  ];
  await notifyOwnerTelegram(lines.join("\n"));
  s.lastSent.set(key, Date.now());
  return { sent: true, snap, reason: changed ? ("changed" as const) : ("forced" as const) };
}
