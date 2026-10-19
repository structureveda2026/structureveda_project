process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_min_32_chars';

const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');

async function runTests() {
  console.log(`\n======================================================`);
  console.log(` Mantra-Stotra 7 Branches & Dynamic Blog Verification`);
  console.log(`======================================================\n`);

  let appMod;
  try {
    appMod = await import('./src/app.js');
  } catch (err) {
    console.error("Failed to load app:", err);
    process.exit(1);
  }

  const app = appMod.default;
  const server = http.createServer(app);
  await new Promise((res) => server.listen(0, res));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Test server running on port: ${port}`);

  const request = ({ method, path, body, headers = {} }) => {
    return new Promise((resolve, reject) => {
      const jsonBody = body !== undefined && body !== null ? JSON.stringify(body) : null;
      const reqHeaders = {
        'Content-Type': 'application/json',
        ...headers,
      };
      if (jsonBody) {
        reqHeaders['Content-Length'] = Buffer.byteLength(jsonBody);
      }

      const req = http.request(
        `${baseUrl}${path}`,
        { method, headers: reqHeaders },
        (res) => {
          let rawData = '';
          res.on('data', (chunk) => { rawData += chunk; });
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

  const adminToken = jwt.sign(
    { id: '00000000-0000-0000-0000-000000000001', email: 'admin@vedastructure.com', role: 'ADMIN' },
    process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_min_32_chars',
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

  // --- SECTION 1: Mantra-Stotra 7 Branches CRUD & Reorder ---
  console.log("\n--- SECTION 1: Mantra-Stotra Branches Endpoints ---");

  await test("GET /api/library/categories/mantra-stotra/subcategories (Public & Initial 7 branches)", async () => {
    const res = await request({
      method: 'GET',
      path: '/api/library/categories/mantra-stotra/subcategories',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.data.length >= 7, `Expected at least 7 branches, got ${res.data.data.length}`);
    const deities = res.data.data.map(b => b.deity);
    assert.ok(deities.includes("shiva"), "Shiva branch should exist");
    assert.ok(deities.includes("vishnu"), "Vishnu branch should exist");
    assert.ok(deities.includes("devi"), "Devi branch should exist");
    assert.ok(deities.includes("gayatri"), "Gayatri branch should exist");
    assert.ok(deities.includes("ganesh"), "Ganesh branch should exist");
    assert.ok(deities.includes("surya"), "Surya branch should exist");
    assert.ok(deities.includes("hanuman"), "Hanuman branch should exist");
  });

  let createdBranchId = null;

  await test("POST /api/library/categories/mantra-stotra/subcategories (Create new branch)", async () => {
    const payload = {
      name: "कार्तिकेय एवं सुब्रह्मण्य मंत्र",
      enName: "Kartikeya & Subrahmanya Mantras",
      slug: "kartikeya",
      desc: "स्कन्द षष्ठी, षण्मुख स्तोत्र एवं मुरुगन महामंत्र।",
      stats: "५+ स्तोत्र व मंत्र",
      badge: "षष्ठी व स्तुति",
      deity: "kartikeya",
      orderIndex: 8,
      status: "ACTIVE",
    };
    const res = await request({
      method: 'POST',
      path: '/api/library/categories/mantra-stotra/subcategories',
      body: payload,
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.id);
    createdBranchId = res.data.data.id;
    assert.strictEqual(res.data.data.name, "कार्तिकेय एवं सुब्रह्मण्य मंत्र");
    assert.strictEqual(res.data.data.deity, "kartikeya");
  });

  await test("PUT /api/library/categories/mantra-stotra/subcategories/:id (Update branch)", async () => {
    assert.ok(createdBranchId, "createdBranchId must exist");
    const updatePayload = {
      name: "श्री कार्तिकेय एवं मुरुगन मंत्र",
      stats: "८+ स्तोत्र व मंत्र",
      badge: "स्कन्द व स्तुति",
    };
    const res = await request({
      method: 'PUT',
      path: `/api/library/categories/mantra-stotra/subcategories/${createdBranchId}`,
      body: updatePayload,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.name, "श्री कार्तिकेय एवं मुरुगन मंत्र");
    assert.strictEqual(res.data.data.stats, "८+ स्तोत्र व मंत्र");
  });

  await test("PUT /api/library/categories/mantra-stotra/subcategories/reorder (Reorder branches)", async () => {
    const listRes = await request({
      method: 'GET',
      path: '/api/library/categories/mantra-stotra/subcategories',
    });
    const ids = listRes.data.data.map(b => b.id);
    assert.ok(ids.length > 2);
    // Reverse order
    const reversed = [...ids].reverse();
    const res = await request({
      method: 'PUT',
      path: '/api/library/categories/mantra-stotra/subcategories/reorder',
      body: { orderedIds: reversed },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));
    assert.strictEqual(res.data.data[0].id, reversed[0]);
  });

  await test("DELETE /api/library/categories/mantra-stotra/subcategories/:id (Delete branch)", async () => {
    assert.ok(createdBranchId, "createdBranchId must exist");
    const res = await request({
      method: 'DELETE',
      path: `/api/library/categories/mantra-stotra/subcategories/${createdBranchId}`,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
  });

  // --- SECTION 2: Dynamic Blog / Articles / Mantra / Sukta / Custom Upload ---
  console.log("\n--- SECTION 2: Dynamic Blog / Sacred Verse Endpoints ---");

  let createdMantraBlogId = null;
  let createdCustomTypeBlogId = null;

  await test("POST /api/admin/library/blogs (Create sacred Mantra post with full Sanskrit metadata)", async () => {
    const mantraPayload = {
      title: "Maha Mrityunjaya Mantra: The Sacred Cosmic Healing Verse",
      titleHi: "महामृत्युंजय मंत्र: संजीवनी रहस्य एवं संपूर्ण साधना विधान",
      content: "<p>The Maha Mrityunjaya Mantra from Rigveda Mandala 7 is a moksha and healing mantra.</p>",
      contentHi: "<p>महामृत्युंजय मंत्र ऋग्वेद के सातवें मण्डल का अत्यंत दिव्य और अमोघ संजीवनी मंत्र है।</p>",
      category: "Mantras & Stotrams",
      postType: "mantra",
      sanskrit: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥",
      transliteration: "oṃ tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam | urvārukamiva bandhanānmṛtyormukṣīya māmṛtāt ||",
      deity: "shiva",
      rishi: "महर्षि वशिष्ठ (Maharshi Vashishtha)",
      chhandas: "अनुष्टुप् (Anushtup)",
      meaning: "हम त्रिनेत्रधारी भगवान शिव की उपासना करते हैं, जो समस्त लोकों को जीवन सुगंध और पुष्टि प्रदान करते हैं।",
      vidhi: "प्रातःकाल पूर्व या उत्तर दिशा की ओर मुख कर रुद्राक्ष की माला से १०८ बार जप करें।",
      benefits: "अकाल मृत्यु से रक्षा, मानसिक शांति, असाध्य रोगों का निवारण और आत्मिक उन्नति।",
      status: "Published",
      author: "Vedic Scholar",
      tags: ["Lord Shiva", "Maha Mrityunjaya", "Vedic Chanting"],
    };

    const res = await request({
      method: 'POST',
      path: '/api/admin/library/blogs',
      body: mantraPayload,
      headers: authHeaders,
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.id);
    createdMantraBlogId = res.data.data.id;
    assert.strictEqual(res.data.data.postType, "mantra");
    assert.strictEqual(res.data.data.deity, "shiva");
    assert.strictEqual(res.data.data.rishi, "महर्षि वशिष्ठ (Maharshi Vashishtha)");
    assert.strictEqual(res.data.data.chhandas, "अनुष्टुप् (Anushtup)");
    assert.ok(res.data.data.sanskrit.includes("त्र्यम्बकं"));
    assert.ok(res.data.data.transliteration.includes("tryambakaṃ"));
    assert.ok(res.data.data.meaning.includes("त्रिनेत्रधारी"));
    assert.ok(res.data.data.vidhi.includes("रुद्राक्ष"));
    assert.ok(res.data.data.benefits.includes("अकाल मृत्यु"));
  });

  await test("POST /api/admin/library/blogs (Create Custom Type: 'Stuti' with custom deity)", async () => {
    const customTypePayload = {
      title: "Sri Rudrashtakam: Divine Hymn of Devotion",
      titleHi: "नमामीशमीशान निर्वाणरूपं: श्री रुद्राष्टकम स्तुति",
      content: "<p>Composed by Goswami Tulsidas in the Uttarakanda of Ramcharitmanas.</p>",
      contentHi: "<p>गोस्वामी तुलसीदास जी द्वारा रचित भगवान शिव की परम पावन स्तुति।</p>",
      category: "Mantras & Stotrams",
      postType: "stuti",
      sanskrit: "नमामीशमीशान निर्वाणरूपं विभुं व्यापकं ब्रह्मवेदस्वरूपम्।",
      transliteration: "namāmīśamīśāna nirvāṇarūpaṃ vibhuṃ vyāpakaṃ brahmavedasvarūpam |",
      deity: "shiva-rudra",
      rishi: "गोस्वामी तुलसीदास (Goswami Tulsidas)",
      chhandas: "भुजंगप्रयात (Bhujangaprayata)",
      meaning: "हे मोक्ष स्वरूप, सर्वव्यापक, ब्रह्म एवं वेद स्वरूप ईशान शिव! मैं आपको नमन करता हूँ।",
      vidhi: "सोमवार अथवा प्रदोष काल में बिल्वपत्र अर्पित करते हुए सस्वर पाठ करें।",
      benefits: "सभी प्रकार के भय, पाप और ग्रह दोषों का समूल नाश होता है।",
      status: "Published",
      author: "Veda Structure Team",
    };

    const res = await request({
      method: 'POST',
      path: '/api/admin/library/blogs',
      body: customTypePayload,
      headers: authHeaders,
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.id);
    createdCustomTypeBlogId = res.data.data.id;
    assert.strictEqual(res.data.data.postType, "stuti");
    assert.strictEqual(res.data.data.deity, "shiva-rudra");
    assert.ok(res.data.data.sanskrit.includes("नमामीशमीशान"));
  });

  await test("GET /api/admin/library/blogs/:id (Verify all sacred verse fields retrieved)", async () => {
    assert.ok(createdMantraBlogId);
    const res = await request({
      method: 'GET',
      path: `/api/admin/library/blogs/${createdMantraBlogId}`,
      headers: authHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    const blog = res.data.data;
    assert.strictEqual(blog.postType, "mantra");
    assert.strictEqual(blog.deity, "shiva");
    assert.ok(blog.sanskrit.includes("त्र्यम्बकं"));
    assert.ok(blog.meaning.includes("त्रिनेत्रधारी"));
    assert.ok(blog.vidhi.includes("रुद्राक्ष"));
    assert.ok(blog.benefits.includes("अकाल मृत्यु"));
  });

  await test("PUT /api/admin/library/blogs/:id (Update sacred verse fields)", async () => {
    assert.ok(createdMantraBlogId);
    const updatePayload = {
      benefits: "अकाल मृत्यु से रक्षा, समग्र स्वास्थ्य, दीर्घायु एवं मोक्ष प्राप्ति।",
      readTime: "7 min read",
    };
    const res = await request({
      method: 'PUT',
      path: `/api/admin/library/blogs/${createdMantraBlogId}`,
      body: updatePayload,
      headers: authHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.benefits.includes("दीर्घायु"));
  });

  await test("GET /api/library/blogs (Public listing and postType filter)", async () => {
    const res = await request({
      method: 'GET',
      path: '/api/library/blogs?postType=mantra',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.blogs);
  });

  await test("GET /api/admin/library/blogs/stats (Admin blog statistics)", async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/library/blogs/stats',
      headers: authHeaders,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(typeof res.data.data.totalBlogs === 'number');
  });

  // Clean up created test blogs
  if (createdMantraBlogId) {
    await request({
      method: 'DELETE',
      path: `/api/admin/library/blogs/${createdMantraBlogId}`,
      headers: authHeaders,
    });
  }
  if (createdCustomTypeBlogId) {
    await request({
      method: 'DELETE',
      path: `/api/admin/library/blogs/${createdCustomTypeBlogId}`,
      headers: authHeaders,
    });
  }

  server.close();

  console.log(`\n======================================================`);
  console.log(` Summary: ${passedTests}/${totalTests} tests passed`);
  console.log(`======================================================\n`);

  if (passedTests !== totalTests) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
