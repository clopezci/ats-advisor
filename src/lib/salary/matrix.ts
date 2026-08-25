/**
 * Matriz salarial Colombia: cargo × industria × tamaño de empresa.
 *
 * Honestidad de fuentes:
 * - No hay API pública gratuita y confiable con bandas por cargo/industria/tamaño en CO
 *   (Glassdoor/Levels/Mercer son pagos o sesgados).
 * - Baseline: autoría ATSAdvisor calibrada a rangos de mercado públicos 2025–2026.
 * - Actualización mensual: cron aplica factor CPI/ajuste (`salaryRefresh`) y escribe snapshot.
 * - Si existe SALARY_FEED_URL (JSON propio o proveedor), el cron la fusiona.
 *
 * Uso: siempre mostrar rangos del segmento comparable (misma industria + tamaño)
 * y la matriz completa del cargo para no comparar “grande tech” vs “pequeña retail”.
 */

export type CompanySize = "startup" | "pequena" | "mediana" | "grande" | "multilatina";

export type IndustryId =
  | "tech_producto"
  | "finanzas"
  | "consultoria"
  | "retail_consumo"
  | "industrial"
  | "salud"
  | "energia"
  | "servicios"
  | "gobierno_edu";

export type CityTier = "bogota_medellin" | "otras_capitales" | "intermedio" | "remoto_usd";

export type RoleFamily = {
  id: string;
  label: string;
  /** Bandas base COP bruto mensual: mediana × servicios × Bogotá. */
  base: { p25: number; p50: number; p75: number };
  note: string;
};

export type SalaryCell = {
  p25: number;
  p50: number;
  p75: number;
};

export type MatrixMeta = {
  asOf: string;
  currency: "COP";
  method: string;
  sources: { name: string; detail: string }[];
  cpiFactorFromSeed: number;
  version: number;
};

export const COMPANY_SIZES: { id: CompanySize; label: string; hint: string }[] = [
  { id: "startup", label: "Startup / early", hint: "Suele pagar menos fijo + equity/variable" },
  { id: "pequena", label: "Pequeña (<50)", hint: "Presupuesto más justo; menos bandas formales" },
  { id: "mediana", label: "Mediana (50–250)", hint: "Referencia base de la matriz" },
  { id: "grande", label: "Grande (250+)", hint: "Bandas más altas y formales" },
  { id: "multilatina", label: "Multinacional / multilatina", hint: "Techos más altos en roles clave" },
];

export const INDUSTRIES: { id: IndustryId; label: string }[] = [
  { id: "tech_producto", label: "Tech / producto digital" },
  { id: "finanzas", label: "Banca / finanzas / seguros" },
  { id: "consultoria", label: "Consultoría / profesional" },
  { id: "retail_consumo", label: "Retail / consumo" },
  { id: "industrial", label: "Industrial / manufactura" },
  { id: "salud", label: "Salud / pharma" },
  { id: "energia", label: "Energía / utilities" },
  { id: "servicios", label: "Servicios / BPO / otros" },
  { id: "gobierno_edu", label: "Gobierno / educación" },
];

/** Multiplicador vs mediana. */
export const SIZE_MULT: Record<CompanySize, number> = {
  startup: 0.88,
  pequena: 0.82,
  mediana: 1,
  grande: 1.18,
  multilatina: 1.32,
};

/** Multiplicador vs servicios. */
export const INDUSTRY_MULT: Record<IndustryId, number> = {
  tech_producto: 1.22,
  finanzas: 1.18,
  consultoria: 1.12,
  energia: 1.1,
  salud: 1.05,
  industrial: 1.02,
  servicios: 1,
  retail_consumo: 0.95,
  gobierno_edu: 0.9,
};

export const CITY_MULT: Record<CityTier, { label: string; mult: number }> = {
  bogota_medellin: { label: "Bogotá / Medellín", mult: 1 },
  otras_capitales: { label: "Otras capitales", mult: 0.9 },
  intermedio: { label: "Ciudades intermedias", mult: 0.82 },
  remoto_usd: { label: "Remoto internacional (orientativo COP)", mult: 1.35 },
};

