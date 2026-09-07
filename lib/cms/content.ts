import "server-only";
import { unstable_cache } from "next/cache";
import { getLocale } from "next-intl/server";
import { CMS_CACHE_TAG } from "@/lib/cms/cache-tags";
import { resolveSection } from "@/lib/cms/content-repo";
import { getSectionDef } from "@/lib/cms/sections";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/locales";

/**
 * Read one CMS section for one language. Results are cached under a single tag,
 * so a save in the admin panel refreshes every page in every language at once.
 */
const readSection = unstable_cache(
  async (key: string, locale: Locale): Promise<Record<string, unknown>> =>
    resolveSection(key, locale).payload,
  ["msm-cms-section"],
  { tags: [CMS_CACHE_TAG] },
);

export async function getSection(key: string, locale?: Locale): Promise<Record<string, unknown>> {
  return readSection(key, locale ?? (await currentLocale()));
}

/** Typed convenience wrapper: `await section<HeroContent>("home.hero")`. */
export async function section<T>(key: string, locale?: Locale): Promise<T> {
  return (await getSection(key, locale)) as T;
}

/**
 * The language of the request. Falls back to English outside a localised route
 * (the admin panel and API routes render without a locale segment).
 */
export async function currentLocale(): Promise<Locale> {
  try {
    const locale = await getLocale();
    return isLocale(locale) ? locale : defaultLocale;
  } catch {
    return defaultLocale;
  }
}

/** Bundled defaults without touching the database — used as a last-resort fallback. */
export function sectionDefaults<T>(key: string): T {
  return (getSectionDef(key)?.defaults ?? {}) as T;
}
