# Guía de pruebas ATSAdvisor (fácil)

**Para quién:** cualquiera que pueda usar el celular o la computadora.  
**No necesitas** saber programar.

**App:** https://ats-advisor-two.vercel.app/  
**Admin (solo el dueño):** https://ats-advisor-two.vercel.app/admin  

---

## Antes de empezar

1. Pide al dueño que haga el **Redeploy** en Vercel (si aún no).
2. Abre la app en el **celular** (recomendado) y, si puedes, también en la **computadora**.
3. Usa una **ventana de incógnito / privada** la primera vez (como usuario nuevo).
4. Ten a mano un **correo** que puedas abrir.
5. Ve marcando cada casilla cuando lo pruebes y salga bien.

| | |
| --- | --- |
| Quién prueba | |
| Fecha | |
| Celular o PC | ☐ Celular ☐ PC ☐ Ambos |

**Si algo falla:** anótalo al final en “Problemas encontrados” (qué estabas haciendo y qué viste).

---

# Parte 1 — ¿La app abre?

### 1. Entrar a la página principal
- **Dónde:** https://ats-advisor-two.vercel.app/
- **Qué hacer:** abre el enlace.
- **OK si:** ves el nombre ATSAdvisor y la página carga (no pantalla en blanco).
- [ ] Listo

### 2. Revisar el menú de arriba y el pie de página
- **Dónde:** arriba: **Inicio**, **Herramientas**, Mapa, Tracker, Precios, Cuenta.  
  Abajo: Privacidad, Términos, Cookies, Preferencias de cookies, Contacto, Blog.
- **Qué hacer:** toca Inicio (vuelve al home) y Herramientas. Luego prueba 2 enlaces del pie.
- **OK si:** cada enlace abre otra pantalla sin error raro.
- [ ] Listo

### 3. Probar el mapa de capacidades
- **Dónde:** arriba toca **Mapa** (o ve a `/capacidades`).
- **Qué hacer:** mira la lista de cosas que hace la app.
- **OK si:** se ve una lista y puedes volver atrás.
- [ ] Listo

---

# Parte 2 — Voz (escuchar y hablar)

> En el celular suele funcionar mejor. Si pide permiso de micrófono, acepta.

### 4. Botón de escuchar
- **Dónde:** pantallas con un botón de **escuchar / parlante** (por ejemplo en Outplacement o ATS).
- **Qué hacer:** tócalo.
- **OK si:** el teléfono lee el texto en voz alta (español).
- [ ] Listo
- [ ] No aplica (no encontré el botón) → anótalo abajo

### 5. Botón de dictar
- **Dónde:** pantallas con **Dictar** (por ejemplo Herramientas → Calculadora de match).
- **Qué hacer:** toca Dictar, habla una frase corta, mira si el texto aparece en la caja.
- **OK si:** tu voz se convierte en texto.
- **También OK si:** dice que el micrófono no está disponible (en ese caso anótalo; no es grave en todos los celulares).
- [ ] Funciona
- [ ] No disponible en mi celular (anotado)

---

# Parte 3 — Usuario gratis (sin pagar)

### 6. Aceptar cookies / preferencias
- **Dónde:** al entrar (ventana nueva o incógnito) sale un recuadro abajo.  
  Si no sale: al final de cualquier página toca **Preferencias de cookies**.
- **Qué hacer:** elige **Aceptar** o **Solo esenciales**.
- **OK si:** el recuadro se cierra y puedes volver a abrirlo desde el pie de página.
- [ ] Listo

### 7. ¿Qué tan bien encaja tu CV? (rápida y gratis)
- **Dónde:** menú de arriba **Herramientas** → **¿Qué tan bien encaja tu CV?**  
  o desde Inicio el botón del mismo nombre.  
  Enlaces: https://ats-advisor-two.vercel.app/herramientas/calculadora  
  (el antiguo `/herramientas/match` también debe abrir lo mismo).
- **Qué hacer:**
  1. Pega un pedazo de tu hoja de vida (aunque sea inventado).
  2. Pega un pedazo de una oferta de empleo.
  3. Toca **Calcular coincidencia**.
- **OK si:** sale un porcentaje y un consejo en español.
- [ ] Listo

### 8. Analizar CV contra una oferta (ATS)
- **Dónde:** https://ats-advisor-two.vercel.app/ats  
  o desde el inicio “Analizar mi CV”.
- **Qué hacer:**
  1. Pega un CV un poco más largo (varias líneas).
  2. Pega una oferta.
  3. Toca analizar / continuar.
- **OK si:** te muestra un puntaje y recomendaciones en español (no un error feo de programación).
- [ ] Listo

