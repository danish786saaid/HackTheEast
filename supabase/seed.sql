-- ============================================================
-- BadgeForge Seed Data
-- Run AFTER migration; uses a known demo user UUID.
-- In production the trigger auto-creates users on signup.
-- For local dev, insert a demo user manually.
-- ============================================================

-- HOW TO USE:
-- 1. Create a test user in Supabase Dashboard → Authentication → Users
-- 2. Copy the UUID and paste it below
-- 3. Run this SQL in the SQL Editor
do $$
declare
  demo_uid  uuid := '029b2290-fb1f-443b-8f48-20925e7dec1c';
  port_ai   uuid;
  port_web  uuid;
begin

  -- Upsert demo user
  insert into public.users (id, username, email, avatar_url)
  values (demo_uid, 'demo_learner', 'demo@badgeforge.dev', null)
  on conflict (id) do nothing;

  -- ── Content ──────────────────────────────────────────────
  insert into public.content (id, owner, title, summary, source_type, tags, relevance_score, created_at) values
    (gen_random_uuid(), demo_uid, 'Transformer Architecture Explained',       'Deep dive into self-attention and positional encoding.',                  'article', '{AI,ML,Transformers}',          0.95, now() - interval '2 days'),
    (gen_random_uuid(), demo_uid, 'Intro to Reinforcement Learning',          'Q-learning, policy gradients, and real-world applications.',              'video',   '{AI,RL}',                        0.88, now() - interval '3 days'),
    (gen_random_uuid(), demo_uid, 'Building REST APIs with Next.js',          'Server routes, middleware, and Supabase integration patterns.',           'article', '{WebDev,Next.js,Supabase}',      0.82, now() - interval '1 day'),
    (gen_random_uuid(), demo_uid, 'arXiv: Scaling Laws for LLMs',             'Empirical study on compute-optimal training of large language models.',   'paper',   '{AI,LLM,Research}',              0.97, now() - interval '5 days'),
    (gen_random_uuid(), demo_uid, 'Podcast: Future of EdTech',                'Interview with OAX Foundation on decentralised learning platforms.',      'podcast', '{EdTech,OAX,Decentralisation}',  0.76, now() - interval '4 days'),
    (gen_random_uuid(), demo_uid, 'CSS Grid Mastery',                         'Advanced layout techniques for modern dashboards.',                       'course',  '{WebDev,CSS}',                   0.70, now() - interval '6 days'),
    (gen_random_uuid(), demo_uid, 'Graph Neural Networks Overview',           'How GNNs extend deep learning to non-Euclidean data.',                   'article', '{AI,GNN,Research}',              0.91, now() - interval '1 day');

  -- ── Tracking Rules ──────────────────────────────────────
  insert into public.tracking_rules (user_id, topic, alert_trigger, is_active) values
    (demo_uid, 'AI & Machine Learning',   'high_relevance', true),
    (demo_uid, 'Web Development',          'any_new',        true),
    (demo_uid, 'Blockchain & Web3',        'breaking',       true),
    (demo_uid, 'EdTech Innovations',       'daily_digest',   false);

  -- ── Knowledge Portfolio ─────────────────────────────────
  insert into public.knowledge_portfolio (id, user_id, domain, proficiency, time_invested)
  values
    (gen_random_uuid(), demo_uid, 'AI & Machine Learning', 72, 1840)
  returning id into port_ai;

  insert into public.knowledge_portfolio (id, user_id, domain, proficiency, time_invested)
  values
    (gen_random_uuid(), demo_uid, 'Web Development', 58, 960)
  returning id into port_web;

  -- ── Tracked Topics ──────────────────────────────────────
  insert into public.tracked_topics (portfolio_id, topic, progress) values
    (port_ai,  'Transformers',             85),
    (port_ai,  'Reinforcement Learning',   40),
    (port_ai,  'Computer Vision',          55),
    (port_web, 'Next.js',                  70),
    (port_web, 'Supabase',                 45);

  -- ── Confidence Gauge ────────────────────────────────────
  insert into public.confidence_gauge (user_id, domain, confidence, created_at) values
    (demo_uid, 'AI & Machine Learning',  74, now() - interval '7 days'),
    (demo_uid, 'AI & Machine Learning',  78, now() - interval '3 days'),
    (demo_uid, 'AI & Machine Learning',  82, now()),
    (demo_uid, 'Web Development',        52, now() - interval '7 days'),
    (demo_uid, 'Web Development',        60, now());

  -- ── Learning Trend (daily snapshots) ────────────────────
  insert into public.learning_trend (user_id, domain, progress, recorded_at) values
    (demo_uid, 'AI & Machine Learning', 60, now() - interval '6 days'),
    (demo_uid, 'AI & Machine Learning', 63, now() - interval '5 days'),
    (demo_uid, 'AI & Machine Learning', 65, now() - interval '4 days'),
    (demo_uid, 'AI & Machine Learning', 68, now() - interval '3 days'),
    (demo_uid, 'AI & Machine Learning', 70, now() - interval '2 days'),
    (demo_uid, 'AI & Machine Learning', 72, now() - interval '1 day'),
    (demo_uid, 'AI & Machine Learning', 75, now()),
    (demo_uid, 'Web Development',       45, now() - interval '6 days'),
    (demo_uid, 'Web Development',       47, now() - interval '5 days'),
    (demo_uid, 'Web Development',       50, now() - interval '4 days'),
    (demo_uid, 'Web Development',       52, now() - interval '3 days'),
    (demo_uid, 'Web Development',       55, now() - interval '2 days'),
    (demo_uid, 'Web Development',       56, now() - interval '1 day'),
    (demo_uid, 'Web Development',       58, now());

  -- ── Topic Distribution ──────────────────────────────────
  insert into public.topic_distribution (user_id, domain, count) values
    (demo_uid, 'AI & Machine Learning',  45),
    (demo_uid, 'Web Development',        25),
    (demo_uid, 'Blockchain & Web3',      15),
    (demo_uid, 'EdTech',                 10),
    (demo_uid, 'Career Development',      5);

  -- ── Learning Performance ────────────────────────────────
  insert into public.learning_performance (user_id, period, score, created_at) values
    (demo_uid, '2026-W05', 62, now() - interval '28 days'),
    (demo_uid, '2026-W06', 66, now() - interval '21 days'),
    (demo_uid, '2026-W07', 71, now() - interval '14 days'),
    (demo_uid, '2026-W08', 75, now() - interval '7 days'),
    (demo_uid, '2026-W09', 79, now());

  -- ── Learning Paths ──────────────────────────────────────
  insert into public.learning_paths (user_id, path_name, steps, is_active) values
    (demo_uid, 'Master Transformers', '[
      {"order":1,"title":"Attention Is All You Need (paper)","done":true},
      {"order":2,"title":"Implement self-attention from scratch","done":true},
      {"order":3,"title":"Fine-tune a HuggingFace model","done":false},
      {"order":4,"title":"Build a RAG pipeline","done":false}
    ]'::jsonb, true),
    (demo_uid, 'Full-Stack Next.js', '[
      {"order":1,"title":"Next.js App Router basics","done":true},
      {"order":2,"title":"Server Actions & API routes","done":false},
      {"order":3,"title":"Supabase Auth integration","done":false},
      {"order":4,"title":"Deploy to Vercel","done":false}
    ]'::jsonb, true);

  -- ── Activities ──────────────────────────────────────────
  insert into public.activities (user_id, content_id, action, created_at)
  select demo_uid, c.id, a.action, a.ts
  from (values
    ('Transformer Architecture Explained', 'read',     now() - interval '2 hours'),
    ('Transformer Architecture Explained', 'bookmark', now() - interval '1 hour'),
    ('Intro to Reinforcement Learning',    'read',     now() - interval '5 hours'),
    ('Building REST APIs with Next.js',    'read',     now() - interval '30 minutes'),
    ('arXiv: Scaling Laws for LLMs',       'read',     now() - interval '1 day'),
    ('arXiv: Scaling Laws for LLMs',       'highlight',now() - interval '23 hours')
  ) as a(title, action, ts)
  join public.content c on c.title = a.title and c.owner = demo_uid;

  -- ── Content Alerts ──────────────────────────────────────
  insert into public.content_alerts (user_id, content_id, alert_message, severity, is_read, created_at)
  select demo_uid, c.id, a.msg, a.sev, a.read, a.ts
  from (values
    ('arXiv: Scaling Laws for LLMs',        'New high-relevance paper matches your AI tracking rule',  'info',    true,  now() - interval '5 days'),
    ('Graph Neural Networks Overview',       'Trending topic in your AI & ML domain',                  'info',    false, now() - interval '1 day'),
    ('Podcast: Future of EdTech',            'Breaking: OAX Foundation announces new EdTech grants',   'warning', false, now() - interval '4 days')
  ) as a(title, msg, sev, read, ts)
  join public.content c on c.title = a.title and c.owner = demo_uid;

end $$;
