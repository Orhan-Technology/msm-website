import "server-only";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@/db/schema";

/**
 * Plain Postgres over TCP — the database Dokploy runs next to the site on the
 * Hetzner server. The schema itself is managed by drizzle-kit (`pnpm db:push`)
 * rather than migrated at boot.
 */
function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Point it at the Postgres database (see .env.example).",
    );
  }
  return drizzle(postgres(url, { max: 10 }), { schema });
}

// Built lazily so `next build` does not need a database to render a route that
// never reads one. Deliberately a plain function, not a Proxy — a Proxy breaks
// libraries that introspect the client object.
let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}
