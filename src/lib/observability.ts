/**
 * Soft observability: console + optional Telegram + optional Sentry envelope (no SDK required).
 */
import { notifyOwnerTelegram } from "@/lib/notify/channels";

type ReportOpts = {
  where: string;
  error: unknown;
  notifyOwner?: boolean;
};

function messageOf(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error || "unknown");
}

async function postSentry(message: string, where: string) {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  try {
    // DSN: https://<key>@<host>/<projectId>
    const m = dsn.match(/^https:\/\/([^@]+)@([^/]+)\/(\d+)/);
    if (!m) return;
    const [, key, host, projectId] = m;
    const url = `https://${host}/api/${projectId}/store/?sentry_key=${key}&sentry_version=7`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        level: "error",
        platform: "javascript",
        tags: { where },
        timestamp: Date.now() / 1000,
      }),
    });
  } catch {
    /* ignore */
  }
}

export async function reportError(opts: ReportOpts) {
  const msg = messageOf(opts.error);
  console.error(`[ATSAdvisor:${opts.where}]`, msg, opts.error);
  await postSentry(msg, opts.where);
  if (opts.notifyOwner) {
    await notifyOwnerTelegram(`Error ${opts.where}: ${msg}`.slice(0, 500));
  }
}

export function clientReportError(where: string, error: unknown) {
  try {
    console.error(`[client:${where}]`, error);
    const msg = messageOf(error);
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const body = JSON.stringify({ message: `[${where}] ${msg}`, email: "" });
      navigator.sendBeacon("/api/feedback", new Blob([body], { type: "application/json" }));
    }
  } catch {
    /* ignore */
  }
}
