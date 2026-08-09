# Plan Maestro — ATSAdvisor (LOTIC)

**Versión:** 2.1 · **Fecha:** 31 jul 2026  
**Repos:** https://github.com/clopezci/ats-advisor  
**Owner GitHub:** clpezci@gmail.com  
**Marca:** LOTIC Soluciones · https://lotic-soluciones.vercel.app/

---

## Veredicto ejecutivo

**Reconstruir desde cero** como PWA mobile-first. El ATS v1 (escritorio/Python) se trata como **referencia imperfecta con brechas y posibles errores** — **no se porta “tal cual”**. Se usa solo para entender la intención del producto y rescatar diccionarios útiles; el motor nuevo debe ser **ultra-pro** y superar a Jobscan/Teal/Rezi en español + UX + completitud.

**Posicionamiento (quebrar el mercado en 3 ejes):**

1. **Precio** — outplacement y carrera a fracción del corporativo, con margen ≥ 50%.  
2. **Facilidad** — PWA, 2 decisiones, voz in/out, flujo guiado.  
3. **Completitud** — ATS de élite + outplacement OUT-01…08 + **OUT-09 cursos personalizados bajo demanda**.

**Regla financiera:** el techo de IA **no está fijado en $1.000 COP**. Se permite subir el costo de IA **siempre que** el precio al usuario cubra costos variables y deje **margen bruto ≥ 50%**  
`(precio − costo_variable) / precio ≥ 0,50` → **precio ≥ 2 × costo_variable**.

---

## 1. Qué existe hoy (auditoría del repo) — con escepticismo

| Activo | Valor | Decisión |
|--------|-------|----------|
| `modules/analisis_basico.py` (~119 KB) | Intención: match CV↔oferta | **No confiar.** Reescribir 100%. Usar solo como lista de síntomas/casos a cubrir y a corregir |
| `modules/requisitos.py` + JSON de reglas | Ideas de excluyentes | **Auditar una por una**; muchas reglas serán incompletas o ruidosas → rediseñar taxonomía |
| `skills_custom.json`, `noise_terms.json`, learned | Semilla de vocabulario ES | **Filtrar y expandir**; no asumir calidad |
| `carga_archivos.py` | Extracción PDF/DOCX | **Reescribir** con parsers modernos + tests de regresión |
| `pdf_exporter.py` | Informes | **Rehacer** |
| Inno Setup | Distribución Windows | **Eliminar** |
| spaCy lg | NLP local | **No base del producto**; embeddings + LLM + reglas auditadas |
| README TFM | Narrativa ES-first | Conservar el **posicionamiento de idioma**, no la calidad del score |

**Problema de negocio ya probado:** el `.exe` genera fricción → nula adopción. Canal = PWA.

### 1.1 Mandato ATS Ultra-Pro (superar competidores)

El motor nuevo **no hereda** lógica dudosa del v1. Debe incluir, como mínimo:

| Capacidad | Por qué gana |
|-----------|--------------|
| Parse fiel de PDF/DOCX (columnas, tablas, headers) | Jobscan/Rezi fallan o mienten en parse real |
| Match **semántico** ES (sinónimos, género, conjugación, anglicismos laborales) | Competencia EN-first |
| Separación hard skills / soft skills / herramientas / certificaciones / excluyentes | Más claro que un % único |
| Score multi-capa: keywords + requisitos + formato ATS + evidencia cuantificada | No solo “faltan palabras” |
| Perfiles por motor (Workday, Greenhouse, Taleo, SuccessFactors, Lever, SAP) | Gap de mercado |
| Detector trampas (texto oculto, stuffing, fuentes ilegibles) | Protege al candidato |
| Reescritura asistida **fiel a la verdad del CV** (anti-alucinación) | Mejor que keyword stuffing |
| Explicabilidad: “por qué este %” con citas al CV y a la oferta | Confianza |
| Suite de tests con CVs reales ES + ofertas InfoJobs/Computrabajo/LinkedIn | Calidad medible |
| Benchmark interno vs Jobscan/Teal en corpus LATAM | “Ultra-pro” verificable |

