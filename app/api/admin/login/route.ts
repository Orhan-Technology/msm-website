import { NextResponse } from "next/server";
import { signAdminSessionJwt } from "@/lib/admin/jwt";
import { isAdminPasswordConfigured, verifyAdminPassword } from "@/lib/admin/password";
import { allowLoginAttempt, clearLoginAttempts, clientIpFrom } from "@/lib/admin/rate-limit";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_SEC } from "@/lib/admin/session-cookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Admin password is not configured. Set ADMIN_PASSWORD (8+ characters)." },
      { status: 503 },
    );
  }

  const ip = clientIpFrom(request);
  if (!allowLoginAttempt(ip)) {
    return NextResponse.json({ ok: false, message: "Too many attempts. Try again later." }, { status: 429 });
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }

  if (!verifyAdminPassword(body.password ?? "")) {
    return NextResponse.json({ ok: false, message: "Incorrect password" }, { status: 401 });
  }

  let token: string;
  try {
    token = await signAdminSessionJwt();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Session secret is not configured. Set SESSION_SECRET (16+ characters)." },
      { status: 500 },
    );
  }

  clearLoginAttempts(ip);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SEC,
  });
  return response;
}
