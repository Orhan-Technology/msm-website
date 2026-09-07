export const ADMIN_SESSION_COOKIE = "msm_admin_session";

/** Sessions last a week; the cookie is httpOnly + sameSite=lax. */
export const ADMIN_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;
