import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { ADMIN_LOCALE_COOKIE } from "@/lib/admin/admin-locale";
import { ADMIN_SESSION_MAX_AGE_SEC } from "@/lib/admin/session-cookie";
import { isLocale } from "@/lib/i18n/locales";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Remember which language a staff member works in inside the admin panel. */
export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  let body: { locale?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }
  if (!isLocale(body.locale)) {
    return NextResponse.json({ ok: false, message: "Unknown language" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, locale: body.locale });
  response.cookies.set(ADMIN_LOCALE_COOKIE, body.locale, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SEC,
  });
  return response;
}
