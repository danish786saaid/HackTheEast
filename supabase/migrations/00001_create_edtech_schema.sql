-- ============================================================
-- BadgeForge EdTech Schema
-- Migration: 00001_create_edtech_schema
-- ============================================================

-- Enable pgcrypto for gen_random_uuid() if not already enabled
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. users  (extends auth.users)
-- ============================================================
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  email       text unique not null,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

comment on table public.users is 'Public profile extending Supabase Auth users';

-- ============================================================
-- 2. content
-- ============================================================
create table public.content (
  id              uuid primary key default gen_random_uuid(),
  owner           uuid not null references public.users(id) on delete cascade,
  title           text not null,
  summary         text,
  source_url      text,
  source_type     text not null check (source_type in ('article', 'video', 'paper', 'course', 'podcast', 'rss', 'other')),
  tags            text[] not null default '{}',
  relevance_score float not null default 0 check (relevance_score between 0 and 1),
  created_at      timestamptz not null default now()
);

create index idx_content_owner      on public.content(owner);
create index idx_content_tags       on public.content using gin(tags);
create index idx_content_created_at on public.content(created_at desc);

comment on table public.content is 'Ingested learning content (articles, videos, papers, etc.)';

-- ============================================================
-- 3. tracking_rules
-- ============================================================
create table public.tracking_rules (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  topic           text not null,
  alert_trigger   text not null check (alert_trigger in ('any_new', 'high_relevance', 'breaking', 'daily_digest')),
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

create index idx_tracking_rules_user on public.tracking_rules(user_id);

comment on table public.tracking_rules is 'User-defined rules for topic tracking and alert triggers';

-- ============================================================
-- 4. content_alerts
-- ============================================================
create table public.content_alerts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  content_id      uuid not null references public.content(id) on delete cascade,
  alert_message   text not null,
  is_read         boolean not null default false,
  severity        text not null default 'info' check (severity in ('info', 'warning', 'danger')),
  created_at      timestamptz not null default now()
);

create index idx_content_alerts_user on public.content_alerts(user_id);
create index idx_content_alerts_read on public.content_alerts(user_id, is_read);

comment on table public.content_alerts is 'Alerts fired when tracking rules match new content';

-- ============================================================
-- 5. knowledge_portfolio
-- ============================================================
create table public.knowledge_portfolio (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  domain          text not null,
  proficiency     float not null default 0 check (proficiency between 0 and 100),
  time_invested   int not null default 0,  -- minutes
  created_at      timestamptz not null default now(),
  unique (user_id, domain)
);

create index idx_knowledge_portfolio_user on public.knowledge_portfolio(user_id);

comment on table public.knowledge_portfolio is 'High-level knowledge domains a user is building expertise in';

-- ============================================================
-- 6. tracked_topics
-- ============================================================
create table public.tracked_topics (
  id              uuid primary key default gen_random_uuid(),
  portfolio_id    uuid not null references public.knowledge_portfolio(id) on delete cascade,
  topic           text not null,
  progress        float not null default 0 check (progress between 0 and 100),
  created_at      timestamptz not null default now()
);

create index idx_tracked_topics_portfolio on public.tracked_topics(portfolio_id);

comment on table public.tracked_topics is 'Granular topics within a knowledge domain';

-- ============================================================
-- 7. confidence_gauge
-- ============================================================
create table public.confidence_gauge (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  domain          text not null,
  confidence      float not null default 0 check (confidence between 0 and 100),
  created_at      timestamptz not null default now()
);

create index idx_confidence_gauge_user on public.confidence_gauge(user_id);

comment on table public.confidence_gauge is 'Self-assessed or computed confidence per domain over time';

-- ============================================================
-- 8. learning_trend
-- ============================================================
create table public.learning_trend (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  domain          text not null,
  progress        float not null default 0 check (progress between 0 and 100),
  recorded_at     timestamptz not null default now()
);

create index idx_learning_trend_user     on public.learning_trend(user_id);
create index idx_learning_trend_recorded on public.learning_trend(user_id, recorded_at desc);

comment on table public.learning_trend is 'Time-series learning progress snapshots for trend charts';

-- ============================================================
-- 9. activities
-- ============================================================
create table public.activities (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  content_id      uuid references public.content(id) on delete set null,
  action          text not null check (action in ('read', 'bookmark', 'share', 'complete', 'quiz_pass', 'note', 'highlight', 'search')),
  created_at      timestamptz not null default now()
);

