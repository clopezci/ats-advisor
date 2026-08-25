/**
 * Snapshot mensual de la matriz salarial.
 * El cron `/api/cron/salary-refresh` actualiza asOf + cpiFactorFromSeed.
 * Opcionalmente fusiona un feed externo (SALARY_FEED_URL).
 */

import type { MatrixMeta } from "./matrix";
import { SEED_META } from "./matrix";

export type SalarySnapshot = MatrixMeta & {
  /** Factor acumulado desde el seed (1.0 = sin ajuste). */
  notes?: string;
};

/** En runtime el API puede devolver un snapshot fresco; este es el fallback embebido. */
export const EMBEDDED_SNAPSHOT: SalarySnapshot = {
  ...SEED_META,
  notes: "Snapshot embebido. El cron mensual lo refresca en data/salary/matrix-snapshot.json cuando corre en el servidor.",
};
