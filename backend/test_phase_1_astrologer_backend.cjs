process.env.NODE_ENV = "test";

const http = require("http");
const assert = require("assert");

async function runTestSuite() {
  console.log("\n========================================================");
  console.log(" Veda Structure: Phase 1 Astrologer Backend Test Suite");
  console.log("========================================================\n");

  // 1. Dynamic imports for ESM modules
  const modelsMod = await import("./src/models/index.js");
  const { Astrologer, AstrologerPackage, Booking, db } = modelsMod;
  const appMod = await import("./src/app.js");
  const app = appMod.default;

  // 2. Start HTTP server on ephemeral port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`[PASS] Test HTTP server started on port ${port}`);

  const request = ({ method = "GET", path, body = null, headers = {} }) => {
    return new Promise((resolve, reject) => {
      const jsonBody = body ? JSON.stringify(body) : null;
      const reqHeaders = {
        "Content-Type": "application/json",
        ...headers,
      };
      if (jsonBody) {
        reqHeaders["Content-Length"] = Buffer.byteLength(jsonBody);
      }

      const req = http.request(
        `${baseUrl}${path}`,
        { method, headers: reqHeaders },
        (res) => {
          let rawData = "";
          res.on("data", (chunk) => {
            rawData += chunk;
          });
          res.on("end", () => {
            let parsed = null;
            try {
              parsed = JSON.parse(rawData);
            } catch {
              parsed = rawData;
            }
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: parsed,
            });
          });
        }
      );

      req.on("error", reject);
      if (jsonBody) req.write(jsonBody);
      req.end();
    });
  };

  try {
    // TEST 1: Model & Database Association Check
    console.log("\n[TEST 1] Verifying Astrologer & AstrologerPackage Models...");
    assert(Astrologer, "Astrologer model must be defined and exported");
    assert(AstrologerPackage, "AstrologerPackage model must be defined and exported");

    const astros = await Astrologer.findAll({
      where: { isActive: true },
      include: [{ model: AstrologerPackage, as: "packages" }],
    });
    assert(astros.length >= 2, `Expected at least 2 astrologers, got ${astros.length}`);
    const vishal = astros.find((a) => a.slug === "vishal-bhardwaj");
    const anurag = astros.find((a) => a.slug === "acharya-anurag-bhardwaj");
    assert(vishal, "Vishal Bhardwaj must exist in database");
    assert(anurag, "Acharya Anurag Bhardwaj must exist in database");
    assert(vishal.packages.length === 4, `Expected 4 packages for Vishal, got ${vishal.packages.length}`);
    assert(anurag.packages.length === 4, `Expected 4 packages for Anurag, got ${anurag.packages.length}`);
    console.log(" -> [PASS] Sequelize models & associations verified successfully.");

    // TEST 2: GET /api/astrologers (List Active)
    console.log("\n[TEST 2] Testing GET /api/astrologers...");
    const listRes = await request({ path: "/api/astrologers" });
    assert.strictEqual(listRes.statusCode, 200, "Status must be 200");
    assert.strictEqual(listRes.body.success, true, "Response success must be true");
    assert(Array.isArray(listRes.body.data), "data must be an array");
    assert(listRes.body.data.length >= 2, "Must return at least 2 active astrologers");

    const vishalSummary = listRes.body.data.find((a) => a.slug === "vishal-bhardwaj");
    assert(vishalSummary, "Vishal Bhardwaj must be in list");
    assert.strictEqual(vishalSummary.name, "Vishal Bhardwaj");
    assert.strictEqual(vishalSummary.code, "ast-vishal");
    assert(vishalSummary.startingPrice >= 1100, "Starting price should be calculated");
    assert.strictEqual(vishalSummary.packagesCount, 4, "Packages count should be 4");
    console.log(" -> [PASS] /api/astrologers returned active listings with correct schema.");

    // TEST 3: GET /api/astrologers/:slug (Detail)
    console.log("\n[TEST 3] Testing GET /api/astrologers/:slug for Vishal Bhardwaj...");
    const detailRes = await request({ path: "/api/astrologers/vishal-bhardwaj" });
    assert.strictEqual(detailRes.statusCode, 200, "Status must be 200");
    assert.strictEqual(detailRes.body.success, true, "Response success must be true");
    const detail = detailRes.body.data;
    assert.strictEqual(detail.slug, "vishal-bhardwaj");
    assert.strictEqual(detail.name, "Vishal Bhardwaj");
    assert(Array.isArray(detail.packages), "packages must be an array");
    assert.strictEqual(detail.packages.length, 4, "Must have 4 active packages");
    assert(Array.isArray(detail.bioParagraphs), "bioParagraphs must be an array");
    assert(Array.isArray(detail.availableTimeSlots), "availableTimeSlots must be an array");
    assert(typeof detail.addOnPricing === "object", "addOnPricing must be an object");
    console.log(" -> [PASS] Profile detail returned with rich profile fields & packages.");

    // TEST 4: GET /api/astrologers/:slug for Anurag
    console.log("\n[TEST 4] Testing GET /api/astrologers/:slug for Acharya Anurag Bhardwaj...");
    const anuragRes = await request({ path: "/api/astrologers/acharya-anurag-bhardwaj" });
    assert.strictEqual(anuragRes.statusCode, 200);
    assert.strictEqual(anuragRes.body.data.name, "Acharya Anurag Bhardwaj");
    assert.strictEqual(anuragRes.body.data.packages.length, 4);
    console.log(" -> [PASS] Anurag profile retrieved successfully.");

    // TEST 5: GET /api/astrologers/:slug with non-existent slug
    console.log("\n[TEST 5] Testing GET /api/astrologers/:slug for non-existent slug (404 check)...");
    const notFoundRes = await request({ path: "/api/astrologers/unknown-astrologer" });
    assert.strictEqual(notFoundRes.statusCode, 404);
    assert.strictEqual(notFoundRes.body.success, false);
    console.log(" -> [PASS] Correctly returned 404 for non-existent profile.");

    // TEST 6: GET /api/astrologers/:slug/packages
    console.log("\n[TEST 6] Testing GET /api/astrologers/:slug/packages...");
    const packagesRes = await request({ path: "/api/astrologers/vishal-bhardwaj/packages" });
    assert.strictEqual(packagesRes.statusCode, 200);
    assert.strictEqual(packagesRes.body.success, true);
    assert.strictEqual(packagesRes.body.count, 4);
    const keys = packagesRes.body.data.map((p) => p.packageKey);
    assert(keys.includes("essential"), "Must include essential package");
    assert(keys.includes("complete"), "Must include complete package");
    assert(keys.includes("premium"), "Must include premium package");
    assert(keys.includes("comprehensive"), "Must include comprehensive package");
    console.log(" -> [PASS] /packages endpoint returned all active consultation packages.");

    // TEST 7: GET /api/astrologers/:slug/slots
    console.log("\n[TEST 7] Testing GET /api/astrologers/:slug/slots...");
    const slotsRes = await request({ path: "/api/astrologers/vishal-bhardwaj/slots" });
    assert.strictEqual(slotsRes.statusCode, 200);
    assert.strictEqual(slotsRes.body.success, true);
    assert(Array.isArray(slotsRes.body.data.availableTimeSlots));
    console.log(" -> [PASS] /slots endpoint returned available consultation time slots.");

    // TEST 8: Baseline Booking Controller Protection
    console.log("\n[TEST 8] Verifying existing Booking Controller baseline is untouched...");
    const sampleBookingAttempt = await request({
      method: "POST",
      path: "/api/bookings",
      body: {
        // Omitting mandatory fields to verify validation response
        astrologerId: "ast-vishal",
      },
    });
    assert.strictEqual(sampleBookingAttempt.statusCode, 400);
    assert.strictEqual(sampleBookingAttempt.body.success, false);
    assert(
      sampleBookingAttempt.body.message.includes("Missing required booking details"),
      "Existing validation error message must match expected baseline"
    );
    console.log(" -> [PASS] Existing booking controller retains baseline validation intact.");

    console.log("\n========================================================");
    console.log(" ALL PHASE 1 BACKEND TESTS PASSED SUCCESSFULLY! (8/8)");
    console.log("========================================================\n");
    server.close();
    process.exit(0);
  } catch (err) {
    console.error("\n[FAIL] Test suite failed:", err);
    server.close();
    process.exit(1);
  }
}

runTestSuite();
