# Pruebas extremo a extremo — ATSAdvisor (LOTIC)

**App:** https://ats-advisor-two.vercel.app/  
**Admin:** https://ats-advisor-two.vercel.app/admin  
**Repo:** `main` · **Actualizado:** 2026-08-09  

### Cómo usar este documento

1. Haz **Redeploy** y confirma `/api/health` OK antes de empezar.
2. Prueba en **móvil real** (Chrome Android o Safari iOS) + **desktop**.
3. Usa ventana privada para flujos “plan free”.
4. Marca cada casilla solo cuando el criterio de **OK** se cumpla.
5. Si falla: anota ruta, dispositivo, correo de prueba y captura en la sección **Fallos**.

| Campo | Valor |
| --- | --- |
| Tester | |
| Fecha | |
| Build / commit | |
| Dispositivos | ☐ Móvil ☐ Desktop ☐ Tablet |
| Entorno | ☐ Production ☐ Preview |

**Leyenda:** `[F]` funcional · `[L]` lógica de negocio · `[S]` seguridad · `[UX]` bento/flujo · `[V]` voz · `[IA]` inteligencia artificial · `[P]` performance/PWA · `[A]` accesibilidad · `[$]` pagos/monetización

---

# 0. Humo / despliegue (obligatorio primero)

- [ ] `[F]` `/api/health` responde JSON usable (no 500).
- [ ] `[F]` Home `/` carga < 5 s en 4G/WiFi normal.
- [ ] `[F]` `/offline` existe y es entendible.
- [ ] `[F]` `/capacidades` lista features sin crash.
- [ ] `[S]` HTTPS activo (candado en el navegador).
- [ ] `[P]` No hay errores rojos graves en consola al cargar home.
- [ ] `[F]` Favicon / `logo.svg` visibles.
- [ ] `[F]` Footer legal: privacidad, términos, cookies, contacto, quiénes somos — todos abren.

---

# 1. UX bento, navegación y “máximo 2 decisiones”

## 1.1 Shell y layout

- [ ] `[UX]` Ancho mobile-first (~max-w-lg): no se ve “dashboard denso” en home.
- [ ] `[UX]` Header: logo + ATSAdvisor + by LOTIC.
- [ ] `[UX]` Nav: Mapa / Tracker / Precios / Cuenta funcionan.
- [ ] `[UX]` “Saltar al contenido” aparece al enfocar con Tab (accesibilidad).
- [ ] `[UX]` Cards `bento-card`: una idea principal por sección.
- [ ] `[UX]` Morado solo en botones/pills/sombras sutiles; fondo claro (no tema oscuro full).
- [ ] `[UX]` Tipografía legible; textos muted no son ilegibles.
- [ ] `[UX]` Botones `btn-primary` / `btn-secondary` tienen área táctil suficiente (≈44px).
- [ ] `[UX]` En móvil, formularios no quedan tapados por teclado de forma bloqueante.
- [ ] `[A]` Contraste texto/fondo suficiente en títulos y muted.
- [ ] `[A]` Focus visible al navegar con teclado en links/botones/inputs.

## 1.2 Regla de flujo progresivo

- [ ] `[UX]` Pantallas clave no piden >2 decisiones grandes a la vez (ej. ATS: CV + oferta → analizar).
- [ ] `[UX]` Mensajes de error son humanos (no stack traces).
- [ ] `[UX]` Estados vacíos explican el siguiente paso (ej. sin aliados, sin misiones hechas).
- [ ] `[UX]` Cada flujo largo tiene “Volver” claro.

## 1.3 PWA

- [ ] `[P]` Manifest / instalable: en Android “Instalar app” o Añadir a inicio.
- [ ] `[P]` Icono de acceso directo abre la app.
- [ ] `[P]` Tras instalar, la shell se siente app (no URL bar crítica si aplica).
- [ ] `[P]` Recarga / navegación offline muestra `/offline` o mensaje útil (no página blanca eterna).

---

# 2. Voz (TTS / STT)

> Probar en Chrome Android o Safari iOS. Desktop Chrome también sirve para TTS.

## 2.1 Escuchar (TTS)

- [ ] `[V]` Home / pantallas con `SpeakButton`: al pulsar, lee el texto relevante.
- [ ] `[V]` Se puede detener / no deja audio fantasma al cambiar de página (o es aceptable).
- [ ] `[V]` ATS: SpeakButton resume score/acciones o copy de ayuda.
- [ ] `[V]` Outplacement ruta/cápsula: lee título + contenido.
- [ ] `[V]` Idioma aproximado español (LATAM) — no inglés forzado.

