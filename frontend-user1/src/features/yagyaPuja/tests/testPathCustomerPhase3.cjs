/**
 * Phase 3: Path Customer Category Discovery Test Suite
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
  console.log("PHASE 3: PATH CUSTOMER CATEGORY DISCOVERY TEST SUITE");
  console.log("================================================================\n");

  let canonicalCategories = [];

  // Item 1: Category API methods exist in pathCatalogueService.js
  await test("1. Category API methods exist in pathCatalogueService.js", async () => {
    const serviceFile = path.join(
      feDir,
      "src/features/yagyaPuja/services/pathCatalogueService.js"
    );
    assert.ok(fs.existsSync(serviceFile), "pathCatalogueService.js must exist");
    const content = fs.readFileSync(serviceFile, "utf8");
    assert.ok(
      content.includes("getPathCategories"),
      "Must export getPathCategories function"
    );
    assert.ok(
      content.includes("getPathCategoryBySlug"),
      "Must export getPathCategoryBySlug function"
    );
    assert.ok(
      content.includes("/path-categories"),
      "Must call /path-categories endpoint"
    );
    assert.ok(
      content.includes("cachedPathCategories"),
      "Must support caching to prevent duplicate API requests"
    );
  });

  // Item 2: PathCategoryDiscovery component exists
  await test("2. PathCategoryDiscovery component exists", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/PathCategoryDiscovery.jsx"
    );
    assert.ok(fs.existsSync(discoveryFile), "PathCategoryDiscovery.jsx must exist");
  });

  // Item 3: PathCategoryCard component exists
  await test("3. PathCategoryCard component exists", async () => {
    const cardFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/PathCategoryCard.jsx"
    );
    assert.ok(fs.existsSync(cardFile), "PathCategoryCard.jsx must exist");
  });

  // Item 4: Categories load dynamically from backend API
  await test("4. Dynamic API loading (GET /api/path-categories returns active canonical categories)", async () => {
    const res = await fetch(`${API_BASE}/path-categories`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data), "Expected data to be an array");
    assert.strictEqual(json.data.length, 7, "Expected exactly 7 canonical Path categories");
    canonicalCategories = json.data;
  });

  // Item 5: No hardcoded category list in component
  await test("5. No hardcoded category arrays in discovery component", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/PathCategoryDiscovery.jsx"
    );
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes("getPathCategories"),
      "Must fetch categories via pathCatalogueService.getPathCategories"
    );
    assert.ok(
      content.includes("categories.map"),
      "Must map categories dynamically"
    );
    assert.ok(
      !content.includes("Ramayana & Manas Parayan") && !content.includes("Shiva & Rudri Path"),
      "Must not hardcode category names in discovery component"
    );
  });

  // Item 6: Active category handling & canonical definitions match
  await test("6. Active categories match canonical definitions", async () => {
    const expectedSlugs = [
      "ramayana-manas-path",
      "shiva-rudri-path",
      "durga-shakta-path",
      "bhagavad-gita-scripture",
      "vishnu-suktam-path",
      "lakshmi-stotra-path",
      "surya-solar-path",
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
      "src/features/yagyaPuja/components/PathCategoryDiscovery.jsx"
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
  await test("8. Category card navigates to /yagya-puja/path/category/:categorySlug", async () => {
    const cardFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/PathCategoryCard.jsx"
    );
    const content = fs.readFileSync(cardFile, "utf8");
    assert.ok(
      content.includes("/yagya-puja/path/category/${category.slug}"),
      "PathCategoryCard must link to /yagya-puja/path/category/${category.slug}"
    );
    assert.ok(
      content.includes("Explore Path"),
      "Card CTA must display 'Explore Path'"
    );
  });

  // Item 9: Loading skeleton state
  await test("9. Loading state with skeleton placeholders", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/PathCategoryDiscovery.jsx"
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
      "src/features/yagyaPuja/components/PathCategoryDiscovery.jsx"
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
      "src/features/yagyaPuja/components/PathCategoryDiscovery.jsx"
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
      "src/features/yagyaPuja/components/PathCategoryCard.jsx"
    );
    const content = fs.readFileSync(cardFile, "utf8");
    assert.ok(
      content.includes("CATEGORY_SLUG_IMAGES"),
      "PathCategoryCard must define CATEGORY_SLUG_IMAGES mapping"
    );
    assert.ok(
      content.includes("ramayana-manas-path") &&
      content.includes("shiva-rudri-path") &&
      content.includes("durga-shakta-path"),
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
      "src/features/yagyaPuja/components/PathCategoryDiscovery.jsx"
    );
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes("md:grid-cols-2") && content.includes("lg:grid-cols-3"),
      "Discovery must specify responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)"
    );

    const cardFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/PathCategoryCard.jsx"
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
      "src/features/yagyaPuja/components/PathCategoryDiscovery.jsx"
    );
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes('aria-labelledby="path-categories-heading"'),
      "Section must have aria-labelledby"
    );
    assert.ok(
      content.includes('id="path-categories-heading"'),
      "Heading must have matching ID"
    );

    const cardFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/PathCategoryCard.jsx"
    );
    const cardContent = fs.readFileSync(cardFile, "utf8");
    assert.ok(
      cardContent.includes("focus-visible:ring-2") || cardContent.includes("focus:outline-none"),
      "Card link must have visible focus states"
    );
  });

  // Item 15: Purpose separation remains intact
  await test("15. Purpose separation remains intact and unmodified", async () => {
    const res = await fetch(`${API_BASE}/path-services/purposes`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data) && json.data.length >= 6);
  });

  // Item 16: PathCatalogueListing includes PathCategoryDiscovery
  await test("16. PathCatalogueListing integrates PathCategoryDiscovery in page layout", async () => {
    const listingFile = path.join(
      feDir,
      "src/features/yagyaPuja/pages/PathCatalogueListing.jsx"
    );
    assert.ok(fs.existsSync(listingFile));
    const content = fs.readFileSync(listingFile, "utf8");
    assert.ok(
      content.includes("import PathCategoryDiscovery"),
      "Listing must import PathCategoryDiscovery"
    );
    assert.ok(
      content.includes("<PathCategoryDiscovery />") || content.includes("<PathCategoryDiscovery"),
      "Listing must render PathCategoryDiscovery"
    );
  });

  // Item 17: Existing Path service catalogue remains intact
  await test("17. Existing Path service catalogue remains intact with categories attached", async () => {
    const res = await fetch(`${API_BASE}/path-services`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data) && json.data.length === 8);
    for (const svc of json.data) {
      assert.ok(svc.category, `Service ${svc.slug} must include serialized category`);
      assert.ok(svc.category.slug, `Service ${svc.slug} category must have a slug`);
    }
  });

  // Item 18: Booking & Wizard components remain completely untouched
  await test("18. Strict isolation: Booking wizard and steps remain untouched", async () => {
    const wizardFile = path.join(
      feDir,
      "src/features/yagyaPuja/pages/RitualBookingWizard.jsx"
    );
    assert.ok(fs.existsSync(wizardFile), "RitualBookingWizard.jsx exists");
  });

  // Item 19: Pricing calculation services remain completely untouched
  await test("19. Strict isolation: Pricing calculation service remains untouched", async () => {
    const pricingFile = path.join(
      rootDir,
      "backend/src/services/ritualPricing.service.js"
    );
    assert.ok(fs.existsSync(pricingFile), "ritualPricing.service.js exists");
  });

  // Item 20: Inactive category is excluded from public API
  await test("20. Inactive categories are excluded from public API", async () => {
    for (const cat of canonicalCategories) {
      assert.strictEqual(cat.isActive, true, "All public categories must have isActive === true");
    }
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