### 8b. Títulos del resultado ATS (ayuda)
- **Dónde:** en el resultado del análisis, al lado de cada título hay un botón **?**.
- **Qué hacer:** tócalo (celular) o pasa el cursor (PC) sobre títulos como “Palabras de la oferta vs tu CV” o “Habilidades técnicas”.
- **OK si:** aparece una explicación en español sencillo.
- [ ] Listo

### 8c. Descargar el CV ajustado
- **Dónde:** en el resultado ATS → “Ajustar hoja de vida” → **Descargar DOCX del ajuste**.
- **Qué hacer:** descarga y ábrelo en Word.
- **OK si:** se ve como una hoja de vida normal (nombre, experiencia…), **sin** títulos tipo “Resumen de cambios” o “CV REESCRITO COMPLETO”.
- [ ] Listo

### 9. Si pegas muy poco texto
- **Dónde:** misma pantalla `/ats`.
- **Qué hacer:** deja el CV casi vacío y intenta analizar.
- **OK si:** te dice con palabras claras que falta texto (no se “rompe” la página).
- [ ] Listo

### 10. Guardar una postulación en el Tracker
- **Dónde:** arriba **Tracker** → https://ats-advisor-two.vercel.app/tracker
- **Qué hacer:** escribe un cargo y una empresa y guárdalo. Cambia el estado (por ejemplo “Aplicado”).
- **OK si:** al salir y volver, sigue ahí.
- [ ] Listo

### 11. Ver anuncio interno (ArriendoSeguro)
- **Dónde:** inicio o **Blog**, siendo usuario gratis.
- **Qué hacer:** busca un bloque que hable de ArriendoSeguro / LOTIC.
- **OK si:** lo ves y el enlace abre otra página.
- [ ] Listo
- [ ] No lo vi (avisa al dueño: puede faltar activar “ads” en admin)

### 12. Mirar precios (sin pagar aún)
- **Dónde:** **Precios** → https://ats-advisor-two.vercel.app/precios
- **Qué hacer:** lee los planes.
- **OK si:** ves algo como Carrera (~$79.000), Plus (~$99.000) y OUT-09 extra.  
  **No debe** aparecer una “garantía de 30 días de entrevistas” ni un plan raro de $39.000 por 3 meses.
- [ ] Listo

### 13. Outplacement bloqueado si no pagaste
- **Dónde:** https://ats-advisor-two.vercel.app/outplacement
- **Qué hacer:** intenta entrar a la ruta de módulos.
- **OK si:** te invita a ver precios / activar plan (no te deja todo gratis como si hubieras pagado).
- [ ] Listo

### 14. Blog
- **Dónde:** https://ats-advisor-two.vercel.app/blog
- **Qué hacer:** abre 2 artículos.
- **OK si:** se leen bien en el celular.
- [ ] Listo

---

# Parte 4 — Cuenta e invitaciones

### 15. Entrar / correo mágico
- **Dónde:** https://ats-advisor-two.vercel.app/auth
- **Qué hacer:** pon tu correo y pide el enlace. Revisa el correo y entra.
- **OK si:** quedas con sesión iniciada **o** un mensaje claro si todavía no está configurado el correo.
- [ ] Listo
- [ ] No pude (anotar el mensaje exacto)

### 16. Mi cuenta
- **Dónde:** **Cuenta** → https://ats-advisor-two.vercel.app/cuenta
- **Qué hacer:** guarda tu nombre y correo.
- **OK si:** al recargar siguen guardados.
- [ ] Listo

### 17. Invitar a un amigo
- **Dónde:** Cuenta → **Invitar amigos**  
  https://ats-advisor-two.vercel.app/cuenta/referidos
- **Qué hacer:** copia el enlace y ábrelo en otra ventana privada.
- **OK si:** ves tu código y el enlace se puede copiar.
- [ ] Listo

---

# Parte 5 — Con plan de pago (Carrera o Plus)

> Solo si el dueño ya activó pagos de prueba **o** te puso plan de prueba en la cuenta.  
> Si no, marca “No aplica todavía”.

### 18. Activar plan
- **Dónde:** Precios / Cuenta.
- **Qué hacer:** paga en modo prueba **o** el dueño te deja plan Carrera/Plus.
- **OK si:** en Cuenta ves el plan activo (Carrera o Plus).
- [ ] Listo
- [ ] No aplica todavía

### 19. Ruta de aprendizaje (cápsulas)
- **Dónde:** Outplacement → ruta OUT  
  https://ats-advisor-two.vercel.app/outplacement/ruta
- **Qué hacer:** lee una cápsula, responde el quiz si aparece, pasa a la siguiente.
- **OK si:** el avance se guarda si sales y vuelves.
- [ ] Listo
- [ ] No aplica todavía

### 20. Misiones del día
- **Dónde:** https://ats-advisor-two.vercel.app/outplacement/misiones
- **Qué hacer:** marca una misión como hecha.
- **OK si:** sube la experiencia (XP) o la racha.
- [ ] Listo
- [ ] No aplica todavía