**Definition of Done del ATS:** en un set de 50+ casos ES, precisión explicable, recomendaciones accionables, cero sugerencias inventadas de experiencia, y UX móvil superior a Jobscan.

---

## 2. Evaluación de mercado 2026

### 2.1 Optimizadores ATS / CV

| Producto | Qué hace bien | Debilidad vs ATSAdvisor |
|----------|---------------|-------------------------|
| **Jobscan** (~$50/mes) | Match keywords, tips por ATS | Caro, móvil pobre, inglés-first |
| **Teal** (~$29/mes) | CRM de búsqueda, tracker | Scoring básico, UX EN |
| **Rezi / Kickresume** | Builder + IA redacción | Diseño visual ≠ parse ATS real |
| **Resume Worded** | Feedback línea a línea + LinkedIn | Sin outplacement ni voz |
| **Skillsyncer / ResyMatch** | Gaps de keywords rápidos | Superficiales |
| **ATS CV Checker / CvPro / ResuFit** | Algo de foco ES o freemium | Sin carrera completa ni precio COP outplacement |

### 2.2 Outplacement (benchmark LHH, Careerminds, Right Management)

Pilares estándar del mercado corporativo (10–12+ millones COP cuando lo paga la empresa):

1. Contención / transición emocional  
2. Autoevaluación y propuesta de valor  
3. Branding (CV, LinkedIn, narrativa)  
4. Inteligencia de mercado y job matching  
5. Upskilling / e-learning  
6. Networking y mercado oculto  
7. Simulación de entrevistas  
8. Negociación de oferta  
9. Coaching 1:1 humano (el costoso)  
10. Reporting para RH (B2B)

**Brecha:** casi no hay producto **B2C asequible en LATAM** que empaquete esto completo, digital, en español, con microlearning por chat. LHH Career Studio / Careerminds son B2B y caros.

### 2.3 Necesidades no cubiertas (oportunidad)

1. **Español nativo profundo** (conjugaciones, géneros, jerga laboral CO/MX/ES) — no traducción de EN.  
2. **Perfiles por motor ATS** (Workday, Greenhouse, Taleo, SuccessFactors, SAP, Lever) adaptando reglas de formato.  
3. **Detector de trampas ATS** (texto blanco, font 1px, keyword stuffing) para proteger al candidato.  
4. **Accesibilidad voz total** (escuchar + dictar) — casi nadie lo hace bien en esta categoría.  
5. **UX de carga cognitiva mínima** (1 paso, máx. 2 decisiones).  
6. **Outplacement a $50.000–100.000 COP/mes** con pausa al conseguir empleo.  
7. **Microlearning Telegram/WhatsApp** con progreso unificado.  
8. **Habeas Data 1-click** (Ley 1581) como feature de producto, no footnote legal.  
9. **Score “probabilidad de entrevista humana”** (más allá del % de keywords).  
10. **Modo primeros 90 días** post-contratación (extiende LTV).

---

## 3. Visión de producto (qué construir)

### 3.1 Capa Free — Optimizador ATS (con ads)

- Subir CV (PDF/DOCX) + pegar/dictar oferta.  
- Score compuesto: keywords semánticos + requisitos excluyentes + formato ATS + experiencia.  
- Tabs: palabras faltantes, alertas de formato, brechas de formación, acciones priorizadas.  
- Selector “¿A qué ATS/portal postulas?” → reglas de parse.  
- Detector de trampas / texto oculto.  
- Export informe PDF/TXT.  
- Límites justos (ej. N análisis/día) + banners de ads que no rompan la regla de 2 CTAs.  
- IA ligera gratis (sugerencias cortas) vía router free-first.

### 3.2 Capa Premium — Outplacement digital (suscripción COP)

Nueve módulos (8 fijos + 1 personalizado bajo demanda):