## 2.2 Dictado (STT)

- [ ] `[V]` `DictationButton` pide permiso de micrófono (primera vez).
- [ ] `[V]` Si el usuario niega permiso: mensaje claro, no crash.
- [ ] `[V]` ATS: dictar en campo CV u oferta inserta texto.
- [ ] `[V]` Match `/herramientas/match`: dictado en CV y oferta.
- [ ] `[V]` Portfolio STAR: dictado en situación/tarea/acción/resultado.
- [ ] `[V]` OUT-09 / coach / filtro: donde haya mic, el texto llega al campo.
- [ ] `[V]` En iOS Safari: si STT no está disponible, la UI no rompe (botón deshabilitado o aviso).

---

# 3. Flujo candidato completo (happy path)

Simula un usuario nuevo de Colombia buscando empleo.

## 3.1 Onboarding / cuenta

- [ ] `[F]` `/auth` magic link (si Supabase OK): llega correo y abre sesión.
- [ ] `[F]` Sin Supabase: mensaje humano (no pantalla rota).
- [ ] `[F]` `/cuenta`: guardar nombre + correo en perfil local.
- [ ] `[F]` Canal de aprendizaje: PWA / Telegram / WhatsApp se guarda.
- [ ] `[L]` Plan free por defecto en dispositivo limpio.
- [ ] `[F]` `/cuenta/referidos`: genera código + enlace copiable.
- [ ] `[L]` Abrir `/auth?ref=CODIGO` guarda atribución del invitador.
- [ ] `[F]` `/cuenta/cvs`: crear/guardar versión de CV local.

## 3.2 ATS ultra-pro

- [ ] `[F]` `/ats`: pegar CV corto (<40 chars) → error de validación amable.
- [ ] `[F]` CV + oferta válidos → score 0–100 + probabilidad entrevista.
- [ ] `[L]` Keywords matched / missing tienen sentido (no lista vacía absurda con textos ricos).
- [ ] `[L]` Cambiar perfil ATS (Workday/Taleo/…) cambia insights o comportamiento.
- [ ] `[F]` URL de oferta / empresa / dominio: auto-detecta o sugiere perfil.
- [ ] `[F]` Acciones / next steps visibles y en español.
- [ ] `[F]` Historial local: `/ats/historial` guarda análisis previos.
- [ ] `[F]` `/ats/multi`: varias ofertas rankeadas.
- [ ] `[F]` `/ats/screening`: respuestas de Easy Apply.
- [ ] `[F]` `/ats/portales`: checklists Computrabajo/etc.
- [ ] `[F]` `/ats/pack`: pack exportable / ZIP usable.
- [ ] `[F]` `/ats/benchmark`: comparación útil o mensaje claro.
- [ ] `[L]` Límite free ATS/día: al superar, paywall o mensaje (no crash silencioso).
- [ ] `[IA]` Con embeddings cloud configurados: score semántico / provider visible o degradación avisada.
- [ ] `[IA]` Sin keys cloud: fallback local con aviso (no mentir “OpenAI” si no hay).

## 3.3 Herramientas SEO gratis

- [ ] `[F]` `/herramientas` lista todas las tools.
- [ ] `[F]` `/herramientas/match`: % match + tip + bridge a `/ats`.
- [ ] `[F]` Checklist, LinkedIn, carta, salario, plantilla, entrevistas, cultura.
- [ ] `[$]` AdSlot visible en tools (plan free, cookies aceptadas).

## 3.4 Tracker de postulaciones

- [ ] `[F]` `/tracker`: crear postulación (cargo, empresa).
- [ ] `[L]` Cambiar estado (interés → aplicado → entrevista → oferta) persiste al recargar.
- [ ] `[L]` Analytics Pro lee funnel coherente con esos estados.

## 3.5 Outplacement — acceso y paywall

- [ ] `[L]` Plan free: módulos OUT bloqueados con `PaywallCard` claro → `/precios`.
- [ ] `[L]` Plan carrera/plus/tester (demo local solo en localhost o unlock): desbloquea OUT-01…08.
- [ ] `[L]` OUT-09 solo Plus/tester o compra extra; Carrera sin OUT-09 muestra upgrade.
- [ ] `[L]` **No** existe SKU $39k “3 meses”; modo 90 días es pausa post-empleo.
- [ ] `[L]` **No** se ofrece garantía 30 días de entrevistas.

