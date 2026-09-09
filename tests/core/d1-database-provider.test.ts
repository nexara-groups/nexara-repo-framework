import { describe, expect, it } from "vitest";
import { D1DatabaseProvider } from "../../src/core/database/providers/d1-database-provider";

interface PreparedStatement {
  readonly sql: string;
  readonly values: readonly unknown[];
  bind(...values: unknown[]): PreparedStatement;
  all<T = Record<string, unknown>>(): Promise<{ results: T[]; success: boolean; meta?: { changes?: number } }>;
}

describe("D1DatabaseProvider", () => {
  it("translates positional placeholders and preserves atomic batch results", async () => {
    const prepared: PreparedStatement[] = [];
    const binding = {
      prepare(sql: string) {
        return {
          bind(...values: unknown[]): PreparedStatement {
            const statement: PreparedStatement = {
              sql,
              values,
              bind() {
                return statement;
              },
              async all() {
                return { results: [], success: true, meta: { changes: 1 } };
              },
            };
            prepared.push(statement);
            return statement;
          },
          async all() {
            return { results: [], success: true };
          },
        };
      },
      async batch(statements: readonly PreparedStatement[]) {
        expect(statements).toEqual(prepared);
        return [
          { results: [{ id: "member_1" }], success: true, meta: { changes: 1 } },
          { results: [], success: true, meta: { changes: 2 } },
        ];
      },
    };
    const provider = new D1DatabaseProvider({ db: binding });

    const result = await provider.batch([
      { sql: "update credentials set role = $1 where tenant_id = $2", params: ["admin", "tenant_1"] },
      { sql: "delete from sessions where tenant_id = $1 and user_id = $2", params: ["tenant_1", "member_1"] },
    ]);

    expect(prepared.map(({ sql, values }) => ({ sql, values }))).toEqual([
      { sql: "update credentials set role = ?1 where tenant_id = ?2", values: ["admin", "tenant_1"] },
      { sql: "delete from sessions where tenant_id = ?1 and user_id = ?2", values: ["tenant_1", "member_1"] },
    ]);
    expect(result).toEqual([
      { rows: [{ id: "member_1" }], rowCount: 1 },
      { rows: [], rowCount: 2 },
    ]);
  });

  it("rejects callback transactions instead of claiming D1 atomicity it cannot provide", async () => {
    const provider = new D1DatabaseProvider({
      db: {
        prepare() { throw new Error("not reached"); },
        async batch() { return []; },
      },
    });

    await expect(provider.transaction(async () => "unused"))
      .rejects.toMatchObject({ code: "DATABASE" });
  });
});
