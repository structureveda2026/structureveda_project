import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTION_ORIGIN = "https://vedastructure.com";
const OUTPUT_PATH = path.resolve(__dirname, "../public/sitemap.xml");

function fetchUrl(targetUrl) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const client = parsed.protocol === "https:" ? https : http;
    const req = client.get(targetUrl, { timeout: 5000 }, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`HTTP ${res.statusCode} from ${targetUrl}`));
      }
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => resolve(body));
    });
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${targetUrl}`));
    });
  });
}

function escapeXml(unsafe) {
  if (!unsafe || typeof unsafe !== "string") return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function run() {
  console.log("Generating sitemap.xml...");

  // 1. Try to fetch dynamic sitemap from local or production backend
  const apiUrl = process.env.VITE_API_URL || "http://localhost:5000/api";
  const directSitemapEndpoints = [
    apiUrl.replace(/\/api\/?$/, "/api/sitemap.xml"),
    apiUrl.replace(/\/api\/?$/, "/sitemap.xml"),
    "http://localhost:5000/api/sitemap.xml",
    "http://localhost:5000/sitemap.xml",
  ];

  for (const endpoint of directSitemapEndpoints) {
    try {
      const xml = await fetchUrl(endpoint);
      if (xml && xml.includes("<urlset") && xml.includes("</urlset>")) {
        fs.writeFileSync(OUTPUT_PATH, xml, "utf8");
        console.log(`[SUCCESS] Generated sitemap.xml from endpoint: ${endpoint}`);
        return;
      }
    } catch (err) {
      // try next endpoint
    }
  }

  // 2. Fallback: Query catalogue endpoints with limit <= 100
  console.log("Direct sitemap endpoint not reached, falling back to paginated public catalogue queries...");
  const serviceTypes = ["puja", "yagya", "homa", "japa", "path"];
  const serviceUrls = [];
  const now = new Date().toISOString().split("T")[0];

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

  const seenUrls = new Set(staticUrls.map((u) => u.loc));

  for (const type of serviceTypes) {
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      try {
        const catalogueUrl = `${apiUrl}/${type}-services?page=${page}&limit=50`;
        const rawJson = await fetchUrl(catalogueUrl);
        const parsed = JSON.parse(rawJson);
        const items = parsed.data || [];
        totalPages = parsed.totalPages || 1;

        for (const item of items) {
          if (!item.slug) continue;
          if (item.seo?.robotsIndex === false) continue;

          const targetUrl = `${PRODUCTION_ORIGIN}/yagya-puja/${type}/${item.slug}`;
          if (seenUrls.has(targetUrl)) continue;
          seenUrls.add(targetUrl);

          serviceUrls.push({
            loc: targetUrl,
            lastmod: now,
            changefreq: "weekly",
            priority: "0.7",
          });
        }
      } catch (e) {
        console.warn(`[WARN] Could not fetch catalogue for ${type} (page ${page}): ${e.message}`);
        break;
      }
      page++;
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

  fs.writeFileSync(OUTPUT_PATH, xml, "utf8");
  console.log(`[SUCCESS] Wrote fallback sitemap.xml with ${allUrls.length} URLs to ${OUTPUT_PATH}`);
}

run().catch((err) => {
  console.error("[ERROR] Failed to generate sitemap.xml:", err);
  process.exit(1);
});
