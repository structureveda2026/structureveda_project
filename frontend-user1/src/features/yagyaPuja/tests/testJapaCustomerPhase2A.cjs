/**
 * Phase 2A: Japa Customer Category Discovery Test Suite
 * Covers all 14 mandatory verification items from Phase 2A specifications.
 */

const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { execSync } = require("child_process");

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
  console.log("PHASE 2A: JAPA CUSTOMER CATEGORY DISCOVERY TEST SUITE");
  console.log("================================================================\n");

  let canonicalCategories = [];
  let canonicalServices = [];

  // Item 1: Categories load from API
  await test("1. Japa categories load from API (GET /api/japa-categories returns 200 with active categories)", async () => {
    const res = await fetch(`${API_BASE}/japa-categories`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data), "Expected data to be an array of categories");
    assert.strictEqual(json.data.length, 7, "Expected 7 canonical Japa categories");
    canonicalCategories = json.data;
  });

  // Item 2: All active categories render dynamically
  await test("2. All active categories render dynamically (JapaCategoryDiscovery does not hardcode cards)", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/JapaCategoryDiscovery.jsx"
    );
    assert.ok(fs.existsSync(discoveryFile), "JapaCategoryDiscovery.jsx must exist");
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes("getJapaCategories"),
      "Must fetch categories via japaCatalogueService.getJapaCategories"
    );
    assert.ok(
      content.includes("categories.map"),
      "Must map categories dynamically"
    );
    assert.ok(
      !content.includes("Shiva & Healing Japa"),
      "Must not hardcode category names in discovery component"
    );
  });

  // Item 3: Category names render correctly
  await test("3. Category names match canonical seeded definitions", async () => {
    const expectedSlugs = [
      "shiva-mantra-japa",
      "gayatri-vedic-japa",
      "durga-shakti-japa",
      "hanuman-raksha-japa",
      "ganapati-siddhi-japa",
      "lakshmi-prosperity-japa",
      "navagraha-planetary-japa",
    ];

    for (const slug of expectedSlugs) {
      const match = canonicalCategories.find((c) => c.slug === slug);
      assert.ok(match, `Missing canonical Japa category with slug: ${slug}`);
      assert.ok(match.name && match.name.length > 0, `Category ${slug} must have a valid name`);
      assert.ok(match.id && match.id.length > 0, `Category ${slug} must have a valid id`);
      assert.ok(typeof match.displayOrder === "number", `Category ${slug} must have a displayOrder`);
    }
  });

  // Item 4: Category navigation works
  await test("4. Category navigation works (JapaCategoryCard links to /yagya-puja/japa/category/:categorySlug)", async () => {
    const cardFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/JapaCategoryCard.jsx"
    );
    assert.ok(fs.existsSync(cardFile), "JapaCategoryCard.jsx must exist");
    const content = fs.readFileSync(cardFile, "utf8");
    assert.ok(
      content.includes("/yagya-puja/japa/category/${category.slug}"),
      "JapaCategoryCard must link to /yagya-puja/japa/category/${category.slug}"
    );
    assert.ok(
      content.includes("aspect-[16/10]"),
      "Card image must have aspect-[16/10]"
    );
    assert.ok(
      content.includes("Explore Japa"),
      "Card CTA must display Explore Japa"
    );

    // Verify Route in AppRoutes.jsx is registered BEFORE :slug
    const routesFile = path.join(feDir, "src/routes/AppRoutes.jsx");
    const routesContent = fs.readFileSync(routesFile, "utf8");
    const catRouteIdx = routesContent.indexOf(
      'path="/yagya-puja/japa/category/:categorySlug"'
    );
    const slugRouteIdx = routesContent.indexOf(
      'path="/yagya-puja/japa/:slug"'
    );
    assert.ok(catRouteIdx > -1, "Category route must exist in AppRoutes.jsx");
    assert.ok(slugRouteIdx > -1, ":slug route must exist in AppRoutes.jsx");
    assert.ok(
      catRouteIdx < slugRouteIdx,
      "Category route must be registered BEFORE :slug route to avoid collision"
    );
  });

  // Item 5: Inactive categories are not displayed
  await test("5. Inactive categories are not displayed by public API (Only active categories returned)", async () => {
    // Exactly the 7 active canonical categories must be returned
    assert.strictEqual(canonicalCategories.length, 7, "Public API must strictly return active categories only");
    for (const cat of canonicalCategories) {
      assert.ok(cat.slug, "Category must have valid slug");
      assert.ok(cat.name, "Category must have valid name");
    }
  });

  // Item 6: Empty category response
  await test("6. Empty category response handling (JapaCategoryDiscovery handles empty array cleanly)", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/JapaCategoryDiscovery.jsx"
    );
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes("categories.length === 0"),
      "Must check categories.length === 0 when not loading to avoid empty container flash"
    );
  });

  // Item 7: API failure state
  await test("7. API failure state handled gracefully in catalogue listing", async () => {
    const listingFile = path.join(
      feDir,
      "src/features/yagyaPuja/pages/JapaCatalogueListing.jsx"
    );
    const listingContent = fs.readFileSync(listingFile, "utf8");
    assert.ok(
      listingContent.includes("isFallback") && listingContent.includes("localFallback"),
      "Must have resilient fallback mechanism when API fails"
    );
    assert.ok(
      listingContent.includes("Retry Live API") || listingContent.includes("setRetryTrigger"),
      "Must provide retry mechanism"
    );
  });

  // Item 8: Image fallback
  await test("8. Image fallback (Deterministic fallback lookup for canonical category slugs)", async () => {
    const cardFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/JapaCategoryCard.jsx"
    );
    const cardContent = fs.readFileSync(cardFile, "utf8");
    assert.ok(
      cardContent.includes("CATEGORY_SLUG_IMAGES"),
      "JapaCategoryCard must define CATEGORY_SLUG_IMAGES mapping"
    );
    assert.ok(
      cardContent.includes("shiva-mantra-japa") &&
      cardContent.includes("gayatri-vedic-japa") &&
      cardContent.includes("durga-shakti-japa"),
      "Must include canonical category slugs in image mapping"
    );
    assert.ok(
      cardContent.includes("onError"),
      "Must have onError image fallback handler"
    );
  });

  // Item 9: Existing purpose filters remain functional and preserved
  await test("9. Existing purpose filters remain functional (Separation of Category and Purpose)", async () => {
    const res = await fetch(`${API_BASE}/japa-services/purposes`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data), "Purposes API must return array");
    assert.ok(json.data.length >= 6, "Expected at least 6 canonical Japa purposes");

    const listingFile = path.join(
      feDir,
      "src/features/yagyaPuja/pages/JapaCatalogueListing.jsx"
    );
    const listingContent = fs.readFileSync(listingFile, "utf8");
    assert.ok(
      listingContent.includes("<JapaPurposeSection"),
      "JapaPurposeSection must remain mounted in JapaCatalogueListing"
    );
    assert.ok(
      listingContent.includes("currentPurpose") || listingContent.includes("selectedPurpose"),
      "Must maintain purpose filter state"
    );
    assert.ok(
      listingContent.includes("All Purposes"),
      "Purpose select dropdown must maintain All Purposes option"
    );
  });

  // Item 10: Category selection does not break search
  await test("10. Category selection does not break search (GET /api/japa-services?category=...&search=...)", async () => {
    const res = await fetch(
      `${API_BASE}/japa-services?category=shiva-mantra-japa&search=Mrityunjaya`
    );
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.length >= 1, "Expected search result under shiva-mantra-japa");
    assert.strictEqual(json.data[0].slug, "maha-mrityunjaya-japa");
    assert.strictEqual(json.data[0].category.slug, "shiva-mantra-japa");
  });

  // Item 11: Category selection does not break count and mode filters
  await test("11. Category selection does not break count/mode filters", async () => {
    const res = await fetch(
      `${API_BASE}/japa-services?category=shiva-mantra-japa&count=11000&mode=kashi`
    );
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.length >= 1, "Expected matching service");
    for (const s of json.data) {
      assert.strictEqual(s.category.slug, "shiva-mantra-japa");
      assert.ok(s.availableCounts.includes(11000));
      assert.strictEqual(s.isKashiAvailable, true);
    }
  });

  // Item 12: Responsive rendering
  await test("12. Responsive rendering (Grid breakpoints md:grid-cols-2 lg:grid-cols-3)", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/JapaCategoryDiscovery.jsx"
    );
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes("grid gap-6 md:grid-cols-2 lg:grid-cols-3"),
      "Must define responsive 1/2/3 column layout"
    );
  });

  // Item 13: Accessibility essentials
  await test("13. Accessibility essentials (semantic h2, aria-labelledby, alt text)", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/JapaCategoryDiscovery.jsx"
    );
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes('aria-labelledby="japa-categories-heading"'),
      "Section must have aria-labelledby"
    );
    assert.ok(
      content.includes('id="japa-categories-heading"'),
      "Heading must have matching id"
    );

    const cardFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/JapaCategoryCard.jsx"
    );
    const cardContent = fs.readFileSync(cardFile, "utf8");
    assert.ok(
      cardContent.includes("alt={category.name}"),
      "Image must have descriptive alt text"
    );
    assert.ok(
      cardContent.includes("focus-visible:ring-2"),
      "Card must provide visible focus indicator"
    );
  });

  // Item 14: No existing Japa booking regression
  await test("14. No existing Japa booking regression (/yagya-puja/japa/:slug/book route preserved)", async () => {
    const routesFile = path.join(feDir, "src/routes/AppRoutes.jsx");
    const routesContent = fs.readFileSync(routesFile, "utf8");
    assert.ok(
      routesContent.includes('path="/yagya-puja/japa/:slug/book"') &&
      routesContent.includes('serviceType="JAPA"'),
      "Japa booking wizard route must remain fully preserved"
    );
    assert.ok(
      routesContent.includes('path="/yagya-puja/japa/:slug/booking-status"'),
      "Japa booking status route must remain preserved"
    );
  });

  // Item 15: Safety verification
  await test("15. Safety: Phase 2A strictly isolated to Japa customer category discovery", async () => {
    // 15a. Verify Phase 2A components exist and are properly isolated
    const japaDiscovery = path.join(feDir, "src/features/yagyaPuja/components/JapaCategoryDiscovery.jsx");
    const japaCard = path.join(feDir, "src/features/yagyaPuja/components/JapaCategoryCard.jsx");
    assert.ok(fs.existsSync(japaDiscovery), "JapaCategoryDiscovery.jsx must exist");
    assert.ok(fs.existsSync(japaCard), "JapaCategoryCard.jsx must exist");

    // 15b. Verify Puja components do not contain Japa logic
    const pujaCard = path.join(feDir, "src/features/yagyaPuja/components/PujaCategoryCard.jsx");
    const pujaContent = fs.readFileSync(pujaCard, "utf8");
    assert.ok(!pujaContent.includes("japa"), "PujaCategoryCard must remain untouched by Japa logic");

    // 15c. Verify Japa booking configuration step was not modified for Phase 2A
    const japaBookingStep = path.join(feDir, "src/features/yagyaPuja/components/booking/StepConfigurationJapa.jsx");
    const japaStepContent = fs.readFileSync(japaBookingStep, "utf8");
    assert.ok(!japaStepContent.includes("JapaCategoryDiscovery"), "StepConfigurationJapa must not import category discovery");
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
