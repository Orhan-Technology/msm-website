import { Archivo, IBM_Plex_Sans, Vazirmatn } from "next/font/google";

/** Display: Archivo — variable, with a width axis for the expanded industrial headings. */
export const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display-latin",
  display: "swap",
});

/** Body: IBM Plex Sans — engineering heritage, highly legible. */
export const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-latin",
  display: "swap",
});

/**
 * Arabic script: Vazirmatn — a modern variable face that covers both Dari and
 * Pashto, including the extra Pashto letters (ټ ډ ړ ږ ښ ګ ڼ ې ۍ). Used for
 * headings and body text on the RTL locales.
 */
export const arabic = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
});

export const fontVariables = `${display.variable} ${body.variable} ${arabic.variable}`;
