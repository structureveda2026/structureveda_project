require('C:/Users/shiva/Desktop/FreeLance_veda/backend/node_modules/dotenv').config({ path: 'C:/Users/shiva/Desktop/FreeLance_veda/backend/.env' });
const http = require('http');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Load database & models
const db = require('C:/Users/shiva/Desktop/FreeLance_veda/backend/src/models/index.js').default;
const {
  RitualBooking,
  PujaService,
  YagyaService,
  JapaService,
  UpcomingPuja,
} = db;

const {
  resolveBookingEntity,
  BOOKING_TYPES,
} = require('C:/Users/shiva/Desktop/FreeLance_veda/backend/src/services/bookingResolver.service.js');

const app = require('C:/Users/shiva/Desktop/FreeLance_veda/backend/src/app.js').default;

let server;
let port;
let baseUrl;

// Helper to make HTTP requests
const request = ({ method, path, body, headers = {} }) => {
  return new Promise((resolve, reject) => {
    const jsonBody = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (jsonBody) {
      reqHeaders['Content-Length'] = Buffer.byteLength(jsonBody);
    }

    const req = http.request(
      `${baseUrl}${path}`,
      {
        method,
        headers: reqHeaders,
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
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

    req.on('error', reject);
    if (jsonBody) req.write(jsonBody);
    req.end();
  });
};

const createdTestBookingReferences = [];

async function runJ3C1Verification() {
  console.log('================================================================');
  console.log('PHASE J3-C1: JAPA BOOKING CREATION & PAYMENT HANDOFF TEST SUITE');
  console.log('================================================================\n');

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

  // Frontend files to inspect
  const contextPath = path.join(__dirname, 'src/features/yagyaPuja/context/RitualBookingContext.jsx');
  const contextContent = fs.readFileSync(contextPath, 'utf-8');

  const ritualServicePath = path.join(__dirname, 'src/services/ritualBookingService.js');
  const ritualServiceContent = fs.readFileSync(ritualServicePath, 'utf-8');

  let japaService = null;
  let createdJapaRef = null;
  let createdJapaBooking = null;

  // Setup: Find active Japa service
  japaService = await JapaService.findOne({ where: { isActive: true } });
  assert.ok(japaService, 'At least one active Japa service must exist in DB');

  // ---------------------------------------------------------------------------
  // 1. Japa Review creates booking
  // ---------------------------------------------------------------------------
  await test('1. Japa Review creates booking', async () => {
    const commencementDate = '2026-10-15';
    const japaCount = japaService.availableCounts?.[0] || 11000;
    const panditCount = japaService.recommendedPandits || 2;
    const dailyCap = japaService.dailyCapacityPerPandit || 2000;
    const reqDays = Math.ceil(japaCount / (panditCount * dailyCap));
    const completionD = new Date(commencementDate);
    completionD.setDate(completionD.getDate() + (reqDays - 1));
    const completionDate = completionD.toISOString().split('T')[0];

    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'JAPA',
        serviceId: japaService.id,
        serviceSlug: japaService.slug,
        configuration: {
          commencementDate,
          date: commencementDate,
          timeSlot: '06:00 AM',
          japaCount,
          panditCount,
          requiredDays: reqDays,
          completionDate,
          dailyHours: '4 Hours / Day',
          arrangementMode: 'kashi',
        },
        location: {
          locationType: 'kashi',
          venueDetails: {},
        },
        yajman: {
          name: 'Shri Shivam Devotee',
          mobile: '9876543210',
          email: 'shivam.devotee@example.com',
        },
        sankalp: {
          purpose: 'Spiritual liberation and divine peace',
          mainIntention: 'Mantra chanting',
        },
        familyMembers: [],
        addons: [],
      },
    });

    assert.strictEqual(res.status, 201, 'Booking creation should return 201');
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data?.bookingReference, 'bookingReference must be returned');
    createdJapaBooking = res.data.data;
    createdJapaRef = createdJapaBooking.bookingReference;
    createdTestBookingReferences.push(createdJapaRef);
  });

  // ---------------------------------------------------------------------------
  // 2. Booking request contains serviceType JAPA
  // ---------------------------------------------------------------------------
  await test('2. booking request contains serviceType JAPA', async () => {
    assert.strictEqual(createdJapaBooking.serviceType, 'JAPA');
    const dbRecord = await RitualBooking.findOne({ where: { bookingReference: createdJapaRef } });
    assert.ok(dbRecord, 'DB record must exist');
    assert.strictEqual(dbRecord.serviceType, 'JAPA');
    assert.ok(contextContent.includes('serviceType: "JAPA"'), 'Frontend must send serviceType JAPA');
  });

  // ---------------------------------------------------------------------------
  // 3. Backend returns VEDA-JAPA reference
  // ---------------------------------------------------------------------------
  await test('3. backend returns VEDA-JAPA reference', async () => {
    assert.ok(
      createdJapaRef.startsWith('VEDA-JAPA-'),
      `Reference must start with VEDA-JAPA-, got: ${createdJapaRef}`
    );
    const suffix = createdJapaRef.replace('VEDA-JAPA-', '');
    assert.strictEqual(suffix.length, 8, `Suffix must be 8 chars, got: ${suffix}`);
  });

  // ---------------------------------------------------------------------------
  // 4. Frontend does not generate the booking reference
  // ---------------------------------------------------------------------------
  await test('4. frontend does not generate the booking reference', async () => {
    // Assert frontend RitualBookingContext receives bookingReference from server
    assert.ok(
      contextContent.includes('const createRes = await ritualBookingService.createRitualBooking(payload)'),
      'Frontend must await server response from createRitualBooking'
    );
    assert.ok(
      contextContent.includes('activeBookingRef = createdData?.bookingReference'),
      'Frontend must assign activeBookingRef from server createdData'
    );
    // Ensure frontend does not invoke a local reference generator
    assert.ok(
      !contextContent.includes('generateUniqueBookingReference'),
      'Frontend must NOT have local generateUniqueBookingReference'
    );
  });

  // ---------------------------------------------------------------------------
  // 5. Payment order uses the existing generic payment flow
  // ---------------------------------------------------------------------------
  let paymentSessionId = null;
  await test('5. payment order uses the existing generic payment flow', async () => {
    assert.ok(
      ritualServiceContent.includes('export const createPaymentOrder = async (bookingReference) => {'),
      'ritualBookingService must export createPaymentOrder'
    );
    assert.ok(
      ritualServiceContent.includes('api.post("/payments/create-order", { bookingReference })'),
      'createPaymentOrder must call generic /payments/create-order endpoint'
    );

    const res = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: {
        bookingReference: createdJapaRef,
      },
    });

    assert.strictEqual(res.status, 200, 'create-order must return 200');
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.bookingReference, createdJapaRef);
    assert.ok(res.data.data.paymentSessionId, 'paymentSessionId must be present');
    paymentSessionId = res.data.data.paymentSessionId;
  });

  // ---------------------------------------------------------------------------
  // 6. VEDA-JAPA resolves through existing booking resolver
  // ---------------------------------------------------------------------------
  await test('6. VEDA-JAPA resolves through existing booking resolver', async () => {
    const adapter = await resolveBookingEntity(createdJapaRef);
    assert.ok(adapter, 'Adapter must resolve for VEDA-JAPA reference');
    assert.strictEqual(adapter.type, BOOKING_TYPES.RITUAL);
    assert.strictEqual(adapter.reference, createdJapaRef);
    assert.strictEqual(adapter.entity.serviceType, 'JAPA');
    assert.ok(adapter.returnUrl.includes('/yagya-puja/japa/'), 'Adapter returnUrl must route to japa');
  });

  // ---------------------------------------------------------------------------
  // 7. Payment amount comes from backend booking state
  // ---------------------------------------------------------------------------
  await test('7. payment amount comes from backend booking state', async () => {
    const dbRecord = await RitualBooking.findOne({ where: { bookingReference: createdJapaRef } });
    assert.ok(dbRecord, 'DB record must exist');
    const authoritativeAmount = Number(dbRecord.totalAmount);
    assert.ok(authoritativeAmount > 0, 'Authoritative amount must be positive');

    // Attempting to send manipulated client amounts in create-order is ignored
    const res = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: {
        bookingReference: createdJapaRef,
        amount: 1, // Manipulated
        orderAmount: 1, // Manipulated
      },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(
      res.data.data.orderAmount,
      authoritativeAmount,
      `Payment order amount must equal backend authoritative amount (₹${authoritativeAmount}), not ₹1`
    );
  });

  // ---------------------------------------------------------------------------
  // 8. Duplicate create-order protection works
  // ---------------------------------------------------------------------------
  await test('8. duplicate create-order protection works', async () => {
    const res1 = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: { bookingReference: createdJapaRef },
    });
    assert.strictEqual(res1.status, 200);
    assert.strictEqual(res1.data.success, true);
    assert.strictEqual(res1.data.reused, true, 'Subsequent request must reuse active session');
    assert.ok(res1.data.data.paymentSessionId, 'Session ID must be returned');

    const res2 = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: { bookingReference: createdJapaRef },
    });
    assert.strictEqual(res2.status, 200);
    assert.strictEqual(res2.data.success, true);
    assert.strictEqual(res2.data.reused, true, 'Subsequent request must reuse active session');
    assert.ok(res2.data.data.paymentSessionId, 'Session ID must be returned');

    // Verify in database that only ONE booking record exists with this reference
    const count = await RitualBooking.count({ where: { bookingReference: createdJapaRef } });
    assert.strictEqual(count, 1, 'Only 1 database booking record should exist');
  });

  // ---------------------------------------------------------------------------
  // 9. paymentSessionId is returned
  // ---------------------------------------------------------------------------
  await test('9. paymentSessionId is returned', async () => {
    assert.ok(paymentSessionId, 'paymentSessionId must be truthy');
    assert.strictEqual(typeof paymentSessionId, 'string');
    assert.ok(paymentSessionId.length > 10, 'paymentSessionId must be valid string');
  });

  // ---------------------------------------------------------------------------
  // 10. Existing Cashfree checkout path receives the Japa payment session
  // ---------------------------------------------------------------------------
  await test('10. existing Cashfree checkout path receives the Japa payment session', async () => {
    assert.ok(
      contextContent.includes('const checkoutResult = await cashfree.checkout({'),
      'Context must call cashfree.checkout'
    );
    assert.ok(
      contextContent.includes('paymentSessionId: sessionId'),
      'cashfree.checkout must receive paymentSessionId: sessionId'
    );
    assert.ok(
      contextContent.includes('redirectTarget: "_modal"'),
      'cashfree.checkout must use modal redirect target'
    );
  });

  // ---------------------------------------------------------------------------
  // 11. Existing Puja payment flow still works
  // ---------------------------------------------------------------------------
  await test('11. existing Puja payment flow still works', async () => {
    const puja = await PujaService.findOne({ where: { isActive: true } });
    assert.ok(puja, 'Active Puja service must exist');

    const durHours = Array.isArray(puja.durationHours) ? puja.durationHours[0] : 2;
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'PUJA',
        serviceId: puja.id,
        serviceSlug: puja.slug,
        configuration: {
          date: '2026-10-20',
          timeSlot: '08:00 AM',
          durationSelected: `${durHours} Hours`,
          durationHours: durHours,
          panditCount: 1,
          arrangementMode: 'remote',
        },
        location: { locationType: 'remote', venueDetails: {} },
        yajman: { name: 'Puja Regression Devotee', mobile: '9888877777', email: 'reg@example.com' },
        sankalp: { purpose: 'Spiritual Peace', mainIntention: 'Peace' },
        familyMembers: [],
        addons: [],
      },
    });

    assert.strictEqual(res.status, 201, `Puja booking creation failed: ${JSON.stringify(res.data)}`);
    const pujaRef = res.data.data.bookingReference;
    assert.ok(pujaRef.startsWith('VEDA-PUJA-'));
    createdTestBookingReferences.push(pujaRef);

    const orderRes = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: { bookingReference: pujaRef },
    });
    assert.strictEqual(orderRes.status, 200);
    assert.ok(orderRes.data.data.paymentSessionId);
  });

  // ---------------------------------------------------------------------------
  // 12. Existing Yagya payment flow still works
  // ---------------------------------------------------------------------------
  await test('12. existing Yagya payment flow still works', async () => {
    const yagya = await YagyaService.findOne({ where: { isActive: true } });
    assert.ok(yagya, 'Active Yagya service must exist');

    const tier = Array.isArray(yagya.pricingTiers) && yagya.pricingTiers.length > 0
      ? yagya.pricingTiers[0]
      : { days: 3, panditCount: yagya.panditRequirement?.minPandits || 3 };
    const days = Number(tier.days) || 3;
    const dailyHours = Number(yagya.dailyRitualHours) || 4;
    const panditCount = Number(tier.panditCount) || Number(yagya.panditRequirement?.minPandits) || 3;
    const startDate = '2026-10-22';
    const completionD = new Date(startDate);
    completionD.setDate(completionD.getDate() + (days - 1));
    const completionDate = completionD.toISOString().split('T')[0];

    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'YAGYA',
        serviceId: yagya.id,
        serviceSlug: yagya.slug,
        configuration: {
          date: startDate,
          timeSlot: '07:00 AM',
          days,
          dailyHours,
          durationHours: days * dailyHours,
          durationSelected: `${days} Days`,
          panditCount,
          arrangementMode: 'kashi',
          completionDate,
        },
        location: { locationType: 'kashi', venueDetails: {} },
        yajman: { name: 'Yagya Devotee', mobile: '9876543210', email: 'yagya@example.com' },
        sankalp: { purpose: 'Yagya blessings', mainIntention: 'Yagya' },
        familyMembers: [],
        addons: [],
      },
    });

    assert.strictEqual(res.status, 201, `Yagya booking creation failed: ${JSON.stringify(res.data)}`);
    const yagyaRef = res.data.data.bookingReference;
    assert.ok(yagyaRef.startsWith('VEDA-YAGYA-'));
    createdTestBookingReferences.push(yagyaRef);

    const orderRes = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: { bookingReference: yagyaRef },
    });
    assert.strictEqual(orderRes.status, 200);
    assert.ok(orderRes.data.data.paymentSessionId);
  });

  // ---------------------------------------------------------------------------
  // 13. Upcoming Puja remains unaffected
  // ---------------------------------------------------------------------------
  await test('13. Upcoming Puja remains unaffected', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/upcoming-pujas',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));
  });

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED OUT OF 13 TESTS`);
  console.log('================================================================\n');

  // Clean up created test bookings
  if (createdTestBookingReferences.length > 0) {
    console.log(`Cleaning up ${createdTestBookingReferences.length} temporary test booking(s)...`);
    for (const ref of createdTestBookingReferences) {
      await RitualBooking.destroy({ where: { bookingReference: ref }, force: true });
    }
    console.log('Cleanup completed successfully.\n');
  }

  server.close();
  if (failed > 0) {
    process.exit(1);
  }
}

// Start ephemeral server & run suite
server = http.createServer(app);
server.listen(0, async () => {
  port = server.address().port;
  baseUrl = `http://localhost:${port}`;
  try {
    await runJ3C1Verification();
  } catch (err) {
    console.error('Fatal test runner error:', err);
    server.close();
    process.exit(1);
  }
});
