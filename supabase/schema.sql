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
