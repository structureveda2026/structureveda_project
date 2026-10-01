require('dotenv').config({ path: __dirname + '/.env' });
const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');

// Load database & models
const db = require('./src/models/index.js').default;
const {
  User,
  PathService,
  RitualBooking,
  PujaService,
  YagyaService,
  JapaService,
  HomaService,
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
const createdTestUsers = [];

async function runP3Tests() {
  console.log('================================================================');
  console.log('PHASE P3: PATH PRICING ENGINE + RITUAL BOOKING BACKEND TESTS');
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

  let createdPathBookingRef = null;
  let authenticatedPathBookingRef = null;

  // Setup Auth Users and Tokens
  let testUserA = await User.create({
    fullName: 'Path Devotee A',
    email: `path_devotee_a_${Date.now()}@example.com`,
    password: 'hashed_password_123',
    role: 'user',
    isActive: true,
  });
  createdTestUsers.push(testUserA.id);

  const tokenUserA = jwt.sign(
    { id: testUserA.id, email: testUserA.email, role: 'user' },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '2h' }
  );

  let testUserB = await User.create({
    fullName: 'Path Devotee B',
    email: `path_devotee_b_${Date.now()}@example.com`,
    password: 'hashed_password_123',
    role: 'user',
    isActive: true,
  });
  createdTestUsers.push(testUserB.id);

  const tokenUserB = jwt.sign(
    { id: testUserB.id, email: testUserB.email, role: 'user' },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '2h' }
  );

  try {
    // =========================================================================
    // PRICING TESTS (1 - 15)
    // =========================================================================

    // Test 1: PATH calculate-price returns 200
    await test('1. PATH calculate-price returns 200', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'sundarkand-path',
          format: 'single_session',
          duration: '3 to 4 Hours',
          days: 1,
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
    });

    // Test 2: Valid service resolves
    await test('2. Valid service resolves (sundarkand-path, ₹5,100)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'sundarkand-path',
        },
      });

      assert.strictEqual(res.status, 200);
      const data = res.data.data;
      assert.strictEqual(data.serviceType, 'PATH');
      assert.strictEqual(data.serviceSlug, 'sundarkand-path');
      assert.strictEqual(data.serviceName, 'Sundarkand Path');
      assert.strictEqual(data.basePrice, 5100);
      assert.strictEqual(data.totalAmount, 5100);
      assert.strictEqual(data.pricingSource, 'PATH_CANONICAL_PRICING');
    });

    // Test 3: Valid format accepted
    await test('3. Valid format accepted (same_day)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'sundarkand-path',
          format: 'same_day',
          days: 1,
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.data.format, 'same_day');
    });

    // Test 4: Valid duration accepted
    await test('4. Valid duration accepted ("3 to 4 Hours")', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'sundarkand-path',
          duration: '3 to 4 Hours',
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.data.duration, '3 to 4 Hours');
    });

    // Test 5: Valid day count accepted
    await test('5. Valid day count accepted (days: 3 for durga-saptashati-path)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'durga-saptashati-path',
          format: 'multi_day',
          days: 3,
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.data.days, 3);
      assert.strictEqual(res.data.data.totalAmount, 11000);
    });

    // Test 6: Invalid service rejected
    await test('6. Invalid service rejected with HTTP 404', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'non-existent-scripture-path',
        },
      });

      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('Path service not found'));
    });

    // Test 7: Inactive service rejected
    await test('7. Inactive service rejected with HTTP 404', async () => {
      const inactive = await PathService.create({
        slug: 'test-inactive-path-p3-root',
        name: 'Inactive Path Test Root',
        scripture: 'Inactive Scripture',
        pathType: 'Vedic Path',
        startingPrice: 1000,
        isActive: false,
      });

      try {
        const res = await request({
          method: 'POST',
          path: '/api/ritual-bookings/calculate-price',
          body: {
            serviceType: 'PATH',
            serviceSlug: 'test-inactive-path-p3-root',
          },
        });

        assert.strictEqual(res.status, 404);
        assert.strictEqual(res.data.success, false);
      } finally {
        await inactive.destroy();
      }
    });

    // Test 8: Unsupported format rejected
    await test('8. Unsupported format rejected with HTTP 400', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'sundarkand-path',
          format: 'multi_day', // sundarkand only supports single_session and same_day
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('not available for this Path'));
    });

    // Test 9: Unsupported duration rejected
    await test('9. Unsupported duration rejected with HTTP 400', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'sundarkand-path',
          duration: '100 Hours Non-Existent Duration',
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('not available for this Path'));
    });

    // Test 10: Days below minimum rejected
    await test('10. Days below minimum rejected with HTTP 400', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'durga-saptashati-path',
          days: 0,
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
    });

    // Test 11: Days above maximum rejected
    await test('11. Days above maximum rejected with HTTP 400 (sundarkand maxDays = 1, requested 2)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'sundarkand-path',
          days: 2,
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('exceeds the maximum allowed'));
    });

    // Test 12: Pandits below minimum rejected
    await test('12. Pandits below minimum rejected with HTTP 400', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'sundarkand-path',
          panditCount: 1, // min is 2
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('below the required minimum'));
    });

    // Test 13: Pandits above maximum rejected
    await test('13. Pandits above maximum rejected with HTTP 400', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'sundarkand-path',
          panditCount: 10, // max is 5
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('exceeds the maximum allowed'));
    });

    // Test 14: Backend calculates authoritative amount
    await test('14. Backend calculates authoritative amount (startingPrice from DB)', async () => {
      const resRamcharit = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'ramcharitmanas-navah-parayan',
        },
      });

      assert.strictEqual(resRamcharit.status, 200);
      assert.strictEqual(resRamcharit.data.data.totalAmount, 31000);
      assert.strictEqual(resRamcharit.data.data.formattedTotal, '₹31,000');
    });

    // Test 15: Fake client price is ignored/rejected
    await test('15. Fake client price is ignored (client sending totalAmount: 1 is ignored)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'sundarkand-path',
          totalAmount: 1,
          basePrice: 1,
          startingPrice: 1,
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.data.totalAmount, 5100);
      assert.strictEqual(res.data.data.basePrice, 5100);
    });

    // =========================================================================
    // COMPLETION DATE TESTS (16 - 18)
    // =========================================================================

    // Test 16: Valid commencement date produces server completion date
    await test('16. Valid commencement date produces server completion date', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'sundarkand-path',
          commencementDate: '2026-10-15',
          days: 1,
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.data.commencementDate, '2026-10-15');
      assert.strictEqual(res.data.data.completionDate, '2026-10-15');
    });

    // Test 17: Completion date uses required days correctly
    await test('17. Completion date uses required days correctly (2026-10-15 + 3 days = 2026-10-17)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'durga-saptashati-path',
          commencementDate: '2026-10-15',
          days: 3,
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.data.completionDate, '2026-10-17');
    });

    // Test 18: Client-provided completion date cannot override server value
    await test('18. Client-provided completion date mismatch rejected with HTTP 400', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'durga-saptashati-path',
          configuration: {
            commencementDate: '2026-10-15',
            completionDate: '2026-10-30', // Fake client completion date! Server expects 2026-10-17 for 3 days
            days: 3,
            timeSlot: '07:00 AM',
            format: 'multi_day',
            arrangementMode: 'kashi',
          },
          location: { locationType: 'kashi' },
          yajman: { name: 'Mismatched Date Tester', mobile: '9876543210' },
          sankalp: { purpose: 'Devotion and Peace' },
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('Completion date mismatch'));
    });

    // =========================================================================
    // BOOKING CREATION TESTS (19 - 25)
    // =========================================================================

    // Test 19: PATH booking returns 201
    await test('19. PATH booking returns 201 Created', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'sundarkand-path',
          configuration: {
            commencementDate: '2026-10-25',
            timeSlot: '06:30 AM',
            format: 'single_session',
            durationSelected: '3 to 4 Hours',
            days: 1,
            panditCount: 3,
            arrangementMode: 'kashi',
          },
          location: { locationType: 'kashi' },
          yajman: {
            name: 'Acharya Devavrat',
            mobile: '9876543210',
            email: 'devavrat@example.com',
          },
          sankalp: {
            purpose: 'Overcoming obstacles and family peace',
            gotra: 'Kashyapa',
          },
          familyMembers: [{ name: 'Ananya Devavrat' }],
        },
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.bookingReference);
      createdPathBookingRef = res.data.data.bookingReference;
      createdTestBookings.push(createdPathBookingRef);
    });

    // Test 20: Booking reference starts with VEDA-PATH-
    await test('20. Booking reference starts with VEDA-PATH-', async () => {
      assert.ok(createdPathBookingRef.startsWith('VEDA-PATH-'));
      assert.match(createdPathBookingRef, /^VEDA-PATH-[A-Z0-9]+$/);
    });

    // Test 21: Booking has serviceType PATH
    await test('21. Booking has serviceType PATH in database', async () => {
      const record = await RitualBooking.findOne({
        where: { bookingReference: createdPathBookingRef },
      });
      assert.ok(record != null);
      assert.strictEqual(record.serviceType, 'PATH');
      assert.strictEqual(record.serviceSlug, 'sundarkand-path');
    });

    // Test 22: Path metadata exists in sankalpDetails
    await test('22. Path metadata exists in sankalpDetails JSONB', async () => {
      const record = await RitualBooking.findOne({
        where: { bookingReference: createdPathBookingRef },
      });
      assert.ok(record.sankalpDetails != null);
      assert.ok(record.sankalpDetails.pathMetadata != null);
    });

    // Test 23: Path metadata contains selected configuration
    await test('23. Path metadata contains complete recitation configuration', async () => {
      const record = await RitualBooking.findOne({
        where: { bookingReference: createdPathBookingRef },
      });
      const meta = record.sankalpDetails.pathMetadata;
      assert.strictEqual(meta.serviceSlug, 'sundarkand-path');
      assert.strictEqual(meta.serviceName, 'Sundarkand Path');
      assert.strictEqual(meta.selectedFormat, 'single_session');
      assert.strictEqual(meta.selectedDuration, '3 to 4 Hours');
      assert.strictEqual(meta.selectedDays, 1);
      assert.strictEqual(meta.panditCount, 3);
      assert.strictEqual(meta.commencementDate, '2026-10-25');
      assert.strictEqual(meta.completionDate, '2026-10-25');
      assert.strictEqual(meta.pricingSource, 'PATH_CANONICAL_PRICING');
      assert.deepStrictEqual(meta.priceBreakdown, {
        basePrice: 5100,
        panditAddonPrice: 0,
        addonsTotal: 0,
        totalAmount: 5100,
      });
    });

    // Test 24: Booking stores calculated amount
    await test('24. Booking stores calculated amount (₹5,100)', async () => {
      const record = await RitualBooking.findOne({
        where: { bookingReference: createdPathBookingRef },
      });
      assert.strictEqual(Number(record.totalAmount), 5100);
      assert.strictEqual(Number(record.basePrice), 5100);
    });

    // Test 25: Booking stores server-derived completion date
    await test('25. Booking stores server-derived completion date', async () => {
      const record = await RitualBooking.findOne({
        where: { bookingReference: createdPathBookingRef },
      });
      assert.strictEqual(record.sankalpDetails.pathMetadata.completionDate, '2026-10-25');
    });

    // =========================================================================
    // SECURITY TESTS (26 - 28)
    // =========================================================================

    // Test 26: Guest booking works according to existing guest rules
    await test('26. Guest booking works (userId is null, accessible by reference)', async () => {
      const record = await RitualBooking.findOne({
        where: { bookingReference: createdPathBookingRef },
      });
      assert.strictEqual(record.userId, null);

      const res = await request({
        method: 'GET',
        path: `/api/ritual-bookings/${createdPathBookingRef}`,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
    });

    // Test 27: Authenticated booking works
    await test('27. Authenticated booking works (userId linked to User A)', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings',
        headers: {
          Authorization: `Bearer ${tokenUserA}`,
        },
        body: {
          serviceType: 'PATH',
          serviceSlug: 'durga-saptashati-path',
          configuration: {
            commencementDate: '2026-11-01',
            timeSlot: '07:00 AM',
            format: 'multi_day',
            days: 3,
            panditCount: 3,
            arrangementMode: 'remote',
          },
          location: { locationType: 'remote' },
          yajman: { name: 'User A Devotee', mobile: '9988776655' },
          sankalp: { purpose: 'Protection and Spiritual Shakti' },
        },
      });

      assert.strictEqual(res.status, 201);
      authenticatedPathBookingRef = res.data.data.bookingReference;
      createdTestBookings.push(authenticatedPathBookingRef);

      const record = await RitualBooking.findOne({
        where: { bookingReference: authenticatedPathBookingRef },
      });
      assert.strictEqual(record.userId, testUserA.id);
    });

    // Test 28: Unauthorized booking access is rejected according to existing rules
    await test('28. Unauthorized booking access rejected (User B cannot access User A booking)', async () => {
      const res = await request({
        method: 'GET',
        path: `/api/ritual-bookings/${authenticatedPathBookingRef}`,
        headers: {
          Authorization: `Bearer ${tokenUserB}`,
        },
      });

      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.data.success, false);
      assert.ok(
        res.data.message.includes('permission') ||
        res.data.message.includes('not authorized') ||
        res.data.message.includes('Unauthorized')
      );
    });

    // =========================================================================
    // RESOLUTION & REGRESSION TESTS (29 - 36)
    // =========================================================================

    // Test 29: VEDA-PATH reference resolves correctly
    await test('29. VEDA-PATH reference resolves correctly via bookingResolver.service.js', async () => {
      const adapter = await resolveBookingEntity(createdPathBookingRef);
      assert.ok(adapter != null);
      assert.strictEqual(adapter.type, 'RITUAL');
      assert.strictEqual(adapter.reference, createdPathBookingRef);
      assert.strictEqual(adapter.authoritativeAmount, 5100);
      assert.strictEqual(adapter.customerDetails.name, 'Acharya Devavrat');
      const expectedPath = '/yagya-puja/path/sundarkand-path/booking-status?order_id={order_id}';
      assert.ok(
        adapter.returnUrl.includes(expectedPath),
        `Expected returnUrl to contain "${expectedPath}", received "${adapter.returnUrl}"`
      );
    });

    // Test 30: Existing PUJA booking behavior remains intact
    await test('30. Existing PUJA booking behavior remains intact', async () => {
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
      assert.strictEqual(res.data.data.serviceType, 'PUJA');
      assert.strictEqual(res.data.data.totalAmount, 1500);
    });

    // Test 31: Existing YAGYA booking behavior remains intact
    await test('31. Existing YAGYA booking behavior remains intact', async () => {
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
      assert.strictEqual(res.data.data.serviceType, 'YAGYA');
      assert.strictEqual(res.data.data.totalAmount, 25000);
    });

    // Test 32: Existing HOMA booking behavior remains intact
    await test('32. Existing HOMA booking behavior remains intact', async () => {
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
      assert.strictEqual(res.data.data.serviceType, 'HOMA');
      assert.strictEqual(res.data.data.totalAmount, 19000);
    });

    // Test 33: Existing JAPA booking behavior remains intact
    await test('33. Existing JAPA booking behavior remains intact', async () => {
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
      assert.strictEqual(res.data.data.serviceType, 'JAPA');
      assert.strictEqual(res.data.data.totalAmount, 18000);
    });

    // Test 34: Single-session coupling rule: single_session with days: 3 rejected
    await test('34. Single-session coupling rule: single_session with days: 3 rejected with HTTP 400', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: 'shiva-mahimna-rudri-path',
          format: 'single_session',
          days: 3,
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('must be completed in 1 day'));
    });

    // Test 35: GET /api/ritual-bookings/:ref returns Path configuration and metadata
    await test('35. GET /api/ritual-bookings/:ref returns Path configuration and metadata', async () => {
      const res = await request({
        method: 'GET',
        path: `/api/ritual-bookings/${createdPathBookingRef}`,
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      const data = res.data.data;
      assert.strictEqual(data.bookingReference, createdPathBookingRef);
      assert.strictEqual(data.service.type, 'PATH');
      assert.strictEqual(data.service.slug, 'sundarkand-path');
      assert.strictEqual(data.configuration.format, 'single_session');
      assert.strictEqual(data.configuration.days, 1);
      assert.strictEqual(data.configuration.pricingSource, 'PATH_CANONICAL_PRICING');
      assert.strictEqual(data.pricing.totalAmount, 5100);
    });

    // Test 36: Path public catalogue regression passes (GET /api/path-services)
    await test('36. Path public catalogue regression passes (GET /api/path-services)', async () => {
      const res = await request({
        method: 'GET',
        path: '/api/path-services',
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(Array.isArray(res.data.data));
      assert.strictEqual(res.data.data.length, 8);
    });

  } finally {
    // Database Safety: Clean up created test bookings and users
    console.log('\nCleaning up test artifacts...');
    for (const ref of createdTestBookings) {
      try {
        await RitualBooking.destroy({ where: { bookingReference: ref } });
      } catch (err) {
        console.warn(`Failed to clean test booking ${ref}:`, err.message);
      }
    }
    for (const userId of createdTestUsers) {
      try {
        await User.destroy({ where: { id: userId } });
      } catch (err) {
        console.warn(`Failed to clean test user ${userId}:`, err.message);
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

runP3Tests().catch((err) => {
  console.error('Test execution fatal error:', err);
  process.exit(1);
});
