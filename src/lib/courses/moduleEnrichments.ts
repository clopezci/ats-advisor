export type LessonEnrichment = {
  why: string;
  howTo: string[]; // 4-6 steps
  tips: string[]; // 3 tips
  example: string; // concrete LATAM example with name/city
  template: string; // fill-in template
};

export function enrichmentKey(code: string, day: number) {
  return `${code}-d${day}`;
}

export const MODULE_LESSON_ENRICHMENTS: Record<string, LessonEnrichment> = {
  "OUT-01-d1": {
    why: "Nombrar la transición baja la carga emocional y te da un punto de partida concreto para la búsqueda. Sin hechos claros, la narrativa se vuelve defensiva o confusa.",
    howTo: [
      "Abre un documento o nota y escribe tres encabezados: Qué terminó, Qué conservo, Qué quiero atraer.",
      "Bajo 'Qué terminó', lista solo hechos (cargo, fecha, tipo de salida) sin culpas ni dramatismo.",
      "Bajo 'Qué conservo', anota habilidades, relaciones y logros que siguen siendo tuyos.",
      "Bajo 'Qué quiero atraer', escribe 2–3 condiciones deseadas (rol, industria, modalidad).",
      "Relee y tacha juicios ('fracasé', 'me echaron por inútil'); reemplázalos por hechos u oportunidades.",
      "Guarda el texto: será la base de tu narrativa LinkedIn y de entrevistas.",
    ],
    tips: [
      "Limítate a 5 líneas por bloque; la claridad importa más que el detalle.",
      "Si te trabas, dicte 2 minutos por voz y luego resume en texto.",
      "No compartas esto aún: es material privado de estabilización.",
    ],
    example:
      "Camila, analista de operaciones en Bogotá, escribió: 'Terminó mi rol en retail el 15-mar. Conservo Excel avanzado, liderazgo de turnos y 3 contactos de gerencia. Quiero atraer un rol de coordinación logística híbrido en e-commerce.'",
    template:
      "Qué terminó: [cargo/empresa/fecha/tipo de salida]. Qué conservo: [skill 1], [skill 2], [relación/logro]. Qué quiero atraer: [rol], [industria/modalidad], [resultado deseado en 90 días].",
  },
  "OUT-01-d2": {
    why: "Una rutina corta y repetible evita el vacío del desempleo y protege energía. La intensidad esporádica quema; la constancia de 45 minutos gana.",
    howTo: [
      "Elige un bloque fijo de 45 minutos (ej. 8:00–8:45) y márcalo en el calendario como no negociable.",
      "Divide: 10 min cuerpo (caminar, estirar), 10 min mente (respiración o journaling), 25 min búsqueda (CV, ofertas, outreach).",
      "Prepara la noche anterior: ropa de caminar, lista de 3 tareas de búsqueda, agua.",
      "Al terminar, marca un ✓ en un tracker semanal; no alargues el bloque 'porque hoy sí puedo'.",
      "Si fallas un día, reinicia al siguiente sin castigo; el objetivo es racha, no perfección.",
    ],
    tips: [
      "Haz la rutina antes de abrir WhatsApp o redes.",
      "Si tienes hijos o turnos, usa el mismo formato en 2 bloques de 20–25 min.",
      "Mide cumplimiento semanal (días/7), no 'productividad sentida'.",
    ],
    example:
      "Andrés, en Medellín, fija 7:00–7:45: 10 min trote en el parque El Poblado, 10 min notas de gratitud, 25 min postulaciones en LinkedIn. Cumple 6/7 días y reporta menos ansiedad.",
    template:
      "Horario: [hora inicio–fin]. Cuerpo (10'): [actividad]. Mente (10'): [práctica]. Búsqueda (25'): [tarea 1], [tarea 2], [tarea 3]. Tracker semana: [L M X J V S D].",
  },
  "OUT-01-d3": {
    why: "Una frase de valor (X–Y–Z) te da un pitch usable en LinkedIn, referidos y entrevistas. Sin ella, sueles listar cargos en vez de impacto.",
    howTo: [
      "Completa: 'Ayudo a [X = quién] a lograr [Y = resultado] mediante [Z = método/habilidad]'.",
      "Elige un X concreto (equipos de ventas B2B, pymes retail, clínicas privadas).",
      "Define Y medible o observable (reducir churn, acelerar cierre, mejorar NPS).",
      "Define Z en verbos de acción (automatizando reportes, entrenando equipos, rediseñando procesos).",
      "Prueba la frase en voz alta 3 veces; si suena genérica, estrecha X o Y.",
      "Cópiala al About de LinkedIn (primeras 2 líneas) y a tu elevator pitch.",
    ],
    tips: [
      "Evita jerga vacía ('sinergias', 'apasionado'); prioriza resultado.",
      "Una sola frase maestra; variantes por industria después.",
      "Pídele a un colega: '¿entiendes qué hago en 10 segundos?'",
    ],
    example:
      "Laura, contadora en Cali: 'Ayudo a pymes de manufactura a cerrar mes en 5 días mediante conciliación automatizada y tableros Power BI.' La usa en mensajes a reclutadores de Contabilidad.",
    template:
      "Ayudo a [X: público/sector] a lograr [Y: resultado concreto] mediante [Z: método o skill]. Variante corta (15 palabras): [versión LinkedIn].",
  },
  "OUT-01-d4": {
    why: "El apoyo social acelera oportunidades y estabiliza el ánimo, pero solo si pides algo específico. Pedidos vagos generan silencio.",
    howTo: [
      "Lista 5 personas de confianza (exjefe, colega, mentor, amigo del sector, reclutador conocido).",
      "Por cada una, escribe qué puede darte: feedback de CV, intro a 1 persona, revisión de pitch, datos de salario.",
      "Redacta un mensaje de 4–5 líneas con contexto breve + pedido concreto + fecha tentativa.",
      "Envía máximo 2 mensajes hoy; agenda el resto en los próximos 3 días.",
      "Anota respuesta y próximo paso en una hoja simple.",
    ],
    tips: [
      "Nunca digas solo 'avísame si hay algo'; pide 15 minutos o una intro nominal.",
      "Ofrece reciprocidad (compartir vacantes, revisar su LinkedIn).",
      "Respeta el 'no' o el silencio; haz follow-up una sola vez a los 5 días.",
    ],
    example:
      "Diego, en Barranquilla, escribió a su exjefa: 'Estoy buscando coordinación de proyectos en logística. ¿Me podrías presentar a alguien de tu red en puertos o darme 15 min el jueves para revisar mi pitch?' Obtuvo 2 intros en una semana.",
    template:
      "Hola [nombre], [1 línea de contexto de transición]. Busco [rol/sector]. ¿Podrías [pedido concreto: 15 min / intro a X / feedback de CV] esta semana? Gracias, [tu nombre].",
  },
  "OUT-01-d5": {
    why: "Verbalizar tu narrativa en 60 segundos revela tono defensivo o confuso antes de la entrevista. El audio es un espejo barato y efectivo.",
    howTo: [
      "Escribe un guion de 4 frases: qué pasó (hecho), qué aprendiste, qué ofreces ahora, qué buscas.",
      "Grábate 60 segundos con el celular (voz; video opcional).",
      "Escucha una vez buscando: culpas, disculpas excesivas, jerga, ritmo atropellado.",
      "Reescribe 1–2 frases para tono seguro y claro; vuelve a grabar.",
      "Guarda la mejor versión y practícala 3 veces sin leer.",
    ],
    tips: [
      "Hechos + aprendizaje; nunca atacar a la empresa anterior.",
      "Termina mirando al futuro ('hoy busco…'), no en el cierre.",
      "Si te emocionas, pausa 3 segundos y retoma; no borres el take.",
    ],
    example:
      "Valentina, en Quito, grabó: 'Cerraron el área en enero. Lideré la transición de 12 personas y documenté procesos. Hoy ayudo a equipos de CX a bajar tiempos de respuesta. Busco un rol de team lead en SaaS.' Ajustó el tono de 'disculpa' a 'claro'.",
    template:
      "[Hecho de salida en 1 frase]. [Aprendizaje o aporte en la transición]. [Propuesta de valor X–Y–Z]. [Qué buscas ahora]. Duración objetivo: 60s.",
  },
  "OUT-01-d6": {
    why: "Sin límites, la búsqueda se diluye en doomscroll y agota sueño y alimentación. Proteger foco y cuerpo es parte del trabajo de outplacement.",
    howTo: [
      "Elige 2 horas diarias de 'búsqueda profunda' (celular en otra habitación o modo avión).",
      "Define 3 tareas máximas para ese bloque (ej. 2 outreach, 1 ajuste de CV, 1 oferta analizada).",
      "Fija hora de dormir y de desayuno; anótalas como compromisos de la semana.",
      "Bloquea notificaciones de redes laborales fuera del bloque (LinkedIn incluido).",
      "Al final del día, revisa: ¿cumplí sueño + foco? Ajusta mañana si fallaste.",
    ],
    tips: [
      "Usa un timer visible; cuando suene, cierra pestañas aunque 'falte un poquito'.",
      "Si vives con familia, avisa el horario de foco para reducir interrupciones.",
      "Prioriza descanso: un día cansado produce CVs peores que un día corto y fresco.",
    ],
    example:
      "Julián, en Lima, bloquea 9:00–11:00 sin Instagram. Duerme 23:00–6:30 y desayuna antes de abrir correo. En 10 días pasó de 1 postulación dispersa a 4 de calidad diarias.",
    template:
      "Bloque profundo: [hora–hora]. Tareas del bloque: 1) [ ], 2) [ ], 3) [ ]. Sueño: [hora]. Comida ancla: [desayuno/almuerzo]. Redes bloqueadas: [apps].",
  },
  "OUT-01-d7": {
    why: "Una frase de identidad profesional ancla la semana y evita volver a definirte solo por el despido. Es el entregable visible de estabilización.",
    howTo: [
      "Reúne tu frase X–Y–Z y el audio de 60s; extrae una línea de identidad de máximo 20 palabras.",
      "Formato sugerido: '[Rol/identidad] que [resultado] para [quién].'",
      "Pégala en un post-it del escritorio y en la primera línea del About de LinkedIn.",
      "Léela en voz alta cada mañana de la próxima semana antes de buscar.",
      "Si no te identifica al día 3, ajusta una palabra (rol o resultado), no toda la frase.",
    ],
    tips: [
      "Debe sonar como tú, no como un slogan publicitario.",
      "Evita 'ex-[empresa]'; habla de lo que haces hoy.",
      "Comparte la frase solo con 1 persona de confianza para validar claridad.",
    ],
    example:
      "Mariana, en Ciudad de México: 'Coordinadora de proyectos que entrega lanzamientos a tiempo en retail omnicanal.' La pegó en el monitor y la usó como headline temporal en LinkedIn.",
    template:
      "Frase de identidad (≤20 palabras): [rol/identidad] que [resultado concreto] para [público/sector]. Dónde la pego: [escritorio / LinkedIn / notebook].",
  },

  "OUT-02-d1": {
    why: "Sin logros con métrica, el CV y las entrevistas se quedan en adjetivos. Un inventario medible es la materia prima del FODA y de STAR.",
    howTo: [
      "Lista 8 logros de los últimos 5–7 años (proyectos, mejoras, crisis resueltas).",
      "Por cada uno, agrega número: %, $, tiempo, personas, tickets, NPS, o alcance ('equipo de 8').",
      "Si no hay cifra exacta, estima con rango honesto ('~20% menos tiempo de cierre').",
      "Escribe el logro en una línea: verbo + acción + métrica + contexto.",
      "Marca los 4 más relevantes para el rol que buscas.",
    ],
    tips: [
      "Pregunta a excolegas si no recuerdas números; ellos suelen recordar el impacto.",
      "Prefiere resultados de negocio a tareas ('reduje backlog' > 'hice reportes').",
      "Guarda fuentes (mail, dashboard) por si te piden evidencia en entrevista.",
    ],
    example:
      "Sergio, analista financiero en Bogotá: 'Reduje el tiempo de conciliaciones bancarias de 4 a 1.5 días para 3 cuentas de retail.' Ese logro abrió su pitch a roles de FP&A.",
    template:
      "Logro #: [verbo] [acción] en [contexto], resultando en [métrica/%/tiempo/personas]. Evidencia: [dashboard/mail/certificación].",
  },
  "OUT-02-d2": {
    why: "Clasificar hard vs soft y priorizar 5 vendibles evita el CV-inventario infinito. El mercado compra un puñado de skills alineadas al rol.",
    howTo: [
      "Parte dos columnas: Técnicas (herramientas, métodos) y Blandas (liderazgo, comunicación, negociación).",
      "Vacía 12–15 skills de tu experiencia real (no deseos).",
      "Frente a 2–3 ofertas target, marca cuáles aparecen en requisitos.",
      "Elige las 5 más vendibles: aparecen en ofertas + tienes evidencia.",
      "Anota junto a cada una un logro del inventario que la prueba.",
    ],
    tips: [
      "Soft skills solo cuentan con ejemplo observable ('medié conflicto entre ops y ventas').",
      "No priorices lo que te gusta si el mercado no lo pide para tu rol target.",
      "Actualiza la lista cuando cambies de rol primario.",
    ],
    example:
      "Paola, en Santiago de Chile, priorizó: SQL, Power BI, storytelling de datos, gestión de stakeholders y priorización. Descartó 'Photoshop' aunque le gustara, porque no aparecía en ofertas de analista de datos.",
    template:
      "Hard: [ ]. Soft: [ ]. Top 5 vendibles: 1)[ ]+evidencia, 2)[ ]+evidencia, 3)[ ]+evidencia, 4)[ ]+evidencia, 5)[ ]+evidencia.",
  },
  "OUT-02-d3": {
    why: "Un FODA exprés ordena fortalezas internas y realidades del mercado. Sin amenazas y gaps, el plan de búsqueda es ingenuo.",
    howTo: [
      "Dibuja 4 cuadrantes: Fortalezas, Oportunidades, Debilidades, Amenazas.",
      "Fortalezas: 3 ítems de tu top skills + logros.",
      "Oportunidades: sectores o modalidades en alza en tu país (remoto, nearshore, fintech, salud).",
      "Debilidades: gaps honestos (idioma, herramienta, certificación, red).",
      "Amenazas: competencia, recortes del sector, requisitos de título o inglés.",
      "Una línea por ítem; elige 1 acción por cuadrante para los próximos 30 días.",
    ],
    tips: [
      "Basá oportunidades y amenazas en ofertas reales, no en rumores.",
      "Debilidad ≠ defecto moral; es gap cerrable o a mitigar en narrativa.",
      "Revisa el FODA cada 2 semanas mientras buscas.",
    ],
    example:
      "Ricardo, en Guadalajara: F—automatización RPA; O—nearshore a US; D—inglés B1; A—muchos juniors con certificaciones. Acción: 25 min diarios de inglés técnico + 1 proyecto UiPath en portafolio.",
    template:
      "F: [ ]. O: [ ]. D: [ ]. A: [ ]. Acción 30 días por cuadrante: F→[ ], O→[ ], D→[ ], A→[ ].",
  },
  "OUT-02-d4": {
    why: "Traducir skills entre industrias habilita pivotes (finanzas→ops, retail→CX). Sin traducción, el reclutador solo ve 'sector equivocado'.",
    howTo: [
      "Elige un logro de tu sector actual y nombra la industria destino.",
      "Identifica la skill subyacente (control, precisión, reporting, negociación, SLA).",
      "Reescribe el logro con vocabulario del sector destino (ofertas reales).",
      "Haz lo mismo con 3 logros más.",
      "Arma una línea de puente: 'En [sector A] hice X; eso se traduce a [sector B] como Y.'",
    ],
    tips: [
      "Copia keywords de 5 ofertas del sector destino, no inventes jerga.",
      "No niegues tu pasado; tradúcelo.",
      "Úsalo en About y en la primera respuesta de entrevista ('cuéntame de ti').",
    ],
    example:
      "Elena, de banca en Buenos Aires a ops de startup: 'En riesgo crediticio controlaba excepciones diarias; en ops eso es ownership de SLA y reducción de errores de proceso.' Le sirvió para pasar filtro de un marketplace.",
    template:
      "Sector origen: [ ]. Destino: [ ]. Logro original: [ ]. Skill transferible: [ ]. Versión destino: [ ]. Frase puente: [ ].",
  },
  "OUT-02-d5": {
    why: "Una skill sin prueba es opinión. Reclutadores y ATS privilegián evidencia: proyecto, KPI, certificación, entregable.",
    howTo: [
      "Toma tus 5 skills top y crea una tabla: Skill | Evidencia | Dónde vive (CV/LinkedIn/portafolio).",
      "Por cada skill, escribe 1 prueba concreta (proyecto, KPI, curso con entregable).",
      "Si falta evidencia, define un mini-proyecto de 3–5 días para crearla.",
      "Agrega la evidencia al bullet del CV (no solo en la lista de skills).",
      "Prepara 1 frase oral por skill para entrevista.",
    ],
    tips: [
      "Certificación sola es débil; cert + proyecto es fuerte.",
      "Capturas o links (GitHub, Notion, dashboard) aumentan credibilidad.",
      "Si hay NDA, describe alcance sin datos sensibles.",
    ],
    example:
      "Tomás, en Monterrey, para 'Power BI': publicó un dashboard de ventas retail con datos públicos DANE/INEGI y lo linkeó en Featured. En entrevistas mostraba el modelo de datos en 2 minutos.",
    template:
      "Skill: [ ]. Evidencia: [proyecto/KPI/cert]. Prueba observable: [ ]. Ubicación: [sección CV / Featured / link]. Frase oral (20s): [ ].",
  },
  "OUT-02-d6": {
    why: "Un párrafo de ~80 palabras une logros, skills y FODA en una propuesta de valor lista para CV y LinkedIn. Sustituye el 'resumen genérico'.",
    howTo: [
      "Estructura: quién eres + 2 logros con métrica + skills top + qué buscas.",
      "Escribe un borrador libre de 120 palabras y luego recorta a ~80.",
      "Elimina adjetivos vacíos; deja verbos y números.",
      "Alinea el párrafo al rol primario elegido en inteligencia de mercado.",
      "Pégalo en el resumen del CV y en las primeras líneas del About.",
    ],
    tips: [
      "Léelo en voz alta: si te falta aire, está largo o enredado.",
      "Una sola industria foco por párrafo; no 'abierto a todo'.",
      "Actualiza el párrafo cuando cambies de rol target.",
    ],
    example:
      "Natalia, en Medellín: 'Analista de operaciones con 6 años en retail. Reduje quiebres de stock 18% y acorté el S&OP de 10 a 6 días. Experta en Excel, Power BI y coordinación cross-functional. Busco rol de coordinadora de planning en e-commerce o CPG.'",
    template:
      "[Rol + años + sector]. [Logro 1 con métrica]. [Logro 2 con métrica]. [2–3 skills]. Busco [rol target] en [industria/modalidad]. (~80 palabras)",
  },
  "OUT-02-d7": {
    why: "Validar con un par detecta frases confusas antes de que lo haga un reclutador. Feedback externo acorta iteraciones del CV.",
    howTo: [
      "Elige 1 colega o mentor que conozca el mercado (no solo un amigo cercano).",
      "Envía tu párrafo de valor + 3 bullets top y pregunta: '¿Me contratarías para [rol]? ¿Qué falta?'",
      "Pide feedback en 3 ejes: claridad, credibilidad, relevancia al rol.",
      "Ajusta solo lo que se repite o es accionable; ignora gustos de estilo.",
      "Confirma con la misma persona la versión 2 en 48 horas.",
    ],
    tips: [
      "Da un plazo ('15 min esta semana') y un link al doc.",
      "No justifiques cada crítica; escucha y filtra después.",
      "Si dos personas no entienden el mismo punto, reescribe ese punto.",
    ],
    example:
      "Hugo, en Bogotá, envió su párrafo a una exlíder de RH. Ella señaló que 'transformación digital' no decía nada; lo cambió a 'migró 4 reportes de Excel a Power BI usados por 3 gerencias'. Pasó el siguiente filtro ATS.",
    template:
      "Para: [nombre]. Rol target: [ ]. Material: [párrafo + 3 bullets]. Preguntas: 1) ¿contratarías? 2) ¿qué es confuso? 3) ¿qué falta? Ajustes hechos: [ ].",
  },

  "OUT-03-d1": {
    why: "Elegir 3 roles reales ancla la búsqueda a títulos que el mercado usa. Buscar 'lo que sea' diluye CV, keywords y networking.",
    howTo: [
      "En LinkedIn/Computrabajo/Eleempleo busca títulos cercanos a tu experiencia en tu país.",
      "Copia 3 títulos exactos que aparezcan en ≥3 ofertas (ej. 'Analista de datos', 'Business Analyst', 'Coordinador de BI').",
      "Por cada rol, pega 5 requisitos comunes en una hoja.",
      "Marca overlap contigo (ya lo tienes) vs gap.",
      "Descarta títulos glamurosos que no existen en tu mercado local.",
    ],
    tips: [
      "Usa el título del empleador, no el inventado en tu cabeza.",
      "Incluye sinónimos regionales (Analista vs Especialista vs Coordinador).",
      "Guarda links de 2 ofertas por rol como referencia.",
    ],
    example:
      "Carolina, en Bogotá, eligió: Analista de Inteligencia Comercial, Analista de Datos Jr/Mid, Coordinadora de Reporting. Todos aparecían en Eleempleo y LinkedIn Colombia con requisitos repetidos (Excel, SQL, Power BI).",
    template:
      "Rol 1: [título exacto] — requisitos comunes: [ ]. Rol 2: [ ]. Rol 3: [ ]. Overlap mío: [ ]. Gaps: [ ].",
  },
  "OUT-03-d2": {
    why: "Un mínimo aceptable basado en mercado + costos evita aceptar devaluado o pedir cifras irreales. Negociar sin datos es adivinar.",
    howTo: [
      "Revisa bandas en Computrabajo, Eleempleo, Glassdoor, niveles.uy/mx/co o posts de reclutadores locales.",
      "Anota rango P25–P75 para tu rol y ciudad (o remoto LATAM).",
      "Suma tus costos mensuales fijos + colchón 10–15%; eso es tu piso de supervivencia.",
      "Define: piso (mínimo aceptable), meta (mercado medio), techo (stretch con evidencia).",
      "Documenta 2 fuentes por cifra para usarlas en negociación.",
    ],
    tips: [
      "Ajusta por modalidad (remoto US paga distinto a presencial local).",
      "Incluye beneficios: EPS/prepaga, bono, equipo, internet.",
      "No publiques tu piso en LinkedIn; úsalo solo en negociación.",
    ],
    example:
      "Felipe, coordinador de proyectos en Medellín, halló banda 6–9 M COP. Costos 4.8 M → piso 6.2 M, meta 7.5 M, techo 9 M si hay bono. Negoció con evidencia de 3 ofertas similares.",
    template:
      "Rol/ciudad: [ ]. Fuentes: [ ]. Rango mercado: [min–max]. Mis costos: [ ]. Piso: [ ]. Meta: [ ]. Techo: [ ]. Notas beneficios: [ ].",
  },
  "OUT-03-d3": {
    why: "Priorizar 2 gaps cerrables en 30 días convierte el FODA en plan. Atacar 10 gaps a la vez garantiza no cerrar ninguno.",
    howTo: [
      "Compara tu mapa de skills vs requisitos de los 3 roles target.",
      "Lista todos los gaps; clasifica: cerrable en 30 días / 90 días / no prioritario.",
      "Elige solo 2 cerrables en 30 días (curso + práctica, no un MBA).",
      "Define evidencia de cierre: mini-proyecto, certificación corta, portfolio piece.",
      "Agenda bloques diarios de 25–45 min para esos 2 gaps.",
    ],
    tips: [
      "Prefiere tools pedidas en ofertas (SQL, HubSpot) sobre cursos 'interesantes'.",
      "Si el gap es inglés, práctica técnica > gramática general.",
      "Revisa en 30 días con una oferta real: ¿apareces más alineado?",
    ],
    example:
      "Andrea, en Lima, vio gaps: SQL, Tableau, inglés C1. Eligió SQL + Tableau (cerrables). Inglés quedó en mantenimiento 15 min/día. En 4 semanas tenía un dashboard con consultas SQL en GitHub.",
    template:
      "Gaps totales: [ ]. Cerrables 30d: 1)[ ] evidencia=[ ], 2)[ ] evidencia=[ ]. Plan diario: [minutos] en [horario]. Revisión el: [fecha].",
  },
  "OUT-03-d4": {
    why: "Las keywords repetidas en ofertas son la demanda real del mercado. Ignorarlas es optimizar el CV a tu gusto, no al filtro.",
    howTo: [
      "Abre 10 ofertas de tus roles target (mismo país/modalidad).",
      "Copia requisitos y responsabilidades a un doc.",
      "Cuenta frecuencia de términos (Excel, SAP, Scrum, 'stakeholders', 'OKR').",
      "Arma top 10 keywords por frecuencia.",
      "Marca cuáles ya están en tu CV con evidencia y cuáles faltan (honestas).",
    ],
    tips: [
      "Incluye verbos de acción que se repiten ('liderar', 'automatizar').",
      "No copies la oferta entera; integra keywords en logros reales.",
      "Actualiza el top 10 cada mes; el mercado cambia.",
    ],
    example:
      "Óscar, en Ciudad de México, en 10 ofertas de Customer Success vio repetido: churn, onboarding, QBR, Salesforce, NPS. Reescribió bullets con esas palabras ligadas a sus métricas reales en un BPO.",
    template:
      "Ofertas revisadas (10 links): [ ]. Top 10 keywords: 1–10 [ ]. Ya en CV: [ ]. Faltan (con evidencia posible): [ ].",
  },
  "OUT-03-d5": {
    why: "Saber dónde aparecen tus roles define el mix de canales. El mercado oculto (referidos) suele superar a portales genéricos.",
    howTo: [
      "Por cada rol target, anota canales: LinkedIn Easy Apply, bolsas locales, consultoras, referidos, grupos de Facebook/WhatsApp del sector.",
      "Estima % de tiempo semanal por canal (ej. 40% referidos, 30% LinkedIn, 20% bolsas, 10% consultoras).",
      "Identifica 2 consultoras o hunters activos en tu nicho.",
      "Únete a 1 comunidad relevante (Slack, Discord, Meetup, cámara de comercio).",
      "Prueba 1 semana y mide respuestas por canal.",
    ],
    tips: [
      "Si un canal da 0 respuestas en 15 envíos, cambia mensaje o canal.",
      "Los referidos necesitan mapa de contactos (módulo networking).",
      "Guarda reclutadores que publiquen vacantes recurrentes de tu rol.",
    ],
    example:
      "Jimena, en Córdoba (AR), descubrió que su rol de People Analytics salía más por LinkedIn y referidos de RH que por Computrabajo. Reasignó tiempo: 50% outreach, 30% LinkedIn, 20% bolsas.",
    template:
      "Rol: [ ]. Canales: LinkedIn [ ], bolsas [ ], referidos [ ], consultoras [ ], comunidades [ ]. Mix semanal %: [ ]. Hunters a contactar: [ ].",
  },
  "OUT-03-d6": {
    why: "Un plan a 30 días con cupos diarios convierte la intención en sistema. Sin cupos, la búsqueda se come o se evade.",
    howTo: [
      "Divide la semana en: aprendizaje (gaps), networking, postulaciones de calidad.",
      "Asigna cupos realistas (ej. 1h aprendizaje, 3 outreach, 2 postulaciones tailor-made).",
      "Bloquea en calendario con alarmas; trata los cupos como reuniones.",
      "Define criterio de 'postulación de calidad' (CV ajustado + keywords + nota).",
      "Cada domingo, revisa cumplimiento y ajusta cupos ±20%, no abandones el plan.",
    ],
    tips: [
      "Menos postulaciones genéricas, más tailor-made.",
      "Deja 1 buffer day a la semana para imprevistos.",
      "Mide outputs (mensajes enviados, entrevistas) no solo horas.",
    ],
    example:
      "Luis, en Cali, plan 30 días: L-V 25' SQL; 3 mensajes networking; 2 ofertas con CV ajustado. Resultado mes 1: 12 entrevistas de filtro vs 2 el mes anterior sin plan.",
    template:
      "Cupos diarios — Aprendizaje: [min/skill]. Networking: [# mensajes]. Postulaciones calidad: [#]. Criterio calidad: [ ]. Revisión dominical: [checklist].",
  },
  "OUT-03-d7": {
    why: "Un rol primario y uno secundario evitan dispersión. Enfocarse 30 días multiplica match ATS y claridad de pitch.",
    howTo: [
      "Revisa tus 3 roles, bandas, gaps y demanda de keywords.",
      "Elige 1 primario (mejor fit + demanda) y 1 secundario (backup cercano).",
      "Archiva el tercero por 30 días (no lo borres; aparca).",
      "Ajusta headline, About y CV al primario; guarda una variante para el secundario.",
      "Compromete la decisión por escrito con fecha de reevaluación (+30 días).",
    ],
    tips: [
      "Primario ≠ el más soñado si no hay demanda local.",
      "Secundario debe compartir ≥60% de skills con el primario.",
      "Di 'no' amable a procesos muy lejos del foco (salvo emergencia económica).",
    ],
    example:
      "Diana, en Barranquilla, eligió primario: Coordinadora de Logística; secundario: Analista de Inventarios. Aparcó 'Project Manager genérico'. Su tasa de respuesta subió al alinear keywords de puertos y WMS.",
    template:
      "Primario: [rol] porque [fit + demanda]. Secundario: [ ]. Aparcao: [ ]. Reevaluación: [fecha]. Cambios hechos en CV/LinkedIn: [ ].",
  },

  "OUT-04-d1": {
    why: "Una sola skill prioritaria evita el síndrome del curso eterno. El upskilling útil es estrecho, medible y ligado a una oferta target.",
    howTo: [
      "Toma los 2 gaps del módulo de mercado y elige 1 como prioridad absoluta.",
      "Define el resultado observable en 30 días (ej. 'consultar JOINs y explicarlos en entrevista').",
      "Escribe qué NO estudiarás este mes (lista de tentaciones).",
      "Alinea la skill al rol primario y a keywords del top 10.",
      "Comunica la elección a un accountability partner.",
    ],
    tips: [
      "Si dos skills empatan, elige la que aparece en más ofertas.",
      "Evita stacks completos ('todo el data science'); recorta a lo pedible.",
      "Revisa en día 7 si aún es la skill correcta; cambia solo con evidencia.",
    ],
    example:
      "Mateo, en Bogotá, eligió solo 'SQL intermedio' aunque quería Python y Tableau. En ofertas de Analista de Datos, SQL salía 9/10 veces. Python quedó para el mes 2.",
    template:
      "Skill prioritaria: [ ]. Resultado 30 días: [ ]. Ofertas que la piden: [#]. No estudiaré este mes: [ ]. Partner: [ ].",
  },
  "OUT-04-d2": {
    why: "Un recurso gratuito/económico con 25 minutos diarios supera el curso caro abandonado. La agenda fija es el multiplicador.",
    howTo: [
      "Busca 2–3 recursos low-cost (Coursera audit, YouTube curricula, freeCodeCamp, Guías del SENA, Docs oficiales).",
      "Elige 1 con ejercicios prácticos, no solo videos.",
      "Agenda 25 min diarios en el mismo horario que tu rutina de búsqueda o justo después.",
      "Define el módulo/semana 1 (qué lecciones exactas).",
      "Al terminar cada bloque, anota 1 hallazgo aplicable a tu proyecto mínimo.",
    ],
    tips: [
      "Desactiva autoplay; sal del video al ejercicio.",
      "Si el curso es en inglés y te frena, usa subtítulos + práctica en español.",
      "Paga solo si el certificado es requisito explícito en tus ofertas.",
    ],
    example:
      "Sofía, en Quito, eligió el track SQL de freeCodeCamp + 25 min a las 7:00. En 12 días completó JOINs y empezó su proyecto con datos abiertos del INEC.",
    template:
      "Recurso: [nombre/link]. Costo: [ ]. Bloque diario: [hora] — 25 min. Semana 1: [módulos]. Nota post-sesión: [1 aprendizaje].",
  },
  "OUT-04-d3": {
    why: "Un entregable pequeño convierte estudio en evidencia. Sin proyecto, el gap sigue abierto ante reclutadores.",
    howTo: [
      "Define un entregable que quepa en 5–8 horas totales (dashboard, script, playbook, caso).",
      "Usa datos públicos o un caso anónimo de tu experiencia pasada.",
      "Escribe criterio de 'terminado' (qué se ve, qué se puede clicar/leer).",
      "Construye la versión fea primero (MVP); no perfeccionces el día 1.",
      "Guarda el archivo en drive/GitHub/Notion listo para link.",
    ],
    tips: [
      "El proyecto debe usar la skill prioritaria de forma visible.",
      "Documenta en 5 líneas: problema, enfoque, resultado.",
      "Nómbralo como lo haría un empleador ('Tablero churn retail'), no 'Proyecto 1'.",
    ],
    example:
      "Iván, en Monterrey, creó un tablero de 'rotación de inventarios' con Excel + Power Query usando datos ficticios de retail. Lo subió a LinkedIn Featured con 4 capturas y el problema de negocio.",
    template:
      "Entregable: [nombre]. Skill demostrada: [ ]. Horas estimadas: [ ]. Criterio done: [ ]. Link/ubicación: [ ]. Resumen 5 líneas: [ ].",
  },
  "OUT-04-d4": {
    why: "La práctica deliberada (mejorar el mismo entregable) consolida skill más que acumular cursos. Feedback y checklist suben calidad a nivel entrevista.",
    howTo: [
      "Crea un checklist de calidad (claridad, exactitud, presentación, narrativa de negocio).",
      "Pasa tu MVP por el checklist y marca fallas.",
      "Pide feedback a 1 persona técnica o de negocio (15 min).",
      "Implementa solo 3 mejoras prioritarias.",
      "Vuelve a grabar un walkthrough de 90 segundos del entregable.",
    ],
    tips: [
      "Una iteración profunda > tres proyectos a medias.",
      "Guarda versión 1 y 2 para mostrar progreso en entrevistas.",
      "Si nadie puede revisar, compara contra un buen ejemplo público del rol.",
    ],
    example:
      "Daniela, en Santiago, mejoró su modelo financiero: v1 solo tablas; v2 con supuestos claros, sensibilidad y gráfico. En entrevista de FP&A abrió la v2 y explicó trade-offs en 3 minutos.",
    template:
      "Checklist: [ ]. Feedback de: [ ]. Top 3 mejoras: 1)[ ] 2)[ ] 3)[ ]. Walkthrough 90s: [sí/no]. Diferencia v1→v2: [ ].",
  },
  "OUT-04-d5": {
    why: "Publicar evidencia construye marca y da prueba social. Lo que no se ve, no cuenta en el mercado oculto ni en ATS humano.",
    howTo: [
      "Elige formato: post LinkedIn, Featured, GitHub README o carrusel de capturas.",
      "Estructura el post: problema → qué hice → resultado/aprendizaje → CTA suave ('abierto a roles X').",
      "Publica en horario laboral local (martes–jueves suele funcionar mejor).",
      "Responde comentarios en las primeras 2 horas.",
      "Guarda el link en tu CRM de búsqueda y en el CV (si aplica).",
    ],
    tips: [
      "No exagerues resultados; la credibilidad es el activo.",
      "Etiqueta 1–2 personas solo si aportaron feedback real.",
      "Un post claro > hilo eterno con emojis.",
    ],
    example:
      "Camila, en Medellín, publicó: 'Cerré el gap de SQL con un análisis de demoras en entregas (datos abiertos). Aquí el query de JOINs y 3 hallazgos.' Recibió 2 mensajes de reclutadores de logística esa semana.",
    template:
      "Formato: [post/Featured/repo]. Problema: [ ]. Qué hice: [ ]. Resultado: [ ]. CTA: [ ]. Link: [ ]. Fecha publicación: [ ].",
  },
  "OUT-04-d6": {
    why: "Actualizar el CV con skill + evidencia evita el keyword vacío. Los ATS y humanos buscan contexto, no listas decorativas.",
    howTo: [
      "Agrega la skill en la sección Skills solo si hay evidencia en bullets o proyectos.",
      "Escribe 1 bullet nuevo: verbo + acción con la skill + resultado.",
      "Si hay proyecto personal, crea sección 'Proyectos' con link y 2 líneas.",
      "Alinea el wording a las keywords del top 10 (sin mentir).",
      "Exporta PDF limpio y corre una pasada visual de una columna.",
    ],
    tips: [
      "Nunca pongas 'experto' si el proyecto es introductorio; usa 'aplicado en…'.",
      "Quita skills obsoletas que diluyen el foco.",
      "Misma skill en LinkedIn Skills + evidencia en Experiencia/Featured.",
    ],
    example:
      "Roberto, en Lima, cambió 'Python' suelto por bullet: 'Automatizé limpieza de 12k filas de ventas con Python (pandas), reduciendo el prep de reporte semanal de 3h a 40min.' + link al notebook.",
    template:
      "Skill en CV: [ ]. Bullet con evidencia: [ ]. Sección proyectos: [título — link — 2 líneas]. Keywords alineadas: [ ].",
  },
  "OUT-04-d7": {
    why: "Re-medir match contra una oferta real prueba si el gap se cerró. Horas de video no son indicador; el score y el fit sí.",
    howTo: [
      "Elige 1 oferta target del rol primario (la misma del inicio del mes si es posible).",
      "Corre ATSAdvisor (u otra herramienta ATS) con tu CV actualizado.",
      "Compara score/keywords vs la corrida anterior; anota deltas.",
      "Si no subió, identifica 1 keyword faltante honesta y un plan de 7 días.",
      "Documenta el antes/después en tu tracker de outplacement.",
    ],
    tips: [
      "Subir score mintiendo keywords es victoria falsa; no lo hagas.",
      "Mira también fit humano: ¿puedes hablar 5 minutos del proyecto?",
      "Celebra mejoras pequeñas (ej. +8–15 puntos) y sigue iterando.",
    ],
    example:
      "Ana, en Ciudad de México, pasó de 62 a 78 de match en una oferta de Analista BI tras agregar SQL + dashboard. En la entrevista explicó el modelo; el score solo abrió la puerta.",
    template:
      "Oferta: [link]. Score antes: [ ]. Score después: [ ]. Keywords ganadas: [ ]. Si no subió, gap restante: [ ] + plan 7 días: [ ].",
  },

  "OUT-05-d1": {
    why: "El headline de LinkedIn es tu anuncio de búsqueda en 220 caracteres. Cargo | Valor | Nicho filtra a quien debe escribirte.",
    howTo: [
      "Estructura: [Cargo target o actual] | [Valor/resultado] | [Nicho/industria/modalidad].",
      "Escribe 3 variantes y elige la más específica.",
      "Quita frases vacías ('apasionado', 'open to work' como único mensaje).",
      "Incluye 1 keyword de tu top 10 si cabe con naturalidad.",
      "Publica y pide a un colega si entiende tu foco en 3 segundos.",
    ],
    tips: [
      "Si estás en transición, usa el cargo target + 'Ex-[función]' con cuidado; prioriza valor.",
      "Evita emojis excesivos en LATAM corporate; 0–1 máximo.",
      "Actualiza el headline cuando cambies de rol primario.",
    ],
    example:
      "Patricia, en Bogotá: 'Analista de Datos | Reduzco tiempo de reporting con SQL y Power BI | Retail & e-commerce'. Reemplazó 'Buscando oportunidades | Apasionada de los datos'.",
    template:
      "[Cargo] | [resultado o skill diferencial] | [nicho/industria]. Variante 2: [ ]. Variante 3: [ ]. Elegida: [ ].",
  },
  "OUT-05-d2": {
    why: "El About con 3 logros STAR convierte el extracto en prueba, no en biografía. STAR da estructura memorable para humanos y keywords.",
    howTo: [
      "Elige 3 logros del inventario; escribe Situación, Tarea, Acción, Resultado (2–3 líneas c/u).",
      "Abre el About con tu frase X–Y–Z (2 líneas).",
      "Pega los 3 STAR en bullets o párrafos cortos.",
      "Cierra con qué buscas y cómo contactarte (mail o CTA).",
      "Recorta adornos hasta que quepa en una lectura de 40–50 segundos.",
    ],
    tips: [
      "Resultado primero si el About es largo; muchos solo leen el inicio.",
      "Números > adjetivos.",
      "Misma historia STAR la usarás en entrevistas: mantén consistencia.",
    ],
    example:
      "Esteban, en Buenos Aires, abrió con su pitch X–Y–Z y tres STAR: migración ERP (S/T/A/R con -30% errores), training a 40 usuarios, y automatización de conciliación. El About pasó de 'soy proactivo' a evidencia.",
    template:
      "Pitch: [X–Y–Z]. STAR1 S/T/A/R: [ ]. STAR2: [ ]. STAR3: [ ]. Cierre: Busco [rol]. Contacto: [ ].",
  },
  "OUT-05-d3": {
    why: "El formato multi-columna e imágenes rompe parsers ATS. Una columna, secciones estándar y PDF limpio maximizan que te lean.",
    howTo: [
      "Usa plantilla de una columna: Header, Resumen, Experiencia, Educación, Skills, (Proyectos).",
      "Evita tablas, text boxes, iconos de skill bars e infografías.",
      "Estandariza fechas (MMM AAAA – MMM AAAA) y cargos claros.",
      "Exporta a PDF desde Word/Google Docs con texto seleccionable (no escaneo).",
      "Prueba copiar-pegar el PDF a un bloc de notas: si el orden se rompe, rediseña.",
    ],
    tips: [
      "Máximo 2 páginas si tienes +8 años; 1 página si eres early-mid.",
      "Nombre de archivo: Nombre_Apellido_Rol.pdf.",
      "Márgenes ≥1.5 cm; fuente legible 10–12 pt.",
    ],
    example:
      "Lucía, en Guadalajara, pasó de CV Canva de dos columnas (score ATS bajo) a una columna en Docs. El mismo contenido subió match y un reclutador confirmó que el parseo ya traía fechas correctas.",
    template:
      "Secciones: [listado]. Formato: 1 columna / sin tablas. Prueba copy-paste: [ok/falló]. Nombre archivo: [ ]. Páginas: [ ].",
  },
  "OUT-05-d4": {
    why: "Integrar keywords de ofertas reales sube match; inventar experiencia es riesgo ético y de entrevista. Honestidad + alineación es la estrategia sostenible.",
    howTo: [
      "Toma el top 10 keywords y ubícalas en resumen, bullets y skills solo donde sean verdaderas.",
      "Reescribe bullets para incluir el término natural ('gestión de stakeholders', 'churn').",
      "Prohibido: listar tools que no usaste o cargos inventados.",
      "Si conoces la skill a nivel básico, contextualiza ('proyecto personal', 'curso + entregable').",
      "Haz una pasada anti-stuffing: si una keyword aparece 8 veces, reduce a 2–3 naturales.",
    ],
    tips: [
      "Sinónimos regionales cuentan (RR.HH. / People / Talento).",
      "El stuffing puede penalizar en filtros humanos aunque pase ATS.",
      "Prioriza keywords del rol primario, no de los tres a la vez.",
    ],
    example:
      "Héctor, en Lima, tenía 'Excel' 12 veces. Lo dejó en skills + 2 bullets con Power Query y tablas dinámicas. Agregó 'S&OP' solo en el logro donde realmente participó del ciclo mensual.",
    template:
      "Keywords a integrar: [ ]. Dónde (resumen/bullet/skills): [ ]. Descartadas por falta de evidencia: [ ]. Pasada anti-stuffing hecha: [sí].",
  },
  "OUT-05-d5": {
    why: "Correr ATSAdvisor contra una oferta target cierra el loop de mejora. Iterar con datos evita reescribir el CV a ciegas.",
    howTo: [
      "Sube CV + pega oferta target en ATSAdvisor (o herramienta equivalente del producto).",
      "Anota score, keywords faltantes y secciones débiles.",
      "Aplica 3–5 cambios honestos (no copies la oferta).",
      "Vuelve a correr; registra delta.",
      "Detente cuando el score mejore y puedas defender cada keyword en entrevista.",
    ],
    tips: [
      "Itera el mismo par CV–oferta; no cambies de oferta cada vez.",
      "Si el score no sube, el gap es de experiencia real: vuelve a upskilling.",
      "Guarda PDF final versionado (v3, v4).",
    ],
    example:
      "Mariana, en Bogotá, iteró 3 veces contra una oferta de Coordinadora de CX: 55 → 68 → 81. Los cambios clave fueron bullets con 'NPS', 'QBR' y un proyecto de playbook de onboarding.",
    template:
      "Oferta: [ ]. Score inicial: [ ]. Cambios: [ ]. Score final: [ ]. Keywords aún faltantes (con plan): [ ]. Archivo final: [nombre].",
  },
  "OUT-05-d6": {
    why: "Foto y banner profesionales aumentan confianza en LATAM, donde el perfil visual aún pesa. Fondo simple y banner con valor evitan ruido.",
    howTo: [
      "Foto: rostro claro, luz natural o estudio, ropa neat del sector, fondo neutro.",
      "Evita selfies anguladas, lentes de sol, fotos de fiesta o recortes de grupo.",
      "Banner: imagen limpia + texto corto con propuesta de valor (Cargo | Valor | Nicho).",
      "Revisa cómo se ve en móvil (recorte del banner).",
      "Pide opinión a 1 colega: ¿se ve profesional para tu industria?",
    ],
    tips: [
      "Si no tienes fotógrafo, usa celular a la altura de los ojos cerca de una ventana.",
      "No pongas teléfono ni email gigante en el banner (se ve spam).",
      "Actualiza foto si cambió mucho tu apariencia o sector (ej. a corporate).",
    ],
    example:
      "Andrés, en Medellín, reemplazó un selfie de gym por foto de hombros con camisa y banner: 'Ops Retail | Menos quiebres, más fill-rate'. Su tasa de aceptación de conexiones subió en hunters de supply chain.",
    template:
      "Foto: [fecha/toma]. Checklist (luz/fondo/ropa): [ ]. Texto banner: [ ]. Vista móvil OK: [sí/no]. Feedback de: [ ].",
  },
  "OUT-05-d7": {
    why: "El Featured con CV/proyecto + CTA de contacto reduce fricción. Quien llega a tu perfil debe poder ver prueba y escribirte en un clic.",
    howTo: [
      "Sube a Featured: PDF del CV o link al proyecto estrella + 1 media (PDF/imagen/post).",
      "Escribe descripción corta: qué es + qué rol buscas.",
      "En About, cierra con CTA: mail profesional o 'Escríbeme por LinkedIn'.",
      "Activa Open to Work (solo reclutadores si prefieres discreción).",
      "Prueba el flujo: abre tu perfil en incógnito y verifica que todo cargue.",
    ],
    tips: [
      "Actualiza el PDF Featured cuando versiones el CV.",
      "Un solo proyecto excelente > cinco links mediocres.",
      "Mail profesional (nombre.apellido), no nick de adolescencia.",
    ],
    example:
      "Valeria, en Santiago, puso en Featured su CV ATS + dashboard Power BI. CTA: 'Busco rol Analista BI en CPG — valeria.datos@email.com'. Un recruiter de Santiago la contactó sin pedir CV por separado.",
    template:
      "Featured 1: [CV/proyecto]. Featured 2 (opc): [ ]. CTA About: [ ]. Open to Work: [sí reclutadores/sí todos/no]. Mail: [ ].",
  },

  "OUT-06-d1": {
    why: "Un mapa de ~20 contactos relevantes alimenta el mercado oculto. Sin lista, el networking es espontáneo e insuficiente.",
    howTo: [
      "Abre una hoja: Nombre | Relación | Empresa | Por qué relevante | Canal | Estado.",
      "Llena 20 filas: excompañeros, líderes de área, reclutadores del sector, proveedores, clientes, alumni.",
      "Prioriza A/B/C según cercanía y poder de intro.",
      "Completa datos faltantes (LinkedIn URL) antes de escribir mensajes.",
      "Agenda contactar 5 por semana empezando por A.",
    ],
    tips: [
      "Incluye personas 'débiles ties': a menudo abren más puertas que amigos íntimos.",
      "No hace falta que sepan de tu salida aún; el mapa es interno primero.",
      "Actualiza el mapa cada viernes con nuevos nombres de conversaciones.",
    ],
    example:
      "Nicolás, en Bogotá, listó 22 contactos: 8 ex-Bavaria/AB InBev, 5 reclutadores de consumo masivo, 4 profesores de su especialización, 5 peers de logística. En 3 semanas logró 6 cafés virtuales.",
    template:
      "Contacto: [ ]. Relación: [ ]. Empresa/sector: [ ]. Valor potencial: [intro/feedback/info]. Prioridad A/B/C: [ ]. Próximo paso: [ ].",
  },
  "OUT-06-d2": {
    why: "Un script de 5 líneas con pedido de 15 minutos eleva respuestas. Mensajes largos o '¿hay chamba?' se ignoran.",
    howTo: [
      "Línea 1: saludo + ancla personalizada (post, empresa, interés común).",
      "Línea 2–3: contexto breve de transición + valor que aportas (1 logro).",
      "Línea 4: pedido concreto (15 min / intro a X / feedback de 1 cosa).",
      "Línea 5: agradecimiento + 2 opciones de horario.",
      "Guarda 2 variantes: para peer y para hiring manager/reclutador.",
    ],
    tips: [
      "Personaliza 1 frase; el resto puede ser plantilla.",
      "No adjuntes CV en el primer mensaje salvo que lo pidan.",
      "Máximo 500–700 caracteres en LinkedIn.",
    ],
    example:
      "Juliana, en Cali, a un hiring manager: 'Vi tu post sobre el nuevo CEDIS. Coordiné aperturas de 2 centros en el Eje Cafetero (-12% merma en 90 días). ¿15 min el mié o jue para conocer prioridades del equipo de ops?' Tasa de respuesta ~40%.",
    template:
      "Hola [nombre], [ancla personalizada]. [Contexto + 1 logro]. ¿Podrías [pedido 15 min/intro]? Me sirve [día A] o [día B]. Gracias, [nombre].",
  },
  "OUT-06-d3": {
    why: "Enviar 5 outreaches personalizados hoy crea momentum. La red no responde a intenciones; responde a mensajes enviados.",
    howTo: [
      "Elige 5 contactos prioritarios A del mapa.",
      "Investiga 2 minutos cada uno (post reciente, noticia de empresa, interés común).",
      "Adapta el script corto con esa ancla.",
      "Envía los 5 en un solo bloque de foco (45–60 min).",
      "Registra en CRM: fecha, mensaje, estado 'enviado'.",
    ],
    tips: [
      "Mejor 5 personalizados que 20 copy-paste.",
      "Evita lunes 7am y viernes tarde si puedes; prueba mar–jue 9–11.",
      "Si no tienes InMail, usa conexión + nota o email hallado éticamente.",
    ],
    example:
      "Pedro, en Monterrey, envió 5 mensajes el martes: 2 peers de automotriz, 1 reclutadora, 1 exjefe, 1 alumni. Tres respondieron; uno generó intro a un gerente de Continuous Improvement.",
    template:
      "Lista del día: 1)[ ] ancla=[ ] 2)[ ] ancla=[ ] 3)[ ] ancla=[ ] 4)[ ] ancla=[ ] 5)[ ] ancla=[ ]. Enviados a las: [hora].",
  },
  "OUT-06-d4": {
    why: "El follow-up educado a 4–5 días recupera respuestas perdidas sin quemar la relación. Un solo recordatorio breve suele bastar.",
    howTo: [
      "Filtra del CRM quienes no respondieron en 4–5 días.",
      "Escribe follow-up de 3 líneas: recordatorio + valor extra (artículo, dato) + pedido suave.",
      "Envía una sola vez; si no hay respuesta, marca 'frío' y vuelve en 4–6 semanas o pide otro camino.",
      "Nunca reenvíes el mismo mensaje 3 días seguidos.",
      "Agradece aunque digan que no pueden ayudar.",
    ],
    tips: [
      "Añadir valor (link útil) diferencia el follow-up de la presión.",
      "Cambia canal solo si es apropiado (LinkedIn → mail).",
      "Lleva conteo: muchos 'sí' llegan en el segundo toque.",
    ],
    example:
      "Laura, en Lima, follow-up: 'Reenvio por si se perdió. Comparto un benchmark de fill-rate retail LATAM que usé en mi último rol. Si no es buen momento, ¿me recomiendas a alguien de planning?' Obtuvo una intro alternativa.",
    template:
      "Hola [nombre], te escribo por si se perdió mi nota sobre [tema]. [1 valor extra]. ¿[pedido breve]? Si ahora no va, no hay problema. Gracias.",
  },
  "OUT-06-d5": {
    why: "Pedir referidos solo con fit claro protege tu capital social. Un referido forzado daña tu marca y la del que recomienda.",
    howTo: [
      "Antes de pedir referido, verifica ≥70% match con la oferta (skills + interés real).",
      "Explica por qué encajas en 4–5 líneas con evidencias.",
      "Facilita el trabajo: adjunta CV PDF + blurb de reenvío listo para copiar.",
      "Acepta un 'no' sin insistir; pregunta si conocen otra persona o área.",
      "Agradece con update posterior (aunque no quedes): cierra el loop.",
    ],
    tips: [
      "Nunca pidas 'refiéreme a todo lo que veas'.",
      "Prefiere referidos a gente que te vio trabajar.",
      "Si el fit es dudoso, pide intro informativa, no referido formal.",
    ],
    example:
      "Carlos, en Ciudad de México, solo pidió referido a una vacante de CS Manager tras mapear 8/10 requisitos. Dio a su contacto un párrafo listo: impacto en churn -4 pts. El referido llegó en 48h.",
    template:
      "Oferta: [link]. Fit (%): [ ]. Por qué encajo: [3 bullets]. Blurb para reenvío: [4 líneas]. CV adjunto: [sí]. Update prometido para: [fecha].",
  },
  "OUT-06-d6": {
    why: "Una comunidad del sector expone vacantes no publicadas y peers que refieren. El mercado oculto vive en conversaciones, no solo en portales.",
    howTo: [
      "Elige 1 comunidad alineada (Meetup, asociación, Slack, grupo LinkedIn serio, cámara).",
      "Agenda 1 participación esta semana: evento, AMA, o comentario útil en hilo.",
      "Prepárate 1 pregunta inteligente o 1 aporte (recurso, experiencia).",
      "Conecta con 2 personas nuevas post-evento con mensaje de valor.",
      "Añádelas al mapa de 20+ contactos.",
    ],
    tips: [
      "Escucha primero 10 minutos; no pitches tu CV al entrar.",
      "Comunidades activas > grupos zombi de 50k miembros sin diálogo.",
      "Presencial en tu ciudad acelera confianza (Bogotá, CDMX, Lima, SCL).",
    ],
    example:
      "Gabriela, en Buenos Aires, asistió a un meetup de Product Analytics. Hizo una pregunta sobre instrumentación; después conectó con un PM que la presentó a un data lead con vacante no publicada.",
    template:
      "Comunidad: [ ]. Evento/fecha: [ ]. Aporte o pregunta: [ ]. Contactos nuevos: 1)[ ] 2)[ ]. Mensaje post-evento enviado: [sí/no].",
  },
  "OUT-06-d7": {
    why: "Un CRM simple evita que el networking se enfríe. Sin próximo paso, las conversaciones mueren y pierdes oportunidades.",
    howTo: [
      "Crea sheet: Contacto | Empresa | Fecha último toque | Estado | Próximo paso | Fecha próximo | Notas.",
      "Estados sugeridos: por contactar, enviado, respondió, reunión agendada, referido, frío, ganado.",
      "Cada viernes, revisa filas sin próximo paso y asígnalo.",
      "Pon recordatorios en calendario para follow-ups.",
      "Mide semanal: # enviados, # respuestas, # reuniones, # intros.",
    ],
    tips: [
      "Google Sheets o Notion bastan; no necesitas Salesforce.",
      "Si una fila lleva 3 semanas sin movimiento, decide: follow-up o archivar.",
      "Comparte el sheet solo contigo (privacidad).",
    ],
    example:
      "Raúl, en Barranquilla, lleva 35 filas en Sheets. Cada viernes agenda 5 follow-ups. En un mes convirtió 4 reuniones en 2 procesos activos que no estaban en portales.",
    template:
      "Contacto: [ ]. Último toque: [fecha]. Estado: [ ]. Próximo paso: [ ]. Fecha próximo: [ ]. Nota clave: [ ]. Métricas semana: envíos[ ] resp[ ] meetings[ ].",
  },

  "OUT-07-d1": {
    why: "Cinco historias STAR de ~90 segundos cubren el 80% de entrevistas conductuales. Sin ellas, improvisas y pierdes estructura.",
    howTo: [
      "Elige 5 temas: logro top, conflicto, fracaso/aprendizaje, liderazgo/influencia, deadline bajo presión.",
      "Escribe STAR en viñetas (no párrafo ensayo).",
      "Grábate 90 segundos por historia; cronometra.",
      "Recorta si pasas de 2 minutos; agrega Resultado si quedas corto.",
      "Practica sin leer hasta que fluya el Resultado numérico.",
    ],
    tips: [
      "Empieza por el Resultado si el entrevistador pide 'versión corta'.",
      "Usa 'yo' en tu acción; no diluyas en 'nosotros' todo el tiempo.",
      "Misma historia puede servir a varias preguntas: mapea etiquetas.",
    ],
    example:
      "Isabella, en Medellín, grabó 5 STAR. La de conflicto (ops vs comercial) la usó en 3 entrevistas distintas. Bajó de 3:30 a 1:25 manteniendo la métrica de -15% pedidos incompletos.",
    template:
      "Historia [#]: Tema [ ]. S: [ ]. T: [ ]. A: [ ]. R: [métrica]. Duración grabada: [ ]s. Etiquetas de preguntas: [ ].",
  },
  "OUT-07-d2": {
    why: "Preguntas difíciles (gaps, despido, debilidad, conflicto) se ganan con hechos + aprendizaje. Culpar o mentir destruye confianza.",
    howTo: [
      "Redacta respuesta al despido/salida: hecho → contexto neutral → aprendizaje → foco futuro (45–60s).",
      "Debilidad: elige una real y no crítica al rol + plan de mitigación en curso.",
      "Gap laboral: qué hiciste (upskilling, proyecto, caregiving) sin sobrejustificar.",
      "Conflicto: STAR con énfasis en escucha y resultado de negocio.",
      "Practica con un peer que te haga de 'entrevistador duro'.",
    ],
    tips: [
      "Nunca digas ilegalidades, chismes o datos confidenciales.",
      "Evita 'soy perfeccionista' como debilidad cliché.",
      "Si hubo layoff masivo, dilo: es hecho, no estigma.",
    ],
    example:
      "Fernando, en Lima, ensayó: 'El área se cerró en un rediseño. Documenté procesos y formé al equipo entrante. Aprendí a comunicar riesgos más temprano. Hoy busco un equipo estable de supply chain.' Tono calmado, sin culpas.",
    template:
      "Salida: [hechos]. Aprendizaje: [ ]. Debilidad + plan: [ ]. Gap: [actividad]. Conflicto STAR corto: [ ].",
  },
  "OUT-07-d3": {
    why: "Tres preguntas inteligentes sobre éxito a 90 días muestran interés estratégico y te dan datos para decidir oferta.",
    howTo: [
      "Investiga la empresa 20 min (producto, noticias, LinkedIn del entrevistador).",
      "Prepara 3 preguntas: éxito a 90 días, prioridades del equipo, cómo se mide el rol.",
      "Evita preguntas de solo salario/beneficios en primera ronda (déjalo para después o HR).",
      "Haz 1 pregunta ligada a algo que dijeron en la entrevista (escucha activa).",
      "Anota respuestas: alimentan tu plan 30-60-90 si entras.",
    ],
    tips: [
      "Preguntar '¿qué hace exitosa a alguien aquí?' es oro.",
      "No preguntes lo que está en la web en 10 segundos.",
      "Deja 1 pregunta de cultura (decisiones, feedback) para evaluar fit.",
    ],
    example:
      "Camila, en Quito, preguntó: '¿Cómo se ve el éxito de este Analyst a los 90 días?' El hiring manager habló de un dashboard semanal al COMEX. Ella luego alineó su caso y su plan 30-60-90 a eso.",
    template:
      "Q1 éxito 90 días: [ ]. Q2 prioridades equipo: [ ]. Q3 medición del rol: [ ]. Q bonus basada en lo dicho: [ ]. Notas de respuestas: [ ].",
  },
  "OUT-07-d4": {
    why: "Ancla salarial (piso, meta, techo) con datos evita congelarte o aceptar bajo. Negociar sin ancla es jugar a la defensiva.",
    howTo: [
      "Recupera banda del módulo de mercado (piso/meta/techo).",
      "Practica decir la banda en voz alta: 'Basado en mercado para [rol/ciudad], manejo [meta], flexible según alcance y beneficios'.",
      "Define qué beneficios pueden compensar (remoto, bono, equipo, estudio).",
      "Si piden expectativa temprano, da rango anclado, no un número único si puedes.",
      "Nunca inventes otra oferta; sí puedes citar bandas públicas.",
    ],
    tips: [
      "Quien da el primer número puede anclar; prepárate de todos modos.",
      "Convierte moneda si es remoto US/EU (bruto vs neto, impuestos).",
      "Escribe tu guion; el nerviosismo borra cifras.",
    ],
    example:
      "Diego, en Bogotá, ancla: piso 7 M, meta 8.5 M, techo 10 M COP para Coordinador de Proyectos. En HR dijo: 'Mercado local está 7.5–9.5; busco 8.5 según alcance.' Quedó en 8.2 + bono.",
    template:
      "Piso: [ ]. Meta: [ ]. Techo: [ ]. Fuentes: [ ]. Guion verbal (20s): [ ]. Beneficios que compensan: [ ].",
  },
  "OUT-07-d5": {
    why: "Un simulacro por voz reduce ansiedad y errores de ritmo. El feedback externo detecta muletillas que tú no oyes.",
    howTo: [
      "Agenda 30–40 min con un peer o usa la herramienta de entrevista mock/filtro predictivo del producto.",
      "Simula 5 preguntas: cuéntame de ti, despido, STAR logro, debilidad, preguntas al entrevistador.",
      "Graba la sesión si es posible.",
      "Pide feedback en: claridad, estructura STAR, tono, duración.",
      "Corrige 2 hábitos máximo (ej. muletillas + finales débiles) y repite 1 ronda corta.",
    ],
    tips: [
      "Trata el mock como real: cámara, silencio, sin notas a full screen.",
      "Pide feedback duro; el halago no mejora oferta.",
      "Haz mock 24–48h antes de entrevistas importantes, no solo meses antes.",
    ],
    example:
      "Andrea, en Ciudad de México, hizo mock por voz: descubrió que hablaba 4 minutos en 'cuéntame de ti'. Lo bajó a 90s con pitch + 1 STAR. En la entrevista real el recruiter notó concisión.",
    template:
      "Fecha mock: [ ]. Preguntas: [ ]. Feedback recibido: [ ]. 2 hábitos a corregir: 1)[ ] 2)[ ]. Re-mock: [fecha].",
  },
  "OUT-07-d6": {
    why: "Los case studies se ganan estructurando: problema → opciones → recomendación. Improvisar caos muestra pánico, no criterio.",
    howTo: [
      "Cuando recibas el caso, restatea el problema y confirma objetivos/métricas.",
      "Lista supuestos en voz alta; pide datos faltantes.",
      "Genera 2–3 opciones con pros/contras.",
      "Elige 1 recomendación + plan de implementación + riesgos.",
      "Cierra con cómo medirías éxito en 30/90 días.",
    ],
    tips: [
      "Piensa en voz alta de forma ordenada; el proceso cuenta tanto como la respuesta.",
      "Si es take-home, respeta límite de tiempo y formato pedido.",
      "Lleva un template mental incluso a casos de Excel/SQL.",
    ],
    example:
      "Martín, en Santiago, en un case de churn: restató KPI, asumió segmento SMB, propuso 3 levers (onboarding, pricing, soporte), eligió onboarding con experimento A/B. El panel valoró la estructura más que el número final.",
    template:
      "Problema restated: [ ]. Supuestos: [ ]. Opciones: 1)[ ] 2)[ ] 3)[ ]. Recomendación: [ ]. Métrica de éxito: [ ]. Riesgos: [ ].",
  },
  "OUT-07-d7": {
    why: "Cerrar la entrevista resumiendo fit en 20s y confirmando próximos pasos deja imagen de ownership. Desaparecer pierde momentum.",
    howTo: [
      "Prepara un cierre: 'Veo fit porque [2 puntos]; me entusiasma [1 prioridad que mencionaron].'",
      "Pregunta explícitamente: próximos pasos, timelines, quién decide.",
      "Agradece por nombre y menciona 1 detalle de la conversación.",
      "Envía thank-you note en 24h (LinkedIn o mail) con 3–4 líneas.",
      "Registra en CRM la fecha de follow-up si no hay respuesta.",
    ],
    tips: [
      "No negocies salario en el cierre de primera ronda salvo que abran el tema.",
      "El thank-you no es ensayo; es refuerzo de fit + gratitud.",
      "Si hay tarea pendiente, confirma deadline en el cierre.",
    ],
    example:
      "Sofía, en Bogotá, cerró: 'Encajo por mi experiencia en QBR y baja de churn; me late el foco en SMB que comentaste. ¿Cuáles serían los siguientes pasos y fechas?' Luego mandó nota citando el KPI de 90 días. La avanzaron a final.",
    template:
      "Cierre 20s: fit=[ ] + entusiasmo=[ ]. Pregunta de proceso: [ ]. Thank-you (24h): [borrador]. Follow-up si silencio: [fecha].",
  },

  "OUT-08-d1": {
    why: "Evaluar total compensation, aprendizaje, cultura y modalidad evita decidir solo por salario base. Una oferta 'alta' puede ser mala en costos ocultos.",
    howTo: [
      "Arma tabla: salario base, bono, beneficios, equipo/internet, transporte, aprendizaje, modalidad, trayectoria.",
      "Convierte todo a valor mensual estimado (honesto).",
      "Puntúa 1–5 cultura/aprendizaje según lo oído en entrevistas.",
      "Compara vs tu piso/meta y vs costos de vida de tu ciudad.",
      "Decide: aceptar / negociar / declinar con razones escritas.",
    ],
    tips: [
      "Remoto full puede valer más que +10% presencial con 2h de commute.",
      "Pregunta periodicidad del bono y % histórico real.",
      "Habla con un empleado actual si puedes (Glassdoor + red).",
    ],
    example:
      "Elena, en Medellín, comparó Offer A 8 M presencial vs B 7.2 M híbrido 2 días + bono. Con transporte y tiempo, B ganó. Negoció base a 7.6 M y aceptó.",
    template:
      "Base: [ ]. Bono: [ ]. Beneficios: [ ]. Modalidad: [ ]. Aprendizaje/cultura (1–5): [ ]. Total mensual estimado: [ ]. vs piso/meta: [ ]. Decisión: [ ].",
  },
  "OUT-08-d2": {
    why: "Una contraoferta educada con evidencia de mercado y valor aumenta compensación sin quemar la relación. El ultimátum agresivo cierra puertas.",
    howTo: [
      "Agradece la oferta por escrito y pide 24–48h si necesitas.",
      "Prepara contraoferta: cifra meta + 2 evidencias (banda mercado + impacto que traes).",
      "Ofrece flexibilidad (base vs bono vs firma vs review a 6 meses).",
      "Envía mensaje corto y profesional; propone llamada si prefieren.",
      "Acepta el resultado final con gracia; confirma por escrito lo acordado.",
    ],
    tips: [
      "Negocia después de la oferta verbal/escrita, no en la primera entrevista.",
      "Un solo paquete coherente; no pidas 10 cosas a la vez.",
      "Si dicen no al dinero, pide review salarial a 6 meses por escrito.",
    ],
    example:
      "Jorge, en Ciudad de México, respondió: 'Gracias por 45k MXN. Para el alcance (3 países) y bandas de CS Mid, ¿podemos mirar 50k o 48k + bono? Traigo churn -4 pts en mi último rol.' Cerraron en 48k + bono trimestral.",
    template:
      "Agradecimiento: [ ]. Pedido: [cifra/paquete]. Evidencia mercado: [ ]. Evidencia valor: [ ]. Alternativas: [ ]. Confirmación escrita: [ ].",
  },
  "OUT-08-d3": {
    why: "Un plan 30-60-90 comunica expectativas y reduce la ansiedad de los primeros meses. Compartirlo con tu jefe alinea éxito temprano.",
    howTo: [
      "30 días: aprender (sistemas, stakeholders, métricas) + 1 quick diagnosis.",
      "60 días: aportar (mejoras pequeñas, ownership de 1 proceso).",
      "90 días: liderar (propuesta de impacto con métrica).",
      "Escríbelo en 1 página y compártelo en la primera semana.",
      "Pide feedback: '¿Esto refleja tus prioridades?' y ajusta.",
    ],
    tips: [
      "Basate en lo que dijeron en entrevista sobre éxito a 90 días.",
      "Sé ambicioso pero realista; no prometas transformar la empresa en 30 días.",
      "Usa el plan en tu reunión de feedback del día 30.",
    ],
    example:
      "Natalia, en Lima, llevó un 30-60-90 a su jefe de ops: día 30 mapear SLA; día 60 reducir retrasos en 1 ruta; día 90 proponer tablero semanal. El jefe lo adoptó como acuerdo de onboarding.",
    template:
      "30: aprender [ ] + diagnóstico [ ]. 60: aportar [ ] métrica [ ]. 90: liderar [ ] métrica [ ]. Fecha para compartir con jefe: [ ].",
  },
  "OUT-08-d4": {
    why: "Al aceptar, pausar el outplacement y activar modo 90 días protege foco. Seguir spammeando CVs diluye energía del onboarding.",
    howTo: [
      "Firma/acepta por escrito y celebra 1 ritual breve de cierre de búsqueda.",
      "Pausa postulaciones activas; responde educadamente a procesos en curso (retirarte o pausar).",
      "Archiva materiales de búsqueda en una carpeta 'referencia' (CV, CRM).",
      "Activa checklist de onboarding: docs, equipos, accesos, primeras reuniones.",
      "Define 3 prioridades personales para la semana 1 en el nuevo rol.",
    ],
    tips: [
      "No borres LinkedIn ni tu CRM; solo cambia el modo a 'emplead@ en onboarding'.",
      "Mantén la red tibia con un post de agradecimiento discreto si aplica.",
      "Si la oferta cae (raro pero pasa), retomas el CRM en 48h.",
    ],
    example:
      "Hugo, en Cali, aceptó el lunes, escribió a 2 procesos activos retirándose con gratitud, y el martes ya tenía agenda de shadowing con su buddy. Dejó de aplicar 'por si acaso'.",
    template:
      "Fecha aceptación: [ ]. Procesos a cerrar: [ ]. Carpeta archivo: [ ]. Modo 90 días ON: [sí]. Prioridades semana 1: 1)[ ] 2)[ ] 3)[ ].",
  },
  "OUT-08-d5": {
    why: "Identificar buddy, peer y stakeholder acelera onboarding. Sin aliados, aprendes solo y cometes errores políticos evitables.",
    howTo: [
      "En la semana 1, identifica: buddy (día a día), peer (mismo nivel), stakeholder (quien consume tu trabajo).",
      "Agenda cafés de 20 min con cada uno: '¿cómo se gana aquí? ¿qué evitar?'",
      "Pregunta por documentos, canales Slack/Teams y ritos del equipo.",
      "Ofrece ayuda temprana en algo pequeño para construir crédito.",
      "Anota nombres y roles en tu libreta de onboarding.",
    ],
    tips: [
      "No te cases con la primera versión de la política interna; valida con 2 fuentes.",
      "Admin/ops suelen ser aliados invisibles: trátarlos bien.",
      "Comparte tu plan 30-60-90 con el buddy para reality check.",
    ],
    example:
      "Paula, en Buenos Aires, en 10 días tenía buddy de IT, peer de analytics y stakeholder en Finanzas. El stakeholder le dijo qué reporte odiaban; ella lo mejoró como quick win.",
    template:
      "Buddy: [nombre/rol]. Peer: [ ]. Stakeholder: [ ]. Preguntas clave: [ ]. Próximos cafés: [fechas]. Insight político/cultural: [ ].",
  },
  "OUT-08-d6": {
    why: "Un quick win visible en 30 días construye reputación. Mejoras útiles y con permiso superan proyectos heroicos arriesgados.",
    howTo: [
      "Lista 5 dolores pequeños que oíste (reporte manual, doc faltante, reunión sin agenda).",
      "Elige 1 de bajo riesgo y alto uso; pide ok a tu jefe/buddy.",
      "Entrega en ≤2 semanas: doc, automatización simple, checklist, métrica limpia.",
      "Comunica el antes/después en 5 líneas al equipo.",
      "Registra el win para tu review de 30 días.",
    ],
    tips: [
      "Invisible no sirve: alguien debe usarlo.",
      "No reorganicés la empresa en el mes 1.",
      "Documenta para que no dependa de ti (handoff).",
    ],
    example:
      "Andrés, en Monterrey, creó un checklist de handoff de turnos que redujo 3 incidentes en dos semanas. Lo presentó en el stand-up; su manager lo citó en el all-hands de ops.",
    template:
      "Dolor: [ ]. Quick win: [ ]. Permiso de: [ ]. Entrega: [fecha]. Antes→después: [ ]. Quién lo usa: [ ].",
  },
  "OUT-08-d7": {
    why: "Agendar feedback a los 30 días con tu plan 30-60-90 reduce sorpresas en prueba. Pedir feedback temprano es señal de madurez, no de debilidad.",
    howTo: [
      "Agenda 30 min con tu jefe para el día ~30 (invita desde la semana 2).",
      "Envía agenda: avances vs plan, qué está funcionando, qué ajustar, prioridades 60.",
      "Lleva evidencia: quick win, métricas, aprendizajes.",
      "Pide feedback específico: '¿Qué debería hacer más/menos/empezar?'",
      "Cierra con acuerdos escritos (mail de resumen en 24h).",
    ],
    tips: [
      "No esperes al performance review formal si hay periodo de prueba.",
      "Si el feedback es duro, agradece y pide 1 ejemplo concreto + criterio de éxito.",
      "Actualiza tu plan 60-90 según lo acordado.",
    ],
    example:
      "Mariana, en Bogotá, a los 28 días revisó con su jefe el 30-60-90. Él pidió más visibilidad con Comercial; ella agregó un sync semanal. Pasó el periodo de prueba sin sorpresas.",
    template:
      "Fecha review 30d: [ ]. Avances: [ ]. Feedback más/menos/empezar: [ ]. Acuerdos: [ ]. Mail de resumen enviado: [sí]. Ajustes al plan 60-90: [ ].",
  },
};
