/**
 * One-off migration off the SQLite + local-disk setup.
 *
 *   1. uploads everything in public/uploads to Vercel Blob
 *   2. copies the rows exported from data/msm-cms.db into Neon Postgres,
 *      rewriting every "/api/uploads/<file>" reference to its Blob URL
 *
 * Run the export first (it needs no database):
 *   python -c "...".  See cms-export.json in the repo root.
 *
 * Then:
 *   pnpm exec dotenv -e .env.local -- node scripts/migrate-to-vercel.mjs --blobs-only
 *   pnpm exec dotenv -e .env.local -- node scripts/migrate-to-vercel.mjs
 *
 * It is safe to re-run: blobs overwrite by pathname and rows are upserted.
 */
import { readFile, readdir, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { statSync } from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";

const ROOT = path.resolve(import.meta.dirname, "..");
const UPLOAD_DIR = path.join(ROOT, "public", "uploads");
const EXPORT_FILE = path.join(ROOT, "cms-export.json");
const BLOB_MAP_FILE = path.join(ROOT, "blob-map.json");

const MIME_BY_EXT = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp",
  svg: "image/svg+xml", gif: "image/gif", avif: "image/avif",
  mp4: "video/mp4", m4v: "video/mp4", webm: "video/webm", ogv: "video/ogg",
  ogg: "video/ogg", mov: "video/quicktime", pdf: "application/pdf",
};

const blobsOnly = process.argv.includes("--blobs-only");

async function uploadBlobs() {
  let names = [];
  try {
    names = await readdir(UPLOAD_DIR);
  } catch {
    console.log("no public/uploads directory — nothing to upload");
    return {};
  }

  const map = {};
  for (const name of names) {
    const file = path.join(UPLOAD_DIR, name);
    if (!statSync(file).isFile()) continue;
    const ext = path.extname(name).slice(1).toLowerCase();
    const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";
    const size = statSync(file).size;

    process.stdout.write(`  ${name} (${(size / 1024 / 1024).toFixed(1)} MB) … `);
    const blob = await put(`uploads/${name}`, createReadStream(file), {
      access: "public",
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    map[name] = blob.url;
    console.log("ok");
  }

  await writeFile(BLOB_MAP_FILE, JSON.stringify(map, null, 1) + "\n", "utf8");
  console.log(`wrote ${path.basename(BLOB_MAP_FILE)} (${Object.keys(map).length} files)`);
  return map;
}

/** "/api/uploads/x.jpg" and "/uploads/x.jpg" both become the Blob URL. */
function rewritePaths(value, map) {
  if (typeof value !== "string") return value;
  let out = value;
  for (const [name, url] of Object.entries(map)) {
    out = out.split(`/api/uploads/${name}`).join(url).split(`/uploads/${name}`).join(url);
  }
  return out;
}

async function copyRows(map) {
  const sql = neon(process.env.DATABASE_URL);
  const data = JSON.parse(await readFile(EXPORT_FILE, "utf8"));
  const r = (v) => rewritePaths(v, map);

  for (const row of data.assets ?? []) {
    const name = path.basename(row.public_path);
    await sql`
      INSERT INTO assets (id, public_path, file_name, mime_type, byte_size, alt, created_at)
      VALUES (${row.id}, ${map[name] ?? row.public_path}, ${row.file_name}, ${row.mime_type},
              ${row.byte_size}, ${row.alt ?? ""}, ${row.created_at})
      ON CONFLICT (id) DO UPDATE SET public_path = EXCLUDED.public_path, alt = EXCLUDED.alt`;
  }
  console.log(`assets              ${(data.assets ?? []).length}`);

  for (const row of data.content_documents ?? []) {
    await sql`
      INSERT INTO content_documents (entity_key, locale, payload_json, published, updated_at)
      VALUES (${row.entity_key}, ${row.locale ?? "en"}, ${r(row.payload_json)},
              ${row.published ?? 1}, ${row.updated_at})
      ON CONFLICT (entity_key, locale) DO UPDATE
        SET payload_json = EXCLUDED.payload_json, updated_at = EXCLUDED.updated_at`;
  }
  console.log(`content_documents   ${(data.content_documents ?? []).length}`);

  for (const row of data.events ?? []) {
    await sql`
      INSERT INTO events (id, slug, start_date, end_date, image_path, video_path, gallery_json,
                          cta_href, featured, published, sort_order, created_at, updated_at)
      VALUES (${row.id}, ${row.slug}, ${row.start_date ?? ""}, ${row.end_date ?? ""},
              ${r(row.image_path ?? "")}, ${r(row.video_path ?? "")}, ${r(row.gallery_json ?? "[]")},
              ${row.cta_href ?? ""}, ${row.featured ?? 0}, ${row.published ?? 1},
              ${row.sort_order ?? 0}, ${row.created_at}, ${row.updated_at})
      ON CONFLICT (id) DO UPDATE
        SET slug = EXCLUDED.slug, image_path = EXCLUDED.image_path,
            video_path = EXCLUDED.video_path, gallery_json = EXCLUDED.gallery_json`;
  }
  console.log(`events              ${(data.events ?? []).length}`);

  for (const row of data.event_translations ?? []) {
    await sql`
      INSERT INTO event_translations (event_id, locale, title, category, location, summary, body, cta_label)
      VALUES (${row.event_id}, ${row.locale}, ${row.title ?? ""}, ${row.category ?? ""},
              ${row.location ?? ""}, ${r(row.summary ?? "")}, ${r(row.body ?? "")}, ${row.cta_label ?? ""})
      ON CONFLICT (event_id, locale) DO UPDATE
        SET title = EXCLUDED.title, summary = EXCLUDED.summary, body = EXCLUDED.body`;
  }
  console.log(`event_translations  ${(data.event_translations ?? []).length}`);

  for (const row of data.site_settings ?? []) {
    await sql`
      INSERT INTO site_settings (key, value_json, updated_at)
      VALUES (${row.key}, ${r(row.value_json)}, ${row.updated_at})
      ON CONFLICT (key) DO UPDATE SET value_json = EXCLUDED.value_json`;
  }
  console.log(`site_settings       ${(data.site_settings ?? []).length}`);

  for (const row of data.contact_messages ?? []) {
    await sql`
      INSERT INTO contact_messages (id, kind, name, email, phone, company, subject, message, locale, read, created_at)
      VALUES (${row.id}, ${row.kind ?? "contact"}, ${row.name ?? ""}, ${row.email ?? ""},
              ${row.phone ?? ""}, ${row.company ?? ""}, ${row.subject ?? ""}, ${row.message ?? ""},
              ${row.locale ?? "en"}, ${row.read ?? 0}, ${row.created_at})
      ON CONFLICT (id) DO NOTHING`;
  }
  console.log(`contact_messages    ${(data.contact_messages ?? []).length}`);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN is not set — run through `dotenv -e .env.local --`.");
  process.exit(1);
}

console.log("uploading media to Vercel Blob:");
const map = await uploadBlobs();

if (blobsOnly) {
  console.log("\n--blobs-only: stopping before the database copy.");
} else {
  if (!process.env.DATABASE_URL) {
    console.error("\nDATABASE_URL is not set — provision Neon, then re-run without --blobs-only.");
    process.exit(1);
  }
  console.log("\ncopying rows into Postgres:");
  await copyRows(map);
  console.log("\ndone.");
}
