# Plan: Outplacement profesional (Cuadernillo → ATSAdvisor)

Documento de producto (sin PII). Fuente estructural interna: materiales de transición de carrera (carpeta local gitignored). Contenido de producto = autoría ATSAdvisor.

## Resumen ejecutivo

El Excel de transición no es un “curso PDF”: es un **programa operativo** con 9 temas, coach humano por módulo, % de avance y entregables (mapa, mercado/EVP, marca, guiones, CRM, entrevistas, compensación), más finanzas y emprendimiento. ATSAdvisor ya cubre ~60% en forma de cursos OUT + herramientas; el salto a outplacement profesional es:

1. **Cuadernillo digital** (wizards con evidencia).
2. **Coaches por especialidad** (escuchar + preguntar, grounded).
3. **Cerrar gaps de mercado** (finanzas, HH, emprendimiento, outcomes).

## 1. Inventario → uso en producto

| Tema cuadernillo | Qué plantea | App hoy | Implementación |
|------------------|-------------|---------|----------------|
| Ruta (14 sesiones) | Orden, coach, objetivo, % | OUT + tablero | Meta-ruta “Mi cuadernillo” |
| Mapa de carrera | Fortalezas/motivadores/valores → propósito/visión/objetivo + 4 columnas | OUT-02, RIASEC | Wizard Mapa |
| Pruebas | Temperamento, comunicador, 360 | RIASEC | Autoeval competencias **propias** (no Lominger ©) |
| Mercado | Industria → empresa → EVP top 5 | OUT-03 | Wizard Mercado + EVP |
| Marca | HV, keywords, LinkedIn, identidad digital | OUT-05, LinkedIn, ATS | Checklist + SOAR |
| Comunicación | Pitch, razón de salida, matriz audiencias | Casi ausente | Wizard Guiones (prioridad) |
| Red | CRM categorizado + follow-up | Networking | CRM + guiones por categoría (anonimizados) |
| Entrevistas | Roleplay + feedback coach | STAR/filtro/video | Roleplay + coach entrevista |
| Compensación | Paquete total + criterios | Oferta | Wizard compensación total |
| Finanzas | 4 pilares | No | Wizard educativo F3 |
| Emprendimiento | Independencia | Segunda carrera fino | Rama opcional F3 |
| SOAR | Logros cuantificados | STAR | SOAR + STAR |
| HH / portales / bandas | Mercado oculto CO | Parcial | Directorio + KB F3 |
| Serie de charlas | Cómo te evalúan | No | Lecciones selección F3 |

### Límite legal

**No** incorporar texto copyright de Lominger/Korn Ferry Career Architect. Usar competencias definidas por nosotros (p. ej. lista del propio cuadernillo “Pruebas”).

## 2. Análisis de mercado (qué debe tener / qué falta)

Componentes esperados en outplacement 2025–26: coaching estructurado, CV/LinkedIn, estrategia de búsqueda, mock interviews, red/mercado oculto, apoyo emocional, datos locales, métricas.

| Componente | Hoy | Gap | Fase |
|------------|-----|-----|------|
| Coach dedicado | Cursos + recordatorio | Personas-coach + Q&A | F2 |
| Plan 3–6 meses | 8 módulos | Ruta tipo cuadernillo con % | F1 |
| Assessment | RIASEC | Mapa + competencias | F1 |
| CV/LinkedIn | Fuerte | SOAR + marca digital | F1 |
| Mercado oculto | Parcial | EVP + HH + matriz | F1–F3 |
| Mock + feedback | Parcial | Rúbrica + coach | F2 |
| Compensación total | Parcial | Paquete + criterios | F1 |
| Bienestar | Bien | OK | — |
| Finanzas transición | No | Wizard 4 pilares | F3 |
| Emprendimiento | Delgado | Rama madura | F3 |
| Outcomes | XP/tablero | Funnel outreach→oferta | F4 |

## 3. Fases

### F0 — KB + guardrails (3–5 días)
- Carpeta `knowledge_base/outplacement/*.md` por módulo (contenido generalizado, sin PII).
- Prompt: solo empleabilidad; citar fuente; no inventar salarios sin KB; derivar crisis a ayuda humana.
- Ampliar RAG existente.

**Valor:** respuestas serias al preguntar / escuchar.

### F1 — Cuadernillo digital + wizards (2–3 semanas)
- Modelo `workbook` (avance + campos).
- Wizards: **Guiones/Matriz**, **Mapa**, **Mercado+EVP**, **SOAR**, **Compensación**.
- Cablear a OUT/herramientas; Tablero “Continúa hoy”.
- TTS en cada paso.