## 3.6 Ruta OUT-01…08 + player

- [ ] `[F]` `/outplacement/ruta`: cambiar de módulo OUT-01…08.
- [ ] `[F]` Avanzar cápsula; progreso se guarda al recargar.
- [ ] `[F]` Quiz de cápsula: no deja avanzar sin pasar si hay quiz.
- [ ] `[L]` Barra de progreso refleja completed/total.
- [ ] `[F]` `/outplacement/out09/player` para cursos generados.

## 3.7 Fase 1 outplacement

- [ ] `[F]` `/outplacement/assessment` RIASEC → código + roles LATAM.
- [ ] `[F]` `/outplacement/career-brief` genera brief imprimible/PDF usable.
- [ ] `[F]` `/outplacement/oferta` piso/meta/techo + scripts.
- [ ] `[F]` `/outplacement/bienestar` guía + checklist (disclaimer no legal).
- [ ] `[F]` `/outplacement/remoto` ES→EN + checklist remoto.

## 3.8 Fase 2 outplacement

- [ ] `[F]` `/outplacement/vacantes` feed + rankeo vs CV si hay texto.
- [ ] `[F]` `/outplacement/video-entrevista` grabación local / rúbrica (sin subir video a server).
- [ ] `[F]` `/outplacement/misiones` 3 misiones; marcar hecha sube XP/racha.
- [ ] `[L]` XP y rango coherentes al completar misiones.
- [ ] `[F]` `/outplacement/segunda-carrera` tracks 14 días (+ IA opcional).

## 3.9 Fase 3 ecosistema

- [ ] `[F]` `/outplacement/marketplace` muestra empaques y precios desde aliados.
- [ ] `[F]` Solicitar paquete abre `/experto` con specialty/pack.
- [ ] `[F]` `/outplacement/experto` lista aliados con **precio COP**.
- [ ] `[F]` Enviar solicitud (nombre, email, mensaje ≥12) → OK + `confirmUrl`.
- [ ] `[F]` Correo usuario + correo/Telegram/WA aliado según config.
- [ ] `[F]` `/outplacement/experto/confirmar`: fecha, monto (prefill listado), prueba → confirmed.
- [ ] `[F]` Disputa marca disputed y avisa owner.
- [ ] `[F]` `/outplacement/cursos`: marcar en curso / hecho persiste.
- [ ] `[F]` `/outplacement/alumni`: enlaces admin o mensaje “aún no configurado”.

## 3.10 Fase 4–5 hábito / SEO

- [ ] `[F]` `/outplacement/progreso`: XP, racha, % OUT, cursos.
- [ ] `[F]` `/outplacement/plan-semana`: marcar días persiste.
- [ ] `[F]` `/outplacement/alertas`: crear, tocar revisión, eliminar.
- [ ] `[F]` `/outplacement/portfolio`: genera LinkedIn + one-pager + viñeta.

## 3.11 Coach, entrevista, networking, 90 días

- [ ] `[F]` `/outplacement/coach` responde (IA o error humano).
- [ ] `[IA]` Coach usa grounding/RAG cuando `useKnowledge` aplica (no alucina URLs inventadas obvias).
- [ ] `[F]` `/outplacement/entrevista` simulador STAR + score.
- [ ] `[F]` `/outplacement/filtro` score predictivo + ensayo.
- [ ] `[F]` `/outplacement/networking` CRM contactos local.
- [ ] `[F]` `/outplacement/certificado` genera documento de avance.
- [ ] `[F]` `/outplacement/90-dias` checklist post-empleo.
- [ ] `[L]` “Conseguí empleo → pausar” → plan `paused_90` + checklist (sin cobro $39k).

## 3.12 Blog y legal

- [ ] `[F]` `/blog` lista posts; slug abre cuerpo.
- [ ] `[F]` Posts nuevos (match, plan semanal) indexables.
- [ ] `[F]` Legal menciona ads/partners cuando aplica.
- [ ] `[F]` Banner cookies: aceptar / solo esenciales.
- [ ] `[L]` “Solo esenciales” oculta/ads no invasivos según diseño.
- [ ] `[F]` `/feedback` envía y (si Telegram) llega al owner.

---

# 4. Lógica de negocio y reglas de producto

## 4.1 Precios y planes

