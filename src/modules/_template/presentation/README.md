# presentation/

Entry points that expose the module to the outside world: Next.js App Router route handlers, server actions, and (later) UI components. This layer translates HTTP/UI ↔ application services. It does no business logic and touches no SQL.

Route handlers live under `src/app/...` in Next.js, so a module's `presentation/` typically holds the handler logic that the thin `src/app/<route>/route.ts` re-exports, or the server actions/components the module owns.

Example handler:

```ts
// presentation/create-widget.handler.ts
import { NextResponse } from "next/server";
import { resolveRequestContext } from "../../../core/context";
import { bearerToken, getServices } from "../../../app/_services";
import { WidgetService } from "../application/widget.service";

export async function createWidget(request: Request) {
  const { auth, permissions, events, repositories } = getServices();
  const ctx = await resolveRequestContext(bearerToken(request), auth);

  // `repositories.widgets` is added in the DI container when the module is wired.
  const service = new WidgetService(repositories.widgets, permissions, events);

  const body = (await request.json()) as { name?: string };
  const result = await service.create(ctx, body.name ?? "");

  return result.ok
    ? NextResponse.json(result.value, { status: 201 })
    : NextResponse.json({ error: result.error.message, code: result.error.code }, { status: 400 });
}
```

Keep handlers thin: resolve context → build service → call use case → map `Result` to a response.
