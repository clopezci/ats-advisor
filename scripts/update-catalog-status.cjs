const fs = require("fs");
const p = "src/lib/catalog/capabilities.ts";
let s = fs.readFileSync(p, "utf8");
const flips = {
  "ats-synonyms": "disponible",
  "ats-rewrite": "disponible",
  "out-01-08": "disponible",
  "out-09": "disponible",
  "out-player": "disponible",
  "interview-sim": "disponible",
  "mode-90": "disponible",
  "cultural-fit": "disponible",
  "rag-kb": "disponible",
  blog: "disponible",
  salary: "disponible",
  pricing: "disponible",
  habeas: "disponible",
  "admin-console": "disponible",
  "admin-analytics": "disponible",
  legal: "disponible",
  "tester-role": "disponible",
  "b2b-licenses": "parcial",
  "analytics-pro": "disponible",
  "embeddings-ats": "parcial",
};
for (const [id, status] of Object.entries(flips)) {
  const re = new RegExp(`(id: "${id}"[\\s\\S]*?status: ")[a-z_]+(")`);
  s = s.replace(re, `$1${status}$2`);
}
fs.writeFileSync(p, s);
console.log("catalog statuses updated");
