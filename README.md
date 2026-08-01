# ATSAdvisor (PWA) — LOTIC Soluciones

PWA mobile-first para **pasar filtros ATS** y **reconstruir la carrera** con outplacement accesible en COP.

**Live:** https://ats-advisor-two.vercel.app/  
**Repo:** https://github.com/clopezci/ats-advisor

## Qué incluye (post F23)

- Motor ATS ES (keywords + semántico bag-of-words), extract PDF/DOCX, informe
- Outplacement OUT-01…08 con quizzes · OUT-09 personalizado · filtro predictivo · 90 días
- Tracker, blog SEO, herramientas free, voz Speak/Dictate, PWA offline
- Planes Carrera/Plus, Wompi + Mercado Pago, portal B2B RH (demo)
- Admin, Analytics Pro, Habeas Data, cron cápsulas/auditoría

Mapa completo: `/capacidades`

## Stack

- Next.js 15 + React 19 + Tailwind 4
- PWA (`manifest.webmanifest` + `sw.js`)
- Vercel · Supabase (opcional) · Groq/Gemini/OpenAI · Telegram/WhatsApp · Wompi/MP

## Desarrollo

```bash
npm install
npm run dev
npm test
npm run build
```

## Docs

| Archivo | Contenido |
|---------|-----------|
| `PLAN-MAESTRO-ATSAdvisor.md` | Producto e ingeniería |
| `MANUAL-ACCIONES.md` | **Lo que solo tú puedes configurar** (keys, Supabase, pagos, logo) |
| `docs/FASES*.md` | Historial de fases F0–F23 |
| `supabase/schema.sql` | Schema + RLS |
| `legacy/python-v1/` | Referencia imperfecta (no portar tal cual) |

## Go-live checklist

1. Variables en Vercel (ver `MANUAL-ACCIONES.md`)
2. `npm run build` verde / CI en `main`
3. Supabase: ejecutar schema + redirects auth
4. Webhook pagos → `/api/webhooks/payments`
5. Telegram webhook / cron secrets
6. Probar `/ats`, `/outplacement/ruta`, `/precios`, `/empresa`

Sin keys la app corre en **demo local** (algoritmos + gates locales).
