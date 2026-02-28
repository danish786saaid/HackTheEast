-- ============================================================
-- User learning metrics and progress tables
-- Migration: 00004_create_user_learning_tables
-- ============================================================

create extension if not exists "pgcrypto";

-- Per-tutorial watch progress
create table if not exists public.user_tutorial_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tutorial_id text not null,
  watched_percent int not null default 0 check (watched_percent between 0 and 100),
  duration_seconds int not null default 0 check (duration_seconds >= 0),
  last_watched_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, tutorial_id)
);

create index if not exists idx_user_tutorial_progress_user on public.user_tutorial_progress(user_id);

-- Every opened article is recorded (no dedupe) so dashboard count increments by click
create table if not exists public.user_article_reads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  article_slug text not null,
  read_at timestamptz not null default now()
);

create index if not exists idx_user_article_reads_user_time on public.user_article_reads(user_id, read_at desc);

-- Category mastery snapshot per user/category
create table if not exists public.user_category_mastery (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id text not null,
  mastery_percent int not null default 0 check (mastery_percent between 0 and 100),
  updated_at timestamptz not null default now(),
  unique (user_id, category_id)
);

create index if not exists idx_user_category_mastery_user on public.user_category_mastery(user_id);

-- Achievement progress per user
create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null,
  progress int not null default 0 check (progress >= 0),
  total int not null default 1 check (total > 0),
  achieved boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create index if not exists idx_user_achievements_user on public.user_achievements(user_id);

alter table public.user_tutorial_progress enable row level security;
alter table public.user_article_reads enable row level security;
alter table public.user_category_mastery enable row level security;
alter table public.user_achievements enable row level security;

drop policy if exists "Users can select own user_tutorial_progress" on public.user_tutorial_progress;
create policy "Users can select own user_tutorial_progress"
  on public.user_tutorial_progress for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own user_tutorial_progress" on public.user_tutorial_progress;
create policy "Users can insert own user_tutorial_progress"
  on public.user_tutorial_progress for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own user_tutorial_progress" on public.user_tutorial_progress;
create policy "Users can update own user_tutorial_progress"
  on public.user_tutorial_progress for update using (auth.uid() = user_id);

drop policy if exists "Users can select own user_article_reads" on public.user_article_reads;
create policy "Users can select own user_article_reads"
  on public.user_article_reads for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own user_article_reads" on public.user_article_reads;
create policy "Users can insert own user_article_reads"
  on public.user_article_reads for insert with check (auth.uid() = user_id);

drop policy if exists "Users can select own user_category_mastery" on public.user_category_mastery;
create policy "Users can select own user_category_mastery"
  on public.user_category_mastery for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own user_category_mastery" on public.user_category_mastery;
create policy "Users can insert own user_category_mastery"
  on public.user_category_mastery for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own user_category_mastery" on public.user_category_mastery;
create policy "Users can update own user_category_mastery"
  on public.user_category_mastery for update using (auth.uid() = user_id);

drop policy if exists "Users can select own user_achievements" on public.user_achievements;
create policy "Users can select own user_achievements"
  on public.user_achievements for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own user_achievements" on public.user_achievements;
create policy "Users can insert own user_achievements"
  on public.user_achievements for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own user_achievements" on public.user_achievements;
create policy "Users can update own user_achievements"
  on public.user_achievements for update using (auth.uid() = user_id);
