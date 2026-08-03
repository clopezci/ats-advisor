# Acciones manuales — ATSAdvisor

Todo lo que **tú** debes hacer (el agente no puede completarlo sin tus cuentas/credenciales).

**App en producción:** https://ats-advisor-two.vercel.app/  
**Proyecto Vercel:** `ats-advisor`  
**Repo:** `clopezci/ats-advisor` (branch `main`)

---

## Estado actual (actualizado 2026-08-03)

### Ya hecho en Vercel

Estas variables ya están creadas (Production + Preview, Sensitive):

| Variable | Estado |
| -------- | ------ |
| `NEXT_PUBLIC_APP_URL` | Listo |
| `ADMIN_EMAIL` | Listo |
| `ADMIN_SECRET` | Listo |
| `ADMIN_TESTER_EMAILS` | Listo |
| `GROQ_API_KEY` | Listo (IA free principal) |
| `RESEND_API_KEY` | Listo |
| `RESEND_FROM` | Listo |

### Pendiente (prioridad recomendada)

| Prioridad | Qué | Bloquea |
| --------- | --- | ------- |
| **A (ahora)** | Redeploy tras variables nuevas | Que Groq/Resend/admin carguen en prod |
| **A** | `CRON_SECRET` | Crons de auditoría y cápsulas |
| **A** | Supabase (proyecto + schema + 3 keys) | Auth real, CVs en cloud, Habeas real |
| **B** | Telegram bot + 2–3 variables | Alertas owner + microlearning |
| **B** | Wompi y/o Mercado Pago | Cobros Carrera/Plus |
| **C (opcional)** | Gemini / OpenAI | Fallback IA si Groq falla |
| **C** | Dominio propio, AdSense, Sentry, WhatsApp, logo LOTIC | Monetización / polish |

---

## 0. Redeploy obligatorio (hazlo YA)

Cada vez que agregas o editas variables en Vercel, **no** se aplican solas al deployment anterior.

