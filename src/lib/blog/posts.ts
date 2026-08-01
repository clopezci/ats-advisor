export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "que-es-un-ats",
    title: "Qué es un ATS y por qué rechaza CVs buenos",
    excerpt: "Los filtros automáticos no leen como un humano. Aprende qué miran.",
    body: [
      "Un ATS (Applicant Tracking System) ordena, parsea y puntúa candidaturas antes de que un reclutador las vea.",
      "Fallan con columnas, tablas, iconos y texto en imágenes. Prefieren una columna, secciones claras y PDF limpio.",
      "ATSAdvisor te muestra el match contra una oferta concreta para iterar sin adivinar.",
    ],
  },
  {
    slug: "cv-una-columna",
    title: "CV de una columna: el formato que más sobrevive",
    excerpt: "Diseño bonito ≠ diseño parseable. Guía rápida LATAM.",
    body: [
      "Usa tipografía estándar, márgenes normales y viñetas simples.",
      "Evita barras de skills con porcentajes inventados; escribe evidencia.",
      "Prueba tu CV en ATSAdvisor contra 2–3 ofertas reales de tu rol target.",
    ],
  },
  {
    slug: "keywords-sin-mentir",
    title: "Keywords sin mentir: cómo integrar requisitos",
    excerpt: "Keyword stuffing se detecta. Integración natural gana.",
    body: [
      "Copia requisitos reales de la oferta solo si tienes evidencia.",
      "Traduce sinónimos (ej. Excel avanzado ↔ tablas dinámicas, Power Query).",
      "Si te falta una skill excluyente, dilo y muestra plan de cierre en 30 días.",
    ],
  },
  {
    slug: "star-entrevistas",
    title: "Método STAR para entrevistas en español",
    excerpt: "Situación, Tarea, Acción, Resultado: historias de 90 segundos.",
    body: [
      "Prepara 5 historias: liderazgo, conflicto, fracaso, logro cuantificado, aprendizaje.",
      "Grábate y recorta muletillas. El reclutador escucha estructura, no novela.",
      "Usa el simulador y el score predictivo de filtro en ATSAdvisor.",
    ],
  },
  {
    slug: "negociacion-salarial-latam",
    title: "Negociación salarial en LATAM sin quemar la oferta",
    excerpt: "Piso, meta y techo con datos — no con ego.",
    body: [
      "Investiga bandas en tu país y ciudad (o remoto). Define mínimo aceptable.",
      "Negocia paquete total: salario, bonos, beneficios, aprendizaje, flexibilidad.",
      "Contraoferta educada: agradece, aporta evidencia, propone número.",
    ],
  },
  {
    slug: "mercado-oculto",
    title: "Mercado oculto: por qué el 70% no está en portales",
    excerpt: "Referidos y networking sistemático superan el spray de CVs.",
    body: [
      "Mapea 20 contactos: excompañeros, líderes, reclutadores del sector.",
      "Mensaje corto: contexto + valor + pedido de 15 minutos.",
      "Lleva un CRM simple (sheet) con seguimiento a 4–5 días.",
    ],
  },
  {
    slug: "linkedin-ats",
    title: "LinkedIn que también habla el idioma ATS",
    excerpt: "Headline, About y experiencia alineados a ofertas reales.",
    body: [
      "Headline: cargo | valor | nicho.",
      "About con 3 logros STAR y keywords honestas.",
      "Featured: CV o proyecto. Luego valida con el optimizador LinkedIn de la app.",
    ],
  },
  {
    slug: "outplacement-barato",
    title: "Outplacement democratizado: qué esperar de un plan digital",
    excerpt: "No es coaching corporativo de $millones: es ruta + microcápsulas + voz.",
    body: [
      "OUT-01 a OUT-08 cubren estabilización, mercado, marca, networking y oferta.",
      "OUT-09 genera un curso a tu medida cuando el gap es específico.",
      "Telegram/WhatsApp llevan la cápsula diaria si activas el canal.",
    ],
  },
  {
    slug: "errores-postulacion",
    title: "7 errores que hunden una postulación buena",
    excerpt: "Desde CV genérico hasta no trackear el funnel.",
    body: [
      "CV único para todas las ofertas.",
      "Mentir o stuffing de keywords.",
      "No preparar filtro telefónico.",
      "No cuantificar logros.",
      "Ignorar referidos.",
      "No registrar estados (usa el tracker).",
      "Abandonar tras 10 rechazos sin iterar el score ATS.",
    ],
  },
  {
    slug: "primeros-90-dias",
    title: "Primeros 90 días: no pierdas el puesto recién ganado",
    excerpt: "Plan 30-60-90, aliados y quick wins.",
    body: [
      "Días 1–30: aprender sistemas y expectativas.",
      "31–60: aportar quick wins visibles.",
      "61–90: proponer mejoras con datos. Usa el modo 90 días de la app.",
    ],
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
