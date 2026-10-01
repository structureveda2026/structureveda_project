require('dotenv').config({ path: __dirname + '/.env' });
const http = require('http');
const assert = require('assert');

// Load database & models
const db = require('./src/models/index.js').default;
const {
  HomaService,
  RitualBooking,
  PujaService,
  YagyaService,
  JapaService,
} = db;

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

const createdTestBookings = [];

async function runH3Tests() {
  console.log('================================================================');
  console.log('PHASE H3-B: HOMA PRICING ENGINE + RITUAL BOOKING BACKEND TESTS');
  console.log('================================================================\n');

  // Start test HTTP server
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Test server running on port ${port}\n`);

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

  const { resolveBookingEntity } = await import('./src/services/bookingResolver.service.js');

  let createdHomaBookingRef = null;

  try {
    // =========================================================================
    // PRICING TESTS (1 - 12)
    // =========================================================================

    // Test 1: 1 Havan / 1 Day base price
    await test('1. 1 Havan / 1 Day base price calculation (Maha Mrityunjaya Homa ₹11,000)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          havanCount: 1,
          days: 1,
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      const data = res.data.data;
      assert.strictEqual(data.serviceType, 'HOMA');
      assert.strictEqual(data.havanCount, 1);
      assert.strictEqual(data.days, 1);
      assert.strictEqual(data.basePrice, 11000);
      assert.strictEqual(data.havanAddonPrice, 0);
      assert.strictEqual(data.dayAddonPrice, 0);
      assert.strictEqual(data.panditAddonPrice, 0);
      assert.strictEqual(data.totalAmount, 11000);
      assert.strictEqual(data.pricingSource, 'HOMA_CONFIGURED_PRICING');
      assert.strictEqual(data.durationSelected, '1 Havan (1 Day)');
    });

    // Test 2: 3 Havans / 1 Day
    await test('2. 3 Havans / 1 Day calculation (₹11,000 + 2 * ₹4,000 = ₹19,000)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          havanCount: 3,
          days: 1,
        },
      });

      assert.strictEqual(res.status, 200);
      const data = res.data.data;
      assert.strictEqual(data.havanCount, 3);
      assert.strictEqual(data.days, 1);
      assert.strictEqual(data.basePrice, 11000);
      assert.strictEqual(data.havanAddonPrice, 8000);
      assert.strictEqual(data.dayAddonPrice, 0);
      assert.strictEqual(data.totalAmount, 19000);
      assert.strictEqual(data.durationSelected, '3 Havans (1 Day)');
    });

    // Test 3: 5 Havans / 2 Days
    await test('3. 5 Havans / 2 Days calculation (₹11,000 + 4 * ₹4,000 + 1 * ₹3,500 = ₹30,500)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          havanCount: 5,
          days: 2,
        },
      });

      assert.strictEqual(res.status, 200);
      const data = res.data.data;
      assert.strictEqual(data.havanCount, 5);
      assert.strictEqual(data.days, 2);
      assert.strictEqual(data.basePrice, 11000);
      assert.strictEqual(data.havanAddonPrice, 16000);
      assert.strictEqual(data.dayAddonPrice, 3500);
      assert.strictEqual(data.totalAmount, 30500);
      assert.strictEqual(data.durationSelected, '5 Havans (2 Days)');
    });

    // Test 4: 11 Havans / 3 Days
    await test('4. 11 Havans / 3 Days calculation (₹11,000 + 10 * ₹4,000 + 2 * ₹3,500 = ₹58,000)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          havanCount: 11,
          days: 3,
        },
      });

      assert.strictEqual(res.status, 200);
      const data = res.data.data;
      assert.strictEqual(data.havanCount, 11);
      assert.strictEqual(data.days, 3);
      assert.strictEqual(data.basePrice, 11000);
      assert.strictEqual(data.havanAddonPrice, 40000);
      assert.strictEqual(data.dayAddonPrice, 7000);
      assert.strictEqual(data.totalAmount, 58000);
      assert.strictEqual(data.durationSelected, '11 Havans (3 Days)');
    });

    // Test 5: Unsupported Havan count rejected
    await test('5. Unsupported Havan count rejected (4 Havans not in [1, 3, 5, 7, 11])', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          havanCount: 4,
          days: 1,
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('Selected Havan count of 4 is not available'));
    });

    // Test 6: Unsupported Days rejected
    await test('6. Unsupported Days rejected (4 Days not in [1, 2, 3])', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          havanCount: 5,
          days: 4,
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('Selected duration of 4 days is not available'));
    });

    // Test 7: 1 Havan + 3 Days rejected (Coupling Rule)
    await test('7. 1 Havan + 3 Days coupling rule rejected with HTTP 400', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          havanCount: 1,
          days: 3,
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('A single Havan (1 Havan) must be completed in 1 day'));
    });

    // Test 8: Below minimum Pandit count rejected
    await test('8. Below minimum Pandit count rejected (1 pandit when min is 2)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          havanCount: 1,
          days: 1,
          panditCount: 1,
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('below the required minimum of 2'));
    });

    // Test 9: Above maximum Pandit count rejected
    await test('9. Above maximum Pandit count rejected (15 pandits when max is 11)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          havanCount: 1,
          days: 1,
          panditCount: 15,
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('exceeds the maximum allowed limit of 11'));
    });

    // Test 10: Valid custom Pandit count accepted with no surcharge
    await test('10. Valid custom Pandit count accepted (6 pandits, ₹0 surcharge)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          havanCount: 1,
          days: 1,
          panditCount: 6,
        },
      });

      assert.strictEqual(res.status, 200);
      const data = res.data.data;
      assert.strictEqual(data.panditCount, 6);
      assert.strictEqual(data.panditAddonPrice, 0);
      assert.strictEqual(data.totalAmount, 11000);
    });

    // Test 11: Fake client price cannot override authoritative amount
    await test('11. Fake client price cannot override authoritative amount', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          havanCount: 3,
          days: 1,
          basePrice: 1,
          totalAmount: 1,
          havanAddonPrice: 1,
          dayAddonPrice: 1,
          pricingSource: 'FAKE_PRICE_SOURCE',
        },
      });

      assert.strictEqual(res.status, 200);
      const data = res.data.data;
      assert.strictEqual(data.basePrice, 11000);
      assert.strictEqual(data.havanAddonPrice, 8000);
      assert.strictEqual(data.dayAddonPrice, 0);
      assert.strictEqual(data.totalAmount, 19000);
      assert.strictEqual(data.pricingSource, 'HOMA_CONFIGURED_PRICING');
    });

    // Test 12: Completion date calculated correctly
    await test('12. Completion date calculated correctly (2026-10-15 + 2 days = 2026-10-16)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          havanCount: 5,
          days: 2,
          commencementDate: '2026-10-15',
        },
      });

      assert.strictEqual(res.status, 200);
      const data = res.data.data;
      assert.strictEqual(data.commencementDate, '2026-10-15');
      assert.strictEqual(data.completionDate, '2026-10-16');
    });

    // =========================================================================
    // BOOKING TESTS (13 - 19)
    // =========================================================================

    // Test 13: HOMA booking returns 201
    await test('13. HOMA booking creation returns 201 Created', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          configuration: {
            commencementDate: '2026-10-20',
            timeSlot: '07:00 AM',
            havanCount: 3,
            days: 1,
            panditCount: 4,
            arrangementMode: 'kashi',
          },
          location: {
            locationType: 'kashi',
            venueDetails: { notes: 'Assi Ghat Homa Kunda' },
          },
          yajman: {
            name: 'Vikramaditya Roy',
            mobile: '9876543210',
            email: 'vikram.roy@example.com',
            gotra: 'Bharadwaja',
          },
          sankalp: {
            purpose: 'Longevity and protection',
            mainIntention: 'Maha Mrityunjaya Sacred Fire Sacraments',
          },
          familyMembers: [{ name: 'Radhika Roy', relation: 'Spouse' }],
          // Send malicious fake prices to verify authoritative server enforcement
          totalAmount: 1,
          basePrice: 1,
          havanAddonPrice: 1,
        },
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.bookingReference);
      createdHomaBookingRef = res.data.data.bookingReference;
      createdTestBookings.push(createdHomaBookingRef);
    });

    // Test 14: Reference matches VEDA-HOMA pattern
    await test('14. Booking reference matches VEDA-HOMA-XXXXXXXX pattern', async () => {
      assert.ok(createdHomaBookingRef != null);
      assert.match(createdHomaBookingRef, /^VEDA-HOMA-[A-Z0-9]+$/);
    });

    // Test 15: service_type = HOMA in database
    await test('15. service_type is HOMA and authoritative price is stored in DB', async () => {
      const booking = await RitualBooking.findOne({
        where: { bookingReference: createdHomaBookingRef },
      });
      assert.ok(booking != null);
      assert.strictEqual(booking.serviceType, 'HOMA');
      assert.strictEqual(booking.serviceSlug, 'maha-mrityunjaya-homa');
      // Verify fake client price of ₹1 was ignored in DB
      assert.strictEqual(Number(booking.basePrice), 11000);
      assert.strictEqual(Number(booking.totalAmount), 19000);
    });

    // Test 16: durationSelected is correct
    await test('16. durationSelected is stored correctly ("3 Havans (1 Day)")', async () => {
      const booking = await RitualBooking.findOne({
        where: { bookingReference: createdHomaBookingRef },
      });
      assert.strictEqual(booking.durationSelected, '3 Havans (1 Day)');
    });

    // Test 17: homaMetadata persists correctly in sankalpDetails
    await test('17. homaMetadata persists correctly in sankalpDetails JSONB', async () => {
      const booking = await RitualBooking.findOne({
        where: { bookingReference: createdHomaBookingRef },
      });
      const meta = booking.sankalpDetails?.homaMetadata;
      assert.ok(meta != null, 'homaMetadata must exist');
      assert.strictEqual(meta.havanCount, 3);
      assert.strictEqual(meta.durationDays, 1);
      assert.strictEqual(meta.panditCount, 4);
      assert.strictEqual(meta.commencementDate, '2026-10-20');
      assert.strictEqual(meta.completionDate, '2026-10-20');
      assert.strictEqual(meta.pricingSource, 'HOMA_CONFIGURED_PRICING');
      assert.deepStrictEqual(meta.priceBreakdown, {
        basePrice: 11000,
        havanAddonPrice: 8000,
        dayAddonPrice: 0,
        panditAddonPrice: 0,
        addonsTotal: 0,
        totalAmount: 19000,
      });
    });

    // Test 18: GET booking returns HOMA metadata
    await test('18. GET /api/ritual-bookings/:ref returns HOMA configuration and metadata', async () => {
      const res = await request({
        method: 'GET',
        path: `/api/ritual-bookings/${createdHomaBookingRef}`,
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      const data = res.data.data;
      assert.strictEqual(data.bookingReference, createdHomaBookingRef);
      assert.strictEqual(data.service.type, 'HOMA');
      assert.strictEqual(data.service.slug, 'maha-mrityunjaya-homa');
      assert.strictEqual(data.configuration.havanCount, 3);
      assert.strictEqual(data.configuration.durationDays, 1);
      assert.strictEqual(data.configuration.panditCount, 4);
      assert.strictEqual(data.configuration.pricingSource, 'HOMA_CONFIGURED_PRICING');
      assert.strictEqual(data.pricing.totalAmount, 19000);
    });

    // Test 19: Inactive or non-existent Homa service rejected
    await test('19. Non-existent Homa service rejected with HTTP 404', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'non-existent-homa-slug',
          configuration: {
            commencementDate: '2026-10-20',
            timeSlot: '07:00 AM',
            havanCount: 1,
            days: 1,
            arrangementMode: 'kashi',
          },
          location: { locationType: 'kashi' },
          yajman: { name: 'Test', mobile: '9999999999' },
          sankalp: { purpose: 'Test' },
        },
      });

      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('Homa service not found'));
    });

    // =========================================================================
    // RESOLVER / REGRESSION TESTS (20 - 25)
    // =========================================================================

    // Test 20: VEDA-HOMA resolves correctly
    await test('20. VEDA-HOMA resolves correctly via bookingResolver.service.js', async () => {
      const adapter = await resolveBookingEntity(createdHomaBookingRef);
      assert.ok(adapter != null);
      assert.strictEqual(adapter.type, 'RITUAL');
      assert.strictEqual(adapter.reference, createdHomaBookingRef);
      assert.strictEqual(adapter.authoritativeAmount, 19000);
      assert.strictEqual(adapter.customerDetails.name, 'Vikramaditya Roy');
    });

    // Test 21: HOMA returnUrl points to /yagya-puja/homa/:slug/booking-status
    await test('21. HOMA returnUrl points to /yagya-puja/homa/:slug/booking-status', async () => {
      const adapter = await resolveBookingEntity(createdHomaBookingRef);
      const expectedPath = '/yagya-puja/homa/maha-mrityunjaya-homa/booking-status?order_id={order_id}';
      assert.ok(
        adapter.returnUrl.includes(expectedPath),
        `Expected returnUrl to contain "${expectedPath}", received "${adapter.returnUrl}"`
      );
    });

    // Test 22: Puja calculate-price regression
    await test('22. PUJA calculate-price regression passes', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PUJA',
          serviceSlug: 'maha-mrityunjaya-puja',
          durationHours: 3,
          panditCount: 1,
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.serviceType, 'PUJA');
      assert.strictEqual(res.data.data.basePrice, 1500);
      assert.strictEqual(res.data.data.totalAmount, 1500);
    });

    // Test 23: Yagya calculate-price regression
    await test('23. YAGYA calculate-price regression passes', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'YAGYA',
          serviceSlug: 'navagraha-shanti-maha-yagya',
          days: 3,
          panditCount: 7,
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.serviceType, 'YAGYA');
      assert.strictEqual(res.data.data.basePrice, 25000);
      assert.strictEqual(res.data.data.totalAmount, 25000);
    });

    // Test 24: Japa calculate-price regression
    await test('24. JAPA calculate-price regression passes', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'JAPA',
          serviceSlug: 'maha-mrityunjaya-japa',
          japaCount: 11000,
          panditCount: 2,
          commencementDate: '2026-10-15',
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.serviceType, 'JAPA');
      assert.strictEqual(res.data.data.basePrice, 18000);
      assert.strictEqual(res.data.data.totalAmount, 18000);
      assert.strictEqual(res.data.data.requiredDays, 3);
    });

    // Test 25: Homa public catalogue regression
    await test('25. HOMA public catalogue regression passes (GET /api/homa-services)', async () => {
      const res = await request({
        method: 'GET',
        path: '/api/homa-services',
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(Array.isArray(res.data.data));
      assert.strictEqual(res.data.data.length, 8);
    });
  } finally {
    // Database Safety: Clean up created test bookings
    console.log('\nCleaning up test artifacts...');
    for (const ref of createdTestBookings) {
      try {
        await RitualBooking.destroy({ where: { bookingReference: ref } });
      } catch (err) {
        console.warn(`Failed to clean test booking ${ref}:`, err.message);
      }
    }
    console.log('Cleanup complete.');

    if (server) {
      server.close();
    }
  }

  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runH3Tests().catch((err) => {
  console.error('Test execution fatal error:', err);
  process.exit(1);
});
