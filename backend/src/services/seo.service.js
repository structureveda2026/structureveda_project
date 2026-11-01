/**
 * Shared SEO Service for Veda Structure
 * 
 * Provides unified validation, normalization, merging, and fallback generation
 * across all ritual service types (Puja, Yagya, Homa, Japa, Path).
 */

const ABSOLUTE_URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

/**
 * Normalizes keywords input into a clean string array.
 * Supports array of strings or comma-separated string.
 *
 * @param {string[]|string|unknown} input
 * @returns {string[]}
 */
export const normalizeKeywords = (input) => {
  if (Array.isArray(input)) {
    const cleaned = input
      .map((k) => (typeof k === "string" ? k.trim() : String(k || "").trim()))
      .filter((k) => k.length > 0);
    return Array.from(new Set(cleaned));
  }

  if (typeof input === "string") {
    const cleaned = input
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    return Array.from(new Set(cleaned));
  }

  return [];
};

/**
 * Validates incoming SEO payload.
 *
 * @param {unknown} input
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateSeoInput = (input) => {
  if (input === null || typeof input === "undefined") {
    return { valid: true };
  }

  if (typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, message: "seo must be a valid object." };
  }

  // Canonical URL validation
  const canonicalUrl = input.canonicalUrl ?? input.canonical_url;
  if (canonicalUrl !== null && typeof canonicalUrl !== "undefined" && String(canonicalUrl).trim() !== "") {
    if (typeof canonicalUrl !== "string" || !ABSOLUTE_URL_REGEX.test(canonicalUrl.trim())) {
      return {
        valid: false,
        message: "canonicalUrl must be a valid absolute URL starting with http:// or https://.",
      };
    }
  }

  // Open Graph Image validation
  const ogImage = input.ogImage ?? input.og_image;
  if (ogImage !== null && typeof ogImage !== "undefined" && String(ogImage).trim() !== "") {
    if (typeof ogImage !== "string") {
      return { valid: false, message: "ogImage must be a valid string URL or null." };
    }
    if (ogImage.startsWith("data:")) {
      return {
        valid: false,
        message: "Base64 image data is not allowed for ogImage. Upload through media upload first.",
      };
    }
  }

  // Robots booleans validation
  const robotsIndex = input.robotsIndex ?? input.robots_index;
  if (typeof robotsIndex !== "undefined" && robotsIndex !== null) {
    if (typeof robotsIndex !== "boolean" && robotsIndex !== "true" && robotsIndex !== "false") {
      return { valid: false, message: "robotsIndex must be a boolean (true or false)." };
    }
  }

  const robotsFollow = input.robotsFollow ?? input.robots_follow;
  if (typeof robotsFollow !== "undefined" && robotsFollow !== null) {
    if (typeof robotsFollow !== "boolean" && robotsFollow !== "true" && robotsFollow !== "false") {
      return { valid: false, message: "robotsFollow must be a boolean (true or false)." };
    }
  }

  return { valid: true };
};

/**
 * Normalizes an SEO object into standard camelCase structure.
 * Respects legacy aliases (metaTitle, metaDescription, metaKeywords, snake_case).
 *
 * @param {Record<string, unknown>|null|undefined} input
 * @returns {Record<string, unknown>}
 */
export const normalizeSeo = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {};
  }

  const normalized = {};

  // Title (with aliases)
  const rawTitle = input.title ?? input.metaTitle ?? input.meta_title ?? input.seoTitle;
  if (typeof rawTitle === "string" && rawTitle.trim() !== "") {
    normalized.title = rawTitle.trim().slice(0, 200);
  }

  // Description (with aliases)
  const rawDescription = input.description ?? input.metaDescription ?? input.meta_description ?? input.seoDescription;
  if (typeof rawDescription === "string" && rawDescription.trim() !== "") {
    normalized.description = rawDescription.trim().slice(0, 1000);
  }

  // Focus Keyword
  const rawFocusKeyword = input.focusKeyword ?? input.focus_keyword;
  if (typeof rawFocusKeyword === "string" && rawFocusKeyword.trim() !== "") {
    normalized.focusKeyword = rawFocusKeyword.trim().slice(0, 150);
  }

  // Keywords (with aliases)
  const rawKeywords = input.keywords ?? input.metaKeywords ?? input.meta_keywords ?? input.seoKeywords;
  if (typeof rawKeywords !== "undefined" && rawKeywords !== null) {
    const cleanedKeywords = normalizeKeywords(rawKeywords);
    if (cleanedKeywords.length > 0) {
      normalized.keywords = cleanedKeywords;
    }
  }

  // Canonical URL
  const rawCanonicalUrl = input.canonicalUrl ?? input.canonical_url;
  if (typeof rawCanonicalUrl === "string" && rawCanonicalUrl.trim() !== "") {
    normalized.canonicalUrl = rawCanonicalUrl.trim();
  }

  // Robots directives
  const rawRobotsIndex = input.robotsIndex ?? input.robots_index;
  if (typeof rawRobotsIndex !== "undefined" && rawRobotsIndex !== null) {
    normalized.robotsIndex = typeof rawRobotsIndex === "boolean" ? rawRobotsIndex : rawRobotsIndex === "true";
  }

  const rawRobotsFollow = input.robotsFollow ?? input.robots_follow;
  if (typeof rawRobotsFollow !== "undefined" && rawRobotsFollow !== null) {
    normalized.robotsFollow = typeof rawRobotsFollow === "boolean" ? rawRobotsFollow : rawRobotsFollow === "true";
  }

  // Open Graph Title
  const rawOgTitle = input.ogTitle ?? input.og_title;
  if (typeof rawOgTitle === "string" && rawOgTitle.trim() !== "") {
    normalized.ogTitle = rawOgTitle.trim().slice(0, 200);
  }

  // Open Graph Description
  const rawOgDescription = input.ogDescription ?? input.og_description;
  if (typeof rawOgDescription === "string" && rawOgDescription.trim() !== "") {
    normalized.ogDescription = rawOgDescription.trim().slice(0, 1000);
  }

  // Open Graph Image
  const rawOgImage = input.ogImage ?? input.og_image;
  if (typeof rawOgImage === "string" && rawOgImage.trim() !== "") {
    normalized.ogImage = rawOgImage.trim();
  }

  return normalized;
};