1. Entra a [https://vercel.com](https://vercel.com) → proyecto **ats-advisor**.
2. Pestaña **Deployments**.
3. En el deployment más reciente (Production): menú `⋯` → **Redeploy**.
4. Confirma **Redeploy** (usa el mismo commit; no hace falta rebuild forzado salvo que Vercel lo pida).
5. Espera estado **Ready**.
6. Abre: `https://ats-advisor-two.vercel.app/api/health`  
   Deberías ver algo con `"groq": true` (y otros flags según keys).

Si `groq` sigue en `false`, la key no llegó a Production o falta el redeploy.

---

## 1. Vercel — variables que aún faltan

**Dónde:** Proyecto `ats-advisor` → **Settings** → **Environment Variables**.  
**Cómo agregar cada una:**

1. Click **Add New**.
2. **Key** = nombre exacto (copiar/pegar de abajo).
3. **Value** = el valor que obtengas en cada sección.
4. Environments: marca **Production** y **Preview** (igual que las que ya tienes).
5. Guarda. Al final de un bloque de variables → **Redeploy** (sección 0).

### 1.1 Obligatorias / muy recomendadas ahora

#### `CRON_SECRET`

**Para qué:** Autoriza los crons `/api/cron/audit` y `/api/cron/capsules` (ya definidos en `vercel.json`).

**Cómo generar el valor (Windows PowerShell):**

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 40 | ForEach-Object {[char]$_})
```

1. Copia el string generado (ej. `K9mP2...`).
2. En Vercel crea `CRON_SECRET` = ese string.
3. Guarda y Redeploy.

**Probar a mano (después del redeploy):**

```powershell
$secret = "PEGA_AQUI_TU_CRON_SECRET"
Invoke-RestMethod -Uri "https://ats-advisor-two.vercel.app/api/cron/audit" -Headers @{ Authorization = "Bearer $secret" }
```

Si responde JSON sin 401, está bien.

---

#### Supabase (3 variables) — ver sección 2 completa

Cuando tengas el proyecto:

| Variable | Dónde copiarla en Supabase |
| -------- | -------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → **Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → **anon public** |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → **service_role** (nunca en el frontend; solo Vercel server) |

---

#### Telegram (ver sección 3)

| Variable | Obligatoriedad |
| -------- | -------------- |
| `TELEGRAM_BOT_TOKEN` | Sí, si quieres bot |
| `TELEGRAM_OWNER_CHAT_ID` | Sí, para alertas a ti |
| `TELEGRAM_BROADCAST_CHAT_IDS` | Opcional (si vacío usa el owner) |

---

#### Pagos (elige al menos una pasarela — sección 5)

**Wompi:**

| Variable | Notas |
| -------- | ----- |
| `WOMPI_PUBLIC_KEY` | Llave pública (test o live) |
| `WOMPI_PRIVATE_KEY` | Llave privada |
| `WOMPI_EVENTS_SECRET` | Secret de eventos/webhook |
| `WOMPI_CHECKSUM_MODE` | Solo pruebas: valor `skip` (quítalo en live) |

**Mercado Pago:**

| Variable | Notas |
| -------- | ----- |
| `MP_ACCESS_TOKEN` | Access Token de la app (test o prod) |

---

### 1.2 Opcionales

| Variable | Para qué | Cómo |
| -------- | -------- | ---- |
| `OPENAI_API_KEY` | Fallback pago + **embeddings ATS** (`text-embedding-3-small`) | https://platform.openai.com → API keys |
| `GOOGLE_AI_API_KEY` | Gemini Flash + **embeddings ATS** (`text-embedding-004`) | https://aistudio.google.com/apikey |
| `SENTRY_DSN` | Errores en producción | https://sentry.io → Create project (Next.js) → copiar DSN |
| `ADSENSE_CLIENT_ID` | Ads server-side / flags | Tras aprobación AdSense |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Ads en el browser | Mismo valor `ca-pub-…` |
| `WHATSAPP_TOKEN` | Meta Cloud API | Tras crear app WhatsApp |
| `WHATSAPP_PHONE_NUMBER_ID` | ID del número | Meta → WhatsApp → API Setup |
| `WHATSAPP_BROADCAST_TO` | Número E.164 destino demo | ej. `573001234567` |

---

### 1.3 Panel Owner (ya casi listo)

Con `ADMIN_EMAIL` + `ADMIN_SECRET` ya puestos:

1. Abre https://ats-advisor-two.vercel.app/admin  
2. Pega el mismo valor de `ADMIN_SECRET` que pusiste en Vercel.  
3. Deberías entrar al panel.  
4. `ADMIN_TESTER_EMAILS` ya marca correos premium de prueba (coma-separados, sin espacios de más).

---

### 1.4 Resend — verificar que el FROM funcione

Ya tienes `RESEND_API_KEY` y `RESEND_FROM`.

1. Entra a https://resend.com/domains  
2. Si usas un dominio propio: verifica DNS (SPF/DKIM) como indica Resend.  
3. Si aún no tienes dominio: usa el dominio de prueba de Resend (`onboarding@resend.dev` o el FROM que Resend te muestre en docs) **solo para pruebas**; en producción conviene dominio verificado.  
4. Formato típico del valor: `ATSAdvisor <noreply@tudominio.com>`  
5. Prueba Habeas Data / contacto cuando el flujo envíe correo; si falla, revisa logs en Resend → Emails.

---

## 2. Supabase (auth, CVs, Habeas Data real) — guía paso a paso

**Qué logra:** login de usuarios, perfiles/planes en DB, bucket de CVs, RLS, settings admin en cloud.

### Paso 2.1 — Crear proyecto

1. Entra a https://supabase.com → **Sign in** (GitHub/Google está bien).  
2. **New project**.  
3. Organization: usa la tuya o crea una.  
4. **Name:** `ats-advisor` (o similar).  
5. **Database password:** genera una fuerte y **guárdala en un gestor de contraseñas** (no va a Vercel, pero la necesitas para SQL/DB).  
6. **Region:** la más cercana a Colombia (ej. South America / São Paulo si aparece).  
7. Create project → espera ~1–2 min a que esté **Active**.

### Paso 2.2 — Ejecutar el schema

1. En el menú izquierdo: **SQL** → **SQL Editor** → **New query**.  
2. Abre en tu PC el archivo del repo:  
   `C:\Users\Probook\OneDrive\Documentos\ProyectosSoftware\ATSApp\supabase\schema.sql`  
3. Copia **todo** el contenido → pégalo en el editor de Supabase.  
4. Click **Run** (o Ctrl+Enter).  
5. Debe terminar sin error (mensaje Success).  
6. Verifica en **Table Editor** que existan tablas como: `profiles`, `ats_scans`, `courses`, `app_settings`, `job_applications`, `companies`, etc.

### Paso 2.3 — Storage bucket `cvs`

1. Menú **Storage** → **New bucket**.  
2. Name: `cvs` (exacto, minúsculas).  
3. **Public bucket:** OFF (privado).  
4. Create.  
5. (Opcional) Policies: más adelante puedes restringir “solo el usuario autenticado sube/lee su carpeta”; por ahora el service role del servidor puede operar.

### Paso 2.4 — Authentication (email)

1. Menú **Authentication** → **Providers** → **Email**.  
2. Confirma que **Email** esté **Enabled**.  
3. **Authentication** → **URL Configuration**:  
   - **Site URL:** `https://ats-advisor-two.vercel.app`  
   - **Redirect URLs:** agrega:  
     - `https://ats-advisor-two.vercel.app/**`  
     - `https://ats-advisor-two.vercel.app/auth/callback` (si usas esa ruta)  
     - Si pruebas en local: `http://localhost:3000/**`  
