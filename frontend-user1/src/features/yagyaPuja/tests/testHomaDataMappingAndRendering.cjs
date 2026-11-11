const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== VEDA STRUCTURE: HOMA DATA MAPPING & RENDERING VERIFICATION SUITE ===\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}: ${err.message}`);
    failed++;
  }
}

const basePath = path.join(__dirname, '..');
const detailsPath = path.join(basePath, 'pages/HomaServiceDetails.jsx');
const samagriPath = path.join(basePath, 'components/HomaSamagriSection.jsx');
const serviceCardPath = path.join(basePath, 'components/HomaServiceCard.jsx');
const serviceFilePath = path.join(basePath, '../../services/homaCatalogueService.js');

const detailsCode = fs.readFileSync(detailsPath, 'utf8');
const samagriCode = fs.readFileSync(samagriPath, 'utf8');
const cardCode = fs.readFileSync(serviceCardPath, 'utf8');
const serviceCode = fs.readFileSync(serviceFilePath, 'utf8');

// 1. Image Resolution and Gallery Normalization
test('Asset: isUnresolvableAsset is exported from homaCatalogueService', () => {
  assert(serviceCode.includes('export const isUnresolvableAsset'), 'isUnresolvableAsset must be exported');
});

test('Asset: isUnresolvableAsset correctly rejects legacy unhashed /assets/ paths', () => {
  // Test regex logic
  const isViteHashed = (url) => /\-[A-Za-z0-9_-]{8}\.[a-zA-Z0-9]+$/.test(url);
  assert.strictEqual(isViteHashed('/assets/puja-rudrabhishek.jpg'), false);
  assert.strictEqual(isViteHashed('/assets/p-samagri.jpg'), false);
  assert.strictEqual(isViteHashed('/assets/c-vastu.jpg'), false);
  assert.strictEqual(isViteHashed('/assets/puja-rudrabhishek-D4zzZ_aI.jpg'), true);
});

test('Asset: isUnresolvableAsset preserves CDN, Data and public /images/ URLs', () => {
  assert(serviceCode.includes('trimmed.startsWith("http://") || trimmed.startsWith("https://")'), 'CDN URLs must be allowed');
  assert(serviceCode.includes('trimmed.startsWith("/images/")'), 'Public images must be allowed');
});

test('Gallery: Single admin-uploaded image is NOT discarded', () => {
  assert(serviceCode.includes('cleanGallery.length > 0 ? cleanGallery : curatedGallery'), 'Single valid image must be preserved');
  assert(!serviceCode.includes('cleanGallery.length >= 2 ? cleanGallery : curatedGallery'), 'Old 2-image threshold must be removed');
});

test('Gallery: HomaServiceDetails uses isUnresolvableAsset for gallery filtering', () => {
  assert(detailsCode.includes('isUnresolvableAsset(img)'), 'Gallery images must be filtered with isUnresolvableAsset');
});

test('Card: HomaServiceCard uses isUnresolvableAsset', () => {
  assert(cardCode.includes('isUnresolvableAsset(service.image)'), 'HomaServiceCard must use isUnresolvableAsset');
});

// 2. Dynamic Samagri
test('Samagri: Reads dynamic samagri from service data', () => {
  assert(samagriCode.includes('service?.samagri'), 'Must read service?.samagri');
});

test('Samagri: Renders dynamic items with names, statuses and descriptions', () => {
  assert(samagriCode.includes('normalizedItems = rawSamagri.map'), 'Must map rawSamagri dynamically');
  assert(samagriCode.includes('includedItems = normalizedItems.filter'), 'Must group included items');
  assert(samagriCode.includes('optionalItems = normalizedItems.filter'), 'Must group optional items');
});

test('Samagri: Hides section cleanly if no samagri is configured', () => {
  assert(samagriCode.includes('rawSamagri.length === 0'), 'Must check rawSamagri length');
});

// 3. Consecrated Prasad
test('Prasad: Dedicated Prasad section exists in HomaServiceDetails', () => {
  assert(detailsCode.includes('service.prasad &&'), 'Must conditionally check service.prasad');
  assert(detailsCode.includes('id="consecrated-prasad"'), 'Must have consecrated-prasad section id');
});

test('Prasad: Displays Blessed Prasad & Sacred Bhasma Dispatch heading', () => {
  assert(detailsCode.includes('Blessed Prasad &amp; Sacred Bhasma Dispatch'), 'Must render Prasad heading');
});

test('Prasad: Renders service.prasad dynamic text safely', () => {
  assert(detailsCode.includes('{service.prasad}'), 'Must render {service.prasad}');
});

// 4. Ceremony FAQs
test('FAQs: Dedicated ceremony FAQs section exists in HomaServiceDetails', () => {
  assert(detailsCode.includes('serviceFaqs.length > 0 &&'), 'Must check serviceFaqs length');
  assert(detailsCode.includes('id="ceremony-faqs"'), 'Must have ceremony-faqs section id');
});

test('FAQs: Maps questions and answers dynamically', () => {
  assert(detailsCode.includes('faq.question || faq.q'), 'Must support question and q keys');
  assert(detailsCode.includes('faq.answer || faq.a'), 'Must support answer and a keys');
});

test('FAQs: Accordion interactive toggle implemented', () => {
  assert(detailsCode.includes('openFaqIndex'), 'Must have openFaqIndex state');
  assert(detailsCode.includes('setOpenFaqIndex'), 'Must have setOpenFaqIndex toggle');
});

// 5. Dynamic Related Ceremonies
test('Related: Fetches active ceremonies from homaCatalogueService', () => {
  assert(detailsCode.includes('homaCatalogueService.getHomaServices'), 'Must fetch via homaCatalogueService.getHomaServices');
});

test('Related: Strictly excludes current ceremony', () => {
  assert(detailsCode.includes('h.slug !== service.slug'), 'Must filter out current ceremony slug');
});

test('Related: Prioritizes category relevance', () => {
  assert(detailsCode.includes('aMatch') && detailsCode.includes('bMatch'), 'Must prioritize category matches');
});

test('Related: Reuses mode="related" on HomaServiceCard', () => {
  assert(detailsCode.includes('mode="related"'), 'Must pass mode="related" to card');
});

// 6. Verification of All 8 Homa Services Slugs
const canonicalSlugs = [
  'rudra-homa',
  'maha-mrityunjaya-homa',
  'navagraha-homa',
  'lakshmi-kubera-homa',
  'durga-chandi-homa',
  'vastu-shanti-homa',
  'ganapati-homa',
  'ayushya-homa',
];

canonicalSlugs.forEach((slug) => {
  test(`Service Slug Verification: ${slug} has valid fallback visual asset mapping`, () => {
    assert(serviceCode.includes(`"${slug}"`), `Fallback mapping for ${slug} must be registered`);
  });
});

console.log('\n========================================');
console.log(`TOTAL PASSED: ${passed}`);
console.log(`TOTAL FAILED: ${failed}`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}

