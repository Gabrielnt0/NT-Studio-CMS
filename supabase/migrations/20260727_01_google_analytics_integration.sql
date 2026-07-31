-- NT Studio Platform — Google Analytics real integration
-- Safe to run after the existing platform tables were created.

alter table if exists public.platform_integrations
  add column if not exists last_synced_at timestamptz,
  add column if not exists last_error text;

create table if not exists public.analytics_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.platform_projects(id) on delete cascade,
  integration_id uuid not null references public.platform_integrations(id) on delete cascade,
  provider text not null,
  cache_key text not null,
  payload jsonb not null default '{}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.analytics_cache
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists project_id uuid references public.platform_projects(id) on delete cascade,
  add column if not exists integration_id uuid references public.platform_integrations(id) on delete cascade,
  add column if not exists provider text,
  add column if not exists cache_key text,
  add column if not exists payload jsonb default '{}'::jsonb,
  add column if not exists expires_at timestamptz,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

create unique index if not exists analytics_cache_integration_key_uidx
  on public.analytics_cache (integration_id, cache_key);

create index if not exists analytics_cache_project_idx
  on public.analytics_cache (project_id, provider);

create table if not exists public.analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.platform_projects(id) on delete cascade,
  integration_id uuid not null references public.platform_integrations(id) on delete cascade,
  provider text not null,
  period_start date,
  period_end date,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.analytics_snapshots
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists project_id uuid references public.platform_projects(id) on delete cascade,
  add column if not exists integration_id uuid references public.platform_integrations(id) on delete cascade,
  add column if not exists provider text,
  add column if not exists period_start date,
  add column if not exists period_end date,
  add column if not exists payload jsonb default '{}'::jsonb,
  add column if not exists created_at timestamptz default now();

create index if not exists analytics_snapshots_project_created_idx
  on public.analytics_snapshots (project_id, created_at desc);

alter table public.analytics_cache enable row level security;
alter table public.analytics_snapshots enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'analytics_cache'
      and policyname = 'Users manage own analytics cache'
  ) then
    create policy "Users manage own analytics cache"
      on public.analytics_cache
      for all
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'analytics_snapshots'
      and policyname = 'Users manage own analytics snapshots'
  ) then
    create policy "Users manage own analytics snapshots"
      on public.analytics_snapshots
      for all
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

grant select, insert, update, delete on public.analytics_cache to authenticated;
grant select, insert, update, delete on public.analytics_snapshots to authenticated;

notify pgrst, 'reload schema';
