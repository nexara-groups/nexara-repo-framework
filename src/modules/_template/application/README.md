# application/

Use-case services that orchestrate the domain. This is where business rules live. Services depend on **interfaces only** — repository ports, `PermissionService`, `EventBus` — never on SQL, `DatabaseProvider`, or any SDK.

Each method receives a `RequestContext` (resolved at the edge) so identity and tenant are already known. Authorize with RBAC, do the work through the repository, optionally publish an event, return a `Result`.

Example:

```ts
// application/widget.service.ts
import { isAuthenticated, type RequestContext } from "../../../core/context";
import type { EventBus } from "../../../core/events";
import type { PermissionService } from "../../../core/rbac";
import { AppError, err, ok, type Result } from "../../../shared";
import type { Widget } from "../domain/widget";
import type { WidgetRepository } from "../domain/widget-repository";

export class WidgetService {
  constructor(
    private readonly widgets: WidgetRepository,
    private readonly permissions: PermissionService,
    private readonly events: EventBus,
  ) {}

  async create(ctx: RequestContext, name: string): Promise<Result<Widget>> {
    if (!isAuthenticated(ctx)) return err(AppError.unauthenticated());
    if (!this.permissions.canInTenant(ctx.user, "task:create", ctx.tenant.tenantId)) {
      return err(AppError.forbidden());
    }

    const widget = await this.widgets.create(ctx.tenant, { name, createdBy: ctx.user.userId });

    await this.events.publish({
      type: "WidgetCreated",
      occurredAt: Date.now(),
      tenantId: ctx.tenant.tenantId,
      widgetId: widget.id,
    });

    return ok(widget);
  }
}
```

Notes: no `import` of `@supabase/*`, no `.query(...)`, no raw SQL. The guard will fail the build if any of those appear here.
