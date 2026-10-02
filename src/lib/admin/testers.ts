import { readSettings } from "@/lib/settings";

function splitEmails(raw: string | undefined): string[] {
  return (raw || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.includes("@"));
}

/** Dueño por defecto del producto (si falta ADMIN_EMAIL en Vercel). */
const BUILTIN_OWNERS = ["clpezci@gmail.com", "clopezci@gmail.com"];

/** Dueño del producto (ADMIN_EMAIL / ADMIN_OWNER_EMAILS). No abre /admin solo: eso pide ADMIN_SECRET. */
export function isOwnerEmail(email: string) {
  const e = email.trim().toLowerCase();
  if (!e.includes("@")) return false;
  const owners = new Set([
    ...BUILTIN_OWNERS,
    ...splitEmails(process.env.ADMIN_EMAIL),
    ...splitEmails(process.env.ADMIN_OWNER_EMAILS),
  ]);
  return owners.has(e);
}

/** True if email is in owner, tester whitelist (settings or ADMIN_TESTER_EMAILS). */
export function isTesterEmail(email: string) {
  const e = email.trim().toLowerCase();
  if (!e.includes("@")) return false;
  if (isOwnerEmail(e)) return true;
  const fromEnv = splitEmails(process.env.ADMIN_TESTER_EMAILS);
  const fromSettings = (readSettings().tester_emails || []).map((s) => String(s).trim().toLowerCase());
  return new Set([...fromEnv, ...fromSettings]).has(e);
}

/**
 * Práctica psicotécnica ilimitada (explicaciones + IA).
 * Solo correos en settings.psico_practica_emails (o env ADMIN_PSICO_PRACTICA_EMAILS).
 * Dueño/tester NO la tienen por defecto.
 */
export function isPsicoPracticaEmail(email: string) {
  const e = email.trim().toLowerCase();
  if (!e.includes("@")) return false;
  const fromEnv = splitEmails(process.env.ADMIN_PSICO_PRACTICA_EMAILS);
  const fromSettings = (readSettings().psico_practica_emails || []).map((s) =>
    String(s).trim().toLowerCase()
  );
  return new Set([...fromEnv, ...fromSettings]).has(e);
}
