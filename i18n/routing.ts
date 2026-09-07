import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "@/lib/i18n/locales";

/**
 * `as-needed` keeps English on the bare paths the site already uses (/about),
 * and prefixes only Dari and Pashto (/fa/about, /ps/about).
 */
export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed",
});
