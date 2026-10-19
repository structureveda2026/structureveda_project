const assert = require("assert");

async function runBookNowFlowVerification() {
  console.log("==================================================================");
  console.log("   VEDA STRUCTURE: BOOK NOW FLOW & COMPONENT VERIFICATION         ");
  console.log("==================================================================");

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] Test ${total}: ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] Test ${total}: ${name}`);
      console.error("       Error:", err.message);
    }
  }

  const BASE_URL = "http://localhost:5000/api";

  // -------------------------------------------------------------------------
  // Test 1: Astrologer Catalogue Endpoint
  // -------------------------------------------------------------------------
  await test("GET /api/astrologers returns active astrologers with starting prices", async () => {
    const res = await fetch(`${BASE_URL}/astrologers`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert(Array.isArray(body.data) && body.data.length >= 2, "Expected at least 2 astrologers");
    const vishal = body.data.find(a => a.slug === "vishal-bhardwaj");
    assert(vishal, "Vishal Bhardwaj must exist in listing");
    assert.strictEqual(vishal.code, "ast-vishal");
  });

  // -------------------------------------------------------------------------
  // Test 2: Astrologer By Slug Endpoint (Vishal Bhardwaj)
  // -------------------------------------------------------------------------
  await test("GET /api/astrologers/vishal-bhardwaj returns 200 with full profile and packages", async () => {
    const res = await fetch(`${BASE_URL}/astrologers/vishal-bhardwaj`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.slug, "vishal-bhardwaj");
    assert.strictEqual(body.data.name, "Vishal Bhardwaj");
    assert(Array.isArray(body.data.packages) && body.data.packages.length > 0, "Packages must be populated");
    assert(Array.isArray(body.data.availableTimeSlots) && body.data.availableTimeSlots.length > 0, "Time slots must be populated");
  });

  // -------------------------------------------------------------------------
  // Test 3: Astrologer Packages Endpoint
  // -------------------------------------------------------------------------
  await test("GET /api/astrologers/vishal-bhardwaj/packages returns active packages", async () => {
    const res = await fetch(`${BASE_URL}/astrologers/vishal-bhardwaj/packages`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert(Array.isArray(body.data) && body.data.length >= 4, "Expected at least 4 packages");
    assert(body.data.some(p => p.price > 0), "Packages must have valid prices");
  });

  // -------------------------------------------------------------------------
  // Test 4: Astrologer Slots Endpoint
  // -------------------------------------------------------------------------
  await test("GET /api/astrologers/vishal-bhardwaj/slots returns available consultation time slots", async () => {
    const res = await fetch(`${BASE_URL}/astrologers/vishal-bhardwaj/slots`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert(Array.isArray(body.data.availableTimeSlots) && body.data.availableTimeSlots.length > 0);
  });

  // -------------------------------------------------------------------------
  // Test 5: Booking Creation Form Validation (Invalid Payload)
  // -------------------------------------------------------------------------
  await test("POST /api/bookings rejects invalid payloads with 400 Bad Request", async () => {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: "" }),
    });
    assert.strictEqual(res.status, 400, `Expected 400 for empty form submission, got ${res.status}`);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });

  // -------------------------------------------------------------------------
  // Test 6: Booking Creation (Valid Payload)
  // -------------------------------------------------------------------------
  let createdBookingRef = null;
  await test("POST /api/bookings successfully creates a Pending booking", async () => {
    const futureDate = "2027-12-01"; // safely distant future date
    const testPayload = {
      astrologerId: "ast-vishal",
      astrologerName: "Vishal Bhardwaj",
      packageId: "essential",
      packageName: "Essential Vedic Clarity",
      duration: "30 Minutes",
      amount: 1100,
      fullName: "Test Verification Seeker",
      gender: "Male",
      dateOfBirth: "1995-05-15",
      timeOfBirth: "10:30 AM",
      placeOfBirth: "Varanasi, UP",
      reportLanguage: "Hindi (हिंदी)",
      phone: "9876543210",
      email: "test.seeker@example.com",
      consultationDate: futureDate,
      consultationTime: "10:00 AM - 10:30 AM",
      consultationMode: "Video Call (Google Meet / Zoom)",
      selectedTopics: ["Career & Job Growth"],
    };

    const res = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
    });

    const body = await res.json();
    assert(res.status === 201 || res.status === 200, `Expected 201/200, got ${res.status}: ${JSON.stringify(body)}`);
    assert.strictEqual(body.success, true);
    assert(body.data && body.data.bookingReference, "Must return bookingReference");
    assert.strictEqual(body.data.bookingStatus, "Pending");
    assert.strictEqual(body.data.paymentStatus, "Pending");
    createdBookingRef = body.data.bookingReference;
  });

  // -------------------------------------------------------------------------
  // Test 7: Payment Booking Status Recovery
  // -------------------------------------------------------------------------
  await test("GET /api/payments/booking-status/:ref returns booking recovery status", async () => {
    assert(createdBookingRef, "Must have created booking reference from previous test");
    const res = await fetch(`${BASE_URL}/payments/booking-status/${createdBookingRef}`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.bookingReference, createdBookingRef);
    assert.strictEqual(body.data.bookingStatus, "Pending");
    assert.strictEqual(body.data.paymentStatus, "Pending");
  });

  // -------------------------------------------------------------------------
  // Test 8: AST Verification of React Booking Components
  // -------------------------------------------------------------------------
  await test("AST check confirms zero undeclared identifiers in VishalBooking.jsx", async () => {
    const fs = require("fs");
    const { parse } = await import("@babel/parser");
    const traverseMod = await import("@babel/traverse");
    const traverse = traverseMod.default?.default || traverseMod.default || traverseMod;

    const code = fs.readFileSync("./src/features/astrologers/pages/VishalBooking.jsx", "utf8");
    const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
    const globals = new Set([
      "console", "window", "localStorage", "setInterval", "clearInterval",
      "Math", "String", "Number", "Boolean", "Date", "Intl", "encodeURIComponent",
      "setTimeout", "clearTimeout", "document", "IntersectionObserver"
    ]);

    const undeclared = [];
    traverse(ast, {
      ReferencedIdentifier(idPath) {
        const name = idPath.node.name;
        if (!idPath.scope.hasBinding(name) && !globals.has(name)) {
          undeclared.push({ name, line: idPath.node.loc.start.line });
        }
      }
    });

    assert.strictEqual(undeclared.length, 0, `Found undeclared identifiers: ${JSON.stringify(undeclared)}`);
  });

  console.log("\n==================================================================");
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log("==================================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

runBookNowFlowVerification().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
