export type PageGuideCopy = {
  /** Ruta o prefijo. Gana la más larga. */
  path: string;
  what: string;
  how: string;
};

/** Explicación en lenguaje de persona: para qué es esta pantalla y cómo usarla. */
export const PAGE_GUIDES: PageGuideCopy[] = [
  {
    path: "/ats/portales",
    what: "Esto NO postula por ti ni abre Computrabajo. Es una lista de lo que debes llenar en el perfil de cada portal (además del PDF), para que el sistema del sitio no te baje del ranking.",
    how: "Elige tu país. Abre la tarjeta del sitio donde SÍ vas a postular. Completa tu perfil allá, marcando mentalmente cada punto. Si el portal te hace preguntas (disponibilidad, años de experiencia), entra a “Preparar respuestas”.",
  },
  {
    path: "/ats/screening",
    what: "Muchos portales (LinkedIn Easy Apply, Computrabajo, el ATS de la empresa) te hacen 3–8 preguntas antes de enviar. Aquí armas respuestas honestas con tu CV, para copiarlas al formulario.",
    how: "Carga o pega tu hoja de vida. Pega el aviso de la vacante. Si el portal ya te mostró preguntas, escríbelas abajo (una por línea). Toca Generar y copia las respuestas. No inventes experiencia.",
  },
  {
    path: "/ats/multi",
    what: "Si tienes varias ofertas, esto te dice en cuál tu CV encaja más, para no postular a ciegas. No envía postulaciones.",
    how: "El recuadro 1 es TU hoja de vida. El recuadro 2 son los AVISOS de empleo. Carga el CV, pega cada aviso, toca Agregar y luego Comparar.",
  },
  {
    path: "/ats/historial",
    what: "Aquí quedan los análisis de CV que ya hiciste, para ver si vas mejorando el puntaje.",
    how: "No tienes que llenar nada. Si está vacío, primero analiza un CV en “Mejorar mi CV”.",
  },
  {
    path: "/ats/pack",
    what: "Junta en un ZIP lo que ya generaste: CV, carta, texto de LinkedIn y respuestas de preguntas, para tenerlo listo al postular.",
    how: "Primero genera esas piezas en las otras pantallas. Luego vuelve aquí y descarga el paquete.",
  },
  {
    path: "/ats/benchmark",
    what: "Compara tu puntaje de CV con una referencia anónima (no comparte tu nombre ni el archivo).",
    how: "Si ya analizaste un CV, el número se rellena solo. Toca comparar. Es orientación, no un ranking real de un portal.",
  },
  {
    path: "/ats",
    what: "Compara tu hoja de vida con UNA oferta y te dice qué tan bien la leería el filtro automático (ATS), qué falta y cómo ajustar el texto.",
    how: "Paso 1: sube o pega el CV. Paso 2: pega el aviso. Paso 3: analiza. Luego sigue los botones Siguiente (no saltes a otras pantallas a mitad de camino).",
  },
  {
    path: "/guia",
    what: "Arma un recorrido personal. Gratis solo: ATS, encaje rápido y tracker. El valor está en Carrera: la ruta de 8 módulos más LinkedIn, carta, entrevistas y negociación.",
    how: "Marca lo que necesitas. Empiezas por lo gratis; al llegar a Carrera guardas correo, pagas y vuelves al mismo paso. La tarjeta “Ruta de 8 módulos” es el corazón del plan.",
  },
  {
    path: "/tracker",
    what: "Una libreta de postulaciones: cargo, empresa y en qué vas (interés, aplicado, entrevista, oferta).",
    how: "Llena cargo y empresa (puedes dictar). Guarda. Cuando avances, cambia el estado. No se envía a ningún portal; es solo para ti en este dispositivo.",
  },
  {
    path: "/precios",
    what: "Un solo plan: Carrera (ruta de 8 módulos + herramientas de postulación). El curso a tu medida se compra aparte. Gratis: ATS, encaje rápido y tracker.",
    how: "Si viniste desde Mi plan, paga Carrera y te devolvemos al mismo paso. Lee los 8 módulos para ver todo lo que incluye.",
  },
  {
    path: "/capacidades",
    what: "Mapa de acciones que puedes hacer y te benefician. No es un menú técnico de la app.",
    how: "Quédate en “Para ti”. Toca una tarjeta para abrirla, o “Armar mi recorrido” si quieres que te guíen.",
  },
  {
    path: "/herramientas/calculadora",
    what: "Un porcentaje rápido de coincidencia entre tu CV y una oferta, en un minuto. No reemplaza el análisis completo.",
    how: "Pega un pedazo de tu CV y un pedazo del aviso. Toca calcular. Si quieres el análisis a fondo, sigue al ATS.",
  },
  {
    path: "/herramientas/carta",
    what: "Borrador de carta o mensaje de postulación alineado a ESA oferta, con lo que ya está en tu CV.",
    how: "Carga o pega el CV y pega el aviso. Genera. Léelo, corrige y cópialo. No lo envíes sin revisarlo.",
  },
  {
    path: "/herramientas/linkedin",
    what: "Te sugiere un titular y un “Acerca de” más claros para que reclutadores y filtros te encuentren.",
    how: "Escribe el cargo al que apuntas (o dicta). Genera. Copia a LinkedIn y ajusta con tus palabras.",
  },
  {
    path: "/herramientas/checklist",
    what: "Lista corta de formato: lo que suele romper el robot que lee CVs (tablas, fotos, columnas).",
    how: "Ábrela junto a tu PDF y ve tachando. No analiza el contenido; solo el formato.",
  },
  {
    path: "/herramientas/plantilla",
    what: "Una estructura simple de CV que los filtros suelen leer bien (una columna, títulos claros).",
    how: "Llena nombre y un logro. Descarga o copia. Luego pégalo en Word y completa el resto con tu historia real.",
  },
  {
    path: "/herramientas/entrevistas",
    what: "Practica una respuesta con método STAR (situación, tarea, acción, resultado).",
    how: "Lee la pregunta, dicta o escribe tu respuesta, y pide feedback. Es un ensayo, no una entrevista real.",
  },
  {
    path: "/herramientas/salario",
    what: "Una banda orientativa en pesos para no pedir a ciegas. No es una encuesta salarial oficial.",
    how: "Indica cargo y ciudad si te lo pide. Usa el rango como ancla, no como promesa.",
  },
  {
    path: "/herramientas/cultura",
    what: "Lee el tono de una oferta (qué valoran: ritmo, autonomía, horario) para ver si te encaja más allá del sueldo.",
    how: "Pega el aviso completo. Lee el resultado. Es orientación, no un test psicológico.",
  },
  {
    path: "/herramientas",
    what: "Solo 3 gratis: ATS, encaje rápido y tracker. El resto (LinkedIn, carta, entrevistas, ruta de 8 módulos…) es el plan Carrera.",
    how: "Usa las tres gratis si quieres probar. Para el acompañamiento completo, ve a Precios o Mi plan.",
  },
  {
    path: "/outplacement/entrevista",
    what: "Simulador de entrevista: practicas en voz o texto y recibes pistas para mejorar.",
    how: "Elige o lee la pregunta. Responde. Pide feedback. Repite. No hay un entrevistador humano al otro lado, salvo que pidas un experto.",
  },
  {
    path: "/outplacement/filtro",
    what: "Ensayo de la primera llamada (3 preguntas típicas: disponibilidad, pretensión, por qué tú).",
    how: "Pega la oferta. Genera las 3 preguntas. Responde una a una. Mira el puntaje y mejora la respuesta.",
  },
  {
    path: "/outplacement/assessment",
    what: "Un test corto de intereses (RIASEC) para ver tipos de rol que suelen encajar en LATAM.",
    how: "Responde con sinceridad. Al final verás un código y ejemplos de cargos. No es un diagnóstico clínico.",
  },
  {
    path: "/outplacement/oferta",
    what: "Te ayuda a pensar piso, meta y techo de sueldo y un texto para contraofertar.",
    how: "Completa lo que sepas (cargo, ciudad, número que te dijeron). Sigue el asistente. Revisa el texto antes de enviarlo.",
  },
  {
    path: "/outplacement/bienestar",
    what: "Guía de ánimo y derechos laborales en Colombia, para la transición. No reemplaza a un abogado.",
    how: "Léela con calma. Si un tema es legal (liquidación, tutela), consulta a un profesional; aquí es orientación.",
  },
  {
    path: "/outplacement/networking",
    what: "Libreta de contactos: a quién escribir, qué pedirle (café, referido, LinkedIn).",
    how: "Anota nombre y el siguiente paso. No envía mensajes por ti.",
  },
  {
    path: "/outplacement/ruta",
    what: "Cápsulas cortas día a día de la transición (estabilizarte, mercado, entrevistas, 90 días).",
    how: "Entra al módulo de esta semana. Lee o escucha la cápsula. Haz la tarea corta. Vuelve mañana.",
  },
  {
    path: "/outplacement/out09",
    what: "Un mini-curso sobre el tema que TÚ elijas (la app arma lecciones cortas). Es un add-on: se compra aparte del plan Carrera.",
    how: "Escribe el tema (ej. “Excel para analistas”, “entrevistas en inglés”). Genera. Estudia cápsula por cápsula.",
  },
  {
    path: "/outplacement/experto",
    what: "Pedir que un aliado humano revise tu CV o una entrevista. El precio se ve antes de confirmar.",
    how: "Elige el servicio. Revisa el valor. Completa el pedido. No es el chat de IA; es una persona.",
  },
  {
    path: "/outplacement/90-dias",
    what: "Checklist para no fallar el periodo de prueba cuando ya conseguiste empleo.",
    how: "Ve marcando la lista (reuniones, expectativas, 30/60/90). No cobra extra si está en tu plan.",
  },
  {
    path: "/outplacement/progreso",
    what: "Resumen de lo que ya avanzaste (módulos, prácticas, cursos).",
    how: "Solo mira. Si quieres continuar, usa “Mi plan” o la ruta de la semana.",
  },
  {
    path: "/outplacement/plan-semana",
    what: "Tres o cuatro acciones concretas para esta semana, para no improvisar todos los días.",
    how: "Ábrelo el lunes. Haz una acción al día. Márcala cuando la completes.",
  },
  {
    path: "/outplacement/misiones",
    what: "Una tarea corta de hoy (actualizar LinkedIn, postular a 2 vacantes, practicar una pregunta).",
    how: "Haz la misión del día. El puntaje (XP) es para motivarte, no un ranking público.",
  },
  {
    path: "/outplacement/alertas",
    what: "Guardas palabras de cargos que te interesan para recordar buscarlas. No aplica por ti.",
    how: "Escribe cargos o ciudades. Revisa de vez en cuando. Luego postula tú en el portal.",
  },
  {
    path: "/outplacement/portfolio",
    what: "Arma un caso STAR (una historia con números) para entrevistas y para el CV.",
    how: "Elige un logro real. Completa situación, tarea, acción, resultado. Copia el texto a tu CV.",
  },
  {
    path: "/outplacement/vacantes",
    what: "Lista de vacantes de ejemplo o rankeadas contra tu CV, para practicar priorización.",
    how: "Revisa el orden. Para postular de verdad, abre el enlace del aviso en el portal (si lo hay).",
  },
  {
    path: "/outplacement/video-entrevista",
    what: "Ensayo de respuesta grabada (como las entrevistas asíncronas que piden algunas empresas).",
    how: "Lee la pregunta. Graba o escribe. Revisa el feedback. Borra el video si no quieres dejarlo en el teléfono.",
  },
  {
    path: "/outplacement/marketplace",
    what: "Servicios de coaches o revisión de CV con precio visible, hechos por aliados.",
    how: "Lee el paquete. Si te encaja, pídelo. Verás el valor antes de confirmar.",
  },
  {
    path: "/outplacement/cursos",
    what: "Cursos externos de bajo costo (sugeridos), no hechos por LOTIC.",
    how: "Si te interesa un tema, abre el enlace y decide tú. No es obligatorio para el plan.",
  },
  {
    path: "/outplacement/alumni",
    what: "Espacio de comunidad para quienes ya van avanzados en el plan.",
    how: "Entra, preséntate si quieres, y pide o ofrece un contacto. Respeta a las demás personas.",
  },
  {
    path: "/outplacement/career-brief",
    what: "Una página resumen de tu perfil profesional, para enviar a un contacto o tenerla a mano.",
    how: "Completa los campos (o dicta). Genera el texto. Descarga o copia. Revísalo antes de compartirlo.",
  },
  {
    path: "/outplacement/remoto",
    what: "Pistas para un CV en inglés y postulaciones remotas (formato, palabras, zona horaria).",
    how: "Pega viñetas en español. Pide la versión en inglés. Revísala: la IA puede fallar; no inventes logros.",
  },
  {
    path: "/outplacement/segunda-carrera",
    what: "Explorar un giro (emprendimiento u otro oficio) si no quieres repetir el mismo cargo.",
    how: "Cuenta tu situación (escribe o dicta). Sigue las preguntas. Es un mapa, no un plan de negocio cerrado.",
  },
  {
    path: "/outplacement/certificado",
    what: "Constancia de que avanzaste en el acompañamiento (para ti o para mostrar avance).",
    how: "Si ya completaste módulos, genera o descarga. No es un título profesional.",
  },
  {
    path: "/outplacement/coach",
    what: "Chat con la IA del plan: dudas de CV, entrevistas o la transición. No es un psicólogo ni un abogado.",
    how: "Escribe o dicta la pregunta. Lee la respuesta. Si el tema es delicado (salud, despido legal), busca un humano.",
  },
  {
    path: "/outplacement",
    what: "Acompañamiento de carrera (lo que empresas llaman outplacement): ruta, entrevistas, red, rumbo. No es un listado para explorar a ciegas.",
    how: "Toca “Armar mi recorrido”. Marca lo que necesitas. Si ya sabes el nombre de una herramienta, ábrela con “Ver todas”.",
  },
  {
    path: "/cuenta/cvs",
    what: "Guardar versiones de tu CV (la de “banco”, la de “datos”, etc.) en este dispositivo.",
    how: "Pega o carga un texto, ponle un nombre, guarda. Luego puedes reutilizarlo en el análisis.",
  },
  {
    path: "/cuenta",
    what: "Tu sesión, plan y reclamar un pago si pagaste con correo.",
    how: "Si pagaste, usa el mismo correo en “Reclamar”. Si no tienes cuenta, igual puedes usar el ATS gratis.",
  },
  {
    path: "/feedback",
    what: "Contarle al equipo qué falló o qué no se entiende, para mejorar la app.",
    how: "Escribe con tus palabras qué estabas haciendo y qué viste. Envía.",
  },
  {
    path: "/blog",
    what: "Artículos gratis sobre filtros ATS y búsqueda de empleo, para leer sin usar las herramientas.",
    how: "Abre un título. No hay que pegar CV aquí.",
  },
  {
    path: "/empresa",
    what: "Información para empresas de RH que quieran licencias o invitaciones para colaboradores.",
    how: "Lee la propuesta. Si te interesa, usa contacto. Si buscas empleo, vuelve al inicio.",
  },
];

const SKIP = ["/admin", "/legal", "/auth", "/offline"];

export function guideForPath(pathname: string): PageGuideCopy | null {
  if (!pathname || pathname === "/") return null;
  if (SKIP.some((s) => pathname === s || pathname.startsWith(`${s}/`))) return null;
  const sorted = [...PAGE_GUIDES].sort((a, b) => b.path.length - a.path.length);
  return sorted.find((g) => pathname === g.path || pathname.startsWith(`${g.path}/`)) || null;
}
