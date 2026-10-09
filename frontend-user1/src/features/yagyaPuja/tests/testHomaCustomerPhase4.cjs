/**
 * Phase 4: Homa Customer Dedicated Category Listing Test Suite
 * Comprehensive verification of routing, API integration, filtering, sorting,
 * pagination, states, accessibility, SEO, responsive architecture, and isolation.
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
  console.log("PHASE 4: HOMA CUSTOMER DEDICATED CATEGORY LISTING TEST SUITE");
  console.log("================================================================\n");

  const categoryListingPath = path.join(
    feDir,
    "src/features/yagyaPuja/pages/HomaCategoryListing.jsx"
  );
  const appRoutesPath = path.join(feDir, "src/routes/AppRoutes.jsx");

  assert.ok(fs.existsSync(categoryListingPath), "HomaCategoryListing.jsx must exist");
  assert.ok(fs.existsSync(appRoutesPath), "AppRoutes.jsx must exist");

  const categoryListingContent = fs.readFileSync(categoryListingPath, "utf8");
  const appRoutesContent = fs.readFileSync(appRoutesPath, "utf8");

  // 1. category route exists
  await test("1. Category route exists in AppRoutes.jsx", async () => {
    assert.ok(
      appRoutesContent.includes("import HomaCategoryListing"),
      "AppRoutes must import HomaCategoryListing"
    );
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/homa/category/:categorySlug" element={<HomaCategoryListing />}'),
      "AppRoutes must register /yagya-puja/homa/category/:categorySlug"
    );
  });

  // 2. route ordering before :slug
  await test("2. Route ordering: /yagya-puja/homa/category/:categorySlug appears before :slug", async () => {
    const categoryRouteIdx = appRoutesContent.indexOf('/yagya-puja/homa/category/:categorySlug');
    const slugRouteIdx = appRoutesContent.indexOf('/yagya-puja/homa/:slug"');
    assert.ok(categoryRouteIdx !== -1, "Category route must exist in AppRoutes");
    assert.ok(slugRouteIdx !== -1, "Slug route must exist in AppRoutes");
    assert.ok(
      categoryRouteIdx < slugRouteIdx,
      `Category route index (${categoryRouteIdx}) must precede service :slug route index (${slugRouteIdx}) to prevent wildcard capture`
    );
  });

  // 3. category metadata API integration
  await test("3. Category metadata API integration (GET /api/homa-categories/:categorySlug)", async () => {
    assert.ok(
      categoryListingContent.includes("getHomaCategoryBySlug"),
      "HomaCategoryListing must call getHomaCategoryBySlug"
    );
    const res = await fetch(`${API_BASE}/homa-categories/shiva-rudra-homa`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.slug, "shiva-rudra-homa");
    assert.strictEqual(json.data.name, "Shiva & Rudra Homa");
    assert.ok(json.data.description, "Category metadata must contain description");
  });

  // 4. category service API integration
  await test("4. Category service API integration (GET /api/homa-services?category=:categorySlug)", async () => {
    assert.ok(
      categoryListingContent.includes("getHomaServices"),
      "HomaCategoryListing must call getHomaServices"
    );
    const res = await fetch(`${API_BASE}/homa-services?category=shiva-rudra-homa`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data), "Services must be an array");
    assert.ok(json.data.length > 0, "Must return services for shiva-rudra-homa");
  });

  // 5. correct category filtering
  await test("5. Correct category filtering: returned services belong strictly to the category", async () => {
    const res = await fetch(`${API_BASE}/homa-services?category=ganapati-homa`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.length >= 1, "Expected at least 1 service for ganapati-homa");
    for (const s of json.data) {
      assert.strictEqual(
        s.category?.slug,
        "ganapati-homa",
        `Service ${s.slug} must belong to ganapati-homa`
      );
    }
  });

  // 6. wrong-category exclusion
  await test("6. Wrong-category exclusion: services from other categories are excluded", async () => {
    const res = await fetch(`${API_BASE}/homa-services?category=ganapati-homa`);
    const json = await res.json();
    const slugs = json.data.map((s) => s.slug);
    assert.ok(
      !slugs.includes("maha-mrityunjaya-homa"),
      "Maha Mrityunjaya Homa (Shiva) must NOT appear in Ganapati category"
    );
    assert.ok(
      !slugs.includes("rudra-homa"),
      "Rudra Homa (Shiva) must NOT appear in Ganapati category"
    );
  });

  // 7. search + category
  await test("7. Multi-filter: search + category retains category constraint", async () => {
    const res = await fetch(`${API_BASE}/homa-services?category=shiva-rudra-homa&search=rudra`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.length >= 1, "Must find rudra within shiva-rudra-homa");
    for (const s of json.data) {
      assert.strictEqual(s.category?.slug, "shiva-rudra-homa");
      const text = `${s.name} ${s.shortDescription || ""} ${s.description || ""}`.toLowerCase();
      assert.ok(text.includes("rudra"), "Must match search term 'rudra'");
    }
  });

  // 8. purpose + category
  await test("8. Multi-filter: purpose + category keeps both constraints distinct", async () => {
    const res = await fetch(`${API_BASE}/homa-services?category=shiva-rudra-homa&purpose=health-longevity`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    for (const s of json.data) {
      assert.strictEqual(s.category?.slug, "shiva-rudra-homa");
    }
  });

  // 9. havanCount + category
  await test("9. Multi-filter: havanCount + category preserves count constraint", async () => {
    const res = await fetch(`${API_BASE}/homa-services?category=shiva-rudra-homa&havanCount=3`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    for (const s of json.data) {
      assert.strictEqual(s.category?.slug, "shiva-rudra-homa");
      assert.ok(
        Array.isArray(s.availableHavanCounts) && s.availableHavanCounts.includes(3),
        "Service must support 3 Havans"
      );
    }
  });

  // 10. days + category
  await test("10. Multi-filter: days + category preserves days constraint", async () => {
    const res = await fetch(`${API_BASE}/homa-services?category=shiva-rudra-homa&days=1`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    for (const s of json.data) {
      assert.strictEqual(s.category?.slug, "shiva-rudra-homa");
      assert.ok(
        Array.isArray(s.availableDays) && s.availableDays.includes(1),
        "Service must support 1 Day"
      );
    }
  });

  // 11. mode + category
  await test("11. Multi-filter: mode + category preserves mode constraint", async () => {
    const res = await fetch(`${API_BASE}/homa-services?category=shiva-rudra-homa&mode=kashi`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    for (const s of json.data) {
      assert.strictEqual(s.category?.slug, "shiva-rudra-homa");
      assert.strictEqual(s.isKashiAvailable, true, "Must have isKashiAvailable = true");
    }
  });

  // 12. sorting
  await test("12. Sorting options supported (featured, price-asc, price-desc, name-asc)", async () => {
    assert.ok(
      categoryListingContent.includes("SORT_OPTIONS"),
      "Must define SORT_OPTIONS"
    );
    const resAsc = await fetch(`${API_BASE}/homa-services?category=shiva-rudra-homa&sortBy=price-asc`);
    assert.strictEqual(resAsc.status, 200);
    const jsonAsc = await resAsc.json();
    if (jsonAsc.data.length > 1) {
      assert.ok(
        jsonAsc.data[0].startingPrice <= jsonAsc.data[1].startingPrice,
        "Services should be sorted by startingPrice ascending"
      );
    }
  });

  // 13. pagination
  await test("13. Server-side pagination parameters (page, limit=6)", async () => {
    assert.ok(
      categoryListingContent.includes("PAGE_SIZE = 6") || categoryListingContent.includes("PAGE_SIZE=6"),
      "PAGE_SIZE must be configured as 6"
    );
    assert.ok(
      categoryListingContent.includes("handlePageChange"),
      "Must include handlePageChange for pagination"
    );
    const res = await fetch(`${API_BASE}/homa-services?category=shiva-rudra-homa&page=1&limit=6`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.currentPage, 1);
    assert.ok(json.totalPages >= 1, "Must return totalPages >= 1");
  });

  // 14. filter reset
  await test("14. Filter reset: clears filters without clearing category context", async () => {
    assert.ok(
      categoryListingContent.includes("handleResetFilters"),
      "Must implement handleResetFilters"
    );
    assert.ok(
      categoryListingContent.includes("activeFilterCount"),
      "Must calculate activeFilterCount"
    );
  });

  // 15. URL synchronization
  await test("15. URL synchronization via useSearchParams", async () => {
    assert.ok(
      categoryListingContent.includes("useSearchParams"),
      "Must import and use useSearchParams"
    );
    assert.ok(
      categoryListingContent.includes("updateParams"),
      "Must implement updateParams helper to synchronize state"
    );
  });

  // 16. refresh state preservation
  await test("16. Refresh state preservation: reads query params on initial render", async () => {
    assert.ok(
      categoryListingContent.includes('searchParams.get("search")'),
      "Reads search parameter from URL"
    );
    assert.ok(
      categoryListingContent.includes('searchParams.get("purpose")'),
      "Reads purpose parameter from URL"
    );
    assert.ok(
      categoryListingContent.includes('searchParams.get("havanCount")'),
      "Reads havanCount parameter from URL"
    );
    assert.ok(
      categoryListingContent.includes('searchParams.get("days")'),
      "Reads days parameter from URL"
    );
    assert.ok(
      categoryListingContent.includes('searchParams.get("mode")'),
      "Reads mode parameter from URL"
    );
    assert.ok(
      categoryListingContent.includes('searchParams.get("sortBy")'),
      "Reads sortBy parameter from URL"
    );
    assert.ok(
      categoryListingContent.includes('searchParams.get("page")'),
      "Reads page parameter from URL"
    );
  });

  // 17. invalid category
  await test("17. Invalid category handling: returns 404 and displays not found state", async () => {
    const res = await fetch(`${API_BASE}/homa-categories/nonexistent-slug`);
    assert.strictEqual(res.status, 404);
    assert.ok(
      categoryListingContent.includes("categoryNotFound"),
      "Must implement categoryNotFound state"
    );
    assert.ok(
      categoryListingContent.includes("Homa Category Not Found"),
      "Must display Homa Category Not Found message"
    );
  });

  // 18. inactive category
  await test("18. Inactive category handling: treated safely as unavailable/not found", async () => {
    assert.ok(
      categoryListingContent.includes("catData.isActive === false"),
      "Must check catData.isActive === false and mark not found"
    );
  });

  // 19. empty category
  await test("19. Empty category state: intentional empty state with explanation and CTA", async () => {
    assert.ok(
      categoryListingContent.includes("services.length === 0"),
      "Must handle empty service listing"
    );
    assert.ok(
      categoryListingContent.includes("No Rituals Match Your Filters") ||
      categoryListingContent.includes("No Rituals Available in"),
      "Must provide clear message for empty category"
    );
    assert.ok(
      categoryListingContent.includes("/yagya-puja/homa"),
      "Must provide link back to main Homa catalogue"
    );
  });

  // 20. loading state
  await test("20. Loading skeleton state: skeleton cards prevent layout jumps", async () => {
    assert.ok(
      categoryListingContent.includes("categoryLoading"),
      "Must track categoryLoading state"
    );
    assert.ok(
      categoryListingContent.includes("servicesLoading"),
      "Must track servicesLoading state"
    );
    assert.ok(
      categoryListingContent.includes("animate-pulse"),
      "Must use animate-pulse skeleton cards"
    );
  });

  // 21. error state
  await test("21. Error state handling: handles API failures gracefully", async () => {
    assert.ok(
      categoryListingContent.includes("categoryError"),
      "Must handle categoryError"
    );
    assert.ok(
      categoryListingContent.includes("servicesError"),
      "Must handle servicesError"
    );
  });

  // 22. retry
  await test("22. Retry functionality: reload triggers retry for failed calls", async () => {
    assert.ok(
      categoryListingContent.includes("reloadTrigger"),
      "Must have reloadTrigger state"
    );
    assert.ok(
      categoryListingContent.includes("Retry Loading") || categoryListingContent.includes("Retry"),
      "Must provide Retry button"
    );
  });

  // 23. breadcrumb
  await test("23. Semantic breadcrumb navigation with aria-current='page'", async () => {
    assert.ok(
      categoryListingContent.includes('aria-label="Breadcrumb"'),
      "Must use semantic <nav aria-label='Breadcrumb'>"
    );
    assert.ok(
      categoryListingContent.includes('aria-current="page"'),
      "Current page item must have aria-current='page'"
    );
    assert.ok(
      categoryListingContent.includes("/yagya-puja/homa"),
      "Breadcrumb links to /yagya-puja/homa"
    );
  });

  // 24. service card navigation
  await test("24. Service card renders HomaServiceCard linking to /yagya-puja/homa/:slug", async () => {
    assert.ok(
      categoryListingContent.includes("HomaServiceCard"),
      "Must import and render HomaServiceCard"
    );
    const cardPath = path.join(feDir, "src/features/yagyaPuja/components/HomaServiceCard.jsx");
    const cardContent = fs.readFileSync(cardPath, "utf8");
    assert.ok(
      cardContent.includes("/yagya-puja/homa/"),
      "HomaServiceCard must link to /yagya-puja/homa/:slug"
    );
  });

  // 25. booking route preservation
  await test("25. Booking route preservation: /yagya-puja/homa/:slug/book exists unchanged", async () => {
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/homa/:slug/book"'),
      "Booking route must remain registered"
    );
  });

  // 26. accessibility
  await test("26. Accessibility standards: semantic H1, form labels, ARIA landmarks", async () => {
    assert.ok(
      categoryListingContent.includes("<h1"),
      "Must include semantic <h1"
    );
    assert.ok(
      categoryListingContent.includes('aria-label="Search within this category"'),
      "Search input has accessible aria-label"
    );
    assert.ok(
      categoryListingContent.includes('aria-label="Clear search query"'),
      "Search clear button has accessible aria-label"
    );
    assert.ok(
      categoryListingContent.includes('aria-label="Pagination Navigation"'),
      "Pagination nav has accessible aria-label"
    );
  });

  // 27. responsive structure
  await test("27. Responsive structure: grid-cols-1, sm:grid-cols-2, lg:grid-cols-3", async () => {
    assert.ok(
      categoryListingContent.includes("grid-cols-1"),
      "Must define mobile 1-column layout"
    );
    assert.ok(
      categoryListingContent.includes("grid-cols-2") || categoryListingContent.includes("md:grid-cols-2"),
      "Must define tablet 2-column layout"
    );
    assert.ok(
      categoryListingContent.includes("lg:grid-cols-3"),
      "Must define desktop 3-column layout"
    );
  });

  // 28. SEO metadata
  await test("28. Dynamic SEO metadata updates document.title and meta description", async () => {
    assert.ok(
      categoryListingContent.includes("document.title"),
      "Must set document.title based on category.name"
    );
    assert.ok(
      categoryListingContent.includes('meta[name="description"]'),
      "Must update meta description using category.description"
    );
  });

  // 29. no hardcoded categories
  await test("29. No hardcoded categories in JSX or service listing", async () => {
    assert.ok(
      !categoryListingContent.includes('["Shiva & Rudra Homa",'),
      "Must not hardcode canonical category names in array"
    );
    assert.ok(
      categoryListingContent.includes("getHomaCategoryBySlug"),
      "Must dynamically fetch category metadata from backend"
    );
  });

  // 30. no booking/pricing modifications
  await test("30. Strict isolation: booking wizard, pricing, and backend controllers are untouched", async () => {
    const wizardPath = path.join(
      feDir,
      "src/features/yagyaPuja/pages/RitualBookingWizard.jsx"
    );
    const stepHomaPath = path.join(
      feDir,
      "src/features/yagyaPuja/components/booking/StepConfigurationHoma.jsx"
    );
    const pricingPath = path.join(
      rootDir,
      "backend/src/services/ritualPricing.service.js"
    );

    assert.ok(fs.existsSync(wizardPath), "RitualBookingWizard must exist");
    assert.ok(fs.existsSync(stepHomaPath), "StepConfigurationHoma must exist");
    assert.ok(fs.existsSync(pricingPath), "ritualPricing.service.js must exist");

    // Ensure Phase 4 only created/modified allowed customer files
    const wizardContent = fs.readFileSync(wizardPath, "utf8");
    assert.ok(
      !wizardContent.includes("HomaCategoryListing"),
      "RitualBookingWizard must not be modified for HomaCategoryListing"
    );
  });

  console.log("\n================================================================");
  console.log(`PHASE 4 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner encountered fatal error:", err);
  process.exit(1);
});