4. Guarda.

### Paso 2.5 — Sacar las 3 variables de Supabase y pegarlas en Vercel

Necesitas **exactamente estas 3** (nombres en Vercel a la izquierda):

| Variable en Vercel | Qué es en Supabase | Aspecto típico |
| ------------------ | ------------------ | -------------- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | `https://abcdefghijklmnop.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clave **anon** / **public** | JWT largo que empieza por `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | clave **service_role** / **secret** | Otro JWT largo `eyJ...` (¡secreta!) |

#### A) Abrir la pantalla de API keys en Supabase

1. Entra a https://supabase.com/dashboard y abre **tu proyecto** (el que usaste para el schema).
2. En la barra izquierda, abajo del todo, haz clic en el icono de **engranaje** → **Project Settings**  
   (también puede decir **Settings**).
3. En el menú de Settings (columna izquierda de esa pantalla), haz clic en **API**  
   (en interfaces nuevas a veces aparece como **Data API** o **API Keys**).

Si no encuentras el engranaje:
- Arriba a la derecha o cerca del nombre del proyecto hay un botón **Connect**.
- Ábrelo → pestaña **App Frameworks** o **API** → ahí también salen URL y keys (menos completo para `service_role`).

#### B) Copiar la Project URL

1. En la sección **Project URL** (o **URL** / **Project URL**).
2. Verás algo como: `https://xxxxxxxxxxx.supabase.co`
3. Pulsa el icono de **copiar** (clipboard) al lado.
4. Eso es el valor de `NEXT_PUBLIC_SUPABASE_URL`.

#### C) Copiar la clave anon (pública)

1. En la misma página, sección **Project API keys** (o **API Keys**).
2. Busca la fila etiquetada **`anon`** / **`public`**.  
   - En UI nueva puede decir **Publishable** o **anon public**.