| Código | Módulo | Entregables |
|--------|--------|-------------|
| OUT-01 | Estabilización emocional y narrativa | Entrevista voz, plan de acción emocional |
| OUT-02 | Autoevaluación y mapa de competencias | FODA, mapa de skills, propuesta de valor |
| OUT-03 | Inteligencia de mercado laboral LATAM | Roles target, salario banda, gaps |
| OUT-04 | Re-skilling / upskilling | Checklist cursos low-cost, priorizados |
| OUT-05 | Marca personal + CV/LinkedIn ATS | Rewrites STAR, perfil LinkedIn |
| OUT-06 | Mercado oculto + networking | Scripts, plantillas, lista de contactos tipo |
| OUT-07 | Entrevistas + negociación | Simulador voz, feedback, salario |
| OUT-08 | Oferta y primeros 90 días | Checklist onboarding, pausa de suscripción |
| **OUT-09** | **Curso personalizado bajo demanda** | Curso completo generado por IA (blanda o dura), guardado como un curso más del catálogo del usuario |

**Canales de aprendizaje (configurable):**

- Solo PWA  
- Telegram (incluido / bajo costo)  
- WhatsApp (addon; sube margen de costo API)  

Microcápsulas diarias + quizzes → barra de progreso única (OUT-01…09 usan el **mismo motor de entrega**).

**Ganchos de retención:**

- Pausar al conseguir empleo → modo “90 días” (checklist onboarding, sin cobro extra).

### 3.2.1 OUT-09 — Curso personalizado (detalle UX + técnica)

**Mensaje al usuario (ejemplo):**  
“¿Quieres reforzar una habilidad personal (blanda) o técnica (dura)? Elige una opción y descríbenos qué quieres mejorar. Crearemos un curso completo solo para ti, con microcápsulas y quizzes, igual que el resto del outplacement.”

**Flujo (máx. 2 decisiones por pantalla):**

1. Pantalla A — **¿Qué tipo de habilidad?** → `Blanda` | `Técnica`  
2. Pantalla B — Campo escribir/dictar + placeholder gris según elección:  
   - Blanda: *“Ej.: Quiero mejorar mi comunicación asertiva en reuniones con jefes difíciles…”*  
   - Técnica: *“Ej.: Quiero dominar Power BI desde cero para reportes financieros…”*  
3. Pantalla C — **Cuestionario corto de personalización** (3–5 preguntas, una o dos por pantalla; voz in/out). Ejemplos:  
   - ¿Qué es lo **más importante** que debe lograr este refuerzo?  
   - ¿Qué es lo que **más se te dificulta** hoy?  
   - ¿Qué quieres **reforzar con más urgencia**?  
   - ¿Cuál es tu nivel actual? (principiante / intermedio / avanzado)  
   - ¿Cuánto tiempo al día puedes dedicar? (5 / 10 / 15 min)  
4. Pantalla D — Confirmación: `Generar mi curso` | `Editar pedido`  
5. Generación async → curso en “Mis cursos” con el mismo motor de microcápsulas.

**Pipeline IA (validación / “internet” + cascade de calidad):**

1. Clasificar y normalizar el pedido (scope, nivel, duración) usando respuestas del cuestionario.  
2. **Grounding:** búsqueda web / fuentes curadas para validar que el tema es real, actual y enseñable; rechazar pedidos imposibles, ilegales o vacíos.  
3. Diseñar syllabus (objetivos, 7–21 microcápsulas, quizzes, práctica) **personalizado** con las respuestas del cuestionario.  
4. Generar contenido en español, tono coach, actionable.  
5. Persistir en DB como `Course` del usuario (mismo schema que OUT-01…08).  
6. Encolar microcápsulas en el canal elegido (PWA / Telegram / WhatsApp).

**Cascade free → pago (calidad mínima garantizada):**

