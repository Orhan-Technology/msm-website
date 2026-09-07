import "server-only";
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@/db/schema";

function resolveDbFilePath() {
  const url = process.env.SQLITE_URL;
  if (url?.startsWith("file:")) return url.slice("file:".length);
  return path.join(process.cwd(), "data", "msm-cms.db");
}

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _migrated = false;

/**
 * Lazily open the SQLite file, running the idempotent schema migration once per
 * process. No separate migrate step is needed — `next dev` / `next start` boot
 * straight into a working database.
 */
export function getDb() {
  if (_db) return _db;
  if (!_migrated) {
    runMigrations();
    _migrated = true;
  }
  const filePath = resolveDbFilePath();
  const sqlite = new Database(filePath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  _db = drizzle(sqlite, { schema });
  return _db;
}

function columnsOf(sqlite: Database.Database, table: string): string[] {
  const rows = sqlite.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  return rows.map((row) => row.name);
}

function tableExists(sqlite: Database.Database, table: string) {
  const row = sqlite
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(table);
  return Boolean(row);
}

function addColumnIfMissing(sqlite: Database.Database, table: string, column: string, definition: string) {
  if (columnsOf(sqlite, table).includes(column)) return;
  sqlite.exec(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${definition}`);
}

/**
 * `content_documents` was originally keyed by entity_key alone. Rebuild it with
 * a (entity_key, locale) key, filing everything that already exists as English.
 */
function migrateContentDocumentsToLocales(sqlite: Database.Database) {
  if (!tableExists(sqlite, "content_documents")) return;
  if (columnsOf(sqlite, "content_documents").includes("locale")) return;

  sqlite.exec(`
    ALTER TABLE content_documents RENAME TO content_documents_legacy;
    CREATE TABLE content_documents (
      entity_key text NOT NULL,
      locale text NOT NULL DEFAULT 'en',
      payload_json text NOT NULL,
      published integer NOT NULL DEFAULT 1,
      updated_at integer NOT NULL,
      PRIMARY KEY (entity_key, locale)
    );
    INSERT INTO content_documents (entity_key, locale, payload_json, published, updated_at)
      SELECT entity_key, 'en', payload_json, published, updated_at FROM content_documents_legacy;
    DROP TABLE content_documents_legacy;
  `);
}

/**
 * Events used to carry their words inline. Move the text into
 * `event_translations` as English and rebuild `events` with the shared facts only.
 */
function migrateEventsToTranslations(sqlite: Database.Database) {
  if (!tableExists(sqlite, "events")) return;
  const columns = columnsOf(sqlite, "events");
  if (!columns.includes("title")) return;

  const hasCategory = columns.includes("category");
  const hasCtaLabel = columns.includes("cta_label");

  sqlite.exec(`
    INSERT OR IGNORE INTO event_translations (event_id, locale, title, category, location, summary, body, cta_label)
      SELECT id, 'en', title,
             ${hasCategory ? "COALESCE(category, '')" : "''"},
             COALESCE(location, ''), COALESCE(summary, ''), COALESCE(body, ''),
             ${hasCtaLabel ? "COALESCE(cta_label, '')" : "''"}
      FROM events;

    ALTER TABLE events RENAME TO events_legacy;
    CREATE TABLE events (
      id text PRIMARY KEY NOT NULL,
      slug text NOT NULL,
      start_date text NOT NULL DEFAULT '',
      end_date text NOT NULL DEFAULT '',
      image_path text NOT NULL DEFAULT '',
      video_path text NOT NULL DEFAULT '',
      gallery_json text NOT NULL DEFAULT '[]',
      cta_href text NOT NULL DEFAULT '',
      featured integer NOT NULL DEFAULT 0,
      published integer NOT NULL DEFAULT 1,
      sort_order integer NOT NULL DEFAULT 0,
      created_at integer NOT NULL,
      updated_at integer NOT NULL
    );
    INSERT INTO events (id, slug, start_date, end_date, image_path, video_path, gallery_json, cta_href, featured, published, sort_order, created_at, updated_at)
      SELECT id, slug, COALESCE(start_date, ''), COALESCE(end_date, ''), COALESCE(image_path, ''),
             COALESCE(video_path, ''), COALESCE(gallery_json, '[]'), COALESCE(cta_href, ''),
             featured, published, sort_order, created_at, updated_at
      FROM events_legacy;
    DROP TABLE events_legacy;
    CREATE UNIQUE INDEX IF NOT EXISTS events_slug_idx ON events(slug);
  `);
}

export function runMigrations() {
  const filePath = resolveDbFilePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const sqlite = new Database(filePath);
  // Foreign keys stay off during the rebuilds below, then go back on.
  sqlite.pragma("foreign_keys = OFF");

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS \`assets\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`public_path\` text NOT NULL,
      \`file_name\` text NOT NULL,
      \`mime_type\` text NOT NULL,
      \`byte_size\` integer NOT NULL,
      \`alt\` text NOT NULL DEFAULT '',
      \`created_at\` integer NOT NULL
    );
    CREATE TABLE IF NOT EXISTS \`content_documents\` (
      \`entity_key\` text NOT NULL,
      \`locale\` text NOT NULL DEFAULT 'en',
      \`payload_json\` text NOT NULL,
      \`published\` integer NOT NULL DEFAULT 1,
      \`updated_at\` integer NOT NULL,
      PRIMARY KEY (\`entity_key\`, \`locale\`)
    );
    CREATE TABLE IF NOT EXISTS \`events\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`slug\` text NOT NULL,
      \`start_date\` text NOT NULL DEFAULT '',
      \`end_date\` text NOT NULL DEFAULT '',
      \`image_path\` text NOT NULL DEFAULT '',
      \`video_path\` text NOT NULL DEFAULT '',
      \`gallery_json\` text NOT NULL DEFAULT '[]',
      \`cta_href\` text NOT NULL DEFAULT '',
      \`featured\` integer NOT NULL DEFAULT 0,
      \`published\` integer NOT NULL DEFAULT 1,
      \`sort_order\` integer NOT NULL DEFAULT 0,
      \`created_at\` integer NOT NULL,
      \`updated_at\` integer NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS events_slug_idx ON events(slug);
    CREATE TABLE IF NOT EXISTS \`event_translations\` (
      \`event_id\` text NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      \`locale\` text NOT NULL,
      \`title\` text NOT NULL DEFAULT '',
      \`category\` text NOT NULL DEFAULT '',
      \`location\` text NOT NULL DEFAULT '',
      \`summary\` text NOT NULL DEFAULT '',
      \`body\` text NOT NULL DEFAULT '',
      \`cta_label\` text NOT NULL DEFAULT '',
      PRIMARY KEY (\`event_id\`, \`locale\`)
    );
    CREATE TABLE IF NOT EXISTS \`site_settings\` (
      \`key\` text PRIMARY KEY NOT NULL,
      \`value_json\` text NOT NULL,
      \`updated_at\` integer NOT NULL
    );
    CREATE TABLE IF NOT EXISTS \`contact_messages\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`kind\` text NOT NULL DEFAULT 'contact',
      \`name\` text NOT NULL DEFAULT '',
      \`email\` text NOT NULL DEFAULT '',
      \`phone\` text NOT NULL DEFAULT '',
      \`company\` text NOT NULL DEFAULT '',
      \`subject\` text NOT NULL DEFAULT '',
      \`message\` text NOT NULL DEFAULT '',
      \`locale\` text NOT NULL DEFAULT 'en',
      \`read\` integer NOT NULL DEFAULT 0,
      \`created_at\` integer NOT NULL
    );
    CREATE INDEX IF NOT EXISTS contact_messages_created_idx ON contact_messages(created_at DESC);
  `);

  // Upgrades for databases created before localisation.
  addColumnIfMissing(sqlite, "assets", "alt", "text NOT NULL DEFAULT ''");
  addColumnIfMissing(sqlite, "contact_messages", "locale", "text NOT NULL DEFAULT 'en'");
  migrateContentDocumentsToLocales(sqlite);
  migrateEventsToTranslations(sqlite);

  sqlite.pragma("foreign_keys = ON");
  sqlite.close();
}
