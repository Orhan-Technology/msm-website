/**
 * Layer a bundled translation over the English defaults.
 *
 * Unlike `deepMerge`, arrays merge element by element. A translation only ever
 * supplies prose, so the image paths, links and icon names in each English list
 * item have to survive; any index — or any key — the translation leaves out
 * stays English. That makes a partial translation always safe to ship.
 *
 * This is deliberately not how a stored admin overlay merges: there, an emptied
 * list must actually empty the list, which is why `deepMerge` replaces arrays.
 */
export function mergeTranslation<T>(base: T, translation: unknown): T {
  if (translation === undefined || translation === null) return base;

  if (Array.isArray(base)) {
    if (!Array.isArray(translation)) return base;
    return base.map((item, index) =>
      index < translation.length ? mergeTranslation(item, translation[index]) : item,
    ) as T;
  }

  if (isPlainObject(base)) {
    if (!isPlainObject(translation)) return base;
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(translation)) {
      out[key] = key in base ? mergeTranslation(base[key], translation[key]) : translation[key];
    }
    return out as T;
  }

  return translation as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
