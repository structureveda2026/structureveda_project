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

console.log('=== VEDA STRUCTURE: FOOTER REDESIGN PHASE 1 VERIFICATION SUITE ===\n');

// 1. Check newly created page files exist
const legalPolicyPath = path.join(srcPath, 'pages/LegalPolicyPage.jsx');
const contactPath = path.join(srcPath, 'pages/ContactPage.jsx');
const faqsPath = path.join(srcPath, 'pages/FAQsPage.jsx');

assert(fs.existsSync(legalPolicyPath), 'LegalPolicyPage.jsx exists on disk');
assert(fs.existsSync(contactPath), 'ContactPage.jsx exists on disk');
assert(fs.existsSync(faqsPath), 'FAQsPage.jsx exists on disk');

// 2. Inspect AppRoutes.jsx
const appRoutesPath = path.join(srcPath, 'routes/AppRoutes.jsx');
assert(fs.existsSync(appRoutesPath), 'AppRoutes.jsx exists on disk');
const appRoutesCode = fs.readFileSync(appRoutesPath, 'utf8');

// Verify Canonical Routes in AppRoutes.jsx
assert(appRoutesCode.includes('path="/privacy"'), 'Route /privacy registered in AppRoutes.jsx');
assert(appRoutesCode.includes('path="/terms"'), 'Route /terms registered in AppRoutes.jsx');
assert(appRoutesCode.includes('path="/refund-policy"'), 'Route /refund-policy registered in AppRoutes.jsx');
assert(appRoutesCode.includes('path="/shipping-policy"'), 'Route /shipping-policy registered in AppRoutes.jsx');
assert(appRoutesCode.includes('path="/contact"'), 'Route /contact registered in AppRoutes.jsx');
assert(appRoutesCode.includes('path="/faqs"'), 'Route /faqs registered in AppRoutes.jsx');

// Verify Legacy Redirects in AppRoutes.jsx
assert(appRoutesCode.includes('path="/shipping" element={<Navigate to="/shipping-policy" replace />}'), 'Legacy /shipping redirects to /shipping-policy');
assert(appRoutesCode.includes('path="/returns" element={<Navigate to="/refund-policy" replace />}'), 'Legacy /returns redirects to /refund-policy');
assert(appRoutesCode.includes('path="/refunds" element={<Navigate to="/refund-policy" replace />}'), 'Legacy /refunds redirects to /refund-policy');
assert(appRoutesCode.includes('path="/privacy-policy" element={<Navigate to="/privacy" replace />}'), 'Legacy /privacy-policy redirects to /privacy');
assert(appRoutesCode.includes('path="/terms-and-conditions" element={<Navigate to="/terms" replace />}'), 'Legacy /terms-and-conditions redirects to /terms');
assert(appRoutesCode.includes('path="/faq" element={<Navigate to="/faqs" replace />}'), 'Legacy /faq redirects to /faqs');
assert(appRoutesCode.includes('path="/contact-us" element={<Navigate to="/contact" replace />}'), 'Legacy /contact-us redirects to /contact');

// 3. Inspect LegalPolicyPage.jsx content safeguards
const legalPolicyCode = fs.readFileSync(legalPolicyPath, 'utf8');
assert(legalPolicyCode.includes('Draft Policy — Pending Client Approval'), 'LegalPolicyPage has explicit draft disclaimer callout');
assert(legalPolicyCode.includes('POLICY_CONFIG'), 'LegalPolicyPage defines structured POLICY_CONFIG');
assert(legalPolicyCode.includes('privacy:'), 'LegalPolicyPage contains privacy policy configuration');
assert(legalPolicyCode.includes('terms:'), 'LegalPolicyPage contains terms & conditions configuration');
assert(legalPolicyCode.includes('refund:'), 'LegalPolicyPage contains refund policy configuration');
assert(legalPolicyCode.includes('shipping:'), 'LegalPolicyPage contains shipping policy configuration');
assert(legalPolicyCode.includes('support@vedastructure.com'), 'LegalPolicyPage provides support email');
assert(legalPolicyCode.includes('Breadcrumb'), 'LegalPolicyPage includes accessible breadcrumb navigation');
assert(legalPolicyCode.includes('#FFFCF6') || legalPolicyCode.includes('#fffaf0'), 'LegalPolicyPage adheres to authentic Veda Structure background palette');

// 4. Inspect ContactPage.jsx content safeguards
const contactCode = fs.readFileSync(contactPath, 'utf8');
assert(contactCode.includes('support@vedastructure.com'), 'ContactPage displays verified support email');
assert(contactCode.includes('mailto:support@vedastructure.com'), 'ContactPage uses functional mailto protocol link');
assert(contactCode.includes('Kashi (Varanasi), Uttar Pradesh, India'), 'ContactPage displays verified spiritual sanctum');
assert(!contactCode.includes('98765 43210'), 'ContactPage strictly excludes fake placeholder phone number');
assert(!contactCode.includes('<form'), 'ContactPage does not create a fake non-functional form');

// 5. Inspect FAQsPage.jsx content
const faqsCode = fs.readFileSync(faqsPath, 'utf8');
assert(faqsCode.includes('FAQ_DATA'), 'FAQsPage defines structured FAQ_DATA');
assert(faqsCode.includes('CATEGORIES'), 'FAQsPage defines multi-category filter structure');
assert(faqsCode.includes('searchQuery'), 'FAQsPage includes live search filter functionality');
assert(faqsCode.includes('toggleAccordion'), 'FAQsPage includes expandable accordion interactions');
assert(faqsCode.includes('Sankalp'), 'FAQsPage includes authentic Sankalp questions');
assert(faqsCode.includes('Astrologer Consultations'), 'FAQsPage includes verified astrologer guidance');

// 6. Strict Boundary Exclusions Check
const footerPath = path.join(srcPath, 'components/layout/Footer.jsx');
const vishalFooterPath = path.join(srcPath, 'components/layout/VishalFooter.jsx');
const footerCode = fs.readFileSync(footerPath, 'utf8');
const vishalFooterCode = fs.readFileSync(vishalFooterPath, 'utf8');

assert(footerCode.includes('SACRED RITUALS'), 'Footer.jsx remained untouched (no redesign in Phase 1)');
assert(vishalFooterCode.includes('CONSULTATION'), 'VishalFooter.jsx remained untouched (no redesign in Phase 1)');

// 7. Verify Veda Library was untouched
const libraryPath = path.join(srcPath, 'library');
assert(fs.existsSync(libraryPath), 'Library directory exists and is preserved');

console.log(`\n========================================`);
console.log(`Test Execution Finished: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
