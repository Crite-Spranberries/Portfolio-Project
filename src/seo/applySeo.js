import { DEFAULT_DESCRIPTION, SITE_NAME, getCanonicalUrl, getSiteOrigin } from "./siteConfig";

function ensureMetaByName(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function ensureMetaProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function ensureCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Updates document title, meta description, Open Graph, Twitter, and canonical URL.
 * Call from route components or a central SeoHead listener.
 *
 * @param {object} opts
 * @param {string} opts.title - Page title ( "| Samuel Chua" added if missing)
 * @param {string} [opts.description] - Meta description
 * @param {string} [opts.pathname] - Path for canonical (default: window.location.pathname)
 * @param {string} [opts.image] - Absolute URL for og:image / twitter:image
 * @param {boolean} [opts.noIndex] - If true, sets robots noindex,nofollow
 * @param {"website"|"article"} [opts.ogType]
 */
export function applySeo({
  title,
  description = DEFAULT_DESCRIPTION,
  pathname,
  image,
  noIndex = false,
  ogType = "website",
}) {
  if (typeof document === "undefined") return;

  const path = pathname ?? window.location.pathname;
  const canonical = getCanonicalUrl(path);
  const pageTitle =
    title.includes("|") || title.includes(SITE_NAME)
      ? title.trim()
      : `${title.trim()} | ${SITE_NAME}`;

  document.title = pageTitle;

  const desc = description.trim() || DEFAULT_DESCRIPTION;
  ensureMetaByName("description", desc);

  if (noIndex) {
    ensureMetaByName("robots", "noindex, nofollow");
  } else {
    ensureMetaByName("robots", "index, follow");
  }

  ensureCanonical(canonical);

  const origin = getSiteOrigin();
  const ogImage =
    image ||
    (origin ? `${origin}/favicon.svg` : "/favicon.svg");

  ensureMetaProperty("og:type", ogType);
  ensureMetaProperty("og:title", pageTitle);
  ensureMetaProperty("og:description", desc);
  ensureMetaProperty("og:url", canonical);
  ensureMetaProperty("og:site_name", SITE_NAME);
  ensureMetaProperty("og:locale", "en_CA");
  if (ogImage) {
    ensureMetaProperty("og:image", ogImage);
  }

  ensureMetaByName("twitter:card", image ? "summary_large_image" : "summary");
  ensureMetaByName("twitter:title", pageTitle);
  ensureMetaByName("twitter:description", desc);
  if (ogImage) {
    ensureMetaByName("twitter:image", ogImage);
  }
}

/**
 * Injects Person JSON-LD (home page). Returns a cleanup that removes the script.
 */
export function applyPersonJsonLd() {
  if (typeof document === "undefined") return () => {};
  const origin = getSiteOrigin();
  const id = "seo-jsonld-person";
  document.getElementById(id)?.remove();

  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Samuel Chua",
    jobTitle: "Front-end Developer",
    description: DEFAULT_DESCRIPTION,
    url: origin || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Surrey",
      addressRegion: "BC",
      addressCountry: "CA",
    },
  });
  document.head.appendChild(script);

  return () => {
    document.getElementById(id)?.remove();
  };
}
