import { readFileSync } from "node:fs";
import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";

const migrationFiles = [
  new URL("../../db/migrations/d1/0001_profiles.sql", import.meta.url),
  new URL("../../db/migrations/d1/0002_credentials.sql", import.meta.url),
];

describe("D1 migrations", () => {
  it("creates tenant-scoped profile and credential tables in SQLite", async () => {
    const SQL = await initSqlJs();
    const db = new SQL.Database();
    for (const file of migrationFiles) db.run(readFileSync(file, "utf8"));

    db.run("insert into profiles (user_id, tenant_id, email) values ('user_1', 'tenant_1', 'member@example.test')");
    db.run("insert into credentials (user_id, tenant_id, email, password_hash, role) values ('user_1', 'tenant_1', 'member@example.test', 'hash', 'member')");

    expect(db.exec("select user_id, tenant_id, role from profiles")[0]?.values).toEqual([
      ["user_1", "tenant_1", "member"],
    ]);
    expect(db.exec("select user_id, tenant_id, role from credentials")[0]?.values).toEqual([
      ["user_1", "tenant_1", "member"],
    ]);
    db.close();
  });
});
