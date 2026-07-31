-- Portfolio CMS 1.0.0 — independent Supabase foundation
-- Run on the NEW Portfolio CMS Supabase project only.

begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  is_public boolean not null default true,
  full_name text not null default '',
  professional_title text not null default '',
  short_bio text,
  bio text,
  location text,
  email text,
  phone text,
  github_url text,
  linkedin_url text,
  instagram_url text,
  youtube_url text,
  twitter_url text,
  website_url text,
  resume_url text,
  avatar_url text,
  available_for_work boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null default 'Portfólio',
  status text not null default 'Rascunho',
  featured boolean not null default false,
  github_url text,
  demo_url text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_project_slides (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portfolio_projects(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  image_url text not null,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  position text not null,
  company text not null,
  employment_type text,
  location text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text,
  technologies text[] not null default '{}',
  company_url text,
  status text not null default 'Rascunho',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  institution text not null,
  course text not null,
  degree text,
  field_of_study text,
  location text,
  description text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  certificate_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  category text not null default '',
  level integer not null default 0 check (level between 0 and 100),
  description text,
  icon text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  file_name text not null,
  public_url text not null,
  storage_path text not null,
  mime_type text,
  size bigint,
  width integer,
  height integer,
  alt_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique default auth.uid() references auth.users(id) on delete cascade,
  site_name text,
  seo_title text,
  seo_description text,
  keywords text,
  canonical_url text,
  robots text not null default 'index,follow',
  og_title text,
  og_description text,
  og_image text,
  twitter_title text,
  twitter_description text,
  twitter_image text,
  twitter_card text not null default 'summary_large_image',
  favicon_url text,
  google_analytics text,
  google_tag_manager text,
  google_search_console text,
  bing_webmaster text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique default auth.uid() references auth.users(id) on delete cascade,
  sections jsonb not null default '[{"id":"inicio","label":"Hero","enabled":true},{"id":"sobre","label":"Sobre","enabled":true},{"id":"trajetoria","label":"Experiências","enabled":true},{"id":"competencias","label":"Habilidades","enabled":true},{"id":"projetos","label":"Projetos","enabled":true},{"id":"formacao","label":"Formação","enabled":true},{"id":"curriculo","label":"Currículo","enabled":true},{"id":"contato","label":"Contato","enabled":true}]'::jsonb,
  hero_layout text not null default 'split' check (hero_layout in ('split','centered','fullscreen')),
  card_style text not null default 'rounded' check (card_style in ('flat','rounded','glass','outline')),
  button_style text not null default 'rounded' check (button_style in ('square','rounded','pill','outline')),
  navbar_style text not null default 'solid' check (navbar_style in ('solid','transparent','blur')),
  container_width text not null default 'wide' check (container_width in ('compact','wide','full')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_themes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique default auth.uid() references auth.users(id) on delete cascade,
  theme_key text not null default 'default',
  mode text not null default 'dark' check (mode in ('light','dark','system')),
  primary_color text not null default '#d4af37',
  secondary_color text not null default '#111111',
  accent_color text not null default '#f5d76e',
  background_color text not null default '#09090b',
  surface_color text not null default '#18181b',
  text_color text not null default '#fafafa',
  muted_text_color text not null default '#a1a1aa',
  heading_font text not null default 'Inter',
  body_font text not null default 'Inter',
  border_radius text not null default '1rem',
  custom_css text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Analytics is personal to this portfolio and no longer uses ONRONT platform tables.
create table if not exists public.analytics_properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  project_type text not null default 'portfolio',
  status text not null default 'active',
  website_url text,
  image_url text,
  display_order integer not null default 0,
  is_default boolean not null default false,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, slug)
);

create table if not exists public.analytics_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid not null references public.analytics_properties(id) on delete cascade,
  provider text not null,
  name text,
  config jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  connection_status text not null default 'pending',
  last_synced_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, provider)
);

create table if not exists public.analytics_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid not null references public.analytics_properties(id) on delete cascade,
  integration_id uuid not null references public.analytics_integrations(id) on delete cascade,
  provider text not null,
  cache_key text not null,
  payload jsonb not null default '{}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(integration_id, cache_key)
);

create table if not exists public.analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid not null references public.analytics_properties(id) on delete cascade,
  integration_id uuid not null references public.analytics_integrations(id) on delete cascade,
  provider text not null,
  period_start date,
  period_end date,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_projects_user_id_idx on public.portfolio_projects(user_id);
create index if not exists portfolio_project_slides_project_idx on public.portfolio_project_slides(project_id, sort_order);
create index if not exists experiences_user_id_idx on public.experiences(user_id);
create index if not exists education_user_id_idx on public.education(user_id, display_order);
create index if not exists skills_user_id_idx on public.skills(user_id, display_order);
create index if not exists media_user_id_idx on public.media(user_id, created_at desc);
create index if not exists analytics_properties_user_id_idx on public.analytics_properties(user_id, display_order);
create index if not exists analytics_integrations_project_idx on public.analytics_integrations(project_id);
create index if not exists analytics_snapshots_project_created_idx on public.analytics_snapshots(project_id, created_at desc);

