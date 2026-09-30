require('dotenv').config({ path: __dirname + '/.env' });
const http = require('http');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Load database & models
const db = require('./src/models/index.js').default;
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
} = require('./src/services/bookingResolver.service.js');

const app = require('./src/app.js').default;

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

async function runJ3C2Verification() {
  console.log('================================================================');
  console.log('PHASE J3-C2: JAPA PAYMENT RETURN, RECOVERY & CONFIRMATION TEST SUITE');
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
  const frontendDir = path.resolve(__dirname, '../frontend-user1');
  const appRoutesPath = path.join(frontendDir, 'src/routes/AppRoutes.jsx');
  const appRoutesContent = fs.readFileSync(appRoutesPath, 'utf-8');

  const japaStatusPath = path.join(frontendDir, 'src/features/yagyaPuja/pages/JapaBookingStatus.jsx');
  const japaStatusContent = fs.readFileSync(japaStatusPath, 'utf-8');

  const confirmationPath = path.join(frontendDir, 'src/features/yagyaPuja/components/booking/RitualBookingConfirmation.jsx');
  const confirmationContent = fs.readFileSync(confirmationPath, 'utf-8');

  const contextPath = path.join(frontendDir, 'src/features/yagyaPuja/context/RitualBookingContext.jsx');
  const contextContent = fs.readFileSync(contextPath, 'utf-8');

  const ritualServicePath = path.join(frontendDir, 'src/services/ritualBookingService.js');
  const ritualServiceContent = fs.readFileSync(ritualServicePath, 'utf-8');

  let japaService = null;
  let testJapaBooking = null;
  let testJapaRef = null;

  // Setup: Find active Japa service
  japaService = await JapaService.findOne({ where: { isActive: true } });
  assert.ok(japaService, 'At least one active Japa service must exist in DB');

  // Seed a realistic Japa booking for payment recovery tests
  const commencementDate = '2026-10-20';
  const japaCount = japaService.availableCounts?.[0] || 51000;
  const panditCount = 3;
  const dailyCap = (japaService.dailyCapacityPerPandit || 5000) * panditCount;
  const reqDays = Math.ceil(japaCount / dailyCap) || 4;
  const compD = new Date(commencementDate);
  compD.setDate(compD.getDate() + (reqDays - 1));
  const completionDate = compD.toISOString().split('T')[0];

  const createRes = await request({
    method: 'POST',
    path: '/api/ritual-bookings',
    body: {
      serviceType: 'JAPA',
      serviceId: japaService.id,
      serviceSlug: japaService.slug,
      configuration: {
        commencementDate,
        date: commencementDate,
        timeSlot: '07:00 AM',
        japaCount,
        panditCount,
        totalDailyCapacity: dailyCap,
        requiredDays: reqDays,
        completionDate,
        dailyHours: '4 Hours / Day',
        arrangementMode: 'remote',
        mantra: japaService.mantra || 'Om Namah Shivaya',
      },
      location: {
        locationType: 'remote',
        venueDetails: {},
      },
      yajman: {
        name: 'Smt. Priya Sharma',
        mobile: '9876543210',
        email: 'priya.sharma@example.com',
      },
      sankalp: {
        purpose: 'Health, longevity, and peace',
        mainIntention: 'Maha Mrityunjaya Jaap',
      },
      familyMembers: [],
      addons: [],
    },
  });

  assert.strictEqual(createRes.status, 201, 'Setup: Japa booking creation failed');
  testJapaBooking = createRes.data.data;
  testJapaRef = testJapaBooking.bookingReference;
  createdTestBookingReferences.push(testJapaRef);

  // ---------------------------------------------------------------------------
  // 1. Japa booking-status route exists
  // ---------------------------------------------------------------------------
  await test('1. Japa booking-status route exists', async () => {
    assert.ok(
      appRoutesContent.includes('path="/yagya-puja/japa/:slug/booking-status"'),
      'AppRoutes must register /yagya-puja/japa/:slug/booking-status'
    );
    assert.ok(
      appRoutesContent.includes('import JapaBookingStatus from "../features/yagyaPuja/pages/JapaBookingStatus";'),
      'AppRoutes must import JapaBookingStatus'
    );
    assert.ok(fs.existsSync(japaStatusPath), 'JapaBookingStatus.jsx must exist');
  });

  // ---------------------------------------------------------------------------
  // 2. Japa booking reference can be recovered
  // ---------------------------------------------------------------------------
  await test('2. Japa booking reference can be recovered', async () => {
    // Verified in JapaBookingStatus: reads order_id, bookingReference, and localStorage
    assert.ok(
      japaStatusContent.includes('searchParams.get("order_id")'),
      'JapaBookingStatus must read order_id from URL'
    );
    assert.ok(
      japaStatusContent.includes('localStorage.getItem(RITUAL_STORAGE_KEY)'),
      'JapaBookingStatus must recover from localStorage'
    );
    assert.ok(
      japaStatusContent.includes('candidateRef'),
      'JapaBookingStatus must derive candidateRef'
    );
  });

  // ---------------------------------------------------------------------------
  // 3. VEDA-JAPA reference is recognized
  // ---------------------------------------------------------------------------
  await test('3. VEDA-JAPA reference is recognized', async () => {
    assert.ok(testJapaRef.startsWith('VEDA-JAPA-'), 'Reference must start with VEDA-JAPA-');
    const adapter = await resolveBookingEntity(testJapaRef);
    assert.ok(adapter, 'Adapter must resolve VEDA-JAPA reference');
    assert.strictEqual(adapter.reference, testJapaRef);
    assert.strictEqual(adapter.type, BOOKING_TYPES.RITUAL);
    assert.strictEqual(adapter.entity.serviceType, 'JAPA');
    assert.ok(contextContent.includes('!trimmedRef.startsWith("VEDA-JAPA-")'), 'Context must recognize VEDA-JAPA- prefix');
  });

  // ---------------------------------------------------------------------------
  // 4. Existing booking-status API is reused
  // ---------------------------------------------------------------------------
  await test('4. existing booking-status API is reused', async () => {
    assert.ok(
      japaStatusContent.includes('ritualBookingService.getBookingStatus(candidateRef)'),
      'JapaBookingStatus must call existing ritualBookingService.getBookingStatus'
    );

    const res = await request({
      method: 'GET',
      path: `/api/payments/booking-status/${testJapaRef}`,
    });

    assert.strictEqual(res.status, 200, 'Existing booking-status API should return 200');
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.bookingReference, testJapaRef);
    assert.strictEqual(res.data.data.serviceType, 'JAPA');
    assert.strictEqual(res.data.data.bookingStatus, 'Pending');
    assert.strictEqual(res.data.data.paymentStatus, 'Pending');
    assert.ok(Number(res.data.data.amount) > 0, 'Amount must be returned');
  });

  // ---------------------------------------------------------------------------
  // 5. Payment verification is server-authoritative
  // ---------------------------------------------------------------------------
  await test('5. payment verification is server-authoritative', async () => {
    assert.ok(
      japaStatusContent.includes('ritualBookingService.verifyPayment(orderId || candidateRef)'),
      'JapaBookingStatus must perform server-side verifyPayment'
    );

    // Call verify endpoint on pending booking without valid cashfree payment
    const res = await request({
      method: 'POST',
      path: '/api/payments/verify',
      body: {
        bookingReference: testJapaRef,
      },
    });

    // In sandbox without active cashfree order payment, verify returns 502/false but never falsely confirms
    assert.ok(
      res.data?.confirmed === false || res.status === 502 || res.status === 404,
      'Pending booking must never be marked confirmed without Cashfree verification'
    );
    const dbRecord = await RitualBooking.findOne({ where: { bookingReference: testJapaRef } });
    assert.strictEqual(dbRecord.bookingStatus, 'Pending', 'DB status must remain Pending');
  });

  // ---------------------------------------------------------------------------
  // 6. Successful payment reaches confirmation
  // ---------------------------------------------------------------------------
  await test('6. successful payment reaches confirmation', async () => {
    // Simulate server marking booking confirmed after valid payment
    await RitualBooking.update(
      {
        bookingStatus: 'Confirmed',
        paymentStatus: 'Paid',
        transactionId: 'CF_TEST_TXN_998877',
      },
      { where: { bookingReference: testJapaRef } }
    );

    // Verify endpoint handles already confirmed bookings safely and idempotently
    const verifyRes = await request({
      method: 'POST',
      path: '/api/payments/verify',
      body: {
        bookingReference: testJapaRef,
      },
    });

    assert.strictEqual(verifyRes.status, 200);
    assert.strictEqual(verifyRes.data.success, true);
    assert.strictEqual(verifyRes.data.confirmed, true);
    assert.strictEqual(verifyRes.data.data.paymentStatus, 'Paid');
    assert.strictEqual(verifyRes.data.data.bookingStatus, 'Confirmed');

    // Query status API
    const statusRes = await request({
      method: 'GET',
      path: `/api/payments/booking-status/${testJapaRef}`,
    });

    assert.strictEqual(statusRes.status, 200);
    assert.strictEqual(statusRes.data.data.paymentStatus, 'Paid');
    assert.strictEqual(statusRes.data.data.bookingStatus, 'Confirmed');
  });

  // ---------------------------------------------------------------------------
  // 7. Pending payment does not become confirmed
  // ---------------------------------------------------------------------------
  await test('7. pending payment does not become confirmed', async () => {
    // Reset booking to Pending
    await RitualBooking.update(
      {
        bookingStatus: 'Pending',
        paymentStatus: 'Pending',
      },
      { where: { bookingReference: testJapaRef } }
    );

    const statusRes = await request({
      method: 'GET',
      path: `/api/payments/booking-status/${testJapaRef}`,
    });

    assert.strictEqual(statusRes.data.data.bookingStatus, 'Pending');
    assert.strictEqual(statusRes.data.data.paymentStatus, 'Pending');
    assert.notStrictEqual(statusRes.data.data.bookingStatus, 'Confirmed');
  });

  // ---------------------------------------------------------------------------
  // 8. Failed payment does not become confirmed
  // ---------------------------------------------------------------------------
  await test('8. failed payment does not become confirmed', async () => {
    await RitualBooking.update(
      {
        bookingStatus: 'Cancelled',
        paymentStatus: 'Failed',
      },
      { where: { bookingReference: testJapaRef } }
    );

    const statusRes = await request({
      method: 'GET',
      path: `/api/payments/booking-status/${testJapaRef}`,
    });

    assert.strictEqual(statusRes.data.data.bookingStatus, 'Cancelled');
    assert.strictEqual(statusRes.data.data.paymentStatus, 'Failed');
    assert.notStrictEqual(statusRes.data.data.bookingStatus, 'Confirmed');
  });

  // ---------------------------------------------------------------------------
  // 9. Reload recovery works
  // ---------------------------------------------------------------------------
  await test('9. reload recovery works', async () => {
    // Put back in Pending
    await RitualBooking.update(
      {
        bookingStatus: 'Pending',
        paymentStatus: 'Pending',
      },
      { where: { bookingReference: testJapaRef } }
    );

    // Verify localStorage key is defined as veda_active_ritual_booking in both components
    assert.ok(
      contextContent.includes('const RITUAL_STORAGE_KEY = "veda_active_ritual_booking";'),
      'RitualBookingContext must use veda_active_ritual_booking'
    );
    assert.ok(
      japaStatusContent.includes('const RITUAL_STORAGE_KEY = "veda_active_ritual_booking";'),
      'JapaBookingStatus must use veda_active_ritual_booking'
    );

    // Call status endpoint with the stored reference
    const res = await request({
      method: 'GET',
      path: `/api/payments/booking-status/${testJapaRef}`,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.bookingReference, testJapaRef);
  });

  // ---------------------------------------------------------------------------
  // 10. Recovery does not create duplicate booking
  // ---------------------------------------------------------------------------
  await test('10. recovery does not create duplicate booking', async () => {
    const countBefore = await RitualBooking.count({
      where: { bookingReference: testJapaRef },
    });
    assert.strictEqual(countBefore, 1, 'Only one booking must exist initially');

    // Simulate recovery querying status
    await request({
      method: 'GET',
      path: `/api/payments/booking-status/${testJapaRef}`,
    });

    const countAfter = await RitualBooking.count({
      where: { bookingReference: testJapaRef },
    });
    assert.strictEqual(countAfter, 1, 'Recovery status check must never create duplicate booking');
  });

  // ---------------------------------------------------------------------------
  // 11. Retry does not create duplicate booking
  // ---------------------------------------------------------------------------
  await test('11. retry does not create duplicate booking', async () => {
    const totalCountBefore = await RitualBooking.count();

    // Call create-order for the SAME existing booking reference
    const orderRes = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: {
        bookingReference: testJapaRef,
      },
    });

    assert.strictEqual(orderRes.status, 200);
    assert.strictEqual(orderRes.data.success, true);
    assert.strictEqual(orderRes.data.data.bookingReference, testJapaRef);

    const totalCountAfter = await RitualBooking.count();
    assert.strictEqual(
      totalCountAfter,
      totalCountBefore,
      'Retry create-order must reuse existing booking without creating new booking row'
    );
  });

  // ---------------------------------------------------------------------------
  // 12. Confirmation displays Japa-specific data
  // ---------------------------------------------------------------------------
  await test('12. confirmation displays Japa-specific data', async () => {
    // Check JapaBookingStatus has Mantra, Japa count, Pandit count, Daily capacity, Required days
    assert.ok(japaStatusContent.includes('booking?.mantra'), 'JapaBookingStatus must display mantra');
    assert.ok(japaStatusContent.includes('booking?.japaCount'), 'JapaBookingStatus must display recitation count');
    assert.ok(japaStatusContent.includes('booking?.panditCount'), 'JapaBookingStatus must display pandit count');
    assert.ok(japaStatusContent.includes('booking?.totalDailyCapacity'), 'JapaBookingStatus must display daily capacity');
    assert.ok(japaStatusContent.includes('booking?.requiredDays'), 'JapaBookingStatus must display required days');

    // Also check RitualBookingConfirmation has Japa enhancements
    assert.ok(confirmationContent.includes('isJapa && mantra'), 'RitualBookingConfirmation must display mantra');
    assert.ok(confirmationContent.includes('Daily Chanting Capacity'), 'RitualBookingConfirmation must display daily capacity');
    assert.ok(confirmationContent.includes('Required Anushthan Days'), 'RitualBookingConfirmation must display required days');
  });

  // ---------------------------------------------------------------------------
  // 13. Completion date is displayed
  // ---------------------------------------------------------------------------
  await test('13. completion date is displayed', async () => {
    assert.ok(
      japaStatusContent.includes('booking?.completionDate'),
      'JapaBookingStatus must display completionDate'
    );
    assert.ok(
      japaStatusContent.includes('Purnahuti / Completion Date'),
      'JapaBookingStatus must label Purnahuti / Completion Date'
    );
    assert.ok(
      confirmationContent.includes('Purnahuti / Completion Date'),
      'RitualBookingConfirmation must display Purnahuti / Completion Date'
    );
  });

  // ---------------------------------------------------------------------------
  // 14. Authoritative amount is displayed
  // ---------------------------------------------------------------------------
  await test('14. authoritative amount is displayed', async () => {
    assert.ok(
      japaStatusContent.includes('₹{Number(booking?.amount || 0).toLocaleString("en-IN")}'),
      'JapaBookingStatus must render authoritative backend amount'
    );
    assert.ok(
      confirmationContent.includes('authoritativeAmount'),
      'RitualBookingConfirmation must use authoritativeAmount'
    );
    assert.ok(
      !japaStatusContent.includes('calculatePrice('),
      'JapaBookingStatus must NOT calculate dakshina client-side'
    );
  });

  // ---------------------------------------------------------------------------
  // 15. Booking reference is displayed
  // ---------------------------------------------------------------------------
  await test('15. booking reference is displayed', async () => {
    assert.ok(
      japaStatusContent.includes('{booking?.bookingReference || candidateRef}'),
      'JapaBookingStatus must display booking reference'
    );
    assert.ok(
      japaStatusContent.includes('handleCopy'),
      'JapaBookingStatus must provide copy booking reference button'
    );
  });

  // ---------------------------------------------------------------------------
  // 16. Puja payment flow still works
  // ---------------------------------------------------------------------------
  await test('16. Puja payment flow still works', async () => {
    const pujaService = await PujaService.findOne({ where: { isActive: true } });
    assert.ok(pujaService, 'Active Puja service must exist');

    const durHours = Array.isArray(pujaService.durationHours) ? pujaService.durationHours[0] : 2;
    const pujaCreateRes = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'PUJA',
        serviceId: pujaService.id,
        serviceSlug: pujaService.slug,
        configuration: {
          date: '2026-10-25',
          timeSlot: '09:00 AM',
          durationSelected: `${durHours} Hours`,
          durationHours: durHours,
          panditCount: 1,
          arrangementMode: 'remote',
        },
        location: {
          locationType: 'remote',
          venueDetails: {},
        },
        yajman: {
          name: 'Shri Ramesh Kumar',
          mobile: '9812345678',
        },
        sankalp: {
          purpose: 'Family well-being',
        },
        familyMembers: [],
        addons: [],
      },
    });

    assert.strictEqual(pujaCreateRes.status, 201, `Puja booking creation failed: ${JSON.stringify(pujaCreateRes.data)}`);
    const pujaRef = pujaCreateRes.data.data.bookingReference;
    assert.ok(pujaRef.startsWith('VEDA-PUJA-'));
    createdTestBookingReferences.push(pujaRef);

    // Create payment order
    const pujaOrderRes = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: { bookingReference: pujaRef },
    });
    assert.strictEqual(pujaOrderRes.status, 200);
    assert.strictEqual(pujaOrderRes.data.data.bookingReference, pujaRef);

    // Get booking status
    const pujaStatusRes = await request({
      method: 'GET',
      path: `/api/payments/booking-status/${pujaRef}`,
    });
    assert.strictEqual(pujaStatusRes.status, 200);
    assert.strictEqual(pujaStatusRes.data.data.serviceType, 'PUJA');
    assert.strictEqual(pujaStatusRes.data.data.bookingStatus, 'Pending');
  });

  // ---------------------------------------------------------------------------
  // 17. Yagya payment flow still works
  // ---------------------------------------------------------------------------
  await test('17. Yagya payment flow still works', async () => {
    const yagyaService = await YagyaService.findOne({ where: { isActive: true } });
    assert.ok(yagyaService, 'Active Yagya service must exist');

    const tier = Array.isArray(yagyaService.pricingTiers) && yagyaService.pricingTiers.length > 0
      ? yagyaService.pricingTiers[0]
      : { days: 3, panditCount: yagyaService.panditRequirement?.minPandits || 3 };
    const days = Number(tier.days) || 3;
    const dailyHours = Number(yagyaService.dailyRitualHours) || 4;
    const panditCount = Number(tier.panditCount) || Number(yagyaService.panditRequirement?.minPandits) || 3;
    const startDate = '2026-11-01';
    const compD = new Date(startDate);
    compD.setDate(compD.getDate() + (days - 1));
    const compDate = compD.toISOString().split('T')[0];

    const yagyaCreateRes = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'YAGYA',
        serviceId: yagyaService.id,
        serviceSlug: yagyaService.slug,
        configuration: {
          commencementDate: startDate,
          date: startDate,
          timeSlot: '08:00 AM',
          days,
          dailyHours,
          durationHours: days * dailyHours,
          durationSelected: `${days} Days`,
          panditCount,
          arrangementMode: 'remote',
          completionDate: compDate,
        },
        location: {
          locationType: 'remote',
          venueDetails: {},
        },
        yajman: {
          name: 'Shri Anand Devotee',
          mobile: '9898989898',
        },
        sankalp: {
          purpose: 'Maha Shanti',
        },
        familyMembers: [],
        addons: [],
      },
    });

    assert.strictEqual(yagyaCreateRes.status, 201, `Yagya booking creation failed: ${JSON.stringify(yagyaCreateRes.data)}`);
    const yagyaRef = yagyaCreateRes.data.data.bookingReference;
    assert.ok(yagyaRef.startsWith('VEDA-YAGYA-'));
    createdTestBookingReferences.push(yagyaRef);

    // Create payment order
    const yagyaOrderRes = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: { bookingReference: yagyaRef },
    });
    assert.strictEqual(yagyaOrderRes.status, 200);
    assert.strictEqual(yagyaOrderRes.data.data.bookingReference, yagyaRef);

    // Get booking status
    const yagyaStatusRes = await request({
      method: 'GET',
      path: `/api/payments/booking-status/${yagyaRef}`,
    });
    assert.strictEqual(yagyaStatusRes.status, 200);
    assert.strictEqual(yagyaStatusRes.data.data.serviceType, 'YAGYA');
    assert.strictEqual(yagyaStatusRes.data.data.bookingStatus, 'Pending');
  });

  // ---------------------------------------------------------------------------
  // 18. Upcoming Puja remains unaffected
  // ---------------------------------------------------------------------------
  await test('18. Upcoming Puja remains unaffected', async () => {
    const upcomingRes = await request({
      method: 'GET',
      path: '/api/upcoming-pujas',
    });
    assert.strictEqual(upcomingRes.status, 200, 'GET /api/upcoming-pujas must return 200');
    assert.strictEqual(upcomingRes.data.success, true);
    assert.ok(Array.isArray(upcomingRes.data.data), 'data must be an array');
  });

  // ---------------------------------------------------------------------------
  // CLEANUP & SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\nCleaning up test booking records...');
  for (const ref of createdTestBookingReferences) {
    try {
      await RitualBooking.destroy({ where: { bookingReference: ref } });
    } catch (e) {
      console.warn(`Could not delete test booking ${ref}:`, e.message);
    }
  }

  console.log('\n================================================================');
  console.log(`PHASE J3-C2 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

// Start test server and run suite
const start = async () => {
  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`Test server running on port ${port}`);
      resolve();
    });
  });

  try {
    await runJ3C2Verification();
  } finally {
    server.close();
    process.exit(0);
  }
};

start().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
