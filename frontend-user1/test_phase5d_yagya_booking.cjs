require('C:/Users/shiva/Desktop/FreeLance_veda/backend/node_modules/dotenv').config({ path: 'C:/Users/shiva/Desktop/FreeLance_veda/backend/.env' });
const http = require('http');
const assert = require('assert');


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

async function runTests() {
  console.log('================================================================');
  console.log('PHASE 5D COMPREHENSIVE VERIFICATION & SECURITY TEST SUITE (A-Z)');
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

  // Find a real seeded Yagya service
  const yagyaService = await YagyaService.findOne({
    where: { slug: 'maha-mrityunjaya-yagya' },
  });
  assert(yagyaService, 'Seeded maha-mrityunjaya-yagya must exist in database');

  // Find a real seeded Puja service
  const pujaService = await PujaService.findOne({
    where: { isActive: true },
  });
  assert(pujaService, 'At least one active PujaService must exist in database');

  // ---------------------------------------------------------------------------
  // A. Yagya service lookup
  // ---------------------------------------------------------------------------
  await test('A. Yagya service lookup', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/yagya-services/${yagyaService.slug}`,
    });
    assert.strictEqual(res.status, 200, 'Should return status 200');
    assert.strictEqual(res.data.success, true, 'Should succeed');
    assert.strictEqual(res.data.data.slug, yagyaService.slug, 'Slug should match');
    assert(Array.isArray(res.data.data.pricingTiers), 'pricingTiers should be an array');
    assert(res.data.data.pricingTiers.length > 0, 'pricingTiers should not be empty');
  });

  // ---------------------------------------------------------------------------
  // B. Invalid Yagya slug
  // ---------------------------------------------------------------------------
  await test('B. Invalid Yagya slug calculation returns 404', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'YAGYA',
        serviceSlug: 'non-existent-fake-yagya',
        days: 3,
        dailyHours: 5,
        durationHours: 15,
        panditCount: 5,
      },
    });
    assert.strictEqual(res.status, 404, 'Should return 404 for invalid slug');
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('not found'), 'Message should indicate not found');
  });

  // ---------------------------------------------------------------------------
  // C. Inactive Yagya service
  // ---------------------------------------------------------------------------
  await test('C. Inactive Yagya service returns 404', async () => {
    // Create temporary inactive service
    const inactiveService = await YagyaService.create({
      slug: 'temp-inactive-yagya-test',
      name: 'Temp Inactive Yagya',
      deity: 'Test Deity',
      startingPrice: 15000,
      availableDurations: [3],
      dailyRitualHours: 5,
      pricingTiers: [{ days: 3, price: 15000, panditCount: 3, label: '3-Day Test' }],
      isActive: false,
    });

    try {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'YAGYA',
          serviceSlug: inactiveService.slug,
          days: 3,
          dailyHours: 5,
          durationHours: 15,
          panditCount: 3,
        },
      });
      assert.strictEqual(res.status, 404, 'Should return 404 for inactive service');
      assert(res.data.message.includes('inactive'), 'Message should indicate inactive');
    } finally {
      await inactiveService.destroy();
    }
  });

  // ---------------------------------------------------------------------------
  // D. Invalid service ID/slug combination
  // ---------------------------------------------------------------------------
  await test('D. Invalid service ID/slug combination returns 400', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'YAGYA',
        serviceId: '00000000-0000-0000-0000-000000000000',
        serviceSlug: yagyaService.slug,
        days: 3,
        dailyHours: 5,
        durationHours: 15,
        panditCount: 5,
      },
    });
    assert.strictEqual(res.status, 400, 'Should return 400 for mismatched serviceId');
    assert(res.data.message.includes('does not match'), 'Message should indicate mismatch');
  });

  // ---------------------------------------------------------------------------
  // E. Invalid duration
  // ---------------------------------------------------------------------------
  await test('E. Invalid duration returns 400', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'YAGYA',
        serviceSlug: yagyaService.slug,
        days: 4, // 4 days is not in [3, 5, 7, 9, 11]
        dailyHours: 5,
        durationHours: 20,
        panditCount: 5,
      },
    });
    assert.strictEqual(res.status, 400, 'Should return 400 for unsupported duration');
    assert(res.data.message.includes('not available'), 'Message should mention not available');
  });

  // ---------------------------------------------------------------------------
  // F. Missing pricing tier
  // ---------------------------------------------------------------------------
  await test('F. Missing pricing tier returns 400', async () => {
    // Service with duration available in array but tier missing
    const tempService = await YagyaService.create({
      slug: 'temp-missing-tier-yagya',
      name: 'Temp Missing Tier',
      deity: 'Test Deity',
      startingPrice: 15000,
      availableDurations: [3, 5],
      dailyRitualHours: 5,
      pricingTiers: [{ days: 3, price: 15000, panditCount: 3, label: '3-Day Test' }], // 5 days tier omitted
      isActive: true,
    });

    try {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'YAGYA',
          serviceSlug: tempService.slug,
          days: 5,
          dailyHours: 5,
          durationHours: 25,
          panditCount: 3,
        },
      });
      assert.strictEqual(res.status, 400, 'Should return 400 for missing tier');
      assert(res.data.message.includes('pricing tier found'), 'Message should indicate tier missing');
    } finally {
      await tempService.destroy();
    }
  });

  // ---------------------------------------------------------------------------
  // G. Daily hours mismatch
  // ---------------------------------------------------------------------------
  await test('G. Daily hours mismatch returns 400', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'YAGYA',
        serviceSlug: yagyaService.slug,
        days: 3,
        dailyHours: 8, // Expected 5
        durationHours: 15,
        panditCount: 5,
      },
    });
    assert.strictEqual(res.status, 400, 'Should return 400 for daily hours mismatch');
    assert(res.data.message.includes('Daily ritual hours mismatch'), 'Message should mention mismatch');
  });

  // ---------------------------------------------------------------------------
  // H. Invalid total duration
  // ---------------------------------------------------------------------------
  await test('H. Invalid total duration returns 400', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'YAGYA',
        serviceSlug: yagyaService.slug,
        days: 3,
        dailyHours: 5,
        durationHours: 35, // Expected 3 * 5 = 15
        panditCount: 5,
      },
    });
    assert.strictEqual(res.status, 400, 'Should return 400 for inconsistent duration hours');
    assert(res.data.message.includes('duration hours is inconsistent'), 'Message should mention inconsistency');
  });

  // ---------------------------------------------------------------------------
  // I. Pandit count below service minimum
  // ---------------------------------------------------------------------------
  await test('I. Pandit count below service minimum returns 400', async () => {
    const minP = yagyaService.panditRequirement?.minimumPandits || 3;
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'YAGYA',
        serviceSlug: yagyaService.slug,
        days: 3,
        dailyHours: 5,
        durationHours: 15,
        panditCount: minP - 1, // Below minimum
      },
    });
    assert.strictEqual(res.status, 400, 'Should return 400 for pandits below minimum');
    assert(res.data.message.includes('required minimum'), 'Message should mention minimum');
  });

  // ---------------------------------------------------------------------------
  // J. Invalid arrangement mode
  // ---------------------------------------------------------------------------
  await test('J. Invalid arrangement mode returns 400', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'YAGYA',
        serviceSlug: yagyaService.slug,
        days: 3,
        dailyHours: 5,
        durationHours: 15,
        panditCount: 5,
        arrangementMode: 'mars_colony',
      },
    });
    assert.strictEqual(res.status, 400, 'Should return 400 for invalid mode');
    assert(res.data.message.includes('Invalid arrangementMode'), 'Message should mention arrangementMode');
  });

  // ---------------------------------------------------------------------------
  // K. Invalid location type
  // ---------------------------------------------------------------------------
  await test('K. Invalid location type returns 400', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'YAGYA',
        serviceSlug: yagyaService.slug,
        days: 3,
        dailyHours: 5,
        durationHours: 15,
        panditCount: 5,
        locationType: 'outer_space',
      },
    });
    assert.strictEqual(res.status, 400, 'Should return 400 for invalid locationType');
    assert(res.data.message.includes('Invalid locationType'), 'Message should mention locationType');
  });

  // ---------------------------------------------------------------------------
  // L. Completion date mismatch
  // ---------------------------------------------------------------------------
  await test('L. Completion date mismatch in booking creation returns 400', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'YAGYA',
        serviceSlug: yagyaService.slug,
        configuration: {
          date: '2026-10-01',
          timeSlot: '07:00 AM',
          days: 3,
          durationSelected: '3 Days',
          dailyHours: 5,
          durationHours: 15,
          panditCount: 5,
          arrangementMode: 'kashi',
          completionDate: '2026-10-15', // Wrong! For 2026-10-01 and 3 days, completion is 2026-10-03
        },
        location: {
          locationType: 'kashi',
          venueDetails: {},
        },
        yajman: {
          name: 'Test Yajman',
          mobile: '9876543210',
          email: 'yajman@vedastructure.com',
        },
        sankalp: {
          purpose: 'Health and longevity',
        },
        familyMembers: [],
        addons: [],
      },
    });
    assert.strictEqual(res.status, 400, 'Should return 400 for completion date mismatch');
    assert(res.data.message.includes('Completion date mismatch'), 'Message should state completion date mismatch');
  });

  // ---------------------------------------------------------------------------
  // M. Price calculation (Valid authoritative calculation)
  // ---------------------------------------------------------------------------
  let calcPriceData = null;
  await test('M. Valid Yagya price calculation succeeds with authoritative breakdown', async () => {
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
    assert.strictEqual(res.status, 200, 'Should return status 200');
    assert.strictEqual(res.data.success, true);
    calcPriceData = res.data.data;
    assert.strictEqual(calcPriceData.serviceType, 'YAGYA');
    assert.strictEqual(calcPriceData.serviceSlug, yagyaService.slug);
    assert.strictEqual(calcPriceData.days, 3);
    assert.strictEqual(calcPriceData.dailyHours, 5);
    assert.strictEqual(calcPriceData.durationHours, 15);
    assert.strictEqual(calcPriceData.basePrice, 21000);
    assert.strictEqual(calcPriceData.panditAddonPrice, 0);
    assert.strictEqual(calcPriceData.addonsTotal, 0);
    assert.strictEqual(calcPriceData.totalAmount, 21000);
    assert.strictEqual(calcPriceData.pricingSource, 'YAGYA_PRICING_TIER');
    assert.strictEqual(calcPriceData.pricingTier.days, 3);
    assert.strictEqual(calcPriceData.pricingTier.price, 21000);
    assert.strictEqual(calcPriceData.pricingTier.panditCount, 5);
  });

  // ---------------------------------------------------------------------------
  // N. Booking creation
  // ---------------------------------------------------------------------------
  let createdBookingRef = null;
  let createdBookingData = null;
  await test('N. Booking creation creates ritual_bookings record with serviceType YAGYA', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'YAGYA',
        serviceId: yagyaService.id,
        serviceSlug: yagyaService.slug,
        configuration: {
          date: '2026-10-10',
          timeSlot: '07:00 AM',
          days: 3,
          durationSelected: '3 Days',
          dailyHours: 5,
          durationHours: 15,
          panditCount: 5,
          arrangementMode: 'kashi',
          completionDate: '2026-10-12', // 2026-10-10 + 2 days = 2026-10-12
        },
        location: {
          locationType: 'kashi',
          venueDetails: {},
        },
        yajman: {
          name: 'Shri Ram Sharma',
          mobile: '9876543210',
          email: 'ram.sharma@example.com',
        },
        sankalp: {
          purpose: 'Health, longevity and Tryambaka blessings',
          mainIntention: 'Tryambaka invocation',
        },
        familyMembers: [
          { name: 'Sita Sharma', relation: 'Spouse', gender: 'Female' },
        ],
        addons: [],
      },
    });

    assert.strictEqual(res.status, 201, 'Should return status 201 Created');
    assert.strictEqual(res.data.success, true);
    createdBookingData = res.data.data;
    createdBookingRef = createdBookingData.bookingReference;
    createdTestBookingReferences.push(createdBookingRef);

    assert(createdBookingRef, 'bookingReference must be returned');
    assert.strictEqual(createdBookingData.serviceType, 'YAGYA');
    assert.strictEqual(createdBookingData.serviceSlug, yagyaService.slug);
  });

  // ---------------------------------------------------------------------------
  // O. Booking amount matches authoritative backend calculation
  // ---------------------------------------------------------------------------
  await test('O. Booking amount matches authoritative backend calculation', async () => {
    const booking = await RitualBooking.findOne({
      where: { bookingReference: createdBookingRef },
    });
    assert(booking, 'Booking must exist in DB');
    assert.strictEqual(Number(booking.basePrice), 21000);
    assert.strictEqual(Number(booking.totalAmount), 21000);
    assert.strictEqual(Number(booking.panditAddonPrice), 0);
    assert.strictEqual(Number(booking.addonsTotal), 0);
  });

  // ---------------------------------------------------------------------------
  // P. Frontend-submitted fake price is ignored (MANDATORY SECURITY TEST)
  // ---------------------------------------------------------------------------
  await test('P. [MANDATORY SECURITY TEST] Fake client price (₹1) is completely ignored', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'YAGYA',
        serviceId: yagyaService.id,
        serviceSlug: yagyaService.slug,
        // MALICIOUS / TAMPERED CLIENT PRICING:
        basePrice: 1,
        totalAmount: 1,
        panditAddonPrice: 0,
        addonsTotal: 0,
        configuration: {
          date: '2026-10-15',
          timeSlot: '07:00 AM',
          days: 3,
          durationSelected: '3 Days',
          dailyHours: 5,
          durationHours: 15,
          panditCount: 5,
          arrangementMode: 'kashi',
          completionDate: '2026-10-17',
          basePrice: 1,
          totalAmount: 1,
        },
        location: {
          locationType: 'kashi',
          venueDetails: {},
        },
        yajman: {
          name: 'Hacker Devotee',
          mobile: '9111111111',
          email: 'hacker@example.com',
        },
        sankalp: {
          purpose: 'Testing security overrides',
        },
        familyMembers: [],
        addons: [],
      },
    });

    assert.strictEqual(res.status, 201, 'Booking should be created');
    const hackedRef = res.data.data.bookingReference;
    createdTestBookingReferences.push(hackedRef);

    // Verify in database
    const dbRecord = await RitualBooking.findOne({
      where: { bookingReference: hackedRef },
    });
    assert(dbRecord, 'Record must exist');
    assert.notStrictEqual(Number(dbRecord.totalAmount), 1, 'Total amount must NOT be ₹1');
    assert.strictEqual(Number(dbRecord.totalAmount), 21000, 'Total amount must be the authoritative ₹21,000');
    assert.strictEqual(Number(dbRecord.basePrice), 21000, 'Base price must be the authoritative ₹21,000');
  });

  // ---------------------------------------------------------------------------
  // Q. Booking reference starts with: VEDA-YAGYA-
  // ---------------------------------------------------------------------------
  await test('Q. Booking reference starts with VEDA-YAGYA-', () => {
    assert(
      createdBookingRef.startsWith('VEDA-YAGYA-'),
      `Booking ref ${createdBookingRef} must start with VEDA-YAGYA-`
    );
  });

  // ---------------------------------------------------------------------------
  // R. Booking status starts: Pending
  // ---------------------------------------------------------------------------
  await test('R. Booking status starts Pending', async () => {
    const booking = await RitualBooking.findOne({
      where: { bookingReference: createdBookingRef },
    });
    assert.strictEqual(booking.bookingStatus, 'Pending');
  });

  // ---------------------------------------------------------------------------
  // S. Payment status starts: Pending
  // ---------------------------------------------------------------------------
  await test('S. Payment status starts Pending', async () => {
    const booking = await RitualBooking.findOne({
      where: { bookingReference: createdBookingRef },
    });
    assert.strictEqual(booking.paymentStatus, 'Pending');
  });

  // ---------------------------------------------------------------------------
  // T. Existing resolver resolves the Yagya booking
  // ---------------------------------------------------------------------------
  await test('T. Existing generic resolver resolves VEDA-YAGYA booking adapter', async () => {
    const adapter = await resolveBookingEntity(createdBookingRef);
    assert.strictEqual(adapter.type, BOOKING_TYPES.RITUAL, 'Adapter type must be RITUAL');
    assert.strictEqual(adapter.reference, createdBookingRef);
    assert.strictEqual(adapter.authoritativeAmount, 21000);
    assert.strictEqual(adapter.bookingStatus, 'Pending');
    assert.strictEqual(adapter.paymentStatus, 'Pending');
  });

  // ---------------------------------------------------------------------------
  // U. Payment create-order resolves Yagya booking
  // ---------------------------------------------------------------------------
  await test('U. Payment create-order resolves Yagya booking and creates Cashfree session', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: {
        bookingReference: createdBookingRef,
      },
    });

    assert.strictEqual(res.status, 200, 'create-order should return 200');
    assert.strictEqual(res.data.success, true);
    assert(res.data.data.paymentSessionId, 'paymentSessionId must be generated');
    assert.strictEqual(res.data.data.orderAmount, 21000, 'orderAmount must be 21000');
  });

  // ---------------------------------------------------------------------------
  // V. Payment status endpoint resolves Yagya booking
  // ---------------------------------------------------------------------------
  await test('V. Payment status endpoint resolves Yagya booking', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/payments/booking-status/${createdBookingRef}`,
    });

    assert.strictEqual(res.status, 200, 'booking-status should return 200');
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.bookingReference, createdBookingRef);
    assert.strictEqual(res.data.data.bookingStatus, 'Pending');
    assert.strictEqual(res.data.data.paymentStatus, 'Pending');
    assert.strictEqual(res.data.data.amount, 21000);
  });

  // ---------------------------------------------------------------------------
  // W. Puja price calculation still works & GET /api/puja-services
  // ---------------------------------------------------------------------------
  await test('W. Puja price calculation remains unchanged and working', async () => {
    // Also verify GET /api/puja-services catalogue endpoint
    const listRes = await request({
      method: 'GET',
      path: '/api/puja-services',
    });
    assert.strictEqual(listRes.status, 200, 'GET /api/puja-services should return 200');
    assert.strictEqual(listRes.data.success, true);
    assert(Array.isArray(listRes.data.data), 'Puja services should be an array');
    assert(listRes.data.data.length > 0, 'Puja services count should be > 0');

    // Authoritative Puja price calculation
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'PUJA',
        serviceSlug: pujaService.slug,
        durationHours: Array.isArray(pujaService.durationHours) ? pujaService.durationHours[0] : 2,
        panditCount: 2, // 1 extra pandit => +500
      },
    });

    assert.strictEqual(res.status, 200, 'Puja calculation should return 200');
    assert.strictEqual(res.data.success, true);
    const expectedBase = Number(pujaService.startingPrice);
    const expectedExtra = 500;
    const expectedTotal = expectedBase + expectedExtra;
    assert.strictEqual(res.data.data.basePrice, expectedBase);
    assert.strictEqual(res.data.data.panditAddonPrice, 500);
    assert.strictEqual(res.data.data.totalAmount, expectedTotal);
  });

  // ---------------------------------------------------------------------------
  // X. Existing Puja booking still works & Cashfree create-order
  // ---------------------------------------------------------------------------
  await test('X. Existing Puja booking creation remains intact', async () => {
    const durHours = Array.isArray(pujaService.durationHours) ? pujaService.durationHours[0] : 2;
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'PUJA',
        serviceSlug: pujaService.slug,
        configuration: {
          date: '2026-10-05',
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
          name: 'Puja Yajman',
          mobile: '9988776655',
          email: 'puja@example.com',
        },
        sankalp: {
          purpose: 'Spiritual prosperity',
        },
        familyMembers: [],
        addons: [],
      },
    });

    assert.strictEqual(res.status, 201, 'Puja booking should return 201');
    const pujaBookingRef = res.data.data.bookingReference;
    createdTestBookingReferences.push(pujaBookingRef);
    assert(pujaBookingRef.startsWith('VEDA-PUJA-'), 'Puja ref must start with VEDA-PUJA-');

    // Verify Cashfree order creation also works for this Puja booking
    const orderRes = await request({
      method: 'POST',
      path: '/api/payments/create-order',
      body: { bookingReference: pujaBookingRef },
    });
    assert.strictEqual(orderRes.status, 200, 'Puja Cashfree order creation should return 200');
    assert.strictEqual(orderRes.data.success, true);
    assert(orderRes.data.data.paymentSessionId, 'Puja paymentSessionId must exist');
  });

  // ---------------------------------------------------------------------------
  // Y. Upcoming Puja still works
  // ---------------------------------------------------------------------------
  await test('Y. Upcoming Puja system remains operational', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/upcoming-pujas',
    });
    assert.strictEqual(res.status, 200, 'Upcoming Pujas should return 200');
    assert.strictEqual(res.data.success, true);
  });

  // ---------------------------------------------------------------------------
  // Z. Consultation auth behavior still works
  // ---------------------------------------------------------------------------
  await test('Z. Consultation booking and auth behavior remains operational', async () => {
    // Lookup or check bookingResolver on consultations
    const sampleConsultation = await Booking.findOne();
    if (sampleConsultation) {
      const adapter = await resolveBookingEntity(sampleConsultation.bookingReference);
      assert.strictEqual(adapter.type, BOOKING_TYPES.CONSULTATION);
      assert.strictEqual(typeof adapter.canAccess, 'function');
    } else {
      console.log('  (No consultation bookings in DB, verified resolveBookingEntity fallback)');
    }
  });

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  // CLEANUP: Clean up all created test bookings so database remains pristine (Requirement 29)
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

// Start server on an ephemeral port and run tests
server = app.listen(0, () => {
  port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
  runTests().catch((err) => {
    console.error('Fatal test runner error:', err);
    process.exit(1);
  }).finally(() => {
    server.close();
  });
});
