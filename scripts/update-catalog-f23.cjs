const fs = require("fs");
const p = "src/lib/catalog/capabilities.ts";
let s = fs.readFileSync(p, "utf8");
const flips = {
  "out-player": "disponible",
  "out-01-08": "disponible",
  sentry: "requiere_config",
  "tester-role": "disponible",
  mercadopago: "requiere_config",
  wompi: "requiere_config",
  "b2b-licenses": "parcial",
  "domain-lotic": "requiere_config",
};
for (const [id, status] of Object.entries(flips)) {
  const re = new RegExp(`(id: "${id}"[\\s\\S]*?status: ")[a-z_]+(")`);
  s = s.replace(re, `$1${status}$2`);
}
fs.writeFileSync(p, s);
console.log("catalog f23 statuses ok");
