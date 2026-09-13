import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

/**
 * Neon Postgres over HTTP. The schema itself is managed by drizzle-kit
 * (`pnpm db:push`) rather than migrated at boot: a serverless function has no
 * single startup to hang that off, and every invocation would otherwise pay for it.
 */
function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Provision Neon for this project (`vercel integration add neon`) " +
        "and run `vercel env pull .env.local`.",
    );
  }
  return drizzle(neon(url), { schema });
}

// Built lazily so `next build` does not need a database to render a route that
// never reads one. Deliberately a plain function, not a Proxy — a Proxy breaks
// libraries that introspect the client object.
let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}
