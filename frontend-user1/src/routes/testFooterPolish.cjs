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

console.log('=== VEDA STRUCTURE: FOOTER POLISH VERIFICATION SUITE ===\n');

// 1. Inspect Footer.jsx
const footerPath = path.join(srcPath, 'components/layout/Footer.jsx');
assert(fs.existsSync(footerPath), 'Footer.jsx exists on disk');
const footerCode = fs.readFileSync(footerPath, 'utf8');

// 2. Verified Social Links Verification
assert(
  footerCode.includes('https://www.instagram.com/vedastructure.official/'),
  'Footer.jsx contains verified Instagram URL'
);
assert(
  footerCode.includes('https://www.linkedin.com/in/veda-structure-ba7517355/'),
  'Footer.jsx contains verified LinkedIn URL'
);
assert(
  footerCode.includes('https://www.facebook.com/vedastructure/'),
  'Footer.jsx contains verified Facebook URL'
);

// 3. Prohibited / Unverified Social Links Verification
assert(!footerCode.includes('youtube.com'), 'Footer.jsx strictly excludes unverified YouTube link');
assert(!footerCode.includes('x.com'), 'Footer.jsx strictly excludes unverified X / Twitter link');
assert(!footerCode.includes('twitter.com'), 'Footer.jsx strictly excludes unverified Twitter link');
assert(!footerCode.includes('whatsapp.com'), 'Footer.jsx strictly excludes unverified WhatsApp web link');
assert(!footerCode.includes('wa.me'), 'Footer.jsx strictly excludes unverified WhatsApp wa.me link');
assert(!footerCode.includes('98765 43210'), 'Footer.jsx strictly excludes fake telephone number');

// 4. Social Links Attributes Verification
assert(footerCode.includes('target="_blank"'), 'Social links use target="_blank"');
assert(footerCode.includes('rel="noopener noreferrer"'), 'Social links use rel="noopener noreferrer"');
assert(footerCode.includes('aria-label={soc.ariaLabel}'), 'Social links bind accessible aria-label');
assert(footerCode.includes('Follow Veda Structure on Instagram'), 'Instagram has accessible aria-label content');
assert(footerCode.includes('Connect with Veda Structure on LinkedIn'), 'LinkedIn has accessible aria-label content');
assert(footerCode.includes('Follow Veda Structure on Facebook'), 'Facebook has accessible aria-label content');
assert(footerCode.includes('focus-visible:'), 'Social icons have visible keyboard focus state');

// 5. Trust & Policies Column Visual Hierarchy & Icons Verification
assert(footerCode.includes('Headphones'), 'Trust & Policies uses Headphones icon for Contact Support');
assert(footerCode.includes('HelpCircle'), 'Trust & Policies uses HelpCircle icon for FAQs');
assert(footerCode.includes('ShieldCheck'), 'Trust & Policies uses ShieldCheck icon for Privacy');
assert(footerCode.includes('FileText'), 'Trust & Policies uses FileText icon for Terms');
assert(footerCode.includes('RotateCcw'), 'Trust & Policies uses RotateCcw icon for Refund Policy');
assert(footerCode.includes('Truck'), 'Trust & Policies uses Truck icon for Shipping Policy');
assert(footerCode.includes('ChevronRight'), 'Trust & Policies includes right-arrow indicator on hover');

// 6. Canonical Routes in Trust & Policies
assert(footerCode.includes('path: "/contact"'), 'Trust & Policies links to /contact');
assert(footerCode.includes('path: "/faqs"'), 'Trust & Policies links to /faqs');
assert(footerCode.includes('path: "/privacy"'), 'Trust & Policies links to /privacy');
assert(footerCode.includes('path: "/terms"'), 'Trust & Policies links to /terms');
assert(footerCode.includes('path: "/refund-policy"'), 'Trust & Policies links to /refund-policy');
assert(footerCode.includes('path: "/shipping-policy"'), 'Trust & Policies links to /shipping-policy');

// 7. Non-Regression: Brand, Rituals, Wisdom, Ribbon, Bottom Bar
assert(footerCode.includes('VEDA STRUCTURE'), 'Brand column wordmark preserved');
assert(footerCode.includes('Spiritual Sanctum: Kashi (Varanasi), Uttar Pradesh, India'), 'Sanctum location preserved');
assert(footerCode.includes('mailto:support@vedastructure.com'), 'Support email mailto link preserved');
assert(footerCode.includes('path: "/yagya-puja/puja"'), 'Sacred Rituals links preserved');
assert(footerCode.includes('path: "/library"'), 'Veda Library internal link preserved');
assert(!footerCode.includes('veda-library-five.vercel.app'), 'No external staging URL in footer');
assert(footerCode.includes('ॐ असतो मा सद्गमय'), 'Sacred Shloka ribbon preserved');
assert(footerCode.includes('© 2026 Veda Structure. All rights reserved.'), 'Copyright bar preserved');

// 8. Strict Boundaries: VishalFooter untouched
const vishalFooterPath = path.join(srcPath, 'components/layout/VishalFooter.jsx');
const vishalFooterCode = fs.readFileSync(vishalFooterPath, 'utf8');
assert(vishalFooterCode.includes('CONSULTATION'), 'VishalFooter.jsx remained untouched');

// 9. Design System Palette Tokens
assert(footerCode.includes('#FFFCF6'), 'Uses background token #FFFCF6');
assert(footerCode.includes('#F8F1E6'), 'Uses secondary background token #F8F1E6');
assert(footerCode.includes('#B77920'), 'Uses antique gold token #B77920');
assert(footerCode.includes('#30251C'), 'Uses primary text token #30251C');
assert(footerCode.includes('#EAD8BC'), 'Uses border token #EAD8BC');

console.log(`\n========================================`);
console.log(`Test Execution Finished: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
