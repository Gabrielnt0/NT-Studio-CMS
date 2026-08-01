-- NT Studio CMS 1.0 RC1 — canonical public portfolio API
-- This migration is the single source of truth for the public portfolio RPC.

begin;

create or replace function public.get_public_portfolio_content(
  requested_owner_user_id uuid default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  owner_id uuid;
begin
  -- A public profile is the master publication switch. When it is private,
  -- no projects, education, experiences, skills, SEO, theme or settings leak.
  select p.user_id
  into owner_id
  from public.profiles p
  where p.is_public = true
    and (
      requested_owner_user_id is null
      or p.user_id = requested_owner_user_id
    )
  order by p.updated_at desc
  limit 1;

  if owner_id is null then
    return jsonb_build_object(
      'profile', null,
      'projects', '[]'::jsonb,
      'education', '[]'::jsonb,
      'experiences', '[]'::jsonb,
      'skills', '[]'::jsonb,
      'seo', null,
      'theme', null,
      'settings', null,
      'meta', jsonb_build_object(
        'found', false,
        'generated_at', now()
      )
    );
  end if;

  return jsonb_build_object(
    'profile', (
      select to_jsonb(p) - 'user_id'
      from public.profiles p
      where p.user_id = owner_id
        and p.is_public = true
      limit 1
    ),
    'projects', coalesce((
      select jsonb_agg(
        (to_jsonb(pp) - 'user_id') || jsonb_build_object(
          'slides', coalesce((
            select jsonb_agg(
              to_jsonb(s) - 'user_id'
              order by s.sort_order, s.created_at
            )
            from public.portfolio_project_slides s
            where s.project_id = pp.id
          ), '[]'::jsonb)
        )
        order by pp.featured desc, pp.display_order, pp.updated_at desc
      )
      from public.portfolio_projects pp
      where pp.user_id = owner_id
        and pp.is_published = true
    ), '[]'::jsonb),
    'education', coalesce((
      select jsonb_agg(
        to_jsonb(e) - 'user_id'
        order by e.is_featured desc, e.display_order, e.start_date desc
      )
      from public.education e
      where e.user_id = owner_id
        and e.is_published = true
    ), '[]'::jsonb),
    'experiences', coalesce((
      select jsonb_agg(
        to_jsonb(e) - 'user_id'
        order by e.featured desc, e.is_current desc, e.start_date desc
      )
      from public.experiences e
      where e.user_id = owner_id
        and lower(coalesce(e.status, '')) in (
          'publicado', 'published', 'ativo', 'active'
        )
    ), '[]'::jsonb),
    'skills', coalesce((
      select jsonb_agg(
        to_jsonb(s) - 'user_id'
        order by s.is_featured desc, s.display_order, s.name
      )
      from public.skills s
      where s.user_id = owner_id
        and s.is_published = true
    ), '[]'::jsonb),
    'seo', (
      select to_jsonb(s) - 'user_id'
      from public.seo s
      where s.user_id = owner_id
      limit 1
    ),
    'theme', (
      select to_jsonb(t) - 'user_id'
      from public.portfolio_themes t
      where t.user_id = owner_id
      limit 1
    ),
    'settings', (
      select to_jsonb(s) - 'user_id'
      from public.portfolio_settings s
      where s.user_id = owner_id
      limit 1
    ),
    'meta', jsonb_build_object(
      'found', true,
      'generated_at', now()
    )
  );
end;
$$;

revoke all
  on function public.get_public_portfolio_content(uuid)
  from public;

grant execute
  on function public.get_public_portfolio_content(uuid)
  to anon, authenticated;

comment on function public.get_public_portfolio_content(uuid) is
  'Canonical public portfolio API. A private profile returns no public content.';

notify pgrst, 'reload schema';

commit;
