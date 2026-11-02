import { useEffect } from "react";
import { resolveSeoValues } from "./seoUtils.js";

export {
  cleanText,
  isValidCanonicalUrl,
  CATEGORY_TITLE_MAP,
  SERVICE_TYPE_FALLBACK_DESCRIPTIONS,
  resolveSeoValues,
} from "./seoUtils.js";

/**
 * Authoritative PublicSEO component.
 * Uses a single, deterministic DOM synchronization strategy via useEffect.
 * Completely eliminates tag duplication by avoiding React 19 JSX head hoisting.
 * Guarantees exactly one title, one description, one canonical, and one set of
 * social metadata in document.head, with thorough cleanup on unmount/navigation.
 */
export default function PublicSEO({
  service,
  serviceType = "puja",
  categoryTitle,
  overrideTitle,
  overrideDescription,
  overrideCanonical,
}) {
  const {
    title,
    description,
    keywordsString,
    canonicalUrl,
    robotsContent,
    ogTitle,
    ogDescription,
    ogImage,
  } = resolveSeoValues({
    service,
    serviceType,
    categoryTitle,
    overrideTitle,
    overrideDescription,
    overrideCanonical,
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

    // A. Title management
    const originalTitle = document.title;
    document.title = title;

    // Helper: set or update a meta tag
    const setMetaTag = (attributeName, attributeValue, content) => {
      const existing = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!content) {
        if (existing && existing.getAttribute("data-veda-seo") === "true") {
          existing.remove();
        }
        return;
      }
      if (existing) {
        // Backup baseline content if not already backed up
        if (!existing.hasAttribute("data-baseline-content") && !existing.hasAttribute("data-veda-seo")) {
          existing.setAttribute("data-baseline-content", existing.getAttribute("content") || "");
        }
        existing.setAttribute("content", content);
        existing.setAttribute("data-veda-seo", "true");
      } else {
        const element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        element.setAttribute("content", content);
        element.setAttribute("data-veda-seo", "true");
        document.head.appendChild(element);
      }
    };

    // Helper: set or update a link tag (ensuring exactly one canonical link)
    const setLinkTag = (rel, href) => {
      const existingLinks = document.querySelectorAll(`link[rel="${rel}"]`);
      if (!href) {
        existingLinks.forEach((el) => {
          if (el.getAttribute("data-veda-seo") === "true") el.remove();
        });
        return;
      }
      if (existingLinks.length > 0) {
        const primary = existingLinks[0];
        primary.setAttribute("href", href);
        primary.setAttribute("data-veda-seo", "true");
        // Remove redundant duplicate link tags
        for (let i = 1; i < existingLinks.length; i++) {
          existingLinks[i].remove();
        }
      } else {
        const element = document.createElement("link");
        element.setAttribute("rel", rel);
        element.setAttribute("href", href);
        element.setAttribute("data-veda-seo", "true");
        document.head.appendChild(element);
      }
    };

    // 1. Standard Meta Tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywordsString || null);
    setMetaTag("name", "robots", robotsContent);

    // 2. Canonical Link
    setLinkTag("canonical", canonicalUrl);

    // 3. Open Graph Tags
    setMetaTag("property", "og:title", ogTitle);
    setMetaTag("property", "og:description", ogDescription);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:site_name", "Veda Structure");
    setMetaTag("property", "og:url", canonicalUrl || null);
    setMetaTag("property", "og:image", ogImage || null);

    // 4. Twitter Card Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", ogTitle);
    setMetaTag("name", "twitter:description", ogDescription);
    setMetaTag("name", "twitter:image", ogImage || null);

    // Cleanup on unmount or route change to prevent stale metadata leaks
    return () => {
      document.title = originalTitle || "Veda Structure • Authentic Vedic Rituals & Ceremonies in Kashi";

      // Restore baseline meta tags if modified
      const baselineTags = document.querySelectorAll("[data-baseline-content]");
      baselineTags.forEach((tag) => {
        tag.setAttribute("content", tag.getAttribute("data-baseline-content") || "");
        tag.removeAttribute("data-baseline-content");
        tag.removeAttribute("data-veda-seo");
      });

      // Remove all dynamic Veda SEO tags
      const dynamicTags = document.querySelectorAll('[data-veda-seo="true"]');
      dynamicTags.forEach((tag) => tag.remove());
    };
  }, [
    title,
    description,
    keywordsString,
    canonicalUrl,
    robotsContent,
    ogTitle,
    ogDescription,
    ogImage,
  ]);

  // Returning null avoids competing React 19 JSX head tag hoisting,
  // preventing all duplicate meta/link/title tags in the browser DOM.
  return null;
}
