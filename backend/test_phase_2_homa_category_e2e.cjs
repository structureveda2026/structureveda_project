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

async function runHomaCategoryE2EVerification() {
  console.log('================================================================');
  console.log('PHASE 2: HOMA CATEGORY BACKEND END-TO-END HARDENING & VERIFICATION');
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
      fullName: 'Homa E2E Test Admin',
      email: `homa_e2e_admin_${Date.now()}@example.com`,
      password: 'hashed_password_123',
      role: 'admin',
      isActive: true,
    });
  }

  let regularUser = await User.findOne({ where: { role: 'user', isActive: true } });
  if (!regularUser) {
    regularUser = await User.create({
      fullName: 'Homa E2E Regular User',
      email: `homa_e2e_user_${Date.now()}@example.com`,
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

  const CANONICAL_CATEGORIES = [
    { slug: 'shiva-rudra-homa', name: 'Shiva & Rudra Homa', order: 1, icon: 'Flame' },
    { slug: 'ganapati-homa', name: 'Ganapati Homa', order: 2, icon: 'Sparkles' },
    { slug: 'durga-chandi-homa', name: 'Durga & Chandi Homa', order: 3, icon: 'Shield' },
    { slug: 'lakshmi-kubera-homa', name: 'Lakshmi & Kubera Homa', order: 4, icon: 'Coins' },
    { slug: 'navagraha-planetary-homa', name: 'Navagraha Planetary Homa', order: 5, icon: 'Compass' },
    { slug: 'vastu-griha-homa', name: 'Vastu & Griha Homa', order: 6, icon: 'Home' },
    { slug: 'ayushya-longevity-homa', name: 'Ayushya & Longevity Homa', order: 7, icon: 'Heart' },
  ];

  const CANONICAL_MAPPINGS = {
    'maha-mrityunjaya-homa': 'shiva-rudra-homa',
    'rudra-homa': 'shiva-rudra-homa',
    'ganapati-homa': 'ganapati-homa',
    'durga-chandi-homa': 'durga-chandi-homa',
    'lakshmi-kubera-homa': 'lakshmi-kubera-homa',
    'navagraha-homa': 'navagraha-planetary-homa',
    'vastu-shanti-homa': 'vastu-griha-homa',
    'ayushya-homa': 'ayushya-longevity-homa',
  };

  // =========================================================================
  // SECTION 1: CATEGORY SOURCE OF TRUTH & CANONICAL MAPPINGS
  // =========================================================================
  console.log('--- SECTION 1: Category Source of Truth & Canonical Mappings ---');

  await test('1.1: Exactly 7 canonical categories exist in database', async () => {
    const cats = await HomaCategory.findAll({
      where: { slug: CANONICAL_CATEGORIES.map((c) => c.slug) },
    });
    assert.strictEqual(cats.length, 7);
  });

  await test('1.2: All canonical categories have unique IDs and unique slugs', async () => {
    const cats = await HomaCategory.findAll();
    const idSet = new Set(cats.map((c) => c.id));
    const slugSet = new Set(cats.map((c) => c.slug));
    assert.strictEqual(idSet.size, cats.length, 'Category IDs must be unique');
    assert.strictEqual(slugSet.size, cats.length, 'Category slugs must be unique');
  });

  await test('1.3: All canonical categories are active with correct sequential display order', async () => {
    for (const expected of CANONICAL_CATEGORIES) {
      const cat = await HomaCategory.findOne({ where: { slug: expected.slug } });
      assert(cat, `Category ${expected.slug} not found`);
      assert.strictEqual(cat.isActive, true);
      assert.strictEqual(cat.displayOrder, expected.order);
      assert.strictEqual(cat.iconName, expected.icon);
    }
  });

  await test('1.4: All 8 canonical services are mapped to their approved categories', async () => {
    for (const [svcSlug, catSlug] of Object.entries(CANONICAL_MAPPINGS)) {
      const svc = await HomaService.findOne({
        where: { slug: svcSlug },
        include: [{ model: HomaCategory, as: 'categoryDetails' }],
      });
      assert(svc, `Canonical service ${svcSlug} not found`);
      assert(svc.categoryId, `Service ${svcSlug} must have categoryId`);
      assert(svc.categoryDetails, `Service ${svcSlug} categoryDetails not found`);
      assert.strictEqual(svc.categoryDetails.slug, catSlug);
    }
  });

  await test('1.5: No orphan category IDs exist on homa_services', async () => {
    const [orphans] = await db.sequelize.query(`
      SELECT s.id, s.name, s.slug, s.category_id 
      FROM homa_services s 
      LEFT JOIN homa_categories c ON s.category_id = c.id 
      WHERE s.category_id IS NOT NULL AND c.id IS NULL;
    `);
    assert.strictEqual(orphans.length, 0, 'Found orphan category_id in homa_services');
  });

  // =========================================================================
  // SECTION 2: CATEGORY FILTERING ACROSS ALL CANONICAL CATEGORIES
  // =========================================================================
  console.log('\n--- SECTION 2: Category Filtering Across All Categories ---');

  for (const cat of CANONICAL_CATEGORIES) {
    await test(`2.1: Filter by category slug '${cat.slug}' returns only services in that category`, async () => {
      const res = await request({ method: 'GET', path: `/api/homa-services?category=${cat.slug}` });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert(res.data.total >= 1, `Expected at least 1 service for ${cat.slug}`);
      for (const svc of res.data.data) {
        assert.strictEqual(svc.category.slug, cat.slug);
      }
    });
  }

  await test('2.2: Category filter combined with search (matching)', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/homa-services?category=shiva-rudra-homa&search=Mrityunjaya',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.total, 1);
    assert.strictEqual(res.data.data[0].slug, 'maha-mrityunjaya-homa');
    assert.strictEqual(res.data.data[0].category.slug, 'shiva-rudra-homa');
  });

  await test('2.3: Category filter combined with search (non-matching)', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/homa-services?category=shiva-rudra-homa&search=Ganapati',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.total, 0);
  });

  await test('2.4: Category filter combined with havanCount', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/homa-services?category=shiva-rudra-homa&havanCount=3',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.total >= 1);
    for (const s of res.data.data) {
      assert(s.availableHavanCounts.includes(3));
      assert.strictEqual(s.category.slug, 'shiva-rudra-homa');
    }
  });

  await test('2.5: Category filter combined with days', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/homa-services?category=shiva-rudra-homa&days=1',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.total >= 1);
    for (const s of res.data.data) {
      assert(s.availableDays.includes(1));
      assert.strictEqual(s.category.slug, 'shiva-rudra-homa');
    }
  });

  await test('2.6: Category filter combined with arrangement mode', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/homa-services?category=shiva-rudra-homa&mode=kashi',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.total >= 1);
    for (const s of res.data.data) {
      assert.strictEqual(s.isKashiAvailable, true);
      assert.strictEqual(s.category.slug, 'shiva-rudra-homa');
    }
  });

  await test('2.7: Category filter combined with pagination', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/homa-services?category=shiva-rudra-homa&page=1&limit=1',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.total, 2);
    assert.strictEqual(res.data.data.length, 1);
    assert.strictEqual(res.data.data[0].category.slug, 'shiva-rudra-homa');
  });

  await test('2.8: Category filter combined with sorting', async () => {
    const resAsc = await request({
      method: 'GET',
      path: '/api/homa-services?category=shiva-rudra-homa&sortBy=price-asc',
    });
    assert.strictEqual(resAsc.status, 200);
    const resDesc = await request({
      method: 'GET',
      path: '/api/homa-services?category=shiva-rudra-homa&sortBy=price-desc',
    });
    assert.strictEqual(resDesc.status, 200);

    if (resAsc.data.data.length > 1) {
      assert(resAsc.data.data[0].startingPrice <= resAsc.data.data[1].startingPrice);
      assert(resDesc.data.data[0].startingPrice >= resDesc.data.data[1].startingPrice);
    }
  });

  // =========================================================================
  // SECTION 3: PURPOSE + CATEGORY SEPARATION & INDEPENDENCE
  // =========================================================================
  console.log('\n--- SECTION 3: Purpose + Category Separation ---');

  await test('3.1: Purpose and category work independently and concurrently', async () => {
    // Both match: Shiva category + shanti-wellbeing purpose
    const resBoth = await request({
      method: 'GET',
      path: '/api/homa-services?category=shiva-rudra-homa&purpose=shanti-wellbeing',
    });
    assert.strictEqual(resBoth.status, 200);
    assert.strictEqual(resBoth.data.success, true);
    assert(resBoth.data.total >= 1);
    for (const s of resBoth.data.data) {
      assert.strictEqual(s.category.slug, 'shiva-rudra-homa');
    }

    // Category matches but purpose does not: Shiva category + prosperity purpose -> 0
    const resMismatch = await request({
      method: 'GET',
      path: '/api/homa-services?category=shiva-rudra-homa&purpose=prosperity',
    });
    assert.strictEqual(resMismatch.status, 200);
    assert.strictEqual(resMismatch.data.success, true);
    assert.strictEqual(resMismatch.data.total, 0);

    // Purpose matches but category does not: Lakshmi category + prosperity purpose -> matches Lakshmi
    const resLakshmi = await request({
      method: 'GET',
      path: '/api/homa-services?category=lakshmi-kubera-homa&purpose=prosperity',
    });
    assert.strictEqual(resLakshmi.status, 200);
    assert.strictEqual(resLakshmi.data.success, true);
    assert.strictEqual(resLakshmi.data.total, 1);
    assert.strictEqual(resLakshmi.data.data[0].slug, 'lakshmi-kubera-homa');
  });

  await test('3.2: Purpose fields in database remain intact and unmutated', async () => {
    const services = await HomaService.findAll();
    for (const svc of services) {
      assert(svc.purposeId, `Service ${svc.slug} must retain purposeId`);
      assert(svc.purposeCategory, `Service ${svc.slug} must retain purposeCategory`);
      assert(Array.isArray(svc.purposeCategories), `Service ${svc.slug} must retain purposeCategories`);
    }
  });

  // =========================================================================
  // SECTION 4: UNCATEGORIZED SERVICE SAFETY
  // =========================================================================
  console.log('\n--- SECTION 4: Uncategorized Service Safety ---');

  let uncatTestService = null;
  const uncatSlug = `test-uncat-e2e-${Date.now()}`;

  await test('4.1: Controlled service can be created with categoryId: null (Uncategorized)', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Uncategorized E2E Test Homa',
        slug: uncatSlug,
        homaType: 'Special Fire Sacrament',
        shortDescription: 'Uncategorized safety testing',
        description: 'Comprehensive testing for null categoryId',
        categoryId: null,
        availableHavanCounts: [1, 3],
        availableDays: [1],
        minimumPandits: 2,
        recommendedPandits: 3,
        maximumPandits: 5,
        basePrice: 7500,
        perHavanPrice: 2500,
        perDayPrice: 1500,
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

  await test('4.2: Uncategorized service is visible in admin listing with category: null', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/admin/homa-services/${uncatTestService.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.categoryId, null);
    assert.strictEqual(res.data.data.category, null);
  });

  await test('4.3: Uncategorized service appears in general public catalogue', async () => {
    const res = await request({ method: 'GET', path: `/api/homa-services/${uncatSlug}` });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.category, null);
  });

  await test('4.4: Uncategorized service does NOT appear in category-specific query', async () => {
    for (const cat of CANONICAL_CATEGORIES) {
      const res = await request({ method: 'GET', path: `/api/homa-services?category=${cat.slug}` });
      assert.strictEqual(res.status, 200);
      const found = res.data.data.find((s) => s.slug === uncatSlug);
      assert(!found, `Uncategorized service must not appear under category ${cat.slug}`);
    }
  });

  await test('4.5: Uncategorized service remains valid for pricing calculation', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: {
        serviceType: 'HOMA',
        serviceSlug: uncatSlug,
        havanCount: 3,
        days: 1,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    // Base 7500 + 2 * 2500 = 12500
    assert.strictEqual(res.data.data.totalAmount, 12500);
  });

  // =========================================================================
  // SECTION 5: CATEGORY REASSIGNMENT & FULL FIELD PRESERVATION
  // =========================================================================
  console.log('\n--- SECTION 5: Category Reassignment & Field Preservation ---');

  await test('5.1: Reassign service from Category A to Category B with zero field corruption', async () => {
    const shivaCat = await HomaCategory.findOne({ where: { slug: 'shiva-rudra-homa' } });
    const ganapatiCat = await HomaCategory.findOne({ where: { slug: 'ganapati-homa' } });

    // Create a service under Shiva category
    const reassignmentSlug = `test-reassign-homa-${Date.now()}`;
    const createRes = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Reassignment Test Service',
        slug: reassignmentSlug,
        homaType: 'Transformative Fire Ritual',
        shortDescription: 'Testing category reassignment',
        description: 'Verifying that no attributes are corrupted during category reassignment',
        categoryId: shivaCat.id,
        availableHavanCounts: [1, 3, 5],
        availableDays: [1, 2],
        minimumPandits: 2,
        recommendedPandits: 4,
        maximumPandits: 7,
        basePrice: 12000,
        perHavanPrice: 3000,
        perDayPrice: 2000,
        isActive: true,
      },
    });
    assert.strictEqual(createRes.status, 201);
    const initialData = createRes.data.data;
    cleanupServiceIds.push(initialData.id);

    // Initial category check: appears under Shiva, not under Ganapati
    const resShivaBefore = await request({ method: 'GET', path: '/api/homa-services?category=shiva-rudra-homa' });
    assert(resShivaBefore.data.data.some((s) => s.slug === reassignmentSlug));
    const resGanapatiBefore = await request({ method: 'GET', path: '/api/homa-services?category=ganapati-homa' });
    assert(!resGanapatiBefore.data.data.some((s) => s.slug === reassignmentSlug));

    // Perform Reassignment to Ganapati category
    const updateRes = await request({
      method: 'PUT',
      path: `/api/admin/homa-services/${initialData.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        categoryId: ganapatiCat.id,
      },
    });
    assert.strictEqual(updateRes.status, 200);
    const updatedData = updateRes.data.data;

    // Verify category changed
    assert.strictEqual(updatedData.categoryId, ganapatiCat.id);
    assert.strictEqual(updatedData.category.slug, 'ganapati-homa');

    // Verify ALL other fields remain strictly preserved
    assert.strictEqual(updatedData.name, initialData.name);
    assert.strictEqual(updatedData.slug, initialData.slug);
    assert.strictEqual(updatedData.basePrice, initialData.basePrice);
    assert.strictEqual(updatedData.perHavanPrice, initialData.perHavanPrice);
    assert.strictEqual(updatedData.perDayPrice, initialData.perDayPrice);
    assert.deepStrictEqual(updatedData.availableHavanCounts, initialData.availableHavanCounts);
    assert.deepStrictEqual(updatedData.availableDays, initialData.availableDays);
    assert.strictEqual(updatedData.minimumPandits, initialData.minimumPandits);
    assert.strictEqual(updatedData.recommendedPandits, initialData.recommendedPandits);
    assert.strictEqual(updatedData.maximumPandits, initialData.maximumPandits);

    // Filter check after reassignment: no longer in Shiva, now in Ganapati
    const resShivaAfter = await request({ method: 'GET', path: '/api/homa-services?category=shiva-rudra-homa' });
    assert(!resShivaAfter.data.data.some((s) => s.slug === reassignmentSlug));
    const resGanapatiAfter = await request({ method: 'GET', path: '/api/homa-services?category=ganapati-homa' });
    assert(resGanapatiAfter.data.data.some((s) => s.slug === reassignmentSlug));
  });

  // =========================================================================
  // SECTION 6: CATEGORY DEACTIVATION & REACTIVATION LIFECYCLE
  // =========================================================================
  console.log('\n--- SECTION 6: Deactivation & Reactivation Lifecycle ---');

  let deactCat = null;
  let deactService = null;
  const deactCatSlug = `test-deact-cat-${Date.now()}`;
  const deactSvcSlug = `test-deact-svc-${Date.now()}`;

  await test('6.1: Setup test category and service for deactivation testing', async () => {
    const catRes = await request({
      method: 'POST',
      path: '/api/admin/homa-categories',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: `Deactivation Test Category ${Date.now()}`,
        slug: deactCatSlug,
        description: 'Category for deactivation verification',
        displayOrder: 88,
        isActive: true,
      },
    });
    assert.strictEqual(catRes.status, 201);
    deactCat = catRes.data.data;
    cleanupCategoryIds.push(deactCat.id);

    const svcRes = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Deactivation Linked Service',
        slug: deactSvcSlug,
        homaType: 'Linked Homa',
        shortDescription: 'Testing soft deactivation',
        description: 'Linked service must survive category deactivation',
        categoryId: deactCat.id,
        availableHavanCounts: [1],
        availableDays: [1],
        minimumPandits: 2,
        recommendedPandits: 3,
        maximumPandits: 5,
        basePrice: 5000,
        perHavanPrice: 2000,
        perDayPrice: 1500,
        isActive: true,
      },
    });
    assert.strictEqual(svcRes.status, 201);
    deactService = svcRes.data.data;
    cleanupServiceIds.push(deactService.id);
  });

  await test('6.2: Soft deactivation hides category publicly while preserving associated service', async () => {
    const delRes = await request({
      method: 'DELETE',
      path: `/api/admin/homa-categories/${deactCat.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(delRes.status, 200);
    assert.strictEqual(delRes.data.success, true);
    assert.strictEqual(delRes.data.data.isActive, false);

    // 1. Category remains in DB
    const catDb = await HomaCategory.findByPk(deactCat.id);
    assert(catDb, 'Category must remain in DB');
    assert.strictEqual(catDb.isActive, false);

    // 2. Admin can still see category
    const adminRes = await request({
      method: 'GET',
      path: `/api/admin/homa-categories/${deactCat.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(adminRes.status, 200);
    assert.strictEqual(adminRes.data.data.isActive, false);

    // 3. Public category list hides category
    const pubList = await request({ method: 'GET', path: '/api/homa-categories' });
    assert(!pubList.data.data.some((c) => c.id === deactCat.id));

    // 4. Public category detail returns 404
    const pubDetail = await request({ method: 'GET', path: `/api/homa-categories/${deactCatSlug}` });
    assert.strictEqual(pubDetail.status, 404);

    // 5. Public category service query returns 0 services
    const pubSvcFilter = await request({ method: 'GET', path: `/api/homa-services?category=${deactCatSlug}` });
    assert.strictEqual(pubSvcFilter.status, 200);
    assert.strictEqual(pubSvcFilter.data.total, 0);

    // 6. Associated service is NOT deleted; category_id relationship is preserved
    const svcDb = await HomaService.findByPk(deactService.id);
    assert(svcDb, 'Associated service must not be deleted');
    assert.strictEqual(svcDb.categoryId, deactCat.id, 'category_id relationship must remain preserved');
  });

  await test('6.3: Reactivation restores public visibility and category filtering', async () => {
    const reactRes = await request({
      method: 'PUT',
      path: `/api/admin/homa-categories/${deactCat.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { isActive: true },
    });
    assert.strictEqual(reactRes.status, 200);
    assert.strictEqual(reactRes.data.data.isActive, true);

    // Public list includes category again
    const pubList = await request({ method: 'GET', path: '/api/homa-categories' });
    assert(pubList.data.data.some((c) => c.id === deactCat.id));

    // Public detail returns 200
    const pubDetail = await request({ method: 'GET', path: `/api/homa-categories/${deactCatSlug}` });
    assert.strictEqual(pubDetail.status, 200);
    assert.strictEqual(pubDetail.data.data.slug, deactCatSlug);

    // Public category service query works again
    const pubSvcFilter = await request({ method: 'GET', path: `/api/homa-services?category=${deactCatSlug}` });
    assert.strictEqual(pubSvcFilter.status, 200);
    assert.strictEqual(pubSvcFilter.data.total, 1);
    assert.strictEqual(pubSvcFilter.data.data[0].slug, deactSvcSlug);
  });

  // =========================================================================
  // SECTION 7: SECURITY & AUTHORIZATION
  // =========================================================================
  console.log('\n--- SECTION 7: Security & Authorization ---');

  await test('7.1: Unauthenticated requests to admin category endpoints are rejected with 401', async () => {
    const rList = await request({ method: 'GET', path: '/api/admin/homa-categories' });
    assert.strictEqual(rList.status, 401);

    const rGet = await request({ method: 'GET', path: `/api/admin/homa-categories/${CANONICAL_CATEGORIES[0].slug}` });
    assert.strictEqual(rGet.status, 401);

    const rPost = await request({
      method: 'POST',
      path: '/api/admin/homa-categories',
      body: { name: 'Test Unauth' },
    });
    assert.strictEqual(rPost.status, 401);

    const rPut = await request({
      method: 'PUT',
      path: `/api/admin/homa-categories/${CANONICAL_CATEGORIES[0].slug}`,
      body: { name: 'Test Unauth' },
    });
    assert.strictEqual(rPut.status, 401);

    const rDel = await request({
      method: 'DELETE',
      path: `/api/admin/homa-categories/${CANONICAL_CATEGORIES[0].slug}`,
    });
    assert.strictEqual(rDel.status, 401);
  });

  await test('7.2: Authenticated non-admin users receive 403 Forbidden', async () => {
    const rList = await request({
      method: 'GET',
      path: '/api/admin/homa-categories',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.strictEqual(rList.status, 403);

    const rPost = await request({
      method: 'POST',
      path: '/api/admin/homa-categories',
      headers: { Authorization: `Bearer ${userToken}` },
      body: { name: 'Test Non-admin' },
    });
    assert.strictEqual(rPost.status, 403);
  });

  // =========================================================================
  // SECTION 8: DUPLICATE & INVALID INPUT SAFETY
  // =========================================================================
  console.log('\n--- SECTION 8: Duplicate & Invalid Input Safety ---');

  await test('8.1: Duplicate slug rejected with 409', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/homa-categories',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: `Different Name ${Date.now()}`,
        slug: 'shiva-rudra-homa', // Already exists
      },
    });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
  });

  await test('8.2: Duplicate name rejected with 409', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/homa-categories',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Shiva & Rudra Homa', // Already exists
        slug: `different-slug-${Date.now()}`,
      },
    });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
  });

  await test('8.3: Invalid category UUID on admin get returns 400', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/homa-categories/invalid-uuid-format',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 400);
  });

  await test('8.4: Non-existent categoryId on service creation returns 400', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Invalid Category ID Service',
        slug: `invalid-cat-svc-${Date.now()}`,
        homaType: 'Special Fire Ritual',
        shortDescription: 'Short',
        description: 'Long',
        categoryId: '00000000-0000-0000-0000-000000000000',
        availableHavanCounts: [1],
        availableDays: [1],
        minimumPandits: 2,
        recommendedPandits: 3,
        maximumPandits: 5,
        basePrice: 5000,
        perHavanPrice: 2000,
        perDayPrice: 1500,
      },
    });
    assert.strictEqual(res.status, 400);
    assert(res.data.message.includes('categoryId'));
  });

  // =========================================================================
  // SECTION 9: SERIALIZER CONTRACT VERIFICATION
  // =========================================================================
  console.log('\n--- SECTION 9: Serializer Contract Verification ---');

  await test('9.1: Public service listing serializer includes category: { id, name, slug, iconName, image }', async () => {
    const res = await request({ method: 'GET', path: '/api/homa-services' });
    assert.strictEqual(res.status, 200);
    const item = res.data.data.find((s) => s.slug === 'maha-mrityunjaya-homa');
    assert(item, 'Maha Mrityunjaya Homa not found');
    assert(item.category, 'Public service must include category object');
    assert.strictEqual(item.category.slug, 'shiva-rudra-homa');
    assert.strictEqual(item.category.name, 'Shiva & Rudra Homa');
    assert.strictEqual(item.category.iconName, 'Flame');
    assert('image' in item.category);
  });

  await test('9.2: Public service detail serializer includes category object', async () => {
    const res = await request({ method: 'GET', path: '/api/homa-services/maha-mrityunjaya-homa' });
    assert.strictEqual(res.status, 200);
    const svc = res.data.data;
    assert(svc.category, 'Detail must include category object');
    assert.strictEqual(svc.category.slug, 'shiva-rudra-homa');
  });

  await test('9.3: Admin service serializer includes both categoryId and serialized category', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/homa-services',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const item = res.data.data.find((s) => s.slug === 'maha-mrityunjaya-homa');
    assert(item);
    assert(item.categoryId, 'Admin service must include categoryId');
    assert(item.category, 'Admin service must include serialized category');
    assert.strictEqual(item.category.slug, 'shiva-rudra-homa');
  });

  // =========================================================================
  // SECTION 10: PRICING & BOOKING INTEGRITY VERIFICATION
  // =========================================================================
  console.log('\n--- SECTION 10: Pricing & Booking Integrity Verification ---');

  await test('10.1: Multi-configuration Homa pricing remains identical with categories active', async () => {
    // 1 Havan / 1 Day
    const p1 = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: { serviceType: 'HOMA', serviceSlug: 'maha-mrityunjaya-homa', havanCount: 1, days: 1 },
    });
    assert.strictEqual(p1.status, 200);
    assert.strictEqual(p1.data.data.totalAmount, 11000);

    // 3 Havans / 1 Day
    const p2 = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: { serviceType: 'HOMA', serviceSlug: 'maha-mrityunjaya-homa', havanCount: 3, days: 1 },
    });
    assert.strictEqual(p2.status, 200);
    assert.strictEqual(p2.data.data.totalAmount, 19000);

    // 5 Havans / 2 Days
    const p3 = await request({
      method: 'POST',
      path: '/api/ritual-bookings/calculate-price',
      body: { serviceType: 'HOMA', serviceSlug: 'maha-mrityunjaya-homa', havanCount: 5, days: 2 },
    });
    assert.strictEqual(p3.status, 200);
    assert.strictEqual(p3.data.data.totalAmount, 30500);
  });

  await test('10.2: Booking creation and resolver flow functions seamlessly', async () => {
    const bookingRes = await request({
      method: 'POST',
      path: '/api/ritual-bookings',
      body: {
        serviceType: 'HOMA',
        serviceSlug: 'rudra-homa',
        configuration: {
          commencementDate: '2026-11-10',
          timeSlot: '08:00 AM',
          havanCount: 3,
          days: 1,
          panditCount: 4,
          arrangementMode: 'kashi',
        },
        location: {
          locationType: 'kashi',
          venueDetails: { notes: 'Dashashwamedh Ghat Homa Altar' },
        },
        yajman: {
          name: 'Shiva Rudra Yajman',
          mobile: '9123456789',
          email: 'shiva.yajman@example.com',
          gotra: 'Shandilya',
        },
        sankalp: {
          purpose: 'Spiritual liberation and supreme health',
          mainIntention: 'Shri Rudram Sacred Fire Yagya',
        },
      },
    });

    assert.strictEqual(bookingRes.status, 201);
    const bRef = bookingRes.data.data.bookingReference;
    assert(bRef.startsWith('VEDA-HOMA-'));
    cleanupBookingRefs.push(bRef);

    // Test booking lookup
    const lookupRes = await request({ method: 'GET', path: `/api/ritual-bookings/${bRef}` });
    assert.strictEqual(lookupRes.status, 200);
    assert.strictEqual(lookupRes.data.data.service.type, 'HOMA');
    assert.strictEqual(lookupRes.data.data.service.slug, 'rudra-homa');
    assert.strictEqual(lookupRes.data.data.configuration.havanCount, 3);
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
    await runHomaCategoryE2EVerification();
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('Fatal test error:', err);
    server.close(() => process.exit(1));
  }
});
