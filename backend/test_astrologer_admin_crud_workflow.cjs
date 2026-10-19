process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_here_min_32_chars";

const http = require("http");
const assert = require("assert");
const jwt = require("jsonwebtoken");

async function runAdminCrudTestSuite() {
  console.log("\n========================================================");
  console.log(" Veda Structure: Astrologer Admin CRUD & Slot Test Suite");
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
            } catch (e) {
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
      if (jsonBody) {
        req.write(jsonBody);
      }
      req.end();
    });
  };

  let testAstroId = null;
  const uniqueSuffix = Date.now();
  const testSlug = `test-astrologer-${uniqueSuffix}`;
  const testCode = `ast-test-${uniqueSuffix}`;

  try {
    // -------------------------------------------------------------
    // TEST 1: Unauthenticated & Unauthorized Rejection
    // -------------------------------------------------------------
    console.log("[TEST 1] Authentication and Authorization checks on POST /api/admin/astrologers...");
    const unauthRes = await request({
      method: "POST",
      path: "/api/admin/astrologers",
      body: { name: "Unauthorized Astrologer", title: "Vedic Scholar" },
    });
    assert.strictEqual(unauthRes.statusCode, 401, "Must reject without token with 401");

    const nonAdminRes = await request({
      method: "POST",
      path: "/api/admin/astrologers",
      token: userToken,
      body: { name: "Non Admin Astrologer", title: "Vedic Scholar" },
    });
    assert.strictEqual(nonAdminRes.statusCode, 403, "Must reject non-admin with 403");
    console.log(" -> [PASS] Authentication & role enforcement verified.");

    // -------------------------------------------------------------
    // TEST 2: Validation of Required Fields
    // -------------------------------------------------------------
    console.log("[TEST 2] Input validation on POST /api/admin/astrologers...");
    const missingNameRes = await request({
      method: "POST",
      path: "/api/admin/astrologers",
      token: adminToken,
      body: { name: "   ", title: "Valid Title" },
    });
    assert.strictEqual(missingNameRes.statusCode, 400, "Must reject empty name with 400");
    assert.strictEqual(missingNameRes.body.success, false);

    const missingTitleRes = await request({
      method: "POST",
      path: "/api/admin/astrologers",
      token: adminToken,
      body: { name: "Valid Name", title: "" },
    });
    assert.strictEqual(missingTitleRes.statusCode, 400, "Must reject empty title with 400");
    console.log(" -> [PASS] Field-level validation verified.");

    // -------------------------------------------------------------
    // TEST 3: Create Astrologer Profile
    // -------------------------------------------------------------
    console.log("[TEST 3] Creating new Astrologer Profile via POST /api/admin/astrologers...");
    const createRes = await request({
      method: "POST",
      path: "/api/admin/astrologers",
      token: adminToken,
      body: {
        name: `Acharya Test ${uniqueSuffix}`,
        title: "Senior Vedic Astrologer & Sanatan Scholar",
        slug: testSlug,
        code: testCode,
        eyebrow: "Kashi Heritage Tradition",
        holySeat: "Kashi (Varanasi)",
        location: "Kashi, India",
        experienceYears: 12,
        languages: ["Hindi", "English", "Sanskrit"],
        specializations: ["Kundali Analysis", "Career & Job", "Marriage Timing"],
        expertise: ["Parashari Jyotish", "Vimshottari Dasha"],
        availableTimeSlots: [
          "10:00 AM - 10:30 AM",
          "11:30 AM - 12:00 PM",
          "02:00 PM - 02:30 PM"
        ],
        addOnPricing: {
          addOnCouple: 3100,
          addOnReport: 500,
          addOnExpress: 400
        },
        isActive: true,
      },
    });

    assert.strictEqual(createRes.statusCode, 201, `Expected 201, got ${createRes.statusCode}: ${JSON.stringify(createRes.body)}`);
    assert.strictEqual(createRes.body.success, true);
    assert(createRes.body.data && createRes.body.data.id, "Must return created astrologer ID");
    testAstroId = createRes.body.data.id;
    assert.strictEqual(createRes.body.data.slug, testSlug);
    assert.strictEqual(createRes.body.data.code, testCode);
    assert.strictEqual(createRes.body.data.experienceYears, 12);
    console.log(" -> [PASS] Astrologer created with ID:", testAstroId);

    // -------------------------------------------------------------
    // TEST 4: Conflict on Duplicate Slug/Code
    // -------------------------------------------------------------
    console.log("[TEST 4] Rejecting duplicate slug/code on POST /api/admin/astrologers...");
    const duplicateRes = await request({
      method: "POST",
      path: "/api/admin/astrologers",
      token: adminToken,
      body: {
        name: "Another Astrologer",
        title: "Astrologer Title",
        slug: testSlug, // duplicate!
      },
    });
    assert.strictEqual(duplicateRes.statusCode, 409, "Must return 409 Conflict for duplicate slug");
    assert.strictEqual(duplicateRes.body.success, false);
    console.log(" -> [PASS] 409 Conflict returned for duplicate slug.");

    // -------------------------------------------------------------
    // TEST 5: Read Profile by ID
    // -------------------------------------------------------------
    console.log("[TEST 5] Reading profile via GET /api/admin/astrologers/:id...");
    const getRes = await request({
      method: "GET",
      path: `/api/admin/astrologers/${testAstroId}`,
      token: adminToken,
    });
    assert.strictEqual(getRes.statusCode, 200);
    assert.strictEqual(getRes.body.data.id, testAstroId);
    assert.strictEqual(getRes.body.data.slug, testSlug);
    assert(Array.isArray(getRes.body.data.availableTimeSlots) && getRes.body.data.availableTimeSlots.length === 3);
    console.log(" -> [PASS] Astrologer profile retrieved successfully with slots.");

    // -------------------------------------------------------------
    // TEST 6: Update Astrologer Profile
    // -------------------------------------------------------------
    console.log("[TEST 6] Updating profile via PATCH /api/admin/astrologers/:id...");
    const updateRes = await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${testAstroId}`,
      token: adminToken,
      body: {
        title: "Chief Jyotish Consultant & Master Scholar",
        experienceYears: 15,
        location: "Varanasi & Haridwar",
      },
    });
    assert.strictEqual(updateRes.statusCode, 200);
    assert.strictEqual(updateRes.body.data.title, "Chief Jyotish Consultant & Master Scholar");
    assert.strictEqual(updateRes.body.data.experienceYears, 15);
    console.log(" -> [PASS] Astrologer profile updated successfully.");

    // -------------------------------------------------------------
    // TEST 7: Quick Status Toggle
    // -------------------------------------------------------------
    console.log("[TEST 7] Toggling active status via PATCH /api/admin/astrologers/:id/status...");
    const deactRes = await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${testAstroId}/status`,
      token: adminToken,
      body: { isActive: false },
    });
    assert.strictEqual(deactRes.statusCode, 200);
    assert.strictEqual(deactRes.body.data.isActive, false);

    const reactRes = await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${testAstroId}/status`,
      token: adminToken,
      body: { isActive: true },
    });
    assert.strictEqual(reactRes.statusCode, 200);
    assert.strictEqual(reactRes.body.data.isActive, true);
    console.log(" -> [PASS] Status toggles work accurately.");

    // -------------------------------------------------------------
    // TEST 8: Package Management Integration
    // -------------------------------------------------------------
    console.log("[TEST 8] Creating and managing packages for the new astrologer...");
    const pkgRes = await request({
      method: "POST",
      path: `/api/admin/astrologers/${testAstroId}/packages`,
      token: adminToken,
      body: {
        packageKey: "test-kundali",
        title: "Test Kundali Session",
        duration: "45 Minutes",
        price: 1800,
        originalPrice: 2400,
        description: "Comprehensive birth chart assessment",
        isPopular: true,
      },
    });
    assert.strictEqual(pkgRes.statusCode, 201);
    const createdPkgId = pkgRes.body.data.id;
    assert(createdPkgId, "Package ID must exist");

    // List packages
    const listPkgs = await request({
      method: "GET",
      path: `/api/admin/astrologers/${testAstroId}/packages`,
      token: adminToken,
    });
    assert.strictEqual(listPkgs.statusCode, 200);
    assert.strictEqual(listPkgs.body.count, 1);

    // Delete package
    const delPkg = await request({
      method: "DELETE",
      path: `/api/admin/astrologers/${testAstroId}/packages/${createdPkgId}`,
      token: adminToken,
    });
    assert.strictEqual(delPkg.statusCode, 200);
    console.log(" -> [PASS] Package creation, listing, and deletion integration verified.");

    console.log("\n========================================================");
    console.log(" ALL ASTROLOGER ADMIN CRUD TESTS PASSED SUCCESSFULLY!");
    console.log("========================================================\n");
  } finally {
    // Clean up created test record
    if (testAstroId) {
      try {
        await AstrologerPackage.destroy({ where: { astrologerId: testAstroId } });
        await Astrologer.destroy({ where: { id: testAstroId } });
        console.log(`[CLEANUP] Deleted test astrologer record ${testAstroId}`);
      } catch (cleanupErr) {
        console.warn("Cleanup warning:", cleanupErr.message);
      }
    }
    await new Promise((resolve) => server.close(resolve));
  }
}

runAdminCrudTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
