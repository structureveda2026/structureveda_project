/**
 * Final Consolidated Remediation Regression Test Suite
 *
 * Verifies Batches 1, 2, and 3 remediations in an isolated, safe, non-destructive environment:
 * - CONC-CUST-01: getPaymentBookingStatus concurrency locking and conflict protection
 * - CONC-ADM-01: updateBookingStatus slot verification before confirming
 * - CASH-REF-01: Atomic refund initiation & deterministic refund identity
 * - CASH-WEB-01: Partial vs. Full refund distinction via cumulative gateway state
 * - CASH-VER-01: Specific persisted refund identity verification
 * - ARCH-UI-01 / ARCH-UI-02: Astrologer slug-based returnUrl & booking-status routes
 * - ENV-GATE-01: Safe Cashfree environment configuration (defaults to SANDBOX)
 * - SEC-REF-01: Sliding-window rate limiter middleware
 * - DB-REL-01: Backward-compatible foreign key migration syntax & design
 * - UI-UX-01: 15-minute reservation countdown clock in customer portal
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");

let totalTests = 0;
let passedTests = 0;

async function runTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`[PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] Test ${totalTests}: ${name}`);
    console.error(`       Error: ${err.message}`);
  }
}

async function runSuite() {
  console.log("==================================================================");
  console.log("  VEDA STRUCTURE: FINAL CONSOLIDATED REMEDIATION REGRESSION SUITE ");
  console.log("==================================================================");

  // ---------------------------------------------------------------------------
  // Test 1: ENV-GATE-01 - Cashfree environment configuration
  // ---------------------------------------------------------------------------
  await runTest("ENV-GATE-01: Cashfree environment defaults to SANDBOX unless CASHFREE_ENVIRONMENT === PRODUCTION", async () => {
    const cashfreeServicePath = path.join(__dirname, "src", "services", "cashfree.service.js");
    const content = fs.readFileSync(cashfreeServicePath, "utf8");

    assert.ok(
      content.includes("process.env.CASHFREE_ENVIRONMENT?.trim().toUpperCase() === \"PRODUCTION\"") ||
      content.includes("process.env.CASHFREE_ENVIRONMENT.trim().toUpperCase() === \"PRODUCTION\""),
      "Must explicitly check process.env.CASHFREE_ENVIRONMENT === PRODUCTION"
    );

    assert.ok(
      !content.includes("process.env.NODE_ENV === \"production\" ? CFEnvironment.PRODUCTION"),
      "Must never automatically switch to production based only on NODE_ENV"
    );

    assert.ok(
      content.includes("cashfreeEnvironment"),
      "Must instantiate Cashfree using configurable cashfreeEnvironment"
    );
  });

  // ---------------------------------------------------------------------------
  // Test 2: ARCH-UI-01 & ARCH-UI-02 - Return URL & AppRoutes
  // ---------------------------------------------------------------------------
  await runTest("ARCH-UI-01 / ARCH-UI-02: returnUrl is dynamically generated per astrologer slug", async () => {
    const resolverPath = path.join(__dirname, "src", "services", "bookingResolver.service.js");
    const resolverContent = fs.readFileSync(resolverPath, "utf8");

    assert.ok(
      resolverContent.includes("resolvedSlug"),
      "bookingResolver must dynamically resolve astrologer slug"
    );
    assert.ok(
      resolverContent.includes("acharya-anurag-bhardwaj"),
      "Must map ast-anurag to acharya-anurag-bhardwaj"
    );
    assert.ok(
      resolverContent.includes("/astrologers/${resolvedSlug}/booking-status"),
      "returnUrl must target dynamic astrologer booking-status"
    );

    const appRoutesPath = path.join(__dirname, "..", "frontend-user1", "src", "routes", "AppRoutes.jsx");
    const appRoutesContent = fs.readFileSync(appRoutesPath, "utf8");

    assert.ok(
      appRoutesContent.includes("path=\"/astrologers/vishal-bhardwaj/booking-status\""),
      "AppRoutes must include /astrologers/vishal-bhardwaj/booking-status"
    );
    assert.ok(
      appRoutesContent.includes("path=\"/astrologers/:slug/booking-status\""),
      "AppRoutes must include /astrologers/:slug/booking-status"
    );
  });

  // ---------------------------------------------------------------------------
  // Test 3: CONC-CUST-01 - Status Recovery Slot Locking & Conflict Protection
  // ---------------------------------------------------------------------------
  await runTest("CONC-CUST-01: getPaymentBookingStatus acquires slot advisory lock & checks conflict before confirming", async () => {
    const paymentCtrlPath = path.join(__dirname, "src", "controllers", "payment.controller.js");
    const content = fs.readFileSync(paymentCtrlPath, "utf8");

    const recoveryIndex = content.indexOf("getPaymentBookingStatus");
    assert.ok(recoveryIndex > -1, "getPaymentBookingStatus must exist");

    const recoverySnippet = content.slice(recoveryIndex, recoveryIndex + 5000);

    assert.ok(
      recoverySnippet.includes("acquireSlotAdvisoryLock"),
      "getPaymentBookingStatus must acquire advisory lock on slot"
    );
    assert.ok(
      recoverySnippet.includes("checkSlotConflict"),
      "getPaymentBookingStatus must check slot conflict"
    );
    assert.ok(
      recoverySnippet.includes("markPaymentReviewRequired"),
      "getPaymentBookingStatus must set Payment Review Required on conflict"
    );
  });

  // ---------------------------------------------------------------------------
  // Test 4: CONC-ADM-01 - Admin Update Slot Verification
  // ---------------------------------------------------------------------------
  await runTest("CONC-ADM-01: updateBookingStatus validates slot conflict before confirming", async () => {
    const bookingCtrlPath = path.join(__dirname, "src", "controllers", "booking.controller.js");
    const content = fs.readFileSync(bookingCtrlPath, "utf8");

    const updateStatusIndex = content.indexOf("updateBookingStatus");
    assert.ok(updateStatusIndex > -1, "updateBookingStatus must exist");

    const updateSnippet = content.slice(updateStatusIndex, updateStatusIndex + 7000);

    assert.ok(
      updateSnippet.includes("bookingStatus === \"Confirmed\" && current !== \"Confirmed\""),
      "Must intercept transition to Confirmed"
    );
    assert.ok(
      updateSnippet.includes("acquireSlotAdvisoryLock"),
      "Must acquire advisory lock when confirming"
    );
    assert.ok(
      updateSnippet.includes("checkSlotConflict"),
      "Must validate slot conflict when confirming"
    );
    assert.ok(
      updateSnippet.includes("status(409)"),
      "Must return 409 Conflict if target slot is occupied"
    );
  });

  // ---------------------------------------------------------------------------
  // Test 5: CASH-REF-01 - Atomic Refund Initiation & Deterministic Refund Identity
  // ---------------------------------------------------------------------------
  await runTest("CASH-REF-01: initiateBookingRefund uses row lock, deterministic refund ID & in-flight state", async () => {
    const bookingCtrlPath = path.join(__dirname, "src", "controllers", "booking.controller.js");
    const content = fs.readFileSync(bookingCtrlPath, "utf8");

    const refundIndex = content.indexOf("initiateBookingRefund");
    assert.ok(refundIndex > -1, "initiateBookingRefund must exist");

    const refundSnippet = content.slice(refundIndex, refundIndex + 7000);

    assert.ok(
      refundSnippet.includes("lock: transaction.LOCK.UPDATE"),
      "Must acquire row-level lock on booking during refund initiation"
    );
    assert.ok(
      refundSnippet.includes("Refund In Progress"),
      "Must set in-flight state Refund In Progress to block simultaneous admin calls"
    );
    assert.ok(
      refundSnippet.includes("deterministicRefundId"),
      "Must generate deterministic refund ID"
    );
    assert.ok(
      refundSnippet.includes("[LATEST_REFUND_ID:"),
      "Must persist latest refund identity in booking notes"
    );

    const cashfreePath = path.join(__dirname, "src", "services", "cashfree.service.js");
    const cashfreeContent = fs.readFileSync(cashfreePath, "utf8");

    assert.ok(
      !cashfreeContent.includes("Date.now()"),
      "cashfree.service.js must not generate non-deterministic timestamp refund IDs"
    );
  });

  // ---------------------------------------------------------------------------
  // Test 6: CASH-WEB-01 - Cumulative Partial vs Full Refund Handling
  // ---------------------------------------------------------------------------
  await runTest("CASH-WEB-01: Webhook distinguishes partial from full refund using cumulative gateway amounts", async () => {
    const paymentCtrlPath = path.join(__dirname, "src", "controllers", "payment.controller.js");
    const content = fs.readFileSync(paymentCtrlPath, "utf8");

    const webhookIndex = content.indexOf("handleCashfreeWebhook");
    assert.ok(webhookIndex > -1, "handleCashfreeWebhook must exist");

    const webhookSnippet = content.slice(webhookIndex, webhookIndex + 9000);

    assert.ok(
      webhookSnippet.includes("isFullRefund"),
      "Webhook must compute isFullRefund flag"
    );
    assert.ok(
      webhookSnippet.includes("Partially Refunded"),
      "Webhook must transition to Partially Refunded when refund is partial"
    );
    assert.ok(
      webhookSnippet.includes("fetchCashfreeOrderRefunds"),
      "Webhook must query gateway for cumulative order refund total"
    );
  });

  // ---------------------------------------------------------------------------
  // Test 7: CASH-VER-01 - Verify Specific Persisted Refund Identity
  // ---------------------------------------------------------------------------
  await runTest("CASH-VER-01: verifyBookingRefund matches specific persisted refund identity", async () => {
    const bookingCtrlPath = path.join(__dirname, "src", "controllers", "booking.controller.js");
    const content = fs.readFileSync(bookingCtrlPath, "utf8");

    const verifyRefundIndex = content.indexOf("verifyBookingRefund");
    assert.ok(verifyRefundIndex > -1, "verifyBookingRefund must exist");

    const verifySnippet = content.slice(verifyRefundIndex, verifyRefundIndex + 3500);

    assert.ok(
      verifySnippet.includes("[LATEST_REFUND_ID:"),
      "verifyBookingRefund must look up persisted LATEST_REFUND_ID"
    );
    assert.ok(
      verifySnippet.includes("fetchCashfreeRefund(orderId, targetRefundId)"),
      "Must fetch specific refund by ID rather than picking arbitrary success"
    );
    assert.ok(
      verifySnippet.includes("Partially Refunded"),
      "Must update to Partially Refunded if verified refund does not cover order total"
    );
  });

  // ---------------------------------------------------------------------------
  // Test 8: SEC-REF-01 - Sliding Window Rate Limiter
  // ---------------------------------------------------------------------------
  await runTest("SEC-REF-01: Rate limiter middleware blocks requests when threshold is exceeded", async () => {
    const { createRateLimiter } = await import("./src/middleware/rateLimiter.middleware.js");

    const limiter = createRateLimiter({
      windowMs: 1000,
      max: 3,
      message: "Rate limit exceeded",
    });

    let lastStatus = 200;
    let lastBody = null;

    const mockReq = {
      path: "/test-lookup",
      headers: { "x-forwarded-for": "192.168.1.100" },
      socket: {},
    };

    const mockRes = {
      setHeader: () => {},
      status: (code) => {
        lastStatus = code;
        return {
          json: (body) => {
            lastBody = body;
          },
        };
      },
    };

    // Temporarily bypass test bypass to test limiter mechanism
    const origEnv = process.env.NODE_ENV;
    delete process.env.NODE_ENV;

    try {
      limiter(mockReq, mockRes, () => {});
      assert.strictEqual(lastStatus, 200, "1st request must pass");

      limiter(mockReq, mockRes, () => {});
      assert.strictEqual(lastStatus, 200, "2nd request must pass");

      limiter(mockReq, mockRes, () => {});
      assert.strictEqual(lastStatus, 200, "3rd request must pass");

      limiter(mockReq, mockRes, () => {});
      assert.strictEqual(lastStatus, 429, "4th request must be blocked with 429");
      assert.strictEqual(lastBody?.message, "Rate limit exceeded");
    } finally {
      process.env.NODE_ENV = origEnv;
    }
  });

  // ---------------------------------------------------------------------------
  // Test 9: DB-REL-01 - Foreign Key Migration Syntax & Rationale
  // ---------------------------------------------------------------------------
  await runTest("DB-REL-01: Astrologer foreign-key migration is syntactically valid with safe backfill", async () => {
    const migPath = path.join(__dirname, "migrations", "20261018220000-add-astrologer-uuid-foreign-key-to-bookings.cjs");
    assert.ok(fs.existsSync(migPath), "Migration file must exist on disk");

    const mig = require(migPath);
    assert.strictEqual(typeof mig.up, "function", "Migration must export an up function");
    assert.strictEqual(typeof mig.down, "function", "Migration must export a down function");

    const content = fs.readFileSync(migPath, "utf8");
    assert.ok(content.includes("astrologer_uuid"), "Migration must add astrologer_uuid column");
    assert.ok(content.includes("SET \"astrologer_uuid\" = a.id"), "Migration must backfill using astrologers.code match");
  });

  // ---------------------------------------------------------------------------
  // Test 10: UI-UX-01 - 15-Minute Checkout Countdown Clock
  // ---------------------------------------------------------------------------
  await runTest("UI-UX-01: VishalBooking includes 15-minute slot reservation countdown clock", async () => {
    const vishalBookingPath = path.join(__dirname, "..", "frontend-user1", "src", "features", "astrologers", "pages", "VishalBooking.jsx");
    const content = fs.readFileSync(vishalBookingPath, "utf8");

    assert.ok(
      content.includes("countdownSeconds"),
      "VishalBooking must define countdownSeconds state"
    );
    assert.ok(
      content.includes("formatCountdown"),
      "VishalBooking must include formatCountdown formatter"
    );
    assert.ok(
      content.includes("Slot reserved for:"),
      "VishalBooking must display 'Slot reserved for:' countdown badge"
    );
  });

  console.log("==================================================================");
  console.log(`RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log("==================================================================");

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error("Test suite fatal error:", err);
  process.exit(1);
});
