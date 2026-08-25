/** Compat shim: old SalaryBand shape + re-exports from matrix. */

export type { CityTier } from "./matrix";
export {
  CITY_MULT,
  NEGOTIATION_CHECKLIST,
  BANDS_DISCLAIMER,
  SALARY_BANDS,
  estimateBand,
} from "./matrix";

export type SalaryBand = {
  id: string;
  label: string;
  min: number;
  max: number;
  note: string;
};
