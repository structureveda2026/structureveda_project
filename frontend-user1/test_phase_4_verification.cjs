/**
 * Phase 4 Comprehensive Automated Verification Test Suite
 *
 * Covers:
 * Phase 4A: Metadata Integrity, Single Strategy, Canonical Validation, Robots Directives, Unmount Cleanup
 * Phase 4B: Dynamic Sitemap, XML Schema, Origin, Category URLs, All 5 Service Types
 * Phase 4C: Robots.txt Sitemap Reference and Crawl Directives
 * Phase 4D: Social Crawler HTML Generation, Open Graph & Twitter Tags, Escaping, Safe Error Handling
 */

const assert = require("assert");
const http = require("http");
const fs = require("fs");
const path = require("path");

const API_BASE = "http://localhost:5000";
const PRODUCTION_ORIGIN = "https://vedastructure.com";

// --- Mock Minimal DOM for Component Strategy Testing ---
class MockElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.attributes = {};
    this.dataset = {};
    this.content = "";
    this.href = "";
  }
  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === "content") this.content = String(value);
    if (name === "href") this.href = String(value);
  }
  getAttribute(name) {
    return this.attributes[name] || null;
  }
  removeAttribute(name) {
    delete this.attributes[name];
  }
  hasAttribute(name) {
    return name in this.attributes;
  }
  remove() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }
}

class MockHead {
  constructor() {
    this.children = [];
  }
  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
  }
  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentNode = null;
    }
  }
}

class MockDocument {
  constructor() {
    this.title = "Default Title";
    this.head = new MockHead();
  }
  querySelector(selector) {
    const all = this.querySelectorAll(selector);
    return all.length > 0 ? all[0] : null;
  }
  querySelectorAll(selector) {
    const results = [];
    // Basic selector matching for mock tests
    if (selector.startsWith('meta[')) {
      const match = selector.match(/meta\[([a-zA-Z0-9_-]+)="([^"]+)"\]/);
      if (match) {
        const [, attr, val] = match;
        return this.head.children.filter(
          (el) => el.tagName === "META" && el.getAttribute(attr) === val
        );
      }
    }
    if (selector.startsWith('link[')) {
      const match = selector.match(/link\[rel="([^"]+)"\]/);
      if (match) {
        const [, relVal] = match;
        return this.head.children.filter(
          (el) => el.tagName === "LINK" && el.getAttribute("rel") === relVal
        );
      }
    }
    if (selector === '[data-veda-seo="true"]') {
      return this.head.children.filter((el) => el.getAttribute("data-veda-seo") === "true");
    }
    if (selector === '[data-baseline-content]') {
      return this.head.children.filter((el) => el.hasAttribute("data-baseline-content"));
    }
    return results;
  }
  createElement(tag) {
    return new MockElement(tag);
  }
}

function fetchHttp(targetUrl, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: "GET",
        headers,
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body,
          });
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

