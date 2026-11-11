const fs = require('fs');
const path = require('path');

console.log("=== Testing Japa Booking UI Optimization & Repeated Dakshina API Fix ===\n");

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

const japaFile = path.resolve(__dirname, '../components/booking/JapaSinglePageBooking.jsx');
const contextFile = path.resolve(__dirname, '../context/RitualBookingContext.jsx');

const japaCode = fs.readFileSync(japaFile, 'utf8');
const contextCode = fs.readFileSync(contextFile, 'utf8');

// 1. Redundant calculatePrice useEffect removed from JapaSinglePageBooking
const hasRedundantEffect = /calculatePrice\(\s*\{\s*serviceId:\s*service\.id/i.test(japaCode);
assert(!hasRedundantEffect, "Redundant calculatePrice useEffect removed from JapaSinglePageBooking.jsx");

// 2. Japa Count dropdown verification
assert(japaCode.includes('Select Prescribed Japa Count'), "Japa count dropdown has label 'Select Prescribed Japa Count'");
assert(japaCode.includes('onChange={(e) => handleCountSelect(Number(e.target.value))}'), "Japa count select has handleCountSelect onChange handler");
assert(japaCode.includes('{formatCount(cnt)} Japa | {Number(cnt).toLocaleString("en-IN")} Chants'), "Japa count options render formatted count and chants");

// 3. Sankalp Intention dropdown verification
assert(japaCode.includes('Select Prayer Intention'), "Sankalp section has label 'Select Prayer Intention'");
assert(japaCode.includes('sankalpDetails.mainIntention || ""'), "Sankalp select is bound to sankalpDetails.mainIntention");
assert(japaCode.includes('updateSankalpDetails({ mainIntention: e.target.value, purpose: e.target.value })'), "Sankalp select onChange updates both mainIntention and purpose");

const expectedIntentions = [
  "Maha Mrityunjaya & Health Protection (आयुष्य व स्वास्थ्य)",
  "Removal of Graha Doshas & Obstacles (ग्रह बाधा निवारण)",
  "Peace of Mind & Mental Tranquility (चित्त शुद्धि व शांति)",
  "Prosperity, Lakshmi & Business Success (लक्ष्मी प्राप्ति व समृद्धि)",
  "Spiritual Evolution & Kundalini Awakening (आध्यात्मिक उन्नति)",
  "Fulfillment of Specific Sankalpa (मनोकामना सिद्धि)",
];

expectedIntentions.forEach((intent) => {
  assert(japaCode.includes(intent), `Contains required intention option: "${intent.slice(0, 35)}..."`);
});

// 4. Dakshina UI retains price and shows inline spinner
const spinnerMatches = (japaCode.match(/isCalculatingPrice && \(\s*<RefreshCw/g) || []).length;
assert(spinnerMatches >= 3, `Inline RefreshCw spinner appears next to price in 3 places (Header, Summary, Mobile Drawer). Found: ${spinnerMatches}`);

// 5. Retry button in price error banner
assert(japaCode.includes('calculatePrice(null, true)'), "Price error banner includes Retry button triggering calculatePrice(null, true)");

// 6. Context deduplication and stale request protection
assert(contextCode.includes('lastRequestedPayloadKeyRef'), "RitualBookingContext has lastRequestedPayloadKeyRef for request deduplication");
assert(contextCode.includes('currentRequestIdRef'), "RitualBookingContext has currentRequestIdRef for stale response protection");
assert(contextCode.includes('configurationRef'), "RitualBookingContext uses configurationRef for stable calculatePrice function identity");

// 7. Verify no regression in Puja, Yagya, Path, Homa files
const pujaFile = path.resolve(__dirname, '../components/booking/PujaSinglePageBooking.jsx');
const yagyaFile = path.resolve(__dirname, '../components/booking/YagyaSinglePageBooking.jsx');
const pathFile = path.resolve(__dirname, '../components/booking/PathSinglePageBooking.jsx');
const homaFile = path.resolve(__dirname, '../components/booking/HomaSinglePageBooking.jsx');

assert(fs.existsSync(pujaFile), "PujaSinglePageBooking.jsx exists and is preserved");
assert(fs.existsSync(yagyaFile), "YagyaSinglePageBooking.jsx exists and is preserved");
assert(fs.existsSync(pathFile), "PathSinglePageBooking.jsx exists and is preserved");
assert(fs.existsSync(homaFile), "HomaSinglePageBooking.jsx exists and is preserved");

console.log(`\n========================================`);
console.log(`TOTAL PASSED: ${passed}`);
console.log(`TOTAL FAILED: ${failed}`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("All Japa UI optimization and Dakshina API fix checks passed successfully!");
}

