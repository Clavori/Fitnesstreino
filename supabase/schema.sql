-- ============================================================================
-- FORJA PWA - SCHEMA COMPLETO DO BANCO DE DADOS (SUPABASE / POSTGRESQL)
-- Execute este script no SQL Editor do seu projeto Supabase.
-- ============================================================================

-- Extensão para UUIDs
create extension if not exists "uuid-ossp";

-- 1. TABELA DE PERFIS DOS ALUNOS (PROFILES)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  avatar_url text,
  age int not null default 25,
  weight_kg numeric(5,2) not null default 75.0,
  height_cm int not null default 175,
  goal text not null default 'ganhar_massa' check (goal in ('emagrecer', 'ganhar_massa', 'manter_shape')),
  level text not null default 'intermediario' check (level in ('iniciante', 'intermediario', 'avancado')),
  points int not null default 0,
  weekly_points int not null default 0,
  current_streak int not null default 0,
  best_streak int not null default 0,
  gym_code text not null default 'FORJA-HQ',
  role text not null default 'aluno' check (role in ('aluno', 'instrutor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. TABELA DE FICHAS DE TREINO SEMANAIS (WORKOUT_PLANS)
create table if not exists public.workout_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6), -- 0 = Domingo, 1 = Segunda...
  title text not null,
  muscle_focus text not null,
  estimated_minutes int not null default 50,
  is_rest_day boolean not null default false,
  exercises jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique(user_id, day_of_week)
);

-- 3. HISTÓRICO DE TREINOS CONCLUÍDOS (WORKOUT_LOGS)
create table if not exists public.workout_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workout_date date not null default current_date,
  workout_title text not null,
  duration_minutes int not null default 45,
  total_volume_kg numeric(10,2) not null default 0,
  points_earned int not null default 150,
  exercises_done jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 4. CALENDÁRIO DE FREQUÊNCIA E ASSIDUIDADE (ATTENDANCE_LOGS)
create table if not exists public.attendance_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  status text not null check (status in ('trained', 'rest', 'missed')),
  source text not null default 'auto' check (source in ('auto', 'manual')),
  workout_title text,
  points_awarded int not null default 0,
  created_at timestamptz not null default now(),
  unique(user_id, date)
);

-- 5. REGISTRO DIÁRIO DE ALIMENTAÇÃO E HIDRATAÇÃO (NUTRITION_LOGS)
create table if not exists public.nutrition_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  log_date date not null default current_date,
  calories_consumed int not null default 0,
  protein_g int not null default 0,
  carbs_g int not null default 0,
  fat_g int not null default 0,
  water_ml int not null default 0,
  meals_checked jsonb not null default '[]'::jsonb,
  custom_foods jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique(user_id, log_date)
);

-- 6. HISTÓRICO DE MEDIDAS E PESO (BODY_METRICS)
create table if not exists public.body_metrics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  recorded_at date not null default current_date,
  weight_kg numeric(5,2) not null,
  body_fat_pct numeric(4,1),
  chest_cm numeric(5,1),
  waist_cm numeric(5,1),
  arm_cm numeric(5,1),
  photo_url text
);

-- 7. GRUPOS / ACADEMIAS COM CÓDIGO DE CONVITE (RANKING GROUPS)
create table if not exists public.gym_groups (
  code text primary key,
  name text not null,
  description text,
  weekly_challenge_title text default 'Bater 4 treinos + 15L de água na semana',
  weekly_challenge_reward int default 300,
  created_at timestamptz not null default now()
);

-- Inserir grupo padrão de exemplo
insert into public.gym_groups (code, name, description)
values
  ('FORJA-HQ', 'Academia Forja Iron Club', 'Ranking oficial da unidade matriz'),
  ('MONSTROS-26', 'Esquadrão 6h da Manhã', 'Grupo de amigos focado em hipertrofia e constância')
on conflict (code) do nothing;

-- ============================================================================
-- POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.workout_plans enable row level security;
alter table public.workout_logs enable row level security;
alter table public.attendance_logs enable row level security;
alter table public.nutrition_logs enable row level security;
alter table public.body_metrics enable row level security;
alter table public.gym_groups enable row level security;

-- Qualquer aluno autenticado pode visualizar o ranking (perfis) e grupos
create policy "Perfis visíveis no ranking" on public.profiles for select using (true);
create policy "Usuário edita próprio perfil" on public.profiles for all using (auth.uid() = id);

create policy "Usuário gerencia próprios treinos" on public.workout_plans for all using (auth.uid() = user_id);
create policy "Usuário gerencia próprios logs de treino" on public.workout_logs for all using (auth.uid() = user_id);
create policy "Usuário gerencia própria frequência" on public.attendance_logs for all using (auth.uid() = user_id);
create policy "Usuário gerencia própria nutrição" on public.nutrition_logs for all using (auth.uid() = user_id);
create policy "Usuário gerencia próprias medidas" on public.body_metrics for all using (auth.uid() = user_id);
create policy "Grupos visíveis a todos" on public.gym_groups for select using (true);
create policy "Usuários criam grupos" on public.gym_groups for insert with check (true);

-- ============================================================================
-- STORAGE BUCKET PARA FOTOS DE PERFIL E EVOLUÇÃO
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatares públicos para leitura"
on storage.objects for select
using ( bucket_id = 'avatars' );

create policy "Upload de avatar autenticado"
on storage.objects for insert
with check ( bucket_id = 'avatars' );
