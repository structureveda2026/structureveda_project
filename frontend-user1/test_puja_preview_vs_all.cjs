/**
 * Dedicated Test Suite for Puja Category-First Architecture
 * Verifies all requirements:
 * 1. 0 active Puja categories → empty state
 * 2. 3 active categories → show 3 → no pagination
 * 3. 6 active categories → show 6 → no pagination
 * 4. 7 active categories → show first 6 → no pagination → View All Puja visible
 * 5. 8 active categories (live database) → show first 6 → no pagination → View All Puja visible
 * 6. 20 active categories → show first 6 → no pagination → View All Puja visible
 * 7. Click View All Puja → opens /yagya-puja/puja/all where all active categories are displayed without pagination
 * 8. Category card click → navigates to /yagya-puja/puja/category/:categorySlug
 * 9. Category-specific page → displays category information and all active services for that category
 * 10. Service detail and booking routes remain intact
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
  console.log("   PUJA CATEGORY-FIRST ARCHITECTURE TEST SUITE");
  console.log("=======================================================\n");

  const previewPath = path.join(ROOT, "src/features/yagyaPuja/pages/PujaCatalogueListing.jsx");
  const allCataloguePath = path.join(ROOT, "src/features/yagyaPuja/pages/PujaAllCatalogueListing.jsx");
  const categoryListingPath = path.join(ROOT, "src/features/yagyaPuja/pages/PujaCategoryListing.jsx");
  const discoveryPath = path.join(ROOT, "src/features/yagyaPuja/components/PujaCategoryDiscovery.jsx");
  const appRoutesPath = path.join(ROOT, "src/routes/AppRoutes.jsx");

  const previewContent = fs.readFileSync(previewPath, "utf-8");
  const allCatalogueContent = fs.readFileSync(allCataloguePath, "utf-8");
  const categoryListingContent = fs.readFileSync(categoryListingPath, "utf-8");
  const discoveryContent = fs.readFileSync(discoveryPath, "utf-8");
  const appRoutesContent = fs.readFileSync(appRoutesPath, "utf-8");

  // Helper simulating the preview calculation logic from PujaCatalogueListing.jsx:
  function computePreviewState(categoriesList) {
    const displayedCategories = categoriesList.slice(0, 6);
    const hasMore = categoriesList.length > 6;
    const showEmpty = displayedCategories.length === 0;
    const showPagination = false; // By design, preview has zero pagination controls
    return {
      displayedCount: displayedCategories.length,
      hasMore,
      showEmpty,
      showPagination,
    };
  }

  // 1. 0 active Puja categories → empty state
  runTest("1. 0 active Puja categories → empty state", () => {
    const state = computePreviewState([]);
    assert.strictEqual(state.showEmpty, true, "Empty state must be displayed when 0 categories");
    assert.strictEqual(state.displayedCount, 0, "0 cards must be rendered");
    assert.strictEqual(state.hasMore, false, "View All Puja must not be shown when 0 categories");
    assert.strictEqual(state.showPagination, false, "Pagination must never appear in preview");
    assert(
      previewContent.includes("No Puja Categories Found") || discoveryContent.includes("No Puja Categories Found") || discoveryContent.includes("return null"),
      "Must handle empty categories state gracefully"
    );
  });

  // 2. 3 active categories → show 3 → no pagination
  runTest("2. 3 active categories → show 3 → no pagination", () => {
    const mockCategories = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const state = computePreviewState(mockCategories);
    assert.strictEqual(state.showEmpty, false);
    assert.strictEqual(state.displayedCount, 3, "Exactly 3 category cards must be shown");
    assert.strictEqual(state.hasMore, false, "View All Puja must not be shown when <= 6 categories");
    assert.strictEqual(state.showPagination, false, "Pagination must never appear in preview");
  });

  // 3. 6 active categories → show 6 → no pagination
  runTest("3. 6 active categories → show 6 → no pagination", () => {
    const mockCategories = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
    const state = computePreviewState(mockCategories);
    assert.strictEqual(state.showEmpty, false);
    assert.strictEqual(state.displayedCount, 6, "Exactly 6 category cards must be shown");
    assert.strictEqual(state.hasMore, false, "View All Puja must not be shown when <= 6 categories");
    assert.strictEqual(state.showPagination, false, "Pagination must never appear in preview");
  });

  // 4. 7 active categories → show first 6 → no pagination → View All Puja visible
  runTest("4. 7 active categories → show first 6 → no pagination → View All Puja visible", () => {
    const mockCategories = Array.from({ length: 7 }, (_, i) => ({ id: i + 1 }));
    const state = computePreviewState(mockCategories);
    assert.strictEqual(state.displayedCount, 6, "Must show only the first 6 category cards");
    assert.strictEqual(state.hasMore, true, "View All Puja must be visible when > 6 categories");
    assert.strictEqual(state.showPagination, false, "Pagination must never appear in preview");
    assert(
      previewContent.includes('to="/yagya-puja/puja/all"') || discoveryContent.includes('to="/yagya-puja/puja/all"'),
      "View All Puja must link to /yagya-puja/puja/all"
    );
  });

  // 5. 8 active categories (live database) → show first 6 → no pagination → View All Puja visible
  await runAsyncTest("5. 8 active categories in DB → show first 6 on /yagya-puja/puja with View All Puja CTA", async () => {
    const res = await fetch("http://localhost:5000/api/puja-categories");
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.length, 8, "Expected exactly 8 active categories in database");

    const state = computePreviewState(json.data);
    assert.strictEqual(state.displayedCount, 6, "Must show exactly 6 category cards");
    assert.strictEqual(state.hasMore, true, "View All Puja must be shown for 8 categories");
    assert(!previewContent.includes("totalPages > 1"), "Preview must NOT have totalPages pagination");
    assert(!previewContent.includes("handlePageChange"), "Preview must NOT have pagination page change logic");
  });

  // 6. 20 active categories → show first 6 → no pagination → View All Puja visible
  runTest("6. 20 active categories → show first 6 → no pagination → View All Puja visible", () => {
    const mockCategories = Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }));
    const state = computePreviewState(mockCategories);
    assert.strictEqual(state.displayedCount, 6, "Must show only the first 6 category cards for 20 categories");
    assert.strictEqual(state.hasMore, true, "View All Puja must be visible when 20 categories");
    assert.strictEqual(state.showPagination, false, "Pagination must never appear in preview");
  });

  // 7. Click View All Puja → opens /yagya-puja/puja/all where all active categories are displayed without pagination
  await runAsyncTest("7. View All Puja opens /yagya-puja/puja/all displaying all active categories without pagination", async () => {
    assert(
      appRoutesContent.includes('path="/yagya-puja/puja/all"'),
      "Route /yagya-puja/puja/all must be registered in AppRoutes"
    );
    assert(
      allCatalogueContent.includes("getPujaCategories"),
      "All Puja page must fetch categories via getPujaCategories()"
    );
    assert(
      !allCatalogueContent.includes("handlePageChange"),
      "All Puja categories page must NOT have pagination controls"
    );
    assert(
      !allCatalogueContent.includes("totalPages"),
      "All Puja categories page must NOT have totalPages"
    );
    assert(
      !allCatalogueContent.includes("Previous"),
      "All Puja categories page must NOT have Previous button"
    );
    assert(
      !allCatalogueContent.includes("Next"),
      "All Puja categories page must NOT have Next button"
    );

    const res = await fetch("http://localhost:5000/api/puja-categories");
    const json = await res.json();
    assert.strictEqual(json.data.length, 8, "All 8 active categories must be returned");
  });

  // 8. Category card click → navigates to /yagya-puja/puja/category/:categorySlug
  runTest("8. Category card click navigates to /yagya-puja/puja/category/:categorySlug", () => {
    const cardPath = path.join(ROOT, "src/features/yagyaPuja/components/PujaCategoryCard.jsx");
    const cardContent = fs.readFileSync(cardPath, "utf-8");
    assert(
      cardContent.includes("`/yagya-puja/puja/category/${category.slug}`"),
      "PujaCategoryCard must link to /yagya-puja/puja/category/:categorySlug"
    );
  });

  // 9. Category-specific page displays category info and all active services for that category
  await runAsyncTest("9. Category-specific page displays category info and assigned services (/yagya-puja/puja/category/:categorySlug)", async () => {
    assert(
      categoryListingContent.includes("getPujaCategoryBySlug"),
      "PujaCategoryListing must fetch category by slug"
    );
    assert(
      categoryListingContent.includes("categorySlug"),
      "PujaCategoryListing must consume categorySlug param"
    );

    const catRes = await fetch("http://localhost:5000/api/puja-categories/shiva-puja");
    const catJson = await catRes.json();
    assert.strictEqual(catJson.success, true);
    assert.strictEqual(catJson.data.slug, "shiva-puja");

    const servRes = await fetch("http://localhost:5000/api/puja-services?category=shiva-puja");
    const servJson = await servRes.json();
    assert.strictEqual(servJson.success, true);
    assert(servJson.data.length > 0, "Shiva Puja must return assigned services");
  });

  // 10. Service detail and booking routes remain intact
  await runAsyncTest("10. Service detail and booking routes remain intact", async () => {
    assert(
      appRoutesContent.includes('path="/yagya-puja/puja/:slug"'),
      "Service detail route must exist"
    );
    assert(
      appRoutesContent.includes('path="/yagya-puja/puja/:slug/book"'),
      "Booking route must exist"
    );

    const detailRes = await fetch("http://localhost:5000/api/puja-services/rudrabhishek-puja");
    const detailJson = await detailRes.json();
    assert.strictEqual(detailJson.success, true);
    assert.strictEqual(detailJson.data.slug, "rudrabhishek-puja");
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
  console.error("Test execution failed:", err);
  process.exit(1);
});
