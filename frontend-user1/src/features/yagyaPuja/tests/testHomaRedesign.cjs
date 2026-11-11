const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..');
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

console.log('=== VEDA STRUCTURE: HOMA REDESIGN COMPREHENSIVE TEST SUITE ===\n');

// 1. Landing Page (HomaCatalogueListing.jsx)
const landingPath = path.join(basePath, 'pages/HomaCatalogueListing.jsx');
const landingCode = fs.readFileSync(landingPath, 'utf8');

assert(landingCode.includes('<HomaListingHero'), 'Landing page renders HomaListingHero (Section 1)');
assert(landingCode.includes('<HomaConceptSection'), 'Landing page renders HomaConceptSection (Section 2)');
assert(landingCode.includes('<HomaCategoryDiscovery limit={6} showViewAll={true}'), 'Landing page renders HomaCategoryDiscovery with max 6 categories (Section 3)');
assert(landingCode.includes('<HomaCountSection'), 'Landing page renders HomaCountSection (Section 4)');
assert(landingCode.includes('<HomaSamagriSection'), 'Landing page renders HomaSamagriSection (Section 5)');
assert(landingCode.includes('<HomaWorkflowSection'), 'Landing page renders HomaWorkflowSection (Section 6)');
assert(landingCode.includes('<HomaFaqSection'), 'Landing page renders HomaFaqSection (Section 7)');
assert(landingCode.includes('<HomaFinalCta'), 'Landing page renders HomaFinalCta (Section 8)');

// Verify removed obsolete components
assert(!landingCode.includes('HomaConfiguratorDemo'), 'Landing page removes HomaConfiguratorDemo');
assert(!landingCode.includes('HomaConfigurationPreview'), 'Landing page removes HomaConfigurationPreview');
assert(!landingCode.includes('HomaPurposeSection'), 'Landing page removes HomaPurposeSection');
assert(!landingCode.includes('HomaPopularSection'), 'Landing page removes HomaPopularSection');
assert(!landingCode.includes('HomaPanditTeamSection'), 'Landing page removes HomaPanditTeamSection');
assert(!landingCode.includes('HomaArrangementModes'), 'Landing page removes HomaArrangementModes');
assert(!landingCode.includes('HomaWhyVedaStructure'), 'Landing page removes HomaWhyVedaStructure');
assert(!landingCode.includes('HomaCustomSection'), 'Landing page removes HomaCustomSection');
assert(!landingCode.includes('id="explore"'), 'Landing page removes old 50-service grid (#explore)');

// Count rendered sections in landing JSX
const matches = landingCode.match(/<Homa[A-Z][a-zA-Z]+/g) || [];
assert(matches.length === 8, `Landing page contains exactly 8 approved sections (Actual: ${matches.length})`);

// 2. Category Page (HomaCategoryListing.jsx)
const categoryPath = path.join(basePath, 'pages/HomaCategoryListing.jsx');
const categoryCode = fs.readFileSync(categoryPath, 'utf8');

assert(!categoryCode.includes('<HomaSamagriSection />'), 'Category page removes HomaSamagriSection from footer');
assert(!categoryCode.includes('<HomaPanditTeamSection />'), 'Category page removes HomaPanditTeamSection from footer');
assert(!categoryCode.includes('<HomaKashiSection />'), 'Category page removes HomaKashiSection from footer');
assert(!categoryCode.includes('<HomaFaqSection />'), 'Category page removes HomaFaqSection from footer');
assert(!categoryCode.includes('<HomaFinalCta />'), 'Category page removes HomaFinalCta from footer');
assert(!categoryCode.includes('puja-mrityunjaya.jpg'), 'Category page does not borrow puja-mrityunjaya.jpg');
assert(!categoryCode.includes('puja-rudrabhishek.jpg'), 'Category page does not borrow puja-rudrabhishek.jpg');
assert(categoryCode.includes('cardYagyaFireImg'), 'Category page uses authentic fire ceremony cardYagyaFireImg');
assert(categoryCode.includes('yagyaSacredFireCardImg'), 'Category page uses authentic fire ceremony yagyaSacredFireCardImg');
assert(categoryCode.includes('yagyaFireRitualImg'), 'Category page uses authentic fire ceremony yagyaFireRitualImg');

