/**
 * Phase 2B: Yagya Customer Category Detail Pages Test Suite
 * Covers all 17 test verification requirements specified in Section 18:
 * 1. Valid category route
 * 2. Category API loading
 * 3. Category name rendering
 * 4. Category description rendering
 * 5. Category image rendering
 * 6. Category service API filtering
 * 7. Service cards
 * 8. Service detail navigation
 * 9. Pagination
 * 10. Search
 * 11. Filters
 * 12. Invalid category
 * 13. Empty category
 * 14. Breadcrumbs
 * 15. Hero CTA
 * 16. Booking route regression
 * 17. Puja route regression
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
  console.log("PHASE 2B: YAGYA CATEGORY DETAIL PAGE TEST SUITE");
  console.log("================================================================\n");

  const categoryListingPath = path.join(
    feDir,
    "src/features/yagyaPuja/pages/YagyaCategoryListing.jsx"
  );
  assert.ok(
    fs.existsSync(categoryListingPath),
    "YagyaCategoryListing.jsx component file must exist"
  );
  const categoryListingContent = fs.readFileSync(categoryListingPath, "utf8");

  const appRoutesPath = path.join(feDir, "src/routes/AppRoutes.jsx");
  const appRoutesContent = fs.readFileSync(appRoutesPath, "utf8");

  // 1. Valid category route
  await test("1. Valid category route is registered before generic service slug", async () => {
    assert.ok(
      appRoutesContent.includes('import YagyaCategoryListing from "../features/yagyaPuja/pages/YagyaCategoryListing";'),
      "AppRoutes must import YagyaCategoryListing"
    );
    const categoryRouteIdx = appRoutesContent.indexOf(
      'path="/yagya-puja/yagya/category/:categorySlug"'
    );
    const serviceRouteIdx = appRoutesContent.indexOf(
      'path="/yagya-puja/yagya/:slug"'
    );
    assert.ok(categoryRouteIdx !== -1, "Category route must be defined");
    assert.ok(serviceRouteIdx !== -1, "Service detail route must be defined");
    assert.ok(
      categoryRouteIdx < serviceRouteIdx,
      "Category route must appear BEFORE generic service slug route to avoid route shadowing"
    );
  });

  // 2. Category API loading
  await test("2. Category API loading (GET /api/yagya-categories/:categorySlug returns valid category)", async () => {
    const slug = "shiva-healing-yagya";
    const res = await fetch(`${API_BASE}/yagya-categories/${slug}`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data, "Expected category payload");
    assert.strictEqual(json.data.slug, slug);
    assert.ok(json.data.name, "Expected category name");
  });

  // 3. Category name rendering
  await test("3. Category name rendering in hero and catalogue heading", async () => {
    assert.ok(
      categoryListingContent.includes("renderCategoryHeading(category?.name)") ||
        categoryListingContent.includes("category?.name"),
      "YagyaCategoryListing must render category.name in hero"
    );
    assert.ok(
      categoryListingContent.includes("catalogueHeading"),
      "YagyaCategoryListing must have dynamic catalogueHeading for tradition section"
    );
  });

  // 4. Category description rendering
  await test("4. Category description rendering (Dynamic text from API in hero)", async () => {
    assert.ok(
      categoryListingContent.includes("category?.description"),
      "YagyaCategoryListing must render category.description from API"
    );
    assert.ok(
      categoryListingContent.includes("Sacred Vedic Tradition"),
      "Hero must feature authentic sacred tradition trust points"
    );
  });

  // 5. Category image rendering & fallbacks
  await test("5. Category image rendering with canonical fallbacks", async () => {
    assert.ok(
      categoryListingContent.includes("categoryImageSrc"),
      "Must define dynamic category image source"
    );
    assert.ok(
      categoryListingContent.includes("CATEGORY_SLUG_IMAGES"),
      "Must define deterministic category slug images"
    );
    assert.ok(
      categoryListingContent.includes("shiva-healing-yagya") &&
        categoryListingContent.includes("ganapati-siddhi-yagya") &&
        categoryListingContent.includes("lakshmi-prosperity-yagya") &&
        categoryListingContent.includes("durga-shakti-yagya") &&
        categoryListingContent.includes("navagraha-planetary-yagya"),
      "Must support canonical category slugs in image fallbacks"
    );
  });

  // 6. Category service API filtering
  await test("6. Category service API filtering (Server-side category filter)", async () => {
    const slug = "shiva-healing-yagya";
    const res = await fetch(`${API_BASE}/yagya-services?category=${slug}`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data), "Services must be an array");
    json.data.forEach((s) => {
      assert.strictEqual(
        s.category?.slug,
        slug,
        `Expected service to belong to category ${slug}`
      );
    });

    assert.ok(
      categoryListingContent.includes("category: categorySlug"),
      "YagyaCategoryListing must pass categorySlug to getYagyaServices"
    );
  });

  // 7. Service cards
  await test("7. Service cards (Reuses YagyaServiceCard component)", async () => {
    assert.ok(
      categoryListingContent.includes('import YagyaServiceCard from "../components/YagyaServiceCard";'),
      "Must import YagyaServiceCard"
    );
    assert.ok(
      categoryListingContent.includes("<YagyaServiceCard"),
      "Must render YagyaServiceCard in services grid"
    );
  });

  // 8. Service detail navigation
  await test("8. Service detail navigation (Cards link to /yagya-puja/yagya/:slug)", async () => {
    const cardPath = path.join(
      feDir,
      "src/features/yagyaPuja/components/YagyaServiceCard.jsx"
    );
    const cardContent = fs.readFileSync(cardPath, "utf8");
    assert.ok(
      cardContent.includes("to={`/yagya-puja/yagya/${service.slug}`}"),
      "YagyaServiceCard must navigate to /yagya-puja/yagya/:slug"
    );
  });

  // 9. Pagination
  await test("9. Pagination (Server-side PAGE_SIZE = 6 with URL synchronization)", async () => {
    assert.ok(
      categoryListingContent.includes("PAGE_SIZE = 6"),
      "Must enforce PAGE_SIZE = 6"
    );
    assert.ok(
      categoryListingContent.includes("handlePageChange"),
      "Must implement handlePageChange"
    );
    assert.ok(
      categoryListingContent.includes("currentPage"),
      "Must track currentPage"
    );
    assert.ok(
      categoryListingContent.includes("totalPages"),
      "Must calculate totalPages"
    );
    assert.ok(
      categoryListingContent.includes("Previous Page") ||
        categoryListingContent.includes("<ChevronLeft"),
      "Must render Previous pagination button"
    );
    assert.ok(
      categoryListingContent.includes("Next Page") ||
        categoryListingContent.includes("<ChevronRight"),
      "Must render Next pagination button"
    );
  });

  // 10. Search
  await test("10. Search input with URL sync and reset to page 1", async () => {
    assert.ok(
      categoryListingContent.includes("handleSearchSubmit"),
      "Must provide search submission handler"
    );
    assert.ok(
      categoryListingContent.includes("page: 1"),
      "Search changes must reset pagination to page 1"
    );
  });

  // 11. Filters
  await test("11. Filters (Locked category, Purpose, Duration, Sort, Reset filters)", async () => {
    assert.ok(
      categoryListingContent.includes("DURATION_FILTER_OPTIONS"),
      "Must have duration filter options"
    );
    assert.ok(
      categoryListingContent.includes("SORT_FILTER_OPTIONS"),
      "Must have sort filter options"
    );
    assert.ok(
      categoryListingContent.includes("handleResetFilters"),
      "Must provide handleResetFilters"
    );
    assert.ok(
      !categoryListingContent.includes("All Categories"),
      "Category page must NOT have an 'All Categories' filter switch"
    );
  });

  // 12. Invalid category handling
  await test("12. Invalid category (404 or inactive shows Category Not Found with Back to All Yagyas)", async () => {
    assert.ok(
      categoryListingContent.includes("Yagya Category Not Found"),
      "Must show 'Yagya Category Not Found' message"
    );
    assert.ok(
      categoryListingContent.includes("Back to All Yagyas"),
      "Must provide 'Back to All Yagyas' CTA"
    );
    assert.ok(
      categoryListingContent.includes('to="/yagya-puja/yagya"'),
      "Back CTA must navigate to /yagya-puja/yagya"
    );
    assert.ok(
      categoryListingContent.includes("catData.isActive === false") ||
        categoryListingContent.includes("!catData"),
      "Inactive category must trigger not found state"
    );
  });

  // 13. Empty category handling
  await test("13. Empty category (Zero active services shows clean empty state with Explore All Yagyas)", async () => {
    assert.ok(
      categoryListingContent.includes("No Yagyas are currently available in this category."),
      "Must show empty category notification"
    );
    assert.ok(
      categoryListingContent.includes("Explore All Yagyas"),
      "Must provide 'Explore All Yagyas' link"
    );
  });

  // 14. Breadcrumbs
  await test("14. Breadcrumbs (Home > Yagya & Puja > Yagya > {Category Name})", async () => {
    assert.ok(
      categoryListingContent.includes('aria-label="Breadcrumb"'),
      "Must provide accessible Breadcrumb navigation"
    );
    assert.ok(
      categoryListingContent.includes('to="/"') && categoryListingContent.includes("Home"),
      "Must link to Home"
    );
    assert.ok(
      categoryListingContent.includes('to="/yagya-puja"') &&
        categoryListingContent.includes("Yagya &amp; Puja"),
      "Must link to Yagya & Puja"
    );
    assert.ok(
      categoryListingContent.includes('to="/yagya-puja/yagya"') &&
        categoryListingContent.includes("Yagya"),
      "Must link to Yagya"
    );
    assert.ok(
      categoryListingContent.includes("category?.name"),
      "Must display current Category name as active crumb"
    );
  });

  // 15. Hero CTA
  await test("15. Hero CTA (Primary CTA scrolls to #category-catalogue)", async () => {
    assert.ok(
      categoryListingContent.includes('href="#category-catalogue"'),
      "Hero primary CTA must point to #category-catalogue"
    );
    assert.ok(
      categoryListingContent.includes('id="category-catalogue"'),
      "Catalogue section must have stable id='category-catalogue'"
    );
  });

  // 16. Booking route regression
  await test("16. Booking route regression (All booking wizards preserved)", async () => {
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/yagya/:slug/book"'),
      "Yagya booking route must remain preserved"
    );
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/puja/:slug/book"'),
      "Puja booking route must remain preserved"
    );
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/japa/:slug/book"'),
      "Japa booking route must remain preserved"
    );
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/path/:slug/book"'),
      "Path booking route must remain preserved"
    );
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/homa/:slug/book"'),
      "Homa booking route must remain preserved"
    );
  });

  // 17. Puja route regression
  await test("17. Puja route regression (All Puja routes completely intact)", async () => {
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/puja" element={<PujaCatalogueListing />}'),
      "Puja catalogue listing route preserved"
    );
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/puja/all" element={<PujaAllCatalogueListing />}'),
      "Puja all catalogue listing route preserved"
    );
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/puja/category/:categorySlug" element={<PujaCategoryListing />}'),
      "Puja category listing route preserved"
    );
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/puja/:slug" element={<PujaServiceDetails />}'),
      "Puja service details route preserved"
    );
  });

  console.log("\n================================================================");
  console.log(`PHASE 2B TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
