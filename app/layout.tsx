import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site";
import { company } from "@/lib/company";

// Display: Archivo (variable, incl. width axis for expanded headings)
const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

// Body: IBM Plex Sans (engineering heritage, highly legible)
const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const description =
  "Maisam Steel Mill — Afghanistan's first ISO-certified steel manufacturer. Rebar, angles and T-bars engineered to international standards since 2009.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Maisam Steel Mill — Innovative metal solutions for industries",
    template: "%s — Maisam Steel Mill",
  },
  description,
  applicationName: "Maisam Steel Mill",
  authors: [{ name: "Maisam Steel Mill" }],
  creator: "Maisam Steel Mill",
  publisher: "Maisam Steel Mill",
  keywords: [
    "Maisam Steel Mill",
    "MSM",
    "steel manufacturer Afghanistan",
    "ISO certified steel",
    "rebar",
    "steel angles",
    "T-bars",
    "structural steel",
    "Pol-e-Charkhi",
    "Kabul steel mill",
    "construction steel Afghanistan",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Maisam Steel Mill",
    title: "Maisam Steel Mill — Innovative metal solutions for industries",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Maisam Steel Mill — Innovative metal solutions for industries",
    description,
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

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  alternateName: company.shortName,
  url: siteUrl,
  logo: `${siteUrl}/icon.png`,
  image: `${siteUrl}/opengraph-image.png`,
  description,
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
  sameAs: company.socials.map((s) => s.href),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
