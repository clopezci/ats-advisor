import type { HowToStep } from "@/lib/courses/types";

export type LessonEnrichment = {
  why: string;
  howTo: HowToStep[]; // 4-6 steps with title + detail (2-5 sentences each, Spanish LATAM)
  tips: string[];
  example: string;
  template: string;
};

export function enrichmentKey(code: string, day: number) {
  return `${code}-d${day}`;
}

export const MODULE_LESSON_ENRICHMENTS: Record<string, LessonEnrichment> = {
  "OUT-01-d1": {
    why: "Nombrar la transición baja la carga emocional y te da un punto de partida concreto para la búsqueda. Sin hechos claros, la narrativa se vuelve defensiva o confusa.",
    howTo: [
      {
        title: "Abre el documento con tres encabezados",
        detail:
          "Crea una nota o documento y escribe solo tres bloques: Qué terminó, Qué conservo, Qué quiero atraer. Bien hecho se ve vacío al inicio, con títulos claros y sin párrafos largos. Error típico: mezclar los tres temas en un solo texto emocional.",
        minutes: 5,
      },
      {
        title: "Lista hechos de lo que terminó",
        detail:
          "Bajo Qué terminó anota cargo, empresa, fecha y tipo de salida (renuncia, fin de contrato, reestructuración). Bien hecho: frases cortas y verificables, sin culpas. Error típico: escribir 'me echaron porque no valgo' en lugar del hecho.",
        minutes: 8,
      },
      {
        title: "Anota lo que conservas",
        detail:
          "Bajo Qué conservo lista habilidades, relaciones y logros que siguen siendo tuyos aunque el cargo haya terminado. Bien hecho: 3–5 ítems concretos (herramienta, gente, resultado). Error típico: dejar el bloque vacío porque 'ya no soy de esa empresa'.",
        minutes: 8,
      },
      {
        title: "Define qué quieres atraer",
        detail:
          "Escribe 2–3 condiciones deseadas: rol, industria y modalidad (híbrido, remoto, presencial). Bien hecho: preferencias accionables, no una lista infinita. Error típico: poner 'cualquier cosa con buen sueldo' sin filtro.",
        minutes: 7,
      },
      {
        title: "Tacha juicios y reemplázalos",
        detail:
          "Relee el texto y tacha frases de juicio ('fracasé', 'inútil'); cámbialas por hechos u oportunidades. Bien hecho: tono neutro que podrías leerle a un mentor. Error típico: dejar el drama 'para ser honesto' y contaminar tu narrativa pública después.",
        minutes: 7,
      },
      {
        title: "Guarda el texto como base",
        detail:
          "Guarda el documento con fecha; será la materia prima de LinkedIn y entrevistas. Bien hecho: un archivo fácil de encontrar y actualizar. Error típico: borrarlo al sentirte mejor y volver a improvisar bajo presión.",
        minutes: 3,
      }
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
      {
        title: "Fija un bloque de 45 minutos",
        detail:
          "Elige un horario fijo (ej. 8:00–8:45) y márcalo en el calendario como no negociable. Bien hecho: aparece como cita recurrente, no como 'cuando pueda'. Error típico: dejarlo 'flexible' y que WhatsApp se lo coma.",
        minutes: 5,
      },
      {
        title: "Divide cuerpo, mente y búsqueda",
        detail:
          "Estructura: 10 min cuerpo (caminar/estirar), 10 min mente (respiración o journaling), 25 min búsqueda (CV, ofertas, outreach). Bien hecho: tres relojes claros y sin mezclar. Error típico: saltarte cuerpo/mente y solo scrollear ofertas agotado.",
        minutes: 5,
      },
      {
        title: "Prepara la noche anterior",
        detail:
          "Deja listos ropa de caminar, agua y una lista de 3 tareas de búsqueda. Bien hecho: al despertar solo ejecutas. Error típico: improvisar a las 8:00 y gastar 15 minutos decidiendo qué hacer.",
        minutes: 5,
      },
      {
        title: "Marca el tracker y cierra",
        detail:
          "Al terminar, marca un ✓ en un tracker semanal y cierra el bloque aunque 'hoy sí puedas seguir'. Bien hecho: racha visible y energía reservada. Error típico: alargar a 2 horas un día y colapsar al siguiente.",
        minutes: 3,
      },
      {
        title: "Si fallas, reinicia sin castigo",
        detail:
          "Si un día no cumples, retoma al siguiente sin discursos de culpa. Bien hecho: objetivo de racha, no de perfección. Error típico: abandonar la semana entera por un día perdido.",
        minutes: 2,
      }
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
      {
        title: "Escribe la fórmula X–Y–Z",
        detail:
          "Completa: 'Ayudo a [X] a lograr [Y] mediante [Z]'. Bien hecho: una frase que cabe en dos líneas de LinkedIn. Error típico: tres oraciones vagas en vez de una fórmula clara.",
        minutes: 5,
      },
      {
        title: "Elige un X concreto",
        detail:
          "Define quién es tu público (equipos de ventas B2B, pymes retail, clínicas privadas). Bien hecho: se puede señalar con el dedo a un tipo de cliente/empleador. Error típico: 'empresas que buscan excelencia'.",
        minutes: 5,
      },
      {
        title: "Define Y medible u observable",
        detail:
          "El resultado debe ser visible: reducir churn, acelerar cierre, mejorar NPS, acortar ciclo. Bien hecho: alguien de negocio entiende el impacto en 5 segundos. Error típico: Y = 'crecimiento' sin señal.",
        minutes: 5,
      },
      {
        title: "Define Z con verbos de acción",
        detail:
          "Describe el método: automatizando reportes, entrenando equipos, rediseñando procesos. Bien hecho: se entiende cómo lo logras. Error típico: Z = 'pasión y liderazgo' sin mecánica.",
        minutes: 5,
      },
      {
        title: "Prueba la frase en voz alta",
        detail:
          "Dila 3 veces; si suena genérica, estrecha X o Y. Bien hecho: te sientes cómodo y específico. Error típico: dejarla 'bonita' aunque nadie entienda qué haces.",
        minutes: 5,
      },
      {
        title: "Cópiala a LinkedIn y pitch",
        detail:
          "Pégala en las primeras 2 líneas del About y úsala como elevator pitch. Bien hecho: mismo mensaje en perfil y boca. Error típico: tener una frase en el doc y otra distinta en la red.",
        minutes: 5,
      }
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
      {
        title: "Lista 5 personas de confianza",
        detail:
          "Anota exjefe, colega, mentor, amigo del sector y reclutador conocido. Bien hecho: nombres reales con canal de contacto. Error típico: pensar 'no conozco a nadie' sin mirar WhatsApp y LinkedIn.",
        minutes: 8,
      },
      {
        title: "Define qué puede darte cada una",
        detail:
          "Por persona: feedback de CV, intro a 1 persona, revisión de pitch o dato de salario. Bien hecho: un pedido posible por fila. Error típico: pedir 'todo' a todos.",
        minutes: 7,
      },
      {
        title: "Redacta un mensaje de 4–5 líneas",
        detail:
          "Contexto breve + pedido concreto + fecha tentativa. Bien hecho: se responde en un minuto. Error típico: párrafo largo de trauma laboral sin pregunta clara.",
        minutes: 10,
      },
      {
        title: "Envía máximo 2 mensajes hoy",
        detail:
          "Manda 2 hoy y agenda el resto en los próximos 3 días. Bien hecho: ritmo sostenible y mensajes personalizados. Error típico: blast de 10 copy-paste el mismo día.",
        minutes: 15,
      },
      {
        title: "Anota respuesta y próximo paso",
        detail:
          "Registra qué contestaron y qué sigue (café, intro, silencio). Bien hecho: una hoja simple actualizada. Error típico: olvidar el follow-up porque 'ya hablamos'.",
        minutes: 5,
      }
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
      {
        title: "Escribe un guion de 4 frases",
        detail:
          "Qué pasó (hecho), qué aprendiste, qué ofreces ahora, qué buscas. Bien hecho: cabe en una tarjeta. Error típico: monólogo de 2 minutos solo sobre la salida.",
        minutes: 10,
      },
      {
        title: "Grábate 60 segundos",
        detail:
          "Usa el celular (voz; video opcional) y cronometra. Bien hecho: un take completo sin cortar a mitad. Error típico: grabar 3 minutos y decir 'ya está'.",
        minutes: 5,
      },
      {
        title: "Escucha buscando tono tóxico",
        detail:
          "Busca culpas, disculpas excesivas, jerga y ritmo atropellado. Bien hecho: lista de 2–3 ajustes concretos. Error típico: no escuchar el audio por vergüenza.",
        minutes: 5,
      },
      {
        title: "Reescribe y vuelve a grabar",
        detail:
          "Ajusta 1–2 frases a tono seguro y claro; graba de nuevo. Bien hecho: se oye calma y futuro. Error típico: cambiar todo el guion en cada take.",
        minutes: 10,
      },
      {
        title: "Practica la mejor versión sin leer",
        detail:
          "Guarda el mejor take y repítelo 3 veces de memoria. Bien hecho: fluye sin papel. Error típico: memorizar palabra por palabra y trabarte si olvidas una.",
        minutes: 10,
      }
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
      {
        title: "Elige 2 horas de búsqueda profunda",
        detail:
          "Bloque diario con celular en otra habitación o modo avión. Bien hecho: entorno sin notificaciones. Error típico: 'profundidad' con Instagram abierto al lado.",
        minutes: 5,
      },
      {
        title: "Define 3 tareas máximas",
        detail:
          "Ej.: 2 outreach, 1 ajuste de CV, 1 oferta analizada. Bien hecho: lista cerrada antes de empezar. Error típico: 12 tareas y cero terminadas.",
        minutes: 5,
      },
      {
        title: "Fija sueño y desayuno",
        detail:
          "Anota hora de dormir y de desayuno como compromisos de la semana. Bien hecho: horarios realistas que puedes sostener. Error típico: buscar hasta las 2am y 'compensar' con café.",
        minutes: 5,
      },
      {
        title: "Bloquea redes fuera del bloque",
        detail:
          "Incluye LinkedIn fuera de las 2 horas profundas. Bien hecho: apps limitadas o silenciadas. Error típico: 'solo miro un post' y pierdes 40 minutos.",
        minutes: 5,
      },
      {
        title: "Revisa cumplimiento al final del día",
        detail:
          "Pregúntate: ¿cumplí sueño + foco? Ajusta mañana si fallaste. Bien hecho: 2 checks diarios, sin drama. Error típico: no medir y creer que 'estuve busy'.",
        minutes: 5,
      }
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
      {
        title: "Extrae una línea de identidad",
        detail:
          "Reúne X–Y–Z y el audio de 60s; saca una línea de máximo 20 palabras. Bien hecho: cabe en un post-it. Error típico: un párrafo disfrazado de frase.",
        minutes: 10,
      },
      {
        title: "Usa el formato rol–resultado–quién",
        detail:
          "Formato: '[Rol/identidad] que [resultado] para [quién]'. Bien hecho: suena a profesional activo, no a víctima del despido. Error típico: empezar con 'ex-empleado de…'.",
        minutes: 5,
      },
      {
        title: "Pégala en escritorio y About",
        detail:
          "Post-it visible + primera línea del About de LinkedIn. Bien hecho: la ves cada mañana. Error típico: dejarla solo en un doc que no abres.",
        minutes: 5,
      },
      {
        title: "Léela cada mañana de la semana",
        detail:
          "Antes de buscar, dilá en voz alta. Bien hecho: ancla el día en identidad, no en miedo. Error típico: saltártelo 'porque ya me la sé'.",
        minutes: 3,
      },
      {
        title: "Ajusta una palabra, no toda la frase",
        detail:
          "Si al día 3 no te identifica, cambia rol o resultado; no reescribas todo. Bien hecho: iteración mínima. Error típico: reinventar la identidad cada mañana.",
        minutes: 5,
      }
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
      {
        title: "Lista 8 logros recientes",
        detail:
          "Proyectos, mejoras y crisis resueltas de los últimos 5–7 años. Bien hecho: títulos concretos, no 'trabajé mucho'. Error típico: listar responsabilidades diarias como logros.",
        minutes: 15,
      },
      {
        title: "Agrega métrica a cada logro",
        detail:
          "%, $, tiempo, personas, tickets, NPS o alcance ('equipo de 8'). Bien hecho: cada línea tiene un número o rango. Error típico: dejar 'mejoré el proceso' sin magnitud.",
        minutes: 15,
      },
      {
        title: "Estima con rango si falta cifra exacta",
        detail:
          "Usa rangos honestos ('~20% menos tiempo de cierre') cuando no tengas el número fino. Bien hecho: estimaciones defendibles. Error típico: inventar 47.3% sin base.",
        minutes: 8,
      },
      {
        title: "Escribe verbo + acción + métrica",
        detail:
          "Una línea por logro con contexto. Bien hecho: se puede pegar en el CV tal cual. Error típico: oraciones de 4 líneas con jerga interna.",
        minutes: 10,
      },
      {
        title: "Marca los 4 más relevantes al rol",
        detail:
          "Elige los que mejor conectan con el cargo que buscas. Bien hecho: foco claro para pitch y CV. Error típico: querer usar los 8 en todas partes.",
        minutes: 5,
      }
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
      {
        title: "Separa hard y soft en dos columnas",
        detail:
          "Técnicas (herramientas, métodos) vs blandas (liderazgo, comunicación, negociación). Bien hecho: lista limpia sin mezclar. Error típico: meter 'Excel' y 'proactivo' en el mismo saco sin criterio.",
        minutes: 5,
      },
      {
        title: "Vacía 12–15 skills reales",
        detail:
          "Solo experiencia real, no deseos de LinkedIn. Bien hecho: podrías contar un ejemplo por skill. Error típico: copiar la lista de una oferta soñada.",
        minutes: 10,
      },
      {
        title: "Cruza con 2–3 ofertas target",
        detail:
          "Marca qué skills aparecen en requisitos. Bien hecho: overlap visible. Error típico: priorizar lo que te gusta aunque el mercado no lo pida.",
        minutes: 15,
      },
      {
        title: "Elige las 5 más vendibles",
        detail:
          "Aparecen en ofertas y tienes evidencia. Bien hecho: top 5 corto y defendible. Error típico: top 15 'por si acaso'.",
        minutes: 8,
      },
      {
        title: "Ata cada skill a un logro",
        detail:
          "Junto a cada una anota el logro del inventario que la prueba. Bien hecho: skill ≠ adjetivo suelto. Error típico: soft skills sin ejemplo observable.",
        minutes: 10,
      }
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
      {
        title: "Dibuja cuatro cuadrantes FODA",
        detail:
          "Fortalezas, Oportunidades, Debilidades, Amenazas en una hoja. Bien hecho: espacio suficiente para 3 ítems por caja. Error típico: hacer un ensayo de 3 páginas.",
        minutes: 5,
      },
      {
        title: "Llena fortalezas con skills y logros",
        detail:
          "3 ítems de tu top skills + logros medibles. Bien hecho: evidencia, no autoelogio. Error típico: 'soy trabajador' sin prueba.",
        minutes: 8,
      },
      {
        title: "Lista oportunidades de mercado local",
        detail:
          "Sectores o modalidades en alza en tu país (remoto, nearshore, fintech, salud). Bien hecho: basado en ofertas reales. Error típico: oportunidades sacadas de rumores de Twitter.",
        minutes: 10,
      },
      {
        title: "Nombra debilidades cerrables",
        detail:
          "Gaps honestos: idioma, herramienta, certificación, red. Bien hecho: gap ≠ defecto moral. Error típico: esconder el gap y que te lo descubran en entrevista.",
        minutes: 8,
      },
      {
        title: "Identifica amenazas del sector",
        detail:
          "Competencia, recortes, requisitos de título o inglés. Bien hecho: 2–3 amenazas concretas. Error típico: catastrofismo ('nadie contrata') sin datos.",
        minutes: 8,
      },
      {
        title: "Define 1 acción por cuadrante",
        detail:
          "Una línea por ítem y una acción a 30 días por cuadrante. Bien hecho: plan mínimo ejecutable. Error típico: FODA decorativo sin siguiente paso.",
        minutes: 10,
      }
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
      {
        title: "Elige logro y sector destino",
        detail:
          "Toma un logro de tu sector actual y nombra la industria a la que pivoteas. Bien hecho: par origen→destino explícito. Error típico: querer 'cambiar de industria' sin ejemplo concreto.",
        minutes: 5,
      },
      {
        title: "Nombra la skill subyacente",
        detail:
          "Control, precisión, reporting, negociación, SLA, etc. Bien hecho: skill transferible clara. Error típico: quedarte en jerga solo del sector viejo.",
        minutes: 5,
      },
      {
        title: "Reescribe con vocabulario destino",
        detail:
          "Usa keywords de ofertas reales del sector nuevo. Bien hecho: un reclutador del destino entiende el impacto. Error típico: inventar jerga que no aparece en ofertas.",
        minutes: 12,
      },
      {
        title: "Repite con 3 logros más",
        detail:
          "Misma traducción en tres logros adicionales. Bien hecho: portafolio de puente, no un solo ejemplo. Error típico: un logro traducido y el resto intacto en CV.",
        minutes: 15,
      },
      {
        title: "Arma la frase puente",
        detail:
          "'En [sector A] hice X; eso se traduce a [sector B] como Y.' Bien hecho: 1–2 oraciones listas para entrevista. Error típico: negar el pasado en vez de traducirlo.",
        minutes: 8,
      }
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
      {
        title: "Crea tabla Skill | Evidencia | Dónde",
        detail:
          "Para tus 5 skills top: evidencia y si vive en CV, LinkedIn o portafolio. Bien hecho: ninguna fila vacía. Error típico: skills en lista sin columna de prueba.",
        minutes: 10,
      },
      {
        title: "Escribe 1 prueba concreta por skill",
        detail:
          "Proyecto, KPI, curso con entregable. Bien hecho: observable en 20 segundos. Error típico: 'años de experiencia' como única evidencia.",
        minutes: 10,
      },
      {
        title: "Define mini-proyecto si falta evidencia",
        detail:
          "Plan de 3–5 días para crear la prueba faltante. Bien hecho: alcance chico y fecha. Error típico: prometer un portafolio enorme que nunca empiezas.",
        minutes: 10,
      },
      {
        title: "Mete la evidencia en el bullet del CV",
        detail:
          "No solo en la lista de skills: el logro lleva el número. Bien hecho: skill + contexto juntos. Error típico: skills decorativas arriba y bullets genéricos abajo.",
        minutes: 10,
      },
      {
        title: "Prepara frase oral de 20s por skill",
        detail:
          "Lista para entrevista sin leer. Bien hecho: mismo mensaje que el CV. Error típico: no poder explicar la skill que listaste.",
        minutes: 10,
      }
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
      {
        title: "Estructura el párrafo de valor",
        detail:
          "Quién eres + 2 logros con métrica + skills top + qué buscas. Bien hecho: mapa mental claro antes de escribir. Error típico: biografía desde la universidad.",
        minutes: 8,
      },
      {
        title: "Borrador libre y luego recorta a ~80",
        detail:
          "Escribe ~120 palabras y corta a ~80. Bien hecho: denso y respirable. Error típico: enamorte del primer draft largo.",
        minutes: 15,
      },
      {
        title: "Elimina adjetivos vacíos",
        detail:
          "Deja verbos y números; saca 'apasionado/dinamico/proactivo'. Bien hecho: cada frase aporta dato. Error típico: relleno motivacional.",
        minutes: 8,
      },
      {
        title: "Alinea al rol primario",
        detail:
          "Una industria/foco por párrafo, no 'abierto a todo'. Bien hecho: match con el rol elegido. Error típico: tres industrias distintas en 80 palabras.",
        minutes: 5,
      },
      {
        title: "Pégalo en CV y About",
        detail:
          "Resumen del CV + primeras líneas del About. Bien hecho: consistencia canal a canal. Error típico: textos distintos que se contradicen.",
        minutes: 5,
      }
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
      {
        title: "Elige un revisor de mercado",
        detail:
          "Colega o mentor que conozca el mercado; no solo un amigo cercano. Bien hecho: feedback útil, no solo ánimo. Error típico: pedir review solo a quien te va a decir que está perfecto.",
        minutes: 5,
      },
      {
        title: "Envía párrafo + 3 bullets con pregunta clara",
        detail:
          "Pregunta: '¿Me contratarías para [rol]? ¿Qué falta?' Bien hecho: pedido de 15 min con link al doc. Error típico: 'mira esto cuando puedas' sin rol ni plazo.",
        minutes: 10,
      },
      {
        title: "Pide feedback en 3 ejes",
        detail:
          "Claridad, credibilidad, relevancia al rol. Bien hecho: comentarios accionables. Error típico: discutir tipografía y colores.",
        minutes: 15,
      },
      {
        title: "Ajusta solo lo accionable",
        detail:
          "Cambia lo que se repite o es concreto; ignora gustos de estilo. Bien hecho: versión 2 más clara. Error típico: reescribir todo por un comentario de tono.",
        minutes: 15,
      },
      {
        title: "Confirma la versión 2 en 48 horas",
        detail:
          "Vuelve con la misma persona para cerrar. Bien hecho: loop corto. Error típico: nunca reenviar y quedar con dudas.",
        minutes: 10,
      }
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
      {
        title: "Busca títulos reales en portales locales",
        detail:
          "LinkedIn, Computrabajo, Eleempleo u equivalentes de tu país. Bien hecho: títulos que existen en ≥3 ofertas. Error típico: inventar un cargo 'cool' que nadie publica.",
        minutes: 15,
      },
      {
        title: "Copia 3 títulos exactos",
        detail:
          "Ej. Analista de datos, Business Analyst, Coordinador de BI. Bien hecho: wording del empleador. Error típico: sinónimos inventados que el ATS no reconoce.",
        minutes: 10,
      },
      {
        title: "Pega 5 requisitos comunes por rol",
        detail:
          "Hoja con requisitos repetidos. Bien hecho: patrón visible. Error típico: mirar una sola oferta 'ideal'.",
        minutes: 20,
      },
      {
        title: "Marca overlap vs gap",
        detail:
          "Qué ya tienes vs qué falta. Bien hecho: mapa honesto. Error típico: forzar fit en roles glamurosos sin overlap.",
        minutes: 10,
      },
      {
        title: "Descarta títulos que no existen localmente",
        detail:
          "Si no hay demanda en tu mercado, aparca ese título. Bien hecho: foco regional. Error típico: obsesionarte con títulos de Silicon Valley sin vacantes locales.",
        minutes: 5,
      }
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
      {
        title: "Revisa bandas salariales locales",
        detail:
          "Computrabajo, Eleempleo, Glassdoor, niveles y posts de reclutadores. Bien hecho: 2+ fuentes por cifra. Error típico: un solo post viral como 'la verdad'.",
        minutes: 20,
      },
      {
        title: "Anota rango P25–P75",
        detail:
          "Para tu rol y ciudad (o remoto LATAM). Bien hecho: rango escrito, no sensación. Error típico: anclarte al techo extremo.",
        minutes: 10,
      },
      {
        title: "Calcula piso de supervivencia",
        detail:
          "Costos fijos mensuales + colchón 10–15%. Bien hecho: número realista de tu vida. Error típico: ignorar costos y aceptar cualquier oferta.",
        minutes: 15,
      },
      {
        title: "Define piso, meta y techo",
        detail:
          "Mínimo aceptable, mercado medio y stretch con evidencia. Bien hecho: tres anclas claras. Error típico: un solo número rígido sin flexibilidad de beneficios.",
        minutes: 10,
      },
      {
        title: "Documenta 2 fuentes por cifra",
        detail:
          "Para usarlas en negociación sin inventar. Bien hecho: links o capturas guardadas. Error típico: decir 'según el mercado' sin poder citar.",
        minutes: 10,
      }
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
      {
        title: "Compara skills vs 3 roles target",
        detail:
          "Cruza tu mapa con requisitos reales. Bien hecho: lista de gaps explícita. Error típico: asumir que 'casi calzas' sin comparar.",
        minutes: 15,
      },
      {
        title: "Clasifica gaps 30 / 90 / no prioritario",
        detail:
          "Cerrable en 30 días, 90 días o aparcado. Bien hecho: prioridades claras. Error típico: tratar un MBA como gap de 30 días.",
        minutes: 10,
      },
      {
        title: "Elige solo 2 gaps a 30 días",
        detail:
          "Curso + práctica, no un stack infinito. Bien hecho: dos frentes sostenibles. Error típico: atacar 10 gaps y no cerrar ninguno.",
        minutes: 5,
      },
      {
        title: "Define evidencia de cierre",
        detail:
          "Mini-proyecto, certificación corta o portfolio piece. Bien hecho: criterio done observable. Error típico: 'ver videos' como cierre del gap.",
        minutes: 8,
      },
      {
        title: "Agenda bloques diarios de 25–45 min",
        detail:
          "Solo para esos 2 gaps. Bien hecho: horario fijo en calendario. Error típico: 'estudio cuando sobra tiempo'.",
        minutes: 10,
      }
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
      {
        title: "Abre 10 ofertas del rol target",
        detail:
          "Mismo país/modalidad. Bien hecho: muestra comparable. Error típico: mezclar junior remoto US con senior presencial local.",
        minutes: 15,
      },
      {
        title: "Copia requisitos y responsabilidades",
        detail:
          "Todo a un doc para contar frecuencia. Bien hecho: texto crudo, no resumen mental. Error típico: 'me acuerdo de lo que pedían'.",
        minutes: 15,
      },
      {
        title: "Cuenta frecuencia de términos",
        detail:
          "Excel, SAP, Scrum, stakeholders, OKR, etc. Bien hecho: top ordenado por conteo. Error típico: keywords que te gustan aunque salgan 1 vez.",
        minutes: 15,
      },
      {
        title: "Arma top 10 keywords",
        detail:
          "Por frecuencia real. Bien hecho: lista corta accionable. Error típico: top 40 imposible de integrar.",
        minutes: 5,
      },
      {
        title: "Marca presentes vs faltantes honestas",
        detail:
          "Cuáles ya están en tu CV con evidencia y cuáles faltan. Bien hecho: plan de integración sin mentir. Error típico: meter keywords inventadas.",
        minutes: 10,
      }
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
      {
        title: "Mapea canales por rol target",
        detail:
          "LinkedIn, bolsas locales, consultoras, referidos, grupos del sector. Bien hecho: mapa por rol, no genérico. Error típico: solo un portal 'porque siempre lo usé'.",
        minutes: 15,
      },
      {
        title: "Estima % de tiempo semanal por canal",
        detail:
          "Ej. 40% referidos, 30% LinkedIn, 20% bolsas, 10% consultoras. Bien hecho: mix escrito. Error típico: 100% Easy Apply.",
        minutes: 8,
      },
      {
        title: "Identifica 2 hunters o consultoras",
        detail:
          "Activos en tu nicho. Bien hecho: nombres y LinkedIn. Error típico: esperar que ellos te encuentren sin contacto.",
        minutes: 15,
      },
      {
        title: "Únete a 1 comunidad relevante",
        detail:
          "Slack, Discord, Meetup o cámara. Bien hecho: comunidad con diálogo real. Error típico: unirte a 10 grupos zombi.",
        minutes: 15,
      },
      {
        title: "Mide respuestas una semana",
        detail:
          "Prueba el mix y anota respuestas por canal. Bien hecho: datos para reasignar tiempo. Error típico: insistir en un canal con 0/15 respuestas.",
        minutes: 10,
      }
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
      {
        title: "Divide la semana en 3 frentes",
        detail:
          "Aprendizaje (gaps), networking y postulaciones de calidad. Bien hecho: tres buckets visibles. Error típico: solo postulaciones masivas.",
        minutes: 8,
      },
      {
        title: "Asigna cupos realistas diarios",
        detail:
          "Ej. 1h aprendizaje, 3 outreach, 2 postulaciones tailor-made. Bien hecho: números que caben en tu día. Error típico: cupos heroicos que abandonas el martes.",
        minutes: 10,
      },
      {
        title: "Bloquea cupos en el calendario",
        detail:
          "Trátalos como reuniones con alarma. Bien hecho: tiempo protegido. Error típico: lista de tareas sin horario.",
        minutes: 10,
      },
      {
        title: "Define postulación de calidad",
        detail:
          "CV ajustado + keywords + nota. Bien hecho: criterio binario sí/no. Error típico: contar spam Easy Apply como 'actividad'.",
        minutes: 5,
      },
      {
        title: "Revisa el domingo y ajusta ±20%",
        detail:
          "Cumplimiento semanal; no abandones el plan. Bien hecho: iteración ligera. Error típico: tirar el sistema por una semana floja.",
        minutes: 15,
      }
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
      {
        title: "Revisa roles, bandas, gaps y keywords",
        detail:
          "Síntesis de lo trabajado en el módulo. Bien hecho: datos juntos en una hoja. Error típico: decidir por feeling sin mirar demanda.",
        minutes: 15,
      },
      {
        title: "Elige 1 primario y 1 secundario",
        detail:
          "Primario = mejor fit + demanda; secundario = backup cercano. Bien hecho: decisión escrita. Error típico: tres primarios 'por si acaso'.",
        minutes: 10,
      },
      {
        title: "Aparca el tercero 30 días",
        detail:
          "No lo borres; archívalo con fecha. Bien hecho: foco sin culpa. Error típico: seguir aplicando a los tres y diluir el CV.",
        minutes: 5,
      },
      {
        title: "Ajusta headline, About y CV al primario",
        detail:
          "Guarda una variante para el secundario. Bien hecho: assets alineados. Error típico: un CV genérico para todo.",
        minutes: 20,
      },
      {
        title: "Compromete reevaluación a +30 días",
        detail:
          "Fecha escrita para revisar la decisión. Bien hecho: compromiso temporal. Error típico: cambiar de rol target cada semana.",
        minutes: 5,
      }
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
      {
        title: "Elige 1 skill prioritaria absoluta",
        detail:
          "De los 2 gaps de mercado, uno solo este mes. Bien hecho: decisión explícita. Error típico: 'SQL + Python + Tableau' a la vez.",
        minutes: 10,
      },
      {
        title: "Define resultado observable a 30 días",
        detail:
          "Ej. 'consultar JOINs y explicarlos en entrevista'. Bien hecho: se puede demostrar. Error típico: 'aprender SQL' sin criterio de done.",
        minutes: 8,
      },
      {
        title: "Escribe qué NO estudiarás este mes",
        detail:
          "Lista de tentaciones fuera de foco. Bien hecho: fronteras claras. Error típico: abrir un curso nuevo cada vez que hay ansiedad.",
        minutes: 5,
      },
      {
        title: "Alinea skill a rol y top 10 keywords",
        detail:
          "Debe aparecer en ofertas del primario. Bien hecho: upskilling vendible. Error típico: skill interesante que nadie pide.",
        minutes: 8,
      },
      {
        title: "Cuéntaselo a un accountability partner",
        detail:
          "Una persona que te pregunte en 7 días. Bien hecho: compromiso social ligero. Error típico: plan solo en la cabeza.",
        minutes: 5,
      }
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
      {
        title: "Busca 2–3 recursos low-cost",
        detail:
          "Coursera audit, YouTube curricula, freeCodeCamp, SENA, docs oficiales. Bien hecho: opciones concretas con link. Error típico: comprar el curso caro por impulso.",
        minutes: 15,
      },
      {
        title: "Elige 1 con ejercicios prácticos",
        detail:
          "Prioriza práctica sobre solo videos. Bien hecho: hay tareas, no solo play. Error típico: playlist infinita sin ejercicios.",
        minutes: 5,
      },
      {
        title: "Agenda 25 min diarios fijos",
        detail:
          "Mismo horario que tu rutina o justo después. Bien hecho: hábito anclado. Error típico: 'estudio cuando termine todo lo demás'.",
        minutes: 5,
      },
      {
        title: "Define módulos exactos de la semana 1",
        detail:
          "Lecciones concretas, no 'avanzar SQL'. Bien hecho: checklist semanal. Error típico: abrir el curso sin saber qué módulo toca hoy.",
        minutes: 8,
      },
      {
        title: "Anota 1 hallazgo aplicable al proyecto",
        detail:
          "Al terminar cada bloque, una nota útil. Bien hecho: puente estudio→entregable. Error típico: cerrar la laptop sin capturar nada.",
        minutes: 5,
      }
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
      {
        title: "Define entregable de 5–8 horas",
        detail:
          "Dashboard, script, playbook o caso acotado. Bien hecho: cabe en una semana intensa. Error típico: proyecto de tesis disfrazado.",
        minutes: 10,
      },
      {
        title: "Usa datos públicos o caso anónimo",
        detail:
          "Sin violar NDA. Bien hecho: dataset usable hoy. Error típico: bloquearte esperando datos 'perfectos' de tu exempresa.",
        minutes: 10,
      },
      {
        title: "Escribe criterio de terminado",
        detail:
          "Qué se ve, qué se puede clicar o leer. Bien hecho: done binario. Error típico: perfeccionismo sin fin.",
        minutes: 5,
      },
      {
        title: "Construye el MVP feo primero",
        detail:
          "Versión mínima antes de estética. Bien hecho: algo demostrable pronto. Error típico: 3 días eligiendo colores.",
        minutes: 60,
      },
      {
        title: "Guarda link listo para compartir",
        detail:
          "Drive, GitHub o Notion con acceso claro. Bien hecho: URL en tu CRM/CV. Error típico: archivo solo en el escritorio local.",
        minutes: 10,
      }
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
      {
        title: "Crea checklist de calidad",
        detail:
          "Claridad, exactitud, presentación, narrativa de negocio. Bien hecho: 4–6 ítems. Error típico: 'se ve bien' sin criterios.",
        minutes: 10,
      },
      {
        title: "Pasa el MVP por el checklist",
        detail:
          "Marca fallas concretas. Bien hecho: lista de gaps del entregable. Error típico: enamorte de la v1 y no revisarla.",
        minutes: 15,
      },
      {
        title: "Pide feedback de 15 minutos",
        detail:
          "A alguien técnico o de negocio. Bien hecho: 3 comentarios accionables. Error típico: pedir review a quien no entiende el dominio.",
        minutes: 20,
      },
      {
        title: "Implementa solo 3 mejoras",
        detail:
          "Prioriza impacto. Bien hecho: v2 claramente mejor. Error típico: 20 microcambios cosméticos.",
        minutes: 40,
      },
      {
        title: "Graba walkthrough de 90 segundos",
        detail:
          "Explica el entregable como en entrevista. Bien hecho: narrativa + demo corta. Error típico: no poder contar el proyecto en menos de 5 minutos.",
        minutes: 15,
      }
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
      {
        title: "Elige formato de publicación",
        detail:
          "Post LinkedIn, Featured, GitHub README o carrusel. Bien hecho: un canal, no cinco a medias. Error típico: 'lo publico algún día'.",
        minutes: 5,
      },
      {
        title: "Estructura problema → acción → resultado → CTA",
        detail:
          "Cierra con CTA suave al rol que buscas. Bien hecho: post escaneable en 20s. Error típico: hilo eterno sin pedido claro.",
        minutes: 20,
      },
      {
        title: "Publica en horario laboral local",
        detail:
          "Martes–jueves suele funcionar mejor. Bien hecho: fecha/hora elegidas. Error típico: publicar viernes 11pm y desaparecer.",
        minutes: 5,
      },
      {
        title: "Responde comentarios las primeras 2 horas",
        detail:
          "Algoritmo y networking real. Bien hecho: conversación activa. Error típico: postear y no mirar notificaciones.",
        minutes: 15,
      },
      {
        title: "Guarda el link en CRM y CV",
        detail:
          "Evidencia reutilizable. Bien hecho: URL a mano. Error típico: perder el post entre el feed.",
        minutes: 5,
      }
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
      {
        title: "Agrega skill solo con evidencia",
        detail:
          "En Skills únicamente si hay bullet o proyecto. Bien hecho: consistencia. Error típico: keyword suelta sin contexto.",
        minutes: 5,
      },
      {
        title: "Escribe 1 bullet con la skill",
        detail:
          "Verbo + acción + resultado. Bien hecho: listo para ATS y humanos. Error típico: 'conocimientos en X' sin impacto.",
        minutes: 15,
      },
      {
        title: "Crea sección Proyectos si aplica",
        detail:
          "Título, link y 2 líneas. Bien hecho: evidencia visible. Error típico: proyecto escondido solo en Drive privado.",
        minutes: 15,
      },
      {
        title: "Alinea wording al top 10",
        detail:
          "Sin mentir. Bien hecho: keywords naturales. Error típico: stuffing de la oferta entera.",
        minutes: 10,
      },
      {
        title: "Exporta PDF limpio de una columna",
        detail:
          "Pasada visual final. Bien hecho: texto seleccionable y orden legible. Error típico: diseño bonito que rompe el parseo.",
        minutes: 10,
      }
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
      {
        title: "Elige 1 oferta target del primario",
        detail:
          "La misma del inicio del mes si es posible. Bien hecho: comparación manzana-manzana. Error típico: cambiar de oferta en cada corrida.",
        minutes: 5,
      },
      {
        title: "Corre ATSAdvisor con el CV nuevo",
        detail:
          "O herramienta ATS equivalente. Bien hecho: score y keywords anotados. Error típico: 'sentir' que mejoró sin medir.",
        minutes: 15,
      },
      {
        title: "Compara deltas vs corrida anterior",
        detail:
          "Score y keywords ganadas/perdidas. Bien hecho: antes/después documentado. Error típico: no guardar el score inicial.",
        minutes: 10,
      },
      {
        title: "Si no subió, plan de 7 días",
        detail:
          "1 keyword faltante honesta + práctica. Bien hecho: gap real, no inventado. Error típico: meter la keyword mintiendo.",
        minutes: 10,
      },
      {
        title: "Documenta en el tracker de outplacement",
        detail:
          "Antes/después visible. Bien hecho: historial de mejora. Error típico: celebrar horas de video como cierre del gap.",
        minutes: 5,
      }
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
      {
        title: "Estructura Cargo | Valor | Nicho",
        detail:
          "Hasta ~220 caracteres con foco claro. Bien hecho: se entiende en 3 segundos. Error típico: solo 'Open to work | Apasionado'.",
        minutes: 10,
      },
      {
        title: "Escribe 3 variantes y elige",
        detail:
          "Quédate con la más específica. Bien hecho: comparación lado a lado. Error típico: publicar la primera idea.",
        minutes: 10,
      },
      {
        title: "Quita frases vacías",
        detail:
          "Saca 'apasionado' y eslóganes. Bien hecho: valor concreto. Error típico: emoji spam y adjetivos.",
        minutes: 5,
      },
      {
        title: "Incluye 1 keyword del top 10",
        detail:
          "Si cabe con naturalidad. Bien hecho: buscable sin sonar robot. Error típico: meter 5 tools en el headline.",
        minutes: 5,
      },
      {
        title: "Valida claridad con un colega",
        detail:
          "¿Entiende tu foco en 3 segundos? Bien hecho: sí/no + ajuste. Error típico: no pedir feedback y asumir claridad.",
        minutes: 5,
      }
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
      {
        title: "Escribe 3 logros en STAR",
        detail:
          "Situación, Tarea, Acción, Resultado en 2–3 líneas c/u. Bien hecho: resultado con número. Error típico: solo tareas sin resultado.",
        minutes: 25,
      },
      {
        title: "Abre el About con X–Y–Z",
        detail:
          "Dos líneas de pitch al inicio. Bien hecho: gancho inmediato. Error típico: biografía cronológica desde el colegio.",
        minutes: 5,
      },
      {
        title: "Pega los 3 STAR en el About",
        detail:
          "Bullets o párrafos cortos. Bien hecho: evidencia escaneable. Error típico: un bloque denso de 40 líneas.",
        minutes: 10,
      },
      {
        title: "Cierra con qué buscas y contacto",
        detail:
          "Rol + mail o CTA. Bien hecho: siguiente paso obvio. Error típico: About que termina en el aire.",
        minutes: 5,
      },
      {
        title: "Recorta a lectura de 40–50s",
        detail:
          "Elimina adornos. Bien hecho: se lee rápido en móvil. Error típico: novelita de About.",
        minutes: 10,
      }
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
      {
        title: "Usa plantilla de una columna",
        detail:
          "Header, Resumen, Experiencia, Educación, Skills, Proyectos. Bien hecho: secciones estándar. Error típico: CV Canva de dos columnas con iconos.",
        minutes: 20,
      },
      {
        title: "Elimina tablas, text boxes e icon bars",
        detail:
          "Nada que rompa parsers ATS. Bien hecho: texto plano estructurado. Error típico: skill bars e infografías 'creativas'.",
        minutes: 15,
      },
      {
        title: "Estandariza fechas y cargos",
        detail:
          "MMM AAAA – MMM AAAA y títulos claros. Bien hecho: parseo limpio. Error típico: '2021-ish' o cargos internos crípticos.",
        minutes: 10,
      },
      {
        title: "Exporta PDF con texto seleccionable",
        detail:
          "Desde Word/Docs, no escaneo. Bien hecho: puedes seleccionar texto. Error típico: imagen de CV en PDF.",
        minutes: 5,
      },
      {
        title: "Prueba copy-paste a bloc de notas",
        detail:
          "Si el orden se rompe, rediseña. Bien hecho: lectura lineal correcta. Error típico: confiar solo en la vista impresa.",
        minutes: 5,
      }
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
      {
        title: "Ubica keywords solo donde sean verdaderas",
        detail:
          "Resumen, bullets y skills con evidencia. Bien hecho: honestidad + match. Error típico: copiar la oferta entera.",
        minutes: 15,
      },
      {
        title: "Reescribe bullets con el término natural",
        detail:
          "Ej. gestión de stakeholders, churn. Bien hecho: keyword dentro del logro. Error típico: lista de keywords al final del CV.",
        minutes: 20,
      },
      {
        title: "Prohíbe tools y cargos inventados",
        detail:
          "Línea roja ética y de entrevista. Bien hecho: puedes defender cada ítem. Error típico: listar SAP 'porque lo pedían'.",
        minutes: 5,
      },
      {
        title: "Contextualiza nivel básico",
        detail:
          "'Proyecto personal' o 'curso + entregable'. Bien hecho: transparencia. Error típico: parecer senior en skill junior.",
        minutes: 8,
      },
      {
        title: "Pasada anti-stuffing",
        detail:
          "Si una keyword aparece 8 veces, baja a 2–3. Bien hecho: naturalidad. Error típico: saturar y irritar al humano.",
        minutes: 10,
      }
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
      {
        title: "Sube CV + oferta en ATSAdvisor",
        detail:
          "O herramienta equivalente del producto. Bien hecho: corrida registrada. Error típico: editar el CV a ciegas sin oferta target.",
        minutes: 10,
      },
      {
        title: "Anota score, faltantes y secciones débiles",
        detail:
          "Lista concreta de cambios posibles. Bien hecho: diagnóstico escrito. Error típico: mirar solo el número y cerrar.",
        minutes: 8,
      },
      {
        title: "Aplica 3–5 cambios honestos",
        detail:
          "Sin copiar la oferta. Bien hecho: mejoras defendibles. Error típico: 20 cambios cosméticos sin evidencia.",
        minutes: 25,
      },
      {
        title: "Vuelve a correr y registra delta",
        detail:
          "Mismo par CV–oferta. Bien hecho: score antes/después. Error típico: cambiar de oferta cada iteración.",
        minutes: 10,
      },
      {
        title: "Detente cuando puedas defender keywords",
        detail:
          "Score mejor + narrativa oral lista. Bien hecho: versión final versionada. Error típico: perseguir 100 mintiendo.",
        minutes: 5,
      }
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
      {
        title: "Toma foto profesional simple",
        detail:
          "Rostro claro, luz buena, ropa neat, fondo neutro. Bien hecho: confianza sin postureo. Error típico: selfie angulada o foto de fiesta.",
        minutes: 20,
      },
      {
        title: "Descarta fotos que restan",
        detail:
          "Sin lentes de sol, grupo o crop raro. Bien hecho: solo tú, a la altura de los ojos. Error típico: recorte de una foto grupal antigua.",
        minutes: 5,
      },
      {
        title: "Diseña banner con valor corto",
        detail:
          "Imagen limpia + Cargo | Valor | Nicho. Bien hecho: refuerza el headline. Error típico: teléfono gigante y diseño spam.",
        minutes: 20,
      },
      {
        title: "Revisa recorte en móvil",
        detail:
          "El banner se corta distinto. Bien hecho: texto visible en phone. Error típico: diseñar solo en desktop.",
        minutes: 5,
      },
      {
        title: "Pide opinión de 1 colega del sector",
        detail:
          "¿Se ve profesional para tu industria? Bien hecho: ajuste rápido. Error típico: pedir feedback solo a familia.",
        minutes: 5,
      }
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
      {
        title: "Sube CV o proyecto a Featured",
        detail:
          "PDF + 1 media clara. Bien hecho: prueba en un clic. Error típico: Featured vacío o con 8 links mediocres.",
        minutes: 15,
      },
      {
        title: "Escribe descripción corta",
        detail:
          "Qué es + qué rol buscas. Bien hecho: contexto inmediato. Error típico: sin texto y el visitante no entiende.",
        minutes: 5,
      },
      {
        title: "Cierra el About con CTA",
        detail:
          "Mail profesional o 'Escríbeme por LinkedIn'. Bien hecho: fricción baja. Error típico: nick de adolescencia como contacto.",
        minutes: 5,
      },
      {
        title: "Configura Open to Work",
        detail:
          "Solo reclutadores si necesitas discreción. Bien hecho: señal alineada a tu situación. Error típico: no activarlo y esperar inbound.",
        minutes: 5,
      },
      {
        title: "Prueba el perfil en incógnito",
        detail:
          "Verifica que todo cargue. Bien hecho: flujo de visitante OK. Error típico: links rotos en Featured.",
        minutes: 5,
      }
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
      {
        title: "Crea la hoja del mapa de contactos",
        detail:
          "Nombre | Relación | Empresa | Por qué relevante | Canal | Estado. Bien hecho: columnas listas. Error típico: lista mental sin CRM.",
        minutes: 10,
      },
      {
        title: "Llena 20 filas relevantes",
        detail:
          "Excompañeros, líderes, reclutadores, proveedores, clientes, alumni. Bien hecho: 20 nombres reales. Error típico: solo 3 amigos íntimos.",
        minutes: 25,
      },
      {
        title: "Prioriza A/B/C",
        detail:
          "Según cercanía y poder de intro. Bien hecho: orden de ataque claro. Error típico: contactar primero a los más difíciles e irrelevantes.",
        minutes: 10,
      },
      {
        title: "Completa LinkedIn URL faltantes",
        detail:
          "Antes de escribir mensajes. Bien hecho: datos listos. Error típico: empezar a escribir y trabarte buscando perfiles.",
        minutes: 15,
      },
      {
        title: "Agenda 5 contactos A por semana",
        detail:
          "Ritmo semanal sostenible. Bien hecho: cupo en calendario. Error típico: 20 mensajes un día y silencio un mes.",
        minutes: 5,
      }
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
      {
        title: "Línea 1: saludo + ancla personalizada",
        detail:
          "Post, empresa o interés común. Bien hecho: se nota que no es spam. Error típico: 'Espero te encuentres bien' sin ancla.",
        minutes: 5,
      },
      {
        title: "Líneas 2–3: contexto + 1 logro",
        detail:
          "Transición breve y valor que aportas. Bien hecho: 2 frases densas. Error típico: historia completa del despido.",
        minutes: 8,
      },
      {
        title: "Línea 4: pedido concreto",
        detail:
          "15 min, intro a X o feedback de 1 cosa. Bien hecho: acción única. Error típico: '¿hay chamba?'",
        minutes: 5,
      },
      {
        title: "Línea 5: gracias + 2 horarios",
        detail:
          "Facilita el sí. Bien hecho: opciones claras. Error típico: 'cuando puedas' sin fechas.",
        minutes: 3,
      },
      {
        title: "Guarda variantes peer y hiring manager",
        detail:
          "Dos scripts cortos. Bien hecho: adaptables. Error típico: mismo tono íntimo para un desconocido senior.",
        minutes: 10,
      }
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
      {
        title: "Elige 5 contactos A del mapa",
        detail:
          "Prioridad alta. Bien hecho: lista del día. Error típico: contactar random del feed.",
        minutes: 5,
      },
      {
        title: "Investiga 2 minutos cada uno",
        detail:
          "Post reciente, noticia, interés común. Bien hecho: ancla real. Error típico: personalización falsa ('admiré tu carrera').",
        minutes: 10,
      },
      {
        title: "Adapta el script con el ancla",
        detail:
          "Una frase personalizada basta. Bien hecho: mensaje único. Error típico: 20 copy-paste idénticos.",
        minutes: 15,
      },
      {
        title: "Envía los 5 en un bloque de foco",
        detail:
          "45–60 min seguidos. Bien hecho: momentum. Error típico: un mensaje cada dos días y perder el hilo.",
        minutes: 50,
      },
      {
        title: "Registra en CRM como enviado",
        detail:
          "Fecha, mensaje, estado. Bien hecho: trazabilidad. Error típico: no saber a quién ya escribiste.",
        minutes: 5,
      }
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
      {
        title: "Filtra silencios de 4–5 días",
        detail:
          "Desde el CRM. Bien hecho: lista corta de follow-up. Error típico: follow-up al día siguiente.",
        minutes: 5,
      },
      {
        title: "Escribe follow-up de 3 líneas",
        detail:
          "Recordatorio + valor extra + pedido suave. Bien hecho: útil, no insistente. Error típico: 'te reenvío lo mismo' tres veces.",
        minutes: 10,
      },
      {
        title: "Envía una sola vez",
        detail:
          "Si no hay respuesta, marca frío y vuelve en 4–6 semanas o pide otro camino. Bien hecho: respeta la relación. Error típico: bombardeo diario.",
        minutes: 10,
      },
      {
        title: "No reenvíes el mismo mensaje seguido",
        detail:
          "Cambia ángulo o canal solo si es apropiado. Bien hecho: segundo toque fresco. Error típico: mismo texto 3 días seguidos.",
        minutes: 3,
      },
      {
        title: "Agradece aunque digan que no",
        detail:
          "Cierra con gracia. Bien hecho: capital social intacto. Error típico: responder con resentimiento.",
        minutes: 3,
      }
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
      {
        title: "Verifica ≥70% match antes de pedir referido",
        detail:
          "Skills + interés real. Bien hecho: pedido justificado. Error típico: 'refiéreme a todo lo que veas'.",
        minutes: 15,
      },
      {
        title: "Explica el fit en 4–5 líneas",
        detail:
          "Con evidencias. Bien hecho: tu contacto puede reenviar sin editar mucho. Error típico: pedir referido sin contexto.",
        minutes: 10,
      },
      {
        title: "Adjunta CV + blurb listo",
        detail:
          "Facilita el trabajo del referente. Bien hecho: copy-paste ready. Error típico: hacer que escriban ellos tu pitch.",
        minutes: 10,
      },
      {
        title: "Acepta el no y pide alternativa",
        detail:
          "Otra persona o área. Bien hecho: plan B cortés. Error típico: insistir hasta quemar la relación.",
        minutes: 5,
      },
      {
        title: "Cierra el loop con update",
        detail:
          "Aunque no quedes. Bien hecho: profesionalismo memorable. Error típico: desaparecer tras el favor.",
        minutes: 5,
      }
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
      {
        title: "Elige 1 comunidad alineada",
        detail:
          "Meetup, asociación, Slack, LinkedIn serio, cámara. Bien hecho: diálogo activo. Error típico: 10 grupos muertos.",
        minutes: 15,
      },
      {
        title: "Agenda 1 participación esta semana",
        detail:
          "Evento, AMA o comentario útil. Bien hecho: fecha en calendario. Error típico: unirte y lurkear meses.",
        minutes: 5,
      },
      {
        title: "Prepara 1 pregunta o aporte",
        detail:
          "Recurso o experiencia breve. Bien hecho: valor, no pitch de CV. Error típico: entrar vendiendo tu desempleo.",
        minutes: 10,
      },
      {
        title: "Conecta con 2 personas post-evento",
        detail:
          "Mensaje de valor. Bien hecho: 2 nuevos en el mapa. Error típico: colectar tarjetas y no escribir.",
        minutes: 15,
      },
      {
        title: "Añádelas al mapa de contactos",
        detail:
          "Actualiza CRM. Bien hecho: red que crece. Error típico: perder nombres a la semana.",
        minutes: 5,
      }
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
      {
        title: "Crea el sheet CRM simple",
        detail:
          "Contacto | Empresa | Último toque | Estado | Próximo paso | Fecha | Notas. Bien hecho: columnas mínimas. Error típico: tool compleja que no abres.",
        minutes: 15,
      },
      {
        title: "Define estados claros",
        detail:
          "Por contactar, enviado, respondió, reunión, referido, frío, ganado. Bien hecho: pipeline legible. Error típico: estados ambiguos tipo 'en proceso'.",
        minutes: 5,
      },
      {
        title: "Revisa cada viernes filas sin próximo paso",
        detail:
          "Asigna uno. Bien hecho: cero filas huérfanas. Error típico: CRM museo de contactos muertos.",
        minutes: 20,
      },
      {
        title: "Pon recordatorios de follow-up",
        detail:
          "Pon recordatorios en el calendario para cada follow-up del CRM. Bien hecho: toques a tiempo sin depender de la memoria. Error típico: dejarlo en 'algún día' y perder el segundo contacto.",
        minutes: 10,
      },
      {
        title: "Mide enviados, respuestas, reuniones, intros",
        detail:
          "Métricas semanales. Bien hecho: sistema que se ajusta. Error típico: medir solo 'horas en LinkedIn'.",
        minutes: 10,
      }
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
      {
        title: "Elige 5 temas STAR",
        detail:
          "Logro top, conflicto, fracaso/aprendizaje, liderazgo/influencia, deadline. Bien hecho: cobertura amplia. Error típico: 5 variantes del mismo éxito fácil.",
        minutes: 10,
      },
      {
        title: "Escribe STAR en viñetas",
        detail:
          "Escribe cada historia STAR en viñetas cortas, no como ensayo. Bien hecho: S/T/A/R visibles y fáciles de memorizar. Error típico: un párrafo de una página que no puedes contar en 90 segundos.",
        minutes: 25,
      },
      {
        title: "Grábate 90 segundos por historia",
        detail:
          "Grábate cada historia y cronometra de verdad. Bien hecho: cerca de 90 segundos con Resultado audible. Error típico: hablar 3:30 y olvidar la métrica al final.",
        minutes: 25,
      },
      {
        title: "Recorta o refuerza Resultado",
        detail:
          "Si pasas de 2 min, corta; si falta métrica, agrégala. Bien hecho: impacto numérico audible. Error típico: terminar en 'y bueno, salió bien'.",
        minutes: 15,
      },
      {
        title: "Practica sin leer hasta fluir",
        detail:
          "El Resultado debe salir natural. Bien hecho: oral, no leído. Error típico: depender del papel en la entrevista.",
        minutes: 20,
      }
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
      {
        title: "Redacta salida en 45–60s",
        detail:
          "Hecho → contexto neutral → aprendizaje → foco futuro. Bien hecho: sin culpas. Error típico: atacar a la empresa anterior.",
        minutes: 15,
      },
      {
        title: "Elige debilidad real + plan",
        detail:
          "No crítica al rol; mitigación en curso. Bien hecho: honestidad útil. Error típico: 'soy perfeccionista'.",
        minutes: 10,
      },
      {
        title: "Explica gaps sin sobrejustificar",
        detail:
          "Upskilling, proyecto, caregiving. Bien hecho: 3–4 frases. Error típico: monólogo defensivo de 5 minutos.",
        minutes: 10,
      },
      {
        title: "Prepara conflicto en STAR",
        detail:
          "Énfasis en escucha y resultado de negocio. Bien hecho: madurez visible. Error típico: historia donde 'el otro era el malo'.",
        minutes: 15,
      },
      {
        title: "Practica con entrevistador duro",
        detail:
          "Peer que empuje. Bien hecho: feedback de tono. Error típico: ensayar solo en silencio.",
        minutes: 30,
      }
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
      {
        title: "Investiga la empresa 20 minutos",
        detail:
          "Producto, noticias, LinkedIn del entrevistador. Bien hecho: 3 hallazgos útiles. Error típico: preguntas que están en la web en 10s.",
        minutes: 20,
      },
      {
        title: "Prepara 3 preguntas estratégicas",
        detail:
          "Éxito a 90 días, prioridades del equipo, cómo se mide el rol. Bien hecho: interés de negocio. Error típico: solo salario en ronda 1.",
        minutes: 10,
      },
      {
        title: "Reserva salario/beneficios para después",
        detail:
          "O para HR cuando abran el tema. Bien hecho: timing correcto. Error típico: primera pregunta = vacaciones.",
        minutes: 2,
      },
      {
        title: "Haz 1 pregunta ligada a lo dicho",
        detail:
          "Escucha activa. Bien hecho: conversación real. Error típico: leer las 3 preguntas sin importar la charla.",
        minutes: 5,
      },
      {
        title: "Anota respuestas para tu 30-60-90",
        detail:
          "Datos de éxito temprano. Bien hecho: notas post-entrevista. Error típico: olvidar lo que pidieron al entrar.",
        minutes: 5,
      }
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
      {
        title: "Recupera piso, meta y techo",
        detail:
          "Del módulo de mercado. Bien hecho: cifras a la mano. Error típico: inventar número bajo presión.",
        minutes: 5,
      },
      {
        title: "Practica el guion de banda en voz alta",
        detail:
          "'Basado en mercado para [rol/ciudad], manejo [meta], flexible según alcance y beneficios'. Bien hecho: 20s fluidos. Error típico: tartamudear la cifra.",
        minutes: 10,
      },
      {
        title: "Define beneficios que compensan",
        detail:
          "Remoto, bono, equipo, estudio. Bien hecho: trade-offs claros. Error típico: solo pelear base sin paquete.",
        minutes: 8,
      },
      {
        title: "Da rango anclado si piden temprano",
        detail:
          "No un único número si puedes evitarlo. Bien hecho: ancla con fuentes. Error típico: inventar otra oferta.",
        minutes: 5,
      },
      {
        title: "Escribe el guion; no confíes en la memoria",
        detail:
          "El nerviosismo borra cifras. Bien hecho: tarjeta de 5 líneas. Error típico: 'ya me lo sé' y en blanco en la llamada.",
        minutes: 5,
      }
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
      {
        title: "Agenda mock de 30–40 minutos",
        detail:
          "Peer o herramienta de entrevista del producto. Bien hecho: fecha fija. Error típico: mock solo 'cuando haya tiempo'.",
        minutes: 5,
      },
      {
        title: "Simula 5 preguntas clave",
        detail:
          "Cuéntame de ti, despido, STAR logro, debilidad, preguntas al entrevistador. Bien hecho: cobertura real. Error típico: solo practicar el pitch fácil.",
        minutes: 30,
      },
      {
        title: "Graba la sesión si puedes",
        detail:
          "Para oír muletillas. Bien hecho: evidencia auditiva. Error típico: feedback solo de memoria.",
        minutes: 5,
      },
      {
        title: "Pide feedback en 4 ejes",
        detail:
          "Claridad, STAR, tono, duración. Bien hecho: 2 hábitos a corregir máx. Error típico: 15 críticas y ninguna práctica.",
        minutes: 10,
      },
      {
        title: "Corrige 2 hábitos y repite ronda corta",
        detail:
          "Ej. muletillas + finales débiles. Bien hecho: mejora medible. Error típico: un mock y nunca más hasta la entrevista real.",
        minutes: 15,
      }
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
      {
        title: "Restatea problema y métricas",
        detail:
          "Confirma objetivos en voz alta. Bien hecho: alineación temprana. Error típico: resolver el caso equivocado.",
        minutes: 5,
      },
      {
        title: "Lista supuestos y pide datos faltantes",
        detail:
          "Transparencia de pensamiento. Bien hecho: preguntas inteligentes. Error típico: asumir en silencio y fallar la premisa.",
        minutes: 5,
      },
      {
        title: "Genera 2–3 opciones con pros/contras",
        detail:
          "Criterio visible. Bien hecho: abanico breve. Error típico: una sola idea aferrada.",
        minutes: 10,
      },
      {
        title: "Elige recomendación + plan + riesgos",
        detail:
          "Implementación creíble. Bien hecho: ownership. Error típico: recomendación sin cómo ni riesgos.",
        minutes: 10,
      },
      {
        title: "Cierra con éxito a 30/90 días",
        detail:
          "Cómo medirías. Bien hecho: mentalidad de ejecución. Error típico: terminar en teoría abstracta.",
        minutes: 5,
      }
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
      {
        title: "Prepara cierre de fit en 20s",
        detail:
          "'Veo fit porque [2 puntos]; me entusiasma [1 prioridad que mencionaron]'. Bien hecho: ownership. Error típico: despedirte con 'bueno… gracias'.",
        minutes: 5,
      },
      {
        title: "Pregunta próximos pasos y timelines",
        detail:
          "Quién decide. Bien hecho: claridad de proceso. Error típico: salir sin saber qué sigue.",
        minutes: 3,
      },
      {
        title: "Agradece por nombre + 1 detalle",
        detail:
          "De la conversación. Bien hecho: memorabilidad. Error típico: agradecimiento genérico.",
        minutes: 2,
      },
      {
        title: "Envía thank-you en 24h",
        detail:
          "3–4 líneas por LinkedIn o mail. Bien hecho: refuerzo de fit. Error típico: ensayo de media página o silencio.",
        minutes: 10,
      },
      {
        title: "Registra follow-up en CRM",
        detail:
          "Si hay silencio, fecha de toque. Bien hecho: momentum. Error típico: esperar eternamente 'a que avisen'.",
        minutes: 3,
      }
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
      {
        title: "Arma tabla de compensación total",
        detail:
          "Base, bono, beneficios, transporte, aprendizaje, modalidad, trayectoria. Bien hecho: columnas completas. Error típico: mirar solo el base.",
        minutes: 20,
      },
      {
        title: "Convierte a valor mensual estimado",
        detail:
          "Estimaciones honestas. Bien hecho: comparables. Error típico: inflar beneficios intangibles a lo loco.",
        minutes: 15,
      },
      {
        title: "Puntúa cultura y aprendizaje 1–5",
        detail:
          "Según lo oído en entrevistas. Bien hecho: score explícito. Error típico: ignorar red flags por el sueldo.",
        minutes: 10,
      },
      {
        title: "Compara vs piso/meta y costo de vida",
        detail:
          "De tu ciudad. Bien hecho: decisión anclada. Error típico: aceptar bajo 'por miedo'.",
        minutes: 10,
      },
      {
        title: "Decide aceptar / negociar / declinar por escrito",
        detail:
          "Escribe la decisión: aceptar, negociar o declinar, con 2–3 razones. Bien hecho: claridad antes de responder al reclutador. Error típico: ghostear la oferta por ansiedad.",
        minutes: 10,
      }
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
      {
        title: "Agradece y pide 24–48h si necesitas",
        detail:
          "Por escrito. Bien hecho: profesionalismo. Error típico: contraoferta impulsiva el mismo minuto.",
        minutes: 5,
      },
      {
        title: "Prepara cifra meta + 2 evidencias",
        detail:
          "Banda de mercado + impacto que traes. Bien hecho: pedido fundamentado. Error típico: ultimátum agresivo sin datos.",
        minutes: 20,
      },
      {
        title: "Ofrece flexibilidad de paquete",
        detail:
          "Base vs bono vs firma vs review a 6 meses. Bien hecho: opciones. Error típico: pedir 10 cosas a la vez.",
        minutes: 10,
      },
      {
        title: "Envía mensaje corto o propone llamada",
        detail:
          "Tono profesional. Bien hecho: fácil de responder. Error típico: párrafo de presión emocional.",
        minutes: 10,
      },
      {
        title: "Confirma por escrito lo acordado",
        detail:
          "Acepta el resultado final con gracia. Bien hecho: email de cierre. Error típico: solo verbal y malentendidos después.",
        minutes: 10,
      }
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
      {
        title: "Diseña los 30 días: aprender + diagnóstico",
        detail:
          "Sistemas, stakeholders, métricas + 1 quick diagnosis. Bien hecho: aprendizaje con output. Error típico: prometer transformar la empresa en 30 días.",
        minutes: 15,
      },
      {
        title: "Diseña los 60: aportar con ownership",
        detail:
          "Mejoras pequeñas + 1 proceso. Bien hecho: métrica chica. Error típico: plan vacío de 'apoyar al equipo'.",
        minutes: 15,
      },
      {
        title: "Diseña los 90: liderar un impacto",
        detail:
          "Propuesta con métrica. Bien hecho: ambición realista. Error típico: KPI imposible.",
        minutes: 15,
      },
      {
        title: "Escríbelo en 1 página y comparte semana 1",
        detail:
          "Con tu jefe. Bien hecho: alineación temprana. Error típico: plan solo en tu notebook.",
        minutes: 20,
      },
      {
        title: "Pide feedback y ajusta",
        detail:
          "'¿Esto refleja tus prioridades?' Bien hecho: plan vivo. Error típico: aferrarte al draft inicial.",
        minutes: 15,
      }
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
      {
        title: "Acepta por escrito y cierra la búsqueda",
        detail:
          "Ritual breve de cierre. Bien hecho: transición mental. Error típico: seguir spammeando CVs el mismo día.",
        minutes: 10,
      },
      {
        title: "Pausa postulaciones y cierra procesos activos",
        detail:
          "Retiro o pausa educada. Bien hecho: reputación intacta. Error típico: ghostear a otros reclutadores.",
        minutes: 20,
      },
      {
        title: "Archiva materiales en carpeta referencia",
        detail:
          "CV, CRM, scripts. Bien hecho: listos si la oferta cae. Error típico: borrar todo en euforia.",
        minutes: 15,
      },
      {
        title: "Activa checklist de onboarding",
        detail:
          "Docs, equipos, accesos, primeras reuniones. Bien hecho: semana 1 ordenada. Error típico: improvisar el día 1.",
        minutes: 20,
      },
      {
        title: "Define 3 prioridades personales semana 1",
        detail:
          "Define 3 prioridades personales para la semana 1 en el nuevo rol. Bien hecho: foco ejecutable día a día. Error típico: proponerse 'aprender todo' sin orden.",
        minutes: 10,
      }
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
      {
        title: "Identifica buddy, peer y stakeholder",
        detail:
          "En la semana 1. Bien hecho: tres nombres. Error típico: aprender solo y cometer errores políticos.",
        minutes: 30,
      },
      {
        title: "Agenda cafés de 20 min",
        detail:
          "¿Cómo se gana aquí? ¿Qué evitar? Bien hecho: mapa cultural. Error típico: solo hablar con tu jefe.",
        minutes: 60,
      },
      {
        title: "Pregunta por docs, canales y ritos",
        detail:
          "Slack/Teams, rituales del equipo. Bien hecho: navegación interna. Error típico: descubrir normas a los 2 meses por choque.",
        minutes: 15,
      },
      {
        title: "Ofrece ayuda temprana en algo pequeño",
        detail:
          "Construye crédito. Bien hecho: quick favor visible. Error típico: pedir sin dar nada.",
        minutes: 30,
      },
      {
        title: "Anota nombres y roles en libreta",
        detail:
          "Onboarding documentado. Bien hecho: red interna clara. Error típico: olvidar quién es quién.",
        minutes: 10,
      }
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
      {
        title: "Lista 5 dolores pequeños oídos",
        detail:
          "Reporte manual, doc faltante, reunión sin agenda. Bien hecho: backlog de wins. Error típico: buscar un proyecto heroico mes 1.",
        minutes: 15,
      },
      {
        title: "Elige 1 de bajo riesgo y alto uso",
        detail:
          "Pide ok a jefe/buddy. Bien hecho: permiso explícito. Error típico: cambiar procesos sin avisar.",
        minutes: 10,
      },
      {
        title: "Entrega en ≤2 semanas",
        detail:
          "Doc, automatización simple, checklist o métrica limpia. Bien hecho: usable. Error típico: perfectismo de 6 semanas.",
        minutes: 120,
      },
      {
        title: "Comunica antes/después en 5 líneas",
        detail:
          "Al equipo. Bien hecho: win visible. Error típico: mejora invisible que nadie usa.",
        minutes: 15,
      },
      {
        title: "Registra el win para el review de 30 días",
        detail:
          "Evidencia lista. Bien hecho: conversación fácil con tu jefe. Error típico: no documentar y llegar vacío al feedback.",
        minutes: 5,
      }
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
      {
        title: "Agenda review ~día 30 desde semana 2",
        detail:
          "30 min con tu jefe. Bien hecho: fecha en calendario. Error típico: esperar al performance formal del año.",
        minutes: 5,
      },
      {
        title: "Envía agenda previa",
        detail:
          "Avances vs plan, qué funciona, qué ajustar, prioridades 60. Bien hecho: reunión productiva. Error típico: reunión sin guion.",
        minutes: 15,
      },
      {
        title: "Lleva evidencia: win, métricas, aprendizajes",
        detail:
          "Material concreto. Bien hecho: hechos, no sensaciones. Error típico: solo 'creo que voy bien'.",
        minutes: 20,
      },
      {
        title: "Pide feedback más/menos/empezar",
        detail:
          "Pide feedback específico: qué hacer más, menos y empezar. Bien hecho: 1–3 acciones claras al salir. Error típico: preguntar solo '¿todo bien?' y quedarte sin señal.",
        minutes: 15,
      },
      {
        title: "Cierra con acuerdos y mail en 24h",
        detail:
          "Cierra con acuerdos y envía un mail de resumen en 24h; actualiza el plan 60-90. Bien hecho: trazabilidad escrita. Error típico: dejar el feedback solo oral y que se evapore.",
        minutes: 15,
      }
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