3. Pulsa **Reveal** / **Show** si está oculto, luego **Copy**.
4. Eso es el valor de `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. **Sí** puede ir al navegador (por eso lleva `NEXT_PUBLIC_`).

#### D) Copiar la clave service_role (secreta)

1. En la misma lista de keys, busca **`service_role`** / **`secret`**.
2. Supabase te pedirá confirmar (porque es peligrosa): pulsa **Reveal** / **Reveal secret**.
3. Copia el valor completo.
4. Eso es el valor de `SUPABASE_SERVICE_ROLE_KEY`.
5. **Nunca** la pongas en el código del frontend, ni en un chat público, ni en GitHub.

> Si solo ves una key “publishable” y te falta service_role: en **Project Settings → API** baja hasta **Legacy API keys** o pestaña **Secret keys** / **service_role**. Ahí está.

#### E) Pegar las 3 en Vercel (una por una)

1. Abre https://vercel.com → proyecto **ats-advisor**.
2. **Settings** → **Environment Variables**.
3. **Add New** → Key: `NEXT_PUBLIC_SUPABASE_URL` → Value: la URL que copiaste → Environments: **Production** + **Preview** → Save.
4. **Add New** → Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: la anon → Production + Preview → Save.
5. **Add New** → Key: `SUPABASE_SERVICE_ROLE_KEY` → Value: la service_role → Production + Preview → Save.  
   (Márcala Sensitive si Vercel lo ofrece.)
6. Ve a **Deployments** → menú `⋯` del último Production → **Redeploy** → confirma.
7. Cuando esté Ready, abre de nuevo `/api/health` (si tu health reporta supabase, debería reflejarlo tras el deploy).

#### F) Comprobar que no te equivocaste de key

| Check | Bien | Mal |
| ----- | ---- | --- |
| URL | Empieza por `https://` y termina en `.supabase.co` | No pongas la database password aquí |
| anon | JWT `eyJ...` de la fila **anon/public** | No uses service_role en esta variable |
| service_role | JWT `eyJ...` de la fila **service_role** | No uses la anon aquí |

La **database password** que creaste al hacer el proyecto **no** es ninguna de estas tres variables. No la pongas en Vercel.

---

## 3. Telegram Bot — guía paso a paso

**Qué logra:** alertas al owner + envío de microcápsulas (cron) + webhook de comandos.

### Paso 3.1 — Crear el bot

1. En Telegram, busca **@BotFather**.  
2. Envía `/newbot`.  
3. Nombre visible: ej. `ATSAdvisor LOTIC`.  
4. Username: debe terminar en `bot`, ej. `ATSAdvisorLoticBot`.  
5. BotFather te responde con un **HTTP API token** tipo `7123456789:AAH...`.  
6. Cópialo → Vercel variable `TELEGRAM_BOT_TOKEN`.

### Paso 3.2 — Obtener tu `chat.id`

1. Abre una conversación con **tu bot nuevo** (búscalo por username).  
2. Pulsa **Start** o envía cualquier mensaje: `hola`.  
3. En el navegador (Chrome/Edge) abre esta URL (sustituye `TOKEN`):

```text
https://api.telegram.org/botTOKEN/getUpdates
```

4. En el JSON busca `"chat":{"id": 123456789` — ese número es tu chat id.  
5. Crea en Vercel: `TELEGRAM_OWNER_CHAT_ID` = `123456789` (sin comillas).  
6. (Opcional) Si más adelante hay varios chats:  
   `TELEGRAM_BROADCAST_CHAT_IDS` = `111,222,333`

### Paso 3.3 — Webhook (para que Telegram hable con tu app)

1. Tras Redeploy, abre en el navegador (una sola vez):

```text
https://api.telegram.org/botTOKEN/setWebhook?url=https://ats-advisor-two.vercel.app/api/webhooks/telegram
```

2. Debes ver `{"ok":true,...}`.  
3. Verifica:

```text
https://api.telegram.org/botTOKEN/getWebhookInfo
```

### Paso 3.4 — Probar

1. Escríbele al bot un comando que la app soporte (según webhook; si no, al menos el health del cron de cápsulas).  
2. O prueba el cron (con `CRON_SECRET`):

```powershell
$secret = "PEGA_CRON_SECRET"
Invoke-RestMethod -Uri "https://ats-advisor-two.vercel.app/api/cron/capsules" -Headers @{ Authorization = "Bearer $secret" }
```

