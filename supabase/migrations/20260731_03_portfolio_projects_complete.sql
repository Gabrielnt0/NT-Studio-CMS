begin;

alter table public.portfolio_projects
  add column if not exists slug text,
  add column if not exists long_description text,
  add column if not exists client text,
  add column if not exists project_date date,
  add column if not exists technologies text[] not null default '{}'::text[],
  add column if not exists is_published boolean not null default false,
  add column if not exists display_order integer not null default 0;

update public.portfolio_projects
set slug = trim(both '-' from regexp_replace(
  lower(translate(title,
    'áàâãäåéèêëíìîïóòôõöúùûüçñ',
    'aaaaaaeeeeiiiiooooouuuucn'
  )),
  '[^a-z0-9]+',
  '-',
  'g'
))
where slug is null or btrim(slug) = '';

alter table public.portfolio_projects
  alter column slug set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolio_projects_display_order_check'
  ) then
    alter table public.portfolio_projects
      add constraint portfolio_projects_display_order_check
      check (display_order >= 0);
  end if;
end
$$;

create unique index if not exists portfolio_projects_user_slug_unique_idx
  on public.portfolio_projects (user_id, slug);

create index if not exists portfolio_projects_public_order_idx
  on public.portfolio_projects (user_id, is_published, display_order, updated_at desc);

notify pgrst, 'reload schema';

commit;
