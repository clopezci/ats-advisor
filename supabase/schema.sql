-- ATSAdvisor — schema inicial Supabase
-- Ejecutar en SQL Editor del proyecto

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  full_name text,
  plan text not null default 'free', -- free | carrera | plus
  out09_used_this_month int not null default 0,
  learning_channel text not null default 'pwa', -- pwa | telegram | whatsapp
  is_tester boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ats_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  score numeric,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  code text not null, -- OUT-01..OUT-09
  title text not null,
  skill_type text, -- soft | hard
  payload jsonb not null,
  progress numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  detail jsonb,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table ats_scans enable row level security;
alter table courses enable row level security;

create policy "profiles_own" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "scans_own" on ats_scans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "courses_own" on courses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  company text not null,
  url text,
  status text not null default 'interes',
  notes text,
  score numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table job_applications enable row level security;
create policy "jobs_own" on job_applications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- B2B (F15/F16)
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_email text not null,
  seats_purchased int not null default 25,
  brand_tagline text,
  brand_accent text,
  logo_url text,
  owner_user_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists company_seats (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  email text not null,
  full_name text,
  status text not null default 'invited', -- invited | active | completed | paused
  modules_done int not null default 0,
  invited_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, email)
);

alter table companies enable row level security;
alter table company_seats enable row level security;

-- Owner de la empresa ve/edita su org
create policy "companies_owner_all" on companies
  for all using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);

-- Asientos: visibles/editables por el owner de la empresa
create policy "seats_owner_all" on company_seats
  for all using (
    exists (
      select 1 from companies c
      where c.id = company_seats.company_id and c.owner_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from companies c
      where c.id = company_seats.company_id and c.owner_user_id = auth.uid()
    )
  );

alter table app_settings enable row level security;
alter table audit_events enable row level security;
-- Sin políticas anon: solo service_role (bypass RLS) puede leer/escribir.
-- El cliente browser NUNCA debe usar la service role key.

-- telegram chat ids para fan-out de cápsulas
alter table profiles add column if not exists telegram_chat_id text;
alter table profiles add column if not exists whatsapp_phone text;

-- Cursor de aprendizaje (cápsulas personalizadas + Continúa hoy)
alter table profiles add column if not exists learning_course_id text;
alter table profiles add column if not exists learning_lesson_id text;
alter table profiles add column if not exists learning_cursor_at timestamptz;

-- OTP vincular Telegram ↔ email (pending codes viven también en audit_events)
alter table profiles add column if not exists telegram_link_code text;
alter table profiles add column if not exists telegram_link_expires timestamptz;
alter table profiles add column if not exists telegram_link_chat_id text;