/**
 * Merges incoming partial SEO updates with existing stored SEO metadata.
 * Preserves unmentioned existing properties.
 * Allows explicitly clearing properties by passing null or empty string.
 *
 * @param {Record<string, unknown>|null|undefined} existingSeo
 * @param {Record<string, unknown>|null|undefined} incomingSeo
 * @returns {Record<string, unknown>}
 */
export const mergeSeo = (existingSeo, incomingSeo) => {
  if (typeof incomingSeo === "undefined") {
    return existingSeo && typeof existingSeo === "object" ? { ...existingSeo } : {};
  }

  if (incomingSeo === null || (typeof incomingSeo === "object" && Object.keys(incomingSeo).length === 0)) {
    // If incoming explicitly passed as empty object {} or null, return empty or keep existing?
    // In REST updates, passing {} can mean clear or empty. But if caller passed {}, return {}
    return incomingSeo === null ? {} : {};
  }

  const base = existingSeo && typeof existingSeo === "object" && !Array.isArray(existingSeo)
    ? { ...existingSeo }
    : {};

  // For each potential key, check if incoming provided a new value or clear
  const checkFields = [
    { incomingKeys: ["title", "metaTitle", "meta_title", "seoTitle"], targetKey: "title" },
    { incomingKeys: ["description", "metaDescription", "meta_description", "seoDescription"], targetKey: "description" },
    { incomingKeys: ["focusKeyword", "focus_keyword"], targetKey: "focusKeyword" },
    { incomingKeys: ["keywords", "metaKeywords", "meta_keywords", "seoKeywords"], targetKey: "keywords", isArray: true },
    { incomingKeys: ["canonicalUrl", "canonical_url"], targetKey: "canonicalUrl" },
    { incomingKeys: ["robotsIndex", "robots_index"], targetKey: "robotsIndex", isBool: true },
    { incomingKeys: ["robotsFollow", "robots_follow"], targetKey: "robotsFollow", isBool: true },
    { incomingKeys: ["ogTitle", "og_title"], targetKey: "ogTitle" },
    { incomingKeys: ["ogDescription", "og_description"], targetKey: "ogDescription" },
    { incomingKeys: ["ogImage", "og_image"], targetKey: "ogImage" },
  ];

  for (const field of checkFields) {
    let found = false;
    let rawVal;

    for (const key of field.incomingKeys) {
      if (key in incomingSeo) {
        found = true;
        rawVal = incomingSeo[key];
        break;
      }
    }

    if (found) {
      if (rawVal === null || rawVal === "") {
        delete base[field.targetKey];
      } else if (field.isArray) {
        const cleaned = normalizeKeywords(rawVal);
        if (cleaned.length > 0) {
          base[field.targetKey] = cleaned;
        } else {
          delete base[field.targetKey];
        }
      } else if (field.isBool) {
        base[field.targetKey] = typeof rawVal === "boolean" ? rawVal : rawVal === "true";
      } else if (typeof rawVal === "string" && rawVal.trim() !== "") {
        base[field.targetKey] = rawVal.trim();
      }
    }
  }

  return base;
};

/**
 * Generates fallback SEO metadata for public views when admin has not entered custom values.
 *
 * @param {Record<string, unknown>} service
 * @param {string} [serviceType="puja"]
 * @returns {Record<string, unknown>}
 */
export const generateFallbackSeo = (service, serviceType = "puja") => {
  if (!service) return {};

  const name = service.name || "";
  const shortDesc = service.shortDescription || service.description || "";
  const slug = service.slug || "";
  const banner = service.bannerImage || null;

  return {
    title: name ? `${name} | Veda Structure` : "Veda Structure Ritual",
    description: shortDesc.slice(0, 160),
    canonicalUrl: slug ? `/yagya-puja/${serviceType}/${slug}` : null,
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: name ? `${name} | Veda Structure` : "Veda Structure Ritual",
    ogDescription: shortDesc.slice(0, 200),
    ogImage: banner,
  };
};