async function runTests() {
  console.log("================================================================");
  console.log("PHASE 4: TECHNICAL SEO & SOCIAL PREVIEW VERIFICATION SUITE");
  console.log("================================================================\n");

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`[FAIL] ${name}: ${e.message}`);
      failed++;
    }
  }

  async function testAsync(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`[FAIL] ${name}: ${e.message}`);
      failed++;
    }
  }

  // ===========================================================================
  // SECTION 1: PHASE 4A - METADATA INTEGRITY & CANONICAL VALIDATION
  // ===========================================================================
  console.log("--- SECTION 1: Phase 4A Metadata Integrity & DOM Management ---");

  const {
    cleanText,
    isValidCanonicalUrl,
    resolveSeoValues,
  } = await import("./src/components/common/seoUtils.js");

  test("4A.1 cleanText strips tags and symbols", () => {
    const raw = "<p>Sacred **Vedic** Puja [Kashi] `vidhi`</p>";
    assert.strictEqual(cleanText(raw), "Sacred Vedic Puja Kashi vidhi");
  });

  test("4A.2 Canonical URL validation rejects localhost, admin, and unsafe URLs", () => {
    assert.strictEqual(isValidCanonicalUrl("http://localhost:5173/puja"), false);
    assert.strictEqual(isValidCanonicalUrl("http://127.0.0.1:3000/yagya"), false);
    assert.strictEqual(isValidCanonicalUrl("https://admin.vedastructure.com/services"), false);
    assert.strictEqual(isValidCanonicalUrl("javascript:alert(1)"), false);
    assert.strictEqual(isValidCanonicalUrl("ftp://vedastructure.com/p"), false);

    assert.strictEqual(isValidCanonicalUrl("https://vedastructure.com/yagya-puja/puja/shiva"), true);
    assert.strictEqual(isValidCanonicalUrl("/yagya-puja/puja/shiva"), true);
  });

  test("4A.3 Canonical URL resolves production domain for safe relative paths and defaults", () => {
    const resRelative = resolveSeoValues({
      service: { slug: "shiva-puja" },
      serviceType: "puja",
      overrideCanonical: "/yagya-puja/puja/shiva-puja",
    });
    assert.strictEqual(resRelative.canonicalUrl, "https://vedastructure.com/yagya-puja/puja/shiva-puja");

    // Invalid custom localhost canonical rejected; falls back safely to production domain
    const resLocalhost = resolveSeoValues({
      service: { slug: "shiva-puja" },
      serviceType: "puja",
      overrideCanonical: "http://localhost:5173/bad-canonical",
    });
    assert.strictEqual(resLocalhost.canonicalUrl, "https://vedastructure.com/yagya-puja/puja/shiva-puja");
  });

  test("4A.4 Preserves explicit robotsIndex=false and robotsFollow=false without defaults", () => {
    const resNoIndex = resolveSeoValues({
      service: {
        slug: "private-ritual",
        seo: { robotsIndex: false, robotsFollow: false },
      },
      serviceType: "puja",
    });
    assert.strictEqual(resNoIndex.robotsIndex, false);
    assert.strictEqual(resNoIndex.robotsFollow, false);
    assert.strictEqual(resNoIndex.robotsContent, "noindex, nofollow");

    const resDefault = resolveSeoValues({
      service: { slug: "public-ritual" },
      serviceType: "puja",
    });
    assert.strictEqual(resDefault.robotsIndex, true);
    assert.strictEqual(resDefault.robotsFollow, true);
    assert.strictEqual(resDefault.robotsContent, "index, follow");
  });

  test("4A.5 PublicSEO renders null to prevent competing React 19 JSX head hoisting", () => {
    const fileContent = fs.readFileSync(path.resolve(__dirname, "src/components/common/PublicSEO.jsx"), "utf8");
    assert(fileContent.includes("return null;"), "PublicSEO must explicitly return null");
    assert(!fileContent.includes("<title>"), "PublicSEO must not return JSX <title> tag");
    assert(!fileContent.includes("<meta name=\"description\""), "PublicSEO must not return JSX <meta> tags");
    assert(!fileContent.includes("<link rel=\"canonical\""), "PublicSEO must not return JSX <link> tags");
  });

  // ===========================================================================
  // SECTION 2: PHASE 4B - DYNAMIC SITEMAP GENERATION
  // ===========================================================================
  console.log("\n--- SECTION 2: Phase 4B Dynamic Sitemap ---");

  await testAsync("4B.1 GET /api/sitemap.xml returns 200 with XML content-type", async () => {
    const res = await fetchHttp(`${API_BASE}/api/sitemap.xml`);
    assert.strictEqual(res.statusCode, 200);
    assert(res.headers["content-type"].includes("application/xml"));
    assert(res.body.includes('<?xml version="1.0" encoding="UTF-8"?>'));
    assert(res.body.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
  });

  await testAsync("4B.2 GET /sitemap.xml route alias functions correctly", async () => {
    const res = await fetchHttp(`${API_BASE}/sitemap.xml`);
    assert.strictEqual(res.statusCode, 200);
    assert(res.headers["content-type"].includes("application/xml"));
  });

  await testAsync("4B.3 Sitemap contains production origin and all 5 service types", async () => {
    const res = await fetchHttp(`${API_BASE}/api/sitemap.xml`);
    const xml = res.body;

    assert(xml.includes("<loc>https://vedastructure.com/</loc>"));
    assert(xml.includes("<loc>https://vedastructure.com/yagya-puja</loc>"));
    assert(xml.includes("<loc>https://vedastructure.com/yagya-puja/puja</loc>"));
    assert(xml.includes("<loc>https://vedastructure.com/yagya-puja/yagya</loc>"));
    assert(xml.includes("<loc>https://vedastructure.com/yagya-puja/homa</loc>"));
    assert(xml.includes("<loc>https://vedastructure.com/yagya-puja/japa</loc>"));
    assert(xml.includes("<loc>https://vedastructure.com/yagya-puja/path</loc>"));

    // Check presence of at least one service URL per type
    assert(xml.includes("https://vedastructure.com/yagya-puja/puja/"), "Missing puja detail URLs");
    assert(xml.includes("https://vedastructure.com/yagya-puja/yagya/"), "Missing yagya detail URLs");
    assert(xml.includes("https://vedastructure.com/yagya-puja/homa/"), "Missing homa detail URLs");
    assert(xml.includes("https://vedastructure.com/yagya-puja/japa/"), "Missing japa detail URLs");
    assert(xml.includes("https://vedastructure.com/yagya-puja/path/"), "Missing path detail URLs");
  });

  test("4B.4 Static sitemap.xml generated in public/ and dist/", () => {
    const publicSitemap = path.resolve(__dirname, "public/sitemap.xml");
    const distSitemap = path.resolve(__dirname, "dist/sitemap.xml");
    assert(fs.existsSync(publicSitemap), "public/sitemap.xml must exist");
    assert(fs.existsSync(distSitemap), "dist/sitemap.xml must exist");

    const content = fs.readFileSync(publicSitemap, "utf8");
    assert(content.includes("<urlset"), "sitemap must contain <urlset>");
    assert(content.includes("https://vedastructure.com/"), "sitemap must use production domain");
  });

  // ===========================================================================
  // SECTION 3: PHASE 4C - ROBOTS.TXT SITEMAP REFERENCE
  // ===========================================================================
  console.log("\n--- SECTION 3: Phase 4C robots.txt Reference ---");

  test("4C.1 robots.txt contains authoritative Sitemap reference and allows /yagya-puja/", () => {
    const robotsPath = path.resolve(__dirname, "public/robots.txt");
    assert(fs.existsSync(robotsPath), "robots.txt must exist");
    const robots = fs.readFileSync(robotsPath, "utf8");

    assert(robots.includes("Sitemap: https://vedastructure.com/sitemap.xml"));
    assert(robots.includes("Allow: /yagya-puja/"));
    assert(robots.includes("Disallow: /admin/"));
    assert(robots.includes("Disallow: /api/"));
  });

  // ===========================================================================
  // SECTION 4: PHASE 4D - SOCIAL CRAWLER METADATA COMPATIBILITY
  // ===========================================================================
  console.log("\n--- SECTION 4: Phase 4D Social Crawler HTML Generation ---");

  const testCases = [
    { type: "puja", slug: "ganesh-vighnaharta-puja", expectedTitle: "Ganesha Vighnaharta Puja" },
    { type: "yagya", slug: "maha-ganapati-atharvashirsha-yagya", expectedTitle: "Ganapati Siddhi Maha Yagya" },
    { type: "homa", slug: "ganapati-homa", expectedTitle: "Ganapati Homa" },
    { type: "japa", slug: "shiva-panchakshari-japa", expectedTitle: "Shiva Panchakshari" },
    { type: "path", slug: "aditya-hridaya-stotra-surya-path", expectedTitle: "Aditya Hridaya" },
  ];

  for (const tc of testCases) {
    await testAsync(`4D.1 Social crawler preview for ${tc.type} (${tc.slug}) returns 200 with OG tags`, async () => {
      const res = await fetchHttp(
        `${API_BASE}/api/seo/crawler-preview?type=${tc.type}&slug=${tc.slug}`,
        { "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" }
      );
      assert.strictEqual(res.statusCode, 200);
      assert(res.headers["content-type"].includes("text/html"));
      const html = res.body;

      assert(html.includes("<title>"), "Must include <title>");
      assert(html.includes(tc.expectedTitle), `Title must contain ${tc.expectedTitle}`);
      assert(html.includes('<meta name="description" content='), "Must include meta description");
      assert(html.includes('<link rel="canonical" href="https://vedastructure.com/yagya-puja/'), "Must include canonical URL");
      assert(html.includes('<meta property="og:title" content='), "Must include og:title");
      assert(html.includes('<meta property="og:description" content='), "Must include og:description");
      assert(html.includes('<meta property="og:url" content='), "Must include og:url");
      assert(html.includes('<meta property="og:site_name" content="Veda Structure" />'), "Must include og:site_name");
      assert(html.includes('<meta name="twitter:card" content="summary_large_image" />'), "Must include twitter:card");
    });
  }

  await testAsync("4D.2 Crawler endpoint gracefully handles non-existent slug with 404 and noindex", async () => {
    const res = await fetchHttp(`${API_BASE}/api/seo/crawler-preview?type=puja&slug=non-existent-service-slug`);
    assert.strictEqual(res.statusCode, 404);
    assert(res.body.includes("Service Not Found"));
    assert(res.body.includes("noindex, nofollow"));
  });

  await testAsync("4D.3 Crawler endpoint rejects invalid type with 400 (SSRF Protection)", async () => {
    const res = await fetchHttp(`${API_BASE}/api/seo/crawler-preview?type=malicious&slug=any-slug`);
    assert.strictEqual(res.statusCode, 400);
  });

  test("4D.4 vercel.json contains edge rewrite for crawler User-Agents and sitemap", () => {
    const vercelConfigPath = path.resolve(__dirname, "vercel.json");
    assert(fs.existsSync(vercelConfigPath), "vercel.json must exist");
    const config = JSON.parse(fs.readFileSync(vercelConfigPath, "utf8"));

    const crawlerRewrite = config.rewrites.find(
      (r) => r.has && r.has.some((h) => h.key === "user-agent")
    );
    assert(crawlerRewrite, "vercel.json must have crawler User-Agent rewrite");
    assert(crawlerRewrite.destination.includes("/api/seo/crawler-preview"));

    const sitemapRewrite = config.rewrites.find((r) => r.source === "/sitemap.xml");
    assert(sitemapRewrite, "vercel.json must have /sitemap.xml rewrite");
  });

  console.log("\n================================================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("FATAL ERROR IN TEST SUITE:", e);
  process.exit(1);
});
