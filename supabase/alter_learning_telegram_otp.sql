-- Ejecutar en Supabase SQL Editor (después del schema base).
-- Cursor de aprendizaje + OTP Telegram

alter table profiles add column if not exists learning_course_id text;
alter table profiles add column if not exists learning_lesson_id text;
alter table profiles add column if not exists learning_cursor_at timestamptz;

alter table profiles add column if not exists telegram_link_code text;
alter table profiles add column if not exists telegram_link_expires timestamptz;
alter table profiles add column if not exists telegram_link_chat_id text;
