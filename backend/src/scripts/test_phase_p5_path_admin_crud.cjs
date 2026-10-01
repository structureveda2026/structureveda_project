require('dotenv').config({ path: __dirname + '/../../.env' });
const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Load database & models
const db = require('../models/index.js').default;
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

const app = require('../app.js').default;

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

const createdTestUsers = [];
const createdTestServiceIds = [];
const createdTestBookings = [];

async function runP5BVerification() {
  console.log('================================================================');
  console.log('PHASE P5-B: PATH ADMIN BACKEND CRUD API TEST SUITE');
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
      fullName: 'P5B Test Admin',
      email: `p5b_admin_${Date.now()}@example.com`,
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
      fullName: 'P5B Test Regular User',
      email: `p5b_user_${Date.now()}@example.com`,
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

  const initialPathCount = await PathService.count();
  let seededPath = await PathService.findOne({ where: { isActive: true } });
  assert.ok(seededPath, 'At least one seeded Path service must exist in DB');

  let allPurposes = await PathPurpose.findAll({ where: { isActive: true } });
  assert.ok(allPurposes.length >= 2, 'At least 2 seeded Path purposes must exist in DB');
  const seededPurpose1 = allPurposes[0];
  const seededPurpose2 = allPurposes[1];

  let testCreatedServiceId = null;
  const uniqueTestSlug = `test-path-recitation-${Date.now()}`;
  let secondaryTestServiceId = null;

  // ==========================================
  // SECTION 1: AUTHORIZATION (Tests 1 - 3)
  // ==========================================

  await test('1. Unauthenticated GET returns 401', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services',
    });
    assert.strictEqual(res.status, 401, 'Should return 401 without auth token');
    assert.strictEqual(res.data.success, false);
  });

  await test('2. Non-admin authenticated GET returns 403', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.strictEqual(res.status, 403, 'Should return 403 for non-admin token');
    assert.strictEqual(res.data.success, false);
  });

  await test('3. Admin GET returns 200', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data), 'Data must be an array');
  });

  // ==========================================
  // SECTION 2: LIST & FILTERS (Tests 4 - 16)
  // ==========================================

  await test('4. List returns canonical Path services', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.length >= 8, 'Must return at least 8 canonical Path services');
    assert.ok(res.data.count >= 8);
    assert.ok(res.data.total >= 8);
  });

  await test('5. Search by name', async () => {
    const term = seededPath.name.slice(0, 5);
    const res = await request({
      method: 'GET',
      path: `/api/admin/path-services?search=${encodeURIComponent(term)}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.length >= 1);
    const found = res.data.data.some((s) => s.id === seededPath.id);
    assert.ok(found, 'Search by name must include the matching Path service');
  });

  await test('6. Search by scripture', async () => {
    const scriptureTerm = seededPath.scripture.slice(0, 6);
    const res = await request({
      method: 'GET',
      path: `/api/admin/path-services?search=${encodeURIComponent(scriptureTerm)}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.length >= 1);
    const found = res.data.data.some((s) => s.id === seededPath.id);
    assert.ok(found, 'Search by scripture must include the matching Path service');
  });

  await test('7. Search by slug', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/admin/path-services?search=${encodeURIComponent(seededPath.slug)}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.length >= 1);
    const found = res.data.data.some((s) => s.slug === seededPath.slug);
    assert.ok(found, 'Search by slug must include the matching Path service');
  });

  await test('8. Purpose filter', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/admin/path-services?purpose=${seededPurpose1.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    for (const item of res.data.data) {
      assert.strictEqual(item.purposeId, seededPurpose1.id);
    }
  });

  await test('9. Active filter', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services?status=active',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    for (const item of res.data.data) {
      assert.strictEqual(item.isActive, true);
    }
  });

  await test('10. Inactive filter', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services?status=inactive',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    for (const item of res.data.data) {
      assert.strictEqual(item.isActive, false);
    }
  });

  await test('11. All status filter', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services?status=all',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.length >= 8);
  });

  await test('12. Featured filter', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services?isFeatured=true',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    for (const item of res.data.data) {
      assert.strictEqual(item.isFeatured, true);
    }
  });

  await test('13. Price ascending', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services?sortBy=price-asc',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    for (let i = 0; i < res.data.data.length - 1; i++) {
      assert.ok(
        Number(res.data.data[i].startingPrice) <= Number(res.data.data[i + 1].startingPrice),
        'Items must be ordered by price ascending'
      );
    }
  });

  await test('14. Price descending', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services?sortBy=price-desc',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    for (let i = 0; i < res.data.data.length - 1; i++) {
      assert.ok(
        Number(res.data.data[i].startingPrice) >= Number(res.data.data[i + 1].startingPrice),
        'Items must be ordered by price descending'
      );
    }
  });

  await test('15. Name sorting', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services?sortBy=name-asc',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    for (let i = 0; i < res.data.data.length - 1; i++) {
      assert.ok(
        res.data.data[i].name.localeCompare(res.data.data[i + 1].name) <= 0,
        'Items must be ordered by name ascending'
      );
    }
  });

  await test('16. Pagination', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services?page=1&limit=3',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.page, 1);
    assert.strictEqual(res.data.limit, 3);
    assert.strictEqual(res.data.data.length, 3);
    assert.ok(res.data.totalPages >= 3);
  });

  // ==========================================
  // SECTION 3: DETAIL API (Tests 17 - 19)
  // ==========================================

  await test('17. Get valid service', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/admin/path-services/${seededPath.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.id, seededPath.id);
    assert.strictEqual(res.data.data.name, seededPath.name);
    assert.strictEqual(res.data.data.scripture, seededPath.scripture);
    assert.ok(Array.isArray(res.data.data.availableFormats));
    assert.ok(Array.isArray(res.data.data.availableLocations));
  });

  await test('18. Invalid UUID handling', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services/not-a-valid-uuid',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('19. Nonexistent ID returns 404', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services/00000000-0000-0000-0000-000000000000',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.success, false);
  });

  // ==========================================
  // SECTION 4: CREATE API (Tests 20 - 30)
  // ==========================================

  const validPayload = {
    name: 'Vedic Rudra Path Test',
    slug: uniqueTestSlug,
    pathType: 'Vedic Path',
    scripture: 'Shukla Yajurveda Rudrashtadhyayi',
    shortDescription: 'Sacred recitation of Shri Rudram from Shukla Yajurveda.',
    description: 'Detailed Vedic chanting invoking Bhagwan Shiva for purification and liberation.',
    purposeId: seededPurpose1.id,
    purposeSummary: 'Spiritual purification and peace',
    availableFormats: ['single_session', 'same_day'],
    availableDurations: ['3 to 4 Hours'],
    totalChapters: 8,
    totalSections: 8,
    totalVerses: 170,
    estimatedRecitationHours: 3.5,
    minimumDays: 1,
    recommendedDays: 1,
    maximumDays: 1,
    minimumPandits: 2,
    recommendedPandits: 3,
    maximumPandits: 5,
    dailyHours: '3 – 4 Hours Daily',
    samagri: [{ name: 'Rudrashtadhyayi Pustak', status: 'provided' }],
    prasad: 'Bhasma and Rudraksha',
    sankalpaFields: { gotra: true, nakshatra: true },
    isKashiAvailable: true,
    isRemoteAvailable: true,
    startingPrice: 6500,
    isFeatured: true,
    isActive: true,
    faqs: [
      { question: 'What is Rudra Path?', answer: 'It is a sacred recitation from Yajurveda.' },
    ],
    seo: { title: 'Rudra Path Online', description: 'Book Rudra Path recitation in Kashi.' },
  };

  await test('20. Valid creation returns 201', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: validPayload,
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.id);
    assert.strictEqual(res.data.data.slug, uniqueTestSlug);
    assert.strictEqual(res.data.data.startingPrice, 6500);

    testCreatedServiceId = res.data.data.id;
    createdTestServiceIds.push(testCreatedServiceId);
  });

  await test('21. Missing name rejected', async () => {
    const invalid = { ...validPayload, name: '', slug: `slug-${Date.now()}` };
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: invalid,
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('22. Missing scripture rejected', async () => {
    const invalid = { ...validPayload, scripture: '', slug: `slug-${Date.now()}` };
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: invalid,
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('23. Invalid startingPrice rejected', async () => {
    const invalidNegative = { ...validPayload, startingPrice: -100, slug: `slug-${Date.now()}` };
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: invalidNegative,
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);

    const invalidString = { ...validPayload, startingPrice: 'not-a-number', slug: `slug-${Date.now()}` };
    const resStr = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: invalidString,
    });
    assert.strictEqual(resStr.status, 400);
  });

  await test('24. Invalid days ordering rejected', async () => {
    const invalid = {
      ...validPayload,
      minimumDays: 5,
      recommendedDays: 3,
      maximumDays: 10,
      slug: `slug-${Date.now()}`,
    };
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: invalid,
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('25. Invalid pandit ordering rejected', async () => {
    const invalid = {
      ...validPayload,
      minimumPandits: 4,
      recommendedPandits: 2,
      maximumPandits: 5,
      slug: `slug-${Date.now()}`,
    };
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: invalid,
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('26. Duplicate slug rejected', async () => {
    const duplicate = { ...validPayload, slug: uniqueTestSlug };
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: duplicate,
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('27. Invalid purpose rejected', async () => {
    const invalid = {
      ...validPayload,
      purposeId: '00000000-0000-0000-0000-000000000000',
      slug: `slug-${Date.now()}`,
    };
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: invalid,
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('28. Invalid format configuration rejected', async () => {
    const invalid = {
      ...validPayload,
      availableFormats: ['invalid_unknown_format'],
      slug: `slug-${Date.now()}`,
    };
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: invalid,
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('29. Invalid location configuration rejected', async () => {
    const invalid = {
      ...validPayload,
      isKashiAvailable: false,
      isRemoteAvailable: false,
      slug: `slug-${Date.now()}`,
    };
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: invalid,
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('30. Single-session/day coupling enforced', async () => {
    const invalidCoupling = {
      ...validPayload,
      availableFormats: ['single_session'],
      minimumDays: 1,
      recommendedDays: 2,
      maximumDays: 3,
      slug: `slug-${Date.now()}`,
    };
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: invalidCoupling,
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert.ok(res.data.message.includes('maximumDays must be 1'));
  });

  // ==========================================
  // SECTION 5: UPDATE API (Tests 31 - 35)
  // ==========================================

  await test('31. Valid update works', async () => {
    const res = await request({
      method: 'PUT',
      path: `/api/admin/path-services/${testCreatedServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        shortDescription: 'Updated short description for Rudra Path.',
        dailyHours: '4 – 5 Hours Daily',
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.shortDescription, 'Updated short description for Rudra Path.');
  });

  await test('32. Slug uniqueness enforced on update', async () => {
    // Attempt to update slug to canonical seededPath's slug
    const res = await request({
      method: 'PUT',
      path: `/api/admin/path-services/${testCreatedServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        slug: seededPath.slug,
      },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('33. Purpose update works', async () => {
    const res = await request({
      method: 'PUT',
      path: `/api/admin/path-services/${testCreatedServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        purposeId: seededPurpose2.id,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.purposeId, seededPurpose2.id);
  });

  await test('34. Pricing update modifies startingPrice only', async () => {
    const res = await request({
      method: 'PUT',
      path: `/api/admin/path-services/${testCreatedServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        startingPrice: 7200,
        basePrice: 99999, // Should NOT be accepted or stored
        perDayPrice: 88888, // Should NOT be accepted or stored
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.startingPrice, 7200);

    // Verify in direct DB record
    const dbRecord = await PathService.findByPk(testCreatedServiceId);
    assert.strictEqual(Number(dbRecord.startingPrice), 7200);
    assert.strictEqual(dbRecord.basePrice, undefined);
  });

  await test('35. Reactivation works', async () => {
    // First deactivate
    await request({
      method: 'DELETE',
      path: `/api/admin/path-services/${testCreatedServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    // Reactivate via PUT
    const res = await request({
      method: 'PUT',
      path: `/api/admin/path-services/${testCreatedServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        isActive: true,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.isActive, true);
  });

  // ==========================================
  // SECTION 6: SOFT DELETE & BOOKING SAFETY (Tests 36 - 39)
  // ==========================================

  await test('36. Delete soft-deactivates', async () => {
    const res = await request({
      method: 'DELETE',
      path: `/api/admin/path-services/${testCreatedServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);

    const dbRecord = await PathService.findByPk(testCreatedServiceId);
    assert.ok(dbRecord, 'Database record must NOT be physically deleted');
    assert.strictEqual(dbRecord.isActive, false, 'Record must be marked isActive = false');
  });

  await test('37. Service disappears from public catalogue', async () => {
    const resPublicList = await request({
      method: 'GET',
      path: '/api/path-services',
    });
    assert.strictEqual(resPublicList.status, 200);
    const inPublic = resPublicList.data.data.some((s) => s.id === testCreatedServiceId);
    assert.strictEqual(inPublic, false, 'Soft-deleted service must not appear in public listing');

    const resPublicDetail = await request({
      method: 'GET',
      path: `/api/path-services/${uniqueTestSlug}`,
    });
    assert.strictEqual(resPublicDetail.status, 404, 'Soft-deleted service must return 404 on public detail');
  });

  await test('38. Service remains in Admin inactive list', async () => {
    const resInactive = await request({
      method: 'GET',
      path: '/api/admin/path-services?status=inactive',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resInactive.status, 200);
    const foundInactive = resInactive.data.data.some((s) => s.id === testCreatedServiceId);
    assert.strictEqual(foundInactive, true, 'Soft-deleted service must appear in Admin inactive list');
  });

  await test('39. Historical booking remains valid', async () => {
    // Create a historical booking referencing this Path service
    const booking = await RitualBooking.create({
      bookingReference: `VEDA-PATH-${Date.now().toString().slice(-8)}`,
      serviceType: 'PATH',
      serviceId: testCreatedServiceId,
      serviceSlug: uniqueTestSlug,
      serviceName: 'Vedic Rudra Path Test',
      bookingDate: new Date('2026-11-01'),
      bookingTime: '07:00 AM',
      durationSelected: '3 to 4 Hours',
      durationHours: 4,
      arrangementMode: 'kashi',
      locationType: 'kashi',
      yajmanDetails: { name: 'Historical Yajman', mobile: '9876543210' },
      basePrice: 7200,
      totalAmount: 7200,
      currency: 'INR',
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      sankalpDetails: {
        serviceType: 'PATH',
        pathMetadata: {
          scripture: 'Shukla Yajurveda Rudrashtadhyayi',
          selectedFormat: 'same_day',
          selectedDuration: '3 to 4 Hours',
          days: 1,
          pandits: 2,
        },
      },
    });
    createdTestBookings.push(booking.id);

    // Verify service is still soft-deactivated and booking is intact
    const refreshedBooking = await RitualBooking.findByPk(booking.id);
    assert.ok(refreshedBooking);
    assert.strictEqual(refreshedBooking.serviceId, testCreatedServiceId);
    assert.strictEqual(refreshedBooking.bookingStatus, 'Confirmed');
    assert.strictEqual(Number(refreshedBooking.totalAmount), 7200);
  });

  // ==========================================
  // SECTION 7: REGRESSION SUITE (Tests 40 - 44)
  // ==========================================

  await test('40. Path P2 tests pass (public catalogue / detail endpoints)', async () => {
    const resPublic = await request({
      method: 'GET',
      path: '/api/path-services',
    });
    assert.strictEqual(resPublic.status, 200);
    assert.strictEqual(resPublic.data.success, true);
    assert.ok(resPublic.data.data.length >= 8);

    const resPurposes = await request({
      method: 'GET',
      path: '/api/path-services/purposes',
    });
    assert.strictEqual(resPurposes.status, 200);
    assert.strictEqual(resPurposes.data.success, true);
    assert.ok(resPurposes.data.data.length >= 6);
  });

  await test('41. Path P3 tests pass (calculate price & booking validation)', async () => {
    const resPrice = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'PATH',
        serviceSlug: 'sundarkand-path',
        days: 1,
      },
    });
    assert.strictEqual(resPrice.status, 200);
    assert.strictEqual(resPrice.data.success, true);
    assert.strictEqual(resPrice.data.data.totalAmount, 5100);
  });

  await test('42. Path P4 tests remain valid (customer frontend data contract)', async () => {
    const resDetail = await request({
      method: 'GET',
      path: '/api/path-services/sundarkand-path',
    });
    assert.strictEqual(resDetail.status, 200);
    assert.strictEqual(resDetail.data.success, true);
    assert.ok(resDetail.data.data.availableDurations.length > 0);
    assert.ok(resDetail.data.data.samagri.length > 0);
    assert.ok(resDetail.data.data.startingPrice > 0);
  });

  await test('43. Homa Admin tests pass (/api/admin/homa-services endpoints intact)', async () => {
    const resHoma = await request({
      method: 'GET',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resHoma.status, 200);
    assert.strictEqual(resHoma.data.success, true);
    assert.ok(Array.isArray(resHoma.data.data));
  });

  await test('44. Japa Admin tests pass (/api/admin/japa-services endpoints intact)', async () => {
    const resJapa = await request({
      method: 'GET',
      path: '/api/admin/japa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resJapa.status, 200);
    assert.strictEqual(resJapa.data.success, true);
    assert.ok(Array.isArray(resJapa.data.data));
  });

  // ==========================================
  // CLEANUP
  // ==========================================
  console.log('\nCleaning up test artifacts...');
  for (const bId of createdTestBookings) {
    await RitualBooking.destroy({ where: { id: bId } }).catch(() => {});
  }
  for (const sId of createdTestServiceIds) {
    await PathService.destroy({ where: { id: sId } }).catch(() => {});
  }
  for (const uId of createdTestUsers) {
    await User.destroy({ where: { id: uId } }).catch(() => {});
  }
  console.log('Cleanup complete.');

  // Verify canonical Path count was not harmed
  const finalCanonicalCount = await PathService.count({
    where: { id: { [Op.notIn]: createdTestServiceIds } },
  });
  assert.strictEqual(
    finalCanonicalCount,
    initialPathCount,
    'Canonical Path records must not be affected by tests'
  );

  console.log('\n================================================================');
  console.log(`TOTAL TESTS: 44`);
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
    await runP5BVerification();
  } finally {
    server.close();
    process.exit(0);
  }
};

start().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
