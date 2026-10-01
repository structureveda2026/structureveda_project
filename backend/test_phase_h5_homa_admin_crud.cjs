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
  PujaService,
  YagyaService,
  JapaService,
  RitualBooking,
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

const createdTestUsers = [];
const createdTestServiceIds = [];

async function runH5BVerification() {
  console.log('================================================================');
  console.log('PHASE H5-B: BACKEND ADMIN HOMA CRUD API TEST SUITE');
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
      fullName: 'H5B Test Admin',
      email: `h5b_admin_${Date.now()}@example.com`,
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
      fullName: 'H5B Test Regular User',
      email: `h5b_user_${Date.now()}@example.com`,
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

  const initialHomaCount = await HomaService.count();
  let seededHoma = await HomaService.findOne({ where: { isActive: true } });
  assert.ok(seededHoma, 'At least one seeded Homa service must exist in DB');

  let seededPurpose = await HomaPurpose.findOne({ where: { isActive: true } });
  assert.ok(seededPurpose, 'At least one seeded Homa purpose must exist in DB');

  let testCreatedServiceId = null;
  const uniqueTestSlug = `test-ganapati-homa-${Date.now()}`;

  // ==========================================
  // Test Cases 1 - 30
  // ==========================================

  // 1. Unauthenticated request -> 401
  await test('1. Unauthenticated request -> 401', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/homa-services',
    });
    assert.strictEqual(res.status, 401, 'Should return 401 without auth token');
    assert.strictEqual(res.data.success, false);
  });

  // 2. Non-admin request -> 403
  await test('2. Non-admin request -> 403', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.strictEqual(res.status, 403, 'Should return 403 for non-admin token');
    assert.strictEqual(res.data.success, false);
  });

  // 3. Admin list -> 200
  await test('3. Admin list -> 200', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data), 'Data must be an array');
    assert.ok(res.data.count >= 1, 'Should contain at least 1 record');
    assert.ok(res.data.total >= 1, 'Total must be >= 1');
  });

  // 4. Admin list pagination
  await test('4. Admin list pagination', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/homa-services?page=1&limit=2',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.page, 1);
    assert.strictEqual(res.data.limit, 2);
    assert.ok(res.data.data.length <= 2);
    assert.ok(res.data.totalPages >= 1);
  });

  // 5. Search filter
  await test('5. Search filter', async () => {
    const term = seededHoma.name.slice(0, 5);
    const res = await request({
      method: 'GET',
      path: `/api/admin/homa-services?search=${encodeURIComponent(term)}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.length >= 1);
    const found = res.data.data.some((s) => s.id === seededHoma.id);
    assert.ok(found, 'Search results must include seeded homa service');
  });

  // 6. Purpose filter
  await test('6. Purpose filter', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/admin/homa-services?purpose=${seededPurpose.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    for (const item of res.data.data) {
      assert.strictEqual(item.purposeId, seededPurpose.id);
    }
  });

  // 7. Active/inactive filter
  await test('7. Active/inactive filter', async () => {
    const resActive = await request({
      method: 'GET',
      path: '/api/admin/homa-services?isActive=true',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resActive.status, 200);
    for (const item of resActive.data.data) {
      assert.strictEqual(item.isActive, true);
    }

    const resInactive = await request({
      method: 'GET',
      path: '/api/admin/homa-services?status=inactive',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resInactive.status, 200);
    for (const item of resInactive.data.data) {
      assert.strictEqual(item.isActive, false);
    }
  });

  // 8. Featured filter
  await test('8. Featured filter', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/homa-services?isFeatured=true',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    for (const item of res.data.data) {
      assert.strictEqual(item.isFeatured, true);
    }
  });

  // 9. Sorting
  await test('9. Sorting', async () => {
    const resPriceAsc = await request({
      method: 'GET',
      path: '/api/admin/homa-services?sortBy=price-asc&limit=100',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resPriceAsc.status, 200);
    for (let i = 0; i < resPriceAsc.data.data.length - 1; i++) {
      assert.ok(
        resPriceAsc.data.data[i].startingPrice <= resPriceAsc.data.data[i + 1].startingPrice,
        'Prices should be in ascending order'
      );
    }

    const resNameAsc = await request({
      method: 'GET',
      path: '/api/admin/homa-services?sortBy=name-asc&limit=100',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resNameAsc.status, 200);
    for (let i = 0; i < resNameAsc.data.data.length - 1; i++) {
      assert.ok(
        resNameAsc.data.data[i].name.localeCompare(resNameAsc.data.data[i + 1].name) <= 0,
        'Names should be in ascending alphabetical order'
      );
    }
  });

  // 10. Admin detail -> 200
  await test('10. Admin detail -> 200', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/admin/homa-services/${seededHoma.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.id, seededHoma.id);
    assert.ok(Array.isArray(res.data.data.availableHavanCounts), 'availableHavanCounts must be array');
    assert.ok(Array.isArray(res.data.data.availableDays), 'availableDays must be array');
    assert.ok(typeof res.data.data.basePrice === 'number', 'basePrice must be number');
    assert.ok(typeof res.data.data.perHavanPrice === 'number', 'perHavanPrice must be number');
    assert.ok(typeof res.data.data.perDayPrice === 'number', 'perDayPrice must be number');
  });

  // 11. Invalid UUID -> appropriate 400/404 behavior
  await test('11. Invalid UUID -> appropriate 400/404 behavior', async () => {
    const resInvalid = await request({
      method: 'GET',
      path: '/api/admin/homa-services/not-a-valid-uuid',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resInvalid.status, 400);

    const resNotFound = await request({
      method: 'GET',
      path: '/api/admin/homa-services/00000000-0000-0000-0000-000000000000',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resNotFound.status, 404);
  });

  // 12. Missing required name -> 400
  await test('12. Missing required name -> 400', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        basePrice: 5000,
        availableHavanCounts: [1, 3],
        availableDays: [1, 2],
      },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  // 13. Duplicate slug -> 409
  await test('13. Duplicate slug -> 409', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Duplicate Test Homa',
        slug: seededHoma.slug,
        basePrice: 5000,
        availableHavanCounts: [1, 3],
        availableDays: [1, 2],
      },
    });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
  });

  // 14. Invalid purpose -> 400
  await test('14. Invalid purpose -> 400', async () => {
    const resBadId = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Invalid Purpose Test',
        purposeId: '00000000-0000-0000-0000-000000000000',
        basePrice: 5000,
        availableHavanCounts: [1, 3],
        availableDays: [1, 2],
      },
    });
    assert.strictEqual(resBadId.status, 400);

    const resMalformedUuid = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Invalid Purpose UUID Test',
        purposeId: 'not-a-uuid',
        basePrice: 5000,
        availableHavanCounts: [1, 3],
        availableDays: [1, 2],
      },
    });
    assert.strictEqual(resMalformedUuid.status, 400);
  });

  // 15. Invalid Havan count array -> 400
  await test('15. Invalid Havan count array -> 400', async () => {
    const resEmpty = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Empty Counts Homa',
        availableHavanCounts: [],
        availableDays: [1],
        basePrice: 5000,
      },
    });
    assert.strictEqual(resEmpty.status, 400);

    const resNegative = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Negative Counts Homa',
        availableHavanCounts: [1, -5],
        availableDays: [1],
        basePrice: 5000,
      },
    });
    assert.strictEqual(resNegative.status, 400);

    const resDuplicate = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Duplicate Counts Homa',
        availableHavanCounts: [1, 3, 3],
        availableDays: [1],
        basePrice: 5000,
      },
    });
    assert.strictEqual(resDuplicate.status, 400);
  });

  // 16. Invalid day array -> 400
  await test('16. Invalid day array -> 400', async () => {
    const resEmpty = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Empty Days Homa',
        availableHavanCounts: [1, 3],
        availableDays: [],
        basePrice: 5000,
      },
    });
    assert.strictEqual(resEmpty.status, 400);

    const resZero = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Zero Days Homa',
        availableHavanCounts: [1, 3],
        availableDays: [0],
        basePrice: 5000,
      },
    });
    assert.strictEqual(resZero.status, 400);

    const resDuplicate = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Duplicate Days Homa',
        availableHavanCounts: [1, 3],
        availableDays: [1, 2, 2],
        basePrice: 5000,
      },
    });
    assert.strictEqual(resDuplicate.status, 400);
  });

  // 17. Invalid Havan/day coupling -> 400
  await test('17. Invalid Havan/day coupling -> 400', async () => {
    // 1 Havan with multi-day [1, 2] must be rejected
    const res1 = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Coupling Test Homa 1',
        availableHavanCounts: [1],
        availableDays: [1, 2],
        basePrice: 5000,
      },
    });
    assert.strictEqual(res1.status, 400, 'Should reject 1 havan with multi-day');

    // 1 Havan with multi-day [3] must be rejected
    const res2 = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Coupling Test Homa 2',
        availableHavanCounts: [1],
        availableDays: [3],
        basePrice: 5000,
      },
    });
    assert.strictEqual(res2.status, 400, 'Should reject 1 havan with day 3');
  });

  // 18. Invalid pandit range -> 400
  await test('18. Invalid pandit range -> 400', async () => {
    const resMinGtRec = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Pandit Range Test 1',
        availableHavanCounts: [1, 3],
        availableDays: [1, 2],
        basePrice: 5000,
        minimumPandits: 5,
        recommendedPandits: 3,
        maximumPandits: 10,
      },
    });
    assert.strictEqual(resMinGtRec.status, 400);

    const resRecGtMax = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Pandit Range Test 2',
        availableHavanCounts: [1, 3],
        availableDays: [1, 2],
        basePrice: 5000,
        minimumPandits: 2,
        recommendedPandits: 8,
        maximumPandits: 5,
      },
    });
    assert.strictEqual(resRecGtMax.status, 400);
  });

  // 19. Invalid pricing -> 400
  await test('19. Invalid pricing -> 400', async () => {
    const resMissingBase = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Missing Price Homa',
        availableHavanCounts: [1, 3],
        availableDays: [1, 2],
      },
    });
    assert.strictEqual(resMissingBase.status, 400);

    const resNegativeBase = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Negative Base Price Homa',
        basePrice: -100,
        availableHavanCounts: [1, 3],
        availableDays: [1, 2],
      },
    });
    assert.strictEqual(resNegativeBase.status, 400);

    const resNegativeHavan = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Negative Havan Price Homa',
        basePrice: 5000,
        perHavanPrice: -20,
        availableHavanCounts: [1, 3],
        availableDays: [1, 2],
      },
    });
    assert.strictEqual(resNegativeHavan.status, 400);
  });

  // 20. Create service -> 201
  await test('20. Create service -> 201', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: `Test Maha Ganapati Homa ${Date.now()}`,
        slug: uniqueTestSlug,
        homaType: 'Vedic Homa',
        shortDescription: 'Sacred Ganapati ritual for auspicious beginnings.',
        description: 'Complete Vedic Maha Ganapati Homa ceremony performed by experienced pandits.',
        purposeId: seededPurpose.id,
        availableHavanCounts: [1, 3, 5],
        availableDays: [1, 2, 3],
        minimumPandits: 2,
        recommendedPandits: 3,
        maximumPandits: 7,
        basePrice: 11000,
        perHavanPrice: 3500,
        perDayPrice: 5000,
        isKashiAvailable: true,
        isRemoteAvailable: true,
        isFeatured: false,
        isActive: true,
        bannerImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136',
        galleryImages: ['https://images.unsplash.com/photo-1544717305-2782549b5136'],
        samagri: [{ name: 'Ghee', status: 'included' }],
        faqs: [{ question: 'What is Ganapati Homa?', answer: 'It is a Vedic fire ritual.' }],
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.id);
    testCreatedServiceId = res.data.data.id;
    createdTestServiceIds.push(testCreatedServiceId);
  });

  // 21. Created service has: startingPrice === basePrice
  await test('21. Created service has: startingPrice === basePrice', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/admin/homa-services/${testCreatedServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.basePrice, 11000);
    assert.strictEqual(res.data.data.startingPrice, 11000);
    assert.strictEqual(res.data.data.startingPrice, res.data.data.basePrice);

    const dbRecord = await HomaService.findByPk(testCreatedServiceId);
    assert.strictEqual(Number(dbRecord.startingPrice), Number(dbRecord.basePrice));
  });

  // 22. Update service -> 200
  await test('22. Update service -> 200', async () => {
    const res = await request({
      method: 'PUT',
      path: `/api/admin/homa-services/${testCreatedServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        shortDescription: 'Updated auspicious description.',
        basePrice: 12500,
        perHavanPrice: 4000,
        perDayPrice: 5500,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.basePrice, 12500);
    assert.strictEqual(res.data.data.startingPrice, 12500);
    assert.strictEqual(res.data.data.perHavanPrice, 4000);
    assert.strictEqual(res.data.data.perDayPrice, 5500);
    assert.strictEqual(res.data.data.shortDescription, 'Updated auspicious description.');
  });

  // 23. Update cannot create invalid Havan/day configuration
  await test('23. Update cannot create invalid Havan/day configuration', async () => {
    // Current record has availableDays: [1, 2, 3]. Updating availableHavanCounts to [1]
    // should fail coupling check against the merged days configuration!
    const res = await request({
      method: 'PUT',
      path: `/api/admin/homa-services/${testCreatedServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        availableHavanCounts: [1],
      },
    });
    assert.strictEqual(res.status, 400, 'Should reject update resulting in 1 havan with multi-day');
    assert.strictEqual(res.data.success, false);
  });

  // 24. Update slug uniqueness
  await test('24. Update slug uniqueness', async () => {
    // Attempting to change slug to seededHoma's slug must return 409
    const resConflict = await request({
      method: 'PUT',
      path: `/api/admin/homa-services/${testCreatedServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        slug: seededHoma.slug,
      },
    });
    assert.strictEqual(resConflict.status, 409);

    // Keeping own slug must be allowed
    const resSame = await request({
      method: 'PUT',
      path: `/api/admin/homa-services/${testCreatedServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        slug: uniqueTestSlug,
      },
    });
    assert.strictEqual(resSame.status, 200);
  });

  // 25. Deactivate -> 200
  await test('25. Deactivate -> 200', async () => {
    const res = await request({
      method: 'DELETE',
      path: `/api/admin/homa-services/${testCreatedServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);

    const dbRecord = await HomaService.findByPk(testCreatedServiceId);
    assert.strictEqual(dbRecord.isActive, false);
  });

  // 26. Deactivated service is absent from public catalogue
  await test('26. Deactivated service is absent from public catalogue', async () => {
    const resPublicList = await request({
      method: 'GET',
      path: '/api/homa-services',
    });
    assert.strictEqual(resPublicList.status, 200);
    const inList = resPublicList.data.data.some((s) => s.id === testCreatedServiceId || s.slug === uniqueTestSlug);
    assert.strictEqual(inList, false, 'Deactivated service must not appear in public listing');

    const resPublicDetail = await request({
      method: 'GET',
      path: `/api/homa-services/${uniqueTestSlug}`,
    });
    assert.strictEqual(resPublicDetail.status, 404, 'Deactivated service must return 404 from public detail');
  });

  // 27. Reactivation -> 200 if supported by existing convention
  await test('27. Reactivation -> 200 if supported by existing convention', async () => {
    const res = await request({
      method: 'PUT',
      path: `/api/admin/homa-services/${testCreatedServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        isActive: true,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.isActive, true);

    const dbRecord = await HomaService.findByPk(testCreatedServiceId);
    assert.strictEqual(dbRecord.isActive, true);
  });

  // 28. Reactivated service appears publicly again
  await test('28. Reactivated service appears publicly again', async () => {
    const resPublicList = await request({
      method: 'GET',
      path: '/api/homa-services',
    });
    assert.strictEqual(resPublicList.status, 200);
    const inList = resPublicList.data.data.some((s) => s.id === testCreatedServiceId);
    assert.strictEqual(inList, true, 'Reactivated service must appear in public listing');

    const resPublicDetail = await request({
      method: 'GET',
      path: `/api/homa-services/${uniqueTestSlug}`,
    });
    assert.strictEqual(resPublicDetail.status, 200);
    assert.strictEqual(resPublicDetail.data.data.slug, uniqueTestSlug);
  });

  // 29. Existing Homa services remain intact
  await test('29. Existing Homa services remain intact', async () => {
    const currentCanonicalCount = await HomaService.count({
      where: {
        id: { [Op.notIn]: createdTestServiceIds },
      },
    });
    assert.strictEqual(
      currentCanonicalCount,
      initialHomaCount,
      'Seeded canonical Homa services count must not have changed'
    );
  });

  // 30. No changes to Puja/Yagya/Japa behavior
  await test('30. No changes to Puja/Yagya/Japa behavior', async () => {
    const resPuja = await request({
      method: 'GET',
      path: '/api/puja-services',
    });
    assert.strictEqual(resPuja.status, 200);
    assert.strictEqual(resPuja.data.success, true);

    const resYagya = await request({
      method: 'GET',
      path: '/api/yagya-services',
    });
    assert.strictEqual(resYagya.status, 200);
    assert.strictEqual(resYagya.data.success, true);

    const resJapa = await request({
      method: 'GET',
      path: '/api/japa-services',
    });
    assert.strictEqual(resJapa.status, 200);
    assert.strictEqual(resJapa.data.success, true);

    const resJapaAdmin = await request({
      method: 'GET',
      path: '/api/admin/japa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resJapaAdmin.status, 200);
    assert.strictEqual(resJapaAdmin.data.success, true);
  });

  // Clean up test records
  console.log('\nCleaning up test artifacts...');
  for (const id of createdTestServiceIds) {
    await HomaService.destroy({ where: { id } }).catch(() => {});
  }
  for (const userId of createdTestUsers) {
    await User.destroy({ where: { id: userId } }).catch(() => {});
  }
  console.log('Cleanup complete.');

  console.log('\n================================================================');
  console.log(`TOTAL TESTS: 30`);
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
    await runH5BVerification();
  } finally {
    server.close();
    process.exit(0);
  }
};

start().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
