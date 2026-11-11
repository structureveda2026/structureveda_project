const fs = require('fs');
const path = require('path');

console.log("=== Testing Consistent Sticky Right Booking Summary Across Japa, Path & Homa ===\n");

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

const files = {
  Japa: path.resolve(__dirname, '../components/booking/JapaSinglePageBooking.jsx'),
  Path: path.resolve(__dirname, '../components/booking/PathSinglePageBooking.jsx'),
  Homa: path.resolve(__dirname, '../components/booking/HomaSinglePageBooking.jsx'),
  Yagya: path.resolve(__dirname, '../components/booking/YagyaSinglePageBooking.jsx'),
};

const contents = {};
for (const [name, filePath] of Object.entries(files)) {
  contents[name] = fs.readFileSync(filePath, 'utf8');
}

// 1. Check Grid Layout & items-start across all 4 files
for (const [name, code] of Object.entries(contents)) {
  assert(code.includes('grid gap-6 lg:grid-cols-12 items-start'), `${name} has 'grid gap-6 lg:grid-cols-12 items-start'`);
  assert(code.includes('lg:col-span-8'), `${name} has 'lg:col-span-8' for left form`);
  assert(code.includes('lg:col-span-4 lg:sticky lg:top-6 space-y-4 self-start'), `${name} has 'lg:col-span-4 lg:sticky lg:top-6 space-y-4 self-start' for right summary`);
  assert(code.includes('max-h-[calc(100vh-2rem)] overflow-y-auto'), `${name} summary card has 'max-h-[calc(100vh-2rem)] overflow-y-auto' for viewport safety`);
  assert(code.includes('max-w-[1200px]'), `${name} uses consistent max-w-[1200px] container`);
}

// 2. Ensure in-component header in Japa, Path, Homa is NOT sticky (so it doesn't fight with the sticky summary)
['Japa', 'Path', 'Homa'].forEach((name) => {
  const code = contents[name];
  const hasStickyInComponentHeader = /<header[^>]*sticky[^>]*>/i.test(code);
  assert(!hasStickyInComponentHeader, `${name} in-component header is not sticky (prevents header collisions)`);
});

// 3. Ensure mobile bottom drawer is preserved across all files
for (const [name, code] of Object.entries(contents)) {
  assert(code.includes('lg:hidden fixed bottom-0'), `${name} preserves mobile sticky bottom drawer 'lg:hidden fixed bottom-0'`);
}

// 4. Verify Puja file was NOT modified
const pujaFile = path.resolve(__dirname, '../components/booking/PujaSinglePageBooking.jsx');
const pujaCode = fs.readFileSync(pujaFile, 'utf8');
assert(!pujaCode.includes('lg:top-6'), "PujaSinglePageBooking was not modified (preserves existing lg:top-20)");

console.log(`\n========================================`);
console.log(`TOTAL PASSED: ${passed}`);
console.log(`TOTAL FAILED: ${failed}`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("All sticky summary layout checks passed successfully!");
}

