import "server-only";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/locales";
import { loadMessages } from "@/lib/i18n/messages";

/**
 * The admin panel is not locale-prefixed — staff pick their working language
 * once and it is remembered in this cookie.
 */
export const ADMIN_LOCALE_COOKIE = "msm_admin_locale";

export async function getAdminLocale(): Promise<Locale> {
  const value = (await cookies()).get(ADMIN_LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getAdminMessages(locale: Locale) {
  return loadMessages(locale);
}

/**
 * Translations for admin server components. `getTranslations()` on its own reads
 * the *request* locale, which is undefined outside the `[locale]` segment — so
 * the admin would always render English. This resolves the cookie locale first.
 */
export async function getAdminTranslations(namespace: string) {
  return getTranslations({ locale: await getAdminLocale(), namespace });
}
