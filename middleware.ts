import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

/**
 * Everything except the API, the admin panel, Next internals and files with an
 * extension goes through locale negotiation. The admin is deliberately excluded:
 * it is never locale-prefixed and picks its language from a cookie instead.
 */
export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
