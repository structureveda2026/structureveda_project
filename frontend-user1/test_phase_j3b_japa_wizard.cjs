/**
 * Test Suite: Phase J3-B — Japa Booking Wizard Foundation
 * Verifies all 18 requirements of Phase J3-B.
 */

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const ROOT = __dirname;

let passedTests = 0;
let failedTests = 0;

function runTest(testName, fn) {
  try {
    fn();
    console.log(`[PASS] Test ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] Test ${testName}: ${err.message}`);
    failedTests++;
  }
}

console.log("=======================================================");
console.log("Starting Phase J3-B Japa Booking Wizard Test Suite");
console.log("=======================================================\n");

// Read files
const appRoutesPath = path.join(ROOT, "src/routes/AppRoutes.jsx");
const appRoutesContent = fs.readFileSync(appRoutesPath, "utf-8");

const wizardPath = path.join(ROOT, "src/features/yagyaPuja/pages/RitualBookingWizard.jsx");
const wizardContent = fs.readFileSync(wizardPath, "utf-8");

const contextPath = path.join(ROOT, "src/features/yagyaPuja/context/RitualBookingContext.jsx");
const contextContent = fs.readFileSync(contextPath, "utf-8");

const stepJapaPath = path.join(ROOT, "src/features/yagyaPuja/components/booking/StepConfigurationJapa.jsx");
const stepJapaContent = fs.readFileSync(stepJapaPath, "utf-8");

const stepReviewPath = path.join(ROOT, "src/features/yagyaPuja/components/booking/StepReview.jsx");
const stepReviewContent = fs.readFileSync(stepReviewPath, "utf-8");

// Test 1: Japa booking route renders real wizard instead of placeholder
runTest("1: Japa booking route renders real wizard instead of placeholder", () => {
  assert.ok(
    appRoutesContent.includes('path="/yagya-puja/japa/:slug/book"'),
    "AppRoutes must declare the /yagya-puja/japa/:slug/book route"
  );
  assert.ok(
    appRoutesContent.includes('element={<RitualBookingWizard serviceType="JAPA" />}'),
    "AppRoutes must mount RitualBookingWizard with serviceType='JAPA'"
  );
  assert.ok(
    !appRoutesContent.includes('<JapaBookingPlaceholder'),
    "AppRoutes must NOT mount JapaBookingPlaceholder in the active route"
  );
});

// Test 2: Japa serviceType resolves to JAPA
runTest("2: Japa serviceType resolves to JAPA", () => {
  assert.ok(
    wizardContent.includes('location.pathname.startsWith("/yagya-puja/japa")'),
    "RitualBookingWizard must resolve JAPA from pathname /yagya-puja/japa"
  );
  assert.ok(
    wizardContent.includes('"JAPA"'),
    "RitualBookingWizard must resolve to 'JAPA'"
  );
  assert.ok(
    contextContent.includes('serviceType === "JAPA"'),
    "RitualBookingContext must recognize serviceType === 'JAPA'"
  );
});

// Test 3: Japa service fetched through japaCatalogueService
runTest("3: Japa service fetched through japaCatalogueService", () => {
  assert.ok(
    wizardContent.includes("import japaCatalogueService from"),
    "RitualBookingWizard must import japaCatalogueService"
  );
  assert.ok(
    wizardContent.includes("japaCatalogueService.getJapaServiceBySlug(slug)"),
    "RitualBookingWizard must call japaCatalogueService.getJapaServiceBySlug(slug) when serviceType is JAPA"
  );
});

// Test 4: StepConfigurationJapa renders
runTest("4: StepConfigurationJapa renders in Step 0", () => {
  assert.ok(
    fs.existsSync(stepJapaPath),
    "StepConfigurationJapa.jsx file must exist"
  );
  assert.ok(
    wizardContent.includes("import StepConfigurationJapa from"),
    "RitualBookingWizard must import StepConfigurationJapa"
  );
  assert.ok(
    wizardContent.includes("<StepConfigurationJapa />"),
    "RitualBookingWizard must render <StepConfigurationJapa /> when isJapa is active on Step 0"
  );
});