- [ ] `[L]` `/precios` muestra Carrera ~$79k, Plus ~$99k, OUT-09 extra ~$22k.
- [ ] `[L]` Admin puede cambiar precios; tras guardar, `/precios` refleja (tras hydrate).
- [ ] `[L]` Cupón % o monto fijo aplica en checkout demo/real.
- [ ] `[L]` Cupón fuera de fechas no aplica.
- [ ] `[L]` WhatsApp addon precio = admin fijo **o** fórmula meta×margen.
- [ ] `[L]` Tester emails (admin) obtienen privilegio sin pago (si cloud/whitelist).

## 4.2 Cuotas IA / OUT-09

- [ ] `[L]` Free: tope ATS/día respetado.
- [ ] `[L]` Plus: cupo OUT-09/mes; al agotar → upsell extra.
- [ ] `[L]` Prompt OUT-09 demasiado largo → rechazo con límite.
- [ ] `[L]` Calidad baja dispara cascade free→paid solo si keys existen (o mensaje degradado).

## 4.3 Aliados y comisiones

- [ ] `[L]` Comisión COP = round(precio × % / 100).
- [ ] `[L]` Neto aliado = precio − comisión.
- [ ] `[L]` Caso guarda `listedPriceCop`, `%`, `billingMode` al solicitar.
- [ ] `[L]` Confirmación exige monto > 0; recalcula `commissionCop` / `allyNetCop`.
- [ ] `[L]` Corte semanal solo toma `confirmed` sin `settlementId`.
- [ ] `[L]` Tras corte: status `settled` + `settlementId`; no se puede re-confirmar igual.
- [ ] `[L]` Modo `platform_collect` vs `ally_direct` cambia copy al cliente.
- [ ] `[L]` Aliado inactivo no aparece en API pública.
- [ ] `[L]` Flag `experts` off → API enabled false / 403 en request.

## 4.4 Ads

- [ ] `[L]` House ads muestran ArriendoSeguro (free).
- [ ] `[L]` Flag ads off → no creativos.
- [ ] `[L]` Plan pago: ads no molestan el flujo outplacement (o se ocultan según regla).

## 4.5 Referidos (soft)

- [ ] `[L]` Código estable por dispositivo hasta wipe.
- [ ] `[L]` Contador shares sube al copiar/compartir.
- [ ] `[L]` Claim no pisa el código propio del usuario.

---

# 5. Inteligencia artificial

## 5.1 Router y degradación

- [ ] `[IA]` `/api/ai/complete` con prompt corto responde texto ES.
- [ ] `[IA]` Rate limit: muchas requests → 429 amable.
- [ ] `[IA]` Sin Groq/Gemini/OpenAI: error humano + alerta owner (si notify).
- [ ] `[IA]` Preferencias LLM en admin (flags) no rompen si un provider falta.
- [ ] `[IA]` Telemetría/costo: no gasta en bucle infinito en OUT-09 fallido.

## 5.2 Tareas de producto

- [ ] `[IA]` OUT-09 genera JSON/curso consumible en player.
- [ ] `[IA]` Segunda carrera: plan 14 días personalizado.
- [ ] `[IA]` Coach multi-turno mantiene contexto razonable.
- [ ] `[IA]` Carta / LinkedIn / cultura: outputs en español LATAM.
- [ ] `[IA]` Detección “AI tells” en ATS no bloquea CV legítimo con falso positivo extremo (revisión manual).

## 5.3 Knowledge / RAG

- [ ] `[IA]` Coach con knowledge no contradice `knowledge_base/*.md` en temas básicos (STAR, ATS).
- [ ] `[IA]` FAQ empleo: no inventa asesoría jurídica como hecho legal vinculante (disclaimer).

---

# 6. Seguridad y privacidad

## 6.1 Admin

- [ ] `[S]` `/admin` sin secret → no datos.
- [ ] `[S]` Secret incorrecto → 401 / mensaje no autorizado.
- [ ] `[S]` `/admin/expertos` igual.
- [ ] `[S]` `/admin/analytics` protegido.
- [ ] `[S]` Secret no aparece en HTML/JS público ni en Network response de páginas públicas.
- [ ] `[S]` Cambiar settings sin auth falla.

## 6.2 APIs públicas

