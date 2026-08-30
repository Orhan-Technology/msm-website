import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { verifyAdminSessionJwt } from "@/lib/admin/jwt";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/session-cookie";

export async function getAdminSessionToken() {
  const store = await cookies();
  return store.get(ADMIN_SESSION_COOKIE)?.value ?? null;
}

export async function isAdminAuthenticated() {
  const token = await getAdminSessionToken();
  if (!token) return false;
  try {
    return await verifyAdminSessionJwt(token);
  } catch {
    return false;
  }
}

/** Guard for admin pages — bounces to the login screen. */
export async function requireAdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

/** Guard for admin API routes — returns a 401 response, or null when allowed. */
export async function requireAdminApi() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  return null;
}