export const ROLE_FAMILIES: RoleFamily[] = [
  {
    id: "analista_junior",
    label: "Analista junior",
    base: { p25: 2_800_000, p50: 3_500_000, p75: 4_200_000 },
    note: "0–2 años",
  },
  {
    id: "analista_semi",
    label: "Analista semi-senior",
    base: { p25: 4_200_000, p50: 5_300_000, p75: 6_500_000 },
    note: "2–4 años",
  },
  {
    id: "especialista",
    label: "Especialista / senior IC",
    base: { p25: 6_500_000, p50: 8_000_000, p75: 9_500_000 },
    note: "Skills escasas",
  },
  {
    id: "coordinador",
    label: "Coordinador / lead",
    base: { p25: 5_500_000, p50: 7_000_000, p75: 8_500_000 },
    note: "Liderazgo de equipo",
  },
  {
    id: "gerente",
    label: "Gerente / manager",
    base: { p25: 9_000_000, p50: 12_000_000, p75: 16_000_000 },
    note: "Varía mucho por industria",
  },
  {
    id: "dir_ops",
    label: "Director / head",
    base: { p25: 14_000_000, p50: 20_000_000, p75: 28_000_000 },
    note: "Techos altos en multilatinas",
  },
  {
    id: "dev_mid",
    label: "Desarrollador mid",
    base: { p25: 5_500_000, p50: 7_200_000, p75: 9_000_000 },
    note: "Tech productivas",
  },
  {
    id: "dev_senior",
    label: "Desarrollador senior",
    base: { p25: 9_000_000, p50: 11_500_000, p75: 15_000_000 },
    note: "Remoto/híbrido sube techo",
  },
  {
    id: "data_mid",
    label: "Data / analytics mid",
    base: { p25: 5_000_000, p50: 6_700_000, p75: 8_500_000 },
    note: "BI / analytics",
  },
  {
    id: "data_senior",
    label: "Data senior / ML ops",
    base: { p25: 8_500_000, p50: 11_000_000, p75: 14_000_000 },
    note: "Escasez relativa",
  },
  {
    id: "finanzas_mid",
    label: "Finanzas / controlling mid",
    base: { p25: 5_000_000, p50: 6_500_000, p75: 8_000_000 },
    note: "Industria / servicios",
  },
  {
    id: "finanzas_senior",
    label: "Finanzas senior / FP&A",
    base: { p25: 8_000_000, p50: 10_500_000, p75: 13_000_000 },
    note: "Empresa mediana+",
  },
  {
    id: "ops_supply",
    label: "Ops / supply mid-senior",
    base: { p25: 5_500_000, p50: 7_500_000, p75: 10_000_000 },
    note: "Industrial / retail",
  },
  {
    id: "rh_bp",
    label: "HRBP / Talent",
    base: { p25: 5_000_000, p50: 7_000_000, p75: 9_000_000 },
    note: "Empresas medianas+",
  },
  {
    id: "comercial_b2b",
    label: "Comercial B2B mid-senior",
    base: { p25: 4_500_000, p50: 6_500_000, p75: 9_000_000 },
    note: "Variable suele ser alto %",
  },
];

/** Seed metadata before first cron run. */
export const SEED_META: MatrixMeta = {
  asOf: "2026-08-01",
  currency: "COP",
  method:
    "Baseline autoría ATSAdvisor: rangos COP por cargo × industria × tamaño, calibrados con información de mercado de fuentes públicas diversas (portales, tendencias de industria, referencias abiertas). No es encuesta Mercer/Hay ni scraping propietario. Ajuste mensual por factor CPI en cron cuando no hay SALARY_FEED_URL.",
  sources: [
    {
      name: "Calibración de mercado (fuentes públicas)",
      detail:
        "Síntesis interna de rangos observados en el mercado laboral colombiano de acceso público; no afiliado a Glassdoor, Levels, Mercer u otros proveedores",
    },
    {
      name: "Ajuste CPI mensual",
      detail: "Factor en snapshot vía /api/cron/salary-refresh (proxy de actualización, no microdato oficial DANE por cargo)",
    },
  ],
  cpiFactorFromSeed: 1,
  version: 1,
};

export function roundCop(n: number): number {
  return Math.round(n / 50_000) * 50_000;
}

export function cellFor(
  roleId: string,
  industry: IndustryId,
  size: CompanySize,
  city: CityTier = "bogota_medellin",
  cpiFactor = 1
): SalaryCell & { role: RoleFamily } {
  const role = ROLE_FAMILIES.find((r) => r.id === roleId) || ROLE_FAMILIES[0];
  const m = INDUSTRY_MULT[industry] * SIZE_MULT[size] * CITY_MULT[city].mult * cpiFactor;
  return {
    role,
    p25: roundCop(role.base.p25 * m),
    p50: roundCop(role.base.p50 * m),
    p75: roundCop(role.base.p75 * m),
  };
}

