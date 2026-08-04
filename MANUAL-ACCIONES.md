# Acciones manuales — ATSAdvisor

Solo lo que **tú** debes hacer en consolas (Vercel, Supabase, Telegram, pagos…).  
El código ya está en `main` y Vercel despliega solo al push.

| | |
| --- | --- |
| **App** | https://ats-advisor-two.vercel.app/ |
| **Vercel** | proyecto `ats-advisor` |
| **Repo** | https://github.com/clopezci/ats-advisor (`main`) |
| **Admin** | https://ats-advisor-two.vercel.app/admin |
| **Actualizado** | 2026-08-04 |

---

# 1. Panorama rápido (no te confundes aquí)

## ✅ YA HECHO (no lo vuelvas a hacer)

| # | Qué | Dónde quedó |
| - | --- | ----------- |
| 1 | Variables base en Vercel | `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAIL`, `ADMIN_SECRET`, `ADMIN_TESTER_EMAILS`, `GROQ_API_KEY`, `RESEND_API_KEY`, `RESEND_FROM` |
| 2 | `CRON_SECRET` | Vercel → Environment Variables |
| 3 | Proyecto Supabase | Creado + `schema.sql` ejecutado (tablas OK) |
| 4 | 3 keys Supabase en Vercel | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| 5 | Bucket Storage `cvs` | Supabase → Storage |
| 6 | Auth email + Site URL / redirects | Supabase → Authentication |
| 7 | Bot Telegram + token + owner chat id | Vercel: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_OWNER_CHAT_ID` |
| 8 | Webhook Telegram (URL de la app) | Ya apuntaba a `/api/webhooks/telegram` |
| 9 | Botón **Pagar (demo)** | `/precios` (activa plan en el navegador, no cobra) |

## ⏳ TE FALTA (orden recomendado)

| Prioridad | Qué hacer | ¿Por qué? | Sección abajo |
| --------- | --------- | --------- | ------------- |
| **A1** | **Redeploy** del último `main` | Trae admin nuevo, seguridad, salud→Telegram | [§2](#2-a1--redeploy-después-del-último-código) |
| **A2** | `TELEGRAM_WEBHOOK_SECRET` + **re-setWebhook** | Desde la auditoría el webhook **exige** secret en producción; el que tenías sin secret deja de funcionar | [§3](#3-a2--telegram-webhook-secret-obligatorio-ahora) |
| **A3** | SQL extra en Supabase (RLS `app_settings` + `audit_events`) | Cierra hueco de seguridad de la auditoría | [§4](#4-a3--supabase-sql-de-seguridad-extra) |
| **A4** | Probar admin + salud Telegram + cron | Confirmar que todo habla contigo | [§5](#5-a4--verificación-rápida-10-minutos) |
| **B1** | Wompi **o** Mercado Pago (sandbox) | Cobros reales Carrera/Plus | [§6](#6-b1--pagos-reales-wompi-o-mercado-pago) |
| **B2** | (Opcional) Resend dominio verificado | Correos Habeas/contacto fiables | [§7](#7-b2--resend-dominio-opcional-pero-recomendado) |
| **C** | Gemini/OpenAI, WhatsApp Meta, AdSense, Sentry DSN, dominio, logo | Mejoras / monetización | [§8](#8-c--opcionales-cuando-tengas-tiempo) |

---

# 2. A1 — Redeploy (después del último código)

**Qué:** Forzar que Production use el commit nuevo (admin completo, Sentry interno, seguridad).  
**Dónde:** https://vercel.com → proyecto **ats-advisor**.  
**Cómo:**

1. Pestaña **Deployments**.
2. En el deployment más reciente de **Production**: menú `⋯` → **Redeploy**.
3. Confirma (no hace falta “Use existing Build Cache” forzado salvo que Vercel lo pida).
4. Espera estado **Ready** (2–5 min).
5. Abre: https://ats-advisor-two.vercel.app/api/health  

   - Público ahora solo muestra algo como: `{ "ok": true, "service": "atsadvisor", ... }`  
   - **Ya no** lista `groq: true` en público (seguridad). El detalle está en admin (§5).

---

# 3. A2 — Telegram webhook secret (obligatorio ahora)

**Qué:** Variable nueva + volver a registrar el webhook **con** `secret_token`.  
**Por qué:** Sin esto, en producción Telegram recibe 401 y el bot “deja de responder”.  
**Dónde:** Vercel + navegador (API de Telegram).

### Paso 3.1 — Generar el secret

En **PowerShell**:

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 40 | ForEach-Object {[char]$_})
```

