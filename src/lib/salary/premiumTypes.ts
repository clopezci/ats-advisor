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
};