### 21. Assessment RIASEC
- **Dónde:** https://ats-advisor-two.vercel.app/outplacement/assessment
- **Qué hacer:** responde las preguntas.
- **OK si:** al final te da un código / roles sugeridos.
- [ ] Listo
- [ ] No aplica todavía

### 22. Career Brief
- **Dónde:** https://ats-advisor-two.vercel.app/outplacement/career-brief
- **Qué hacer:** completa y genera el resumen.
- **OK si:** puedes ver o imprimir/guardar el resultado.
- [ ] Listo
- [ ] No aplica todavía

### 23. Plan de la semana y mi progreso
- **Dónde:**  
  - https://ats-advisor-two.vercel.app/outplacement/plan-semana  
  - https://ats-advisor-two.vercel.app/outplacement/progreso
- **Qué hacer:** marca un día del plan; mira el resumen de progreso.
- **OK si:** se entiende qué llevas y qué te falta.
- [ ] Listo
- [ ] No aplica todavía

### 24. Curso personalizado OUT-09 (solo Plus)
- **Dónde:** https://ats-advisor-two.vercel.app/outplacement/out09
- **Qué hacer:** pide un curso corto.
- **OK si:** se genera y puedes leer cápsulas **o** te dice claramente que necesitas Plus.
- [ ] Listo
- [ ] No aplica todavía

### 25. Chat coach
- **Dónde:** https://ats-advisor-two.vercel.app/outplacement/coach
- **Qué hacer:** haz una pregunta de empleo en español.
- **OK si:** responde en español de forma útil (o avisa si la IA no está disponible, sin “código raro”).
- [ ] Listo
- [ ] No aplica todavía

### 26. Conseguí empleo (pausa)
- **Dónde:** Outplacement (botón de pausar / 90 días).
- **Qué hacer:** elige que conseguiste empleo / abrir 90 días.
- **OK si:** abre el checklist de primeros 90 días. **No** te debe cobrar $39.000 por eso.
- [ ] Listo
- [ ] No aplica todavía

---

# Parte 6 — Aliados / expertos (coach humano)

> Primero el dueño debe haber cargado un aliado en Admin (nombre, correo, precio).

### 27. Ver marketplace
- **Dónde:** https://ats-advisor-two.vercel.app/outplacement/marketplace
- **Qué hacer:** mira los paquetes y precios.
- **OK si:** se ven precios en pesos.
- [ ] Listo
- [ ] No hay aliados aún (el dueño debe cargarlos)

### 28. Pedir un experto
- **Dónde:** https://ats-advisor-two.vercel.app/outplacement/experto
- **Qué hacer:** elige aliado, llena nombre, correo, mensaje (mínimo un par de frases) y envía.
- **OK si:** dice que se envió y te da un enlace para confirmar después.
- [ ] Listo

### 29. Confirmar que tomaste el servicio
- **Dónde:** el enlace que te llegó (o el de la pantalla)  
  `/outplacement/experto/confirmar...`
- **Qué hacer:** pon fecha, monto y una nota (“tuve la sesión por Zoom”) y confirma.
- **OK si:** dice que quedó registrado.
- [ ] Listo
- [ ] No aplica todavía

### 30. (Solo dueño) Corte de comisiones
- **Dónde:** https://ats-advisor-two.vercel.app/admin/expertos  
  Entra con la clave de admin.
- **Qué hacer:** filtra confirmados, genera el corte de la semana.
- **OK si:** ves el total de comisión.
- [ ] Listo
- [ ] No soy el dueño / no aplica

---

# Parte 7 — Otras herramientas útiles (rápido)

Marca las que pruebes (al menos 3):

- [ ] Checklist CV — `/herramientas/checklist`
- [ ] LinkedIn — `/herramientas/linkedin`
- [ ] Carta — `/herramientas/carta`
- [ ] Salario — `/herramientas/salario`
- [ ] Plantilla CV — `/herramientas/plantilla`
- [ ] Entrevistas — `/herramientas/entrevistas`
- [ ] Cultura empresa — `/herramientas/cultura`
- [ ] Vacantes — `/outplacement/vacantes`
- [ ] Video mock — `/outplacement/video-entrevista` (el video se queda en tu celular, no se sube)
- [ ] Cursos externos — `/outplacement/cursos`
- [ ] Portfolio STAR — `/outplacement/portfolio`
- [ ] Alertas de vacantes — `/outplacement/alertas`
- [ ] Alumni — `/outplacement/alumni`
- [ ] Simulador entrevista — `/outplacement/entrevista`
- [ ] Filtro telefónico — `/outplacement/filtro`
- [ ] Networking — `/outplacement/networking`
- [ ] Bienestar — `/outplacement/bienestar`
- [ ] Remoto / inglés — `/outplacement/remoto`
- [ ] Negociar oferta — `/outplacement/oferta`

