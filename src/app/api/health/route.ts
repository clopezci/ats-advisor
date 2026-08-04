import { NextResponse } from "next/server";
import { buildHealthSnapshot } from "@/lib/observability";
import { isAdminSecret } from "@/lib/admin/auth";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";

export async function GET(req: Request) {
  const snap = buildHealthSnapshot();
  const secret = req.headers.get("x-admin-secret");
  const detailed = isAdminSecret(secret);

  const publicPayload = {
    ok: snap.ok,
    service: "atsadvisor",
    ts: snap.ts,
    modules: OUTPLACEMENT_MODULES.length,
  };

  if (!detailed) {
    return NextResponse.json(publicPayload, { status: snap.ok ? 200 : 503 });
  }

  return NextResponse.json(
    {
      ...publicPayload,
      degraded: snap.degraded,
      checks: { ...snap.checks, modules: OUTPLACEMENT_MODULES.length },
    },
    { status: snap.ok ? 200 : 503 }
  );
}
