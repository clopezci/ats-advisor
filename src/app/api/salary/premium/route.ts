import { NextResponse } from "next/server";
import type { PremiumSalaryResult } from "@/lib/salary/premiumTypes";
import {
  JOBICY_DEFAULT_COUNTRY,
  isJobicyCountry,
} from "@/lib/salary/jobicyIntl";
import { recordJobicyLookup } from "@/lib/salary/jobicyWallet";

/**
 * Validación salarial internacional (Jobicy).
 * Solo países soportados por Jobicy (sin Colombia / LATAM).
 * Configura JOBICY_API_KEY (Bearer). Sin clave: unavailable (no cobres crédito).
 *
 * Docs: https://jobicy.com/salary-api
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const role = (url.searchParams.get("role") || "").trim().slice(0, 80);
  const countryRaw = (url.searchParams.get("country") || JOBICY_DEFAULT_COUNTRY).trim();

  if (role.length < 3) {
    return NextResponse.json({ error: "Indica un cargo (role) de al menos 3 caracteres." }, { status: 400 });
  }

  if (!isJobicyCountry(countryRaw)) {
    const body: PremiumSalaryResult = {
      source: "unavailable",
      role,
      country: countryRaw,
      message:
        "Jobicy no cubre ese país (Colombia y LATAM no están disponibles). Elige un país de la lista internacional. No descuentes crédito.",
    };
    return NextResponse.json(body, { status: 400 });
  }

  const country = countryRaw;
  const key = process.env.JOBICY_API_KEY || process.env.SALARY_API_KEY || "";
  if (!key) {
    const body: PremiumSalaryResult = {
      source: "unavailable",
      role,
      country,
      message:
        "Validación internacional no configurada en el servidor (falta JOBICY_API_KEY). Usa la matriz Colombia gratuita.",
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
          message: `El proveedor internacional no respondió (${res.status}). No descuentes crédito e inténtalo luego.`,
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
        "Validación internacional (Jobicy). Orientativo del mercado de ese país; no es banda Colombia ni oferta de una empresa concreta. Compáralo con tu matriz local.",
    };

    if (body.min == null && body.median == null && body.max == null) {
      return NextResponse.json({
        source: "unavailable",
        role,
        country,
        message:
          "Jobicy no trajo rangos para ese cargo/país. Prueba otro título en inglés o otro país de la lista. No descuentes crédito.",
        rawNote: JSON.stringify(data).slice(0, 300),
      } satisfies PremiumSalaryResult);
    }

    // Solo cobramos wallet interno en lookups con datos (billable estimado).
    try {
      await recordJobicyLookup({ role: body.role, country: body.country });
    } catch {
      /* no bloquees la respuesta al usuario */
    }

    return NextResponse.json(body);
  } catch (e) {
    return NextResponse.json(
      {
        source: "unavailable",
        role,
        country,
        message: e instanceof Error ? e.message : "Error al consultar validación internacional.",
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
