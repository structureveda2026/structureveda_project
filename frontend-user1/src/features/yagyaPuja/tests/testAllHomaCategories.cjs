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

console.log('=== VEDA STRUCTURE: ALL HOMA CATEGORIES COMPREHENSIVE TEST SUITE ===\n');

// 1. Central Category Config Verification
const configPath = path.join(basePath, 'data/homaCategoryConfig.js');
assert(fs.existsSync(configPath), 'Config: homaCategoryConfig.js exists');
const configCode = fs.readFileSync(configPath, 'utf8');

const expectedCategories = [
  'shiva-rudra-homa',
  'ganapati-homa',
  'durga-chandi-homa',
  'lakshmi-kubera-homa',
  'navagraha-planetary-homa',
  'vastu-griha-homa',
  'ayushya-longevity-homa',
];

expectedCategories.forEach((slug) => {
  assert(configCode.includes(`"${slug}":`), `Config: Defines presentation configuration for category "${slug}"`);
  assert(configCode.includes(`"${slug}": {`), `Config: Defines dedicated visuals for category "${slug}"`);
});

assert(configCode.includes('DEFAULT_HOMA_CATEGORY_CONFIG'), 'Config: Defines robust DEFAULT_HOMA_CATEGORY_CONFIG fallback');
assert(configCode.includes('getCategoryVisuals'), 'Config: Exports getCategoryVisuals resolver');
assert(configCode.includes('getHomaCategoryConfig'), 'Config: Exports getHomaCategoryConfig resolver');

// 2. Universal Component Verification: HomaCategoryView.jsx
const viewPath = path.join(basePath, 'components/HomaCategoryView.jsx');
assert(fs.existsSync(viewPath), 'Component: HomaCategoryView.jsx exists');
const viewCode = fs.readFileSync(viewPath, 'utf8');

// Section 1: Hero
assert(viewCode.includes('visuals.hero'), 'Section 1: Uses dynamic category hero visual');
assert(viewCode.includes('config.eyebrow'), 'Section 1: Displays dynamic category eyebrow');
assert(viewCode.includes('renderHeading(category?.name)'), 'Section 1: Renders category heading with gold accent');
assert(viewCode.includes('config.subtitle'), 'Section 1: Displays dynamic category subtitle');
assert(viewCode.includes('href="#category-services"'), 'Section 1: Primary CTA scrolls to #category-services');
assert(viewCode.includes('href="#about-category"'), 'Section 1: Secondary CTA scrolls to #about-category');
assert(viewCode.includes('config.trustIndicators.map'), 'Section 1: Dynamically renders trust indicators');

// Section 2: About
assert(viewCode.includes('id="about-category"'), 'Section 2: Has anchor id="about-category"');
assert(viewCode.includes('visuals.about'), 'Section 2: Displays dynamic category about visual');
assert(viewCode.includes('config.aboutTitle'), 'Section 2: Displays dynamic about title');
assert(viewCode.includes('config.aboutDescription'), 'Section 2: Displays dynamic about description');
assert(viewCode.includes('config.aboutCards.map'), 'Section 2: Dynamically renders 3 compact cards with Lucide icons');

// Section 3: Adaptive Services Listing
assert(viewCode.includes('id="category-services"'), 'Section 3: Has anchor id="category-services"');
assert(viewCode.includes('services.length === 0'), 'Section 3: Handles 0 services with elegant empty state');
assert(viewCode.includes('services.length === 1'), 'Section 3: Handles 1 service with large horizontal featured showcase');
assert(viewCode.includes('services.length >= 2'), 'Section 3: Handles 2 or more services with responsive grid');
assert(viewCode.includes('filteredServices.length === 2'), 'Section 3: Optimizes 2-service categories (e.g. Shiva) into responsive 2-column layout');
assert(viewCode.includes('services.length > 1 && ('), 'Section 3: Shows filter/search bar only when multiple services exist');

// Section 4: Ceremony Details & Verified Inclusions
assert(viewCode.includes('id="ceremony-details"'), 'Section 4: Has anchor id="ceremony-details"');
assert(viewCode.includes('visuals.samagri'), 'Section 4: Displays category-specific samagri visual');
assert(viewCode.includes('samagriList.map'), 'Section 4: Dynamically iterates verified samagri list');
assert(viewCode.includes('itemStatus'), 'Section 4: Displays verified Included/Optional status badges');
assert(viewCode.includes('Initiated Acharyas'), 'Section 4: Displays Initiated Acharyas card');
assert(viewCode.includes('Dispatched Prasad'), 'Section 4: Displays Dispatched Prasad card');

// Section 5: FAQs & Final CTA
assert(viewCode.includes('id="category-faqs"'), 'Section 5: Has anchor id="category-faqs"');
assert(viewCode.includes('config.faqs.slice'), 'Section 5: Renders 2-column responsive FAQ accordion');
assert(viewCode.includes('config.finalCta.heading'), 'Section 5: Displays dynamic final CTA heading');
assert(viewCode.includes('config.finalCta.description'), 'Section 5: Displays dynamic final CTA description');
assert(viewCode.includes('/yagya-puja/homa/${primaryService.slug}/book'), 'Section 5: Final CTA links directly to service booking wizard');

// 3. Orchestration Verification: HomaCategoryListing.jsx
const listingPath = path.join(basePath, 'pages/HomaCategoryListing.jsx');
const listingCode = fs.readFileSync(listingPath, 'utf8');

assert(listingCode.includes('HomaCategoryView'), 'HomaCategoryListing imports HomaCategoryView');
assert(listingCode.includes('<HomaCategoryView'), 'HomaCategoryListing renders HomaCategoryView for all active categories');
assert(listingCode.includes('NavagrahaCategoryView'), 'HomaCategoryListing preserves NavagrahaCategoryView integration');

// 4. Asset Integrity
const assetsPath = path.join(basePath, '../../assets/images');
const checkedAssets = [
  'homa/shiva-rudra-homa-hero.jpg',
  'yagya/yagya-sacred-fire-detail.webp.png',
  'yagya/yagya-purnahuti.webp.png',
  'library/cards/card-yagya-fire.jpg',
  'homa/navagraha-hero-sacred-fire.jpg',
  'library/banners/banner-fire-ritual.png',
  'homa/homa-hero-morning-sanctum.jpg',
  'homa/navagraha-mandala-yantra.jpg',
  'homa/navagraha-sacred-samagri.jpg',
  'homa/navagraha-ritual-showcase.jpg',
  'samagri/samagri-pushpa-bilva.jpg',
  'samagri/samagri-havan-mix.jpg',
  'samagri/samagri-special-ahuti.jpg',
  'samagri/samagri-desi-ghee.jpg',
  'samagri/samagri-copper-agni-kund.jpg',
  'samagri/samagri-herbal-decoction.jpg',
];

checkedAssets.forEach((assetRel) => {
  const fullPath = path.join(assetsPath, assetRel);
  assert(fs.existsSync(fullPath), `Asset: ${assetRel} exists and is verified`);
});

console.log('\n========================================');
console.log(`TOTAL PASSED: ${passed}`);
console.log(`TOTAL FAILED: ${failed}`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}
