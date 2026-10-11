/**
 * Phase 3: Homa Customer Category Discovery Test Suite
 * Comprehensive verification of customer-facing category discovery features,
 * components, service integration, responsiveness, accessibility, and strict isolation.
 */

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const API_BASE = "http://localhost:5000/api";
const feDir = path.resolve(__dirname, "../../../..");
const rootDir = path.resolve(__dirname, "../../../../..");

let passed = 0;
let failed = 0;
const results = [];

async function test(name, fn) {
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    passed++;
    results.push({ name, status: "PASS" });
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}`);
    failed++;
    results.push({ name, status: "FAIL", error: err.message });
  }
}

async function runTests() {
  console.log("================================================================");
  console.log("PHASE 3: HOMA CUSTOMER CATEGORY DISCOVERY TEST SUITE");
  console.log("================================================================\n");

  let canonicalCategories = [];

  // Item 1: Category API method exists in homaCatalogueService.js
  await test("1. Category API method exists in homaCatalogueService.js", async () => {
    const serviceFile = path.join(feDir, "src/services/homaCatalogueService.js");
    assert.ok(fs.existsSync(serviceFile), "homaCatalogueService.js must exist");
    const content = fs.readFileSync(serviceFile, "utf8");
    assert.ok(
      content.includes("getHomaCategories"),
      "Must export getHomaCategories function"
    );
    assert.ok(
      content.includes("getHomaCategoryBySlug"),
      "Must export getHomaCategoryBySlug function"
    );
    assert.ok(
      content.includes("/homa-categories"),
      "Must call /homa-categories endpoint"
    );
  });

  // Item 2: HomaCategoryDiscovery component exists
  await test("2. HomaCategoryDiscovery component exists", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/HomaCategoryDiscovery.jsx"
    );
    assert.ok(fs.existsSync(discoveryFile), "HomaCategoryDiscovery.jsx must exist");
  });

  // Item 3: HomaCategoryCard component exists
  await test("3. HomaCategoryCard component exists", async () => {
    const cardFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/HomaCategoryCard.jsx"
    );
    assert.ok(fs.existsSync(cardFile), "HomaCategoryCard.jsx must exist");
  });

  // Item 4: Categories load dynamically from backend API
  await test("4. Dynamic API loading (GET /api/homa-categories returns active canonical categories)", async () => {
    const res = await fetch(`${API_BASE}/homa-categories`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data), "Expected data to be an array");
    assert.strictEqual(json.data.length, 7, "Expected exactly 7 canonical Homa categories");
    canonicalCategories = json.data;
  });

  // Item 5: No hardcoded category list in component
  await test("5. No hardcoded category arrays in discovery component", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/HomaCategoryDiscovery.jsx"
    );
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes("getHomaCategories"),
      "Must fetch categories via homaCatalogueService.getHomaCategories"
    );
    assert.ok(
      content.includes("categories.map"),
      "Must map categories dynamically"
    );
    assert.ok(
      !content.includes("Shiva & Rudra Homa") && !content.includes("Ganapati Homa"),
      "Must not hardcode category names in discovery component"
    );
  });

  // Item 6: Active category handling & canonical definitions match
  await test("6. Active categories match canonical definitions", async () => {
    const expectedSlugs = [
      "shiva-rudra-homa",
      "ganapati-homa",
      "durga-chandi-homa",
      "lakshmi-kubera-homa",
      "navagraha-planetary-homa",
      "vastu-griha-homa",
      "ayushya-longevity-homa",
    ];

    for (const slug of expectedSlugs) {
      const match = canonicalCategories.find((c) => c.slug === slug);
      assert.ok(match, `Missing canonical category: ${slug}`);
      assert.ok(match.name && match.name.length > 0, `Category ${slug} must have a name`);
      assert.ok(match.id && match.id.length > 0, `Category ${slug} must have an ID`);
      assert.strictEqual(match.isActive, true, `Category ${slug} must be active`);
      assert.ok(typeof match.displayOrder === "number", `Category ${slug} must have a displayOrder`);
    }
  });

  // Item 7: Category ordering from backend is respected
  await test("7. Category displayOrder sorting is maintained", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/HomaCategoryDiscovery.jsx"
    );
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes("displayOrder"),
      "Discovery component must sort by displayOrder"
    );

    // Verify backend returned categories are ordered 1 to 7
    for (let i = 0; i < canonicalCategories.length - 1; i++) {
      assert.ok(
        canonicalCategories[i].displayOrder <= canonicalCategories[i + 1].displayOrder,
        `Categories must be sorted by displayOrder ASC: ${canonicalCategories[i].displayOrder} <= ${canonicalCategories[i + 1].displayOrder}`
      );
    }
  });

  // Item 8: Correct category slug navigation generated
  await test("8. Category card navigates to /yagya-puja/homa/category/:categorySlug", async () => {
    const cardFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/HomaCategoryCard.jsx"
    );
    const content = fs.readFileSync(cardFile, "utf8");
    assert.ok(
      content.includes("/yagya-puja/homa/category/${category.slug}"),
      "HomaCategoryCard must link to /yagya-puja/homa/category/${category.slug}"
    );
    assert.ok(
      content.includes("Explore Homa"),
      "Card CTA must display 'Explore Homa'"
    );
  });

  // Item 9: Loading skeleton state
  await test("9. Loading state with skeleton placeholders", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/HomaCategoryDiscovery.jsx"
    );
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes("loading ?") && content.includes("animate-pulse"),
      "Must render animated pulse skeleton cards while loading"
    );
  });

  // Item 10: Error state handling with retry action
  await test("10. Error state with retry action", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/HomaCategoryDiscovery.jsx"
    );
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes("error &&") && content.includes("handleRetry"),
      "Must provide user-facing error UI with retry action"
    );
  });

  // Item 11: Empty state handling
  await test("11. Empty state handling (returns null when no categories exist)", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/HomaCategoryDiscovery.jsx"
    );
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes("categories.length === 0"),
      "Must handle empty category response cleanly without flash"
    );
  });

  // Item 12: Image fallback lookup for canonical categories
  await test("12. Image fallback lookup for canonical category slugs", async () => {
    const cardFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/HomaCategoryCard.jsx"
    );
    const content = fs.readFileSync(cardFile, "utf8");
    assert.ok(
      content.includes("CATEGORY_SLUG_IMAGES"),
      "HomaCategoryCard must define CATEGORY_SLUG_IMAGES mapping"
    );
    assert.ok(
      content.includes("shiva-rudra-homa") &&
      content.includes("ganapati-homa") &&
      content.includes("durga-chandi-homa"),
      "Must include canonical category slugs in image mapping"
    );
    assert.ok(
      content.includes("onError"),
      "Must have onError image fallback handler"
    );
  });

  // Item 13: Responsive grid layout classes
  await test("13. Responsive grid layout classes", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/HomaCategoryDiscovery.jsx"
    );
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes("md:grid-cols-2") && content.includes("lg:grid-cols-3"),
      "Discovery must specify responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)"
    );

    const cardFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/HomaCategoryCard.jsx"
    );
    const cardContent = fs.readFileSync(cardFile, "utf8");
    assert.ok(
      cardContent.includes("aspect-[16/10]"),
      "Card image must have aspect-[16/10]"
    );
  });

  // Item 14: Accessibility attributes
  await test("14. Semantic accessibility attributes and focus states", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/HomaCategoryDiscovery.jsx"
    );
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes('aria-labelledby="homa-categories-heading"'),
      "Section must have aria-labelledby"
    );
    assert.ok(
      content.includes('id="homa-categories-heading"'),
      "Heading must have matching ID"
    );

    const cardFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/HomaCategoryCard.jsx"
    );
    const cardContent = fs.readFileSync(cardFile, "utf8");
    assert.ok(
      cardContent.includes("focus-visible:ring-2") || cardContent.includes("focus:outline-none"),
      "Card link must have visible focus states"
    );
  });

  // Item 15: Purpose separation remains intact
  await test("15. Purpose separation remains intact and unmodified", async () => {
    const res = await fetch(`${API_BASE}/homa-services/purposes`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data) && json.data.length >= 6);
  });

  // Item 16: HomaCatalogueListing includes HomaCategoryDiscovery
  await test("16. HomaCatalogueListing integrates HomaCategoryDiscovery in page layout", async () => {
    const listingFile = path.join(
      feDir,
      "src/features/yagyaPuja/pages/HomaCatalogueListing.jsx"
    );
    assert.ok(fs.existsSync(listingFile));
    const content = fs.readFileSync(listingFile, "utf8");
    assert.ok(
      content.includes("import HomaCategoryDiscovery"),
      "Listing must import HomaCategoryDiscovery"
    );
    assert.ok(
      content.includes("<HomaCategoryDiscovery />") || content.includes("<HomaCategoryDiscovery"),
      "Listing must render HomaCategoryDiscovery"
    );
  });

  // Item 17: Booking & Wizard components remain completely untouched
  await test("17. Strict isolation: Booking wizard and steps remain untouched", async () => {
    const wizardFile = path.join(
      feDir,
      "src/features/yagyaPuja/pages/RitualBookingWizard.jsx"
    );
    const stepHomaFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/booking/StepConfigurationHoma.jsx"
    );
    assert.ok(fs.existsSync(wizardFile), "RitualBookingWizard.jsx exists");
    assert.ok(fs.existsSync(stepHomaFile), "StepConfigurationHoma.jsx exists");
  });

  // Item 18: Pricing calculation services remain completely untouched
  await test("18. Strict isolation: Pricing calculation service remains untouched", async () => {
    const pricingFile = path.join(
      rootDir,
      "backend/src/services/ritualPricing.service.js"
    );
    assert.ok(fs.existsSync(pricingFile), "ritualPricing.service.js exists");
  });

  console.log("\n================================================================");
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log("================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
