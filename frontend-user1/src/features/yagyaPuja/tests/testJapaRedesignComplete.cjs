const fs = require("fs");
const path = require("path");
const assert = require("assert");

console.log("================================================================");
console.log("VEDA STRUCTURE: JAPA COMPLETE REDESIGN VERIFICATION SUITE");
console.log("================================================================");

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}`);
    failed++;
  }
}

// 1. Image Resolution and Mapping
runTest("1.1 japaCatalogueService.js has isUnresolvableAsset handling", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../../../services/japaCatalogueService.js"),
    "utf8"
  );
  assert(file.includes("export const isUnresolvableAsset"), "Missing isUnresolvableAsset export");
  assert(file.includes("isViteHashed"), "Missing Vite hashed asset check");
  assert(file.includes("resolveJapaImage"), "Missing resolveJapaImage export");
});

runTest("1.2 SLUG_IMAGE_MAP covers all 8 canonical database slugs", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../../../services/japaCatalogueService.js"),
    "utf8"
  );
  const requiredSlugs = [
    "maha-mrityunjaya-japa",
    "navagraha-mantra-japa",
    "gayatri-mantra-japa",
    "durga-saptashati-mantra-japa",
    "hanuman-mantra-japa",
    "ganapati-atharvashirsha-japa",
    "maha-lakshmi-shri-suktam-japa",
    "shiva-panchakshari-japa",
  ];
  for (const s of requiredSlugs) {
    assert(file.includes(`"${s}":`), `Missing canonical slug mapping for ${s}`);
  }
});

runTest("1.3 JapaServiceCard has onError handler and warm ivory background", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../components/JapaServiceCard.jsx"),
    "utf8"
  );
  assert(file.includes("onError={handleImageError}"), "Missing onError handler on image");
  assert(!file.includes("bg-[#241a12]"), "Opaque black background bg-[#241a12] must be eliminated");
  assert(file.includes("bg-[#f5ecd9]"), "Must use warm ivory/sand image container background");
});

runTest("1.4 JapaCategoryCard has onError handler and deityHanumanImg", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../components/JapaCategoryCard.jsx"),
    "utf8"
  );
  assert(file.includes("onError="), "Missing onError on category card image");
  assert(file.includes("deityHanumanImg"), "Missing deityHanumanImg in category card");
});

// 2. Section Consolidation in JapaCatalogueListing.jsx
runTest("2.1 JapaCatalogueListing.jsx renders the 7 consolidated sections (Catalogue removed)", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../pages/JapaCatalogueListing.jsx"),
    "utf8"
  );
  const expectedComponents = [
    "<JapaHero",
    "<JapaCategorySection",
    "<JapaAnushthanPlanner",
    "<JapaParticipationSection",
    "<JapaArrangementsSection",
    "<JapaJourneySection",
    "<JapaFAQAndCTA",
  ];
  for (const comp of expectedComponents) {
    assert(file.includes(comp), `Missing consolidated section: ${comp}`);
  }
  assert(!file.includes("<JapaCatalogueSection"), "JapaCatalogueSection must NOT be rendered");
});

runTest("2.2 Obsolete bloated sections and catalogue are completely removed", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../pages/JapaCatalogueListing.jsx"),
    "utf8"
  );
  const obsoleteComponents = [
    "<JapaCatalogueSection",
    "<JapaConceptSection",
    "<JapaScheduleSection",
    "<JapaPanditTeamSection",
    "<JapaProcessSection",
    "<JapaWorkflowSection",
    "<JapaPopularSection",
    "<JapaConfigurationPreview",
  ];
  for (const comp of obsoleteComponents) {
    assert(!file.includes(comp), `Obsolete component ${comp} should not be rendered`);
  }
});

// 3. Section 01: Hero Redesign (Full Background Image, Left-Aligned Content, No Split Image Card)
runTest("3.1 JapaHero has full background image and eliminated split image card", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../components/japa/JapaHero.jsx"),
    "utf8"
  );
  assert(file.includes("heroBgImg") && file.includes("<img"), "Missing full background image element");
  assert(file.includes("absolute inset-0 z-0"), "Background image must fill hero");
  assert(!file.includes("aspect-[4/3]"), "Split side image card with aspect-[4/3] must be eliminated");
  assert(!file.includes("border-[#d4af37]/25 rounded-2xl"), "Old side card styling must be eliminated");
});

runTest("3.2 JapaHero has eyebrow, headline, search, dual CTAs, and verified highlights", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../components/japa/JapaHero.jsx"),
    "utf8"
  );
  assert(file.includes("Begin Your Sacred") && file.includes("Mantra Japa") && file.includes("With Sankalpa"), "Headline mismatch");
  assert(file.includes("VEDIC JAPA • MANTRA • SANKALPA"), "Eyebrow mismatch");
  assert(file.includes("onSubmit={handleSubmit}"), "Hero search form must handle submit");
  assert(file.includes("Explore Japa Catalogue"), "Missing primary catalogue CTA");
  assert(file.includes("Talk to a Vedic Expert"), "Missing expert consultation CTA");
  assert(file.includes("Anushthan Counts (11k - 1.25L)"), "Missing count highlight");
  assert(file.includes("Synchronized Purohit Team"), "Missing purohit team highlight");
  assert(file.includes("Personalized Gotra Sankalpa"), "Missing sankalpa highlight");
});

// 4. Section 02: Restored Category Discovery & View All Categories
runTest("4.1 JapaCategorySection previews categories in responsive 3-col grid and has View All link", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../components/japa/JapaCategorySection.jsx"),
    "utf8"
  );
  assert(file.includes("limit = 6") && file.includes("categories.slice(0, limit)"), "Category section must preview 6 categories by default");
  assert(file.includes("md:grid-cols-2 lg:grid-cols-3"), "Must use responsive 3-col grid");
  assert(file.includes("/yagya-puja/japa/categories"), "Must link to /yagya-puja/japa/categories");
  assert(file.includes("View All Japa Categories"), "Missing 'View All Japa Categories' button text");
  assert(file.includes("Consecrated Japa Categories"), "Missing category counter bar heading");
});

runTest("4.2 AppRoutes.jsx has both /yagya-puja/japa/categories and /all mapped", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../../../routes/AppRoutes.jsx"),
    "utf8"
  );
  assert(file.includes('path="/yagya-puja/japa/categories"'), "Missing /yagya-puja/japa/categories route");
  assert(file.includes('path="/yagya-puja/japa/all"'), "Missing /yagya-puja/japa/all route");
  assert(file.includes('path="/yagya-puja/japa/category/:categorySlug"'), "Missing category slug route");
});

runTest("4.3 JapaCategoryCard routes to /yagya-puja/japa/category/:slug", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../components/JapaCategoryCard.jsx"),
    "utf8"
  );
  assert(file.includes("/yagya-puja/japa/category/${category.slug}"), "Card must link to /yagya-puja/japa/category/:categorySlug");
});

// 5. Complete Removal of Catalogue Section
runTest("5.1 Vedic Mantra Japa Catalogue section and component are cleanly removed", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../pages/JapaCatalogueListing.jsx"),
    "utf8"
  );
  assert(!file.includes("Vedic Mantra Japa Catalogue"), "Catalogue title must not be on landing page");
  assert(!file.includes("JapaCatalogueSection"), "JapaCatalogueSection import/usage must be gone");
  const compPath = path.join(__dirname, "../components/japa/JapaCatalogueSection.jsx");
  assert(!fs.existsSync(compPath), "JapaCatalogueSection.jsx file should be removed");
});

// 6. Section 03: Premium Image-Integrated Anushthan Planner (Option 2 - Split Vedic Experience)
runTest("6.1 JapaAnushthanPlanner has 2-column image layout and authoritative calculations", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../components/japa/JapaAnushthanPlanner.jsx"),
    "utf8"
  );
  assert(file.includes("japa-anushthan-planner.jpg"), "Must import dedicated planner image");
  assert(file.includes("INTERACTIVE ANUSHTHAN PLANNER"), "Eyebrow mismatch");
  assert(file.includes("Calculate Your Sacred Japa Plan"), "Headline mismatch");
  assert(file.includes("Choose your Mantra Japa and prescribed recitation count"), "Description mismatch");
  assert(file.includes("lg:col-span-5"), "Must have 5-col image layout on desktop (approx 40%)");
  assert(file.includes("lg:col-span-7"), "Must have 7-col interactive controls layout on desktop (approx 60%)");
  assert(file.includes("Step 1: Choose Mantra Japa Ceremony"), "Missing Step 1 label");
  assert(file.includes("Step 2: Select Recitation Count"), "Missing Step 2 label");
  assert(file.includes("Step 3: Authoritative Breakdown & Inclusions"), "Missing Step 3 label");
  assert(file.includes("Book This Japa →"), "Missing Book This Japa CTA");
  assert(file.includes("/yagya-puja/japa/${selectedSlug}/book?count=${activeCount}"), "Planner CTA must pass selected count to /book");
  assert(file.includes("resolveJapaImage"), "Must resolve service thumbnails");
});

runTest("6.2 Option 2 Split Vedic Experience features authentic overlay and 3-column service grid", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../components/japa/JapaAnushthanPlanner.jsx"),
    "utf8"
  );
  assert(file.includes("Authentic Mantra Japa"), "Missing Authentic Mantra Japa heading in left panel");
  assert(file.includes("Disciplined recitation performed by qualified Vedic Purohits"), "Missing approved overlay description");
  assert(file.includes("Scriptural Method"), "Missing Scriptural Method highlight");
  assert(file.includes("Qualified Purohits"), "Missing Qualified Purohits highlight");
  assert(file.includes("Kashi Kshetra"), "Missing Kashi Kshetra highlight");
  assert(file.includes("Remote Sankalpa"), "Missing Remote Sankalpa highlight");
  assert(file.includes("lg:grid-cols-3"), "Must have 3 columns for service selection on desktop");
  assert(file.includes("divide-x"), "Must use subtle column dividers in summary");
});

// 7. Section 05: Participation Modes
runTest("7.1 JapaParticipationSection compares Kashi and Remote modes without unsupported claims", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../components/japa/JapaParticipationSection.jsx"),
    "utf8"
  );
  assert(file.includes("Kashi Kshetra (Varanasi)"), "Missing Kashi section");
  assert(file.includes("Remote Sankalpa (Worldwide)"), "Missing Remote section");
});

// 8. Section 06 & 07: Inclusions & Journey
runTest("8.1 JapaJourneySection defines 4 clean milestones", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../components/japa/JapaJourneySection.jsx"),
    "utf8"
  );
  assert(file.includes("Sankalpa Pronouncement"), "Missing Step 1");
  assert(file.includes("Synchronized Chanting"), "Missing Step 2");
  assert(file.includes("Purnahuti & Havan"), "Missing Step 3");
  assert(file.includes("Completion & Prasad"), "Missing Step 4");
});

// 9. Section 08: FAQ & CTA
runTest("9.1 JapaFAQAndCTA has accordion and restrained closing CTA", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../components/japa/JapaFAQAndCTA.jsx"),
    "utf8"
  );
  assert(file.includes("Questions About Vedic Mantra Japa"), "Missing FAQ title");
  assert(file.includes("Begin Your Mantra Japa With Sankalpa"), "Missing CTA headline");
  assert(file.includes("Explore All Japa Ceremonies"), "Missing CTA action");
});

// 10. Service Details Consistency
runTest("10.1 JapaServiceDetails has slide error handling and no black background", () => {
  const file = fs.readFileSync(
    path.join(__dirname, "../pages/JapaServiceDetails.jsx"),
    "utf8"
  );
  assert(file.includes("onError="), "Missing onError handler on detail hero image");
  assert(!file.includes("bg-[#22170f]"), "Black background bg-[#22170f] must be eliminated");
  assert(file.includes("getJapaServiceGallery"), "Must use getJapaServiceGallery");
  assert(file.includes("relatedServices"), "Must use dynamic relatedServices");
});

console.log("================================================================");
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log("================================================================");

if (failed > 0) {
  process.exit(1);
}

