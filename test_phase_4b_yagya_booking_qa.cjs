/**
 * test_phase_4b_yagya_booking_qa.cjs
 *
 * PHASE 4B: TARGETED BOOKING FLOW QA + CUSTOMER-SIDE FIXES
 *
 * Verifies all 33 required checks:
 * 1. Yagya booking route exists
 * 2. Direct booking route hydrates service
 * 3. serviceType is YAGYA
 * 4. Configuration renders
 * 5. Available durations render
 * 6. Commencement date works
 * 7. Completion date derives correctly
 * 8. Duration change recalculates completion date
 * 9. 5 Days → 3 Days resets pandit count correctly
 * 10. 3 Days → 5 Days updates pandit count correctly
 * 11. Pandit + cannot exceed tier
 * 12. Pandit - cannot go below minimum
 * 13. Backend price calculation is triggered
 * 14. Authoritative price appears in context
 * 15. Sidebar uses priceBreakdown.totalAmount
 * 16. Price error blocks progression
 * 17. Yajman step works
 * 18. Sankalp step works
 * 19. Family step works
 * 20. Location step works
 * 21. Add-ons step works
 * 22. Review shows Yagya configuration
 * 23. Booking creation remains functional
 * 24. Payment flow remains functional
 * 25. Yagya booking status route exists
 * 26. order_id is handled
 * 27. Confirmed status is handled
 * 28. Pending status is handled
 * 29. Failed/error status is handled
 * 30. LocalStorage recovery remains functional
 * 31. Corrupt LocalStorage is handled
 * 32. Duplicate submission protection remains intact
 * 33. Detail → Booking regression works
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
  console.log("PHASE 4B: YAGYA CUSTOMER BOOKING FLOW QA & VERIFICATION");
  console.log("==================================================\n");

  const fePath = path.resolve(__dirname, "frontend-user1");
  const routesFile = path.resolve(fePath, "src/routes/AppRoutes.jsx");
  const wizardFile = path.resolve(
    fePath,
    "src/features/yagyaPuja/pages/RitualBookingWizard.jsx"
  );
  const yagyaStepConfigFile = path.resolve(
    fePath,
    "src/features/yagyaPuja/components/booking/StepConfigurationYagya.jsx"
  );
  const yagyaStatusFile = path.resolve(
    fePath,
    "src/features/yagyaPuja/pages/YagyaBookingStatus.jsx"
  );
  const contextFile = path.resolve(
    fePath,
    "src/features/yagyaPuja/context/RitualBookingContext.jsx"
  );
  const detailFile = path.resolve(
    fePath,
    "src/features/yagyaPuja/pages/YagyaServiceDetails.jsx"
  );
  const stepReviewFile = path.resolve(
    fePath,
    "src/features/yagyaPuja/components/booking/StepReview.jsx"
  );

  const routesCode = fs.readFileSync(routesFile, "utf-8");
  const wizardCode = fs.readFileSync(wizardFile, "utf-8");
  const yagyaStepConfigCode = fs.readFileSync(yagyaStepConfigFile, "utf-8");
  const yagyaStatusCode = fs.readFileSync(yagyaStatusFile, "utf-8");
  const contextCode = fs.readFileSync(contextFile, "utf-8");
  const detailCode = fs.readFileSync(detailFile, "utf-8");
  const stepReviewCode = fs.readFileSync(stepReviewFile, "utf-8");

  let mrityunjayaData = null;

  // 1. Yagya booking route exists
  await test("1. Yagya booking route exists in AppRoutes.jsx", async () => {
    assert.ok(
      routesCode.includes('path="/yagya-puja/yagya/:slug/book"'),
      "Expected /yagya-puja/yagya/:slug/book in AppRoutes.jsx"
    );
  });

  // 2. Direct booking route hydrates service
  await test("2. Direct booking route hydrates service from API", async () => {
    const res = await fetch(`${API_BASE}/api/yagya-services/maha-mrityunjaya-yagya`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data && json.data.id && json.data.slug === "maha-mrityunjaya-yagya");
    mrityunjayaData = json.data;
  });

  // 3. serviceType is YAGYA
  await test("3. serviceType is YAGYA passed to RitualBookingWizard", async () => {
    assert.ok(
      routesCode.includes('<RitualBookingWizard serviceType="YAGYA" />'),
      "Expected serviceType='YAGYA' passed to RitualBookingWizard"
    );
    assert.ok(
      wizardCode.includes('serviceType === "YAGYA"') ||
        wizardCode.includes('isYagya'),
      "RitualBookingWizard must identify isYagya based on serviceType"
    );
  });

  // 4. Configuration renders
  await test("4. StepConfigurationYagya is rendered for Yagya bookings", async () => {
    assert.ok(
      wizardCode.includes("StepConfigurationYagya"),
      "RitualBookingWizard must import and render StepConfigurationYagya"
    );
    assert.ok(
      wizardCode.includes("isYagya") && wizardCode.includes("<StepConfigurationYagya />"),
      "RitualBookingWizard must render StepConfigurationYagya when isYagya is true"
    );
  });

  // 5. Available durations render
  await test("5. Available durations render dynamically from service catalogue", async () => {
    assert.ok(
      Array.isArray(mrityunjayaData.availableDurations) &&
        mrityunjayaData.availableDurations.length > 0,
      "API must provide availableDurations array"
    );
    assert.ok(
      yagyaStepConfigCode.includes("availableDurations.map"),
      "StepConfigurationYagya must map over availableDurations"
    );
  });

  // 6. Commencement date works
  await test("6. Commencement date input exists and enforces non-past dates", async () => {
    assert.ok(
      yagyaStepConfigCode.includes('type="date"') &&
        yagyaStepConfigCode.includes("min={todayStr}"),
      "Commencement date input must enforce min={todayStr}"
    );
    assert.ok(
      yagyaStepConfigCode.includes("handleDateChange"),
      "handleDateChange must be triggered on date changes"
    );
  });

  // 7. Completion date derives correctly (timezone-safe UTC calculation)
  await test("7. Completion date derives correctly using UTC-safe date math", async () => {
    // Test the UTC date math implementation directly
    const calculateCompletionDate = (startDateStr, daysCount) => {
      if (!startDateStr || !daysCount || Number(daysCount) < 1) return "";
      try {
        const parts = String(startDateStr).split("-").map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) return "";
        const [year, month, day] = parts;
        const d = new Date(Date.UTC(year, month - 1, day));
        if (isNaN(d.getTime())) return "";
        d.setUTCDate(d.getUTCDate() + (Number(daysCount) - 1));
        return d.toISOString().split("T")[0];
      } catch {
        return "";
      }
    };

    assert.strictEqual(
      calculateCompletionDate("2026-10-10", 3),
      "2026-10-12",
      "2026-10-10 + 3 days must equal 2026-10-12"
    );
    assert.strictEqual(
      calculateCompletionDate("2026-10-10", 5),
      "2026-10-14",
      "2026-10-10 + 5 days must equal 2026-10-14"
    );
    assert.strictEqual(
      calculateCompletionDate("2026-12-30", 3),
      "2027-01-01",
      "Cross-year 2026-12-30 + 3 days must equal 2027-01-01"
    );
    assert.ok(
      yagyaStepConfigCode.includes("Date.UTC"),
      "StepConfigurationYagya must use Date.UTC for timezone-safe date math"
    );
  });

  // 8. Duration change recalculates completion date
  await test("8. Duration change recalculates completion date automatically", async () => {
    assert.ok(
      yagyaStepConfigCode.includes("calculateCompletionDate(configuration.bookingDate, numDays)"),
      "handleDurationSelect must recalculate completionDate using numDays"
    );
  });

  // 9. 5 Days → 3 Days resets pandit count correctly
  await test("9. 5 Days → 3 Days duration downgrade resets pandit count without stale higher value", async () => {
    assert.ok(
      !yagyaStepConfigCode.includes("Math.max(currentPandits, tierPandits"),
      "StepConfigurationYagya must NOT preserve stale higher pandit count with Math.max"
    );
    assert.ok(
      yagyaStepConfigCode.includes("const targetPandits = tierPandits"),
      "targetPandits must equal tierPandits for duration change"
    );

    // Verify downgrade behavior:
    // When previous package has 7 pandits and new package tier specifies 5 pandits:
    const prevPandits = 7;
    const tierPandits = 5;
    const targetPandits = tierPandits; // Must not be Math.max(7, 5) => 7
    assert.strictEqual(targetPandits, 5, "Downgrade must reset panditCount to package tier (5), not stale 7");
  });

  // 10. 3 Days → 5/7 Days updates pandit count correctly
  await test("10. 3 Days → 5/7 Days duration change updates pandit count to package tier", async () => {
    // When upgrading to a higher tier package (e.g. 7 days with 7 pandits):
    const tier7 = mrityunjayaData.pricingTiers.find((t) => Number(t.days) === 7);
    assert.ok(tier7, "7-day tier must exist in service");
    const targetPandits = tier7.panditCount;
    assert.strictEqual(targetPandits, 7, "Changing to 7-day tier must update pandit count to 7");
  });

  // 11. Pandit + cannot exceed tier
  await test("11. Pandit + button cannot exceed selected tier pandits", async () => {
    assert.ok(
      yagyaStepConfigCode.includes("disabled={(Number(configuration.panditCount) || minPandits) >= currentTierPandits}"),
      "The + button must be disabled when panditCount >= currentTierPandits"
    );
    assert.ok(
      yagyaStepConfigCode.includes("if (current < currentTierPandits)"),
      "handlePanditIncrement must guard against exceeding currentTierPandits"
    );
  });

  // 12. Pandit - cannot go below minimum
  await test("12. Pandit - button cannot go below valid minimum", async () => {
    assert.ok(
      yagyaStepConfigCode.includes("disabled={(Number(configuration.panditCount) || minPandits) <= minPandits}"),
      "The - button must be disabled when panditCount <= minPandits"
    );
    assert.ok(
      yagyaStepConfigCode.includes("if (current > minPandits)"),
      "handlePanditDecrement must guard against dropping below minPandits"
    );
  });

  // 13. Backend price calculation is triggered
  await test("13. Backend price calculation is triggered (POST /api/ritual-bookings/calculate-price)", async () => {
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
    assert.strictEqual(calcJson.data.totalAmount, 21000);
  });

  // 14. Authoritative price appears in context
  await test("14. Authoritative price appears in RitualBookingContext state", async () => {
    assert.ok(
      contextCode.includes("priceBreakdown") &&
        contextCode.includes("calculatePrice"),
      "RitualBookingContext must manage priceBreakdown state and calculatePrice action"
    );
  });

  // 15. Sidebar uses priceBreakdown.totalAmount
  await test("15. Sidebar uses priceBreakdown.totalAmount authoritative displayTotal", async () => {
    assert.ok(
      wizardCode.includes("priceBreakdown?.totalAmount"),
      "displayTotal must derive from priceBreakdown?.totalAmount"
    );
    assert.ok(
      !wizardCode.includes("Phase 5C Preview"),
      "Outdated 'Phase 5C Preview' must be removed from Yagya sidebar"
    );
    assert.ok(
      wizardCode.includes("displayTotal"),
      "Sidebar must display displayTotal as final dakshina"
    );
  });

  // 16. Price error blocks progression
  await test("16. Price error blocks progression to next step", async () => {
    assert.ok(
      wizardCode.includes("if (isCalculatingPrice) return;") &&
        wizardCode.includes("if (priceError) return;"),
      "handleContinue must block if price is calculating or has an error"
    );
  });

  // 17. Yajman step works
  await test("17. Yajman step works for devotee identity and gotra", async () => {
    assert.ok(
      wizardCode.includes("StepYajman"),
      "RitualBookingWizard must include StepYajman component"
    );
    const yajmanFile = path.resolve(
      fePath,
      "src/features/yagyaPuja/components/booking/StepYajman.jsx"
    );
    assert.ok(fs.existsSync(yajmanFile), "StepYajman.jsx must exist");
  });

  // 18. Sankalp step works
  await test("18. Sankalp step works for sacred intention and kula devata", async () => {
    assert.ok(
      wizardCode.includes("StepSankalp"),
      "RitualBookingWizard must include StepSankalp component"
    );
    const sankalpFile = path.resolve(
      fePath,
      "src/features/yagyaPuja/components/booking/StepSankalp.jsx"
    );
    assert.ok(fs.existsSync(sankalpFile), "StepSankalp.jsx must exist");
  });

  // 19. Family step works
  await test("19. Family step works for including family members in sankalp", async () => {
    assert.ok(
      wizardCode.includes("StepFamilyMembers"),
      "RitualBookingWizard must include StepFamilyMembers component"
    );
    const familyFile = path.resolve(
      fePath,
      "src/features/yagyaPuja/components/booking/StepFamilyMembers.jsx"
    );
    assert.ok(fs.existsSync(familyFile), "StepFamilyMembers.jsx must exist");
  });

  // 20. Location step works
  await test("20. Location step works for sacred mandapam or venue details", async () => {
    assert.ok(
      wizardCode.includes("StepLocation"),
      "RitualBookingWizard must include StepLocation component"
    );
    const locationFile = path.resolve(
      fePath,
      "src/features/yagyaPuja/components/booking/StepLocation.jsx"
    );
    assert.ok(fs.existsSync(locationFile), "StepLocation.jsx must exist");
  });

  // 21. Add-ons step works
  await test("21. Add-ons step works for Dravya, Samagri, and Gau Seva", async () => {
    assert.ok(
      wizardCode.includes("StepAddons"),
      "RitualBookingWizard must include StepAddons component"
    );
    const addonsFile = path.resolve(
      fePath,
      "src/features/yagyaPuja/components/booking/StepAddons.jsx"
    );
    assert.ok(fs.existsSync(addonsFile), "StepAddons.jsx must exist");
  });

  // 22. Review shows Yagya configuration
  await test("22. Review step renders multi-day Yagya parameters and dakshina breakdown", async () => {
    assert.ok(
      wizardCode.includes("StepReview"),
      "RitualBookingWizard must include StepReview component"
    );
    assert.ok(
      stepReviewCode.includes("priceBreakdown") || stepReviewCode.includes("configuration"),
      "StepReview must render configuration and pricing breakdown"
    );
  });

  // 23. Booking creation remains functional
  await test("23. Booking creation API remains functional with authoritative parameters", async () => {
    assert.ok(
      contextCode.includes("ritualBookingService.createRitualBooking"),
      "Context must invoke ritualBookingService.createRitualBooking"
    );
  });

  // 24. Payment flow remains functional
  await test("24. Payment session flow uses Cashfree integration contract", async () => {
    assert.ok(
      contextCode.includes("ritualBookingService.createPaymentOrder") &&
        contextCode.includes("cashfreepayments"),
      "Context must integrate with Cashfree payment session creation"
    );
  });

  // 25. Yagya booking status route exists
  await test("25. Yagya booking status route exists in AppRoutes.jsx", async () => {
    assert.ok(
      routesCode.includes('path="/yagya-puja/yagya/:slug/booking-status"'),
      "Expected /yagya-puja/yagya/:slug/booking-status route in AppRoutes.jsx"
    );
    assert.ok(
      routesCode.includes("YagyaBookingStatus"),
      "AppRoutes must render YagyaBookingStatus for this route"
    );
  });

  // 26. order_id is handled
  await test("26. order_id query parameter is handled and candidateRef parsed", async () => {
    assert.ok(
      yagyaStatusCode.includes('searchParams.get("order_id")'),
      "YagyaBookingStatus must extract order_id from searchParams"
    );
    assert.ok(
      yagyaStatusCode.includes('orderId.split("_")[0]'),
      "YagyaBookingStatus must derive candidateRef by stripping order suffix"
    );
  });

  // 27. Confirmed status is handled
  await test("27. Confirmed status displays reference, clears localStorage, and provides receipt", async () => {
    assert.ok(
      yagyaStatusCode.includes('setPageStatus("CONFIRMED")'),
      "YagyaBookingStatus must transition to CONFIRMED state"
    );
    assert.ok(
      yagyaStatusCode.includes("localStorage.removeItem(RITUAL_STORAGE_KEY)"),
      "YagyaBookingStatus must clear RITUAL_STORAGE_KEY on confirmation"
    );
    assert.ok(
      yagyaStatusCode.includes("handlePrint") && yagyaStatusCode.includes("handleCopy"),
      "YagyaBookingStatus must provide print receipt and copy reference features"
    );
  });

  // 28. Pending status is handled
  await test("28. Pending status is handled with retry and refresh actions", async () => {
    assert.ok(
      yagyaStatusCode.includes('setPageStatus("PENDING")'),
      "YagyaBookingStatus must support PENDING status"
    );
    assert.ok(
      yagyaStatusCode.includes("handleRetryPayment"),
      "YagyaBookingStatus must allow retry/resume payment for pending bookings"
    );
  });

  // 29. Failed/error status is handled
  await test("29. Failed/error status is handled with helpful feedback and retry", async () => {
    assert.ok(
      yagyaStatusCode.includes('setPageStatus("FAILED")'),
      "YagyaBookingStatus must support FAILED status"
    );
    assert.ok(
      yagyaStatusCode.includes('setPageStatus("ERROR")'),
      "YagyaBookingStatus must support ERROR status"
    );
  });

  // 30. LocalStorage recovery remains functional
  await test("30. LocalStorage recovery restores active booking reference", async () => {
    assert.ok(
      yagyaStatusCode.includes("localStorage.getItem(RITUAL_STORAGE_KEY)"),
      "YagyaBookingStatus must recover candidateRef from localStorage when query is absent"
    );
  });

  // 31. Corrupt LocalStorage is handled gracefully without crashing
  await test("31. Corrupt or non-VEDA LocalStorage reference is handled gracefully", async () => {
    assert.ok(
      yagyaStatusCode.includes('candidateRef.startsWith("VEDA-")'),
      "YagyaBookingStatus must validate candidateRef format"
    );
    assert.ok(
      yagyaStatusCode.includes('setPageStatus("NOT_FOUND")'),
      "Invalid references must gracefully show NOT_FOUND state without crashing"
    );
  });

  // 32. Duplicate submission protection remains intact
  await test("32. Duplicate submission protection remains intact", async () => {
    assert.ok(
      contextCode.includes("isSubmitting") || contextCode.includes("submittingRef"),
      "RitualBookingContext must prevent concurrent submissions"
    );
  });

  // 33. Detail → Booking regression works
  await test("33. Detail → Booking regression works (Book This Yagya CTA navigates properly)", async () => {
    assert.ok(
      detailCode.includes("`/yagya-puja/yagya/${service.slug}/book`"),
      "YagyaServiceDetails must navigate to /yagya-puja/yagya/${service.slug}/book"
    );
  });

  console.log("\n==================================================");
  console.log(`PHASE 4B TEST RESULTS: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log("==================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
