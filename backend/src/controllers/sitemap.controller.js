import {
  PujaService,
  YagyaService,
  HomaService,
  JapaService,
  PathService,
} from "../models/index.js";

/**
 * Escapes characters for XML compliance
 */
export function escapeXml(unsafe) {
  if (!unsafe || typeof unsafe !== "string") return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Validates canonical URL for sitemap.
 * Accepts safe absolute URLs or root-relative paths.
 * Rejects localhost, admin, and invalid protocols.
 */
export function isValidSitemapUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".localhost") ||
      hostname.includes("admin")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

const PRODUCTION_ORIGIN = "https://vedastructure.com";

// In-memory cache for generated sitemap XML (15 minutes TTL)
let sitemapCache = {
  xml: null,
  timestamp: 0,
};
const CACHE_TTL_MS = 15 * 60 * 1000;

/**
 * Generates sitemap XML from database records
 */
export async function buildSitemapXml() {
  const now = new Date().toISOString().split("T")[0];

  // 1. Static Core Pages
  const staticUrls = [
    { loc: `${PRODUCTION_ORIGIN}/`, lastmod: now, changefreq: "daily", priority: "1.0" },
    { loc: `${PRODUCTION_ORIGIN}/yagya-puja`, lastmod: now, changefreq: "daily", priority: "0.9" },
    { loc: `${PRODUCTION_ORIGIN}/yagya-puja/puja`, lastmod: now, changefreq: "daily", priority: "0.8" },
    { loc: `${PRODUCTION_ORIGIN}/yagya-puja/yagya`, lastmod: now, changefreq: "daily", priority: "0.8" },
    { loc: `${PRODUCTION_ORIGIN}/yagya-puja/homa`, lastmod: now, changefreq: "daily", priority: "0.8" },
    { loc: `${PRODUCTION_ORIGIN}/yagya-puja/japa`, lastmod: now, changefreq: "daily", priority: "0.8" },
    { loc: `${PRODUCTION_ORIGIN}/yagya-puja/path`, lastmod: now, changefreq: "daily", priority: "0.8" },
    { loc: `${PRODUCTION_ORIGIN}/yagya-puja/kashi`, lastmod: now, changefreq: "weekly", priority: "0.8" },
  ];

  // 2. Fetch Active Services for all 5 categories in parallel
  const [pujaServices, yagyaServices, homaServices, japaServices, pathServices] = await Promise.all([
    PujaService.findAll({
      where: { isActive: true },
      attributes: ["id", "slug", "name", "seo"],
    }),
    YagyaService.findAll({
      where: { isActive: true },
      attributes: ["id", "slug", "name", "seo"],
    }),
    HomaService.findAll({
      where: { isActive: true },
      attributes: ["id", "slug", "name", "seo"],
    }),
    JapaService.findAll({
      where: { isActive: true },
      attributes: ["id", "slug", "name", "seo"],
    }),
    PathService.findAll({
      where: { isActive: true },
      attributes: ["id", "slug", "name", "seo"],
    }),
  ]);

  const serviceCategories = [
    { type: "puja", list: pujaServices },
    { type: "yagya", list: yagyaServices },
    { type: "homa", list: homaServices },
    { type: "japa", list: japaServices },
    { type: "path", list: pathServices },
  ];

  const serviceUrls = [];
  const seenUrls = new Set(staticUrls.map((u) => u.loc));

  for (const { type, list } of serviceCategories) {
    for (const item of list) {
      if (!item.slug || typeof item.slug !== "string") continue;
      const seo = item.seo || {};

      // Exclude services explicitly marked with robotsIndex = false
      if (seo.robotsIndex === false || seo.robotsIndex === "false" || seo.robotsIndex === 0) {
        continue;
      }

      // Canonical URL resolution
      let targetUrl = `${PRODUCTION_ORIGIN}/yagya-puja/${type}/${item.slug.trim()}`;
      if (seo.canonicalUrl && typeof seo.canonicalUrl === "string" && isValidSitemapUrl(seo.canonicalUrl)) {
        const trimmed = seo.canonicalUrl.trim();
        if (trimmed.startsWith("/")) {
          targetUrl = `${PRODUCTION_ORIGIN}${trimmed}`;
        } else {
          // If valid absolute URL, ensure it points to the production site
          try {
            const parsed = new URL(trimmed);
            if (parsed.hostname.toLowerCase() === "vedastructure.com" || parsed.hostname.toLowerCase().endsWith(".vedastructure.com")) {
              targetUrl = trimmed;
            }
          } catch {
            // keep targetUrl fallback
          }
        }
      }

      if (seenUrls.has(targetUrl)) continue;
      seenUrls.add(targetUrl);

      const lastmodDate = item.updatedAt ? new Date(item.updatedAt).toISOString().split("T")[0] : now;

      serviceUrls.push({
        loc: targetUrl,
        lastmod: lastmodDate,
        changefreq: "weekly",
        priority: "0.7",
      });
    }
  }

  const allUrls = [...staticUrls, ...serviceUrls];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const entry of allUrls) {
    xml += "  <url>\n";
    xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
    xml += `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n`;
    xml += `    <changefreq>${escapeXml(entry.changefreq)}</changefreq>\n`;
    xml += `    <priority>${escapeXml(entry.priority)}</priority>\n`;
    xml += "  </url>\n";
  }

  xml += "</urlset>\n";
  return { xml, totalUrls: allUrls.length, serviceUrlsCount: serviceUrls.length };
}

/**
 * Controller handler: GET /sitemap.xml or GET /api/sitemap.xml
 */
export const getSitemapXml = async (req, res) => {
  try {
    const isCacheValid = sitemapCache.xml && Date.now() - sitemapCache.timestamp < CACHE_TTL_MS;
    if (isCacheValid) {
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
      res.setHeader("X-Sitemap-Source", "cache");
      return res.status(200).send(sitemapCache.xml);
    }

    const { xml, totalUrls } = await buildSitemapXml();

    sitemapCache = {
      xml,
      timestamp: Date.now(),
    };

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.setHeader("X-Sitemap-Total-Urls", String(totalUrls));
    res.setHeader("X-Sitemap-Source", "database");
    return res.status(200).send(xml);
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate sitemap.xml. Database retrieval error.",
    });
  }
};
