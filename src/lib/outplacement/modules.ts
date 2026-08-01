export type OutModule = {
  code: string;
  title: string;
  summary: string;
  days: number;
  capsules: { day: number; title: string; content: string; quiz?: { question: string; options: string[]; answer: number } }[];
};

export const OUTPLACEMENT_MODULES: OutModule[] = [
  {
    "code": "OUT-01",
    "title": "Estabilización emocional y narrativa",
    "summary": "Procesa la transición y redefine tu historia profesional con claridad.",
    "days": 7,
    "capsules": [
      {
        "day": 1,
        "title": "Nombrar la transición",
        "content": "Escribe en 5 líneas qué terminó, qué conservas y qué quieres atraer. Sin juicios.",
        "quiz": {
          "question": "¿Qué haces el día 1?",
          "options": [
            "Ignorar el despido",
            "Nombrar hechos y aprendizajes",
            "Enviar 50 CVs"
          ],
          "answer": 1
        }
      },
      {
        "day": 2,
        "title": "Energía y rutina",
        "content": "Define una rutina de 45 minutos: cuerpo, mente y búsqueda. La constancia supera la intensidad.",
        "quiz": {
          "question": "La clave es:",
          "options": [
            "Rutina corta diaria",
            "Trabajar 14 horas",
            "Esperar motivación"
          ],
          "answer": 0
        }
      },
      {
        "day": 3,
        "title": "Narrativa de valor",
        "content": "Frase base: 'Ayudo a X a lograr Y mediante Z'. Úsala en LinkedIn y entrevistas.",
        "quiz": {
          "question": "Tu frase debe incluir:",
          "options": [
            "Solo cargo",
            "X, Y y Z (público, resultado, método)",
            "Solo salario"
          ],
          "answer": 1
        }
      },
      {
        "day": 4,
        "title": "Red de apoyo",
        "content": "Lista 5 personas de confianza. Pide consejo concreto, no 'avísame si hay algo'.",
        "quiz": {
          "question": "Al pedir ayuda conviene:",
          "options": [
            "Ser vago",
            "Pedir algo específico",
            "No pedir"
          ],
          "answer": 1
        }
      },
      {
        "day": 5,
        "title": "Cierre emocional",
        "content": "Resume en audio de 60s tu narrativa. Escúchala y ajusta tono seguro, no defensivo.",
        "quiz": {
          "question": "El tono ideal es:",
          "options": [
            "Defensivo",
            "Seguro y claro",
            "Arrogante"
          ],
          "answer": 1
        }
      },
      {
        "day": 6,
        "title": "Límites sanos",
        "content": "Bloquea redes 2h al día para búsqueda profunda. Protege sueño y alimentación.",
        "quiz": {
          "question": "Prioridad esta semana:",
          "options": [
            "Doomscroll",
            "Descanso + foco",
            "Aplicar a todo"
          ],
          "answer": 1
        }
      },
      {
        "day": 7,
        "title": "Ritual de cierre OUT-01",
        "content": "Elige 1 frase de identidad profesional y pégala en tu escritorio/LinkedIn.",
        "quiz": {
          "question": "El entregable es:",
          "options": [
            "Una frase clara de identidad",
            "Un CV de 5 páginas",
            "Nada"
          ],
          "answer": 0
        }
      }
    ]
  },
  {
    "code": "OUT-02",
    "title": "Autoevaluación y mapa de competencias",
    "summary": "FODA profesional y mapa de skills transferibles.",
    "days": 7,
    "capsules": [
      {
        "day": 1,
        "title": "Inventario de logros",
        "content": "Lista 8 logros con métrica. Si no hay número, estima alcance o tiempo ahorrado.",
        "quiz": {
          "question": "Cada logro debe tener:",
          "options": [
            "Solo adjetivos",
            "Alguna métrica o alcance",
            "Fecha de nacimiento"
          ],
          "answer": 1
        }
      },
      {
        "day": 2,
        "title": "Hard vs soft",
        "content": "Clasifica skills en técnicas y blandas. Marca las 5 más vendibles para tu próximo rol.",
        "quiz": {
          "question": "¿Cuántas skills priorizas?",
          "options": [
            "Todas",
            "Las 5 más vendibles",
            "Ninguna"
          ],
          "answer": 1
        }
      },
      {
        "day": 3,
        "title": "FODA exprés",
        "content": "Fortalezas, oportunidades, debilidades, amenazas del mercado. Una línea cada una.",
        "quiz": {
          "question": "El FODA incluye:",
          "options": [
            "Solo fortalezas",
            "F, O, D y A",
            "Solo salario"
          ],
          "answer": 1
        }
      },
      {
        "day": 4,
        "title": "Skills transferibles",
        "content": "Traduce logros de un sector a otro (ej. finanzas→ops: control, precisión, reporting).",
        "quiz": {
          "question": "Transferir skills sirve para:",
          "options": [
            "Pivote de industria",
            "Borrar el CV",
            "Evitar entrevistas"
          ],
          "answer": 0
        }
      },
      {
        "day": 5,
        "title": "Evidencia observable",
        "content": "Por cada skill top, escribe 1 prueba (proyecto, KPI, certificación).",
        "quiz": {
          "question": "Una skill sin evidencia es:",
          "options": [
            "Débil ante reclutadores",
            "Suficiente",
            "Ilegal"
          ],
          "answer": 0
        }
      },
      {
        "day": 6,
        "title": "Propuesta de valor",
        "content": "Une logros + skills + FODA en un párrafo de 80 palabras para tu CV.",
        "quiz": {
          "question": "El párrafo ideal tiene:",
          "options": [
            "~80 palabras claras",
            "500 palabras",
            "Solo emojis"
          ],
          "answer": 0
        }
      },
      {
        "day": 7,
        "title": "Validar con un par",
        "content": "Pide a un colega: ¿contratarías a esta propuesta? Ajusta feedback.",
        "quiz": {
          "question": "El objetivo del feedback es:",
          "options": [
            "Validar claridad de valor",
            "Discutir política",
            "Pedir prestado dinero"
          ],
          "answer": 0
        }
      }
    ]
  },
  {
    "code": "OUT-03",
    "title": "Inteligencia de mercado laboral LATAM",
    "summary": "Roles target, bandas salariales y gaps reales.",
    "days": 7,
    "capsules": [
      {
        "day": 1,
        "title": "3 roles target",
        "content": "Elige 3 títulos de cargo reales en tu país. Copia requisitos comunes.",
        "quiz": {
          "question": "Debes elegir:",
          "options": [
            "3 roles reales",
            "20 roles al azar",
            "Ninguno"
          ],
          "answer": 0
        }
      },
      {
        "day": 2,
        "title": "Banda salarial",
        "content": "Investiga rango (computrabajo, eleempleo, niveles). Anota mínimo aceptable.",
        "quiz": {
          "question": "El mínimo aceptable se basa en:",
          "options": [
            "Datos de mercado + tus costos",
            "Solo deseo",
            "El rumor de un amigo"
          ],
          "answer": 0
        }
      },
      {
        "day": 3,
        "title": "Gaps",
        "content": "Compara tu mapa vs requisitos. Prioriza 2 gaps cerrables en 30 días.",
        "quiz": {
          "question": "Prioriza gaps:",
          "options": [
            "Cerrables en ~30 días",
            "Imposibles",
            "Todos a la vez"
          ],
          "answer": 0
        }
      },
      {
        "day": 4,
        "title": "Demanda real",
        "content": "Revisa 10 ofertas: ¿qué keywords se repiten? Anota top 10.",
        "quiz": {
          "question": "Las keywords repetidas indican:",
          "options": [
            "Demanda del mercado",
            "Spam",
            "Nada"
          ],
          "answer": 0
        }
      },
      {
        "day": 5,
        "title": "Canales de oferta",
        "content": "Lista dónde aparecen tus roles (LinkedIn, bolsas, referidos, consultoras).",
        "quiz": {
          "question": "El mercado oculto suele vivir en:",
          "options": [
            "Referidos y red",
            "Solo portales genéricos",
            "TV"
          ],
          "answer": 0
        }
      },
      {
        "day": 6,
        "title": "Plan 30 días",
        "content": "Calendario: aprendizaje, networking y postulaciones con cupos diarios.",
        "quiz": {
          "question": "Un plan bueno tiene:",
          "options": [
            "Cupos diarios realistas",
            "Cero estructura",
            "Solo esperanza"
          ],
          "answer": 0
        }
      },
      {
        "day": 7,
        "title": "Decisión de foco",
        "content": "Elige 1 rol primario y 1 secundario. Descarta el resto por 30 días.",
        "quiz": {
          "question": "Enfocarse evita:",
          "options": [
            "Dispersión",
            "Éxito",
            "Aprendizaje"
          ],
          "answer": 0
        }
      }
    ]
  },
  {
    "code": "OUT-04",
    "title": "Re-skilling / upskilling",
    "summary": "Cierra brechas con cursos low-cost y práctica.",
    "days": 7,
    "capsules": [
      {
        "day": 1,
        "title": "Elegir 1 skill",
        "content": "Una sola skill prioritaria. Evita dispersión.",
        "quiz": {
          "question": "¿Cuántas skills nuevas a la vez?",
          "options": [
            "1 prioritaria",
            "10",
            "0"
          ],
          "answer": 0
        }
      },
      {
        "day": 2,
        "title": "Recurso gratuito",
        "content": "Elige un curso gratis/económico y agenda 25 min diarios.",
        "quiz": {
          "question": "La constancia ideal es:",
          "options": [
            "Bloques cortos diarios",
            "Maratón anual",
            "Nunca"
          ],
          "answer": 0
        }
      },
      {
        "day": 3,
        "title": "Proyecto mínimo",
        "content": "Crea un entregable pequeño para mostrar en CV/LinkedIn.",
        "quiz": {
          "question": "El proyecto sirve para:",
          "options": [
            "Evidencia",
            "Decorar",
            "Ocultar gaps"
          ],
          "answer": 0
        }
      },
      {
        "day": 4,
        "title": "Práctica deliberada",
        "content": "Repite el entregable mejorándolo con feedback o checklist.",
        "quiz": {
          "question": "Mejorar el mismo entregable es:",
          "options": [
            "Práctica deliberada",
            "Pérdida de tiempo",
            "Ilegal"
          ],
          "answer": 0
        }
      },
      {
        "day": 5,
        "title": "Publicar evidencia",
        "content": "Publica el proyecto o un post de aprendizaje con resultado.",
        "quiz": {
          "question": "Publicar evidencia ayuda a:",
          "options": [
            "Marca y credibilidad",
            "Nada",
            "Bajar el score ATS"
          ],
          "answer": 0
        }
      },
      {
        "day": 6,
        "title": "Actualizar CV",
        "content": "Agrega la skill con evidencia, no solo la palabra.",
        "quiz": {
          "question": "En el CV la skill debe ir con:",
          "options": [
            "Evidencia/contexto",
            "Solo el nombre",
            "Color rosa"
          ],
          "answer": 0
        }
      },
      {
        "day": 7,
        "title": "Medir cierre de gap",
        "content": "Re-corre ATSAdvisor vs una oferta target. ¿Subió el match?",
        "quiz": {
          "question": "El indicador de avance es:",
          "options": [
            "Mejor match vs oferta real",
            "Likes",
            "Horas mirando videos"
          ],
          "answer": 0
        }
      }
    ]
  },
  {
    "code": "OUT-05",
    "title": "Marca personal + CV/LinkedIn ATS",
    "summary": "Rewrites STAR y perfil LinkedIn alineado al mercado.",
    "days": 7,
    "capsules": [
      {
        "day": 1,
        "title": "Headline LinkedIn",
        "content": "Cargo | Valor | Nicho. Sin frases vacías.",
        "quiz": {
          "question": "Un buen headline incluye:",
          "options": [
            "Cargo, valor y nicho",
            "Solo 'open to work'",
            "Solo emojis"
          ],
          "answer": 0
        }
      },
      {
        "day": 2,
        "title": "About STAR",
        "content": "3 logros STAR en el extracto.",
        "quiz": {
          "question": "STAR significa:",
          "options": [
            "Situación, Tarea, Acción, Resultado",
            "Solo Resultado",
            "Salario"
          ],
          "answer": 0
        }
      },
      {
        "day": 3,
        "title": "CV una columna",
        "content": "Formato ATS-safe: una columna, secciones estándar, PDF limpio.",
        "quiz": {
          "question": "Los ATS fallan más con:",
          "options": [
            "Multi-columna e imágenes",
            "Texto plano",
            "Fechas"
          ],
          "answer": 0
        }
      },
      {
        "day": 4,
        "title": "Keywords honestas",
        "content": "Integra keywords de ofertas reales sin inventar experiencia.",
        "quiz": {
          "question": "Keyword stuffing es:",
          "options": [
            "Arriesgado / penalizable",
            "Obligatorio",
            "Invisible"
          ],
          "answer": 0
        }
      },
      {
        "day": 5,
        "title": "Prueba ATSAdvisor",
        "content": "Corre un análisis ATS contra una oferta target y sube el score.",
        "quiz": {
          "question": "Debes iterar el CV hasta:",
          "options": [
            "Mejorar el score de forma honesta",
            "Copiar la oferta entera",
            "Mentir"
          ],
          "answer": 0
        }
      },
      {
        "day": 6,
        "title": "Foto y banner",
        "content": "Profesional, fondo simple. Banner con propuesta de valor corta.",
        "quiz": {
          "question": "La foto debe ser:",
          "options": [
            "Profesional y clara",
            "Selfie borrosa",
            "Meme"
          ],
          "answer": 0
        }
      },
      {
        "day": 7,
        "title": "CTA de contacto",
        "content": "Featured: CV o proyecto + mensaje de contacto fácil.",
        "quiz": {
          "question": "El featured sirve para:",
          "options": [
            "Mostrar prueba social/trabajo",
            "Ocultar experiencia",
            "Nada"
          ],
          "answer": 0
        }
      }
    ]
  },
  {
    "code": "OUT-06",
    "title": "Mercado oculto + networking",
    "summary": "Scripts y outreach a reclutadores y hiring managers.",
    "days": 7,
    "capsules": [
      {
        "day": 1,
        "title": "Mapa de 20 contactos",
        "content": "Excompañeros, líderes de área, reclutadores del sector.",
        "quiz": {
          "question": "El mapa mínimo es:",
          "options": [
            "~20 contactos relevantes",
            "1 persona",
            "0"
          ],
          "answer": 0
        }
      },
      {
        "day": 2,
        "title": "Script corto",
        "content": "Mensaje de 5 líneas: contexto, valor, pedido concreto de 15 min.",
        "quiz": {
          "question": "El pedido debe ser:",
          "options": [
            "Concreto (15 min)",
            "Vago",
            "Pedir empleo directo siempre"
          ],
          "answer": 0
        }
      },
      {
        "day": 3,
        "title": "5 outreaches",
        "content": "Envía 5 mensajes personalizados hoy.",
        "quiz": {
          "question": "Personalizar el mensaje:",
          "options": [
            "Aumenta respuesta",
            "Es opcional siempre",
            "Empeora"
          ],
          "answer": 0
        }
      },
      {
        "day": 4,
        "title": "Seguimiento",
        "content": "Follow-up educado a los que no respondieron en 4-5 días.",
        "quiz": {
          "question": "El follow-up debe ser:",
          "options": [
            "Educado y breve",
            "Agresivo diario",
            "Nunca"
          ],
          "answer": 0
        }
      },
      {
        "day": 5,
        "title": "Referidos",
        "content": "Pide referidos solo cuando haya fit claro.",
        "quiz": {
          "question": "Pedir referido sin fit es:",
          "options": [
            "Contraproducente",
            "Ideal",
            "Obligatorio"
          ],
          "answer": 0
        }
      },
      {
        "day": 6,
        "title": "Eventos / comunidades",
        "content": "Participa en 1 comunidad del sector esta semana (online o presencial).",
        "quiz": {
          "question": "Las comunidades ayudan a:",
          "options": [
            "Mercado oculto",
            "Nada",
            "Bajar skills"
          ],
          "answer": 0
        }
      },
      {
        "day": 7,
        "title": "CRM simple",
        "content": "Lleva sheet: contacto, fecha, estado, próximo paso.",
        "quiz": {
          "question": "Sin seguimiento el networking:",
          "options": [
            "Se enfría",
            "Se multiplica solo",
            "Es ilegal"
          ],
          "answer": 0
        }
      }
    ]
  },
  {
    "code": "OUT-07",
    "title": "Entrevistas + negociación",
    "summary": "Simulación, preguntas difíciles y salario.",
    "days": 7,
    "capsules": [
      {
        "day": 1,
        "title": "Historias STAR",
        "content": "Prepara 5 historias. Grábate 90 segundos cada una.",
        "quiz": {
          "question": "Cada historia debe durar ~:",
          "options": [
            "90 segundos",
            "20 minutos",
            "5 segundos"
          ],
          "answer": 0
        }
      },
      {
        "day": 2,
        "title": "Preguntas difíciles",
        "content": "Practica: gaps, despido, debilidad, conflicto.",
        "quiz": {
          "question": "Ante el despido conviene:",
          "options": [
            "Hechos + aprendizaje",
            "Culpar a todos",
            "Mentir"
          ],
          "answer": 0
        }
      },
      {
        "day": 3,
        "title": "Preguntas al entrevistador",
        "content": "3 preguntas inteligentes sobre éxito en el rol a 90 días.",
        "quiz": {
          "question": "Buenas preguntas muestran:",
          "options": [
            "Interés estratégico",
            "Desesperación",
            "Nada"
          ],
          "answer": 0
        }
      },
      {
        "day": 4,
        "title": "Ancla salarial",
        "content": "Define piso, meta y techo con datos de mercado.",
        "quiz": {
          "question": "Negociar sin ancla es:",
          "options": [
            "Más débil",
            "Más fuerte",
            "Igual"
          ],
          "answer": 0
        }
      },
      {
        "day": 5,
        "title": "Simulacro",
        "content": "Haz una entrevista mock por voz (filtro predictivo) y pide feedback.",
        "quiz": {
          "question": "El simulacro reduce:",
          "options": [
            "Ansiedad y errores",
            "Preparación",
            "Ofertas"
          ],
          "answer": 0
        }
      },
      {
        "day": 6,
        "title": "Casos / pruebas",
        "content": "Si hay case study: estructura problema → opciones → recomendación.",
        "quiz": {
          "question": "En un case conviene:",
          "options": [
            "Estructurar el razonamiento",
            "Improvisar caos",
            "Callar"
          ],
          "answer": 0
        }
      },
      {
        "day": 7,
        "title": "Cierre de entrevista",
        "content": "Resume fit en 20s y confirma próximos pasos/fechas.",
        "quiz": {
          "question": "Al cerrar debes:",
          "options": [
            "Confirmar siguientes pasos",
            "Desaparecer",
            "Pedir el doble sin datos"
          ],
          "answer": 0
        }
      }
    ]
  },
  {
    "code": "OUT-08",
    "title": "Oferta y primeros 90 días",
    "summary": "Cierre de oferta, onboarding y retención.",
    "days": 7,
    "capsules": [
      {
        "day": 1,
        "title": "Evaluar oferta",
        "content": "Total compensation, aprendizaje, cultura, distancia/remoto.",
        "quiz": {
          "question": "Evalúa más que:",
          "options": [
            "Solo salario base",
            "Todo el paquete",
            "El color de la oficina"
          ],
          "answer": 1
        }
      },
      {
        "day": 2,
        "title": "Negociar con datos",
        "content": "Contraoferta educada con evidencia de mercado y valor.",
        "quiz": {
          "question": "La contraoferta debe ser:",
          "options": [
            "Educada y con evidencia",
            "Ultimátum agresivo",
            "Silencio"
          ],
          "answer": 0
        }
      },
      {
        "day": 3,
        "title": "Plan 30-60-90",
        "content": "Aprender, aportar, liderar. Compártelo con tu jefe.",
        "quiz": {
          "question": "El plan 30-60-90 comunica:",
          "options": [
            "Expectativas claras",
            "Vacaciones",
            "Nada"
          ],
          "answer": 0
        }
      },
      {
        "day": 4,
        "title": "Pausa búsqueda",
        "content": "Si aceptas, pausa outplacement y activa modo 90 días.",
        "quiz": {
          "question": "Al aceptar conviene:",
          "options": [
            "Activar modo 90 días",
            "Seguir spammeando CVs",
            "Borrar LinkedIn"
          ],
          "answer": 0
        }
      },
      {
        "day": 5,
        "title": "Aliados internos",
        "content": "Identifica 3 personas clave (buddy, peer, stakeholder).",
        "quiz": {
          "question": "Los aliados aceleran:",
          "options": [
            "Onboarding",
            "Despidos",
            "Nada"
          ],
          "answer": 0
        }
      },
      {
        "day": 6,
        "title": "Quick wins",
        "content": "Entrega 1 mejora visible en 30 días (doc, proceso, métrica).",
        "quiz": {
          "question": "Un quick win debe ser:",
          "options": [
            "Visible y útil",
            "Invisible",
            "Riesgoso sin permiso"
          ],
          "answer": 0
        }
      },
      {
        "day": 7,
        "title": "Revisión con jefe",
        "content": "Agenda feedback a los 30 días con tu plan 30-60-90.",
        "quiz": {
          "question": "Pedir feedback temprano:",
          "options": [
            "Reduce sorpresas",
            "Molesta siempre",
            "Es opcional siempre"
          ],
          "answer": 0
        }
      }
    ]
  }
];

export const OUT09_QUESTIONS = [
  { id: "important", label: "¿Qué es lo más importante que debe lograr este refuerzo?" },
  { id: "hardest", label: "¿Qué es lo que más se te dificulta hoy?" },
  { id: "urgent", label: "¿Qué quieres reforzar con más urgencia?" },
  { id: "level", label: "¿Cuál es tu nivel actual?", options: ["principiante", "intermedio", "avanzado"] },
  { id: "minutes", label: "¿Cuántos minutos al día puedes dedicar?", options: ["5", "10", "15"] },
] as const;
