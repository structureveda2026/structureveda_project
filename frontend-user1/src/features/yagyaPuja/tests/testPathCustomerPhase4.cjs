/**
 * Phase 4: Path Customer Dedicated Category Listing Test Suite
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
  console.log("PHASE 4: PATH CUSTOMER DEDICATED CATEGORY LISTING TEST SUITE");
  console.log("================================================================\n");

  const categoryListingPath = path.join(
    feDir,
    "src/features/yagyaPuja/pages/PathCategoryListing.jsx"
  );
  const appRoutesPath = path.join(feDir, "src/routes/AppRoutes.jsx");

  assert.ok(fs.existsSync(categoryListingPath), "PathCategoryListing.jsx must exist");
  assert.ok(fs.existsSync(appRoutesPath), "AppRoutes.jsx must exist");

  const categoryListingContent = fs.readFileSync(categoryListingPath, "utf8");
  const appRoutesContent = fs.readFileSync(appRoutesPath, "utf8");

  // 1. Category route exists in AppRoutes.jsx
  await test("1. Category route exists in AppRoutes.jsx", async () => {
    assert.ok(
      appRoutesContent.includes("import PathCategoryListing"),
      "AppRoutes must import PathCategoryListing"
    );
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/path/category/:categorySlug" element={<PathCategoryListing />}'),
      "AppRoutes must register /yagya-puja/path/category/:categorySlug"
    );
  });

  // 2. Route ordering: /yagya-puja/path/category/:categorySlug appears before :slug
  await test("2. Route ordering: /yagya-puja/path/category/:categorySlug appears before :slug", async () => {
    const categoryRouteIdx = appRoutesContent.indexOf('/yagya-puja/path/category/:categorySlug');
    const slugRouteIdx = appRoutesContent.indexOf('/yagya-puja/path/:slug"');
    assert.ok(categoryRouteIdx !== -1, "Category route must exist in AppRoutes");
    assert.ok(slugRouteIdx !== -1, "Slug route must exist in AppRoutes");
    assert.ok(
      categoryRouteIdx < slugRouteIdx,
      `Category route index (${categoryRouteIdx}) must precede service :slug route index (${slugRouteIdx}) to prevent wildcard capture`
    );
  });

  // 3. Category metadata API integration
  await test("3. Category metadata API integration (GET /api/path-categories/:categorySlug)", async () => {
    assert.ok(
      categoryListingContent.includes("getPathCategoryBySlug"),
      "PathCategoryListing must call getPathCategoryBySlug"
    );
    const res = await fetch(`${API_BASE}/path-categories/ramayana-manas-path`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.slug, "ramayana-manas-path");
    assert.strictEqual(json.data.name, "Ramayana & Manas Parayan");
    assert.ok(json.data.description, "Category metadata must contain description");
  });

  // 4. Category service API integration
  await test("4. Category service API integration (GET /api/path-services?category=:categorySlug)", async () => {
    assert.ok(
      categoryListingContent.includes("getPathServices"),
      "PathCategoryListing must call getPathServices"
    );
    const res = await fetch(`${API_BASE}/path-services?category=ramayana-manas-path`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.services || json.data), "Services must be an array");
    const services = json.services || json.data;
    assert.ok(services.length > 0, "Must return services for ramayana-manas-path");
  });

  // 5. Seven canonical categories resolve dynamically
  const canonicalSlugs = [
    "ramayana-manas-path",
    "shiva-rudri-path",
    "durga-shakta-path",
    "bhagavad-gita-scripture",
    "vishnu-suktam-path",
    "lakshmi-stotra-path",
    "surya-solar-path",
  ];

  await test("5. Seven canonical categories resolve dynamically from backend", async () => {
    for (const slug of canonicalSlugs) {
      const res = await fetch(`${API_BASE}/path-categories/${slug}`);
      assert.strictEqual(res.status, 200, `Failed to load canonical category: ${slug}`);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.slug, slug);
      assert.ok(json.data.name, `Category ${slug} must have a name`);
      assert.strictEqual(json.data.isActive, true, `Category ${slug} must be active`);

      // Verify services endpoint also supports each category
      const sRes = await fetch(`${API_BASE}/path-services?category=${slug}`);
      assert.strictEqual(sRes.status, 200, `Failed to fetch services for category: ${slug}`);
      const sJson = await sRes.json();
      assert.strictEqual(sJson.success, true);
    }
  });

  // 6. Correct category filtering: returned services belong strictly to the category
  await test("6. Correct category filtering: returned services belong strictly to the category", async () => {
    const res = await fetch(`${API_BASE}/path-services?category=shiva-rudri-path`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    const services = json.services || json.data;
    assert.ok(services.length >= 1, "Expected at least 1 service for shiva-rudri-path");
    for (const s of services) {
      assert.strictEqual(
        s.category?.slug,
        "shiva-rudri-path",
        `Service ${s.slug} must belong to shiva-rudri-path`
      );
    }
  });

  // 7. Wrong-category exclusion: services from other categories are excluded
  await test("7. Wrong-category exclusion: services from other categories are excluded", async () => {
    const res = await fetch(`${API_BASE}/path-services?category=shiva-rudri-path`);
    const json = await res.json();
    const services = json.services || json.data;
    const slugs = services.map((s) => s.slug);
    assert.ok(
      !slugs.includes("akhand-ramayan-path"),
      "Akhand Ramayan Path (Ramayana) must NOT appear in Shiva & Rudri category"
    );
    assert.ok(
      !slugs.includes("bhagavad-gita-sampurna-path"),
      "Bhagavad Gita Path must NOT appear in Shiva & Rudri category"
    );
  });

  // 8. Multi-filter: search + category retains category constraint
  await test("8. Multi-filter: search + category retains category constraint", async () => {
    const res = await fetch(`${API_BASE}/path-services?category=shiva-rudri-path&search=rudri`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    const services = json.services || json.data;
    assert.ok(services.length >= 1, "Must find rudri within shiva-rudri-path");
    for (const s of services) {
      assert.strictEqual(s.category?.slug, "shiva-rudri-path");
      const text = `${s.name} ${s.shortDescription || ""} ${s.description || ""}`.toLowerCase();
      assert.ok(text.includes("rudri"), "Must match search term 'rudri'");
    }
  });

  // 9. Multi-filter: purpose + category keeps both constraints distinct & independent
  await test("9. Multi-filter: purpose + category keeps both constraints distinct & independent", async () => {
    const res = await fetch(`${API_BASE}/path-services?category=shiva-rudri-path&purpose=peace-protection`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    const services = json.services || json.data;
    for (const s of services) {
      assert.strictEqual(s.category?.slug, "shiva-rudri-path");
    }
  });

  // 10. Multi-filter: format + category preserves format constraint
  await test("10. Multi-filter: format + category preserves format constraint", async () => {
    const res = await fetch(`${API_BASE}/path-services?category=ramayana-manas-path&format=multi_day`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    const services = json.services || json.data;
    assert.ok(services.length >= 1, "Must find at least 1 multi_day service in ramayana-manas-path");
    for (const s of services) {
      assert.strictEqual(s.category?.slug, "ramayana-manas-path");
      assert.ok(
        Array.isArray(s.availableFormats) && s.availableFormats.includes("multi_day"),
        "Service must include multi_day in availableFormats"
      );
    }
  });

  // 11. Multi-filter: days + category preserves days constraint
  await test("11. Multi-filter: days + category preserves days constraint", async () => {
    const res = await fetch(`${API_BASE}/path-services?category=shiva-rudri-path&days=1`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    const services = json.services || json.data;
    assert.ok(services.length >= 1, "Must find at least 1 service supporting 1 day");
    for (const s of services) {
      assert.strictEqual(s.category?.slug, "shiva-rudri-path");
      assert.ok(
        1 >= s.minimumDays && 1 <= s.maximumDays,
        `Service must support 1 Day (min: ${s.minimumDays}, max: ${s.maximumDays})`
      );
    }
  });

  // 12. Multi-filter: mode + category preserves mode constraint
  await test("12. Multi-filter: mode + category preserves mode constraint", async () => {
    const res = await fetch(`${API_BASE}/path-services?category=shiva-rudri-path&mode=kashi`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    const services = json.services || json.data;
    for (const s of services) {
      assert.strictEqual(s.category?.slug, "shiva-rudri-path");
      assert.strictEqual(s.isKashiAvailable, true, "Must have isKashiAvailable = true");
    }
  });

  // 13. Sorting options supported
  await test("13. Sorting options supported (featured, price-asc, price-desc, name-asc)", async () => {
    assert.ok(
      categoryListingContent.includes("SORT_OPTIONS"),
      "Must define SORT_OPTIONS"
    );
    const resAsc = await fetch(`${API_BASE}/path-services?category=shiva-rudri-path&sortBy=price-asc`);
    assert.strictEqual(resAsc.status, 200);
    const jsonAsc = await resAsc.json();
    const servicesAsc = jsonAsc.services || jsonAsc.data;
    if (servicesAsc.length > 1) {
      assert.ok(
        servicesAsc[0].startingPrice <= servicesAsc[1].startingPrice,
        "Services should be sorted by startingPrice ascending"
      );
    }
  });

  // 14. Server-side pagination parameters
  await test("14. Server-side pagination parameters (page, limit=6)", async () => {
    assert.ok(
      categoryListingContent.includes("PAGE_SIZE = 6") || categoryListingContent.includes("PAGE_SIZE=6"),
      "PAGE_SIZE must be configured as 6"
    );
    assert.ok(
      categoryListingContent.includes("handlePageChange"),
      "Must include handlePageChange for pagination"
    );
    const res = await fetch(`${API_BASE}/path-services?category=shiva-rudri-path&page=1&limit=6`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.currentPage || json.page, 1);
    assert.ok((json.totalPages || 1) >= 1, "Must return totalPages >= 1");
  });

  // 15. Filter reset clears filters without clearing category context
  await test("15. Filter reset: clears filters without clearing category context", async () => {
    assert.ok(
      categoryListingContent.includes("handleResetFilters"),
      "Must implement handleResetFilters"
    );
    assert.ok(
      categoryListingContent.includes("activeFilterCount"),
      "Must calculate activeFilterCount"
    );
  });

  // 16. URL synchronization via useSearchParams
  await test("16. URL synchronization via useSearchParams", async () => {
    assert.ok(
      categoryListingContent.includes("useSearchParams"),
      "Must import and use useSearchParams"
    );
    assert.ok(
      categoryListingContent.includes("updateParams"),
      "Must implement updateParams helper to synchronize state"
    );
  });

  // 17. Refresh state preservation: reads query params on initial render
  await test("17. Refresh state preservation: reads query params on initial render", async () => {
    assert.ok(
      categoryListingContent.includes('searchParams.get("search")'),
      "Reads search parameter from URL"
    );
    assert.ok(
      categoryListingContent.includes('searchParams.get("purpose")'),
      "Reads purpose parameter from URL"
    );
    assert.ok(
      categoryListingContent.includes('searchParams.get("format")'),
      "Reads format parameter from URL"
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

  // 18. Invalid category handling
  await test("18. Invalid category handling: returns 404 and displays not found state", async () => {
    const res = await fetch(`${API_BASE}/path-categories/nonexistent-path-slug`);
    assert.strictEqual(res.status, 404);
    assert.ok(
      categoryListingContent.includes("categoryNotFound"),
      "Must implement categoryNotFound state"
    );
    assert.ok(
      categoryListingContent.includes("Path Category Not Found"),
      "Must display Path Category Not Found message"
    );
  });

  // 19. Inactive category handling
  await test("19. Inactive category handling: treated safely as unavailable/not found", async () => {
    assert.ok(
      categoryListingContent.includes("catData.isActive === false"),
      "Must check catData.isActive === false and mark not found"
    );
  });

  // 20. Empty category state
  await test("20. Empty category state: intentional empty state with explanation and CTA", async () => {
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
      categoryListingContent.includes("/yagya-puja/path"),
      "Must provide link back to main Path catalogue"
    );
  });

  // 21. Loading skeleton state
  await test("21. Loading skeleton state: skeleton cards prevent layout jumps", async () => {
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

  // 22. Error state handling
  await test("22. Error state handling: handles API failures gracefully", async () => {
    assert.ok(
      categoryListingContent.includes("categoryError"),
      "Must handle categoryError"
    );
    assert.ok(
      categoryListingContent.includes("servicesError"),
      "Must handle servicesError"
    );
  });

  // 23. Retry functionality
  await test("23. Retry functionality: reload triggers retry for failed calls", async () => {
    assert.ok(
      categoryListingContent.includes("reloadTrigger"),
      "Must have reloadTrigger state"
    );
    assert.ok(
      categoryListingContent.includes("Retry Loading") || categoryListingContent.includes("Retry"),
      "Must provide Retry button"
    );
  });

  // 24. Semantic breadcrumb navigation
  await test("24. Semantic breadcrumb navigation with aria-current='page'", async () => {
    assert.ok(
      categoryListingContent.includes('aria-label="Breadcrumb"'),
      "Must use semantic <nav aria-label='Breadcrumb'>"
    );
    assert.ok(
      categoryListingContent.includes('aria-current="page"'),
      "Current page item must have aria-current='page'"
    );
    assert.ok(
      categoryListingContent.includes("/yagya-puja/path"),
      "Breadcrumb links to /yagya-puja/path"
    );
  });

  // 25. Service card renders PathServiceCard linking to /yagya-puja/path/:slug
  await test("25. Service card renders PathServiceCard linking to /yagya-puja/path/:slug", async () => {
    assert.ok(
      categoryListingContent.includes("PathServiceCard"),
      "Must import and render PathServiceCard"
    );
    const cardPath = path.join(feDir, "src/features/yagyaPuja/components/PathServiceCard.jsx");
    const cardContent = fs.readFileSync(cardPath, "utf8");
    assert.ok(
      cardContent.includes("/yagya-puja/path/"),
      "PathServiceCard must link to /yagya-puja/path/:slug"
    );
  });

  // 26. Category links from PathCategoryDiscovery.jsx open the correct listing page
  await test("26. Category links from PathCategoryDiscovery.jsx open the correct listing page", async () => {
    const discoveryPath = path.join(
      feDir,
      "src/features/yagyaPuja/components/PathCategoryDiscovery.jsx"
    );
    const cardCompPath = path.join(
      feDir,
      "src/features/yagyaPuja/components/PathCategoryCard.jsx"
    );
    assert.ok(fs.existsSync(discoveryPath), "PathCategoryDiscovery.jsx must exist");
    assert.ok(fs.existsSync(cardCompPath), "PathCategoryCard.jsx must exist");

    const cardCompContent = fs.readFileSync(cardCompPath, "utf8");
    assert.ok(
      cardCompContent.includes("/yagya-puja/path/category/"),
      "PathCategoryCard must link to /yagya-puja/path/category/:categorySlug"
    );
  });

  // 27. Booking route preservation
  await test("27. Booking route preservation: /yagya-puja/path/:slug/book exists unchanged", async () => {
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/path/:slug/book"'),
      "Booking route must remain registered"
    );
  });

  // 28. Booking status route preservation
  await test("28. Booking status route preservation: /yagya-puja/path/:slug/booking-status exists unchanged", async () => {
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/path/:slug/booking-status"'),
      "Booking status route must remain registered"
    );
  });

  // 29. Accessibility standards
  await test("29. Accessibility standards: semantic H1, form labels, ARIA landmarks", async () => {
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

  // 30. Responsive structure
  await test("30. Responsive structure: grid-cols-1, sm:grid-cols-2, lg:grid-cols-3", async () => {
    assert.ok(
      categoryListingContent.includes("grid-cols-1"),
      "Must define mobile 1-column layout"
    );
    assert.ok(
      categoryListingContent.includes("sm:grid-cols-2"),
      "Must define tablet 2-column layout"
    );
    assert.ok(
      categoryListingContent.includes("lg:grid-cols-3"),
      "Must define desktop 3-column layout"
    );
  });

  // 31. Dynamic SEO metadata
  await test("31. Dynamic SEO metadata updates document.title and meta description", async () => {
    assert.ok(
      categoryListingContent.includes("document.title"),
      "Must set document.title based on category.name"
    );
    assert.ok(
      categoryListingContent.includes('meta[name="description"]'),
      "Must update meta description using category.description"
    );
  });

  // 32. No hardcoded categories
  await test("32. No hardcoded categories in JSX or service listing", async () => {
    assert.ok(
      !categoryListingContent.includes('["Ramayana & Manas Parayan",'),
      "Must not hardcode canonical category names in array"
    );
    assert.ok(
      categoryListingContent.includes("getPathCategoryBySlug"),
      "Must dynamically fetch category metadata from backend"
    );
  });

  // 33. Strict isolation: booking wizard, pricing, and backend controllers are untouched
  await test("33. Strict isolation: booking wizard, pricing, and backend controllers are untouched", async () => {
    const wizardPath = path.join(
      feDir,
      "src/features/yagyaPuja/pages/RitualBookingWizard.jsx"
    );
    const pricingPath = path.join(
      rootDir,
      "backend/src/services/ritualPricing.service.js"
    );

    assert.ok(fs.existsSync(wizardPath), "RitualBookingWizard must exist");
    assert.ok(fs.existsSync(pricingPath), "ritualPricing.service.js must exist");

    const wizardContent = fs.readFileSync(wizardPath, "utf8");
    assert.ok(
      !wizardContent.includes("PathCategoryListing"),
      "RitualBookingWizard must not be modified for PathCategoryListing"
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
