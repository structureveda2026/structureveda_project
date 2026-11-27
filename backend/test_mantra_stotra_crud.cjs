process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_min_32_chars';
process.env.STORAGE_PROVIDER = 'local';

const http = require('http');
const net = require('net');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { spawn } = require('child_process');
const jwt = require('jsonwebtoken');

const TINY_PNG_BUFFER = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
);

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

function rawHttpRequest(urlStr, { method = 'GET', headers = {}, bodyBuffer = null } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method,
        headers,
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          const text = buf.toString('utf8');
          let json = null;
          try {
            json = JSON.parse(text);
          } catch {
            json = text;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: json,
            raw: buf,
          });
        });
      }
    );
    req.on('error', reject);
    if (bodyBuffer) req.write(bodyBuffer);
    req.end();
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log(' Storage, LibraryBranch & LibraryMantraStotra CRUD Suite');
  console.log('======================================================\n');

  const appMod = await import('./src/app.js');
  const app = appMod.default;
  const server = http.createServer(app);
  await new Promise((res) => server.listen(0, '127.0.0.1', res));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Test server running on port: ${port}`);

  const request = ({ method, path: reqPath, body, headers = {} }) => {
    const jsonBody = body !== undefined && body !== null ? JSON.stringify(body) : null;
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (jsonBody) {
      reqHeaders['Content-Length'] = Buffer.byteLength(jsonBody);
    }
    return rawHttpRequest(`${baseUrl}${reqPath}`, {
      method,
      headers: reqHeaders,
      bodyBuffer: jsonBody ? Buffer.from(jsonBody) : null,
    });
  };

  const adminToken = jwt.sign(
    { id: '00000000-0000-0000-0000-000000000001', email: 'admin@vedastructure.com', role: 'ADMIN' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  const authHeaders = { Authorization: `Bearer ${adminToken}` };

  let passedTests = 0;
  let totalTests = 0;

  const test = async (name, fn) => {
    totalTests++;
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`❌ FAIL: ${name}`, err);
    }
  };

  // --- SECTION 1: LocalStorageProvider & Static /uploads ---
  console.log('\n--- SECTION 1: Storage Upload, Static /uploads & Delete ---');
  let uploadedPublicId = null;
  let uploadedUrlPath = null;

  await test('POST /api/admin/uploads/images requires admin auth (401)', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/uploads/images',
      body: {},
    });
    assert.strictEqual(res.status, 401);
  });

  await test('POST /api/admin/uploads/images (LocalStorageProvider) uploads PNG & returns URL', async () => {
    const boundary = `----VedaBoundary${Date.now()}`;
    const partHeader = Buffer.from(
      `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="folder"\r\n\r\n` +
        `test-uploads\r\n` +
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="file"; filename="test-deity.png"\r\n` +
        `Content-Type: image/png\r\n\r\n`
    );
    const partFooter = Buffer.from(`\r\n--${boundary}--\r\n`);
    const bodyBuffer = Buffer.concat([partHeader, TINY_PNG_BUFFER, partFooter]);

    const res = await rawHttpRequest(`${baseUrl}/api/admin/uploads/images`, {
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': bodyBuffer.length,
      },
      bodyBuffer,
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.url.includes('/uploads/'));
    assert.ok(res.data.data.publicId.startsWith('test-uploads/'));
    uploadedPublicId = res.data.data.publicId;
    uploadedUrlPath = new URL(res.data.data.url).pathname;
  });

  await test('GET /uploads/... returns 200 with CORS & Cross-Origin-Resource-Policy headers', async () => {
    assert.ok(uploadedUrlPath, 'uploadedUrlPath must exist');
    const res = await rawHttpRequest(`${baseUrl}${uploadedUrlPath}`, { method: 'GET' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers['access-control-allow-origin'], '*');
    assert.strictEqual(res.headers['cross-origin-resource-policy'], 'cross-origin');
    assert.deepStrictEqual(res.raw, TINY_PNG_BUFFER);
  });

  await test('DELETE /api/admin/uploads/images rejects path traversal', async () => {
    const res = await request({
      method: 'DELETE',
      path: '/api/admin/uploads/images?publicId=../../package.json',
      headers: authHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.success, false);
    assert.ok(fs.existsSync(path.join(__dirname, 'package.json')));
  });

  await test('DELETE /api/admin/uploads/images removes uploaded test file cleanly', async () => {
    assert.ok(uploadedPublicId, 'uploadedPublicId must exist');
    const res = await request({
      method: 'DELETE',
      path: `/api/admin/uploads/images?publicId=${encodeURIComponent(uploadedPublicId)}`,
      headers: authHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.success, true);

    const checkRes = await rawHttpRequest(`${baseUrl}${uploadedUrlPath}`, { method: 'GET' });
    assert.strictEqual(checkRes.status, 404);

    // Remove empty test-uploads subdir so backend/uploads/ stays clean
    const testDir = path.join(__dirname, 'uploads', 'test-uploads');
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  // --- SECTION 2: LibraryBranch Separation, Aliases, Counts & Reorder ---
  console.log('\n--- SECTION 2: LibraryBranch Separation & Aliases ---');

  await test('GET /api/library/categories/mantra/subcategories & alias /mantras/ return 10 mantra branches with itemCount', async () => {
    const res1 = await request({ method: 'GET', path: '/api/library/categories/mantra/subcategories' });
    const res2 = await request({ method: 'GET', path: '/api/library/categories/mantras/subcategories' });
    assert.strictEqual(res1.status, 200);
    assert.strictEqual(res2.status, 200);
    assert.strictEqual(res1.data.data.length, 10);
    assert.strictEqual(res2.data.data.length, 10);
    assert.ok(res1.data.data.every((b) => b.categorySlug === 'mantra'));
    assert.ok(res1.data.data.every((b) => typeof b.itemCount === 'number'));
  });

  await test('GET /api/library/categories/stotra/subcategories & aliases /stotram/, /stotras/ return 8 stotra branches', async () => {
    const res1 = await request({ method: 'GET', path: '/api/library/categories/stotra/subcategories' });
    const res2 = await request({ method: 'GET', path: '/api/library/categories/stotram/subcategories' });
    const res3 = await request({ method: 'GET', path: '/api/library/categories/stotras/subcategories' });
    assert.strictEqual(res1.status, 200);
    assert.strictEqual(res2.status, 200);
    assert.strictEqual(res3.status, 200);
    assert.strictEqual(res1.data.data.length, 8);
    assert.strictEqual(res2.data.data.length, 8);
    assert.strictEqual(res3.data.data.length, 8);
    assert.ok(res1.data.data.every((b) => b.categorySlug === 'stotra'));
  });

  await test('GET /api/library/categories/mantra-stotra/subcategories returns 18 combined branches', async () => {
    const res = await request({ method: 'GET', path: '/api/library/categories/mantra-stotra/subcategories' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.length, 18);
  });

  let overlapMantraBranchId = null;
  let overlapStotraBranchId = null;

  await test('Create, update & delete overlapping slug across mantra and stotra without collision', async () => {
    const createMantra = await request({
      method: 'POST',
      path: '/api/admin/library/categories/mantra/subcategories',
      headers: authHeaders,
      body: {
        name: 'स्कन्द मंत्र शाखा',
        enName: 'Skanda Mantra Branch',
        slug: 'skanda-overlap',
        deity: 'skanda',
        orderIndex: 20,
      },
    });
    assert.strictEqual(createMantra.status, 201);
    overlapMantraBranchId = createMantra.data.data.id;

    const createStotra = await request({
      method: 'POST',
      path: '/api/admin/library/categories/stotra/subcategories',
      headers: authHeaders,
      body: {
        name: 'स्कन्द स्तोत्र शाखा',
        enName: 'Skanda Stotra Branch',
        slug: 'skanda-overlap',
        deity: 'skanda',
        orderIndex: 20,
      },
    });
    assert.strictEqual(createStotra.status, 201);
    overlapStotraBranchId = createStotra.data.data.id;
    assert.notStrictEqual(overlapMantraBranchId, overlapStotraBranchId);

    const updMantra = await request({
      method: 'PUT',
      path: `/api/admin/library/categories/mantra/subcategories/${overlapMantraBranchId}`,
      headers: authHeaders,
      body: { enName: 'Skanda Mantra Updated' },
    });
    assert.strictEqual(updMantra.status, 200);
    assert.strictEqual(updMantra.data.data.enName, 'Skanda Mantra Updated');

    const delMantra = await request({
      method: 'DELETE',
      path: `/api/admin/library/categories/mantra/subcategories/${overlapMantraBranchId}`,
      headers: authHeaders,
    });
    const delStotra = await request({
      method: 'DELETE',
      path: `/api/admin/library/categories/stotra/subcategories/${overlapStotraBranchId}`,
      headers: authHeaders,
    });
    assert.strictEqual(delMantra.status, 200);
    assert.strictEqual(delStotra.status, 200);
  });

  await test('POST duplicate (categorySlug, slug) returns 409 & preserves existing branch', async () => {
    const beforeRes = await request({
      method: 'GET',
      path: '/api/admin/library/categories/mantra/subcategories/shiva',
      headers: authHeaders,
    });
    assert.strictEqual(beforeRes.status, 200);
    const originalBranch = beforeRes.data.data.branch;
    assert.strictEqual(originalBranch.id, 'branch-mantra-shiva');

    const dupRes = await request({
      method: 'POST',
      path: '/api/admin/library/categories/mantra/subcategories',
      headers: authHeaders,
      body: {
        name: 'Dup Shiva',
        slug: 'shiva',
      },
    });
    assert.strictEqual(dupRes.status, 409);
    assert.strictEqual(dupRes.data.success, false);

    const afterRes = await request({
      method: 'GET',
      path: '/api/admin/library/categories/mantra/subcategories/shiva',
      headers: authHeaders,
    });
    assert.strictEqual(afterRes.status, 200);
    assert.strictEqual(afterRes.data.data.branch.id, originalBranch.id);
    assert.strictEqual(afterRes.data.data.branch.name, originalBranch.name);
  });

  await test('PUT branch renaming slug to existing branch slug in same category returns 409', async () => {
    const tempCreate = await request({
      method: 'POST',
      path: '/api/admin/library/categories/mantra/subcategories',
      headers: authHeaders,
      body: {
        name: 'Temp Collision Branch',
        slug: 'temp-collision-branch',
        deity: 'temp',
      },
    });
    assert.strictEqual(tempCreate.status, 201);
    const tempId = tempCreate.data.data.id;

    try {
      const collideRes = await request({
        method: 'PUT',
        path: `/api/admin/library/categories/mantra/subcategories/${tempId}`,
        headers: authHeaders,
        body: { slug: 'vishnu' },
      });
      assert.strictEqual(collideRes.status, 409);
      assert.strictEqual(collideRes.data.success, false);
    } finally {
      await request({
        method: 'DELETE',
        path: `/api/admin/library/categories/mantra/subcategories/${tempId}`,
        headers: authHeaders,
      });
    }
  });

  await test('POST branch with explicit existing id returns 409 & preserves original branch', async () => {
    const beforeRes = await request({
      method: 'GET',
      path: '/api/admin/library/categories/mantra/subcategories/shiva',
      headers: authHeaders,
    });
    assert.strictEqual(beforeRes.status, 200);
    const original = beforeRes.data.data.branch;
    assert.strictEqual(original.id, 'branch-mantra-shiva');

    const adminHijack = await request({
      method: 'POST',
      path: '/api/admin/library/categories/mantra/subcategories',
      headers: authHeaders,
      body: {
        id: 'branch-mantra-shiva',
        slug: 'hijacked-shiva-slug',
        name: 'Hijacked Admin Branch',
      },
    });
    assert.strictEqual(adminHijack.status, 409);
    assert.strictEqual(adminHijack.data.success, false);

    const publicHijack = await request({
      method: 'POST',
      path: '/api/library/categories/mantra/subcategories',
      body: {
        id: 'branch-mantra-shiva',
        slug: 'hijacked-public-slug',
        name: 'Hijacked Public Branch',
      },
    });
    assert.strictEqual(publicHijack.status, 409);
    assert.strictEqual(publicHijack.data.success, false);

    const afterRes = await request({
      method: 'GET',
      path: '/api/admin/library/categories/mantra/subcategories/shiva',
      headers: authHeaders,
    });
    assert.strictEqual(afterRes.status, 200);
    assert.strictEqual(afterRes.data.data.branch.id, original.id);
    assert.strictEqual(afterRes.data.data.branch.slug, original.slug);
    assert.strictEqual(afterRes.data.data.branch.name, original.name);
  });

  await test('PUT branch with empty or whitespace name returns 400 & preserves name', async () => {
    const beforeRes = await request({
      method: 'GET',
      path: '/api/admin/library/categories/mantra/subcategories/shiva',
      headers: authHeaders,
    });
    assert.strictEqual(beforeRes.status, 200);
    const originalName = beforeRes.data.data.branch.name;

    const wsRes = await request({
      method: 'PUT',
      path: '/api/admin/library/categories/mantra/subcategories/branch-mantra-shiva',
      headers: authHeaders,
      body: { name: '   ' },
    });
    assert.strictEqual(wsRes.status, 400);
    assert.strictEqual(wsRes.data.success, false);

    const emptyRes = await request({
      method: 'PUT',
      path: '/api/admin/library/categories/mantra/subcategories/branch-mantra-shiva',
      headers: authHeaders,
      body: { name: '' },
    });
    assert.strictEqual(emptyRes.status, 400);

    const afterRes = await request({
      method: 'GET',
      path: '/api/admin/library/categories/mantra/subcategories/shiva',
      headers: authHeaders,
    });
    assert.strictEqual(afterRes.status, 200);
    assert.strictEqual(afterRes.data.data.branch.name, originalName);
  });

  await test('GET /api/library/categories/:categorySlug/subcategories/:slug returns { branch, items } & 404 on unknown', async () => {
    const mantraShiva = await request({
      method: 'GET',
      path: '/api/library/categories/mantra/subcategories/shiva',
    });
    assert.strictEqual(mantraShiva.status, 200);
    assert.strictEqual(mantraShiva.data.data.branch.slug, 'shiva');
    assert.strictEqual(mantraShiva.data.data.branch.categorySlug, 'mantra');
    assert.ok(mantraShiva.data.data.items.length >= 1);
    assert.ok(mantraShiva.data.data.items.every((i) => i.type === 'mantra'));

    const combinedShiva = await request({
      method: 'GET',
      path: '/api/library/categories/mantra-stotra/subcategories/shiva',
    });
    assert.strictEqual(combinedShiva.status, 200);
    const types = new Set(combinedShiva.data.data.items.map((i) => i.type));
    assert.ok(types.has('mantra') && types.has('stotra'), 'Combined shiva branch should contain both mantra and stotra items');

    const notFound = await request({
      method: 'GET',
      path: '/api/library/categories/mantra/subcategories/nonexistent-branch-xyz',
    });
    assert.strictEqual(notFound.status, 404);
  });

  await test('Mixed mantra-stotra reorder updates orderIndex across both categories by id', async () => {
    const listRes = await request({
      method: 'GET',
      path: '/api/admin/library/categories/mantra-stotra/subcategories',
      headers: authHeaders,
    });
    assert.strictEqual(listRes.status, 200);
    const original = listRes.data.data;
    const stotraFirst = original.find((b) => b.categorySlug === 'stotra');
    const mantraFirst = original.find((b) => b.categorySlug === 'mantra');
    assert.ok(stotraFirst && mantraFirst);

    const payload = [
      { id: stotraFirst.id, orderIndex: 1 },
      { id: mantraFirst.id, orderIndex: 2 },
    ];
    const reorderRes = await request({
      method: 'PUT',
      path: '/api/admin/library/categories/mantra/subcategories/reorder',
      headers: authHeaders,
      body: { items: payload },
    });
    assert.strictEqual(reorderRes.status, 200);
    const updatedMantra = reorderRes.data.data.find((b) => b.id === mantraFirst.id);
    assert.ok(updatedMantra, 'updatedMantra must be returned');
    assert.strictEqual(updatedMantra.orderIndex, 2);

    const stotraListRes = await request({
      method: 'GET',
      path: '/api/admin/library/categories/stotra/subcategories',
      headers: authHeaders,
    });
    assert.strictEqual(stotraListRes.status, 200);
    const updatedStotra = stotraListRes.data.data.find((b) => b.id === stotraFirst.id);
    assert.ok(updatedStotra, 'updatedStotra must exist');
    assert.strictEqual(updatedStotra.orderIndex, 1);

    // Restore original order
    await request({
      method: 'PUT',
      path: '/api/admin/library/categories/mantra-stotra/subcategories/reorder',
      headers: authHeaders,
      body: { items: original.map((b, i) => ({ id: b.id, orderIndex: b.orderIndex ?? i + 1 })) },
    });
  });

  // --- SECTION 3: LibraryMantraStotra Admin Auth, CRUD & Public Endpoints ---
  console.log('\n--- SECTION 3: LibraryMantraStotra CRUD & Public Endpoints ---');

  await test('Unauthenticated POST /api/admin/library/mantra-stotras returns 401', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/library/mantra-stotras',
      body: { title: 'Test', sanskrit: 'ॐ' },
    });
    assert.strictEqual(res.status, 401);
  });

  let createdMantraId = null;
  let createdMantraSlug = null;
  let createdDraftId = null;

  await test('POST /api/admin/library/mantra-stotras creates item with branch ref & rich fields (201)', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/library/mantra-stotras',
      headers: authHeaders,
      body: {
        type: 'stotra',
        branchSlug: 'shiva',
        deity: 'Shiva',
        deityHi: 'भगवान शिव',
        title: 'Test Bilvashtakam Stotra',
        titleHi: 'परीक्षण बिल्वाष्टकम् स्तोत्र',
        slug: 'test-bilvashtakam-stotra',
        subtitle: 'Sacred Eight Verses on Bilva Leaves',
        sourceRef: 'Skanda Purana',
        featuredImage: '/uploads/test-deity.png',
        sanskrit: 'त्रिदलं त्रिगुणाकारं त्रिनेत्रं च त्रियायुधम्।',
        hindiTranslation: 'तीन दलों वाला, तीन गुणों से युक्त बिल्वपत्र मैं शिव को अर्पित करता हूँ।',
        englishTranslation: 'I offer the three-leafed Bilva to Lord Shiva.',
        hinglishTranslation: 'Main teen patto wala Bilva patra Bhagwan Shiv ko arpit karta hoon.',
        verses: [
          {
            verseNo: 1,
            sanskrit: 'त्रिदलं त्रिगुणाकारं त्रिनेत्रं च त्रियायुधम्।',
            meaningHi: 'तीन जन्मों के पापों का नाश करने वाला।',
            meaningEn: 'Destroyer of sins of three births.',
          },
        ],
        canonAnga: {
          rishi: 'Adi Shankaracharya',
          chhandas: 'Anushtup',
          devata: 'Lord Shiva',
        },
        vidhi: {
          bestDay: 'Monday & Pradosh',
          sankhya: '1 or 11 Recitations',
        },
        benefits: [{ category: 'Spiritual', textHi: 'शिव कृपा', textEn: 'Grace of Shiva' }],
        tags: ['Shiva', 'Bilvashtakam'],
        isFeatured: true,
        status: 'ACTIVE',
      },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    const item = res.data.data;
    assert.ok(item.id);
    assert.strictEqual(item.slug, 'test-bilvashtakam-stotra');
    assert.strictEqual(item.branchId, 'branch-stotra-shiva');
    assert.ok(item.branch && item.branch.slug === 'shiva');
    assert.strictEqual(item.transliteration, null);
    assert.strictEqual(item.verses.length, 1);
    assert.strictEqual(item.canonAnga.rishi, 'Adi Shankaracharya');
    assert.strictEqual(item.vidhi.bestDay, 'Monday & Pradosh');
    assert.strictEqual(item.benefits.length, 1);
    createdMantraId = item.id;
    createdMantraSlug = item.slug;
  });

  await test('POST /api/admin/library/mantra-stotras rejects duplicate explicit slug in same category (409) & allows same slug in opposite category (201)', async () => {
    const dupRes = await request({
      method: 'POST',
      path: '/api/admin/library/mantra-stotras',
      headers: authHeaders,
      body: {
        type: 'stotra',
        slug: 'test-bilvashtakam-stotra',
        title: 'Duplicate Stotra Slug',
        sanskrit: 'ॐ नमः शिवाय',
      },
    });
    assert.strictEqual(dupRes.status, 409);

    const crossRes = await request({
      method: 'POST',
      path: '/api/admin/library/mantra-stotras',
      headers: authHeaders,
      body: {
        type: 'mantra',
        branchSlug: 'shiva',
        slug: 'test-bilvashtakam-stotra',
        title: 'Cross Category Same Slug Mantra',
        sanskrit: 'ॐ नमः शिवाय',
      },
    });
    assert.strictEqual(crossRes.status, 201);
    const crossId = crossRes.data.data.id;
    await request({
      method: 'DELETE',
      path: `/api/admin/library/mantra-stotras/${crossId}`,
      headers: authHeaders,
    });
  });

  await test('GET /api/admin/library/mantra-stotras supports filters, search & pagination.pages', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/library/mantra-stotras?type=stotra&search=Bilvashtakam&page=1&limit=5',
      headers: authHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data.items));
    assert.ok(res.data.data.items.some((i) => i.id === createdMantraId));
    assert.strictEqual(typeof res.data.data.pagination.total, 'number');
    assert.strictEqual(typeof res.data.data.pagination.pages, 'number');
    assert.strictEqual(res.data.data.pagination.limit, 5);
  });

  await test('PUT /api/admin/library/mantra-stotras/:id updates item fields (200)', async () => {
    assert.ok(createdMantraId);
    const res = await request({
      method: 'PUT',
      path: `/api/admin/library/mantra-stotras/${createdMantraId}`,
      headers: authHeaders,
      body: {
        subtitle: 'Updated Sacred Bilva Hymn',
        astrologicalRemedy: 'Chant on Mondays for peace of mind.',
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.subtitle, 'Updated Sacred Bilva Hymn');
    assert.strictEqual(res.data.data.astrologicalRemedy, 'Chant on Mondays for peace of mind.');
  });

  await test('PUT /api/admin/library/mantra-stotras/:id syncs branchId when updating branchSlug alone', async () => {
    const createRes = await request({
      method: 'POST',
      path: '/api/admin/library/mantra-stotras',
      headers: authHeaders,
      body: {
        type: 'mantra',
        branchSlug: 'shiva',
        title: 'Temp Branch Sync Mantra',
        slug: 'temp-branch-sync-mantra',
        sanskrit: 'ॐ नमः शिवाय',
      },
    });
    assert.strictEqual(createRes.status, 201);
    const itemId = createRes.data.data.id;
    assert.strictEqual(createRes.data.data.branchId, 'branch-mantra-shiva');

    try {
      const updBySlug = await request({
        method: 'PUT',
        path: `/api/admin/library/mantra-stotras/${itemId}`,
        headers: authHeaders,
        body: { branchSlug: 'vishnu' },
      });
      assert.strictEqual(updBySlug.status, 200);
      assert.strictEqual(updBySlug.data.data.branchSlug, 'vishnu');
      assert.strictEqual(updBySlug.data.data.branchId, 'branch-mantra-vishnu');
      assert.ok(updBySlug.data.data.branch && updBySlug.data.data.branch.slug === 'vishnu');

      const updById = await request({
        method: 'PUT',
        path: `/api/admin/library/mantra-stotras/${itemId}`,
        headers: authHeaders,
        body: { branchId: 'branch-mantra-shiva' },
      });
      assert.strictEqual(updById.status, 200);
      assert.strictEqual(updById.data.data.branchId, 'branch-mantra-shiva');
      assert.strictEqual(updById.data.data.branchSlug, 'shiva');
      assert.ok(updById.data.data.branch && updById.data.data.branch.slug === 'shiva');
    } finally {
      await request({
        method: 'DELETE',
        path: `/api/admin/library/mantra-stotras/${itemId}`,
        headers: authHeaders,
      });
    }
  });

  await test('PUT /api/admin/library/mantra-stotras/:id rejects empty title or sanskrit (400)', async () => {
    assert.ok(createdMantraId);
    const emptyBothRes = await request({
      method: 'PUT',
      path: `/api/admin/library/mantra-stotras/${createdMantraId}`,
      headers: authHeaders,
      body: { title: '', sanskrit: '' },
    });
    assert.strictEqual(emptyBothRes.status, 400);
    assert.strictEqual(emptyBothRes.data.success, false);

    const wsTitleRes = await request({
      method: 'PUT',
      path: `/api/admin/library/mantra-stotras/${createdMantraId}`,
      headers: authHeaders,
      body: { title: '   ' },
    });
    assert.strictEqual(wsTitleRes.status, 400);

    const wsSanskritRes = await request({
      method: 'PUT',
      path: `/api/admin/library/mantra-stotras/${createdMantraId}`,
      headers: authHeaders,
      body: { sanskrit: '   ' },
    });
    assert.strictEqual(wsSanskritRes.status, 400);

    const verifyRes = await request({
      method: 'GET',
      path: `/api/admin/library/mantra-stotras/${createdMantraId}`,
      headers: authHeaders,
    });
    assert.strictEqual(verifyRes.status, 200);
    assert.strictEqual(verifyRes.data.data.title, 'Test Bilvashtakam Stotra');
    assert.ok(verifyRes.data.data.sanskrit.includes('त्रिदलं'));
  });

  await test('PUT /api/admin/library/mantra-stotras/:id rejects empty or whitespace slug (400)', async () => {
    assert.ok(createdMantraId);
    const emptySlugRes = await request({
      method: 'PUT',
      path: `/api/admin/library/mantra-stotras/${createdMantraId}`,
      headers: authHeaders,
      body: { slug: '' },
    });
    assert.strictEqual(emptySlugRes.status, 400);
    assert.strictEqual(emptySlugRes.data.success, false);

    const wsSlugRes = await request({
      method: 'PUT',
      path: `/api/admin/library/mantra-stotras/${createdMantraId}`,
      headers: authHeaders,
      body: { slug: '   ' },
    });
    assert.strictEqual(wsSlugRes.status, 400);
    assert.strictEqual(wsSlugRes.data.success, false);

    const nullSlugRes = await request({
      method: 'PUT',
      path: `/api/admin/library/mantra-stotras/${createdMantraId}`,
      headers: authHeaders,
      body: { slug: null },
    });
    assert.strictEqual(nullSlugRes.status, 400);

    const verifyRes = await request({
      method: 'GET',
      path: `/api/admin/library/mantra-stotras/${createdMantraId}`,
      headers: authHeaders,
    });
    assert.strictEqual(verifyRes.status, 200);
    assert.strictEqual(verifyRes.data.data.slug, createdMantraSlug);
  });

  await test('PUT /api/admin/library/mantra-stotras/:id handles branchSlug: null, unknown branchId & type switch category sync', async () => {
    const createRes = await request({
      method: 'POST',
      path: '/api/admin/library/mantra-stotras',
      headers: authHeaders,
      body: {
        type: 'mantra',
        branchSlug: 'shiva',
        title: 'Temp Edge Sync Mantra',
        slug: 'temp-edge-sync-mantra',
        sanskrit: 'ॐ नमः शिवाय',
      },
    });
    assert.strictEqual(createRes.status, 201);
    const itemId = createRes.data.data.id;
    assert.strictEqual(createRes.data.data.branchId, 'branch-mantra-shiva');

    try {
      // 1. branchSlug: null clears branchId and branchSlug
      const clearRes = await request({
        method: 'PUT',
        path: `/api/admin/library/mantra-stotras/${itemId}`,
        headers: authHeaders,
        body: { branchSlug: null },
      });
      assert.strictEqual(clearRes.status, 200);
      assert.strictEqual(clearRes.data.data.branchSlug, null);
      assert.strictEqual(clearRes.data.data.branchId, null);
      assert.strictEqual(clearRes.data.data.branch, null);

      // 2. Re-attach shiva, then pass unknown branchId -> clears stale branchSlug to null
      await request({
        method: 'PUT',
        path: `/api/admin/library/mantra-stotras/${itemId}`,
        headers: authHeaders,
        body: { branchSlug: 'shiva' },
      });
      const unknownBranchRes = await request({
        method: 'PUT',
        path: `/api/admin/library/mantra-stotras/${itemId}`,
        headers: authHeaders,
        body: { branchId: 'nonexistent-id' },
      });
      assert.strictEqual(unknownBranchRes.status, 200);
      assert.strictEqual(unknownBranchRes.data.data.branchId, 'nonexistent-id');
      assert.strictEqual(unknownBranchRes.data.data.branchSlug, null);
      assert.strictEqual(unknownBranchRes.data.data.branch, null);

      // 3. Switch type to stotra + branchSlug: vishnu -> syncs categorySlug & branchId to branch-stotra-vishnu
      const typeSwitchRes = await request({
        method: 'PUT',
        path: `/api/admin/library/mantra-stotras/${itemId}`,
        headers: authHeaders,
        body: { type: 'stotra', branchSlug: 'vishnu' },
      });
      assert.strictEqual(typeSwitchRes.status, 200);
      assert.strictEqual(typeSwitchRes.data.data.type, 'stotra');
      assert.strictEqual(typeSwitchRes.data.data.categorySlug, 'stotra');
      assert.strictEqual(typeSwitchRes.data.data.branchSlug, 'vishnu');
      assert.strictEqual(typeSwitchRes.data.data.branchId, 'branch-stotra-vishnu');
      assert.ok(typeSwitchRes.data.data.branch && typeSwitchRes.data.data.branch.id === 'branch-stotra-vishnu');
    } finally {
      await request({
        method: 'DELETE',
        path: `/api/admin/library/mantra-stotras/${itemId}`,
        headers: authHeaders,
      });
    }
  });

  await test('POST /api/admin/library/mantra-stotras/seed seeds idempotently (200)', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/admin/library/mantra-stotras/seed',
      headers: authHeaders,
      body: {},
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.totalItems >= 21);
  });

  await test('Public GET /api/library/mantra-stotras filters ACTIVE-only, featured, branchSlug & type', async () => {
    const draftRes = await request({
      method: 'POST',
      path: '/api/admin/library/mantra-stotras',
      headers: authHeaders,
      body: {
        type: 'mantra',
        branchSlug: 'shiva',
        title: 'Secret Draft Shiva Mantra',
        slug: 'secret-draft-shiva-mantra',
        sanskrit: 'ॐ नमः शिवाय',
        isFeatured: true,
        status: 'DRAFT',
      },
    });
    assert.strictEqual(draftRes.status, 201);
    createdDraftId = draftRes.data.data.id;

    const pubFeatured = await request({
      method: 'GET',
      path: '/api/library/mantra-stotras?type=mantra&featured=true',
    });
    assert.strictEqual(pubFeatured.status, 200);
    assert.ok(pubFeatured.data.data.items.length >= 1);
    assert.ok(pubFeatured.data.data.items.every((i) => i.status === 'ACTIVE' && i.isFeatured === true));
    assert.ok(!pubFeatured.data.data.items.some((i) => i.id === createdDraftId));

    const draftPubDetail = await request({
      method: 'GET',
      path: '/api/library/mantra-stotras/secret-draft-shiva-mantra',
    });
    assert.strictEqual(draftPubDetail.status, 404);

    const byBranch = await request({
      method: 'GET',
      path: '/api/library/mantra-stotras?branchSlug=shiva&type=stotra',
    });
    assert.strictEqual(byBranch.status, 200);
    assert.ok(byBranch.data.data.items.every((i) => i.branchSlug === 'shiva' && i.type === 'stotra'));
  });

  await test('Public GET /api/library/mantra-stotras/:idOrSlug returns branch & increments viewsCount', async () => {
    assert.ok(createdMantraSlug);
    const res1 = await request({
      method: 'GET',
      path: `/api/library/mantra-stotras/${createdMantraSlug}`,
    });
    assert.strictEqual(res1.status, 200);
    assert.ok(res1.data.data.branch);
    const views1 = res1.data.data.viewsCount;

    const res2 = await request({
      method: 'GET',
      path: `/api/library/mantra-stotras/${createdMantraSlug}`,
    });
    assert.strictEqual(res2.status, 200);
    assert.strictEqual(res2.data.data.viewsCount, views1 + 1);
  });

  await test('DELETE /api/admin/library/mantra-stotras/:id removes items -> subsequent GET 404', async () => {
    assert.ok(createdMantraId);
    const del1 = await request({
      method: 'DELETE',
      path: `/api/admin/library/mantra-stotras/${createdMantraId}`,
      headers: authHeaders,
    });
    assert.strictEqual(del1.status, 200);

    if (createdDraftId) {
      await request({
        method: 'DELETE',
        path: `/api/admin/library/mantra-stotras/${createdDraftId}`,
        headers: authHeaders,
      });
    }

    const getAfter = await request({
      method: 'GET',
      path: `/api/library/mantra-stotras/${createdMantraSlug}`,
    });
    assert.strictEqual(getAfter.status, 404);
  });

  server.close();

  // --- SECTION 4: Cold-start server.js with ALLOW_DB_OFFLINE=true ---
  console.log('\n--- SECTION 4: server.js DB-Offline Cold-Start Verification ---');
  await test('node src/server.js boots cleanly with ALLOW_DB_OFFLINE=true & serves /api/health + /api/library/mantra-stotras', async () => {
    const freePort = await getFreePort();
    const child = spawn(process.execPath, [path.join(__dirname, 'src', 'server.js')], {
      cwd: __dirname,
      env: {
        ...process.env,
        PORT: String(freePort),
        NODE_ENV: 'development',
        ALLOW_DB_OFFLINE: 'true',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    try {
      const deadline = Date.now() + 15000;
      let ready = false;
      while (Date.now() < deadline) {
        if (child.exitCode !== null) {
          throw new Error(`server.js exited early (${child.exitCode}): ${stderr || stdout}`);
        }
        try {
          const health = await rawHttpRequest(`http://127.0.0.1:${freePort}/api/health`);
          if (health.status === 200 && health.data.success === true) {
            ready = true;
            break;
          }
        } catch {
          // Wait for listener
        }
        await new Promise((r) => setTimeout(r, 200));
      }
      assert.ok(ready, `server.js did not become ready in time. stdout=${stdout} stderr=${stderr}`);

      const listRes = await rawHttpRequest(`http://127.0.0.1:${freePort}/api/library/mantra-stotras?limit=50`);
      assert.strictEqual(listRes.status, 200);
      assert.strictEqual(listRes.data.success, true);
      assert.ok(Array.isArray(listRes.data.data.items) && listRes.data.data.items.length >= 21);
      assert.ok(listRes.data.data.pagination.total >= 21);
    } finally {
      child.kill('SIGTERM');
    }
  });

  console.log('\n======================================================');
  console.log(` Summary: ${passedTests}/${totalTests} tests passed`);
  console.log('======================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
