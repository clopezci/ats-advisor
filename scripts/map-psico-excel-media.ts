import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { join } from "path";

const root = join(process.cwd(), "tmp-psico-excel/xl");
const wb = readFileSync(join(root, "workbook.xml"), "utf8");
const sheets = [...wb.matchAll(/<sheet[^>]*name="([^"]+)"[^>]*r:id="(rId\d+)"/g)].map((m) => ({
  name: m[1],
  rid: m[2],
}));
const rels = readFileSync(join(root, "_rels/workbook.xml.rels"), "utf8");
const ridToTarget: Record<string, string> = {};
for (const m of rels.matchAll(/Id="(rId\d+)"[^>]*Target="([^"]+)"/g)) ridToTarget[m[1]] = m[2];
for (const m of rels.matchAll(/Target="([^"]+)"[^>]*Id="(rId\d+)"/g)) ridToTarget[m[2]] = m[1];

type SheetInfo = { name: string; sheetFile: string; drawing?: string; images: string[] };
const info: SheetInfo[] = [];

for (const s of sheets) {
  const target = ridToTarget[s.rid] || "";
  const sheetFile = target.replace(/^\//, "").replace(/^worksheets\//, "");
  const sheetPath = join(root, "worksheets", sheetFile);
  const sheetRelsPath = join(root, "worksheets/_rels", sheetFile + ".rels");
  let drawing: string | undefined;
  const images: string[] = [];
  if (existsSync(sheetRelsPath)) {
    const sr = readFileSync(sheetRelsPath, "utf8");
    const dm = sr.match(/Target="[^"]*drawings\/([^"]+)"/);
    if (dm) {
      drawing = dm[1];
      const drels = join(root, "drawings/_rels", drawing + ".rels");
      if (existsSync(drels)) {
        const dr = readFileSync(drels, "utf8");
        for (const im of dr.matchAll(/Target="[^"]*media\/([^"]+)"/g)) images.push(im[1]);
      }
    }
  }
  // also try reading drawing xml for order via twoCellAnchor order
  info.push({ name: s.name, sheetFile, drawing, images });
}

console.log(JSON.stringify(info.map((i) => ({ name: i.name, sheetFile: i.sheetFile, drawing: i.drawing, n: i.images.length })), null, 2));

const exportDir = join(process.cwd(), "tmp-psico-by-sheet");
if (!existsSync(exportDir)) mkdirSync(exportDir, { recursive: true });
for (const i of info) {
  const safe = i.name.replace(/[^\w\-]+/g, "_");
  const dir = join(exportDir, safe);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  i.images.forEach((img, idx) => {
    const src = join(root, "media", img);
    if (existsSync(src)) copyFileSync(src, join(dir, `${String(idx + 1).padStart(3, "0")}_${img}`));
  });
  writeFileSync(join(dir, "_list.json"), JSON.stringify(i.images, null, 2));
}
writeFileSync(join(exportDir, "_map.json"), JSON.stringify(info, null, 2));
console.log("exported to", exportDir);
