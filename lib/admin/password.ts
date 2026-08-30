import { createHash, timingSafeEqual } from "crypto";

/** Constant-time comparison against ADMIN_PASSWORD so timing can't leak the value. */
export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || !input) return false;
  try {
    const a = createHash("sha256").update(input, "utf8").digest();
    const b = createHash("sha256").update(expected, "utf8").digest();
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function isAdminPasswordConfigured() {
  const value = process.env.ADMIN_PASSWORD ?? "";
  return value.length >= 8;
}
