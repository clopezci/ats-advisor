export type PremiumSalaryResult = {
  source: "jobicy" | "unavailable";
  role: string;
  country: string;
  currency?: string;
  min?: number;
  median?: number;
  max?: number;
  confidence?: number;
  updatedAt?: string;
  message: string;
  rawNote?: string;
  /** true si salió de caché local (repeat Jobicy $0 / 30 días). */
  cached?: boolean;
  /** false = no cobró Jobicy ni wallet interno. */
  billable?: boolean;
};
