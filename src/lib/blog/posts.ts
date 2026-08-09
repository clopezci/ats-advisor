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
  {
    slug: "pdf-ats-colombia",
    title: "PDF que sobrevive a Workday, Taleo y portales locales",
    excerpt: "Exportar bien importa más que el diseño en Canva.",
    body: [
      "En Colombia y LATAM conviven Workday, Taleo, SAP SuccessFactors, Greenhouse y ATS de portales (Computrabajo, LinkedIn Easy Apply, Elempleo). Cada uno parsea distinto, pero todos fallan con tablas anidadas, texto en imágenes y dos columnas.",
      "Exporta desde Word o Google Docs a PDF «estándar» (no «solo imagen»). Evita encabezados/pies con datos críticos: el parseo a veces los ignora.",
      "Valida el mismo PDF en ATSAdvisor contra 2 ofertas reales del rol target. Si el score cae por «formato», arregla estructura antes de keywords.",
      "Guarda versiones: CV_general.pdf y CV_empresaX.pdf. El tracker de la app te ayuda a no mezclar envíos.",
    ],
  },
  {
    slug: "filtro-telefonico",
    title: "Filtro telefónico: 8 minutos que deciden si avanzas",
    excerpt: "Estructura, tono y trampas típicas en LATAM.",
    body: [
      "El filtro no busca genios: busca claridad, disponibilidad y coherencia con el CV. Habla en bloques: quién eres (20 s), logro relevante (40 s), por qué esta vacante (40 s), pregunta al cierre.",
      "Ten a mano: pretensión salarial en rango, fecha de disponibilidad, aviso previo y un ejemplo STAR corto.",
      "Evita monólogos. Si te preguntan «cuéntame de ti», no leas el CV: elige un hilo (rol → problema → resultado).",
      "Practica en el simulador de filtro de ATSAdvisor y grábate. Las muletillas se oyen más que en tu cabeza.",
    ],
  },
  {
    slug: "gaps-cv",
    title: "Huecos en el CV: cómo explicarlos sin sabotearte",
    excerpt: "Silencio, honestidad y evidencia de aprendizaje.",
    body: [
      "Un gap no es automático rechazo. Lo que hunde es la evasión. Nombra el periodo, el motivo breve (estudio, cuidado, proyecto, búsqueda) y qué hiciste para mantenerte vigente.",
      "Si estudiaste o hiciste freelance, conviértelo en bullets con resultado. Si solo buscaste empleo, muestra volumen de networking y cursos con aplicación práctica.",
      "No inventes cargos. Los verificadores y referencias lo detectan. Mejor un mes «en transición» bien narrado que un invento.",
      "En entrevista, cierra con puente al rol actual: «por eso busco X, donde puedo aportar Y».",
    ],
  },
  {
    slug: "remoto-latam",
    title: "Empleo remoto desde LATAM: señales de oferta seria",
    excerpt: "Zonas horarias, contratos y red flags de fraude.",
    body: [
      "Ofertas serias clarifican zona horaria, moneda de pago, tipo de contrato (laboral local, contractor, EOR) y herramientas. Si solo hablan de «comisiones en cripto» o piden pago por adelantado para «capacitación», sal.",
      "Adapta el CV: experiencia colaborando async, overlap de horas, herramientas (Slack, Notion, Jira). Evita pretender «nativo US» si no lo eres.",
      "Negocia: internet, equipo, benefits y retención de impuestos. Pregunta quién firma el contrato.",
      "Usa multi-oferta en ATSAdvisor para priorizar vacantes donde tu match de keywords y seniority sea realista.",
    ],
  },
  {
    slug: "segunda-carrera",
    title: "Segunda carrera a los 40+: reinventarse sin empezar de cero",
    excerpt: "Transferible > título nuevo.",
    body: [
      "No tires 15 años de experiencia: tradúcelos. Liderazgo de equipos, presupuesto, stakeholders y crisis son skills transferibles a producto, ops, customer success o analítica.",
      "Elige un puente: un proyecto visible (portfolio, caso, certificación aplicada) que demuestre el nuevo dominio en 60–90 días.",
      "Actualiza LinkedIn y CV con el lenguaje del mercado destino, no del cargo anterior. Valida con ofertas reales.",
      "ATSAdvisor incluye ruta de segunda carrera en outplacement para estructurar el cambio sin improvisar.",
    ],
  },
  {
    slug: "cartas-presentacion",
    title: "Carta de presentación que no parece plantilla de 2012",
    excerpt: "Tres párrafos y una prueba de lectura de la oferta.",
    body: [
      "Párrafo 1: rol + por qué esta empresa (hecho concreto de la oferta o del producto). Párrafo 2: un logro medible alineado al requisito #1. Párrafo 3: disponibilidad y CTA.",
      "Nunca digas «soy apasionado y proactivo» sin evidencia. El reclutador ya leyó mil veces eso.",
      "Si el portal no pide carta, no la fuerces: usa el mensaje de LinkedIn o el campo «nota» con la misma estructura corta.",
      "Genera borradores en Herramientas → Carta y luego humaniza: quita adjetivos vacíos y añade un detalle solo tú podrías saber.",
    ],
  },
  {
    slug: "rechazo-despues",
    title: "Después del rechazo: qué responder y qué medir",
    excerpt: "Feedback, pipeline y salud mental operativa.",
    body: [
      "Responde agradeciendo y pide un dato accionable (skill o seniority). A veces no hay respuesta: igual cierra el ciclo en tu tracker.",
      "Clasifica rechazos: formato/ATS, experiencia, cultura, compensación, timing. Si 5 caídas son por formato, deja de postular y arregla el CV.",
      "Mantén un embudo semanal: X envíos, Y filtros, Z entrevistas. Sin métrica, la búsqueda se vuelve ruido emocional.",
      "En ATSAdvisor el tracker y el historial de scores te muestran si estás mejorando o solo «enviando más».",
    ],
  },
  {
    slug: "ia-cv-limites",
    title: "Usar IA en el CV sin que te detecten (ni te inventes logros)",
    excerpt: "Asistente sí; autoría falsa no.",
    body: [
      "La IA ayuda a reordenar, condensar y alinear keywords. No debe inventar métricas, cargos ni tecnologías que no usaste.",
      "Revisa «tells» típicos: tono genérico, verbos de moda en inglés mezclados, listas perfectas sin fricción. Humaniza con detalles locales y verbos concretos.",
      "Pasa el texto por el análisis de ATSAdvisor: si el score sube solo por stuffing, bajarás en entrevista.",
      "Regla: cada bullet generado debe poder defenderse en 60 segundos con una historia STAR real.",
    ],
  },
  {
    slug: "calculadora-match-cv",
    title: "Calculadora de match CV–oferta: cuándo usarla (y cuándo no)",
    excerpt: "Un % rápido ayuda a priorizar; el ATS completo decide el envío.",
    body: [
      "La calculadora gratis de ATSAdvisor mide solapamiento de palabras clave entre tu HV y la oferta. Sirve para descartar vacantes mal alineadas en segundos.",
      "No sustituye el análisis ATS: formato, must-haves, heatmap de secciones y trampas de parsing solo salen en el analizador completo.",
      "Flujo recomendado: match rápido → si ≥45%, ATS completo → ajustar CV → tracker.",
      "Úsala también en multi-oferta: rankea 3–5 roles y empieza por el de mejor encaje real.",
    ],
  },
  {
    slug: "plan-semanal-busqueda",
    title: "Plan semanal de búsqueda de empleo (sin quemarte)",
    excerpt: "Siete bloques cortos: ATS, networking, práctica y descanso.",
    body: [
      "Buscar empleo a tiempo completo agota. Mejor un ritmo: ~2–4 horas/día con foco distinto cada jornada.",
      "Lunes ATS + tracker; martes cápsula OUT; miércoles networking; jueves práctica de filtro/STAR; viernes postular; sábado upskilling; domingo bienestar.",
      "ATSAdvisor incluye el plan de la semana y el hub de progreso para no perder el hilo.",
      "Si consigues empleo, pausa la suscripción y abre el checklist de primeros 90 días.",
    ],
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
