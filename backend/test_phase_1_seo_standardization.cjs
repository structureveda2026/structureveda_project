require('dotenv').config({ path: __dirname + '/.env' });
const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');

// Load database & models
const db = require('./src/models/index.js').default;
const {
  User,
  PujaService,
  YagyaService,
  HomaService,
  JapaService,
  PathService,
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
            parsedData = rawData ? JSON.parse(rawData) : null;
          } catch {
            parsedData = rawData;
          }
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData,
          });
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (jsonBody) {
      req.write(jsonBody);
    }
    req.end();
  });
};

const cleanupIds = {
  puja: [],
  yagya: [],
  homa: [],
  japa: [],
  path: [],
};

async function runSeoPhase1TestSuite() {
  console.log('================================================================');
  console.log('PHASE 1: VEDA STRUCTURE SEO SYSTEM STANDARDIZATION TEST SUITE');
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

  // Import shared SEO service (ESM dynamic import)
  const seoService = await import('./src/services/seo.service.js');

  console.log('--- SECTION 1: Shared SEO Service Unit Tests ---');

  await test('1.1 normalizeKeywords handles string array, comma-separated string, trimming, and deduplication', () => {
    const fromArray = seoService.normalizeKeywords(['  puja  ', 'kashi', 'puja', '']);
    assert.deepStrictEqual(fromArray, ['puja', 'kashi']);

    const fromString = seoService.normalizeKeywords('ganapati homa, havan varanasi, ganapati homa, , ');
    assert.deepStrictEqual(fromString, ['ganapati homa', 'havan varanasi']);

    const fromEmpty = seoService.normalizeKeywords(null);
    assert.deepStrictEqual(fromEmpty, []);
  });

  await test('1.2 validateSeoInput accepts valid SEO and rejects invalid inputs', () => {
    assert.strictEqual(seoService.validateSeoInput(null).valid, true);
    assert.strictEqual(seoService.validateSeoInput({}).valid, true);

    // Valid canonical URL
    assert.strictEqual(
      seoService.validateSeoInput({ canonicalUrl: 'https://vedastructure.com/yagya-puja/puja/test-slug' }).valid,
      true
    );

    // Invalid canonical URL
    const invalidCanonical = seoService.validateSeoInput({ canonicalUrl: 'invalid-url-without-protocol' });
    assert.strictEqual(invalidCanonical.valid, false);
    assert.ok(invalidCanonical.message.includes('canonicalUrl must be a valid absolute URL'));

    // Base64 ogImage rejection
    const invalidOgImage = seoService.validateSeoInput({ ogImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...' });
    assert.strictEqual(invalidOgImage.valid, false);
    assert.ok(invalidOgImage.message.includes('Base64 image data is not allowed'));

    // Valid ogImage URL
    assert.strictEqual(
      seoService.validateSeoInput({ ogImage: 'https://images.unsplash.com/photo-1' }).valid,
      true
    );

    // Invalid robotsIndex type
    const invalidRobots = seoService.validateSeoInput({ robotsIndex: 'not_a_bool' });
    assert.strictEqual(invalidRobots.valid, false);
  });

  await test('1.3 normalizeSeo formats camelCase, slices lengths, and supports legacy aliases', () => {
    const raw = {
      metaTitle: '  Sacred Vedic Puja in Kashi  ',
      metaDescription: '  Comprehensive Vedic Puja Description  ',
      focus_keyword: '  Vedic Puja  ',
      keywords: 'puja, kashi, ritual',
      canonical_url: 'https://vedastructure.com/puja',
      robots_index: true,
      robots_follow: false,
      og_title: 'OG Title Here',
      og_description: 'OG Desc Here',
      og_image: 'https://vedastructure.com/img.jpg',
    };

    const normalized = seoService.normalizeSeo(raw);
    assert.strictEqual(normalized.title, 'Sacred Vedic Puja in Kashi');
    assert.strictEqual(normalized.description, 'Comprehensive Vedic Puja Description');
    assert.strictEqual(normalized.focusKeyword, 'Vedic Puja');
    assert.deepStrictEqual(normalized.keywords, ['puja', 'kashi', 'ritual']);
    assert.strictEqual(normalized.canonicalUrl, 'https://vedastructure.com/puja');
    assert.strictEqual(normalized.robotsIndex, true);
    assert.strictEqual(normalized.robotsFollow, false);
    assert.strictEqual(normalized.ogTitle, 'OG Title Here');
    assert.strictEqual(normalized.ogDescription, 'OG Desc Here');
    assert.strictEqual(normalized.ogImage, 'https://vedastructure.com/img.jpg');
  });

  await test('1.4 mergeSeo merges partial updates without clearing unmentioned properties', () => {
    const existing = {
      title: 'Original Title',
      description: 'Original Description',
      keywords: ['original', 'tags'],
      focusKeyword: 'Original Focus',
      robotsIndex: true,
    };

    // Update only title and robotsIndex
    const incoming = {
      title: 'Updated Title',
      robotsIndex: false,
    };

    const merged = seoService.mergeSeo(existing, incoming);
    assert.strictEqual(merged.title, 'Updated Title');
    assert.strictEqual(merged.robotsIndex, false);
    assert.strictEqual(merged.description, 'Original Description', 'Description must be preserved');
    assert.deepStrictEqual(merged.keywords, ['original', 'tags'], 'Keywords must be preserved');
    assert.strictEqual(merged.focusKeyword, 'Original Focus', 'focusKeyword must be preserved');

    // Explicitly clearing a property with empty string or null
    const cleared = seoService.mergeSeo(existing, { focusKeyword: '' });
    assert.strictEqual(cleared.focusKeyword, undefined, 'Empty string should clear the property');
    assert.strictEqual(cleared.title, 'Original Title', 'Other fields must remain preserved');
  });

  await test('1.5 generateFallbackSeo builds standard Vedic metadata from service details', () => {
    const fallback = seoService.generateFallbackSeo(
      {
        name: 'Maha Rudrabhishek Puja',
        shortDescription: 'Sacred Shiva Abhishek in Kashi',
        slug: 'maha-rudrabhishek-puja',
        bannerImage: 'https://example.com/banner.jpg',
      },
      'puja'
    );

    assert.strictEqual(fallback.title, 'Maha Rudrabhishek Puja | Veda Structure');
    assert.strictEqual(fallback.canonicalUrl, '/yagya-puja/puja/maha-rudrabhishek-puja');
    assert.strictEqual(fallback.ogImage, 'https://example.com/banner.jpg');
    assert.strictEqual(fallback.robotsIndex, true);
  });

  console.log('\n--- SECTION 2: API & Database Integration Tests ---');

  // Setup Auth Token
  let adminUser = await User.findOne({ where: { role: 'admin', isActive: true } });
  if (!adminUser) {
    adminUser = await User.create({
      fullName: 'SEO Test Admin',
      email: `seo_admin_${Date.now()}@example.com`,
      password: 'hashed_password_123',
      role: 'admin',
      isActive: true,
    });
  }

  const adminToken = jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: 'admin' },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '2h' }
  );

  const authHeaders = {
    Authorization: `Bearer ${adminToken}`,
  };

  // Test 2.1: Puja Service with SEO creation and retrieval
  let createdPujaId = null;
  const pujaSlug = `test-puja-seo-${Date.now()}`;

  await test('2.1 Admin create Puja Service persists complete SEO object', async () => {
    const payload = {
      name: 'Vedic Shanti Puja Test',
      slug: pujaSlug,
      deity: 'Lord Shiva',
      startingPrice: 2100,
      availableMode: 'hybrid',
      shortDescription: 'Peace and harmony ritual.',
      seo: {
        title: 'Vedic Shanti Puja in Kashi | Online Booking',
        description: 'Perform authentic Shanti Puja in Varanasi with Vedic Pandits.',
        focusKeyword: 'Shanti Puja Kashi',
        keywords: ['shanti puja', 'kashi', 'peace ritual'],
        canonicalUrl: 'https://vedastructure.com/yagya-puja/puja/vedic-shanti-puja',
        robotsIndex: true,
        robotsFollow: true,
        ogTitle: 'Vedic Shanti Puja Live Stream',
        ogDescription: 'Experience divine tranquility through Vedic Shanti Puja.',
        ogImage: 'https://images.unsplash.com/photo-shanti',
      },
    };

    const res = await request({
      method: 'POST',
      path: '/api/admin/puja-services',
      headers: authHeaders,
      body: payload,
    });

    assert.strictEqual(res.statusCode, 201, `Expected 201, got ${res.statusCode}: ${JSON.stringify(res.data)}`);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.id, 'Must return created service ID');
    createdPujaId = res.data.data.id;
    cleanupIds.puja.push(createdPujaId);

    // Verify SEO in response
    const seo = res.data.data.seo;
    assert.ok(seo, 'Response must include seo object');
    assert.strictEqual(seo.title, 'Vedic Shanti Puja in Kashi | Online Booking');
    assert.strictEqual(seo.focusKeyword, 'Shanti Puja Kashi');
    assert.deepStrictEqual(seo.keywords, ['shanti puja', 'kashi', 'peace ritual']);
    assert.strictEqual(seo.canonicalUrl, 'https://vedastructure.com/yagya-puja/puja/vedic-shanti-puja');
    assert.strictEqual(seo.robotsIndex, true);
    assert.strictEqual(seo.ogImage, 'https://images.unsplash.com/photo-shanti');
  });

  await test('2.2 Public and Admin Get Puja Service returns serialized SEO object', async () => {
    // Admin GET by ID
    const adminRes = await request({
      method: 'GET',
      path: `/api/admin/puja-services/${createdPujaId}`,
      headers: authHeaders,
    });
    assert.strictEqual(adminRes.statusCode, 200);
    assert.strictEqual(adminRes.data.data.seo.title, 'Vedic Shanti Puja in Kashi | Online Booking');

    // Public GET by Slug
    const publicRes = await request({
      method: 'GET',
      path: `/api/puja-services/${pujaSlug}`,
    });
    assert.strictEqual(publicRes.statusCode, 200);
    assert.strictEqual(publicRes.data.data.seo.title, 'Vedic Shanti Puja in Kashi | Online Booking');
    assert.strictEqual(publicRes.data.data.seo.focusKeyword, 'Shanti Puja Kashi');
  });

  await test('2.3 Puja Service partial SEO update preserves unmentioned properties', async () => {
    // Update only title and robotsIndex
    const updatePayload = {
      seo: {
        title: 'Updated Puja Title via Partial Update',
        robotsIndex: false,
      },
    };

    const res = await request({
      method: 'PUT',
      path: `/api/admin/puja-services/${createdPujaId}`,
      headers: authHeaders,
      body: updatePayload,
    });

    assert.strictEqual(res.statusCode, 200);
    const updatedSeo = res.data.data.seo;
    assert.strictEqual(updatedSeo.title, 'Updated Puja Title via Partial Update');
    assert.strictEqual(updatedSeo.robotsIndex, false);
    // Untouched properties must remain intact
    assert.strictEqual(updatedSeo.focusKeyword, 'Shanti Puja Kashi');
    assert.deepStrictEqual(updatedSeo.keywords, ['shanti puja', 'kashi', 'peace ritual']);
    assert.strictEqual(updatedSeo.canonicalUrl, 'https://vedastructure.com/yagya-puja/puja/vedic-shanti-puja');
    assert.strictEqual(updatedSeo.ogImage, 'https://images.unsplash.com/photo-shanti');
  });

  await test('2.4 Puja Service rejects invalid canonicalUrl with 400', async () => {
    const invalidPayload = {
      seo: {
        canonicalUrl: 'not-a-valid-http-url',
      },
    };

    const res = await request({
      method: 'PUT',
      path: `/api/admin/puja-services/${createdPujaId}`,
      headers: authHeaders,
      body: invalidPayload,
    });

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.data.success, false);
    assert.ok(res.data.message.includes('canonicalUrl must be a valid absolute URL'));
  });

  await test('2.5 Puja Service creation without SEO defaults safely to {} without error', async () => {
    const noSeoSlug = `test-puja-no-seo-${Date.now()}`;
    const payload = {
      name: 'No SEO Puja Service',
      slug: noSeoSlug,
      deity: 'Lord Ganesha',
      startingPrice: 1500,
      availableMode: 'in_person',
    };

    const res = await request({
      method: 'POST',
      path: '/api/admin/puja-services',
      headers: authHeaders,
      body: payload,
    });

    assert.strictEqual(res.statusCode, 201);
    assert.deepStrictEqual(res.data.data.seo, {});
    cleanupIds.puja.push(res.data.data.id);
  });

  // Test 2.6: Yagya Service with SEO creation and retrieval
  let createdYagyaId = null;
  const yagyaSlug = `test-yagya-seo-${Date.now()}`;

  await test('2.6 Admin create Yagya Service persists SEO object', async () => {
    const payload = {
      name: 'Maha Mrityunjaya Yagya Test',
      slug: yagyaSlug,
      deity: 'Lord Shiva',
      startingPrice: 21000,
      availableMode: 'hybrid',
      shortDescription: 'Sacred life protection Yagya.',
      seo: {
        title: 'Maha Mrityunjaya Yagya in Kashi | 7-Day Vedic Ritual',
        description: 'Powerful health and longevity Yagya performed in Varanasi.',
        keywords: 'mrityunjaya, yagya, kashi, health',
        canonicalUrl: 'https://vedastructure.com/yagya-puja/yagya/maha-mrityunjaya',
        robotsIndex: true,
        robotsFollow: true,
      },
    };

    const res = await request({
      method: 'POST',
      path: '/api/admin/yagya-services',
      headers: authHeaders,
      body: payload,
    });

    assert.strictEqual(res.statusCode, 201, `Expected 201, got ${res.statusCode}: ${JSON.stringify(res.data)}`);
    assert.ok(res.data.data.id);
    createdYagyaId = res.data.data.id;
    cleanupIds.yagya.push(createdYagyaId);

    const seo = res.data.data.seo;
    assert.ok(seo);
    assert.strictEqual(seo.title, 'Maha Mrityunjaya Yagya in Kashi | 7-Day Vedic Ritual');
    assert.deepStrictEqual(seo.keywords, ['mrityunjaya', 'yagya', 'kashi', 'health']);
  });

  await test('2.7 Public and Admin Get Yagya Service returns serialized SEO object', async () => {
    // Admin GET by ID
    const adminRes = await request({
      method: 'GET',
      path: `/api/admin/yagya-services/${createdYagyaId}`,
      headers: authHeaders,
    });
    assert.strictEqual(adminRes.statusCode, 200);
    assert.strictEqual(adminRes.data.data.seo.title, 'Maha Mrityunjaya Yagya in Kashi | 7-Day Vedic Ritual');

    // Public GET by Slug
    const publicRes = await request({
      method: 'GET',
      path: `/api/yagya-services/${yagyaSlug}`,
    });
    assert.strictEqual(publicRes.statusCode, 200);
    assert.strictEqual(publicRes.data.data.seo.title, 'Maha Mrityunjaya Yagya in Kashi | 7-Day Vedic Ritual');
  });

  await test('2.8 Yagya Service partial SEO update preserves existing SEO fields', async () => {
    const updatePayload = {
      seo: {
        description: 'Updated Yagya Description via partial update',
      },
    };

    const res = await request({
      method: 'PUT',
      path: `/api/admin/yagya-services/${createdYagyaId}`,
      headers: authHeaders,
      body: updatePayload,
    });

    assert.strictEqual(res.statusCode, 200);
    const updatedSeo = res.data.data.seo;
    assert.strictEqual(updatedSeo.description, 'Updated Yagya Description via partial update');
    // Title and keywords preserved
    assert.strictEqual(updatedSeo.title, 'Maha Mrityunjaya Yagya in Kashi | 7-Day Vedic Ritual');
    assert.deepStrictEqual(updatedSeo.keywords, ['mrityunjaya', 'yagya', 'kashi', 'health']);
  });

  // Test 2.9: Existing Homa Service compatibility with shared SEO service
  let createdHomaId = null;
  const homaSlug = `test-homa-seo-${Date.now()}`;

  await test('2.9 Homa Service preserves compatibility and supports extended SEO properties', async () => {
    const payload = {
      name: 'Maha Ganapati Homa SEO Test',
      slug: homaSlug,
      homaType: 'Vedic Homa',
      basePrice: 5100,
      availableHavanCounts: [1, 3],
      availableDays: [1, 3],
      minimumPandits: 2,
      recommendedPandits: 3,
      maximumPandits: 5,
      seo: {
        title: 'Maha Ganapati Homa in Varanasi | Live Stream',
        description: 'Obstacle removal ceremony in Kashi.',
        keywords: ['ganapati', 'homa', 'kashi'],
        canonicalUrl: 'https://vedastructure.com/yagya-puja/homa/maha-ganapati-homa',
        focusKeyword: 'Ganapati Homa',
      },
    };

    const res = await request({
      method: 'POST',
      path: '/api/admin/homa-services',
      headers: authHeaders,
      body: payload,
    });

    assert.strictEqual(res.statusCode, 201);
    createdHomaId = res.data.data.id;
    cleanupIds.homa.push(createdHomaId);

    const seo = res.data.data.seo;
    assert.strictEqual(seo.title, 'Maha Ganapati Homa in Varanasi | Live Stream');
    assert.strictEqual(seo.canonicalUrl, 'https://vedastructure.com/yagya-puja/homa/maha-ganapati-homa');
    assert.strictEqual(seo.focusKeyword, 'Ganapati Homa');

    // Partial update on Homa preserves focusKeyword and canonicalUrl
    const updateRes = await request({
      method: 'PUT',
      path: `/api/admin/homa-services/${createdHomaId}`,
      headers: authHeaders,
      body: {
        seo: {
          title: 'Updated Ganapati Homa Title',
        },
      },
    });

    assert.strictEqual(updateRes.statusCode, 200);
    assert.strictEqual(updateRes.data.data.seo.title, 'Updated Ganapati Homa Title');
    assert.strictEqual(updateRes.data.data.seo.focusKeyword, 'Ganapati Homa');
    assert.strictEqual(updateRes.data.data.seo.canonicalUrl, 'https://vedastructure.com/yagya-puja/homa/maha-ganapati-homa');
  });

  // Test 2.10: Japa Service compatibility with shared SEO service
  let createdJapaId = null;
  const japaSlug = `test-japa-seo-${Date.now()}`;

  await test('2.10 Japa Service preserves compatibility and supports extended SEO properties', async () => {
    const payload = {
      name: 'Gayatri Mantra Japa SEO Test',
      slug: japaSlug,
      mantra: 'Om Bhur Bhuva Swaha...',
      startingPrice: 3500,
      seo: {
        title: 'Gayatri Mantra Japa in Kashi | 108 Repetitions',
        description: 'Vedic Gayatri chanting by verified Brahmins.',
        keywords: 'gayatri, japa, chanting',
        canonicalUrl: 'https://vedastructure.com/yagya-puja/japa/gayatri-mantra',
      },
    };

    const res = await request({
      method: 'POST',
      path: '/api/admin/japa-services',
      headers: authHeaders,
      body: payload,
    });

    assert.strictEqual(res.statusCode, 201);
    createdJapaId = res.data.data.id;
    cleanupIds.japa.push(createdJapaId);

    const seo = res.data.data.seo;
    assert.strictEqual(seo.title, 'Gayatri Mantra Japa in Kashi | 108 Repetitions');
    assert.deepStrictEqual(seo.keywords, ['gayatri', 'japa', 'chanting']);
  });

  // Test 2.11: Path Service compatibility with shared SEO service
  let createdPathId = null;
  const pathSlug = `test-path-seo-${Date.now()}`;

  await test('2.11 Path Service preserves compatibility and supports extended SEO properties', async () => {
    const payload = {
      name: 'Sundarkand Path SEO Test',
      slug: pathSlug,
      scripture: 'Ramcharitmanas',
      availableFormats: ['multi_day'],
      startingPrice: 4100,
      minimumDays: 1,
      recommendedDays: 1,
      maximumDays: 3,
      minimumPandits: 2,
      recommendedPandits: 3,
      maximumPandits: 5,
      seo: {
        title: 'Sundarkand Path Recitation in Kashi',
        description: 'Sacred recitation for removal of hardship.',
        keywords: ['sundarkand', 'path', 'ramcharitmanas'],
        ogTitle: 'Sundarkand Path Live Stream',
      },
    };

    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: authHeaders,
      body: payload,
    });

    assert.strictEqual(res.statusCode, 201);
    createdPathId = res.data.data.id;
    cleanupIds.path.push(createdPathId);

    const seo = res.data.data.seo;
    assert.strictEqual(seo.title, 'Sundarkand Path Recitation in Kashi');
    assert.strictEqual(seo.ogTitle, 'Sundarkand Path Live Stream');
  });

  // Test 2.12: Existing database records compatibility
  await test('2.12 Existing service records without SEO return {} safely without crashing', async () => {
    // Find an existing Puja service that had no SEO prior to this phase
    const existing = await PujaService.findOne({ order: [['created_at', 'ASC']] });
    if (existing) {
      const res = await request({
        method: 'GET',
        path: `/api/admin/puja-services/${existing.id}`,
        headers: authHeaders,
      });
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.data.data.seo !== undefined, 'seo property must exist');
      assert.strictEqual(typeof res.data.data.seo, 'object');
    }
  });

  console.log('\n================================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    throw new Error(`${failed} tests failed!`);
  }
}

// Server startup & teardown wrapper
async function main() {
  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  try {
    await runSeoPhase1TestSuite();
  } finally {
    // Cleanup created test records
    console.log('Cleaning up test records...');
    try {
      if (cleanupIds.puja.length > 0) {
        await PujaService.destroy({ where: { id: cleanupIds.puja }, force: true });
      }
      if (cleanupIds.yagya.length > 0) {
        await YagyaService.destroy({ where: { id: cleanupIds.yagya }, force: true });
      }
      if (cleanupIds.homa.length > 0) {
        await HomaService.destroy({ where: { id: cleanupIds.homa }, force: true });
      }
      if (cleanupIds.japa.length > 0) {
        await JapaService.destroy({ where: { id: cleanupIds.japa }, force: true });
      }
      if (cleanupIds.path.length > 0) {
        await PathService.destroy({ where: { id: cleanupIds.path }, force: true });
      }
    } catch (cleanErr) {
      console.warn('Cleanup error:', cleanErr.message);
    }

    server.close();
    await db.sequelize.close();
  }
}

main().catch((err) => {
  console.error('Fatal error executing SEO test suite:', err);
  process.exit(1);
});
