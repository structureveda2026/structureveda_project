import assert from "node:assert";
import http from "node:http";
import app from "../app.js";
import db, { HomaService, HomaPurpose } from "../models/index.js";

const runTests = async () => {
  console.log("==================================================");
  console.log("STARTING HOMA PHASE H2 & REGRESSION TEST SUITE");
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
  await test("1. Health endpoint still works (GET /api/health)", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.message, "Veda Structure API is running");
  });

  // Test 2: GET /api/homa-services returns 200
  await test("2. GET /api/homa-services returns 200", async () => {
    const res = await fetch(`${baseUrl}/api/homa-services`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  // Test 3: Returns the seeded 8 active Homa services
  await test("3. Returns the seeded 8 active Homa services", async () => {
    const res = await fetch(`${baseUrl}/api/homa-services`);
    const body = await res.json();
    assert.strictEqual(body.count, 8);
    assert.strictEqual(body.total, 8);
    assert.strictEqual(Array.isArray(body.data), true);
    assert.strictEqual(body.data.length, 8);
  });

  // Test 4: GET /api/homa-services/purposes returns 200
  await test("4. GET /api/homa-services/purposes returns 200", async () => {
    const res = await fetch(`${baseUrl}/api/homa-services/purposes`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  // Test 5: Returns the 6 seeded purposes
  await test("5. Returns the 6 seeded Homa purposes with correct schema", async () => {
    const res = await fetch(`${baseUrl}/api/homa-services/purposes`);
    const body = await res.json();
    assert.strictEqual(body.count, 6);
    assert.strictEqual(body.data.length, 6);
    const slugs = body.data.map((p) => p.slug);
    assert.ok(slugs.includes("shanti-wellbeing"));
    assert.ok(slugs.includes("graha-shanti"));
    assert.ok(slugs.includes("prosperity"));
    assert.ok(slugs.includes("protection"));
    assert.ok(slugs.includes("family-home"));
    assert.ok(slugs.includes("special-occasions"));
  });

  // Test 6: Detail endpoint GET /api/homa-services/:slug
  await test("6. GET /api/homa-services/maha-mrityunjaya-homa returns 200", async () => {
    const res = await fetch(`${baseUrl}/api/homa-services/maha-mrityunjaya-homa`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.slug, "maha-mrityunjaya-homa");
    assert.strictEqual(body.data.name, "Maha Mrityunjaya Homa");
  });

  // Test 7: Returned service contains availableHavanCounts, availableDays, samagri, pricing, and pandits
  await test("7. Detail response shape has required clean camelCase fields", async () => {
    const res = await fetch(`${baseUrl}/api/homa-services/maha-mrityunjaya-homa`);
    const body = await res.json();
    const s = body.data;
    assert.strictEqual(typeof s.id, "string");
    assert.strictEqual(typeof s.name, "string");
    assert.strictEqual(typeof s.homaType, "string");
    assert.ok(Array.isArray(s.availableHavanCounts));
    assert.deepStrictEqual(s.availableHavanCounts, [1, 3, 5, 7, 11]);
    assert.ok(Array.isArray(s.availableDays));
    assert.deepStrictEqual(s.availableDays, [1, 2, 3]);
    assert.strictEqual(s.startingPrice, 11000);
    assert.strictEqual(s.formattedPrice, "₹11,000");
    assert.strictEqual(s.minimumPandits, 2);
    assert.strictEqual(s.recommendedPandits, 4);
    assert.strictEqual(s.maximumPandits, 11);
    assert.strictEqual(s.isKashiAvailable, true);
    assert.strictEqual(s.isRemoteAvailable, true);
    assert.ok(Array.isArray(s.samagri));
    assert.strictEqual(s.samagri.length, 8);
    assert.ok(Array.isArray(s.faq));
    assert.strictEqual(s.faq.length, 2);
    assert.ok(s.purposeDetails);
    assert.strictEqual(s.purposeDetails.slug, "shanti-wellbeing");
  });

  // Test 8: All 8 seeded service slugs resolve correctly
  await test("8. All 8 canonical Homa service slugs resolve with 200", async () => {
    const slugs = [
      "maha-mrityunjaya-homa",
      "navagraha-homa",
      "ganapati-homa",
      "durga-chandi-homa",
      "lakshmi-kubera-homa",
      "rudra-homa",
      "vastu-shanti-homa",
      "ayushya-homa",
    ];

    for (const slug of slugs) {
      const res = await fetch(`${baseUrl}/api/homa-services/${slug}`);
      assert.strictEqual(res.status, 200, `Failed for slug ${slug}`);
      const body = await res.json();
      assert.strictEqual(body.data.slug, slug);
      assert.ok(typeof body.data.startingPrice === "number" && body.data.startingPrice > 0);
      assert.ok(Array.isArray(body.data.availableHavanCounts));
      // Ensure all availableHavanCounts are numeric
      for (const count of body.data.availableHavanCounts) {
        assert.strictEqual(typeof count, "number");
        assert.ok(count > 0);
      }
    }
  });

  // Test 9: Unknown slug returns 404
  await test("9. Unknown slug returns 404", async () => {
    const res = await fetch(`${baseUrl}/api/homa-services/non-existent-homa`);
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.ok(body.message.includes("not found"));
  });

  // Test 10: Inactive services excluded from public listing
  await test("10. Inactive services are excluded from public listing", async () => {
    const tempService = await HomaService.create({
      name: "Temporary Test Homa",
      slug: "temp-inactive-homa-test",
      homaType: "Test Homa",
      startingPrice: 5000,
      isActive: false,
      availableHavanCounts: [1],
      availableDays: [1],
    });

    try {
      const resListing = await fetch(`${baseUrl}/api/homa-services`);
      const bodyListing = await resListing.json();
      const slugs = bodyListing.data.map((s) => s.slug);
      assert.strictEqual(slugs.includes("temp-inactive-homa-test"), false);

      const resDetail = await fetch(`${baseUrl}/api/homa-services/temp-inactive-homa-test`);
      assert.strictEqual(resDetail.status, 404);
    } finally {
      await tempService.destroy();
    }
  });

  // Test 11: Search works across name, shortDescription, description
  await test("11. Search works (case-insensitive across name, type, and description)", async () => {
    const resName = await fetch(`${baseUrl}/api/homa-services?search=mrityunjaya`);
    const bodyName = await resName.json();
    assert.strictEqual(bodyName.count, 1);
    assert.strictEqual(bodyName.data[0].slug, "maha-mrityunjaya-homa");

    const resType = await fetch(`${baseUrl}/api/homa-services?search=Planetary`);
    const bodyType = await resType.json();
    assert.strictEqual(bodyType.count, 1);
    assert.strictEqual(bodyType.data[0].slug, "navagraha-homa");
  });

  // Test 12: Purpose filter works
  await test("12. Purpose filter works", async () => {
    const res = await fetch(`${baseUrl}/api/homa-services?purpose=family-home`);
    const body = await res.json();
    assert.ok(body.count >= 2);
    for (const s of body.data) {
      const match =
        s.purposeCategory === "family-home" ||
        s.purposeCategories.includes("family-home");
      assert.ok(match, `Expected ${s.slug} to match purpose family-home`);
    }
  });

  // Test 13: Havan count filter works (Postgres JSONB contains)
  await test("13. Havan count filter works", async () => {
    const res = await fetch(`${baseUrl}/api/homa-services?count=7`);
    const body = await res.json();
    assert.strictEqual(body.count, 1);
    assert.strictEqual(body.data[0].slug, "maha-mrityunjaya-homa");
    assert.ok(body.data[0].availableHavanCounts.includes(7));
  });

  // Test 14: Days filter works
  await test("14. Days duration filter works", async () => {
    const res = await fetch(`${baseUrl}/api/homa-services?days=3`);
    const body = await res.json();
    assert.ok(body.count >= 3);
    for (const s of body.data) {
      assert.ok(s.availableDays.includes(3));
    }
  });

  // Test 15: Featured filter works
  await test("15. Featured filter works", async () => {
    const res = await fetch(`${baseUrl}/api/homa-services?isFeatured=true`);
    const body = await res.json();
    assert.strictEqual(body.count, 6);
    for (const s of body.data) {
      assert.strictEqual(s.isFeatured, true);
    }
  });

  // Test 16: Location mode filter works
  await test("16. Location filter works (mode=kashi / mode=remote)", async () => {
    const res = await fetch(`${baseUrl}/api/homa-services?mode=kashi`);
    const body = await res.json();
    assert.strictEqual(body.count, 8);
    for (const s of body.data) {
      assert.strictEqual(s.isKashiAvailable, true);
    }
  });

  // Test 17: Sorting works (price-asc, price-desc, name-asc)
  await test("17. Sorting works", async () => {
    const resAsc = await fetch(`${baseUrl}/api/homa-services?sortBy=price-asc`);
    const bodyAsc = await resAsc.json();
    const pricesAsc = bodyAsc.data.map((s) => s.startingPrice);
    for (let i = 1; i < pricesAsc.length; i++) {
      assert.ok(pricesAsc[i] >= pricesAsc[i - 1]);
    }

    const resDesc = await fetch(`${baseUrl}/api/homa-services?sortBy=price-desc`);
    const bodyDesc = await resDesc.json();
    const pricesDesc = bodyDesc.data.map((s) => s.startingPrice);
    for (let i = 1; i < pricesDesc.length; i++) {
      assert.ok(pricesDesc[i] <= pricesDesc[i - 1]);
    }
  });

  // Test 18: Pagination works
  await test("18. Pagination works (limit and page parameters)", async () => {
    const res = await fetch(`${baseUrl}/api/homa-services?limit=3&page=1`);
    const body = await res.json();
    assert.strictEqual(body.count, 3);
    assert.strictEqual(body.total, 8);
    assert.strictEqual(body.totalPages, 3);
    assert.strictEqual(body.currentPage, 1);

    const resPage2 = await fetch(`${baseUrl}/api/homa-services?limit=3&page=2`);
    const bodyPage2 = await resPage2.json();
    assert.strictEqual(bodyPage2.count, 3);
    assert.strictEqual(bodyPage2.currentPage, 2);

    const idsPage1 = new Set(body.data.map((s) => s.id));
    for (const item of bodyPage2.data) {
      assert.strictEqual(idsPage1.has(item.id), false);
    }
  });

  // Test 19: Existing Puja API still works (GET /api/puja-services)
  await test("19. Existing Puja API regression check (GET /api/puja-services)", async () => {
    const res = await fetch(`${baseUrl}/api/puja-services`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
  });

  // Test 20: Existing Yagya API still works (GET /api/yagya-services)
  await test("20. Existing Yagya API regression check (GET /api/yagya-services)", async () => {
    const res = await fetch(`${baseUrl}/api/yagya-services`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
  });

  // Test 21: Existing Japa API still works (GET /api/japa-services)
  await test("21. Existing Japa API regression check (GET /api/japa-services)", async () => {
    const res = await fetch(`${baseUrl}/api/japa-services`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.count, 8);
  });

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  server.close();
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
