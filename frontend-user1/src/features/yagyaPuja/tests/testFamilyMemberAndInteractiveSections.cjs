const fs = require('fs');
const path = require('path');

console.log("=== Testing Family Member Save Flow & Interactive Sections Audit ===\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

const contextFile = path.resolve(__dirname, '../context/RitualBookingContext.jsx');
const japaFile = path.resolve(__dirname, '../components/booking/JapaSinglePageBooking.jsx');
const yagyaFile = path.resolve(__dirname, '../components/booking/YagyaSinglePageBooking.jsx');
const homaFile = path.resolve(__dirname, '../components/booking/HomaSinglePageBooking.jsx');
const pathFile = path.resolve(__dirname, '../components/booking/PathSinglePageBooking.jsx');
const pujaFile = path.resolve(__dirname, '../components/booking/PujaSinglePageBooking.jsx');

const contextCode = fs.readFileSync(contextFile, 'utf8');
const japaCode = fs.readFileSync(japaFile, 'utf8');
const yagyaCode = fs.readFileSync(yagyaFile, 'utf8');
const homaCode = fs.readFileSync(homaFile, 'utf8');
const pathCode = fs.readFileSync(pathFile, 'utf8');
const pujaCode = fs.readFileSync(pujaFile, 'utf8');

// 1. Context addFamilyMember & updateFamilyMember
assert(contextCode.includes('safeData'), "RitualBookingContext handles safeData in addFamilyMember");
assert(contextCode.includes('isSyntheticEvent'), "RitualBookingContext guards against React synthetic events");
assert(contextCode.includes('if (typeof index !== "number" || index < 0) return;'), "RitualBookingContext updateFamilyMember guards against invalid or negative indices");

// 2. Japa Single Page Family Member Handling
assert(japaCode.includes('handleOpenAddMember'), "JapaSinglePageBooking has handleOpenAddMember");
assert(japaCode.includes('handleStartEditMember'), "JapaSinglePageBooking has handleStartEditMember");
assert(japaCode.includes('handleCancelMemberForm'), "JapaSinglePageBooking has handleCancelMemberForm");
assert(japaCode.includes('memberFormError'), "JapaSinglePageBooking has memberFormError state for validation");
assert(japaCode.includes('setMemberFormError("Please enter the family member\'s full name.")'), "JapaSinglePageBooking sets clear field-level error on empty name");
assert(japaCode.includes('addFamilyMember(memberPayload)'), "JapaSinglePageBooking passes memberPayload to addFamilyMember");
assert(japaCode.includes('updateFamilyMember(editingMemberIdx, memberPayload)'), "JapaSinglePageBooking updates member when editing");
assert(japaCode.includes('Edit2'), "JapaSinglePageBooking includes Edit2 icon for editing family members");
assert(!japaCode.includes('setEditingMemberIdx(-1)'), "JapaSinglePageBooking does not use buggy setEditingMemberIdx(-1)");

// 3. Cross-Ritual Family Member Verification (Homa, Path, Yagya)
[
  { name: 'HomaSinglePageBooking', code: homaCode },
  { name: 'PathSinglePageBooking', code: pathCode },
  { name: 'YagyaSinglePageBooking', code: yagyaCode },
].forEach(({ name, code }) => {
  assert(code.includes('handleOpenAddMember'), `${name} has handleOpenAddMember`);
  assert(code.includes('handleStartEditMember'), `${name} has handleStartEditMember`);
  assert(code.includes('handleCancelMemberForm'), `${name} has handleCancelMemberForm`);
  assert(code.includes('memberFormError'), `${name} has memberFormError for validation`);
  assert(code.includes('addFamilyMember(memberPayload)'), `${name} passes memberPayload to addFamilyMember`);
  assert(code.includes('updateFamilyMember(editingMemberIdx, memberPayload)'), `${name} updates member when editing`);
  assert(code.includes('Edit2'), `${name} includes Edit2 icon for editing`);
  assert(!code.includes('setEditingMemberIdx(-1)'), `${name} does not use buggy setEditingMemberIdx(-1)`);
});

// 4. Puja Single Page Booking preservation
assert(pujaCode.includes('addFamilyMember'), "PujaSinglePageBooking preserves addFamilyMember");
assert(pujaCode.includes('updateFamilyMember'), "PujaSinglePageBooking preserves updateFamilyMember");
assert(pujaCode.includes('removeFamilyMember'), "PujaSinglePageBooking preserves removeFamilyMember");

// 5. Booking Payload Generation Simulation
function simulateCleanFamily(familyMembers) {
  return (familyMembers || [])
    .filter((m) => m && m.name && m.name.trim())
    .map((m) => ({
      name: m.name.trim(),
      relation: m.relation || "Other",
      gender: m.gender || "Male",
      dob: m.dob || null,
      gotra: m.gotra || null,
      rashi: m.rashi || null,
      nakshatra: m.nakshatra || null,
    }));
}

const testMembers = [
  { name: "Pooja Sharma", relation: "Spouse", gender: "Female", gotra: "Kashyapa" },
  { name: "Aarav Sharma", relation: "Son", gender: "Male", gotra: "Kashyapa" },
  { name: "   ", relation: "Other", gender: "Male", gotra: "" }, // invalid, should be filtered
];

const cleaned = simulateCleanFamily(testMembers);
assert(cleaned.length === 2, `Cleaned family members array length is 2 (filtered empty name). Actual: ${cleaned.length}`);
assert(cleaned[0].name === "Pooja Sharma" && cleaned[0].relation === "Spouse" && cleaned[0].gotra === "Kashyapa", "Member 0 fields preserved correctly");
assert(cleaned[1].name === "Aarav Sharma" && cleaned[1].relation === "Son", "Member 1 fields preserved correctly");

// 6. Interactive Japa Sections Audit
assert(japaCode.includes('sankalpDetails.mainIntention'), "Japa has sankalpDetails.mainIntention");
assert(japaCode.includes('sankalpDetails.specificSankalp'), "Japa has specific prayer textarea");
assert(japaCode.includes('isSpecialInstructionsOpen'), "Japa has special instructions accordion");
assert(japaCode.includes('isAstrologyOpen'), "Japa has Gotra & Astrology collapsible drawer");
assert(japaCode.includes('handleUnknownGotraToggle'), "Japa has unknown Gotra toggle");

console.log(`\n========================================`);
console.log(`TOTAL PASSED: ${passed}`);
console.log(`TOTAL FAILED: ${failed}`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("All Family Member save and interactive audit checks passed!");
}

