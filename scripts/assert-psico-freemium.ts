/** Quick assert for freemium gate (run: npx tsx scripts/assert-psico-freemium.ts) */
import { canExplainTipoItem } from "../src/lib/psicotecnicas/practicaAccess";

const free = 4;
const cases: Array<[number, boolean, boolean]> = [
  [0, false, true],
  [3, false, true],
  [4, false, false],
  [5, false, false],
  [100, false, false],
  [4, true, true],
  [99, true, true],
];

let failed = 0;
for (const [idx, paid, want] of cases) {
  const got = canExplainTipoItem(idx, paid, free);
  if (got !== want) {
    console.error(`FAIL item=${idx} paid=${paid} got=${got} want=${want}`);
    failed++;
  }
}
if (failed) process.exit(1);
console.log("ok freemium", cases.length, "cases");
