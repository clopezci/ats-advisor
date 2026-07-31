import { NextResponse } from "next/server";
import { readSettings } from "@/lib/settings";
import { notifyOwnerTelegram } from "@/lib/notify/channels";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const plan = String(body.plan || "carrera") as "carrera" | "plus" | "out09_extra";
  const email = String(body.email || "").trim();
  const settings = readSettings();
  const amount = settings.pricing[plan] || settings.pricing.carrera;
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const privateKey = process.env.WOMPI_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    return NextResponse.json({
      ok: false,
      mode: "demo",
      message:
        "Wompi no configurado. Agrega WOMPI_PUBLIC_KEY y WOMPI_PRIVATE_KEY en Vercel (MANUAL-ACCIONES.md).",
      amount,
      currency: settings.pricing.currency,
      plan,
    });
  }

  // Referencia única para conciliar en webhook
  const reference = `ATS-${plan}-${Date.now()}`;
  await notifyOwnerTelegram(`Checkout iniciado: ${plan} ${amount} COP · ${email || "sin email"} · ${reference}`);

  return NextResponse.json({
    ok: true,
    mode: "wompi",
    publicKey,
    reference,
    amountInCents: amount * 100,
    currency: "COP",
    plan,
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://ats-advisor-two.vercel.app"}/precios?paid=1`,
  });
}
