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

console.log('=== VEDA STRUCTURE: HOMA SERVICE DETAIL REDESIGN TEST SUITE ===\n');

// 1. Component Existence & Import Verification
const detailPath = path.join(basePath, 'pages/HomaServiceDetails.jsx');
assert(fs.existsSync(detailPath), 'Component: HomaServiceDetails.jsx exists');
const detailCode = fs.readFileSync(detailPath, 'utf8');

assert(detailCode.includes('getHomaServiceGallery'), 'Details: Imports getHomaServiceGallery helper');
assert(detailCode.includes('getHomaFallbackImage'), 'Details: Imports getHomaFallbackImage helper');
assert(detailCode.includes('HomaServiceCard'), 'Details: Imports HomaServiceCard');
assert(detailCode.includes('HomaSamagriSection'), 'Details: Imports HomaSamagriSection');
assert(detailCode.includes('PublicSEO'), 'Details: Imports PublicSEO for metadata');

// 2. Main Service Hero (Phase 3)
assert(detailCode.includes('lg:grid-cols-12'), 'Hero: Uses responsive 2-column desktop grid');
assert(detailCode.includes('aspect-[4/3]'), 'Hero: Main gallery image has consistent aspect ratio');
assert(detailCode.includes('handlePrevSlide') && detailCode.includes('handleNextSlide'), 'Hero: Previous and next slide controls implemented');
assert(detailCode.includes('currentSlide + 1'), 'Hero: Displays active slide counter');
assert(detailCode.includes('border-[#B7791F]'), 'Hero: Thumbnails rail highlights active slide with brand gold border');
assert(detailCode.includes('service.homaType'), 'Hero: Displays category eyebrow/pill');
assert(detailCode.includes('service.name'), 'Hero: Displays service heading in font-serif');
assert(detailCode.includes('Kashi Sanctum (Varanasi)'), 'Hero: Displays Kashi location availability badge');
assert(detailCode.includes('Remote Live Stream'), 'Hero: Displays Remote live stream availability badge');

// 3. Consolidated Ceremony Specifications Panel (Phase 4)
assert(detailCode.includes('Supported Havans'), 'Specs: Displays Supported Havans parameter');
assert(detailCode.includes('Available Durations'), 'Specs: Displays Available Durations parameter');
assert(detailCode.includes('Pandit Scale'), 'Specs: Displays Pandit Scale parameter');
assert(detailCode.includes('Daily Ritual Hours') || detailCode.includes('Daily Ceremony Hours'), 'Specs: Displays Daily Ritual Hours parameter');
assert(detailCode.includes('service.availableHavanCounts'), 'Specs: Dynamically derives Havan counts');
assert(detailCode.includes('service.availableDays'), 'Specs: Dynamically derives duration days');

// 4. Pricing & Primary Conversion CTA (Phase 3 & 8)
assert(detailCode.includes('Starting Dakshina'), 'Pricing: Displays Starting Dakshina badge');
assert(detailCode.includes('startingPrice.toLocaleString'), 'Pricing: Formats Dakshina with Indian numbering');
assert(detailCode.includes('All-inclusive Shastric Vidhi'), 'Pricing: Clarifies all-inclusive Vidhi');
assert(detailCode.includes('Book Homa Ceremony'), 'Conversion: Prominent Book Homa Ceremony CTA');
assert(detailCode.includes('/yagya-puja/homa/${service.slug}/book'), 'Conversion: CTA routes to single-page booking wizard');
assert(detailCode.includes('Initiated Vedic Purohits & Acharyas'), 'Assurance: Displays Vedic Purohits trust highlight');
assert(detailCode.includes('Verified Shastric Samagri Included'), 'Assurance: Displays Shastric Samagri trust highlight');
assert(detailCode.includes('Gotra & Nakshatra Sankalpa Guaranteed'), 'Assurance: Displays Sankalpa guarantee');

// 5. Pandit Qualifications & Agni Sankalpa Coordinates (Phase 5)
assert(detailCode.includes('Prescribed Pandit Qualifications'), 'Pandit/Sankalpa: Displays Prescribed Pandit Qualifications header');
assert(detailCode.includes('Agni Sankalpa Coordinates'), 'Pandit/Sankalpa: Displays Agni Sankalpa Coordinates header');
assert(detailCode.includes('Yajamana Full Name'), 'Pandit/Sankalpa: Displays Yajamana Full Name coordinate');
assert(detailCode.includes('Vedic Gotra'), 'Pandit/Sankalpa: Displays Vedic Gotra coordinate');
assert(detailCode.includes('Janma Nakshatra'), 'Pandit/Sankalpa: Displays Janma Nakshatra coordinate');
assert(detailCode.includes('Specific Prayer Intention'), 'Pandit/Sankalpa: Displays Specific Prayer Intention coordinate');

// 6. Sacred Samagri Specifications (Phase 6)
const samagriPath = path.join(basePath, 'components/HomaSamagriSection.jsx');
assert(fs.existsSync(samagriPath), 'Samagri: HomaSamagriSection.jsx exists');
const samagriCode = fs.readFileSync(samagriPath, 'utf8');

assert(samagriCode.includes('Included in Every Ceremony'), 'Samagri Group 1: Included in Every Ceremony');
assert(samagriCode.includes('Ceremony-Specific Offerings'), 'Samagri Group 2: Ceremony-Specific Offerings');
assert(samagriCode.includes('Additional / As Configured'), 'Samagri Group 3: Additional / As Configured');
assert(samagriCode.includes('Arranged by Veda Structure / Not Required from Devotee'), 'Samagri Group 4: Arranged by Veda Structure / Not Required from Devotee');
assert(samagriCode.includes('homaSamagriBannerImg'), 'Samagri: Large authentic Homa Samagri landscape banner visual');

// 7. Related Homa Ceremonies (Phase 7)
assert(detailCode.includes('mode="related"'), 'Related: Passes mode="related" to HomaServiceCard');
assert(detailCode.includes('h.slug !== service.slug'), 'Related: Excludes current service from recommendations');

const cardPath = path.join(basePath, 'components/HomaServiceCard.jsx');
const cardCode = fs.readFileSync(cardPath, 'utf8');
assert(cardCode.includes('mode === "related"'), 'Card: Supports mode="related"');
assert(cardCode.includes('Explore Ceremony'), 'Card (Related): Uses single full-width Explore Ceremony CTA');
assert(!cardCode.includes('Book Ceremony') || cardCode.includes('mode === "related"'), 'Card: Correctly distinguishes related card with single CTA');

// 8. Mobile Sticky Bottom Booking Bar (Phase 8 & 9)
assert(detailCode.includes('lg:hidden fixed bottom-0'), 'Mobile: Fixed sticky bottom booking bar implemented');
assert(detailCode.includes('Book Ceremony'), 'Mobile: Sticky bar has direct Book Ceremony button');

// 9. Technical & Gallery Resilience (Phase 1 & 10)
const servicePath = path.join(basePath, '../../services/homaCatalogueService.js');
const serviceCode = fs.readFileSync(servicePath, 'utf8');
assert(serviceCode.includes('getHomaServiceGallery'), 'Service: Implements getHomaServiceGallery helper');
assert(serviceCode.includes('navagrahaRitualShowcaseImg'), 'Service: Curates Navagraha gallery visual');
assert(serviceCode.includes('cleanGallery'), 'Service: Filters unresolvable gallery image assets');

console.log('\n========================================');
console.log(`TOTAL PASSED: ${passed}`);
console.log(`TOTAL FAILED: ${failed}`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}

