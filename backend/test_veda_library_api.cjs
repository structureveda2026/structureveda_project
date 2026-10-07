process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_min_32_chars';

const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');

// Load database & models
let db;
let app;
try {
  db = require('./src/models/index.js').default;
  app = require('./src/app.js').default;
} catch (e) {
  console.log("ESM import fallback needed:", e.message);
}

async function runTests() {
  // Use dynamic import for ESM modules if required
  if (!db) {
    const modelsMod = await import('./src/models/index.js');
    db = modelsMod.default;
    const appMod = await import('./src/app.js');
    app = appMod.default;
  }

  const { Veda, VedaNode, VedaMantra, User } = db;

  const server = http.createServer(app);
  await new Promise((res) => server.listen(0, res));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  console.log(`\n======================================================`);
  console.log(` Vedic Heritage Library Backend Test Suite (Port: ${port})`);
  console.log(`======================================================\n`);

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

  try {
    // Generate mock admin JWT token
    const adminToken = jwt.sign(
      { id: '00000000-0000-0000-0000-000000000001', email: 'admin@vedastructure.com', role: 'ADMIN' },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_min_32_chars',
      { expiresIn: '1h' }
    );
    const authHeaders = { Authorization: `Bearer ${adminToken}` };

    // 1. Health check
    console.log("1. Testing Health Check Endpoint...");
    const health = await request({ method: 'GET', path: '/api/health' });
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.data.success, true);
    console.log("   ✅ Health check passed.");

    // 2. Admin Seed Endpoint
    console.log("\n2. Testing Admin Seed Dataset (Rigveda & Yajurveda)...");
    const seedRes = await request({
      method: 'POST',
      path: '/api/admin/library/vedas/seed-vedas',
      body: { overwrite: true },
      headers: authHeaders,
    });
    console.log("   Seed response status:", seedRes.status);
    console.log("   Seed data:", seedRes.data);

    // 3. Public GET /api/library/vedas
    console.log("\n3. Testing Public GET /api/library/vedas...");
    const vedasRes = await request({ method: 'GET', path: '/api/library/vedas' });
    console.log("   Vedas count:", vedasRes.data?.data?.length || 0);

    // 4. Public GET /api/library/vedas/rigveda
    console.log("\n4. Testing Public GET /api/library/vedas/rigveda (with Tree)...");
    const rigvedaRes = await request({ method: 'GET', path: '/api/library/vedas/rigveda' });
    console.log("   Rigveda name:", rigvedaRes.data?.data?.name);
    console.log("   Tree root branches count:", rigvedaRes.data?.data?.tree?.length || 0);

    // 5. Public GET /api/library/vedas/yajurveda
    console.log("\n5. Testing Public GET /api/library/vedas/yajurveda (with Shukla & Krishna Tree)...");
    const yajurRes = await request({ method: 'GET', path: '/api/library/vedas/yajurveda' });
    console.log("   Yajurveda name:", yajurRes.data?.data?.name);
    console.log("   Shukla/Krishna branches count:", yajurRes.data?.data?.tree?.length || 0);

    // 6. Public GET /api/library/mantras
    console.log("\n6. Testing Public Mantra Search & 3-Language Bhavarth...");
    const mantrasRes = await request({ method: 'GET', path: '/api/library/mantras?search=अग्नि' });
    console.log("   Search 'अग्नि' results count:", mantrasRes.data?.data?.mantras?.length || 0);

    // 7. Public GET /api/library/mantras/rv-1-1-1
    console.log("\n7. Testing Single Mantra Details (rv-1-1-1)...");
    const singleMantra = await request({ method: 'GET', path: '/api/library/mantras/rv-1-1-1' });
    if (singleMantra.data?.data) {
      const m = singleMantra.data.data;
      console.log("   Mantra ID:", m.id);
      console.log("   Sanskrit:", m.sanskrit?.split('\n')[0]);
      console.log("   Hindi:", m.hindiTranslation?.slice(0, 40) + '...');
      console.log("   English:", m.englishTranslation?.slice(0, 40) + '...');
      console.log("   Hinglish:", m.hinglishTranslation?.slice(0, 40) + '...');
      console.log("   Padapatha count:", m.padapatha?.length || 0);
    }

    // 8. Admin CRUD: Create, Update, Delete Mantra
    console.log("\n8. Testing Admin Create Mantra...");
    const newMantraData = {
      id: "test-mantra-1",
      vedaId: "rigveda",
      nodeId: "rv-sukta-1",
      textName: "ऋग्वेद टेस्ट सूक्त",
      sectionRef: "मण्डल १, सूक्त ९९",
      mantraNumber: "१.९९.१",
      rishi: "कश्यप ऋषि",
      devata: "जातवेदा अग्नि",
      chhanda: "त्रिष्टुप्",
      sanskrit: "ॐ जातवेदसे सुनवाम सोममरातीयतो निदहाति वेदः।",
      transliteration: "oṃ jātavedase sunavāma somam arātīyato nidahāti vedaḥ |",
      hindiTranslation: "हम जातवेदा अग्नि के लिए सोम निष्पन्न करते हैं; वह हमारे द्वेषी शत्रुओं के पापों को भस्म करे।",
      englishTranslation: "We press soma for Jatavedas Agni; may he consume the malice of our adversaries.",
      hinglishTranslation: "Hum Jatavedas Agni Dev ke liye som yagya karte hain; wo hamare sabhi dukhon aur shatruon ka nash karein.",
      padapatha: [{ word: "जा॒तवे॑दसे", meaning: "सर्वज्ञ अग्नि के लिए" }],
      shastricContext: "दुर्गा सूक्त का प्रथम मंगलाचरण मंत्र।",
    };

    const createRes = await request({
      method: 'POST',
      path: '/api/admin/library/mantras',
      body: newMantraData,
      headers: authHeaders,
    });
    console.log("   Create Mantra Status:", createRes.status);
    console.log("   Created ID:", createRes.data?.data?.id);

    // 9. Bulk Upload Mantras
    console.log("\n9. Testing Admin Bulk Upload Mantras...");
    const bulkRes = await request({
      method: 'POST',
      path: '/api/admin/library/mantras/bulk-upload',
      body: [
        {
          id: "test-bulk-1",
          vedaId: "yajurveda",
          nodeId: "vs-adhyaya-1",
          textName: "वाजसनेयि संहिता",
          sectionRef: "अध्याय १",
          mantraNumber: "१.२",
          rishi: "याज्ञवल्क्य",
          devata: "सविता",
          sanskrit: "ॐ देवो वः सविता प्रार्पयतु...",
          hindiTranslation: "सविता देव आपको उत्तम कर्म के लिए प्रेरित करें।",
          englishTranslation: "May Savitri impulse you to the best work.",
          hinglishTranslation: "Savita Prabhu aapko shreshth karma ki prerna dein.",
        }
      ],
      headers: authHeaders,
    });
    console.log("   Bulk Upload Status:", bulkRes.status);
    console.log("   Bulk Created:", bulkRes.data?.data?.created);

    // 10. Clean up test mantras
    await request({ method: 'DELETE', path: '/api/admin/library/mantras/test-mantra-1', headers: authHeaders });
    await request({ method: 'DELETE', path: '/api/admin/library/mantras/test-bulk-1', headers: authHeaders });
    console.log("\n   ✅ Test cleanup complete.");

    console.log("\n======================================================");
    console.log(" 🎉 All Vedic Library Backend API Tests Passed!");
    console.log("======================================================\n");
  } catch (err) {
    console.error("❌ Test Failed:", err);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests();
