require('dotenv').config({ path: __dirname + '/.env' });
const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');

// Load database & models
const db = require('./src/models/index.js').default;
const {
  User,
  HomaCategory,
  HomaService,
  HomaPurpose,
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

const cleanupCategoryIds = [];
const cleanupServiceIds = [];
const cleanupBookingRefs = [];

async function runHomaCategoryVerification() {
  console.log('================================================================');
  console.log('PHASE 1: HOMA CATEGORY BACKEND ARCHITECTURE TEST SUITE');
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
      fullName: 'Homa Category Test Admin',
      email: `homa_cat_admin_${Date.now()}@example.com`,
      password: 'hashed_password_123',
      role: 'admin',
      isActive: true,
    });
  }

  let regularUser = await User.findOne({ where: { role: 'user', isActive: true } });
  if (!regularUser) {
    regularUser = await User.create({
      fullName: 'Homa Category Regular User',
      email: `homa_cat_user_${Date.now()}@example.com`,
      password: 'hashed_password_123',
      role: 'user',
      isActive: true,
    });
  }

  const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
  const adminToken = jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: 'admin' },
    jwtSecret,
    { expiresIn: '1h' }
  );
  const userToken = jwt.sign(
    { id: regularUser.id, email: regularUser.email, role: 'user' },
    jwtSecret,
    { expiresIn: '1h' }
  );

  // SECTION A: MIGRATION & DATABASE SCHEMA
  console.log('--- SECTION A: Migration & Database Schema Integrity ---');

  await test('A1: Table homa_categories exists with all required columns', async () => {
    const [cols] = await db.sequelize.query(
      "SELECT column_name, is_nullable, data_type FROM information_schema.columns WHERE table_name = 'homa_categories';"
    );
    assert(cols.length > 0, 'Table homa_categories does not exist');
    const colNames = cols.map((c) => c.column_name);
    assert(colNames.includes('id'), 'Missing id column');
    assert(colNames.includes('name'), 'Missing name column');
    assert(colNames.includes('slug'), 'Missing slug column');
    assert(colNames.includes('description'), 'Missing description column');
    assert(colNames.includes('icon_name'), 'Missing icon_name column');
    assert(colNames.includes('image'), 'Missing image column');
    assert(colNames.includes('display_order'), 'Missing display_order column');
    assert(colNames.includes('is_active'), 'Missing is_active column');
    assert(colNames.includes('created_at'), 'Missing created_at column');
    assert(colNames.includes('updated_at'), 'Missing updated_at column');
  });

  await test('A2: Column category_id exists on homa_services table as nullable foreign key', async () => {
    const [cols] = await db.sequelize.query(
      "SELECT column_name, is_nullable, data_type FROM information_schema.columns WHERE table_name = 'homa_services' AND column_name = 'category_id';"
    );
    assert.strictEqual(cols.length, 1, 'category_id column does not exist on homa_services');
    assert.strictEqual(cols[0].is_nullable, 'YES', 'category_id must be nullable');
  });

  await test('A3: HomaCategory model enforces unique slug constraint', async () => {
    const testSlug = `test-homa-cat-slug-${Date.now()}`;
    const cat = await HomaCategory.create({
      name: `Test Homa Cat ${Date.now()}`,
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
      await HomaCategory.create({
        name: `Duplicate Homa Cat ${Date.now()}`,
        slug: testSlug,
        displayOrder: 100,
        isActive: true,
      });
    } catch {
      duplicateFailed = true;
    }
    assert(duplicateFailed, 'Expected duplicate slug to throw error');
  });

  await test('A4: HomaCategory model enforces unique name constraint', async () => {
    const testName = `Unique Test Name ${Date.now()}`;
    const cat = await HomaCategory.create({
      name: testName,
      slug: `unique-homa-slug-${Date.now()}`,
      description: 'Test description',
      displayOrder: 98,
      isActive: true,
    });
    cleanupCategoryIds.push(cat.id);

    let duplicateNameFailed = false;
    try {
      await HomaCategory.create({
        name: testName,
        slug: `another-slug-${Date.now()}`,
        displayOrder: 97,
        isActive: true,
      });
    } catch {
      duplicateNameFailed = true;
    }
    assert(duplicateNameFailed, 'Expected duplicate name to throw error');
  });

  // SECTION B: CANONICAL SEED DATA & CATEGORIZATION
  console.log('\n--- SECTION B: Canonical Seed Data & Categorization ---');

  const EXPECTED_CATEGORIES = [
    { slug: 'shiva-rudra-homa', name: 'Shiva & Rudra Homa', order: 1, icon: 'Flame' },
    { slug: 'ganapati-homa', name: 'Ganapati Homa', order: 2, icon: 'Sparkles' },
    { slug: 'durga-chandi-homa', name: 'Durga & Chandi Homa', order: 3, icon: 'Shield' },
    { slug: 'lakshmi-kubera-homa', name: 'Lakshmi & Kubera Homa', order: 4, icon: 'Coins' },
    { slug: 'navagraha-planetary-homa', name: 'Navagraha Planetary Homa', order: 5, icon: 'Compass' },
    { slug: 'vastu-griha-homa', name: 'Vastu & Griha Homa', order: 6, icon: 'Home' },
    { slug: 'ayushya-longevity-homa', name: 'Ayushya & Longevity Homa', order: 7, icon: 'Heart' },
  ];

  await test('B1: Exactly 7 canonical Homa categories exist', async () => {
    const categories = await HomaCategory.findAll({
      where: { slug: EXPECTED_CATEGORIES.map((c) => c.slug) },
    });
    assert.strictEqual(categories.length, 7, 'Expected exactly 7 canonical categories in DB');
  });

  await test('B2: All 7 categories are active', async () => {
    const categories = await HomaCategory.findAll({
      where: { slug: EXPECTED_CATEGORIES.map((c) => c.slug) },
    });
    for (const cat of categories) {
      assert.strictEqual(cat.isActive, true, `Category ${cat.slug} must be active`);
    }
  });

  await test('B3: Category slugs, names, icons and display orders match specification', async () => {
    for (const expected of EXPECTED_CATEGORIES) {
      const cat = await HomaCategory.findOne({ where: { slug: expected.slug } });
      assert(cat, `Category ${expected.slug} not found`);
      assert.strictEqual(cat.name, expected.name);
      assert.strictEqual(cat.displayOrder, expected.order);
      assert.strictEqual(cat.iconName, expected.icon);
    }
  });

  const EXPECTED_SERVICE_MAPPINGS = {
    'maha-mrityunjaya-homa': 'shiva-rudra-homa',
    'rudra-homa': 'shiva-rudra-homa',
    'ganapati-homa': 'ganapati-homa',
    'durga-chandi-homa': 'durga-chandi-homa',
    'lakshmi-kubera-homa': 'lakshmi-kubera-homa',
    'navagraha-homa': 'navagraha-planetary-homa',
    'vastu-shanti-homa': 'vastu-griha-homa',
    'ayushya-homa': 'ayushya-longevity-homa',
  };

  await test('B4: All 8 canonical Homa services are categorized without orphan category IDs', async () => {
    const serviceSlugs = Object.keys(EXPECTED_SERVICE_MAPPINGS);
    const services = await HomaService.findAll({
      where: { slug: serviceSlugs },
      include: [{ model: HomaCategory, as: 'categoryDetails' }],
    });
    assert.strictEqual(services.length, 8, 'Expected 8 canonical services in DB');

    for (const service of services) {
      assert(service.categoryId, `Service ${service.slug} has no categoryId`);
      assert(service.categoryDetails, `Service ${service.slug} has orphan categoryId: ${service.categoryId}`);
      const expectedCatSlug = EXPECTED_SERVICE_MAPPINGS[service.slug];
      assert.strictEqual(
        service.categoryDetails.slug,
        expectedCatSlug,
        `Service ${service.slug} mapped to ${service.categoryDetails.slug}, expected ${expectedCatSlug}`
      );
    }
  });

  // SECTION C: PUBLIC CATEGORIES API
  console.log('\n--- SECTION C: Public Categories API ---');

  await test('C1: GET /api/homa-categories returns active categories only', async () => {
    // Create an inactive category
    const inactiveCat = await HomaCategory.create({
      name: `Inactive Homa Cat ${Date.now()}`,
      slug: `inactive-homa-cat-${Date.now()}`,
      displayOrder: 999,
      isActive: false,
    });
    cleanupCategoryIds.push(inactiveCat.id);

    const res = await request({ method: 'GET', path: '/api/homa-categories' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(Array.isArray(res.data.data), 'Expected array of categories');
    assert(res.data.data.length >= 7, 'Expected at least the 7 seeded categories');

    const foundInactive = res.data.data.find((c) => c.slug === inactiveCat.slug);
    assert(!foundInactive, 'Inactive category must not be returned in public API');
  });

  await test('C2: GET /api/homa-categories is sorted deterministically by displayOrder', async () => {
    const res = await request({ method: 'GET', path: '/api/homa-categories' });
    assert.strictEqual(res.status, 200);
    const data = res.data.data;
    for (let i = 0; i < data.length - 1; i++) {
      assert(
        data[i].displayOrder <= data[i + 1].displayOrder,
        `Categories not sorted by displayOrder: ${data[i].displayOrder} > ${data[i + 1].displayOrder}`
      );
    }
  });

  await test('C3: GET /api/homa-categories/:slug returns single category with serialized shape', async () => {
    const res = await request({ method: 'GET', path: '/api/homa-categories/shiva-rudra-homa' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.slug, 'shiva-rudra-homa');
    assert.strictEqual(res.data.data.name, 'Shiva & Rudra Homa');
    assert.strictEqual(res.data.data.iconName, 'Flame');
    assert.strictEqual(res.data.data.displayOrder, 1);
    assert.strictEqual(res.data.data.isActive, true);
    assert(res.data.data.id, 'Expected category ID');
  });

  await test('C4: GET /api/homa-categories/:slug returns 404 for unknown slug', async () => {
    const res = await request({ method: 'GET', path: '/api/homa-categories/non-existent-homa-slug' });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.success, false);
  });

  await test('C5: GET /api/homa-categories/:slug returns 404 for inactive category', async () => {
    const inactCat = await HomaCategory.create({
      name: `Hidden Homa Cat ${Date.now()}`,
      slug: `hidden-homa-cat-${Date.now()}`,
      displayOrder: 998,
      isActive: false,
    });
    cleanupCategoryIds.push(inactCat.id);

    const res = await request({ method: 'GET', path: `/api/homa-categories/${inactCat.slug}` });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.success, false);
  });

  await test('C6: GET /api/homa-services/categories alias endpoint returns active categories', async () => {
    const res = await request({ method: 'GET', path: '/api/homa-services/categories' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(Array.isArray(res.data.data), 'Expected array of categories');
    assert(res.data.data.length >= 7, 'Expected categories from alias endpoint');
  });

  // SECTION D: PUBLIC HOMA SERVICES API & CATEGORY FILTERING
  console.log('\n--- SECTION D: Public Homa Services API & Category Filtering ---');

  await test('D1: GET /api/homa-services?category=shiva-rudra-homa filters services by category', async () => {
    const res = await request({ method: 'GET', path: '/api/homa-services?category=shiva-rudra-homa' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.total >= 2, 'Expected at least 2 Shiva & Rudra homa services');
    for (const service of res.data.data) {
      assert(service.category, 'Service must have category object');
      assert.strictEqual(service.category.slug, 'shiva-rudra-homa');
    }
  });

  await test('D2: GET /api/homa-services?category=non-existent-xyz returns 0 services cleanly', async () => {
    const res = await request({ method: 'GET', path: '/api/homa-services?category=non-existent-category-slug' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.total, 0);
    assert.strictEqual(res.data.data.length, 0);
  });

  await test('D3: GET /api/homa-services without category filter preserves existing catalogue behavior', async () => {
    const res = await request({ method: 'GET', path: '/api/homa-services' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.total >= 8, 'Expected all 8 active canonical services returned');
  });

  await test('D4: GET /api/homa-services preserves search and other filters combined with category', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/homa-services?category=shiva-rudra-homa&search=Mrityunjaya',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.total >= 1, 'Expected Mrityunjaya under shiva-rudra-homa search');
    assert(res.data.data[0].name.includes('Mrityunjaya'));
    assert.strictEqual(res.data.data[0].category.slug, 'shiva-rudra-homa');
  });

  await test('D5: GET /api/homa-services/:slug includes serialized category object in service detail', async () => {
    const res = await request({ method: 'GET', path: '/api/homa-services/maha-mrityunjaya-homa' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.data.category, 'Expected category in detail view');
    assert.strictEqual(res.data.data.category.slug, 'shiva-rudra-homa');
    assert.strictEqual(res.data.data.category.name, 'Shiva & Rudra Homa');
    assert.strictEqual(res.data.data.category.iconName, 'Flame');
  });

  await test('D6: Service without category (categoryId: null) serializes category as null', async () => {
    const uncatSlug = `uncategorized-homa-${Date.now()}`;
    const uncatService = await HomaService.create({
      name: 'Uncategorized Test Homa',
      slug: uncatSlug,
      homaType: 'Special Fire Ritual',
      shortDescription: 'Uncategorized test service',
      description: 'Long description',
      categoryId: null,
      purposeId: null,
      availableHavanCounts: [1, 3],
      availableDays: [1],
      minimumPandits: 2,
      recommendedPandits: 3,
      maximumPandits: 5,
      startingPrice: 5000,
      basePrice: 5000,
      perHavanPrice: 2000,
      perDayPrice: 1500,
      isActive: true,
    });
    cleanupServiceIds.push(uncatService.id);

    const res = await request({ method: 'GET', path: `/api/homa-services/${uncatSlug}` });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.category, null);
  });

  // SECTION E: MODEL RELATIONSHIPS & ASSOCIATIONS
  console.log('\n--- SECTION E: Model Relationships & Associations ---');

  await test('E1: HomaCategory.hasMany(HomaService) retrieves associated services', async () => {
    const shivaCategory = await HomaCategory.findOne({
      where: { slug: 'shiva-rudra-homa' },
      include: [{ model: HomaService, as: 'services' }],
    });
    assert(shivaCategory, 'Shiva category not found');
    assert(Array.isArray(shivaCategory.services), 'Expected services array');
    assert(shivaCategory.services.length >= 2, 'Expected at least 2 services mapped to Shiva category');
  });

  await test('E2: HomaService.belongsTo(HomaCategory) retrieves associated category as categoryDetails', async () => {
    const mrityunjaya = await HomaService.findOne({
      where: { slug: 'maha-mrityunjaya-homa' },
      include: [{ model: HomaCategory, as: 'categoryDetails' }],
    });
    assert(mrityunjaya, 'Maha Mrityunjaya service not found');
    assert(mrityunjaya.categoryDetails, 'Expected categoryDetails association');
    assert.strictEqual(mrityunjaya.categoryDetails.slug, 'shiva-rudra-homa');
  });

  await test('E3: Purpose relationship remains untouched and functional', async () => {
    const mrityunjaya = await HomaService.findOne({
      where: { slug: 'maha-mrityunjaya-homa' },
      include: [{ model: HomaPurpose, as: 'purposeDetails' }],
    });
    assert(mrityunjaya, 'Maha Mrityunjaya service not found');
    assert(mrityunjaya.purposeId, 'purposeId must be preserved');
  });

  // SECTION F: ADMIN CATEGORY API & CRUD
  console.log('\n--- SECTION F: Admin Category API & CRUD ---');

  await test('F1: Admin endpoints reject unauthenticated requests with 401', async () => {
    const resList = await request({ method: 'GET', path: '/api/admin/homa-categories' });
    assert.strictEqual(resList.status, 401);

    const resCreate = await request({
      method: 'POST',
      path: '/api/admin/homa-categories',
      body: { name: 'Unauthorized Homa Category' },
    });
    assert.strictEqual(resCreate.status, 401);
  });

  await test('F2: Admin endpoints reject non-admin users with 403', async () => {
    const resList = await request({
      method: 'GET',
      path: '/api/admin/homa-categories',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.strictEqual(resList.status, 403);
  });

  let createdAdminCatId = null;
  const adminTestSlug = `admin-homa-cat-${Date.now()}`;
  const adminTestName = `Admin Test Homa Category ${Date.now()}`;

  await test('F3: Admin can create a new category (POST /api/admin/homa-categories)', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/homa-categories',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: adminTestName,
        slug: adminTestSlug,
        description: 'Created during automated verification',
        iconName: 'Flame',
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

  await test('F4: Admin create rejects duplicate slug with 409', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/homa-categories',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: `Different Name ${Date.now()}`,
        slug: adminTestSlug,
        displayOrder: 26,
      },
    });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
  });

  await test('F5: Admin create rejects duplicate name with 409', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/homa-categories',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: adminTestName,
        slug: `different-slug-${Date.now()}`,
        displayOrder: 27,
      },
    });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
  });

  await test('F6: Admin can get category by ID (GET /api/admin/homa-categories/:id)', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/admin/homa-categories/${createdAdminCatId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.id, createdAdminCatId);
    assert.strictEqual(res.data.data.name, adminTestName);
  });

  await test('F7: Admin get category by invalid UUID returns 400', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/homa-categories/invalid-uuid-format',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('F8: Admin can update category (PUT /api/admin/homa-categories/:id)', async () => {
    const res = await request({
      method: 'PUT',
      path: `/api/admin/homa-categories/${createdAdminCatId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: `Updated ${adminTestName}`,
        displayOrder: 30,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.name, `Updated ${adminTestName}`);
    assert.strictEqual(res.data.data.displayOrder, 30);
  });

  await test('F9: Admin can soft delete category (DELETE /api/admin/homa-categories/:id)', async () => {
    const res = await request({
      method: 'DELETE',
      path: `/api/admin/homa-categories/${createdAdminCatId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.isActive, false);

    // Verify soft deactivation in DB
    const catInDb = await HomaCategory.findByPk(createdAdminCatId);
    assert.strictEqual(catInDb.isActive, false);

    // Verify it is hidden from public API
    const pubRes = await request({ method: 'GET', path: '/api/homa-categories' });
    const inPub = pubRes.data.data.find((c) => c.id === createdAdminCatId);
    assert(!inPub, 'Soft-deleted category must not appear in public listing');
  });

  await test('F10: Inactive category is visible in admin listing with isActive: false', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/homa-categories',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    const inAdmin = res.data.data.find((c) => c.id === createdAdminCatId);
    assert(inAdmin, 'Deactivated category must be visible in admin list');
    assert.strictEqual(inAdmin.isActive, false);
  });

  await test('F11: Admin can reactivate category', async () => {
    const res = await request({
      method: 'PUT',
      path: `/api/admin/homa-categories/${createdAdminCatId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { isActive: true },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.isActive, true);

    const pubRes = await request({ method: 'GET', path: '/api/homa-categories' });
    const inPub = pubRes.data.data.find((c) => c.id === createdAdminCatId);
    assert(inPub, 'Reactivated category must be visible in public list');
  });

  // SECTION G: ADMIN SERVICE API & CATEGORY INTEGRATION
  console.log('\n--- SECTION G: Admin Service API & Category Integration ---');

  await test('G1: GET /api/admin/homa-services?category=<slug> filters services by category slug', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/homa-services?category=shiva-rudra-homa',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.total >= 2);
    for (const s of res.data.data) {
      assert.strictEqual(s.category.slug, 'shiva-rudra-homa');
    }
  });

  await test('G2: GET /api/admin/homa-services?category=<UUID> filters services by category UUID', async () => {
    const shivaCat = await HomaCategory.findOne({ where: { slug: 'shiva-rudra-homa' } });
    const res = await request({
      method: 'GET',
      path: `/api/admin/homa-services?category=${shivaCat.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.total >= 2);
    for (const s of res.data.data) {
      assert.strictEqual(s.categoryId, shivaCat.id);
    }
  });

  let createdServiceId = null;
  await test('G3: Admin service creation accepts valid categoryId', async () => {
    const ganapatiCat = await HomaCategory.findOne({ where: { slug: 'ganapati-homa' } });
    assert(ganapatiCat, 'Ganapati category not found');

    const testSlug = `test-homa-cat-assign-${Date.now()}`;
    const res = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Test Homa With Category',
        slug: testSlug,
        homaType: 'Special Fire Ritual',
        shortDescription: 'Short description for test',
        description: 'Detailed description for test',
        categoryId: ganapatiCat.id,
        availableHavanCounts: [1, 3],
        availableDays: [1],
        minimumPandits: 2,
        recommendedPandits: 3,
        maximumPandits: 5,
        basePrice: 5100,
        perHavanPrice: 2000,
        perDayPrice: 1500,
      },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.categoryId, ganapatiCat.id);
    assert(res.data.data.category, 'Expected category object in response');
    assert.strictEqual(res.data.data.category.slug, 'ganapati-homa');
    createdServiceId = res.data.data.id;
    cleanupServiceIds.push(createdServiceId);
  });

  await test('G4: Admin service creation rejects non-existent categoryId with 400', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Test Homa Bad Category',
        slug: `test-bad-homa-cat-${Date.now()}`,
        homaType: 'Special Fire Ritual',
        shortDescription: 'Short description',
        description: 'Detailed description',
        categoryId: '00000000-0000-0000-0000-000000000000',
        availableHavanCounts: [1, 3],
        availableDays: [1],
        minimumPandits: 2,
        recommendedPandits: 3,
        maximumPandits: 5,
        basePrice: 5100,
        perHavanPrice: 2000,
        perDayPrice: 1500,
      },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('categoryId'));
  });

  await test('G5: Admin service update can change categoryId', async () => {
    const shivaCat = await HomaCategory.findOne({ where: { slug: 'shiva-rudra-homa' } });
    assert(createdServiceId, 'No test service to update');

    const res = await request({
      method: 'PUT',
      path: `/api/admin/homa-services/${createdServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        categoryId: shivaCat.id,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.categoryId, shivaCat.id);
    assert.strictEqual(res.data.data.basePrice, 5100, 'Base price must remain untouched');
    assert.strictEqual(res.data.data.category.slug, 'shiva-rudra-homa');
  });

  await test('G6: Admin service update allows setting categoryId to null (Uncategorized)', async () => {
    const res = await request({
      method: 'PUT',
      path: `/api/admin/homa-services/${createdServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        categoryId: null,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.categoryId, null);
    assert.strictEqual(res.data.data.category, null);
  });

  // SECTION H: PRICING & BOOKING INTEGRITY VERIFICATION
  console.log('\n--- SECTION H: Pricing & Booking Integrity Verification ---');

  await test('H1: Existing Homa pricing calculation remains identical with category assigned', async () => {
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
    assert.strictEqual(res.data.success, true);
    const data = res.data.data;
    assert.strictEqual(data.serviceType, 'HOMA');
    assert.strictEqual(data.havanCount, 3);
    assert.strictEqual(data.days, 1);
    // Base 11000 + (3-1)*4000 = 19000
    assert.strictEqual(data.totalAmount, 19000);
  });

  await test('H2: Homa booking creation and reference resolution work seamlessly', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'HOMA',
        serviceSlug: 'maha-mrityunjaya-homa',
        configuration: {
          commencementDate: '2026-11-01',
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
          name: 'Test Devotee Homa Cat',
          mobile: '9876543210',
          email: 'devotee@example.com',
          gotra: 'Kashyapa',
        },
        sankalp: {
          purpose: 'Longevity and protection',
          mainIntention: 'Maha Mrityunjaya Sacred Fire Sacraments',
        },
      },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    const booking = res.data.data;
    assert(booking.bookingReference.startsWith('VEDA-HOMA-'));
    cleanupBookingRefs.push(booking.bookingReference);

    // Verify lookup by reference
    const getRes = await request({
      method: 'GET',
      path: `/api/ritual-bookings/${booking.bookingReference}`,
    });
    assert.strictEqual(getRes.status, 200);
    assert.strictEqual(getRes.data.success, true);
    assert.strictEqual(getRes.data.data.service.type, 'HOMA');
    assert.strictEqual(getRes.data.data.service.slug, 'maha-mrityunjaya-homa');
  });

  // Cleanup
  console.log('\n--- Cleaning up temporary test fixtures ---');
  for (const bRef of cleanupBookingRefs) {
    try {
      await RitualBooking.destroy({ where: { bookingReference: bRef } });
    } catch {}
  }
  for (const sId of cleanupServiceIds) {
    try {
      await HomaService.destroy({ where: { id: sId } });
    } catch {}
  }
  for (const cId of cleanupCategoryIds) {
    try {
      await HomaCategory.destroy({ where: { id: cId } });
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
    await runHomaCategoryVerification();
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('Fatal test error:', err);
    server.close(() => process.exit(1));
  }
});
