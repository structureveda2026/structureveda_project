require('../backend/node_modules/dotenv').config({ path: __dirname + '/../backend/.env' });
const http = require('http');
const assert = require('assert');
const jwt = require('../backend/node_modules/jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Models from backend to verify DB safety
const db = require('../backend/src/models/index.js').default;
const { User, PathService, PathPurpose } = db;

// App from backend
const app = require('../backend/src/app.js').default;

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

const createdTestUsers = [];
const createdTestServiceIds = [];

async function runVerification() {
  console.log('================================================================');
  console.log('PHASE P5-C → P5-G: PATH ADMIN FRONTEND VERIFICATION');
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

  // 1. Verify File Existence
  await test('1. pathServiceCatalogueService.ts exists and exports all methods', () => {
    const filePath = path.join(__dirname, 'src/services/pathServiceCatalogueService.ts');
    assert.ok(fs.existsSync(filePath), 'Service file must exist');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('getPathServices'));
    assert.ok(content.includes('getPathService'));
    assert.ok(content.includes('createPathService'));
    assert.ok(content.includes('updatePathService'));
    assert.ok(content.includes('deletePathService'));
    assert.ok(content.includes('getPathPurposes'));
    assert.ok(content.includes('PATH_FORMAT_LABELS'));
  });

  await test('2. PathServices.tsx list page exists with search and filters', () => {
    const filePath = path.join(__dirname, 'src/pages/PathServices.tsx');
    assert.ok(fs.existsSync(filePath), 'List page file must exist');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('SearchBar'));
    assert.ok(content.includes('FilterDropdown'));
    assert.ok(content.includes('Pagination'));
    assert.ok(content.includes('handleToggleActivate'));
    assert.ok(content.includes('ConfirmDialog'));
    assert.ok(content.includes('Create Path Service'));
  });

  await test('3. PathServiceForm.tsx create/edit form exists with 11 sections', () => {
    const filePath = path.join(__dirname, 'src/pages/PathServiceForm.tsx');
    assert.ok(fs.existsSync(filePath), 'Form page file must exist');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('1. Basic Information'));
    assert.ok(content.includes('2. Purpose & Intention'));
    assert.ok(content.includes('3. Descriptions'));
    assert.ok(content.includes('4. Recitation Formats & Schedule'));
    assert.ok(content.includes('5. Scripture Structure & Targets'));
    assert.ok(content.includes('6. Duration (Days) & Scholar Requirements'));
    assert.ok(content.includes('7. Pricing (Authoritative Backend Model)'));
    assert.ok(content.includes('8. Arrangement & Locations'));
    assert.ok(content.includes('9. Ritual Inclusions & Sacred Prasad'));
    assert.ok(content.includes('10. Media & Imagery'));
    assert.ok(content.includes('11. SEO, FAQs & Publishing Status'));
    assert.ok(content.includes('isOnlySingleOrSameDay'));
  });

  await test('4. PathServiceDetail.tsx detail view exists with comprehensive info', () => {
    const filePath = path.join(__dirname, 'src/pages/PathServiceDetail.tsx');
    assert.ok(fs.existsSync(filePath), 'Detail page file must exist');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('SectionCard'));
    assert.ok(content.includes('Starting Price'));
    assert.ok(content.includes('Duration Hierarchy'));
    assert.ok(content.includes('Vedic Scholars'));
    assert.ok(content.includes('Edit Service'));
    assert.ok(content.includes('Deactivate'));
  });

  await test('5. App.tsx registers all 4 Path Admin routes', () => {
    const filePath = path.join(__dirname, 'src/App.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('path="path-services"'));
    assert.ok(content.includes('path="path-services/new"'));
    assert.ok(content.includes('path="path-services/:id"'));
    assert.ok(content.includes('path="path-services/:id/edit"'));
  });

  await test('6. Sidebar.tsx registers Path Catalogue navigation item', () => {
    const filePath = path.join(__dirname, 'src/components/Sidebar.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('Path Catalogue'));
    assert.ok(content.includes('/admin/path-services'));
  });

  // Setup Admin user & token
  let adminUser = await User.findOne({ where: { role: 'admin', isActive: true } });
  if (!adminUser) {
    adminUser = await User.create({
      fullName: 'P5 Frontend Test Admin',
      email: `p5_fe_admin_${Date.now()}@example.com`,
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

  // 7. API Verification via Service Contract
  await test('7. Admin list API responds with format matching AdminPathServiceListingResponse', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/path-services?page=1&limit=5',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.total >= 8);
    const first = res.data.data[0];
    assert.ok(first.id);
    assert.ok(first.name);
    assert.ok(first.scripture);
    assert.ok(typeof first.startingPrice === 'number');
    assert.ok(Array.isArray(first.availableFormats));
  });

  // 8. Purpose loader responds
  await test('8. Public purpose loader responds with canonical purposes', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/path-services/purposes',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.data.length >= 6);
  });

  // 9. Admin Detail API responds with format matching AdminPathServiceDetail
  let seededPath = await PathService.findOne({ where: { isActive: true } });
  assert.ok(seededPath);

  await test('9. Admin detail API responds with full detail structure', async () => {
    const res = await request({
      method: 'GET',
      path: `/api/admin/path-services/${seededPath.id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.id, seededPath.id);
    assert.ok(Array.isArray(res.data.data.availableFormats));
    assert.ok(Array.isArray(res.data.data.availableDurations));
    assert.ok(typeof res.data.data.sankalpaFields === 'object');
  });

  // 10. Admin Create, Update, and Deactivate cycle
  const testSlug = `frontend-test-path-${Date.now()}`;
  let createdServiceId = null;

  await test('10. Admin can create new Path service via Admin API', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/path-services',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Devi Mahatmyam Frontend Test',
        slug: testSlug,
        scripture: 'Markandeya Purana',
        pathType: 'Vedic Path',
        startingPrice: 5100,
        availableFormats: ['single_session', 'same_day'],
        minimumDays: 1,
        recommendedDays: 1,
        maximumDays: 1,
        minimumPandits: 2,
        recommendedPandits: 3,
        maximumPandits: 5,
        isKashiAvailable: true,
        isRemoteAvailable: true,
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    createdServiceId = res.data.data.id;
    createdTestServiceIds.push(createdServiceId);
  });

  await test('11. Admin can update Path service via Admin API', async () => {
    const res = await request({
      method: 'PUT',
      path: `/api/admin/path-services/${createdServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        shortDescription: 'Updated short description for test.',
        startingPrice: 5500,
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.shortDescription, 'Updated short description for test.');
    assert.strictEqual(res.data.data.startingPrice, 5500);
  });

  await test('12. Admin can soft-deactivate and reactivate Path service', async () => {
    // Deactivate
    const resDel = await request({
      method: 'DELETE',
      path: `/api/admin/path-services/${createdServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(resDel.status, 200);

    // Verify inactive
    const checkInactive = await PathService.findByPk(createdServiceId);
    assert.strictEqual(checkInactive.isActive, false);

    // Reactivate
    const resPut = await request({
      method: 'PUT',
      path: `/api/admin/path-services/${createdServiceId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { isActive: true },
    });
    assert.strictEqual(resPut.status, 200);
    assert.strictEqual(resPut.data.data.isActive, true);
  });

  // Cleanup
  console.log('\nCleaning up QA records...');
  for (const sId of createdTestServiceIds) {
    await PathService.destroy({ where: { id: sId } }).catch(() => {});
  }
  for (const uId of createdTestUsers) {
    await User.destroy({ where: { id: uId } }).catch(() => {});
  }
  console.log('Cleanup complete.');

  console.log('\n================================================================');
  console.log(`TOTAL FRONTEND VERIFICATION TESTS: 12`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

const start = async () => {
  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });

  try {
    await runVerification();
  } finally {
    server.close();
    process.exit(0);
  }
};

start().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
