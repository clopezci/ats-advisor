# Auditoría ATSAdvisor — 2026-08-03

## Resumen ejecutivo

Se realizó una auditoría completa (flujos, seguridad, validación, admin, observabilidad) y se aplicaron remedios P0/P1 en código. Quedan ítems que dependen de **configuración manual** (keys) o de **auth cloud completa** (plan server-side).

## Hallazgos críticos (antes → después)

| Hallazgo | Estado |
| -------- | ------ |
| `ADMIN_SECRET` fallaba abierto con `dev-admin` en prod | **Cerrado** — fail-closed en producción (`src/lib/admin/auth.ts`) |
| Secret en query `?secret=` (logs) | **Cerrado** — solo header `x-admin-secret` |
| Admin UI borraba settings al guardar (tipo incompleto) | **Cerrado** — UI completa + merge/sanitize |
| Telegram webhook sin auth | **Cerrado** — `TELEGRAM_WEBHOOK_SECRET` + rate limit |
| Crons fallaban abiertos sin `CRON_SECRET` | **Cerrado** — 503/401 en prod |
| `/api/health` filtraba todas las integraciones | **Cerrado** — detalle solo con admin secret |
| Service Supabase usaba anon key | **Cerrado** — solo `SUPABASE_SERVICE_ROLE_KEY` |
| Plan switcher público en `/cuenta` | **Cerrado** — solo localhost / unlock |
| `?demo=carrera` en prod | **Mitigado** — solo localhost |
| OUT-09 `allowDemo` en prod | **Cerrado** |
| Inputs IA/ATS sin techo | **Cerrado** — caps de longitud |
| Habeas HTML injection | **Cerrado** — escape + rate limit |
| Checkout `plan` no whitelisted | **Cerrado** |
| Observabilidad débil | **Mejorado** — Sentry envelope + throttle Telegram + health report |
| Headers seguridad | **Mejorado** — CSP, HSTS, X-Frame-Options |
| RLS `app_settings` / `audit_events` | **SQL listo** — ejecutar en Supabase |

## Sentry interno → Telegram

Módulo: `src/lib/observability.ts`

- Log estructurado
- Envelope Sentry (`SENTRY_DSN`) con auth header
- Telegram al owner con **throttle 15 min** (anti-spam)
- Health snapshot + `reportHealthToTelegram`
- Cron `/api/cron/audit` envía digest de salud
- Admin: botón “Enviar reporte de salud a Telegram”
- Errores de cliente → `/api/observability/client` (ya no se mezclan con feedback)

## Admin configurable

`/admin` ahora permite:

- Precios: carrera, plus, out09_extra, plan_90_dias, whatsapp_addon, currency
- Costo WA interno (meta mid, margen, msgs)
- Todos los `ai_limits`
- Feature flags (ads, telegram, whatsapp, outplacement, out09, coach_chat, guarantee)
- Preferencias LLM
- Footer microlearning
- Testers
- Promociones con fechas inicio/fin
- Salud + disparo Telegram

Los precios públicos se exponen en `/api/features` y `/precios` + límite ATS free los consumen.

## Deuda restante (honestidad)

1. **Entitlements 100% server-side** — el webhook de pagos aún no upserta `profiles.plan`; el plan local sigue siendo cache. Requiere Wompi/MP + Supabase auth en producción.
2. **OUT-09 `body.plan`** — sin sesión JWT el servidor no puede probar el plan; rate limit + kill-switch admin mitigan abuso.
3. **Fan-out Telegram por usuario** — falta persistir `telegram_chat_id` (columna añadida en schema; webhook aún no la escribe en DB).
4. **Habeas cloud completo** — export local OK; borrar filas Supabase requiere sesión + service role.
5. Ejecutar en Supabase el final de `supabase/schema.sql` (RLS app_settings/audit_events).
6. Configurar `TELEGRAM_WEBHOOK_SECRET` en BotFather setWebhook + Vercel.

## Acciones manuales tuyas

Ver `MANUAL-ACCIONES.md` (añadir `TELEGRAM_WEBHOOK_SECRET`, confirmar `CRON_SECRET`, `ADMIN_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SENTRY_DSN` opcional, SQL RLS).
