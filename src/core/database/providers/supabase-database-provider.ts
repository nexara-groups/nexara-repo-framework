import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../../../shared/errors";
import type {
  DatabaseProvider,
  QueryResult,
  Row,
  Transaction,
} from "../database-provider.interface";

export interface SupabaseDatabaseConfig {
  url: string;
  /** Service-role key — server-side only. Never expose to the client. */
  serviceRoleKey: string;
}

/**
 * SupabaseDatabaseProvider — the ONLY place the Supabase SDK is imported for
 * data access. Raw parameterized SQL is executed through a Postgres function
 * (`nexara_exec_sql`) so the rest of the system speaks plain SQL and stays
 * portable to Neon / D1.
 *
 * Required DB-side function (see README → Database migration notes):
 *
 *   create or replace function nexara_exec_sql(statement text, params jsonb)
 *   returns setof jsonb language plpgsql security definer as $$
 *   ...executes statement with params, returns rows as jsonb...
 *   $$;
 *
 * For a single atomic multi-statement unit, wrap the logic in its own
 * security-definer Postgres function and call it via `query`.
 */
export class SupabaseDatabaseProvider implements DatabaseProvider {
  readonly name = "supabase";

  private readonly client: SupabaseClient;

  constructor(config: SupabaseDatabaseConfig) {
    this.client = createClient(config.url, config.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async query<T extends Row = Row>(
    sql: string,
    params: readonly unknown[] = [],
  ): Promise<QueryResult<T>> {
    const { data, error } = await this.client.rpc("nexara_exec_sql", {
      statement: sql,
      params: params as unknown[],
    });

    if (error) {
      throw AppError.database(`Supabase query failed: ${error.message}`, error);
    }

    const rows = (data ?? []) as T[];
    return { rows, rowCount: rows.length };
  }

  /**
   * PostgREST does not support interactive (multi-round-trip) transactions.
   * The callback runs against the same connection-pooled provider; for true
   * atomicity push the unit of work into a single `nexara_exec_sql` call or a
   * dedicated Postgres function. This keeps the interface uniform while being
   * explicit about Supabase's constraint.
   */
  async transaction<T>(work: (tx: Transaction) => Promise<T>): Promise<T> {
    return work(this);
  }

  async dispose(): Promise<void> {
    // supabase-js (HTTP/PostgREST) holds no long-lived pool to close.
  }
}