```
[1] Generar con IA gratuita (Groq / Gemini Flash free)
        ↓
[2] Validador interno (rúbrica automática, sin mostrar al usuario):
    - Cobertura de objetivos del cuestionario
    - Profundidad mínima por cápsula
    - Coherencia blanda vs técnica
    - Español usable / sin alucinaciones graves
    - Estructura completa (objetivos, cápsulas, quizzes)
        ↓
[3] ¿Pasa umbral de calidad?
    SÍ → entregar al usuario
    NO → regenerar con IA de pago de mayor capacidad (Flash paid / modelo superior)
        ↓
[4] Segunda validación; si aún falla → 1 reintento o mensaje humano + alerta Telegram al owner
```

El admin configura `quality_threshold`, `max_paid_escalations` y modelos free/paid. Así se maximiza uso gratis y solo se paga cuando hace falta calidad.

**Límites anti-abuso (configurables en admin):**

- N cursos OUT-09 incluidos por mes de suscripción (recomendado: **1 incluido**).  
- Extra OUT-09: cobro unitario o upgrade de plan.  
- Cap de tokens / longitud del pedido.  
- Cola y timeout con mensaje humano si falla grounding.

### 3.3 Ideas creativas / disruptivas (roadmap P2)

- **Infiltrado cultural:** adaptar CV a valores detectados de la empresa (sin scraped ilegal; usar datos públicos / descripción).  
- **Score predictivo de llamada de filtro** (3 preguntas probables + ensayo por voz).  
- **Modo “segunda carrera / emprendimiento”** dentro de outplacement.  
- **Certificado de avance** descargable (gamificación seria).  
- **B2B Empresas** (P3): licencias de outplacement masivo + dashboard RH.  
- **Biblioteca SEO gratis:** calculadora de match, plantillas ATS, blog → adquisición orgánica.

### 3.4 Roles de la aplicación (aclaración)

El documento mezcla “cliente / reparador / empresa” (parece de otra app LOTIC). **Roles ATSAdvisor:**

1. **Candidato** — usa ATS free + outplacement; panel personal (perfil, pagos, Habeas Data, baja).  
2. **Admin / Owner** (`clpezci@gmail.com` + correos autorizados) — precios, cupones, feature flags, testers, LLM router, salud.  
3. **Tester privilegiado** — permiso temporal “como premium” sin pago.  
4. **Empresa RH** — solo fase P3.

---

## 4. Arquitectura técnica (calidad vs precio)

```
[ PWA Next.js · Vercel ]
        │ HTTPS
[ Supabase Auth + Postgres RLS + Storage ]
        │
[ API Routes / Edge Functions ]
   ├── Motor ATS (reglas + embeddings)
   ├── AI Router (Groq → Gemini Flash → paid cheap)
   ├── RAG /knowledge_base (outplacement)
   ├── Jobs: export, microlearning, audits
   └── Notificaciones: Resend + Telegram (+ WhatsApp opcional)
[ Sentry → Telegram + email ]
[ Pagos: Wompi / Mercado Pago COP ]
```

### Stack recomendado

| Capa | Elección | Por qué |
|------|----------|---------|
| Frontend | Next.js App Router + Tailwind + PWA | Vercel nativo, SEO, mobile |
| Auth/DB | Supabase | RLS, Storage CVs, barato, Habeas Data |
| Email | Resend | Ya en stack LOTIC |
| IA free | Groq + Google AI Studio (Gemini Flash) | Velocidad + volumen gratis |
| IA paid fallback | Modelo barato (Flash/mini vía OpenRouter o directo) | Solo tras agotar free |
| Observabilidad | Sentry | Errores reales + APM |
| Alertas owner | Telegram Bot | Ya lo usas |
| Pagos | Wompi o Mercado Pago | COP nativo |
| Ads | Google AdSense (o red LATAM) | Monetiza free |

**Nota:** no hace falta FastAPI obligatorio si Next.js + Edge cubre; si el motor NLP/embeddings es pesado, un worker Node/Python en Railway/Render como servicio interno. Preferencia: **empezar full Next.js + Supabase** y extraer worker solo si hace falta.

