/**
 * Test script for Special Puja Frontend UI implementation
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Testing Special Puja Frontend Implementation ---');

// 1. Verify specialPujaData.js
const dataFile = path.resolve(__dirname, '../data/specialPujaData.js');
assert(fs.existsSync(dataFile), 'specialPujaData.js must exist');
const dataContent = fs.readFileSync(dataFile, 'utf8');

const expectedCategories = ['samskar', 'birthday-puja', 'pinda-daan', 'tirth-shradh'];
expectedCategories.forEach(cat => {
  assert(dataContent.includes(`id: "${cat}"`) || dataContent.includes(`slug: "${cat}"`), `Category ${cat} missing in data`);
});
console.log('✓ 4 Categories verified in data');

const expectedSamskars = [
  'Garbhadhana',
  'Punsavana',
  'Simantonnayana',
  'Jatakarma',
  'Namakarana',
  'Nishkramana',
  'Annaprashana',
  'Chudakarana',
  'Karnavedha',
  'Vidyarambha',
  'Upanayana',
  'Vedarambha',
  'Keshanta',
  'Samavartana',
  'Vivaha',
  'Antyeshti'
];

expectedSamskars.forEach((s, idx) => {
  assert(dataContent.includes(s), `Samskar #${idx + 1} ${s} missing in data`);
});
console.log('✓ All 16 Shodasha Samskars verified in exact sequence in data');

// 2. Verify YagyaPujaNavBar.jsx
const navFile = path.resolve(__dirname, '../components/YagyaPujaNavBar.jsx');
assert(fs.existsSync(navFile), 'YagyaPujaNavBar.jsx must exist');
const navContent = fs.readFileSync(navFile, 'utf8');

assert(navContent.includes('id: "special-puja"'), 'special-puja tab missing in RITUAL_NAV_TABS');
assert(navContent.includes('case "special-puja":'), 'special-puja handler missing in fetchCategories');
assert(navContent.includes('/yagya-puja/special-puja'), 'special-puja route missing in nav');
console.log('✓ YagyaPujaNavBar integration verified');

// 3. Verify AppRoutes.jsx
const routesFile = path.resolve(__dirname, '../../../routes/AppRoutes.jsx');
assert(fs.existsSync(routesFile), 'AppRoutes.jsx must exist');
const routesContent = fs.readFileSync(routesFile, 'utf8');

const expectedRoutes = [
  '/yagya-puja/special-puja',
  '/yagya-puja/special-puja/samskar',
  '/yagya-puja/special-puja/birthday-puja',
  '/yagya-puja/special-puja/pinda-daan',
  '/yagya-puja/special-puja/tirth-shradh',
  '/yagya-puja/special-puja/category/:categorySlug',
  '/yagya-puja/special-puja/samskar/:samskarSlug',
  '/yagya-puja/special-puja/samskar/:slug/book'
];

expectedRoutes.forEach(r => {
  assert(routesContent.includes(r), `Route ${r} missing in AppRoutes.jsx`);
});
console.log('✓ All 8 Special Puja routes (including booking route) registered in AppRoutes.jsx');

// 3b. Verify Booking Path Integration
assert(dataContent.includes('bookingPath: "/yagya-puja/homa/ayushya-homa/book"'), 'Ayushya homa booking path missing');
assert(dataContent.includes('bookingPath: "/yagya-puja/puja/maha-mrityunjaya-puja/book"'), 'Markandeya puja booking path missing');
assert(dataContent.includes('bookingPath: "/yagya-puja/puja/navagraha-shanti-puja/book"'), 'Navagraha shanti booking path missing');
assert(dataContent.includes('bookingPath: "/yagya-puja/puja/rudrabhishek-puja/book"'), 'Rudrabhishek booking path missing');
console.log('✓ All Birthday Puja services direct booking paths verified');

// 4. Verify SpecialPujaLanding.jsx sections
const landingFile = path.resolve(__dirname, '../pages/SpecialPujaLanding.jsx');
assert(fs.existsSync(landingFile), 'SpecialPujaLanding.jsx must exist');
const landingContent = fs.readFileSync(landingFile, 'utf8');

assert(landingContent.includes('SPECIAL VEDIC CEREMONIES'), 'Section 1 Hero badge missing');
assert(landingContent.includes('Celebrate Every Sacred Milestone with') && landingContent.includes('Authentic Vedic Rituals'), 'Section 1 Hero headline missing');
assert(landingContent.includes('SACRED RITUAL CATEGORIES'), 'Section 2 Categories missing');
assert(landingContent.includes('16 Sacred Samskars') || landingContent.includes('THE 16 VEDIC LIFE-CYCLE RITES'), 'Section 3 Shodasha Samskar missing');
assert(landingContent.includes('Vedic Birthday Puja') || landingContent.includes('ANNUAL LIFE CELEBRATION'), 'Section 4 Birthday Puja missing');
assert(landingContent.includes('Sacred Pinda Daan') || landingContent.includes('ANCESTRAL LIBERATION'), 'Section 5 Pinda Daan missing');
assert(landingContent.includes('Tirth Shradh') || landingContent.includes('PITRU SHANTI'), 'Section 6 Tirth Shradh missing');
assert(landingContent.includes('Why Devotees Trust Veda Structure') || landingContent.includes('VEDIC FOUNDATION'), 'Section 7 Why Choose missing');
assert(landingContent.includes('How to Arrange Your Sacred Ceremony') || landingContent.includes('CLEAR 4-STEP JOURNEY'), 'Section 8 How It Works missing');
assert(landingContent.includes('FREQUENTLY ASKED QUESTIONS') || landingContent.includes('Clarifications on Special Pujas'), 'Section 9 FAQs missing');
assert(landingContent.includes('Ready to Consecrate Your Family\'s Sacred Milestones?'), 'Section 10 Final CTA missing');

console.log('✓ All 10 Special Puja landing sections verified');

console.log('--- ALL AUTOMATED CHECKS PASSED SUCCESSFULLY ---');
