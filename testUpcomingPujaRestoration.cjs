const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('UPCOMING PUJA RESTORATION & REGRESSION VERIFICATION TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✓ [PASS] ${description}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${description}: ${err.message}`);
    failCount++;
  }
}

// File paths
const frontendDir = path.join(__dirname, 'frontend-user1');
const pujaListingPath = path.join(frontendDir, 'src/features/puja/pages/PujaListing.jsx');
const pujaHeroPath = path.join(frontendDir, 'src/features/puja/components/PujaListingHero.jsx');
const pujaCardPath = path.join(frontendDir, 'src/features/puja/components/PujaCard.jsx');
const pujaFiltersPath = path.join(frontendDir, 'src/features/puja/components/PujaFilters.jsx');
const pujaDataPath = path.join(frontendDir, 'src/features/puja/data/pujaData.js');
const upcomingServicePath = path.join(frontendDir, 'src/services/upcomingPujaService.js');
const appRoutesPath = path.join(frontendDir, 'src/routes/AppRoutes.jsx');
const navbarPath = path.join(frontendDir, 'src/components/layout/Navbar.jsx');

// Section 1: PujaListing.jsx Architecture & Integrity
console.log('[Section 1: Upcoming Puja Listing Architecture]');
test('1.1 PujaListing.jsx exists and loads successfully', () => {
  assert(fs.existsSync(pujaListingPath), 'PujaListing.jsx must exist');
});

const pujaListingContent = fs.readFileSync(pujaListingPath, 'utf8');

test('1.2 PujaListing imports PUJA_LIST from pujaData', () => {
  assert(pujaListingContent.includes('import { PUJA_LIST } from "../data/pujaData"'), 'Must import PUJA_LIST');
});

test('1.3 PujaListing imports PujaCard, PujaFilters, PujaListingHero', () => {
  assert(pujaListingContent.includes('import PujaCard from "../components/PujaCard"'), 'Must import PujaCard');
  assert(pujaListingContent.includes('import PujaFilters from "../components/PujaFilters"'), 'Must import PujaFilters');
  assert(pujaListingContent.includes('import PujaListingHero from "../components/PujaListingHero"'), 'Must import PujaListingHero');
});

test('1.4 PujaListing does NOT import UpcomingPujaKashiSpecial (Isolated from Kashi)', () => {
  assert(!pujaListingContent.includes('UpcomingPujaKashiSpecial'), 'UpcomingPujaKashiSpecial must NOT be present in Upcoming Puja');
});

test('1.5 PujaListing implements previous multi-facet filter controls', () => {
  assert(pujaListingContent.includes('selectedLocation'), 'Must support location filter');
  assert(pujaListingContent.includes('selectedDeity'), 'Must support deity filter');
  assert(pujaListingContent.includes('selectedPurpose'), 'Must support purpose filter');
  assert(pujaListingContent.includes('selectedSort'), 'Must support sorting');
});

test('1.6 PujaListing renders results counter and PujaCard grid', () => {
  assert(pujaListingContent.includes('upcoming sacred rituals'), 'Must render counter text');
  assert(pujaListingContent.includes('<PujaCard key={puja.id} puja={puja} />'), 'Must render PujaCard items');
});

// Section 2: PujaListingHero Restoration
console.log('\n[Section 2: Puja Listing Hero Restoration]');
test('2.1 PujaListingHero.jsx exists', () => {
  assert(fs.existsSync(pujaHeroPath), 'PujaListingHero.jsx must exist');
});

const pujaHeroContent = fs.readFileSync(pujaHeroPath, 'utf8');

test('2.2 Hero displays authentic Upcoming Sacred Puja & Yagya heading', () => {
  assert(pujaHeroContent.includes('Upcoming Sacred'), 'Heading must contain Upcoming Sacred');
  assert(pujaHeroContent.includes('Puja & Yagya'), 'Heading must contain Puja & Yagya');
});

test('2.3 Hero eyebrow is restored to sacred Dhams and NOT Yagya & Puja in Kashi', () => {
  assert(pujaHeroContent.includes('Kashi Vishwanath • Sacred Dhams'), 'Eyebrow must be Kashi Vishwanath • Sacred Dhams');
  assert(!pujaHeroContent.includes('Yagya &amp; Puja in Kashi'), 'Must NOT have Yagya & Puja in Kashi as eyebrow');
});

test('2.4 Hero references transparent sacred artwork puja_hero1.png', () => {
  assert(pujaHeroContent.includes('puja_hero1.png'), 'Must import puja_hero1.png');
  const heroImgPath = path.join(frontendDir, 'src/assets/images/puja_hero1.png');
  assert(fs.existsSync(heroImgPath), 'puja_hero1.png asset must exist on disk');
});

test('2.5 Hero includes starting price block ₹1,100', () => {
  assert(pujaHeroContent.includes('startingPrice = "₹1,100"'), 'Starting price default must be ₹1,100');
  assert(pujaHeroContent.includes('Participation Starts At'), 'Must contain price label');
});

