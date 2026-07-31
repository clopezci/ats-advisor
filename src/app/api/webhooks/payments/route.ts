import { NextResponse } from "next/server";

/** Stub de pagos: Wompi/MP se conectan con keys en Vercel. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // Aquí validarás firma Wompi y activarás plan del usuario en Supabase.
  console.info("payment webhook", body);
  return NextResponse.json({ ok: true, received: true });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Configura Wompi y apunta el webhook aquí. Ver MANUAL-ACCIONES.md",
    plans: {
      carrera: 79000,
      plus: 99000,
      out09_extra: 22000,
      currency: "COP",
    },
  });
}
