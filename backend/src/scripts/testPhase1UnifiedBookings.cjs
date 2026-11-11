const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const http = require("http");
const assert = require("assert");
const jwt = require("jsonwebtoken");

// Load database & models
const db = require("../models/index.js").default;
const {
  User,
  RitualBooking,
  PujaBooking,
  Booking,
  UpcomingPuja,
  PujaPackage,
  PujaService,
  HomaService,
} = db;

const app = require("../app.js").default;

let server;
let baseUrl;

// Helper to make HTTP requests
const request = ({ method, path, body, headers = {} }) => {
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
      {
        method,
        headers: reqHeaders,
      },
      (res) => {
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          let parsedData = null;
          try {
            parsedData = JSON.parse(rawData);
          } catch {
            parsedData = rawData;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsedData,
          });
        });
      }
    );

    req.on("error", reject);
    if (jsonBody) req.write(jsonBody);
    req.end();
  });
};

const createdTestUserIds = [];
const createdTestRitualIds = [];
const createdTestCommunityBookingIds = [];

async function runPhase1UnifiedBookingTests() {
  console.log("================================================================");
  console.log("PHASE 1: UNIFIED BOOKING MANAGEMENT BACKEND TEST SUITE");
  console.log("================================================================\n");

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      if (err.stack) console.error(err.stack);
      failed++;
    }
  }

  console.log("1. Setting up admin & regular users...");
  // 1. Setup Auth Users & Tokens
  let adminUser = await User.findOne({ where: { role: "admin", isActive: true } });
  if (!adminUser) {
    adminUser = await User.create({
      fullName: "Phase 1 Test Admin",
      email: `admin_phase1_${Date.now()}@vedastructure.com`,
      password: "hashed_dummy_password",
      role: "admin",
      isActive: true,
    });
    createdTestUserIds.push(adminUser.id);
  }

  const adminToken = jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: "admin" },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: "2h" }
  );

  let regularUser = await User.findOne({ where: { role: "user", isActive: true } });
  if (!regularUser) {
    regularUser = await User.create({
      fullName: "Phase 1 Test Devotee",
      email: `devotee_phase1_${Date.now()}@vedastructure.com`,
      password: "hashed_dummy_password",
      role: "user",
      isActive: true,
    });
    createdTestUserIds.push(regularUser.id);
  }

  const userToken = jwt.sign(
    { id: regularUser.id, email: regularUser.email, role: "user" },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: "2h" }
  );

  const adminHeaders = { Authorization: `Bearer ${adminToken}` };
  const userHeaders = { Authorization: `Bearer ${userToken}` };

  // 2. Seed Test Ritual Bookings
  const testRitualRef1 = `VEDA-HOMA-T${Date.now().toString(36).slice(-4).toUpperCase()}01`;
  const testRitual1 = await RitualBooking.create({
    bookingReference: testRitualRef1,
    serviceType: "HOMA",
    serviceId: "00000000-0000-0000-0000-000000000001",
    serviceSlug: "maha-mrityunjaya-homa",
    serviceName: "Maha Mrityunjaya Homa",
    userId: regularUser.id,
    bookingDate: "2026-11-20",
    bookingTime: "06:00 AM",
    durationSelected: "3 Hours",
    durationHours: 3,
    panditCount: 2,
    arrangementMode: "remote",
    locationType: "remote",
    venueDetails: {},
    yajmanDetails: {
      name: "Suresh Sharma",
      phone: "9876543210",
      email: "suresh@example.com",
      gotra: "Kashyapa",
      city: "Varanasi",
    },
    sankalpDetails: { purpose: "Health and Longevity" },
    familyMembers: [{ name: "Pooja Sharma", relationship: "Wife" }],
    addons: [],
    basePrice: 5100,
    panditAddonPrice: 1500,
    addonsTotal: 0,
    totalAmount: 6600,
    currency: "INR",
    bookingStatus: "Pending",
    paymentStatus: "Pending",
    notes: "Initial devotee booking notes",
  });
  createdTestRitualIds.push(testRitual1.id);

  const testRitualRef2 = `VEDA-PUJA-T${Date.now().toString(36).slice(-4).toUpperCase()}02`;
  const testRitual2 = await RitualBooking.create({
    bookingReference: testRitualRef2,
    serviceType: "PUJA",
    serviceId: "00000000-0000-0000-0000-000000000002",
    serviceSlug: "rudrabhishek-puja",
    serviceName: "Rudrabhishek Puja",
    userId: null,
    bookingDate: "2026-11-22",
    bookingTime: "08:00 AM",
    durationSelected: "2 Hours",
    durationHours: 2,
    panditCount: 1,
    arrangementMode: "kashi",
    locationType: "kashi",
    venueDetails: { temple: "Kashi Vishwanath" },
    yajmanDetails: {
      name: "Ramesh Gupta",
      phone: "9123456780",
      email: "ramesh@example.com",
      gotra: "Bharadwaja",
    },
    sankalpDetails: { purpose: "Prosperity" },
    familyMembers: [],
    addons: [],
    basePrice: 3100,
    panditAddonPrice: 0,
    addonsTotal: 0,
    totalAmount: 3100,
    currency: "INR",
    bookingStatus: "Confirmed",
    paymentStatus: "Paid",
    transactionId: "cf_pay_test_123456",
  });
  createdTestRitualIds.push(testRitual2.id);

  // 3. Seed / Verify Community Puja & Package
  let testPuja = await UpcomingPuja.findOne({ where: { status: "Published" } });
  let testPackage = null;
  if (testPuja) {
    testPackage = await PujaPackage.findOne({ where: { pujaId: testPuja.id } });
  }

  let testCommunityBooking = null;
  if (testPuja && testPackage) {
    const testCommRef = `VEDA-PUJA-C${Date.now().toString(36).slice(-4).toUpperCase()}`;
    testCommunityBooking = await PujaBooking.create({
      bookingReference: testCommRef,
      pujaId: testPuja.id,
      packageId: testPackage.id,
      userId: regularUser.id,
      amount: testPackage.price,
      primaryDevoteeName: "Vikramaditya Verma",
      primaryPhone: "9988776655",
      primaryEmail: "vikram@example.com",
      devotees: [{ fullName: "Vikramaditya Verma", rashi: "Mesha" }],
      sankalpPurpose: "Family Well-being",
      shippingAddress: { city: "Delhi", country: "India" },
      bookingStatus: "Confirmed",
      paymentStatus: "Pending",
    });
    createdTestCommunityBookingIds.push(testCommunityBooking.id);
  }

  // ============================================================================
  // SECTION 1: AUTHENTICATION & ACCESS CONTROL
  // ============================================================================
  console.log("--- Section 1: Authentication & Access Control ---");

  await test("1.1 Reject unauthenticated access to /api/admin/ritual-bookings", async () => {
    const res = await request({ method: "GET", path: "/api/admin/ritual-bookings" });
    assert.strictEqual(res.status, 401, "Expected 401 Unauthorized");
    assert.strictEqual(res.data.success, false);
  });

  await test("1.2 Reject non-admin authenticated access to /api/admin/ritual-bookings", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/ritual-bookings",
      headers: userHeaders,
    });
    assert.strictEqual(res.status, 403, "Expected 403 Forbidden for non-admin");
    assert.strictEqual(res.data.success, false);
  });

  await test("1.3 Reject unauthenticated access to /api/admin/community-puja-bookings", async () => {
    const res = await request({ method: "GET", path: "/api/admin/community-puja-bookings" });
    assert.strictEqual(res.status, 401, "Expected 401 Unauthorized");
  });

  await test("1.4 Reject non-admin access to /api/admin/community-puja-bookings", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/community-puja-bookings",
      headers: userHeaders,
    });
    assert.strictEqual(res.status, 403, "Expected 403 Forbidden");
  });

  await test("1.5 Reject unauthenticated access to /api/admin/bookings/all", async () => {
    const res = await request({ method: "GET", path: "/api/admin/bookings/all" });
    assert.strictEqual(res.status, 401, "Expected 401 Unauthorized");
  });

  await test("1.6 Reject non-admin access to /api/admin/bookings/all", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/bookings/all",
      headers: userHeaders,
    });
    assert.strictEqual(res.status, 403, "Expected 403 Forbidden");
  });

  // ============================================================================
  // SECTION 2: RITUAL BOOKING ADMIN APIs
  // ============================================================================
  console.log("\n--- Section 2: Ritual Booking Admin APIs ---");

  await test("2.1 Admin list ritual bookings with pagination envelope", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/ritual-bookings?limit=10&page=1",
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(typeof res.data.total, "number");
    assert.strictEqual(typeof res.data.totalPages, "number");
    assert.strictEqual(typeof res.data.count, "number");
    assert.strictEqual(res.data.page, 1);
    assert.ok(Array.isArray(res.data.data));
  });

  await test("2.2 Filter ritual bookings by serviceType=HOMA", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/ritual-bookings?serviceType=HOMA",
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.length > 0);
    res.data.data.forEach((item) => {
      assert.strictEqual(item.serviceType, "HOMA");
    });
  });

  await test("2.3 Search ritual bookings by unique bookingReference", async () => {
    const res = await request({
      method: "GET",
      path: `/api/admin/ritual-bookings?search=${testRitualRef1}`,
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.count, 1);
    assert.strictEqual(res.data.data[0].bookingReference, testRitualRef1);
    assert.strictEqual(res.data.data[0].customer.name, "Suresh Sharma");
  });

  await test("2.4 Search ritual bookings by customer name", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/ritual-bookings?search=Ramesh",
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.length >= 1);
    const found = res.data.data.find((b) => b.bookingReference === testRitualRef2);
    assert.ok(found, "Expected to find Ramesh Gupta booking");
  });

  await test("2.5 Get ritual booking details by UUID", async () => {
    const res = await request({
      method: "GET",
      path: `/api/admin/ritual-bookings/${testRitual1.id}`,
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    const b = res.data.data;
    assert.strictEqual(b.id, testRitual1.id);
    assert.strictEqual(b.bookingReference, testRitualRef1);
    assert.strictEqual(b.serviceName, "Maha Mrityunjaya Homa");
    assert.strictEqual(b.pricing.totalAmount, 6600);
    assert.strictEqual(b.customer.phone, "9876543210");
    assert.strictEqual(b.customer.gotra, "Kashyapa");
    assert.strictEqual(b.notes, "Initial devotee booking notes");
  });

  await test("2.6 Get ritual booking details by bookingReference", async () => {
    const res = await request({
      method: "GET",
      path: `/api/admin/ritual-bookings/${testRitualRef2}`,
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.bookingReference, testRitualRef2);
    assert.strictEqual(res.data.data.paymentStatus, "Paid");
    assert.strictEqual(res.data.data.transactionId, "cf_pay_test_123456");
  });

  await test("2.7 Return 404 for non-existent ritual booking", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/ritual-bookings/00000000-0000-0000-0000-999999999999",
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.success, false);
  });

  await test("2.8 Reject invalid status transition from Pending to Confirmed without paid Dakshina", async () => {
    const res = await request({
      method: "PATCH",
      path: `/api/admin/ritual-bookings/${testRitual1.id}/status`,
      body: { bookingStatus: "Confirmed" },
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 400, "Should reject unverified payment confirmation");
    assert.ok(res.data.message.includes("verified payment"));
  });

  await test("2.9 Reject invalid status transition with arbitrary status string", async () => {
    const res = await request({
      method: "PATCH",
      path: `/api/admin/ritual-bookings/${testRitual1.id}/status`,
      body: { bookingStatus: "SuperConfirmed" },
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes("Invalid bookingStatus"));
  });

  await test("2.10 Valid transition: Cancel Pending booking with Admin operational notes", async () => {
    const res = await request({
      method: "PATCH",
      path: `/api/admin/ritual-bookings/${testRitual1.id}/status`,
      body: {
        bookingStatus: "Cancelled",
        notes: "Cancelled upon customer request via telephone.",
      },
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.bookingStatus, "Cancelled");
    assert.strictEqual(res.data.data.notes, "Cancelled upon customer request via telephone.");
  });

  await test("2.11 Terminal state guard: Cannot modify a Cancelled booking", async () => {
    const res = await request({
      method: "PATCH",
      path: `/api/admin/ritual-bookings/${testRitual1.id}/status`,
      body: { bookingStatus: "Confirmed" },
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes("Cancelled bookings cannot be modified"));
  });

  await test("2.12 Valid transition: Transition Confirmed ritual booking to Completed", async () => {
    const res = await request({
      method: "PATCH",
      path: `/api/admin/ritual-bookings/${testRitual2.id}/status`,
      body: { bookingStatus: "Completed" },
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.bookingStatus, "Completed");
  });

  // ============================================================================
  // SECTION 3: COMMUNITY PUJA ADMIN APIs
  // ============================================================================
  console.log("\n--- Section 3: Community Puja Admin APIs ---");

  await test("3.1 Admin list community puja bookings with pagination", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/community-puja-bookings?limit=10&page=1",
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(typeof res.data.total, "number");
    assert.ok(Array.isArray(res.data.data));
  });

  if (testCommunityBooking) {
    await test("3.2 Search community puja booking by reference", async () => {
      const res = await request({
        method: "GET",
        path: `/api/admin/community-puja-bookings?search=${testCommunityBooking.bookingReference}`,
        headers: adminHeaders,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.count, 1);
      assert.strictEqual(res.data.data[0].customer.name, "Vikramaditya Verma");
      assert.strictEqual(res.data.data[0].puja.name, testPuja.name);
    });

    await test("3.3 Get community puja booking detail by UUID", async () => {
      const res = await request({
        method: "GET",
        path: `/api/admin/community-puja-bookings/${testCommunityBooking.id}`,
        headers: adminHeaders,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      const b = res.data.data;
      assert.strictEqual(b.id, testCommunityBooking.id);
      assert.strictEqual(b.customer.phone, "9988776655");
      assert.strictEqual(b.devoteeCount, 1);
      assert.strictEqual(b.paymentGateway, "Not Integrated");
    });
  }

  await test("3.4 Return 404 for non-existent community puja booking", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/community-puja-bookings/00000000-0000-0000-0000-888888888888",
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 404);
  });

  // ============================================================================
  // SECTION 4: UNIFIED ALL BOOKINGS API (/api/admin/bookings/all)
  // ============================================================================
  console.log("\n--- Section 4: Unified All Bookings API ---");

  await test("4.1 Unified listing returns records across all three systems", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/bookings/all?limit=50",
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.total > 0, "Expected non-zero total records");
    assert.ok(Array.isArray(res.data.data));

    // Verify all source types exist or can be identified
    const sourceTypes = new Set(res.data.data.map((r) => r.sourceType));
    assert.ok(sourceTypes.has("RITUAL"), "Expected RITUAL in unified list");

    // Verify contract fields on first item
    const first = res.data.data[0];
    assert.ok(first.sourceType, "sourceType required");
    assert.ok(first.recordId, "recordId required");
    assert.ok(first.bookingReference, "bookingReference required");
    assert.strictEqual(typeof first.amount, "number");
    assert.ok(first.bookingStatus, "bookingStatus required");
    assert.ok(first.paymentStatus, "paymentStatus required");
    assert.ok(first.createdAt, "createdAt required");
  });

  await test("4.2 Filter unified list by sourceType=RITUAL", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/bookings/all?sourceType=RITUAL",
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.length > 0);
    res.data.data.forEach((r) => {
      assert.strictEqual(r.sourceType, "RITUAL");
      assert.ok(["PUJA", "YAGYA", "HOMA", "JAPA", "PATH"].includes(r.serviceCategory));
    });
  });

  await test("4.3 Filter unified list by sourceType=CONSULTATION", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/bookings/all?sourceType=CONSULTATION",
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    res.data.data.forEach((r) => {
      assert.strictEqual(r.sourceType, "CONSULTATION");
      assert.strictEqual(r.serviceCategory, "CONSULTATION");
    });
  });

  await test("4.4 Search across unified list by customer name", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/bookings/all?search=Suresh",
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.length >= 1);
    const found = res.data.data.find((b) => b.customerName === "Suresh Sharma");
    assert.ok(found, "Expected Suresh Sharma in unified search results");
    assert.strictEqual(found.sourceType, "RITUAL");
  });

  await test("4.5 Reject invalid sourceType in unified endpoint", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/bookings/all?sourceType=INVALID_TYPE",
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes("Invalid sourceType"));
  });

  await test("4.6 Alias /api/admin/bookings routes identically to /api/admin/bookings/all", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/bookings?limit=5",
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.length <= 5);
  });

  // ============================================================================
  // SECTION 5: REGRESSION TESTS FOR EXISTING FUNCTIONALITY
  // ============================================================================
  console.log("\n--- Section 5: Regression Tests for Existing APIs ---");

  await test("5.1 Astrologer Consultation Admin API (/api/bookings/admin) remains functional", async () => {
    const res = await request({
      method: "GET",
      path: "/api/bookings/admin?limit=10",
      headers: adminHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(typeof res.data.total, "number");
  });

  await test("5.2 Public Ritual Price Calculation (/api/ritual-bookings/calculate-price) remains functional", async () => {
    const res = await request({
      method: "POST",
      path: "/api/ritual-bookings/calculate-price",
      body: {
        serviceType: "HOMA",
        serviceSlug: "maha-mrityunjaya-homa",
        havanCount: 1,
        days: 1,
        panditCount: 2,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.totalAmount > 0);
  });

  await test("5.3 Public Ritual Booking Status Recovery (/api/payments/booking-status/:ref) remains functional", async () => {
    const res = await request({
      method: "GET",
      path: `/api/payments/booking-status/${testRitualRef2}`,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.bookingReference, testRitualRef2);
    assert.strictEqual(res.data.data.paymentStatus, "Paid");
  });

  await test("5.4 Cashfree Webhook Signature Check rejects forged requests", async () => {
    const res = await request({
      method: "POST",
      path: "/api/payments/webhook",
      body: { event: "TEST_FORGERY" },
      headers: {
        "x-webhook-signature": "forged_signature_hex",
        "x-webhook-timestamp": "1234567890",
      },
    });
    assert.strictEqual(res.status, 401, "Expected 401 for invalid signature");
  });

  // ============================================================================
  // SUMMARY & CLEANUP
  // ============================================================================
  console.log("\n================================================================");
  console.log(`TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================\n");

  // Cleanup test artifacts
  if (createdTestRitualIds.length > 0) {
    await RitualBooking.destroy({ where: { id: createdTestRitualIds } });
  }
  if (createdTestCommunityBookingIds.length > 0) {
    await PujaBooking.destroy({ where: { id: createdTestCommunityBookingIds } });
  }
  if (createdTestUserIds.length > 0) {
    await User.destroy({ where: { id: createdTestUserIds } });
  }

  return { passed, failed };
}

// Start HTTP server and execute tests
async function main() {
  console.log("Starting test server...");
  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`Server listening at ${baseUrl}`);
      resolve();
    });
  });

  try {
    const results = await runPhase1UnifiedBookingTests();
    server.close();
    process.exit(results.failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("Test runner crashed:", err);
    server.close();
    process.exit(1);
  }
}

main();
