const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

/** In-memory login throttle, keyed by client IP. */
export function allowLoginAttempt(ip: string) {
  const now = Date.now();
  const row = attempts.get(ip);
  if (!row || now > row.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (row.count >= MAX_ATTEMPTS) return false;
  row.count += 1;
  return true;
}

export function clearLoginAttempts(ip: string) {
  attempts.delete(ip);
}

export function clientIpFrom(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}
