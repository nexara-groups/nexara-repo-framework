# domain/

Pure business model. **No** SQL, SDKs, framework, or provider code — only types and contracts. This layer must be importable anywhere and depend on nothing but `src/shared` and a few `src/core` *types* (context, rbac, events).

Put here:

- **Entities / records** — the module's data shapes (domain language, camelCase).
- **Repository interfaces (ports)** — what the application needs from storage, with no idea how it's stored. Every tenant-scoped method takes a `TenantContext`.
- **Domain events** — interfaces extending `DomainEvent`.

Example:

```ts
// domain/widget.ts
import type { TenantContext } from "../../../core/context";
import type { UserId } from "../../../shared/types";

export interface Widget {
  readonly id: string;
  readonly tenantId: string;
  readonly name: string;
  readonly createdBy: UserId;
  readonly createdAt: string;
}

// domain/widget-repository.ts  (the port)
export interface WidgetRepository {
  findById(tenant: TenantContext, id: string): Promise<Widget | null>;
  create(tenant: TenantContext, input: { name: string; createdBy: UserId }): Promise<Widget>;
}

// domain/widget-events.ts
import type { DomainEvent } from "../../../core/events";
export interface WidgetCreated extends DomainEvent {
  readonly type: "WidgetCreated";
  readonly widgetId: string;
}
```
