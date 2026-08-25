import { NextResponse } from "next/server";
import { readSalarySnapshot } from "@/lib/salary/refresh";
import {
  COMPANY_SIZES,
  INDUSTRIES,
  ROLE_FAMILIES,
  estimateSalary,
  matrixForRole,
  type CityTier,
  type CompanySize,
  type IndustryId,
} from "@/lib/salary/matrix";

/**
 * GET /api/salary/matrix
 * Query: roleId, city, targetIndustry, targetSize, prevSalary?, prevIndustry?, prevSize?
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const roleId = url.searchParams.get("roleId") || ROLE_FAMILIES[0].id;
  const city = (url.searchParams.get("city") || "bogota_medellin") as CityTier;
  const targetIndustry = (url.searchParams.get("targetIndustry") || "servicios") as IndustryId;
  const targetSize = (url.searchParams.get("targetSize") || "mediana") as CompanySize;
  const prevSalaryRaw = url.searchParams.get("prevSalary");
  const prevSalary = prevSalaryRaw ? Number(prevSalaryRaw) : undefined;
  const prevIndustry = (url.searchParams.get("prevIndustry") || undefined) as IndustryId | undefined;
  const prevSize = (url.searchParams.get("prevSize") || undefined) as CompanySize | undefined;

  const snapshot = await readSalarySnapshot();
  const estimate = estimateSalary({
    roleId,
    city,
    targetIndustry,
    targetSize,
    prevSalary: prevSalary && !Number.isNaN(prevSalary) ? prevSalary : undefined,
    prevIndustry,
    prevSize,
    cpiFactor: snapshot.cpiFactorFromSeed,
  });

  return NextResponse.json({
    snapshot: {
      asOf: snapshot.asOf,
      cpiFactorFromSeed: snapshot.cpiFactorFromSeed,
      version: snapshot.version,
      method: snapshot.method,
      sources: snapshot.sources,
      notes: snapshot.notes,
      disclaimer:
        "Rangos orientativos elaborados por ATSAdvisor con información de mercado de fuentes públicas diversas y calibración interna. No son oficiales ni exactos; cada empresa fija sus condiciones. No constituyen asesoría laboral, legal ni tributaria. Ver /legal/terminos.",
    },
    catalogs: {
      roles: ROLE_FAMILIES.map((r) => ({ id: r.id, label: r.label, note: r.note })),
      industries: INDUSTRIES,
      sizes: COMPANY_SIZES,
    },
    estimate,
    /** Matriz completa del cargo (industria × tamaño) ya viene en estimate.matrix */
    matrixCount: estimate.matrix.length,
    /** Atajo: solo filas del cargo sin anclas */
    matrixPreview: matrixForRole(roleId, city, snapshot.cpiFactorFromSeed).slice(0, 5),
  });
}
