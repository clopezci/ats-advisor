# Acciones manuales — ATSAdvisor

Solo lo que **tú** debes hacer en consolas (Vercel, Supabase, Telegram, pagos, ads…).  
El código ya está en `main` y Vercel despliega solo al push.
| | |
| --- | --- |
| **App** | https://ats-advisor-two.vercel.app/ |
| **Vercel** | proyecto `ats-advisor` |
| **Repo** | https://github.com/clopezci/ats-advisor (`main`) |
| **Admin** | https://ats-advisor-two.vercel.app/admin |
| **Actualizado** | 2026-08-09 |

---
> **QA:** checklist completo con casillas en [`PRUEBAS-E2E-ATSAdvisor.md`](./PRUEBAS-E2E-ATSAdvisor.md) (funcional, lógica, seguridad, IA, voz, bento, pagos, guiones A–F).

---

# PENDIENTES UNO A UNO (hazlos en este orden)

Cada punto = **una tarea tuya**. Marca el checkbox cuando termines.

---

## 1. Redeploy de Production

**Para qué:** que Vercel sirva el código nuevo (fases 1–5, aliados, etc.).
**Dónde:** https://vercel.com → proyecto **ats-advisor**
**Cómo:**
1. Entra a **Deployments**.
2. Abre el último deployment de la rama **Production** / `main`.
3. Menú **⋯** → **Redeploy** → confirma (sin “Use existing Build Cache” si quieres build limpio).
4. Espera estado **Ready** (verde).
**Cómo saber que quedó bien:** abre  
https://ats-advisor-two.vercel.app/api/health  
y no debe dar 404/error 500.
- [ ] Hecho

---

## 2. Probar que la app levantó

**Para qué:** no configurar nada más si el deploy falló.
**Cómo:**
1. Abre https://ats-advisor-two.vercel.app/
2. Abre https://ats-advisor-two.vercel.app/outplacement/progreso
3. Abre https://ats-advisor-two.vercel.app/admin  
   - Pega tu `ADMIN_SECRET` (el de Vercel → Settings → Environment Variables).  
   - Debe cargar settings (precios, flags, aliados).
**Si admin no entra:** la variable `ADMIN_SECRET` no está en Production o no hiciste Redeploy tras ponerla.
- [ ] Hecho

---

## 3. Ver ads internos (ArriendoSeguro)

**Para qué:** monetizar free **sin** Google todavía.
**Cómo:**
1. Entra a la home o a `/blog` **sin** plan Carrera (plan free / ventana privada).
2. Debes ver un bloque tipo anuncio **ArriendoSeguro · LOTIC** con enlace a https://arriendoseguro.app/
3. Si no aparece: `/admin` → flag **ads** = ON → Guardar → recarga la home.
**Opcional:** abre https://ats-advisor-two.vercel.app/ads.txt — debe mostrar texto (la línea de Google puede estar comentada).
- [ ] Hecho

---

## 4. Cargar al menos 1 aliado experto

**Para qué:** que `/outplacement/experto` y el marketplace muestren precios reales.
**Dónde:** https://ats-advisor-two.vercel.app/admin → sección **Aliados expertos**
**Cómo (por cada persona):**
1. **Añadir aliado**.
2. Nombre + correo real (ahí le llegan las solicitudes).
3. **Valor del servicio (COP)** — ej. `80000` (esto ve el cliente).
4. **Comisión %** — ej. `15` (abajo verás comisión COP y neto aliado calculados solos).
5. Opcional: Telegram `chat_id`, WhatsApp `57300…`, especialidades, notas.
6. Deja **Activo** marcado.
7. Arriba: modo de cobro = **LOTIC cobra y liquida** (recomendado).
8. Flag **experts** = ON (en features).
9. **Guardar todo**.
**Probar:** https://ats-advisor-two.vercel.app/outplacement/experto → debe verse el aliado con el precio.
- [ ] Hecho

---

## 5. Enlaces alumni (si ya tienes grupo)

**Dónde:** `/admin` → **Alumni / comunidad**
**Cómo:** pega URL de Telegram (y Discord si hay) + nota del AMA → Guardar.
**Probar:** https://ats-advisor-two.vercel.app/outplacement/alumni
Si aún no tienes grupo, **salta** este punto.
- [ ] Hecho / [ ] No aplica aún