### AI Router (tipo OpenRouter interno)

Orden de consumo:

1. Groq free / barato para tareas cortas.  
2. Gemini Flash (free → paid) para CV largos, OUT-09, simuladores.  
3. Modelo pago mejor **solo** cuando el valor del módulo lo justifica y el margen ≥ 50% se sostiene.

**Política de costo (actualizada):** no hay techo rígido de $1.000 COP. El admin define `max_ai_cost_cop_per_user_month` y precios; el sistema alerta si el margen proyectado cae bajo 50%.

---

## 4.1 Costos de IA y precios recomendados (margen ≥ 50%)

Tipo de cambio de trabajo: **1 USD ≈ 4.000 COP** (ajustar en admin).  
“Margen 50%” = `(precio − costo_variable) / precio ≥ 0,50` → **cobrar ≥ 2× el costo variable**.

### A. Costos variables estimados por usuario / mes

| Concepto | Uso típico | Costo est. USD | Costo est. COP |
|----------|------------|----------------|----------------|
| ATS free (reglas + embeddings + IA corta) | 5 análisis/día tope; mayoría free-tier | $0,00–0,15 | 0–600 |
| Outplacement OUT-01…08 (RAG + chat + simulador ligero) | uso medio | $0,40–1,20 | 1.600–4.800 |
| Microcápsulas Telegram | ~30 msgs/mes | ~$0 | ~0 |
| Microcápsulas WhatsApp (utility CO ~$0,0008/msg) | ~30 msgs | ~$0,03 | ~120 |
| **OUT-09 generación** (grounding + syllabus + 14–21 cápsulas) | 1 curso/mes | $0,25–0,80 | 1.000–3.200 |
| OUT-09 entrega (quizzes feedback IA) | 14–21 días | $0,10–0,40 | 400–1.600 |
| Infra (Supabase/Vercel prorrateado) | activo | $0,10–0,30 | 400–1.200 |

**Costo variable tipico Premium (PWA + Telegram, 1× OUT-09/mes):**  
≈ **$0,85–2,70 USD** → **$3.400–10.800 COP**.

**Costo variable tipico Premium + WhatsApp:** sumar ~$0,03–0,15 → casi irrelevante en CO; más alto si hay muchos marketing templates.

### B. Precios mínimos para margen ≥ 50%

| Perfil de costo | Costo var. COP | Precio mínimo (2×) | Precio sugerido al mercado |
|-----------------|----------------|--------------------|----------------------------|
| Uso ligero | ~4.000 | 8.000 | — |
| Uso medio (meta) | ~7.000 | 14.000 | — |
| Uso intensivo + OUT-09 | ~11.000 | 22.000 | — |

El mercado de outplacement corporativo está en **millones**. Incluso cobrando **muy por encima del mínimo de margen**, sigues quebrando por **precio**.

### C. Empaque comercial recomendado (rompe mercado)

| Plan | Precio COP/mes | Incluye | Margen est. (uso medio) |
|------|----------------|---------|-------------------------|
| **ATS Free** | $0 + ads | ATS ultra-pro limitado + ads | Ads ≥ costo |
| **Carrera (Outplacement)** | **$79.000**/mes | OUT-01…08 + Telegram/PWA + coach/simulador. **Sin OUT-09 incluido**. | ~70–85% |
| **Carrera Plus** | **$99.000**/mes | Todo Carrera + **2× OUT-09**/mes + más simulador | ~65–80% |
| **OUT-09 extra** | **$22.000** / curso | 1 curso personalizado adicional | ≥50% |
| **Modo 90 días (post-empleo)** | **$0** (pausa de suscripción) | Checklist onboarding al nuevo empleo — **no es SKU de $39k** | Alto |

**Nota:** Se eliminó la “garantía 30 días sin entrevistas” (no controlable). El antiguo precio `plan_90_dias` $39k se retiró para no confundir con “3 meses baratos”.

