-- Optional D1 JWT credentials capability. All account rows are tenant-scoped.

create table if not exists credentials (
  user_id text not null,
  tenant_id text not null,
  email text not null,
  password_hash text not null,
  role text not null check (role in ('owner', 'admin', 'manager', 'member')),
  session_version integer not null default 0,
  verified_at text,
  primary key (tenant_id, user_id),
  unique (tenant_id, email)
);

create table if not exists password_reset_tokens (
  token_hash text primary key,
  tenant_id text not null,
  user_id text not null,
  email text not null,
  expires_at text not null,
  used_at text,
  redemption_id text
);

create table if not exists email_verification_tokens (
  token_hash text primary key,
  tenant_id text not null,
  user_id text not null,
  email text not null,
  expires_at text not null,
  used_at text,
  redemption_id text
);
