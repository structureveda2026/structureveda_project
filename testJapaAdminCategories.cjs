const http = require("http");
const fs = require("fs");
const path = require("path");

const API_BASE = "http://localhost:5000";

function makeRequest(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlStr);
    const headers = { ...(options.headers || {}) };
    let dataStr = null;
    if (options.body) {
      dataStr =
        typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body);
      headers["Content-Length"] = Buffer.byteLength(dataStr);
    }

    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port || 80,
      path: parsed.pathname + parsed.search,
      method: options.method || "GET",
      headers,
    };

    const req = http.request(reqOptions, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch {
          json = body;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
        });
      });
    });

    req.on("error", (err) => reject(err));

    if (dataStr) {
      req.write(dataStr);
    }
    req.end();
  });
}

const jwt = require("./backend/node_modules/jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_change_this";

async function runTests() {
  console.log("\n==================================================");
  console.log("PHASE 3A: JAPA ADMIN CATEGORY TEST SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;
  let createdCatId = null;
  let adminToken = null;
  let userToken = null;
  const testTimestamp = Date.now();
  const testSlug = `test-japa-cat-${testTimestamp}`;
  const testName = `Test Rudra Japa Category ${testTimestamp}`;
  const updatedTestName = `Updated Rudra Japa Category ${testTimestamp}`;

  function assert(condition, name, details = "") {
    if (condition) {
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${name} ${details ? "- " + details : ""}`);
      failed++;
    }
  }

  try {
    // 0. Setup Auth Tokens
    console.log("[Setup] Generating Admin & User JWT Tokens...");
    adminToken = jwt.sign(
      {
        id: "12db9f31-e424-42f2-85e2-c7e669cf2e00",
        email: "admin@vedastructure.com",
        role: "admin",
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    const userToken = jwt.sign(
      {
        id: "70e47eda-8789-449b-9938-cd8d64751f67",
        email: "user@vedastructure.com",
        role: "user",
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    // 1. Admin Category List Loads
    console.log("\n[Test 1] Admin Category List Loads");
    const listRes = await makeRequest(`${API_BASE}/api/admin/japa-categories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    assert(
      listRes.status === 200,
      "Admin categories list returns status 200",
      `Got ${listRes.status}`
    );
    assert(
      listRes.data && listRes.data.success === true,
      "Response payload has success=true"
    );
    assert(
      Array.isArray(listRes.data.data) && listRes.data.data.length >= 7,
      "Admin categories list returns all canonical categories (count >= 7)",
      `Found ${listRes.data.data ? listRes.data.data.length : 0}`
    );

    // 2. Public / Non-Admin Access Rejected
    console.log("\n[Test 2] Public / Non-Admin Authorization Enforcement");
    const unauthRes = await makeRequest(
      `${API_BASE}/api/admin/japa-categories`,
      {
        method: "GET",
      }
    );
    assert(
      unauthRes.status === 401,
      "Unauthenticated request to admin categories returns 401 Unauthorized",
      `Got ${unauthRes.status}`
    );

    const userRes = await makeRequest(`${API_BASE}/api/admin/japa-categories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    assert(
      userRes.status === 403,
      "Standard user token receives 403 Forbidden on admin categories",
      `Got ${userRes.status}`
    );

    // 3. Category Search Works
    console.log("\n[Test 3] Category Search Filter Works");
    const searchRes = await makeRequest(
      `${API_BASE}/api/admin/japa-categories?search=shiva`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    assert(
      searchRes.status === 200,
      "Search request returns status 200",
      `Got ${searchRes.status}`
    );
    const searchData = searchRes.data.data || [];
    assert(
      searchData.length >= 1 &&
        searchData.some((c) => c.slug.includes("shiva")),
      "Search for 'shiva' returns Shiva Japa category",
      `Found ${searchData.length}`
    );

    // 4. Status Filtering Works
    console.log("\n[Test 4] Status Filtering (isActive=true/false)");
    const activeRes = await makeRequest(
      `${API_BASE}/api/admin/japa-categories?isActive=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    assert(
      activeRes.status === 200,
      "isActive=true filter returns status 200"
    );
    const activeCategories = activeRes.data.data || [];
    assert(
      activeCategories.every((c) => c.isActive === true),
      "All returned categories have isActive === true"
    );

    // 5. Create Category Works
    console.log("\n[Test 5] Create New Japa Category");
    const createRes = await makeRequest(
      `${API_BASE}/api/admin/japa-categories`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: {
          name: testName,
          slug: testSlug,
          description: "A consecrated test category for sacred Mantra Japa chantings.",
          iconName: "Sparkles",
          displayOrder: 99,
          isActive: true,
        },
      }
    );
    assert(
      createRes.status === 201,
      "Category creation returns status 201 Created",
      `Got ${createRes.status}`
    );
    assert(
      createRes.data && createRes.data.success === true,
      "Create response payload has success=true"
    );
    assert(
      createRes.data.data && createRes.data.data.slug === testSlug,
      "Created category has matching slug",
      `Expected ${testSlug}, got ${createRes.data.data?.slug}`
    );
    createdCatId = createRes.data.data?.id;

    // 6. Validation - Required Name
    console.log("\n[Test 6] Validation - Missing Required Name");
    const invalidNameRes = await makeRequest(
      `${API_BASE}/api/admin/japa-categories`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: {
          slug: `invalid-cat-${Date.now()}`,
          name: "",
        },
      }
    );
    assert(
      invalidNameRes.status === 400,
      "Creation without name returns status 400 Bad Request",
      `Got ${invalidNameRes.status}`
    );

    // 7. Duplicate Slug Conflict Handling
    console.log("\n[Test 7] Duplicate Slug Returns 409 Conflict");
    const dupRes = await makeRequest(`${API_BASE}/api/admin/japa-categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: {
        name: "Duplicate Slug Japa Category",
        slug: testSlug,
      },
    });
    assert(
      dupRes.status === 409,
      "Reusing slug returns status 409 Conflict",
      `Got ${dupRes.status}`
    );

    // 8. Category Detail Loads by ID
    console.log("\n[Test 8] Category Detail Loads by ID");
    const detailRes = await makeRequest(
      `${API_BASE}/api/admin/japa-categories/${createdCatId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    assert(
      detailRes.status === 200,
      "Category detail returns status 200",
      `Got ${detailRes.status}`
    );
    assert(
      detailRes.data.data && detailRes.data.data.name === testName,
      "Category detail contains correct category name"
    );
    assert(
      detailRes.data.data && detailRes.data.data.displayOrder === 99,
      "Category detail contains correct display order (99)"
    );

    // 9. Edit Category Works
    console.log("\n[Test 9] Edit Category (PUT)");
    const updateRes = await makeRequest(
      `${API_BASE}/api/admin/japa-categories/${createdCatId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: {
          name: updatedTestName,
          displayOrder: 100,
          description: "Updated description for test Japa category.",
        },
      }
    );
    assert(
      updateRes.status === 200,
      "Update category returns status 200",
      `Got ${updateRes.status}`
    );
    assert(
      updateRes.data.data && updateRes.data.data.name === updatedTestName,
      "Category name successfully updated",
      `Got ${updateRes.data.data?.name}`
    );
    assert(
      updateRes.data.data && updateRes.data.data.displayOrder === 100,
      "Category display order updated to 100"
    );

    // 10. Deactivate Category Works (Soft Delete)
    console.log("\n[Test 10] Deactivate Category (DELETE /api/admin/japa-categories/:id)");
    const deactRes = await makeRequest(
      `${API_BASE}/api/admin/japa-categories/${createdCatId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    assert(
      deactRes.status === 200,
      "Deactivation returns status 200",
      `Got ${deactRes.status}`
    );
    assert(
      deactRes.data.data && deactRes.data.data.isActive === false,
      "Category marked as isActive=false"
    );

    // 11. Inactive Category Remains Visible to Admin
    console.log("\n[Test 11] Inactive Category Visible in Admin List");
    const adminInactiveList = await makeRequest(
      `${API_BASE}/api/admin/japa-categories?search=${encodeURIComponent(updatedTestName)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    assert(
      adminInactiveList.status === 200,
      "Admin query returns 200"
    );
    const foundAdminDeact = adminInactiveList.data.data?.find(
      (c) => c.id === createdCatId
    );
    assert(
      foundAdminDeact && foundAdminDeact.isActive === false,
      "Inactive category is present in admin list with isActive === false"
    );

    // 12. Inactive Category Disappears from Public Customer APIs
    console.log("\n[Test 12] Inactive Category Hidden from Customer API");
    const publicCatList = await makeRequest(
      `${API_BASE}/api/japa-categories`,
      {
        method: "GET",
      }
    );
    assert(
      publicCatList.status === 200,
      "Customer categories endpoint returns status 200"
    );
    const foundInPublic = publicCatList.data.data?.find(
      (c) => c.id === createdCatId
    );
    assert(
      !foundInPublic,
      "Deactivated category does NOT appear in public GET /api/japa-categories"
    );

    const publicDetailRes = await makeRequest(
      `${API_BASE}/api/japa-categories/${testSlug}`,
      {
        method: "GET",
      }
    );
    assert(
      publicDetailRes.status === 404,
      "Deactivated category slug returns 404 on customer endpoint",
      `Got ${publicDetailRes.status}`
    );

    // 13. Reactivate Category Works
    console.log("\n[Test 13] Reactivate Category (PUT isActive=true)");
    const reactRes = await makeRequest(
      `${API_BASE}/api/admin/japa-categories/${createdCatId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: {
          isActive: true,
        },
      }
    );
    assert(
      reactRes.status === 200,
      "Reactivation returns status 200",
      `Got ${reactRes.status}`
    );
    assert(
      reactRes.data.data && reactRes.data.data.isActive === true,
      "Category marked as isActive=true"
    );

    // 14. Existing Service Relationships Remain Safe
    console.log("\n[Test 14] Existing Japa Services Remain Intact");
    const servicesRes = await makeRequest(
      `${API_BASE}/api/japa-services`,
      {
        method: "GET",
      }
    );
    assert(
      servicesRes.status === 200,
      "Public Japa services endpoint returns status 200"
    );
    assert(
      servicesRes.data.data && servicesRes.data.data.length >= 8,
      "All canonical Japa services remain loaded and untouched (count >= 8)",
      `Found ${servicesRes.data.data ? servicesRes.data.data.length : 0}`
    );

    // 15. Frontend Files Verification
    console.log("\n[Test 15] Frontend Admin File Existence & Structure");
    const adminDir = path.resolve(__dirname, "admin-veda-structure/src");

    const japaCategoriesPath = path.join(adminDir, "pages/JapaCategories.tsx");
    const japaCategoryFormPath = path.join(adminDir, "pages/JapaCategoryForm.tsx");
    const japaCategoryDetailPath = path.join(adminDir, "pages/JapaCategoryDetail.tsx");
    const japaCategoryIconPath = path.join(adminDir, "components/JapaCategoryIcon.tsx");
    const japaCategoryServicePath = path.join(adminDir, "services/japaCategoryAdminService.ts");

    assert(fs.existsSync(japaCategoriesPath), "JapaCategories.tsx exists");
    assert(fs.existsSync(japaCategoryFormPath), "JapaCategoryForm.tsx exists");
    assert(fs.existsSync(japaCategoryDetailPath), "JapaCategoryDetail.tsx exists");
    assert(fs.existsSync(japaCategoryIconPath), "JapaCategoryIcon.tsx exists");
    assert(fs.existsSync(japaCategoryServicePath), "japaCategoryAdminService.ts exists");

    // 16. Sidebar Navigation
    console.log("\n[Test 16] Sidebar Navigation Integration");
    const sidebarPath = path.join(adminDir, "components/Sidebar.tsx");
    const sidebarContent = fs.readFileSync(sidebarPath, "utf8");
    assert(
      sidebarContent.includes("Japa Categories"),
      "Sidebar.tsx contains 'Japa Categories' label"
    );
    assert(
      sidebarContent.includes("/admin/japa/categories"),
      "Sidebar.tsx links to '/admin/japa/categories'"
    );

    // 17. App.tsx Route Registration
    console.log("\n[Test 17] App.tsx Route Registrations");
    const appPath = path.join(adminDir, "App.tsx");
    const appContent = fs.readFileSync(appPath, "utf8");
    assert(
      appContent.includes('path="japa/categories" element={<JapaCategories />}'),
      "App.tsx registers 'japa/categories' -> JapaCategories"
    );
    assert(
      appContent.includes('path="japa/categories/new" element={<JapaCategoryForm />}'),
      "App.tsx registers 'japa/categories/new' -> JapaCategoryForm"
    );
    assert(
      appContent.includes('path="japa/categories/:id" element={<JapaCategoryDetail />}'),
      "App.tsx registers 'japa/categories/:id' -> JapaCategoryDetail"
    );
    assert(
      appContent.includes('path="japa/categories/:id/edit" element={<JapaCategoryForm />}'),
      "App.tsx registers 'japa/categories/:id/edit' -> JapaCategoryForm"
    );

  } catch (err) {
    console.error("Test execution failed with unhandled exception:", err);
    failed++;
  } finally {
    // Cleanup created test category
    if (createdCatId) {
      console.log("\n[Teardown] Cleaning up test records...");
      try {
        const { execSync } = require("child_process");
        const backendDir = path.resolve(__dirname, "backend");
        execSync(
          `node --env-file=.env -e "import('./src/models/index.js').then(async m => { const { JapaCategory } = m; await JapaCategory.destroy({ where: { id: '${createdCatId}' } }); process.exit(0); });"`,
          { cwd: backendDir, stdio: "ignore" }
        );
        console.log("  ✓ Test category permanently purged from database.");
      } catch (cleanupErr) {
        console.warn("  ! Note: Could not purge test category:", cleanupErr.message);
      }
    }
  }

  console.log("\n==================================================");
  console.log(`PHASE 3A RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