// 3. Service Detail Page (HomaServiceDetails.jsx)
const detailPath = path.join(basePath, 'pages/HomaServiceDetails.jsx');
const detailCode = fs.readFileSync(detailPath, 'utf8');

assert(!detailCode.includes('#configuration-demonstrator'), 'Detail page removes #configuration-demonstrator anchor');
assert(!detailCode.includes('Architecture Preview'), 'Detail page removes Architecture Preview disclaimer');
assert(!detailCode.includes('Live pricing engine and schedule confirmation will activate'), 'Detail page removes future release warning');
assert(!detailCode.includes('upcoming booking release'), 'Detail page removes upcoming release disclaimer');
assert(detailCode.includes('/yagya-puja/homa/${service.slug}/book'), 'Detail page "Book Homa Ceremony" links directly to /book route');
assert(detailCode.includes('Starting Dakshina'), 'Detail page displays Starting Dakshina badge');
assert(detailCode.includes('lg:hidden fixed bottom-0'), 'Detail page provides mobile sticky bottom booking bar');
assert(detailCode.includes('Prescribed Pandit Qualifications'), 'Detail page displays Acharya qualifications');
assert(detailCode.includes('Sacred Samagri Specifications'), 'Detail page displays itemized Samagri');

// 4. Booking Page (HomaSinglePageBooking.jsx)
const bookingPath = path.join(basePath, 'components/booking/HomaSinglePageBooking.jsx');
const bookingCode = fs.readFileSync(bookingPath, 'utf8');

assert(!bookingCode.includes('/assets/card-yagya-fire-CIHyRsVH.jpg'), 'Booking page removes hardcoded Vite hashed build asset');
assert(bookingCode.includes('import cardYagyaFireImg from "../../../../assets/images/library/cards/card-yagya-fire.jpg"'), 'Booking page uses stable Vite import for fallback image');
assert(bookingCode.includes('Number(activeHavanCount) === 1'), 'Booking page enforces 1 Havan = 1 Day coupling rule');
assert(bookingCode.includes('initiateBookingAndPayment'), 'Booking page preserves Cashfree payment initiation');
assert(bookingCode.includes('handleSaveMember'), 'Booking page preserves family member save flow');
assert(bookingCode.includes('lg:sticky lg:top-6') || bookingCode.includes('top-24 sticky') || bookingCode.includes('sticky top-24'), 'Booking page maintains sticky summary');
assert(bookingCode.includes('lg:hidden fixed bottom-0'), 'Booking page maintains mobile bottom drawer');

// 5. Category Card & Service Card
const catCardPath = path.join(basePath, 'components/HomaCategoryCard.jsx');
const catCardCode = fs.readFileSync(catCardPath, 'utf8');
assert(!catCardCode.includes('puja-mrityunjaya.jpg'), 'HomaCategoryCard removes borrowed Puja images');
assert(catCardCode.includes('cardYagyaFireImg'), 'HomaCategoryCard imports authentic fire ritual assets');
assert(catCardCode.includes('border-[#EAD8B8]'), 'HomaCategoryCard uses soft gold border #EAD8B8');

const srvCardPath = path.join(basePath, 'components/HomaServiceCard.jsx');
const srvCardCode = fs.readFileSync(srvCardPath, 'utf8');
assert(srvCardCode.includes('border-[#EAD8B8]'), 'HomaServiceCard uses soft gold border #EAD8B8');
assert(srvCardCode.includes('/yagya-puja/homa/${service.slug}'), 'HomaServiceCard links to service details');

// 6. Workflow Section
const workflowPath = path.join(basePath, 'components/HomaWorkflowSection.jsx');
const workflowCode = fs.readFileSync(workflowPath, 'utf8');
assert(!workflowCode.includes('SYSTEM DISCLOSURE'), 'HomaWorkflowSection removes obsolete architecture disclosure card');
assert(!workflowCode.includes('Future scheduler checks Acharya team availability'), 'HomaWorkflowSection removes future scheduler copy');
assert(workflowCode.includes('STEP {item.step}'), 'HomaWorkflowSection displays customer journey steps');

console.log('\n========================================');
console.log(`TOTAL PASSED: ${passed}`);
console.log(`TOTAL FAILED: ${failed}`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}

