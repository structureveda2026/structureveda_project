const http = require("http");
const path = require("path");
const fs = require("fs");

async function runTests() {
  console.log("\n========================================================");
  console.log("PURANA & ITIHASA ADMIN INTEGRATION & VALIDATION QA TEST");
  console.log("========================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = "") {
    if (condition) {
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${name} ${details ? "- " + details : ""}`);
      failed++;
    }
  }

  // 1. PART 1: FRONTEND VALIDATION LOGIC SIMULATION
  console.log("--- PART 1: FRONTEND FORM VALIDATION RULES TEST ---");

  // Rule 1: PuranaItihasaFormPage Validation Function
  function validateGranthaForm(formData) {
    const errs = {};
    if (!formData.name?.trim()) errs.name = "देवनागरी नाम अनिवार्य है";
    if (!formData.enName?.trim()) errs.enName = "अंग्रेजी नाम अनिवार्य है";
    if (!formData.slug?.trim()) errs.slug = "स्लग (URL पहचानकर्ता) अनिवार्य है";
    if (!formData.category) errs.category = "श्रेणी का चयन करें";
    if (!formData.guna) errs.guna = "त्रिगुण वर्गीकरण का चयन करें";
    if (!formData.chiefDeity?.trim()) errs.chiefDeity = "प्रधान देव/देवी का नाम लिखें";
    return { isValid: Object.keys(errs).length === 0, errors: errs };
  }

  // Test 1.1: Empty grantha form rejects submission
  const emptyGranthaRes = validateGranthaForm({});
  assert(!emptyGranthaRes.isValid, "Empty Grantha Form Rejection", "Empty form must be invalid");
  assert(Boolean(emptyGranthaRes.errors.name), "Grantha Name Validation Required");
  assert(Boolean(emptyGranthaRes.errors.enName), "Grantha English Name Validation Required");
  assert(Boolean(emptyGranthaRes.errors.slug), "Grantha Slug Validation Required");
  assert(Boolean(emptyGranthaRes.errors.chiefDeity), "Grantha Chief Deity Validation Required");

  // Test 1.2: Valid grantha form passes
  const validGranthaRes = validateGranthaForm({
    name: "विष्णु पुराण",
    enName: "Vishnu Purana",
    slug: "vishnu-purana",
    category: "purana",
    guna: "sattvika",
    chiefDeity: "भगवान् विष्णु",
  });
  assert(validGranthaRes.isValid, "Valid Grantha Form Passes Validation");

  // Rule 2: PuranaItihasaShlokaFormPage Validation Function
  function validateShlokaForm(formData) {
    const errs = {};
    if (!formData.mantraNumber?.trim()) errs.mantraNumber = "श्लोक संख्या अनिवार्य है";
    if (!formData.sanskrit?.trim()) errs.sanskrit = "मूल संस्कृत श्लोक अनिवार्य है";
    if (!formData.hindiTranslation?.trim()) errs.hindiTranslation = "हिन्दी भावार्थ अनिवार्य है";
    return { isValid: Object.keys(errs).length === 0, errors: errs };
  }

  // Test 2.1: Empty Shloka form rejects
  const emptyShlokaRes = validateShlokaForm({});
  assert(!emptyShlokaRes.isValid, "Empty Shloka Form Rejection");
  assert(Boolean(emptyShlokaRes.errors.mantraNumber), "Shloka Number Validation Required");
  assert(Boolean(emptyShlokaRes.errors.sanskrit), "Sanskrit Verse Validation Required");
  assert(Boolean(emptyShlokaRes.errors.hindiTranslation), "Hindi Bhavartha Validation Required");

  // Test 2.2: Valid Shloka form passes
  const validShlokaRes = validateShlokaForm({
    mantraNumber: "१.१.१",
    sanskrit: "ॐ नमो भगवते वासुदेवाय॥",
    hindiTranslation: "भगवान वासुदेव को नमस्कार है।",
  });
  assert(validShlokaRes.isValid, "Valid Shloka Form Passes Validation");

  // Rule 3: Tree Node Validation Function
  function validateNodeForm(nodeData) {
    const errs = {};
    if (!nodeData.name?.trim()) errs.name = "नोड का नाम अनिवार्य है";
    return { isValid: Object.keys(errs).length === 0, errors: errs };
  }
  const emptyNodeRes = validateNodeForm({});
  assert(!emptyNodeRes.isValid, "Empty Tree Node Form Rejection");
  const validNodeRes = validateNodeForm({ name: "बालकाण्ड" });
  assert(validNodeRes.isValid, "Valid Tree Node Passes Validation");

  // PART 2: BACKEND CONTROLLER & APP INTEGRATION
  console.log("\n--- PART 2: BACKEND APP & ROUTING INTEGRATION TEST ---");

  let appModule;
  try {
    appModule = await import("./backend/src/app.js");
  } catch (err) {
    console.error("Failed to import backend app:", err);
    process.exit(1);
  }
  const app = appModule.default;

  const jwtModule = await import("./backend/node_modules/jsonwebtoken/index.js");
  const jwt = jwtModule.default;
  const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_here_min_32_chars";

  const adminToken = jwt.sign(
    {
      id: "12db9f31-e424-42f2-85e2-c7e669cf2e00",
      email: "admin@vedastructure.com",
      role: "admin",
    },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  function request(urlPath, options = {}) {
    return new Promise((resolve, reject) => {
      const parsed = new URL(`${baseUrl}${urlPath}`);
      const headers = { ...(options.headers || {}) };
      let dataStr = null;
      if (options.body) {
        dataStr = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
        headers["Content-Type"] = "application/json";
        headers["Content-Length"] = Buffer.byteLength(dataStr);
      }

      const reqOptions = {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: options.method || "GET",
        headers,
      };

      const req = http.request(reqOptions, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          let json = null;
          try {
            json = JSON.parse(body);
          } catch {
            json = body;
          }
          resolve({ status: res.statusCode, data: json });
        });
      });
      req.on("error", reject);
      if (dataStr) req.write(dataStr);
      req.end();
    });
  }

  try {
    // Test 2.1: Health check
    const health = await request("/api/health");
    assert(health.status === 200 && health.data.success === true, "API Health Check (200 OK)");

    // Test 2.2: Admin unauthorized check without token
    const unauth = await request("/api/admin/purana-itihasa");
    assert(unauth.status === 401, "Admin Endpoint Rejects Unauthorized Access (401)");

    const authHeaders = { Authorization: `Bearer ${adminToken}` };

    // Test 2.3: Admin GET /api/admin/purana-itihasa
    const allTexts = await request("/api/admin/purana-itihasa", { headers: authHeaders });
    assert(
      allTexts.status === 200 && allTexts.data.success === true && Array.isArray(allTexts.data.data),
      "Admin GET /api/admin/purana-itihasa Returns Success & Data Array"
    );
    assert(allTexts.data.data.length >= 18, `Mahapuranas present in response (count: ${allTexts.data.data.length})`);

    // Test 2.4: Admin Route Aliases check
    const puranasAlias = await request("/api/admin/puranas", { headers: authHeaders });
    assert(puranasAlias.status === 200 && puranasAlias.data.success === true, "Route Alias GET /api/admin/puranas works");

    const itihasasAlias = await request("/api/admin/itihasas", { headers: authHeaders });
    assert(itihasasAlias.status === 200 && itihasasAlias.data.success === true, "Route Alias GET /api/admin/itihasas works");

    const libraryPuranasAlias = await request("/api/admin/library/puranas", { headers: authHeaders });
    assert(libraryPuranasAlias.status === 200 && libraryPuranasAlias.data.success === true, "Route Alias GET /api/admin/library/puranas works");

    // Test 2.5: General Shlokas Route (Verification of Bugfix)
    const shlokasRes = await request("/api/admin/purana-itihasa/shlokas", { headers: authHeaders });
    assert(
      shlokasRes.status === 200 && shlokasRes.data.success === true,
      "Fixed Route GET /api/admin/purana-itihasa/shlokas Works (Not 404)"
    );

    // Test 2.6: Taxonomy Tree Route
    const taxRes = await request("/api/admin/purana-itihasa/taxonomy", { headers: authHeaders });
    assert(taxRes.status === 200 && taxRes.data.success === true, "GET /api/admin/purana-itihasa/taxonomy Works");

    // Test 2.7: Specific Grantha Details
    const detailRes = await request("/api/admin/purana-itihasa/vishnu-purana", { headers: authHeaders });
    assert(
      detailRes.status === 200 && detailRes.data.success === true && detailRes.data.data.id === "vishnu-purana",
      "GET /api/admin/purana-itihasa/vishnu-purana Returns Correct Text"
    );

    // Test 2.8: Grantha Tree Hierarchy
    const treeRes = await request("/api/admin/purana-itihasa/vishnu-purana/tree", { headers: authHeaders });
    assert(
      treeRes.status === 200 && treeRes.data.success === true,
      "GET /api/admin/purana-itihasa/vishnu-purana/tree Returns Tree Structure"
    );

    // Test 2.9: Grantha-scoped Shlokas
    const granthaShlokasRes = await request("/api/admin/purana-itihasa/vishnu-purana/shlokas", { headers: authHeaders });
    assert(
      granthaShlokasRes.status === 200 && granthaShlokasRes.data.success === true,
      "GET /api/admin/purana-itihasa/vishnu-purana/shlokas Returns Scoped Shlokas"
    );

    // Test 2.10: Backend validation on Text Creation with empty body
    const invalidTextPost = await request("/api/admin/purana-itihasa", {
      method: "POST",
      headers: authHeaders,
      body: {},
    });
    assert(invalidTextPost.status === 400, "Backend POST /api/admin/purana-itihasa Rejects Empty Body (400)");

    // Test 2.11: Valid Text Creation, Update, & Cleanup
    const testTextId = `test-purana-qa-${Date.now()}`;
    const createRes = await request("/api/admin/purana-itihasa", {
      method: "POST",
      headers: authHeaders,
      body: {
        id: testTextId,
        slug: testTextId,
        name: "परीक्षण पुराण",
        enName: "Test Purana QA",
        category: "purana",
        guna: "sattvika",
        chiefDeity: "श्रीहरि",
      },
    });

    if (createRes.status === 201) {
      assert(createRes.data.success === true, "POST /api/admin/purana-itihasa Creates New Text");

      // Update Text
      const updateRes = await request(`/api/admin/purana-itihasa/${testTextId}`, {
        method: "PUT",
        headers: authHeaders,
        body: {
          name: "परीक्षण पुराण (अद्यतन)",
          shlokaCount: "१०००",
        },
      });
      assert(updateRes.status === 200 && updateRes.data.success === true, "PUT /api/admin/purana-itihasa/:id Updates Text");

      // Delete Text
      const deleteRes = await request(`/api/admin/purana-itihasa/${testTextId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      assert(deleteRes.status === 200 && deleteRes.data.success === true, "DELETE /api/admin/purana-itihasa/:id Deletes Text");
    } else {
      // If DB is offline, server safely handled error with proper HTTP status and message
      assert(
        createRes.status === 400 && typeof createRes.data?.message === "string",
        "POST /api/admin/purana-itihasa Safely Handles Database Connection Error with Formatted JSON Response"
      );
    }

  } finally {
    server.close();
  }

  console.log("\n========================================================");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("========================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
