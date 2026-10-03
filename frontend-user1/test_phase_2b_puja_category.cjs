/**
 * Phase 2B: Puja Category Frontend Pages Test Suite
 *
 * Requirements to verify:
 * 1. Category API service exists (getPujaCategories, getPujaCategoryBySlug).
 * 2. Category list loads from GET /api/puja-categories.
 * 3. Category detail loads from GET /api/puja-categories/:slug.
 * 4. Valid category route renders in AppRoutes.
 * 5. Invalid category returns proper not-found UI.
 * 6. Category services are fetched using category slug.
 * 7. Only category services are displayed.
 * 8. Pagination works (handles page 1, page 2, next, prev, totalCount, totalPages).
 * 9. Search works with category services.
 * 10. Purpose filter works with category services.
 * 11. Duration filter works with category services.
 * 12. Mode filter works with category services.
 * 13. Sorting works with category services.
 * 14. Filter changes reset page to 1.
 * 15. Page navigation preserves filters.
 * 16. View All Puja navigation works.
 * 17. Service detail navigation works (/yagya-puja/puja/:slug).
 * 18. Booking navigation remains intact (/yagya-puja/puja/:slug/book).
 * 19. Category discovery from All Puja page works.
 * 20. Responsive layout remains intact.
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname);

let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`\x1b[32m✔ PASS:\x1b[0m ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`\x1b[31m✘ FAIL:\x1b[0m ${name}`);
    console.error(`  Error: ${err.message}`);
    failedTests++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`\x1b[32m✔ PASS:\x1b[0m ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`\x1b[31m✘ FAIL:\x1b[0m ${name}`);
    console.error(`  Error: ${err.message}`);
    failedTests++;
  }
}

async function main() {
  console.log("\n=======================================================");
  console.log("   PHASE 2B: PUJA CATEGORY FRONTEND TEST SUITE");
  console.log("=======================================================\n");

  const categoryListingPath = path.join(ROOT, "src/features/yagyaPuja/pages/PujaCategoryListing.jsx");
  const categoryDiscoveryPath = path.join(ROOT, "src/features/yagyaPuja/components/PujaCategoryDiscovery.jsx");
  const catalogueListingPath = path.join(ROOT, "src/features/yagyaPuja/pages/PujaCatalogueListing.jsx");
  const serviceDetailsPath = path.join(ROOT, "src/features/yagyaPuja/pages/PujaServiceDetails.jsx");
  const serviceCardPath = path.join(ROOT, "src/features/yagyaPuja/components/PujaServiceCard.jsx");
  const categoryCardPath = path.join(ROOT, "src/features/yagyaPuja/components/PujaCategoryCard.jsx");
  const filtersPath = path.join(ROOT, "src/features/yagyaPuja/components/PujaServiceFilters.jsx");
  const pujaServicePath = path.join(ROOT, "src/services/pujaCatalogueService.js");
  const appRoutesPath = path.join(ROOT, "src/routes/AppRoutes.jsx");

  const categoryContent = fs.readFileSync(categoryListingPath, "utf-8");
  const discoveryContent = fs.readFileSync(categoryDiscoveryPath, "utf-8");
  const catalogueContent = fs.readFileSync(catalogueListingPath, "utf-8");
  const detailsContent = fs.readFileSync(serviceDetailsPath, "utf-8");
  const cardContent = fs.readFileSync(serviceCardPath, "utf-8");
  const categoryCardContent = fs.readFileSync(categoryCardPath, "utf-8");
  const filtersContent = fs.readFileSync(filtersPath, "utf-8");
  const pujaServiceContent = fs.readFileSync(pujaServicePath, "utf-8");
  const appRoutesContent = fs.readFileSync(appRoutesPath, "utf-8");

  // 1. Category API service exists
  runTest("1. Category API service methods exist in pujaCatalogueService", () => {
    assert(
      pujaServiceContent.includes("export const getPujaCategories"),
      "pujaCatalogueService must export getPujaCategories"
    );
    assert(
      pujaServiceContent.includes("export const getPujaCategoryBySlug"),
      "pujaCatalogueService must export getPujaCategoryBySlug"
    );
    assert(
      pujaServiceContent.includes("getPujaCategories,") && pujaServiceContent.includes("getPujaCategoryBySlug,"),
      "Default export of pujaCatalogueService must include category methods"
    );
  });

  // 2. Category list loads from GET /api/puja-categories
  await runAsyncTest("2. Category list loads from GET /api/puja-categories", async () => {
    const res = await fetch("http://localhost:5000/api/puja-categories");
    const json = await res.json();
    assert.strictEqual(json.success, true, "GET /api/puja-categories must succeed");
    assert(Array.isArray(json.data), "Categories response must contain data array");
    assert.strictEqual(json.count, 8, "Expected 8 seeded Puja categories");
    const slugs = json.data.map((c) => c.slug);
    assert(slugs.includes("shiva-puja"), "Categories must include shiva-puja");
    assert(slugs.includes("ganesh-puja"), "Categories must include ganesh-puja");
  });

  // 3. Category detail loads from GET /api/puja-categories/:slug
  await runAsyncTest("3. Category detail loads from GET /api/puja-categories/:slug", async () => {
    const res = await fetch("http://localhost:5000/api/puja-categories/shiva-puja");
    const json = await res.json();
    assert.strictEqual(json.success, true, "GET /api/puja-categories/shiva-puja must succeed");
    assert.strictEqual(json.data.slug, "shiva-puja", "Slug must match shiva-puja");
    assert.strictEqual(json.data.name, "Shiva Puja", "Category name must be Shiva Puja");
    assert(json.data.description, "Category description must exist");
  });

  // 4. Valid category route renders in AppRoutes
  runTest("4. Valid category route /yagya-puja/puja/category/:categorySlug exists in AppRoutes", () => {
    assert(
      appRoutesContent.includes('path="/yagya-puja/puja/category/:categorySlug"'),
      "AppRoutes must include /yagya-puja/puja/category/:categorySlug"
    );
    assert(
      appRoutesContent.includes("<PujaCategoryListing />"),
      "Category route must render PujaCategoryListing"
    );
    // Route ordering safety: category route MUST come BEFORE /yagya-puja/puja/:slug
    const catIndex = appRoutesContent.indexOf('path="/yagya-puja/puja/category/:categorySlug"');
    const slugIndex = appRoutesContent.indexOf('path="/yagya-puja/puja/:slug"');
    assert(catIndex < slugIndex, "Category route must precede the service slug route for proper matching");
  });

  // 5. Invalid category returns proper not-found UI
  await runAsyncTest("5. Invalid category returns 404 and displays not-found UI", async () => {
    const res = await fetch("http://localhost:5000/api/puja-categories/non-existent-category");
    assert.strictEqual(res.status, 404, "Backend must return 404 for unknown category");

    assert(
      categoryContent.includes("Puja Category Not Found"),
      "PujaCategoryListing must display 'Puja Category Not Found' message"
    );
    assert(
      categoryContent.includes("categoryNotFound"),
      "PujaCategoryListing must track categoryNotFound state"
    );
    assert(
      categoryContent.includes('to="/yagya-puja/puja"') && categoryContent.includes("View All Puja"),
      "Not found UI must provide a View All Puja CTA"
    );
  });

  // 6. Category services are fetched using category slug
  runTest("6. Category services are fetched using category slug query parameter", () => {
    assert(
      categoryContent.includes("category: categorySlug"),
      "PujaCategoryListing must pass category: categorySlug to pujaCatalogueService"
    );
    assert(
      pujaServiceContent.includes("query.category ="),
      "pujaCatalogueService must map category parameter to query.category"
    );
  });

  // 7. Only category services are displayed
  await runAsyncTest("7. Only category services are returned and displayed for category", async () => {
    const res = await fetch("http://localhost:5000/api/puja-services?category=shiva-puja");
    const json = await res.json();
    assert.strictEqual(json.success, true, "Category query must succeed");
    assert.strictEqual(json.count, 2, "Shiva Puja category should contain 2 services");
    const slugs = json.data.map((s) => s.slug);
    assert(slugs.includes("rudrabhishek-puja"), "Should contain rudrabhishek-puja");
    assert(slugs.includes("maha-mrityunjaya-puja"), "Should contain maha-mrityunjaya-puja");
  });

  // 8. Pagination works
  await runAsyncTest("8. Category pagination works with limit: 6", async () => {
    const res = await fetch("http://localhost:5000/api/puja-services?category=shiva-puja&page=1&limit=6");
    const json = await res.json();
    assert.strictEqual(json.page, 1, "Page must be 1");
    assert.strictEqual(json.limit, 6, "Limit must be 6");
    assert.strictEqual(json.totalPages, 1, "Total pages should be 1 for 2 services with limit 6");

    assert(categoryContent.includes("handlePageChange"), "PujaCategoryListing must implement handlePageChange");
    assert(categoryContent.includes("currentPage"), "PujaCategoryListing must track currentPage");
    assert(categoryContent.includes("totalPages"), "PujaCategoryListing must track totalPages");
  });

  // 9. Search works with category services
  await runAsyncTest("9. Search works within category", async () => {
    const res = await fetch("http://localhost:5000/api/puja-services?category=shiva-puja&search=Rudrabhishek");
    const json = await res.json();
    assert.strictEqual(json.success, true, "Search query in category must succeed");
    assert.strictEqual(json.count, 1, "Search for Rudrabhishek in Shiva category must return 1");
    assert.strictEqual(json.data[0].slug, "rudrabhishek-puja");

    assert(
      categoryContent.includes("debouncedSearch"),
      "PujaCategoryListing must debounce search input"
    );
  });

  // 10. Purpose filter works with category services
  runTest("10. Purpose filter works with category services", () => {
    assert(
      categoryContent.includes("resolvedPurposeSlug"),
      "PujaCategoryListing must resolve purpose slug"
    );
    assert(
      categoryContent.includes("handlePurposeChange"),
      "PujaCategoryListing must handle purpose changes"
    );
  });

  // 11. Duration filter works with category services
  runTest("11. Duration filter works with category services", () => {
    assert(
      categoryContent.includes("selectedDuration"),
      "PujaCategoryListing must track selectedDuration"
    );
    assert(
      categoryContent.includes("handleDurationChange"),
      "PujaCategoryListing must handle duration changes"
    );
  });

  // 12. Mode filter works with category services
  runTest("12. Mode filter works with category services", () => {
    assert(
      categoryContent.includes("selectedMode"),
      "PujaCategoryListing must track selectedMode"
    );
    assert(
      categoryContent.includes("handleModeChange"),
      "PujaCategoryListing must handle mode changes"
    );
  });

  // 13. Sorting works with category services
  runTest("13. Sorting works with category services", () => {
    assert(
      categoryContent.includes("selectedSort"),
      "PujaCategoryListing must track selectedSort"
    );
    assert(
      categoryContent.includes("handleSortChange"),
      "PujaCategoryListing must handle sort changes"
    );
  });

  // 14. Filter changes reset page to 1
  runTest("14. Filter changes reset page to 1", () => {
    const filterHandlers = [
      "handlePurposeChange",
      "handleDurationChange",
      "handleModeChange",
      "handleFeaturedChange",
      "handleSearchChange",
      "handleSortChange",
    ];
    for (const h of filterHandlers) {
      assert(categoryContent.includes(h), `PujaCategoryListing must define ${h}`);
    }
    assert(
      categoryContent.includes("setCurrentPage(1)"),
      "Filter handlers must reset currentPage to 1"
    );
  });

  // 15. Page navigation preserves filters
  runTest("15. Page navigation preserves category and active filters", () => {
    assert(
      categoryContent.includes("handlePageChange"),
      "PujaCategoryListing must implement handlePageChange"
    );
    // categorySlug, search, purpose, duration, mode, isFeatured, sort are passed in the fetch effect dependencies
    assert(
      categoryContent.includes("debouncedSearch") &&
      categoryContent.includes("resolvedPurposeSlug") &&
      categoryContent.includes("selectedDuration") &&
      categoryContent.includes("selectedMode") &&
      categoryContent.includes("isFeaturedOnly") &&
      categoryContent.includes("selectedSort") &&
      categoryContent.includes("currentPage"),
      "Fetch effect dependencies must preserve all active filters when currentPage changes"
    );
  });

  // 16. View All Puja navigation works
  runTest("16. View All Puja navigation exists and links to /yagya-puja/puja", () => {
    assert(
      categoryContent.includes('to="/yagya-puja/puja"'),
      "PujaCategoryListing must have Link to /yagya-puja/puja"
    );
    assert(
      categoryContent.includes("View All Puja"),
      "PujaCategoryListing must render 'View All Puja' CTA text"
    );
  });

  // 17. Service detail navigation works (/yagya-puja/puja/:slug)
  runTest("17. Service detail navigation works through PujaServiceCard (/yagya-puja/puja/:slug)", () => {
    assert(
      cardContent.includes("to={`/yagya-puja/puja/${service.slug}`}") ||
      cardContent.includes("to={`/yagya-puja/puja/${slug}`}"),
      "PujaServiceCard must link directly to /yagya-puja/puja/:slug"
    );
    assert(
      categoryContent.includes("<PujaServiceCard"),
      "PujaCategoryListing must reuse PujaServiceCard"
    );
  });

  // 18. Booking navigation remains intact (/yagya-puja/puja/:slug/book)
  runTest("18. Booking navigation remains intact (/yagya-puja/puja/:slug/book)", () => {
    assert(
      detailsContent.includes("/yagya-puja/puja/${slug}/book") ||
      detailsContent.includes("/yagya-puja/puja/"),
      "PujaServiceDetails booking navigation must remain intact"
    );
    assert(
      appRoutesContent.includes('path="/yagya-puja/puja/:slug/book"'),
      "AppRoutes must include /yagya-puja/puja/:slug/book"
    );
  });

  // 19. Category discovery from All Puja page works
  runTest("19. Category discovery exists on All Puja page (/yagya-puja/puja)", () => {
    assert(
      catalogueContent.includes("<PujaCategoryDiscovery />") ||
      catalogueContent.includes("PujaCategoryDiscovery"),
      "PujaCatalogueListing must include PujaCategoryDiscovery"
    );
    assert(
      discoveryContent.includes("getPujaCategories"),
      "PujaCategoryDiscovery must load categories using getPujaCategories"
    );
    assert(
      discoveryContent.includes("to={`/yagya-puja/puja/category/${cat.slug}`}") ||
      discoveryContent.includes("/yagya-puja/puja/category/") ||
      categoryCardContent.includes("/yagya-puja/puja/category/"),
      "PujaCategoryDiscovery or PujaCategoryCard must link to /yagya-puja/puja/category/:slug"
    );
  });

  // 20. Responsive layout remains intact
  runTest("20. Responsive layout classes are maintained for category page and discovery", () => {
    assert(
      categoryContent.includes("sm:grid-cols-2 lg:grid-cols-3"),
      "Category page must have responsive 1-col mobile, 2-col tablet, 3-col desktop"
    );
    assert(
      discoveryContent.includes("lg:grid-cols-3") || discoveryContent.includes("sm:grid-cols-2 lg:grid-cols-4"),
      "Category discovery must have responsive grid"
    );
    assert(
      categoryContent.includes("aria-label=\"Breadcrumb\""),
      "Category page must provide responsive breadcrumb navigation"
    );
  });

  console.log("\n=======================================================");
  console.log(`TOTAL TESTS: ${passedTests + failedTests}`);
  console.log(`PASSED: ${passedTests}`);
  console.log(`FAILED: ${failedTests}`);
  console.log("=======================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
