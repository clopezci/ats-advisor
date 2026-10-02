import { NextResponse } from "next/server";
import { isOwnerEmail } from "@/lib/admin/testers";
import { userEmailFromBearer } from "@/lib/admin/sessionEmail";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";
import { readSettings, writeSettings } from "@/lib/settings";
import { hydrateSettingsFromCloud, persistSettingsToCloud } from "@/lib/settingsPersist";
import { isValidEmail } from "@/lib/validation";

type ListKey = "tester_emails" | "psico_practica_emails";

function normalizeList(list: string[]): string[] {
  return [...new Set(list.map((s) => String(s).trim().toLowerCase()).filter((s) => s.includes("@")))];
}

/**
 * Dueño autenticado: ver / añadir / quitar correos de tester o práctica psico.
 * No pide ADMIN_SECRET (eso queda para /admin completo).
 */
export async function GET(req: Request) {
  const limited = rateLimit(req, "owner-whitelist-get", { limit: 30, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const email = await userEmailFromBearer(req);
    if (!email || !isOwnerEmail(email)) {
      return NextResponse.json({ error: "Solo el dueño con sesión" }, { status: 401 });
    }
    await hydrateSettingsFromCloud();
    const s = readSettings();
    return NextResponse.json({
      ok: true,
      tester_emails: s.tester_emails || [],
      psico_practica_emails: s.psico_practica_emails || [],
    });
  } catch (e) {
    await reportError({ where: "api/owner/whitelist:GET", error: e });
    return NextResponse.json({ error: "No se pudo cargar" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const limited = rateLimit(req, "owner-whitelist-post", { limit: 20, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const sessionEmail = await userEmailFromBearer(req);
    if (!sessionEmail || !isOwnerEmail(sessionEmail)) {
      return NextResponse.json(
        { error: "Entra con el correo dueño (magic link) para gestionar permisos." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const target = String(body.email || "")
      .trim()
      .toLowerCase();
    const list = (body.list === "psico_practica_emails" ? "psico_practica_emails" : "tester_emails") as ListKey;
    const action = body.action === "remove" ? "remove" : "add";

    if (!isValidEmail(target)) {
      return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }

    await hydrateSettingsFromCloud();
    const current = readSettings();
    const prev = normalizeList(current[list] || []);
    const next =
      action === "remove" ? prev.filter((e) => e !== target) : normalizeList([...prev, target]);

    const merged = { ...current, [list]: next };
    writeSettings(merged);
    const persisted = await persistSettingsToCloud(merged);

    return NextResponse.json({
      ok: true,
      list,
      emails: next,
      cloud: persisted.cloud,
    });
  } catch (e) {
    await reportError({ where: "api/owner/whitelist:POST", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
  }
}
