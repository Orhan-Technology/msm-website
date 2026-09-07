import type { Locale } from "@/lib/i18n/locales";

/**
 * Message catalogues are static JSON, imported per locale so only the active
 * one ends up in the bundle. Missing keys fall back to English.
 */
const loaders: Record<Locale, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import("@/messages/en.json"),
  fa: () => import("@/messages/fa.json"),
  ps: () => import("@/messages/ps.json"),
};

export async function loadMessages(locale: Locale): Promise<Record<string, unknown>> {
  const [base, translated] = await Promise.all([loaders.en(), loaders[locale]()]);
  if (locale === "en") return base.default;
  return mergeCatalogues(base.default, translated.default);
}

/** English fills any gap so a missing translation never renders a raw key. */
function mergeCatalogues(
  base: Record<string, unknown>,
  overlay: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(overlay)) {
    const baseValue = base[key];
    const overlayValue = overlay[key];
    out[key] =
      baseValue &&
      overlayValue &&
      typeof baseValue === "object" &&
      typeof overlayValue === "object" &&
      !Array.isArray(baseValue) &&
      !Array.isArray(overlayValue)
        ? mergeCatalogues(baseValue as Record<string, unknown>, overlayValue as Record<string, unknown>)
        : overlayValue;
  }
  return out;
}