- [ ] `[S]` `/api/experts` **no** expone telegram_chat_id, tokens, emails internos de admin.
- [ ] `[S]` Confirm experto: token inválido → 404; no enumera casos ajenos fácilmente.
- [ ] `[S]` Rate limits en analyze, experts/request, confirm, feedback, ai.
- [ ] `[S]` Inputs enormes (>límites) rechazados.
- [ ] `[S]` XSS: pegar `<script>alert(1)</script>` en nombre/mensaje no ejecuta en admin ni emails HTML (escapado).
- [ ] `[S]` Webhook pagos: sin firma/secreto válido no activa plan (probar solo en sandbox).

## 6.3 Auth / datos

- [ ] `[S]` Sesión Supabase: otro usuario no ve tus profiles vía API (RLS).
- [ ] `[S]` Bucket `cvs`: no listado público anónimo.
- [ ] `[S]` `app_settings` / `audit_events` con RLS (solo service/admin).
- [ ] `[S]` Habeas export: solo datos del solicitante.
- [ ] `[S]` Habeas wipe: borra cloud + local según diseño; confirma irreversibilidad.
- [ ] `[S]` Cookies: banner cumple; no trackers si “solo esenciales”.

## 6.4 Headers / superficie

- [ ] `[S]` No directory listing.
- [ ] `[S]` `/api/*` no filtra env secrets en errores.
- [ ] `[S]` Admin secret no en querystring (solo header/body según diseño).
- [ ] `[S]` Uploads: logo B2B rechaza archivos enormes; tipos razonables.

---

# 7. Pagos y monetización

> Si aún no hay keys: marcar N/A y probar solo **demo local** en localhost.

## 7.1 Demo

- [ ] `[$]` Localhost: “Pagar (demo)” cambia plan en dispositivo.
- [ ] `[$]` Production pública: demo local **no** debe activar plan cloud real sin pago.

## 7.2 Wompi / MP (sandbox)

- [ ] `[$]` Checkout `/precios` exige/recomienda correo.
- [ ] `[$]` Pago APPROVED → plan en `profiles` + Telegram owner.
- [ ] `[$]` Pago declined → no plan.
- [ ] `[$]` Reclamar pago en `/cuenta` con mismo correo.
- [ ] `[$]` Promo code en checkout reduce monto esperado.
- [ ] `[$]` OUT-09 extra como SKU aparte.
- [ ] `[$]` Idempotencia: webhook duplicado no corrompe plan.

## 7.3 Ads / afiliados

- [ ] `[$]` Click ArriendoSeguro abre https://arriendoseguro.app/
- [ ] `[$]` `ads.txt` accesible.
- [ ] `[$]` AdSense (si configurado): creativo de red; si no, house.

---

# 8. Canales (Telegram / WhatsApp / email)

- [ ] `[F]` Bot Telegram: `/start` responde.
- [ ] `[F]` `/vincular correo@x.com` asocia chat (perfil debe existir).
- [ ] `[F]` Cron cápsulas: usuario pago vinculado recibe cápsula (o log de skip razonado).
- [ ] `[F]` Cron audit: owner recibe salud.
- [ ] `[F]` Resend: solicitud experto llega a aliado y usuario.
- [ ] `[F]` WA aliado (si Meta keys): mensaje de solicitud.
- [ ] `[L]` Sin WA keys: request igual crea caso (skipped whatsapp).

---

# 9. Admin owner

- [ ] `[F]` Login admin con secret.
- [ ] `[F]` Editar precios / flags / límites IA → Guardar → persiste (cloud si Supabase).
- [ ] `[F]` Enviar reporte de salud.
- [ ] `[F]` CRUD aliados + defaults precio/comisión + billing mode.
- [ ] `[F]` Alumni URLs.
- [ ] `[F]` Promociones CRUD.
- [ ] `[F]` Tester emails.
- [ ] `[F]` `/admin/expertos`: filtros, selección, corte, historial settlements.
- [ ] `[F]` Cancelar / reabrir caso desde tablero.
- [ ] `[F]` Analytics básico + Pro cargan sin crash.

---

# 10. B2B empresa (demo local)

- [ ] `[F]` `/empresa` crea org + cupos + logo.
- [ ] `[F]` Marca blanca afecta certificado (si aplica).
- [ ] `[F]` `/empresa/invitaciones` genera accesos demo.
- [ ] `[F]` `/empresa/dashboard` engagement agregado sin CVs crudos.
- [ ] `[L]` Persistencia local sobrevive reload.
- [ ] `[S]` Demo B2B no expone datos de otros tenants cloud (aún no hay multi-tenant real).

