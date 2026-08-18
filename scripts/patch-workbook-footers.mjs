import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "src/app/outplacement/cuadernillo");

const importLine =
  'import { WorkbookModuleFooter } from "@/components/workbook/WorkbookModuleFooter";\n';

function walk(d) {
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (
      ent.name === "page.tsx" &&
      !p.endsWith(`${path.sep}cuadernillo${path.sep}page.tsx`)
    ) {
      patch(p);
    }
  }
}

function patch(file) {
  let c = fs.readFileSync(file, "utf8");
  if (c.includes("WorkbookModuleFooter")) return;
  if (!c.includes("Volver al cuadernillo")) return;

  if (!c.includes(importLine.trim())) {
    const fromMatch = c.match(/^import .+;\r?\n/m);
    const firstImport = c.indexOf("import ");
    if (firstImport === -1) return;
    const afterFirst = c.indexOf("\n", firstImport) + 1;
    const insertAt = fromMatch ? afterFirst : firstImport;
    c = c.slice(0, insertAt) + importLine + c.slice(insertAt);
  }

  const volverIdx = c.indexOf("Volver al cuadernillo");
  if (volverIdx === -1) return;

  const linkStart = c.lastIndexOf("<Link", volverIdx);
  if (linkStart === -1) return;

  const beforeLinks = c.slice(0, linkStart).replace(/\s+$/, "");
  const closingDiv = c.lastIndexOf("    </div>", c.length - 1);
  if (closingDiv === -1 || closingDiv <= linkStart) return;

  c =
    beforeLinks +
    "\n\n      <WorkbookModuleFooter />\n" +
    c.slice(closingDiv);

  fs.writeFileSync(file, c);
  console.log("patched", path.relative(root, file));
}

walk(dir);
