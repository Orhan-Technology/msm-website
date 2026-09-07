import { NextIntlClientProvider } from "next-intl";
import "@/app/globals.css";
import { getAdminLocale, getAdminMessages } from "@/lib/admin/admin-locale";
import { fontVariables } from "@/lib/i18n/fonts";
import { localeMeta } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

export const metadata = {
  title: { default: "Admin", template: "%s — Maisam Admin" },
  robots: { index: false, follow: false },
};

/**
 * The admin panel is its own root layout: it sits outside the locale-prefixed
 * site routes, so it renders its own <html> and reads the working language from
 * a cookie rather than the URL.
 */
export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getAdminLocale();
  const messages = await getAdminMessages(locale);
  const meta = localeMeta[locale];

  return (
    <html
      lang={meta.hrefLang}
      dir={meta.dir}
      className={cn(fontVariables, meta.dir === "rtl" && "font-arabic-locale")}
      suppressHydrationWarning
    >
      <body className="font-body antialiased" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
