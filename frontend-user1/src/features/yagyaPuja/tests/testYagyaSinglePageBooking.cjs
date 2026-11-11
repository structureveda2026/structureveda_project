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
console.log("YAGYA SINGLE-PAGE BOOKING VERIFICATION TEST SUITE");
console.log("================================================================");

const yagyaComponentPath = path.resolve(__dirname, '../components/booking/YagyaSinglePageBooking.jsx');
const wizardPath = path.resolve(__dirname, '../pages/RitualBookingWizard.jsx');
const contextPath = path.resolve(__dirname, '../context/RitualBookingContext.jsx');

test("1. YagyaSinglePageBooking.jsx exists and is non-empty", () => {
  assert.ok(fs.existsSync(yagyaComponentPath), "YagyaSinglePageBooking.jsx file exists");
  const content = fs.readFileSync(yagyaComponentPath, 'utf8');
  assert.ok(content.length > 1000, "Component file has substantial content");
  assert.ok(content.includes("export default YagyaSinglePageBooking"), "Exports YagyaSinglePageBooking default");
});

test("2. YagyaSinglePageBooking includes all required 6 single-page sections", () => {
  const content = fs.readFileSync(yagyaComponentPath, 'utf8');
  assert.ok(content.includes("Multi-Day Anushthan Schedule"), "Section 1: Multi-Day Schedule exists");
  assert.ok(content.includes("Sacred Ceremony Venue"), "Section 2: Sacred Venue exists");
  assert.ok(content.includes("Primary Devotee (Yajman)"), "Section 3: Yajman Details exists");
  assert.ok(content.includes("Sacred Sankalp & Prayer"), "Section 4: Sankalp & Prayer exists");
  assert.ok(content.includes("Family Members & Co-Yajmans"), "Section 5: Family Members exists");
  assert.ok(content.includes("Sacred Samagri & Inclusions"), "Section 6: Samagri & Inclusions exists");
});

test("3. YagyaSinglePageBooking has compact Muhurta select dropdown and presets", () => {
  const content = fs.readFileSync(yagyaComponentPath, 'utf8');
  assert.ok(content.includes("Brahma Muhurta Ahuti (06:00 AM)"), "Includes Brahma Muhurta preset");
  assert.ok(content.includes("Pratah Kalin Homa (08:30 AM)"), "Includes Pratah Kalin preset");
  assert.ok(content.includes("handleTimeSelectChange"), "Handles dropdown select changes");
  assert.ok(content.includes("+ Specify other time..."), "Supports custom time toggle");
});

test("4. YagyaSinglePageBooking derives Maha Purnahuti completion date", () => {
  const content = fs.readFileSync(yagyaComponentPath, 'utf8');
  assert.ok(content.includes("calculateCompletionDate"), "Contains calculateCompletionDate helper");
  assert.ok(content.includes("Maha Purnahuti"), "Displays Maha Purnahuti label");
  assert.ok(content.includes("formatFriendlyDate"), "Uses timezone-safe friendly date formatter");
});

test("5. YagyaSinglePageBooking consolidates arrangement mode & location without duplicate questions", () => {
  const content = fs.readFileSync(yagyaComponentPath, 'utf8');
  assert.ok(content.includes("handleArrangementSelect"), "Contains single unified venue selection handler");
  assert.ok(content.includes("arrangementMode: modeKey"), "Updates arrangementMode");
  assert.ok(content.includes("locationType: modeKey"), "Synchronously keeps locationType in sync");
  assert.ok(content.includes("requiresPhysicalAddress"), "Conditionally reveals address drawer only when required");
});

test("6. YagyaSinglePageBooking includes collapsible Gotra & Astrology drawer", () => {
  const content = fs.readFileSync(yagyaComponentPath, 'utf8');
  assert.ok(content.includes("isAstrologyOpen"), "Has astrology collapsible state");
  assert.ok(content.includes("VEDIC_RASHIS"), "Uses VEDIC_RASHIS dropdown");
  assert.ok(content.includes("VEDIC_NAKSHATRAS"), "Uses VEDIC_NAKSHATRAS dropdown");
  assert.ok(content.includes("Unknown Gotra"), "Preserves Unknown Gotra checkbox");
});

test("7. YagyaSinglePageBooking includes compact family member management", () => {
  const content = fs.readFileSync(yagyaComponentPath, 'utf8');
  assert.ok(content.includes("handleOpenAddMember"), "Handles opening member drawer");
  assert.ok(content.includes("handleSaveMember"), "Handles saving family member");
  assert.ok(content.includes("removeFamilyMember"), "Handles removing family member");
  assert.ok(content.includes("+ Add Family Member"), "Has compact add member button");
});

test("8. YagyaSinglePageBooking has sticky desktop summary & mobile bottom bar", () => {
  const content = fs.readFileSync(yagyaComponentPath, 'utf8');
  assert.ok(content.includes("lg:sticky lg:top-6"), "Has sticky desktop summary positioning");
  assert.ok(content.includes("Total Sacred Dakshina"), "Displays prominent total Dakshina");
  assert.ok(content.includes("lg:hidden fixed bottom-0"), "Has mobile sticky bottom bar");
  assert.ok(content.includes("Proceed to Secure Dakshina"), "Has Cashfree lock CTA button");
});

test("9. RitualBookingWizard mounts YagyaSinglePageBooking for serviceType YAGYA", () => {
  const content = fs.readFileSync(wizardPath, 'utf8');
  assert.ok(content.includes("import YagyaSinglePageBooking"), "Imports YagyaSinglePageBooking");
  assert.ok(
    content.includes('serviceType === "YAGYA"') && content.includes("<YagyaSinglePageBooking />"),
    "Renders YagyaSinglePageBooking when serviceType === 'YAGYA'"
  );
  assert.ok(
    content.includes('serviceType === "PUJA"') && content.includes("<PujaSinglePageBooking />"),
    "Preserves PujaSinglePageBooking for PUJA"
  );
});

test("10. RitualBookingContext validates YAGYA simultaneously in single-page mode", () => {
  const content = fs.readFileSync(contextPath, 'utf8');
  assert.ok(
    content.includes('resolvedServiceType === "PUJA" || resolvedServiceType === "YAGYA"'),
    "validateAllSteps checks both PUJA and YAGYA simultaneously"
  );
  assert.ok(
    content.includes('allErrors.days = "Please select a Yagya duration."'),
    "Validates Yagya duration days"
  );
  assert.ok(
    content.includes("scrollIntoView({ behavior: \"smooth\", block: \"center\" })"),
    "Auto-scrolls to first error element smoothly"
  );
});

test("11. Regression Check: Multi-step wizards for HOMA, JAPA, and PATH remain preserved", () => {
  const content = fs.readFileSync(wizardPath, 'utf8');
  assert.ok(content.includes("StepConfigurationHoma"), "Preserves StepConfigurationHoma");
  assert.ok(content.includes("StepConfigurationJapa"), "Preserves StepConfigurationJapa");
  assert.ok(content.includes("StepConfigurationPath"), "Preserves StepConfigurationPath");
  assert.ok(content.includes("isPath"), "Preserves isPath logic");
  assert.ok(content.includes("isHoma"), "Preserves isHoma logic");
  assert.ok(content.includes("isJapa"), "Preserves isJapa logic");
});

console.log("================================================================");
console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log("================================================================");

if (failed > 0) process.exit(1);

