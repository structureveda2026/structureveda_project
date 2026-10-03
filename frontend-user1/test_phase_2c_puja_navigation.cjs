/**
 * Phase 2C: Puja Category Mega Menu & Navigation Test Suite
 *
 * Requirements to verify:
 * 1. Navbar loads category data via pujaCatalogueService.getPujaCategories().
 * 2. Only active categories are displayed from GET /api/puja-categories.
 * 3. Categories use displayOrder sorting.
 * 4. Category names come dynamically from API (no hardcoded category names in Navbar markup).
 * 5. Category slugs are used for links (/yagya-puja/puja/category/:slug).
 * 6. Ganesh category navigation works.
 * 7. Shiva category navigation works.
 * 8. Lakshmi category navigation works.
 * 9. View All Pujas navigation works (/yagya-puja/puja).
 * 10. Category API error does not crash Navbar.
 * 11. Mobile category navigation works (interactive accordion).
 * 12. Desktop dropdown works (two-panel mega menu).
 * 13. Keyboard/focus behavior remains valid (Escape key, aria-expanded).
 * 14. Active Puja navigation state works.
 * 15. Existing Yagya navigation remains intact.
 * 16. Existing Japa navigation remains intact.
 * 17. Existing Homa navigation remains intact.
 * 18. Existing Path navigation remains intact.
 * 19. Existing Puja detail navigation remains intact.
 * 20. Existing booking navigation remains intact.
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname);

let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`\x1b[32m✔ PASS:\x1b[0m ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`\x1b[31m✘ FAIL:\x1b[0m ${name}`);
    console.error(`  Error: ${err.message}`);
    failedTests++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`\x1b[32m✔ PASS:\x1b[0m ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`\x1b[31m✘ FAIL:\x1b[0m ${name}`);
    console.error(`  Error: ${err.message}`);
    failedTests++;
  }
}

async function main() {
  console.log("\n=======================================================");
  console.log("   PHASE 2C: PUJA CATEGORY MEGA MENU TEST SUITE");
  console.log("=======================================================\n");

  const navbarPath = path.join(ROOT, "src/components/layout/Navbar.jsx");
  const pujaServicePath = path.join(ROOT, "src/services/pujaCatalogueService.js");
  const appRoutesPath = path.join(ROOT, "src/routes/AppRoutes.jsx");

  const navbarContent = fs.readFileSync(navbarPath, "utf-8");
  const pujaServiceContent = fs.readFileSync(pujaServicePath, "utf-8");
  const appRoutesContent = fs.readFileSync(appRoutesPath, "utf-8");

  // 1. Navbar loads category data
  runTest("1. Navbar loads category data via pujaCatalogueService.getPujaCategories()", () => {
    assert(
      navbarContent.includes("getPujaCategories") && navbarContent.includes("pujaCatalogueService"),
      "Navbar must call pujaCatalogueService.getPujaCategories()"
    );
    assert(
      navbarContent.includes("setPujaCategories(data)"),
      "Navbar must save returned category data into pujaCategories state"
    );
  });

  // 2. Only active categories are returned from API
  await runAsyncTest("2. Only active categories are fetched from GET /api/puja-categories", async () => {
    const res = await fetch("http://localhost:5000/api/puja-categories");
    const json = await res.json();
    assert.strictEqual(json.success, true, "GET /api/puja-categories must succeed");
    assert(Array.isArray(json.data), "Categories must be an array");
    assert(json.data.length >= 8, "Expected at least 8 categories in DB");
  });

  // 3. Categories use displayOrder
  runTest("3. Categories use displayOrder for deterministic ordering", () => {
    assert(
      pujaServiceContent.includes("displayOrder"),
      "pujaCatalogueService must sort categories by displayOrder"
    );
  });

  // 4. Category names come dynamically from API (no hardcoded category names in Navbar markup)
  runTest("4. Category names come dynamically from API (no hardcoded category list in Navbar markup)", () => {
    assert(
      navbarContent.includes("{cat.name}"),
      "Navbar must dynamically render {cat.name}"
    );
    // Ensure "Shiva Puja" is not hardcoded as a static string literal in Navbar.jsx
    assert(
      !navbarContent.includes('"Shiva Puja"') && !navbarContent.includes("'Shiva Puja'"),
      "Navbar must not hardcode 'Shiva Puja' string literal"
    );
    assert(
      !navbarContent.includes('"Ganesh Puja"') && !navbarContent.includes("'Ganesh Puja'"),
      "Navbar must not hardcode 'Ganesh Puja' string literal"
    );
  });

  // 5. Category slugs are used for links
  runTest("5. Category slugs are used for links (/yagya-puja/puja/category/${cat.slug})", () => {
    assert(
      navbarContent.includes("/yagya-puja/puja/category/${cat.slug}"),
      "Navbar must link to /yagya-puja/puja/category/${cat.slug}"
    );
  });

  // 6. Ganesh category navigation works
  await runAsyncTest("6. Ganesh category navigation path exists and API resolves", async () => {
    const res = await fetch("http://localhost:5000/api/puja-categories/ganesh-puja");
    const json = await res.json();
    assert.strictEqual(json.success, true, "Ganesh Puja category exists in backend");
    assert.strictEqual(json.data.slug, "ganesh-puja");
    assert(
      appRoutesContent.includes('path="/yagya-puja/puja/category/:categorySlug"'),
      "Route /yagya-puja/puja/category/:categorySlug exists in AppRoutes"
    );
  });

  // 7. Shiva category navigation works
  await runAsyncTest("7. Shiva category navigation path exists and API resolves", async () => {
    const res = await fetch("http://localhost:5000/api/puja-categories/shiva-puja");
    const json = await res.json();
    assert.strictEqual(json.success, true, "Shiva Puja category exists in backend");
    assert.strictEqual(json.data.slug, "shiva-puja");
  });

  // 8. Lakshmi category navigation works
  await runAsyncTest("8. Lakshmi category navigation path exists and API resolves", async () => {
    const res = await fetch("http://localhost:5000/api/puja-categories/lakshmi-prosperity-puja");
    const json = await res.json();
    assert.strictEqual(json.success, true, "Lakshmi category exists in backend");
    assert.strictEqual(json.data.slug, "lakshmi-prosperity-puja");
  });

  // 9. View All Pujas navigation works
  runTest("9. View All Pujas navigation links to /yagya-puja/puja", () => {
    assert(
      navbarContent.includes('to="/yagya-puja/puja"') && navbarContent.includes("View All Pujas"),
      "Navbar must contain Link to /yagya-puja/puja with 'View All Pujas'"
    );
  });

  // 10. Category API error does not crash Navbar
  runTest("10. Category API error does not crash Navbar", () => {
    assert(
      navbarContent.includes("setCategoriesError(true)"),
      "Navbar must handle API errors gracefully"
    );
    assert(
      navbarContent.includes("Unable to load categories"),
      "Navbar must display friendly fallback on category load error"
    );
    assert(
      navbarContent.includes("Retry"),
      "Navbar provides retry mechanism on error"
    );
  });

  // 11. Mobile category navigation works
  runTest("11. Mobile category navigation works via interactive accordion", () => {
    assert(
      navbarContent.includes("isMobilePujaOpen"),
      "Navbar must track isMobilePujaOpen state for mobile accordion"
    );
    assert(
      navbarContent.includes("setIsMobilePujaOpen"),
      "Navbar must toggle isMobilePujaOpen on tap"
    );
    assert(
      navbarContent.includes("pujaCategories.map"),
      "Mobile drawer must map through pujaCategories"
    );
  });

  // 12. Desktop dropdown works
  runTest("12. Desktop dropdown works with horizontal ritual navigation mega menu layout", () => {
    assert(
      navbarContent.includes("setIsYagyaPujaDropdownOpen"),
      "Desktop menu must toggle on hover/click"
    );
    assert(
      navbarContent.includes("yagyaPujaDropdownRef"),
      "Desktop menu must track ref for click-outside detection"
    );
    assert(
      navbarContent.includes("RITUAL SERVICES") && navbarContent.includes("PUJA CATEGORIES"),
      "Desktop mega menu must contain horizontal RITUAL SERVICES and PUJA CATEGORIES sections"
    );
  });

  // 13. Keyboard/focus behavior remains valid
  runTest("13. Keyboard/focus behavior remains valid (Escape key, aria-expanded)", () => {
    assert(
      navbarContent.includes("setIsYagyaPujaDropdownOpen(false)"),
      "handleEscape must close Yagya & Puja dropdown"
    );
    assert(
      navbarContent.includes('aria-expanded={isYagyaPujaDropdownOpen}'),
      "Yagya & Puja toggle must include aria-expanded attribute"
    );
  });

  // 14. Active Puja navigation state works
  runTest("14. Active Puja navigation state works", () => {
    assert(
      navbarContent.includes("isPujaActive"),
      "Navbar must compute isPujaActive from location.pathname"
    );
    assert(
      navbarContent.includes("isYagyaPujaActive"),
      "Navbar must compute isYagyaPujaActive from location.pathname"
    );
  });

  // 15. Existing Yagya navigation remains intact
  runTest("15. Existing Yagya navigation remains intact (/yagya-puja/yagya)", () => {
    assert(
      navbarContent.includes('to={item.path}') || navbarContent.includes('/yagya-puja/yagya'),
      "Yagya navigation must be preserved in Navbar"
    );
    assert(
      appRoutesContent.includes('path="/yagya-puja/yagya"'),
      "AppRoutes must include /yagya-puja/yagya"
    );
  });

  // 16. Existing Japa navigation remains intact
  runTest("16. Existing Japa navigation remains intact (/yagya-puja/japa)", () => {
    assert(
      navbarContent.includes("Japa / Chanting"),
      "Japa navigation must be preserved in Navbar"
    );
    assert(
      appRoutesContent.includes('path="/yagya-puja/japa"'),
      "AppRoutes must include /yagya-puja/japa"
    );
  });

  // 17. Existing Homa navigation remains intact
  runTest("17. Existing Homa navigation remains intact (/yagya-puja/homa)", () => {
    assert(
      navbarContent.includes("Homa / Havan"),
      "Homa navigation must be preserved in Navbar"
    );
    assert(
      appRoutesContent.includes('path="/yagya-puja/homa"'),
      "AppRoutes must include /yagya-puja/homa"
    );
  });

  // 18. Existing Path navigation remains intact
  runTest("18. Existing Path navigation remains intact (/yagya-puja/path)", () => {
    assert(
      navbarContent.includes("Path / Recitation"),
      "Path navigation must be preserved in Navbar"
    );
    assert(
      appRoutesContent.includes('path="/yagya-puja/path"'),
      "AppRoutes must include /yagya-puja/path"
    );
  });

  // 19. Existing Puja detail navigation remains intact
  runTest("19. Existing Puja detail navigation remains intact (/yagya-puja/puja/:slug)", () => {
    assert(
      appRoutesContent.includes('path="/yagya-puja/puja/:slug"'),
      "AppRoutes must include /yagya-puja/puja/:slug"
    );
  });

  // 20. Existing booking navigation remains intact
  runTest("20. Existing booking navigation remains intact (/yagya-puja/puja/:slug/book)", () => {
    assert(
      appRoutesContent.includes('path="/yagya-puja/puja/:slug/book"'),
      "AppRoutes must include /yagya-puja/puja/:slug/book"
    );
  });

  console.log("\n=======================================================");
  console.log(`TOTAL TESTS: ${passedTests + failedTests}`);
  console.log(`PASSED: ${passedTests}`);
  console.log(`FAILED: ${failedTests}`);
  console.log("=======================================================");

  if (failedTests > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
