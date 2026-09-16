import { NextResponse } from "next/server";
import type { PremiumSalaryResult } from "@/lib/salary/premiumTypes";

/**
 * Consulta salarial premium (proveedor externo).
 * Configura JOBICY_API_KEY (Bearer). Sin clave: responde unavailable (no cobres crédito en cliente).
 *
 * Docs: https://jobicy.com/salary-api
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const role = (url.searchParams.get("role") || "").trim().slice(0, 80);
  const country = (url.searchParams.get("country") || "Colombia").trim().slice(0, 60);

  if (role.length < 3) {
    return NextResponse.json({ error: "Indica un cargo (role) de al menos 3 caracteres." }, { status: 400 });
  }

  const key = process.env.JOBICY_API_KEY || process.env.SALARY_API_KEY || "";
  if (!key) {
    const body: PremiumSalaryResult = {
      source: "unavailable",
      role,
      country,
      message:
        "Consulta premium no configurada en el servidor (falta JOBICY_API_KEY). Sigue usando la matriz gratuita. Cuando actives la clave, cada consulta gastará 1 crédito.",
    };
    return NextResponse.json(body);
  }

  try {
    const endpoint =
      process.env.JOBICY_SALARY_URL ||
      `https://jobicy.com/api/v2/salary?title=${encodeURIComponent(role)}&country=${encodeURIComponent(country)}`;

    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json(
        {
          source: "unavailable",
          role,
          country,
          message: `El proveedor no respondió (${res.status}). No descuentes crédito e inténtalo luego.`,
          rawNote: errText.slice(0, 200),
        } satisfies PremiumSalaryResult,
        { status: 502 }
      );
    }

    const data = (await res.json()) as Record<string, unknown>;
    const min = num(data.min ?? data.salary_min ?? nested(data, "salary_tiers", "middle", "min"));
    const max = num(data.max ?? data.salary_max ?? nested(data, "salary_tiers", "middle", "max"));
    const median = num(data.median ?? data.salary_median ?? nested(data, "salary_tiers", "middle", "median"));
    const currency = String(data.currency || "USD");
    const confidence = num(data.confidence);
    const updatedAt = String(data.updated_at || data.updatedAt || "");

    const body: PremiumSalaryResult = {
      source: "jobicy",
      role: String(data.job_title || data.position || role),
      country: String(data.country || country),
      currency,
      min: min ?? undefined,
      median: median ?? undefined,
      max: max ?? undefined,
      confidence: confidence ?? undefined,
      updatedAt: updatedAt || undefined,
      message:
        "Fuente externa (Jobicy). Orientativo: no es la banda interna de una empresa concreta. Compáralo con tu matriz local.",
    };

    if (body.min == null && body.median == null && body.max == null) {
      return NextResponse.json({
        source: "unavailable",
        role,
        country,
        message: "El proveedor no trajo rangos para ese cargo/país. Prueba otro nombre de rol. No descuentes crédito.",
        rawNote: JSON.stringify(data).slice(0, 300),
      } satisfies PremiumSalaryResult);
    }

    return NextResponse.json(body);
  } catch (e) {
    return NextResponse.json(
      {
        source: "unavailable",
        role,
        country,
        message: e instanceof Error ? e.message : "Error al consultar proveedor premium.",
      } satisfies PremiumSalaryResult,
      { status: 500 }
    );
  }
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() && !Number.isNaN(Number(v))) return Number(v);
  return null;
}

function nested(obj: Record<string, unknown>, ...keys: string[]): unknown {
  let cur: unknown = obj;
  for (const k of keys) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[k];
  }
  return cur;
}
