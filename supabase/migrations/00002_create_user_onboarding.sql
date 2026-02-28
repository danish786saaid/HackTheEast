-- ============================================================
-- user_onboarding — stores onboarding preferences per user
-- ============================================================

create table if not exists public.user_onboarding (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  profile_type    text check (profile_type in ('learner', 'educator', 'institution')),
  interests       text[] not null default '{}',
  experience_level text check (experience_level in ('beginner', 'intermediate', 'advanced')),
  created_at      timestamptz not null default now(),
  unique (user_id)
);

create index idx_user_onboarding_user on public.user_onboarding(user_id);

alter table public.user_onboarding enable row level security;

create policy "Users can view own onboarding"
  on public.user_onboarding for select using (auth.uid() = user_id);
create policy "Users can insert own onboarding"
  on public.user_onboarding for insert with check (auth.uid() = user_id);
create policy "Users can update own onboarding"
  on public.user_onboarding for update using (auth.uid() = user_id);
