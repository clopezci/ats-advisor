/** Normaliza avisos LATAM pegados (sin saltos, emojis, skills pegadas). */

const KNOWN_SKILLS =
  /\b(devops|finops|aiops|mlops|itil(?:\s*4)?|sre|aws|azure|gcp|okrs?|kpis?|slas?|xlas?|drp|cobit|togaf|scrum|kanban|jira|sap|rpa|observabilidad|on[-\s]?premise|cloud)\b/gi;

/** Inserta espacios/saltos donde portales pegan skills y secciones. */
export function normalizeJobText(raw: string): string {
  let t = String(raw || "").replace(/\r/g, "\n");

  // Emojis de sección → salto de línea
  t = t.replace(/([🔑⭐💼💰🎯🏥📄🏢📩🚀])/g, "\n$1");

  // Pegados típicos: 24/7ITIL, Cloud)DevOps, DevOpsFinOps, GCPObservabilidad
  t = t.replace(/(\d+\/\d+)(?=[A-Za-zÁÉÍÓÚáéíóú])/g, "$1\n");
  t = t.replace(/([a-záéíóúñ])(?=(?:DevOps|FinOps|AIOps|ITIL|AWS|Azure|GCP|SRE|Observabilidad|Certificaci))/gi, "$1\n");
  t = t.replace(/(DevOps)(FinOps)/gi, "$1\n$2");
  t = t.replace(/(FinOps)(AIOps)/gi, "$1\n$2");
  t = t.replace(/(AIOps)(\s*y\s+automatizaci)/gi, "$1\n$2");
  t = t.replace(/(GCP|Azure|AWS)(?=[A-ZÁÉÍÓÚa-záéíóú]{4,})/g, "$1\n");
  t = t.replace(/(compartidos)(Team)/gi, "$1\n$2");
  t = t.replace(/(ágil(?:es)?)(SRE)/gi, "$1\n$2");
  t = t.replace(/(Engineering)(Sector)/gi, "$1\n$2");
  t = t.replace(/(financiero)(Gestión)/gi, "$1\n$2");

  // Separar skills conocidas pegadas
  t = t.replace(KNOWN_SKILLS, (m) => `\n${m}\n`);

  // Headers frecuentes sin salto previo
  t = t.replace(
    /(¿?\s*Qué experiencia debes tener\s*\??|Será un plus|Sera un plus|Qué te ofrecemos|Que te ofrecemos|Requisitos|Beneficios|Ofrecemos)/gi,
    "\n$1\n"
  );

  // Cortar bloque de beneficios / CTA (no son requisitos)
  t = t.replace(
    /\n\s*(?:💼\s*)?(?:¿?\s*Que? te ofrecemos\??|Beneficios|Ofrecemos)[\s\S]*$/i,
    "\n"
  );
  t = t.replace(/\n\s*(?:📩|Postúlate|envíanos tu hoja)[\s\S]*$/i, "\n");

  return t
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\S\n]{2,}/g, " ")
    .trim();
}
