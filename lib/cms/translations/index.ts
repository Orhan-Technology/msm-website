import type { Locale } from "@/lib/i18n/locales";
import fa from "@/lib/cms/translations/fa.json";
import ps from "@/lib/cms/translations/ps.json";

/**
 * Dari and Pashto renderings of the bundled section defaults, keyed by section
 * key and mirroring the shape of `SectionDef.defaults`.
 *
 * These ship in code rather than in the database so a fresh deployment renders
 * every page in all three languages with an empty CMS. A translation saved in
 * the admin panel still wins over the bundled copy.
 *
 * Only prose needs to be present: `mergeTranslation` layers these element by
 * element, so anything omitted — a whole field, a list item, an image path —
 * keeps its English value. Partial entries are always safe.
 */
export type SectionTranslations = Record<string, Record<string, unknown>>;

const catalogues: Partial<Record<Locale, SectionTranslations>> = {
  fa: fa as SectionTranslations,
  ps: ps as SectionTranslations,
};

export function getLocalizedDefaults(
  entityKey: string,
  locale: Locale,
): Record<string, unknown> | null {
  return catalogues[locale]?.[entityKey] ?? null;
}
