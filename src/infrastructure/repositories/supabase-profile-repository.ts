import type { TenantContext } from "../../core/context";
import type { DatabaseProvider, Row } from "../../core/database";
import { isRole } from "../../core/rbac";
import type {
  ProfileRecord,
  ProfileRepository,
} from "../../core/repositories";
import type { UserId } from "../../shared/types";

/**
 * Supabase/Postgres implementation of ProfileRepository.
 *
 * This is where SQL lives. It runs through the DatabaseProvider abstraction
 * (which targets the Supabase Postgres execution path via `nexara_exec_sql`),
 * so business services stay SQL-free and the repository contract stays
 * provider-independent. Swapping DatabaseProvider re-targets these queries
 * without touching services.
 */
export class SupabaseProfileRepository implements ProfileRepository {
  constructor(private readonly db: DatabaseProvider) {}

  async findByUser(tenant: TenantContext, userId: UserId): Promise<ProfileRecord | null> {
    const { rows } = await this.db.query<ProfileRow>(
      `select user_id, tenant_id, email, display_name, role, created_at
         from profiles
        where user_id = $1 and tenant_id = $2
        limit 1`,
      [userId, tenant.tenantId],
    );
    const row = rows[0];
    return row ? toProfileRecord(row) : null;
  }

  async updateDisplayName(
    tenant: TenantContext,
    userId: UserId,
    displayName: string | null,
  ): Promise<ProfileRecord | null> {
    const { rows } = await this.db.query<ProfileRow>(
      `update profiles
          set display_name = coalesce($3, display_name)
        where user_id = $1 and tenant_id = $2
      returning user_id, tenant_id, email, display_name, role, created_at`,
      [userId, tenant.tenantId, displayName],
    );
    const row = rows[0];
    return row ? toProfileRecord(row) : null;
  }
}

interface ProfileRow extends Row {
  user_id: string;
  tenant_id: string;
  email: string;
  display_name: string | null;
  role: string;
  created_at: string;
}

function toProfileRecord(row: ProfileRow): ProfileRecord {
  return {
    userId: row.user_id,
    tenantId: row.tenant_id,
    email: row.email,
    displayName: row.display_name,
    role: isRole(row.role) ? row.role : "member",
    createdAt: row.created_at,
  };
}