create index idx_activities_user       on public.activities(user_id);
create index idx_activities_created_at on public.activities(user_id, created_at desc);

comment on table public.activities is 'User activity log for all learning actions';

-- ============================================================
-- 10. topic_distribution
-- ============================================================
create table public.topic_distribution (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  domain          text not null,
  count           int not null default 0,
  created_at      timestamptz not null default now(),
  unique (user_id, domain)
);

create index idx_topic_distribution_user on public.topic_distribution(user_id);

comment on table public.topic_distribution is 'Aggregated count of content consumed per domain';

-- ============================================================
-- 11. learning_performance
-- ============================================================
create table public.learning_performance (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  period          text not null,   -- e.g. '2026-W09', '2026-02', 'daily'
  score           float not null default 0 check (score between 0 and 100),
  created_at      timestamptz not null default now()
);

create index idx_learning_performance_user on public.learning_performance(user_id);

comment on table public.learning_performance is 'Periodic knowledge/performance scores';

-- ============================================================
-- 12. learning_paths
-- ============================================================
create table public.learning_paths (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  path_name       text not null,
  steps           jsonb not null default '[]',
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

create index idx_learning_paths_user on public.learning_paths(user_id);

comment on table public.learning_paths is 'AI-generated or user-created learning paths with ordered steps';

-- ============================================================
-- Row Level Security (RLS)
-- Every table is locked down: users can only access their own rows.
-- ============================================================

alter table public.users               enable row level security;
alter table public.content              enable row level security;
alter table public.tracking_rules       enable row level security;
alter table public.content_alerts       enable row level security;
alter table public.knowledge_portfolio  enable row level security;
alter table public.tracked_topics       enable row level security;
alter table public.confidence_gauge     enable row level security;
alter table public.learning_trend       enable row level security;
alter table public.activities           enable row level security;
alter table public.topic_distribution   enable row level security;
alter table public.learning_performance enable row level security;
alter table public.learning_paths       enable row level security;

-- users: own profile only
create policy "Users can view own profile"
  on public.users for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.users for insert with check (auth.uid() = id);

-- content: owner sees own content; all authenticated users can read for feed
create policy "Authenticated users can read content"
  on public.content for select using (auth.role() = 'authenticated');
create policy "Owner can insert content"
  on public.content for insert with check (auth.uid() = owner);
create policy "Owner can update content"
  on public.content for update using (auth.uid() = owner);
create policy "Owner can delete content"
  on public.content for delete using (auth.uid() = owner);

-- Generic per-user policies (select, insert, update, delete own rows)
do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array[
      'tracking_rules', 'content_alerts', 'knowledge_portfolio',
      'confidence_gauge', 'learning_trend', 'activities',
      'topic_distribution', 'learning_performance', 'learning_paths'
    ])
  loop
    execute format(
      'create policy "Users can select own %1$s" on public.%1$I for select using (auth.uid() = user_id)',
      tbl
    );
    execute format(
      'create policy "Users can insert own %1$s" on public.%1$I for insert with check (auth.uid() = user_id)',
      tbl
    );
    execute format(
      'create policy "Users can update own %1$s" on public.%1$I for update using (auth.uid() = user_id)',
      tbl
    );
    execute format(
      'create policy "Users can delete own %1$s" on public.%1$I for delete using (auth.uid() = user_id)',
      tbl
    );
  end loop;
end $$;

-- tracked_topics: access via portfolio ownership
create policy "Users can select own tracked_topics"
  on public.tracked_topics for select
  using (
    exists (
      select 1 from public.knowledge_portfolio kp
      where kp.id = tracked_topics.portfolio_id and kp.user_id = auth.uid()
    )
  );
create policy "Users can insert own tracked_topics"
  on public.tracked_topics for insert
  with check (
    exists (
      select 1 from public.knowledge_portfolio kp
      where kp.id = tracked_topics.portfolio_id and kp.user_id = auth.uid()
    )
  );
create policy "Users can update own tracked_topics"
  on public.tracked_topics for update
  using (
    exists (
      select 1 from public.knowledge_portfolio kp
      where kp.id = tracked_topics.portfolio_id and kp.user_id = auth.uid()
    )
  );
create policy "Users can delete own tracked_topics"
  on public.tracked_topics for delete
  using (
    exists (
      select 1 from public.knowledge_portfolio kp
      where kp.id = tracked_topics.portfolio_id and kp.user_id = auth.uid()
    )
  );

-- ============================================================
-- Trigger: auto-create public.users row on auth signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, username, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
