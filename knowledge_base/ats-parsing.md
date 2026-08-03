# Conocimiento ATS — cómo filtran y cómo optimizar (2025–2026)

## Pipeline real de un ATS
1. **Ingesta**: PDF/DOCX/TXT subido o pegado en el formulario.
2. **Parse**: el motor extrae nombre, contacto, roles, fechas, educación, skills.
3. **Match**: keywords literales y/o semántica (embeddings/NLP) vs la vacante.
4. **Ranking / score**: umbral típico de surfacing a reclutador ~60–75% (varía por empresa).
5. **Humano**: scorecard (Greenhouse) o revisión rápida 6–10 segundos.

Parsing ≠ screening: primero se estructura el CV; luego se puntúa el encaje.

## Por motor (investigación de mercado)
### Taleo (Oracle) — legacy
- Keywords **exactas** y densidad importan.
- Sinónimos ayudan poco: escribe el término de la oferta.
- Preferible DOCX o PDF texto; encabezados estándar.

### Workday
- Parse **semántico**: entiende contexto (“lideré 12 personas” ≈ liderazgo).
- Castiga columnas, tablas, encabezados en imagen, PDF escaneado.
- Aun así incluye keywords literales de la vacante en viñetas de logro.

### Greenhouse / Lever
- Parse generalmente bueno con 1 columna.
- El filtro fuerte suele ser el **humano + scorecard**, no solo el % keyword.
- Evidencias medibles > listas vacías de skills.

### SuccessFactors / SAP
- Parsers estrictos; evita tablas anidadas y diseños creativos.
- Títulos de cargo literales; módulos SAP si la oferta los nombra.

### iCIMS / otros enterprise
- Combinan tags del reclutador + overlap de skills.
- Completar el **formulario** del portal cuenta tanto como el PDF adjunto.

## Qué hacen herramientas similares (Jobscan, Teal, Resume Worded, SkillSyncer)
- Match % CV vs oferta, hard/soft skills, missing keywords.
- Chequeos de formato ATS.
- (Algunas) reescritura IA de viñetas, LinkedIn, tracker.
- Jobscan: tips por motor nombrado (Workday/Taleo/…).
- Resume Worded: calidad de contenido / impacto, no solo keywords.
- Teal: builder + tracker + match.
- SkillSyncer: gap de keywords económico.

## Brechas de mercado que ATSAdvisor cubre (LATAM)
- Español / ofertas LATAM + perfiles ATS con pesos distintos.
- Must-have vs nice-to-have heurístico.
- Coaching de **cómo postular** (formulario, timing, carta, STAR), no solo “faltan palabras”.
- Ajuste de HV **coherente** con disclaimer de veracidad (anti keyword stuffing / anti fraude).
- Voz, outplacement y PWA en el mismo producto.

## Reglas de oro al ajustar el CV
- Nunca inventar experiencia; keyword stuffing y texto oculto = riesgo de descarte.
- Keywords en **contexto de logros** (verbo + skill + resultado), no en un párrafo basura.
- 1 columna, tipografía estándar, fechas MM/AAAA, PDF texto seleccionable.
- Cuantificar (%, COP, tiempo, personas, alcance).
- Adaptar el CV a **esta** vacante; completar el formulario con los mismos términos.

## Match semántico en ATSAdvisor
Además de keywords/sinónimos ES, el motor calcula solape bag-of-words (cosine) y lo mezcla con el score según el perfil ATS (Taleo más keyword; Workday más semántico). No sustituye embeddings cloud, pero reduce falsos negativos.
