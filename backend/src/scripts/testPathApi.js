import assert from "node:assert";
import http from "node:http";
import app from "../app.js";
import db, { PathService, PathPurpose } from "../models/index.js";

const runTests = async () => {
  console.log("==================================================");
  console.log("STARTING PATH PHASE P2 TEST SUITE");
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

  // Test 1: GET list returns 200
  await test("1. GET /api/path-services returns 200", async () => {
    const res = await fetch(`${baseUrl}/api/path-services`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  // Test 2: List returns exactly 8 active canonical services
  await test("2. List returns exactly 8 active canonical services", async () => {
    const res = await fetch(`${baseUrl}/api/path-services`);
    const body = await res.json();
    assert.strictEqual(body.count, 8);
    assert.strictEqual(body.total, 8);
    assert.strictEqual(Array.isArray(body.items || body.data), true);
    assert.strictEqual((body.items || body.data).length, 8);
  });

  // Test 3: GET /api/path-services/purposes returns 200
  await test("3. GET /api/path-services/purposes returns 200", async () => {
    const res = await fetch(`${baseUrl}/api/path-services/purposes`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  // Test 4: Purposes endpoint returns exactly 6 purposes
  await test("4. Purposes returns 6 canonical purposes with correct schema", async () => {
    const res = await fetch(`${baseUrl}/api/path-services/purposes`);
    const body = await res.json();
    const list = body.items || body.data;
    assert.strictEqual(body.count, 6);
    assert.strictEqual(list.length, 6);
    const slugs = list.map((p) => p.slug);
    assert.ok(slugs.includes("shanti-wellbeing"));
    assert.ok(slugs.includes("devotional-practice"));
    assert.ok(slugs.includes("family-sankalpa"));
    assert.ok(slugs.includes("auspicious-occasions"));
    assert.ok(slugs.includes("spiritual-anushthan"));
    assert.ok(slugs.includes("special-requirement"));
  });

  // Test 5: GET each of the 8 canonical slugs
  const canonicalSlugs = [
    "sundarkand-path",
    "durga-saptashati-path",
    "shrimad-bhagavad-gita-recitation",
    "ramcharitmanas-navah-parayan",
    "vishnu-sahasranama-purusha-suktam-path",
    "shiva-mahimna-rudri-path",
    "shri-suktam-kanakadhara-stotra-path",
    "aditya-hridaya-stotra-surya-path",
  ];

  await test("5. All 8 canonical Path slugs resolve individually with 200", async () => {
    for (const slug of canonicalSlugs) {
      const res = await fetch(`${baseUrl}/api/path-services/${slug}`);
      assert.strictEqual(res.status, 200, `Slug failed: ${slug}`);
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.strictEqual(body.data.slug, slug);
      assert.ok(body.data.name);
      assert.ok(body.data.scripture);
    }
  });

  // Test 6: Search filter
  await test("6. Server-side search filter works (search=Gita)", async () => {
    const res = await fetch(`${baseUrl}/api/path-services?search=Gita`);
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    const list = body.items || body.data;
    assert.ok(list.length >= 1);
    assert.ok(list.some((s) => s.slug === "shrimad-bhagavad-gita-recitation"));
  });

  // Test 7: Purpose filter
  await test("7. Server-side purpose filter works (purpose=spiritual-anushthan)", async () => {
    const res = await fetch(`${baseUrl}/api/path-services?purpose=spiritual-anushthan`);
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    const list = body.items || body.data;
    assert.ok(list.length >= 2);
    for (const s of list) {
      const matches =
        s.purposeCategory === "spiritual-anushthan" ||
        (Array.isArray(s.purposeCategories) && s.purposeCategories.includes("spiritual-anushthan"));
      assert.ok(matches, `Expected ${s.slug} to belong to spiritual-anushthan`);
    }
  });

  // Test 8: Format filter
  await test("8. Server-side format filter works (format=multi_day)", async () => {
    const res = await fetch(`${baseUrl}/api/path-services?format=multi_day`);
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    const list = body.items || body.data;
    assert.ok(list.length >= 2);
    for (const s of list) {
      assert.ok(
        s.availableFormats.includes("multi_day"),
        `Service ${s.slug} does not have multi_day format`
      );
    }
  });

  // Test 9: Duration / Day filter
  await test("9. Server-side duration/day filter works (days=9)", async () => {
    const res = await fetch(`${baseUrl}/api/path-services?days=9`);
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    const list = body.items || body.data;
    assert.ok(list.length >= 1);
    assert.ok(list.some((s) => s.slug === "ramcharitmanas-navah-parayan" || s.slug === "durga-saptashati-path"));
  });

  // Test 10: Mode filter
  await test("10. Server-side mode filter works (mode=kashi and mode=remote)", async () => {
    const resKashi = await fetch(`${baseUrl}/api/path-services?mode=kashi`);
    const bodyKashi = await resKashi.json();
    assert.strictEqual(resKashi.status, 200);
    const listKashi = bodyKashi.items || bodyKashi.data;
    assert.strictEqual(listKashi.length, 8);
    for (const s of listKashi) {
      assert.strictEqual(s.isKashiAvailable, true);
    }

    const resRemote = await fetch(`${baseUrl}/api/path-services?mode=remote`);
    const bodyRemote = await resRemote.json();
    assert.strictEqual(resRemote.status, 200);
    const listRemote = bodyRemote.items || bodyRemote.data;
    assert.strictEqual(listRemote.length, 8);
    for (const s of listRemote) {
      assert.strictEqual(s.isRemoteAvailable, true);
    }
  });

  // Test 11: Featured filter
  await test("11. Server-side featured filter works (isFeatured=true)", async () => {
    const res = await fetch(`${baseUrl}/api/path-services?isFeatured=true`);
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    const list = body.items || body.data;
    assert.ok(list.length > 0 && list.length < 8);
    for (const s of list) {
      assert.strictEqual(s.isFeatured, true);
    }
  });

  // Test 12: Sorting
  await test("12. Server-side sorting works (sortBy=price-asc and price-desc)", async () => {
    const resAsc = await fetch(`${baseUrl}/api/path-services?sortBy=price-asc`);
    const bodyAsc = await resAsc.json();
    const listAsc = bodyAsc.items || bodyAsc.data;
    for (let i = 0; i < listAsc.length - 1; i++) {
      assert.ok(listAsc[i].startingPrice <= listAsc[i + 1].startingPrice);
    }

    const resDesc = await fetch(`${baseUrl}/api/path-services?sortBy=price-desc`);
    const bodyDesc = await resDesc.json();
    const listDesc = bodyDesc.items || bodyDesc.data;
    for (let i = 0; i < listDesc.length - 1; i++) {
      assert.ok(listDesc[i].startingPrice >= listDesc[i + 1].startingPrice);
    }
  });

  // Test 13: Pagination
  await test("13. Server-side pagination works (page=1&limit=3 and page=2&limit=3)", async () => {
    const resP1 = await fetch(`${baseUrl}/api/path-services?page=1&limit=3`);
    const bodyP1 = await resP1.json();
    assert.strictEqual(resP1.status, 200);
    const listP1 = bodyP1.items || bodyP1.data;
    assert.strictEqual(listP1.length, 3);
    assert.strictEqual(bodyP1.pagination.page, 1);
    assert.strictEqual(bodyP1.pagination.limit, 3);
    assert.strictEqual(bodyP1.pagination.total, 8);
    assert.strictEqual(bodyP1.pagination.totalPages, 3);

    const resP2 = await fetch(`${baseUrl}/api/path-services?page=2&limit=3`);
    const bodyP2 = await resP2.json();
    const listP2 = bodyP2.items || bodyP2.data;
    assert.strictEqual(listP2.length, 3);
    assert.notStrictEqual(listP1[0].slug, listP2[0].slug);
  });

  // Test 14: Inactive service exclusion
  await test("14. Inactive services are excluded from public catalogue and detail", async () => {
    // Create a temporary inactive service
    const inactiveService = await PathService.create({
      slug: "temp-inactive-test-path",
      name: "Temporary Inactive Test Path",
      scripture: "Test Scripture",
      pathType: "Vedic Path",
      startingPrice: 1000,
      isActive: false,
    });

    try {
      const listRes = await fetch(`${baseUrl}/api/path-services`);
      const listBody = await listRes.json();
      const list = listBody.items || listBody.data;
      assert.strictEqual(list.some((s) => s.slug === "temp-inactive-test-path"), false);

      const detailRes = await fetch(`${baseUrl}/api/path-services/temp-inactive-test-path`);
      assert.strictEqual(detailRes.status, 404);
    } finally {
      await inactiveService.destroy();
    }
  });

  // Test 15: Response shape
  await test("15. Response shape contains both items/data and pagination metadata", async () => {
    const res = await fetch(`${baseUrl}/api/path-services`);
    const body = await res.json();
    assert.ok(body.items);
    assert.ok(body.data);
    assert.ok(body.pagination);
    assert.strictEqual(typeof body.pagination.total, "number");
    assert.strictEqual(typeof body.pagination.page, "number");
    assert.strictEqual(typeof body.pagination.limit, "number");
    assert.strictEqual(typeof body.pagination.totalPages, "number");
  });

  // Test 16: JSONB field shape
  await test("16. JSONB fields (availableFormats, availableDurations, samagri, sankalpaFields, seo, faqs) are valid structures", async () => {
    const res = await fetch(`${baseUrl}/api/path-services/sundarkand-path`);
    const body = await res.json();
    const s = body.data;
    assert.ok(Array.isArray(s.availableFormats));
    assert.ok(Array.isArray(s.availableDurations));
    assert.ok(Array.isArray(s.purposeCategories));
    assert.ok(Array.isArray(s.samagri));
    assert.ok(typeof s.sankalpaFields === "object" && s.sankalpaFields !== null);
    assert.ok(typeof s.seo === "object" && s.seo !== null);
    assert.ok(Array.isArray(s.faqs));
  });

  // Test 17: Numeric field types
  await test("17. Numeric fields remain properly typed numbers", async () => {
    const res = await fetch(`${baseUrl}/api/path-services/sundarkand-path`);
    const body = await res.json();
    const s = body.data;
    assert.strictEqual(typeof s.startingPrice, "number");
    assert.strictEqual(typeof s.totalChapters, "number");
    assert.strictEqual(typeof s.totalSections, "number");
    assert.strictEqual(typeof s.totalVerses, "number");
    assert.strictEqual(typeof s.estimatedRecitationHours, "number");
    assert.strictEqual(typeof s.minimumDays, "number");
    assert.strictEqual(typeof s.recommendedDays, "number");
    assert.strictEqual(typeof s.maximumDays, "number");
    assert.strictEqual(typeof s.minimumPandits, "number");
    assert.strictEqual(typeof s.recommendedPandits, "number");
    assert.strictEqual(typeof s.maximumPandits, "number");
  });

  // Test 18: No duplicate services in database
  await test("18. No duplicate services in database", async () => {
    const count = await PathService.count();
    assert.strictEqual(count, 8);
    const services = await PathService.findAll();
    const slugs = services.map((s) => s.slug);
    const uniqueSlugs = new Set(slugs);
    assert.strictEqual(slugs.length, uniqueSlugs.size);
  });

  // Test 19: No duplicate purposes in database
  await test("19. No duplicate purposes in database", async () => {
    const count = await PathPurpose.count();
    assert.strictEqual(count, 6);
    const purposes = await PathPurpose.findAll();
    const slugs = purposes.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    assert.strictEqual(slugs.length, uniqueSlugs.size);
  });

  // Test 20: Invalid slug returns 404
  await test("20. Invalid slug returns 404", async () => {
    const res = await fetch(`${baseUrl}/api/path-services/non-existent-path-service-12345`);
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.ok(body.message.includes("not found"));
  });

  // Close test server
  await new Promise((resolve) => server.close(resolve));

  console.log("\n==================================================");
  console.log(`PATH TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
};

runTests()
  .then(() => {
    console.log("Test suite finished successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Test suite runner crashed:", err);
    process.exit(1);
  });
