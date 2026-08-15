import type { HowToStep } from "@/lib/courses/types";

export type ToolLessonEnrichment = {
  why: string;
  howTo: HowToStep[]; // title + detail (2-5 sentences), 4-6 steps
  tips: string[];
  example: string;
  template: string;
};

export function toolEnrichmentKey(courseId: string, lessonIndex: number) {
  return `${courseId}-l${lessonIndex + 1}`;
}

export const TOOL_LESSON_ENRICHMENTS: Record<string, ToolLessonEnrichment> = {
  // ── linkedin-opt ──────────────────────────────────────────────
  "linkedin-opt-l1": {
    why: "El headline es la etiqueta que aparece en búsquedas, mensajes y comentarios. Un título genérico ('Analista', 'Profesional') te hace invisible; uno con rol + valor + audiencia te hace elegible en 2 segundos.",
    howTo: [
      {
        title: "Extrae cargo y resultados de ofertas reales",
        detail:
          "Abre 2–3 avisos del rol que quieres, no de roles “parecidos”. Subraya el cargo exacto (como lo escriben ellos) y dos resultados o responsabilidades medibles que se repiten. Ignora por ahora las soft skills genéricas: te interesan verbos de impacto y contextos (e-commerce, B2B, retail). Guarda esos avisos: son tu diccionario para el headline.",
      },
      {
        title: "Escribe versión A: rol + resultado + audiencia",
        detail:
          "Arma una línea con esta fórmula: [Rol target] | [resultado concreto] | [para quién o sector]. El resultado debe poder defenderse en una llamada (número, plazo o antes/después). Si solo tienes adjetivos (“estratégico”, “innovador”), cámbialos por un verbo y un efecto. Esta versión A es tu ancla; las demás son variantes.",
      },
      {
        title: "Escribe versión B con ciudad o modalidad",
        detail:
          "Misma promesa de valor, pero agrega ciudad, país o modalidad (remoto, híbrido, presencial) solo si eso te filtra a favor. Ejemplo: si buscas remoto LATAM, dilo; si solo operas en Medellín presencial, también. No satures: una señal de ubicación basta. Si la modalidad no aporta, quédate con A.",
      },
      {
        title: "Escribe versión C corta para móvil",
        detail:
          "Recorta a ≤110 caracteres para que no se corte en notificaciones ni en la app. Prioriza rol + un resultado; sacrifica adornos. Léela en la barra de un teléfono o en una captura de LinkedIn móvil. Si al truncarse pierde el sentido, reordena: lo importante va primero.",
      },
      {
        title: "Prueba en voz alta y descarta slogans",
        detail:
          "Lee las tres versiones en voz alta. Si suena a slogan de agencia o a frase motivacional, reemplaza el resultado por un número o un verbo de impacto concreto. Pregúntate: ¿un reclutador entendería en dos segundos a qué te postulas? Si la respuesta es “más o menos”, reescribe.",
      },
      {
        title: "Elige una y guarda las otras como variantes",
        detail:
          "Publica una sola. Guarda B y C en una nota etiquetada por industria o modalidad para rotar cuando pivotes de target. Criterio de elección: claridad > originalidad. No cambies el headline cada día: dale 7–10 días y mide InMails o visitas antes de iterar.",
      },
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
      {
        title: "Bloque 1: quién eres y para quién creas valor",
        detail:
          "En 2–3 líneas escribe tu frase X–Y–Z: quién eres hoy, qué problema resuelves y para qué tipo de empresa o usuario. Nada de biografía escolar ni lista de empleos. Esta es la parte visible sin “ver más”: si falla aquí, el resto no se lee. Usa presente, no pasado lejano.",
      },
      {
        title: "Bloque 2: un logro STAR corto con número",
        detail:
          "Cuenta un logro en miniatura: Situación en media línea, Acción en una, Resultado con métrica. El número debe ser el mismo que defenderías en entrevista. Si no tienes %, usa alcance (clientes, países, tickets, semanas). Un solo logro profundo gana a tres vagos.",
      },
      {
        title: "Bloque 3: segundo logro de otro contexto",
        detail:
          "Elige una historia distinta (otro skill, industria o tipo de problema) para mostrar rango sin repetir el mismo patrón. Mantén el mismo formato STAR corto. Si ambas historias son del mismo empleo, varía el tipo de impacto (eficiencia vs. ingreso vs. experiencia de usuario).",
      },
      {
        title: "Bloque 4: cómo trabajas, sin jerga vacía",
        detail:
          "En dos líneas describe método, herramientas o estilo de colaboración que un hiring manager pueda imaginar en su equipo. Evita “trabajo bajo presión” y “orientado a resultados” sin evidencia. Mejor: “priorizo con datos semanales” o “documento playbooks para el equipo”.",
      },
      {
        title: "Cierra con un CTA concreto",
        detail:
          "Termina invitando a un canal real: LinkedIn, InMail o email profesional, más el tipo de rol que te interesa. “Hablemos” sin canal pierde leads. Si estás abierto a varias geographies, dilo en una frase (México, remoto LATAM, híbrido en tu ciudad).",
      },
      {
        title: "Recorta a ~1.800–2.200 caracteres",
        detail:
          "Los reclutadores leen en diagonal: párrafos cortos, saltos de línea, sin muro denso. Elimina adjetivos y repeticiones antes de recortar hechos. Relee solo las primeras cuatro líneas en móvil: ahí se decide si expanden el About.",
      },
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
      {
        title: "Pega dos ofertas y arma la lista cruda",
        detail:
          "Elige dos avisos reales del rol target. Copia títulos, requisitos y nice-to-have a una lista única sin editar aún. No uses descripciones de empresa genéricas: quédate con términos que un reclutador buscaría en el buscador de LinkedIn. Dos ofertas bastan para ver patrones; cinco generan ruido.",
      },
      {
        title: "Extrae 10–15 términos accionables",
        detail:
          "Clasifica herramientas, metodologías, industrias y soft skills nombradas (no inventadas por ti). Prefiere palabras que aparecen en ambos avisos o que son críticas en uno. Descarta clichés (“proactivo”, “dinámico”) salvo que el JD las use con un contexto concreto que puedas espejar.",
      },
      {
        title: "Marca cada keyword: SÍ / PARCIAL / NO",
        detail:
          "SÍ = la usaste y puedes contar un ejemplo en 60 segundos. PARCIAL = la tocaste o la aprendiste de cerca pero no lideraste. NO = no la uses en el perfil. Sé brutalmente honesto: una keyword indefendible en filtro telefónico destruye credibilidad más rápido que no aparecer en búsqueda.",
      },
      {
        title: "Incorpora solo SÍ (y 1–2 PARCIAL) al perfil",
        detail:
          "Repártelas en headline, About y sección Skills sin forzar densidad. Las PARCIAL van con lenguaje cuidadoso (“exposición a…”, “apoyé en…”). No copies el JD entero al About: suena a spam y a texto de IA. El objetivo es coincidencia creíble, no keyword stuffing.",
      },
      {
        title: "Reescribe 2–3 viñetas de experiencia con el lenguaje del aviso",
        detail:
          "En el cargo más relevante, ajusta verbos y herramientas al vocabulario del target sin inventar logros. Si el aviso dice “churn” y tú hablabas de “deserción de clientes”, alinea el término. Cada viñeta sigue necesitando resultado; la keyword no reemplaza la métrica.",
      },
      {
        title: "Guarda la lista para CV y carta",
        detail:
          "Exporta o deja la tabla SÍ/PARCIAL/NO en una nota. La reutilizarás en CV ATS y en el espejo de requisitos de la carta. Cuando cambies de target, actualiza la lista completa: LinkedIn no adivina tu pivote solo porque viste un curso.",
      },
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
      {
        title: "Toma o elige una foto de rostro claro",
        detail:
          "Rostro visible, buen contraste, ropa acorde a tu industria, fondo simple (pared o oficina neutra). Luz natural de frente gana a filtro pesado. Evita gafas de sol, selfies anguladas y fotos de grupo recortadas: el cerebro del reclutador busca “persona confiable”, no “historia de vacaciones”.",
      },
      {
        title: "Recorta a hombros y cabeza",
        detail:
          "El avatar en LinkedIn es pequeño: plano medio cercano. Si hay mucho espacio vacío o un paisaje detrás, se pierde la cara. Prueba cómo se ve a tamaño de notificación. Si dudas entre dos tomas, pide a un colega cuál transmite más profesionalismo en tres segundos.",
      },
      {
        title: "Diseña un banner limpio y legible en desktop",
        detail:
          "Usa una imagen simple (ciudad suave, abstracto discreto o marca personal mínima). Si pones texto, que se lea en desktop sin pelear con el avatar. Evita collages saturados y slogans largos: el banner refuerza, no compite con el headline. Revisa también en móvil, donde se recorta distinto.",
      },
      {
        title: "Deja un CTA visible en About o Featured",
        detail:
          "Email profesional, Open to Work con roles concretos, o invitación clara a InMail. “Hablemos” sin canal es un callejón sin salida. Si usas WhatsApp profesional, asegúrate de que sea un número que atiendes en horario laboral. Un solo CTA principal evita confusión.",
      },
      {
        title: "Audita foto y banner en móvil",
        detail:
          "Abre tu perfil en el teléfono: ¿la cara se ve nítida? ¿el banner se entiende o quedó un recorte raro? ¿el CTA aparece sin abrir “ver más”? Corrige antes de invertir tiempo en outreach. Muchos reclutadores te descubren desde la app, no desde el escritorio.",
      },
      {
        title: "Pide un feedback de confianza de 10 segundos",
        detail:
          "Pregunta a una persona de confianza: “¿Le escribirías a esta persona?”. No pidas elogios; pide fricción concreta (foto, banner, CTA). Ajusta una sola cosa por ronda. Criterio de éxito: alguien externo entiende tu rol y cómo contactarte sin leer el About completo.",
      },
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
      {
        title: "Prepara inputs antes de abrir el generador",
        detail:
          "Ten a mano rol target, keywords SÍ defendibles y 1–2 logros con número. Sin eso, la IA rellena con adjetivos. Abre el generador LinkedIn de la app solo cuando esos insumos estén listos; ahorras prompts inútiles y ediciones frustrantes.",
      },
      {
        title: "Genera headline y About en un doc temporal",
        detail:
          "Copia la salida a un documento; no pegues aún en LinkedIn. Así evitas publicar un borrador a medias y puedes comparar lado a lado con tu versión anterior. Si generas dos variantes, etiquétalas A/B antes de mezclar frases.",
      },
      {
        title: "Edita cinco minutos con tu vocabulario real",
        detail:
          "Elimina adjetivos vacíos, mete expresiones que sí usarías en una reunión y verifica cada métrica. Si la IA inventó un logro o una herramienta, bórralo sin piedad. El objetivo no es “sonar sofisticado”: es sonar a ti y poder defender cada línea.",
      },
      {
        title: "Compara con tu perfil anterior y elige lo defendible",
        detail:
          "Quédate con lo más claro, no con lo más largo. Si el borrador IA es florido pero tu versión vieja tenía un número fuerte, conserva el número. Alinea también el cargo actual en Experiencia para que no contradiga el headline.",
      },
      {
        title: "Publica, previsualiza en móvil y guarda evidencia",
        detail:
          "Pega en LinkedIn, revisa cortes de headline y primeras líneas del About en el teléfono. Guarda captura o texto final como evidencia del curso. Si algo se ve mal en móvil, corrige antes de avisar a tu red.",
      },
      {
        title: "Define el siguiente paso de uso del perfil",
        detail:
          "Pedir feedback a una persona o enviar tres mensajes de outreach con el perfil nuevo. Un headline brillante sin conversaciones no cambia tu pipeline. Anota fecha de publicación y fecha de revisión (7–10 días) para iterar con datos, no por ansiedad.",
      },
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
      {
        title: "Identifica el canal exacto de postulación",
        detail:
          "Marca si es Easy Apply, formulario con adjunto, email al reclutador o mensaje LinkedIn. Cada canal impone longitud y formalidad distintas. No asumas: mira el aviso y el flujo del portal. Anotar el canal evita escribir una carta hermosa que nadie abrirá.",
      },
      {
        title: "Aplica la regla de longitud según canal",
        detail:
          "Easy Apply o InMail → mensaje de 8–12 líneas. Email formal o portal que pide cover letter → 3–4 párrafos. PDF solo si lo solicitan explícitamente. Si el campo tiene límite de caracteres, diseña desde ese techo, no desde tu hábito de Word. El reclutador en móvil abandona muros de texto.",
      },
      {
        title: "Anota restricciones del portal o del aviso",
        detail:
          "¿Hay campo cover letter? ¿El CV ya va adjunto? ¿Límite de palabras? ¿Idioma ES o EN? Esas restricciones son parte del brief, no detalles menores. Si el CV ya viaja aparte, la carta no debe repetir el CV entero: gana con gancho, una prueba y encaje.",
      },
      {
        title: "Decide un solo entregable para hoy",
        detail:
          "Mensaje corto, email o carta PDF: elige uno y ciérralo. Mezclar formatos en la misma sesión diluye calidad. Escribe en el encabezado del doc: Canal + longitud objetivo + idioma. Ese encabezado te recuerda el brief cada vez que edites.",
      },
      {
        title: "Si tienes nombre del destinatario, úsalo",
        detail:
          "Busca hiring manager o reclutador en el aviso o LinkedIn. “A quien corresponda” es señal de envío masivo. Si no hay nombre, usa el equipo o el rol (“Hola, equipo de Talent de…”). Nunca inventes un nombre: un error ahí quema la postulación.",
      },
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
      {
        title: "Bloque gancho: rol + por qué esa empresa",
        detail:
          "En 1–2 frases nombra el rol y un hecho concreto del aviso, producto o expansión. “Me encantaría trabajar con ustedes” no es gancho: es ruido. El reclutador debe sentir que leíste algo real. Si no encuentras un hecho, usa un requisito específico del JD como ancla.",
      },
      {
        title: "Bloque prueba: un logro con métrica en miniatura STAR",
        detail:
          "Elige UN logro de tu CV y cuéntalo en 2–4 frases: contexto breve, qué hiciste tú, resultado con número. Un logro profundo supera tres logros sin cifra. Si no hay %, usa alcance o plazo. Esta prueba es el corazón de la carta; el resto orbita alrededor.",
      },
      {
        title: "Bloque encaje: traduce el logro a 1–2 requisitos del JD",
        detail:
          "Explica explícitamente cómo esa evidencia responde a lo que piden. No asumas que el reclutador hará el puente por ti. Usa el vocabulario del aviso solo donde sea honesto. Si el requisito es débil en tu perfil, no lo fuerces aquí: brilla en lo fuerte.",
      },
      {
        title: "Bloque cierre: disponibilidad + CTA claro",
        detail:
          "Propón el siguiente paso (“quedo atento a 15 minutos”, “adjunto CV”) sin mendigar. Incluye disponibilidad realista si aplica (híbrido, ciudad, fecha). El cierre no es disculpa ni ruego: es facilitación del proceso.",
      },
      {
        title: "Escribe primero una frase por bloque y luego expande",
        detail:
          "El esqueleto de cuatro frases evita divagar. Expande solo donde falte evidencia o claridad. Lee en voz alta: si un bloque no aporta información nueva, córtalo. Une al final según el canal (8–12 líneas o 3–4 párrafos).",
      },
      {
        title: "Verifica que quepa en una pantalla de teléfono",
        detail:
          "Pega el borrador en el bloc de notas del móvil o reduce la ventana. Si necesitas scroll largo para terminar, recorta. En LATAM muchos reclutadores leen desde el celular entre reuniones: tu estructura debe sobrevivir a esa atención fragmentada.",
      },
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
      {
        title: "Copia tres requisitos imprescindibles del JD",
        detail:
          "No elijas nice-to-have ni cultura genérica. Busca lo que aparece como obligatorio o se repite. Tres es el número operable: menos no demuestra lectura; más satura el mensaje. Escríbelos textualmente primero para no “suavizarlos” en tu cabeza.",
      },
      {
        title: "Bajo cada uno escribe tu evidencia o la honestidad",
        detail:
          "Proyecto, métrica, herramienta o “no aplico / parcial”. Si es parcial, anota qué sí puedes defender. No inventes experiencia para cuadrar: es más fácil detectar mentira en entrevista que perdonar un gap honesto. Esta tabla es privada y te sirve después en la entrevista.",
      },
      {
        title: "Prioriza 2–3 pruebas fuertes para el cuerpo",
        detail:
          "Solo lo defendible entra a la carta. Si tienes tres SÍ, úsalos; si tienes dos, profundiza esos dos. El requisito débil se omite o se menciona con plan breve solo si es creíble (“hoy uso X; en 30 días certifique Y”). Mejor omitir que diluir.",
      },
      {
        title: "Espeja vocabulario del aviso con honestidad",
        detail:
          "Usa las mismas tools y verbos de impacto donde sean verdad. No copies oraciones enteras del JD: suena a plantilla. El espejo es semántico (churn, QBR, Salesforce), no copy-paste. Si tu CV dice otra palabra para lo mismo, alinea en la carta y luego en el CV.",
      },
      {
        title: "Tacha frases que servirían para cualquier empresa",
        detail:
          "“Soy responsable y trabajo en equipo”, “me apasiona el cliente”, “busco crecer profesionalmente”: fuera. Reemplaza por hecho + requisito. Test final: si quitas el nombre de la empresa, ¿sigue siendo obvio que es para ESA vacante? Si no, reescribe el gancho y el encaje.",
      },
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
      {
        title: "Lee el borrador en voz alta como reclutador con prisa",
        detail:
          "Imagina 40 postulaciones en la bandeja. ¿En qué frase abandonarías? Marca todo lo que suene a plantilla, ruego o arrogancia. La lectura en voz alta revela ritmo y falsedad mejor que releer en silencio. Si te da vergüenza decirlo, reescribe.",
      },
      {
        title: "Tacha adjetivos sin prueba",
        detail:
          "Proactivo, apasionado, dinámico, excelentes habilidades interpersonales: fuera salvo que vengan con hecho inmediato. Cada adjetivo tachado se convierte en candidato a un hecho o a eliminación. El tono profesional en LATAM corporativo premia evidencia, no adornos.",
      },
      {
        title: "Reemplaza cada adjetivo por un hecho o bórralo",
        detail:
          "“Líder proactivo” → “Coordiné un equipo de 5 y entregamos el go-live en 6 semanas”. Si no hay hecho, elimina la frase completa. No sustituyas un adjetivo por otro (“muy comprometido”). El músculo de esta lección es hechos + verbos de acción en primera persona.",
      },
      {
        title: "Caza red flags de tono",
        detail:
          "Disculpas (“sé que no cumplo todo”), arrogancia (“soy el mejor”), ruego (“por favor denme la oportunidad”), pasiva corporativa (“se realizó”). También frases típicas de IA (“En el dinámico mundo actual…”). Cámbialas por confianza calmada: hechos, encaje, CTA.",
      },
      {
        title: "Ajusta a confianza calmada y pide un oído externo",
        detail:
          "El tono objetivo es claro, seguro y específico. Pide a una persona de confianza: “¿Sueno mendigo, soberbio o claro?”. Itera una sola vez con ese feedback. Evita emojis y signos de exclamación en exceso en cartas formales.",
      },
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
      {
        title: "Abre el generador con CV y aviso (o requisitos alineados)",
        detail:
          "Pega el texto del JD o tus tres requisitos ya espejados. Cuanto mejor el input, menos invención de la IA. No generes “en abstracto” sin vacante: el valor del borrador es el encaje, no la prosa genérica.",
      },
      {
        title: "Genera y pega en un doc; no envíes la primera salida",
        detail:
          "Trata la primera versión como materia prima. Envíarla directa es el error más caro de esta lección. Etiqueta el archivo con empresa y fecha para no mezclar borradores de otras postulaciones.",
      },
      {
        title: "Edita nombres, métricas y borra inventos",
        detail:
          "Corrige nombre de empresa, área y rol. Verifica cada número contra tu CV. Si la IA inventó un logro o una herramienta, elimínalo aunque “suene bonito”. Alinea el vocabulario con el espejo de la lección 3.",
      },
      {
        title: "Ajusta longitud al canal de la lección 1",
        detail:
          "Campo corto → recorta a gancho + prueba + CTA. Email → 3–4 párrafos. No dejes un PDF de 600 palabras donde el portal pide 150. La edición de longitud es parte del profesionalismo, no un detalle cosmético.",
      },
      {
        title: "Haz el tone check de la lección 4 en tres minutos",
        detail:
          "Tacha adjetivos, caza ruegos y frases de IA, lee en voz alta una vez. Luego guarda la versión final con fecha y nombre de vacante. Envía o pega en el portal solo cuando tipografía, nombres y CTA estén limpios.",
      },
      {
        title: "Reutiliza al 70% para vacantes similares",
        detail:
          "Conserva prueba y estructura; cambia gancho y espejo de requisitos. No reenvíes la misma carta con otro logo: se nota. Adjunta el CV solo si el canal lo permite; no dupliques el CV entero dentro de la carta.",
      },
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
      {
        title: "Elige un logro contable en 90–120 segundos",
        detail:
          "Preferible reciente y del rol target. Si dura una novela de cinco minutos, no sirve aún: elige otro o recorta el alcance. Anota el título corto de la historia (“SLA en temporada alta”) para encontrarla después en tu banco.",
      },
      {
        title: "Escribe una línea por letra S/T/A/R",
        detail:
          "S = contexto mínimo; T = tu responsabilidad u objetivo; A = lo que hiciste TÚ; R = resultado con número o alcance. No escribas un ensayo: cuatro líneas es el andamiaje. Si S ocupa más que A, estás contando telenovela, no evidencia.",
      },
      {
        title: "Audita la Acción en primera persona",
        detail:
          "Verbos concretos: prioricé, negocié, automaticé, documenté. “Nosotros” puede aparecer una vez; el grueso debe ser tuyo. Si solo describes lo que hizo el equipo, el entrevistador no sabe qué contrataría. Corrige hasta que A suene a decisiones tuyas.",
      },
      {
        title: "Audita el Resultado con métrica o alcance",
        detail:
          "Al menos un % , plazo o antes/después. Si no hay porcentaje, usa N personas, N países, N tickets, N semanas. Evita “mejoramos la cultura” sin señal observable. El R es lo que el entrevistador anota; sin él, la historia se olvida.",
      },
      {
        title: "Practica en voz alta solo con las cuatro líneas",
        detail:
          "No memorices un guion largo: memoriza estructura y números. Cronometra. Si pasas de dos minutos, corta Situación a la mitad. Una pasada oral revela muletillas y huecos que el texto no muestra.",
      },
      {
        title: "Guarda esta historia como plantilla madre",
        detail:
          "Será la base del banco de la siguiente lección. No empieces por el resultado saltándote la acción: el entrevistador quiere el cómo. Si te piden detalle, profundiza A, no alargues S.",
      },
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
      {
        title: "Nombra cinco títulos cortos por tipo de historia",
        detail:
          "(1) logro con métrica, (2) conflicto o stakeholder difícil, (3) liderazgo o influencia sin autoridad, (4) error o fracaso, (5) aprendizaje / cambio de enfoque. Los títulos deben caber en una frase. Si no puedes titularlo, la historia aún está borrosa.",
      },
      {
        title: "Asigna rol, empresa y año aproximado a cada una",
        detail:
          "El anclaje temporal evita mezclar historias bajo presión. Si dos historias son del mismo empleo, asegúrate de que demuestren skills distintas. Anota también si la historia es ★ prioritaria para tu target actual.",
      },
      {
        title: "Escribe solo encabezados S/T/A/R en cuatro líneas",
        detail:
          "Aún sin pulir la prosa oral. El banco es un índice, no un libreto de teatro. Si una historia no tiene R medible, márcala para reforzar o reemplazar. Completar las cinco a este nivel ya reduce ansiedad de entrevista.",
      },
      {
        title: "Marca con ★ las dos más relevantes al rol target",
        detail:
          "Esas dos se practican más. Las otras cubren preguntas laterales. Cuando cambies de target, reasigna las estrellas: un logro de churn importa más en CS que en finanzas. No fuerces una historia irrelevante solo porque está bien contada.",
      },
      {
        title: "Verifica diversidad de tipos y empleos",
        detail:
          "Evita cinco éxitos del mismo año o solo un empleo. El error debe mostrar reparación y aprendizaje, no autoflagelación. Si te faltan historias de liderazgo, usa influencia lateral (pares, otras áreas). Guarda el banco en una nota accesible antes de cada entrevista.",
      },
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
      {
        title: "Redacta salida o gap en cuatro frases",
        detail:
          "Hecho → contexto sin culpas → qué hiciste en la transición → qué buscas ahora. Elimina ataques a jefes o empresas: el entrevistador escucha madurez, no el juicio del pasado. Si el tema es sensible, quédate en hechos laborales; lo personal solo si tú eliges y es breve.",
      },
      {
        title: "Redacta debilidad con gestión y evidencia",
        detail:
          "Área real → impacto pasado → qué haces hoy para gestionarla → evidencia breve de mejora. Evita la debilidad inventada (“soy perfeccionista”): se nota. Elige algo verdadero y manejado que no tumbe el rol target. Cierra mirando al presente, no al defecto.",
      },
      {
        title: "Elimina drama y cierra hacia el rol actual",
        detail:
          "Revisa ambas respuestas: ¿terminan en resentimiento o en encaje? Reescribe el final para conectar con lo que buscas ahora. Una respuesta de gap que termina en “por eso quiero este rol de…” convierte riesgo en narrativa de transición.",
      },
      {
        title: "Léelas en voz alta o grábate una vez",
        detail:
          "Ajusta si suenas a disculpa eterna o a guion rígido. El objetivo es naturalidad estructurada, no actuación. Corrige muletillas y pausas largas. Si te emocionas de más, acorta el contexto y alarga el “qué hice / qué busco”.",
      },
      {
        title: "Prepara variante de 45 segundos",
        detail:
          "A veces cortan el tiempo o preguntan de pasada. Ten una versión comprimida de salida/gap y otra de debilidad. Practica pasar de la larga a la corta sin perder el cierre hacia el futuro. Guarda ambos guiones junto al banco STAR.",
      },
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
      {
        title: "Prepara tres preguntas de criterio",
        detail:
          "(1) éxito a 90 días en el rol, (2) retos actuales del equipo, (3) cómo se toma feedback o cómo es el manager. Estas abren información útil para ti y proyectan pensamiento de dueño. Evita “cultura divertida” genérica: prioriza prioridades y métricas de éxito.",
      },
      {
        title: "Personaliza al menos una con evidencia del proceso",
        detail:
          "Usa algo del aviso, del producto o de un comentario de la entrevista. Demuestra que escuchaste. Una pregunta genérica memorizada pesa menos que una anclada a lo que acabas de oír. Anota la personalización en tu tarjeta antes de entrar.",
      },
      {
        title: "Elimina preguntas respondidas en la web",
        detail:
          "Tamaño de la empresa, “qué hacen”, oficinas en el mapa: investiga antes. Usar tiempo de entrevista para eso señala poca preparación. Si dudas, reformula hacia decisión interna (“cómo priorizan X este trimestre”).",
      },
      {
        title: "Reserva sueldo y beneficios para el momento adecuado",
        detail:
          "Salvo que ellos abran el tema, deja compensación para filtro u oferta. Preguntar muy temprano puede sesgar la conversación. Sí puedes preguntar por criterios de éxito, stack, onboarding o colaboración entre áreas.",
      },
      {
        title: "Elige dos según el flujo y haz follow-up corto",
        detail:
          "Lleva tres escritas; usa dos. Escucha la respuesta y agrega un follow-up de una frase: demuestra que oíste. Si entrevistas con varias personas, adapta la pregunta; no repitas el mismo texto idéntico a cada panelista.",
      },
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
      {
        title: "Elige una historia ★ y una pregunta difícil",
        detail:
          "Del banco y de la lección de gap/debilidad. No intentes practicar las cinco a la vez: profundidad gana a cobertura superficial. Ten las cuatro líneas S/T/A/R a la vista antes de abrir el simulador.",
      },
      {
        title: "Completa al menos una ronda en el simulador STAR",
        detail:
          "Trátala como entrevista real: temporizador, sin pausar a cada frase. Si puedes, practicar de pie o sentado como en la llamada real. El cuerpo afecta el ritmo; ensayar solo leyendo no revela el mismo nerviosismo.",
      },
      {
        title: "Anota dos mejoras específicas y accionables",
        detail:
          "Ejemplos: “acortar Situación”, “más yo en Acción”, “número al inicio o al cierre del Resultado”. Si el feedback es genérico (“habla más claro”), pide o deriva un solo cambio concreto. Dos mejoras bastan para la siguiente pasada.",
      },
      {
        title: "Reescribe las cuatro líneas S/T/A/R",
        detail:
          "Incorpora esos ajustes en el papel antes de repetir oralmente. No memorices palabra por palabra: memoriza estructura y números. Si la IA o el simulador sugieren un logro falso, ignóralo.",
      },
      {
        title: "Haz una segunda pasada oral de 90 segundos sin leer",
        detail:
          "Compara con la primera: ¿más corta la S? ¿más clara la A? ¿se oye el R? Guarda score o notas como evidencia del curso. Una ronda bien iterada vale más que cinco lecturas del apunte.",
      },
      {
        title: "Cierra con un ritual pre-entrevista",
        detail:
          "Antes de la entrevista real, 5 minutos: releer ★, una pregunta difícil, una pregunta que harás tú. Ese ritual reduce improvisación bajo presión. Actualiza el banco si descubriste un hueco en la práctica.",
      },
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
      {
        title: "Lista qué SÍ aceptas en una hoja",
        detail:
          "Ciudades, modalidad (remoto/híbrido/presencial), viaje, tipo de contrato. Sé concreto: “híbrido Bogotá 2–3 días” gana a “flexible”. Esta lista es tu brújula cuando el reclutador pregunta rápido. Ten agua y el CV a mano: el filtro suele ser sorpresa en horario laboral.",
      },
      {
        title: "Lista dealbreakers y lo negociable",
        detail:
          "Separa lo que te haría abandonar el proceso en la semana 2 de lo que puedes ceder. Dealbreakers honestos ahorran procesos inútiles. Si todo es “flexible”, el reclutador oye indecisión: da preferencia + margen.",
      },
      {
        title: "Define fecha de inicio realista",
        detail:
          "Ejemplo: “dos semanas tras oferta firmada” o el preaviso real de tu empleo actual. No prometas fechas que tu empleador no permite. Anota excepciones (mudanza, visa, equipo) para no inventar bajo presión.",
      },
      {
        title: "Anota rango salarial mental (piso/meta)",
        detail:
          "Aunque lo profundices en la lección de pretensión, no entres al filtro en blanco. Moneda local, números redondos que puedas decir sin tartamudear. Si aún no tienes datos de mercado, marca “pendiente” y completa antes de la próxima postulación seria.",
      },
      {
        title: "Ensaya la frase de encaje en 15–20 segundos",
        detail:
          "“Busco X modalidad en Y zona; puedo empezar Z”. Practica hasta no leer. Esa frase abre el filtro con claridad y evita monólogos. Si te pedirán detalle, expande; si no, con 20 segundos bastan.",
      },
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
      {
        title: "Escribe respuestas de ~20 segundos a las tres preguntas clave",
        detail:
          "¿Cuándo puedes empezar? ¿Presencial/híbrido/remoto? ¿Viajes? Cada una cabe en tres frases. Tono neutral: hechos de logística, no justificación larga de vida personal. Si el rol es presencial y tú quieres remoto, dilo ya.",
      },
      {
        title: "Incluye preferencia clara y un plan B aceptable",
        detail:
          "Ejemplo: prefieres híbrido 2–3 días; aceptas presencial el primer mes de onboarding. El plan B muestra flexibilidad sin rendir el dealbreaker. Si no hay plan B real, no lo inventes: mejor un no temprano que un sí que abandonarás.",
      },
      {
        title: "Di el preaviso con número, no con rodeos",
        detail:
          "“Tengo 15 días de preaviso” es claro; “depende de cómo se den las cosas” genera desconfianza. Nunca prometas una fecha que tu empleador actual no permite. Si estás libre, dilo con disponibilidad inmediata y fecha concreta de inicio.",
      },
      {
        title: "Practica hasta no necesitar leer el guion",
        detail:
          "Repite en voz alta tres veces. Luego di las respuestas mirando solo viñetas. La lectura se oye en el teléfono y resta seguridad. Cronometra: si pasas de 30 segundos por respuesta, recorta.",
      },
      {
        title: "Anota excepciones para no improvisar",
        detail:
          "Mudanza, visa, cuidado familiar, equipo de cómputo: lo que pueda salir. Tenerlas escritas evita inventar bajo presión o contradecirte entre llamadas. Actualiza la hoja si cambia tu situación antes del siguiente filtro.",
      },
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
      {
        title: "Define piso, meta y techo en tu moneda local",
        detail:
          "Piso = mínimo para aceptar; meta = número feliz; techo = aspiracional si el alcance crece. Escríbelos; no los “redondees” solo en la cabeza. Si aún no tienes datos, cierra referencias antes de postular en serio: un número al azar es peor que pedir 24 horas.",
      },
      {
        title: "Arma la frase de rango con ancla de paquete",
        detail:
          "“Manejo un rango de A–B según responsabilidades y paquete total; mi expectativa está cerca de B”. Practícala en tono calmado, sin disculpas ni desafío. El rango te da margen; el ancla a B señala hacia dónde quieres cerrar.",
      },
      {
        title: "Si presionan por un número único, no te desplomes al piso",
        detail:
          "Da el rango o la meta con ancla (“según bandas para el rol en [ciudad]”). Pedir el piso como apertura te deja ahí. Compensación total importa: a veces el base bajo se compensa con bono o beneficios; pregunta antes de rechazar de golpe.",
      },
      {
        title: "Decide tu respuesta si el presupuesto está bajo el piso",
        detail:
          "Agradecer y preguntar por variable/beneficios/revisión, o retirarte. Tener esa decisión en frío evita aceptar por alivio en la llamada. No inventes bandas: usa ofertas reales, colegas o la herramienta de salario.",
      },
      {
        title: "Practica decirlo sin disculparte",
        detail:
          "Grábate 20 segundos. Si suenas a ruego, endurece hechos de mercado. Si suenas a ultimátum, suaviza con “según el paquete total”. El filtro mide tono tanto como el número.",
      },
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
      {
        title: "Estructura el pitch en tres bloques de tiempo",
        detail:
          "15s quién eres hoy + rol target; 25s un logro con número; 20s por qué esta vacante/empresa. Empieza en presente (“Hoy soy… / Ayudo a…”), no en el colegio ni en el primer empleo. Si vienes de transición, una frase de salida + puente rápido al valor actual.",
      },
      {
        title: "Escribe 5–7 frases y luego reduce a 60 segundos",
        detail:
          "Primero completo, después tijera. Elimina trayectoria cronológica completa: el filtro no pide autobiografía. Cada frase debe ganar el derecho a la siguiente. Si una frase no aporta encaje o prueba, fuera.",
      },
      {
        title: "Graba un audio o cronometra en voz alta",
        detail:
          "El celular es tu simulador. Sonríe al hablar: se nota en la voz. Si pasas de 70 segundos, corta contexto, no el número del logro. Repite hasta que el ritmo sea natural sin leer literal.",
      },
      {
        title: "Alinea keywords del aviso sin forzar",
        detail:
          "Una o dos palabras del JD en el pitch aumentan sensación de fit. No empujes una lista de skills: suena a robot. El “por qué este rol” debe citar algo concreto del aviso o del producto.",
      },
      {
        title: "Deja el pitch listo junto a logística y pretensión",
        detail:
          "Las tres piezas suelen ir en la misma llamada. Tenerlas en una hoja evita improvisar el “cuéntame de ti” después de hablar de sueldo. Actualiza el pitch cuando cambie el target.",
      },
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
      {
        title: "Abre la herramienta de filtro telefónico en la app",
        detail:
          "Prepara antes la hoja SÍ/NO, el rango y el pitch de 60s. Sin insumos, el ensayo mide vacío. Busca un lugar silencioso y auriculares: simula la llamada real, no un chat escrito.",
      },
      {
        title: "Completa las tres preguntas como si fuera la llamada",
        detail:
          "Pitch, logística/disponibilidad y pretensión. No pauses a editar a mitad: termina la ronda y luego anota. Ensaya de pie si suele llamarte el reclutador mientras caminas entre reuniones.",
      },
      {
        title: "Revisa score o feedback y anota dos mejoras",
        detail:
          "Concretas: “pitch de 2 minutos → 60s”, “piso poco claro”, “demasiado ‘flexible’”. Si el score es bajo en pretensión, vuelve a la lección del rango antes de postular más. Dos mejoras accionables bastan.",
      },
      {
        title: "Reescribe solo las frases débiles y reensaya esas",
        detail:
          "No repitas las tres perfectas por vanidad: ataca el eslabón flojo. Usa viñetas, no texto literal: la lectura se oye. Cuando las tres suenen seguras, pásalas a la hoja de llamada real.",
      },
      {
        title: "Deja la hoja lista y agenda el ritual de 5 minutos",
        detail:
          "SÍ/NO + rango + pitch a mano para la próxima llamada. Recordatorio: “Antes de cada filtro, 5 min de repaso”. Ese hábito convierte la herramienta en músculo, no en ejercicio de una sola vez.",
      },
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
      {
        title: "Lista todos los componentes del paquete",
        detail:
          "Base, bono/variable, comisiones, aguinaldo y prestaciones de ley, seguros, vales, equipo, home office, días extra, educación, equity si aplica. En LATAM aclara moneda, periodicidad y si el variable es garantizado. Un componente omitido sesga la comparación.",
      },
      {
        title: "Pon valor mensual o anual estimado a cada ítem",
        detail:
          "Aunque sea aproximado: un día extra de vacaciones o 3 días HF tienen valor para ti. Si no puedes monetizarlo, anota el valor cualitativo (tiempo, salud, aprendizaje). El ejercicio obliga a ver el paquete completo, no solo el base que brilla en la oferta verbal.",
      },
      {
        title: "Marca qué es negociable en tu mercado",
        detail:
          "A menudo: base, bono, bono de firma, home office, fecha de revisión salarial. Prestaciones de ley suelen ser fijas. Saber qué se mueve evita pelear batallas imposibles y te da alternativas cuando el base está cerrado.",
      },
      {
        title: "Calcula un total estimado comparable",
        detail:
          "Suma manzanas con manzanas entre ofertas o contra tu empleo actual. Un base un poco menor con bono alcanzable y buena modalidad puede ganar a un base alto tóxico. Anota supuestos (probabilidad de lograr el variable) para no autoengañarte.",
      },
      {
        title: "Anota tu prioridad personal #1",
        detail:
          "Efectivo vs tiempo vs aprendizaje vs estabilidad. Esa prioridad guía qué pedirás primero en la contraoferta. Pide el desglose por escrito antes de aceptar de palabra: lo verbal se diluye; lo escrito se negocia.",
      },
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
      {
        title: "Define el piso que protegerás",
        detail:
          "Bajo este número (o paquete total equivalente) rechazarás o pedirás más tiempo. El piso es sagrado: no lo muevas en la misma llamada por presión social. Escríbelo en tu moneda y ciudad; no lo dejes “más o menos” mental.",
      },
      {
        title: "Define la meta que pedirás primero",
        detail:
          "Es el número de apertura de la contraoferta. Pide la meta, no el piso: si pides el mínimo, ahí te quedan. Vincula la meta a una razón (banda de mercado, otra oferta, alcance del JD).",
      },
      {
        title: "Define el techo aspiracional",
        detail:
          "Ideal si el alcance del rol crece o hay competencia de otra oferta. No es fantasía: debe poder justificarse. Si el rol cambió de alcance en la entrevista, revisa los tres números antes de responder.",
      },
      {
        title: "Escribe razón al lado de cada número",
        detail:
          "Sin razón, cedes bajo presión. Con razón, negocias con calma. Incluye qué paquete mínimo aceptarías si el base queda bajo el piso (bono de firma, revisión a 6 meses, HF). Eso evita improvisar alternativas.",
      },
      {
        title: "Practica decir la meta en voz alta",
        detail:
          "Sin reírte ni disculparte. Graba 15 segundos. Si suena a broma nerviosa, repite hasta tono factual. Lleva los tres números a la vista en la llamada o en el email de contraoferta.",
      },
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
      {
        title: "Consigue dos referencias reales",
        detail:
          "Banda de una herramienta/app salarial orientativa + un dato real (oferta previa, colega de confianza, reclutador). Una ancla débil (rumor de WhatsApp) pesa menos que una oferta escrita o banda documentada. No inventes encuestas falsas.",
      },
      {
        title: "Anota fuente, ciudad, modalidad y fecha",
        detail:
          "Salarios viejos engañan; remoto vs presencial cambia bandas; ciudad también. Sin esos metadatos, el ancla es decorativa. Guarda capturas o notas para el wizard de oferta y para no “recordar mal” en la negociación.",
      },
      {
        title: "Traduce las anclas a tu piso–meta–techo",
        detail:
          "Ajusta si tu seniority no calza exactamente con la banda. Si estás below mid y la banda es mid, no cites el techo como si fuera tuyo. El ancla debe elevar la conversación, no destruir credibilidad.",
      },
      {
        title: "Prepara la frase de anclaje",
        detail:
          "“Las referencias que manejo para [rol] en [ciudad] están en torno a X–Y”. Si el dato es informal, dilo como orientación. Si la empresa ancla muy bajo, no ataques: reanclea con datos y con el valor que ya demostraste en el proceso.",
      },
      {
        title: "Integra el ancla a tu script de contraoferta",
        detail:
          "El ancla no vive solo: acompaña la meta. Practica decirla en 10 segundos. Guarda las dos fuentes junto a los tres números para no negociar “de memoria” cuando llegue el email de oferta.",
      },
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
      {
        title: "Agradece y muestra entusiasmo por un aspecto concreto",
        detail:
          "Menciona el equipo, el problema a resolver o el alcance. El agradecimiento genuino abre la puerta; el genérico suena a plantilla. Nunca digas “necesito” por deuda personal: habla de mercado y alcance del rol.",
      },
      {
        title: "Recuerda una o dos pruebas de valor del proceso",
        detail:
          "Case study, urgencia del equipo, logros que ya discutieron. Reanclar valor hace que el pedido no parezca capricho. Sé breve: una frase basta. Luego pide tu meta (base o paquete) con la ancla de mercado en una línea.",
      },
      {
        title: "Ofrece alternativa si no hay margen en el base",
        detail:
          "Bono de firma, revisión a 3–6 meses, home office, equipo, días extra. Una contraoferta clara gana a rondas eternas de “¿pueden mejorar?”. Si hay otra oferta real, puedes mencionarla sin chantaje teatral.",
      },
      {
        title: "Cierra con apertura y plazo razonable",
        detail:
          "Disposición a conversar + fecha en la que puedes responder. Edita a un párrafo corto (email) o 45–60s (llamada). Evita ultimátums de 2 horas salvo que ellos hayan puesto deadline; si te dan 24h, usa 12–18h para pensar.",
      },
      {
        title: "Relee el tono antes de enviar",
        detail:
          "¿Suena a ruego, a amenaza o a profesional calmado? Pide a alguien de confianza que lea el email. Guarda el borrador: lo reutilizarás y será evidencia del proceso. Todo acuerdo verbal, pedirlo por escrito después.",
      },
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
      {
        title: "Reúne oferta, tres números y anclas",
        detail:
          "Base + beneficios recibidos, piso/meta/techo y 1–2 anclas con fuente. Sin eso el wizard improvisa. Ten a mano también tu prioridad #1 del paquete total (efectivo, tiempo, aprendizaje).",
      },
      {
        title: "Completa cada paso del asistente con datos reales",
        detail:
          "No embellezcas números “para ver qué sale”. El script debe ser defendible mañana en una llamada. Si el wizard asume algo de tu país (prestaciones, moneda), verifica que calce con tu oferta concreta.",
      },
      {
        title: "Edita el script generado: nombres, tono y cifras",
        detail:
          "Borra cualquier invento. Ajusta a tu voz. El wizard no negocia por ti: tú envías y tú decides el piso. Elige canal (email vs llamada) y recorta longitud en consecuencia.",
      },
      {
        title: "Guarda script final, fecha y canal",
        detail:
          "Evidencia del curso y de tu proceso. Si te responden con una contraoferta, anota el nuevo total estimado antes de decidir. Todo acuerdo verbal, confírmalo por escrito antes de renunciar a tu empleo actual.",
      },
      {
        title: "Define tu BATNA antes de enviar",
        detail:
          "Qué harás si dicen no: aceptar, pedir otra pieza del paquete, o declinar. Decidir el BATNA en frío evita aceptar por alivio o rechazar por orgullo. Si te dan 24h, usa 12–18h: tiempo para pensar, no para fantasear.",
      },
      {
        title: "Envía, espera y cierra con decisión explícita",
        detail:
          "Marca en tu template: acepto / sigo negociando / declino. Celebra el proceso aunque el número no sea el techo: negociar con método es la habilidad que reutilizarás en cada oferta futura.",
      },
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