export function matrixForRole(
  roleId: string,
  city: CityTier,
  cpiFactor = 1
): { industry: IndustryId; industryLabel: string; size: CompanySize; sizeLabel: string; cell: SalaryCell }[] {
  const rows: {
    industry: IndustryId;
    industryLabel: string;
    size: CompanySize;
    sizeLabel: string;
    cell: SalaryCell;
  }[] = [];
  for (const ind of INDUSTRIES) {
    for (const sz of COMPANY_SIZES) {
      const cell = cellFor(roleId, ind.id, sz.id, city, cpiFactor);
      rows.push({
        industry: ind.id,
        industryLabel: ind.label,
        size: sz.id,
        sizeLabel: sz.label,
        cell: { p25: cell.p25, p50: cell.p50, p75: cell.p75 },
      });
    }
  }
  return rows;
}

export type SalaryEstimateInput = {
  roleId: string;
  city: CityTier;
  /** Segmento de la oferta / empresa objetivo. */
  targetIndustry: IndustryId;
  targetSize: CompanySize;
  /** Contexto del último empleo (ancla). */
  prevSalary?: number;
  prevIndustry?: IndustryId;
  prevSize?: CompanySize;
  cpiFactor?: number;
};

export type SalaryEstimate = {
  target: SalaryCell & { role: RoleFamily; industryLabel: string; sizeLabel: string; cityLabel: string };
  previousSegment: (SalaryCell & { industryLabel: string; sizeLabel: string }) | null;
  floor: number;
  metaTarget: number;
  stretch: number;
  prevSalary: number | null;
  warnings: string[];
  guidance: string[];
  matrix: ReturnType<typeof matrixForRole>;
  comparableDelta: {
    sameSegmentVsPrev: number | null;
    targetVsPrevMarketP50: number | null;
  };
};

/**
 * Estima bandas con ancla al salario anterior y comparación por segmento.
 * Nunca asume que “grande → pequeña” mantiene el mismo fijo.
 */
export function estimateSalary(input: SalaryEstimateInput): SalaryEstimate {
  const cpi = input.cpiFactor ?? 1;
  const targetRaw = cellFor(input.roleId, input.targetIndustry, input.targetSize, input.city, cpi);
  const industryLabel = INDUSTRIES.find((i) => i.id === input.targetIndustry)?.label || input.targetIndustry;
  const sizeLabel = COMPANY_SIZES.find((s) => s.id === input.targetSize)?.label || input.targetSize;
  const cityLabel = CITY_MULT[input.city].label;

  let previousSegment: SalaryEstimate["previousSegment"] = null;
  if (input.prevIndustry && input.prevSize) {
    const prev = cellFor(input.roleId, input.prevIndustry, input.prevSize, input.city, cpi);
    previousSegment = {
      p25: prev.p25,
      p50: prev.p50,
      p75: prev.p75,
      industryLabel: INDUSTRIES.find((i) => i.id === input.prevIndustry)?.label || input.prevIndustry,
      sizeLabel: COMPANY_SIZES.find((s) => s.id === input.prevSize)?.label || input.prevSize,
    };
  }

  const warnings: string[] = [];
  const guidance: string[] = [];
  const prev = input.prevSalary && input.prevSalary > 0 ? input.prevSalary : null;

  const sameSegment =
    input.prevIndustry === input.targetIndustry && input.prevSize === input.targetSize;

  if (prev && input.prevSize && input.targetSize && input.prevSize !== input.targetSize) {
    const prevM = SIZE_MULT[input.prevSize];
    const tgtM = SIZE_MULT[input.targetSize];
    if (tgtM < prevM) {
      warnings.push(
        `Pasas de empresa ${COMPANY_SIZES.find((s) => s.id === input.prevSize)?.label} a ${sizeLabel}: el mercado suele pagar menos fijo en el tamaño menor. No uses tu último sueldo (${fmtInline(prev)}) como expectativa automática.`
      );
    } else if (tgtM > prevM) {
      guidance.push(
        `El tamaño objetivo suele pagar más que tu tamaño anterior. Tu último fijo ayuda como piso personal, pero el techo lo marca el segmento ${industryLabel} · ${sizeLabel}.`
      );
    }
  }

  if (prev && input.prevIndustry && input.targetIndustry && input.prevIndustry !== input.targetIndustry) {
    warnings.push(
      `Cambias de industria (${previousSegment?.industryLabel || "anterior"} → ${industryLabel}). Compara siempre contra la misma industria; las bandas no son intercambiables.`
    );
  }

  // Anclas de negociación
  let floor = targetRaw.p25;
  let metaTarget = targetRaw.p50;
  let stretch = targetRaw.p75;

  if (prev) {
    if (sameSegment) {
      floor = Math.max(targetRaw.p25, roundCop(prev * 0.88));
      metaTarget = Math.max(targetRaw.p50, roundCop(prev * 0.98));
      stretch = Math.max(targetRaw.p75, roundCop(prev * 1.08));
      guidance.push(
        "Mismo segmento que tu último empleo: anclamos piso/meta a tu historial sin salirnos del mercado."
      );
    } else {
      // Segmento distinto: el mercado del TARGET manda; el previo es contexto, no promesa
      floor = targetRaw.p25;
      metaTarget = targetRaw.p50;
      stretch = targetRaw.p75;
      if (prev > targetRaw.p75) {
        warnings.push(
          `Tu último fijo (${fmtInline(prev)}) está por encima del p75 del segmento objetivo (${fmtInline(targetRaw.p75)}). En este tamaño/industria es poco realista esperar lo mismo en base; mira variable, remoto o un rol de mayor nivel.`
        );
      } else if (prev < targetRaw.p25) {
        guidance.push(
          `Tu último fijo estaba bajo el p25 de este segmento. Hay espacio para pedir hacia la meta de mercado (${fmtInline(metaTarget)}) con evidencia de impacto.`
        );
      } else {
        guidance.push(
          "Tu historial sirve de referencia personal; la oferta debe evaluarse contra el rango del segmento al que postulaste."
        );
      }
    }
  } else {
    guidance.push("Si agregas tu último salario + industria + tamaño, afinamos piso/meta y las alertas de comparación.");
  }

  const matrix = matrixForRole(input.roleId, input.city, cpi);

  return {
    target: { ...targetRaw, industryLabel, sizeLabel, cityLabel },
    previousSegment,
    floor,
    metaTarget,
    stretch,
    prevSalary: prev,
    warnings,
    guidance,
    matrix,
    comparableDelta: {
      sameSegmentVsPrev: prev && sameSegment ? prev - targetRaw.p50 : null,
      targetVsPrevMarketP50:
        previousSegment && prev ? targetRaw.p50 - previousSegment.p50 : previousSegment ? targetRaw.p50 - previousSegment.p50 : null,
    },
  };
}