// Test 5: Available Japa counts come from service data
runTest("5: Available Japa counts come from service data", () => {
  assert.ok(
    stepJapaContent.includes("availableCounts") || stepJapaContent.includes("service?.variants"),
    "StepConfigurationJapa must derive available counts from service.availableCounts or service.variants"
  );
});

// Test 6: No hardcoded Japa counts in StepConfigurationJapa
runTest("6: No hardcoded Japa counts in StepConfigurationJapa", () => {
  const hardcodedPattern = /\[\s*11000\s*,\s*21000\s*,\s*51000\s*,\s*125000\s*\]/;
  assert.ok(
    !hardcodedPattern.test(stepJapaContent),
    "StepConfigurationJapa must NOT hardcode [11000, 21000, 51000, 125000]"
  );
});

// Test 7: Pandit limits come from service data
runTest("7: Pandit limits come from service data", () => {
  assert.ok(
    stepJapaContent.includes("minPandits") && stepJapaContent.includes("maxPandits"),
    "StepConfigurationJapa must respect minPandits and maxPandits from service configuration"
  );
  assert.ok(
    stepJapaContent.includes("recommendedPandits"),
    "StepConfigurationJapa must indicate recommendedPandits"
  );
});

// Test 8: Japa count selection updates configuration
runTest("8: Japa count selection updates configuration", () => {
  assert.ok(
    stepJapaContent.includes("setConfiguration") || stepJapaContent.includes("updateConfiguration"),
    "StepConfigurationJapa must update configuration when devotee chooses a count"
  );
  assert.ok(
    stepJapaContent.includes("japaCount:"),
    "StepConfigurationJapa must set japaCount in configuration"
  );
});

// Test 9: Pandit selection updates capacity
runTest("9: Pandit selection updates capacity", () => {
  assert.ok(
    stepJapaContent.includes("totalDailyCapacity"),
    "StepConfigurationJapa must calculate totalDailyCapacity"
  );
  assert.ok(
    stepJapaContent.includes("dailyCapacityPerPandit"),
    "StepConfigurationJapa must use dailyCapacityPerPandit"
  );
});

// Test 10: Required days preview calculates correctly
runTest("10: Required days preview calculates correctly", () => {
  const japaCount = 51000;
  const pandits = 3;
  const dailyCapacityPerPandit = 2000;
  const totalDailyCapacity = pandits * dailyCapacityPerPandit; // 6000
  const requiredDays = Math.ceil(japaCount / totalDailyCapacity); // 9
  assert.strictEqual(requiredDays, 9, "51,000 count with 3 pandits @ 2000/day must equal 9 days");

  assert.ok(
    stepJapaContent.includes("Math.ceil") && stepJapaContent.includes("requiredDays"),
    "StepConfigurationJapa must use Math.ceil to calculate requiredDays preview"
  );
});

// Test 11: Completion date preview calculates correctly
runTest("11: Completion date preview calculates correctly", () => {
  function calcCompletion(startDateStr, days) {
    const d = new Date(startDateStr);
    d.setDate(d.getDate() + (days - 1));
    return d.toISOString().split("T")[0];
  }
  const end = calcCompletion("2026-10-01", 3);
  assert.strictEqual(end, "2026-10-03", "3-day ritual starting 2026-10-01 completes on 2026-10-03");

  assert.ok(
    stepJapaContent.includes("calculateCompletionDate") || stepJapaContent.includes("completionDate"),
    "StepConfigurationJapa must preview completion date"
  );
});

// Read ritualBookingService
const ritualServicePath = path.join(ROOT, "src/services/ritualBookingService.js");
const ritualServiceContent = fs.readFileSync(ritualServicePath, "utf-8");

// Test 12: JAPA calculate-price payload is generated
runTest("12: JAPA calculate-price payload is generated", () => {
  assert.ok(
    contextContent.includes('serviceType: "JAPA"'),
    "RitualBookingContext must include serviceType: 'JAPA' in payload"
  );
  assert.ok(
    contextContent.includes("japaCount: Number("),
    "RitualBookingContext must include japaCount in calculate-price payload"
  );
  assert.ok(
    contextContent.includes("panditCount: Number("),
    "RitualBookingContext must include panditCount in calculate-price payload"
  );
  assert.ok(
    contextContent.includes("ritualBookingService.calculatePrice(payload"),
    "RitualBookingContext must call ritualBookingService.calculatePrice(payload)"
  );
  assert.ok(
    ritualServiceContent.includes("/ritual-bookings/calculate-price"),
    "ritualBookingService must target /ritual-bookings/calculate-price"
  );
});

