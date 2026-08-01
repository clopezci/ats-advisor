import JSZip from "jszip";
import { collectHabeasPayload, HABEAS_KEYS } from "@/lib/habeas/export";

export async function downloadHabeasZip(extra?: Record<string, unknown>) {
  const payload = collectHabeasPayload(extra);
  const zip = new JSZip();
  zip.file("atsadvisor-habeas-data.json", JSON.stringify(payload, null, 2));
  zip.file(
    "README.txt",
    "Exportación Habeas Data — ATSAdvisor (Ley 1581).\nIncluye JSON completo de datos locales del producto.\n"
  );
  for (const key of HABEAS_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) zip.file(`raw/${key}.txt`, raw);
    } catch {
      /* ignore */
    }
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `atsadvisor-habeas-${new Date().toISOString().slice(0, 10)}.zip`;
  a.click();
  URL.revokeObjectURL(url);
  return payload;
}