---

## 6. Activar cobros reales (elige UNA pasarela)

**Para qué:** que Carrera / Plus / OUT-09 dejen de ser solo “demo local”.

### Opción A — Wompi (Colombia, recomendada si ya la usas)

1. Entra a https://comercios.wompi.co (o dashboard Wompi).
2. Crea/usa comercio en **Sandbox** primero.
3. Copia:
   - Public key  
   - Private key  
   - Events secret (para webhooks)
4. Vercel → **ats-advisor** → Settings → **Environment Variables** → Production:
   - `WOMPI_PUBLIC_KEY` = …
   - `WOMPI_PRIVATE_KEY` = …
   - `WOMPI_EVENTS_SECRET` = …
5. En Wompi, webhook de eventos → URL exacta:  
   `https://ats-advisor-two.vercel.app/api/webhooks/payments`
6. **Redeploy** (punto 1 otra vez).
7. Prueba: `/precios` → pon un correo real → paga en sandbox.
8. Debe: aviso Telegram “Plan activado” + plan en Supabase; si no, `/cuenta` → **Reclamar pago** (mismo correo).
9. Cuando sandbox OK: cambia a llaves **Live** y quita cualquier `WOMPI_CHECKSUM_MODE=skip`.

### Opción B — Mercado Pago

1. Developers MP → crea app → `Access Token`.
2. Vercel: `MP_ACCESS_TOKEN` = …
3. Webhook a la misma URL:  
   `https://ats-advisor-two.vercel.app/api/webhooks/payments`
4. Redeploy + prueba en `/precios`.

### Opción C — Hub de pagos ArriendoSeguro (si lo vas a usar)

1. En el hub registra app **ATSAdvisor**.
2. Webhook: `https://ats-advisor-two.vercel.app/api/payments/hub-webhook`  
   *(si esa ruta aún no existe en código, avísame antes de apuntar producción; mientras usa Wompi/MP del punto A/B).*
3. Pega en Vercel las keys `PAYMENT_HUB_*` que te dio el hub → Redeploy.
**Sin este punto:** la gente puede usar “Pagar (demo)” solo en su dispositivo; **no** te llega plata real.
- [ ] Sandbox OK  
- [ ] Live OK (después)

---

## 7. Correos fiables (Resend + dominio)

**Para qué:** que aliados y usuarios reciban mails (solicitudes, confirmaciones) sin caer en spam.
**Cómo:**
1. https://resend.com → Domains → añade tu dominio (ej. `tudominio.com`).
2. Copia los registros DNS (TXT/MX/CNAME) a tu proveedor de dominio.
3. Espera verificación **Verified**.
4. Vercel: `RESEND_FROM` = algo como `ATSAdvisor <noreply@tudominio.com>`
5. Redeploy.
6. Prueba enviando una solicitud a un aliado desde `/outplacement/experto`.
Si no tienes dominio propio aún, puedes seguir con el from de prueba de Resend (más limitado).
- [ ] Hecho / [ ] Más adelante

---

## 8. WhatsApp Business (Meta) — opcional pero útil para aliados

**Para qué:** avisar al aliado por WA cuando alguien pide servicio + addon de cápsulas WhatsApp.
**Cómo:**
1. Meta for Developers → App → WhatsApp → API Setup.
2. Obtén **Phone number ID** y un **token** permanente (o de sistema).
3. Vercel Production:
   - `WHATSAPP_TOKEN` (o `META_WHATSAPP_TOKEN`)
   - `WHATSAPP_PHONE_NUMBER_ID`
4. Redeploy.
5. En `/admin` → aliado → WhatsApp `573001234567` + toggle WhatsApp ON → Guardar.
6. Manda una solicitud de prueba; el aliado debe recibir WA (si el número está en modo permitido / plantillas según Meta).
Sin esto: siguen funcionando **email + Telegram**.
- [ ] Hecho / [ ] Después

---

## 9. Solicitar Google AdSense (en paralelo, no bloquea)

