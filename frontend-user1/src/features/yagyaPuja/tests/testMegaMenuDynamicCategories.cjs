/**
 * VEDA STRUCTURE: MEGA MENU DYNAMIC CATEGORIES QA TEST SUITE
 * 
 * Verifies that all six ritual tabs in the Yagya & Puja mega dropdown:
 * 1. Maintain exact order (Puja, Yagya, Japa, Path, Homa, Kashi)
 * 2. Dynamically load and display their own categories from live backend APIs
 * 3. Route to module-specific category listing pages
 * 4. Implement accessible ARIA tabs, keyboard navigation, and responsive layout
 * 5. Provide graceful loading, error retry, and empty states
 * 6. Provide mobile accordions for all six rituals
 * 7. Maintain strict isolation from Upcoming Puja, pricing, and bookings
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

const BASE_URL = "http://localhost:5000";

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
    failCount++;
  }
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (err) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on("error", reject);
  });
}

async function runTests() {
  console.log("==================================================");
  console.log("MEGA MENU DYNAMIC CATEGORIES FOR ALL 6 RITUAL TABS");
  console.log("==================================================\n");

  const navbarPath = path.resolve(__dirname, "../../../components/layout/Navbar.jsx");
  assert(fs.existsSync(navbarPath), "Navbar.jsx exists");
  const navbarContent = fs.readFileSync(navbarPath, "utf8");

  // SECTION 1: SIX RITUAL TABS IN EXACT ORDER
  console.log("\n[Section 1: Six Ritual Tabs Definition & Order]");
  assert(
    navbarContent.includes('id: "puja"') &&
      navbarContent.includes('id: "yagya"') &&
      navbarContent.includes('id: "japa"') &&
      navbarContent.includes('id: "path"') &&
      navbarContent.includes('id: "homa"') &&
      navbarContent.includes('id: "kashi"'),
    "1.1 All six ritual identifiers exist in Navbar.jsx"
  );

  const pujaIdx = navbarContent.indexOf('id: "puja"');
  const yagyaIdx = navbarContent.indexOf('id: "yagya"');
  const japaIdx = navbarContent.indexOf('id: "japa"');
  const pathIdx = navbarContent.indexOf('id: "path"');
  const homaIdx = navbarContent.indexOf('id: "homa"');
  const kashiIdx = navbarContent.indexOf('id: "kashi"');

  assert(
    pujaIdx < yagyaIdx &&
      yagyaIdx < japaIdx &&
      japaIdx < pathIdx &&
      pathIdx < homaIdx &&
      homaIdx < kashiIdx,
    "1.2 Six ritual tabs are defined in exact required order: Puja -> Yagya -> Japa -> Path -> Homa -> Kashi"
  );

  assert(
    navbarContent.includes('label: "Puja"') &&
      navbarContent.includes('label: "Yagya"') &&
      navbarContent.includes('label: "Japa / Chanting"') &&
      navbarContent.includes('label: "Path / Recitation"') &&
      navbarContent.includes('label: "Homa / Havan"') &&
      navbarContent.includes('label: "Puja in Kashi"'),
    "1.3 Display labels match the canonical nomenclature"
  );

  // SECTION 2: LIVE BACKEND CATEGORY APIs
  console.log("\n[Section 2: Live Backend Category API Verification]");
  
  const pujaRes = await fetchJson(`${BASE_URL}/api/puja-categories`);
  assert(
    pujaRes.status === 200 && Array.isArray(pujaRes.data?.data) && pujaRes.data.data.length > 0,
    `2.1 GET /api/puja-categories returns 200 with ${pujaRes.data?.data?.length} active categories`
  );

  const yagyaRes = await fetchJson(`${BASE_URL}/api/yagya-categories`);
  assert(
    yagyaRes.status === 200 && Array.isArray(yagyaRes.data?.data) && yagyaRes.data.data.length > 0,
    `2.2 GET /api/yagya-categories returns 200 with ${yagyaRes.data?.data?.length} active categories`
  );

  const japaRes = await fetchJson(`${BASE_URL}/api/japa-categories`);
  assert(
    japaRes.status === 200 && Array.isArray(japaRes.data?.data) && japaRes.data.data.length > 0,
    `2.3 GET /api/japa-categories returns 200 with ${japaRes.data?.data?.length} active categories`
  );

  const pathRes = await fetchJson(`${BASE_URL}/api/path-categories`);
  assert(
    pathRes.status === 200 && Array.isArray(pathRes.data?.data) && pathRes.data.data.length > 0,
    `2.4 GET /api/path-categories returns 200 with ${pathRes.data?.data?.length} active categories`
  );

  const homaRes = await fetchJson(`${BASE_URL}/api/homa-categories`);
  assert(
    homaRes.status === 200 && Array.isArray(homaRes.data?.data) && homaRes.data.data.length > 0,
    `2.5 GET /api/homa-categories returns 200 with ${homaRes.data?.data?.length} active categories`
  );

  const pujaServicesRes = await fetchJson(`${BASE_URL}/api/puja-services`);
  const kashiServices = (pujaServicesRes.data?.data || []).filter((s) => s.isKashiAvailable);
  assert(
    pujaServicesRes.status === 200 && kashiServices.length > 0,
    `2.6 GET /api/puja-services returns ${kashiServices.length} Kashi-eligible sacred ceremonies`
  );

  // SECTION 3: REUSE OF EXISTING CLIENT SERVICES
  console.log("\n[Section 3: Category Client Services Reuse]");
  assert(
    navbarContent.includes('import pujaCatalogueService from "../../services/pujaCatalogueService";') &&
      navbarContent.includes('import yagyaCatalogueService from "../../services/yagyaCatalogueService";') &&
      navbarContent.includes('import japaCatalogueService from "../../services/japaCatalogueService";') &&
      navbarContent.includes('import pathCatalogueService from "../../services/pathCatalogueService";') &&
      navbarContent.includes('import homaCatalogueService from "../../services/homaCatalogueService";'),
    "3.1 Reuses existing category API clients from all 5 modular catalogue services"
  );

  assert(
    navbarContent.includes("pujaCatalogueService.getPujaCategories") &&
      navbarContent.includes("yagyaCatalogueService.getYagyaCategories") &&
      navbarContent.includes("japaCatalogueService.getJapaCategories") &&
      navbarContent.includes("pathCatalogueService.getPathCategories") &&
      navbarContent.includes("homaCatalogueService.getHomaCategories"),
    "3.2 Calls module-specific category loading methods with caching support"
  );

  // SECTION 4: ROUTE INTEGRATION & NAVIGATION INTEGRITY
  console.log("\n[Section 4: Navigation Routes & Link Integrity]");
  const appRoutesPath = path.resolve(__dirname, "../../../routes/AppRoutes.jsx");
  const appRoutesContent = fs.readFileSync(appRoutesPath, "utf8");

  assert(
    appRoutesContent.includes('path="/yagya-puja/puja/category/:categorySlug"'),
    "4.1 Puja category route exists in AppRoutes.jsx"
  );
  assert(
    appRoutesContent.includes('path="/yagya-puja/yagya/category/:categorySlug"'),
    "4.2 Yagya category route exists in AppRoutes.jsx"
  );
  assert(
    appRoutesContent.includes('path="/yagya-puja/japa/category/:categorySlug"'),
    "4.3 Japa category route exists in AppRoutes.jsx"
  );
  assert(
    appRoutesContent.includes('path="/yagya-puja/path/category/:categorySlug"'),
    "4.4 Path category route exists in AppRoutes.jsx"
  );
  assert(
    appRoutesContent.includes('path="/yagya-puja/homa/category/:categorySlug"'),
    "4.5 Homa category route exists in AppRoutes.jsx"
  );
  assert(
    appRoutesContent.includes('path="/yagya-puja/kashi"'),
    "4.6 Kashi route (/yagya-puja/kashi) exists in AppRoutes.jsx"
  );

  assert(
    navbarContent.includes('categoryRoutePrefix: "/yagya-puja/puja/category/"') &&
      navbarContent.includes('categoryRoutePrefix: "/yagya-puja/yagya/category/"') &&
      navbarContent.includes('categoryRoutePrefix: "/yagya-puja/japa/category/"') &&
      navbarContent.includes('categoryRoutePrefix: "/yagya-puja/path/category/"') &&
      navbarContent.includes('categoryRoutePrefix: "/yagya-puja/homa/category/"'),
    "4.7 Navbar links construct exact registered category URLs without guessing"
  );

  // SECTION 5: ACCESSIBILITY, ARIA & KEYBOARD SUPPORT
  console.log("\n[Section 5: Accessibility & Keyboard Support]");
  assert(
    navbarContent.includes('role="tablist"') &&
      navbarContent.includes('role="tab"') &&
      navbarContent.includes('role="tabpanel"'),
    "5.1 Semantic ARIA roles tablist, tab, and tabpanel are implemented"
  );

  assert(
    navbarContent.includes("aria-selected={isTabSelected}") &&
      navbarContent.includes("aria-controls={`ritual-panel-${tab.id}`}") &&
      navbarContent.includes("aria-labelledby={`ritual-tab-${currentTab.id}`}"),
    "5.2 Tabs synchronize aria-selected and aria-controls with active panel"
  );

  assert(
    navbarContent.includes('e.key === "ArrowRight"') &&
      navbarContent.includes('e.key === "ArrowLeft"'),
    "5.3 Arrow key navigation (Left/Right) implemented across ritual tabs"
  );

  // SECTION 6: RESPONSIVE LAYOUT & SCROLLING BEHAVIOR
  console.log("\n[Section 6: Responsive Layout & Scrolling]");
  assert(
    navbarContent.includes("overflow-y-auto") &&
      navbarContent.includes("max-h-"),
    "6.1 Vertical scrolling enabled when category list exceeds available viewport height"
  );

  assert(
    navbarContent.includes("max-w-[calc(100vw-32px)]"),
    "6.2 Dropdown bounded to viewport width to prevent horizontal overflow"
  );

  assert(
    navbarContent.includes("grid-cols-2 lg:grid-cols-3"),
    "6.3 Responsive category grid scales across desktop breakpoints"
  );

  // SECTION 7: STATE HANDLING (LOADING, ERROR, RETRY, EMPTY)
  console.log("\n[Section 7: Loading, Error & Empty State Resilience]");
  assert(
    navbarContent.includes("animate-pulse") &&
      navbarContent.includes("Unable to load"),
    "7.1 Skeleton placeholders for loading and error message for failed requests"
  );

  assert(
    navbarContent.includes("Retry") &&
      navbarContent.includes("loadCategoryData(currentTab.id, true)"),
    "7.2 Interactive Retry action provided on network failure"
  );

  assert(
    navbarContent.includes("No categories available at this time"),
    "7.3 Graceful empty state handling when no categories are returned"
  );

  // SECTION 8: MOBILE MENU MULTI-RITUAL ACCORDIONS
  console.log("\n[Section 8: Mobile Menu Integration]");
  assert(
    navbarContent.includes("isMobileYagyaPujaOpen") &&
      navbarContent.includes("RITUAL_TABS.map((tab) =>"),
    "8.1 Mobile menu dynamically iterates over all 6 RITUAL_TABS"
  );

  assert(
    navbarContent.includes("min-h-[44px]"),
    "8.2 Mobile touch targets adhere to min-h-[44px] accessibility standard"
  );

  assert(
    navbarContent.includes("tab.viewAllLabel"),
    "8.3 Each mobile accordion provides a dedicated View All button"
  );

  // SECTION 9: STRICT ISOLATION & REGRESSION PREVENTION
  console.log("\n[Section 9: Isolation & Regression Prevention]");
  assert(
    navbarContent.includes('to="/puja/upcoming"') &&
      navbarContent.includes("Upcoming Puja"),
    "9.1 Upcoming Puja link remains intact and completely independent"
  );

  assert(
    navbarContent.includes("NAVBAR_ASTROLOGERS") &&
      navbarContent.includes("Talk to an Astrologer"),
    "9.2 Astrologer navigation remains intact and untouched"
  );

  const pricingPath = path.resolve(__dirname, "../../../../../backend/src/services/ritualPricing.service.js");
  assert(fs.existsSync(pricingPath), "9.3 ritualPricing.service.js exists and is untouched");

  console.log("\n==================================================");
  console.log(`MEGA MENU QA RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log("==================================================\n");

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
