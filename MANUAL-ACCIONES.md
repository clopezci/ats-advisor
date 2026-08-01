# Acciones manuales — ATSAdvisor

Todo lo que **tú** debes hacer (el agente no puede completarlo sin tus cuentas/credenciales).

---

## 1. Vercel (ya casi listo)

**Qué:** Confirmar que el deploy automático de `main` funciona tras cada push.  
**Dónde:** https://vercel.com → proyecto `ats-advisor`  
**Cómo:**
1. Settings → Git → repo `clopezci/ats-advisor`, branch `main`.
2. Tras cada push, verificar Deployments → Ready.
3. URL actual: https://ats-advisor-two.vercel.app/

**Variables de entorno** (Settings → Environment Variables → Production + Preview):

| Variable | Para qué | Dónde obtenerla |
|----------|----------|-----------------|
| `NEXT_PUBLIC_APP_URL` | URL canónica | `https://ats-advisor-two.vercel.app` |
| `ADMIN_EMAIL` | Acceso panel owner | Tu correo admin (ej. `clpezci@gmail.com`) |
| `ADMIN_SECRET` | Token simple admin | Genera una clave larga aleatoria |
| `CRON_SECRET` | Protege `/api/cron/audit` | Genera clave y úsala en Vercel Cron Authorization |
| `GROQ_API_KEY` | IA gratuita rápida | https://console.groq.com |
| `GOOGLE_AI_API_KEY` | Gemini Flash (gratis/pago) | https://aistudio.google.com/apikey |
| `OPENAI_API_KEY` | Fallback pago (opcional) | https://platform.openai.com |
| `TELEGRAM_BOT_TOKEN` | Bot alertas + microlearning | @BotFather en Telegram |
| `TELEGRAM_OWNER_CHAT_ID` | Tu chat para alertas | Habla al bot y usa `getUpdates` |
| `RESEND_API_KEY` | Emails (Habeas Data, etc.) | https://resend.com |
| `RESEND_FROM` | Remitente verificado | ej. `ATSAdvisor <noreply@tudominio.com>` |
| `NEXT_PUBLIC_SUPABASE_URL` | Auth/DB (cuando actives) | Supabase → Project Settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth cliente | Supabase → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Server (nunca en cliente) | Supabase → API |
| `WOMPI_PUBLIC_KEY` / `WOMPI_PRIVATE_KEY` | Pagos COP (Wompi) | https://wompi.co |
| `WOMPI_EVENTS_SECRET` | Firma eventos webhook (si aplica) | Panel Wompi → eventos |
| `WOMPI_CHECKSUM_MODE` | Solo staging: `skip` para no validar checksum | Opcional |
| `MP_ACCESS_TOKEN` | Pagos COP (Mercado Pago) | https://www.mercadopago.com.co/developers |
| `SENTRY_DSN` | Errores (opcional) | https://sentry.io |
| `ADSENSE_CLIENT_ID` | Ads en ATS free (opcional) | Google AdSense |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Mismo client id expuesto al browser | ej. `ca-pub-…` |
| `WHATSAPP_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` | Microcápsulas WhatsApp (Plus) | Meta Cloud / BSP |

Después de pegar variables: **Redeploy**.

---

## 2. Supabase (auth, CVs, Habeas Data real)

**Qué:** Crear proyecto y tablas.  
**Dónde:** https://supabase.com  
**Cómo:**
1. New project → región cercana (ej. South America).
2. SQL Editor → ejecuta el archivo `supabase/schema.sql` del repo.
3. Storage → bucket `cvs` privado.
4. Authentication → Email enabled; agrega redirect `https://ats-advisor-two.vercel.app/**`.
5. Copia URL y keys a Vercel (tabla de arriba).

---

## 3. Telegram Bot

**Qué:** Bot de salud + microcápsulas.  
**Dónde:** Telegram → @BotFather  
**Cómo:**
1. `/newbot` → nombre y username.
2. Copia el token → `TELEGRAM_BOT_TOKEN`.
3. Escríbele al bot, luego abre:  
   `https://api.telegram.org/bot<TOKEN>/getUpdates`  
   y copia tu `chat.id` → `TELEGRAM_OWNER_CHAT_ID`.
4. (Opcional) Webhook:  
   `https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://ats-advisor-two.vercel.app/api/webhooks/telegram`

---

## 4. WhatsApp Business (addon de costo)

**Qué:** Microlearning WhatsApp (opcional / Plus).  
**Dónde:** Meta Business Suite + BSP (Twilio / 360dialog / Meta Cloud).  
**Cómo:** Crear app, número, plantillas utility en español, pegar tokens en Vercel cuando elijas proveedor.  
**Nota:** Telegram puede quedar gratis; WhatsApp suma costo por mensaje.

---

## 5. Pagos Wompi / Mercado Pago

**Qué:** Cobrar Carrera $79k / Plus $99k / OUT-09 extra.  
**Dónde:** https://wompi.co o Mercado Pago Colombia  
**Cómo:**
1. Cuenta comercio, llaves test y live (Wompi y/o Mercado Pago).
2. Webhook a `https://ats-advisor-two.vercel.app/api/webhooks/payments`.
3. Variables en Vercel: `WOMPI_*` y/o `MP_ACCESS_TOKEN`.
4. En `/precios` elige pasarela (auto / Wompi / Mercado Pago).
5. Probar pago test → luego live.

---

## 6. Dominio propio (opcional)

**Qué:** `atsadvisor.lotic...` o dominio propio.  
**Dónde:** Vercel → Domains + DNS del registrador.  
**Cómo:** Add domain → configurar registros → actualizar `NEXT_PUBLIC_APP_URL` y LOTIC.

---

## 7. Google AdSense (ATS gratis)

**Qué:** Monetizar capa free.  
**Dónde:** https://www.google.com/adsense  
**Cómo:** Solicitar sitio, esperar aprobación, pegar `ADSENSE_CLIENT_ID`, activar flag en Admin.

---

## 8. Logo LOTIC final

**Qué:** Reemplazar el icono “A” placeholder.  
**Dónde:** Envíame el PNG/SVG o súbelo a `public/icons/` y `public/logo.svg`.  
**Cómo:** Cuando lo tengas, avísame o reemplaza archivos y redespliega.

---

## 9. LOTIC portfolio

**Qué:** Ya se agregó ATSAdvisor en `data/projects.json` del repo LOTIC.  
**Dónde:** https://lotic-soluciones.vercel.app/  
**Cómo:** Si el push a `LOTIC_Soluciones` no se refleja en 2 min, Redeploy del sitio LOTIC en Vercel. Verifica la tarjeta “En construcción”.

---

## 10. Correo admin / testers

**Qué:** Definir quién entra al panel Owner.  
**Dónde:** Vercel env `ADMIN_EMAIL` + panel `/admin` con `ADMIN_SECRET`.  
**Cómo:** En Admin → Testers, marca correos con acceso premium de prueba (cuando Supabase Auth esté activo).

---

## Checklist rápido post-deploy

- [ ] Variables IA (Groq y/o Gemini) en Vercel  
- [ ] `ADMIN_EMAIL` + `ADMIN_SECRET`  
- [ ] Telegram bot + chat id  
- [ ] Supabase schema + keys  
- [ ] Wompi test  
- [ ] Verificar tarjeta en LOTIC  
- [ ] Logo final  

Sin estos pasos, la app funciona en modo **demo local/algoritmos**; con ellos se activa IA, auth, pagos y alertas reales.
