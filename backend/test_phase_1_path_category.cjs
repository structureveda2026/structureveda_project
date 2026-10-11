require('dotenv').config({ path: __dirname + '/.env' });
const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');

// Load database & models
const db = require('./src/models/index.js').default;
const {
  User,
  PathCategory,
  PathService,
  PathPurpose,
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

async function runPathCategoryVerification() {
  console.log('================================================================');
  console.log('PHASE 1: PATH CATEGORY BACKEND ARCHITECTURE TEST SUITE');
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
      fullName: 'Path Category Test Admin',
      email: `path_cat_admin_${Date.now()}@example.com`,
      password: 'hashed_password_123',
      role: 'admin',
      isActive: true,
    });
  }

  let regularUser = await User.findOne({ where: { role: 'user', isActive: true } });
  if (!regularUser) {
    regularUser = await User.create({
      fullName: 'Path Category Regular User',
      email: `path_cat_user_${Date.now()}@example.com`,
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

  await test('A1: Table path_categories exists with all required columns', async () => {
    const [cols] = await db.sequelize.query(
      "SELECT column_name, is_nullable, data_type FROM information_schema.columns WHERE table_name = 'path_categories';"
    );
    assert(cols.length > 0, 'Table path_categories does not exist');
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

  await test('A2: Unique indexes on path_categories (name, slug) and indexes on display_order, is_active exist', async () => {
    const [indexes] = await db.sequelize.query(
      "SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'path_categories';"
    );
    const indexNames = indexes.map((i) => i.indexname);
    assert(indexNames.includes('path_categories_name_unique') || indexNames.includes('path_categories_name_key'), 'Missing name unique index');
    assert(indexNames.includes('path_categories_slug_unique') || indexNames.includes('path_categories_slug_key'), 'Missing slug unique index');
    assert(indexNames.includes('path_categories_display_order_idx'), 'Missing display_order index');
    assert(indexNames.includes('path_categories_is_active_idx'), 'Missing is_active index');
  });

  await test('A3: Column category_id exists in path_services table with foreign key and index', async () => {
    const [cols] = await db.sequelize.query(
      "SELECT column_name, is_nullable, data_type FROM information_schema.columns WHERE table_name = 'path_services' AND column_name = 'category_id';"
    );
    assert.strictEqual(cols.length, 1, 'category_id column missing on path_services');
    assert.strictEqual(cols[0].is_nullable, 'YES', 'category_id must be nullable for safety');

    const [fks] = await db.sequelize.query(`
      SELECT tc.constraint_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'path_services' AND kcu.column_name = 'category_id';
    `);
    assert(fks.length > 0, 'Foreign key constraint missing for category_id');
    assert.strictEqual(fks[0].foreign_table_name, 'path_categories');
    assert.strictEqual(fks[0].foreign_column_name, 'id');

    const [indexes] = await db.sequelize.query(
      "SELECT indexname FROM pg_indexes WHERE tablename = 'path_services' AND indexname = 'path_services_category_id_idx';"
    );
    assert(indexes.length > 0, 'Index path_services_category_id_idx is missing');
  });

  // SECTION B: CANONICAL CATEGORIES & SERVICE MAPPINGS
  console.log('\n--- SECTION B: Canonical Categories & Service Mappings Integrity ---');

  await test('B1: Exactly 7 canonical Path categories exist in database', async () => {
    const count = await PathCategory.count();
    assert.strictEqual(count, 7, `Expected 7 categories, got ${count}`);
  });

  await test('B2: All 7 canonical categories have unique IDs and unique slugs', async () => {
    const categories = await PathCategory.findAll();
    const ids = new Set(categories.map((c) => c.id));
    const slugs = new Set(categories.map((c) => c.slug));
    assert.strictEqual(ids.size, 7, 'Category IDs are not unique');
    assert.strictEqual(slugs.size, 7, 'Category slugs are not unique');
  });

  await test('B3: Canonical categories have sequential display_order 1 to 7 and are all active', async () => {
    const categories = await PathCategory.findAll({ order: [['displayOrder', 'ASC']] });
    assert.strictEqual(categories.length, 7);
    categories.forEach((c, idx) => {
      assert.strictEqual(c.displayOrder, idx + 1, `Category ${c.slug} expected order ${idx + 1}, got ${c.displayOrder}`);
      assert.strictEqual(c.isActive, true, `Category ${c.slug} must be active`);
    });
  });

  await test('B4: All 8 canonical Path services have category_id populated (0 unmapped services)', async () => {
    const services = await PathService.findAll();
    assert.strictEqual(services.length, 8, `Expected 8 services, found ${services.length}`);
    for (const s of services) {
      assert(s.categoryId != null, `Service '${s.slug}' categoryId is null`);
    }
  });

  await test('B5: Exact 1-to-1 deterministic service-to-category mapping matches Phase 0 specifications', async () => {
    const EXPECTED_MAPPINGS = {
      'sundarkand-path': 'ramayana-manas-path',
      'ramcharitmanas-navah-parayan': 'ramayana-manas-path',
      'shiva-mahimna-rudri-path': 'shiva-rudri-path',
      'durga-saptashati-path': 'durga-shakta-path',
      'shrimad-bhagavad-gita-recitation': 'bhagavad-gita-scripture',
      'vishnu-sahasranama-purusha-suktam-path': 'vishnu-suktam-path',
      'shri-suktam-kanakadhara-stotra-path': 'lakshmi-stotra-path',
      'aditya-hridaya-stotra-surya-path': 'surya-solar-path',
    };

    const categories = await PathCategory.findAll();
    const catMap = new Map(categories.map((c) => [c.id, c.slug]));

    const services = await PathService.findAll();
    for (const service of services) {
      const expectedCatSlug = EXPECTED_MAPPINGS[service.slug];
      assert(expectedCatSlug, `Unexpected service slug: ${service.slug}`);
      const actualCatSlug = catMap.get(service.categoryId);
      assert.strictEqual(
        actualCatSlug,
        expectedCatSlug,
        `Service ${service.slug} mapped to ${actualCatSlug}, expected ${expectedCatSlug}`
      );
    }
  });

  await test('B6: No orphan category_id references exist on path_services table', async () => {
    const [orphans] = await db.sequelize.query(`
      SELECT ps.id, ps.slug, ps.category_id
      FROM path_services ps
      LEFT JOIN path_categories pc ON ps.category_id = pc.id
      WHERE ps.category_id IS NOT NULL AND pc.id IS NULL;
    `);
    assert.strictEqual(orphans.length, 0, 'Found orphan category_id references');
  });

  // SECTION C: PUBLIC CATEGORY APIS
  console.log('\n--- SECTION C: Public Category API Endpoints ---');

  await test('C1: GET /api/path-categories returns 200 with all 7 active categories', async () => {
    const res = await request({ method: 'GET', path: '/api/path-categories' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.count, 7);
    assert(Array.isArray(res.data.data), 'data must be an array');
    assert.strictEqual(res.data.data.length, 7);

    const first = res.data.data[0];
    assert(first.id, 'Missing id');
    assert(first.name, 'Missing name');
    assert(first.slug, 'Missing slug');
    assert(first.iconName, 'Missing iconName');
    assert(typeof first.displayOrder === 'number', 'displayOrder must be a number');
    assert.strictEqual(first.isActive, true);
  });

  await test('C2: GET /api/path-services/categories returns 200 with categories list (alias endpoint)', async () => {
    const res = await request({ method: 'GET', path: '/api/path-services/categories' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.count, 7);
  });

  await test('C3: GET /api/path-categories/:slug returns 200 with matching category', async () => {
    const res = await request({ method: 'GET', path: '/api/path-categories/ramayana-manas-path' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.slug, 'ramayana-manas-path');
    assert.strictEqual(res.data.data.name, 'Ramayana & Manas Parayan');
    assert.strictEqual(res.data.data.iconName, 'BookOpen');
    assert.strictEqual(res.data.data.displayOrder, 1);
  });

  await test('C4: GET /api/path-categories/:slug with unknown slug returns 404', async () => {
    const res = await request({ method: 'GET', path: '/api/path-categories/non-existent-category-slug-xyz' });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.toLowerCase().includes('not found'));
  });

  await test('C5: Inactive category is omitted from GET /api/path-categories and returns 404 on slug lookup', async () => {
    // Create an inactive test category
    const inactiveCat = await PathCategory.create({
      name: 'Temp Inactive Path Category',
      slug: 'temp-inactive-path-cat',
      description: 'Test inactive category',
      iconName: 'BookOpen',
      displayOrder: 99,
      isActive: false,
    });
    cleanupCategoryIds.push(inactiveCat.id);

    // Verify omitted from public list
    const listRes = await request({ method: 'GET', path: '/api/path-categories' });
    assert.strictEqual(listRes.status, 200);
    const slugs = listRes.data.data.map((c) => c.slug);
    assert(!slugs.includes('temp-inactive-path-cat'), 'Inactive category must not be in public list');

    // Verify 404 on slug lookup
    const slugRes = await request({ method: 'GET', path: '/api/path-categories/temp-inactive-path-cat' });
    assert.strictEqual(slugRes.status, 404);
  });

  // SECTION D: ADMIN CATEGORY MANAGEMENT APIS
  console.log('\n--- SECTION D: Admin Category Management API Endpoints ---');

  await test('D1: Unauthorized user receives 401 when accessing admin category routes', async () => {
    const res = await request({ method: 'GET', path: '/api/admin/path-categories' });
    assert.strictEqual(res.status, 401);
  });

  await test('D2: Non-admin user receives 403 when accessing admin category routes', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-categories',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.strictEqual(res.status, 403);
  });

  await test('D3: GET /api/admin/path-categories with admin token returns 200 and all categories', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-categories',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.count >= 7);
  });

  await test('D4: GET /api/admin/path-categories/:id with admin token returns category detail', async () => {
    const cat = await PathCategory.findOne({ where: { slug: 'shiva-rudri-path' } });
    const res = await request({
      method: 'GET',
      path: `/api/admin/path-categories/${cat.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.id, cat.id);
    assert.strictEqual(res.data.data.slug, 'shiva-rudri-path');
  });

  await test('D5: POST /api/admin/path-categories creates new category', async () => {
    const testCatPayload = {
      name: 'Vedic Sukta & Shanti Path',
      slug: 'vedic-sukta-shanti-path',
      description: 'Test category for admin creation',
      iconName: 'Scroll',
      displayOrder: 8,
      isActive: true,
    };
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-categories',
      body: testCatPayload,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert(res.data.data.id != null);
    cleanupCategoryIds.push(res.data.data.id);
    assert.strictEqual(res.data.data.name, testCatPayload.name);
    assert.strictEqual(res.data.data.slug, testCatPayload.slug);
    assert.strictEqual(res.data.data.iconName, testCatPayload.iconName);
    assert.strictEqual(res.data.data.displayOrder, 8);
  });

  await test('D6: POST /api/admin/path-categories with duplicate name rejects with 409', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-categories',
      body: {
        name: 'Ramayana & Manas Parayan',
        slug: 'ramayana-unique-slug-test',
      },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
  });

  await test('D7: POST /api/admin/path-categories with duplicate slug rejects with 409', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-categories',
      body: {
        name: 'Different Name Here',
        slug: 'ramayana-manas-path',
      },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
  });

  await test('D8: PUT /api/admin/path-categories/:id updates existing category', async () => {
    const cat = await PathCategory.create({
      name: 'Editable Path Category',
      slug: 'editable-path-cat',
      description: 'Original description',
      iconName: 'BookOpen',
      displayOrder: 15,
      isActive: true,
    });
    cleanupCategoryIds.push(cat.id);

    const res = await request({
      method: 'PUT',
      path: `/api/admin/path-categories/${cat.id}`,
      body: {
        description: 'Updated test description',
        iconName: 'Flame',
        displayOrder: 16,
      },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.description, 'Updated test description');
    assert.strictEqual(res.data.data.iconName, 'Flame');
    assert.strictEqual(res.data.data.displayOrder, 16);
  });

  await test('D9: DELETE /api/admin/path-categories/:id performs soft deactivation (isActive: false)', async () => {
    const cat = await PathCategory.create({
      name: 'Deactivatable Path Category',
      slug: 'deactivatable-path-cat',
      description: 'To be deactivated',
      iconName: 'BookOpen',
      displayOrder: 20,
      isActive: true,
    });
    cleanupCategoryIds.push(cat.id);

    const res = await request({
      method: 'DELETE',
      path: `/api/admin/path-categories/${cat.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.isActive, false);

    const reloaded = await PathCategory.findByPk(cat.id);
    assert(reloaded != null, 'Category must NOT be physically deleted from database');
    assert.strictEqual(reloaded.isActive, false, 'Category must be marked isActive: false');
  });

  await test('D10: PUT /api/admin/path-categories/:id reactivates category (isActive: true)', async () => {
    const cat = await PathCategory.create({
      name: 'Reactivatable Path Category',
      slug: 'reactivatable-path-cat',
      description: 'To be reactivated',
      iconName: 'BookOpen',
      displayOrder: 21,
      isActive: false,
    });
    cleanupCategoryIds.push(cat.id);

    const res = await request({
      method: 'PUT',
      path: `/api/admin/path-categories/${cat.id}`,
      body: { isActive: true },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.isActive, true);

    const reloaded = await PathCategory.findByPk(cat.id);
    assert.strictEqual(reloaded.isActive, true);
  });

  // SECTION E: SERVICE INTEGRATION & DUAL HIERARCHY
  console.log('\n--- SECTION E: Service Integration & Dual Hierarchy (Category & Purpose) ---');

  await test('E1: GET /api/path-services includes categoryDetails & categoryId on each service', async () => {
    const res = await request({ method: 'GET', path: '/api/path-services' });
    assert.strictEqual(res.status, 200);
    const services = res.data.data;
    assert(services.length > 0);
    for (const s of services) {
      assert(s.categoryId != null, `Service '${s.slug}' categoryId is missing`);
      assert(s.category != null, `Service '${s.slug}' category object is missing`);
      assert(s.category.name != null);
      assert(s.category.slug != null);
      assert(s.category.iconName != null);
    }
  });

  await test('E2: GET /api/path-services?category=ramayana-manas-path filters exactly to Ramayana services (2 services)', async () => {
    const res = await request({ method: 'GET', path: '/api/path-services?category=ramayana-manas-path' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.count, 2);
    const slugs = res.data.data.map((s) => s.slug).sort();
    assert.deepStrictEqual(slugs, ['ramcharitmanas-navah-parayan', 'sundarkand-path']);
  });

  await test('E3: GET /api/path-services?category=durga-shakta-path filters exactly to Durga Saptashati (1 service)', async () => {
    const res = await request({ method: 'GET', path: '/api/path-services?category=durga-shakta-path' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.count, 1);
    assert.strictEqual(res.data.data[0].slug, 'durga-saptashati-path');
  });

  await test('E4: GET /api/path-services?category=non-existent-category returns 0 services cleanly', async () => {
    const res = await request({ method: 'GET', path: '/api/path-services?category=non-existent-category' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.count, 0);
    assert.strictEqual(res.data.data.length, 0);
  });

  await test('E5: Dual Hierarchy: category and purpose work conjunctively when both are supplied', async () => {
    // 1. Query with category=ramayana-manas-path and purpose=devotional-practice -> exactly 1 service (sundarkand-path)
    const res1 = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&purpose=devotional-practice',
    });
    assert.strictEqual(res1.status, 200);
    assert.strictEqual(res1.data.count, 1);
    assert.strictEqual(res1.data.data[0].slug, 'sundarkand-path');

    // 2. Query with category=ramayana-manas-path and purpose=spiritual-anushthan -> exactly 1 service (ramcharitmanas-navah-parayan)
    const res2 = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&purpose=spiritual-anushthan',
    });
    assert.strictEqual(res2.status, 200);
    assert.strictEqual(res2.data.count, 1);
    assert.strictEqual(res2.data.data[0].slug, 'ramcharitmanas-navah-parayan');

    // 3. Query with category=ramayana-manas-path and purpose=family-sankalpa -> both services match because both include family-sankalpa
    const res3 = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&purpose=family-sankalpa',
    });
    assert.strictEqual(res3.status, 200);
    assert.strictEqual(res3.data.count, 2);

    // 4. Query with category=ramayana-manas-path and non-matching purpose -> 0 services
    const res4 = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&purpose=special-requirement',
    });
    assert.strictEqual(res4.status, 200);
    assert.strictEqual(res4.data.count, 0);
  });

  // SECTION F: ADMIN SERVICE INTEGRATION
  console.log('\n--- SECTION F: Admin Service Integration (CRUD with categoryId) ---');

  await test('F1: GET /api/admin/path-services exposes categoryId, categoryName, categorySlug', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const services = res.data.data;
    assert(services.length >= 8);
    const sundar = services.find((s) => s.slug === 'sundarkand-path');
    assert(sundar != null);
    assert(sundar.categoryId != null);
    assert.strictEqual(sundar.categoryName, 'Ramayana & Manas Parayan');
    assert.strictEqual(sundar.categorySlug, 'ramayana-manas-path');
  });

  await test('F2: GET /api/admin/path-services?category=shiva-rudri-path filters admin services by category', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services?category=shiva-rudri-path',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.count, 1);
    assert.strictEqual(res.data.data[0].slug, 'shiva-mahimna-rudri-path');
  });

  await test('F3: POST /api/admin/path-services with valid categoryId successfully assigns category', async () => {
    const cat = await PathCategory.findOne({ where: { slug: 'bhagavad-gita-scripture' } });
    const purpose = await PathPurpose.findOne({ where: { isActive: true } });

    const newServicePayload = {
      name: 'Test Bhagavad Gita Adhyaya Path',
      slug: `test-gita-path-${Date.now()}`,
      pathType: 'Vedic Philosophical Scripture',
      scripture: 'Shrimad Bhagavad Gita',
      shortDescription: 'Test service short description',
      description: 'Test service full description',
      purposeId: purpose.id,
      categoryId: cat.id,
      availableFormats: ['single_session'],
      availableDurations: ['2 Hours'],
      minimumDays: 1,
      recommendedDays: 1,
      maximumDays: 1,
      minimumPandits: 2,
      recommendedPandits: 2,
      maximumPandits: 4,
      dailyHours: '2 Hours Daily',
      startingPrice: 4200,
      isFeatured: false,
      isActive: true,
    };

    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      body: newServicePayload,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.categoryId, cat.id);
    assert(res.data.data.categoryDetails != null);
    assert.strictEqual(res.data.data.categoryDetails.slug, 'bhagavad-gita-scripture');
    cleanupServiceIds.push(res.data.data.id);
  });

  await test('F4: POST /api/admin/path-services with invalid/non-existent categoryId rejects with 404', async () => {
    const purpose = await PathPurpose.findOne({ where: { isActive: true } });
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      body: {
        name: 'Invalid Cat Service',
        slug: `invalid-cat-${Date.now()}`,
        pathType: 'Vedic Path',
        scripture: 'Vedic Scripture',
        purposeId: purpose.id,
        categoryId: '00000000-0000-0000-0000-000000000099',
        availableFormats: ['single_session'],
        minimumDays: 1,
        maximumDays: 1,
        minimumPandits: 2,
        maximumPandits: 4,
        dailyHours: '2 Hours Daily',
        startingPrice: 3000,
      },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.success, false);
  });

  await test('F5: PUT /api/admin/path-services/:id updates categoryId', async () => {
    // Create temporary service
    const purpose = await PathPurpose.findOne({ where: { isActive: true } });
    const catA = await PathCategory.findOne({ where: { slug: 'surya-solar-path' } });
    const catB = await PathCategory.findOne({ where: { slug: 'vishnu-suktam-path' } });

    const tempService = await PathService.create({
      name: 'Temp Switchable Path Service',
      slug: `temp-switch-${Date.now()}`,
      pathType: 'Vedic Path',
      scripture: 'Vedic Scripture',
      purposeId: purpose.id,
      categoryId: catA.id,
      availableFormats: ['single_session'],
      availableDurations: ['2 Hours'],
      minimumDays: 1,
      recommendedDays: 1,
      maximumDays: 1,
      minimumPandits: 2,
      recommendedPandits: 2,
      maximumPandits: 4,
      dailyHours: '2 Hours Daily',
      startingPrice: 3500,
      isActive: true,
    });
    cleanupServiceIds.push(tempService.id);

    // Update categoryId to catB
    const res = await request({
      method: 'PUT',
      path: `/api/admin/path-services/${tempService.id}`,
      body: { categoryId: catB.id },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.categoryId, catB.id);
    assert.strictEqual(res.data.data.categoryDetails.slug, 'vishnu-suktam-path');
  });

  // SECTION G: REGRESSION VERIFICATION OF EXISTING PATH CAPABILITIES
  console.log('\n--- SECTION G: Regression Safety on Path Service Detail, Pricing & Booking ---');

  await test('G1: GET /api/path-services/:slug returns full recitation details with categoryDetails & purposeDetails', async () => {
    const res = await request({ method: 'GET', path: '/api/path-services/sundarkand-path' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.slug, 'sundarkand-path');
    assert.strictEqual(res.data.data.name, 'Sundarkand Path');
    assert.strictEqual(res.data.data.categoryDetails.slug, 'ramayana-manas-path');
    assert.strictEqual(res.data.data.purposeDetails.slug, 'devotional-practice');
    assert.strictEqual(res.data.data.pathType, 'Ramcharitmanas Adhyaya');
    assert(res.data.data.startingPrice === 5100);
  });

  await test('G2: GET /api/path-services/purposes continues returning 200 and all 6 active purposes', async () => {
    const res = await request({ method: 'GET', path: '/api/path-services/purposes' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.count, 6);
  });

  await test('G3: Authoritative pricing calculation via POST /api/ritual-bookings/calculate-price returns 200 with PATH_CANONICAL_PRICING', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'PATH',
        serviceSlug: 'sundarkand-path',
        format: 'single_session',
        days: 1,
        panditCount: 3,
        commencementDate: '2026-11-15',
        arrangementMode: 'kashi',
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.serviceType, 'PATH');
    assert.strictEqual(res.data.data.pricingSource, 'PATH_CANONICAL_PRICING');
    assert.strictEqual(res.data.data.totalAmount, 5100);
    assert.strictEqual(res.data.data.basePrice, 5100);
  });

  await test('G4: Ritual booking creation via POST /api/ritual-bookings creates VEDA-PATH- booking record with untouched structure', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'PATH',
        serviceSlug: 'sundarkand-path',
        configuration: {
          commencementDate: '2026-11-20',
          timeSlot: '06:30 AM',
          format: 'single_session',
          durationSelected: '3 to 4 Hours',
          days: 1,
          panditCount: 2,
          arrangementMode: 'kashi',
        },
        location: { locationType: 'kashi' },
        yajman: {
          name: 'Path Category Test Devotee',
          mobile: '9876543210',
          email: 'path_test_devotee@example.com',
        },
        sankalp: {
          purpose: 'Peace and auspiciousness',
          gotra: 'Kashyapa',
        },
        familyMembers: [{ name: 'Test Family Member' }],
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    const booking = res.data.booking || res.data.data;
    assert(booking.bookingReference.startsWith('VEDA-PATH-'));
    assert.strictEqual(booking.serviceType, 'PATH');
    cleanupBookingRefs.push(booking.bookingReference);
  });

  // TEARDOWN & CLEANUP
  console.log('\n--- CLEANUP & TEARDOWN ---');
  for (const ref of cleanupBookingRefs) {
    await RitualBooking.destroy({ where: { bookingReference: ref } }).catch(() => {});
  }
  for (const id of cleanupServiceIds) {
    await PathService.destroy({ where: { id } }).catch(() => {});
  }
  for (const id of cleanupCategoryIds) {
    await PathCategory.destroy({ where: { id } }).catch(() => {});
  }
  console.log(`Cleaned up test fixtures successfully.`);

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

// Start HTTP server for tests
server = http.createServer(app);
server.listen(0, '127.0.0.1', async () => {
  const address = server.address();
  port = address.port;
  baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Test server running at ${baseUrl}`);

  try {
    await runPathCategoryVerification();
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('Fatal test error:', err);
    server.close(() => process.exit(1));
  }
});
