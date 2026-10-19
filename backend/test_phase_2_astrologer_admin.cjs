process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_here_min_32_chars";

const http = require("http");
const assert = require("assert");
const jwt = require("jsonwebtoken");

async function runPhase2TestSuite() {
  console.log("\n========================================================");
  console.log(" Veda Structure: Phase 2 Astrologer Admin Test Suite");
  console.log("========================================================\n");

  const modelsMod = await import("./src/models/index.js");
  const { Astrologer, AstrologerPackage } = modelsMod;
  const appMod = await import("./src/app.js");
  const app = appMod.default;

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`[PASS] Test HTTP server started on port ${port}`);

  // Helpers to generate tokens
  const adminToken = jwt.sign(
    { id: "11111111-1111-1111-1111-111111111111", email: "admin@vedastructure.com", role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const userToken = jwt.sign(
    { id: "22222222-2222-2222-2222-222222222222", email: "user@vedastructure.com", role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const request = ({ method = "GET", path, body = null, token = null }) => {
    return new Promise((resolve, reject) => {
      const jsonBody = body ? JSON.stringify(body) : null;
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      if (jsonBody) {
        headers["Content-Length"] = Buffer.byteLength(jsonBody);
      }

      const req = http.request(
        `${baseUrl}${path}`,
        { method, headers },
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
    // ----------------------------------------------------
    // TEST 1: Admin Authorization
    // ----------------------------------------------------
    console.log("\n[TEST 1] Admin Authorization on /api/admin/astrologers...");

    // 1.1 Missing token
    const resNoToken = await request({ path: "/api/admin/astrologers" });
    assert.strictEqual(resNoToken.statusCode, 401, "Expected 401 Unauthorized for missing token");
    assert.strictEqual(resNoToken.body.success, false);

    // 1.2 Invalid token
    const resInvalidToken = await request({ path: "/api/admin/astrologers", token: "invalid-token" });
    assert.strictEqual(resInvalidToken.statusCode, 401, "Expected 401 Unauthorized for invalid token");

    // 1.3 Non-admin role (user)
    const resUserToken = await request({ path: "/api/admin/astrologers", token: userToken });
    assert.strictEqual(resUserToken.statusCode, 403, "Expected 403 Forbidden for non-admin user");
    assert.strictEqual(resUserToken.body.success, false);

    // 1.4 Admin role
    const resAdminToken = await request({ path: "/api/admin/astrologers", token: adminToken });
    assert.strictEqual(resAdminToken.statusCode, 200, "Expected 200 OK for admin");
    assert.strictEqual(resAdminToken.body.success, true);
    console.log(" -> [PASS] Authorization correctly permits only verified admins.");

    // ----------------------------------------------------
    // TEST 2: Listing & Retrieval
    // ----------------------------------------------------
    console.log("\n[TEST 2] Profile Listing & Retrieval...");
    const listRes = await request({ path: "/api/admin/astrologers", token: adminToken });
    assert(Array.isArray(listRes.body.data), "data must be an array");
    assert(listRes.body.data.length >= 2, "Must list at least 2 astrologers");

    const vishalListing = listRes.body.data.find((a) => a.code === "ast-vishal");
    assert(vishalListing, "Vishal must exist in listing");
    const vishalId = vishalListing.id;

    // Search filter
    const searchRes = await request({ path: "/api/admin/astrologers?search=Vishal", token: adminToken });
    assert.strictEqual(searchRes.statusCode, 200);
    assert(searchRes.body.data.some((a) => a.code === "ast-vishal"), "Search should return Vishal");

    // Retrieval by ID
    const detailRes = await request({ path: `/api/admin/astrologers/${vishalId}`, token: adminToken });
    assert.strictEqual(detailRes.statusCode, 200);
    assert.strictEqual(detailRes.body.success, true);
    assert.strictEqual(detailRes.body.data.name, "Vishal Bhardwaj");
    assert(Array.isArray(detailRes.body.data.packages), "Packages must be included in admin detail");
    assert(Array.isArray(detailRes.body.data.availableTimeSlots));
    assert(Array.isArray(detailRes.body.data.pillars));
    assert(Array.isArray(detailRes.body.data.faqs));

    // Missing astrologer 404
    const notFoundRes = await request({
      path: "/api/admin/astrologers/00000000-0000-0000-0000-000000000000",
      token: adminToken,
    });
    assert.strictEqual(notFoundRes.statusCode, 404);
    assert.strictEqual(notFoundRes.body.success, false);
    console.log(" -> [PASS] Listing, search, detail retrieval, and 404 handling verified.");

    // ----------------------------------------------------
    // TEST 3: Validation on Update
    // ----------------------------------------------------
    console.log("\n[TEST 3] Input Validation on Update...");

    // 3.1 Empty name
    const resEmptyName = await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${vishalId}`,
      body: { name: "" },
      token: adminToken,
    });
    assert.strictEqual(resEmptyName.statusCode, 400);
    assert(resEmptyName.body.message.includes("Name must be a non-empty string"));

    // 3.2 Negative experience
    const resNegExp = await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${vishalId}`,
      body: { experienceYears: -5 },
      token: adminToken,
    });
    assert.strictEqual(resNegExp.statusCode, 400);
    assert(resNegExp.body.message.includes("Experience years must be a non-negative integer"));

    // 3.3 Invalid rating (> 5.0)
    const resInvalidRating = await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${vishalId}`,
      body: { rating: 9.5 },
      token: adminToken,
    });
    assert.strictEqual(resInvalidRating.statusCode, 400);
    assert(resInvalidRating.body.message.includes("Rating must be a number between 0.0 and 5.0"));

    // 3.4 Non-array languages
    const resInvalidLangs = await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${vishalId}`,
      body: { languages: "Hindi, English" },
      token: adminToken,
    });
    assert.strictEqual(resInvalidLangs.statusCode, 400);
    assert(resInvalidLangs.body.message.includes("Languages must be an array"));

    console.log(" -> [PASS] Server correctly rejects invalid payload types and values.");

    // ----------------------------------------------------
    // TEST 4: Valid Partial Update & Data Safety
    // ----------------------------------------------------
    console.log("\n[TEST 4] Valid Partial Update & Data Safety...");
    const originalTitle = vishalListing.title;
    const testTitle = `${originalTitle} - Updated`;

    // Attempt partial update including prohibited field tampering attempt (`code: "hacked"`)
    const updateRes = await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${vishalId}`,
      body: {
        title: testTitle,
        code: "attempt-tamper-code", // Protected field
      },
      token: adminToken,
    });
    assert.strictEqual(updateRes.statusCode, 200);
    assert.strictEqual(updateRes.body.success, true);
    assert.strictEqual(updateRes.body.data.title, testTitle);

    // Verify protected code field was NOT changed
    const dbCheck = await Astrologer.findByPk(vishalId);
    assert.strictEqual(dbCheck.code, "ast-vishal", "Protected 'code' field must not be overwritten!");
    assert.strictEqual(dbCheck.title, testTitle);

    // Revert back to original title
    await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${vishalId}`,
      body: { title: originalTitle },
      token: adminToken,
    });
    const revertCheck = await Astrologer.findByPk(vishalId);
    assert.strictEqual(revertCheck.title, originalTitle);

    console.log(" -> [PASS] Partial update succeeded; protected fields remain safe and unmutated.");

    // ----------------------------------------------------
    // TEST 5: Status Toggle & Public Filtering Regression Check
    // ----------------------------------------------------
    console.log("\n[TEST 5] Status Toggle & Public Read API Filtering...");

    // Deactivate Vishal
    const deactRes = await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${vishalId}/status`,
      body: { isActive: false },
      token: adminToken,
    });
    assert.strictEqual(deactRes.statusCode, 200);
    assert.strictEqual(deactRes.body.data.isActive, false);

    // Verify public API: /api/astrologers/vishal-bhardwaj MUST return 404 when inactive!
    const publicDetailInactive = await request({ path: "/api/astrologers/vishal-bhardwaj" });
    assert.strictEqual(
      publicDetailInactive.statusCode,
      404,
      "Public endpoint must return 404 for deactivated astrologer"
    );

    // Verify public listing: Vishal should NOT appear in public catalogue
    const publicListInactive = await request({ path: "/api/astrologers" });
    assert(
      !publicListInactive.body.data.some((a) => a.code === "ast-vishal"),
      "Deactivated astrologer must be omitted from public listing"
    );

    // Reactivate Vishal
    const reactRes = await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${vishalId}/status`,
      body: { isActive: true },
      token: adminToken,
    });
    assert.strictEqual(reactRes.statusCode, 200);
    assert.strictEqual(reactRes.body.data.isActive, true);

    // Verify public API returns 200 again!
    const publicDetailActive = await request({ path: "/api/astrologers/vishal-bhardwaj" });
    assert.strictEqual(publicDetailActive.statusCode, 200);
    assert.strictEqual(publicDetailActive.body.data.name, "Vishal Bhardwaj");

    console.log(" -> [PASS] Status toggle correctly controls public visibility dynamically.");

    // ----------------------------------------------------
    // TEST 6: Public Read APIs Regression Verification
    // ----------------------------------------------------
    console.log("\n[TEST 6] Public APIs Regression Verification...");
    const pubList = await request({ path: "/api/astrologers" });
    assert.strictEqual(pubList.statusCode, 200);
    assert.strictEqual(pubList.body.data.length, 2);

    const anuragDetail = await request({ path: "/api/astrologers/acharya-anurag-bhardwaj" });
    assert.strictEqual(anuragDetail.statusCode, 200);
    assert.strictEqual(anuragDetail.body.data.packages.length, 4);

    const packagesRes = await request({ path: "/api/astrologers/vishal-bhardwaj/packages" });
    assert.strictEqual(packagesRes.statusCode, 200);
    assert.strictEqual(packagesRes.body.count, 4);

    console.log(" -> [PASS] Zero regressions on public astrologer read endpoints.");

    console.log("\n========================================================");
    console.log(" ALL PHASE 2 ADMIN TESTS PASSED SUCCESSFULLY! (6/6)");
    console.log("========================================================\n");

    server.close();
    process.exit(0);
  } catch (err) {
    console.error("\n[FAIL] Phase 2 test suite failed:", err);
    server.close();
    process.exit(1);
  }
}

runPhase2TestSuite();
