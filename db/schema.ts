import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Uploaded media (images, videos, PDFs). Files live in public/uploads and are
 * served through /api/uploads/[...path] so video range-requests work in dev and
 * in production. Media is shared across all languages.
 */
export const assets = sqliteTable("assets", {
  id: text("id").primaryKey(),
  publicPath: text("public_path").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  byteSize: integer("byte_size").notNull(),
  alt: text("alt").notNull().default(""),
  createdAt: integer("created_at", { mode: "number" }).notNull(),
});

/**
 * The CMS overlay, one row per editable section *per language*
 * (`entity_key` + `locale`, e.g. "home.hero" / "fa"). `payload_json` is a partial
 * object deep-merged over the bundled default, so a section nobody has touched
 * still renders its shipped content and an untranslated field falls back to English.
 */
export const contentDocuments = sqliteTable(
  "content_documents",
  {
    entityKey: text("entity_key").notNull(),
    locale: text("locale").notNull().default("en"),
    payloadJson: text("payload_json").notNull(),
    published: integer("published", { mode: "number" }).notNull().default(1),
    updatedAt: integer("updated_at", { mode: "number" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.entityKey, table.locale] })],
);

/** Language-independent facts about an event: dates, media, ordering, status. */
export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  startDate: text("start_date").notNull().default(""),
  endDate: text("end_date").notNull().default(""),
  imagePath: text("image_path").notNull().default(""),
  videoPath: text("video_path").notNull().default(""),
  galleryJson: text("gallery_json").notNull().default("[]"),
  ctaHref: text("cta_href").notNull().default(""),
  featured: integer("featured", { mode: "number" }).notNull().default(0),
  published: integer("published", { mode: "number" }).notNull().default(1),
  sortOrder: integer("sort_order", { mode: "number" }).notNull().default(0),
  createdAt: integer("created_at", { mode: "number" }).notNull(),
  updatedAt: integer("updated_at", { mode: "number" }).notNull(),
});

/** The words of an event, one row per language. */
export const eventTranslations = sqliteTable(
  "event_translations",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull().default(""),
    category: text("category").notNull().default(""),
    location: text("location").notNull().default(""),
    summary: text("summary").notNull().default(""),
    body: text("body").notNull().default(""),
    ctaLabel: text("cta_label").notNull().default(""),
  },
  (table) => [primaryKey({ columns: [table.eventId, table.locale] })],
);

/** Small key/value store for settings that aren't part of a page section. */
export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  valueJson: text("value_json").notNull(),
  updatedAt: integer("updated_at", { mode: "number" }).notNull(),
});

/** Contact-form and newsletter submissions, readable from the admin inbox. */
export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull().default("contact"),
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  company: text("company").notNull().default(""),
  subject: text("subject").notNull().default(""),
  message: text("message").notNull().default(""),
  /** Which language the visitor was browsing in when they wrote in. */
  locale: text("locale").notNull().default("en"),
  read: integer("read", { mode: "number" }).notNull().default(0),
  createdAt: integer("created_at", { mode: "number" }).notNull(),
});

export type AssetRow = typeof assets.$inferSelect;
export type ContentDocumentRow = typeof contentDocuments.$inferSelect;
export type EventRow = typeof events.$inferSelect;
export type EventTranslationRow = typeof eventTranslations.$inferSelect;
export type SiteSettingsRow = typeof siteSettings.$inferSelect;
export type ContactMessageRow = typeof contactMessages.$inferSelect;
