import { NextResponse } from "next/server";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";
import { readSettings } from "@/lib/settings";
import { specialtyLabel } from "@/lib/experts/specialties";

/** Lista pública de aliados activos (sin telegram_chat_id). */
export async function GET() {
  await hydrateSettingsFromCloud();
  const s = readSettings();
  if (!s.features.experts) {
    return NextResponse.json({ ok: true, enabled: false, allies: [] });
  }
  const allies = (s.allies || [])
    .filter((a) => a.active && a.email.includes("@"))
    .map((a) => ({
      id: a.id,
      name: a.name,
      specialties: a.specialties,
      specialtyLabels: a.specialties.map(specialtyLabel),
      notes: a.notes || "",
    }));
  return NextResponse.json({ ok: true, enabled: true, allies });
}