**Para qué:** ads de terceros cuando Google apruebe (puede tardar semanas o rechazar).
**Cómo:**
1. Entra a https://www.google.com/adsense con tu cuenta Google.
2. Añade el sitio: `https://ats-advisor-two.vercel.app` (o tu dominio cuando lo tengas).
3. Espera revisión.
4. Si aprueban, te dan `ca-pub-XXXXXXXX`.
5. Vercel: `NEXT_PUBLIC_ADSENSE_CLIENT_ID` = `ca-pub-…`
6. Opcional: `NEXT_PUBLIC_AD_OPERATOR` = `adsense`
7. Redeploy.
8. En `/admin` deja **ads** ON.
**Mientras esperas:** sigue con house ads (punto 3). No apagues ArriendoSeguro hasta ver AdSense vivo.
- [ ] Solicitud enviada  
- [ ] Aprobado + variable puesta

---

## 10. Dominio propio (cuando lo compres)

**Para qué:** marca seria, mejor AdSense, URLs estables.
**Cómo:**
1. Compra dominio (ej. `atsadvisor.com` o subdominio LOTIC).
2. Vercel → Project → **Domains** → añade el dominio → sigue DNS que indique Vercel.
3. Cuando HTTPS esté verde, actualiza variables:
   - `NEXT_PUBLIC_APP_URL` = `https://tu-dominio.com`
4. Supabase → Authentication → URL Configuration:
   - Site URL = tu dominio  
   - Redirect URLs = `https://tu-dominio.com/**`
5. Wompi/MP/Telegram: cambia webhooks a la URL nueva.
6. Redeploy.
7. Prueba magic link y un pago sandbox.
- [ ] Hecho / [ ] Después

---

## 11. Logo final + tarjeta Live en LOTIC

**Para qué:** branding coherente en app y portafolio.
**Cómo:**
1. Sustituye `public/logo.svg` (y favicons si tienes) **o** mándamelos al agente para que los meta.
2. En el repo/site **lotic-soluciones**: tarjeta ATSAdvisor → status **Live** + URL  
   `https://ats-advisor-two.vercel.app/` (o tu dominio).
- [ ] Logo  
- [ ] Tarjeta LOTIC Live

---

## 12. Fallbacks de IA y Sentry (opcional)

**Para qué:** si Groq se cae o quieres embeddings mejores / errores en Sentry.
**Vercel (solo los que quieras):**
- `GOOGLE_AI_API_KEY`
- `OPENAI_API_KEY`
- `HF_TOKEN`
- `SENTRY_DSN`
Luego **Redeploy**.
- [ ] Hecho / [ ] No necesito aún

---

## 13. Tablero de comisiones (uso operativo, no config)

**Para qué:** cobrar comisión a aliados con pruebas (cortes semanales).
**Cómo usarlo (cuando ya haya casos):**
1. Usuario pide experto → confirma servicio con monto.
2. Tú entras a https://ats-advisor-two.vercel.app/admin/expertos
3. Filtro **Confirmados sin corte** → marcas → **Cerrar corte** de la semana.
4. Con ese total le cobras / liquidas según el modo (si cobras tú en plataforma: liquidas el **neto** al aliado).
**Nota:** el checkout automático de la sesión del aliado **aún es el último pending de código**; hasta entonces puedes cobrar manual (link de pago / transferencia) y usar el tablero como prueba.
- [ ] Entendido / probado con un caso de prueba

---

# Orden sugerido esta semana

| Día | Puntos |
| --- | --- |
| Hoy | **1 → 2 → 3 → 4** (y 5 si tienes Telegram alumni) |
| Esta semana | **6** sandbox pagos |
| En paralelo | **9** AdSense + **7** Resend si tienes dominio |
| Después | 8, 10, 11, 12 |

---

# Ya NO debes rehacer (si ya te funcionó antes)

- Variables base Vercel, `CRON_SECRET`
- Supabase (proyecto, keys, Auth, bucket `cvs`)
- Telegram bot + owner + webhook
- RLS de `app_settings` / `audit_events`
- Health → Telegram
Si algo de esa lista **no** te funciona, dilo y lo reparamos puntual.

---

# Referencia corta de webhooks

| Sistema | URL |
| ------- | --- |
| Wompi / Mercado Pago | `https://ats-advisor-two.vercel.app/api/webhooks/payments` |
| Telegram | la que ya configuraste con `TELEGRAM_WEBHOOK_SECRET` |
**Regla:** cada vez que cambies una variable en Vercel → otra vez **Redeploy** (punto 1).
