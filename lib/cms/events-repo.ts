import "server-only";
import { randomUUID } from "crypto";
import { asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "@/db/index";
import { events, eventTranslations } from "@/db/schema";
import { CMS_CACHE_TAG } from "@/lib/cms/cache-tags";
import { warnDbFallback } from "@/lib/cms/db-fallback";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/locales";
import type { EventRow, EventTranslationRow } from "@/db/schema";

/** The words of an event in one language. */
export type EventText = {
  title: string;
  category: string;
  location: string;
  summary: string;
  body: string;
  ctaLabel: string;
};

export const emptyEventText: EventText = {
  title: "",
  category: "",
  location: "",
  summary: "",
  body: "",
  ctaLabel: "",
};

/** An event as the admin edits it: shared facts plus every language's text. */
export type AdminEventRecord = {
  id: string;
  slug: string;
  startDate: string;
  endDate: string;
  imagePath: string;
  videoPath: string;
  gallery: string[];
  ctaHref: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
  translations: Record<Locale, EventText>;
};

/** An event as the public site renders it: shared facts plus resolved text. */
export type EventRecord = Omit<AdminEventRecord, "translations"> & EventText;

export type EventInput = {
  slug?: string;
  startDate?: string;
  endDate?: string;
  imagePath?: string;
  videoPath?: string;
  gallery?: string[];
  ctaHref?: string;
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
  translations?: Partial<Record<Locale, Partial<EventText>>>;
};

function parseGallery(galleryJson: string): string[] {
  try {
    const parsed = JSON.parse(galleryJson) as unknown;
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    /* a malformed gallery just renders as empty */
  }
  return [];
}

function toText(row: EventTranslationRow | undefined): EventText {
  if (!row) return { ...emptyEventText };
  return {
    title: row.title,
    category: row.category,
    location: row.location,
    summary: row.summary,
    body: row.body,
    ctaLabel: row.ctaLabel,
  };
}

/** Field by field, this language wins where it has text; English fills the gaps. */
function withFallback(text: EventText, english: EventText): EventText {
  return {
    title: text.title || english.title,
    category: text.category || english.category,
    location: text.location || english.location,
    summary: text.summary || english.summary,
    body: text.body || english.body,
    ctaLabel: text.ctaLabel || english.ctaLabel,
  };
}

function baseFrom(row: EventRow) {
  return {
    id: row.id,
    slug: row.slug,
    startDate: row.startDate,
    endDate: row.endDate,
    imagePath: row.imagePath,
    videoPath: row.videoPath,
    gallery: parseGallery(row.galleryJson),
    ctaHref: row.ctaHref,
    featured: row.featured === 1,
    published: row.published === 1,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function slugify(value: string) {
  const cleaned = value
    .toLowerCase()
    .trim()
    // Keep Latin, digits and Arabic-script letters so Dari/Pashto titles make usable slugs.
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  return cleaned.replace(/^-|-$/g, "");
}

/** Make sure a slug is unique, appending -2, -3 … when it collides. */
async function uniqueSlug(base: string, ignoreId?: string) {
  const db = getDb();
  const root = base || "event";
  let candidate = root;
  let suffix = 2;
  for (;;) {
    const [existing] = await db.select().from(events).where(eq(events.slug, candidate)).limit(1);
    if (!existing || existing.id === ignoreId) return candidate;
    candidate = `${root}-${suffix}`;
    suffix += 1;
  }
}

async function nextSortOrder() {
  const rows = await getDb().select({ sortOrder: events.sortOrder }).from(events);
  return rows.length ? Math.max(...rows.map((row) => row.sortOrder)) + 1 : 0;
}

async function writeTranslations(eventId: string, input: EventInput) {
  const db = getDb();
  for (const locale of locales) {
    const text = input.translations?.[locale];
    if (!text) continue;
    const row = {
      eventId,
      locale,
      title: (text.title ?? "").trim(),
      category: (text.category ?? "").trim(),
      location: (text.location ?? "").trim(),
      summary: text.summary ?? "",
      body: text.body ?? "",
      ctaLabel: (text.ctaLabel ?? "").trim(),
    };
    await db
      .insert(eventTranslations)
      .values(row)
      .onConflictDoUpdate({
        target: [eventTranslations.eventId, eventTranslations.locale],
        set: {
          title: row.title,
          category: row.category,
          location: row.location,
          summary: row.summary,
          body: row.body,
          ctaLabel: row.ctaLabel,
        },
      });
  }
}

function sharedColumns(input: EventInput) {
  return {
    startDate: input.startDate ?? "",
    endDate: input.endDate ?? "",
    imagePath: input.imagePath ?? "",
    videoPath: input.videoPath ?? "",
    galleryJson: JSON.stringify(input.gallery ?? []),
    ctaHref: input.ctaHref ?? "",
    featured: input.featured ? 1 : 0,
    published: input.published === false ? 0 : 1,
  };
}

/** The English title is what the slug is generated from. */
function englishTitle(input: EventInput) {
  return input.translations?.[defaultLocale]?.title ?? "";
}

export async function createEvent(input: EventInput): Promise<AdminEventRecord | null> {
  const db = getDb();
  const now = Date.now();
  const id = randomUUID();
  const slug = await uniqueSlug(slugify(input.slug || englishTitle(input)));

  await db.insert(events).values({
    id,
    slug,
    ...sharedColumns(input),
    sortOrder: input.sortOrder ?? (await nextSortOrder()),
    createdAt: now,
    updatedAt: now,
  });
  await writeTranslations(id, input);
  return fetchAdminEvent(id);
}

export async function updateEvent(id: string, input: EventInput): Promise<AdminEventRecord | null> {
  const db = getDb();
  const [existing] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!existing) return null;

  const slug = await uniqueSlug(slugify(input.slug || englishTitle(input) || existing.slug), id);
  await db
    .update(events)
    .set({
      slug,
      ...sharedColumns(input),
      sortOrder: input.sortOrder ?? existing.sortOrder,
      updatedAt: Date.now(),
    })
    .where(eq(events.id, id));
  await writeTranslations(id, input);
  return fetchAdminEvent(id);
}

export async function deleteEvent(id: string) {
  const db = getDb();
  const [existing] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!existing) return false;
  await db.delete(eventTranslations).where(eq(eventTranslations.eventId, id));
  await db.delete(events).where(eq(events.id, id));
  return true;
}

export async function reorderEvents(orderedIds: string[]) {
  const db = getDb();
  const now = Date.now();
  // neon-http has no transactions, but each row is independent, so applying the
  // new positions one at a time is equivalent.
  for (const [index, id] of orderedIds.entries()) {
    await db.update(events).set({ sortOrder: index, updatedAt: now }).where(eq(events.id, id));
  }
}

function translationsFor(eventId: string, all: EventTranslationRow[]): Record<Locale, EventText> {
  const rows = all.filter((row) => row.eventId === eventId);
  const result = {} as Record<Locale, EventText>;
  for (const locale of locales) {
    result[locale] = toText(rows.find((row) => row.locale === locale));
  }
  return result;
}

/** Every event with every translation — for the admin list. */
export async function fetchAdminEvents(): Promise<AdminEventRecord[]> {
  const db = getDb();
  const rows = await db.select().from(events).orderBy(asc(events.sortOrder), desc(events.createdAt));
  const allTranslations = await db.select().from(eventTranslations);
  return rows.map((row) => ({ ...baseFrom(row), translations: translationsFor(row.id, allTranslations) }));
}

export async function fetchAdminEvent(id: string): Promise<AdminEventRecord | null> {
  const db = getDb();
  const [row] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!row) return null;
  const rows = await db.select().from(eventTranslations).where(eq(eventTranslations.eventId, id));
  return { ...baseFrom(row), translations: translationsFor(id, rows) };
}

