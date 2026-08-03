/** Bandas salariales orientativas Colombia (COP mensuales brutos aprox.). */

export type SalaryBand = {
  id: string;
  label: string;
  min: number;
  max: number;
  note: string;
};

export const SALARY_BANDS: SalaryBand[] = [
  { id: "analista_junior", label: "Analista junior", min: 2_800_000, max: 4_200_000, note: "0–2 años" },
  { id: "analista_semi", label: "Analista semi-senior", min: 4_200_000, max: 6_500_000, note: "2–4 años" },
  { id: "especialista", label: "Especialista / senior IC", min: 6_500_000, max: 9_500_000, note: "Skills escasas" },
  { id: "coordinador", label: "Coordinador / lead", min: 5_500_000, max: 8_500_000, note: "Liderazgo de equipo" },
  { id: "gerente", label: "Gerente / manager", min: 9_000_000, max: 16_000_000, note: "Varía por industria" },
  { id: "dev_mid", label: "Desarrollador mid", min: 5_500_000, max: 9_000_000, note: "Tech productivas" },
  { id: "dev_senior", label: "Desarrollador senior", min: 9_000_000, max: 15_000_000, note: "Remoto/híbrido sube techo" },
  { id: "rh_bp", label: "HRBP / Talent", min: 5_000_000, max: 9_000_000, note: "Empresas medianas+" },
];

export type CityTier = "bogota_medellin" | "otras_capitales" | "intermedio" | "remoto_usd";

export const CITY_MULT: Record<CityTier, { label: string; mult: number }> = {
  bogota_medellin: { label: "Bogotá / Medellín", mult: 1 },
  otras_capitales: { label: "Otras capitales", mult: 0.9 },
  intermedio: { label: "Ciudades intermedias", mult: 0.82 },
  remoto_usd: { label: "Remoto internacional (orientativo COP)", mult: 1.35 },
};

export function estimateBand(bandId: string, city: CityTier) {
  const band = SALARY_BANDS.find((b) => b.id === bandId) || SALARY_BANDS[0];
  const m = CITY_MULT[city].mult;
  const min = Math.round(band.min * m);
  const max = Math.round(band.max * m);
  const floor = min;
  const target = Math.round((min + max) / 2);
  const stretch = max;
  return { band, min, max, floor, target, stretch, cityLabel: CITY_MULT[city].label };
}

export const NEGOTIATION_CHECKLIST = [
  "Define piso / meta / techo antes de la llamada (no improvises).",
  "Pregunta el rango de la empresa primero si es posible.",
  "Negocia compensación total: salario, bono, remoto, aprendizaje, equipos.",
  "Contraoferta con datos de mercado, no con ultimátums.",
  "Pide 24–48 h para responder una oferta formal.",
];
