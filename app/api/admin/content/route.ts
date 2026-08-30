import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { resetSection, resolveSectionForEditing, saveSection } from "@/lib/cms/content-repo";
import { revalidateCms } from "@/lib/cms/revalidate";
import { getSectionDef } from "@/lib/cms/sections";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/locales";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Payloads are plain JSON documents; this caps how large one section can get. */
const MAX_PAYLOAD_BYTES = 512 * 1024;

function badRequest(message: string, code = "BAD_REQUEST") {
  return NextResponse.json({ ok: false, message, code }, { status: 400 });
}

function readLocale(value: string | null | undefined): Locale | null {
  if (value == null || value === "") return defaultLocale;
  return isLocale(value) ? value : null;
}

export async function GET(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const params = new URL(request.url).searchParams;
  const key = params.get("key");
  if (!key) return badRequest("A section key is required");
  const def = getSectionDef(key);
  if (!def) return badRequest("Unknown section", "UNKNOWN_SECTION");

  const locale = readLocale(params.get("locale"));
  if (!locale) return badRequest("Unknown language", "UNKNOWN_LOCALE");

  const { payload, source, hasTranslation } = resolveSectionForEditing(key, locale);
  return NextResponse.json({
    ok: true,
    key,
    locale,
    label: def.label,
    fields: def.fields,
    payload,
    source,
    hasTranslation,
  });
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  let body: { key?: string; locale?: string; payload?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return badRequest("Invalid JSON");
  }

  const key = body.key;
  if (!key) return badRequest("A section key is required");
  if (!getSectionDef(key)) return badRequest("Unknown section", "UNKNOWN_SECTION");

  const locale = readLocale(body.locale);
  if (!locale) return badRequest("Unknown language", "UNKNOWN_LOCALE");

  const payload = body.payload;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return badRequest("The payload must be an object", "INVALID_PAYLOAD");
  }

  if (JSON.stringify(payload).length > MAX_PAYLOAD_BYTES) {
    return badRequest("This section is too large to save", "PAYLOAD_TOO_LARGE");
  }

  saveSection(key, locale, payload as Record<string, unknown>);
  revalidateCms();
  const resolved = resolveSectionForEditing(key, locale);
  return NextResponse.json({
    ok: true,
    locale,
    payload: resolved.payload,
    source: resolved.source,
    hasTranslation: resolved.hasTranslation,
  });
}

/** Reset one language back to English, or English back to the shipped content. */
export async function DELETE(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const params = new URL(request.url).searchParams;
  const key = params.get("key");
  if (!key) return badRequest("A section key is required");
  if (!getSectionDef(key)) return badRequest("Unknown section", "UNKNOWN_SECTION");

  const locale = readLocale(params.get("locale"));
  if (!locale) return badRequest("Unknown language", "UNKNOWN_LOCALE");

  resetSection(key, locale);
  revalidateCms();
  const resolved = resolveSectionForEditing(key, locale);
  return NextResponse.json({
    ok: true,
    locale,
    payload: resolved.payload,
    source: resolved.source,
    hasTranslation: resolved.hasTranslation,
  });
}
