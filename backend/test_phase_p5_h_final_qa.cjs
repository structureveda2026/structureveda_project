require('dotenv').config({ path: __dirname + '/.env' });
const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

// Load database & models
const db = require('./src/models/index.js').default;
const {
  User,
  PathService,
  PathPurpose,
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

async function runP5HFinalQA() {
  console.log('================================================================');
  console.log('PHASE P5-H: PATH ADMIN & E2E FINAL QA VERIFICATION');
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
      fullName: 'P5H QA Admin',
      email: `p5h_admin_${Date.now()}@example.com`,
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
      fullName: 'P5H QA Regular User',
      email: `p5h_user_${Date.now()}@example.com`,
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

  const initialCanonicalCount = await PathService.count({ where: { isActive: true } });
  assert.ok(initialCanonicalCount >= 8, 'At least 8 canonical Path services must exist');

  let seededPath = await PathService.findOne({ where: { isActive: true } });
  assert.ok(seededPath, 'Canonical seeded Path must exist');

  let testPurpose = await PathPurpose.findOne({ where: { isActive: true } });
  assert.ok(testPurpose, 'Canonical Path purpose must exist');

  const qaServiceSlug = `qa-rudra-path-${Date.now()}`;
  let qaCreatedServiceId = null;
  let qaBookingRef = null;

  try {
    // -------------------------------------------------------------
    // SECTION 1: PUBLIC BASELINE
    // -------------------------------------------------------------
    await test('1. GET /api/path-services returns 8 active canonical services', async () => {
      const res = await request({ method: 'GET', path: '/api/path-services' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      const items = res.data.data;
      assert.ok(Array.isArray(items));
      assert.strictEqual(items.length, 8);
    });

    await test('2. GET /api/path-services/purposes returns 6 canonical purposes', async () => {
      const res = await request({ method: 'GET', path: '/api/path-services/purposes' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.length, 6);
    });

    await test('3. Canonical Path slug resolves individually with 200', async () => {
      const res = await request({ method: 'GET', path: `/api/path-services/${seededPath.slug}` });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.slug, seededPath.slug);
    });

    // -------------------------------------------------------------
    // SECTION 2: ADMIN AUTHENTICATION & AUTHORIZATION
    // -------------------------------------------------------------
    await test('4. Unauthenticated request to /api/admin/path-services returns 401', async () => {
      const res = await request({ method: 'GET', path: '/api/admin/path-services' });
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.data.success, false);
    });

    await test('5. Non-admin request to /api/admin/path-services returns 403', async () => {
      const res = await request({
        method: 'GET',
        path: '/api/admin/path-services',
        headers: userHeaders,
      });
      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.data.success, false);
    });

    await test('6. Authenticated Admin request to /api/admin/path-services returns 200', async () => {
      const res = await request({
        method: 'GET',
        path: '/api/admin/path-services',
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
    await test('7. Admin List Search filter finds canonical Path by name', async () => {
      const res = await request({
        method: 'GET',
        path: `/api/admin/path-services?search=${encodeURIComponent(seededPath.name.slice(0, 5))}`,
        headers: adminHeaders,
      });
      assert.strictEqual(res.status, 200);
      const items = res.data.data;
      assert.ok(items.length >= 1);
      assert.ok(items.some((s) => s.id === seededPath.id));
    });

    await test('8. Admin List Purpose filter filters by purpose ID', async () => {
      const res = await request({
        method: 'GET',
        path: `/api/admin/path-services?purpose=${testPurpose.id}`,
        headers: adminHeaders,
      });
      assert.strictEqual(res.status, 200);
      for (const item of res.data.data) {
        assert.strictEqual(item.purposeId, testPurpose.id);
      }
    });

    await test('9. Admin List Status filter filters by active/inactive', async () => {
      const resActive = await request({
        method: 'GET',
        path: '/api/admin/path-services?status=active',
        headers: adminHeaders,
      });
      assert.strictEqual(resActive.status, 200);
      for (const item of resActive.data.data) {
        assert.strictEqual(item.isActive, true);
      }
    });

    await test('10. Admin List Featured filter filters by featured status', async () => {
      const resFeatured = await request({
        method: 'GET',
        path: '/api/admin/path-services?isFeatured=true',
        headers: adminHeaders,
      });
      assert.strictEqual(resFeatured.status, 200);
      for (const item of resFeatured.data.data) {
        assert.strictEqual(item.isFeatured, true);
      }
    });

    await test('11. Admin List Sorting works for price ascending', async () => {
      const resPriceAsc = await request({
        method: 'GET',
        path: '/api/admin/path-services?sortBy=price-asc',
        headers: adminHeaders,
      });
      assert.strictEqual(resPriceAsc.status, 200);
      const items = resPriceAsc.data.data;
      for (let i = 1; i < items.length; i++) {
        assert.ok(Number(items[i].startingPrice) >= Number(items[i - 1].startingPrice));
      }
    });

    await test('12. Admin List Pagination respects page and limit parameters', async () => {
      const res = await request({
        method: 'GET',
        path: '/api/admin/path-services?page=1&limit=3',
        headers: adminHeaders,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.page, 1);
      assert.strictEqual(res.data.limit, 3);
      assert.strictEqual(res.data.data.length, 3);
    });

    // -------------------------------------------------------------
    // SECTION 4: ADMIN DETAIL API
    // -------------------------------------------------------------
    await test('13. Admin detail by ID returns full service specification', async () => {
      const res = await request({
        method: 'GET',
        path: `/api/admin/path-services/${seededPath.id}`,
        headers: adminHeaders,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.id, seededPath.id);
      assert.ok(Array.isArray(res.data.data.availableFormats));
      assert.ok(Array.isArray(res.data.data.availableDurations));
      assert.ok(typeof res.data.data.sankalpaFields === 'object');
    });

    await test('14. Admin detail handles invalid UUID and 404 gracefully', async () => {
      const resInvalid = await request({
        method: 'GET',
        path: '/api/admin/path-services/not-a-uuid',
        headers: adminHeaders,
      });
      assert.strictEqual(resInvalid.status, 400);

      const resNotFound = await request({
        method: 'GET',
        path: '/api/admin/path-services/00000000-0000-0000-0000-000000000000',
        headers: adminHeaders,
      });
      assert.strictEqual(resNotFound.status, 404);
    });

    // -------------------------------------------------------------
    // SECTION 5: ADMIN CREATE & VALIDATION RULES
    // -------------------------------------------------------------
    await test('15. Create rejects missing name and scripture', async () => {
      const resNoName = await request({
        method: 'POST',
        path: '/api/admin/path-services',
        headers: adminHeaders,
        body: { scripture: 'Vedas', startingPrice: 5000, availableFormats: ['single_session'] },
      });
      assert.strictEqual(resNoName.status, 400);

      const resNoScripture = await request({
        method: 'POST',
        path: '/api/admin/path-services',
        headers: adminHeaders,
        body: { name: 'Test Path', startingPrice: 5000, availableFormats: ['single_session'] },
      });
      assert.strictEqual(resNoScripture.status, 400);
    });

    await test('16. Create rejects single-session coupling violation (maxDays > 1)', async () => {
      const resCoupling = await request({
        method: 'POST',
        path: '/api/admin/path-services',
        headers: adminHeaders,
        body: {
          name: 'Invalid Coupling Test',
          scripture: 'Vedas',
          startingPrice: 5000,
          availableFormats: ['single_session'],
          minimumDays: 1,
          recommendedDays: 2,
          maximumDays: 3,
        },
      });
      assert.strictEqual(resCoupling.status, 400);
      assert.ok(resCoupling.data.message.includes('maximumDays'));
    });

    await test('17. Create valid Path service returns 201 Created', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/admin/path-services',
        headers: adminHeaders,
        body: {
          name: 'QA Shiva Rudra Path',
          slug: qaServiceSlug,
          pathType: 'Vedic Path',
          scripture: 'Shukla Yajurveda',
          shortDescription: 'QA test short description',
          description: 'Detailed description for QA testing',
          purposeId: testPurpose.id,
          purposeSummary: 'Peace and liberation',
          availableFormats: ['single_session', 'same_day'],
          availableDurations: ['3 to 4 Hours'],
          minimumDays: 1,
          recommendedDays: 1,
          maximumDays: 1,
          minimumPandits: 2,
          recommendedPandits: 3,
          maximumPandits: 5,
          startingPrice: 6500,
          isKashiAvailable: true,
          isRemoteAvailable: true,
          isFeatured: true,
          isActive: true,
        },
      });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.id);
      qaCreatedServiceId = res.data.data.id;
      createdTestServiceIds.push(qaCreatedServiceId);
    });

    // -------------------------------------------------------------
    // SECTION 6: ADMIN UPDATE, DEACTIVATE, REACTIVATE
    // -------------------------------------------------------------
    await test('18. Update Path service updates fields accurately', async () => {
      const res = await request({
        method: 'PUT',
        path: `/api/admin/path-services/${qaCreatedServiceId}`,
        headers: adminHeaders,
        body: {
          shortDescription: 'Updated QA short description',
          startingPrice: 7000,
        },
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.shortDescription, 'Updated QA short description');
      assert.strictEqual(res.data.data.startingPrice, 7000);
    });

    await test('19. Soft-delete deactivates service (isActive = false)', async () => {
      const res = await request({
        method: 'DELETE',
        path: `/api/admin/path-services/${qaCreatedServiceId}`,
        headers: adminHeaders,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);

      const dbCheck = await PathService.findByPk(qaCreatedServiceId);
      assert.ok(dbCheck);
      assert.strictEqual(dbCheck.isActive, false);
    });

    await test('20. Deactivated service is absent from public catalogue & detail', async () => {
      const resList = await request({ method: 'GET', path: '/api/path-services' });
      assert.strictEqual(resList.status, 200);
      const found = resList.data.data.some((s) => s.id === qaCreatedServiceId);
      assert.strictEqual(found, false);

      const resDetail = await request({ method: 'GET', path: `/api/path-services/${qaServiceSlug}` });
      assert.strictEqual(resDetail.status, 404);
    });

    await test('21. Reactivation restores service visibility publicly', async () => {
      const res = await request({
        method: 'PUT',
        path: `/api/admin/path-services/${qaCreatedServiceId}`,
        headers: adminHeaders,
        body: { isActive: true },
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.data.isActive, true);

      const resList = await request({ method: 'GET', path: '/api/path-services' });
      assert.strictEqual(resList.status, 200);
      const found = resList.data.data.some((s) => s.id === qaCreatedServiceId);
      assert.strictEqual(found, true);
    });

    // -------------------------------------------------------------
    // SECTION 7: BOOKING E2E & HISTORICAL SAFETY
    // -------------------------------------------------------------
    await test('22. PATH calculate-price produces authoritative price', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings/calculate-price',
        body: {
          serviceType: 'PATH',
          serviceSlug: qaServiceSlug,
          days: 1,
        },
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.totalAmount, 7000);
    });

    await test('23. Booking creation creates VEDA-PATH reference & metadata', async () => {
      const res = await request({
        method: 'POST',
        path: '/api/ritual-bookings',
        body: {
          serviceType: 'PATH',
          serviceSlug: qaServiceSlug,
          configuration: {
            commencementDate: '2026-11-20',
            timeSlot: '07:00 AM',
            format: 'single_session',
            durationSelected: '3 to 4 Hours',
            days: 1,
            panditCount: 2,
            arrangementMode: 'kashi',
          },
          location: { locationType: 'kashi' },
          yajman: { name: 'QA Yajman Devotee', mobile: '9876543210', email: 'devotee@example.com' },
          sankalp: { purpose: 'Peace and liberation', gotra: 'Bharadwaja' },
        },
      });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.bookingReference.startsWith('VEDA-PATH-'));
      qaBookingRef = res.data.data.bookingReference;
      createdTestBookings.push(qaBookingRef);
    });

    await test('24. Soft-deactivating service preserves historical booking intact', async () => {
      // Deactivate the service
      await request({
        method: 'DELETE',
        path: `/api/admin/path-services/${qaCreatedServiceId}`,
        headers: adminHeaders,
      });

      // Verify booking is still accessible and intact
      const res = await request({
        method: 'GET',
        path: `/api/ritual-bookings/${qaBookingRef}`,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.bookingReference, qaBookingRef);
      assert.strictEqual(res.data.data.service.type, 'PATH');
      assert.strictEqual(Number(res.data.data.pricing.totalAmount), 7000);
    });

    // -------------------------------------------------------------
    // SECTION 8: FRONTEND FILE & ROUTE INTEGRITY
    // -------------------------------------------------------------
    await test('25. Admin frontend files and routes exist and are properly mounted', () => {
      const serviceFile = path.join(__dirname, '../admin-veda-structure/src/services/pathServiceCatalogueService.ts');
      const listFile = path.join(__dirname, '../admin-veda-structure/src/pages/PathServices.tsx');
      const formFile = path.join(__dirname, '../admin-veda-structure/src/pages/PathServiceForm.tsx');
      const detailFile = path.join(__dirname, '../admin-veda-structure/src/pages/PathServiceDetail.tsx');
      const appFile = path.join(__dirname, '../admin-veda-structure/src/App.tsx');
      const sidebarFile = path.join(__dirname, '../admin-veda-structure/src/components/Sidebar.tsx');

      assert.ok(fs.existsSync(serviceFile), 'pathServiceCatalogueService.ts must exist');
      assert.ok(fs.existsSync(listFile), 'PathServices.tsx must exist');
      assert.ok(fs.existsSync(formFile), 'PathServiceForm.tsx must exist');
      assert.ok(fs.existsSync(detailFile), 'PathServiceDetail.tsx must exist');

      const appContent = fs.readFileSync(appFile, 'utf-8');
      assert.ok(appContent.includes('path="path-services"'));
      assert.ok(appContent.includes('path="path-services/new"'));
      assert.ok(appContent.includes('path="path-services/:id"'));
      assert.ok(appContent.includes('path="path-services/:id/edit"'));

      const sidebarContent = fs.readFileSync(sidebarFile, 'utf-8');
      assert.ok(sidebarContent.includes('Path Catalogue'));
      assert.ok(sidebarContent.includes('/admin/path-services'));
    });

    // -------------------------------------------------------------
    // SECTION 9: MULTI-MODULE REGRESSION
    // -------------------------------------------------------------
    await test('26. Multi-module regressions pass (Puja, Yagya, Homa, Japa)', async () => {
      const resPuja = await request({ method: 'GET', path: '/api/puja-services' });
      assert.strictEqual(resPuja.status, 200);

      const resYagya = await request({ method: 'GET', path: '/api/yagya-services' });
      assert.strictEqual(resYagya.status, 200);

      const resHoma = await request({ method: 'GET', path: '/api/homa-services' });
      assert.strictEqual(resHoma.status, 200);

      const resJapa = await request({ method: 'GET', path: '/api/japa-services' });
      assert.strictEqual(resJapa.status, 200);
    });

  } finally {
    // -------------------------------------------------------------
    // SECTION 10: CLEANUP
    // -------------------------------------------------------------
    console.log('\nCleaning up QA test records...');
    for (const bRef of createdTestBookings) {
      await RitualBooking.destroy({ where: { bookingReference: bRef } }).catch(() => {});
    }
    for (const sId of createdTestServiceIds) {
      await PathService.destroy({ where: { id: sId } }).catch(() => {});
    }
    for (const uId of createdTestUsers) {
      await User.destroy({ where: { id: uId } }).catch(() => {});
    }
    console.log('Cleanup complete.');

    const finalCanonicalCount = await PathService.count({ where: { isActive: true } });
    assert.strictEqual(
      finalCanonicalCount,
      initialCanonicalCount,
      'Canonical Path records must not be affected by tests'
    );
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
    await runP5HFinalQA();
  } finally {
    server.close();
    process.exit(0);
  }
};

start().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
