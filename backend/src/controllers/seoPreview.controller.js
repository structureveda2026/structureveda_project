import {
  PujaService,
  YagyaService,
  HomaService,
  JapaService,
  PathService,
} from "../models/index.js";

const VALID_SERVICE_TYPES = ["puja", "yagya", "homa", "japa", "path"];
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
const PRODUCTION_ORIGIN = "https://vedastructure.com";

const CATEGORY_TITLE_MAP = {
  puja: "Vedic Puja",
  yagya: "Multi-Day Vedic Yagya",
  homa: "Vedic Homa & Havan",
  japa: "Vedic Mantra Japa",
  path: "Vedic Path & Recitation",
};

const SERVICE_TYPE_FALLBACK_DESCRIPTIONS = {
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

function cleanText(input) {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[*_#`~[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(unsafe) {
  if (!unsafe || typeof unsafe !== "string") return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidCanonicalUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host.includes("admin")) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Controller handler: GET /api/seo/crawler-preview?type=:type&slug=:slug
 * Renders service-specific Open Graph and Twitter Card HTML for social crawlers.
 */
export const getCrawlerPreview = async (req, res) => {
  try {
    const rawType = String(req.query.type || "").trim().toLowerCase();
    const rawSlug = String(req.query.slug || "").trim().toLowerCase();

    // 1. Strict validation of input parameters (Prevents SSRF and Injection)
    if (!VALID_SERVICE_TYPES.includes(rawType) || !SLUG_REGEX.test(rawSlug)) {
      return res.status(400).send(renderDefaultHtml("Invalid service parameters"));
    }

    // 2. Query internal database model directly
    let serviceRecord = null;
    if (rawType === "puja") {
      serviceRecord = await PujaService.findOne({ where: { slug: rawSlug, isActive: true } });
    } else if (rawType === "yagya") {
      serviceRecord = await YagyaService.findOne({ where: { slug: rawSlug, isActive: true } });
    } else if (rawType === "homa") {
      serviceRecord = await HomaService.findOne({ where: { slug: rawSlug, isActive: true } });
    } else if (rawType === "japa") {
      serviceRecord = await JapaService.findOne({ where: { slug: rawSlug, isActive: true } });
    } else if (rawType === "path") {
      serviceRecord = await PathService.findOne({ where: { slug: rawSlug, isActive: true } });
    }

    if (!serviceRecord) {
      return res.status(404).send(renderNotFoundHtml());
    }

    // 3. Resolve Standardized SEO Metadata
    const seo = serviceRecord.seo || {};
    const serviceName = serviceRecord.name ? String(serviceRecord.name).trim() : "";
    const catTitle = CATEGORY_TITLE_MAP[rawType] || "Vedic Ritual";

    // Title
    let title = seo.title?.trim();
    if (!title) {
      title = serviceName
        ? `${serviceName} | ${catTitle} | Veda Structure`
        : "Veda Structure • Sacred Vedic Ceremonies in Kashi";
    }

    // Description
    let description = seo.description?.trim();
    if (!description) {
      const rawDesc = cleanText(serviceRecord.shortDescription || serviceRecord.description || serviceRecord.fullDescription);
      if (rawDesc) {
        description = rawDesc.length > 160 ? `${rawDesc.slice(0, 157).trim()}...` : rawDesc;
      } else if (serviceName && SERVICE_TYPE_FALLBACK_DESCRIPTIONS[rawType]) {
        description = SERVICE_TYPE_FALLBACK_DESCRIPTIONS[rawType](serviceName);
      } else {
        description = "Authentic Vedic pujas, yagyas, homas, and ritual recitations conducted in the holy city of Kashi.";
      }
    }

    // Canonical URL
    let canonicalUrl = `${PRODUCTION_ORIGIN}/yagya-puja/${rawType}/${rawSlug}`;
    if (seo.canonicalUrl && typeof seo.canonicalUrl === "string" && isValidCanonicalUrl(seo.canonicalUrl)) {
      const trimmed = seo.canonicalUrl.trim();
      if (trimmed.startsWith("/")) {
        canonicalUrl = `${PRODUCTION_ORIGIN}${trimmed}`;
      } else {
        try {
          const parsed = new URL(trimmed);
          if (parsed.hostname.toLowerCase().includes("vedastructure.com")) {
            canonicalUrl = trimmed;
          }
        } catch {
          // keep fallback
        }
      }
    }

    // Robots directives (preserving explicit boolean false)
    let robotsIndex = true;
    if (seo.robotsIndex !== undefined && seo.robotsIndex !== null) {
      robotsIndex = seo.robotsIndex === false || seo.robotsIndex === "false" || seo.robotsIndex === 0 ? false : true;
    }
    let robotsFollow = true;
    if (seo.robotsFollow !== undefined && seo.robotsFollow !== null) {
      robotsFollow = seo.robotsFollow === false || seo.robotsFollow === "false" || seo.robotsFollow === 0 ? false : true;
    }
    const robotsContent = `${robotsIndex ? "index" : "noindex"}, ${robotsFollow ? "follow" : "nofollow"}`;

    // Open Graph
    const ogTitle = seo.ogTitle?.trim() || title;
    const ogDescription = seo.ogDescription?.trim() || description;
    const ogImage = seo.ogImage?.trim() || serviceRecord.bannerImage || null;

    // 4. Generate Pre-rendered HTML
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="${escapeHtml(robotsContent)}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />

    <!-- Open Graph Metadata -->
    <meta property="og:title" content="${escapeHtml(ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(ogDescription)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Veda Structure" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    ${ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}" />` : ""}

    <!-- Twitter Card Metadata -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(ogTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(ogDescription)}" />
    ${ogImage ? `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />` : ""}
  </head>
  <body>
    <article>
      <h1>${escapeHtml(serviceName)}</h1>
      <p>${escapeHtml(description)}</p>
      ${ogImage ? `<img src="${escapeHtml(ogImage)}" alt="${escapeHtml(serviceName)}" />` : ""}
    </article>
    <script>
      // Seamlessly redirect browsers that inadvertently reach the crawler endpoint to the SPA
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/api/seo/crawler-preview")) {
        window.location.replace("${escapeHtml(canonicalUrl)}");
      }
    </script>
  </body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=600, s-maxage=600");
    return res.status(200).send(html);
  } catch (error) {
    console.error("Error generating crawler preview:", error);
    return res.status(500).send(renderDefaultHtml("Internal server error"));
  }
};

function renderDefaultHtml(reason = "") {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Veda Structure • Sacred Vedic Ceremonies in Kashi</title>
    <meta name="description" content="Discover and book authentic Vedic Pujas, Yagyas, Homas, Mantra Japas, and Scripture Recitations performed in the sacred city of Kashi." />
    <meta name="robots" content="noindex, follow" />
  </head>
  <body>
    <h1>Veda Structure</h1>
    <p>Sacred Vedic Ceremonies in Kashi</p>
  </body>
</html>`;
}

function renderNotFoundHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Service Not Found • Veda Structure</title>
    <meta name="robots" content="noindex, nofollow" />
  </head>
  <body>
    <h1>Service Not Found</h1>
    <p>The requested Vedic ceremony could not be found or is currently inactive.</p>
  </body>
</html>`;
}
