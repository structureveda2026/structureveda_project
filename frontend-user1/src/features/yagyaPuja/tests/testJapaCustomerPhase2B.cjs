/**
 * Phase 2B: Japa Customer Dedicated Category Listing Test Suite
 * Covers all architectural, routing, component, and API requirements for Phase 2B.
 */

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const API_BASE = "http://localhost:5000/api";
const feDir = path.resolve(__dirname, "../../../..");

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
  console.log("PHASE 2B: JAPA CUSTOMER CATEGORY LISTING TEST SUITE");
  console.log("================================================================\n");

  const categoryListingPath = path.join(
    feDir,
    "src/features/yagyaPuja/pages/JapaCategoryListing.jsx"
  );
  const appRoutesPath = path.join(feDir, "src/routes/AppRoutes.jsx");

  // 1. File existence
  await test("1. JapaCategoryListing.jsx exists", async () => {
    assert.ok(fs.existsSync(categoryListingPath), "JapaCategoryListing.jsx file must exist");
  });

  const categoryListingContent = fs.readFileSync(categoryListingPath, "utf8");
  const appRoutesContent = fs.readFileSync(appRoutesPath, "utf8");

  // 2. Component export
  await test("2. JapaCategoryListing exports a default component", async () => {
    assert.ok(
      categoryListingContent.includes("export default JapaCategoryListing"),
      "Must have default export of JapaCategoryListing"
    );
  });

  // 3. Route registration in AppRoutes.jsx
  await test("3. AppRoutes registers /yagya-puja/japa/category/:categorySlug to JapaCategoryListing", async () => {
    assert.ok(
      appRoutesContent.includes("import JapaCategoryListing"),
      "AppRoutes must import JapaCategoryListing"
    );
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/japa/category/:categorySlug" element={<JapaCategoryListing />}'),
      "AppRoutes must route /yagya-puja/japa/category/:categorySlug to JapaCategoryListing"
    );
  });

  // 4. Route ordering: category route precedes :slug route
  await test("4. Category route is defined before service :slug route to prevent wildcard shadowing", async () => {
    const categoryRouteIdx = appRoutesContent.indexOf('/yagya-puja/japa/category/:categorySlug');
    const slugRouteIdx = appRoutesContent.indexOf('/yagya-puja/japa/:slug"');
    assert.ok(categoryRouteIdx !== -1, "Category route must be present");
    assert.ok(slugRouteIdx !== -1, "Slug route must be present");
    assert.ok(
      categoryRouteIdx < slugRouteIdx,
      "Category route must precede :slug route in AppRoutes"
    );
  });

  // 5. Uses useParams for categorySlug
  await test("5. JapaCategoryListing extracts categorySlug via useParams", async () => {
    assert.ok(
      categoryListingContent.includes("useParams"),
      "Must import and use useParams"
    );
    assert.ok(
      categoryListingContent.includes("categorySlug"),
      "Must read categorySlug from useParams"
    );
  });

  // 6. Uses japaCatalogueService for data fetching
  await test("6. JapaCategoryListing imports and utilizes japaCatalogueService", async () => {
    assert.ok(
      categoryListingContent.includes("japaCatalogueService"),
      "Must import japaCatalogueService"
    );
    assert.ok(
      categoryListingContent.includes("getJapaCategoryBySlug"),
      "Must call getJapaCategoryBySlug"
    );
    assert.ok(
      categoryListingContent.includes("getJapaServices"),
      "Must call getJapaServices"
    );
  });

  // 7. Renders JapaServiceCard
  await test("7. JapaCategoryListing renders JapaServiceCard in catalogue grid", async () => {
    assert.ok(
      categoryListingContent.includes("JapaServiceCard"),
      "Must import and render JapaServiceCard"
    );
    assert.ok(
      categoryListingContent.includes("<JapaServiceCard"),
      "Must render <JapaServiceCard"
    );
  });

  // 8. Editorial Hero with breadcrumb
  await test("8. JapaCategoryListing includes editorial hero with breadcrumb navigation", async () => {
    assert.ok(
      categoryListingContent.includes("aria-label=\"Breadcrumb\"") ||
      categoryListingContent.includes("aria-label='Breadcrumb'"),
      "Must include breadcrumb navigation"
    );
    assert.ok(
      categoryListingContent.includes("/yagya-puja/japa"),
      "Breadcrumb must link back to /yagya-puja/japa"
    );
  });

  // 9. Filter panel with search, count, mode, and sort controls
  await test("9. JapaCategoryListing provides search, count, mode, and sort filter options", async () => {
    assert.ok(
      categoryListingContent.includes("COUNT_FILTER_OPTIONS"),
      "Must define count filter options"
    );
    assert.ok(
      categoryListingContent.includes("MODE_FILTER_OPTIONS"),
      "Must define mode filter options"
    );
    assert.ok(
      categoryListingContent.includes("SORT_FILTER_OPTIONS"),
      "Must define sort filter options"
    );
    assert.ok(
      categoryListingContent.includes("handleSearchSubmit"),
      "Must provide search submission handler"
    );
  });

  // 10. Robust states: Not found, Error, and Empty states
  await test("10. JapaCategoryListing handles 404/not-found, error, and empty states", async () => {
    assert.ok(
      categoryListingContent.includes("categoryNotFound"),
      "Must handle category not found state"
    );
    assert.ok(
      categoryListingContent.includes("categoryError") || categoryListingContent.includes("servicesError"),
      "Must handle error states"
    );
    assert.ok(
      categoryListingContent.includes("No Japas found"),
      "Must have empty search/filter result state"
    );
  });

  // 11. Reusable Vedic sections integrated
  await test("11. JapaCategoryListing integrates sacred Vedic sections", async () => {
    assert.ok(
      categoryListingContent.includes("JapaSamagriSection"),
      "Must include JapaSamagriSection"
    );
    assert.ok(
      categoryListingContent.includes("JapaPanditTeamSection"),
      "Must include JapaPanditTeamSection"
    );
    assert.ok(
      categoryListingContent.includes("JapaKashiSection"),
      "Must include JapaKashiSection"
    );
    assert.ok(
      categoryListingContent.includes("JapaFinalCta"),
      "Must include JapaFinalCta"
    );
  });

  // 12. Dynamic SEO document.title update
  await test("12. JapaCategoryListing dynamically sets document title", async () => {
    assert.ok(
      categoryListingContent.includes("document.title"),
      "Must update document.title based on category name"
    );
  });

  // 13. API: GET /api/japa-categories/:slug returns single category
  await test("13. API: GET /api/japa-categories/shiva-mantra-japa returns 200 with category data", async () => {
    const res = await fetch(`${API_BASE}/japa-categories/shiva-mantra-japa`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data, "Must contain data object");
    assert.strictEqual(json.data.slug, "shiva-mantra-japa");
    assert.ok(json.data.name, "Must have category name");
  });

  // 14. API: GET /api/japa-categories/:slug returns 404 for invalid slug
  await test("14. API: GET /api/japa-categories/non-existent-category returns 404", async () => {
    const res = await fetch(`${API_BASE}/japa-categories/non-existent-category`);
    assert.strictEqual(res.status, 404, `Expected 404, got ${res.status}`);
  });

  // 15. API: GET /api/japa-services?category=shiva-mantra-japa filters services
  await test("15. API: GET /api/japa-services?category=shiva-mantra-japa returns filtered services", async () => {
    const res = await fetch(`${API_BASE}/japa-services?category=shiva-mantra-japa`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data), "Services must be an array");
    assert.ok(json.data.length > 0, "Must return at least one service");
    for (const service of json.data) {
      assert.strictEqual(
        service.category?.slug,
        "shiva-mantra-japa",
        `Service "${service.name}" category slug must match filtered slug`
      );
    }
  });

  // 16. API: Multi-filter query (category + search)
  await test("16. API: GET /api/japa-services?category=shiva-mantra-japa&search=Mrityunjaya filters correctly", async () => {
    const res = await fetch(`${API_BASE}/japa-services?category=shiva-mantra-japa&search=Mrityunjaya`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.length, 1);
    assert.strictEqual(json.data[0].slug, "maha-mrityunjaya-japa");
  });

  console.log("\n================================================================");
  console.log(`PHASE 2B RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner encountered fatal error:", err);
  process.exit(1);
});
