const fs = require('fs');
const path = require('path');
const assert = require('assert');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}`);
    failed++;
  }
}

console.log("================================================================");
console.log("COMBINED JAPA, PATH & HOMA SINGLE-PAGE BOOKING TEST SUITE");
console.log("================================================================");

const japaPath = path.resolve(__dirname, '../components/booking/JapaSinglePageBooking.jsx');
const pathPath = path.resolve(__dirname, '../components/booking/PathSinglePageBooking.jsx');
const homaPath = path.resolve(__dirname, '../components/booking/HomaSinglePageBooking.jsx');
const wizardPath = path.resolve(__dirname, '../pages/RitualBookingWizard.jsx');
const contextPath = path.resolve(__dirname, '../context/RitualBookingContext.jsx');
const japaDetailsPath = path.resolve(__dirname, '../pages/JapaServiceDetails.jsx');

// --- 1. JAPA SINGLE-PAGE BOOKING ---
test("1.1 JapaSinglePageBooking.jsx exists and has default export", () => {
  assert.ok(fs.existsSync(japaPath), "JapaSinglePageBooking.jsx file exists");
  const content = fs.readFileSync(japaPath, 'utf8');
  assert.ok(content.length > 2000, "Component file has substantial content");
  assert.ok(content.includes("export default JapaSinglePageBooking"), "Exports JapaSinglePageBooking default");
});

test("1.2 JapaSinglePageBooking derives counts dynamically and calculates capacity", () => {
  const content = fs.readFileSync(japaPath, 'utf8');
  assert.ok(content.includes("availableCounts"), "Derives counts from service data");
  assert.ok(content.includes("dailyCapacityPerPandit"), "Calculates capacity using daily capacity per pandit");
  assert.ok(content.includes("totalDailyCapacity"), "Computes total daily capacity");
  assert.ok(content.includes("calculatedRequiredDays"), "Derives required days from count / capacity");
  assert.ok(content.includes("calculateCompletionDate"), "Computes completion date based on commencement date");
});

test("1.3 JapaSinglePageBooking includes package inclusions without fake paid add-ons", () => {
  const content = fs.readFileSync(japaPath, 'utf8');
  assert.ok(content.includes("Sacred Samagri & Inclusions"), "Inclusions section exists");
  assert.ok(content.includes("Fully Included"), "Marked as fully package-inclusive");
  assert.ok(!content.includes("AVAILABLE_ADDONS"), "Does not render fake zero-priced add-ons selector");
});

// --- 2. PATH SINGLE-PAGE BOOKING ---
test("2.1 PathSinglePageBooking.jsx exists and has default export", () => {
  assert.ok(fs.existsSync(pathPath), "PathSinglePageBooking.jsx file exists");
  const content = fs.readFileSync(pathPath, 'utf8');
  assert.ok(content.length > 2000, "Component file has substantial content");
  assert.ok(content.includes("export default PathSinglePageBooking"), "Exports PathSinglePageBooking default");
});

test("2.2 PathSinglePageBooking handles format and days coupling", () => {
  const content = fs.readFileSync(pathPath, 'utf8');
  assert.ok(content.includes("availableFormats"), "Derives available formats from service");
  assert.ok(content.includes("isSingleSession"), "Detects single session format");
  assert.ok(content.includes("1 Day (Single Session)"), "Enforces 1 Day for single session in UI");
  assert.ok(content.includes("handleFormatChange"), "Normalizes days when format switches");
});

test("2.3 PathSinglePageBooking displays scripture metadata if available", () => {
  const content = fs.readFileSync(pathPath, 'utf8');
  assert.ok(content.includes("chapterStructure"), "References scripture chapter structure");
  assert.ok(content.includes("estimatedRecitationHours"), "References estimated recitation hours");
});

// --- 3. HOMA SINGLE-PAGE BOOKING ---
test("3.1 HomaSinglePageBooking.jsx exists and has default export", () => {
  assert.ok(fs.existsSync(homaPath), "HomaSinglePageBooking.jsx file exists");
  const content = fs.readFileSync(homaPath, 'utf8');
  assert.ok(content.length > 2000, "Component file has substantial content");
  assert.ok(content.includes("export default HomaSinglePageBooking"), "Exports HomaSinglePageBooking default");
});

test("3.2 HomaSinglePageBooking enforces 1 Havan = 1 Day coupling rule", () => {
  const content = fs.readFileSync(homaPath, 'utf8');
  assert.ok(content.includes("isSingleHavan"), "Identifies single Havan selection");
  assert.ok(content.includes("1 Havan is strictly completed in 1 Day"), "Warns user of coupling rule");
  assert.ok(content.includes("handleHavanSelect"), "Handles Havan count selection and adjusts days");
  assert.ok(content.includes("handleDaysSelect"), "Handles day selection and ensures multi-havan compatibility");
});

test("3.3 HomaSinglePageBooking preserves authoritative formula", () => {
  const content = fs.readFileSync(homaPath, 'utf8');
  assert.ok(content.includes("perHavanPrice"), "Accounts for per-Havan price differential");
  assert.ok(content.includes("perDayPrice"), "Accounts for per-Day price differential");
  assert.ok(content.includes("havanCapacityPerPandit"), "Displays fire offering capacity per pandit");
});

// --- 4. ROUTING & MOUNTING ---
test("4.1 RitualBookingWizard.jsx mounts all 5 single-page booking components", () => {
  const content = fs.readFileSync(wizardPath, 'utf8');
  assert.ok(content.includes("import PujaSinglePageBooking"), "Imports PujaSinglePageBooking");
  assert.ok(content.includes("import YagyaSinglePageBooking"), "Imports YagyaSinglePageBooking");
  assert.ok(content.includes("import JapaSinglePageBooking"), "Imports JapaSinglePageBooking");
  assert.ok(content.includes("import PathSinglePageBooking"), "Imports PathSinglePageBooking");
  assert.ok(content.includes("import HomaSinglePageBooking"), "Imports HomaSinglePageBooking");
  assert.ok(content.includes("<PujaSinglePageBooking />"), "Mounts Puja single-page component");
  assert.ok(content.includes("<YagyaSinglePageBooking />"), "Mounts Yagya single-page component");
  assert.ok(content.includes("<JapaSinglePageBooking />"), "Mounts Japa single-page component");
  assert.ok(content.includes("<PathSinglePageBooking />"), "Mounts Path single-page component");
  assert.ok(content.includes("<HomaSinglePageBooking />"), "Mounts Homa single-page component");
});

// --- 5. CONTEXT & VALIDATION ---
test("5.1 RitualBookingContext.jsx validates all rituals in single-page mode", () => {
  const content = fs.readFileSync(contextPath, 'utf8');
  assert.ok(content.includes('resolvedServiceType === "JAPA"'), "Context validates JAPA in single-page mode");
  assert.ok(content.includes('resolvedServiceType === "HOMA"'), "Context validates HOMA in single-page mode");
  assert.ok(content.includes('resolvedServiceType === "PATH"'), "Context validates PATH in single-page mode");
  assert.ok(content.includes("1 Havan is performed in a 1-day session"), "Homa coupling validation present");
  assert.ok(content.includes("A single-session Path recitation must be completed in 1 day"), "Path coupling validation present");
});

// --- 6. CTA ALIGNMENT ---
test("6.1 JapaServiceDetails.jsx CTA updated to Book Japa Anushthan", () => {
  const content = fs.readFileSync(japaDetailsPath, 'utf8');
  assert.ok(content.includes("Book Japa Anushthan"), "CTA button uses Book Japa Anushthan");
  assert.ok(!content.includes("Talk to a Vedic Scholar"), "Eliminated misleading Talk to a Vedic Scholar CTA");
  assert.ok(!content.includes("Consult Acharya"), "Eliminated misleading Consult Acharya CTA");
});

console.log("================================================================");
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log("================================================================");

if (failed > 0) {
  process.exit(1);
}

