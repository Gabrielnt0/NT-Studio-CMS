begin;

create table if not exists public.portfolio_builder_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  preset text not null default 'modern'
    check (preset in ('modern','minimal','creative','timeline')),
  sections jsonb not null default '[
    {"id":"inicio","label":"Hero","enabled":true},
    {"id":"sobre","label":"Sobre","enabled":true},
    {"id":"trajetoria","label":"Experiências","enabled":true},
    {"id":"formacao","label":"Formação","enabled":true},
    {"id":"competencias","label":"Habilidades","enabled":true},
    {"id":"projetos","label":"Projetos","enabled":true},
    {"id":"curriculo","label":"Currículo","enabled":true},
    {"id":"contato","label":"Contato","enabled":true}
  ]'::jsonb,
  hero_layout text not null default 'split'
    check (hero_layout in ('split','centered','fullscreen')),
  show_hero_avatar boolean not null default true,
  show_resume_button boolean not null default true,
  show_contact_button boolean not null default true,
  show_social_links boolean not null default true,
  card_style text not null default 'rounded'
    check (card_style in ('flat','rounded','glass','outline')),
  button_style text not null default 'rounded'
    check (button_style in ('square','rounded','pill','outline')),
  navbar_style text not null default 'blur'
    check (navbar_style in ('solid','transparent','blur')),
  container_width text not null default 'wide'
    check (container_width in ('compact','wide','full')),
  section_spacing text not null default 'comfortable'
    check (section_spacing in ('compact','comfortable','spacious')),
  content_alignment text not null default 'left'
    check (content_alignment in ('left','center')),
  projects_columns integer not null default 3
    check (projects_columns between 2 and 4),
  projects_per_page integer not null default 6
    check (projects_per_page between 1 and 24),
  show_project_filters boolean not null default true,
  show_project_technologies boolean not null default true,
  show_project_client boolean not null default true,
  show_project_date boolean not null default true,
  skills_layout text not null default 'cards'
    check (skills_layout in ('cards','bars','list')),
  group_skills_by_category boolean not null default true,
  show_footer_social_links boolean not null default true,
  show_back_to_top boolean not null default true,
  footer_text text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists portfolio_builder_settings_user_id_idx
  on public.portfolio_builder_settings(user_id);

alter table public.portfolio_builder_settings enable row level security;

drop policy if exists portfolio_builder_select_own
  on public.portfolio_builder_settings;
create policy portfolio_builder_select_own
  on public.portfolio_builder_settings
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists portfolio_builder_insert_own
  on public.portfolio_builder_settings;
create policy portfolio_builder_insert_own
  on public.portfolio_builder_settings
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists portfolio_builder_update_own
  on public.portfolio_builder_settings;
create policy portfolio_builder_update_own
  on public.portfolio_builder_settings
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists portfolio_builder_delete_own
  on public.portfolio_builder_settings;
create policy portfolio_builder_delete_own
  on public.portfolio_builder_settings
  for delete to authenticated
  using (user_id = auth.uid());

grant select, insert, update, delete
  on public.portfolio_builder_settings
  to authenticated;

create or replace function public.get_public_portfolio_builder(
  requested_owner_user_id uuid default null
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select jsonb_build_object(
        'preset', b.preset,
        'sections', b.sections,
        'hero_layout', b.hero_layout,
        'show_hero_avatar', b.show_hero_avatar,
        'show_resume_button', b.show_resume_button,
        'show_contact_button', b.show_contact_button,
        'show_social_links', b.show_social_links,
        'card_style', b.card_style,
        'button_style', b.button_style,
        'navbar_style', b.navbar_style,
        'container_width', b.container_width,
        'section_spacing', b.section_spacing,
        'content_alignment', b.content_alignment,
        'projects_columns', b.projects_columns,
        'projects_per_page', b.projects_per_page,
        'show_project_filters', b.show_project_filters,
        'show_project_technologies', b.show_project_technologies,
        'show_project_client', b.show_project_client,
        'show_project_date', b.show_project_date,
        'skills_layout', b.skills_layout,
        'group_skills_by_category', b.group_skills_by_category,
        'show_footer_social_links', b.show_footer_social_links,
        'show_back_to_top', b.show_back_to_top,
        'footer_text', b.footer_text,
        'updated_at', b.updated_at
      )
      from public.portfolio_builder_settings b
      where requested_owner_user_id is null
         or b.user_id = requested_owner_user_id
      order by
        case
          when requested_owner_user_id is not null
           and b.user_id = requested_owner_user_id then 0
          else 1
        end,
        b.updated_at desc
      limit 1
    ),
    jsonb_build_object(
      'preset', 'modern',
      'sections', '[
        {"id":"inicio","label":"Hero","enabled":true},
        {"id":"sobre","label":"Sobre","enabled":true},
        {"id":"trajetoria","label":"Experiências","enabled":true},
        {"id":"formacao","label":"Formação","enabled":true},
        {"id":"competencias","label":"Habilidades","enabled":true},
        {"id":"projetos","label":"Projetos","enabled":true},
        {"id":"curriculo","label":"Currículo","enabled":true},
        {"id":"contato","label":"Contato","enabled":true}
      ]'::jsonb,
      'hero_layout', 'split',
      'show_hero_avatar', true,
      'show_resume_button', true,
      'show_contact_button', true,
      'show_social_links', true,
      'card_style', 'rounded',
      'button_style', 'rounded',
      'navbar_style', 'blur',
      'container_width', 'wide',
      'section_spacing', 'comfortable',
      'content_alignment', 'left',
      'projects_columns', 3,
      'projects_per_page', 6,
      'show_project_filters', true,
      'show_project_technologies', true,
      'show_project_client', true,
      'show_project_date', true,
      'skills_layout', 'cards',
      'group_skills_by_category', true,
      'show_footer_social_links', true,
      'show_back_to_top', true,
      'footer_text', null
    )
  );
$$;

revoke all
  on function public.get_public_portfolio_builder(uuid)
  from public;

grant execute
  on function public.get_public_portfolio_builder(uuid)
  to anon, authenticated;

notify pgrst, 'reload schema';

commit;
