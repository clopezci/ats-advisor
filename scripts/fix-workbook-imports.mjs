import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "src/app/outplacement/cuadernillo");

function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === "page.tsx") {
      let c = fs.readFileSync(p, "utf8");
      const fixed = c.replace(
        /import \{\r?\nimport \{ WorkbookModuleFooter \} from "@\/components\/workbook\/WorkbookModuleFooter";\r?\n/g,
        'import { WorkbookModuleFooter } from "@/components/workbook/WorkbookModuleFooter";\nimport {\n'
      );
      if (fixed !== c) {
        fs.writeFileSync(p, fixed);
        console.log("fixed", path.relative(root, p));
      }
    }
  }
}

walk(dir);
