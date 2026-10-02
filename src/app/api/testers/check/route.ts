import { NextResponse } from "next/server";
import { isOwnerEmail, isPsicoPracticaEmail, isTesterEmail } from "@/lib/admin/testers";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";

export async function GET(req: Request) {
  await hydrateSettingsFromCloud().catch(() => undefined);
  const email = new URL(req.url).searchParams.get("email") || "";
  const owner = isOwnerEmail(email);
  const tester = owner || isTesterEmail(email);
  const psicoPractica = isPsicoPracticaEmail(email);
  return NextResponse.json({ ok: tester, tester, owner, psicoPractica });
}
