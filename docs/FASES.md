# Fases entregadas

## UI
Fondos claros; morado solo en botones, iconos, sombras y detalles sutiles.

## F1 ATS Core
Motor ES en `src/lib/ats/engine.ts`, API `/api/ats/analyze`, flujo 4 pasos en `/ats`.

## F2 AI Router
Cascade Groq → Gemini → OpenAI/local + rúbrica de calidad en `src/lib/ai/router.ts`.

## F3 Voz
`SpeakButton` + `DictationButton` en ATS, OUT-09 y cuenta.

## F4 Outplacement
OUT-01…08 en `/outplacement/ruta`, OUT-09 wizard + cuestionario + generación.

## F5 Canales
Preferencia PWA/Telegram/WhatsApp en cuenta; webhook Telegram `/api/webhooks/telegram`.

## F6 Admin + Legal/Habeas
`/admin` precios/límites; `/cuenta` export/borrado Habeas Data local; schema Supabase.

## F7 Analytics
`/admin/analytics` básico (localStorage); Pro documentado en MANUAL.

## F8 SEO + LOTIC
sitemap/robots, `/herramientas`, entrada LOTIC “En construcción”, MANUAL-ACCIONES.md.
