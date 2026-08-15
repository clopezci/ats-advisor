# Acciones manuales — ATSAdvisor

Solo lo que **tú** debes hacer en consolas / fuera del repo.  
El código ya está en `main` (Vercel despliega solo al push).

| | |
| --- | --- |
| **App** | https://ats-advisor-two.vercel.app/ |
| **Vercel** | proyecto `ats-advisor` |
| **Repo** | https://github.com/clopezci/ats-advisor (`main`) |
| **Admin** | https://ats-advisor-two.vercel.app/admin |
| **Actualizado** | 2026-08-15 |

---

# PENDIENTES (hazlos en este orden)

Marca el checkbox cuando termines. Si algo ya lo hiciste antes, márcalo y salta.

---

## 1. Confirmar deploy del código nuevo

**Para qué:** que Production tenga cuadernillo, cascada IA, coaches y roleplay.

1. Vercel → **ats-advisor** → Deployments → último de `main` en **Ready**.
2. Si el push no disparó deploy: **⋯ → Redeploy** (sin build cache si falla).
3. Abre https://ats-advisor-two.vercel.app/api/health — no debe ser 404/500.
4. Humo rápido:
   - `/outplacement/cuadernillo`
   - `/outplacement/cuadernillo/pruebas`
   - `/outplacement/cuadernillo/compensacion`
   - `/outplacement/cuadernillo/finanzas`
   - `/outplacement/cuadernillo/funnel`
   - `/outplacement/cuadernillo/export`
   - `/outplacement/coaches`
   - `/outplacement/roleplay`
5. Telegram (si el bot está vivo): `/cuadernillo` debe devolver tip + links.

- [ ] Hecho

---

## 2. Claves de IA (cascada Groq → Gemini → pago)

**Orden automático en código:** Groq gratis → Gemini gratis → Kimi (Groq) si baja calidad → pago OpenRouter (DeepSeek) → OpenAI → Gemini 2.5.

**Vercel → Settings → Environment Variables → Production** (pon solo las que tengas):

| Variable | Para qué | Dónde sacar |
| --- | --- | --- |
| `GROQ_API_KEY` | Capa 1 gratis (recomendada) | https://console.groq.com |
| `GOOGLE_AI_API_KEY` | Capa 2 gratis | Google AI Studio |
| `OPENROUTER_API_KEY` | Pago mejor precio/calidad (DeepSeek) | https://openrouter.ai |
| `OPENAI_API_KEY` | Alternativa pago (`gpt-4o-mini`) | OpenAI platform |

Opcional: `OPENROUTER_MODEL`, `GROQ_MODEL`, `AI_QUALITY_THRESHOLD`, `HF_TOKEN`, `SENTRY_DSN`.

Tras guardar variables → **Redeploy**.

**Probar:** `/outplacement/coaches` → pregunta corta → debe responder (no solo tip offline). En Admin → Preferencias LLM puedes apagar capas.

- [ ] Groq puesto  
- [ ] Gemini puesto  
- [ ] OpenRouter **o** OpenAI (al menos uno de pago si quieres escalar calidad)  
- [ ] Redeploy + prueba OK  

---

## 3. Cobros reales (si aún no cobras en vivo)

Sin esto, “Pagar (demo)” solo vale en localhost; en producción no te entra plata.

Elige **una** pasarela:

### A) Wompi (Colombia)
1. Dashboard Wompi → keys Sandbox: public, private, events secret.
2. Vercel: `WOMPI_PUBLIC_KEY`, `WOMPI_PRIVATE_KEY`, `WOMPI_EVENTS_SECRET`.
3. Webhook: `https://ats-advisor-two.vercel.app/api/webhooks/payments`
4. Redeploy → prueba `/precios` con correo real.
5. Luego pasa a keys **Live** (quita cualquier `WOMPI_CHECKSUM_MODE=skip`).

### B) Mercado Pago
1. `MP_ACCESS_TOKEN` en Vercel.
2. Mismo webhook de pagos.
3. Redeploy + prueba `/precios`.

- [ ] Sandbox OK  
- [ ] Live OK (después)  
- [ ] No aplica aún  

---

## 4. Un aliado experto en Admin (si usas marketplace)

1. `/admin` → **Aliados expertos** → Añadir (nombre, correo, precio COP, comisión %).
2. Flag **experts** ON → Guardar.
3. Probar `/outplacement/experto`.

- [ ] Hecho  
- [ ] Después  

---

## 5. Resend + dominio (correos fiables)

1. resend.com → verifica dominio (DNS).
2. Vercel: `RESEND_FROM` = `ATSAdvisor <noreply@tudominio.com>`
3. Redeploy → prueba solicitud a aliado o mail de cuenta.

- [ ] Hecho  
- [ ] Más adelante  

---

## 6. WhatsApp Business (opcional)

Vercel: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` → Redeploy → número en aliado Admin.

Sin esto siguen email + Telegram.

- [ ] Hecho  
- [ ] Después  

---

## 7. Google AdSense (paralelo, no bloquea)

1. Solicita sitio en AdSense.
2. Si aprueban: `NEXT_PUBLIC_ADSENSE_CLIENT_ID` + Redeploy.
3. Mientras: house ads (ArriendoSeguro) con flag **ads** ON.

- [ ] Solicitud enviada  
- [ ] Aprobado + variable  

---

## 8. Dominio propio (cuando lo tengas)

1. Vercel → Domains.
2. `NEXT_PUBLIC_APP_URL` = tu HTTPS.
3. Supabase Auth URLs + webhooks Wompi/MP/Telegram al dominio nuevo.
4. Redeploy.

- [ ] Hecho  
- [ ] Después  

---

## 9. Logo + tarjeta Live en LOTIC

1. Sustituye `public/logo.svg` / favicons **o** envíaselos al agente.
2. En lotic-soluciones: tarjeta ATSAdvisor → Live + URL de la app.

- [ ] Logo  
- [ ] Tarjeta LOTIC  

---

## 10. Alumni (solo si ya tienes grupo)

`/admin` → Alumni → URL Telegram/Discord → Guardar → `/outplacement/alumni`.

- [ ] Hecho  
- [ ] No aplica  

---

## 11. Comisiones de aliados (cuando haya casos reales)

`/admin/expertos` → Confirmados sin corte → Cerrar corte semanal → liquidar según modo de cobro.

- [ ] Entendido / probado  

---

# Orden sugerido esta semana

| Prioridad | Punto |
| --- | --- |
| Hoy | **1** deploy + **2** claves IA (mínimo Groq) |
| Esta semana | **3** pagos sandbox si aún no cobras |
| Cuando toque | 4–11 según negocio |

---

# Webhooks (referencia)

| Sistema | URL |
| --- | --- |
| Wompi / Mercado Pago | `https://ats-advisor-two.vercel.app/api/webhooks/payments` |
| Telegram | el que ya configuraste con `TELEGRAM_WEBHOOK_SECRET` |

**Regla:** cada cambio de variable en Vercel → **Redeploy**.

---

# Ya está en código (no lo reconfigures “porque salió en el chat”)

Cuadernillo (mapa, mercado 3 canales, guiones, SOAR, CRM), cascada IA, coaches por especialidad, roleplay, cursos, freemium, pagos demo local, Telegram OTP, etc.  
Si algo de infra vieja (Supabase, Telegram bot, `ADMIN_SECRET`, cron) **deja de funcionar**, dilo y lo reparamos puntual — no hace falta rehacerlo “por checklist”.