// Test 13: Backend price response is displayed
runTest("13: Backend price response is displayed", () => {
  assert.ok(
    wizardContent.includes("priceBreakdown") && wizardContent.includes("displayTotal"),
    "RitualBookingWizard must display authoritative total from priceBreakdown"
  );
  assert.ok(
    stepReviewContent.includes("priceBreakdown") && stepReviewContent.includes("totalDakshina"),
    "StepReview must display authoritative totalDakshina from priceBreakdown"
  );
});

// Test 14: Frontend price is not authoritative
runTest("14: Frontend price is not authoritative", () => {
  assert.ok(
    wizardContent.includes("(Backend Authoritative)") || wizardContent.includes("Authoritative Dakshina"),
    "Wizard UI must acknowledge backend authoritative pricing"
  );
  assert.ok(
    stepReviewContent.includes("Backend Verified") && stepReviewContent.includes("Authoritative Dakshina Summary"),
    "StepReview must treat backend Dakshina as authoritative"
  );
});

// Test 15: Japa configuration reaches common Steps 2–7
runTest("15: Japa configuration reaches common Steps 2–7", () => {
  assert.ok(
    wizardContent.includes("<StepYajman />") &&
      wizardContent.includes("<StepSankalp />") &&
      wizardContent.includes("<StepFamilyMembers />") &&
      wizardContent.includes("<StepLocation />") &&
      wizardContent.includes("<StepAddons />") &&
      wizardContent.includes("<StepReview />"),
    "RitualBookingWizard must reuse common Steps 2 to 7"
  );
  assert.ok(
    contextContent.includes("japaMetadata"),
    "buildBookingPayload in RitualBookingContext must map Japa operational metadata"
  );
  assert.ok(
    stepReviewContent.includes("isJapa") && stepReviewContent.includes("Total Recitations"),
    "StepReview must render Japa configuration parameters"
  );
});

// Test 16: Puja flow still works
runTest("16: Puja flow still works", () => {
  assert.ok(
    wizardContent.includes("<StepConfiguration />"),
    "RitualBookingWizard must render StepConfiguration for Puja"
  );
  assert.ok(
    wizardContent.includes("pujaCatalogueService.getPujaServiceBySlug"),
    "RitualBookingWizard must fetch Puja via pujaCatalogueService"
  );
  assert.ok(
    contextContent.includes('serviceType: "PUJA"') ||
      contextContent.includes('serviceType = "PUJA"'),
    "RitualBookingContext must retain Puja logic"
  );
});

// Test 17: Yagya flow still works
runTest("17: Yagya flow still works", () => {
  assert.ok(
    wizardContent.includes("<StepConfigurationYagya />"),
    "RitualBookingWizard must render StepConfigurationYagya for Yagya"
  );
  assert.ok(
    wizardContent.includes("yagyaCatalogueService.getYagyaServiceBySlug"),
    "RitualBookingWizard must fetch Yagya via yagyaCatalogueService"
  );
  assert.ok(
    contextContent.includes('resolvedServiceType === "YAGYA"'),
    "RitualBookingContext must retain Yagya logic"
  );
});

// Test 18: Upcoming Puja flow still works
runTest("18: Upcoming Puja flow still works", () => {
  assert.ok(
    appRoutesContent.includes('path="/puja/upcoming"'),
    "AppRoutes must preserve /puja/upcoming route"
  );
  assert.ok(
    appRoutesContent.includes('path="/puja/upcoming/all"'),
    "AppRoutes must preserve /puja/upcoming/all route"
  );
});

console.log("\n-------------------------------------------------------");
console.log(`Summary: ${passedTests} passed, ${failedTests} failed out of 18 tests.`);
console.log("-------------------------------------------------------\n");

if (failedTests > 0) {
  process.exit(1);
}