Copia el string (ej. `K9mP2abc...`).

### Paso 3.2 — Guardarlo en Vercel

1. Vercel → **ats-advisor** → **Settings** → **Environment Variables**.
2. **Add New**:
   - **Key:** `TELEGRAM_WEBHOOK_SECRET`
   - **Value:** el string del paso 3.1
   - Environments: **Production** + **Preview**
   - Sensitive: sí (si aparece)
3. Save.
4. **Redeploy** otra vez (§2).

### Paso 3.3 — Re-registrar el webhook (sustituye TOKEN y SECRET)

Abre en el navegador **una sola vez** (usa tu `TELEGRAM_BOT_TOKEN` y el secret nuevo):

```text
https://api.telegram.org/botTOKEN/setWebhook?url=https://ats-advisor-two.vercel.app/api/webhooks/telegram&secret_token=SECRET
```

Debes ver: `{"ok":true,...}`

### Paso 3.4 — Verificar

```text
https://api.telegram.org/botTOKEN/getWebhookInfo
```

Comprueba que `url` sea la de tu app y `ok`/estado correctos.

### Paso 3.5 — Probar el bot

1. En Telegram, ábrele chat a tu bot.
2. Envía `/start` o `/capsula`.
3. Debe responder. Si no: revisa que el Redeploy terminó y que `secret_token` coincide exactamente con `TELEGRAM_WEBHOOK_SECRET`.

> **Nota:** Ya tenías webhook “OK” **sin** secret. Eso era válido antes; **ahora hay que repetir el setWebhook con secret**.

---

# 4. A3 — Supabase: SQL de seguridad extra

**Qué:** Activar RLS en `app_settings` y `audit_events` + columnas opcionales (ya está al final de `schema.sql`).  
**Dónde:** https://supabase.com → tu proyecto → **SQL** → **SQL Editor**.  
**Cómo:**

1. **New query**.
2. Pega **solo** este bloque (si ya corriste el schema completo una vez, este patch es suficiente):

```sql
alter table app_settings enable row level security;
alter table audit_events enable row level security;
-- Sin políticas anon: solo service_role (bypass RLS) puede leer/escribir.

alter table profiles add column if not exists telegram_chat_id text;
alter table profiles add column if not exists whatsapp_phone text;
```

3. **Run**.
4. Si dice que la política/columna ya existe, ignora el error de “already exists” y sigue.

**Comprobar:** Table Editor → `app_settings` / `audit_events` → en el candado / RLS debe estar **enabled**.

---

# 5. A4 — Verificación rápida (10 minutos)

Haz esto **después** de A1–A3.

### 5.1 Entrar al admin

1. Abre https://ats-advisor-two.vercel.app/admin  
2. Pega el mismo valor de `ADMIN_SECRET` que tienes en Vercel.  
3. Debes ver el **Panel owner** (precios, WA, límites IA, flags, promociones, salud).  
4. Opcional: cambia un precio de prueba → **Guardar todo** → recarga `/precios` y confirma que el número cambió.

### 5.2 Reporte de salud a Telegram

1. En `/admin`, sección **Salud / Sentry interno**.  
2. Pulsa **Enviar reporte de salud a Telegram ahora**.  
3. Debes recibir un mensaje en Telegram (tu `TELEGRAM_OWNER_CHAT_ID`).

### 5.3 Cron de auditoría (salud diaria)

En PowerShell (sustituye el secret):

```powershell
$secret = "PEGA_AQUI_TU_CRON_SECRET"
Invoke-RestMethod -Uri "https://ats-advisor-two.vercel.app/api/cron/audit" -Headers @{ Authorization = "Bearer $secret" }
```

- Sin 401 → bien.  
- Deberías recibir otro resumen en Telegram.

### 5.4 Cron de cápsulas (opcional)

```powershell
$secret = "PEGA_AQUI_TU_CRON_SECRET"
Invoke-RestMethod -Uri "https://ats-advisor-two.vercel.app/api/cron/capsules" -Headers @{ Authorization = "Bearer $secret" }
```

Si `TELEGRAM_BOT_TOKEN` + owner/broadcast están bien, llega una cápsula.

### 5.5 Demo de plan (sin tarjeta)

1. https://ats-advisor-two.vercel.app/precios  
2. **Pagar Carrera (demo)** → espera ~1 s.  
3. Ve a `/outplacement` → debe desbloquearse en ese navegador.

> En producción el cambio de plan desde `/cuenta` **ya no está** (solo localhost). Usa el demo de precios o el checkout real.

