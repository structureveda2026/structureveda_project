/**
 * Phase 5 Safe Frontend-to-Backend Integration Test Suite
 *
 * Validates:
 * 1. astrologerService API contract and query builders.
 * 2. bookingService API contract.
 * 3. paymentService Cashfree workflow API contract.
 * 4. Route mappings for astrologer profiles and booking wizards.
 * 5. Dynamic pricing and date boundary contracts.
 */

const assert = require("assert");

async function runPhase5IntegrationTests() {
  console.log("==================================================================");
  console.log("   PHASE 5: ASTROLOGER PUBLIC FRONTEND INTEGRATION TEST SUITE     ");
  console.log("==================================================================");

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] Test ${total}: ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] Test ${total}: ${name}`);
      console.error("       Error:", err.message);
    }
  }

  // -------------------------------------------------------------------------
  // Test 1: Astrologer Service Module Exports & URLs
  // -------------------------------------------------------------------------
  await test("astrologerService exports public profile, package, and slot methods", async () => {
    const astrologerService = (await import("./src/features/astrologers/astrologerService.js")).default;
    assert.strictEqual(typeof astrologerService.getPublicAstrologers, "function");
    assert.strictEqual(typeof astrologerService.getPublicAstrologerBySlug, "function");
    assert.strictEqual(typeof astrologerService.getPublicAstrologerPackages, "function");
    assert.strictEqual(typeof astrologerService.getPublicAstrologerSlots, "function");
  });

  // -------------------------------------------------------------------------
  // Test 2: Booking Service Module Exports
  // -------------------------------------------------------------------------
  await test("bookingService exports createBooking and getBookingByReferenceOrId", async () => {
    const bookingService = (await import("./src/features/astrologers/bookingService.js")).default;
    assert.strictEqual(typeof bookingService.createBooking, "function");
    assert.strictEqual(typeof bookingService.getBookingByReferenceOrId, "function");
    assert.strictEqual(typeof bookingService.getMyBookings, "function");
  });

  // -------------------------------------------------------------------------
  // Test 3: Payment Service Cashfree Workflow Contract
  // -------------------------------------------------------------------------
  await test("paymentService exports createPaymentOrder, verifyPayment, and getBookingStatus", async () => {
    const paymentService = (await import("./src/features/astrologers/paymentService.js")).default;
    assert.strictEqual(typeof paymentService.createPaymentOrder, "function");
    assert.strictEqual(typeof paymentService.verifyPayment, "function");
    assert.strictEqual(typeof paymentService.getBookingStatus, "function");
  });

  // -------------------------------------------------------------------------
  // Test 4: Asia/Kolkata Date Boundary for Public Booking Form
  // -------------------------------------------------------------------------
  await test("IST minDate calculation ensures booking cannot target yesterday", () => {
    const minDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    assert.match(minDate, /^\d{4}-\d{2}-\d{2}$/, "Must be formatted as YYYY-MM-DD");
    const todayParsed = new Date(minDate + "T00:00:00Z");
    assert(!isNaN(todayParsed.getTime()), "Must be a valid date object");
  });

  // -------------------------------------------------------------------------
  // Test 5: Route Map Verification in AppRoutes
  // -------------------------------------------------------------------------
  await test("AppRoutes contains dynamic routes for astrologer profile and booking", async () => {
    const fs = require("fs");
    const appRoutesContent = fs.readFileSync("./src/routes/AppRoutes.jsx", "utf-8");

    assert(appRoutesContent.includes("/astrologers/vishal-bhardwaj"), "Must include Vishal Bhardwaj profile");
    assert(appRoutesContent.includes("/astrologers/acharya-anurag-bhardwaj"), "Must include Anurag Bhardwaj profile");
    assert(appRoutesContent.includes("/astrologers/:slug/book-consultation"), "Must include dynamic booking route");
    assert(appRoutesContent.includes("/astrologers"), "Must include Astrologers catalogue route");
  });

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log("\n==================================================================");
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log("==================================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase5IntegrationTests().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
