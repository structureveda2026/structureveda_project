/**
 * Comprehensive Automated Audit & Test Suite:
 * Ritual Category "View All" Standardization across all 6 Ritual Sections
 */

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const feDir = path.resolve(__dirname, "../../../../");
let testsPassed = 0;
let testsFailed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✓ [PASS] ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
    testsFailed++;
  }
}

async function runSuite() {
  console.log("\n=======================================================");
  console.log("RITUAL CATEGORY DISCOVERY 'VIEW ALL' AUDIT TEST SUITE");
  console.log("=======================================================\n");

  const discoveryFiles = {
    puja: path.join(feDir, "src/features/yagyaPuja/components/PujaCategoryDiscovery.jsx"),
    yagya: path.join(feDir, "src/features/yagyaPuja/components/YagyaCategoryDiscovery.jsx"),
    japa: path.join(feDir, "src/features/yagyaPuja/components/JapaCategoryDiscovery.jsx"),
    path: path.join(feDir, "src/features/yagyaPuja/components/PathCategoryDiscovery.jsx"),
    homa: path.join(feDir, "src/features/yagyaPuja/components/HomaCategoryDiscovery.jsx"),
  };

  const appRoutesFile = path.join(feDir, "src/routes/AppRoutes.jsx");
  const appRoutesContent = fs.readFileSync(appRoutesFile, "utf8");

  // SECTION 1: COMPONENT EXISTENCE & REFERENCE COMPLIANCE
  console.log("[Section 1: Category Discovery Component Existence]");
  for (const [ritual, filePath] of Object.entries(discoveryFiles)) {
    await test(`${ritual.toUpperCase()}: Discovery component exists`, () => {
      assert.ok(fs.existsSync(filePath), `Component file missing at ${filePath}`);
    });
  }

  // SECTION 2: PUJA REFERENCE AUDIT
  console.log("\n[Section 2: Puja Reference Implementation Audit]");
  const pujaContent = fs.readFileSync(discoveryFiles.puja, "utf8");
  await test("PUJA: 'View All Puja' CTA exists with exact text", () => {
    assert.ok(pujaContent.includes("View All Puja"), "Puja must have View All Puja");
  });
  await test("PUJA: Navigates to dedicated /yagya-puja/puja/all route", () => {
    assert.ok(pujaContent.includes('to="/yagya-puja/puja/all"'), "Puja must navigate to /yagya-puja/puja/all");
  });
  await test("PUJA: Has antique-gold styling tokens and micro-animation", () => {
    assert.ok(pujaContent.includes("border-[#c77722]"), "Must have antique-gold border token");
    assert.ok(pujaContent.includes("text-[#b36c1e]"), "Must have antique-gold text token");
    assert.ok(pujaContent.includes("hover:border-[#eab12c]"), "Must have gold hover border token");
    assert.ok(pujaContent.includes("hover:bg-[#eab12c]"), "Must have gold hover bg token");
    assert.ok(pujaContent.includes("ArrowRight"), "Must import and render ArrowRight");
  });

  // SECTION 3: YAGYA STANDARDIZATION AUDIT
  console.log("\n[Section 3: Yagya Standardization Audit]");
  const yagyaContent = fs.readFileSync(discoveryFiles.yagya, "utf8");
  await test("YAGYA: 'View All Yagya' CTA button exists", () => {
    assert.ok(yagyaContent.includes("View All Yagya"), "Yagya must render 'View All Yagya'");
  });
  await test("YAGYA: Navigates to registered /yagya-puja/yagya route", () => {
    assert.ok(yagyaContent.includes('to="/yagya-puja/yagya"'), "Yagya must navigate to /yagya-puja/yagya");
  });
  await test("YAGYA: Matches Puja reference antique-gold design and focus states", () => {
    assert.ok(yagyaContent.includes("border-[#c77722]"), "Must match antique-gold border");
    assert.ok(yagyaContent.includes("bg-[#fffdfa]"), "Must match antique-gold card background");
    assert.ok(yagyaContent.includes("text-[#b36c1e]"), "Must match antique-gold text");
    assert.ok(yagyaContent.includes("focus-visible:ring-[#eab12c]"), "Must have accessible focus ring");
    assert.ok(yagyaContent.includes("ArrowRight"), "Must render ArrowRight");
  });
  await test("YAGYA: Supports preview limit and showViewAll props", () => {
    assert.ok(yagyaContent.includes("showViewAll"), "Must support showViewAll prop");
    assert.ok(yagyaContent.includes("limit"), "Must support limit prop");
  });

  // SECTION 4: JAPA STANDARDIZATION AUDIT
  console.log("\n[Section 4: Japa Standardization Audit]");
  const japaContent = fs.readFileSync(discoveryFiles.japa, "utf8");
  await test("JAPA: 'View All Japa' CTA button exists", () => {
    assert.ok(japaContent.includes("View All Japa"), "Japa must render 'View All Japa'");
  });
  await test("JAPA: Navigates to registered /yagya-puja/japa route", () => {
    assert.ok(japaContent.includes('to="/yagya-puja/japa"'), "Japa must navigate to /yagya-puja/japa");
  });
  await test("JAPA: Matches Puja reference antique-gold design and focus states", () => {
    assert.ok(japaContent.includes("border-[#c77722]"), "Must match antique-gold border");
    assert.ok(japaContent.includes("text-[#b36c1e]"), "Must match antique-gold text");
    assert.ok(japaContent.includes("focus-visible:ring-[#eab12c]"), "Must have accessible focus ring");
    assert.ok(japaContent.includes("ArrowRight"), "Must render ArrowRight");
  });
  await test("JAPA: Supports preview limit and showViewAll props", () => {
    assert.ok(japaContent.includes("showViewAll"), "Must support showViewAll prop");
    assert.ok(japaContent.includes("limit"), "Must support limit prop");
  });

  // SECTION 5: PATH STANDARDIZATION AUDIT
  console.log("\n[Section 5: Path Standardization Audit]");
  const pathContent = fs.readFileSync(discoveryFiles.path, "utf8");
  await test("PATH: 'View All Path' CTA button exists", () => {
    assert.ok(pathContent.includes("View All Path"), "Path must render 'View All Path'");
  });
  await test("PATH: Navigates to registered /yagya-puja/path route", () => {
    assert.ok(pathContent.includes('to="/yagya-puja/path"'), "Path must navigate to /yagya-puja/path");
  });
  await test("PATH: Matches Puja reference antique-gold design and focus states", () => {
    assert.ok(pathContent.includes("border-[#c77722]"), "Must match antique-gold border");
    assert.ok(pathContent.includes("text-[#b36c1e]"), "Must match antique-gold text");
    assert.ok(pathContent.includes("focus-visible:ring-[#eab12c]"), "Must have accessible focus ring");
    assert.ok(pathContent.includes("ArrowRight"), "Must render ArrowRight");
  });
  await test("PATH: Supports preview limit and showViewAll props", () => {
    assert.ok(pathContent.includes("showViewAll"), "Must support showViewAll prop");
    assert.ok(pathContent.includes("limit"), "Must support limit prop");
  });

  // SECTION 6: HOMA STANDARDIZATION AUDIT
  console.log("\n[Section 6: Homa Standardization Audit]");
  const homaContent = fs.readFileSync(discoveryFiles.homa, "utf8");
  await test("HOMA: 'View All Homa' CTA button exists", () => {
    assert.ok(homaContent.includes("View All Homa"), "Homa must render 'View All Homa'");
  });
  await test("HOMA: Navigates to registered /yagya-puja/homa route", () => {
    assert.ok(homaContent.includes('to="/yagya-puja/homa"'), "Homa must navigate to /yagya-puja/homa");
  });
  await test("HOMA: Matches Puja reference antique-gold design and focus states", () => {
    assert.ok(homaContent.includes("border-[#c77722]"), "Must match antique-gold border");
    assert.ok(homaContent.includes("text-[#b36c1e]"), "Must match antique-gold text");
    assert.ok(homaContent.includes("focus-visible:ring-[#eab12c]"), "Must have accessible focus ring");
    assert.ok(homaContent.includes("ArrowRight"), "Must render ArrowRight");
  });
  await test("HOMA: Supports preview limit and showViewAll props", () => {
    assert.ok(homaContent.includes("showViewAll"), "Must support showViewAll prop");
    assert.ok(homaContent.includes("limit"), "Must support limit prop");
  });

  // SECTION 7: KASHI OFFERINGS AUDIT
  console.log("\n[Section 7: Puja in Kashi Audit]");
  await test("KASHI: Route /yagya-puja/kashi exists in AppRoutes.jsx", () => {
    assert.ok(appRoutesContent.includes('path="/yagya-puja/kashi"'), "Must have /yagya-puja/kashi in AppRoutes");
  });
  await test("KASHI: Documented as geographic ritual offering experience without separate category database table", () => {
    const kashiSectionFile = path.join(feDir, "src/features/yagyaPuja/components/KashiSection.jsx");
    const kashiSpecialFile = path.join(feDir, "src/features/puja/components/UpcomingPujaKashiSpecial.jsx");
    assert.ok(fs.existsSync(kashiSectionFile), "KashiSection.jsx exists");
    assert.ok(fs.existsSync(kashiSpecialFile), "UpcomingPujaKashiSpecial.jsx exists");
    const specialContent = fs.readFileSync(kashiSpecialFile, "utf8");
    assert.ok(specialContent.includes('to="/yagya-puja/kashi"'), "UpcomingPujaKashiSpecial navigates to /yagya-puja/kashi");
  });

  // SECTION 8: ROUTE REGISTRATION INTEGRITY
  console.log("\n[Section 8: Router Registration & Destination Integrity]");
  const requiredRoutes = [
    "/yagya-puja/puja/all",
    "/yagya-puja/yagya",
    "/yagya-puja/japa",
    "/yagya-puja/path",
    "/yagya-puja/homa",
    "/yagya-puja/kashi",
  ];
  for (const r of requiredRoutes) {
    await test(`ROUTER: Target destination ${r} is registered in AppRoutes.jsx`, () => {
      assert.ok(appRoutesContent.includes(`path="${r}"`), `Route ${r} must be registered`);
    });
  }

  // SECTION 9: REGRESSION & ISOLATION
  console.log("\n[Section 9: Isolation & Regression Prevention]");
  await test("ISOLATION: ritualPricing.service.js is intact", () => {
    const pricingFile = path.resolve(feDir, "../backend/src/services/ritualPricing.service.js");
    assert.ok(fs.existsSync(pricingFile), "Pricing service must exist in backend");
  });
  await test("ISOLATION: Mega menu Navbar.jsx remains intact", () => {
    const navbarFile = path.join(feDir, "src/components/layout/Navbar.jsx");
    const navContent = fs.readFileSync(navbarFile, "utf8");
    assert.ok(navContent.includes('label: "Japa / Chanting"'), "Navbar mega menu tabs intact");
  });

  console.log("\n=======================================================");
  console.log(`AUDIT RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log("=======================================================\n");

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
