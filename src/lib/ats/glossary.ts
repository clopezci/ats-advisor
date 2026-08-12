/** Explicaciones en lenguaje sencillo para títulos del análisis ATS. */

export const ATS_GLOSSARY: Record<string, string> = {
  heatmap:
    "Mapa de calor: compara las palabras importantes de la oferta con las de tu CV. Rojo = no están en tu CV; ámbar = aparecen poco; verde/morado = sí están. Te ayuda a ver qué palabras te faltan.",
  hard:
    "Habilidades técnicas: herramientas, programas, idiomas de trabajo o conocimientos concretos (Excel, SQL, SAP, inglés, etc.).",
  soft:
    "Habilidades blandas: cómo trabajas con otras personas (liderazgo, comunicación, trabajo en equipo). Los ATS también las buscan si salen en la oferta.",
  must:
    "Requisitos indispensables: lo que la oferta pide sí o sí. Si te faltan, el filtro automático suele bajarte mucho el puntaje.",
  nice:
    "Requisitos deseables: suman puntos, pero no son obligatorios. Conviene mencionarlos si de verdad los tienes.",
  keywords:
    "Palabras clave: términos de la oferta (cargos, herramientas, certificaciones) que el robot busca en tu CV. Deben coincidir con lo que realmente hiciste.",
  bullets:
    "Calidad de viñetas: cada logro debería tener verbo de acción + qué hiciste + un número o resultado, sin inventar.",
  placement:
    "Dónde poner cada palabra: en qué sección del CV (experiencia, skills, resumen) conviene escribir ese término para que el ATS lo lea.",
  sections:
    "Secciones del CV: Experiencia, Educación, Habilidades, Contacto, Resumen. Si falta alguna, el robot parsea peor.",
  exclusive:
    "Requisitos excluyentes: si la oferta exige algo que no tienes (ej. título profesional o disponibilidad), conviene declararlo con honestidad.",
  format:
    "Alertas de formato: columnas, tablas o imágenes que suelen romper el parseo del ATS.",
  traps:
    "Trampas / riesgos: señales que un reclutador o ATS puede ver mal (fechas raras, keyword stuffing, etc.).",
  training:
    "Formación sugerida: cursos o prácticas para cerrar un hueco real, no para mentir en el CV.",
  recruiter:
    "Después del ATS: consejos para cuando un humano lea tu CV (claridad, logros, orden).",
  apply:
    "Checklist de postulación: pasos prácticos antes y después de enviar tu CV.",
  next:
    "Qué hacer ahora: el orden recomendado para mejorar tu puntaje en esta vacante.",
  atsHow:
    "Cómo filtra este ATS: cada plataforma (Workday, Taleo, etc.) lee el CV un poco distinto.",
  scoreWhy:
    "Qué explica el puntaje: por qué subió o bajó el número, en palabras simples.",
  sectionHits:
    "Palabras por sección: en qué parte de tu CV aparecen las palabras de la oferta.",
};

export function glossaryForTitle(title: string): string | undefined {
  const t = title.toLowerCase();
  if (t.includes("heatmap") || t.includes("mapa de") || t.includes("palabras de la oferta vs"))
    return ATS_GLOSSARY.heatmap;
  if (t.includes("hard") || t.includes("técnic") || t.includes("tecnic")) return ATS_GLOSSARY.hard;
  if (t.includes("soft") || t.includes("bland")) return ATS_GLOSSARY.soft;
  if (t.includes("must") || t.includes("indispensable")) return ATS_GLOSSARY.must;
  if (t.includes("nice") || t.includes("deseable")) return ATS_GLOSSARY.nice;
  if (t.includes("keyword") || t.includes("palabras clave")) return ATS_GLOSSARY.keywords;
  if (t.includes("viñeta") || t.includes("vineta")) return ATS_GLOSSARY.bullets;
  if (t.includes("dónde poner") || t.includes("donde poner")) return ATS_GLOSSARY.placement;
  if (t.includes("cobertura de secciones") || t.includes("secciones que el robot"))
    return ATS_GLOSSARY.sections;
  if (t.includes("excluyente")) return ATS_GLOSSARY.exclusive;
  if (t.includes("formato")) return ATS_GLOSSARY.format;
  if (t.includes("trampa") || t.includes("riesgo")) return ATS_GLOSSARY.traps;
  if (t.includes("formación") || t.includes("formacion")) return ATS_GLOSSARY.training;
  if (t.includes("reclutador")) return ATS_GLOSSARY.recruiter;
  if (t.includes("checklist") || t.includes("postulación") || t.includes("postulacion"))
    return ATS_GLOSSARY.apply;
  if (t.includes("avanza ahora") || t.includes("prioridad")) return ATS_GLOSSARY.next;
  if (t.includes("cómo filtra") || t.includes("como filtra")) return ATS_GLOSSARY.atsHow;
  if (t.includes("explica el score") || t.includes("explica el puntaje")) return ATS_GLOSSARY.scoreWhy;
  if (t.includes("por sección") || t.includes("por seccion")) return ATS_GLOSSARY.sectionHits;
  return undefined;
}