---

# 11. Observabilidad y resiliencia

- [ ] `[F]` Error forzado en API (ej. body inválido) → mensaje humano.
- [ ] `[F]` Owner Telegram recibe `reportError` en fallos graves (si notify).
- [ ] `[P]` Analyze ATS no congela UI > ~30–60s sin feedback de loading.
- [ ] `[P]` OUT-09 muestra estado generando.
- [ ] `[P]` Lighthouse móvil (orientativo): LCP razonable en home; no bloquear go-live por 100.
- [ ] `[F]` Sentry (si DSN): evento de prueba aparece.

---

# 12. SEO y adquisición

- [ ] `[F]` `/sitemap.xml` incluye rutas nuevas (match, progreso, alumni, marketplace…).
- [ ] `[F]` `robots.txt` no bloquea blog/herramientas.
- [ ] `[F]` Metadata title por página (no todas “ATSAdvisor” genérico vacío).
- [ ] `[F]` OG básico (si existe) no rompe.
- [ ] `[F]` Blog posts indexables; slugs sin 404.

---

# 13. Cumplimiento y contenido sensible

- [ ] `[L]` Bienestar/derechos: disclaimer “no es asesoría legal”.
- [ ] `[L]` Salarios: “orientativo”.
- [ ] `[L]` Video mock: aviso de que el video no se sube (privacidad).
- [ ] `[L]` Habeas Data / Ley 1581 explicado en cuenta/privacidad.
- [ ] `[L]` Menores: no hay flujo que pida contenido sexual/menor (N/A producto empleo adultos).
- [ ] `[F]` Contacto `/legal/contacto` usable.

---

# 14. Matriz de dispositivos y regresiones rápidas

## 14.1 Mobile

- [ ] Home → ATS → resultado → Tracker (flujo 3 min).
- [ ] Outplacement hub scroll + 5 links abren.
- [ ] Speak + Dictado en una pantalla.
- [ ] Teclado no tapa botón primario crítico.

## 14.2 Desktop

- [ ] Layout centrado no se “rompe” a 1920px (sigue columna legible).
- [ ] Admin usable con formularios largos (aliados).

## 14.3 Regresión “no volver a romper”

- [ ] No reapareció garantía 30 días en UI.
- [ ] No reapareció plan $39k como SKU.
- [ ] Carrera no incluye OUT-09 en copy de precios.
- [ ] Plus sí menciona OUT-09.
- [ ] House ads ArriendoSeguro URL correcta.

---

# 15. Pruebas negativas / abuso (lógica adversaria)

- [ ] `[S]` Spam 50 requests/min a `/api/ats/analyze` → rate limit.
- [ ] `[S]` Solicitud experto sin email / mensaje corto → 400.
- [ ] `[S]` Confirmar caso ajeno adivinando token → falla.
- [ ] `[S]` Admin PATCH caso inexistente → 404.
- [ ] `[L]` Doble submit solicitud experto: no crea 20 casos idénticos sin freno (rate limit).
- [ ] `[L]` Usuario free no ejecuta OUT-09 generación completa.
- [ ] `[F]` Campos con emoji/RTL/caracteres raros no rompen UI.

---

# 16. Flujos E2E guionizados (marcar el guion completo)

## Guion A — Free seeker (15 min)

1. [ ] Home + cookies  
2. [ ] Match rápido  
3. [ ] ATS completo 1 oferta  
4. [ ] Guardar en tracker  
5. [ ] Ver ad house  
6. [ ] Abrir precios (no pagar)  
7. [ ] Feedback opcional  

## Guion B — Carrera pago (30 min) — requiere sandbox

1. [ ] Auth magic link  
2. [ ] Pagar Carrera sandbox  
3. [ ] Reclamar si hace falta  
4. [ ] Completar 1 cápsula OUT-01 + quiz  
5. [ ] Misión del día  
6. [ ] Assessment + career brief  
7. [ ] Vincular Telegram  
8. [ ] Esperar/forzar cápsula (o verificar cron)  

## Guion C — Plus + OUT-09 (20 min)

1. [ ] Plan Plus  
2. [ ] Generar OUT-09  
3. [ ] Player 2 cápsulas  
4. [ ] Coach 1 pregunta  

## Guion D — Aliado / comisión (20 min)