**Por qué $79k–99k y no $50k:** a $50k aún hay margen en uso medio, pero OUT-09 + simulador intenso puede comer margen; **$79k** da colchón ≥50% incluso en uso alto y sigue siendo ~1% del outplacement corporativo → **quiebre por precio** sin suicidio unitario.

**Admin configurable:** precios, cupones, `out09_included_per_month`, `out09_extra_price_cop`, `max_ai_cost_alert`, canal WhatsApp on/off.

### D. Unit economics OUT-09 (detalle)

| Ítem | Est. |
|------|------|
| Generación (Flash/paid + grounding) | $0,25–0,80 |
| Entrega 21 cápsulas + quizzes | $0,10–0,40 |
| **Total 1 curso** | **$0,35–1,20 ≈ 1.400–4.800 COP** |
| Precio extra sugerido | **19.000–25.000 COP** |
| Margen curso extra | **~75–90%** |

Si un usuario genera 3+ OUT-09/mes sin cobro extra, el margen del plan $79k puede caer: por eso el **límite incluido** + upsell.

### UX no negociable

- Mobile-first PWA, flujo progresivo event-driven.  
- **Máximo 2 decisiones** por pantalla.  
- Layout tipo bento / tarjetas claras (sin dashboard sobrecargado en el flujo principal).  
- **Escuchar** (TTS) en todo texto relevante; **Micrófono** (STT) en todo input.  
- Acento corporativo: **morado brillante sutil** en botones/sombras; logo LOTIC al final.  
- Errores humanos, nunca stack traces.

### Legal / seguridad

- TLS, cifrado en reposo (Supabase), validación Zod/Pydantic.  
- Ley 1581 / Habeas Data: export ZIP/JSON 1-click + derecho al olvido.  
- Políticas: privacidad, cookies, términos, contacto, quiénes somos (footer).  
- Alineación razonable a buenas prácticas ISO 27001 (no certificación formal en MVP).  
- No entrenar modelos de terceros con datos sensibles en free tiers que lo permitan → preferir paid/privacy-safe para CVs cuando el volumen lo justifique; documentar en política.

### Admin Owner (variables dinámicas)

Precios COP, monedas, cupones (%/valor/fechas), límites IA, textos microlearning, feature flags, proveedores LLM, ads on/off, whitelist testers/premium, promociones, umbrales de alerta, cron de auditoría (N veces/día) → reporte email + Telegram.

### Analytics

- **Básico (incluido):** métricas producto (registros, análisis, conversión, errores) + alertas Telegram/email.  
- **Pro (addon costo):** correlaciones / previsiones tipo BI (evitar Power BI caro al inicio; Metabase self-host o charts propios sobre vistas SQL).

---

## 5. SEO y adquisición (sin pagar ads caros)

- Landing + blog + herramientas free (calculadora match, checklist ATS, plantillas).  
- metadata/OG/sitemap/robots, Core Web Vitals.  
- Footer legal completo.  
- Publicar en LOTIC: `data/projects.json` según `PUBLICAR-UNA-APP.md`.

Entrada sugerida LOTIC (cuando haya URL):

```json
{
  "name": "ATSAdvisor",
  "url": "https://URL-VERCEL",
  "category": "Empleo · Carrera",
  "status": "En desarrollo",
  "accent": "#8b5cf6",
  "tagline": "Pasa el ATS y reconstruye tu carrera sin pagar millones.",
  "problem": "Los filtros ATS descartan CVs buenos y el outplacement corporativo es inaccesible para quien busca empleo por su cuenta.",
  "solution": "Analiza tu CV contra la oferta en español, te guía por voz y ofrece outplacement digital a precio local.",
  "highlights": ["ATS gratis", "Español nativo", "Outplacement accesible", "Voz inclusiva", "Habeas Data 1-click"]
}
```

---

## 6. Roadmap por fases (12 semanas)

