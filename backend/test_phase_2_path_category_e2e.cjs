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

async function runPathCategoryE2EHardening() {
  console.log('================================================================');
  console.log('PHASE 2: PATH CATEGORY BACKEND END-TO-END HARDENING & VERIFICATION');
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
      fullName: 'Path E2E Test Admin',
      email: `path_e2e_admin_${Date.now()}@example.com`,
      password: 'hashed_password_123',
      role: 'admin',
      isActive: true,
    });
  }

  let regularUser = await User.findOne({ where: { role: 'user', isActive: true } });
  if (!regularUser) {
    regularUser = await User.create({
      fullName: 'Path E2E Regular User',
      email: `path_e2e_user_${Date.now()}@example.com`,
      password: 'hashed_password_123',
      role: 'user',
      isActive: true,
    });
  }

  const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
  const adminToken = jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: 'admin' },
    jwtSecret,
    { expiresIn: '2h' }
  );
  const userToken = jwt.sign(
    { id: regularUser.id, email: regularUser.email, role: 'user' },
    jwtSecret,
    { expiresIn: '2h' }
  );

  // Pre-test cleanup of any previous leftover test records
  const { Op } = require('sequelize');
  await PathService.destroy({ where: { slug: { [Op.like]: 'test-%' } } }).catch(() => {});
  await PathCategory.destroy({ where: { slug: { [Op.like]: 'test-%' } } }).catch(() => {});

  const CANONICAL_CATEGORIES = [
    { slug: 'ramayana-manas-path', name: 'Ramayana & Manas Parayan', order: 1, icon: 'BookOpen' },
    { slug: 'shiva-rudri-path', name: 'Shiva & Rudri Path', order: 2, icon: 'Flame' },
    { slug: 'durga-shakta-path', name: 'Durga & Shakta Scriptures', order: 3, icon: 'ShieldCheck' },
    { slug: 'bhagavad-gita-scripture', name: 'Bhagavad Gita & Vedanta', order: 4, icon: 'Scroll' },
    { slug: 'vishnu-suktam-path', name: 'Vishnu & Vedic Suktams', order: 5, icon: 'Sparkles' },
    { slug: 'lakshmi-stotra-path', name: 'Lakshmi & Kanakadhara Recitations', order: 6, icon: 'Coins' },
    { slug: 'surya-solar-path', name: 'Surya & Solar Vedic Hymns', order: 7, icon: 'Sun' },
  ];

  const CANONICAL_MAPPINGS = {
    'sundarkand-path': 'ramayana-manas-path',
    'ramcharitmanas-navah-parayan': 'ramayana-manas-path',
    'shiva-mahimna-rudri-path': 'shiva-rudri-path',
    'durga-saptashati-path': 'durga-shakta-path',
    'shrimad-bhagavad-gita-recitation': 'bhagavad-gita-scripture',
    'vishnu-sahasranama-purusha-suktam-path': 'vishnu-suktam-path',
    'shri-suktam-kanakadhara-stotra-path': 'lakshmi-stotra-path',
    'aditya-hridaya-stotra-surya-path': 'surya-solar-path',
  };

  // =========================================================================
  // SECTION 1: DATABASE INTEGRITY, CONSTRAINTS & INDEXES
  // =========================================================================
  console.log('--- SECTION 1: Database Integrity, Constraints & Indexes ---');

  await test('1.1: Table path_categories exists with all required column definitions', async () => {
    const [cols] = await db.sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'path_categories';
    `);
    const colMap = {};
    cols.forEach((c) => {
      colMap[c.column_name] = c;
    });

    const expectedCols = [
      'id', 'name', 'slug', 'description', 'icon_name',
      'image', 'display_order', 'is_active', 'created_at', 'updated_at'
    ];
    for (const ec of expectedCols) {
      assert(colMap[ec], `Column ${ec} must exist in path_categories`);
    }
  });

  await test('1.2: Indexes on path_categories (unique slug, unique name, display_order, is_active) exist', async () => {
    const [indexes] = await db.sequelize.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'path_categories';
    `);
    const defs = indexes.map((i) => i.indexdef);
    assert(defs.some((d) => d.includes('UNIQUE') && d.includes('slug')), 'Unique index on slug missing');
    assert(defs.some((d) => d.includes('UNIQUE') && d.includes('name')), 'Unique index on name missing');
    assert(defs.some((d) => d.includes('display_order')), 'Index on display_order missing');
    assert(defs.some((d) => d.includes('is_active')), 'Index on is_active missing');
  });

  await test('1.3: Column category_id in path_services is nullable with foreign key and index', async () => {
    const [cols] = await db.sequelize.query(`
      SELECT column_name, is_nullable, data_type
      FROM information_schema.columns
      WHERE table_name = 'path_services' AND column_name = 'category_id';
    `);
    assert.strictEqual(cols.length, 1);
    assert.strictEqual(cols[0].is_nullable, 'YES');

    const [fks] = await db.sequelize.query(`
      SELECT tc.constraint_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'path_services' AND kcu.column_name = 'category_id';
    `);
    assert(fks.length >= 1, 'Foreign key on path_services.category_id missing');
    assert.strictEqual(fks[0].foreign_table_name, 'path_categories');
    assert.strictEqual(fks[0].foreign_column_name, 'id');

    const [indexes] = await db.sequelize.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'path_services' AND indexdef LIKE '%category_id%';
    `);
    assert(indexes.length >= 1, 'Index on path_services.category_id missing');
  });

  // =========================================================================
  // SECTION 2: CANONICAL CATEGORIES, SERVICE MAPPINGS & SEED IDEMPOTENCY
  // =========================================================================
  console.log('\n--- SECTION 2: Canonical Categories, Service Mappings & Seed Idempotency ---');

  await test('2.1: Exactly 7 canonical categories exist in database', async () => {
    const cats = await PathCategory.findAll({
      where: { slug: CANONICAL_CATEGORIES.map((c) => c.slug) },
    });
    assert.strictEqual(cats.length, 7);
  });

  await test('2.2: All canonical categories have unique IDs, unique slugs, and sequential order 1..7', async () => {
    const cats = await PathCategory.findAll({ order: [['displayOrder', 'ASC']] });
    const idSet = new Set(cats.map((c) => c.id));
    const slugSet = new Set(cats.map((c) => c.slug));
    assert.strictEqual(idSet.size, cats.length, 'Category IDs must be unique');
    assert.strictEqual(slugSet.size, cats.length, 'Category slugs must be unique');

    for (let i = 0; i < CANONICAL_CATEGORIES.length; i++) {
      const exp = CANONICAL_CATEGORIES[i];
      const actual = cats.find((c) => c.slug === exp.slug);
      assert(actual, `Category ${exp.slug} not found`);
      assert.strictEqual(actual.isActive, true);
      assert.strictEqual(actual.displayOrder, exp.order);
      assert.strictEqual(actual.iconName, exp.icon);
      assert.strictEqual(actual.name, exp.name);
    }
  });

  await test('2.3: All 8 canonical Path services are mapped to their approved categories', async () => {
    for (const [svcSlug, catSlug] of Object.entries(CANONICAL_MAPPINGS)) {
      const svc = await PathService.findOne({
        where: { slug: svcSlug },
        include: [{ model: PathCategory, as: 'categoryDetails' }],
      });
      assert(svc, `Canonical service ${svcSlug} not found`);
      assert(svc.categoryId, `Service ${svcSlug} must have categoryId`);
      assert(svc.categoryDetails, `Service ${svcSlug} categoryDetails not found`);
      assert.strictEqual(svc.categoryDetails.slug, catSlug);
    }
  });

  await test('2.4: No orphan category IDs exist on path_services table', async () => {
    const [orphans] = await db.sequelize.query(`
      SELECT s.id, s.name, s.slug, s.category_id 
      FROM path_services s 
      LEFT JOIN path_categories c ON s.category_id = c.id 
      WHERE s.category_id IS NOT NULL AND c.id IS NULL;
    `);
    assert.strictEqual(orphans.length, 0, 'Found orphan category_id in path_services');
  });

  await test('2.5: Seed script idempotency: re-running does not duplicate, alter prices or alter purposes', async () => {
    // Snapshot existing services and pricing
    const beforeServices = await PathService.findAll({ order: [['slug', 'ASC']] });
    const snapshot = beforeServices.map((s) => ({
      slug: s.slug,
      startingPrice: s.startingPrice,
      purposeId: s.purposeId,
      purposeCategory: s.purposeCategory,
      purposeCategories: s.purposeCategories,
      categoryId: s.categoryId,
    }));

    // Execute seed module
    const { execSync } = require('child_process');
    execSync('node src/scripts/seedPathCategories.js', { cwd: __dirname, stdio: 'pipe' });

    // Verify after seeding
    const afterCats = await PathCategory.findAll();
    assert.strictEqual(afterCats.length, 7, 'Category count must remain exactly 7');

    const afterServices = await PathService.findAll({ order: [['slug', 'ASC']] });
    assert.strictEqual(afterServices.length, beforeServices.length, 'Service count must not change');

    for (let i = 0; i < afterServices.length; i++) {
      const b = snapshot[i];
      const a = afterServices[i];
      assert.strictEqual(a.slug, b.slug);
      assert.strictEqual(a.startingPrice, b.startingPrice, `Price mutated for ${a.slug}`);
      assert.strictEqual(a.purposeId, b.purposeId, `purposeId mutated for ${a.slug}`);
      assert.strictEqual(a.purposeCategory, b.purposeCategory, `purposeCategory mutated for ${a.slug}`);
      assert.deepStrictEqual(a.purposeCategories, b.purposeCategories, `purposeCategories mutated for ${a.slug}`);
      assert.strictEqual(a.categoryId, b.categoryId, `categoryId mutated for ${a.slug}`);
    }
  });

  // =========================================================================
  // SECTION 3: PUBLIC CATEGORY ENDPOINTS VERIFICATION
  // =========================================================================
  console.log('\n--- SECTION 3: Public Category Endpoints Verification ---');

  await test('3.1: GET /api/path-categories returns active categories only, deterministically sorted', async () => {
    const res = await request({ method: 'GET', path: '/api/path-categories' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.length, 7);

    for (let i = 0; i < res.data.data.length; i++) {
      const cat = res.data.data[i];
      assert.strictEqual(cat.isActive, true);
      assert.strictEqual(cat.displayOrder, i + 1);
      assert(cat.id && cat.name && cat.slug && cat.iconName);
    }
  });

  await test('3.2: GET /api/path-services/categories alias endpoint returns active categories', async () => {
    const res = await request({ method: 'GET', path: '/api/path-services/categories' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.length, 7);
  });

  await test('3.3: GET /api/path-categories/:slug returns serialized category contract', async () => {
    const res = await request({ method: 'GET', path: '/api/path-categories/ramayana-manas-path' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    const cat = res.data.data;
    assert.strictEqual(cat.slug, 'ramayana-manas-path');
    assert.strictEqual(cat.name, 'Ramayana & Manas Parayan');
    assert.strictEqual(cat.iconName, 'BookOpen');
    assert.strictEqual(cat.displayOrder, 1);
    assert.strictEqual(cat.isActive, true);
    assert('image' in cat);
  });

  await test('3.4: GET /api/path-categories/:slug returns 404 for unknown slug', async () => {
    const res = await request({ method: 'GET', path: '/api/path-categories/unknown-category-xyz' });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.success, false);
  });

  // =========================================================================
  // SECTION 4: CATEGORY FILTERING ACROSS ALL 7 CANONICAL CATEGORIES
  // =========================================================================
  console.log('\n--- SECTION 4: Category Filtering Across All 7 Canonical Categories ---');

  for (const cat of CANONICAL_CATEGORIES) {
    await test(`4.1: Filter by category slug '${cat.slug}' returns only services in that category`, async () => {
      const res = await request({ method: 'GET', path: `/api/path-services?category=${cat.slug}` });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      if (cat.slug === 'ramayana-manas-path') {
        assert.strictEqual(res.data.total, 2, 'Ramayana category must return exactly 2 services');
      } else {
        assert.strictEqual(res.data.total, 1, `Category ${cat.slug} must return exactly 1 service`);
      }
      for (const svc of res.data.data) {
        assert.strictEqual(svc.category.slug, cat.slug);
      }
    });
  }

  await test('4.2: Category filter with non-existent slug returns 0 services cleanly', async () => {
    const res = await request({ method: 'GET', path: '/api/path-services?category=non-existent-path-cat' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.total, 0);
    assert.strictEqual(res.data.data.length, 0);
  });

  // =========================================================================
  // SECTION 5: CATEGORY & PURPOSE INDEPENDENCE + QUERY COMBINATIONS
  // =========================================================================
  console.log('\n--- SECTION 5: Category & Purpose Independence + Query Combinations ---');

  await test('5.1: Category and Purpose work conjunctively when both match', async () => {
    // Both Ramayana recitations have 'family-sankalpa'
    const resBoth = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&purpose=family-sankalpa',
    });
    assert.strictEqual(resBoth.status, 200);
    assert.strictEqual(resBoth.data.success, true);
    assert.strictEqual(resBoth.data.total, 2);
    for (const svc of resBoth.data.data) {
      assert.strictEqual(svc.category.slug, 'ramayana-manas-path');
    }
  });

  await test('5.2: Conjunctive filter isolates single service when only one matches purpose', async () => {
    // Only ramcharitmanas-navah-parayan has 'spiritual-anushthan'
    const res = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&purpose=spiritual-anushthan',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.total, 1);
    assert.strictEqual(res.data.data[0].slug, 'ramcharitmanas-navah-parayan');
    assert.strictEqual(res.data.data[0].category.slug, 'ramayana-manas-path');
  });

  await test('5.3: Category matches but purpose does not -> returns 0 cleanly', async () => {
    // Shiva path does NOT have auspicious-occasions purpose
    const res = await request({
      method: 'GET',
      path: '/api/path-services?category=shiva-rudri-path&purpose=auspicious-occasions',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.total, 0);
  });

  await test('5.4: Query parameter ordering: category first vs purpose first produce identical results', async () => {
    const res1 = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&purpose=devotional-practice',
    });
    const res2 = await request({
      method: 'GET',
      path: '/api/path-services?purpose=devotional-practice&category=ramayana-manas-path',
    });
    assert.strictEqual(res1.status, 200);
    assert.strictEqual(res2.status, 200);
    assert.strictEqual(res1.data.total, res2.data.total);
    assert.strictEqual(res1.data.data[0].slug, res2.data.data[0].slug);
    assert.strictEqual(res1.data.data[0].slug, 'sundarkand-path');
  });

  await test('5.5: Category filter combined with search (matching and non-matching)', async () => {
    const resMatch = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&search=Sundarkand',
    });
    assert.strictEqual(resMatch.status, 200);
    assert.strictEqual(resMatch.data.total, 1);
    assert.strictEqual(resMatch.data.data[0].slug, 'sundarkand-path');

    const resNoMatch = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&search=Shiva',
    });
    assert.strictEqual(resNoMatch.status, 200);
    assert.strictEqual(resNoMatch.data.total, 0);
  });

  await test('5.6: Category filter combined with format', async () => {
    const resSameDay = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&format=same_day',
    });
    assert.strictEqual(resSameDay.status, 200);
    assert.strictEqual(resSameDay.data.total, 1);
    assert.strictEqual(resSameDay.data.data[0].slug, 'sundarkand-path');

    const resMultiDay = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&format=multi_day',
    });
    assert.strictEqual(resMultiDay.status, 200);
    assert.strictEqual(resMultiDay.data.total, 1);
    assert.strictEqual(resMultiDay.data.data[0].slug, 'ramcharitmanas-navah-parayan');
  });

  await test('5.7: Category filter combined with days (single vs multi-day matching)', async () => {
    // 9 days matches only Navah Parayan (1..9), not Sundarkand (1..1)
    const res9Days = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&days=9',
    });
    assert.strictEqual(res9Days.status, 200);
    assert.strictEqual(res9Days.data.total, 1);
    assert.strictEqual(res9Days.data.data[0].slug, 'ramcharitmanas-navah-parayan');

    // 1 day matches both Sundarkand (1..1) and Ramcharitmanas (1..9)
    const res1Day = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&days=1',
    });
    assert.strictEqual(res1Day.status, 200);
    assert.strictEqual(res1Day.data.total, 2);

    // 10 days exceeds both
    const res10Days = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&days=10',
    });
    assert.strictEqual(res10Days.status, 200);
    assert.strictEqual(res10Days.data.total, 0);
  });

  await test('5.8: Category filter combined with duration / scripture structure', async () => {
    // Matches sundarkand chapterStructure: 'Complete 5th Sarga (60 Chaupais & Dohas)'
    const resDur = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&duration=Sarga',
    });
    assert.strictEqual(resDur.status, 200);
    assert.strictEqual(resDur.data.total, 1);
    assert.strictEqual(resDur.data.data[0].slug, 'sundarkand-path');
  });

  await test('5.9: Category filter combined with sorting', async () => {
    const resAsc = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&sortBy=price-asc',
    });
    const resDesc = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&sortBy=price-desc',
    });
    assert.strictEqual(resAsc.status, 200);
    assert.strictEqual(resDesc.status, 200);
    assert.strictEqual(resAsc.data.data.length, 2);
    assert.strictEqual(resDesc.data.data.length, 2);
    assert(resAsc.data.data[0].startingPrice <= resAsc.data.data[1].startingPrice);
    assert(resDesc.data.data[0].startingPrice >= resDesc.data.data[1].startingPrice);
  });

  await test('5.10: Category filter combined with pagination', async () => {
    const resPage = await request({
      method: 'GET',
      path: '/api/path-services?category=ramayana-manas-path&page=1&limit=1',
    });
    assert.strictEqual(resPage.status, 200);
    assert.strictEqual(resPage.data.total, 2);
    assert.strictEqual(resPage.data.data.length, 1);
  });

  await test('5.11: Malformed and whitespace category query inputs handled safely', async () => {
    const resEmpty = await request({
      method: 'GET',
      path: '/api/path-services?category=%20%20%20',
    });
    assert.strictEqual(resEmpty.status, 200);
    // When whitespace is stripped, returns standard catalogue (8 services)
    assert.strictEqual(resEmpty.data.total, 8);

    const resSpecial = await request({
      method: 'GET',
      path: '/api/path-services?category=$$$invalid###',
    });
    assert.strictEqual(resSpecial.status, 200);
    assert.strictEqual(resSpecial.data.total, 0);
  });

  // =========================================================================
  // SECTION 6: UNCATEGORIZED SERVICE SAFETY
  // =========================================================================
  console.log('\n--- SECTION 6: Uncategorized Service Safety ---');

  let uncatTestService = null;
  const uncatSlug = `test-uncat-path-${Date.now()}`;

  await test('6.1: Controlled Path service can be created with categoryId: null (Uncategorized)', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Uncategorized E2E Test Path',
        slug: uncatSlug,
        pathType: 'Scriptural Recitation',
        scripture: 'Vedic Samhita Recitation',
        recitationType: 'Vedic Samhita',
        shortDescription: 'Uncategorized safety testing',
        description: 'Comprehensive testing for null categoryId in Path service',
        categoryId: null,
        availableFormats: ['single_session', 'same_day'],
        availableDurations: ['3 to 4 Hours'],
        minimumDays: 1,
        recommendedDays: 1,
        maximumDays: 1,
        minimumPandits: 2,
        recommendedPandits: 3,
        maximumPandits: 5,
        startingPrice: 6500,
        isActive: true,
      },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.categoryId, null);
    assert.strictEqual(res.data.data.category, null);
    uncatTestService = res.data.data;
    cleanupServiceIds.push(uncatTestService.id);
  });

  await test('6.2: Uncategorized service is visible in admin detail with category: null', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/admin/path-services/${uncatTestService.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.categoryId, null);
    assert.strictEqual(res.data.data.category, null);
  });

  await test('6.3: Uncategorized service appears in general public catalogue and slug detail', async () => {
    const resList = await request({ method: 'GET', path: '/api/path-services' });
    assert.strictEqual(resList.status, 200);
    assert(resList.data.data.some((s) => s.slug === uncatSlug));

    const resDetail = await request({ method: 'GET', path: `/api/path-services/${uncatSlug}` });
    assert.strictEqual(resDetail.status, 200);
    assert.strictEqual(resDetail.data.data.category, null);
  });

  await test('6.4: Uncategorized service does NOT appear under any canonical category query', async () => {
    for (const cat of CANONICAL_CATEGORIES) {
      const res = await request({ method: 'GET', path: `/api/path-services?category=${cat.slug}` });
      assert.strictEqual(res.status, 200);
      assert(!res.data.data.some((s) => s.slug === uncatSlug));
    }
  });

  await test('6.5: Uncategorized service remains fully valid for authoritative price calculation', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'PATH',
        serviceSlug: uncatSlug,
        format: 'single_session',
        days: 1,
        duration: '3 to 4 Hours',
        panditCount: 2,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.totalAmount, 6500);
  });

  // =========================================================================
  // SECTION 7: CATEGORY REASSIGNMENT & FULL FIELD PRESERVATION
  // =========================================================================
  console.log('\n--- SECTION 7: Category Reassignment & Field Preservation ---');

  await test('7.1: Reassign service from Category A to Category B with zero field corruption', async () => {
    const ramCat = await PathCategory.findOne({ where: { slug: 'ramayana-manas-path' } });
    const shivaCat = await PathCategory.findOne({ where: { slug: 'shiva-rudri-path' } });

    // Create a service under Ramayana category
    const reassignmentSlug = `test-reassign-path-${Date.now()}`;
    const createRes = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Reassignment Test Path',
        slug: reassignmentSlug,
        pathType: 'Scriptural Recitation',
        scripture: 'Vedic Stotra',
        recitationType: 'Sacred Recitation',
        shortDescription: 'Testing category reassignment',
        description: 'Verifying that no attributes are corrupted during category reassignment',
        categoryId: ramCat.id,
        availableFormats: ['single_session', 'same_day'],
        availableDurations: ['3 to 4 Hours'],
        minimumDays: 1,
        recommendedDays: 1,
        maximumDays: 1,
        minimumPandits: 2,
        recommendedPandits: 4,
        maximumPandits: 6,
        startingPrice: 8500,
        isActive: true,
      },
    });
    assert.strictEqual(createRes.status, 201);
    const initialData = createRes.data.data;
    cleanupServiceIds.push(initialData.id);

    // Initial check: appears in Ramayana category, not Shiva
    const resRamBefore = await request({ method: 'GET', path: '/api/path-services?category=ramayana-manas-path' });
    assert(resRamBefore.data.data.some((s) => s.slug === reassignmentSlug));
    const resShivaBefore = await request({ method: 'GET', path: '/api/path-services?category=shiva-rudri-path' });
    assert(!resShivaBefore.data.data.some((s) => s.slug === reassignmentSlug));

    // Reassign to Shiva category
    const updateRes = await request({
      method: 'PUT',
      path: `/api/admin/path-services/${initialData.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        categoryId: shivaCat.id,
      },
    });
    assert.strictEqual(updateRes.status, 200);
    const updatedData = updateRes.data.data;

    // Verify category changed
    assert.strictEqual(updatedData.categoryId, shivaCat.id);
    assert.strictEqual(updatedData.category.slug, 'shiva-rudri-path');

    // Verify ALL other fields remain strictly preserved
    assert.strictEqual(updatedData.name, initialData.name);
    assert.strictEqual(updatedData.slug, initialData.slug);
    assert.strictEqual(updatedData.startingPrice, initialData.startingPrice);
    assert.strictEqual(updatedData.scripture, initialData.scripture);
    assert.strictEqual(updatedData.recitationType, initialData.recitationType);
    assert.deepStrictEqual(updatedData.availableFormats, initialData.availableFormats);
    assert.deepStrictEqual(updatedData.availableDurations, initialData.availableDurations);
    assert.strictEqual(updatedData.minimumDays, initialData.minimumDays);
    assert.strictEqual(updatedData.maximumDays, initialData.maximumDays);
    assert.strictEqual(updatedData.minimumPandits, initialData.minimumPandits);
    assert.strictEqual(updatedData.maximumPandits, initialData.maximumPandits);

    // Filter check after reassignment: no longer in Ramayana, now in Shiva
    const resRamAfter = await request({ method: 'GET', path: '/api/path-services?category=ramayana-manas-path' });
    assert(!resRamAfter.data.data.some((s) => s.slug === reassignmentSlug));
    const resShivaAfter = await request({ method: 'GET', path: '/api/path-services?category=shiva-rudri-path' });
    assert(resShivaAfter.data.data.some((s) => s.slug === reassignmentSlug));
  });

  // =========================================================================
  // SECTION 8: CATEGORY DEACTIVATION & REACTIVATION LIFECYCLE
  // =========================================================================
  console.log('\n--- SECTION 8: Deactivation & Reactivation Lifecycle ---');

  let deactCat = null;
  let deactService = null;
  const deactCatSlug = `test-deact-path-cat-${Date.now()}`;
  const deactSvcSlug = `test-deact-path-svc-${Date.now()}`;

  await test('8.1: Setup test category and service for deactivation testing', async () => {
    const catRes = await request({
      method: 'POST',
      path: '/api/admin/path-categories',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: `Deactivation Test Category ${Date.now()}`,
        slug: deactCatSlug,
        description: 'Category for deactivation verification',
        displayOrder: 99,
        isActive: true,
      },
    });
    assert.strictEqual(catRes.status, 201);
    deactCat = catRes.data.data;
    cleanupCategoryIds.push(deactCat.id);

    const svcRes = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Deactivation Linked Path Service',
        slug: deactSvcSlug,
        pathType: 'Scriptural Recitation',
        scripture: 'Linked Scripture',
        recitationType: 'Linked Recitation',
        shortDescription: 'Testing soft deactivation',
        description: 'Linked service must survive category deactivation',
        categoryId: deactCat.id,
        availableFormats: ['single_session'],
        availableDurations: ['3 to 4 Hours'],
        minimumDays: 1,
        recommendedDays: 1,
        maximumDays: 1,
        minimumPandits: 2,
        recommendedPandits: 3,
        maximumPandits: 5,
        startingPrice: 5500,
        isActive: true,
      },
    });
    assert.strictEqual(svcRes.status, 201);
    deactService = svcRes.data.data;
    cleanupServiceIds.push(deactService.id);
  });

  await test('8.2: Soft deactivation hides category publicly while preserving associated service and pricing', async () => {
    const delRes = await request({
      method: 'DELETE',
      path: `/api/admin/path-categories/${deactCat.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(delRes.status, 200);
    assert.strictEqual(delRes.data.success, true);
    assert.strictEqual(delRes.data.data.isActive, false);

    // 1. Category remains in DB with isActive: false
    const catDb = await PathCategory.findByPk(deactCat.id);
    assert(catDb, 'Category must remain in DB');
    assert.strictEqual(catDb.isActive, false);

    // 2. Admin can still see category
    const adminRes = await request({
      method: 'GET',
      path: `/api/admin/path-categories/${deactCat.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(adminRes.status, 200);
    assert.strictEqual(adminRes.data.data.isActive, false);

    // 3. Public category list hides category
    const pubList = await request({ method: 'GET', path: '/api/path-categories' });
    assert(!pubList.data.data.some((c) => c.id === deactCat.id));

    // 4. Public category detail returns 404
    const pubDetail = await request({ method: 'GET', path: `/api/path-categories/${deactCatSlug}` });
    assert.strictEqual(pubDetail.status, 404);

    // 5. Public category query returns 0 services
    const pubSvcFilter = await request({ method: 'GET', path: `/api/path-services?category=${deactCatSlug}` });
    assert.strictEqual(pubSvcFilter.status, 200);
    assert.strictEqual(pubSvcFilter.data.total, 0);

    // 6. Associated service is NOT deleted; category_id relationship and price remain intact
    const svcDb = await PathService.findByPk(deactService.id);
    assert(svcDb, 'Associated service must not be deleted');
    assert.strictEqual(svcDb.categoryId, deactCat.id, 'category_id relationship must remain preserved');
    assert.strictEqual(Number(svcDb.startingPrice), 5500, 'Service startingPrice must not change');
  });

  await test('8.3: Reactivation restores public visibility and category filtering', async () => {
    const reactRes = await request({
      method: 'PUT',
      path: `/api/admin/path-categories/${deactCat.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { isActive: true },
    });
    assert.strictEqual(reactRes.status, 200);
    assert.strictEqual(reactRes.data.data.isActive, true);

    // Public list includes category again
    const pubList = await request({ method: 'GET', path: '/api/path-categories' });
    assert(pubList.data.data.some((c) => c.id === deactCat.id));

    // Public detail returns 200
    const pubDetail = await request({ method: 'GET', path: `/api/path-categories/${deactCatSlug}` });
    assert.strictEqual(pubDetail.status, 200);
    assert.strictEqual(pubDetail.data.data.slug, deactCatSlug);

    // Public category service query works again
    const pubSvcFilter = await request({ method: 'GET', path: `/api/path-services?category=${deactCatSlug}` });
    assert.strictEqual(pubSvcFilter.status, 200);
    assert.strictEqual(pubSvcFilter.data.total, 1);
    assert.strictEqual(pubSvcFilter.data.data[0].slug, deactSvcSlug);
  });

  // =========================================================================
  // SECTION 9: ADMIN API & SECURITY VERIFICATION
  // =========================================================================
  console.log('\n--- SECTION 9: Admin API & Security Verification ---');

  await test('9.1: Unauthenticated requests to admin category endpoints are rejected with 401', async () => {
    const rList = await request({ method: 'GET', path: '/api/admin/path-categories' });
    assert.strictEqual(rList.status, 401);

    const rGet = await request({ method: 'GET', path: `/api/admin/path-categories/${CANONICAL_CATEGORIES[0].slug}` });
    assert.strictEqual(rGet.status, 401);

    const rPost = await request({
      method: 'POST',
      path: '/api/admin/path-categories',
      body: { name: 'Test Unauth' },
    });
    assert.strictEqual(rPost.status, 401);

    const rPut = await request({
      method: 'PUT',
      path: `/api/admin/path-categories/${CANONICAL_CATEGORIES[0].slug}`,
      body: { name: 'Test Unauth' },
    });
    assert.strictEqual(rPut.status, 401);

    const rDel = await request({
      method: 'DELETE',
      path: `/api/admin/path-categories/${CANONICAL_CATEGORIES[0].slug}`,
    });
    assert.strictEqual(rDel.status, 401);
  });

  await test('9.2: Authenticated non-admin users receive 403 Forbidden', async () => {
    const rList = await request({
      method: 'GET',
      path: '/api/admin/path-categories',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.strictEqual(rList.status, 403);

    const rPost = await request({
      method: 'POST',
      path: '/api/admin/path-categories',
      headers: { Authorization: `Bearer ${userToken}` },
      body: { name: 'Test Non-admin' },
    });
    assert.strictEqual(rPost.status, 403);
  });

  await test('9.3: Duplicate slug rejected with 409 Conflict', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-categories',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: `Different Name ${Date.now()}`,
        slug: 'ramayana-manas-path',
      },
    });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
  });

  await test('9.4: Duplicate name rejected with 409 Conflict', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-categories',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Ramayana & Manas Parayan',
        slug: `different-slug-${Date.now()}`,
      },
    });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
  });

  await test('9.5: Invalid category UUID on admin get returns 400', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-categories/invalid-uuid-format',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 400);
  });

  await test('9.6: Non-existent categoryId on service creation returns 404', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Invalid Category ID Path Service',
        slug: `invalid-cat-svc-${Date.now()}`,
        pathType: 'Scriptural Recitation',
        scripture: 'Vedic Samhita',
        recitationType: 'Sacred Recitation',
        shortDescription: 'Short',
        description: 'Long',
        categoryId: '00000000-0000-0000-0000-000000000000',
        availableFormats: ['single_session'],
        availableDurations: ['3 to 4 Hours'],
        minimumDays: 1,
        recommendedDays: 1,
        maximumDays: 1,
        minimumPandits: 2,
        recommendedPandits: 3,
        maximumPandits: 5,
        startingPrice: 5000,
      },
    });
    assert.strictEqual(res.status, 404);
    assert(res.data.message.includes('Category with id'));
  });

  // =========================================================================
  // SECTION 10: SERIALIZER CONTRACT VERIFICATION
  // =========================================================================
  console.log('\n--- SECTION 10: Serializer Contract Verification ---');

  await test('10.1: Public service listing serializer includes category: { id, name, slug, iconName, image }', async () => {
    const res = await request({ method: 'GET', path: '/api/path-services' });
    assert.strictEqual(res.status, 200);
    const item = res.data.data.find((s) => s.slug === 'sundarkand-path');
    assert(item, 'Sundarkand Path not found');
    assert(item.category, 'Public service must include category object');
    assert.strictEqual(item.category.slug, 'ramayana-manas-path');
    assert.strictEqual(item.category.name, 'Ramayana & Manas Parayan');
    assert.strictEqual(item.category.iconName, 'BookOpen');
    assert('image' in item.category);
    assert(item.pathType, 'Public service must retain pathType');
    assert(item.purposeDetails || item.purposeCategory, 'Public service must retain purpose details');
  });

  await test('10.2: Public service detail serializer includes category object, purposeDetails, and pathType', async () => {
    const res = await request({ method: 'GET', path: '/api/path-services/sundarkand-path' });
    assert.strictEqual(res.status, 200);
    const svc = res.data.data;
    assert(svc.category, 'Detail must include category object');
    assert.strictEqual(svc.category.slug, 'ramayana-manas-path');
    assert.strictEqual(svc.category.iconName, 'BookOpen');
    assert(svc.pathType, 'Detail must include pathType');
    assert(svc.purposeDetails, 'Detail must include purposeDetails');
  });

  await test('10.3: Admin service serializer includes both categoryId and serialized category', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const item = res.data.data.find((s) => s.slug === 'sundarkand-path');
    assert(item);
    assert(item.categoryId, 'Admin service must include categoryId');
    assert(item.category, 'Admin service must include serialized category');
    assert.strictEqual(item.category.slug, 'ramayana-manas-path');
  });

  // =========================================================================
  // SECTION 11: PRICING & BOOKING INTEGRITY VERIFICATION
  // =========================================================================
  console.log('\n--- SECTION 11: Pricing & Booking Integrity Verification ---');

  await test('11.1: Authoritative Path pricing uses startingPrice and ignores category', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'PATH',
        serviceSlug: 'sundarkand-path',
        format: 'same_day',
        days: 1,
        duration: '3 to 4 Hours',
        panditCount: 2,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.totalAmount, 5100);
    assert.strictEqual(res.data.data.pricingSource, 'PATH_CANONICAL_PRICING');
  });

  await test('11.2: Path booking creation and resolver flow function seamlessly', async () => {
    const bookingRes = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'PATH',
        serviceSlug: 'sundarkand-path',
        configuration: {
          commencementDate: '2026-11-20',
          timeSlot: '09:00 AM',
          recitationFormat: 'same_day',
          selectedDuration: '3 to 4 Hours',
          days: 1,
          panditCount: 2,
          arrangementMode: 'kashi',
        },
        location: {
          locationType: 'kashi',
          venueDetails: { notes: 'Assi Ghat Path Mandap' },
        },
        yajman: {
          name: 'Shri Ram Bhakt',
          mobile: '9876543210',
          email: 'rambhakt@example.com',
          gotra: 'Vashishta',
        },
        sankalp: {
          purpose: 'Family peace and auspicious beginnings',
          mainIntention: 'Sundarkand Sacred Recitation',
        },
      },
    });

    assert.strictEqual(bookingRes.status, 201);
    const bRef = bookingRes.data.data.bookingReference;
    assert(bRef.startsWith('VEDA-PATH-'));
    cleanupBookingRefs.push(bRef);

    // Test booking lookup
    const lookupRes = await request({ method: 'GET', path: `/api/ritual-bookings/${bRef}` });
    assert.strictEqual(lookupRes.status, 200);
    assert.strictEqual(lookupRes.data.data.service.type, 'PATH');
    assert.strictEqual(lookupRes.data.data.service.slug, 'sundarkand-path');
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
      await PathService.destroy({ where: { id: sId } });
    } catch {}
  }
  for (const cId of cleanupCategoryIds) {
    try {
      await PathCategory.destroy({ where: { id: cId } });
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
    await runPathCategoryE2EHardening();
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('Fatal test error:', err);
    server.close(() => process.exit(1));
  }
});
