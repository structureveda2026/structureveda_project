/**
 * Helper utilities for Library / Blog Module
 */

/**
 * Sanitizes a string into a clean, URL-safe slug
 */
export const sanitizeSlug = (str) => {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Calculates estimated reading time from HTML / text content
 * Assumes average reading speed of 200 words per minute
 */
export const calculateReadTime = (content) => {
  if (!content) return "1 min read";
  const plainText = String(content)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = plainText ? plainText.split(" ").length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

/**
 * Extracts a clean plain-text excerpt from HTML content
 */
export const extractExcerpt = (content, maxLength = 160) => {
  if (!content) return "";
  const plainText = String(content)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + "...";
};

/**
 * Normalizes tags from array or comma-separated string
 */
export const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .map((t) => String(t).trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);
  }
  return [];
};

/**
 * Validates and sanitizes SEO metadata
 */
export const sanitizeSEO = ({ metaTitle, metaDescription, metaKeywords, title, excerpt }) => {
  const finalMetaTitle = metaTitle?.trim() || title?.trim() || "";
  const finalMetaDesc = metaDescription?.trim() || excerpt?.trim() || "";
  const finalKeywords = normalizeTags(metaKeywords);

  return {
    metaTitle: finalMetaTitle.substring(0, 300),
    metaDescription: finalMetaDesc.substring(0, 500),
    metaKeywords: finalKeywords,
  };
};

export default {
  sanitizeSlug,
  calculateReadTime,
  extractExcerpt,
  normalizeTags,
  sanitizeSEO,
};
