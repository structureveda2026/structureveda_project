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

console.log('=== VEDA STRUCTURE: FINAL FOOTER ALIGNMENT & MAIN NAVBAR CLEANUP TEST SUITE ===\n');

// 1. Inspect Footer.jsx
const footerPath = path.join(srcPath, 'components/layout/Footer.jsx');
assert(fs.existsSync(footerPath), 'Footer.jsx exists on disk');
const footerCode = fs.readFileSync(footerPath, 'utf8');

// Part 1: Top Trust Ribbon Removal
assert(!footerCode.includes('ॐ असतो मा सद्गमय'), 'Footer: Top Shloka text completely removed');
assert(!footerCode.includes('100% Vedic Authentic'), 'Footer: 100% Vedic Authentic badge removed');
assert(!footerCode.includes('Verified Kashi Acharyas'), 'Footer: Verified Kashi Acharyas badge removed');
assert(!footerCode.includes('Worldwide Sankalpa'), 'Footer: Worldwide Sankalpa badge removed');
assert(!footerCode.includes('TOP SHLOKA RIBBON'), 'Footer: Shloka ribbon container removed');

// Part 2: Column Consistency & 32px Icon Containers
assert(footerCode.includes('h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#EAD8BC]'), 'Footer: Standardized 32px icon container (h-8 w-8) used across columns');

// Sacred Rituals (7 canonical links)
assert(footerCode.includes('path: "/yagya-puja/puja"'), 'Footer: Sacred Rituals links to /yagya-puja/puja');
assert(footerCode.includes('path: "/yagya-puja/yagya"'), 'Footer: Sacred Rituals links to /yagya-puja/yagya');
assert(footerCode.includes('path: "/yagya-puja/japa"'), 'Footer: Sacred Rituals links to /yagya-puja/japa');
assert(footerCode.includes('path: "/yagya-puja/path"'), 'Footer: Sacred Rituals links to /yagya-puja/path');
assert(footerCode.includes('path: "/yagya-puja/homa"'), 'Footer: Sacred Rituals links to /yagya-puja/homa');
assert(footerCode.includes('path: "/puja/upcoming"'), 'Footer: Sacred Rituals links to /puja/upcoming');
assert(footerCode.includes('path: "/yagya-puja"'), 'Footer: Sacred Rituals links to /yagya-puja');

// Wisdom (4 canonical links)
assert(footerCode.includes('path: "/book-consultation"'), 'Footer: Wisdom links to /book-consultation');
assert(footerCode.includes('path: "/astrologers"'), 'Footer: Wisdom links to /astrologers');
assert(footerCode.includes('path: "/library"'), 'Footer: Wisdom links to internal /library');
assert(footerCode.includes('path: "/community"'), 'Footer: Wisdom links to /community');

// Trust & Policies (6 canonical links)
assert(footerCode.includes('path: "/contact"'), 'Footer: Trust & Policies links to /contact');
assert(footerCode.includes('path: "/faqs"'), 'Footer: Trust & Policies links to /faqs');
assert(footerCode.includes('path: "/privacy"'), 'Footer: Trust & Policies links to /privacy');
assert(footerCode.includes('path: "/terms"'), 'Footer: Trust & Policies links to /terms');
assert(footerCode.includes('path: "/refund-policy"'), 'Footer: Trust & Policies links to /refund-policy');
assert(footerCode.includes('path: "/shipping-policy"'), 'Footer: Trust & Policies links to /shipping-policy');

// Part 3: Brand Column & Social Links
assert(footerCode.includes('VEDA STRUCTURE'), 'Footer: Brand column renders VEDA STRUCTURE wordmark');
assert(footerCode.includes('WISDOM, WORLDWIDE'), 'Footer: Brand column renders WISDOM, WORLDWIDE tagline');
assert(footerCode.includes('Spiritual Sanctum: Kashi (Varanasi), Uttar Pradesh, India'), 'Footer: Brand column renders spiritual sanctum');
assert(footerCode.includes('mailto:support@vedastructure.com'), 'Footer: Brand column renders support email link');
assert(footerCode.includes('https://www.instagram.com/vedastructure.official/'), 'Footer: Brand column renders verified Instagram link');
assert(footerCode.includes('https://www.linkedin.com/in/veda-structure-ba7517355/'), 'Footer: Brand column renders verified LinkedIn link');
assert(footerCode.includes('https://www.facebook.com/vedastructure/'), 'Footer: Brand column renders verified Facebook link');

// Part 4: Bottom Copyright Bar
assert(footerCode.includes('© 2026 Veda Structure. All rights reserved.'), 'Footer: Bottom bar renders copyright');
assert(footerCode.includes('Sanatan Dharma Sanctuary · Varanasi (Kashi), India'), 'Footer: Bottom bar renders sanctuary attribution');

// Part 5: Main Navbar Cleanup
const navbarPath = path.join(srcPath, 'components/layout/Navbar.jsx');
assert(fs.existsSync(navbarPath), 'Navbar.jsx exists on disk');
const navbarCode = fs.readFileSync(navbarPath, 'utf8');

// A. Store in Navbar
assert(navbarCode.includes('>Store</a>') || navbarCode.includes('>Store</'), 'Navbar: Single Store navigation link present in desktop nav');
assert(navbarCode.includes('<span>Store</span>'), 'Navbar: Single Store navigation link present in mobile drawer');
assert(!navbarCode.includes('>Shop</a>') && !navbarCode.includes('<span>Shop</span>'), 'Navbar: Old duplicate Shop links completely removed');
assert(navbarCode.includes('https://store.vedastructure.com/'), 'Navbar: Canonical Store destination preserved');

// B. Upcoming Puja removal from top-level navbar
// Check that Upcoming Puja is not rendered as top-level links in desktop row or mobile drawer
assert(!navbarCode.includes('>Upcoming Puja</Link>') && !navbarCode.includes('>Upcoming Puja\n'), 'Navbar: Upcoming Puja removed from top-level navbar');

// C. Preserved functionality in Navbar
assert(navbarCode.includes('Talk to an Astrologer'), 'Navbar: Talk to an Astrologer preserved');
assert(navbarCode.includes('Yagya & Puja'), 'Navbar: Yagya & Puja preserved');
assert(navbarCode.includes('Veda Library'), 'Navbar: Veda Library preserved');
assert(navbarCode.includes('Community'), 'Navbar: Community link preserved');

// Strict Boundary Exclusions
const vishalFooterPath = path.join(srcPath, 'components/layout/VishalFooter.jsx');
const vishalFooterCode = fs.readFileSync(vishalFooterPath, 'utf8');
assert(vishalFooterCode.includes('CONSULTATION'), 'VishalFooter.jsx remained untouched');

console.log(`\n========================================`);
console.log(`Test Execution Finished: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
