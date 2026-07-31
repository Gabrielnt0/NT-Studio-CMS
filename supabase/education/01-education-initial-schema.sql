-- Query Name: Education - Initial Schema
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  institution text not null,
  degree text not null,
  field_of_study text,
  location text,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  description text,
  credential_url text,
  status text not null default 'Rascunho' check (status in ('Rascunho', 'Publicado')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint education_dates_valid check (end_date is null or end_date >= start_date)
);

create index if not exists education_user_id_idx on public.education(user_id);
create index if not exists education_start_date_idx on public.education(start_date desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists education_set_updated_at on public.education;
create trigger education_set_updated_at
before update on public.education
for each row execute function public.set_updated_at();

alter table public.education enable row level security;

drop policy if exists "Users can read own education" on public.education;
create policy "Users can read own education" on public.education for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can create own education" on public.education;
create policy "Users can create own education" on public.education for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can update own education" on public.education;
create policy "Users can update own education" on public.education for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own education" on public.education;
create policy "Users can delete own education" on public.education for delete to authenticated using (auth.uid() = user_id);
