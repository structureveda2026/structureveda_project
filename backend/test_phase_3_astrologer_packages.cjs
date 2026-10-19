process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_here_min_32_chars";

const http = require("http");
const assert = require("assert");
const jwt = require("jsonwebtoken");

async function runPhase3TestSuite() {
  console.log("\n========================================================");
  console.log(" Veda Structure: Phase 3 Astrologer Packages Test Suite");
  console.log("========================================================\n");

  const modelsMod = await import("./src/models/index.js");
  const { Astrologer, AstrologerPackage, Booking } = modelsMod;
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

  let testCreatedPackageId = null;

  try {
    // Lookup target astrologers
    const vishal = await Astrologer.findOne({ where: { slug: "vishal-bhardwaj" } });
    const anurag = await Astrologer.findOne({ where: { slug: "acharya-anurag-bhardwaj" } });

    assert.ok(vishal, "Vishal Bhardwaj must exist in test database");
    assert.ok(anurag, "Acharya Anurag Bhardwaj must exist in test database");

    // ----------------------------------------------------
    // TEST 1: Admin Authentication & Authorization
    // ----------------------------------------------------
    console.log("\n[TEST 1] Admin Authentication and Authorization...");

    // 1.1 Missing token
    const resNoToken = await request({ path: `/api/admin/astrologers/${vishal.id}/packages` });
    assert.strictEqual(resNoToken.statusCode, 401, "Expected 401 for missing token");
    assert.strictEqual(resNoToken.body.success, false);

    // 1.2 Invalid token
    const resInvalidToken = await request({
      path: `/api/admin/astrologers/${vishal.id}/packages`,
      token: "malformed-jwt",
    });
    assert.strictEqual(resInvalidToken.statusCode, 401, "Expected 401 for malformed token");

    // 1.3 Regular user token (role: 'user')
    const resUserToken = await request({
      path: `/api/admin/astrologers/${vishal.id}/packages`,
      token: userToken,
    });
    assert.strictEqual(resUserToken.statusCode, 403, "Expected 403 Forbidden for non-admin");
    assert.strictEqual(resUserToken.body.success, false);

    // 1.4 Admin token
    const resAdminToken = await request({
      path: `/api/admin/astrologers/${vishal.id}/packages`,
      token: adminToken,
    });
    assert.strictEqual(resAdminToken.statusCode, 200, "Expected 200 OK for admin");
    assert.strictEqual(resAdminToken.body.success, true);
    assert.strictEqual(Array.isArray(resAdminToken.body.data), true);
    assert.ok(resAdminToken.body.count >= 4, "Vishal should have at least 4 baseline packages");
    console.log(" -> [PASS] Authentication & role-based access control properly enforced.");

    // ----------------------------------------------------
    // TEST 2: Package Listing & Individual Package Retrieval
    // ----------------------------------------------------
    console.log("\n[TEST 2] Package Listing and Individual Package Retrieval...");

    const vishalPackages = resAdminToken.body.data;
    const firstPkg = vishalPackages[0];
    assert.ok(firstPkg.id, "Package should have id");
    assert.ok(firstPkg.packageKey, "Package should have packageKey");
    assert.ok(firstPkg.title, "Package should have title");
    assert.strictEqual(typeof firstPkg.price, "number", "Price should be serialized as number");

    // Single package by UUID
    const resSingleUuid = await request({
      path: `/api/admin/astrologers/${vishal.id}/packages/${firstPkg.id}`,
      token: adminToken,
    });
    assert.strictEqual(resSingleUuid.statusCode, 200);
    assert.strictEqual(resSingleUuid.body.data.id, firstPkg.id);

    // Single package by packageKey
    const resSingleKey = await request({
      path: `/api/admin/astrologers/${vishal.id}/packages/${firstPkg.packageKey}`,
      token: adminToken,
    });
    assert.strictEqual(resSingleKey.statusCode, 200);
    assert.strictEqual(resSingleKey.body.data.packageKey, firstPkg.packageKey);

    // 404 for non-existent astrologer
    const resMissingAstro = await request({
      path: `/api/admin/astrologers/00000000-0000-0000-0000-000000000000/packages`,
      token: adminToken,
    });
    assert.strictEqual(resMissingAstro.statusCode, 404);

    // 404 for non-existent package
    const resMissingPkg = await request({
      path: `/api/admin/astrologers/${vishal.id}/packages/non-existent-pkg-key`,
      token: adminToken,
    });
    assert.strictEqual(resMissingPkg.statusCode, 404);
    console.log(" -> [PASS] Package listing, retrieval by UUID and packageKey, and 404s verified.");

    // ----------------------------------------------------
    // TEST 3: Cross-Astrologer Package Isolation
    // ----------------------------------------------------
    console.log("\n[TEST 3] Cross-Astrologer Package Access Prevention...");

    // Get an Anurag package
    const anuragPkgs = await AstrologerPackage.findAll({ where: { astrologerId: anurag.id } });
    assert.ok(anuragPkgs.length > 0, "Anurag should have packages");
    const anuragPkg = anuragPkgs[0];

    // Attempt to access Anurag's package using Vishal's astrologer ID
    const resCrossAccess = await request({
      path: `/api/admin/astrologers/${vishal.id}/packages/${anuragPkg.id}`,
      token: adminToken,
    });
    assert.strictEqual(resCrossAccess.statusCode, 404, "Expected 404 for cross-astrologer package access");
    assert.ok(
      resCrossAccess.body.message.includes("does not belong") ||
        resCrossAccess.body.message.includes("not found"),
      "Message should identify package does not belong to specified astrologer"
    );
    console.log(" -> [PASS] Cross-astrologer package tampering strictly blocked.");

    // ----------------------------------------------------
    // TEST 4: Input Validation & Protected Field Safety on Creation
    // ----------------------------------------------------
    console.log("\n[TEST 4] Package Creation Validation & Rejection of Malformed Data...");

    // 4.1 Missing packageKey
    const resNoKey = await request({
      method: "POST",
      path: `/api/admin/astrologers/${vishal.id}/packages`,
      token: adminToken,
      body: { title: "Test Package", duration: "45 Minutes", price: 2500 },
    });
    assert.strictEqual(resNoKey.statusCode, 400);

    // 4.2 Malformed packageKey (special characters)
    const resBadKey = await request({
      method: "POST",
      path: `/api/admin/astrologers/${vishal.id}/packages`,
      token: adminToken,
      body: { packageKey: "bad key with spaces!", title: "Test Package", duration: "45 Minutes", price: 2500 },
    });
    assert.strictEqual(resBadKey.statusCode, 400);

    // 4.3 Missing title
    const resNoTitle = await request({
      method: "POST",
      path: `/api/admin/astrologers/${vishal.id}/packages`,
      token: adminToken,
      body: { packageKey: "valid-key", duration: "45 Minutes", price: 2500 },
    });
    assert.strictEqual(resNoTitle.statusCode, 400);

    // 4.4 Missing duration
    const resNoDur = await request({
      method: "POST",
      path: `/api/admin/astrologers/${vishal.id}/packages`,
      token: adminToken,
      body: { packageKey: "valid-key", title: "Valid Title", price: 2500 },
    });
    assert.strictEqual(resNoDur.statusCode, 400);

    // 4.5 Negative price
    const resNegPrice = await request({
      method: "POST",
      path: `/api/admin/astrologers/${vishal.id}/packages`,
      token: adminToken,
      body: { packageKey: "valid-key", title: "Valid Title", duration: "45 Minutes", price: -100 },
    });
    assert.strictEqual(resNegPrice.statusCode, 400);

    // 4.6 Non-numeric price
    const resAlphaPrice = await request({
      method: "POST",
      path: `/api/admin/astrologers/${vishal.id}/packages`,
      token: adminToken,
      body: { packageKey: "valid-key", title: "Valid Title", duration: "45 Minutes", price: "free" },
    });
    assert.strictEqual(resAlphaPrice.statusCode, 400);

    // 4.7 Duplicate packageKey for same astrologer
    const resDupKey = await request({
      method: "POST",
      path: `/api/admin/astrologers/${vishal.id}/packages`,
      token: adminToken,
      body: { packageKey: firstPkg.packageKey, title: "Duplicate Key Pkg", duration: "45 Minutes", price: 1500 },
    });
    assert.strictEqual(resDupKey.statusCode, 409, "Expected 409 Conflict for duplicate packageKey");
    console.log(" -> [PASS] Server correctly validates input and rejects malformed values.");

    // ----------------------------------------------------
    // TEST 5: Create Valid Package & Verify Persistence
    // ----------------------------------------------------
    console.log("\n[TEST 5] Creating Valid Consultation Package...");

    const newPkgPayload = {
      packageKey: "test-special-clarity",
      title: "Special VIP Clarity Session",
      subtitle: "Exclusive astrological consultation with comprehensive gemstone recommendation",
      duration: "75 Minutes",
      price: 3499.0,
      originalPrice: 4999.0,
      isPopular: true,
      badge: "VIP Exclusive",
      knownFor: ["Career Navigation", "Gemstone Prescription", "Remedial Puja Guidance"],
      consultationDetails: [
        "75-min one-on-one session",
        "Detailed birth chart verification",
        "Digital audio recording delivered post-call",
      ],
      displayOrder: 99,
      isActive: true,
      // Tampering attempts (should be ignored / safe)
      id: "99999999-9999-9999-9999-999999999999",
      astrologerId: anurag.id, // Attempting to assign to Anurag while calling Vishal's endpoint
    };

    const resCreate = await request({
      method: "POST",
      path: `/api/admin/astrologers/${vishal.id}/packages`,
      token: adminToken,
      body: newPkgPayload,
    });

    assert.strictEqual(resCreate.statusCode, 201, "Expected 201 Created");
    assert.strictEqual(resCreate.body.success, true);
    assert.ok(resCreate.body.data.id, "Created package should have server-assigned UUID");
    assert.notStrictEqual(
      resCreate.body.data.id,
      newPkgPayload.id,
      "Server should not accept client-supplied ID"
    );
    assert.strictEqual(
      resCreate.body.data.astrologerId,
      vishal.id,
      "Package must be bound to route's astrologer (Vishal), ignoring payload spoof"
    );
    assert.strictEqual(resCreate.body.data.packageKey, "test-special-clarity");
    assert.strictEqual(resCreate.body.data.price, 3499);
    assert.strictEqual(resCreate.body.data.originalPrice, 4999);
    assert.strictEqual(resCreate.body.data.isPopular, true);
    assert.strictEqual(resCreate.body.data.badge, "VIP Exclusive");
    assert.strictEqual(resCreate.body.data.knownFor.length, 3);
    assert.strictEqual(resCreate.body.data.consultationDetails.length, 3);

    testCreatedPackageId = resCreate.body.data.id;
    console.log(" -> [PASS] Package created and persisted with server-side protection.");

    // ----------------------------------------------------
    // TEST 6: Package Update (PATCH & PUT)
    // ----------------------------------------------------
    console.log("\n[TEST 6] Updating Package Fields (PATCH & PUT)...");

    // 6.1 Update price and duration via PATCH
    const resPatch = await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${vishal.id}/packages/${testCreatedPackageId}`,
      token: adminToken,
      body: {
        price: 3899.5,
        duration: "80 Minutes",
        isPopular: false,
        // Protected fields tampering attempt
        id: "88888888-8888-8888-8888-888888888888",
        astrologerId: anurag.id,
      },
    });
    assert.strictEqual(resPatch.statusCode, 200);
    assert.strictEqual(resPatch.body.data.price, 3899.5);
    assert.strictEqual(resPatch.body.data.duration, "80 Minutes");
    assert.strictEqual(resPatch.body.data.isPopular, false);
    assert.strictEqual(resPatch.body.data.astrologerId, vishal.id, "Astrologer ID must not change");

    // 6.2 Update via PUT
    const resPut = await request({
      method: "PUT",
      path: `/api/admin/astrologers/${vishal.id}/packages/${testCreatedPackageId}`,
      token: adminToken,
      body: {
        title: "Updated VIP Clarity Session",
      },
    });
    assert.strictEqual(resPut.statusCode, 200);
    assert.strictEqual(resPut.body.data.title, "Updated VIP Clarity Session");

    // 6.3 Reject invalid update price
    const resBadUpdatePrice = await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${vishal.id}/packages/${testCreatedPackageId}`,
      token: adminToken,
      body: { price: -50 },
    });
    assert.strictEqual(resBadUpdatePrice.statusCode, 400);
    console.log(" -> [PASS] Package updates and validation semantics verified.");

    // ----------------------------------------------------
    // TEST 7: Package Status Toggle & Public Filtering
    // ----------------------------------------------------
    console.log("\n[TEST 7] Package Status Toggle & Public Read API Regression...");

    // 7.1 Deactivate package
    const resDeactivate = await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${vishal.id}/packages/${testCreatedPackageId}/status`,
      token: adminToken,
      body: { isActive: false },
    });
    assert.strictEqual(resDeactivate.statusCode, 200);
    assert.strictEqual(resDeactivate.body.data.isActive, false);

    // 7.2 Check public packages endpoint - deactivated package must NOT be present
    const resPublicDeactivated = await request({
      path: `/api/astrologers/vishal-bhardwaj/packages`,
    });
    assert.strictEqual(resPublicDeactivated.statusCode, 200);
    const publicPkgs1 = resPublicDeactivated.body.data;
    const foundWhenInactive = publicPkgs1.find((p) => p.packageKey === "test-special-clarity");
    assert.strictEqual(
      foundWhenInactive,
      undefined,
      "Deactivated package must not appear in public packages API"
    );

    // 7.3 Reactivate package
    const resReactivate = await request({
      method: "PATCH",
      path: `/api/admin/astrologers/${vishal.id}/packages/${testCreatedPackageId}/status`,
      token: adminToken,
      body: { isActive: true },
    });
    assert.strictEqual(resReactivate.statusCode, 200);
    assert.strictEqual(resReactivate.body.data.isActive, true);

    // 7.4 Check public packages endpoint - reactivated package must NOW appear
    const resPublicActivated = await request({
      path: `/api/astrologers/vishal-bhardwaj/packages`,
    });
    assert.strictEqual(resPublicActivated.statusCode, 200);
    const publicPkgs2 = resPublicActivated.body.data;
    const foundWhenActive = publicPkgs2.find((p) => p.packageKey === "test-special-clarity");
    assert.ok(foundWhenActive, "Active package must appear in public packages API");
    assert.strictEqual(foundWhenActive.price, 3899.5);
    console.log(" -> [PASS] Status toggle correctly controls public visibility dynamically.");

    // ----------------------------------------------------
    // TEST 8: Safe Deletion & Historical Booking Protection
    // ----------------------------------------------------
    console.log("\n[TEST 8] Safe Package Deletion & Booking Conflict Protection...");

    // 8.1 Attempt to delete a seeded package that might have bookings or create mock booking to test protection
    const dummyBookingRef = `TEST-PKG-${Date.now()}`;
    const dummyBooking = await Booking.create({
      bookingReference: dummyBookingRef,
      astrologerId: vishal.code,
      astrologerName: vishal.name,
      packageId: "test-special-clarity",
      packageName: "Special VIP Clarity Session",
      duration: "80 Minutes",
      amount: 3899.5,
      fullName: "Test Client",
      gender: "Male",
      dateOfBirth: "1990-01-01",
      timeOfBirth: "12:00:00",
      placeOfBirth: "New Delhi",
      reportLanguage: "English",
      consultationDate: "2026-11-01",
      consultationTime: "10:00 AM - 11:00 AM",
      consultationMode: "Video Call",
      phone: "+919876543210",
      email: "testclient@example.com",
      bookingStatus: "Pending",
      paymentStatus: "Pending",
    });

    // Attempt to delete package that has a booking
    const resBlockedDelete = await request({
      method: "DELETE",
      path: `/api/admin/astrologers/${vishal.id}/packages/${testCreatedPackageId}`,
      token: adminToken,
    });
    assert.strictEqual(
      resBlockedDelete.statusCode,
      409,
      "Expected 409 Conflict when attempting to delete package with customer bookings"
    );
    assert.strictEqual(resBlockedDelete.body.success, false);
    assert.ok(
      resBlockedDelete.body.message.includes("Cannot delete package") &&
        resBlockedDelete.body.message.includes("deactivate"),
      "Message must instruct admin to deactivate package instead"
    );

    // Cleanup the dummy test booking
    await dummyBooking.destroy();

    // Now delete should succeed safely because no bookings reference it
    const resSafeDelete = await request({
      method: "DELETE",
      path: `/api/admin/astrologers/${vishal.id}/packages/${testCreatedPackageId}`,
      token: adminToken,
    });
    assert.strictEqual(resSafeDelete.statusCode, 200, "Expected 200 OK for safe deletion");
    assert.strictEqual(resSafeDelete.body.success, true);

    // Verify package is gone
    const verifyDeleted = await AstrologerPackage.findByPk(testCreatedPackageId);
    assert.strictEqual(verifyDeleted, null, "Deleted package should no longer exist in DB");
    testCreatedPackageId = null;
    console.log(" -> [PASS] Deletion safeguards protect historical booking integrity.");

    // ----------------------------------------------------
    // TEST 9: Public Astrologer Detail Packages Count & Serializer
    // ----------------------------------------------------
    console.log("\n[TEST 9] Verifying Public & Admin Astrologer Serializers...");

    const resAdminDetail = await request({
      path: `/api/admin/astrologers/${vishal.id}`,
      token: adminToken,
    });
    assert.strictEqual(resAdminDetail.statusCode, 200);
    assert.ok(resAdminDetail.body.data.packages.length >= 4);
    assert.strictEqual(
      resAdminDetail.body.data.packages[0].astrologerId,
      vishal.id,
      "Admin packages must include astrologerId"
    );

    const resPublicDetail = await request({
      path: `/api/astrologers/vishal-bhardwaj`,
    });
    assert.strictEqual(resPublicDetail.statusCode, 200);
    assert.ok(resPublicDetail.body.data.packages.length >= 4);
    assert.strictEqual(
      resPublicDetail.body.data.packages[0].astrologerId,
      undefined,
      "Public packages must NOT expose internal foreign key astrologerId"
    );
    console.log(" -> [PASS] Serializer separation between admin and public confirmed.");

    console.log("\n========================================================");
    console.log(" ALL PHASE 3 BACKEND TESTS PASSED SUCCESSFULLY! (9/9)");
    console.log("========================================================\n");
  } catch (err) {
    console.error("\n[TEST FAILED]:", err);
    if (testCreatedPackageId) {
      try {
        await AstrologerPackage.destroy({ where: { id: testCreatedPackageId } });
      } catch (cleanupErr) {
        console.error("Cleanup error:", cleanupErr);
      }
    }
    process.exit(1);
  } finally {
    server.close();
  }
}

runPhase3TestSuite();
