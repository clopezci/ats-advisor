# Plan: Outplacement profesional (Cuadernillo → ATSAdvisor)

Documento de producto (sin PII). Fuente estructural: `DocumentacionOutplacement/` (cuadernillo Way UP + materiales).

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
- Olga, Juliana, Patricia, John, Carlos, Johan (finanzas educativas).
- Panel “Pregúntale a tu coach” + TTS.
- Roleplay entrevista con rúbrica (estilo feedback del cuadernillo).

**Valor:** sensación de charla con especialista.

### F3 — Gaps de mercado (2–3 semanas)
- Finanzas, emprendimiento, HH/portales, bandas CO, “cómo te evalúan”.

**Valor:** cobertura premium del mercado.

### F4 — Outcomes (continuo)
- Funnel medible, export PDF cuadernillo, accountability Telegram.

**Valor:** “está funcionando” con números.

## Orden de build sugerido

1. KB + guardrails  
2. Wizard Guiones + Matriz  
3. Wizard Mapa  
4. Wizard Mercado + EVP  
5. SOAR + CRM guiones  
6. Coaches + roleplay  
7. Finanzas + HH + emprendimiento  
8. Funnel + PDF  

## Cómo lo vive el usuario

1. Paga Carrera → entra a **Mi cuadernillo**.  
2. Continúa el módulo activo (wizard, no índice eterno).  
3. Escucha la guía, completa entregable, marca avance.  
4. Pregunta al coach del módulo (IA grounded).  
5. Recordatorio diario apunta a la misma tarea.

## Siguiente decisión

Aprobar F0+F1 (KB + Guiones/Matriz + Mapa) como primer sprint de implementación.
