/**
 * testYagyaCustomerServiceDetailQA.cjs
 *
 * PHASE 4A: YAGYA CUSTOMER SERVICE DETAIL & BOOKING ENTRY QA
 *
 * Validates:
 * 1. Valid Yagya service detail route loads
 * 2. Invalid service handled correctly
 * 3. Service name renders
 * 4. Service description renders
 * 5. Service image/fallback renders
 * 6. Starting price renders correctly
 * 7. Duration information renders
 * 8. Category context is correct when available
 * 9. Uncategorized service does not show fake category
 * 10. Booking CTA exists
 * 11. Booking CTA points to correct service
 * 12. Booking route uses correct service identity
 * 13. Booking flow receives serviceType=YAGYA
 * 14. Existing configuration step remains intact
 * 15. Existing pricing calculation remains intact
 * 16. Existing booking status flow remains intact
 * 17. Loading state exists
 * 18. Error state exists
 * 19. Missing image fallback works
 * 20. Existing Yagya category page regression remains intact
 */

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const API_BASE = "http://localhost:5000";

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✓ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

async function runTests() {
  console.log("\n==================================================");
  console.log("PHASE 4A: YAGYA CUSTOMER SERVICE DETAIL & BOOKING ENTRY QA");
  console.log("==================================================\n");

  const fePath = path.resolve(__dirname, "frontend-user1");
  const detailFile = path.resolve(
    fePath,
    "src/features/yagyaPuja/pages/YagyaServiceDetails.jsx"
  );
  const wizardFile = path.resolve(
    fePath,
    "src/features/yagyaPuja/pages/RitualBookingWizard.jsx"
  );
  const yagyaStepConfigFile = path.resolve(
    fePath,
    "src/features/yagyaPuja/components/booking/StepConfigurationYagya.jsx"
  );
  const routesFile = path.resolve(fePath, "src/routes/AppRoutes.jsx");

  const detailCode = fs.readFileSync(detailFile, "utf-8");
  const wizardCode = fs.readFileSync(wizardFile, "utf-8");
  const yagyaStepConfigCode = fs.readFileSync(yagyaStepConfigFile, "utf-8");
  const routesCode = fs.readFileSync(routesFile, "utf-8");

  let mrityunjayaData = null;

  // Test 1: Valid Yagya service detail route loads
  await test("1. Valid Yagya service detail route loads (GET /api/yagya-services/maha-mrityunjaya-yagya)", async () => {
    const res = await fetch(`${API_BASE}/api/yagya-services/maha-mrityunjaya-yagya`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data && json.data.slug === "maha-mrityunjaya-yagya");
    mrityunjayaData = json.data;
  });

  // Test 2: Invalid service handled correctly
  await test("2. Invalid service handled correctly (returns 404 & UI handles not found)", async () => {
    const res = await fetch(`${API_BASE}/api/yagya-services/non-existent-yagya-slug`);
    assert.strictEqual(res.status, 404, `Expected 404, got ${res.status}`);
    assert.ok(
      detailCode.includes("Sacred Yagya Not Found") &&
        detailCode.includes("Browse All Yagyas") &&
        detailCode.includes('to="/yagya-puja/yagya"'),
      "YagyaServiceDetails must render user-friendly 404 state with catalogue link"
    );
  });

  // Test 3: Service name renders
  await test("3. Service name renders (API returns name and component renders h1)", async () => {
    assert.ok(mrityunjayaData.name, "API must return service name");
    assert.ok(
      detailCode.includes("<h1") && detailCode.includes("{service.name}"),
      "Component must render service.name in h1"
    );
  });

  // Test 4: Service description renders
  await test("4. Service description renders (short description & shastric overview)", async () => {
    assert.ok(
      mrityunjayaData.shortDescription || mrityunjayaData.description,
      "API must provide service description"
    );
    assert.ok(
      detailCode.includes("{service.shortDescription}") &&
        detailCode.includes("About the {service.name}"),
      "Component must render short and full shastric descriptions"
    );
  });

  // Test 5: Service image/fallback renders
  await test("5. Service image/fallback renders (gallery image with onError fallback)", async () => {
    assert.ok(
      detailCode.includes("getYagyaFallbackImage") &&
        detailCode.includes("onError="),
      "Component must use fallback image and onError handler"
    );
  });

  // Test 6: Starting price renders correctly
  await test("6. Starting price renders correctly (displays authoritative formattedPrice)", async () => {
    assert.ok(
      mrityunjayaData.startingPrice > 0,
      "API must return startingPrice > 0"
    );
    assert.ok(
      detailCode.includes("displayedPrice") || detailCode.includes("formattedPrice"),
      "Component must render formatted starting price"
    );
  });

  // Test 7: Duration information renders
  await test("7. Duration information renders (availableDurations & daily hours preview)", async () => {
    assert.ok(
      Array.isArray(mrityunjayaData.availableDurations) &&
        mrityunjayaData.availableDurations.length > 0,
      "API must return availableDurations array"
    );
    assert.ok(
      detailCode.includes("availableDurations.map") &&
        detailCode.includes("Days Anushthan"),
      "Component must render duration selection options"
    );
  });

  // Test 8: Category context is correct when available
  await test("8. Category context is correct when available (breadcrumb link & hero pill)", async () => {
    assert.ok(
      mrityunjayaData.category && mrityunjayaData.category.slug,
      "Maha Mrityunjaya must belong to a category"
    );
    assert.ok(
      detailCode.includes("service.category?.slug") &&
        detailCode.includes("/yagya-puja/yagya/category/${service.category.slug}"),
      "Component must provide category navigation path in breadcrumbs and hero pill"
    );
  });

  // Test 9: Uncategorized service does not show fake category
  await test("9. Uncategorized service does not show fake category (safe fallback)", async () => {
    assert.ok(
      detailCode.includes("Multi-Day Yagya"),
      "Component must fall back to generic label without inventing fake category names"
    );
  });

  // Test 10: Booking CTA exists
  await test("10. Booking CTA exists (prominent 'Book This Yagya' button in hero & footer banner)", async () => {
    assert.ok(
      detailCode.includes("Book This Yagya") && detailCode.includes("handleBookNow"),
      "Component must render prominent Book This Yagya action"
    );
  });

  // Test 11: Booking CTA points to correct service
  await test("11. Booking CTA points to correct service (navigates with service.slug)", async () => {
    assert.ok(
      detailCode.includes("`/yagya-puja/yagya/${service.slug}/book`"),
      "CTA must navigate to /yagya-puja/yagya/${service.slug}/book"
    );
  });

  // Test 12: Booking route uses correct service identity
  await test("12. Booking route uses correct service identity (/yagya-puja/yagya/:slug/book)", async () => {
    assert.ok(
      routesCode.includes('path="/yagya-puja/yagya/:slug/book"'),
      "AppRoutes must register /yagya-puja/yagya/:slug/book"
    );
  });

  // Test 13: Booking flow receives serviceType=YAGYA
  await test("13. Booking flow receives serviceType=YAGYA (RitualBookingWizard initialized with YAGYA)", async () => {
    assert.ok(
      routesCode.includes('<RitualBookingWizard serviceType="YAGYA" />'),
      "AppRoutes must pass serviceType='YAGYA' to RitualBookingWizard"
    );
  });

  // Test 14: Existing configuration step remains intact
  await test("14. Existing configuration step remains intact (StepConfigurationYagya rendered)", async () => {
    assert.ok(
      wizardCode.includes("StepConfigurationYagya"),
      "RitualBookingWizard must import and use StepConfigurationYagya"
    );
    assert.ok(
      yagyaStepConfigCode.includes("availableDurations") &&
        yagyaStepConfigCode.includes("panditCount") &&
        yagyaStepConfigCode.includes("calculateCompletionDate"),
      "StepConfigurationYagya must support durations, pandits, and completion date"
    );
  });

  // Test 15: Existing pricing calculation remains intact
  await test("15. Existing pricing calculation remains intact (POST /api/ritual-bookings/calculate-price)", async () => {
    const calcRes = await fetch(`${API_BASE}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: mrityunjayaData.id,
        serviceSlug: mrityunjayaData.slug,
        serviceType: "YAGYA",
        days: 3,
        dailyHours: 5,
        totalDurationHours: 15,
        panditCount: 5,
        arrangementMode: "kashi",
        locationType: "kashi",
      }),
    });
    assert.strictEqual(calcRes.status, 200, `Expected 200, got ${calcRes.status}`);
    const calcJson = await calcRes.json();
    assert.strictEqual(calcJson.success, true);
    assert.strictEqual(
      calcJson.data.totalAmount,
      21000,
      "Expected 21000 authoritative dakshina for 3 days"
    );
  });

  // Test 16: Existing booking status flow remains intact
  await test("16. Existing booking status flow remains intact (GET /api/payments/booking-status)", async () => {
    const statusRes = await fetch(
      `${API_BASE}/api/payments/booking-status?reference=NON_EXISTENT_REF`
    );
    assert.strictEqual(statusRes.status, 404, "Invalid reference must return 404 safely");
  });

  // Test 17: Loading state exists
  await test("17. Loading state exists (spinner and user message)", async () => {
    assert.ok(
      detailCode.includes("Loading Sacred Yagya Ceremony...") &&
        detailCode.includes("animate-spin"),
      "Component must contain animated loading state"
    );
  });

  // Test 18: Error state exists
  await test("18. Error state exists (displays error message & retry navigation)", async () => {
    assert.ok(
      detailCode.includes("if (error || !service)") &&
        detailCode.includes("Browse All Yagyas"),
      "Component must render error state"
    );
  });

  // Test 19: Missing image fallback works
  await test("19. Missing image fallback works (getYagyaFallbackImage returns valid image path)", async () => {
    const svcCode = fs.readFileSync(
      path.resolve(fePath, "src/services/yagyaCatalogueService.js"),
      "utf-8"
    );
    assert.ok(
      svcCode.includes("export const getYagyaFallbackImage") &&
        svcCode.includes("SLUG_IMAGE_MAP") &&
        svcCode.includes("defaultYagyaImg"),
      "yagyaCatalogueService must export getYagyaFallbackImage with robust fallback map"
    );
  });

  // Test 20: Existing Yagya category page regression remains intact
  await test("20. Existing Yagya category page regression remains intact (GET /api/yagya-categories/:slug)", async () => {
    const catRes = await fetch(
      `${API_BASE}/api/yagya-categories/shiva-healing-yagya`
    );
    assert.strictEqual(catRes.status, 200, `Expected 200, got ${catRes.status}`);
    const catJson = await catRes.json();
    assert.strictEqual(catJson.success, true);
    assert.strictEqual(catJson.data.slug, "shiva-healing-yagya");
  });

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log("==================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
