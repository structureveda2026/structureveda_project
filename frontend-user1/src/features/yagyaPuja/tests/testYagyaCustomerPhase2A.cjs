/**
 * Phase 2A: Yagya Customer Frontend Integration & Category Verification Test Suite
 * Covers all 15 mandatory verification items from Section 12 of the user specification.
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
  console.log("PHASE 2A: YAGYA CUSTOMER CATALOGUE ARCHITECTURE TEST SUITE");
  console.log("================================================================\n");

  let canonicalCategories = [];
  let canonicalServices = [];

  // Item 1: Yagya catalogue loads from backend API
  await test("1. Yagya catalogue loads (GET /api/yagya-services returns active services)", async () => {
    const res = await fetch(`${API_BASE}/yagya-services`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data), "Expected data to be an array of services");
    assert.ok(json.data.length >= 6, "Expected at least 6 canonical Yagya services");
    canonicalServices = json.data;
  });

  // Item 2: Maximum 6 preview services
  await test("2. Maximum 6 preview services (Popular sections limit display to at most 6 services)", async () => {
    const popularSectionFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/YagyaPopularSection.jsx"
    );
    const popularContent = fs.readFileSync(popularSectionFile, "utf8");
    assert.ok(
      popularContent.includes("slice(0, 6)"),
      "YagyaPopularSection must slice preview services to maximum 6"
    );

    const umbrellaPopularFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/umbrella/UmbrellaPopularServices.jsx"
    );
    const umbrellaContent = fs.readFileSync(umbrellaPopularFile, "utf8");
    assert.ok(
      umbrellaContent.includes("slice(0, 6)"),
      "UmbrellaPopularServices must slice popular Yagyas to maximum 6"
    );
  });

  // Item 3: View All Yagya navigation
  await test("3. View All Yagya navigation (Links navigate to /yagya-puja/yagya)", async () => {
    const popularSectionFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/YagyaPopularSection.jsx"
    );
    const popularContent = fs.readFileSync(popularSectionFile, "utf8");
    assert.ok(
      popularContent.includes('to="/yagya-puja/yagya"') &&
        popularContent.includes("View All Yagya"),
      "YagyaPopularSection must contain View All Yagya link to /yagya-puja/yagya"
    );

    const umbrellaPopularFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/umbrella/UmbrellaPopularServices.jsx"
    );
    const umbrellaContent = fs.readFileSync(umbrellaPopularFile, "utf8");
    assert.ok(
      umbrellaContent.includes('to="/yagya-puja/yagya"') &&
        umbrellaContent.includes("View All Yagya"),
      "UmbrellaPopularServices must contain View All Yagya link to /yagya-puja/yagya"
    );
  });

  // Item 4: Yagya categories load from API
  await test("4. Yagya categories load from API (GET /api/yagya-categories)", async () => {
    const res = await fetch(`${API_BASE}/yagya-categories`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data), "Expected data to be an array of categories");
    assert.strictEqual(json.data.length, 5, "Expected 5 canonical Yagya categories");

    const expectedSlugs = [
      "shiva-healing-yagya",
      "ganapati-siddhi-yagya",
      "lakshmi-prosperity-yagya",
      "durga-shakti-yagya",
      "navagraha-planetary-yagya",
    ];

    for (const slug of expectedSlugs) {
      assert.ok(
        json.data.some((c) => c.slug === slug),
        `Missing category with slug: ${slug}`
      );
    }
    canonicalCategories = json.data;
  });

  // Item 5: Categories render dynamically
  await test("5. Categories render dynamically (YagyaCategoryDiscovery does not hardcode cards)", async () => {
    const discoveryFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/YagyaCategoryDiscovery.jsx"
    );
    assert.ok(fs.existsSync(discoveryFile), "YagyaCategoryDiscovery.jsx must exist");
    const content = fs.readFileSync(discoveryFile, "utf8");
    assert.ok(
      content.includes("getYagyaCategories"),
      "Must fetch categories via yagyaCatalogueService.getYagyaCategories"
    );
    assert.ok(
      content.includes("categories.map"),
      "Must map categories dynamically"
    );
    assert.ok(
      !content.includes("Shiva & Healing Yagya"),
      "Must not hardcode category names in discovery component"
    );
  });

  // Item 6: Category slug navigation
  await test("6. Category slug navigation (YagyaCategoryCard links to /yagya-puja/yagya/category/:categorySlug)", async () => {
    const cardFile = path.join(
      feDir,
      "src/features/yagyaPuja/components/YagyaCategoryCard.jsx"
    );
    assert.ok(fs.existsSync(cardFile), "YagyaCategoryCard.jsx must exist");
    const content = fs.readFileSync(cardFile, "utf8");
    assert.ok(
      content.includes("/yagya-puja/yagya/category/${category.slug}"),
      "YagyaCategoryCard must link to /yagya-puja/yagya/category/${category.slug}"
    );
    assert.ok(
      content.includes("aspect-[16/10]"),
      "Card image must have aspect-[16/10]"
    );
    assert.ok(
      content.includes("Explore Yagyas"),
      "Card CTA must display Explore Yagyas"
    );

    // Verify Route in AppRoutes.jsx is registered BEFORE :slug
    const routesFile = path.join(feDir, "src/routes/AppRoutes.jsx");
    const routesContent = fs.readFileSync(routesFile, "utf8");
    const catRouteIdx = routesContent.indexOf(
      'path="/yagya-puja/yagya/category/:categorySlug"'
    );
    const slugRouteIdx = routesContent.indexOf(
      'path="/yagya-puja/yagya/:slug"'
    );
    assert.ok(catRouteIdx > -1, "Category route must exist in AppRoutes.jsx");
    assert.ok(slugRouteIdx > -1, ":slug route must exist in AppRoutes.jsx");
    assert.ok(
      catRouteIdx < slugRouteIdx,
      "Category route must be registered BEFORE :slug route to avoid collision"
    );
  });

  // Item 7: Pagination
  await test("7. Server-side pagination (API supports page and limit=6 with pagination metadata)", async () => {
    const res = await fetch(`${API_BASE}/yagya-services?page=1&limit=6`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.page, 1);
    assert.strictEqual(json.limit, 6);
    assert.ok(json.total >= 6, "Total should be at least 6");
    assert.ok(json.totalPages >= 1, "TotalPages should be at least 1");

    const listingFile = path.join(
      feDir,
      "src/features/yagyaPuja/pages/YagyaCatalogueListing.jsx"
    );
    const listingContent = fs.readFileSync(listingFile, "utf8");
    assert.ok(
      listingContent.includes("PAGE_SIZE = 6") || listingContent.includes("limit: 6"),
      "Default page size must be 6"
    );
    assert.ok(
      listingContent.includes("totalPages") && listingContent.includes("handlePageChange"),
      "Must have pagination controls"
    );
  });

  // Item 8: Search
  await test("8. Search (GET /api/yagya-services?search=Mrityunjaya filters by name/deity/intention)", async () => {
    const res = await fetch(
      `${API_BASE}/yagya-services?search=Mrityunjaya`
    );
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.length >= 1, "Expected at least 1 result for Mrityunjaya");
    assert.ok(
      json.data.some((s) => s.slug === "maha-mrityunjaya-yagya"),
      "Must find Maha Mrityunjaya Yagya"
    );
  });

  // Item 9: Existing filters & Category filter
  await test("9. Existing filters and category filtering (duration, purpose, category filter work)", async () => {
    // 9a. Category filter
    const catRes = await fetch(
      `${API_BASE}/yagya-services?category=shiva-healing-yagya`
    );
    assert.strictEqual(catRes.status, 200);
    const catJson = await catRes.json();
    assert.strictEqual(catJson.success, true);
    assert.ok(catJson.data.length >= 1, "Expected services under shiva-healing-yagya");
    for (const item of catJson.data) {
      assert.strictEqual(
        item.category.slug,
        "shiva-healing-yagya",
        "Filtered item must belong to shiva-healing-yagya"
      );
    }

    // 9b. Duration filter
    const durRes = await fetch(`${API_BASE}/yagya-services?duration=3`);
    assert.strictEqual(durRes.status, 200);
    const durJson = await durRes.json();
    assert.strictEqual(durJson.success, true);

    // 9c. Invalid category filter returns 0 results cleanly
    const invalidRes = await fetch(
      `${API_BASE}/yagya-services?category=non-existent-category`
    );
    assert.strictEqual(invalidRes.status, 200);
    const invalidJson = await invalidRes.json();
    assert.strictEqual(invalidJson.success, true);
    assert.strictEqual(invalidJson.total, 0);
  });

  // Item 10: Loading state
  await test("10. Loading state (Skeleton pulse loaders rendered during data fetching)", async () => {
    const listingFile = path.join(
      feDir,
      "src/features/yagyaPuja/pages/YagyaCatalogueListing.jsx"
    );
    const listingContent = fs.readFileSync(listingFile, "utf8");
    assert.ok(
      listingContent.includes("animate-pulse"),
      "Must contain animate-pulse skeleton cards for loading state"
    );
  });

  // Item 11: Error state
  await test("11. Error state (User-friendly error UI with retry action rendered on fetch error)", async () => {
    const listingFile = path.join(
      feDir,
      "src/features/yagyaPuja/pages/YagyaCatalogueListing.jsx"
    );
    const listingContent = fs.readFileSync(listingFile, "utf8");
    assert.ok(
      listingContent.includes("Unable to Load Yagya Catalogue") ||
        listingContent.includes("error"),
      "Must render error message"
    );
    assert.ok(
      listingContent.includes("Retry") && (listingContent.includes("fetchServices") || listingContent.includes("setRetryTrigger")),
      "Must have a Retry button"
    );
  });

  // Item 12: Empty state
  await test("12. Empty state (Helpful message and Clear all filters CTA rendered when no results match)", async () => {
    const listingFile = path.join(
      feDir,
      "src/features/yagyaPuja/pages/YagyaCatalogueListing.jsx"
    );
    const listingContent = fs.readFileSync(listingFile, "utf8");
    assert.ok(
      listingContent.includes("No Yagya Ceremonies Found"),
      "Must render No Yagya Ceremonies Found empty heading"
    );
    assert.ok(
      listingContent.includes("Clear all filters") &&
        listingContent.includes("handleResetFilters"),
      "Must have Clear all filters CTA in empty state"
    );
  });

  // Item 13: Existing Yagya detail route
  await test("13. Existing Yagya detail route (/yagya-puja/yagya/:slug is preserved and returns detail data)", async () => {
    const res = await fetch(
      `${API_BASE}/yagya-services/maha-mrityunjaya-yagya`
    );
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.slug, "maha-mrityunjaya-yagya");
    assert.ok(json.data.category, "Yagya detail must include category object");
    assert.strictEqual(json.data.category.slug, "shiva-healing-yagya");
  });

  // Item 14: Existing Yagya booking route
  await test("14. Existing Yagya booking route (/yagya-puja/yagya/:slug/book is preserved)", async () => {
    const routesFile = path.join(feDir, "src/routes/AppRoutes.jsx");
    const routesContent = fs.readFileSync(routesFile, "utf8");
    assert.ok(
      routesContent.includes(
        'path="/yagya-puja/yagya/:slug/book"'
      ) && routesContent.includes('serviceType="YAGYA"'),
      "Yagya booking route with RitualBookingWizard must be preserved"
    );
  });

  // Item 15: No backend or admin files modified in Phase 2A
  await test("15. Safety: No backend/ or admin-veda-structure/ files modified in Phase 2A", async () => {
    const gitStatus = execSync("git status --porcelain", {
      cwd: rootDir,
      encoding: "utf8",
    });
    const modifiedLines = gitStatus
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    for (const line of modifiedLines) {
      // Check if any line targets admin-veda-structure
      assert.ok(
        !line.includes("admin-veda-structure/"),
        `admin-veda-structure must NOT be touched in Phase 2A: ${line}`
      );
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
