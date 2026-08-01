## F24 — Cierre frente al Plan Maestro

Brechas del documento original cubiertas en código:

- Cupones en checkout (`applyPromotion` + campo en `/precios`)
- Settings enriquecidos (LLM limits, feature flags, plan 90 días, footer microlearning)
- Persistencia admin → Supabase `app_settings` cuando hay keys
- Habeas Data ZIP (jszip)
- RAG por chunks (`retrieveKnowledge`) + KB skills / LinkedIn / FAQ empleo
- OUT-09: rechazo de pedidos ilícitos, umbral desde settings, grounding retrieve
- Pausa suscripción → 90 días + garantía 30 días
- Chat coach outplacement (`/outplacement/coach`)
- Informe ATS imprimible PDF + TXT
- Quiénes somos (`/legal/quienes-somos`)
- Smoke E2E offline (`npm run test:smoke`)

Sigue requiriendo acciones tuyas: keys Vercel, Supabase schema, pagos live, logo, dominio (MANUAL-ACCIONES.md).
