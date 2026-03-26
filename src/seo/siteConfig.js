/** Site name appended to page titles when not already present */
export const SITE_NAME = "Samuel Chua";

/** Default meta description (also in index.html) */
export const DEFAULT_DESCRIPTION =
  "Front-end developer and website designer based in Surrey, B.C. Responsive, dynamic web experiences for business goals—mobile through desktop.";

/**
 * Canonical / Open Graph base URL. Set `VITE_SITE_URL` in `.env` (e.g. https://yoursite.com)
 * for stable sharing and SEO. Falls back to `window.location.origin` in the browser.
 */
export function getSiteOrigin() {
  if (typeof window === "undefined") return "";
  const env = import.meta.env.VITE_SITE_URL;
  if (env && typeof env === "string" && env.trim()) {
    return env.replace(/\/$/, "");
  }
  return window.location.origin;
}

export function getCanonicalUrl(pathname) {
  const origin = getSiteOrigin();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${origin}${path}`;
}
