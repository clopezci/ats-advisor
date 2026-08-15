export type ToolLessonEnrichment = {
  why: string;
  howTo: string[]; // 4-6 concrete steps
  tips: string[]; // 3 tips
  example: string; // LATAM named example with city
  template: string; // fill-in template
};

export function toolEnrichmentKey(courseId: string, lessonIndex: number) {
  return `${courseId}-l${lessonIndex + 1}`;
}

export const TOOL_LESSON_ENRICHMENTS: Record<string, ToolLessonEnrichment> = {
  // ── linkedin-opt ──────────────────────────────────────────────
  "linkedin-opt-l1": {
    why: "El headline es la etiqueta que aparece en búsquedas, mensajes y comentarios. Un título genérico ('Analista', 'Profesional') te hace invisible; uno con rol + valor + audiencia te hace elegible en 2 segundos.",
    howTo: [
      "Abre 2–3 ofertas del rol que quieres y subraya el cargo exacto y 2 resultados que piden (no skills sueltas).",
      "Escribe versión A: [Rol target] | [resultado concreto] | [para quién/sector].",
      "Escribe versión B: mismo rol + ciudad o modalidad (remoto/híbrido) si eso filtra a tu favor.",
      "Escribe versión C: más corta (≤110 caracteres) para que no se corte en móvil.",
      "Léelas en voz alta: si suena a slogan vacío, cambia el resultado por un número o verbo de impacto.",
      "Elige una y guárdala; las otras quedan como variantes por industria.",
    ],
    tips: [
      "Evita 'Apasionado por…' y emojis excesivos; prioriza claridad para reclutadores.",
      "No pongas 'En búsqueda activa' como único mensaje: dilo en el About o Open to Work.",
      "Si cambias de sector, el headline debe hablar del destino, no solo del cargo anterior.",
    ],
    example:
      "Sofía, en Medellín, pasó de 'Analista de marketing' a 'Analista de performance | Bajo CAC en e-commerce retail | Latam'. En 10 días recibió 3 InMails de agencias en El Poblado y remoto.",
    template:
      "Headline A: [Rol target] | [resultado que entregas] | [público/sector]. Headline B: [Rol] · [modalidad/ciudad] · [1 keyword clave]. Elegida: [ ] Motivo: [por qué esta versión].",
  },
  "linkedin-opt-l2": {
    why: "El About decide si te escriben después del headline. Un muro de cargo-por-cargo aburre; un About con quién eres, prueba STAR y CTA convierte visitas en mensajes.",
    howTo: [
      "Bloque 1 (2–3 líneas): quién eres hoy + para quién creas valor (frase X–Y–Z).",
      "Bloque 2: un logro STAR corto con número (Situación en ½ línea → Acción → Resultado).",
      "Bloque 3: segundo logro distinto (otro skill o contexto) para mostrar rango.",
      "Bloque 4: cómo trabajas (método, herramientas, estilo) en 2 líneas, sin jerga vacía.",
      "Cierra con CTA concreto: 'Escríbeme por LinkedIn o a [email]' / 'Abierto a roles de…'.",
      "Recorta a ~1.800–2.200 caracteres; los reclutadores leen en diagonal.",
    ],
    tips: [
      "Primera línea visible sin 'ver más': ahí va tu propuesta, no tu biografía escolar.",
      "Usa saltos de párrafo; un bloque denso se abandona.",
      "Los logros deben poder defenderse en entrevista con el mismo número.",
    ],
    example:
      "Martín, en Guadalajara, escribió: 'Ayudo a fintechs a acortar onboarding KYC. En 2024 reduje el tiempo de revisión 28% rediseñando el flujo con el equipo de compliance. Busco roles de Product Ops en México o remoto LATAM — escríbeme.'",
    template:
      "Presentación (X–Y–Z): [ ]. Logro 1 (STAR 3 líneas): [S] / [A] / [R con #]. Logro 2: [ ]. Cómo trabajo: [ ]. CTA: [canal + qué roles].",
  },
  "linkedin-opt-l3": {
    why: "LinkedIn rankea por coincidencia de términos. Sin las keywords del aviso no apareces; con keywords que no puedes defender, te queman en la primera llamada.",
    howTo: [
      "Elige 2 ofertas reales del rol target y pega títulos, requisitos y 'nice to have' en una lista.",
      "Extrae 10–15 términos (herramientas, metodologías, industrias, soft skills nombradas).",
      "Marca cada una: SÍ (la usé y puedo contar un ejemplo) / PARCIAL / NO.",
      "Incorpora solo SÍ (y 1–2 PARCIAL honestos) en headline, About y sección Skills.",
      "Revisa experiencia: en 2–3 viñetas del cargo más relevante, usa el lenguaje del aviso sin inventar.",
      "Guarda la lista: la reutilizarás en CV y carta.",
    ],
    tips: [
      "Keyword ≠ buzzword: 'liderazgo' sin contexto no ayuda; 'lideré squad de 6' sí.",
      "No copies el JD entero al About; suena a spam y a IA cruda.",
      "Actualiza skills cuando cambies de target; LinkedIn no adivina tu pivote.",
    ],
    example:
      "Camila, en Bogotá, sacó de dos avisos de Customer Success: Salesforce, churn, QBR, NPS, onboarding. Solo marcó SÍ las que usó en su rol en Chapinero; subió 4 skills y reescribió 3 viñetas. Empezó a aparecer en búsquedas de reclutadores SaaS.",
    template:
      "Oferta 1: [empresa/rol]. Oferta 2: [ ]. Keywords (10+): [lista]. SÍ defendibles: [ ]. PARCIAL: [ ]. NO (no usar): [ ]. Dónde las pegas: headline / About / Skills / experiencia.",
  },
  "linkedin-opt-l4": {
    why: "Foto, banner y forma de contacto son señales de confianza. Perfiles sin cara clara o sin CTA reciben menos respuestas aunque el texto sea bueno.",
    howTo: [
      "Foto: rostro visible, buen contraste, ropa acorde a tu industria, fondo simple (pared, oficina neutra).",
      "Recorta a los hombros/cabeza; evita selfies anguladas o fotos de grupo recortadas.",
      "Banner: imagen limpia (ciudad, abstracto suave o marca personal mínima) + opcional una línea de valor legible en desktop.",
      "En About o Featured, deja un CTA: email profesional, 'Open to Work' con roles, o 'Escríbeme por InMail'.",
      "Revisa en móvil: ¿se lee el banner? ¿la foto se ve profesional a tamaño chico?",
      "Pide a 1 colega: '¿Confiarías en escribirle a esta persona?' Ajusta según feedback.",
    ],
    tips: [
      "Luz natural de frente > filtro pesado; LinkedIn no es Instagram.",
      "Si estás en transición, Open to Work (visible a reclutadores) suele valer más que esconderlo.",
      "Un CTA sin canal ('hablemos') pierde leads; da email o invita a InMail.",
    ],
    example:
      "Andrés, en Santiago de Chile, cambió una foto de sunglasses por retrato con luz de ventana, banner con skyline suave de Providencia y CTA 'andres.ops@email.com · abierto a Supply Chain híbrido'. La tasa de aceptación de conexiones con reclutadores subió notablemente.",
    template:
      "Foto: [fecha/toma] · vestimenta [ ] · fondo [ ]. Banner: [idea/texto opcional]. CTA visible en: [About/Featured/Open to Work]. Canal: [email/InMail/WhatsApp profesional]. Checklist móvil OK: sí/no.",
  },
  "linkedin-opt-l5": {
    why: "La herramienta acelera un borrador coherente; tu edición de 5–10 minutos es lo que hace que suene a ti y no a plantilla genérica.",
    howTo: [
      "Abre el generador LinkedIn de la app con tu rol target, keywords y 1–2 logros con número listos.",
      "Genera headline y About; cópialos a un doc temporal (no pegues aún en LinkedIn).",
      "Edita 5 minutos: elimina adjetivos vacíos, mete tu vocabulario real, verifica métricas.",
      "Compara con tu headline/About anterior; quédate con lo más claro y defendible.",
      "Pega en LinkedIn, previsualiza en móvil y guarda captura o texto como evidencia del curso.",
      "Define un siguiente paso: pedir feedback a 1 persona o enviar 3 mensajes de outreach con el nuevo perfil.",
    ],
    tips: [
      "Si la IA inventa un logro, bórralo; nunca publiques números que no puedas explicar.",
      "Genera una vez, edita mucho: más prompts no arreglan un About sin hechos.",
      "Actualiza también el cargo actual/headline en Experiencia para que coincida.",
    ],
    example:
      "Valentina, en Monterrey, generó el About en la herramienta, cambió 'optimicé procesos' por 'reduje el ciclo de cotización de 9 a 5 días' y pegó. Al día siguiente un reclutador de San Pedro le escribió citando exactamente esa métrica.",
    template:
      "Borrador IA pegado: [sí/no]. Edits hechos: 1) [ ] 2) [ ] 3) [ ]. Versión final headline: [ ]. About (primeras 2 líneas): [ ]. Publicado: [fecha]. Feedback pedido a: [nombre].",
  },

  // ── carta-postulacion ─────────────────────────────────────────
  "carta-postulacion-l1": {
    why: "Elegir el formato equivocado (carta PDF larga en Easy Apply, o un párrafo flojo cuando piden cover letter) hace que tu mensaje ni se lea. El canal define la longitud y el tono.",
    howTo: [
      "Identifica el canal de postulación: Easy Apply / formulario con adjunto / email al reclutador / mensaje LinkedIn.",
      "Regla práctica: Easy Apply o InMail → mensaje 8–12 líneas; email formal o portal que pide cover letter → 3–4 párrafos; PDF solo si lo solicitan.",
      "Anota restricciones: límite de caracteres, si hay campo 'cover letter', si el CV ya va adjunto.",
      "Decide el entregable de hoy: mensaje corto, email o carta PDF — uno solo.",
      "Escribe en el encabezado del doc: Canal + longitud objetivo + idioma (ES/EN).",
    ],
    tips: [
      "Si el portal tiene campo corto, no pegues una carta de 600 palabras: resume gancho + 1 prueba + CTA.",
      "LinkedIn: el reclutador lee en el móvil; párrafos de 2 líneas.",
      "Nunca envíes carta genérica 'a quien corresponda' si tienes nombre del hiring manager.",
    ],
    example:
      "Julián, en Cali, postulaba por Easy Apply a un rol de analista financiero. En vez de PDF de una página, usó un mensaje de 10 líneas en el campo de notas. El reclutador le respondió el mismo día pidiendo entrevista.",
    template:
      "Vacante: [rol/empresa]. Canal: [Easy Apply / email / LinkedIn / PDF]. Longitud objetivo: [líneas o palabras]. Idioma: [ ]. Nombre destinatario (si existe): [ ]. Formato elegido hoy: [ ].",
  },
  "carta-postulacion-l2": {
    why: "Sin estructura el reclutador abandona a la mitad. Cuatro bloques — gancho, prueba, encaje, cierre — guían la lectura y demuestran que no pegaste un texto genérico.",
    howTo: [
      "Bloque gancho (1–2 frases): rol al que aplicas + por qué esa empresa/equipo (hecho concreto del aviso o del producto).",
      "Bloque prueba (2–4 frases): UN logro con métrica de tu CV, contado en miniatura STAR.",
      "Bloque encaje (2–3 frases): cómo ese logro se traduce a 1–2 requisitos del JD.",
      "Bloque cierre (1–2 frases): disponibilidad + CTA claro ('quedo atento a 15 min' / 'adjunto CV').",
      "Escribe primero 1 frase por bloque; luego expande solo donde falte evidencia.",
      "Lee en voz alta: si un bloque no aporta, córtalo.",
    ],
    tips: [
      "Un solo logro profundo > tres logros sin número.",
      "El gancho no es 'me encantaría trabajar con ustedes'; es relevancia.",
      "El cierre no mendiga; propone el siguiente paso.",
    ],
    example:
      "Daniela, en Puebla, armó: gancho (interés en expansión retail en el Bajío), prueba (subió sell-out 18% en 2 trimestres), encaje (el JD pedía trade marketing regional), cierre (disponible híbrido CDMX–Puebla). La carta cabía en una pantalla de teléfono.",
    template:
      "Gancho: [rol + por qué esta empresa]. Prueba: [logro con #]. Encaje: [requisito JD → tu evidencia]. Cierre: [disponibilidad + CTA]. Borrador unido (8–12 líneas o 3–4 párrafos): [ ].",
  },
  "carta-postulacion-l3": {
    why: "Las cartas genéricas se detectan en segundos. Espejar 3 requisitos reales del aviso demuestra lectura y reduce la sensación de spam masivo.",
    howTo: [
      "Copia del JD tres requisitos imprescindibles (no 'nice to have').",
      "Bajo cada uno escribe: evidencia tuya (proyecto, métrica, herramienta) o 'no aplico / parcial'.",
      "Prioriza los 2–3 donde tengas prueba fuerte; esos van al cuerpo del mensaje.",
      "Usa el vocabulario del aviso solo donde sea honesto (mismas tools, mismos verbos de impacto).",
      "Tacha cualquier frase que podría servir para cualquier empresa ('soy responsable y trabajo en equipo').",
      "Revisa: si quitas el nombre de la empresa, ¿sigue siendo obvio que es para ESA vacante? Si no, reescribe el gancho.",
    ],
    tips: [
      "No inventes experiencia para 'cuadrar' el JD; mejor omitir y brillar en lo real.",
      "Si te falta 1 requisito, dilo con plan breve ('hoy uso X; en 30 días certifiqué Y') solo si es creíble.",
      "Guarda el espejo requisito↔evidencia: te sirve en la entrevista.",
    ],
    example:
      "Rocío, en Barranquilla, alineó tres requisitos de un rol de CX: CRM Zendesk (lo usó 2 años), NPS (subió 12 pts) e inglés B2 (lo defiende en calls). Eliminó un párrafo genérico de 'pasión por el cliente'. La pasaron a filtro telefónico.",
    template:
      "Requisito 1 del JD: [ ] → Mi evidencia: [ ]. Requisito 2: [ ] → [ ]. Requisito 3: [ ] → [ ]. Frases genéricas tachadas: [ ]. Oración de encaje final: [ ].",
  },
  "carta-postulacion-l4": {
    why: "El tono vende tanto como el contenido. Mendigar, exagerar o llenar de adjetivos vacíos genera desconfianza aunque el logro sea bueno.",
    howTo: [
      "Lee el borrador en voz alta como si fueras el reclutador con prisa.",
      "Tacha adjetivos sin prueba: proactivo, apasionado, dinámico, excelentes habilidades interpersonales.",
      "Reemplaza cada adjetivo tachado por un hecho o bórralo.",
      "Busca red flags: disculpas ('sé que no cumplo todo'), arrogancia ('soy el mejor'), tono de ruego ('por favor denme la oportunidad').",
      "Ajusta a confianza calmada: hechos + encaje + CTA.",
      "Pide a 1 persona de confianza: '¿Sueno mendigo, soberbio o claro?' Itera una vez.",
    ],
    tips: [
      "Primera persona con verbos de acción > 'se realizó' pasivo corporativo.",
      "Evita emojis y signos de exclamación en exceso en cartas formales.",
      "Si usaste IA, elimina frases típicas ('En el dinámico mundo actual…').",
    ],
    example:
      "Luis, en Ciudad de México, cambió 'Soy un apasionado líder proactivo' por 'Coordiné un equipo de 5 y entregamos el go-live en 6 semanas'. El reclutador en Polanco comentó en la entrevista que el mensaje 'sonaba a persona real'.",
    template:
      "Adjetivos tachados: [lista]. Reemplazos con hechos: [ ]. Red flags encontrados: [ ]. Tono objetivo (1 palabra): claro / seguro / específico. Frase reescrita más fuerte: [ ].",
  },
  "carta-postulacion-l5": {
    why: "El borrador de la herramienta es ~60% del trabajo; tu edición de nombres, métricas y tono es el 40% que decide si suena creíble y personalizado.",
    howTo: [
      "Abre el generador de carta con CV + texto del aviso (o los 3 requisitos ya alineados).",
      "Genera el borrador y pégalo en un doc; no envíes la primera salida.",
      "Edita: nombre correcto de empresa/rol, métricas reales, elimina inventos de la IA.",
      "Ajusta longitud al canal que elegiste en la lección 1.",
      "Haz el tone check de la lección 4 en 3 minutos.",
      "Guarda versión final con fecha y nombre de vacante; envía o pega en el portal.",
    ],
    tips: [
      "Una carta bien editada se reutiliza al 70% para vacantes similares; cambia gancho y espejo de requisitos.",
      "Si el generador inventa un logro, bórralo aunque 'suene bonito'.",
      "Adjunta el CV solo si el canal lo permite; no dupliques el CV entero en la carta.",
    ],
    example:
      "Paula, en Concepción, generó la carta, corrigió el nombre del área (era 'People Ops', no 'RRHH genérico') y bajó de 280 a 160 palabras para el campo del portal. La citaron a entrevista en 4 días.",
    template:
      "Vacante: [ ]. Borrador generado: sí. Edits: nombres [ ] · métricas [ ] · tono [ ]. Longitud final: [ ]. Archivo/versión: [nombre]. Enviado: [fecha/canal].",
  },

  // ── entrevistas-star ──────────────────────────────────────────
  "entrevistas-star-l1": {
    why: "Sin estructura divagas y el entrevistador no retienes tu impacto. STAR (Situación, Tarea, Acción, Resultado) convierte anécdotas en evidencia comparable.",
    howTo: [
      "Elige un logro reciente que puedas contar en 90–120 segundos.",
      "Escribe 1 línea por letra: S (contexto), T (tu responsabilidad), A (lo que hiciste TÚ), R (resultado con número o alcance).",
      "Revisa A: debe estar en primera persona y con verbos concretos (priorticé, negocié, automatizé).",
      "Revisa R: al menos una métrica, plazo o antes/después; si no hay %, usa alcance (N personas, N países).",
      "Practica en voz alta una vez mirando solo las 4 líneas, no un guion largo.",
      "Cronometra: si pasas de 2 minutos, corta Situación a la mitad.",
    ],
    tips: [
      "'Nosotros' está bien una vez; el grueso de Acción debe ser tuyo.",
      "No empieces por el resultado y saltes la acción: el entrevistador quiere el cómo.",
      "Guarda esta historia como plantilla madre del banco.",
    ],
    example:
      "Felipe, en Bogotá, estructuró: S (backlog de tickets +40% en temporada), T (estabilizar SLA), A (reenfoque de cola + playbooks), R (SLA de 12h a 6h en 6 semanas). En la entrevista en Zona T el hiring manager pidió detalle solo de la Acción — ya la tenía clara.",
    template:
      "S (contexto, ≤2 frases): [ ]. T (tu rol/objetivo): [ ]. A (3–5 acciones tuyas): [ ]. R (métrica o alcance): [ ]. Duración oral objetivo: 90–120s.",
  },
  "entrevistas-star-l2": {
    why: "Las mismas 5 historias bien elegidas cubren ~80% de preguntas conductuales. Improvisar cada vez agota y genera respuestas flojas bajo presión.",
    howTo: [
      "Nombra cinco títulos cortos: (1) logro con métrica, (2) conflicto o stakeholder difícil, (3) liderazgo o influencia sin autoridad, (4) error o fracaso, (5) aprendizaje / cambio de enfoque.",
      "Asigna cada título a un rol/empresa y año aproximado.",
      "Para cada una, escribe solo los encabezados S/T/A/R en 4 líneas (aún sin pulir).",
      "Marca con ★ las 2 más relevantes al rol target actual.",
      "Verifica que no sean todas del mismo tipo (solo éxitos o solo un empleo).",
      "Guarda el banco en una nota accesible antes de entrevistas.",
    ],
    tips: [
      "El error debe mostrar reparación y aprendizaje, no autoflagelación.",
      "Si te faltan historias de liderazgo, usa influencia lateral (pares, otras áreas).",
      "Actualiza el banco cuando cambies de target: prioriza ★ distintas.",
    ],
    example:
      "Natalia, en Medellín, armó su banco: logro (reducción de churn), conflicto (prioridad con Sales), liderazgo (mentoría a 2 juniors), error (deploy sin checklist), aprendizaje (pasó a feature flags). Con esas cinco cubrió casi toda una entrevista de Customer Success.",
    template:
      "1 Logro: [título] · [empresa/año] · ★?. 2 Conflicto: [ ]. 3 Liderazgo/influencia: [ ]. 4 Error: [ ]. 5 Aprendizaje: [ ]. Top 2 para el rol [target]: [ ] y [ ].",
  },
  "entrevistas-star-l3": {
    why: "Despido, gap y debilidad activan tono defensivo. Preparar 60–90 segundos con hechos + aprendizaje + futuro evita que la emoción secuestre la respuesta.",
    howTo: [
      "Redacta '¿Por qué saliste / por qué hay gap?' en 4 frases: hecho → contexto sin culpas → qué hiciste en la transición → qué buscas ahora.",
      "Redacta '¿Cuál es tu debilidad?' con: área real → impacto pasado → qué haces hoy para gestionarla → evidencia breve de mejora.",
      "Elimina ataques a jefes o empresas; el entrevistador escucha madurez, no el juicio.",
      "Grábate o léelo en voz alta una vez; ajusta si suenas a disculpa eterna o a guion rígido.",
      "Prepara una variante de 45s por si cortan el tiempo.",
    ],
    tips: [
      "Hechos laborales > drama personal; lo personal solo si tú eliges y es breve.",
      "Debilidad inventada ('soy perfeccionista') se nota; elige algo real y manejado.",
      "Cierra siempre mirando al rol presente, no al resentimiento del pasado.",
    ],
    example:
      "Óscar, en Guadalajara, preparó: 'Cerraron el área en enero; documenté el handoff de 40 cuentas. Usé el gap para certificar Salesforce y proyectos freelance. Hoy busco CS en B2B SaaS.' Pasó el filtro donde antes se trababa.",
    template:
      "Salida/gap (60–90s): [hecho]. [aporte en la transición]. [qué hiciste en el gap]. [qué buscas ahora]. Debilidad: [área]. [gestión actual]. [evidencia de mejora].",
  },
  "entrevistas-star-l4": {
    why: "Preguntar bien demuestra criterio y cierra con interés real. 'No tengo preguntas' suele leerse como desinterés o falta de preparación.",
    howTo: [
      "Prepara 3 preguntas: (1) éxito a 90 días en el rol, (2) retos actuales del equipo, (3) cómo se toma feedback / cómo es el manager.",
      "Personaliza al menos una con algo del aviso, del producto o de la entrevista.",
      "Evita preguntas cuya respuesta está en la web (tamaño de la empresa, 'qué hacen').",
      "Deja sueldo/beneficios para el momento adecuado (filtro u oferta), salvo que ellos lo abran.",
      "Escribe las 3 en una tarjeta; elige 2 según cómo fluya la conversación.",
    ],
    tips: [
      "Preguntas sobre prioridades y métricas de éxito > preguntas genéricas de 'cultura divertida'.",
      "Escucha la respuesta y haz un follow-up corto; demuestra que oíste.",
      "Si entrevistas con varias personas, no repitas la misma pregunta idéntica sin adaptar.",
    ],
    example:
      "Inés, en Santiago, preguntó: '¿Cómo se ve el éxito a 90 días para esta plaza de data analyst?' y '¿Qué decisión de datos les duele hoy al equipo de finanzas en Las Condes?' El manager alargó la entrevista 15 minutos.",
    template:
      "Q1 (90 días): [ ]. Q2 (retos del equipo): [ ]. Q3 (manager/feedback o colaboración): [ ]. Personalización basada en: [aviso/producto/comentario]. Las 2 que usaré primero: [ ].",
  },
  "entrevistas-star-l5": {
    why: "La repetición en un entorno seguro baja ansiedad y revela muletillas. Una ronda con feedback concreto vale más que releer apuntes.",
    howTo: [
      "Elige 1 historia ★ del banco y 1 pregunta difícil ya redactada.",
      "Abre el simulador STAR de la app y completa al menos 1 ronda completa.",
      "Anota 2 mejoras específicas (ej. 'acortar Situación', 'más yo en Acción', 'número al inicio del Resultado').",
      "Reescribe las 4 líneas S/T/A/R con esos ajustes.",
      "Haz una segunda pasada oral de 90s sin leer; compara con la primera.",
      "Guarda score o notas como evidencia del curso.",
    ],
    tips: [
      "Practica de pie o sentado como en la entrevista real; el cuerpo afecta el ritmo.",
      "No memorices palabra por palabra: memoriza la estructura y los números.",
      "Si el feedback es genérico, pídele a la herramienta o a un colega un solo cambio accionable.",
    ],
    example:
      "Tomás, en Monterrey, hizo una ronda en el simulador, acortó la Situación de 40s a 15s y puso la métrica al final con más fuerza. En la entrevista real del día siguiente no se quedó sin tiempo.",
    template:
      "Ronda 1: pregunta [ ] · historia usada [ ]. Mejoras: 1) [ ] 2) [ ]. STAR reescrito: S[ ] T[ ] A[ ] R[ ]. Ronda 2 hecha: sí/no. Sensación 1–5: [ ].",
  },

  // ── filtro-telefonico ─────────────────────────────────────────
  "filtro-telefonico-l1": {
    why: "El filtro telefónico descarta por encaje rápido (logística, pretensión, claridad). No es la entrevista final: si improvisas tus límites, te eliminan o te encierras en un número malo.",
    howTo: [
      "Lista en una hoja qué SÍ aceptas: ciudades, modalidad (remoto/híbrido/presencial), viaje, tipo de contrato.",
      "Lista qué NO aceptas (dealbreakers) y qué es negociable.",
      "Define tu fecha de inicio realista (ej. '2 semanas tras oferta firmada').",
      "Anota el rango salarial mental (piso/meta) aunque lo profundices en la lección de pretensión.",
      "Ensaye responder en 15–20s: 'Busco X modalidad en Y zona; puedo empezar Z'.",
    ],
    tips: [
      "Dealbreakers honestos ahorran procesos que abandonarías en la semana 2.",
      "Si todo es 'flexible', el reclutador oye indecisión; da preferencia + margen.",
      "Ten agua y el CV a mano: el filtro suele ser sorpresa en horario laboral.",
    ],
    example:
      "Carolina, en Bucaramanga, escribió: SÍ híbrido Bogotá o remoto Colombia; NO presencial 5 días fuera de Santander; inicio en 3 semanas. En el filtro dijo exactamente eso y avanzó solo a procesos compatibles.",
    template:
      "SÍ: modalidad [ ] · ciudades [ ] · contrato [ ]. NO (dealbreakers): [ ]. Negociable: [ ]. Inicio: [ ]. Frase 20s de encaje: [ ].",
  },
  "filtro-telefonico-l2": {
    why: "Disponibilidad y logística son preguntas de filtro casi siempre. Respuestas vagas ('lo hablamos después', 'soy flexible del todo') matan el avance o generan malentendidos.",
    howTo: [
      "Escribe tu respuesta de ~20 segundos a: ¿Cuándo puedes empezar? ¿Presencial/híbrido/remoto? ¿Viajes?",
      "Incluye una preferencia clara y un plan B aceptable.",
      "Si tienes preaviso laboral, dilo con número de días/semanas, no con rodeos.",
      "Practica la frase hasta que no necesites leerla.",
      "Anota excepciones (ej. mudanza, visa, equipo) para no inventar bajo presión.",
    ],
    tips: [
      "Nunca prometas una fecha que tu empleador actual no permite.",
      "Si el rol es presencial y tú quieres remoto, dilo ya: ahorras a ambos.",
      "Tonos neutrales: hechos de logística, no justificación larga de vida personal.",
    ],
    example:
      "Diego, en Querétaro, ensayó: 'Puedo empezar dos semanas después de firmar. Prefiero híbrido 2–3 días en parque industrial; estoy abierto a presencial el primer mes de onboarding.' El reclutador marcó fit y agendó entrevista técnica.",
    template:
      "Inicio: [plazo]. Modalidad preferida: [ ]. Alternativa aceptable: [ ]. Viajes: [sí/no/%]. Preaviso actual: [ ]. Guion 20s: [ ].",
  },
  "filtro-telefonico-l3": {
    why: "Un solo número de pretensión te deja sin margen. Un rango anclado a mercado + piso personal te permite avanzar sin quemarte ni regalar salario.",
    howTo: [
      "Define piso (mínimo para aceptar), meta (número feliz) y, si puedes, techo aspiracional — en tu moneda local.",
      "Arma una frase: 'Manejo un rango de A–B según responsabilidades y paquete total; mi expectativa está cerca de B'.",
      "Si te presionan por un número único, da el rango o la meta con ancla ('según bandas para el rol en [ciudad]').",
      "Practica decirlo en tono calmado, sin disculpas ni desafío.",
      "Decide qué harás si el presupuesto está bajo tu piso: agradecer y preguntar por variable/beneficios, o retirarte.",
    ],
    tips: [
      "No inventes bandas; usa referencias reales (ofertas, colegas, herramienta de salario).",
      "Si aún no tienes datos, di 'estoy cerrando referencias de mercado y puedo compartirte rango mañana' — mejor que un número al azar.",
      "Compensación total importa: a veces el base bajo se compensa con bono/beneficios.",
    ],
    example:
      "María, en Bogotá, fijó piso 6.5M COP, meta 7.5M. En el filtro dijo: 'Manejo 7–8M según el paquete; mi ancla está en 7.5 para el alcance del rol.' La movieron a entrevista con presupuesto compatible.",
    template:
      "Piso: [ ]. Meta: [ ]. Techo: [ ]. Moneda: [ ]. Frase de pretensión: [ ]. Si presupuesto < piso: [mi respuesta]. Ancla de mercado usada: [ ].",
  },
  "filtro-telefonico-l4": {
    why: "'Cuéntame de ti' es la pregunta #1 del filtro. Un pitch de 60s (presente · prueba · por qué este rol) evita el CV hablado de 5 minutos y posiciona encaje.",
    howTo: [
      "Estructura: 15s quién eres hoy + rol target; 25s un logro con número; 20s por qué esta vacante/empresa.",
      "Escribe el guion en 5–7 frases máximo; luego reduce hasta caber en 60s.",
      "Graba un audio en el celular o léelo con cronómetro.",
      "Elimina trayectoria cronológica completa; el filtro no pide autobiografía.",
      "Alinea las keywords del aviso en el pitch sin forzar.",
    ],
    tips: [
      "Empieza en presente ('Hoy soy… / Ayudo a…'), no en el colegio ni en el primer empleo.",
      "Si vienes de transición, 1 frase de salida + puente rápido al valor actual.",
      "Sonríe al hablar por teléfono: se nota en la voz.",
    ],
    example:
      "Sebastián, en Valparaíso, grabó: 'Soy coordinador de proyectos de retail. El año pasado entregué 3 aperturas con 8% bajo presupuesto. Me interesa esta plaza por el rollout omnicanal que describen.' Duró 55s y el reclutador pasó a pretensión.",
    template:
      "Presente (15s): [rol + valor]. Prueba (25s): [logro con #]. Por qué este rol (20s): [encaje con aviso]. Guion unido: [ ]. Tiempo medido: [ ]s.",
  },
  "filtro-telefonico-l5": {
    why: "Ensayar las 3 preguntas típicas con score baja el nerviosismo de la llamada real y revela respuestas largas o flojas antes de que cuenten.",
    howTo: [
      "Abre la herramienta de filtro telefónico en la app.",
      "Completa las 3 preguntas (pitch, logística/disponibilidad, pretensión) como si fuera la llamada.",
      "Revisa el score o feedback y anota 2 mejoras concretas.",
      " Reescribe las frases débiles; vuelve a ensayar solo esas.",
      "Deja a mano la hoja SÍ/NO + rango + pitch para la próxima llamada real.",
      "Agenda un recordatorio: 'Antes de cada filtro, 5 min de repaso'.",
    ],
    tips: [
      "Ensaya de pie, con auriculares, como si el reclutador hubiera marcado ahora.",
      "No leas literal: usa viñetas; la lectura se oye.",
      "Si el score es bajo en pretensión, vuelve a la lección del rango antes de postular más.",
    ],
    example:
      "Andrea, en León (Guanajuato), completó el ensayo, acortó su pitch de 2 minutos a 60s y clarificó el piso. En la llamada real del jueves sonó segura y avanzó a panel.",
    template:
      "Score / notas herramienta: [ ]. Mejoras: 1) [ ] 2) [ ]. Frases finales — Pitch: [ ]. Logística: [ ]. Pretensión: [ ]. Listo para llamada: sí/no.",
  },

  // ── negociacion-oferta ────────────────────────────────────────
  "negociacion-oferta-l1": {
    why: "Negociar solo el sueldo base deja dinero y condiciones en la mesa. La compensación total (base, variable, beneficios, flexibilidad) es lo que realmente comparas entre ofertas.",
    howTo: [
      "Lista componentes: sueldo base, bono/variable, comisiones, aguinaldo/prestaciones de ley, seguros, vales, equipo, home office, días extra, educación, acciones/equity si aplica.",
      "Para tu oferta actual o ideal, pon un valor mensual o anual estimado a cada ítem (aunque sea aproximado).",
      "Marca cuáles son negociables en tu mercado (a menudo: base, bono, firma, home office, fecha de revisión).",
      "Calcula un 'total estimado' para comparar manzanas con manzanas.",
      "Anota qué te importa más a ti (efectivo vs tiempo vs aprendizaje).",
    ],
    tips: [
      "Un base un poco menor con bono alcanzable y buena modalidad puede ganar a un base alto tóxico.",
      "Pide el desglose por escrito antes de aceptar de palabra.",
      "En LATAM, aclara moneda, periodicidad y si el variable es garantizado o no.",
    ],
    example:
      "Ricardo, en Ciudad de México, comparó dos ofertas: A con base más alto pero sin híbrido; B con base 8% menor + bono 15% + 3 días HF. El total y su calidad de vida en Roma Norte hicieron ganar a B.",
    template:
      "Base: [ ]. Variable: [ ] (% / meta). Beneficios: [lista valorada]. Flexibilidad: [ ]. Total estimado mensual/anual: [ ]. Prioridad personal #1: [ ]. Negociables: [ ].",
  },
  "negociacion-oferta-l2": {
    why: "Sin piso aceptas por miedo; sin meta no pides; sin techo no sabes dónde parar. Tres números definidos en frío evitan negociar en caliente.",
    howTo: [
      "Define piso: bajo este número (o paquete total equivalente) rechazarás o pedirás más tiempo.",
      "Define meta: el número que pedirás primero en la contraoferta.",
      "Define techo: el ideal si el alcance del rol crece o hay competencia de otra oferta.",
      "Escríbelos en tu moneda y ciudad; no los 'redondees' mentalmente en la llamada.",
      "Vincula cada número a una razón (banda de mercado, otra oferta, costo de vida, alcance del JD).",
      "Practica decir la meta en voz alta sin reírte ni disculparte.",
    ],
    tips: [
      "El piso es sagrado: no lo muevas en la misma llamada por presión social.",
      "Pide la meta, no el piso: si pides el mínimo, ahí te quedan.",
      "Si el rol cambió de alcance en la entrevista, revisa los 3 números antes de responder.",
    ],
    example:
      "Elena, en Medellín, fijó piso 8M, meta 9.2M, techo 10M COP para un rol de People Analytics. Pidió 9.2; cerraron en 8.8 + revisión a 6 meses. Sin los tres números hubiera aceptado 7.5 de alivio.",
    template:
      "Ciudad/rol: [ ]. Piso: [ ] · razón [ ]. Meta: [ ] · razón [ ]. Techo: [ ] · razón [ ]. Paquete mínimo aceptable (si base < piso): [condiciones].",
  },
  "negociacion-oferta-l3": {
    why: "El ancla de mercado cambia la conversación de '¿cuánto quieres?' a 'según referencias del rol'. Sin anclas, la empresa ancla primero y tú reaccionas.",
    howTo: [
      "Consigue 2 referencias: banda de una herramienta/app salarial orientativa + 1 dato real (oferta previa, colega de confianza, reclutador).",
      "Anota fuente, ciudad, modalidad y fecha del dato (salarios viejos engañan).",
      "Traduce las anclas a tu rango piso–meta–techo; ajusta si tu seniority no calza.",
      "Prepara una frase: 'Las referencias que manejo para [rol] en [ciudad] están en torno a X–Y'.",
      "No inventes encuestas falsas; si el dato es informal, dilo como orientación.",
    ],
    tips: [
      "Una ancla débil (rumor de WhatsApp) pesa menos que una oferta escrita o banda documentada.",
      "Si la empresa ancla muy bajo, no ataques: reanclea con datos y valor que ya demostraste.",
      "Guarda capturas/notas de bandas para el wizard de oferta.",
    ],
    example:
      "Hugo, en Guadalajara, usó la banda de la app para 'Data Analyst mid' + una oferta de un amigo en Zapopan (mismo stack). Ancló 45–52k MXN mensuales y movió la conversación lejos de los 38k iniciales.",
    template:
      "Ancla 1: [fuente] · rango [ ] · ciudad/modalidad [ ] · fecha [ ]. Ancla 2: [ ]. Frase de anclaje: [ ]. Ajuste a mi seniority: [ ].",
  },
  "negociacion-oferta-l4": {
    why: "Un script de contraoferta reduce ansiedad y evita tono agresivo o mendicante. La estructura agradece · valor · pide · alternativa funciona en email o llamada.",
    howTo: [
      "Agradece la oferta y muestra entusiasmo genuino por 1 aspecto concreto del rol.",
      "Recuerda 1–2 pruebas de valor ya vistas en el proceso (alcance, logros, urgencia del equipo).",
      "Pide tu meta (base o paquete) con la ancla breve.",
      "Ofrece alternativa: si no hay margen en base, pide bono de firma, revisión a 3–6 meses, HF, o equipo.",
      "Cierra con apertura a conversar y un plazo de respuesta razonable.",
      "Edita a un párrafo corto (email) o 45–60s (llamada).",
    ],
    tips: [
      "Nunca digas 'necesito' por deuda personal; habla de mercado y alcance del rol.",
      "Una contraoferta clara > rondas eternas de '¿pueden mejorar?'.",
      "Si hay otra oferta real, puedes mencionarla sin chantaje teatral.",
    ],
    example:
      "Lucía, en Santiago, escribió: agradeció el equipo de Product en Providencia, citó el case study que presentó, pidió +8% sobre el base y como alternativa revisión a 4 meses. Le dieron +5% y la revisión por escrito.",
    template:
      "Agradezco: [ ]. Valor que aporto: [ ]. Pido: [meta / componente]. Alternativa si no hay margen: [ ]. Cierre: [plazo + disposición]. Borrador unido: [ ].",
  },
  "negociacion-oferta-l5": {
    why: "El wizard de oferta calcula y arma scripts contextualizados (p. ej. Colombia): convierte tus números y anclas en un plan accionable en vez de negociar 'de memoria'.",
    howTo: [
      "Reúne: oferta recibida (base + beneficios), tus piso/meta/techo y 1–2 anclas.",
      "Abre el asistente de oferta en la app y completa cada paso con datos reales.",
      "Revisa el script generado; edita nombres, tono y cualquier cifra inventada.",
      "Elige canal: email vs llamada; ajusta longitud.",
      "Guarda el script final y la fecha de envío/respuesta.",
      "Define tu BATNA: qué harás si dicen no (aceptar, otra alternativa del paquete, declinar).",
    ],
    tips: [
      "El wizard no negocia por ti: tú envías y tú decides el piso.",
      "Todo acuerdo verbal pedirlo por escrito antes de renunciar a tu empleo actual.",
      "Si te dan 24h, usa 12–18h: tiempo para pensar, no para fantasear.",
    ],
    example:
      "Mateo, en Bogotá, pasó el wizard con una oferta de 7.2M, meta 8M y ancla de banda mid. Envió el script por email el viernes; el lunes le ofrecieron 7.7M + bono de firma. Guardó el hilo como evidencia.",
    template:
      "Oferta recibida: [ ]. Meta pedida: [ ]. Script final (pegar): [ ]. Canal: [ ]. Enviado: [fecha]. Respuesta: [ ]. BATNA: [ ]. Decisión: [acepto / sigo / declino].",
  },
};
