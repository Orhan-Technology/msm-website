import "server-only";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db/index";
import { contentDocuments } from "@/db/schema";
import { deepMerge } from "@/lib/cms/deep-merge";
import { mergeTranslation } from "@/lib/cms/merge-translation";
import { getLocalizedDefaults } from "@/lib/cms/translations";
import { getSectionDef } from "@/lib/cms/sections";
import { defaultLocale, type Locale } from "@/lib/i18n/locales";

export type ContentSource = "default" | "english" | "translated";

function parsePayload(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    /* a corrupted row falls back to the bundled default rather than crashing the page */
  }
  return {};
}

/** The raw stored overlay for one section in one language, or null if never edited. */
export function fetchOverlay(entityKey: string, locale: Locale): Record<string, unknown> | null {
  const row = getDb()
    .select()
    .from(contentDocuments)
    .where(and(eq(contentDocuments.entityKey, entityKey), eq(contentDocuments.locale, locale)))
    .get();
  return row ? parsePayload(row.payloadJson) : null;
}

/**
 * Resolve a section for one language by layering:
 *   bundled default → English overlay → bundled translation → this language's overlay
 * so an untranslated field quietly shows the English text instead of a blank.
 */
export function resolveSection(
  entityKey: string,
  locale: Locale = defaultLocale,
): { payload: Record<string, unknown>; source: ContentSource } {
  const def = getSectionDef(entityKey);
  const defaults = (def?.defaults ?? {}) as Record<string, unknown>;

  const englishOverlay = fetchOverlay(entityKey, defaultLocale);
  const base = englishOverlay ? deepMerge(defaults, englishOverlay) : defaults;

  if (locale === defaultLocale) {
    return { payload: base, source: englishOverlay ? "english" : "default" };
  }

  // Bundled Dari/Pashto copy sits between the English base and anything saved in
  // the panel, so a fresh install with an empty database still renders in the
  // right language. A translation typed by an admin still wins over it.
  const bundled = getLocalizedDefaults(entityKey, locale);
  const localeBase = bundled ? mergeTranslation(base, bundled) : base;

  const localeOverlay = fetchOverlay(entityKey, locale);
  if (!localeOverlay) {
    return {
      payload: localeBase,
      source: bundled ? "translated" : englishOverlay ? "english" : "default",
    };
  }
  return { payload: deepMerge(localeBase, localeOverlay), source: "translated" };
}

/**
 * What the admin editor loads: the stored values for *this* language layered on
 * the English text, so a translator sees the source copy and can overwrite it.
 */
export function resolveSectionForEditing(entityKey: string, locale: Locale) {
  const resolved = resolveSection(entityKey, locale);
  return {
    payload: resolved.payload,
    source: resolved.source,
    hasTranslation:
      locale === defaultLocale ||
      fetchOverlay(entityKey, locale) !== null ||
      getLocalizedDefaults(entityKey, locale) !== null,
  };
}

export function saveSection(entityKey: string, locale: Locale, payload: Record<string, unknown>) {
  const now = Date.now();
  getDb()
    .insert(contentDocuments)
    .values({ entityKey, locale, payloadJson: JSON.stringify(payload), published: 1, updatedAt: now })
    .onConflictDoUpdate({
      target: [contentDocuments.entityKey, contentDocuments.locale],
      set: { payloadJson: JSON.stringify(payload), updatedAt: now },
    })
    .run();
}

/** Drop one language's overlay so the section falls back to English (or the shipped copy). */
export function resetSection(entityKey: string, locale: Locale) {
  getDb()
    .delete(contentDocuments)
    .where(and(eq(contentDocuments.entityKey, entityKey), eq(contentDocuments.locale, locale)))
    .run();
}

export function listEditedSectionKeys(locale?: Locale): string[] {
  const rows = getDb()
    .select({ entityKey: contentDocuments.entityKey, locale: contentDocuments.locale })
    .from(contentDocuments)
    .all();
  const filtered = locale ? rows.filter((row) => row.locale === locale) : rows;
  return [...new Set(filtered.map((row) => row.entityKey))];
}

/** Which languages a section has been translated into. */
export function translatedLocalesFor(entityKey: string): string[] {
  return getDb()
    .select({ locale: contentDocuments.locale })
    .from(contentDocuments)
    .where(eq(contentDocuments.entityKey, entityKey))
    .all()
    .map((row) => row.locale);
}

export function lastUpdatedAt(): number | null {
  const rows = getDb().select({ updatedAt: contentDocuments.updatedAt }).from(contentDocuments).all();
  if (!rows.length) return null;
  return Math.max(...rows.map((row) => row.updatedAt));
}
