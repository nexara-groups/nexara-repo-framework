import type { TenantContext } from "../../core/context";
import type { DatabaseProvider, Row } from "../../core/database";
import { isRole } from "../../core/rbac";
import type { UserRecord, UserRepository } from "../../core/repositories";
import type { UserId } from "../../shared/types";

/**
 * Supabase/Postgres implementation of UserRepository.
 *
 * The tenant-scoped user store is backed by the `profiles` table (identity
 * columns). SQL is confined to this file; services depend only on the
 * UserRepository interface.
 */
export class SupabaseUserRepository implements UserRepository {
  constructor(private readonly db: DatabaseProvider) {}

  async findById(tenant: TenantContext, userId: UserId): Promise<UserRecord | null> {
    const { rows } = await this.db.query<UserRow>(
      `select user_id, tenant_id, email, role, created_at
         from profiles
        where user_id = $1 and tenant_id = $2
        limit 1`,
      [userId, tenant.tenantId],
    );
    const row = rows[0];
    return row ? toUserRecord(row) : null;
  }

  async findByEmail(tenant: TenantContext, email: string): Promise<UserRecord | null> {
    const { rows } = await this.db.query<UserRow>(
      `select user_id, tenant_id, email, role, created_at
         from profiles
        where email = $1 and tenant_id = $2
        limit 1`,
      [email, tenant.tenantId],
    );
    const row = rows[0];
    return row ? toUserRecord(row) : null;
  }
}

interface UserRow extends Row {
  user_id: string;
  tenant_id: string;
  email: string;
  role: string;
  created_at: string;
}

function toUserRecord(row: UserRow): UserRecord {
  return {
    userId: row.user_id,
    tenantId: row.tenant_id,
    email: row.email,
    role: isRole(row.role) ? row.role : "member",
    createdAt: row.created_at,
  };
}
