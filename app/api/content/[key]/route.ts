import { NextResponse } from "next/server";
import { getSection } from "@/lib/cms/content";
import { getSectionDef } from "@/lib/cms/sections";
import { defaultLocale, isLocale } from "@/lib/i18n/locales";

export const runtime = "nodejs";

/** Public, read-only view of a published section. Pass ?locale=fa|ps to translate. */
export async function GET(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const key = (await params).key;
  const def = getSectionDef(key);
  if (!def) return NextResponse.json({ ok: false, message: "Unknown section" }, { status: 404 });

  const requested = new URL(request.url).searchParams.get("locale");
  const locale = isLocale(requested) ? requested : defaultLocale;

  return NextResponse.json(
    { ok: true, key, locale, label: def.label, page: def.page, content: await getSection(key, locale) },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=600" } },
  );
}
