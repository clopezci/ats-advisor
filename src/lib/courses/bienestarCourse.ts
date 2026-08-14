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
      why: "Los primeros días después de un corte laboral son caóticos. Sin una rutina corta, o no haces nada o te quemas enviando CVs a ciegas.",
      howTo: [
        "Elige 3 anclas diarias: sueño (misma hora ±30 min), comida real, 30–45 min de movimiento.",
        "Bloquea 1 sola “oficina de búsqueda” de 90–120 minutos (no 14 horas).",
        "Escribe en una hoja: qué terminó / qué conservas / qué quieres atraer (sin juicios).",
        "Limita LinkedIn a 2 ventanas fijas al día; fuera de eso, ejecución (CV, red, ATS).",
        "Si hay crisis de ansiedad o ideas de daño: busca ayuda profesional / líneas locales. Esta app no es terapia.",
      ],
      tips: [
        "La constancia de 45 minutos diarios gana a un sprint de 3 días.",
        "Separa “duelo” (lo que sientes) de “plan” (lo que haces). Ambos importan; no los mezcles en el mismo bloque.",
        "Un micro-win (1 envío bien hecho) vale más que 20 genéricos.",
      ],
      example:
        "Ana (Bogotá) perdió su rol el viernes. Lunes–viernes: 7:30 caminata 30 min, 9:00–11:00 oficina de búsqueda, 21:30 apaga pantallas. En 10 días tenía CV ATS + 5 mensajes de red, sin insomnia.",
      template: `Mi rutina 14 días
Sueño: ___ a ___
Movimiento: ___ min · ___ (caminar/gym)
Oficina de búsqueda: de ___ a ___ (solo eso)
LinkedIn permitido: ___ y ___
Qué terminó: …
Qué conservo: …
Qué quiero atraer: …`,
      tasks: [
        { id: "r1", label: "Escribir qué terminó / conservas / quieres atraer", minutes: 15 },
        { id: "r2", label: "Definir horario de oficina de búsqueda (máx. 2 h)", minutes: 10 },
        { id: "r3", label: "Agendar 30–45 min de movimiento mañana o hoy", minutes: 5 },
      ],
    },
    {
      id: "red-apoyo",
      title: "Red de apoyo (no solo “avísame si hay vacante”)",
      teaser: "5 personas + favores concretos.",
      why: "El mercado oculto y el ánimo dependen de personas reales. Pedir “si ves algo” casi nunca funciona.",
      howTo: [
        "Lista 5 nombres: 2 cercanos emocionales, 2 profesionales, 1 “puente” a otra industria.",
        "Para cada uno escribe UN favor concreto (revisar CV, intro a 1 persona, mock de filtro, café 20 min).",
        "Manda el mensaje en 48 h (plantilla abajo).",
        "Agenda 1 café o llamada semanal de accountability las próximas 4 semanas.",
      ],
      tips: [
        "Pide algo que la otra persona pueda hacer en <20 minutos.",
        "Agradece y reporta el resultado; eso abre la puerta a un segundo favor.",
        "No uses a tu red solo como banco de vacantes: úsala como espejo y acelerador.",
      ],
      example:
        "“Hola Laura, estoy en transición a analista de datos. ¿Me podrías revisar 1 página de CV 10 minutos esta semana? Te mando el PDF. Gracias.”",
      template: `Mensaje de favor concreto
Hola ___,
Estoy en transición hacia ___.
¿Me podrías ayudar con ___ (revisión CV / intro a ___ / mock 15 min) esta semana?
Te mando lo necesario. Gracias,
___`,
      tasks: [
        { id: "n1", label: "Escribir lista de 5 personas + favor concreto", minutes: 20 },
        { id: "n2", label: "Enviar al menos 2 mensajes hoy o mañana", minutes: 15 },
        { id: "n3", label: "Agendar 1 accountability semanal", minutes: 10 },
      ],
    },
    {
      id: "energia-limites",
      title: "Energía, límites y anti-burnout",
      teaser: "Horario de cierre y micro-wins.",
      why: "Sin límite, la búsqueda se come el sueño y bajas tu rendimiento en entrevistas.",
      howTo: [
        "Define hora de cierre de “oficina” (ej. 17:30). Alarma real.",
        "Regla: después del cierre, nada de Easy Apply.",
        "Celebra 1 micro-win al día (anótalo).",
        "Si hay burnout: prioriza sueño + estabilización antes de negociar o simular entrevistas intensas.",
      ],
      tips: [
        "El doomscroll no es “investigación de mercado”.",
        "Si fallas un día, reinicia al siguiente sin culpa.",
        "Protege 1 bloque social o hobby a la semana: no es lujo, es combustible.",
      ],
      example:
        "Carlos cerraba a las 18:00. De 18 a 19:30 gym o cena. Subió su racha de envíos de calidad de 2/semana a 6/semana.",
      template: `Mis límites
Cierre oficina: ___
Qué NO hago después: …
Micro-win de hoy: …
Señal de burnout (si aparece): … → acción: dormir / pausa / pedir ayuda`,
      tasks: [
        { id: "e1", label: "Fijar hora de cierre y alarma", minutes: 5 },
        { id: "e2", label: "Escribir 3 micro-wins de esta semana", minutes: 10 },
      ],
    },
    {
      id: "liquidacion",
      title: "Al terminar el contrato: liquidación (orientativo CO)",
      teaser: "Qué pedir por escrito y qué archivar.",
      why: "Sin documentos claros, después es más difícil reclamar o entender tu liquidación.",
      howTo: [
        "Pide por escrito: liquidación con conceptos (salarios, vacaciones, prima, cesantías/intereses si aplican) y fecha de pago.",
        "Guarda: contrato, desprendibles, carta/correo de terminación, chats relevantes (PDF o capturas).",
        "Anota si fue con o sin justa causa (si hay duda, consulta abogado laboral).",
        "Pregunta continuidad de seguridad social / caja en la transición.",
      ],
      tips: [
        "No firmes “paz y salvo” sin haber recibido o entendido la liquidación.",
        "Si hay salario variable, pide el promedio usado.",
        "Esto es checklist educativa, no asesoría jurídica.",
      ],
      example:
        "Correo: “Por favor envíen liquidación detallada con conceptos y fecha de pago, y copia de la carta de terminación. Quedo atento/a.”",
      template: `Solicitud de liquidación
Para: RRHH / nómina
Asunto: Liquidación y documentos de terminación
Cuerpo:
Solicito liquidación detallada (conceptos y fecha de pago), carta de terminación y constancia de aportes.
Nombre · cédula · último cargo · fechas`,
      tasks: [
        { id: "l1", label: "Enviar solicitud de liquidación por escrito", minutes: 15 },
        { id: "l2", label: "Armar carpeta con contrato + desprendibles + chats", minutes: 25 },
      ],
    },
    {
      id: "cesantias",
      title: "Cesantías y prestaciones: revisar línea a línea",
      teaser: "No asumas plazos de memoria.",
      why: "Errores de liquidación se detectan comparando conceptos, no “de oídas”.",
      howTo: [
        "Marca en la liquidación: cesantías, intereses, prima, vacaciones proporcionales.",
        "Compara con tus desprendibles (días trabajados, salario base).",
        "Si hubo comisiones, verifica el promedio.",
        "Anota dudas y llévalas a una consulta laboral si el monto no cuadra.",
      ],
      tips: [
        "Fotografía o PDF cada página de la liquidación.",
        "No mezcles “me parece bajo” con “no entiendo el concepto”: aclara primero.",
      ],
      example:
        "Tabla simple: Concepto | Esperado (aprox.) | Pagado | Diferencia | Nota.",
      template: `Revisión liquidación
Concepto | Esperado | Pagado | ¿OK?
Cesantías | | |
Intereses | | |
Prima | | |
Vacaciones | | |
Otros | | |
Dudas para abogado: …`,
      tasks: [
        { id: "c1", label: "Completar tabla concepto vs pagado", minutes: 30 },
        { id: "c2", label: "Listar 1–3 dudas concretas (si las hay)", minutes: 10 },
      ],
    },
    {
      id: "cesante",
      title: "Protección al cesante y caja de compensación",
      teaser: "Beneficios y mecanismos públicos (si aplican).",
      why: "Puedes dejar plata y formación sobre la mesa por no preguntar a tu caja.",
      howTo: [
        "Identifica tu caja de compensación y canales de contacto.",
        "Pregunta: capacitaciones, cuotas/mecanismos de desempleo si cumples requisitos, ferias.",
        "Actualiza HV en mecanismos públicos de empleo si te sirve para red.",
        "Agenda 1 llamada o chat esta semana (no lo dejes “para después”).",
      ],
      tips: [
        "Requisitos cambian: confirma siempre con la caja, no con rumores de WhatsApp.",
        "Lleva cédula y carta de terminación a la gestiones.",
      ],
      example:
        "“Hola, quedé cesante el ___. ¿Qué beneficios y capacitaciones aplican con mi aportes? ¿Qué documentos necesitan?”",
      template: `Preguntas a la caja
1. ¿Qué beneficios tengo como cesante?
2. ¿Hay cuota/mecanismo de desempleo? Requisitos:
3. ¿Capacitaciones abiertas este mes?
4. Documentos a radicar: …`,
      tasks: [
        { id: "z1", label: "Contactar caja / revisar portal esta semana", minutes: 20 },
        { id: "z2", label: "Anotar beneficios aplicables (aunque digan “ninguno”)", minutes: 10 },
      ],
    },
    {
      id: "nuevo-empleo",
      title: "Al firmar el nuevo empleo",
      teaser: "Contrato, prueba y acuerdos por escrito.",
      why: "El entusiasmo hace firmar mal. Un checklist de 15 minutos evita dolores de 90 días.",
      howTo: [
        "Lee tipo de contrato (indefinido, fijo, prestación) y periodo de prueba.",
        "Confirma salario fijo vs variable, beneficios y política de remoto/híbrido.",
        "Pide reglamento interno / código de ética si aplica.",
        "Todo acuerdo verbal (bono, equipo, horario) → correo de confirmación.",
      ],
      tips: [
        "No firmes renuncias de derechos a cambio de promesas verbales.",
        "Si es prestación de servicios, entiende implicaciones de seguridad social.",
      ],
      example:
        "“Gracias. Confirmo por este medio: salario $___, inicio ___, modalidad ___, periodo de prueba ___ días, bono ___ según ___.”",
      template: `Checklist firma
Tipo contrato: …
Periodo de prueba: …
Salario fijo / variable: …
Remoto / híbrido / sede: …
Beneficios: …
Acuerdos verbales confirmados por mail: sí/no
Dudas pendientes: …`,
      tasks: [
        { id: "f1", label: "Completar checklist antes de firmar (o al firmar)", minutes: 15 },
        { id: "f2", label: "Enviar correo confirmando acuerdos clave", minutes: 10 },
      ],
    },
  ],
};
