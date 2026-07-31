begin;

alter table public.portfolio_themes
  add column if not exists preset text not null default 'midnight',
  add column if not exists primary_hover_color text not null default '#60a5fa',
  add column if not exists card_color text not null default '#111827',
  add column if not exists border_color text not null default '#1e293b',
  add column if not exists title_color text not null default '#f8fafc',
  add column if not exists muted_color text not null default '#94a3b8',
  add column if not exists font_family text not null default 'Inter',
  add column if not exists shadow_style text not null default 'soft',
  add column if not exists motion_enabled boolean not null default true;

alter table public.portfolio_themes
  drop constraint if exists portfolio_themes_border_radius_check;

alter table public.portfolio_themes
  add constraint portfolio_themes_border_radius_check
  check (border_radius in ('square', 'rounded', 'pill', '1rem'));

alter table public.portfolio_themes
  drop constraint if exists portfolio_themes_shadow_style_check;

alter table public.portfolio_themes
  add constraint portfolio_themes_shadow_style_check
  check (shadow_style in ('none', 'soft', 'medium'));

alter table public.portfolio_themes enable row level security;

drop policy if exists portfolio_themes_owner_all on public.portfolio_themes;
create policy portfolio_themes_owner_all
on public.portfolio_themes
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

grant select, insert, update, delete on public.portfolio_themes to authenticated;

create or replace function public.get_public_portfolio_theme(
  requested_workspace_slug text default null,
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
        'preset', t.preset,
        'mode', t.mode,
        'primary_color', t.primary_color,
        'primary_hover_color', t.primary_hover_color,
        'secondary_color', t.secondary_color,
        'accent_color', t.accent_color,
        'background_color', t.background_color,
        'surface_color', t.surface_color,
        'card_color', t.card_color,
        'border_color', t.border_color,
        'title_color', t.title_color,
        'text_color', t.text_color,
        'muted_color', t.muted_color,
        'font_family', t.font_family,
        'border_radius', t.border_radius,
        'shadow_style', t.shadow_style,
        'motion_enabled', t.motion_enabled,
        'custom_css', t.custom_css,
        'settings', t.settings,
        'updated_at', t.updated_at
      )
      from public.portfolio_themes t
      left join public.profiles p on p.user_id = t.user_id
      where
        (requested_owner_user_id is null or t.user_id = requested_owner_user_id)
        and (
          requested_owner_user_id is not null
          or coalesce(p.is_public, true) = true
        )
      order by t.updated_at desc
      limit 1
    ),
    jsonb_build_object(
      'preset', 'midnight',
      'mode', 'dark',
      'primary_color', '#3b82f6',
      'primary_hover_color', '#60a5fa',
      'secondary_color', '#111111',
      'accent_color', '#f5d76e',
      'background_color', '#050816',
      'surface_color', '#0f172a',
      'card_color', '#111827',
      'border_color', '#1e293b',
      'title_color', '#f8fafc',
      'text_color', '#cbd5e1',
      'muted_color', '#94a3b8',
      'font_family', 'Inter',
      'border_radius', 'rounded',
      'shadow_style', 'soft',
      'motion_enabled', true
    )
  );
$$;

revoke all on function public.get_public_portfolio_theme(text, uuid) from public;
grant execute on function public.get_public_portfolio_theme(text, uuid) to anon, authenticated;

notify pgrst, 'reload schema';

commit;
