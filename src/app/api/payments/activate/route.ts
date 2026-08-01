import { NextResponse } from "next/server";

/**
 * Demo/local activation after checkout when Supabase auth is not yet bound.
 * Body: { reference, plan?, mode: "client" }
 * Real production should only trust the payments webhook + signed user session.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const reference = String(body.reference || "");
  const planMatch = reference.match(/^ATS-(carrera|plus|out09_extra)-/i);
  const plan = String(body.plan || planMatch?.[1] || "").toLowerCase();

  if (!["carrera", "plus", "out09_extra"].includes(plan)) {
    return NextResponse.json({ error: "Plan o referencia inválidos" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    plan: plan === "out09_extra" ? "carrera" : plan,
    message:
      "Activa el plan en el cliente con setPlan. Con Supabase, este endpoint actualizará profiles.plan.",
  });
}