function fmtInline(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Compat: bandas planas antiguas (oferta wizard / UI legacy). */
export function estimateBand(bandId: string, city: CityTier) {
  const cell = cellFor(bandId, "servicios", "mediana", city, 1);
  return {
    band: {
      id: cell.role.id,
      label: cell.role.label,
      min: cell.p25,
      max: cell.p75,
      note: cell.role.note,
    },
    min: cell.p25,
    max: cell.p75,
    floor: cell.p25,
    target: cell.p50,
    stretch: cell.p75,
    cityLabel: CITY_MULT[city].label,
  };
}

export const SALARY_BANDS = ROLE_FAMILIES.map((r) => ({
  id: r.id,
  label: r.label,
  min: r.base.p25,
  max: r.base.p75,
  note: r.note,
}));

export const BANDS_DISCLAIMER =
  "Orientativo y educativo. Rangos elaborados por ATSAdvisor a partir de información de mercado de diversas fuentes públicas y calibración interna (no encuesta oficial ni API de un proveedor salarial). Cada empresa fija sus propias bandas y condiciones; los montos pueden diferir. No constituye asesoría laboral, legal, tributaria ni promesa de contratación o compensación. Verifica siempre con ofertas reales, reclutadores y tu red.";

/** Texto corto siempre visible junto a resultados salariales. */
export const SALARY_DISCLAIMER_SHORT =
  "Rangos orientativos de mercado (fuentes públicas diversas + calibración ATSAdvisor). No son exactos ni oficiales: cada empresa maneja sus condiciones. Úsalos como guía, no como garantía.";

/** Bloque legal/política de uso (pantalla de salarios y oferta). */
export const SALARY_LEGAL_NOTICE =
  "Los rangos mostrados son información orientativa y de carácter educativo, elaborada por ATSAdvisor con base en observaciones de mercado laboral de acceso público y calibración interna. " +
  "No provienen de una encuesta salarial certificada, ni de una API oficial de salarios, ni de datos confidenciales de empleadores. " +
  "Cada organización define de forma independiente su estructura de compensación; por tanto, no podemos garantizar exactitud, actualidad ni aplicabilidad a un caso concreto. " +
  "Esta herramienta no constituye asesoría laboral, legal, tributaria ni financiera, ni implica oferta de empleo o compromiso de remuneración. " +
  "Te recomendamos contrastar siempre con vacantes reales, profesionales de reclutamiento y tu red de contactos antes de negociar.";

export const NEGOTIATION_CHECKLIST = [
  "Define piso / meta / techo antes de la llamada (no improvises).",
  "Compara siempre contra la misma industria y tamaño de empresa.",
  "Pregunta el rango de la empresa primero si es posible.",
  "Negocia compensación total: salario, bono, remoto, aprendizaje, equipos.",
  "Contraoferta con datos de mercado, no con ultimátums.",
  "Pide 24–48 h para responder una oferta formal.",
];
