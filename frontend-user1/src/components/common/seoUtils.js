/**
 * Shared SEO utilities for Public Frontend
 */

/**
 * Strips basic HTML tags and Markdown markers from text
 */
export function cleanText(input) {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[*_#`~[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Validates custom canonical URLs.
 * Accepts only safe absolute http/https URLs or safe root-relative paths.
 * Rejects localhost, loopback, ports, and admin origins.
 */
export function isValidCanonicalUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();

  // Root-relative path is valid
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    // 1. Must be http or https
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    // 2. Reject localhost or loopback
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".localhost")
    ) {
      return false;
    }
    // 3. Reject non-standard ports (e.g. 5173, 5174, 5000, 3000)
    if (parsed.port && parsed.port !== "80" && parsed.port !== "443") {
      return false;
    }
    // 4. Reject admin domains
    if (hostname.includes("admin")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Standard category titles for fallbacks
 */
export const CATEGORY_TITLE_MAP = {
  puja: "Vedic Puja",
  yagya: "Multi-Day Vedic Yagya",
  homa: "Vedic Homa & Havan",
  japa: "Vedic Mantra Japa",
  path: "Vedic Path & Recitation",
};

/**
 * Service-specific descriptive fallback sentences
 */
export const SERVICE_TYPE_FALLBACK_DESCRIPTIONS = {
  puja: (name) =>
    `Book authentic ${name} conducted by Vedic Acharyas in Kashi with traditional Sankalpa, sacred rituals, and blessed prasad delivery.`,
  yagya: (name) =>
    `Participate in multi-day ${name} performed in Kashi with sacred samagri, disciplined Ahutis, and Vedic Vidhi for spiritual elevation.`,
  homa: (name) =>
    `Sacred ${name} Vedic fire sacrifice with authentic Ahutis, pure cow ghee, and sacred samidha performed in Kashi or remotely.`,
  japa: (name) =>
    `Initiate disciplined ${name} chanting with consecrated Rudraksha malas and Acharya supervision in Kashi or remotely.`,
  path: (name) =>
    `Structured ${name} scripture recitation by Vedic scholars with sacred Sankalpa and traditional vidhi in Kashi or remotely.`,
};

/**
 * Resolves all SEO fields consistently for both component and testing.
 */
export function resolveSeoValues({
  service,
  serviceType = "puja",
  categoryTitle,
  overrideTitle,
  overrideDescription,
  overrideCanonical,
  env = {},
}) {
  const seo = service?.seo || {};
  const serviceName = service?.name ? String(service.name).trim() : "";
  const catTitle = categoryTitle || CATEGORY_TITLE_MAP[serviceType] || "Vedic Ritual";

  // 1. Effective Title
  let title = overrideTitle || seo.title;
  if (!title || !title.trim()) {
    title = serviceName
      ? `${serviceName} | ${catTitle} | Veda Structure`
      : "Veda Structure • Sacred Vedic Ceremonies in Kashi";
  } else {
    title = title.trim();
  }

  // 2. Effective Description
  let description = overrideDescription || seo.description;
  if (!description || !description.trim()) {
    const rawDesc = cleanText(service?.shortDescription || service?.description || service?.fullDescription);
    if (rawDesc) {
      description = rawDesc.length > 160 ? `${rawDesc.slice(0, 157).trim()}...` : rawDesc;
    } else if (serviceName && SERVICE_TYPE_FALLBACK_DESCRIPTIONS[serviceType]) {
      description = SERVICE_TYPE_FALLBACK_DESCRIPTIONS[serviceType](serviceName);
    } else {
      description = "Authentic Vedic pujas, yagyas, homas, and ritual recitations conducted in the holy city of Kashi.";
    }
  } else {
    description = description.trim();
  }

  // 3. Keywords
  let keywordsString = "";
  if (Array.isArray(seo.keywords) && seo.keywords.length > 0) {
    keywordsString = seo.keywords.map((k) => String(k).trim()).filter(Boolean).join(", ");
  } else if (typeof seo.keywords === "string" && seo.keywords.trim()) {
    keywordsString = seo.keywords.trim();
  }

  // 4. Safe Production Origin & Canonical URL
  const defaultProductionOrigin = "https://vedastructure.com";
  let configuredOrigin = (env?.siteUrl || (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) || "").trim().replace(/\/+$/, "");
  let safeOrigin = defaultProductionOrigin;
  if (configuredOrigin && isValidCanonicalUrl(configuredOrigin)) {
    try {
      const parsed = new URL(configuredOrigin);
      safeOrigin = `${parsed.protocol}//${parsed.host}`;
    } catch {
      safeOrigin = defaultProductionOrigin;
    }
  }

  let canonicalUrl = null;
  const rawCustomCanonical = overrideCanonical || seo.canonicalUrl;
  if (rawCustomCanonical && typeof rawCustomCanonical === "string" && isValidCanonicalUrl(rawCustomCanonical)) {
    const trimmed = rawCustomCanonical.trim();
    if (trimmed.startsWith("/")) {
      canonicalUrl = `${safeOrigin}${trimmed}`;
    } else {
      canonicalUrl = trimmed;
    }
  } else if (service?.slug) {
    const relativePath = `/yagya-puja/${serviceType}/${service.slug}`;
    canonicalUrl = `${safeOrigin}${relativePath}`;
  }

  // 5. Robots directives (preserving explicit boolean false)
  let robotsIndex = true;
  if (seo.robotsIndex !== undefined && seo.robotsIndex !== null) {
    robotsIndex = seo.robotsIndex === false || seo.robotsIndex === "false" || seo.robotsIndex === 0 ? false : true;
  }
  let robotsFollow = true;
  if (seo.robotsFollow !== undefined && seo.robotsFollow !== null) {
    robotsFollow = seo.robotsFollow === false || seo.robotsFollow === "false" || seo.robotsFollow === 0 ? false : true;
  }
  const robotsContent = `${robotsIndex ? "index" : "noindex"}, ${robotsFollow ? "follow" : "nofollow"}`;

  // 6. Open Graph & Social metadata
  const ogTitle = seo.ogTitle?.trim() || title;
  const ogDescription = seo.ogDescription?.trim() || description;
  const ogImage = seo.ogImage?.trim() || service?.bannerImage || service?.image || service?.images?.[0] || null;

  return {
    title,
    description,
    keywordsString,
    canonicalUrl,
    robotsIndex,
    robotsFollow,
    robotsContent,
    ogTitle,
    ogDescription,
    ogImage,
  };
}