test('2.6 Hero has working Book Puja and View Puja Details actions scrolling to puja-list', () => {
  assert(pujaHeroContent.includes('handleScrollToPujas'), 'Must have handleScrollToPujas');
  assert(pujaHeroContent.includes('Book Puja'), 'Must have Book Puja button');
});

// Section 3: Data Source & Canonical Pujas
console.log('\n[Section 3: Canonical Upcoming Puja Data]');
test('3.1 pujaData.js contains authentic PUJA_LIST with 8 canonical rituals', () => {
  const pujaDataContent = fs.readFileSync(pujaDataPath, 'utf8');
  assert(pujaDataContent.includes('export const PUJA_LIST = ['), 'PUJA_LIST must be exported');
  assert(pujaDataContent.includes('"sawan-special-rudrabhishek"'), 'Sawan Rudrabhishek must exist');
  assert(pujaDataContent.includes('"mahashivratri-maha-rudrabhishek"'), 'Mahashivratri must exist');
  assert(pujaDataContent.includes('"navgrah-shanti-maha-yagya"'), 'Navgrah Shanti must exist');
  assert(pujaDataContent.includes('"mahalakshmi-dhan-prapti-yagya"'), 'Mahalakshmi must exist');
  assert(pujaDataContent.includes('"baglamukhi-shatru-vinashak-puja"'), 'Baglamukhi must exist');
  assert(pujaDataContent.includes('"kashi-ganga-aarti-special-puja"'), 'Kashi Ganga Aarti must exist');
  assert(pujaDataContent.includes('"maha-mrityunjaya-shanti-anushthan"'), 'Maha Mrityunjaya must exist');
  assert(pujaDataContent.includes('"satyanarayan-maha-puja"'), 'Satyanarayan must exist');
});

// Section 4: Service Resilience & Fallback
console.log('\n[Section 4: upcomingPujaService Resilience]');
test('4.1 upcomingPujaService imports PUJA_LIST fallback', () => {
  const serviceContent = fs.readFileSync(upcomingServicePath, 'utf8');
  assert(serviceContent.includes('import { PUJA_LIST, getPujaBySlug as getStaticPujaBySlug }'), 'Must import fallback');
});

test('4.2 getUpcomingPujas falls back to PUJA_LIST on empty or error', () => {
  const serviceContent = fs.readFileSync(upcomingServicePath, 'utf8');
  assert(serviceContent.includes('return PUJA_LIST'), 'Must return PUJA_LIST as fallback');
});

test('4.3 getUpcomingPujaBySlug falls back to getStaticPujaBySlug on null or error', () => {
  const serviceContent = fs.readFileSync(upcomingServicePath, 'utf8');
  assert(serviceContent.includes('return getStaticPujaBySlug(slug) || null'), 'Must return getStaticPujaBySlug as fallback');
});

// Section 5: Routes & Navigation Integrity
console.log('\n[Section 5: Routes & Navigation Integrity]');
const appRoutesContent = fs.readFileSync(appRoutesPath, 'utf8');

test('5.1 /puja routes to PujaListing', () => {
  assert(appRoutesContent.includes('path="/puja" element={<PujaListing />}'), 'Must route /puja to PujaListing');
});

test('5.2 /puja/upcoming routes to PujaListing', () => {
  assert(appRoutesContent.includes('path="/puja/upcoming" element={<PujaListing />}'), 'Must route /puja/upcoming to PujaListing');
});

test('5.3 /puja/upcoming/all routes to UpcomingPujaAll', () => {
  assert(appRoutesContent.includes('path="/puja/upcoming/all" element={<UpcomingPujaAll />}'), 'Must route /puja/upcoming/all to UpcomingPujaAll');
});

test('5.4 /puja/:slug routes to PujaDetails', () => {
  assert(appRoutesContent.includes('path="/puja/:slug" element={<PujaDetails />}'), 'Must route /puja/:slug to PujaDetails');
});

test('5.5 Completed catalogue routes remain intact (Puja, Yagya, Japa, Path, Homa)', () => {
  assert(appRoutesContent.includes('/yagya-puja/puja'), 'Puja catalogue intact');
  assert(appRoutesContent.includes('/yagya-puja/yagya'), 'Yagya catalogue intact');
  assert(appRoutesContent.includes('/yagya-puja/japa'), 'Japa catalogue intact');
  assert(appRoutesContent.includes('/yagya-puja/path'), 'Path catalogue intact');
  assert(appRoutesContent.includes('/yagya-puja/homa'), 'Homa catalogue intact');
});

test('5.6 Navbar links Upcoming Puja correctly', () => {
  const navbarContent = fs.readFileSync(navbarPath, 'utf8');
  assert(navbarContent.includes('to="/puja/upcoming"'), 'Navbar must link to /puja/upcoming');
});

// Summary
console.log('\n================================================================');
console.log(`TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
