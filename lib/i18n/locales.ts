/**
 * The three languages the site ships in. English is the default and stays
 * un-prefixed (`/about`), so every URL that is already indexed keeps working;
 * Dari and Pashto sit under `/fa/...` and `/ps/...`.
 */
export const locales = ["en", "fa", "ps"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export type LocaleMeta = {
  code: Locale;
  /** Name in the language itself — what the switcher shows. */
  nativeName: string;
  /** Name in English, for the admin panel. */
  englishName: string;
  dir: "ltr" | "rtl";
  /** BCP-47 tag for <html lang> and hreflang. */
  hrefLang: string;
};

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { code: "en", nativeName: "English", englishName: "English", dir: "ltr", hrefLang: "en" },
  fa: { code: "fa", nativeName: "دری", englishName: "Dari", dir: "rtl", hrefLang: "fa-AF" },
  ps: { code: "ps", nativeName: "پښتو", englishName: "Pashto", dir: "rtl", hrefLang: "ps-AF" },
};

export const localeList: LocaleMeta[] = locales.map((locale) => localeMeta[locale]);

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function directionOf(locale: string): "ltr" | "rtl" {
  return isLocale(locale) ? localeMeta[locale].dir : "ltr";
}

export function isRtl(locale: string): boolean {
  return directionOf(locale) === "rtl";
}
