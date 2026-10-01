/**
 * Phase J3-A Integration Test Suite
 * Tests all 10 requirements for Japa Customer Catalogue and Detail API Integration.
 *
 * Requirements:
 * 1. Catalogue requests API.
 * 2. Catalogue renders API data.
 * 3. Catalogue uses static fallback on API failure.
 * 4. API-success empty result does not silently use stale static data.
 * 5. Existing filters map to API parameters.
 * 6. Detail requests API by slug.
 * 7. Detail renders API data.
 * 8. Detail uses static fallback on API failure.
 * 9. Japa CTA points to /yagya-puja/japa/:slug/book.
 * 10. Japa booking route exists.
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
  console.log("   PHASE J3-A: JAPA CATALOGUE & DETAIL INTEGRATION");
  console.log("=======================================================\n");

  // Read files for structural and architectural assertions
  const catalogueListingPath = path.join(ROOT, "src/features/yagyaPuja/pages/JapaCatalogueListing.jsx");
  const serviceDetailsPath = path.join(ROOT, "src/features/yagyaPuja/pages/JapaServiceDetails.jsx");
  const japaServicePath = path.join(ROOT, "src/services/japaCatalogueService.js");
  const appRoutesPath = path.join(ROOT, "src/routes/AppRoutes.jsx");
  const placeholderPath = path.join(ROOT, "src/features/yagyaPuja/pages/JapaBookingPlaceholder.jsx");

  const catalogueListingContent = fs.readFileSync(catalogueListingPath, "utf-8");
  const serviceDetailsContent = fs.readFileSync(serviceDetailsPath, "utf-8");
  const japaServiceContent = fs.readFileSync(japaServicePath, "utf-8");
  const appRoutesContent = fs.readFileSync(appRoutesPath, "utf-8");

  // ---------------------------------------------------------------------------
  // TEST 1: Catalogue requests API
  // ---------------------------------------------------------------------------
  runTest("1. Catalogue requests API via japaCatalogueService.getJapaServices()", () => {
    assert.ok(
      catalogueListingContent.includes("japaCatalogueService.getJapaServices("),
      "JapaCatalogueListing must invoke japaCatalogueService.getJapaServices()"
    );
    assert.ok(
      catalogueListingContent.includes('import japaCatalogueService'),
      "JapaCatalogueListing must import japaCatalogueService"
    );
  });

  // ---------------------------------------------------------------------------
  // TEST 2: Catalogue renders API data
  // ---------------------------------------------------------------------------
  runTest("2. Catalogue renders API data using mapApiJapaServiceToUi normalization", () => {
    assert.ok(
      catalogueListingContent.includes("setServices(response.services)"),
      "JapaCatalogueListing must set services from response.services"
    );
    assert.ok(
      catalogueListingContent.includes("services.map((japa) =>"),
      "JapaCatalogueListing must render the services grid from services state"
    );
    assert.ok(
      japaServiceContent.includes("mapApiJapaServiceToUi"),
      "japaCatalogueService must normalize API items via mapApiJapaServiceToUi"
    );
  });

  // ---------------------------------------------------------------------------
  // TEST 3: Catalogue uses static fallback on API failure
  // ---------------------------------------------------------------------------
  runTest("3. Catalogue uses static fallback on API failure", () => {
    assert.ok(
      catalogueListingContent.includes("JAPA_CATALOGUE_LIST"),
      "JapaCatalogueListing must keep JAPA_CATALOGUE_LIST for fallback"
    );
    assert.ok(
      catalogueListingContent.includes("setIsFallback(true)"),
      "JapaCatalogueListing must set fallback state on catch"
    );
    assert.ok(
      catalogueListingContent.includes("setServices(localFallback)"),
      "JapaCatalogueListing must load local fallback into services state on error"
    );
  });

  // ---------------------------------------------------------------------------
  // TEST 4: API-success empty result does not silently use stale static data
  // ---------------------------------------------------------------------------
  runTest("4. API-success empty result does not silently use stale static data", () => {
    // On success, setServices(response.services) is called even if empty array, and setIsFallback(false)
    assert.ok(
      catalogueListingContent.includes("if (response && response.success && Array.isArray(response.services)) {\n            setServices(response.services);\n            setIsFallback(false);"),
      "On API success, response.services must be directly used without falling back to static data"
    );
    assert.ok(
      catalogueListingContent.includes("No Japa Services Match Your Filters"),
      "Appropriate empty state must be rendered when services.length === 0"
    );
  });

  // ---------------------------------------------------------------------------
  // TEST 5: Existing filters map to API parameters
  // ---------------------------------------------------------------------------
  runTest("5. Existing filters map to API parameters in japaCatalogueService", () => {
    // Check parameters in JapaCatalogueListing
    assert.ok(
      catalogueListingContent.includes("search: searchQuery.trim()"),
      "search query must map to search param"
    );
    assert.ok(
      catalogueListingContent.includes("purpose: selectedPurpose"),
      "selectedPurpose must map to purpose param"
    );
    assert.ok(
      catalogueListingContent.includes("count: selectedCount"),
      "selectedCount must map to count param"
    );
    assert.ok(
      catalogueListingContent.includes("mode: selectedMode"),
      "selectedMode must map to mode param"
    );
    assert.ok(
      catalogueListingContent.includes("isFeatured: isFeaturedOnly"),
      "isFeaturedOnly must map to isFeatured param"
    );
    assert.ok(
      catalogueListingContent.includes("sortBy: selectedSort"),
      "selectedSort must map to sortBy param"
    );

    // Check mapping inside japaCatalogueService
    assert.ok(
      japaServiceContent.includes('query.search = String(filterParams.search).trim()'),
      "japaCatalogueService must set query.search"
    );
    assert.ok(
      japaServiceContent.includes('query.purpose = String(filterParams.purpose).trim().toLowerCase()'),
      "japaCatalogueService must set query.purpose"
    );
    assert.ok(
      japaServiceContent.includes('query.count = countNum'),
      "japaCatalogueService must set query.count"
    );
    assert.ok(
      japaServiceContent.includes('query.mode = normalizedMode'),
      "japaCatalogueService must set query.mode"
    );
    assert.ok(
      japaServiceContent.includes('query.isFeatured = "true"'),
      "japaCatalogueService must set query.isFeatured"
    );
    assert.ok(
      japaServiceContent.includes('query.sortBy = sortVal'),
      "japaCatalogueService must set query.sortBy"
    );
  });

  // ---------------------------------------------------------------------------
  // TEST 6: Detail requests API by slug
  // ---------------------------------------------------------------------------
  runTest("6. Detail requests API by slug via japaCatalogueService.getJapaServiceBySlug", () => {
    assert.ok(
      serviceDetailsContent.includes("japaCatalogueService.getJapaServiceBySlug(slug)"),
      "JapaServiceDetails must call japaCatalogueService.getJapaServiceBySlug(slug)"
    );
    assert.ok(
      japaServiceContent.includes("export const getJapaServiceBySlug = async (slug)"),
      "japaCatalogueService must export getJapaServiceBySlug"
    );
    assert.ok(
      japaServiceContent.includes("api.get(`/japa-services/${cleanSlug}`)"),
      "getJapaServiceBySlug must request /japa-services/:slug"
    );
  });

  // ---------------------------------------------------------------------------
  // TEST 7: Detail renders API data
  // ---------------------------------------------------------------------------
  runTest("7. Detail renders API data with loading and full presentation elements", () => {
    assert.ok(
      serviceDetailsContent.includes("setService(data)"),
      "JapaServiceDetails must set authoritative data from API"
    );
    assert.ok(
      serviceDetailsContent.includes("Loading Sacred Mantra Japa Service..."),
      "JapaServiceDetails must provide a proper loading state"
    );
    assert.ok(
      serviceDetailsContent.includes("service.variants"),
      "JapaServiceDetails must render service variants"
    );
    assert.ok(
      serviceDetailsContent.includes("service.mantra"),
      "JapaServiceDetails must render service mantra text"
    );
    assert.ok(
      serviceDetailsContent.includes("service.samagri"),
      "JapaServiceDetails must render samagri inclusions"
    );
  });

  // ---------------------------------------------------------------------------
  // TEST 8: Detail uses static fallback on API failure
  // ---------------------------------------------------------------------------
  runTest("8. Detail uses static fallback on API failure and displays 404 if slug unknown", () => {
    assert.ok(
      serviceDetailsContent.includes("JAPA_CATALOGUE_LIST.find((j) => j.slug === slug)"),
      "JapaServiceDetails must check static fallback on API failure"
    );
    assert.ok(
      serviceDetailsContent.includes("setIsFallback(true)"),
      "JapaServiceDetails must set fallback indicator on failure"
    );
    assert.ok(
      serviceDetailsContent.includes("Mantra Japa Not Found"),
      "JapaServiceDetails must render not found error if neither API nor fallback matches"
    );
  });

  // ---------------------------------------------------------------------------
  // TEST 9: Japa CTA points to /yagya-puja/japa/:slug/book
  // ---------------------------------------------------------------------------
  runTest("9. Japa CTA points to /yagya-puja/japa/:slug/book", () => {
    const regex = /to=\{`\/yagya-puja\/japa\/\$\{service\.slug\}\/book`\}/g;
    const matches = serviceDetailsContent.match(regex);
    assert.ok(matches && matches.length >= 2, `Expected at least 2 booking CTAs pointing to /yagya-puja/japa/:slug/book, found ${matches ? matches.length : 0}`);

    // Verify existing wording is preserved
    assert.ok(
      serviceDetailsContent.includes("Talk to a Vedic Scholar"),
      "CTA 1 wording 'Talk to a Vedic Scholar' must be preserved"
    );
    assert.ok(
      serviceDetailsContent.includes("Consult Acharya"),
      "CTA 2 wording 'Consult Acharya' must be preserved"
    );
  });

  // ---------------------------------------------------------------------------
  // TEST 10: Japa booking route exists
  // ---------------------------------------------------------------------------
  runTest("10. Japa booking route /yagya-puja/japa/:slug/book exists in AppRoutes", () => {
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/japa/:slug/book"'),
      "AppRoutes must declare the /yagya-puja/japa/:slug/book route"
    );
    assert.ok(
      fs.existsSync(placeholderPath),
      "JapaBookingPlaceholder component file must exist"
    );
    assert.ok(
      appRoutesContent.includes("JapaBookingPlaceholder"),
      "AppRoutes must mount JapaBookingPlaceholder"
    );
  });

  console.log("\n-------------------------------------------------------");
  console.log(`Summary: ${passedTests} passed, ${failedTests} failed out of 10 tests.`);
  console.log("-------------------------------------------------------\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
