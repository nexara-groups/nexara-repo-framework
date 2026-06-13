-- Nexara Foundation — minimal schema for the sample feature.
-- Multi-tenant from the start: every row carries tenant_id.

create table if not exists profiles (
  user_id      uuid        not null,
  tenant_id    uuid        not null,
  email        text        not null,
  display_name text,
  role         text        not null default 'member'
                 check (role in ('owner', 'admin', 'manager', 'member')),
  created_at   timestamptz not null default now(),
  primary key (user_id, tenant_id)
);

create index if not exists profiles_tenant_idx on profiles (tenant_id);

-- ---------------------------------------------------------------------------
-- Raw-SQL bridge used by SupabaseDatabaseProvider.
-- Lets the provider run parameterized SQL while the rest of the system stays
-- portable. Params are passed as a JSON array and bound positionally.
-- SECURITY: security definer — review and lock down before production use.
-- ---------------------------------------------------------------------------
create or replace function nexara_exec_sql(statement text, params jsonb default '[]'::jsonb)
returns setof jsonb
language plpgsql
security definer
as $$
declare
  rec record;
begin
  -- NOTE: For production, prefer dedicated typed RPC functions per query and
  -- restrict execute permission to the service role. This generic bridge is a
  -- foundation convenience to keep business code speaking plain SQL.
  for rec in execute statement using variadic (
    select array_agg(value) from jsonb_array_elements(params)
  )
  loop
    return next to_jsonb(rec);
  end loop;
end;
$$;