**Valor:** entregables reales del outplacement, no solo lecciones.

### F2 — Coaches personas (2 semanas)
- Personas ATSAdvisor por especialidad + panel Q&A + TTS. ← hecho
- Roleplay entrevista con rúbrica. ← hecho

**Valor:** sensación de charla con especialista.

### F3 — Gaps de mercado (2–3 semanas)
- Finanzas, emprendimiento, directorio reclutadores, “cómo te evalúan”. ← hecho

**Valor:** cobertura premium del mercado.

### F4 — Outcomes (continuo)
- Funnel medible + export PDF/txt del cuadernillo. ← hecho
- Accountability Telegram `/cuadernillo`. ← hecho (F5)

**Valor:** “está funcionando” con números.

### F5 — Cierre profesional (polish)
- Autoeval competencias propias (no Lominger). ← hecho
- EVP top 5 en Mercado. ← hecho
- Compensación integrada al cuadernillo. ← hecho
- Continúa hoy = curso + siguiente bloque cuadernillo. ← hecho
- Telegram `/cuadernillo` tip diario. ← hecho

**Valor:** programa operable de punta a punta.

### F6 — Ops cloud + comunidad
- Sync cuadernillo cloud (`workbook_json` + API + botón Sync). ← hecho
- Cron lunes `/api/cron/cuadernillo` accountability Telegram. ← hecho
- Alumni AMA (fecha/tema en admin). ← hecho

**Valor:** no se pierde el trabajo; comunidad y recordatorios vivos.

## Orden de build sugerido

1. KB + guardrails + mercado de 3 canales ← **hecho (sprint actual)**
2. Wizard Guiones + Matriz ← **hecho**
3. Wizard Mapa ← **hecho**
4. Wizard Mercado + EVP / shortlist empresas ← **hecho (3 canales)**
5. SOAR + CRM guiones ← **hecho (sprint actual)**
6. Cascada IA Groq → Gemini → pago (OpenRouter/DeepSeek) ← **hecho**
7. Coaches personas + roleplay ← **hecho**
8. Finanzas + directorio reclutadores + emprendimiento + cómo te evalúan ← **hecho**
9. Funnel + export PDF ← **hecho**
10. F5 polish (competencias, EVP, compensación, Continúa hoy, Telegram `/cuadernillo`) ← **hecho**
11. F6 sync cloud + cron cuadernillo + alumni AMA ← **hecho**

### Coaches (autoría ATSAdvisor)
Personas propias (Elena, Marcos, Valeria, Tomás, Irene, Gabriel, Natalia) — no reutilizar nombres de firmas ajenas. UI: `/outplacement/coaches` + roleplay `/outplacement/roleplay`.

### F3/F4 rutas
- Finanzas: `/outplacement/cuadernillo/finanzas`
- Directorio: `/outplacement/cuadernillo/directorio`
- Emprendimiento: `/outplacement/cuadernillo/emprendimiento`
- Evaluación: `/outplacement/cuadernillo/evaluacion`
- Funnel: `/outplacement/cuadernillo/funnel`
- Export PDF: `/outplacement/cuadernillo/export`
- Competencias: `/outplacement/cuadernillo/pruebas`
- Compensación: `/outplacement/cuadernillo/compensacion`

### Cascada IA (propia, estilo OpenRouter)
1. **Gratis calidad:** Groq (`llama-3.3-70b-versatile`, fallback 8b)
2. **Gratis:** Gemini Flash
3. **Gratis calidad extra:** Kimi/Moonshot en Groq (si umbral de calidad no se cumple)
4. **Pago precio/calidad:** OpenRouter → DeepSeek (default); si no, OpenAI `gpt-4o-mini`; luego Gemini 2.5

Env: `GROQ_API_KEY`, `GOOGLE_AI_API_KEY`, `OPENROUTER_API_KEY`, `OPENAI_API_KEY`. Admin puede apagar capas.

### Nota de autoría
Todo el contenido nuevo es autoría ATSAdvisor. No usar marcas ni materiales de firmas de outplacement de terceros.

## Cómo lo vive el usuario

1. Paga Carrera → entra a **Mi cuadernillo**.  
2. Continúa el módulo activo (wizard, no índice eterno).  
3. Escucha la guía, completa entregable, marca avance.  
4. Pregunta al coach del módulo (IA grounded).  
5. Recordatorio diario apunta a la misma tarea.

## Siguiente decisión

F0–F6 en código. Pendiente operativo del owner: SQL `alter_workbook_cloud.sql`, claves IA, pagos, enlaces alumni (ver `MANUAL-ACCIONES.md`).
