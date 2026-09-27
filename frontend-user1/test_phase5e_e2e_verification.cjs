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
  UpcomingPuja,
  Booking,
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

async function runE2EVerification() {
  console.log('================================================================');
  console.log('PHASE 5E: FULL CUSTOMER-FACING YAGYA E2E VERIFICATION SUITE');
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

  // ---------------------------------------------------------------------------
  // 1. JOURNEY STEP 1 & 2: Catalogue & Service Details Verification
  // ---------------------------------------------------------------------------
  let yagyaService = null;
  await test('1. Yagya Catalogue & Detail: Active Yagya loads with correct requirements', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/yagya-services/maha-mrityunjaya-yagya',
    });
    assert.strictEqual(res.status, 200, 'Catalogue detail should return 200');
    assert.strictEqual(res.data.success, true);
    yagyaService = res.data.data;
    assert.strictEqual(yagyaService.slug, 'maha-mrityunjaya-yagya');
    assert.strictEqual(yagyaService.name, 'Maha Mrityunjaya Yagya');
    assert.strictEqual(yagyaService.dailyRitualHours, 5);
    assert(Array.isArray(yagyaService.availableDurations), 'Durations must be an array');
    assert.deepStrictEqual(yagyaService.availableDurations, [3, 5, 7, 9, 11]);
    assert.strictEqual(yagyaService.panditRequirement.minimumPandits, 3);
    assert.strictEqual(yagyaService.isKashiAvailable, true);
    assert(Array.isArray(yagyaService.pricingTiers), 'Pricing tiers must exist');
    assert.strictEqual(yagyaService.pricingTiers.length, 5);
  });

  // ---------------------------------------------------------------------------
  // 2. JOURNEY STEP 3 & 4: Authoritative Price Calculation & Completion Date
  // ---------------------------------------------------------------------------
  let priceData = null;
  await test('2. Yagya Configuration: Authoritative Dakshina calculation and completion date', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'YAGYA',
        serviceId: yagyaService.id,
        serviceSlug: yagyaService.slug,
        days: 3,
        dailyHours: 5,
        durationHours: 15,
        durationSelected: '3 Days',
        panditCount: 5,
        arrangementMode: 'kashi',
        locationType: 'kashi',
        addons: [],
      },
    });

    assert.strictEqual(res.status, 200, 'Calculate price should return 200');
    assert.strictEqual(res.data.success, true);
    priceData = res.data.data;
    assert.strictEqual(priceData.basePrice, 21000);
    assert.strictEqual(priceData.panditAddonPrice, 0);
    assert.strictEqual(priceData.addonsTotal, 0);
    assert.strictEqual(priceData.totalAmount, 21000);
    assert.strictEqual(priceData.pricingSource, 'YAGYA_PRICING_TIER');
    assert.strictEqual(priceData.pricingTier.days, 3);
    assert.strictEqual(priceData.pricingTier.price, 21000);
    assert.strictEqual(priceData.pricingTier.panditCount, 5);
  });

  // ---------------------------------------------------------------------------
  // 3. JOURNEY STEP 5-10: Booking Creation & Authoritative Pricing Override
  // ---------------------------------------------------------------------------
  let bookingRef = null;
  let bookingRecord = null;
  await test('3. Booking Creation: Server creates VEDA-YAGYA-XXXXXXXX record and ignores client price', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'YAGYA',
        serviceId: yagyaService.id,
        serviceSlug: yagyaService.slug,
        // Attempting to send manipulated/fake client amounts (Security Test)
        basePrice: 1,
        totalAmount: 1,
        panditAddonPrice: 0,
        addonsTotal: 0,
        configuration: {
          date: '2026-10-15',
          timeSlot: '07:00 AM',
          days: 3,
          dailyHours: 5,
          durationHours: 15,
          durationSelected: '3 Days',
          panditCount: 5,
          arrangementMode: 'kashi',
          completionDate: '2026-10-17',
          basePrice: 1,
          totalAmount: 1,
        },
        location: {
          locationType: 'kashi',
          venueDetails: {
            address: 'Manikarnika Sacred Mandap',
            city: 'Varanasi',
          },
        },
        yajman: {
          name: 'Shri Rajesh Kumar',
          mobile: '9876543210',
          email: 'rajesh.kumar@example.com',
        },
        sankalp: {
          purpose: 'Health, longevity and Tryambaka blessings',
          mainIntention: 'Tryambaka invocation',
        },
        familyMembers: [
          { name: 'Sunita Kumar', relation: 'Spouse', gender: 'Female' },
        ],
        addons: [],
      },
    });

    assert.strictEqual(res.status, 201, 'Booking creation should return 201 Created');
    assert.strictEqual(res.data.success, true);
    bookingRecord = res.data.data;
    bookingRef = bookingRecord.bookingReference;
    createdTestBookingReferences.push(bookingRef);

    // Verify reference format: VEDA-YAGYA-XXXXXXXX
    assert(bookingRef.startsWith('VEDA-YAGYA-'), `Reference must start with VEDA-YAGYA-: ${bookingRef}`);
    const suffix = bookingRef.replace('VEDA-YAGYA-', '');
    assert.strictEqual(suffix.length, 8, `Suffix must be 8 alphanumeric chars: ${suffix}`);

    // Verify initial statuses
    assert.strictEqual(bookingRecord.bookingStatus, 'Pending');
    assert.strictEqual(bookingRecord.paymentStatus, 'Pending');

    // Verify authoritative price was enforced (NOT ₹1)
    assert.strictEqual(bookingRecord.pricing.basePrice, 21000);
    assert.strictEqual(bookingRecord.pricing.totalAmount, 21000);

    // Verify Yagya metadata in configuration
    assert.strictEqual(bookingRecord.configuration.days, 3);
    assert.strictEqual(bookingRecord.configuration.dailyHours, 5);
    assert.strictEqual(bookingRecord.configuration.completionDate, '2026-10-17');
    assert.strictEqual(bookingRecord.configuration.selectedPricingTier.price, 21000);
  });

  // ---------------------------------------------------------------------------
  // 4. CASHFREE SANDBOX ORDER CREATION (JOURNEY STEP 11)
  // ---------------------------------------------------------------------------
  let paymentSessionId = null;
  await test('4. Cashfree Sandbox Order Creation: Generates valid Sandbox paymentSessionId', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: {
        bookingReference: bookingRef,
      },
    });

    assert.strictEqual(res.status, 200, 'Payment create-order should return 200');
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.bookingReference, bookingRef);
    assert.strictEqual(res.data.data.orderAmount, 21000, 'Order amount must be ₹21,000');
    assert(res.data.data.paymentSessionId, 'paymentSessionId must be present');
    paymentSessionId = res.data.data.paymentSessionId;
  });

  // ---------------------------------------------------------------------------
  // 5. DOUBLE-CLICK & DUPLICATE PROTECTION (JOURNEY STEP 14)
  // ---------------------------------------------------------------------------
  await test('5. Duplicate Protection: Repeated order calls return existing session without duplication', async () => {
    const res1 = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: { bookingReference: bookingRef },
    });
    assert.strictEqual(res1.status, 200);
    assert.strictEqual(res1.data.success, true);
    assert.strictEqual(res1.data.reused, true, 'Subsequent request must reuse active session');
    assert.strictEqual(res1.data.data.orderAmount, 21000);
    assert(res1.data.data.paymentSessionId, 'Session ID must be returned');

    const res2 = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: { bookingReference: bookingRef },
    });
    assert.strictEqual(res2.status, 200);
    assert.strictEqual(res2.data.success, true);
    assert.strictEqual(res2.data.reused, true);
    assert.strictEqual(res2.data.data.orderAmount, 21000);
    assert(res2.data.data.paymentSessionId, 'Session ID must be returned');

    // Verify in database that only ONE booking record exists with this reference
    const count = await RitualBooking.count({ where: { bookingReference: bookingRef } });
    assert.strictEqual(count, 1, 'Only 1 database booking record should exist');
  });

  // ---------------------------------------------------------------------------
  // 6. PAYMENT STATUS & RECOVERY (JOURNEY STEP 10, 11)
  // ---------------------------------------------------------------------------
  await test('6. Payment Status & Recovery: GET /api/payments/booking-status recovers active booking', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/payments/booking-status/${bookingRef}`,
    });

    assert.strictEqual(res.status, 200, 'Booking status should return 200');
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.bookingReference, bookingRef);
    assert.strictEqual(res.data.data.bookingStatus, 'Pending');
    assert.strictEqual(res.data.data.paymentStatus, 'Pending');
    assert.strictEqual(res.data.data.amount, 21000);
    assert.strictEqual(res.data.data.paymentSessionId, paymentSessionId);

    // Verify security: No secrets or credentials are leaked
    const jsonStr = JSON.stringify(res.data);
    assert(!jsonStr.includes('CASHFREE_SECRET_KEY'), 'Must not expose Cashfree secret key');
    assert(!jsonStr.includes('JWT_SECRET'), 'Must not expose JWT secret');
    assert(!jsonStr.includes('password'), 'Must not expose password');
  });

  // ---------------------------------------------------------------------------
  // 7. PENDING PAYMENT / UNPAID STATE INTEGRITY (JOURNEY STEP 12, 13)
  // ---------------------------------------------------------------------------
  await test('7. Unpaid State Integrity: Cashfree verify on unpaid order keeps status Pending', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/payments/verify',
      body: {
        bookingReference: bookingRef,
      },
    });

    // In Cashfree Sandbox, since no card/UPI was entered in this API test, order status is ACTIVE/PENDING
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);

    // Verify booking in database remains Pending (NOT falsely marked Paid)
    const dbRecord = await RitualBooking.findOne({ where: { bookingReference: bookingRef } });
    assert.strictEqual(dbRecord.bookingStatus, 'Pending', 'Booking status must remain Pending');
    assert.strictEqual(dbRecord.paymentStatus, 'Pending', 'Payment status must remain Pending');
    assert.strictEqual(Number(dbRecord.totalAmount), 21000);
  });

  // ---------------------------------------------------------------------------
  // 8. SECURITY AUDIT: Source Code Leaks Check (Section 19)
  // ---------------------------------------------------------------------------
  await test('8. Security Audit: Frontend source code contains no private credentials or secrets', () => {
    const frontendSrcDir = 'C:/Users/shiva/Desktop/FreeLance_veda/frontend-user1/src';

    function walkDir(dir) {
      let results = [];
      const list = fs.readdirSync(dir);
      list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
          results = results.concat(walkDir(filePath));
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
          results.push(filePath);
        }
      });
      return results;
    }

    const files = walkDir(frontendSrcDir);
    const forbiddenPatterns = [
      'CASHFREE_SECRET_KEY',
      'cfsk_ma_',
      'JWT_SECRET',
      'DB_PASSWORD',
      'process.env.DB_',
    ];

    for (const f of files) {
      const content = fs.readFileSync(f, 'utf8');
      for (const pat of forbiddenPatterns) {
        assert(
          !content.includes(pat),
          `Security violation: Found forbidden pattern "${pat}" in frontend file: ${f}`
        );
      }
    }
  });

  // ---------------------------------------------------------------------------
  // 9. PUJA REGRESSION VERIFICATION (Section 16)
  // ---------------------------------------------------------------------------
  await test('9. Puja Regression: Puja booking & Cashfree order creation work seamlessly', async () => {
    const puja = await PujaService.findOne({ where: { isActive: true } });
    assert(puja, 'Active Puja service must exist');

    const durHours = Array.isArray(puja.durationHours) ? puja.durationHours[0] : 2;
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'PUJA',
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
        sankalp: { purpose: 'Spiritual Peace' },
        familyMembers: [],
        addons: [],
      },
    });

    assert.strictEqual(res.status, 201);
    const pujaRef = res.data.data.bookingReference;
    createdTestBookingReferences.push(pujaRef);
    assert(pujaRef.startsWith('VEDA-PUJA-'), 'Puja ref must start with VEDA-PUJA-');

    const orderRes = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: { bookingReference: pujaRef },
    });
    assert.strictEqual(orderRes.status, 200);
    assert(orderRes.data.data.paymentSessionId, 'Puja Cashfree session must be created');
  });

  // ---------------------------------------------------------------------------
  // 10. UPCOMING PUJA & CONSULTATION REGRESSIONS (Sections 17 & 18)
  // ---------------------------------------------------------------------------
  await test('10. Regressions: Upcoming Pujas and Consultations remain intact', async () => {
    const upRes = await request({ method: 'GET', path: '/api/upcoming-pujas' });
    assert.strictEqual(upRes.status, 200);
    assert.strictEqual(upRes.data.success, true);

    const sampleConsultation = await Booking.findOne();
    if (sampleConsultation) {
      const adapter = await resolveBookingEntity(sampleConsultation.bookingReference);
      assert.strictEqual(adapter.type, BOOKING_TYPES.CONSULTATION);
    }
  });

  // ---------------------------------------------------------------------------
  // 11. DATABASE VERIFICATION (Section 21)
  // ---------------------------------------------------------------------------
  await test('11. Database Record Verification: ritual_bookings fields are accurately saved', async () => {
    const dbRecord = await RitualBooking.findOne({ where: { bookingReference: bookingRef } });
    assert(dbRecord, 'Record must exist in ritual_bookings');
    assert.strictEqual(dbRecord.serviceType, 'YAGYA');
    assert.strictEqual(dbRecord.bookingReference, bookingRef);
    assert.strictEqual(dbRecord.bookingStatus, 'Pending');
    assert.strictEqual(dbRecord.paymentStatus, 'Pending');
    assert.strictEqual(Number(dbRecord.totalAmount), 21000);
    assert.strictEqual(dbRecord.paymentGateway, 'Cashfree');
    assert.strictEqual(dbRecord.bookingDate, '2026-10-15');
    assert.strictEqual(dbRecord.bookingTime, '07:00 AM');
    assert.strictEqual(dbRecord.durationHours, 15);
    assert.strictEqual(dbRecord.panditCount, 5);
    assert.strictEqual(dbRecord.sankalpDetails.yagyaMetadata.days, 3);
    assert.strictEqual(dbRecord.sankalpDetails.yagyaMetadata.dailyHours, 5);
    assert.strictEqual(dbRecord.sankalpDetails.yagyaMetadata.completionDate, '2026-10-17');
  });

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  // CLEANUP (Section 22)
  console.log(`Cleaning up ${createdTestBookingReferences.length} temporary test booking(s)...`);
  for (const ref of createdTestBookingReferences) {
    await RitualBooking.destroy({ where: { bookingReference: ref } });
  }
  console.log('Cleanup completed successfully.\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

server = app.listen(0, () => {
  port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
  runE2EVerification().catch((err) => {
    console.error('Fatal test runner error:', err);
    process.exit(1);
  }).finally(() => {
    server.close();
  });
});
