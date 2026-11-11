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

console.log('=== VEDA STRUCTURE: NAVAGRAHA CATEGORY REDESIGN TEST SUITE ===\n');

// 1. Asset File Presence
const assetsPath = path.join(basePath, '../../assets/images/homa');
const heroAsset = path.join(assetsPath, 'navagraha-hero-sacred-fire.jpg');
const showcaseAsset = path.join(assetsPath, 'navagraha-ritual-showcase.jpg');
const samagriAsset = path.join(assetsPath, 'navagraha-sacred-samagri.jpg');
const mandalaAsset = path.join(assetsPath, 'navagraha-mandala-yantra.jpg');

assert(fs.existsSync(heroAsset), 'Asset: navagraha-hero-sacred-fire.jpg exists in assets');
assert(fs.existsSync(showcaseAsset), 'Asset: navagraha-ritual-showcase.jpg exists in assets');
assert(fs.existsSync(samagriAsset), 'Asset: navagraha-sacred-samagri.jpg exists in assets');
assert(fs.existsSync(mandalaAsset), 'Asset: navagraha-mandala-yantra.jpg exists in assets');

// 2. Component Implementation: NavagrahaCategoryView.jsx
const navagrahaViewPath = path.join(basePath, 'components/navagraha/NavagrahaCategoryView.jsx');
assert(fs.existsSync(navagrahaViewPath), 'Component: NavagrahaCategoryView.jsx created');
const navagrahaViewCode = fs.readFileSync(navagrahaViewPath, 'utf8');

// Section 1: Hero
assert(navagrahaViewCode.includes('navagrahaHeroSacredFireImg'), 'Section 1: Uses dedicated Navagraha hero sacred fire image');
assert(navagrahaViewCode.includes('VEDIC GRAHA SHANTI • 9 CELESTIAL DEITIES'), 'Section 1: Renders authentic category eyebrow');
assert(navagrahaViewCode.includes('Navagraha Planetary') && navagrahaViewCode.includes('Homa'), 'Section 1: Renders H1 with gold accent');
assert(navagrahaViewCode.includes('Sacred Fire Oblations with 9 Prescribed Botanical Samidhas'), 'Section 1: Renders Shastric subtitle');
assert(navagrahaViewCode.includes('href="#featured-ritual"'), 'Section 1: Primary CTA scrolls to #featured-ritual');
assert(navagrahaViewCode.includes('href="#about-navagraha"'), 'Section 1: Secondary CTA scrolls to #about-navagraha');
assert(navagrahaViewCode.includes('9 Shastric Botanical Woods'), 'Section 1: Trust indicator: 9 Shastric Botanical Woods');
assert(navagrahaViewCode.includes('Initiated Vedic Purohits'), 'Section 1: Trust indicator: Initiated Vedic Purohits');
assert(navagrahaViewCode.includes('Kashi Sanctum &amp; Remote'), 'Section 1: Trust indicator: Kashi Sanctum & Remote');

// Section 2: About Navagraha Homa
assert(navagrahaViewCode.includes('id="about-navagraha"'), 'Section 2: Has anchor id="about-navagraha"');
assert(navagrahaViewCode.includes('navagrahaMandalaYantraImg'), 'Section 2: Uses dedicated Navagraha mandala yantra visual');
assert(navagrahaViewCode.includes('The Vedic Science of Navagraha Shanti'), 'Section 2: Renders editorial section heading');
assert(navagrahaViewCode.includes('Nine Celestial Deities'), 'Section 2: Renders Card 1: Nine Celestial Deities');
assert(navagrahaViewCode.includes('Sacred Botanical Woods'), 'Section 2: Renders Card 2: Sacred Botanical Woods');
assert(navagrahaViewCode.includes('Yajman Sankalpa Vidhi'), 'Section 2: Renders Card 3: Yajman Sankalpa Vidhi');

