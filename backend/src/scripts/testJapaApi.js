import assert from "node:assert";
import http from "node:http";
import app from "../app.js";
import db, { JapaService } from "../models/index.js";

const runTests = async () => {
  console.log("==================================================");
  console.log("STARTING JAPA PHASE J1 & REGRESSION TEST SUITE");
  console.log("==================================================");

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Test server listening on ${baseUrl}\n`);

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    Error: ${err.message}`);
      failed++;
    }
  };

  // Test 1: Health endpoint check
  await test("17. Existing health endpoint still works (GET /api/health)", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.message, "Veda Structure API is running");
  });

  // Test 2: GET /api/japa-services returns 200
  await test("1. GET /api/japa-services returns 200", async () => {
    const res = await fetch(`${baseUrl}/api/japa-services`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  // Test 3: Returns the seeded 8 active Japa services
  await test("2. Returns the seeded 8 active Japa services", async () => {
    const res = await fetch(`${baseUrl}/api/japa-services`);
    const body = await res.json();
    assert.strictEqual(body.count, 8);
    assert.strictEqual(body.total, 8);
    assert.strictEqual(Array.isArray(body.data), true);
    assert.strictEqual(body.data.length, 8);
  });

  // Test 4: GET /api/japa-services/purposes returns 200
  await test("3. GET /api/japa-services/purposes returns 200", async () => {
    const res = await fetch(`${baseUrl}/api/japa-services/purposes`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  // Test 5: Returns the 6 seeded purposes
  await test("4. Returns the 6 seeded purposes", async () => {
    const res = await fetch(`${baseUrl}/api/japa-services/purposes`);
    const body = await res.json();
    assert.strictEqual(body.count, 6);
    assert.strictEqual(Array.isArray(body.data), true);
    assert.strictEqual(body.data.length, 6);
    const slugs = body.data.map((p) => p.slug);
    assert.ok(slugs.includes("spiritual-practice"));
    assert.ok(slugs.includes("shanti-wellbeing"));
    assert.ok(slugs.includes("graha-shanti"));
    assert.ok(slugs.includes("protection"));
    assert.ok(slugs.includes("prosperity"));
    assert.ok(slugs.includes("special-sankalpa"));
  });

  // Test 6: GET /api/japa-services/maha-mrityunjaya-japa returns 200
  await test("5. GET /api/japa-services/maha-mrityunjaya-japa returns 200", async () => {
    const res = await fetch(`${baseUrl}/api/japa-services/maha-mrityunjaya-japa`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.slug, "maha-mrityunjaya-japa");
    assert.strictEqual(body.data.name, "Maha Mrityunjaya Japa");
  });

  // Test 7: Returned service contains all key architectural fields
  await test("6. Returned service contains mantra, availableCounts, variants, capacities, and pricing", async () => {
    const res = await fetch(`${baseUrl}/api/japa-services/maha-mrityunjaya-japa`);
    const body = await res.json();
    const service = body.data;

    assert.ok(service.mantra && service.mantra.includes("त्र्यम्बकं"), "Mantra text missing");
    assert.ok(Array.isArray(service.availableCounts) && service.availableCounts.length >= 3, "Available counts missing");
    assert.ok(Array.isArray(service.variants) && service.variants.length >= 3, "Variants missing");
    assert.strictEqual(typeof service.dailyCapacityPerPandit, "number");
    assert.ok(service.dailyCapacityPerPandit > 0, "Daily capacity per pandit must be positive");
    assert.strictEqual(typeof service.minimumPandits, "number");
    assert.strictEqual(typeof service.recommendedPandits, "number");
    assert.strictEqual(typeof service.maximumPandits, "number");
    assert.strictEqual(typeof service.startingPrice, "number");
    assert.ok(service.startingPrice > 0, "Starting price must be positive");
    assert.ok(service.purposeDetails != null, "Purpose details association should be present");
  });

  // Test 8: Unknown slug returns 404
  await test("7. Unknown slug returns 404", async () => {
    const res = await fetch(`${baseUrl}/api/japa-services/non-existent-japa-slug`);
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.message, "Japa service not found");
  });

  // Test 9: Inactive services are excluded from public listing
  await test("8. Inactive services are excluded from public listing", async () => {
    // Temporarily create an inactive service
    const inactiveService = await JapaService.create({
      name: "Temporary Inactive Japa",
      slug: "temp-inactive-japa-test",
      mantra: "ॐ तत् सत्",
      startingPrice: 5000,
      isActive: false,
      availableCounts: [11000],
      variants: [],
      dailyCapacityPerPandit: 2000,
    });

    try {
      const resListing = await fetch(`${baseUrl}/api/japa-services`);
      const bodyListing = await resListing.json();
      const foundInListing = bodyListing.data.find((s) => s.slug === "temp-inactive-japa-test");
      assert.strictEqual(foundInListing, undefined, "Inactive service must not appear in listing");

      const resDetail = await fetch(`${baseUrl}/api/japa-services/temp-inactive-japa-test`);
      assert.strictEqual(resDetail.status, 404, "Inactive service detail must return 404");
    } finally {
      await inactiveService.destroy();
    }
  });

  // Test 10: Search works (case-insensitive across fields)
  await test("9. Search works (case-insensitive across name, mantra, and description)", async () => {
    const res = await fetch(`${baseUrl}/api/japa-services?search=mrityunjaya`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(body.count >= 1, "Search should return at least 1 match");
    assert.ok(body.data.some((s) => s.slug === "maha-mrityunjaya-japa"));

    const resHindi = await fetch(`${baseUrl}/api/japa-services?search=%E0%A4%A4%E0%A5%8D%E0%A4%B0%E0%A5%8D%E0%A4%AF%E0%A4%AE%E0%A5%8D%E0%A4%AC%E0%A4%95%E0%A4%82`);
    assert.strictEqual(resHindi.status, 200);
    const bodyHindi = await resHindi.json();
    assert.ok(bodyHindi.count >= 1, "Hindi Devanagari search should return at least 1 match");
  });

  // Test 11: Purpose filter works
  await test("10. Purpose filter works", async () => {
    const res = await fetch(`${baseUrl}/api/japa-services?purpose=protection`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(body.count >= 1, "Purpose filter should return matching records");
    for (const item of body.data) {
      const inCat = item.purposeCategory === "protection";
      const inCats = Array.isArray(item.purposeCategories) && item.purposeCategories.includes("protection");
      assert.ok(inCat || inCats, `Service ${item.slug} must match purpose protection`);
    }
  });

  // Test 12: Count filter works
  await test("11. Count filter works", async () => {
    const res = await fetch(`${baseUrl}/api/japa-services?count=125000`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(body.count >= 1, "Count filter should return services supporting 1,25,000");
    for (const item of body.data) {
      assert.ok(item.availableCounts.includes(125000), `Service ${item.slug} must support 125000 count`);
    }
  });

  // Test 13: Featured filter works
  await test("12. Featured filter works", async () => {
    const res = await fetch(`${baseUrl}/api/japa-services?isFeatured=true`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(body.count >= 1, "Featured filter should return featured items");
    for (const item of body.data) {
      assert.strictEqual(item.isFeatured, true);
    }
  });

  // Test 14: Pagination works
  await test("13. Pagination works", async () => {
    const res = await fetch(`${baseUrl}/api/japa-services?page=1&limit=3`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.count, 3);
    assert.strictEqual(body.page, 1);
    assert.strictEqual(body.limit, 3);
    assert.strictEqual(body.totalPages, Math.ceil(8 / 3));
  });

  // Test 15: Existing Puja API still works
  await test("14. Existing Puja API still works (GET /api/puja-services)", async () => {
    const res = await fetch(`${baseUrl}/api/puja-services`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data) && body.data.length > 0, "Puja services should return data");
  });

  // Test 16: Existing Yagya API still works
  await test("15. Existing Yagya API still works (GET /api/yagya-services)", async () => {
    const res = await fetch(`${baseUrl}/api/yagya-services`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data) && body.data.length > 0, "Yagya services should return data");
  });

  // Test 17: Existing Upcoming Puja API still works
  await test("16. Existing Upcoming Puja API still works (GET /api/upcoming-pujas)", async () => {
    const res = await fetch(`${baseUrl}/api/upcoming-pujas`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  server.close();

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
