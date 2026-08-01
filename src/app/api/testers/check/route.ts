import { NextResponse } from "next/server";
import { isTesterEmail } from "@/lib/admin/testers";

export async function GET(req: Request) {
  const email = new URL(req.url).searchParams.get("email") || "";
  const ok = isTesterEmail(email);
  return NextResponse.json({ ok, tester: ok });
}
