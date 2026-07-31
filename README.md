# ATSAdvisor (PWA) — LOTIC Soluciones

Progressive Web App mobile-first para **pasar filtros ATS** y **reconstruir la carrera** con outplacement accesible en COP.

> **Fase actual: F0 — Fundación.** Shell PWA, branding LOTIC, flujos de 2 decisiones y páginas base. El motor ATS y outplacement se construyen en F1+.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind
- PWA (`manifest.webmanifest` + `sw.js`)
- Despliegue objetivo: **Vercel**
- Backend/auth previsto: **Supabase** (F1+)

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Documentación

- `PLAN-MAESTRO-ATSAdvisor.md` — plan de producto e ingeniería
- `docs/F0-FUNDACION.md` — alcance de esta fase
- `legacy/python-v1/` — código de escritorio original (**referencia imperfecta; no portar tal cual**)

## Repo

https://github.com/clopezci/ats-advisor

## LOTIC

Tras el primer deploy en Vercel, publicar entrada en `data/projects.json` del sitio LOTIC según `PUBLICAR-UNA-APP.md`.
