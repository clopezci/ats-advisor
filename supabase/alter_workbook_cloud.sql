-- Ejecutar en Supabase SQL Editor (después del schema base).
-- Sync del cuadernillo digital (workbook JSON por perfil)

alter table profiles add column if not exists workbook_json jsonb;
alter table profiles add column if not exists workbook_updated_at timestamptz;
