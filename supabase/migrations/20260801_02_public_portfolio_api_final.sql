begin;

-- NT Studio CMS 1.0 RC1
-- Final canonical public API.
-- Privacy rule: no public profile means no public portfolio data.

create or replace function public.get_public_portfolio_content(
  requested_owner_user_id uuid default null
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with owner as (
    select p.user_id
    from public.profiles p
    where p.is_public = true
      and (
        requested_owner_user_id is null
        or p.user_id = requested_owner_user_id
      )
    order by p.updated_at desc
    limit 1
  )
  select jsonb_build_object(
    'profile',
    (
      select to_jsonb(p) - 'user_id'
      from public.profiles p
      join owner o on o.user_id = p.user_id
      limit 1
    ),
    'projects',
    coalesce(
      (
        select jsonb_agg(
          (to_jsonb(p) - 'user_id')
          || jsonb_build_object(
            'slides',
            coalesce(
              (
                select jsonb_agg(
                  to_jsonb(s) - 'user_id' - 'storage_path'
                  order by s.sort_order, s.created_at
                )
                from public.portfolio_project_slides s
                where s.project_id = p.id
                  and s.user_id = p.user_id
              ),
              '[]'::jsonb
            )
          )
          order by p.featured desc, p.display_order, p.updated_at desc
        )
        from public.portfolio_projects p
        join owner o on o.user_id = p.user_id
        where p.is_published = true
      ),
      '[]'::jsonb
    ),
    'education',
    coalesce(
      (
        select jsonb_agg(
          to_jsonb(e) - 'user_id'
          order by e.is_featured desc, e.display_order, e.start_date desc
        )
        from public.education e
        join owner o on o.user_id = e.user_id
        where e.is_published = true
      ),
      '[]'::jsonb
    ),
    'experiences',
    coalesce(
      (
        select jsonb_agg(
          to_jsonb(e) - 'user_id'
          order by e.featured desc, e.is_current desc, e.start_date desc
        )
        from public.experiences e
        join owner o on o.user_id = e.user_id
        where lower(coalesce(e.status, '')) in
          ('publicado', 'published', 'ativo', 'active')
      ),
      '[]'::jsonb
    ),
    'skills',
    coalesce(
      (
        select jsonb_agg(
          to_jsonb(s) - 'user_id'
          order by s.is_featured desc, s.display_order, s.name
        )
        from public.skills s
        join owner o on o.user_id = s.user_id
        where s.is_published = true
      ),
      '[]'::jsonb
    ),
    'seo',
    (
      select to_jsonb(s) - 'user_id'
      from public.seo s
      join owner o on o.user_id = s.user_id
      limit 1
    ),
    'settings',
    (
      select jsonb_build_object(
        'google_analytics_enabled', s.google_analytics_enabled,
        'google_analytics_measurement_id', s.google_analytics_measurement_id,
        'updated_at', s.updated_at
      )
      from public.portfolio_settings s
      join owner o on o.user_id = s.user_id
      limit 1
    ),
    'theme',
    (
      select to_jsonb(t) - 'user_id'
      from public.portfolio_themes t
      join owner o on o.user_id = t.user_id
      limit 1
    ),
    'builder',
    (
      select to_jsonb(b) - 'user_id'
      from public.portfolio_builder_settings b
      join owner o on o.user_id = b.user_id
      limit 1
    ),
    'meta',
    jsonb_build_object(
      'found', exists(select 1 from owner),
      'generated_at', now()
    )
  );
$$;

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
  with owner as (
    select p.user_id
    from public.profiles p
    where p.is_public = true
      and (
        requested_owner_user_id is null
        or p.user_id = requested_owner_user_id
      )
    order by p.updated_at desc
    limit 1
  )
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
      join owner o on o.user_id = t.user_id
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

create or replace function public.get_public_portfolio_builder(
  requested_owner_user_id uuid default null
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with owner as (
    select p.user_id
    from public.profiles p
    where p.is_public = true
      and (
        requested_owner_user_id is null
        or p.user_id = requested_owner_user_id
      )
    order by p.updated_at desc
    limit 1
  )
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
      join owner o on o.user_id = b.user_id
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

revoke all on function public.get_public_portfolio_content(uuid) from public;
revoke all on function public.get_public_portfolio_theme(text, uuid) from public;
revoke all on function public.get_public_portfolio_builder(uuid) from public;

grant execute on function public.get_public_portfolio_content(uuid)
  to anon, authenticated;
grant execute on function public.get_public_portfolio_theme(text, uuid)
  to anon, authenticated;
grant execute on function public.get_public_portfolio_builder(uuid)
  to anon, authenticated;

notify pgrst, 'reload schema';

commit;
