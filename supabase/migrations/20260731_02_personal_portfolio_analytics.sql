begin;

alter table public.portfolio_settings
  add column if not exists google_analytics_enabled boolean not null default false,
  add column if not exists google_analytics_measurement_id text,
  add column if not exists google_analytics_property_id text,
  add column if not exists google_analytics_connection_status text not null default 'pending',
  add column if not exists google_analytics_last_synced_at timestamptz,
  add column if not exists google_analytics_last_error text,
  add column if not exists google_analytics_preview jsonb not null default '{}'::jsonb;

alter table public.portfolio_settings drop constraint if exists portfolio_settings_google_analytics_connection_status_check;
alter table public.portfolio_settings
  add constraint portfolio_settings_google_analytics_connection_status_check
  check (google_analytics_connection_status in ('pending','connected','error'));

drop table if exists public.analytics_cache cascade;
drop table if exists public.analytics_integrations cascade;
drop table if exists public.analytics_properties cascade;
drop table if exists public.analytics_snapshots cascade;

create table public.analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  period_days integer not null default 30 check (period_days in (7,30,90)),
  period_start date,
  period_end date,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index analytics_snapshots_user_period_created_idx
  on public.analytics_snapshots(user_id, period_days, created_at desc);

alter table public.analytics_snapshots enable row level security;

drop policy if exists analytics_snapshots_own_all on public.analytics_snapshots;
create policy analytics_snapshots_own_all on public.analytics_snapshots
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select, insert, update, delete on public.analytics_snapshots to authenticated;

commit;