**OK en cada una si:** la pantalla se entiende, puedes escribir o tocar, y no se “rompe”.

---

# Parte 8 — Privacidad (Habeas Data)

### 31. Exportar mis datos
- **Dónde:** Cuenta → opciones de Habeas Data / exportar.
- **Qué hacer:** pide exportar.
- **OK si:** te baja un archivo o te muestra tus datos.
- [ ] Listo

### 32. Borrar mis datos (cuidado: borra de verdad)
- **Dónde:** misma zona en Cuenta.
- **Qué hacer:** solo si estás en una cuenta de prueba. Confirma el borrado.
- **OK si:** limpia la info y te avisa.
- [ ] Listo
- [ ] Lo salté a propósito (no quiero borrar)

---

# Parte 9 — Cómo se siente la app (diseño)

Responde con sí/no marcando:

- [ ] Se ve clara (fondo claro, no oscura completa).
- [ ] Los botones morados se notan; el resto no está “todo morado”.
- [ ] En el celular se puede leer sin hacer zoom todo el tiempo.
- [ ] No me piden demasiadas cosas a la vez en una sola pantalla.
- [ ] Cuando hay error, el mensaje se entiende (no parece código de computador).
- [ ] Siempre sé cómo volver (botón Volver o menú).

---

# Parte 10 — Empresa (opcional, demo)

### 33. Portal empresas
- **Dónde:** https://ats-advisor-two.vercel.app/empresa
- **Qué hacer:** crea una empresa de prueba, mira invitaciones y dashboard.
- **OK si:** puedes guardar y ver números simples (es una demo en el navegador).
- [ ] Listo
- [ ] No lo probé

---

# Parte 11 — Solo el dueño (admin)

Clave: la variable `ADMIN_SECRET` de Vercel.

### 34. Entrar al admin
- **Dónde:** https://ats-advisor-two.vercel.app/admin
- **Qué hacer:** pega la clave y entra.
- **OK si:** ves precios, banderas y aliados.
- [ ] Listo

### 35. Guardar un aliado de prueba
- **Qué hacer:** añade nombre, correo, valor del servicio (ej. 80000), comisión % (ej. 15), activo, guardar.
- **OK si:** en `/outplacement/experto` ya se ve ese aliado con el precio.
- [ ] Listo

### 36. Reporte de salud
- **Qué hacer:** botón de enviar reporte de salud (si está).
- **OK si:** te llega aviso por Telegram o confirma envío.
- [ ] Listo
- [ ] No aplica

---

# Recorridos recomendados (elige uno por día)

## Recorrido A — 15 minutos (gratis)
1. [ ] Parte 1 (abre la app)  
2. [ ] Calculadora de match  
3. [ ] ATS  
4. [ ] Tracker  
5. [ ] Precios  
6. [ ] ¿Se ve el anuncio?

## Recorrido B — 30 minutos (con plan)
1. [ ] Cuenta / plan activo  
2. [ ] Una cápsula OUT  
3. [ ] Misiones  
4. [ ] Assessment  
5. [ ] Plan de la semana  
6. [ ] Coach una pregunta  

## Recorrido C — 20 minutos (aliados)
1. [ ] Admin: crear aliado  
2. [ ] Pedir experto  
3. [ ] Confirmar servicio  
4. [ ] Admin: corte de comisión  

---

# ¿Cuándo decimos que está bien para usuarios?

Marca **SÍ** solo si:

- [ ] Recorrido A completo sin fallos graves.
- [ ] La app abre siempre (Parte 1).
- [ ] ATS y Match funcionan.
- [ ] Los errores se entienden.
- [ ] (Si ya hay pagos) se puede activar un plan de prueba.
- [ ] (Si ya hay aliado) se puede pedir y confirmar un servicio.

**Resultado:**  
☐ Listo para que entre gente  
☐ Listo con detalles menores por corregir  
☐ Aún no (hay algo grave)

---

# Problemas encontrados

Escribe con tus palabras. Ejemplo: “En el celular, al tocar Analizar CV, no pasó nada”.

| # | ¿Qué estabas haciendo? | ¿En qué pantalla? | ¿Qué pasó? | ¿Celular o PC? |
| --- | --- | --- | --- | --- |
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

---

# Notas para el dueño (no para el tester)

- La guía técnica larga sigue en `PRUEBAS-E2E-ATSAdvisor.md` (seguridad, rate limits, etc.).
- Esta guía (`PRUEBAS-FACILES-ATSAdvisor.md`) es para familiares, testers o apoyo no técnico.
- Si el tester marca muchos “No aplica”, primero termina el MANUAL (Redeploy, aliado, pagos sandbox).
