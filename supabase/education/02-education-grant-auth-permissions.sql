-- Query Name: Education - Grant Auth Permissions
grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.education to authenticated;
