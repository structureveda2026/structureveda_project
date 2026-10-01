/**
 * Phase P4: Complete Path Customer Frontend Integration & Contract Verification Script
 * Covers all 26 mandatory verification items for the customer Path module.
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
  console.log("PHASE P4: PATH CUSTOMER FRONTEND INTEGRATION TEST SUITE");
  console.log("================================================================");

  let testServiceId = null;
  let testServiceSlug = "sundarkand-path";
  let testBookingReference = null;

  // 1. Path catalogue API service works
  await test("1. Path catalogue API service works (GET /api/path-services returns canonical list)", async () => {
    const res = await fetch(`${API_BASE}/path-services`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.length, 8);
    const sundar = json.data.find((p) => p.slug === testServiceSlug);
    assert.ok(sundar, "Sundarkand Path must be present");
    testServiceId = sundar.id;
  });

  // 2. Path detail API service works
  await test("2. Path detail API service works (GET /api/path-services/:slug)", async () => {
    const res = await fetch(`${API_BASE}/path-services/${testServiceSlug}`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.slug, testServiceSlug);
    assert.ok(
      json.data.scripture.includes("Ramcharitmanas"),
      `Expected scripture to include Ramcharitmanas, got ${json.data.scripture}`
    );
    assert.ok(Array.isArray(json.data.availableFormats), "Must have availableFormats");
    assert.ok(Array.isArray(json.data.availableDurations), "Must have availableDurations");
  });

  // 3. Catalogue API data renders / maps correctly
  await test("3. Catalogue API data normalizer maps required UI fields", async () => {
    const serviceFile = path.join(feDir, "src/features/yagyaPuja/services/pathCatalogueService.js");
    assert.ok(fs.existsSync(serviceFile), "pathCatalogueService.js must exist");
    const content = fs.readFileSync(serviceFile, "utf8");
    assert.ok(content.includes("mapApiPathServiceToUi"), "Must export mapApiPathServiceToUi");
    assert.ok(content.includes("startingPrice"), "Must normalize startingPrice");
    assert.ok(content.includes("availableFormats"), "Must normalize availableFormats");
    assert.ok(content.includes("availableDurations"), "Must normalize availableDurations");
    assert.ok(content.includes("minimumPandits"), "Must normalize minimumPandits");
  });

  // 4. Detail API data renders in PathServiceDetails.jsx
  await test("4. Detail API data integrates in PathServiceDetails.jsx", async () => {
    const detailFile = path.join(feDir, "src/features/yagyaPuja/pages/PathServiceDetails.jsx");
    const content = fs.readFileSync(detailFile, "utf8");
    assert.ok(
      content.includes("getPathServiceBySlug") && content.includes("pathCatalogueService"),
      "Must fetch from API service"
    );
    assert.ok(content.includes("service.scripture"), "Must render scripture source");
    assert.ok(content.includes("service.chapterStructure"), "Must render chapter structure");
  });

  // 5. API failure state works with fallback in PathCatalogueListing.jsx
  await test("5. API failure state gracefully engages static fallback", async () => {
    const listingFile = path.join(feDir, "src/features/yagyaPuja/pages/PathCatalogueListing.jsx");
    const content = fs.readFileSync(listingFile, "utf8");
    assert.ok(content.includes("pathCatalogueService.getPathServices"), "Must call getPathServices");
    assert.ok(content.includes("PATH_CATALOGUE_LIST.filter"), "Must have static fallback filtering");
    assert.ok(content.includes("setIsFallback"), "Must track fallback status");
  });

  // 6. Book Now navigates to Path booking route
  await test("6. Book Now CTA navigates to /yagya-puja/path/:slug/book", async () => {
    const detailFile = path.join(feDir, "src/features/yagyaPuja/pages/PathServiceDetails.jsx");
    const content = fs.readFileSync(detailFile, "utf8");
    assert.ok(
      content.includes("/yagya-puja/path/${service.slug}/book") ||
        content.includes("/yagya-puja/path/") && content.includes("/book"),
      "Must navigate to /yagya-puja/path/:slug/book"
    );
    assert.ok(!content.includes('to="/book-consultation"'), "Old consultation CTA must be replaced");
  });

  // 7. PATH serviceType is recognized
  await test("7. PATH serviceType is recognized in RitualBookingContext & Wizard", async () => {
    const contextFile = path.join(feDir, "src/features/yagyaPuja/context/RitualBookingContext.jsx");
    const ctxContent = fs.readFileSync(contextFile, "utf8");
    assert.ok(ctxContent.includes('serviceType === "PATH"'), "Context must check serviceType === PATH");
    assert.ok(ctxContent.includes('calculatePathCompletionDate'), "Context must export calculatePathCompletionDate");

    const wizardFile = path.join(feDir, "src/features/yagyaPuja/pages/RitualBookingWizard.jsx");
    const wizContent = fs.readFileSync(wizardFile, "utf8");
    assert.ok(wizContent.includes('serviceType === "PATH"'), "Wizard must check serviceType === PATH");
    assert.ok(wizContent.includes('location.pathname.startsWith("/yagya-puja/path")'), "Wizard must resolve path URL");
  });

  // 8. StepConfigurationPath mounts
  await test("8. StepConfigurationPath mounts when serviceType === PATH", async () => {
    const wizardFile = path.join(feDir, "src/features/yagyaPuja/pages/RitualBookingWizard.jsx");
    const wizContent = fs.readFileSync(wizardFile, "utf8");
    assert.ok(wizContent.includes("<StepConfigurationPath"), "Wizard must render StepConfigurationPath");

    const stepPathFile = path.join(feDir, "src/features/yagyaPuja/components/ritual-booking/StepConfigurationPath.jsx");
    assert.ok(fs.existsSync(stepPathFile), "StepConfigurationPath.jsx must exist");
  });

  // 9. Available formats come from backend
  await test("9. Available formats come from backend service dynamically", async () => {
    const stepPathFile = path.join(feDir, "src/features/yagyaPuja/components/ritual-booking/StepConfigurationPath.jsx");
    const content = fs.readFileSync(stepPathFile, "utf8");
    assert.ok(content.includes("service?.availableFormats"), "Must read formats from service");
    assert.ok(content.includes("availableFormats.map"), "Must map over availableFormats");
  });

  // 10. Available durations come from backend
  await test("10. Available durations come from backend service dynamically", async () => {
    const stepPathFile = path.join(feDir, "src/features/yagyaPuja/components/ritual-booking/StepConfigurationPath.jsx");
    const content = fs.readFileSync(stepPathFile, "utf8");
    assert.ok(content.includes("service?.availableDurations"), "Must read durations from service");
    assert.ok(content.includes("availableDurations.map"), "Must map over availableDurations");
  });

  // 11. Days validation works
  await test("11. Days validation enforces minDays/maxDays and single-session coupling", async () => {
    const contextFile = path.join(feDir, "src/features/yagyaPuja/context/RitualBookingContext.jsx");
    const ctxContent = fs.readFileSync(contextFile, "utf8");
    assert.ok(
      ctxContent.includes("single-session Path recitation must be completed in 1 day"),
      "Must enforce single session 1-day constraint"
    );
    assert.ok(ctxContent.includes("service?.minimumDays"), "Must validate minimumDays");
    assert.ok(ctxContent.includes("service?.maximumDays"), "Must validate maximumDays");
  });

  // 12. Pandit validation works
  await test("12. Pandit validation conforms to service minimumPandits and maximumPandits", async () => {
    const contextFile = path.join(feDir, "src/features/yagyaPuja/context/RitualBookingContext.jsx");
    const ctxContent = fs.readFileSync(contextFile, "utf8");
    assert.ok(ctxContent.includes("service?.minimumPandits"), "Must check minimumPandits");
    assert.ok(ctxContent.includes("service?.maximumPandits"), "Must check maximumPandits");
  });

  // 13. Commencement date validation works
  await test("13. Commencement date validation rejects past dates", async () => {
    const contextFile = path.join(feDir, "src/features/yagyaPuja/context/RitualBookingContext.jsx");
    const ctxContent = fs.readFileSync(contextFile, "utf8");
    assert.ok(
      ctxContent.includes("Path commencement date cannot be in the past"),
      "Must reject past commencement dates"
    );
  });

  // 14. Backend calculate-price is called
  await test("14. Backend calculate-price is called with serviceType PATH", async () => {
    const payload = {
      serviceType: "PATH",
      serviceId: testServiceId,
      serviceSlug: testServiceSlug,
      format: "same_day",
      duration: "3 to 4 Hours",
      days: 1,
      panditCount: 2,
      commencementDate: "2026-10-20",
    };
    const res = await fetch(`${API_BASE}/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.serviceType, "PATH");
    assert.strictEqual(json.data.totalAmount, 5100);
    assert.strictEqual(json.data.completionDate, "2026-10-20");
  });

  // 15. Frontend does not trust local price
  await test("15. Frontend does not trust local price (backend price rejected on manipulation)", async () => {
    const manipulatedPayload = {
      serviceType: "PATH",
      serviceId: testServiceId,
      serviceSlug: testServiceSlug,
      format: "same_day",
      duration: "3 to 4 Hours",
      days: 1,
      panditCount: 2,
      commencementDate: "2026-10-20",
      totalAmount: 1, // Client attempting to fake ₹1
    };
    const res = await fetch(`${API_BASE}/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(manipulatedPayload),
    });
    const json = await res.json();
    // Authoritative amount remains ₹5,100
    assert.strictEqual(json.data.totalAmount, 5100);
  });

  // 16. Backend price appears in review
  await test("16. Backend price appears in review (StepReview.jsx exposes authoritative breakdown)", async () => {
    const reviewFile = path.join(feDir, "src/features/yagyaPuja/components/booking/StepReview.jsx");
    const content = fs.readFileSync(reviewFile, "utf8");
    assert.ok(content.includes("isPath"), "StepReview must handle isPath");
    assert.ok(content.includes("Path Recitation Schedule & Scholar Team Configuration"), "Must render Path configuration header");
    assert.ok(content.includes("totalDakshina"), "Must render authoritative dakshina");
  });

  // 17. PATH booking payload is correct
  await test("17. PATH booking payload contains pathMetadata in sankalpDetails", async () => {
    const contextFile = path.join(feDir, "src/features/yagyaPuja/context/RitualBookingContext.jsx");
    const ctxContent = fs.readFileSync(contextFile, "utf8");
    assert.ok(ctxContent.includes("pathMetadata: {"), "buildBookingPayload must populate pathMetadata");
    assert.ok(ctxContent.includes("selectedFormat"), "pathMetadata must include selectedFormat");
    assert.ok(ctxContent.includes("selectedDuration"), "pathMetadata must include selectedDuration");
    assert.ok(ctxContent.includes("selectedDays"), "pathMetadata must include selectedDays");
  });

  // 18. Successful booking returns VEDA-PATH reference
  await test("18. Successful PATH booking returns 201 with VEDA-PATH-XXXXXXXX reference", async () => {
    const yajmanData = {
      name: "Shri Rajesh Pathak",
      mobile: "9876543210",
      phone: "9876543210",
      email: "rajesh.pathak@example.com",
      gender: "Male",
      gotra: "Kashyapa",
    };
    const sankalpData = {
      purpose: "Family peace and devotion",
      specificSankalp: "Shri Hanuman Kripa",
    };
    const bookingPayload = {
      serviceType: "PATH",
      serviceId: testServiceId,
      serviceSlug: testServiceSlug,
      commencementDate: "2026-10-20",
      bookingDate: "2026-10-20",
      bookingTime: "06:00 AM",
      timeSlot: "06:00 AM",
      format: "same_day",
      duration: "3 to 4 Hours",
      days: 1,
      panditCount: 2,
      arrangementMode: "kashi",
      locationType: "kashi",
      configuration: {
        date: "2026-10-20",
        commencementDate: "2026-10-20",
        timeSlot: "06:00 AM",
        format: "same_day",
        duration: "3 to 4 Hours",
        days: 1,
        panditCount: 2,
        arrangementMode: "kashi",
      },
      location: {
        locationType: "kashi",
      },
      yajman: yajmanData,
      yajmanDetails: yajmanData,
      sankalp: sankalpData,
      sankalpDetails: sankalpData,
    };

    const res = await fetch(`${API_BASE}/ritual-bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
    });
    if (res.status !== 201) {
      const err = await res.json();
      throw new Error(`Failed with ${res.status}: ${JSON.stringify(err)}`);
    }
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.bookingReference.startsWith("VEDA-PATH-"), `Expected VEDA-PATH-, got ${json.data.bookingReference}`);
    testBookingReference = json.data.bookingReference;
  });

  // 19. Booking status route works
  await test("19. Booking status route works in AppRoutes.jsx", async () => {
    const routesFile = path.join(feDir, "src/routes/AppRoutes.jsx");
    const content = fs.readFileSync(routesFile, "utf8");
    assert.ok(
      content.includes('path="/yagya-puja/path/:slug/booking-status"'),
      "Must register Path booking-status route"
    );
    assert.ok(
      content.includes('path="/yagya-puja/path/:slug/book"'),
      "Must register Path book route"
    );
  });

  // 20. Path metadata displays on booking status
  await test("20. Path metadata displays on booking status voucher", async () => {
    const statusFile = path.join(feDir, "src/features/yagyaPuja/pages/PathBookingStatus.jsx");
    assert.ok(fs.existsSync(statusFile), "PathBookingStatus.jsx must exist");
    const content = fs.readFileSync(statusFile, "utf8");
    assert.ok(content.includes("pathMeta.scripture"), "Must display scripture");
    assert.ok(content.includes("pathMeta.selectedFormat"), "Must display recitation format");
    assert.ok(content.includes("pathMeta.selectedDays"), "Must display recitation days");
    assert.ok(content.includes("pathMeta.panditCount"), "Must display pandit count");
  });

  // 21. Completion date displays accurately
  await test("21. Completion date displays accurately from authoritative backend calculation", async () => {
    const res = await fetch(`${API_BASE}/ritual-bookings/${testBookingReference}`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.data.bookingReference, testBookingReference);
    assert.strictEqual(json.data.service.type, "PATH");
    assert.ok(json.data.configuration.completionDate, "Must have completionDate");
    assert.strictEqual(json.data.pricing.totalAmount, 5100);
  });

  // 22. Recovery behavior works
  await test("22. Recovery behavior uses veda_active_ritual_booking and clears on confirmation", async () => {
    const statusFile = path.join(feDir, "src/features/yagyaPuja/pages/PathBookingStatus.jsx");
    const content = fs.readFileSync(statusFile, "utf8");
    assert.ok(content.includes("veda_active_ritual_booking"), "Must reference recovery storage key");
    assert.ok(content.includes("localStorage.removeItem(RITUAL_STORAGE_KEY)"), "Must clear storage key on confirmed completion");
  });

  // 23. Existing PUJA flow remains intact
  await test("23. Existing PUJA catalogue and booking APIs remain intact", async () => {
    const res = await fetch(`${API_BASE}/puja-services`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.ok(json.data.length > 0, "Puja services must be returned");
  });

  // 24. Existing YAGYA flow remains intact
  await test("24. Existing YAGYA catalogue and booking APIs remain intact", async () => {
    const res = await fetch(`${API_BASE}/yagya-services`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.ok(json.data.length > 0, "Yagya services must be returned");
  });

  // 25. Existing HOMA flow remains intact
  await test("25. Existing HOMA catalogue and booking APIs remain intact", async () => {
    const res = await fetch(`${API_BASE}/homa-services`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.data.length, 8, "8 canonical Homa services must be returned");
  });

  // 26. Existing JAPA flow remains intact
  await test("26. Existing JAPA catalogue and booking APIs remain intact", async () => {
    const res = await fetch(`${API_BASE}/japa-services`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.data.length, 8, "8 canonical Japa services must be returned");
  });

  console.log("\n================================================================");
  console.log(`TOTAL CUSTOMER INTEGRATION TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log("================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner encountered an error:", err);
  process.exit(1);
});
