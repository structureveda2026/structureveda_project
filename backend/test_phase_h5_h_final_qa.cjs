require('dotenv').config({ path: __dirname + '/.env' });
const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Load database & models
const db = require('./src/models/index.js').default;
const {
  User,
  HomaService,
  HomaPurpose,
  RitualBooking,
} = db;

const { resolveBookingEntity } = require('./src/services/bookingResolver.service.js');

let baseUrl = 'http://127.0.0.1:5000';

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

const createdTestServiceIds = [];
const createdTestBookings = [];
const createdTestUsers = [];

async function runH5HFinalQA() {
  console.log('================================================================');
  console.log('PHASE H5-H: HOMA ADMIN & E2E FINAL QA VERIFICATION');
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

  // 1. Setup Auth Tokens
  let adminUser = await User.findOne({ where: { role: 'admin', isActive: true } });
  if (!adminUser) {
    adminUser = await User.create({
      fullName: 'H5H QA Admin',
      email: `h5h_admin_${Date.now()}@example.com`,
      password: 'hashed_password_123',
      role: 'admin',
      isActive: true,
    });
    createdTestUsers.push(adminUser.id);
  }

  const adminToken = jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: 'admin' },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '2h' }
  );

  let regularUser = await User.findOne({ where: { role: 'user', isActive: true } });
  if (!regularUser) {
    regularUser = await User.create({
      fullName: 'H5H QA Regular User',
      email: `h5h_user_${Date.now()}@example.com`,
      password: 'hashed_password_123',
      role: 'user',
      isActive: true,
    });
    createdTestUsers.push(regularUser.id);
  }

  const userToken = jwt.sign(
    { id: regularUser.id, email: regularUser.email, role: 'user' },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '2h' }
  );

  const adminHeaders = { Authorization: `Bearer ${adminToken}` };
  const userHeaders = { Authorization: `Bearer ${userToken}` };

  try {
    // -------------------------------------------------------------
    // SECTION 1: DATABASE & CATALOGUE BASELINE
    // -------------------------------------------------------------
    await test('1. GET /api/homa-services returns 8 active canonical services', async () => {
      const res = await request({ method: 'GET', path: '/api/homa-services' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      const items = res.data.data.items || res.data.data;
      assert.strictEqual(items.length, 8);
    });

    await test('2. GET /api/homa-services/purposes returns 6 seeded purposes', async () => {
      const res = await request({ method: 'GET', path: '/api/homa-services/purposes' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.length, 6);
    });

    // -------------------------------------------------------------
    // SECTION 2: ADMIN AUTHENTICATION
    // -------------------------------------------------------------
    await test('3. Unauthenticated request to /api/admin/homa-services returns 401', async () => {
      const res = await request({ method: 'GET', path: '/api/admin/homa-services' });
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.data.success, false);
    });

    await test('4. Non-admin request to /api/admin/homa-services returns 403', async () => {
      const res = await request({
        method: 'GET',
        path: '/api/admin/homa-services',
        headers: userHeaders,
      });
      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.data.success, false);
    });

    await test('5. Authenticated Admin request to /api/admin/homa-services returns 200', async () => {
      const res = await request({
        method: 'GET',
        path: '/api/admin/homa-services',
        headers: adminHeaders,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(Array.isArray(res.data.data));
      assert.ok(res.data.total >= 8);
    });

    // -------------------------------------------------------------
    // SECTION 3: ADMIN LIST & FILTERS & SORT & SEARCH
    // -------------------------------------------------------------
    await test('6. Admin List Search filter finds canonical Homa by name', async () => {
      const res = await request({
        method: 'GET',
        path: '/api/admin/homa-services?search=Mrityunjaya',
        headers: adminHeaders,
      });
      assert.strictEqual(res.status, 200);
      const items = res.data.data;
      assert.ok(items.length >= 1);
      assert.ok(items.some(s => s.name.includes('Mrityunjaya')));
    });

    let testPurposeId = null;
    await test('7. Admin List Purpose filter filters by dynamic purpose (UUID or slug)', async () => {
      const purposeRes = await request({ method: 'GET', path: '/api/homa-services/purposes' });
      const purpose = purposeRes.data.data[0];
      testPurposeId = purpose.id;

      const res = await request({
        method: 'GET',
        path: `/api/admin/homa-services?purpose=${purpose.id}`,
        headers: adminHeaders,
      });
      assert.strictEqual(res.status, 200);
      const items = res.data.data;
      for (const item of items) {
        assert.strictEqual(item.purposeId, purpose.id);
      }
    });

    await test('8. Admin List Status filter filters by active/inactive', async () => {
      const resActive = await request({
        method: 'GET',
        path: '/api/admin/homa-services?isActive=true',
        headers: adminHeaders,
      });
      assert.strictEqual(resActive.status, 200);
      for (const item of resActive.data.data) {
        assert.strictEqual(item.isActive, true);
      }
    });

    await test('9. Admin List Featured filter filters by featured status', async () => {
      const resFeatured = await request({
        method: 'GET',
        path: '/api/admin/homa-services?isFeatured=true',
        headers: adminHeaders,
      });
      assert.strictEqual(resFeatured.status, 200);
      for (const item of resFeatured.data.data) {
        assert.strictEqual(item.isFeatured, true);
      }
    });

    await test('10. Admin List Sorting works for price asc', async () => {
      const resPriceAsc = await request({
        method: 'GET',
        path: '/api/admin/homa-services?sortBy=price-asc',
        headers: adminHeaders,
      });
      assert.strictEqual(resPriceAsc.status, 200);
      const items = resPriceAsc.data.data;
      for (let i = 1; i < items.length; i++) {
        assert.ok(items[i].basePrice >= items[i - 1].basePrice);
      }
    });

    await test('11. Admin List Pagination respects page and limit parameters', async () => {
      const res = await request({
        method: 'GET',
        path: '/api/admin/homa-services?page=1&limit=3',
        headers: adminHeaders,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.data.length, 3);
      assert.strictEqual(res.data.page, 1);
      assert.strictEqual(res.data.limit, 3);
      assert.ok(res.data.total >= 8);
    });

    // -------------------------------------------------------------
    // SECTION 4: ADMIN DETAIL PAGE & CANONICAL DATA INTEGRITY
    // -------------------------------------------------------------
    let canonicalHoma = null;
    await test('12. Admin Detail returns full detailed record for canonical Homa', async () => {
      const listRes = await request({
        method: 'GET',
        path: '/api/admin/homa-services?limit=1',
        headers: adminHeaders,
      });
      canonicalHoma = listRes.data.data[0];

      const res = await request({
        method: 'GET',
        path: `/api/admin/homa-services/${canonicalHoma.id}`,
        headers: adminHeaders,
      });
      assert.strictEqual(res.status, 200);
      const detail = res.data.data;
      assert.strictEqual(detail.id, canonicalHoma.id);
      assert.strictEqual(detail.name, canonicalHoma.name);
      assert.ok(Array.isArray(detail.availableHavanCounts));
      assert.ok(Array.isArray(detail.availableDays));
      assert.ok(detail.minimumPandits >= 1);
      assert.ok(detail.recommendedPandits >= detail.minimumPandits);
      assert.ok(detail.maximumPandits >= detail.recommendedPandits);
    });

    // -------------------------------------------------------------
    // SECTION 5: ADMIN EDIT FLOW (REVERSIBLE ON CANONICAL DATA)
    // -------------------------------------------------------------
    await test('13. Admin Edit allows reversible update on canonical service and restores it', async () => {
      const origRes = await request({
        method: 'GET',
        path: `/api/admin/homa-services/${canonicalHoma.id}`,
        headers: adminHeaders,
      });
      const originalShortDesc = origRes.data.data.shortDescription;
      const tempDesc = `${originalShortDesc} [QA Temp Reversible Edit]`;

      // Apply temporary edit
      const updateRes = await request({
        method: 'PUT',
        path: `/api/admin/homa-services/${canonicalHoma.id}`,
        headers: adminHeaders,
        body: {
          shortDescription: tempDesc,
        },
      });
      assert.strictEqual(updateRes.status, 200);
      assert.strictEqual(updateRes.data.data.shortDescription, tempDesc);

      // Verify in detail endpoint
      const verifyRes = await request({
        method: 'GET',
        path: `/api/admin/homa-services/${canonicalHoma.id}`,
        headers: adminHeaders,
      });
      assert.strictEqual(verifyRes.data.data.shortDescription, tempDesc);

      // Restore original value
      const restoreRes = await request({
        method: 'PUT',
        path: `/api/admin/homa-services/${canonicalHoma.id}`,
        headers: adminHeaders,
        body: {
          shortDescription: originalShortDesc,
        },
      });
      assert.strictEqual(restoreRes.status, 200);
      assert.strictEqual(restoreRes.data.data.shortDescription, originalShortDesc);
    });

    // -------------------------------------------------------------
    // SECTION 6: ADMIN CREATE, DEACTIVATE, REACTIVATE, CLEANUP
    // -------------------------------------------------------------
    let qaServiceId = null;
    const qaSlug = `qa-test-homa-${Date.now()}`;
    await test('14. Admin Create creates a temporary QA Homa service', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/admin/homa-services',
        headers: adminHeaders,
        body: {
          name: 'QA Test Homa Service',
          slug: qaSlug,
          homaType: 'Vedic Homa',
          shortDescription: 'QA temporary test homa',
          description: 'Full description of QA temporary test homa',
          purposeId: testPurposeId,
          purposeSummary: 'For testing admin flows',
          availableHavanCounts: [1, 3, 5],
          availableDays: [1, 2],
          minimumPandits: 2,
          recommendedPandits: 3,
          maximumPandits: 7,
          requiredSkills: ['Havan Vidhi'],
          dailyHours: '3 Hours',
          havanCapacityPerPandit: '1 Havan Daily',
          isKashiAvailable: true,
          isRemoteAvailable: true,
          basePrice: 15000,
          perHavanPrice: 4000,
          perDayPrice: 3500,
          isActive: true,
          isFeatured: false,
        },
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.success, true);
      qaServiceId = res.data.data.id;
      createdTestServiceIds.push(qaServiceId);
      assert.strictEqual(res.data.data.startingPrice, 15000);
    });

    await test('15. Admin List and Detail reflect newly created QA service', async () => {
      const listRes = await request({
        method: 'GET',
        path: `/api/admin/homa-services?search=${qaSlug}`,
        headers: adminHeaders,
      });
      assert.strictEqual(listRes.status, 200);
      assert.ok(listRes.data.data.some(s => s.id === qaServiceId));

      const detailRes = await request({
        method: 'GET',
        path: `/api/admin/homa-services/${qaServiceId}`,
        headers: adminHeaders,
      });
      assert.strictEqual(detailRes.status, 200);
      assert.strictEqual(detailRes.data.data.name, 'QA Test Homa Service');
    });

    await test('16. Public customer API exposes active QA service', async () => {
      const res = await request({
        method: 'GET',
        path: `/api/homa-services/${qaSlug}`,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.data.slug, qaSlug);
    });

    await test('17. Admin Deactivation soft-deactivates QA service and excludes from public API', async () => {
      const deactRes = await request({
        method: 'DELETE',
        path: `/api/admin/homa-services/${qaServiceId}`,
        headers: adminHeaders,
      });
      assert.strictEqual(deactRes.status, 200);

      // Verify dbRecord is inactive
      const dbRecord = await HomaService.findByPk(qaServiceId);
      assert.strictEqual(dbRecord.isActive, false);

      // Public listing excludes inactive
      const pubListing = await request({ method: 'GET', path: '/api/homa-services' });
      const items = pubListing.data.data.items || pubListing.data.data;
      assert.ok(!items.some(s => s.id === qaServiceId));

      // Public detail returns 404 for inactive
      const pubDetail = await request({ method: 'GET', path: `/api/homa-services/${qaSlug}` });
      assert.strictEqual(pubDetail.status, 404);
    });

    await test('18. Admin Reactivation restores QA service to active and public access', async () => {
      const reactRes = await request({
        method: 'PUT',
        path: `/api/admin/homa-services/${qaServiceId}`,
        headers: adminHeaders,
        body: {
          isActive: true,
        },
      });
      assert.strictEqual(reactRes.status, 200);
      assert.strictEqual(reactRes.data.data.isActive, true);

      // Public detail works again
      const pubDetail = await request({ method: 'GET', path: `/api/homa-services/${qaSlug}` });
      assert.strictEqual(pubDetail.status, 200);
    });

    await test('19. QA Data Cleanup permanently cleans up the temporary QA service', async () => {
      await HomaService.destroy({ where: { id: qaServiceId } });
      const verify = await HomaService.findByPk(qaServiceId);
      assert.strictEqual(verify, null);
      // Remove from createdTestServiceIds since already cleaned up
      const idx = createdTestServiceIds.indexOf(qaServiceId);
      if (idx !== -1) createdTestServiceIds.splice(idx, 1);
    });

    // -------------------------------------------------------------
    // SECTION 7: CUSTOMER PRICING & BOOKING FLOW
    // -------------------------------------------------------------
    await test('20. Authoritative Price calculation matches exact matrix (1 Havan = ₹11k, 3 Havans = ₹19k)', async () => {
      const res1 = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          havanCount: 1,
          days: 1,
        },
      });
      assert.strictEqual(res1.status, 200);
      assert.strictEqual(res1.data.data.totalAmount, 11000);

      const res3 = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          havanCount: 3,
          days: 1,
        },
      });
      assert.strictEqual(res3.status, 200);
      assert.strictEqual(res3.data.data.totalAmount, 19000);
    });

    await test('21. Coupling rule rejection: 1 Havan / 3 Days rejected with HTTP 400', async () => {
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
    });

    let qaBookingRef = null;
    await test('22. Customer Booking Creation creates VEDA-HOMA booking with authoritative price & homaMetadata', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings',
        body: {
          serviceType: 'HOMA',
          serviceSlug: 'maha-mrityunjaya-homa',
          configuration: {
            commencementDate: '2026-10-25',
            timeSlot: '07:00 AM',
            havanCount: 3,
            days: 1,
            panditCount: 3,
            arrangementMode: 'kashi',
          },
          location: {
            locationType: 'kashi',
            venueDetails: { notes: 'Kashi Vishwanath Ghat' },
          },
          yajman: {
            name: 'QA E2E Tester',
            mobile: '9876543210',
            email: 'qa.e2e@example.com',
            gotra: 'Kashyapa',
          },
          sankalp: {
            purpose: 'General Wellbeing',
            mainIntention: 'Sacred Fire Ritual QA',
          },
          // Malicious fake client price to verify server rejection / authoritative override
          totalAmount: 1,
          basePrice: 1,
        },
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.success, true);
      qaBookingRef = res.data.data.bookingReference;
      createdTestBookings.push(qaBookingRef);
      assert.match(qaBookingRef, /^VEDA-HOMA-[A-Z0-9]+$/);
    });

    await test('23. Booking Resolver polymorphic resolution & Cashfree returnUrl verification', async () => {
      const adapter = await resolveBookingEntity(qaBookingRef);
      assert.ok(adapter);
      assert.strictEqual(adapter.type, 'RITUAL');
      assert.strictEqual(adapter.reference, qaBookingRef);
      assert.strictEqual(adapter.authoritativeAmount, 19000);
      const expectedPath = '/yagya-puja/homa/maha-mrityunjaya-homa/booking-status?order_id={order_id}';
      assert.ok(adapter.returnUrl.includes(expectedPath));
    });

    await test('24. Booking status retrieval returns HOMA details & authoritative price', async () => {
      const res = await request({
        method: 'GET',
        path: `/api/ritual-bookings/${qaBookingRef}`,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.data.service.type, 'HOMA');
      assert.strictEqual(res.data.data.pricing.totalAmount, 19000);
      assert.strictEqual(res.data.data.configuration.havanCount, 3);
      assert.strictEqual(res.data.data.configuration.durationDays, 1);
    });

    await test('25. Booking cleanup removes temporary QA booking record', async () => {
      await RitualBooking.destroy({ where: { bookingReference: qaBookingRef } });
      const verify = await RitualBooking.findOne({ where: { bookingReference: qaBookingRef } });
      assert.strictEqual(verify, null);
      const idx = createdTestBookings.indexOf(qaBookingRef);
      if (idx !== -1) createdTestBookings.splice(idx, 1);
    });

  } finally {
    // Cleanup any lingering test users or records
    if (createdTestServiceIds.length > 0) {
      await HomaService.destroy({ where: { id: { [Op.in]: createdTestServiceIds } } });
    }
    if (createdTestBookings.length > 0) {
      await RitualBooking.destroy({ where: { bookingReference: { [Op.in]: createdTestBookings } } });
    }
    if (createdTestUsers.length > 0) {
      await User.destroy({ where: { id: { [Op.in]: createdTestUsers } } });
    }
  }

  console.log('\n================================================================');
  console.log(`TOTAL QA TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runH5HFinalQA().catch((err) => {
  console.error('Fatal QA error:', err);
  process.exit(1);
});