1. [ ] Admin: aliado precio 80.000 / 15%  
2. [ ] Usuario solicita  
3. [ ] Aliado recibe notify  
4. [ ] Usuario confirma servicio  
5. [ ] Admin corte semanal  
6. [ ] Totales comisión / neto cuadran  

## Guion E — Habeas (10 min)

1. [ ] Generar datos (ATS, tracker, perfil)  
2. [ ] Export ZIP/JSON  
3. [ ] Wipe  
4. [ ] Verificar local limpio + cloud si aplica  

## Guion F — Empresa demo (10 min)

1. [ ] Crear org  
2. [ ] Invitaciones  
3. [ ] Dashboard métricas  
4. [ ] Certificado co-brand  

---

# 17. Criterios de salida (Definition of Done QA)

Marca **GO** solo si:

- [ ] Sección **0 Humo** 100% OK en Production.
- [ ] Guion A completo OK.
- [ ] Guion D OK si ya hay aliado (si no, N/A documentado).
- [ ] Cero defectos **bloqueantes** abiertos (pago real, auth, XSS, leak secret).
- [ ] Lista de defectos menores priorizada (P1/P2/P3).
- [ ] MANUAL-ACCIONES: puntos 1–4 del owner hechos.

**Decisión final:** ☐ GO producción · ☐ GO con reservas · ☐ NO-GO

---

# 18. Registro de fallos

| ID | Severidad (S1–S4) | Área | Ruta | Pasos | Esperado | Obtenido | Evidencia | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | |
| | | | | | | | | |
| | | | | | | | | |

**Severidad:**  
- **S1** caído / seguridad crítica / no se puede pagar ni entrar  
- **S2** flujo principal roto (ATS, outplacement pago, aliados)  
- **S3** parcial / workaround  
- **S4** cosmético / copy  

---

# 19. Apéndice — rutas a visitar (checklist de cobertura)

## Públicas / candidato

- [ ] `/`  
- [ ] `/ats` `/ats/historial` `/ats/multi` `/ats/screening` `/ats/portales` `/ats/pack` `/ats/benchmark`  
- [ ] `/herramientas` `/herramientas/match` `/herramientas/checklist` `/herramientas/linkedin` `/herramientas/carta` `/herramientas/salario` `/herramientas/plantilla` `/herramientas/entrevistas` `/herramientas/cultura`  
- [ ] `/tracker` `/precios` `/auth` `/cuenta` `/cuenta/cvs` `/cuenta/referidos`  
- [ ] `/outplacement` (+ todas subrutas listadas en §§3.6–3.11)  
- [ ] `/blog` `/blog/[slug]`  
- [ ] `/capacidades` `/feedback` `/offline`  
- [ ] `/legal/*`  

## Admin / empresa

- [ ] `/admin` `/admin/expertos` `/admin/analytics` `/admin/analytics/pro`  
- [ ] `/empresa` `/empresa/dashboard` `/empresa/invitaciones`  

## APIs de humo (opcional técnico)

- [ ] `GET /api/health`  
- [ ] `GET /api/features`  
- [ ] `GET /api/experts`  
- [ ] `GET /api/alumni`  
- [ ] `GET /ads.txt`  
- [ ] `GET /sitemap.xml`  

---

# 20. Lo que suele olvidarse (incluido a propósito)

- [ ] Probar con **correo distinto** en checkout vs cuenta (reclamar pago).
- [ ] Probar **timezone** Colombia en fechas de servicio/corte.
- [ ] Probar **copiar/pegar** desde Word con caracteres raros en CV.
- [ ] Probar CV **vacío de keywords** vs oferta densa (score bajo + tips).
- [ ] Probar **dos pestañas** admin guardando settings (último gana / no corrompe JSON).
- [ ] Probar **modo oscuro del SO** (app es clara; contraste sigue OK).
- [ ] Probar **zoom 150%** accesibilidad.
- [ ] Probar **compartir referido** con Web Share API en móvil.
- [ ] Probar que **video mock** no sube blob a red (DevTools Network).
- [ ] Probar **limpiar site data** y que onboarding no crashee.
- [ ] Probar **plan paused_90** no deja generar OUT-09 de búsqueda.
- [ ] Documentar N/A cuando falte key (Wompi, Meta, AdSense) — no marcar OK fingido.

---

*Documento de QA ATSAdvisor · LOTIC. Completar en Production tras Redeploy. El cobro automático de sesiones aliado (`platform_collect` checkout) puede marcarse N/A hasta que exista en código.*
