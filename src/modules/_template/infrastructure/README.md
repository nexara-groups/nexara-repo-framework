# infrastructure/

Concrete adapters that satisfy the domain's ports. This is the **only** place SQL appears in a module. Repositories run their SQL through the injected `DatabaseProvider`, so they stay portable across Supabase / Neon / D1.

**Tenant safety:** every statement must filter by `tenant_id`, and every method takes a `TenantContext`. Never run a tenant query without the tenant predicate.

Example:

```ts
// infrastructure/sql-widget-repository.ts
import type { TenantContext } from "../../../core/context";
import type { DatabaseProvider, Row } from "../../../core/database";
import type { Widget } from "../domain/widget";
import type { WidgetRepository } from "../domain/widget-repository";
import type { UserId } from "../../../shared/types";

export class SqlWidgetRepository implements WidgetRepository {
  constructor(private readonly db: DatabaseProvider) {}

  async findById(tenant: TenantContext, id: string): Promise<Widget | null> {
    const { rows } = await this.db.query<WidgetRow>(
      `select id, tenant_id, name, created_by, created_at
         from widgets
        where id = $1 and tenant_id = $2
        limit 1`,
      [id, tenant.tenantId],
    );
    const row = rows[0];
    return row ? toWidget(row) : null;
  }

  async create(tenant: TenantContext, input: { name: string; createdBy: UserId }): Promise<Widget> {
    const { rows } = await this.db.query<WidgetRow>(
      `insert into widgets (tenant_id, name, created_by)
            values ($1, $2, $3)
         returning id, tenant_id, name, created_by, created_at`,
      [tenant.tenantId, input.name, input.createdBy],
    );
    return toWidget(rows[0]!);
  }
}

interface WidgetRow extends Row {
  id: string; tenant_id: string; name: string; created_by: string; created_at: string;
}
function toWidget(r: WidgetRow): Widget {
  return { id: r.id, tenantId: r.tenant_id, name: r.name, createdBy: r.created_by, createdAt: r.created_at };
}
```

Also belongs here: event handlers (subscribers) and any other adapter implementations. Wire the repository into `src/core/container.ts`.
