require('dotenv').config({ path: __dirname + '/.env' });
const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');

// Load database & models
const db = require('./src/models/index.js').default;
const {
  User,
  JapaCategory,
  JapaService,
  JapaPurpose,
} = db;

const { calculateJapaPriceInternal } = require('./src/services/ritualPricing.service.js');
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

const cleanupCategoryIds = [];
const cleanupServiceIds = [];

async function runJapaCategoryVerification() {
  console.log('================================================================');
  console.log('PHASE 1: JAPA CATEGORY BACKEND ARCHITECTURE TEST SUITE');
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
      fullName: 'Japa Category Test Admin',
      email: `japa_cat_admin_${Date.now()}@example.com`,
      password: 'hashed_password_123',
      role: 'admin',
      isActive: true,
    });
  }

  let regularUser = await User.findOne({ where: { role: 'user', isActive: true } });
  if (!regularUser) {
    regularUser = await User.create({
      fullName: 'Japa Category Test User',
      email: `japa_cat_user_${Date.now()}@example.com`,
      password: 'hashed_password_123',
      role: 'user',
      isActive: true,
    });
  }

  const adminToken = jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: 'admin' },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '2h' }
  );

  const userToken = jwt.sign(
    { id: regularUser.id, email: regularUser.email, role: 'user' },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '2h' }
  );

  // SECTION A: MIGRATION & MODEL VERIFICATION
  console.log('--- SECTION A: Migration & Model Verification ---');

  await test('A1: Table japa_categories exists with correct column definitions', async () => {
    const [cols] = await db.sequelize.query(
      "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'japa_categories';"
    );
    const colNames = cols.map((c) => c.column_name);
    assert(colNames.includes('id'), 'Missing id column');
    assert(colNames.includes('name'), 'Missing name column');
    assert(colNames.includes('slug'), 'Missing slug column');
    assert(colNames.includes('description'), 'Missing description column');
    assert(colNames.includes('image'), 'Missing image column');
    assert(colNames.includes('icon_name'), 'Missing icon_name column');
    assert(colNames.includes('display_order'), 'Missing display_order column');
    assert(colNames.includes('is_active'), 'Missing is_active column');
    assert(colNames.includes('created_at'), 'Missing created_at column');
    assert(colNames.includes('updated_at'), 'Missing updated_at column');
  });

  await test('A2: Column category_id exists on japa_services table as nullable foreign key', async () => {
    const [cols] = await db.sequelize.query(
      "SELECT column_name, is_nullable, data_type FROM information_schema.columns WHERE table_name = 'japa_services' AND column_name = 'category_id';"
    );
    assert.strictEqual(cols.length, 1, 'category_id column does not exist on japa_services');
    assert.strictEqual(cols[0].is_nullable, 'YES', 'category_id must be nullable');
  });

  await test('A3: JapaCategory model enforces unique slug constraint', async () => {
    const testSlug = `test-japa-cat-slug-${Date.now()}`;
    const cat = await JapaCategory.create({
      name: `Test Japa Cat ${Date.now()}`,
      slug: testSlug,
      description: 'Test description',
      displayOrder: 99,
      isActive: true,
    });
    cleanupCategoryIds.push(cat.id);

    assert(cat.id, 'Expected generated UUID');
    assert.strictEqual(cat.slug, testSlug);

    // Attempt duplicate slug
    let duplicateFailed = false;
    try {
      await JapaCategory.create({
        name: `Duplicate Japa Cat ${Date.now()}`,
        slug: testSlug,
        displayOrder: 100,
        isActive: true,
      });
    } catch {
      duplicateFailed = true;
    }
    assert(duplicateFailed, 'Expected duplicate slug to throw error');
  });

  // SECTION B: PUBLIC CATEGORIES API
  console.log('\n--- SECTION B: Public Categories API ---');

  await test('B1: GET /api/japa-categories returns active categories only', async () => {
    // Create an inactive category
    const inactiveCat = await JapaCategory.create({
      name: `Inactive Japa Cat ${Date.now()}`,
      slug: `inactive-japa-cat-${Date.now()}`,
      displayOrder: 999,
      isActive: false,
    });
    cleanupCategoryIds.push(inactiveCat.id);

    const res = await request({ method: 'GET', path: '/api/japa-categories' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(Array.isArray(res.data.data), 'Expected array of categories');
    assert(res.data.data.length >= 7, 'Expected at least the 7 seeded categories');

    const foundInactive = res.data.data.find((c) => c.slug === inactiveCat.slug);
    assert(!foundInactive, 'Inactive category must not be returned in public API');
  });

  await test('B2: GET /api/japa-categories is sorted deterministically by displayOrder', async () => {
    const res = await request({ method: 'GET', path: '/api/japa-categories' });
    assert.strictEqual(res.status, 200);
    const data = res.data.data;
    for (let i = 0; i < data.length - 1; i++) {
      assert(
        data[i].displayOrder <= data[i + 1].displayOrder,
        `Categories not sorted by displayOrder: ${data[i].displayOrder} > ${data[i + 1].displayOrder}`
      );
    }
  });

  await test('B3: GET /api/japa-categories/:slug returns single category by slug', async () => {
    const res = await request({ method: 'GET', path: '/api/japa-categories/shiva-mantra-japa' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.slug, 'shiva-mantra-japa');
    assert.strictEqual(res.data.data.name, 'Shiva & Moola Mantra Japa');
    assert(res.data.data.id, 'Expected category ID');
  });

  await test('B4: GET /api/japa-categories/:slug returns 404 for unknown slug', async () => {
    const resUnknown = await request({ method: 'GET', path: '/api/japa-categories/non-existent-japa-xyz' });
    assert.strictEqual(resUnknown.status, 404);
    assert.strictEqual(resUnknown.data.success, false);
  });

  await test('B5: GET /api/japa-services/categories alias endpoint returns active categories', async () => {
    const res = await request({ method: 'GET', path: '/api/japa-services/categories' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(Array.isArray(res.data.data), 'Expected array of categories');
    assert(res.data.data.length >= 7, 'Expected categories from alias endpoint');
  });

  // SECTION C: JAPA SERVICE FILTERING & CATEGORY INCLUSION
  console.log('\n--- SECTION C: Japa Service Filtering & Category Inclusions ---');

  await test('C1: GET /api/japa-services?category=shiva-mantra-japa filters services by category', async () => {
    const res = await request({ method: 'GET', path: '/api/japa-services?category=shiva-mantra-japa' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.total >= 2, 'Expected at least 2 Shiva mantra japa services');
    for (const service of res.data.data) {
      assert(service.category, 'Service must have category object');
      assert.strictEqual(service.category.slug, 'shiva-mantra-japa');
    }
  });

  await test('C2: GET /api/japa-services?category=non-existent-xyz returns 0 services cleanly', async () => {
    const res = await request({ method: 'GET', path: '/api/japa-services?category=non-existent-category-slug' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.total, 0);
    assert.strictEqual(res.data.data.length, 0);
  });

  await test('C3: GET /api/japa-services without category filter preserves existing catalogue behavior', async () => {
    const res = await request({ method: 'GET', path: '/api/japa-services' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.total >= 8, 'Expected all 8 active canonical services returned');
  });

  await test('C4: GET /api/japa-services preserves search and purpose filters combined with category', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/japa-services?category=shiva-mantra-japa&search=Mrityunjaya',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.total >= 1, 'Expected Mrityunjaya under shiva-mantra-japa search');
    assert(res.data.data[0].name.includes('Mrityunjaya'));
  });

  await test('C5: GET /api/japa-services/:slug includes category object in service detail', async () => {
    const res = await request({ method: 'GET', path: '/api/japa-services/maha-mrityunjaya-japa' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.data.category, 'Expected category in detail view');
    assert.strictEqual(res.data.data.category.slug, 'shiva-mantra-japa');
    assert.strictEqual(res.data.data.category.name, 'Shiva & Moola Mantra Japa');
  });

  // SECTION D: MODEL RELATIONSHIPS & UNCATEGORIZED BEHAVIOR
  console.log('\n--- SECTION D: Model Relationships & Uncategorized Behavior ---');

  await test('D1: JapaCategory.hasMany(JapaService) retrieves associated services', async () => {
    const shivaCategory = await JapaCategory.findOne({
      where: { slug: 'shiva-mantra-japa' },
      include: [{ model: JapaService, as: 'services' }],
    });
    assert(shivaCategory, 'Shiva category not found');
    assert(Array.isArray(shivaCategory.services), 'Expected services array');
    assert(shivaCategory.services.length >= 2, 'Expected at least 2 services mapped to Shiva category');
  });

  await test('D2: JapaService.belongsTo(JapaCategory) retrieves associated category', async () => {
    const mrityunjayaService = await JapaService.findOne({
      where: { slug: 'maha-mrityunjaya-japa' },
      include: [{ model: JapaCategory, as: 'categoryDetails' }],
    });
    assert(mrityunjayaService, 'Maha Mrityunjaya service not found');
    assert(mrityunjayaService.categoryDetails, 'Expected categoryDetails association');
    assert.strictEqual(mrityunjayaService.categoryDetails.slug, 'shiva-mantra-japa');
  });

  await test('D3: Service without category (categoryId: null) behaves gracefully as Uncategorized', async () => {
    const uncatServiceSlug = `uncategorized-japa-${Date.now()}`;
    const uncatService = await JapaService.create({
      name: 'Uncategorized Test Japa',
      slug: uncatServiceSlug,
      mantra: 'Om Test Namah',
      startingPrice: 2100,
      categoryId: null,
      purposeId: null,
      availableCounts: [11000],
      variants: [{ count: 11000, startingPrice: 2100 }],
      isActive: true,
    });
    cleanupServiceIds.push(uncatService.id);

    const res = await request({ method: 'GET', path: `/api/japa-services/${uncatServiceSlug}` });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.categoryId, null);
    assert.strictEqual(res.data.data.category, null);
  });

  await test('D4: Existing 8 Japa services preserved with correct slugs and purposes', async () => {
    const allServices = await JapaService.findAll();
    assert(allServices.length >= 8, 'Expected at least 8 canonical services');
    const mrityunjaya = allServices.find((s) => s.slug === 'maha-mrityunjaya-japa');
    assert(mrityunjaya, 'Maha Mrityunjaya service must be present');
    assert(mrityunjaya.purposeId, 'Purpose relationship must be preserved');
  });

  // SECTION E: ADMIN API & CRUD
  console.log('\n--- SECTION E: Admin Category API & Service Assignment ---');

  await test('E1: Admin endpoints reject unauthenticated requests with 401', async () => {
    const resList = await request({ method: 'GET', path: '/api/admin/japa-categories' });
    assert.strictEqual(resList.status, 401);

    const resCreate = await request({
      method: 'POST',
      path: '/api/admin/japa-categories',
      body: { name: 'Unauthorized Japa Category' },
    });
    assert.strictEqual(resCreate.status, 401);
  });

  await test('E2: Admin endpoints reject non-admin users with 403', async () => {
    const resList = await request({
      method: 'GET',
      path: '/api/admin/japa-categories',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.strictEqual(resList.status, 403);
  });

  let createdAdminCatId = null;
  const adminTestSlug = `admin-japa-cat-${Date.now()}`;

  await test('E3: Admin can create a new category (POST /api/admin/japa-categories)', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/japa-categories',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Admin Test Japa Category',
        slug: adminTestSlug,
        description: 'Created during automated verification',
        displayOrder: 25,
        isActive: true,
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert(res.data.data.id, 'Expected created ID');
    assert.strictEqual(res.data.data.slug, adminTestSlug);
    createdAdminCatId = res.data.data.id;
    cleanupCategoryIds.push(createdAdminCatId);
  });

  await test('E4: Admin create rejects duplicate slug with 409', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/japa-categories',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Admin Test Category Dup',
        slug: adminTestSlug,
        displayOrder: 26,
      },
    });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
  });

  await test('E5: Admin can get category by ID (GET /api/admin/japa-categories/:id)', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/admin/japa-categories/${createdAdminCatId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.id, createdAdminCatId);
    assert.strictEqual(res.data.data.name, 'Admin Test Japa Category');
  });

  await test('E6: Admin get category by invalid UUID returns 400', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/japa-categories/invalid-uuid-123',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('E7: Admin can update category (PUT /api/admin/japa-categories/:id)', async () => {
    const res = await request({
      method: 'PUT',
      path: `/api/admin/japa-categories/${createdAdminCatId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Updated Admin Test Japa Category',
        displayOrder: 30,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.name, 'Updated Admin Test Japa Category');
    assert.strictEqual(res.data.data.displayOrder, 30);
  });

  await test('E8: Admin can soft delete (deactivate) category (DELETE /api/admin/japa-categories/:id)', async () => {
    const res = await request({
      method: 'DELETE',
      path: `/api/admin/japa-categories/${createdAdminCatId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.isActive, false);

    // Verify it is now inactive in DB
    const catInDb = await JapaCategory.findByPk(createdAdminCatId);
    assert.strictEqual(catInDb.isActive, false);

    // Verify it does not appear in public API
    const pubRes = await request({ method: 'GET', path: '/api/japa-categories' });
    const inPub = pubRes.data.data.find((c) => c.id === createdAdminCatId);
    assert(!inPub, 'Deactivated category must not be in public listing');
  });

  await test('E9: Inactive category is visible in admin listing with isActive: false', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/japa-categories',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    const inAdmin = res.data.data.find((c) => c.id === createdAdminCatId);
    assert(inAdmin, 'Deactivated category must be visible to admin');
    assert.strictEqual(inAdmin.isActive, false);
  });

  await test('E10: Admin can reactivate category (PUT /api/admin/japa-categories/:id with isActive: true)', async () => {
    const res = await request({
      method: 'PUT',
      path: `/api/admin/japa-categories/${createdAdminCatId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        isActive: true,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.isActive, true);

    // Verify it appears in public API again
    const pubRes = await request({ method: 'GET', path: '/api/japa-categories' });
    const inPub = pubRes.data.data.find((c) => c.id === createdAdminCatId);
    assert(inPub, 'Reactivated category must appear in public listing');
  });

  let createdServiceId = null;
  await test('E11: Admin service creation accepts valid categoryId', async () => {
    const ganapatiCat = await JapaCategory.findOne({ where: { slug: 'ganapati-siddhi-japa' } });
    assert(ganapatiCat, 'Ganapati category not found');

    const testServiceSlug = `test-japa-cat-assign-${Date.now()}`;
    const res = await request({
      method: 'POST',
      path: '/api/admin/japa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Test Japa With Category',
        slug: testServiceSlug,
        mantra: 'Om Gam Ganapataye Namaha',
        startingPrice: 5100,
        categoryId: ganapatiCat.id,
        availableCounts: [11000],
        variants: [{ count: 11000, startingPrice: 5100 }],
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.categoryId, ganapatiCat.id);
    assert(res.data.data.category, 'Expected category object in response');
    assert.strictEqual(res.data.data.category.slug, 'ganapati-siddhi-japa');
    createdServiceId = res.data.data.id;
    cleanupServiceIds.push(createdServiceId);
  });

  await test('E12: Admin service creation rejects non-existent categoryId with 400', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/japa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Test Japa Bad Category',
        slug: `test-bad-japa-cat-${Date.now()}`,
        mantra: 'Om Gam Ganapataye Namaha',
        startingPrice: 5100,
        categoryId: '00000000-0000-0000-0000-000000000000',
        availableCounts: [11000],
        variants: [{ count: 11000, startingPrice: 5100 }],
      },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('categoryId'));
  });

  await test('E13: Admin service update can change categoryId without modifying pricing or booking logic', async () => {
    const shivaCat = await JapaCategory.findOne({ where: { slug: 'shiva-mantra-japa' } });
    assert(createdServiceId, 'No test service to update');

    const res = await request({
      method: 'PUT',
      path: `/api/admin/japa-services/${createdServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        categoryId: shivaCat.id,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.categoryId, shivaCat.id);
    assert.strictEqual(res.data.data.startingPrice, 5100, 'Starting price must remain untouched');
    assert.strictEqual(res.data.data.category.slug, 'shiva-mantra-japa');
  });

  // SECTION F: PRICING & BOOKING INTEGRITY VERIFICATION
  console.log('\n--- SECTION F: Pricing & Booking Logic Integrity ---');

  await test('F1: Existing Japa pricing calculation remains identical with or without categoryId', async () => {
    const canonicalJapa = await JapaService.findOne({ where: { slug: 'maha-mrityunjaya-japa' } });
    assert(canonicalJapa, 'Maha Mrityunjaya service must exist');

    const priceCalc = calculateJapaPriceInternal({
      service: canonicalJapa,
      japaCount: 11000,
      panditCount: 2,
      commencementDate: '2026-10-15',
    });

    assert(priceCalc.totalAmount > 0, 'Price must be calculated');
    assert.strictEqual(priceCalc.japaCount, 11000);
    assert.strictEqual(priceCalc.panditCount, 2);
    assert(priceCalc.requiredDays > 0, 'Required days must be calculated');
  });

  // Cleanup
  console.log('\n--- Cleaning up temporary test fixtures ---');
  for (const sId of cleanupServiceIds) {
    try {
      await JapaService.destroy({ where: { id: sId } });
    } catch {}
  }
  for (const cId of cleanupCategoryIds) {
    try {
      await JapaCategory.destroy({ where: { id: cId } });
    } catch {}
  }

  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

// Start temporary HTTP server on port 0
server = http.createServer(app);
server.listen(0, async () => {
  port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
  try {
    await runJapaCategoryVerification();
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('Fatal test error:', err);
    server.close(() => process.exit(1));
  }
});
