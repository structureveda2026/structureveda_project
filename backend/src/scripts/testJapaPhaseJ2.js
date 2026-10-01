import assert from "node:assert";
import http from "node:http";
import app from "../app.js";
import db, { RitualBooking, JapaService, PujaService, YagyaService } from "../models/index.js";
import { resolveBookingEntity, parseBookingReference } from "../services/bookingResolver.service.js";

const runTests = async () => {
  console.log("==================================================");
  console.log("STARTING JAPA PHASE J2 & REGRESSION TEST SUITE");
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

  // Test 1: Japa calculate-price returns 200
  await test("1. Japa calculate-price returns 200", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "JAPA",
        serviceSlug: "maha-mrityunjaya-japa",
        japaCount: 11000,
        panditCount: 2,
        commencementDate: "2026-10-15",
      }),
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.serviceType, "JAPA");
  });

  // Test 2: Valid 11,000 Japa calculation
  await test("2. Valid 11,000 Japa calculation (₹18,000, 2 pandits, 3 days)", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "JAPA",
        serviceSlug: "maha-mrityunjaya-japa",
        japaCount: 11000,
        panditCount: 2,
        commencementDate: "2026-10-15",
      }),
    });
    const body = await res.json();
    const data = body.data;
    assert.strictEqual(data.japaCount, 11000);
    assert.strictEqual(data.panditCount, 2);
    assert.strictEqual(data.dailyCapacityPerPandit, 2000);
    assert.strictEqual(data.totalDailyCapacity, 4000);
    assert.strictEqual(data.requiredDays, 3);
    assert.strictEqual(data.basePrice, 18000);
    assert.strictEqual(data.totalAmount, 18000);
    assert.strictEqual(data.pricingSource, "JAPA_VARIANT_PRICING");
    assert.strictEqual(data.commencementDate, "2026-10-15");
    assert.strictEqual(data.completionDate, "2026-10-17");
  });

  // Test 3: Valid 21,000 Japa calculation
  await test("3. Valid 21,000 Japa calculation (₹28,000, 3 pandits, 4 days)", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "JAPA",
        serviceSlug: "maha-mrityunjaya-japa",
        japaCount: 21000,
        panditCount: 3,
        commencementDate: "2026-10-15",
      }),
    });
    const body = await res.json();
    const data = body.data;
    assert.strictEqual(data.japaCount, 21000);
    assert.strictEqual(data.panditCount, 3);
    assert.strictEqual(data.totalDailyCapacity, 6000);
    assert.strictEqual(data.requiredDays, 4);
    assert.strictEqual(data.basePrice, 28000);
    assert.strictEqual(data.totalAmount, 28000);
    assert.strictEqual(data.completionDate, "2026-10-18");
  });

  // Test 4: Valid 51,000 Japa calculation
  await test("4. Valid 51,000 Japa calculation (₹52,000, 4 pandits, 6 days)", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "JAPA",
        serviceSlug: "maha-mrityunjaya-japa",
        japaCount: 51000,
        panditCount: 4,
        commencementDate: "2026-10-15",
      }),
    });
    const body = await res.json();
    const data = body.data;
    assert.strictEqual(data.japaCount, 51000);
    assert.strictEqual(data.panditCount, 4);
    assert.strictEqual(data.dailyCapacityPerPandit, 2200);
    assert.strictEqual(data.totalDailyCapacity, 8800);
    assert.strictEqual(data.requiredDays, 6);
    assert.strictEqual(data.basePrice, 52000);
    assert.strictEqual(data.totalAmount, 52000);
    assert.strictEqual(data.completionDate, "2026-10-20");
  });

  // Test 5: Valid 1,25,000 Japa calculation
  await test("5. Valid 1,25,000 Japa calculation (₹95,000, 6 pandits, 10 days)", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "JAPA",
        serviceSlug: "maha-mrityunjaya-japa",
        japaCount: 125000,
        panditCount: 6,
        commencementDate: "2026-10-15",
      }),
    });
    const body = await res.json();
    const data = body.data;
    assert.strictEqual(data.japaCount, 125000);
    assert.strictEqual(data.panditCount, 6);
    assert.strictEqual(data.dailyCapacityPerPandit, 2200);
    assert.strictEqual(data.totalDailyCapacity, 13200);
    assert.strictEqual(data.requiredDays, 10);
    assert.strictEqual(data.basePrice, 95000);
    assert.strictEqual(data.totalAmount, 95000);
    assert.strictEqual(data.completionDate, "2026-10-24");
  });

  // Test 6: Unsupported Japa count returns 400
  await test("6. Unsupported Japa count returns 400", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "JAPA",
        serviceSlug: "maha-mrityunjaya-japa",
        japaCount: 25000,
        panditCount: 2,
      }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.ok(body.message.includes("Unsupported Japa count: 25000"));
  });

  // Test 7: Pandit count below minimum returns 400
  await test("7. Pandit count below minimum returns 400", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "JAPA",
        serviceSlug: "maha-mrityunjaya-japa",
        japaCount: 11000,
        panditCount: 1, // Minimum is 2
      }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.ok(body.message.includes("below the required minimum"));
  });

  // Test 8: Pandit count above maximum returns 400
  await test("8. Pandit count above maximum returns 400", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "JAPA",
        serviceSlug: "maha-mrityunjaya-japa",
        japaCount: 11000,
        panditCount: 20, // Maximum is 11
      }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.ok(body.message.includes("exceeds the maximum allowed limit"));
  });

  // Test 9: Required days are calculated mathematically
  await test("9. Required days are calculated mathematically based on pandits", async () => {
    // 11000 with 2 pandits (capacity 2000 each) => total daily 4000 => CEILING(11000/4000) = 3 days
    const res2 = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "JAPA",
        serviceSlug: "maha-mrityunjaya-japa",
        japaCount: 11000,
        panditCount: 2,
      }),
    });
    const body2 = await res2.json();
    assert.strictEqual(body2.data.requiredDays, 3);

    // 11000 with 3 pandits (capacity 2000 each) => total daily 6000 => CEILING(11000/6000) = 2 days
    const res3 = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "JAPA",
        serviceSlug: "maha-mrityunjaya-japa",
        japaCount: 11000,
        panditCount: 3,
      }),
    });
    const body3 = await res3.json();
    assert.strictEqual(body3.data.requiredDays, 2);
  });

  // Test 10: Completion date is calculated correctly
  await test("10. Completion date is calculated correctly (start + days - 1)", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "JAPA",
        serviceSlug: "maha-mrityunjaya-japa",
        japaCount: 11000,
        panditCount: 2,
        commencementDate: "2026-11-01",
      }),
    });
    const body = await res.json();
    // 3 days starting Nov 1 -> Nov 1, Nov 2, Nov 3 => 2026-11-03
    assert.strictEqual(body.data.completionDate, "2026-11-03");
  });

  // Test 11: Price comes from database variant configuration
  await test("11. Price comes from database variant configuration", async () => {
    const service = await JapaService.findOne({ where: { slug: "maha-mrityunjaya-japa" } });
    const variant11k = service.variants.find((v) => v.count === 11000);
    const res = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "JAPA",
        serviceSlug: "maha-mrityunjaya-japa",
        japaCount: 11000,
        panditCount: 2,
      }),
    });
    const body = await res.json();
    assert.strictEqual(body.data.basePrice, variant11k.startingPrice);
    assert.strictEqual(body.data.totalAmount, variant11k.startingPrice);
  });

  // Test 12: Client-supplied fake price is ignored
  await test("12. Client-supplied fake price is ignored in calculate-price", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "JAPA",
        serviceSlug: "maha-mrityunjaya-japa",
        japaCount: 11000,
        panditCount: 2,
        basePrice: 1,
        totalAmount: 1,
        startingPrice: 1,
      }),
    });
    const body = await res.json();
    assert.strictEqual(body.data.basePrice, 18000);
    assert.strictEqual(body.data.totalAmount, 18000);
  });

  let createdJapaBookingRef = null;

  // Test 13: Japa booking creation returns 201
  await test("13. Japa booking creation returns 201", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "JAPA",
        serviceSlug: "maha-mrityunjaya-japa",
        configuration: {
          commencementDate: "2026-10-15",
          timeSlot: "06:00 AM",
          japaCount: 11000,
          panditCount: 2,
          arrangementMode: "kashi",
        },
        location: {
          locationType: "kashi",
          venueDetails: { notes: "Manikarnika Ghat sacred hall" },
        },
        yajman: {
          name: "Amit Sharma",
          mobile: "9876543210",
          email: "amit.sharma@example.com",
          gotra: "Kashyap",
        },
        sankalp: {
          purpose: "Spiritual practice and family peace",
          mainIntention: "Ayur Arogya and Maha Mrityunjaya Anushthan",
        },
        familyMembers: [{ name: "Sunita Sharma", relation: "Wife" }],
        // Intentionally sending fake client price to verify requirement 15
        totalAmount: 1,
        basePrice: 1,
      }),
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.bookingReference);
    createdJapaBookingRef = body.data.bookingReference;
  });

  // Test 14: Booking reference begins with VEDA-JAPA-
  await test("14. Booking reference begins with VEDA-JAPA-", async () => {
    assert.ok(createdJapaBookingRef != null);
    assert.ok(createdJapaBookingRef.startsWith("VEDA-JAPA-"), `Expected VEDA-JAPA- prefix, got ${createdJapaBookingRef}`);
  });

  // Test 15: Booking is stored in ritual_bookings
  await test("15. Booking is stored in ritual_bookings table", async () => {
    const booking = await RitualBooking.findOne({ where: { bookingReference: createdJapaBookingRef } });
    assert.ok(booking != null, "Booking must exist in database");
    assert.strictEqual(booking.serviceSlug, "maha-mrityunjaya-japa");
  });

  // Test 16: serviceType is JAPA
  await test("16. serviceType is JAPA in database", async () => {
    const booking = await RitualBooking.findOne({ where: { bookingReference: createdJapaBookingRef } });
    assert.strictEqual(booking.serviceType, "JAPA");
    // Also verify fake client price was ignored
    assert.strictEqual(Number(booking.totalAmount), 18000);
    assert.strictEqual(Number(booking.basePrice), 18000);
  });

  // Test 17: Japa metadata is stored correctly
  await test("17. Japa metadata is stored correctly in sankalpDetails", async () => {
    const booking = await RitualBooking.findOne({ where: { bookingReference: createdJapaBookingRef } });
    const japaMeta = booking.sankalpDetails?.japaMetadata;
    assert.ok(japaMeta != null, "japaMetadata must be stored in sankalpDetails");
    assert.strictEqual(japaMeta.japaCount, 11000);
    assert.strictEqual(japaMeta.dailyCapacityPerPandit, 2000);
    assert.strictEqual(japaMeta.totalDailyCapacity, 4000);
    assert.strictEqual(japaMeta.panditCount, 2);
    assert.strictEqual(japaMeta.requiredDays, 3);
    assert.strictEqual(japaMeta.commencementDate, "2026-10-15");
    assert.strictEqual(japaMeta.completionDate, "2026-10-17");
    assert.strictEqual(japaMeta.pricingSource, "JAPA_VARIANT_PRICING");
  });

  // Test 18: Japa booking retrieval works
  await test("18. Japa booking retrieval works (GET /api/ritual-bookings/:bookingReference)", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings/${createdJapaBookingRef}`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.bookingReference, createdJapaBookingRef);
    assert.strictEqual(body.data.service.type, "JAPA");
    assert.strictEqual(body.data.service.slug, "maha-mrityunjaya-japa");
    assert.strictEqual(body.data.configuration.japaCount, 11000);
    assert.strictEqual(body.data.configuration.requiredDays, 3);
    assert.strictEqual(body.data.pricing.totalAmount, 18000);
  });

  // Test 19: Existing PUJA calculate-price still passes
  await test("19. Existing PUJA calculate-price still passes", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "PUJA",
        serviceSlug: "maha-mrityunjaya-puja",
        durationHours: 3,
        panditCount: 1,
      }),
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.serviceType, "PUJA");
    assert.strictEqual(body.data.basePrice, 1500);
    assert.strictEqual(body.data.totalAmount, 1500);
  });

  // Test 20: Existing YAGYA calculate-price still passes
  await test("20. Existing YAGYA calculate-price still passes", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "YAGYA",
        serviceSlug: "navagraha-shanti-maha-yagya",
        days: 3,
        panditCount: 7,
      }),
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.serviceType, "YAGYA");
    assert.strictEqual(body.data.basePrice, 25000);
    assert.strictEqual(body.data.totalAmount, 25000);
  });

  let createdPujaBookingRef = null;

  // Test 21: Existing PUJA booking creation still passes
  await test("21. Existing PUJA booking creation still passes", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "PUJA",
        serviceSlug: "maha-mrityunjaya-puja",
        configuration: {
          date: "2026-10-20",
          timeSlot: "08:00 AM",
          durationHours: 3,
          durationSelected: "3 Hours",
          panditCount: 1,
          arrangementMode: "kashi",
        },
        location: {
          locationType: "kashi",
          venueDetails: { notes: "Kashi Temple hall" },
        },
        yajman: {
          name: "Ramesh Gupta",
          mobile: "9876543211",
          email: "ramesh.gupta@example.com",
        },
        sankalp: {
          purpose: "Peace and good health",
        },
      }),
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.bookingReference.startsWith("VEDA-PUJA-"));
    createdPujaBookingRef = body.data.bookingReference;
  });

  let createdYagyaBookingRef = null;

  // Test 22: Existing YAGYA booking creation still passes
  await test("22. Existing YAGYA booking creation still passes", async () => {
    const res = await fetch(`${baseUrl}/api/ritual-bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "YAGYA",
        serviceSlug: "navagraha-shanti-maha-yagya",
        configuration: {
          date: "2026-10-22",
          timeSlot: "07:00 AM",
          days: 3,
          durationSelected: "3 Days",
          panditCount: 7,
          arrangementMode: "kashi",
        },
        location: {
          locationType: "kashi",
          venueDetails: { notes: "Yagya Shala Kashi" },
        },
        yajman: {
          name: "Suresh Verma",
          mobile: "9876543212",
          email: "suresh.verma@example.com",
        },
        sankalp: {
          purpose: "Navagraha Shanti",
        },
      }),
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.bookingReference.startsWith("VEDA-YAGYA-"));
    createdYagyaBookingRef = body.data.bookingReference;
  });

  // Test 23: Existing Cashfree resolver tests still pass
  await test("23. Cashfree resolver returns correct returnUrl for PUJA, YAGYA, and JAPA", async () => {
    const japaAdapter = await resolveBookingEntity(createdJapaBookingRef);
    assert.ok(japaAdapter.returnUrl.includes("/yagya-puja/japa/maha-mrityunjaya-japa/booking-status?order_id={order_id}"));

    const pujaAdapter = await resolveBookingEntity(createdPujaBookingRef);
    assert.ok(pujaAdapter.returnUrl.includes("/yagya-puja/puja/maha-mrityunjaya-puja/booking-status?order_id={order_id}"));

    const yagyaAdapter = await resolveBookingEntity(createdYagyaBookingRef);
    assert.ok(yagyaAdapter.returnUrl.includes("/yagya-puja/yagya/navagraha-shanti-maha-yagya/booking-status?order_id={order_id}"));
  });

  // Test 24: Existing Upcoming Puja API still passes
  await test("24. Existing Upcoming Puja API still passes", async () => {
    const res = await fetch(`${baseUrl}/api/upcoming-pujas`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  // Test 25: Health endpoint still passes
  await test("25. Health endpoint still passes", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  // Cleanup test bookings
  if (createdJapaBookingRef) await RitualBooking.destroy({ where: { bookingReference: createdJapaBookingRef } });
  if (createdPujaBookingRef) await RitualBooking.destroy({ where: { bookingReference: createdPujaBookingRef } });
  if (createdYagyaBookingRef) await RitualBooking.destroy({ where: { bookingReference: createdYagyaBookingRef } });

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