/** Flatten an admin record down to one language, filling gaps from English. */
export function localiseEvent(record: AdminEventRecord, locale: Locale): EventRecord {
  const english = record.translations[defaultLocale] ?? emptyEventText;
  const text = withFallback(record.translations[locale] ?? emptyEventText, english);
  return {
    id: record.id,
    slug: record.slug,
    startDate: record.startDate,
    endDate: record.endDate,
    imagePath: record.imagePath,
    videoPath: record.videoPath,
    gallery: record.gallery,
    ctaHref: record.ctaHref,
    featured: record.featured,
    published: record.published,
    sortOrder: record.sortOrder,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    ...text,
  };
}

/** Published events only — what the public site renders. */
const readPublishedEvents = unstable_cache(
  async (locale: Locale): Promise<EventRecord[]> =>
    (await fetchAdminEvents())
      .filter((event) => event.published)
      .map((event) => localiseEvent(event, locale)),
  ["msm-events-published"],
  { tags: [CMS_CACHE_TAG] },
);

const readPublishedEventBySlug = unstable_cache(
  async (slug: string, locale: Locale): Promise<EventRecord | null> => {
    const match = (await fetchAdminEvents()).find((event) => event.slug === slug && event.published);
    return match ? localiseEvent(match, locale) : null;
  },
  ["msm-event-by-slug"],
  { tags: [CMS_CACHE_TAG] },
);

/**
 * Events live only in the database — there is no bundled copy to fall back on —
 * so an outage hides the listing rather than breaking every page that embeds it.
 * The catch is outside unstable_cache so the empty result is never cached.
 */
export async function getPublishedEvents(locale: Locale): Promise<EventRecord[]> {
  try {
    return await readPublishedEvents(locale);
  } catch (error) {
    warnDbFallback("published events", error);
    return [];
  }
}

export async function getPublishedEventBySlug(slug: string, locale: Locale): Promise<EventRecord | null> {
  try {
    return await readPublishedEventBySlug(slug, locale);
  } catch (error) {
    warnDbFallback("event by slug", error);
    return null;
  }
}
