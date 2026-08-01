import { readSettings } from "@/lib/settings";

/** True if email is in admin tester whitelist (settings or ADMIN_TESTER_EMAILS). */
export function isTesterEmail(email: string) {
  const e = email.trim().toLowerCase();
  if (!e.includes("@")) return false;
  const fromEnv = (process.env.ADMIN_TESTER_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const fromSettings = readSettings().tester_emails || [];
  return new Set([...fromEnv, ...fromSettings]).has(e);
}
