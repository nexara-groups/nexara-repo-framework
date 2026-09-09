-- Nexara Foundation D1 baseline. D1 uses SQLite-compatible TEXT identifiers
-- and timestamps; this stream is intentionally separate from PostgreSQL.

create table if not exists profiles (
  user_id      text not null,
  tenant_id    text not null,
  email        text not null,
  display_name text,
  role         text not null default 'member'
               check (role in ('owner', 'admin', 'manager', 'member')),
  created_at   text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  primary key (user_id, tenant_id)
);

create index if not exists profiles_tenant_idx on profiles (tenant_id);
