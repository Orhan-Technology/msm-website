/**
 * Merge a stored overlay onto a bundled default. Objects merge key by key;
 * arrays and scalars replace wholesale, so an admin who empties a list gets an
 * empty list rather than the shipped one bleeding back through.
 */
export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  overlay: Record<string, unknown> | null | undefined,
): T {
  if (!overlay || typeof overlay !== "object" || Array.isArray(overlay)) return base;
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(overlay)) {
    const baseValue = (base as Record<string, unknown>)[key];
    const overlayValue = overlay[key];
    if (overlayValue === undefined) continue;
    const bothPlainObjects =
      overlayValue !== null &&
      typeof overlayValue === "object" &&
      !Array.isArray(overlayValue) &&
      baseValue !== null &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue);
    out[key] = bothPlainObjects
      ? deepMerge(baseValue as Record<string, unknown>, overlayValue as Record<string, unknown>)
      : overlayValue;
  }
  return out as T;
}
