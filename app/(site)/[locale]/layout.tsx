import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "@/app/globals.css";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";
import { getCompany, getSeo } from "@/lib/cms/site-data";
import { fontVariables } from "@/lib/i18n/fonts";
import { localeMeta, locales, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Every page exists in all three languages; tell search engines about the alternates. */
function alternateLanguages(path = "/") {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    languages[localeMeta[locale].hrefLang] = `${siteUrl}${prefix}${path === "/" ? "" : path}` || siteUrl;
  }
  return languages;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [seo, company] = await Promise.all([getSeo(), getCompany()]);

  return {
    metadataBase: new URL(siteUrl),
    title: { default: seo.metaTitle, template: seo.titleTemplate || "%s" },
    description: seo.metaDescription,
    applicationName: company.name,
    authors: [{ name: company.name }],
    creator: company.name,
    publisher: company.name,
    keywords: (seo.keywords ?? []).map((keyword) => keyword.value ?? "").filter(Boolean),
    alternates: {
      canonical: locale === routing.defaultLocale ? "/" : `/${locale}`,
      languages: alternateLanguages(),
    },
    openGraph: {
      type: "website",
      locale: localeMeta[locale as Locale].hrefLang,
      url: siteUrl,
      siteName: company.name,
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const meta = localeMeta[locale as Locale];
  const [company, seo] = await Promise.all([getCompany(), getSeo()]);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    alternateName: company.shortName,
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    image: `${siteUrl}${seo.ogImage || "/opengraph-image.png"}`,
    description: seo.metaDescription,
    email: company.email,
    telephone: company.phone,
    foundingDate: String(company.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Pol-e-Charkhi Industrial Park, New Bagram Road",
      addressLocality: "Kabul",
      postalCode: "1001",
      addressCountry: "AF",
    },
    sameAs: (company.socials ?? []).map((social) => social.href),
  };

  return (
    <html
      lang={meta.hrefLang}
      dir={meta.dir}
      className={cn(fontVariables, meta.dir === "rtl" && "font-arabic-locale")}
      suppressHydrationWarning
    >
      <body className="font-body antialiased" suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
