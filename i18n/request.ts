import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { defaultLocale, isLocale } from "@/lib/i18n/locales";
import { loadMessages } from "@/lib/i18n/messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : defaultLocale;
  return { locale, messages: await loadMessages(locale) };
});

export { routing };
