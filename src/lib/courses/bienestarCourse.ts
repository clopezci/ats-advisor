import type { CourseDef } from "@/lib/courses/types";

/** Curso completo: bienestar + derechos laborales CO (educativo, no asesoría). */
export const BIENESTAR_COURSE: CourseDef = {
  id: "bienestar-co",
  title: "Bienestar y derechos en la transición (CO)",
  short: "Bienestar",
  summary:
    "Estabilizas tu energía, armas una red de apoyo y revisas tu liquidación con checklist clara. No reemplaza terapia ni abogado.",
  href: "/outplacement/bienestar",
  lessons: [
    {
      id: "rutina-14",
      title: "Estabilización en los primeros 14 días",
      teaser: "Rutina mínima para no derrumbarte ni hiperproductivizarte.",
      why: "Los primeros días después de un corte laboral son caóticos: el cuerpo pide dormir o no parar, la cabeza mezcla duelo con urgencia de “conseguir algo ya”. Sin una rutina corta y repetible, o no haces nada útil o te quemas enviando CVs a ciegas. Esta lección te arma un andamiaje de 14 días: tres anclas de vida, una sola oficina de búsqueda, un marco mental limpio y límites digitales. No es motivación vacía: es diseño de día para que tu búsqueda sea sostenible.",
      howTo: [
        {
          title: "Fija tres anclas diarias (sueño, comida, movimiento)",
          minutes: 20,
          detail:
            "Elige una hora de despertar y de acostarte con ±30 minutos de holgura y escríbela donde la veas. No negocies “hoy me desvelo porque estoy inspirado”: la irregularidad destroza el ánimo al tercer día. Para comida, define al menos dos comidas reales (no solo café); si cocinar pesa, arma un menú de 3 platos fáciles y repítelos. Para movimiento, compromete 30–45 minutos: caminar cuenta. Programa la alarma de movimiento como una reunión con un cliente. Criterio de éxito: tres días seguidos cumpliendo las tres anclas, aunque la búsqueda vaya lento.",
        },
        {
          title: "Abre una sola “oficina de búsqueda” de 90–120 minutos",
          minutes: 15,
          detail:
            "En el calendario bloquea UN tramo diario (ej. 9:00–11:00) llamado “Oficina de búsqueda”. Fuera de ese bloque no haces Easy Apply, no “revisas rapidito LinkedIn”, no reescribes el CV a medianoche. Dentro del bloque sí: ATS, CV, mensajes de red, postulaciones. Si te sobra energía al terminar, cierras igual; el excedente se guarda para mañana. Error típico: abrir seis ventanas de 20 minutos todo el día — eso no es disciplina, es ansiedad disfrazada de productividad.",
        },
        {
          title: "Escribe el marco “terminó / conservo / atraigo” sin juicios",
          minutes: 25,
          detail:
            "En una hoja o nota, tres encabezados. Qué terminó: solo hechos (cargo, empresa, fecha, tipo de salida). Qué conservo: skills, relaciones, logros medibles que siguen siendo tuyos. Qué quiero atraer: 2–3 condiciones (rol, industria, modalidad, ciudad). Tacha frases tipo “fracasé” o “no sirvo” y reemplázalas por hechos u oportunidades. Este texto es privado: no lo publiques. Sirve de base para narrativa LinkedIn y para no mentirte en entrevistas. Si te trabas, dicta 2 minutos por voz y luego resume en 8–12 líneas.",
        },
        {
          title: "Limita LinkedIn a dos ventanas fijas al día",
          minutes: 10,
          detail:
            "Elige dos horarios cortos (ej. 11:05 y 16:00, 15 minutos c/u) para inbox, comentarios y Open to Work. Fuera de eso, la app no se abre: es ejecución (CV, red, ATS) o descanso. Desactiva notificaciones push si te secuestran. Criterio: si abres LinkedIn “porque me aburrí”, estás fuera de protocolo — cierra y vuelve a la ancla o a la oficina. El feed no es investigación de mercado; la investigación se hace con 2–3 ofertas guardadas y keywords anotadas.",
        },
        {
          title: "Señales de crisis: pide ayuda profesional (esta app no es terapia)",
          minutes: 5,
          detail:
            "Si aparece ansiedad que no baja, insomnio severo, desesperanza o ideas de dañarte, prioriza ayuda humana: línea de atención local, EPS, psicólogo, persona de confianza. Pausas la “oficina de búsqueda” sin culpa. ATSAdvisor acompaña empleabilidad; no sustituye salud mental ni urgencias. Anota en tu plan: a quién llamas y el número, antes de que llegue el mal día. Cumplir este paso es fuerza, no debilidad.",
        },
      ],
      tips: [
        "La constancia de 45–90 minutos diarios gana a un sprint de tres noches.",
        "Separa “duelo” (lo que sientes) de “plan” (lo que haces). Ambos importan; no los mezcles en el mismo bloque.",
        "Un micro-win (1 envío bien hecho) vale más que 20 genéricos a las 1 a.m.",
      ],
      example:
        "Ana (Bogotá) perdió su rol el viernes. Acordó: dormir 23:00–6:30, caminata 7:30, oficina 9:00–11:00, LinkedIn solo 11:05 y 16:00. Escribió “terminó rol retail 15-mar / conservo Excel y 3 contactos / atraigo coordinación logística híbrida”. En 10 días: CV ATS + 5 mensajes de red, sin insomnia. Cuando un día falló el movimiento, reinició al siguiente sin “recuperar” de madrugada.",
      template: `Mi rutina 14 días
Sueño: ___ a ___ (±30 min)
Comida real (mín. 2): …
Movimiento: ___ min · ___ (caminar/gym) · hora ___
Oficina de búsqueda: de ___ a ___ (solo eso; alarma de cierre: ___)
LinkedIn permitido: ___ y ___ (minutos c/u: ___)
Qué terminó (hechos): …
Qué conservo: …
Qué quiero atraer: …
Si crisis: llamo a ___ · teléfono ___`,
      tasks: [
        { id: "r1", label: "Escribir qué terminó / conservas / quieres atraer", minutes: 15 },
        { id: "r2", label: "Definir horario de oficina de búsqueda (máx. 2 h) + alarma", minutes: 10 },
        { id: "r3", label: "Agendar 30–45 min de movimiento mañana o hoy", minutes: 5 },
      ],
    },
    {
      id: "red-apoyo",
      title: "Red de apoyo (no solo “avísame si hay vacante”)",
      teaser: "5 personas + favores concretos.",
      why: "El mercado oculto y el ánimo dependen de personas reales. Pedir “si ves algo avísame” casi nunca funciona: es vago, da trabajo a la otra persona y no genera compromiso. Una red útil es un mapa de 5 nombres con un favor concreto cada uno, mensajes enviados en 48 h y al menos un ritual semanal de accountability. Esta lección convierte “networking” en acciones medibles.",
      howTo: [
        {
          title: "Arma el mapa de 5: 2 emocionales, 2 profesionales, 1 puente",
          minutes: 20,
          detail:
            "Lista cinco nombres con apellido y canal (WhatsApp, LinkedIn, mail). Dos cercanos emocionales (escuchan sin juzgar). Dos profesionales del sector o de tu último equipo (conocen tu trabajo). Uno “puente” hacia otra industria o ciudad. Si no llegas a 5, baja el filtro: excompañeros, docentes, vecinos de cowork. Escribe al lado por qué esa persona (una línea). Sin mapa no hay outreach serio.",
        },
        {
          title: "Asigna UN favor concreto por persona (<20 minutos para ellos)",
          minutes: 15,
          detail:
            "Para cada nombre, un solo pedido: revisar 1 página de CV, intro a 1 persona nombrada, mock de filtro de 15 min, feedback de headline, café virtual 20 min. Prohibido: “si ves vacantes…”. El favor debe ser ejecutable esta semana. Si no se te ocurre nada, usa: “¿me ayudas a priorizar entre estas 2 ofertas en 10 minutos?”. Criterio: tú podrías cumplir ese favor si te lo pidieran a ti.",
        },
        {
          title: "Envía al menos 2 mensajes en 48 horas (plantilla abajo)",
          minutes: 25,
          detail:
            "Copia la plantilla, personaliza 2–3 datos (nombre, rol target, favor) y manda. No esperes el “momento perfecto”. Si da vergüenza, mándalo igual y anota la hora: la vergüenza baja después del envío, no antes. Guarda capturas o el texto en tu carpeta de evidencia. Si no responden en 5 días, un follow-up corto de una línea; no un párrafo de culpa.",
        },
        {
          title: "Agenda accountability semanal (4 semanas)",
          minutes: 10,
          detail:
            "Elige a una persona del mapa (o un peer en transición) y fija 20–30 minutos el mismo día cada semana: “¿qué enviaste? ¿qué trabó? ¿qué harás en 7 días?”. Ponlo en calendario con enlace. Sin accountability, la red se vuelve lista muerta. Si cancelan, reprograma en 48 h; no dejes pasar dos semanas.",
        },
      ],
      tips: [
        "Pide algo que la otra persona pueda hacer en menos de 20 minutos.",
        "Agradece y reporta el resultado; eso abre la puerta a un segundo favor.",
        "No uses a tu red solo como banco de vacantes: úsala como espejo y acelerador.",
      ],
      example:
        "“Hola Laura, estoy en transición a analista de datos. ¿Me podrías revisar 1 página de CV 10 minutos esta semana? Te mando el PDF. Gracias.” — Enviado martes 10:12; Laura respondió miércoles; Ana reportó el viernes qué cambió en el CV.",
      template: `Mapa de 5
1. (emocional) ___ · favor: ___
2. (emocional) ___ · favor: ___
3. (profesional) ___ · favor: ___
4. (profesional) ___ · favor: ___
5. (puente) ___ · favor: ___

Mensaje
Hola ___,
Estoy en transición hacia ___.
¿Me podrías ayudar con ___ (revisión CV / intro a ___ / mock 15 min) esta semana?
Te mando lo necesario. Gracias,
___

Accountability: cada ___ a las ___ con ___`,
      tasks: [
        { id: "n1", label: "Escribir lista de 5 personas + favor concreto", minutes: 20 },
        { id: "n2", label: "Enviar al menos 2 mensajes hoy o mañana", minutes: 15 },
        { id: "n3", label: "Agendar 1 accountability semanal (4 semanas)", minutes: 10 },
      ],
    },
    {
      id: "energia-limites",
      title: "Energía, límites y anti-burnout",
      teaser: "Horario de cierre y micro-wins.",
      why: "Sin límite de jornada, la búsqueda se come el sueño y bajas tu rendimiento justo cuando más lo necesitas (entrevistas, negociación). El burnout de transición se disfraza de “estoy muy dedicado”. Aquí defines cierre real, regla anti-Easy-Apply nocturno, micro-wins visibles y un plan B si el cuerpo dice basta.",
      howTo: [
        {
          title: "Define hora de cierre de oficina y pon alarma real",
          minutes: 10,
          detail:
            "Elige una hora (ej. 17:30) alineada a tu sueño. Alarma con nombre “Cierre búsqueda”. Al sonar: guardas, cierras pestañas de empleo, anotas el micro-win del día. Si “solo 10 minutos más” es tu frase habitual, el cierre debe ser más temprano, no más tarde. Comunica el horario a quien viva contigo para que te ayuden a cumplirlo.",
        },
        {
          title: "Regla dura: después del cierre, cero Easy Apply / cero CV",
          minutes: 5,
          detail:
            "Escribe la regla en un post-it: “Después de ___: no postulo, no edito CV, no LinkedIn”. Si aparece una “urgencia”, la anotas en una lista “mañana oficina” y duermes. Excepción única: entrevista agendada por el empleador en ese horario. Todo lo demás espera. Sin esta regla, el cierre es decorativo.",
        },
        {
          title: "Celebra y registra 1 micro-win al día",
          minutes: 10,
          detail:
            "Al cerrar, una línea en tu nota: qué hiciste bien (envié 1 mensaje personalizado, terminé sección de logros, dormí 7 h). No hace falta que sea “conseguí entrevista”. Relee los micro-wins el domingo: verás progreso invisible. Si un día el win es “pedí ayuda”, cuenta igual.",
        },
        {
          title: "Señal de burnout → prioriza sueño y estabilización",
          minutes: 15,
          detail:
            "Señales: irritabilidad, errores tontos en CV, evitar llamadas, sueño roto, odio a abrir el correo. Si aparecen 3+ días: reduces oficina a 45 minutos, cancelas simulacros intensos, recuperas anclas de la lección 1. No negocies oferta ni hagas video-mock en pico de burnout: primero cuerpo, luego estrategia. Anota tu “protocolo de pausa” ahora, en frío.",
        },
      ],
      tips: [
        "El doomscroll no es investigación de mercado.",
        "Si fallas un día, reinicia al siguiente sin culpa ni “maratón de recuperación”.",
        "Protege 1 bloque social o hobby a la semana: no es lujo, es combustible.",
      ],
      example:
        "Carlos (Medellín) cerraba a las 18:00 con alarma. De 18 a 19:30 gym o cena. Micro-win en Notion. En tres semanas pasó de 2 envíos de calidad/semana a 6, y llegó a filtros telefónicos sin ojeras de “noche de LinkedIn”.",
      template: `Mis límites
Cierre oficina: ___ · alarma: sí/no
Qué NO hago después: Easy Apply / editar CV / LinkedIn / …
Micro-win de hoy: …
Señales de burnout que vigilo: …
Si aparecen → protocolo: dormir / oficina 45 min / pedir ayuda a ___`,
      tasks: [
        { id: "e1", label: "Fijar hora de cierre y alarma", minutes: 5 },
        { id: "e2", label: "Escribir 3 micro-wins de esta semana (o el plan para anotarlos)", minutes: 10 },
      ],
    },
    {
      id: "liquidacion",
      title: "Al terminar el contrato: liquidación (orientativo CO)",
      teaser: "Qué pedir por escrito y qué archivar.",
      why: "Sin documentos claros, después es más difícil entender o reclamar tu liquidación. Muchas personas firman “paz y salvo” por prisa o miedo. Esta lección es una checklist educativa (no asesoría jurídica): qué pedir por escrito, qué archivar y qué no firmar a ciegas. Si hay disputa, un abogado laboral es quien decide estrategia.",
      howTo: [
        {
          title: "Solicita liquidación detallada por escrito",
          minutes: 20,
          detail:
            "Correo a RRHH/nómina pidiendo: liquidación con conceptos desglosados (salarios pendientes, vacaciones, prima, cesantías/intereses si aplican), fecha de pago y medio. Pide también copia de la carta o correo de terminación. Guarda el hilo completo. Si solo te dan un total sin conceptos, insiste una vez con tono factual: “necesito el detalle por rubro para mi archivo”.",
        },
        {
          title: "Arma la carpeta de evidencia (PDF + capturas)",
          minutes: 30,
          detail:
            "Carpeta digital: contrato, últimos desprendibles (3–6 meses), carta/correo de terminación, chats relevantes exportados a PDF, liquidación cuando llegue. Nombra archivos con fecha. Esto te sirve para caja de compensación, consultas legales y tu propia calma. No dependas del portal de la empresa: a veces se apaga el acceso.",
        },
        {
          title: "Anota si fue con o sin justa causa (y si hay duda, consulta)",
          minutes: 15,
          detail:
            "En tu nota: tipo de terminación según te informaron. Si el relato de la empresa no cuadra con lo que viviste, no pelees solo por WhatsApp: agenda orientación con abogado laboral o consultorio universitario. Esta app no califica tu caso. Tu trabajo hoy es documentar hechos y fechas, no improvisar amenazas.",
        },
        {
          title: "Pregunta continuidad de seguridad social / caja",
          minutes: 15,
          detail:
            "En el mismo correo o uno aparte: ¿hasta cuándo están cubiertos aportes? ¿qué pasa con caja de compensación? Anota la respuesta. Si no responden, llama y registra fecha/hora/nombre. Evita huecos de cobertura por asumir que “ya queda listo”.",
        },
      ],
      tips: [
        "No firmes paz y salvo sin haber recibido o entendido la liquidación.",
        "Si hay salario variable, pide el promedio usado en el cálculo.",
        "Esto es checklist educativa, no asesoría jurídica.",
      ],
      example:
        "Correo: “Por favor envíen liquidación detallada con conceptos y fecha de pago, y copia de la carta de terminación. Quedo atento/a.” — Enviado con copia a tu correo personal; respuesta en 3 días hábiles con PDF adjunto.",
      template: `Solicitud de liquidación
Para: RRHH / nómina
Asunto: Liquidación y documentos de terminación
Cuerpo:
Solicito liquidación detallada (conceptos y fecha de pago), carta de terminación y constancia de aportes.
Nombre · cédula · último cargo · fechas de ingreso/retiro
Carpeta local: contrato / desprendibles / chats / liquidación`,
      tasks: [
        { id: "l1", label: "Enviar solicitud de liquidación por escrito", minutes: 15 },
        { id: "l2", label: "Armar carpeta con contrato + desprendibles + chats", minutes: 25 },
      ],
    },
    {
      id: "cesantias",
      title: "Cesantías y prestaciones: revisar línea a línea",
      teaser: "No asumas plazos de memoria.",
      why: "Los errores de liquidación se detectan comparando conceptos, no “de oídas” ni con calculadoras de redes. Esta lección te obliga a una tabla simple: esperado vs pagado. Si no cuadra, sales con dudas concretas para un profesional — no con una bronca difusa.",
      howTo: [
        {
          title: "Marca en la liquidación cada rubro clave",
          minutes: 20,
          detail:
            "Con resaltador o comentario en PDF: cesantías, intereses sobre cesantías, prima, vacaciones proporcionales, salarios pendientes, otros. Si un concepto no aparece y crees que debería, anótalo como duda (no como hecho). Separar “no está” de “no entiendo el nombre del rubro”.",
        },
        {
          title: "Compara con desprendibles (días y base salarial)",
          minutes: 25,
          detail:
            "Abre 2–3 desprendibles recientes. Anota salario base y días. Cruza con lo pagado. No hace falta ser contador: busca inconsistencias gordas (meses de menos, base distinta). Si hubo aumentos a mitad de periodo, anota la fecha del cambio.",
        },
        {
          title: "Si hubo comisiones o variable, verifica el promedio",
          minutes: 20,
          detail:
            "Pide por escrito qué promedio usaron y de qué meses. Compara con tus reportes de comisiones. Diferencias aquí son frecuentes. Si no te dan el detalle, esa negativa también es evidencia para tu consulta.",
        },
        {
          title: "Lista 1–3 dudas concretas (para abogado o RRHH)",
          minutes: 15,
          detail:
            "Formato: “Concepto X: esperaba Y porque Z; pagaron W”. Nada de “todo está mal”. Con 1–3 dudas claras avanzas más que con un ensayo emocional. Si todo cuadra, también anótalo: “revisado OK el ___” — cierra el ciclo mental.",
        },
      ],
      tips: [
        "Fotografía o PDF cada página de la liquidación.",
        "No mezcles “me parece bajo” con “no entiendo el concepto”: aclara primero.",
      ],
      example:
        "Tabla: Concepto | Esperado (aprox.) | Pagado | Diferencia | Nota. María encontró vacaciones proporcionales con 3 días de menos; escribió una sola pregunta a nómina y corrigieron en una semana.",
      template: `Revisión liquidación
Concepto | Esperado | Pagado | ¿OK? | Nota
Cesantías | | | |
Intereses | | | |
Prima | | | |
Vacaciones | | | |
Otros | | | |
Dudas concretas (máx. 3):
1. …
2. …
3. …`,
      tasks: [
        { id: "c1", label: "Completar tabla concepto vs pagado", minutes: 30 },
        { id: "c2", label: "Listar 1–3 dudas concretas (si las hay)", minutes: 10 },
      ],
    },
    {
      id: "cesante",
      title: "Protección al cesante y caja de compensación",
      teaser: "Beneficios y mecanismos públicos (si aplican).",
      why: "Puedes dejar plata, capacitación y red sobre la mesa por no preguntar a tu caja. Requisitos cambian: esta lección te obliga a una gestión real (llamada/chat/portal) y a anotar la respuesta, aunque sea “no aplica”. Rumores de WhatsApp no cuentan como investigación.",
      howTo: [
        {
          title: "Identifica tu caja y canal oficial de contacto",
          minutes: 15,
          detail:
            "Busca en desprendible o certificado de afiliación el nombre de la caja. Entra al portal oficial o app; anota teléfono/chat. Evita intermediarios dudosos. Si no sabes cuál es, pregunta a ex-RRHH por escrito y guarda la respuesta.",
        },
        {
          title: "Haz la ronda de preguntas (beneficios, desempleo, capacitaciones)",
          minutes: 25,
          detail:
            "Usa la plantilla: beneficios como cesante, mecanismos/cuotas de desempleo si existen y requisitos, capacitaciones abiertas, documentos a radicar. Anota nombre de quien te atiende y fecha. Si el bot no ayuda, insiste por llamada. Objetivo: una respuesta verificable, no un “creo que sí”.",
        },
        {
          title: "Actualiza HV en mecanismos públicos solo si te sirve",
          minutes: 20,
          detail:
            "Si la caja o el servicio de empleo te pide perfil, completa lo mínimo bien (rol target + keywords honestas). No pierdas un día entero en portales de bajo retorno: 20–40 minutos y vuelves a tu oficina de búsqueda. Anota usuario/contraseña en tu gestor.",
        },
        {
          title: "Agenda la gestión esta semana (no “para después”)",
          minutes: 5,
          detail:
            "Bloque en calendario: “Caja / cesante” con día y hora. Si lo dejas sin fecha, no ocurre. Al terminar, marca en tu tablero: contactado / respuesta / próximos documentos.",
        },
      ],
      tips: [
        "Requisitos cambian: confirma siempre con la caja, no con rumores.",
        "Lleva cédula y carta de terminación a las gestiones.",
      ],
      example:
        "“Hola, quedé cesante el ___. ¿Qué beneficios y capacitaciones aplican con mis aportes? ¿Qué documentos necesitan?” — Diego (Cali) llamó jueves 10:00; le listaron 2 cursos y un requisito que no cumplía; igual cerró el tema sin culpa.",
      template: `Preguntas a la caja
Caja: ___ · canal: ___ · fecha contacto: ___
1. ¿Qué beneficios tengo como cesante?
2. ¿Hay cuota/mecanismo de desempleo? Requisitos:
3. ¿Capacitaciones abiertas este mes?
4. Documentos a radicar: …
Respuesta (literal o resumen): …
Próximo paso: …`,
      tasks: [
        { id: "z1", label: "Contactar caja / revisar portal esta semana", minutes: 20 },
        { id: "z2", label: "Anotar beneficios aplicables (aunque digan “ninguno”)", minutes: 10 },
      ],
    },
    {
      id: "nuevo-empleo",
      title: "Al firmar el nuevo empleo",
      teaser: "Contrato, prueba y acuerdos por escrito.",
      why: "El entusiasmo hace firmar mal. Un checklist de 15–20 minutos evita dolores de los primeros 90 días: tipo de contrato, prueba, fijo vs variable, modalidad y promesas verbales convertidas en correo. Firmar no es el final del curso: es el momento de proteger lo acordado.",
      howTo: [
        {
          title: "Lee tipo de contrato y periodo de prueba en voz alta",
          minutes: 15,
          detail:
            "Identifica: indefinido, fijo, obra/labor, prestación de servicios. Marca duración de prueba y qué implica (terminación, evaluación). Si no entiendes una cláusula, pregunta por escrito antes de firmar. No asumas que “es el contrato de siempre”.",
        },
        {
          title: "Confirma salario fijo vs variable, beneficios y modalidad",
          minutes: 15,
          detail:
            "Tabla mental o en papel: fijo mensual, variable (fórmula), beneficios, sede/remoto/híbrido, horarios. Si el offer letter y el contrato difieren, detente y pide alineación. La modalidad “flexible” debe decir días en oficina si aplica.",
        },
        {
          title: "Pide reglamento interno / código de ética si aplica",
          minutes: 10,
          detail:
            "En empresas formales suele existir. Tenerlo evita sorpresas (dispositivos, confidencialidad, redes). Si no te lo dan, deja constancia de que lo solicitaste. Léelo en diagonal buscando conflictos de interés y uso de herramientas.",
        },
        {
          title: "Todo acuerdo verbal → correo de confirmación el mismo día",
          minutes: 15,
          detail:
            "Bonos, equipo, horario especial, “te subimos en 6 meses”: un mail corto confirmando lo hablado. Tono cordial, hechos, sin amenazas. Si no confirman por escrito, asume que no existe para tu planificación. Guarda el hilo en la carpeta del nuevo empleo.",
        },
      ],
      tips: [
        "No firmes renuncias de derechos a cambio de promesas verbales.",
        "Si es prestación de servicios, entiende implicaciones de seguridad social con alguien idóneo.",
      ],
      example:
        "“Gracias. Confirmo por este medio: salario $___, inicio ___, modalidad ___, periodo de prueba ___ días, bono ___ según ___.” — Enviado 20 minutos después de la llamada con HR; respondieron “correcto” el mismo día.",
      template: `Checklist firma
Tipo contrato: …
Periodo de prueba: …
Salario fijo / variable: …
Remoto / híbrido / sede: …
Beneficios: …
Reglamento solicitado: sí/no
Acuerdos verbales confirmados por mail: sí/no · fecha ___
Dudas pendientes antes de firmar: …`,
      tasks: [
        { id: "f1", label: "Completar checklist antes de firmar (o al firmar)", minutes: 15 },
        { id: "f2", label: "Enviar correo confirmando acuerdos clave", minutes: 10 },
      ],
    },
  ],
};
