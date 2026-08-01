import { NextResponse } from "next/server";
import { defaultSettings, readSettings, writeSettings } from "@/lib/settings";
import { hydrateSettingsFromCloud, persistSettingsToCloud } from "@/lib/settingsPersist";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") || req.headers.get("x-admin-secret");
  if (!isAdmin(secret)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  await hydrateSettingsFromCloud();
  return NextResponse.json({ ok: true, settings: readSettings() });
}

export async function PUT(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  if (!isAdmin(secret)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = await req.json();
  const next = { ...defaultSettings(), ...body, pricing: { ...defaultSettings().pricing, ...body.pricing }, ai_limits: { ...defaultSettings().ai_limits, ...body.ai_limits }, features: { ...defaultSettings().features, ...body.features }, llm: { ...defaultSettings().llm, ...body.llm } };
  writeSettings(next);
  const persisted = await persistSettingsToCloud(next);
  return NextResponse.json({ ok: true, settings: next, cloud: persisted.cloud });
}

function isAdmin(secret: string | null) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) return secret === "dev-admin";
  return Boolean(secret && secret === expected);
}
