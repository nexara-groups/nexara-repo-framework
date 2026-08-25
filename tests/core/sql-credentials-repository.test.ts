import { describe, expect, it } from "vitest";
import { SqlCredentialsRepository } from "../../src/infrastructure/repositories/sql-credentials-repository";
import { createTenantContext } from "../../src/core/context";
import type { AtomicBatchDatabaseProvider, BatchQuery, QueryResult, Row, Transaction } from "../../src/core/database";

class CapturingBatchDatabase implements AtomicBatchDatabaseProvider {
  readonly name = "capturing";
  queries: readonly BatchQuery[] = [];

  async query<T extends Row = Row>(): Promise<QueryResult<T>> { return { rows: [], rowCount: 0 }; }
  async transaction<T>(_work: (tx: Transaction) => Promise<T>): Promise<T> { throw new Error("not used"); }
  async dispose(): Promise<void> {}
  async batch(queries: readonly BatchQuery[]): Promise<readonly QueryResult[]> {
    this.queries = queries;
    return [{ rows: [], rowCount: 1 }, { rows: [], rowCount: 1 }];
  }
}

describe("SqlCredentialsRepository", () => {
  it("fences the password update with the unique reset-token claim", async () => {
    const db = new CapturingBatchDatabase();
    const repository = new SqlCredentialsRepository(db);

    await expect(repository.redeemPasswordReset(
      createTenantContext("tenant_1"),
      "token-hash",
      "member_1",
      "new-password-hash",
    )).resolves.toBe(true);

    expect(db.queries[0]?.params).toHaveLength(4);
    expect(db.queries[1]?.params).toHaveLength(5);
    expect(db.queries[1]?.params?.[4]).toBe(db.queries[0]?.params?.[3]);
  });
});