Deberías recibir un mensaje de cápsula en Telegram si token + chat id están bien.

---

## 4. WhatsApp Business (opcional / Plus — costo por mensaje)

Hazlo **después** de Telegram. Telegram cubre el mismo caso de uso gratis.

### Resumen de pasos (Meta Cloud API)

1. https://developers.facebook.com → **My Apps** → **Create App** → tipo **Business**.  
2. Agrega producto **WhatsApp**.  
3. En **API Setup** copia:  
   - Temporary o Permanent **Access Token** → `WHATSAPP_TOKEN`  
   - **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`  
4. Número de prueba / producción según Meta te permita.  
5. Crea plantillas **utility** en español (aprobación Meta puede tardar).  
6. En Vercel: `WHATSAPP_BROADCAST_TO` = tu celular en formato internacional sin `+` o con el formato que use tu código (`57300...`).  
7. Redeploy.  
8. Alternativa: BSP (Twilio / 360dialog) — mismos conceptos, tokens distintos; habría que adaptar si no usas Meta Cloud.

---

## 5. Pagos Wompi / Mercado Pago — guía paso a paso

**Precios objetivo:** Carrera ~$79.000 COP / Plus ~$99.000 / OUT-09 extra.  
**Webhook de la app:** `https://ats-advisor-two.vercel.app/api/webhooks/payments`

Puedes configurar **una o las dos**. En `/precios` el usuario elige pasarela (auto / Wompi / MP).

### Opción A — Wompi (Colombia)

1. Entra a https://wompi.co → crea cuenta comercio.  
2. Completa datos de negocio (pueden pedir documentos).  
3. En el dashboard busca **Desarrolladores** / **API Keys**.  
4. Usa primero **Sandbox / Test**:  
   - Public key → `WOMPI_PUBLIC_KEY`  
   - Private key → `WOMPI_PRIVATE_KEY`  
5. Eventos / Webhooks:  
   - URL: `https://ats-advisor-two.vercel.app/api/webhooks/payments`  
   - Copia el **events secret** → `WOMPI_EVENTS_SECRET`  
6. Mientras pruebas checksum: puedes poner `WOMPI_CHECKSUM_MODE` = `skip`  
   **Bórrala o no la uses en live.**  
7. Redeploy.  
8. Ve a https://ats-advisor-two.vercel.app/precios → elige Wompi → pago de prueba.  
9. Cuando funcione: cambia a llaves **Live** y quita `skip`.

### Opción B — Mercado Pago

1. https://www.mercadopago.com.co/developers → inicia sesión.  
2. **Tus integraciones** → **Crear aplicación**.  
3. Nombre: `ATSAdvisor`.  
4. Copia el **Access Token** (primero de **Pruebas**):  
   → Vercel `MP_ACCESS_TOKEN`  
5. En la app / preferencias de notificaciones, configura URL de webhooks hacia:  
   `https://ats-advisor-two.vercel.app/api/webhooks/payments`  
   (si el panel lo pide; el checkout también envía `notification_url`).  
6. Redeploy.  
7. Prueba desde `/precios` con tarjetas de prueba de MP.  
8. Cuando esté OK: Access Token de **Producción**.

### Si no hay ninguna key de pago

El checkout responde que faltan `WOMPI_*` o `MP_ACCESS_TOKEN`. La app sigue usable en modo free/demo.

---

## 6. Dominio propio (opcional)

1. Compra o usa un dominio (ej. `atsadvisor.lotic…` o el que elijas).  
2. Vercel → proyecto `ats-advisor` → **Settings** → **Domains** → **Add**.  
3. Sigue las instrucciones DNS (A/CNAME) en tu registrador.  
4. Espera certificado SSL (minutos).  
5. Actualiza `NEXT_PUBLIC_APP_URL` al dominio nuevo (ej. `https://atsadvisor.tudominio.com`).  
6. En Supabase Auth → Site URL y Redirect URLs con el dominio nuevo.  
7. Vuelve a setear webhook de Telegram y de pagos con la URL nueva.  
8. Redeploy.

