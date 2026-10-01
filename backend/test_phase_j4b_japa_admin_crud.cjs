require('dotenv').config({ path: __dirname + '/.env' });
const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');

// Load database & models
const db = require('./src/models/index.js').default;
const {
  User,
  JapaService,
  JapaPurpose,
  PujaService,
  YagyaService,
  UpcomingPuja,
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
const createdTestBookings = [];

async function runJ4BVerification() {
  console.log('================================================================');
  console.log('PHASE J4-B: BACKEND ADMIN JAPA CRUD API TEST SUITE');
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
      fullName: 'J4B Test Admin',
      email: `j4b_admin_${Date.now()}@example.com`,
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
      fullName: 'J4B Test Regular User',
      email: `j4b_user_${Date.now()}@example.com`,
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

  let seededJapa = await JapaService.findOne({ where: { isActive: true } });
  assert.ok(seededJapa, 'At least one seeded Japa service must exist in DB');

  let createdTestServiceId = null;
  const uniqueSlug = `test-rudra-japa-${Date.now()}`;

  // ==========================================
  // Test Cases 1 - 27
  // ==========================================

  // 1. Admin authentication required
  await test('1. Admin authentication required', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/japa-services',
    });
    assert.strictEqual(res.status, 401, 'Should return 401 without auth token');
    assert.strictEqual(res.data.success, false);
  });

  // 2. Non-admin rejected
  await test('2. Non-admin rejected', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/japa-services',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.strictEqual(res.status, 403, 'Should return 403 for non-admin user');
    assert.strictEqual(res.data.success, false);
  });

  // 3. Admin can list Japa services
  await test('3. Admin can list Japa services', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/japa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200, 'Should return 200');
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data), 'Data should be an array');
    assert.ok(res.data.total >= 1, 'Total count should be at least 1');
    const first = res.data.data[0];
    assert.ok(first.id, 'Record must have id');
    assert.ok(first.slug, 'Record must have slug');
    assert.ok(first.name, 'Record must have name');
    assert.ok(first.mantra, 'Record must have mantra');
    assert.ok(typeof first.startingPrice === 'number', 'Record must have startingPrice');
    assert.ok(first.formattedPrice, 'Record must have formattedPrice');
  });

  // 4. Pagination works
  await test('4. Pagination works', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/japa-services?page=1&limit=2',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.page, 1);
    assert.strictEqual(res.data.limit, 2);
    assert.ok(res.data.data.length <= 2);
    assert.ok(res.data.totalPages >= 1);
  });

  // 5. Search works
  await test('5. Search works', async () => {
    const searchTarget = seededJapa.name.split(' ')[0];
    const res = await request({
      method: 'GET',
      path: `/api/admin/japa-services?search=${encodeURIComponent(searchTarget)}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.length >= 1, `Search for '${searchTarget}' should return at least 1 result`);
  });

  // 6. Active/featured filtering works
  await test('6. Active/featured filtering works', async () => {
    const resActive = await request({
      method: 'GET',
      path: '/api/admin/japa-services?isActive=true',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resActive.status, 200);
    for (const item of resActive.data.data) {
      assert.strictEqual(item.isActive, true, 'Each item must have isActive: true');
    }

    const resFeatured = await request({
      method: 'GET',
      path: '/api/admin/japa-services?isFeatured=true',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resFeatured.status, 200);
    for (const item of resFeatured.data.data) {
      assert.strictEqual(item.isFeatured, true, 'Each item must have isFeatured: true');
    }
  });

  // 7. Admin can fetch service by ID
  await test('7. Admin can fetch service by ID', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/admin/japa-services/${seededJapa.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.id, seededJapa.id);
    assert.strictEqual(res.data.data.slug, seededJapa.slug);
    assert.ok(Array.isArray(res.data.data.variants), 'variants should be an array');
    assert.ok(Array.isArray(res.data.data.availableCounts), 'availableCounts should be an array');
  });

  // 8. Invalid UUID handled
  await test('8. Invalid UUID handled', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/japa-services/not-a-valid-uuid',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert.ok(res.data.message.includes('UUID'));
  });

  // 9. Missing service handled
  await test('9. Missing service handled', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/japa-services/00000000-0000-0000-0000-000000000000',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.success, false);
    assert.ok(res.data.message.includes('not found'));
  });

  // 10. Admin can create service
  await test('10. Admin can create service', async () => {
    const payload = {
      name: 'Test Rudra Gayatri Japa',
      slug: uniqueSlug,
      mantra: 'ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि तन्नो रुद्रः प्रचोदयात्॥',
      mantraMeaning: 'Rudra Gayatri sacred verse',
      shortDescription: 'Dedicated Shiva Japa for inner strength and peace.',
      description: 'Comprehensive Vedic chanting performed with strict sankalpa.',
      startingPrice: 16000,
      availableCounts: [11000, 21000, 51000],
      variants: [
        { count: 11000, label: '11,000 Japa', startingPrice: 16000, estimatedDuration: '3 Days', minimumPandits: 2, recommendedPandits: 3, dailyCapacity: 2000 },
        { count: 21000, label: '21,000 Japa', startingPrice: 26000, estimatedDuration: '5 Days', minimumPandits: 3, recommendedPandits: 4, dailyCapacity: 2000 },
      ],
      dailyCapacityPerPandit: 2000,
      minimumPandits: 2,
      recommendedPandits: 4,
      maximumPandits: 11,
      isKashiAvailable: true,
      isRemoteAvailable: true,
      isFeatured: false,
      isActive: true,
      bannerImage: 'https://res.cloudinary.com/veda/image/upload/v1/japa.jpg',
      galleryImages: ['https://res.cloudinary.com/veda/image/upload/v1/gallery1.jpg'],
      samagri: ['Rudraksha Mala', 'Gangajal'],
      prasad: 'Energized Rudraksha and Vibhuti',
    };

    const res = await request({
      method: 'POST',
      path: '/api/admin/japa-services',
      body: payload,
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.name, payload.name);
    assert.strictEqual(res.data.data.slug, uniqueSlug);
    assert.strictEqual(res.data.data.startingPrice, 16000);

    createdTestServiceId = res.data.data.id;
    createdTestServiceIds.push(createdTestServiceId);
  });

  // 11. Slug auto-generation works
  await test('11. Slug auto-generation works', async () => {
    const autoName = `Test Auto Generated Slug ${Date.now()}`;
    const payload = {
      name: autoName,
      mantra: 'ॐ नमः शिवाय॥',
      startingPrice: 12000,
    };

    const res = await request({
      method: 'POST',
      path: '/api/admin/japa-services',
      body: payload,
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.slug.startsWith('test-auto-generated-slug'));
    createdTestServiceIds.push(res.data.data.id);
  });

  // 12. Duplicate slug rejected
  await test('12. Duplicate slug rejected', async () => {
    const payload = {
      name: 'Another Service Same Slug',
      slug: uniqueSlug,
      mantra: 'ॐ नमः शिवाय॥',
      startingPrice: 15000,
    };

    const res = await request({
      method: 'POST',
      path: '/api/admin/japa-services',
      body: payload,
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
    assert.ok(res.data.message.includes('already exists'));
  });

  // 13. Required mantra validation works
  await test('13. Required mantra validation works', async () => {
    const payload = {
      name: 'Service Without Mantra',
      slug: `no-mantra-${Date.now()}`,
      mantra: '',
      startingPrice: 10000,
    };

    const res = await request({
      method: 'POST',
      path: '/api/admin/japa-services',
      body: payload,
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert.ok(res.data.message.includes('Mantra is required'));
  });

  // 14. availableCounts validation works
  await test('14. availableCounts validation works', async () => {
    // Malformed counts: negative count
    const resNegative = await request({
      method: 'POST',
      path: '/api/admin/japa-services',
      body: {
        name: 'Invalid Count Japa',
        mantra: 'ॐ नमः शिवाय॥',
        startingPrice: 10000,
        availableCounts: [-1000, 21000],
      },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resNegative.status, 400);

    // Duplicate count
    const resDuplicate = await request({
      method: 'POST',
      path: '/api/admin/japa-services',
      body: {
        name: 'Duplicate Count Japa',
        mantra: 'ॐ नमः शिवाय॥',
        startingPrice: 10000,
        availableCounts: [11000, 11000],
      },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resDuplicate.status, 400);
    assert.ok(resDuplicate.data.message.includes('Duplicate count'));
  });

  // 15. variants validation works
  await test('15. variants validation works', async () => {
    const resMalformedVariant = await request({
      method: 'POST',
      path: '/api/admin/japa-services',
      body: {
        name: 'Bad Variant Japa',
        mantra: 'ॐ नमः शिवाय॥',
        startingPrice: 10000,
        variants: [{ count: 'not-a-number', startingPrice: -500 }],
      },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resMalformedVariant.status, 400);
  });

  // 16. pandit relationship validation works
  await test('16. pandit relationship validation works', async () => {
    // min > rec
    const resMinGreater = await request({
      method: 'POST',
      path: '/api/admin/japa-services',
      body: {
        name: 'Bad Pandits Japa',
        mantra: 'ॐ नमः शिवाय॥',
        startingPrice: 10000,
        minimumPandits: 5,
        recommendedPandits: 3,
        maximumPandits: 10,
      },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resMinGreater.status, 400);
    assert.ok(resMinGreater.data.message.includes('minimumPandits'));

    // rec > max
    const resRecGreater = await request({
      method: 'POST',
      path: '/api/admin/japa-services',
      body: {
        name: 'Bad Pandits Japa 2',
        mantra: 'ॐ नमः शिवाय॥',
        startingPrice: 10000,
        minimumPandits: 2,
        recommendedPandits: 15,
        maximumPandits: 10,
      },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resRecGreater.status, 400);
    assert.ok(resRecGreater.data.message.includes('recommendedPandits'));
  });

  // 17. purposeId validation works
  await test('17. purposeId validation works', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/japa-services',
      body: {
        name: 'Invalid Purpose Japa',
        mantra: 'ॐ नमः शिवाय॥',
        startingPrice: 10000,
        purposeId: '00000000-0000-0000-0000-000000000000',
      },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('purposeId'));
  });

  // 18. Admin can update service
  await test('18. Admin can update service', async () => {
    const res = await request({
      method: 'PUT',
      path: `/api/admin/japa-services/${createdTestServiceId}`,
      body: {
        name: 'Updated Rudra Gayatri Japa',
        startingPrice: 18500,
        shortDescription: 'Updated short description for test.',
      },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.name, 'Updated Rudra Gayatri Japa');
    assert.strictEqual(res.data.data.startingPrice, 18500);
  });

  // 19. Slug conflict on update rejected
  await test('19. Slug conflict on update rejected', async () => {
    const res = await request({
      method: 'PUT',
      path: `/api/admin/japa-services/${createdTestServiceId}`,
      body: {
        slug: seededJapa.slug,
      },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
    assert.ok(res.data.message.includes('already in use'));
  });

  // 20. Admin can soft-delete/deactivate service
  await test('20. Admin can soft-delete/deactivate service', async () => {
    const res = await request({
      method: 'DELETE',
      path: `/api/admin/japa-services/${createdTestServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.message.includes('deactivated'));
  });

  // 21. Deactivated service remains in database
  await test('21. Deactivated service remains in database', async () => {
    const record = await JapaService.findByPk(createdTestServiceId);
    assert.ok(record, 'Record must physically remain in the database');
    assert.strictEqual(record.isActive, false, 'Record isActive must be false');

    const resAdmin = await request({
      method: 'GET',
      path: `/api/admin/japa-services/${createdTestServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resAdmin.status, 200);
    assert.strictEqual(resAdmin.data.data.isActive, false);
  });

  // 22. Public API remains functional
  await test('22. Public API remains functional', async () => {
    const resList = await request({
      method: 'GET',
      path: '/api/japa-services',
    });
    assert.strictEqual(resList.status, 200);
    assert.strictEqual(resList.data.success, true);
    assert.ok(resList.data.data.length >= 1);

    const resPurposes = await request({
      method: 'GET',
      path: '/api/japa-services/purposes',
    });
    assert.strictEqual(resPurposes.status, 200);
    assert.strictEqual(resPurposes.data.success, true);

    const resDetail = await request({
      method: 'GET',
      path: `/api/japa-services/${seededJapa.slug}`,
    });
    assert.strictEqual(resDetail.status, 200);
    assert.strictEqual(resDetail.data.data.slug, seededJapa.slug);
  });

  // 23. Existing Japa pricing remains functional
  await test('23. Existing Japa pricing remains functional', async () => {
    const count = seededJapa.availableCounts?.[0] || 11000;
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'JAPA',
        serviceSlug: seededJapa.slug,
        japaCount: count,
        panditCount: seededJapa.minimumPandits || 2,
        commencementDate: '2026-11-15',
        arrangementMode: 'remote',
      },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.serviceType, 'JAPA');
    assert.ok(res.data.data.totalAmount > 0);
  });

  // 24. Existing Japa booking remains functional
  await test('24. Existing Japa booking remains functional', async () => {
    const commencementDate = '2026-11-20';
    const japaCount = seededJapa.availableCounts?.[0] || 11000;
    const panditCount = seededJapa.minimumPandits || 2;
    const dailyCap = (seededJapa.dailyCapacityPerPandit || 2000) * panditCount;
    const reqDays = Math.ceil(japaCount / dailyCap) || 3;
    const compD = new Date(commencementDate);
    compD.setDate(compD.getDate() + (reqDays - 1));
    const completionDate = compD.toISOString().split('T')[0];

    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'JAPA',
        serviceId: seededJapa.id,
        serviceSlug: seededJapa.slug,
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
          mantra: seededJapa.mantra || 'ॐ नमः शिवाय॥',
        },
        location: {
          locationType: 'remote',
          venueDetails: {},
        },
        yajman: {
          name: 'Shri Testing Admin',
          mobile: '9876543210',
          email: 'test_j4b@example.com',
        },
        sankalp: {
          purpose: 'Spiritual Peace',
        },
      },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.bookingReference);
    createdTestBookings.push(res.data.data.bookingReference);
  });

  // 25. Puja regression passes
  await test('25. Puja regression passes', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/puja-services',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
  });

  // 26. Yagya regression passes
  await test('26. Yagya regression passes', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/yagya-services',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
  });

  // 27. Upcoming Puja regression passes
  await test('27. Upcoming Puja regression passes', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/upcoming-pujas',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
  });

  // Clean up test records
  console.log('\nCleaning up test artifacts...');
  for (const ref of createdTestBookings) {
    await RitualBooking.destroy({ where: { bookingReference: ref } }).catch(() => {});
  }
  for (const id of createdTestServiceIds) {
    await JapaService.destroy({ where: { id } }).catch(() => {});
  }
  for (const userId of createdTestUsers) {
    await User.destroy({ where: { id: userId } }).catch(() => {});
  }
  console.log('Cleanup complete.');

  console.log('\n================================================================');
  console.log(`TOTAL TESTS: 27`);
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
    await runJ4BVerification();
  } finally {
    server.close();
    process.exit(0);
  }
};

start().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