---

# 6. B1 — Pagos reales (Wompi o Mercado Pago)

**Qué:** Cobrar Carrera / Plus / OUT-09.  
**Dónde:** Cuenta Wompi o Mercado Pago + Vercel env + Redeploy.  
**Webhook de la app:** `https://ats-advisor-two.vercel.app/api/webhooks/payments`  
**Precios base (ajustables en `/admin`):** Carrera / Plus / OUT-09 extra.

Elige **al menos una**. En `/precios` el usuario puede elegir pasarela.

## Opción A — Wompi (Colombia)

| Paso | Qué | Dónde | Cómo |
| ---- | --- | ----- | ---- |
| 1 | Crear comercio | https://wompi.co | Registro + datos de negocio |
| 2 | Sacar llaves **Sandbox** | Dashboard → Desarrolladores / API Keys | Public → `WOMPI_PUBLIC_KEY` · Private → `WOMPI_PRIVATE_KEY` |
| 3 | Webhook de eventos | Misma zona Eventos | URL = webhook de arriba · secret → `WOMPI_EVENTS_SECRET` |
| 4 | Pegar en Vercel | Settings → Environment Variables | Las 3 (+ Preview/Production) |
| 5 | (Solo pruebas) | Vercel | Opcional `WOMPI_CHECKSUM_MODE` = `skip` — **quítalo en live** |
| 6 | Redeploy | Deployments | §2 |
| 7 | Probar | `/precios` → Checkout real Wompi | Pago sandbox |
| 8 | Live | Wompi | Cambiar a llaves Live y quitar `skip` |

## Opción B — Mercado Pago

| Paso | Qué | Dónde | Cómo |
| ---- | --- | ----- | ---- |
| 1 | Crear app | https://www.mercadopago.com.co/developers | “Crear aplicación” → `ATSAdvisor` |
| 2 | Access Token de **Pruebas** | Credenciales de la app | → Vercel `MP_ACCESS_TOKEN` |
| 3 | Notificaciones (si el panel lo pide) | App MP | URL = webhook de pagos |
| 4 | Redeploy | Vercel | §2 |
| 5 | Probar | `/precios` → Mercado Pago | Tarjetas de prueba MP |
| 6 | Live | MP | Access Token de Producción |

### Si aún no configuras pagos

La app sigue usable: ATS free + **Pagar (demo)**. El checkout real responderá que faltan keys.

---

# 7. B2 — Resend dominio (opcional pero recomendado)

**Ya tienes:** `RESEND_API_KEY` + `RESEND_FROM`.

| Paso | Qué | Dónde | Cómo |
| ---- | --- | ----- | ---- |
| 1 | Ver dominio | https://resend.com/domains | Si usas dominio propio, verifica DNS (SPF/DKIM) |
| 2 | FROM de producción | Vercel `RESEND_FROM` | Formato: `ATSAdvisor <noreply@tudominio.com>` |
| 3 | Prueba | App → Habeas Data / contacto | Revisa Resend → Emails si falla |

Sin dominio verificado puedes seguir con el FROM de prueba de Resend (límites y spam peores).

---

# 8. C — Opcionales (cuando tengas tiempo)

## 8.1 Fallback IA / embeddings cloud

| Variable | Dónde sacar | Para qué |
| -------- | ----------- | -------- |
| `GOOGLE_AI_API_KEY` | https://aistudio.google.com/apikey | Gemini + embeddings |
| `OPENAI_API_KEY` | https://platform.openai.com → API keys | Fallback pago + embeddings |
| `HF_TOKEN` | https://huggingface.co/settings/tokens | Embeddings HF |

Pegar en Vercel → Production + Preview → Redeploy.

## 8.2 WhatsApp Business (addon de pago)

Hazlo **después** de Telegram (Telegram es gratis).

1. https://developers.facebook.com → Create App → Business → producto WhatsApp.  
2. API Setup → Access Token → `WHATSAPP_TOKEN`.  
3. Phone number ID → `WHATSAPP_PHONE_NUMBER_ID`.  
4. Opcional: `WHATSAPP_BROADCAST_TO` = tu número E.164 (ej. `573001234567`).  
5. Redeploy.  
6. Precio final del addon se ajusta en `/admin` (o fórmula costo Meta).

## 8.3 Sentry (opcional — ya hay alertas por Telegram)

1. https://sentry.io → proyecto Next.js.  
2. Copia el **DSN**.  
3. Vercel: `SENTRY_DSN` = ese valor.  
4. Redeploy.  
5. Los errores también te llegan por Telegram (throttle 15 min).