---

## 7. Google AdSense (ATS gratis — opcional)

1. https://www.google.com/adsense → solicita tu sitio.  
2. Añade la URL de producción.  
3. Espera aprobación (puede tardar días/semanas).  
4. Copia el publisher id `ca-pub-XXXXXXXX`.  
5. Vercel:  
   - `ADSENSE_CLIENT_ID` = `ca-pub-…`  
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID` = mismo valor  
6. Redeploy.  
7. En `/admin` activa el flag de ads si existe.  
8. Verifica en plan free que el slot de anuncios cargue (sin bloqueadores).

---

## 8. Logo LOTIC final

1. Prepara PNG/SVG del logo (ideal: SVG + PNG 512×512 para PWA).  
2. Opción A: envíamelos y los integro.  
3. Opción B: tú reemplazas:  
   - `public/logo.svg`  
   - iconos en `public/icons/` (y `public/icons/icon-192.png`, `icon-512.png` si existen)  
4. Commit + push a `main` (o avísame) → Vercel redespliega solo.  
5. Hard refresh del navegador (Ctrl+F5) para ver el icono nuevo.

---

## 9. Portfolio LOTIC

1. Abre https://lotic-soluciones.vercel.app/  
2. Busca la tarjeta **ATSAdvisor** (puede decir “En construcción”).  
3. Si no aparece tras un push previo: Vercel → proyecto del sitio LOTIC → **Redeploy**.  
4. Cuando quieras cambiar el estado a “Live”, actualiza el JSON de proyectos en el repo LOTIC o pídemelo.

---

## 10. Checklist maestro

Marca conforme avances:

### Hecho

- [x] `NEXT_PUBLIC_APP_URL`
- [x] `ADMIN_EMAIL`
- [x] `ADMIN_SECRET`
- [x] `ADMIN_TESTER_EMAILS`
- [x] `GROQ_API_KEY`
- [x] `RESEND_API_KEY`
- [x] `RESEND_FROM`
- [x] `CRON_SECRET`
- [x] Proyecto Supabase + `schema.sql` ejecutado
- [x] 3 keys Supabase en Vercel + Redeploy
- [x] Telegram bot + token + owner chat id
- [x] Webhook Telegram OK (`getWebhookInfo` → url correcta, `ok: true`)
- [x] Bucket Storage `cvs`
- [x] Auth Email + redirect URLs
- [x] Botón **Pagar (demo)** en `/precios` (simula cobro y activa Carrera/Plus en el navegador)

### Verificar ahora (2–5 min)

- [ ] `/api/health` → `groq: true`
- [ ] Entrar a `/admin` con `ADMIN_SECRET`
- [ ] Probar cron cápsulas → mensaje Telegram
- [ ] En `/precios` → **Pagar Carrera (demo)** → ir a `/outplacement`

### Siguiente bloque (pagos reales + WhatsApp)

- [ ] Wompi **o** Mercado Pago (test) + webhook pagos
- [ ] Pago de prueba real en `/precios` (Checkout real)
- [ ] WhatsApp Business (sección 4) cuando quieras canal Plus

### Cuando quieras

- [ ] `GOOGLE_AI_API_KEY` / `OPENAI_API_KEY`
- [ ] Dominio propio
- [ ] AdSense
- [ ] Sentry
- [ ] WhatsApp
- [ ] Logo LOTIC final
- [ ] Actualizar tarjeta LOTIC a Live

---

## Orden sugerido esta semana

1. **Redeploy** + probar `/api/health` y `/admin`.  
2. **`CRON_SECRET`**.  
3. **Supabase** completo (sección 2).  
4. **Telegram** (sección 3).  
5. **Una pasarela de pago en sandbox** (sección 5).  
6. El resto cuando haya tiempo/presupuesto.

Sin los pasos A/B, la app sigue funcionando en modo **algoritmos + demo**; con Groq ya puedes tener IA real tras el redeploy. Con Supabase + pagos + Telegram queda el producto “completo” en producción.
