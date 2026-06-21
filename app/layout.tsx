import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Maisam Steel Mill — Innovative metal solutions for industries",
  description:
    "Maisam Steel Mill — Afghanistan's first ISO-certified steel manufacturer. Rebar, angles and T-bars engineered to international standards since 2009.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