-- Updated-at triggers.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','portfolio_projects','portfolio_project_slides','experiences','education','skills','media','seo',
    'portfolio_settings','portfolio_themes','analytics_properties','analytics_integrations','analytics_cache'
  ] loop
    execute format('drop trigger if exists %I on public.%I', table_name || '_set_updated_at', table_name);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', table_name || '_set_updated_at', table_name);
  end loop;
end $$;

-- Single-owner tenant isolation.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','portfolio_projects','portfolio_project_slides','experiences','education','skills','media','seo',
    'portfolio_settings','portfolio_themes','analytics_properties','analytics_integrations','analytics_cache','analytics_snapshots'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists owner_all on public.%I', table_name);
    execute format('create policy owner_all on public.%I for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())', table_name);
    execute format('grant select, insert, update, delete on public.%I to authenticated', table_name);
  end loop;
end $$;

grant usage, select on all sequences in schema public to authenticated;

-- Public read API for the published portfolio. It exposes only published/public records.
create or replace function public.get_public_portfolio_content(requested_owner_user_id uuid default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  owner_id uuid;
begin
  select p.user_id into owner_id
  from public.profiles p
  where p.is_public = true
    and (requested_owner_user_id is null or p.user_id = requested_owner_user_id)
  order by p.updated_at desc
  limit 1;

  if owner_id is null then
    return jsonb_build_object('profile', null, 'projects', '[]'::jsonb, 'education', '[]'::jsonb, 'experiences', '[]'::jsonb, 'skills', '[]'::jsonb, 'seo', null, 'theme', null, 'settings', null, 'meta', jsonb_build_object('found', false, 'generated_at', now()));
  end if;

  return jsonb_build_object(
    'profile', (select to_jsonb(p) - 'user_id' from public.profiles p where p.user_id = owner_id),
    'projects', coalesce((select jsonb_agg(to_jsonb(pp) - 'user_id' || jsonb_build_object('slides', coalesce((select jsonb_agg(to_jsonb(s) - 'user_id' order by s.sort_order, s.created_at) from public.portfolio_project_slides s where s.project_id = pp.id), '[]'::jsonb)) order by pp.featured desc, pp.updated_at desc) from public.portfolio_projects pp where pp.user_id = owner_id and pp.status = 'Publicado'), '[]'::jsonb),
    'education', coalesce((select jsonb_agg(to_jsonb(e) - 'user_id' order by e.is_featured desc, e.display_order, e.start_date desc) from public.education e where e.user_id = owner_id and e.is_published = true), '[]'::jsonb),
    'experiences', coalesce((select jsonb_agg(to_jsonb(e) - 'user_id' order by e.featured desc, e.is_current desc, e.start_date desc) from public.experiences e where e.user_id = owner_id and e.status = 'Publicado'), '[]'::jsonb),
    'skills', coalesce((select jsonb_agg(to_jsonb(s) - 'user_id' order by s.is_featured desc, s.display_order, s.name) from public.skills s where s.user_id = owner_id and s.is_published = true), '[]'::jsonb),
    'seo', (select to_jsonb(s) - 'user_id' from public.seo s where s.user_id = owner_id),
    'theme', (select to_jsonb(t) - 'user_id' from public.portfolio_themes t where t.user_id = owner_id),
    'settings', (select to_jsonb(s) - 'user_id' from public.portfolio_settings s where s.user_id = owner_id),
    'meta', jsonb_build_object('found', true, 'generated_at', now())
  );
end;
$$;

revoke all on function public.get_public_portfolio_content(uuid) from public;
grant execute on function public.get_public_portfolio_content(uuid) to anon, authenticated;

-- Storage buckets.
insert into storage.buckets (id, name, public)
values
  ('profile-avatars', 'profile-avatars', true),
  ('portfolio-projects', 'portfolio-projects', true),
  ('media', 'media', true)
on conflict (id) do update set public = excluded.public;

-- Storage policies: public read, authenticated owner writes under <user_id>/...
do $$
declare bucket_name text;
begin
  foreach bucket_name in array array['profile-avatars','portfolio-projects','media'] loop
    execute format('drop policy if exists %I on storage.objects', bucket_name || '_public_read');
    execute format('create policy %I on storage.objects for select to public using (bucket_id = %L)', bucket_name || '_public_read', bucket_name);
    execute format('drop policy if exists %I on storage.objects', bucket_name || '_owner_insert');
    execute format('create policy %I on storage.objects for insert to authenticated with check (bucket_id = %L and (storage.foldername(name))[1] = auth.uid()::text)', bucket_name || '_owner_insert', bucket_name);
    execute format('drop policy if exists %I on storage.objects', bucket_name || '_owner_update');
    execute format('create policy %I on storage.objects for update to authenticated using (bucket_id = %L and owner_id = auth.uid()::text) with check (bucket_id = %L and (storage.foldername(name))[1] = auth.uid()::text)', bucket_name || '_owner_update', bucket_name, bucket_name);
    execute format('drop policy if exists %I on storage.objects', bucket_name || '_owner_delete');
    execute format('create policy %I on storage.objects for delete to authenticated using (bucket_id = %L and owner_id = auth.uid()::text)', bucket_name || '_owner_delete', bucket_name);
  end loop;
end $$;

notify pgrst, 'reload schema';
commit;