## 8.4 Google AdSense

1. https://www.google.com/adsense → añade tu URL.  
2. Tras aprobación: `ca-pub-…` →  
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID`  
   - (opcional) `ADSENSE_CLIENT_ID`  
3. Redeploy.  
4. En `/admin` deja el flag **ads** activado.

## 8.5 Dominio propio

1. Vercel → **Settings** → **Domains** → Add.  
2. DNS en tu registrador (A/CNAME como indique Vercel).  
3. Actualiza `NEXT_PUBLIC_APP_URL` al dominio nuevo.  
4. Supabase Auth → Site URL + Redirect URLs con el dominio nuevo.  
5. Vuelve a setear webhook Telegram (§3) y webhooks de pagos con la URL nueva.  
6. Redeploy.

## 8.6 Logo LOTIC final

1. Prepara SVG/PNG (ideal 512×512 para PWA).  
2. Reemplaza `public/logo.svg` e iconos en `public/icons/`, **o** envíamelos y los integro.  
3. Push a `main` → Vercel redespliega.  
4. Ctrl+F5 en el navegador.

## 8.7 Portfolio LOTIC

1. https://lotic-soluciones.vercel.app/  
2. Tarjeta ATSAdvisor: si sigue “En construcción”, Redeploy del sitio LOTIC o avísame para marcarla Live.

---

# 9. Checklist para imprimir / marcar

### Hecho

- [x] Vars base Vercel (APP_URL, ADMIN_*, GROQ, RESEND_*)
- [x] `CRON_SECRET`
- [x] Supabase proyecto + schema inicial + 3 keys + bucket `cvs` + Auth URLs
- [x] Telegram bot + token + owner chat id + webhook URL (sin secret todavía)
- [x] Pagar demo en `/precios`

### Hacer ahora (A)

- [ ] Redeploy último `main` (§2)
- [ ] `TELEGRAM_WEBHOOK_SECRET` + setWebhook con `secret_token` (§3)
- [ ] SQL RLS extra en Supabase (§4)
- [ ] Probar `/admin` + reporte Telegram + cron audit (§5)

### Después (B)

- [ ] Wompi **o** Mercado Pago sandbox + pago de prueba (§6)
- [ ] (Opcional) Dominio Resend verificado (§7)

### Cuando quieras (C)

- [ ] Gemini / OpenAI / HF
- [ ] WhatsApp Meta
- [ ] AdSense
- [ ] `SENTRY_DSN`
- [ ] Dominio propio
- [ ] Logo LOTIC final
- [ ] Tarjeta Live en lotic-soluciones

---

# 10. Referencia rápida de variables

### Ya en Vercel (no tocar salvo que cambien)

`NEXT_PUBLIC_APP_URL` · `ADMIN_EMAIL` · `ADMIN_SECRET` · `ADMIN_TESTER_EMAILS` · `GROQ_API_KEY` · `RESEND_API_KEY` · `RESEND_FROM` · `CRON_SECRET` · `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` · `SUPABASE_SERVICE_ROLE_KEY` · `TELEGRAM_BOT_TOKEN` · `TELEGRAM_OWNER_CHAT_ID`

### Falta agregar / actualizar

| Variable | Estado |
| -------- | ------ |
| `TELEGRAM_WEBHOOK_SECRET` | **Falta** (§3) |
| `WOMPI_*` o `MP_ACCESS_TOKEN` | Falta si quieres cobro real (§6) |
| `GOOGLE_AI_API_KEY` / `OPENAI_API_KEY` / `HF_TOKEN` | Opcional |
| `SENTRY_DSN` | Opcional |
| `WHATSAPP_*` | Opcional |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Opcional |

### Regla de oro

**Cada vez que agregues o edites una variable en Vercel → Redeploy (§2).** Si no, Production sigue con el env viejo.

---

# 11. ¿Dudas típicas?

| Pregunta | Respuesta |
| -------- | --------- |
| ¿El bot Telegram “ya no responde”? | Falta §3 (secret + setWebhook). |
| ¿`/api/health` ya no muestra groq? | Es normal. Detalle en `/admin` o con header admin. |
| ¿Cómo activo Carrera sin Wompi? | `/precios` → **Pagar (demo)**. |
| ¿Dónde cambio precios sin código? | `/admin` → Precios → Guardar. |
| ¿Dónde está el informe de auditoría? | `AUDITORIA.md` en el repo. |

Cuando marques A1–A4, avísame y revisamos juntos el siguiente bloque (pagos reales).
