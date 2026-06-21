// Canonical site URL. Set NEXT_PUBLIC_SITE_URL in the deploy environment;
// falls back to the production domain.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://msm.af"
).replace(/\/$/, "");
