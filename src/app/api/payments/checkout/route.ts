import { NextResponse } from "next/server";
import { readSettings } from "@/lib/settings";
import { notifyOwnerTelegram } from "@/lib/notify/channels";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const plan = String(body.plan || "carrera") as "carrera" | "plus" | "out09_extra";
  const email = String(body.email || "").trim();
  const preferred = String(body.provider || "auto"); // auto | wompi | mercadopago
  const settings = readSettings();
  const amount = settings.pricing[plan] || settings.pricing.carrera;
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://ats-advisor-two.vercel.app";
  const reference = `ATS-${plan}-${Date.now()}`;

  const wompiPub = process.env.WOMPI_PUBLIC_KEY;
  const wompiPriv = process.env.WOMPI_PRIVATE_KEY;
  const mpToken = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;

  const wantMp = preferred === "mercadopago" || (preferred === "auto" && !wompiPub && !!mpToken);
  const wantWompi = preferred === "wompi" || (preferred === "auto" && !!wompiPub);

  if (wantMp && mpToken) {
    try {
      const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mpToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          external_reference: reference,
          items: [
            {
              title: `ATSAdvisor ${plan}`,
              quantity: 1,
              currency_id: "COP",
              unit_price: amount,
            },
          ],
          payer: email.includes("@") ? { email } : undefined,
          back_urls: {
            success: `${base}/precios?paid=1&provider=mp`,
            pending: `${base}/precios?paid=pending&provider=mp`,
            failure: `${base}/precios?paid=0&provider=mp`,
          },
          auto_return: "approved",
          notification_url: `${base}/api/webhooks/payments`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json(
          { error: data.message || "Mercado Pago rechazó la preferencia", detail: data },
          { status: 502 }
        );
      }
      await notifyOwnerTelegram(`Checkout MP: ${plan} ${amount} COP · ${email || "sin email"} · ${reference}`);
      return NextResponse.json({
        ok: true,
        mode: "mercadopago",
        reference,
        plan,
        amount,
        currency: "COP",
        initPoint: data.init_point || data.sandbox_init_point,
        preferenceId: data.id,
      });
    } catch {
      return NextResponse.json({ error: "No se pudo crear preferencia Mercado Pago" }, { status: 500 });
    }
  }

  if (wantWompi && wompiPub && wompiPriv) {
    await notifyOwnerTelegram(`Checkout Wompi: ${plan} ${amount} COP · ${email || "sin email"} · ${reference}`);
    return NextResponse.json({
      ok: true,
      mode: "wompi",
      publicKey: wompiPub,
      reference,
      amountInCents: amount * 100,
      currency: "COP",
      plan,
      redirectUrl: `${base}/precios?paid=1`,
    });
  }

  return NextResponse.json({
    ok: false,
    mode: "demo",
    message:
      "Sin Wompi ni Mercado Pago. Agrega WOMPI_* o MP_ACCESS_TOKEN en Vercel (MANUAL-ACCIONES.md).",
    amount,
    currency: settings.pricing.currency,
    plan,
    providersAvailable: {
      wompi: Boolean(wompiPub && wompiPriv),
      mercadopago: Boolean(mpToken),
    },
  });
}
