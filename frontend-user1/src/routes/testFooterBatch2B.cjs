const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..');
let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

console.log('=== VEDA STRUCTURE: FOOTER REDESIGN BATCH 2B VERIFICATION SUITE ===\n');

// 1. Inspect Footer.jsx
const footerPath = path.join(srcPath, 'components/layout/Footer.jsx');
assert(fs.existsSync(footerPath), 'Footer.jsx exists on disk');
const footerCode = fs.readFileSync(footerPath, 'utf8');

// 2. Prohibited Content Verification (Clean Pruning)
assert(!footerCode.includes('veda-library-five.vercel.app'), 'Footer.jsx contains NO external Vercel staging URL');
assert(!footerCode.includes('98765 43210'), 'Footer.jsx contains NO fake placeholder phone number');
assert(!footerCode.includes('wa.me'), 'Footer.jsx contains NO dummy WhatsApp links');
assert(!footerCode.includes('/shop'), 'Footer.jsx contains NO unbuilt /shop link');
assert(!footerCode.includes('/prasad'), 'Footer.jsx contains NO unbuilt /prasad link');
assert(!footerCode.includes('/courses'), 'Footer.jsx contains NO unbuilt /courses link');
assert(!footerCode.includes('/orders'), 'Footer.jsx contains NO unbuilt /orders link');
assert(!footerCode.includes('/bookings'), 'Footer.jsx contains NO unbuilt /bookings link');
assert(!footerCode.includes('"/shipping"'), 'Footer.jsx contains NO legacy /shipping link');
assert(!footerCode.includes('"/returns"'), 'Footer.jsx contains NO legacy /returns link');
assert(!footerCode.includes('"/refunds"'), 'Footer.jsx contains NO legacy /refunds link');
assert(!footerCode.includes('instagram.com'), 'Footer.jsx contains NO generic unverified social links');

// 3. Shloka Ribbon Verification
assert(footerCode.includes('ॐ असतो मा सद्गमय'), 'Footer.jsx contains authentic sacred Shloka');
assert(footerCode.includes('100% Vedic Authentic'), 'Footer.jsx contains 100% Vedic Authentic trust badge');
assert(footerCode.includes('Verified Kashi Acharyas'), 'Footer.jsx contains Verified Kashi Acharyas trust badge');
assert(footerCode.includes('Worldwide Sankalpa'), 'Footer.jsx contains Worldwide Sankalpa trust badge');

// 4. Column 1: Brand & Sanctum Verification
assert(footerCode.includes('VEDA STRUCTURE'), 'Column 1 renders VEDA STRUCTURE wordmark');
assert(footerCode.includes('WISDOM, WORLDWIDE'), 'Column 1 renders WISDOM, WORLDWIDE tagline');
assert(footerCode.includes('Spiritual Sanctum: Kashi (Varanasi), Uttar Pradesh, India'), 'Column 1 renders verified Spiritual Sanctum');
assert(footerCode.includes('mailto:support@vedastructure.com'), 'Column 1 renders verified mailto support link');

// 5. Column 2: Sacred Rituals Verification
assert(footerCode.includes('"/yagya-puja/puja"'), 'Column 2 links to /yagya-puja/puja');
assert(footerCode.includes('"/yagya-puja/yagya"'), 'Column 2 links to /yagya-puja/yagya');
assert(footerCode.includes('"/yagya-puja/japa"'), 'Column 2 links to /yagya-puja/japa');
assert(footerCode.includes('"/yagya-puja/path"'), 'Column 2 links to /yagya-puja/path');
assert(footerCode.includes('"/yagya-puja/homa"'), 'Column 2 links to /yagya-puja/homa');
assert(footerCode.includes('"/puja/upcoming"'), 'Column 2 links to /puja/upcoming');
assert(footerCode.includes('"/yagya-puja"'), 'Column 2 links to /yagya-puja');

// 6. Column 3: Wisdom & Consultations Verification
assert(footerCode.includes('"/book-consultation"'), 'Column 3 links to /book-consultation');
assert(footerCode.includes('"/astrologers"'), 'Column 3 links to /astrologers');
assert(footerCode.includes('"/library"'), 'Column 3 links to internal /library using Link');
assert(footerCode.includes('"/community"'), 'Column 3 links to /community');

// 7. Column 4: Trust & Policies Verification
assert(footerCode.includes('"/contact"'), 'Column 4 links to /contact');
assert(footerCode.includes('"/faqs"'), 'Column 4 links to /faqs');
assert(footerCode.includes('"/privacy"'), 'Column 4 links to canonical /privacy');
assert(footerCode.includes('"/terms"'), 'Column 4 links to canonical /terms');
assert(footerCode.includes('"/refund-policy"'), 'Column 4 links to canonical /refund-policy');
assert(footerCode.includes('"/shipping-policy"'), 'Column 4 links to canonical /shipping-policy');

// 8. Bottom Copyright Bar Verification
assert(footerCode.includes('© 2026 Veda Structure. All rights reserved.'), 'Bottom bar renders canonical copyright statement');
assert(footerCode.includes('Sanatan Dharma Sanctuary · Varanasi (Kashi), India'), 'Bottom bar renders sacred sanctuary attribution');

// 9. VishalFooter Strict File Boundary Verification
const vishalFooterPath = path.join(srcPath, 'components/layout/VishalFooter.jsx');
const vishalFooterCode = fs.readFileSync(vishalFooterPath, 'utf8');
assert(vishalFooterCode.includes('CONSULTATION'), 'VishalFooter.jsx remained untouched');
assert(vishalFooterCode.includes('EXPLORE VEDA'), 'VishalFooter.jsx unchanged boundary');

// 10. Design System Tokens
assert(footerCode.includes('#FFFCF6'), 'Adheres to primary background token #FFFCF6');
assert(footerCode.includes('#F8F1E6'), 'Adheres to secondary background token #F8F1E6');
assert(footerCode.includes('#B77920'), 'Adheres to antique gold token #B77920');
assert(footerCode.includes('#30251C'), 'Adheres to primary text token #30251C');
assert(footerCode.includes('#EAD8BC'), 'Adheres to border token #EAD8BC');

console.log(`\n========================================`);
console.log(`Test Execution Finished: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
