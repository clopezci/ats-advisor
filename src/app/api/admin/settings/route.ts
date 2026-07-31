import { NextResponse } from "next/server";
import { defaultSettings, readSettings, writeSettings } from "@/lib/settings";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") || req.headers.get("x-admin-secret");
  if (!isAdmin(secret)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, settings: readSettings() });
}

export async function PUT(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  if (!isAdmin(secret)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = await req.json();
  const next = { ...defaultSettings(), ...body };
  writeSettings(next);
  return NextResponse.json({ ok: true, settings: next });
}

function isAdmin(secret: string | null) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) return secret === "dev-admin"; // local demo
  return Boolean(secret && secret === expected);
}
