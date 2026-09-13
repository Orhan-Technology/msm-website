import "server-only";

const warned = new Set<string>();

/**
 * Report that a public read fell back to bundled content because the database
 * was unreachable, at most once per process per subject.
 *
 * Every public page layers its CMS overlay on top of copy that ships in the
 * bundle, so losing the database degrades the site to its shipped text rather
 * than breaking it. The log still has to fire, though — a silently empty site
 * looks identical to one nobody has edited yet.
 */
export function warnDbFallback(subject: string, error: unknown) {
  if (warned.has(subject)) return;
  warned.add(subject);
  const reason = error instanceof Error ? error.message : String(error);
  console.error(`[cms] ${subject}: database unavailable, serving bundled content. ${reason}`);
}
