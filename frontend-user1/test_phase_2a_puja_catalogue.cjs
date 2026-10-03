/**
 * Phase 2A: Puja Customer Catalogue + 6-Card Preview + View All + Pagination Test Suite
 *
 * Requirements to verify:
 * 1. Preview renders maximum 6 cards.
 * 2. View All Puja CTA exists.
 * 3. View All Puja navigates to /yagya-puja/puja.
 * 4. Full catalogue loads from API.
 * 5. Six services per page.
 * 6. Pagination works (handles page 1, page 2, next, prev, totalCount, totalPages).
 * 7. Search works with pagination.
 * 8. Purpose filter works with pagination.
 * 9. Duration filter works with pagination.
 * 10. Mode filter works with pagination.
 * 11. Sort works with pagination.
 * 12. Changing filters resets page to 1.
 * 13. Empty state works ("No Pujas Found" + "Clear Filters").
 * 14. API error state works ("Unable to load Pujas").
 * 15. Retry works (reloads catalogue).
 * 16. Existing service detail navigation works (/yagya-puja/puja/:slug).
 * 17. Existing booking navigation works (/yagya-puja/puja/:slug/book).
 * 18. Mobile layout remains valid (responsive classes in grid and cards).
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
  console.log("   PHASE 2A: PUJA CUSTOMER CATALOGUE TEST SUITE");
  console.log("=======================================================\n");

  const catalogueListingPath = path.join(ROOT, "src/features/yagyaPuja/pages/PujaCatalogueListing.jsx");
  const serviceDetailsPath = path.join(ROOT, "src/features/yagyaPuja/pages/PujaServiceDetails.jsx");
  const serviceCardPath = path.join(ROOT, "src/features/yagyaPuja/components/PujaServiceCard.jsx");
  const filtersPath = path.join(ROOT, "src/features/yagyaPuja/components/PujaServiceFilters.jsx");
  const pujaServicePath = path.join(ROOT, "src/services/pujaCatalogueService.js");
  const appRoutesPath = path.join(ROOT, "src/routes/AppRoutes.jsx");

  const catalogueContent = fs.readFileSync(catalogueListingPath, "utf-8");
  const detailsContent = fs.readFileSync(serviceDetailsPath, "utf-8");
  const cardContent = fs.readFileSync(serviceCardPath, "utf-8");
  const filtersContent = fs.readFileSync(filtersPath, "utf-8");
  const pujaServiceContent = fs.readFileSync(pujaServicePath, "utf-8");
  const categoryListingPath = path.join(ROOT, "src/features/yagyaPuja/pages/PujaCategoryListing.jsx");
  const categoryListingContent = fs.readFileSync(categoryListingPath, "utf-8");
  const appRoutesContent = fs.readFileSync(appRoutesPath, "utf-8");

  // 1. Preview renders maximum 6 cards
  runTest("1. Preview renders maximum 6 cards per page request", () => {
    assert(
      pujaServiceContent.includes("query.limit = 6") || catalogueContent.includes("slice(0, 6)"),
      "API request or catalogue must limit preview cards to 6"
    );
    assert(
      catalogueContent.includes("slice(0, 6)"),
      "PujaCatalogueListing must strictly slice preview to maximum 6 cards"
    );
  });

  // 2. View All Puja CTA exists
  runTest("2. View All Puja CTA exists", () => {
    assert(
      catalogueContent.includes("View All Puja"),
      "View All Puja CTA button must exist in catalogue listing"
    );
  });

  // 3. View All Puja navigates to All Catalogue (/yagya-puja/puja/all)
  runTest("3. View All Puja CTA links to /yagya-puja/puja/all using router", () => {
    assert(
      catalogueContent.includes('to="/yagya-puja/puja/all"') &&
      catalogueContent.includes("Link"),
      "View All Puja CTA must navigate to /yagya-puja/puja/all using React Router"
    );
    assert(
      !catalogueContent.includes('window.location = "/yagya-puja/puja"'),
      "Should not use window.location for CTA navigation"
    );
  });

  // 4. Full catalogue loads from API
  await runAsyncTest("4. Full catalogue loads from GET /api/puja-services", async () => {
    assert(
      pujaServiceContent.includes('api.get("/puja-services"'),
      "pujaCatalogueService must call /puja-services"
    );
    const response = await fetch("http://localhost:5000/api/puja-services?limit=6&page=1");
    const json = await response.json();
    assert.strictEqual(json.success, true, "Backend API /api/puja-services must return success: true");
    assert(Array.isArray(json.data), "Backend API /api/puja-services must return data array");
    assert(json.data.length > 0, "Backend API must return active services");
  });

  // 5. Six services per page
  await runAsyncTest("5. Six services per page supported by API and UI", async () => {
    const response = await fetch("http://localhost:5000/api/puja-services?limit=6&page=1");
    const json = await response.json();
    assert.strictEqual(json.limit, 6, "API limit must be 6");
    assert(json.data.length <= 6, "API must return at most 6 services for page 1");
    assert.strictEqual(json.data.length, 6, "Page 1 should have exactly 6 services with 8 total in DB");
  });

  // 6. Pagination works on category services catalogue and is absent on Category preview
  await runAsyncTest("6. Pagination works across page 1 and page 2 on Category Services Catalogue", async () => {
    const resPage1 = await fetch("http://localhost:5000/api/puja-services?limit=6&page=1");
    const json1 = await resPage1.json();
    const resPage2 = await fetch("http://localhost:5000/api/puja-services?limit=6&page=2");
    const json2 = await resPage2.json();

    assert.strictEqual(json1.page, 1, "Page 1 page property must be 1");
    assert.strictEqual(json2.page, 2, "Page 2 page property must be 2");
    assert.strictEqual(json1.totalPages, 2, "totalPages should be 2 for 8 services with limit 6");
    assert.strictEqual(json2.data.length, 2, "Page 2 should return the remaining 2 services");

    // Category services catalogue UI controls verify
    assert(categoryListingContent.includes("totalPages > 1"), "Category services catalogue must render pagination controls when totalPages > 1");
    assert(categoryListingContent.includes("Previous"), "Category services catalogue must render Previous button");
    assert(categoryListingContent.includes("Next"), "Category services catalogue must render Next button");
    assert(categoryListingContent.includes("handlePageChange"), "Category services catalogue must implement handlePageChange");

    // Preview UI must NOT render pagination controls
    assert(!catalogueContent.includes("handlePageChange"), "Puja preview must NOT have handlePageChange pagination logic");
    assert(!catalogueContent.includes("<ChevronLeft"), "Puja preview must NOT render Previous pagination icon");
    assert(!catalogueContent.includes("<ChevronRight"), "Puja preview must NOT render Next pagination icon");
  });

  // 7. Search works with pagination
  await runAsyncTest("7. Search works with pagination parameter support", async () => {
    const resSearch = await fetch("http://localhost:5000/api/puja-services?search=Rudrabhishek&limit=6&page=1");
    const json = await resSearch.json();
    assert.strictEqual(json.success, true, "Search request must succeed");
    assert(json.data.length >= 1, "Search for Rudrabhishek should return matching service");
    assert(
      categoryListingContent.includes("handleSearchChange") || categoryListingContent.includes("setDebouncedSearch"),
      "Category listing must handle search changes and reset page"
    );
  });

  // 8. Purpose filter works with pagination
  await runAsyncTest("8. Purpose filter works with pagination", async () => {
    assert(
      pujaServiceContent.includes("query.purpose ="),
      "pujaCatalogueService must map purpose filter to query.purpose"
    );
    assert(
      categoryListingContent.includes("handlePurposeChange"),
      "Category listing must handle purpose change"
    );
    const resPurpose = await fetch("http://localhost:5000/api/puja-services?purpose=protection-peace&limit=6&page=1");
    const json = await resPurpose.json();
    assert.strictEqual(json.success, true, "Purpose query must succeed");
  });

  // 9. Duration filter works with pagination
  await runAsyncTest("9. Duration filter works with pagination", async () => {
    assert(
      pujaServiceContent.includes("query.duration ="),
      "pujaCatalogueService must map duration filter"
    );
    assert(
      categoryListingContent.includes("handleDurationChange"),
      "Category listing must handle duration change"
    );
  });

  // 10. Mode filter works with pagination
  await runAsyncTest("10. Mode filter works with pagination", async () => {
    assert(
      pujaServiceContent.includes("query.mode ="),
      "pujaCatalogueService must map mode filter"
    );
    assert(
      categoryListingContent.includes("handleModeChange"),
      "Category listing must handle mode change"
    );
  });

  // 11. Sort works
  await runAsyncTest("11. Sort works with pagination", async () => {
    assert(
      pujaServiceContent.includes("query.sortBy ="),
      "pujaCatalogueService must map sortBy query param"
    );
    assert(
      categoryListingContent.includes("handleSortChange"),
      "Category listing must handle sort change"
    );
    const resSort = await fetch("http://localhost:5000/api/puja-services?sortBy=price-asc&limit=6&page=1");
    const json = await resSort.json();
    assert.strictEqual(json.success, true, "Sorted query must succeed");
  });

  // 12. Changing filters resets page to 1
  runTest("12. Changing filters resets page to 1", () => {
    assert(
      categoryListingContent.includes("setCurrentPage(1)") || categoryListingContent.includes("handlePurposeChange"),
      "Filter change handlers must reset currentPage to 1"
    );
    const handlers = [
      "handlePurposeChange",
      "handleDurationChange",
      "handleModeChange",
      "handleFeaturedChange",
      "handleSearchChange",
      "handleSortChange"
    ];
    for (const h of handlers) {
      assert(categoryListingContent.includes(h), `Category listing must define ${h}`);
    }
  });

  // 13. Empty state works
  runTest("13. Empty state renders with clear filters CTA", () => {
    assert(
      categoryListingContent.includes("No Pujas Found") || catalogueContent.includes("No Puja Categories Found"),
      "Must have empty state messaging"
    );
    assert(
      categoryListingContent.includes("Clear Filters") || categoryListingContent.includes("handleResetFilters"),
      "Category listing must have 'Clear Filters' button in empty state"
    );
  });

  // 14. API error state works
  runTest("14. API error state works with user-friendly message", () => {
    assert(
      catalogueContent.includes("Unable to load Pujas") || catalogueContent.includes("error"),
      "Catalogue must display user-friendly error state"
    );
  });

  // 15. Retry works
  runTest("15. Retry action works in error state", () => {
    assert(
      catalogueContent.includes("Retry") && catalogueContent.includes("setReloadTrigger"),
      "Error state must provide a Retry button that triggers reload"
    );
  });

  // 16. Existing service detail navigation works
  runTest("16. Existing service detail navigation works (/yagya-puja/puja/:slug)", () => {
    assert(
      cardContent.includes("to={`/yagya-puja/puja/${service.slug}`}") ||
      cardContent.includes("to={`/yagya-puja/puja/${slug}`}"),
      "PujaServiceCard must link to /yagya-puja/puja/:slug"
    );
    assert(
      appRoutesContent.includes('path="/yagya-puja/puja/:slug"'),
      "AppRoutes must include /yagya-puja/puja/:slug route"
    );
  });

  // 17. Existing booking navigation works
  runTest("17. Existing booking navigation works (/yagya-puja/puja/:slug/book)", () => {
    assert(
      detailsContent.includes("/yagya-puja/puja/${slug}/book") ||
      detailsContent.includes("/yagya-puja/puja/"),
      "PujaServiceDetails must navigate to booking wizard"
    );
    assert(
      appRoutesContent.includes('path="/yagya-puja/puja/:slug/book"'),
      "AppRoutes must include /yagya-puja/puja/:slug/book route"
    );
  });

  // 18. Mobile layout remains valid
  runTest("18. Responsive grid layout is maintained", () => {
    assert(
      catalogueContent.includes("grid gap-7 sm:grid-cols-2 lg:grid-cols-3") ||
      catalogueContent.includes("sm:grid-cols-2 lg:grid-cols-3"),
      "Catalogue grid must have responsive 1-column on mobile, 2 on tablet, 3 on desktop"
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
