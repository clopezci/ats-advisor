import { NextResponse } from "next/server";
import { isOwnerEmail, isTesterEmail } from "@/lib/admin/testers";

export async function GET(req: Request) {
  const email = new URL(req.url).searchParams.get("email") || "";
  const owner = isOwnerEmail(email);
  const tester = owner || isTesterEmail(email);
  return NextResponse.json({ ok: tester, tester, owner });
}
