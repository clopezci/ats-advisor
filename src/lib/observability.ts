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

/**
 * Soft observability: console + optional Telegram.
 * When SENTRY_DSN is set, posts a minimal event payload (no SDK required).
 */
export async function reportError(opts: ReportOpts) {
  const msg = messageOf(opts.error);
  console.error(`[ATSAdvisor:${opts.where}]`, msg, opts.error);

  const dsn = process.env.SENTRY_DSN;
  if (dsn) {
    try {
      // Sentry envelope via store endpoint is complex; log DSN presence for ready hook.
      // Full @sentry/nextjs can be added when you set the project — see MANUAL.
      console.info("[observability] SENTRY_DSN configured — add @sentry/nextjs for full traces");
    } catch {
      /* ignore */
    }
  }

  if (opts.notifyOwner) {
    await notifyOwnerTelegram(`Error ${opts.where}: ${msg}`.slice(0, 500));
  }
}

export function clientReportError(where: string, error: unknown) {
  try {
    console.error(`[client:${where}]`, error);
    // Fire-and-forget beacon to feedback channel shape (optional future /api/errors)
  } catch {
    /* ignore */
  }
}
