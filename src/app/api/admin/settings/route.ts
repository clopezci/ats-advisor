import { NextResponse } from "next/server";
import { readSettings, writeSettings } from "@/lib/settings";
import { hydrateSettingsFromCloud, persistSettingsToCloud } from "@/lib/settingsPersist";
import { isAdminSecret } from "@/lib/admin/auth";
import { sanitizeSettingsPatch } from "@/lib/validation";
import { reportError } from "@/lib/observability";

export async function GET(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  if (!isAdminSecret(secret)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    await hydrateSettingsFromCloud();
    return NextResponse.json({ ok: true, settings: readSettings() });
  } catch (e) {
    await reportError({ where: "api/admin/settings:GET", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudieron cargar settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  if (!isAdminSecret(secret)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    await hydrateSettingsFromCloud();
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }
    // Merge with current so partial UI saves don't wipe fields
    const current = readSettings();
    const merged = sanitizeSettingsPatch({
      ...current,
      ...body,
      pricing: { ...current.pricing, ...(body as { pricing?: object }).pricing },
      whatsapp_cost: { ...current.whatsapp_cost, ...(body as { whatsapp_cost?: object }).whatsapp_cost },
      ai_limits: { ...current.ai_limits, ...(body as { ai_limits?: object }).ai_limits },
      features: { ...current.features, ...(body as { features?: object }).features },
      llm: { ...current.llm, ...(body as { llm?: object }).llm },
      allies: (body as { allies?: unknown }).allies ?? current.allies,
    });
    writeSettings(merged);
    const persisted = await persistSettingsToCloud(merged);
    return NextResponse.json({ ok: true, settings: merged, cloud: persisted.cloud });
  } catch (e) {
    await reportError({ where: "api/admin/settings:PUT", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudieron guardar settings" }, { status: 500 });
  }
}
