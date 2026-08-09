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

# BLOQUE PENDIENTES (hazlo cuando el agente termine el código)

### YA HECHO (código reciente — precios)

- Garantía 30 días eliminada.
- OUT-09 **solo** en Carrera Plus (2/mes) o compra extra $22k; Carrera $79k = OUT-01…08 sin curso a medida.
- Precio `plan_90_dias` $39k **retirado**. El “modo 90 días” es pausa post-empleo gratuita (checklist), no un plan barato de 3 meses.

> **Instrucción:** no empieces este bloque hasta que el último push a `main` esté **Ready** en Vercel.  
> Mientras tanto ya puedes **probar ads internos** (ArriendoSeguro / LOTIC) sin Google.

## Pendiente tuyo — checklist corta

| # | Qué | Prioridad | Sección |
| - | --- | --------- | ------- |
| P1 | **Redeploy** Production tras este push | Ahora | [§2](#2-redeploy) |
| P2 | Confirmar house ads en home / blog / ATS (plan free) | Ahora | [§12](#12-ads-internos-y-alternativas-a-google) |
| P3 | Wompi **o** Mercado Pago (sandbox → live) | Cobros | [§6](#6-pagos-reales-wompi-o-mercado-pago) |
| P4 | Solicitud **Google AdSense** (puede tardar / rechazar si hay poco tráfico) | Paralelo | [§8.4](#84-google-adsense) |
| P5 | (Opcional) operador alternativo: EthicalAds / Carbon / Media.net | Paralelo | [§12](#12-ads-internos-y-alternativas-a-google) |
| P6 | WhatsApp Meta (addon) | Después | [§8.2](#82-whatsapp-business) |
| P7 | Dominio propio + actualizar webhooks | Cuando tengas | [§8.5](#85-dominio-propio) |
| P8 | Logo LOTIC final + tarjeta Live en lotic-soluciones | Brand | [§8.6](#86-logo--portfolio-lotic) |
| P9 | Gemini / OpenAI / HF / Sentry DSN | Opcional | [§8.1](#81-fallback-ia)--[§8.3](#83-sentry) |
| P10 | Resend dominio verificado | Email fiable | [§7](#7-resend-dominio) |

### Ya no debes rehacer (según conversación previa)

- Vars base Vercel, `CRON_SECRET`, Supabase (schema + 3 keys + bucket `cvs` + Auth)
- Telegram bot + owner + webhook + `TELEGRAM_WEBHOOK_SECRET`
- RLS `app_settings` / `audit_events`
- Health → Telegram OK

Si algo de esa lista falló en tu entorno, revisa §§2–5 abajo.

---

# 1. Qué quedó listo en código (no requiere tu acción)

- **Pago → plan cloud:** checkout guarda `payment_intent`; webhook Wompi/MP hace upsert de `profiles.plan`; `/api/payments/claim` + `/cuenta` → «Reclamar pago».
- **Ads multi-operador:** por defecto **house** (ArriendoSeguro → https://arriendoseguro.app/ + hub LOTIC). Estructura lista para `adsense` / `custom`.
- **Google-ready:** privacidad/cookies con disclosure de ads + enlace partners Google; `ads.txt`; blog ampliado; slots en home/blog/ATS/herramientas; banner de consentimiento.
- **Telegram:** `/start` registra chat; `/vincular correo@x.com` guarda `telegram_chat_id`; cron envía cápsulas a perfiles pagos vinculados.
- **Habeas:** export + wipe cloud (`action=wipe`) desde `/cuenta`.

---

# 2. Redeploy

1. Vercel → **ats-advisor** → Deployments → último Production → **Redeploy**.
2. Espera **Ready**.
3. Abre https://ats-advisor-two.vercel.app/api/health  
4. Prueba ads: home o `/blog` en plan free → debe verse creativo **ArriendoSeguro · LOTIC**.
5. `https://ats-advisor-two.vercel.app/ads.txt` debe responder texto (línea Google comentada hasta que tengas `ca-pub-…`).

---

# 3–5. Telegram / RLS / verificación

Si el bot ya responde a `/start` y el reporte de salud llega: **salta**.  
Si no: ver historial de este archivo en commits previos o:

- Secret + setWebhook: PowerShell con `TELEGRAM_BOT_TOKEN` + `TELEGRAM_WEBHOOK_SECRET`.
- RLS: `select relname, relrowsecurity from pg_class …` en `app_settings` / `audit_events`.
- Admin: `/admin` + «Enviar reporte de salud».

Comando nuevo del bot: **`/vincular tu@correo.com`** (perfil debe existir vía magic link).

---

# 6. Pagos reales (Wompi o Mercado Pago)

**Webhook:** `https://ats-advisor-two.vercel.app/api/webhooks/payments`

| Paso | Acción |
| ---- | ------ |
| 1 | Sandbox Wompi (`WOMPI_PUBLIC_KEY`, `WOMPI_PRIVATE_KEY`, `WOMPI_EVENTS_SECRET`) **o** `MP_ACCESS_TOKEN` |
| 2 | Redeploy |
| 3 | `/precios` → correo **obligatorio recomendado** → checkout |
| 4 | Tras APPROVED: Telegram «Plan activado» + plan en Supabase `profiles` |
| 5 | Si pagaste sin perfil: magic link → `/cuenta` → **Reclamar pago** |
| 6 | Live: llaves producción; quita `WOMPI_CHECKSUM_MODE=skip` |

Sin pasarela: sigue **Pagar (demo)** (solo dispositivo).

---

# 7. Resend dominio

Verifica DNS en resend.com y pon `RESEND_FROM` con dominio propio. Redeploy.

---

# 8. Opcionales

## 8.1 Fallback IA

`GOOGLE_AI_API_KEY` · `OPENAI_API_KEY` · `HF_TOKEN` → Vercel → Redeploy.

## 8.2 WhatsApp Business

Meta app → `WHATSAPP_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` (+ opcional `WHATSAPP_BROADCAST_TO`). Precio addon en `/admin`.

## 8.3 Sentry

`SENTRY_DSN` (opcional; ya hay alertas Telegram).

## 8.4 Google AdSense

1. Cumple políticas: contenido original (blog), nav clara, HTTPS, privacidad/cookies, contacto, quiénes somos — **ya en la app**.
2. https://www.google.com/adsense → añade la URL del sitio.
3. Tras aprobación: `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-…`
4. Opcional: `NEXT_PUBLIC_AD_OPERATOR=adsense` (si no, auto-pasa a adsense cuando hay client id).
5. Flag **ads** en `/admin` = on.
6. Redeploy. Revisa `/ads.txt`.

> Riesgo: demora o rechazo si el sitio tiene poco tráfico/uso. Por eso dejamos **house ads** activos ya.

## 8.5 Dominio propio

Domains en Vercel → actualizar `NEXT_PUBLIC_APP_URL`, Supabase Auth URLs, webhooks Telegram/pagos, Redeploy.

## 8.6 Logo + portfolio LOTIC

Reemplaza `public/logo.svg` / iconos o envíamelos. En lotic-soluciones marca ATSAdvisor Live si aún dice “en construcción”.

---

# 12. Ads internos y alternativas a Google

### Ya activo (sin tu cuenta Google)

- Operador por defecto: **`house`**
- Creativo principal: **ArriendoSeguro** → https://arriendoseguro.app/
- Secundario: hub https://lotic-soluciones.vercel.app/
- Slots: home (free), blog, ATS resultados, herramientas
- Respeto cookie: «Solo esenciales» oculta ads

### Variables opcionales (Vercel)

| Variable | Uso |
| -------- | --- |
| `NEXT_PUBLIC_AD_OPERATOR` | `house` \| `adsense` \| `custom` \| `mediavine` \| `ezoic` |
| `NEXT_PUBLIC_AD_ARRIENDOSEGURO_URL` | Override URL (default arriendoseguro.app) |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | `ca-pub-…` |
| `NEXT_PUBLIC_AD_CUSTOM_SCRIPT_URL` | Script EthicalAds / Carbon / Media.net / etc. |
| `NEXT_PUBLIC_AD_NETWORK_NAME` | Etiqueta visible del operador custom |

### Alternativas recomendadas (mientras AdSense decide)

| Opción | Notas | Encaje |
| ------ | ----- | ------ |
| **House / LOTIC** | Ya listo; promoción cruzada ArriendoSeguro | Mejor ahora |
| **EthicalAds** | Developer-friendly, aprobación más humana | `custom` + script |
| **Carbon Ads** | Audiencias tech | `custom` |
| **Media.net** | Estilo contextual Yahoo | `custom` / cuenta propia |
| **Propeller / redes abiertas** | Más fácil entrar, peor UX/brand | Solo si aceptas el trade-off |
| **Amazon Associates / afiliados** | No es display clásico | Enlaces en blog |

Flujo sugerido: **house ahora** → solicitar AdSense en paralelo → si rechazan, EthicalAds/Carbon → si creces tráfico, Mediavine/Ezoic.

---

# 9. Checklist imprimible

### Hecho (código + tu setup previo)

- [x] App en Vercel + vars base + Supabase + Telegram secret
- [x] House ads ArriendoSeguro + multi-operador
- [x] Puente pago→plan + claim + habeas wipe
- [x] Legal ads/Google + ads.txt + blog ampliado

### Pendiente tuyo (este bloque)

- [ ] Redeploy (§2)
- [ ] Ver creativo ArriendoSeguro en free (§12)
- [ ] Wompi/MP sandbox (§6)
- [ ] Solicitud AdSense (§8.4) — en paralelo, sin bloquear house
- [ ] (Opc) EthicalAds u otro custom (§12)
- [ ] (Opc) WhatsApp, dominio, logo, Gemini/OpenAI, Resend dominio

---

# 10. Variables — referencia

**Ya suelen estar:**  
`NEXT_PUBLIC_APP_URL` · `ADMIN_*` · `GROQ_*` · `RESEND_*` · `CRON_SECRET` · Supabase ×3 · `TELEGRAM_BOT_TOKEN` · `TELEGRAM_OWNER_CHAT_ID` · `TELEGRAM_WEBHOOK_SECRET`

**Agregar cuando cobres / monetices:**  
`WOMPI_*` o `MP_ACCESS_TOKEN` · `NEXT_PUBLIC_ADSENSE_CLIENT_ID` · opcionales de §12 y §8

**Regla:** cada cambio de env → **Redeploy**.

---

# 11. Dudas rápidas

| Pregunta | Respuesta |
| -------- | --------- |
| ¿Puedo publicitar sin Google? | Sí: house ads ya muestran ArriendoSeguro. |
| ¿Pagó y no ve plan? | Mismo correo en checkout + `/cuenta` → Reclamar pago (o magic link antes). |
| ¿Bot no manda cápsulas diarias al user? | `/vincular email` + plan carrera/plus + cron capsules. |
| ¿Cómo apago ads? | `/admin` flag **ads** off, o usuario «Solo esenciales». |

Cuando marques Redeploy + veas el ad de ArriendoSeguro, avisa y seguimos con la pasarela que elijas.
