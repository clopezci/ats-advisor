import { NextResponse } from "next/server";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";

export async function GET() {
  return NextResponse.json({
    ok: true,
    modules: OUTPLACEMENT_MODULES.map((m) => ({
      code: m.code,
      title: m.title,
      summary: m.summary,
      days: m.days,
    })),
  });
}