| Fase | Semanas | Entregable | Gate |
|------|---------|------------|------|
| **F0 Fundación** | 1 | Repo limpio, auth, PWA shell, CI, branding, README | **STOP:** conectar Vercel + URL |
| **F1 ATS Core** | 2–3 | Parse CV, match ES, score, export, ads slots | Demo móvil usable |
| **F2 AI Router** | 4 | Cascade free→paid, cuotas, telemetría costo | ≤ presupuesto IA |
| **F3 UX Voz** | 5 | 2-decisiones, TTS/STT, checklist copilot | Accesibilidad OK |
| **F4 Outplacement** | 6–8 | OUT-01…08 + RAG + progreso + **OUT-09 generador** | Contenido profesional + curso personalizado |
| **F5 Canales** | 9 | Telegram (+ WhatsApp opcional), quizzes | Omnicanal |
| **F6 Admin + Legal** | 10 | Owner console, Habeas Data, Sentry→Telegram | Compliance |
| **F7 Analytics** | 11 | Dashboard básico (+ Pro opcional) | Alertas negocio |
| **F8 SEO + LOTIC + E2E** | 12 | Blog/tools free, projects.json, auditoría extrema | Go-live |

### Protocolo de arranque (como pediste)

1. Autorizas inicio.  
2. Construyo bases F0 → **primer push**.  
3. **Me detengo** y pido conectar Vercel + URL.  
4. Continúo F1…F8 y actualizo LOTIC.

---

## 7. Knowledge base permanente (`/knowledge_base`)

Curar y versionar (RAG):

- Metodologías outplacement (transición, coaching, networking).  
- Reglas parse ATS por plataforma.  
- Diccionarios skills ES por industria/nivel.  
- Guías STAR, negociación salarial LATAM.  
- Plantillas mensajes LinkedIn / reclutadores.  
- FAQ legales empleo (informativo, no asesoría jurídica).

---

## 8. Criterios de calidad E2E (auditoría final)

- Flujos extremo a extremo sin huecos (registro → análisis → pago → módulo → baja).  
- Validación de campos, manejo de errores humano.  
- Seguridad: RLS, authz admin, rate limits, sanitización uploads.  
- Atomicidad en pagos y exportación de datos.  
- Escalabilidad: jobs async, no bloquear UI.  
- PWA instalable en Android/iOS Safari.  
- Costos IA bajo techo configurado.

---

## 9. Modelo de negocio (resumen)

| Capa | Precio | Monetización |
|------|--------|--------------|
| ATS ultra-pro | Gratis (límites) | Ads + upsell |
| Carrera | **$79.000 COP/mes** (sugerido) | OUT-01…08 + 1× OUT-09 + Telegram |
| Carrera Plus | **$99.000 COP/mes** | + WhatsApp + 2× OUT-09 |
| OUT-09 extra | **$19.000–25.000** | Curso personalizado adicional |
| Analytics Pro / B2B RH | Futuro | Margen alto |

**Regla de oro:** cualquier feature de IA nueva se lanza solo si el admin puede demostrar margen ≥ 50% al precio vigente.

---

## 10. Qué NO hacer

- No distribuir `.exe` como canal principal.  
- **No reutilizar el motor ATS v1 “porque ya existe”** — asumir brechas/errores y superar competidores con diseño nuevo + tests.  
- No copiar UI densa de Jobscan.  
- No depender solo de keyword exact match.  
- No IA premium ilimitada en free.  
- No OUT-09 ilimitado sin cobro/límites (rompe margen).  
- No mezclar roles de otra app (reparadores).  
- No tocar LOTIC hasta URL estable.

---

## Decisión pendiente para ti

Confirma o ajusta:

1. Precio **Carrera $79k** / **Plus $99k** / **OUT-09 extra ~$22k**  
2. OUT-09 incluidos: **1** (Carrera) / **2** (Plus)  

Luego responde **“autorizo iniciar F0”** y arranco scaffold + primer push → me detengo para Vercel.
