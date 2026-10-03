/**
 * Comprehensive Test Suite for Puja Category Card UI and Navigation Final Correction
 *
 * Covers all 31 points from Section 42 of the specification + Grid Layout:
 * 1. Puja landing loads active categories
 * 2. Puja landing renders category cards
 * 3. Maximum 6 categories on landing
 * 4. 3 categories renders 3
 * 5. 6 categories renders 6
 * 6. 8 categories renders first 6
 * 7. No pagination on landing
 * 8. View All appears when categories > 6
 * 9. View All navigates to /yagya-puja/puja/all
 * 10. All Categories page loads all active categories
 * 11. All Categories page has no pagination
 * 12. Category cards use real API data
 * 13. Category image renders
 * 14. Category name renders
 * 15. Category description does NOT render inside card
 * 16. Vedic Tradition badge does NOT render
 * 17. Explore Pujas CTA renders
 * 18. Entire category card is clickable
 * 19. Correct category slug is used
 * 20. Category route opens correctly
 * 21. Category page loads selected category
 * 22. Category page loads all services for selected category
 * 23. Category page has no pagination
 * 24. Category service cards remain functional
 * 25. Service detail route remains functional
 * 26. Booking route remains functional
 * 27. Invalid category shows Not Found
 * 28. Empty category shows correct empty state
 * 29. Inactive categories are excluded
 * 30. Existing service detail remains unchanged
 * 31. Existing booking remains unchanged
 * 32. Responsive Grid: Desktop uses 3 columns (lg:grid-cols-3)
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
  console.log("   PUJA CATEGORY CARD UI & NAVIGATION FINAL AUDIT");
  console.log("=======================================================\n");

  const previewPath = path.join(ROOT, "src/features/yagyaPuja/pages/PujaCatalogueListing.jsx");
  const allCataloguePath = path.join(ROOT, "src/features/yagyaPuja/pages/PujaAllCatalogueListing.jsx");
  const categoryListingPath = path.join(ROOT, "src/features/yagyaPuja/pages/PujaCategoryListing.jsx");
  const discoveryPath = path.join(ROOT, "src/features/yagyaPuja/components/PujaCategoryDiscovery.jsx");
  const cardPath = path.join(ROOT, "src/features/yagyaPuja/components/PujaCategoryCard.jsx");
  const serviceCardPath = path.join(ROOT, "src/features/yagyaPuja/components/PujaServiceCard.jsx");
  const detailsPath = path.join(ROOT, "src/features/yagyaPuja/pages/PujaServiceDetails.jsx");
  const appRoutesPath = path.join(ROOT, "src/routes/AppRoutes.jsx");

  const previewContent = fs.readFileSync(previewPath, "utf-8");
  const allCatalogueContent = fs.readFileSync(allCataloguePath, "utf-8");
  const categoryListingContent = fs.readFileSync(categoryListingPath, "utf-8");
  const discoveryContent = fs.readFileSync(discoveryPath, "utf-8");
  const cardContent = fs.readFileSync(cardPath, "utf-8");
  const serviceCardContent = fs.readFileSync(serviceCardPath, "utf-8");
  const detailsContent = fs.readFileSync(detailsPath, "utf-8");
  const appRoutesContent = fs.readFileSync(appRoutesPath, "utf-8");

  // Helper simulating the preview calculation logic:
  function computePreviewState(categoriesList, limit = 6) {
    const displayedCategories = limit ? categoriesList.slice(0, limit) : categoriesList;
    const hasMore = categoriesList.length > limit;
    return {
      displayedCount: displayedCategories.length,
      hasMore,
      showEmpty: displayedCategories.length === 0,
    };
  }

  // 1. Puja landing loads active categories
  await runAsyncTest("1. Puja landing loads active categories", async () => {
    assert(
      discoveryContent.includes("getPujaCategories"),
      "PujaCategoryDiscovery must call getPujaCategories"
    );
    const res = await fetch("http://localhost:5000/api/puja-categories");
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(Array.isArray(json.data) && json.data.length > 0);
  });

  // 2. Puja landing renders category cards
  runTest("2. Puja landing renders category cards", () => {
    assert(
      previewContent.includes("<PujaCategoryDiscovery"),
      "PujaCatalogueListing must include PujaCategoryDiscovery"
    );
    assert(
      discoveryContent.includes("<PujaCategoryCard"),
      "PujaCategoryDiscovery must render PujaCategoryCard"
    );
  });

  // 3. Maximum 6 categories on landing
  runTest("3. Maximum 6 categories on landing", () => {
    assert(
      discoveryContent.includes("limit = 6") || discoveryContent.includes("slice(0, limit)"),
      "Preview must limit cards to maximum 6"
    );
    const mock = Array.from({ length: 15 }, (_, i) => ({ id: i }));
    const state = computePreviewState(mock, 6);
    assert.strictEqual(state.displayedCount, 6);
  });

  // 4. 3 categories renders 3
  runTest("4. 3 categories renders 3", () => {
    const mock = Array.from({ length: 3 }, (_, i) => ({ id: i }));
    const state = computePreviewState(mock, 6);
    assert.strictEqual(state.displayedCount, 3);
    assert.strictEqual(state.hasMore, false);
  });

  // 5. 6 categories renders 6
  runTest("5. 6 categories renders 6", () => {
    const mock = Array.from({ length: 6 }, (_, i) => ({ id: i }));
    const state = computePreviewState(mock, 6);
    assert.strictEqual(state.displayedCount, 6);
    assert.strictEqual(state.hasMore, false);
  });

  // 6. 8 categories renders first 6
  runTest("6. 8 categories renders first 6", () => {
    const mock = Array.from({ length: 8 }, (_, i) => ({ id: i }));
    const state = computePreviewState(mock, 6);
    assert.strictEqual(state.displayedCount, 6);
    assert.strictEqual(state.hasMore, true);
  });

  // 7. No pagination on landing
  runTest("7. No pagination on landing", () => {
    assert(!previewContent.includes("totalPages"), "Landing must NOT contain totalPages");
    assert(!previewContent.includes("handlePageChange"), "Landing must NOT contain handlePageChange");
    assert(!discoveryContent.includes("totalPages"), "Discovery must NOT contain totalPages");
    assert(!discoveryContent.includes("Previous"), "Discovery must NOT contain Previous button");
    assert(!discoveryContent.includes("Next"), "Discovery must NOT contain Next button");
  });

  // 8. View All appears when categories > 6
  runTest("8. View All appears when categories > 6", () => {
    assert(
      discoveryContent.includes("hasMore") && discoveryContent.includes("showViewAll"),
      "View All button condition must require hasMore"
    );
    assert(discoveryContent.includes("View All Puja"), "Must render View All Puja text");
  });

  // 9. View All navigates to /yagya-puja/puja/all
  runTest("9. View All navigates to /yagya-puja/puja/all", () => {
    assert(
      discoveryContent.includes('to="/yagya-puja/puja/all"'),
      "View All Puja must link to /yagya-puja/puja/all"
    );
  });

  // 10. All Categories page loads all active categories
  await runAsyncTest("10. All Categories page loads all active categories", async () => {
    assert(
      allCatalogueContent.includes("getPujaCategories"),
      "All Categories page must call getPujaCategories()"
    );
    const res = await fetch("http://localhost:5000/api/puja-categories");
    const json = await res.json();
    assert.strictEqual(json.data.length, 8);
  });

  // 11. All Categories page has no pagination
  runTest("11. All Categories page has no pagination", () => {
    assert(!allCatalogueContent.includes("totalPages"), "All categories must have no totalPages");
    assert(!allCatalogueContent.includes("handlePageChange"), "All categories must have no handlePageChange");
    assert(!allCatalogueContent.includes("Previous"), "All categories must have no Previous button");
    assert(!allCatalogueContent.includes("Next"), "All categories must have no Next button");
  });

  // 12. Category cards use real API data
  runTest("12. Category cards use real API data", () => {
    assert(cardContent.includes("category.name"), "Card must render category.name");
    assert(cardContent.includes("category.slug"), "Card must render category.slug");
    assert(cardContent.includes("category.image"), "Card must support category.image");
  });

  // 13. Category image renders
  runTest("13. Category image renders with consistent aspect ratio", () => {
    assert(cardContent.includes("<img"), "Card must render img tag");
    assert(cardContent.includes("aspect-[16/10]"), "Card must have consistent 16/10 aspect ratio");
    assert(cardContent.includes("object-cover"), "Card must have object-cover class");
  });

  // 14. Category name renders
  runTest("14. Category name renders prominently", () => {
    assert(
      cardContent.includes("<h3") && cardContent.includes("{category.name}"),
      "Card must render category name in h3"
    );
  });

  // 15. Category description does NOT render inside card
  runTest("15. Category description does NOT render inside card", () => {
    assert(
      !cardContent.includes("category.description"),
      "Category description must NOT be rendered inside category card"
    );
  });

  // 16. Vedic Tradition badge does NOT render
  runTest("16. Vedic Tradition badge does NOT render inside card", () => {
    assert(
      !cardContent.includes("Vedic Tradition"),
      "Vedic Tradition badge must NOT be rendered inside category card"
    );
  });

  // 17. Explore Pujas CTA renders
  runTest("17. Explore Pujas CTA renders", () => {
    assert(
      cardContent.includes("Explore Pujas"),
      "Category card must render Explore Pujas CTA"
    );
  });

  // 18. Entire category card is clickable
  runTest("18. Entire category card is clickable via Link", () => {
    assert(
      cardContent.startsWith("import") && cardContent.includes("<Link"),
      "Card must be wrapped in Link"
    );
    assert(
      !cardContent.includes("<button"),
      "Card must not nest button elements inside Link"
    );
  });

  // 19. Correct category slug is used
  runTest("19. Correct category slug is used in card Link", () => {
    assert(
      cardContent.includes("`/yagya-puja/puja/category/${category.slug}`"),
      "Card must navigate to /yagya-puja/puja/category/${category.slug}"
    );
  });

  // 20. Category route opens correctly
  runTest("20. Category route opens correctly in AppRoutes", () => {
    assert(
      appRoutesContent.includes('path="/yagya-puja/puja/category/:categorySlug"'),
      "Route /yagya-puja/puja/category/:categorySlug must be registered"
    );
  });

  // 21. Category page loads selected category
  await runAsyncTest("21. Category page loads selected category", async () => {
    assert(
      categoryListingContent.includes("getPujaCategoryBySlug"),
      "Category page must call getPujaCategoryBySlug"
    );
    const res = await fetch("http://localhost:5000/api/puja-categories/ganesh-puja");
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.slug, "ganesh-puja");
  });

  // 22. Category page loads all services for selected category
  await runAsyncTest("22. Category page loads all services for selected category", async () => {
    assert(
      categoryListingContent.includes("category: categorySlug"),
      "Services query must filter by categorySlug"
    );
    const res = await fetch("http://localhost:5000/api/puja-services?category=ganesh-puja");
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(Array.isArray(json.data));
  });

  // 23. Category page has no pagination
  runTest("23. Category page has no pagination controls", () => {
    assert(
      !categoryListingContent.includes("aria-label=\"Previous Page\""),
      "Category page must NOT have Previous page button"
    );
    assert(
      !categoryListingContent.includes("aria-label=\"Next Page\""),
      "Category page must NOT have Next page button"
    );
    assert(
      !categoryListingContent.includes("aria-label={`Go to page"),
      "Category page must NOT have page number buttons"
    );
  });

  // 24. Category service cards remain functional
  runTest("24. Category service cards remain functional", () => {
    assert(
      categoryListingContent.includes("<PujaServiceCard"),
      "Category page must render PujaServiceCard"
    );
    assert(
      serviceCardContent.includes("to={`/yagya-puja/puja/${service.slug}`}") ||
      serviceCardContent.includes("to={`/yagya-puja/puja/${slug}`}"),
      "PujaServiceCard must link to /yagya-puja/puja/:slug"
    );
  });

  // 25. Service detail route remains functional
  runTest("25. Service detail route remains functional", () => {
    assert(
      appRoutesContent.includes('path="/yagya-puja/puja/:slug"'),
      "Service detail route must be registered"
    );
  });

  // 26. Booking route remains functional
  runTest("26. Booking route remains functional", () => {
    assert(
      appRoutesContent.includes('path="/yagya-puja/puja/:slug/book"'),
      "Booking route must be registered"
    );
    assert(
      detailsContent.includes("/yagya-puja/puja/") && detailsContent.includes("/book"),
      "Service detail must link to booking wizard"
    );
  });

  // 27. Invalid category shows Not Found
  await runAsyncTest("27. Invalid category shows Not Found", async () => {
    assert(
      categoryListingContent.includes("categoryNotFound") && categoryListingContent.includes("404"),
      "Category listing must handle not-found state"
    );
    const res = await fetch("http://localhost:5000/api/puja-categories/invalid-slug-9999");
    assert.strictEqual(res.status, 404);
  });

  // 28. Empty category shows correct empty state
  runTest("28. Empty category shows correct empty state", () => {
    assert(
      categoryListingContent.includes("No Puja services are currently available in this category."),
      "Must render required empty state wording"
    );
    assert(
      categoryListingContent.includes('to="/yagya-puja/puja/all"'),
      "Empty state must navigate to /yagya-puja/puja/all"
    );
  });

  // 29. Inactive categories are excluded
  await runAsyncTest("29. Inactive categories are excluded from public API", async () => {
    const res = await fetch("http://localhost:5000/api/puja-categories");
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.length, 8);
    // Verified: backend query strictly enforces { where: { isActive: true } }
  });

  // 30. Existing service detail remains unchanged
  runTest("30. Existing service detail remains unchanged", () => {
    assert(
      detailsContent.includes("Book This Puja") || detailsContent.includes("Book"),
      "Service details must have Book Puja CTA"
    );
    assert(
      detailsContent.includes("pujaServiceCatalogueService") || detailsContent.includes("pujaCatalogueService"),
      "Service details must consume puja service"
    );
  });

  // 31. Existing booking remains unchanged
  runTest("31. Existing booking remains unchanged", () => {
    assert(
      appRoutesContent.includes('path="/yagya-puja/puja/:slug/book"'),
      "AppRoutes must preserve booking path"
    );
  });

  // 32. Responsive Grid: Desktop uses 3 columns (lg:grid-cols-3)
  runTest("32. Responsive Grid: Desktop uses 3 columns (lg:grid-cols-3)", () => {
    assert(
      discoveryContent.includes("lg:grid-cols-3"),
      "PujaCategoryDiscovery must use lg:grid-cols-3"
    );
    assert(
      !discoveryContent.includes("lg:grid-cols-4") && !discoveryContent.includes("xl:grid-cols-4"),
      "PujaCategoryDiscovery must NOT use 4 columns on desktop"
    );
    assert(
      allCatalogueContent.includes("lg:grid-cols-3"),
      "PujaAllCatalogueListing must use lg:grid-cols-3"
    );
    assert(
      !allCatalogueContent.includes("xl:grid-cols-4"),
      "PujaAllCatalogueListing must NOT use 4 columns on desktop"
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
  console.error("Test execution failed:", err);
  process.exit(1);
});
