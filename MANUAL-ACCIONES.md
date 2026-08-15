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

## 1. Confirmar deploy

1. Vercel → **ats-advisor** → último `main` en **Ready** (Redeploy si hace falta).
2. https://ats-advisor-two.vercel.app/api/health — OK.
3. Humo: `/outplacement/cuadernillo` (botón Sync cloud), `/outplacement/alumni`, `/outplacement/coaches`.
4. Telegram: `/cuadernillo` → tip + links.

- [ ] Hecho

---

## 2. SQL sync del cuadernillo (Supabase) — **nuevo**

**Para qué:** guardar el cuadernillo en cloud (multi-dispositivo) y no perderlo al cambiar de browser.

1. Supabase → SQL Editor.
2. Ejecuta el contenido de `supabase/alter_workbook_cloud.sql` (o estas 2 líneas):

```sql
alter table profiles add column if not exists workbook_json jsonb;
alter table profiles add column if not exists workbook_updated_at timestamptz;
```

3. Prueba: entra a la PWA con correo de plan Carrera → edita el cuadernillo → “Sync cloud ahora” → otro dispositivo / ventana privada con el mismo correo → debe bajar.

- [ ] SQL ejecutado  
- [ ] Sync probado  

---

## 3. Claves de IA (cascada)

Vercel Production:

| Variable | Rol |
| --- | --- |
| `GROQ_API_KEY` | Gratis calidad (recomendada) |
| `GOOGLE_AI_API_KEY` | Gratis Gemini |
| `OPENROUTER_API_KEY` | Pago precio/calidad (DeepSeek) |
| `OPENAI_API_KEY` | Alternativa pago |

→ Redeploy → prueba `/outplacement/coaches`.

- [ ] Groq  
- [ ] Gemini  
- [ ] OpenRouter o OpenAI  
- [ ] Prueba OK  

---

## 4. Cobros reales (si aún no cobras)

Wompi o Mercado Pago + webhook  
`https://ats-advisor-two.vercel.app/api/webhooks/payments` → Redeploy → sandbox → live.

- [ ] Sandbox  
- [ ] Live  
- [ ] No aplica aún  

---

## 5. Alumni / AMA (si ya tienes grupo)

`/admin` → Alumni: URL Telegram (y Discord), nota, **próximo AMA** (fecha) y **tema** → Guardar.  
Probar `/outplacement/alumni`.

- [ ] Hecho  
- [ ] No aplica  

---

## 6. Aliado experto (marketplace)

`/admin` → Aliados → precio + comisión → flag **experts** ON.

- [ ] Hecho  
- [ ] Después  

---

## 7. Resend + dominio

Verificar dominio → `RESEND_FROM` → Redeploy.

- [ ] Hecho  
- [ ] Más adelante  

---

## 8. WhatsApp Business (opcional)

`WHATSAPP_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` → Redeploy.

- [ ] Hecho  
- [ ] Después  

---

## 9. AdSense (paralelo)

Solicitud → si aprueban, `NEXT_PUBLIC_ADSENSE_CLIENT_ID`.

- [ ] Enviado  
- [ ] Aprobado  

---

## 10. Dominio propio (cuando toque)

Vercel Domains + `NEXT_PUBLIC_APP_URL` + Auth/webhooks al dominio nuevo.

- [ ] Después  

---

## 11. Logo + tarjeta Live LOTIC

- [ ] Logo  
- [ ] Tarjeta  

---

## 12. Comisiones aliados (cuando haya casos)

`/admin/expertos` → cerrar corte semanal.

- [ ] Entendido  

---

# Ya corre solo (no lo configures a mano)

- Cron cápsulas diarias (`/api/cron/capsules`)
- Cron accountability cuadernillo **lunes** (`/api/cron/cuadernillo`) — tip a Telegram de perfiles Carrera vinculados
- Sync local del cuadernillo al editar (si hay correo + columnas SQL + plan)

**Regla:** cada variable nueva en Vercel → Redeploy.