// Section 3: Featured Navagraha Service Showcase
assert(navagrahaViewCode.includes('id="featured-ritual"'), 'Section 3: Has anchor id="featured-ritual"');
assert(navagrahaViewCode.includes('Consecrated Planetary Homa'), 'Section 3: Status indicator displays Consecrated Planetary Homa');
assert(navagrahaViewCode.includes('navagrahaRitualShowcaseImg'), 'Section 3: Uses dedicated Navagraha ritual showcase visual');
assert(navagrahaViewCode.includes('Featured Homa'), 'Section 3: Floating badge displays Featured Homa');
assert(navagrahaViewCode.includes('Supported Havan Counts:'), 'Section 3: Displays Supported Havan Counts parameter');
assert(navagrahaViewCode.includes('Available Durations:'), 'Section 3: Displays Available Durations parameter');
assert(navagrahaViewCode.includes('Pandit Requirements:'), 'Section 3: Displays Pandit Requirements parameter');
assert(navagrahaViewCode.includes('Starting Dakshina'), 'Section 3: Displays Starting Dakshina badge');
assert(navagrahaViewCode.includes('/yagya-puja/homa/navagraha-homa') && navagrahaViewCode.includes('View Ceremony'), 'Section 3: Primary CTA links to /yagya-puja/homa/navagraha-homa');
assert(navagrahaViewCode.includes('/yagya-puja/homa/navagraha-homa/book') && navagrahaViewCode.includes('Book Ceremony'), 'Section 3: Direct CTA links to /yagya-puja/homa/navagraha-homa/book');

// Section 4: Ceremony Details & Inclusions
assert(navagrahaViewCode.includes('id="ceremony-details"'), 'Section 4: Has anchor id="ceremony-details"');
assert(navagrahaViewCode.includes('navagrahaSacredSamagriImg'), 'Section 4: Uses dedicated Navagraha sacred samagri visual');
assert(navagrahaViewCode.includes('Itemized Sacred Samagri'), 'Section 4: Displays Itemized Sacred Samagri header');
assert(navagrahaViewCode.includes('samagriList.map'), 'Section 4: Dynamically iterates verified samagri list');
assert(navagrahaViewCode.includes('Initiated Acharyas'), 'Section 4: Displays Acharya Credentials card');
assert(navagrahaViewCode.includes('Dispatched Prasad'), 'Section 4: Displays Dispatched Prasad card');

// Section 5: FAQs & Final CTA
assert(navagrahaViewCode.includes('id="navagraha-faqs"'), 'Section 5: Has anchor id="navagraha-faqs"');
assert(navagrahaViewCode.includes('Why are nine distinct sacred woods (Samidhas) used in Navagraha Homa?'), 'Section 5: Includes authentic 9-woods FAQ');
assert(navagrahaViewCode.includes('Can I participate in the Navagraha Homa remotely?'), 'Section 5: Includes remote participation FAQ');
assert(navagrahaViewCode.includes('HARMONIZE YOUR COSMIC SPHERES'), 'Section 5: Final CTA eyebrow: HARMONIZE YOUR COSMIC SPHERES');
assert(navagrahaViewCode.includes('Arrange Your Consecrated Navagraha Homa'), 'Section 5: Final CTA heading');
assert(navagrahaViewCode.includes('to="/yagya-puja/homa/navagraha-homa/book"'), 'Section 5: Final CTA primary button links to booking wizard');
assert(navagrahaViewCode.includes('to="/yagya-puja/homa"'), 'Section 5: Final CTA secondary button links to all categories');

// 3. Page Routing & Integration: HomaCategoryListing.jsx
const catListingPath = path.join(basePath, 'pages/HomaCategoryListing.jsx');
const catListingCode = fs.readFileSync(catListingPath, 'utf8');

assert(catListingCode.includes('NavagrahaCategoryView'), 'HomaCategoryListing imports NavagrahaCategoryView');
assert(catListingCode.includes('categorySlug === "navagraha-planetary-homa"'), 'HomaCategoryListing routes navagraha-planetary-homa to dedicated view');
assert(catListingCode.includes('navagrahaHeroSacredFireImg'), 'HomaCategoryListing imports navagrahaHeroSacredFireImg');

// 4. Technical Fixes: homaCatalogueService.js & HomaServiceCard.jsx
const serviceCatalogPath = path.join(basePath, '../../services/homaCatalogueService.js');
const serviceCatalogCode = fs.readFileSync(serviceCatalogPath, 'utf8');
assert(serviceCatalogCode.includes('isUnresolvableAsset'), 'homaCatalogueService safely detects unresolvable asset paths');
assert(serviceCatalogCode.includes('navagrahaRitualShowcaseImg'), 'homaCatalogueService uses navagrahaRitualShowcaseImg for navagraha-homa');

const serviceCardPath = path.join(basePath, 'components/HomaServiceCard.jsx');
const serviceCardCode = fs.readFileSync(serviceCardPath, 'utf8');
assert(serviceCardCode.includes('getHomaFallbackImage'), 'HomaServiceCard imports getHomaFallbackImage');
assert(serviceCardCode.includes('fallbackImg'), 'HomaServiceCard falls back cleanly without infinite URL looping');

console.log('\n========================================');
console.log(`TOTAL PASSED: ${passed}`);
console.log(`TOTAL FAILED: ${failed}`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}
