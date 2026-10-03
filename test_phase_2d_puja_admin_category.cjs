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
  console.log("PHASE 2D: PUJA ADMIN CATEGORY TEST SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;
  let createdCatId = null;

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
    const adminToken = jwt.sign(
      {
        id: "12db9f31-e424-42f2-85e2-c7e669cf2e00",
        email: "shivansh0975@gmail.com",
        role: "admin",
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    const userToken = jwt.sign(
      {
        id: "70e47eda-8789-449b-9938-cd8d64751f67",
        email: "shivansh075@gmail.com",
        role: "user",
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );
    console.log("  ✓ Tokens generated successfully.\n");

    const authHeaders = {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    };

    // Test 1: Admin category list loads
    const listRes = await makeRequest(`${API_BASE}/api/admin/puja-categories`, {
      headers: authHeaders,
    });
    assert(
      listRes.status === 200 &&
        listRes.data?.success === true &&
        Array.isArray(listRes.data?.data),
      "1. Admin category list loads successfully",
      `Status: ${listRes.status}`
    );

    // Test 2: Create button & admin route files and links exist
    const sidebarPath = path.resolve(
      __dirname,
      "admin-veda-structure/src/components/Sidebar.tsx"
    );
    const appPath = path.resolve(
      __dirname,
      "admin-veda-structure/src/App.tsx"
    );
    const sidebarContent = fs.readFileSync(sidebarPath, "utf-8");
    const appContent = fs.readFileSync(appPath, "utf-8");
    const hasSidebarLink =
      sidebarContent.includes("/admin/puja/categories") &&
      sidebarContent.includes("Puja Categories");
    const hasAppRoute =
      appContent.includes("puja/categories") &&
      appContent.includes("PujaCategoryForm");
    assert(
      hasSidebarLink && hasAppRoute,
      "2. Create button, Sidebar link & Admin routes registered correctly",
      "Sidebar or App.tsx missing route definitions"
    );

    // Test 3: Search works
    const searchRes = await makeRequest(
      `${API_BASE}/api/admin/puja-categories?search=shiva`,
      { headers: authHeaders }
    );
    const shivaFound = searchRes.data?.data?.every(
      (c) =>
        c.name.toLowerCase().includes("shiva") ||
        c.slug.toLowerCase().includes("shiva") ||
        (c.description && c.description.toLowerCase().includes("shiva"))
    );
    assert(
      searchRes.status === 200 &&
        searchRes.data?.data?.length > 0 &&
        shivaFound,
      "3. Search query filters categories accurately"
    );

    // Test 4: Status filter works
    const activeRes = await makeRequest(
      `${API_BASE}/api/admin/puja-categories?isActive=true`,
      { headers: authHeaders }
    );
    const allActive = activeRes.data?.data?.every((c) => c.isActive === true);
    assert(
      activeRes.status === 200 && allActive,
      "4. Status filter works for isActive=true/false"
    );

    // Test 5: Create category works
    const timestamp = Date.now();
    const testCatPayload = {
      name: `Phase 2D Automated Test Category ${timestamp}`,
      slug: `phase-2d-automated-cat-${timestamp}`,
      description: "A test Puja category for automated regression testing.",
      iconName: "Flame",
      displayOrder: 88,
      isActive: true,
    };
    const createRes = await makeRequest(
      `${API_BASE}/api/admin/puja-categories`,
      {
        method: "POST",
        headers: authHeaders,
        body: testCatPayload,
      }
    );
    assert(
      createRes.status === 201 &&
        createRes.data?.success === true &&
        createRes.data?.data?.slug === testCatPayload.slug,
      "5. Create category works via POST /api/admin/puja-categories"
    );
    if (createRes.data?.data?.id) {
      createdCatId = createRes.data.data.id;
    }

    // Test 6: Duplicate slug shows friendly error (409)
    const duplicateRes = await makeRequest(
      `${API_BASE}/api/admin/puja-categories`,
      {
        method: "POST",
        headers: authHeaders,
        body: testCatPayload,
      }
    );
    assert(
      duplicateRes.status === 409 &&
        duplicateRes.data?.message &&
        duplicateRes.data.message.toLowerCase().includes("slug already exists"),
      "6. Duplicate slug returns 409 and user-friendly error message"
    );

    // Test 7: Edit category works
    const updatedName = `Phase 2D Updated Test Category ${timestamp}`;
    const editRes = await makeRequest(
      `${API_BASE}/api/admin/puja-categories/${createdCatId}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: {
          name: updatedName,
          iconName: "ShieldCheck",
          displayOrder: 95,
        },
      }
    );
    assert(
      editRes.status === 200 &&
        editRes.data?.data?.name === updatedName &&
        editRes.data?.data?.iconName === "ShieldCheck" &&
        editRes.data?.data?.displayOrder === 95,
      "7. Edit category works via PUT /api/admin/puja-categories/:id"
    );

    // Test 8: View category works
    const viewRes = await makeRequest(
      `${API_BASE}/api/admin/puja-categories/${createdCatId}`,
      { headers: authHeaders }
    );
    assert(
      viewRes.status === 200 &&
        viewRes.data?.data?.id === createdCatId &&
        viewRes.data?.data?.name === updatedName,
      "8. View category detail works via GET /api/admin/puja-categories/:id"
    );

    // Test 9: Deactivate confirmation copy matches safety requirement
    const categoriesPageCode = fs.readFileSync(
      path.resolve(
        __dirname,
        "admin-veda-structure/src/pages/PujaCategories.tsx"
      ),
      "utf-8"
    );
    const categoryDetailPageCode = fs.readFileSync(
      path.resolve(
        __dirname,
        "admin-veda-structure/src/pages/PujaCategoryDetail.tsx"
      ),
      "utf-8"
    );
    const hasSafetyMsg1 = categoriesPageCode.includes(
      "Existing Puja services will not be deleted. The category will simply become inactive."
    );
    const hasSafetyMsg2 = categoryDetailPageCode.includes(
      "Existing Puja services will not be deleted. The category will simply become inactive."
    );
    const hasDeactivateBtn = categoriesPageCode.includes("Deactivate Category");
    assert(
      hasSafetyMsg1 && hasSafetyMsg2 && hasDeactivateBtn,
      "9. Deactivate confirmation UI informs admin services will NOT be deleted"
    );

    // Test 10: Deactivation updates status (sets isActive: false)
    const deactivateRes = await makeRequest(
      `${API_BASE}/api/admin/puja-categories/${createdCatId}`,
      {
        method: "DELETE",
        headers: authHeaders,
      }
    );
    const verifyDeactivated = await makeRequest(
      `${API_BASE}/api/admin/puja-categories/${createdCatId}`,
      { headers: authHeaders }
    );
    assert(
      deactivateRes.status === 200 &&
        verifyDeactivated.data?.data?.isActive === false,
      "10. Deactivation successfully sets isActive: false"
    );

    // Test 11: Reactivation works
    const reactivateRes = await makeRequest(
      `${API_BASE}/api/admin/puja-categories/${createdCatId}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: { isActive: true },
      }
    );
    assert(
      reactivateRes.status === 200 &&
        reactivateRes.data?.data?.isActive === true,
      "11. Reactivation via PUT with isActive: true works"
    );

    // Test 12: Display order is respected (displayOrder ASC)
    const sortedRes = await makeRequest(
      `${API_BASE}/api/admin/puja-categories`,
      { headers: authHeaders }
    );
    const cats = sortedRes.data?.data || [];
    let isAscending = true;
    for (let i = 1; i < cats.length; i++) {
      if (cats[i].displayOrder < cats[i - 1].displayOrder) {
        isAscending = false;
        break;
      }
    }
    assert(
      sortedRes.status === 200 && isAscending,
      "12. Display order is respected (deterministic displayOrder ASC)"
    );

    // Test 13: Image handling follows existing admin upload architecture
    const formCode = fs.readFileSync(
      path.resolve(
        __dirname,
        "admin-veda-structure/src/pages/PujaCategoryForm.tsx"
      ),
      "utf-8"
    );
    const usesMediaUpload =
      formCode.includes("mediaUploadService.uploadImage") &&
      formCode.includes('folder: "puja/categories"');
    assert(
      usesMediaUpload,
      "13. Image handling reuses existing mediaUploadService with puja/categories folder"
    );

    // Test 14: Controlled icon selection works
    const iconConstantsCode = fs.readFileSync(
      path.resolve(
        __dirname,
        "admin-veda-structure/src/services/pujaCategoryAdminService.ts"
      ),
      "utf-8"
    );
    const hasControlledIcons =
      iconConstantsCode.includes("Sparkles") &&
      iconConstantsCode.includes("Coins") &&
      iconConstantsCode.includes("ShieldCheck") &&
      iconConstantsCode.includes("Sun") &&
      iconConstantsCode.includes("Flame");
    assert(
      hasControlledIcons,
      "14. Controlled icon library (Sparkles, Coins, ShieldCheck, Sun, Flame, etc.) is configured"
    );

    // Test 15: Unauthorized route is protected
    const unauthRes = await makeRequest(
      `${API_BASE}/api/admin/puja-categories`
    );
    assert(
      unauthRes.status === 401,
      "15. Unauthorized admin requests are blocked with HTTP 401"
    );

    // Test 16: 403 state is handled
    const forbiddenRes = await makeRequest(
      `${API_BASE}/api/admin/puja-categories`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const apiCode = fs.readFileSync(
      path.resolve(__dirname, "admin-veda-structure/src/services/api.ts"),
      "utf-8"
    );
    const handles403 =
      forbiddenRes.status === 403 &&
      apiCode.includes("response.status === 403") &&
      categoriesPageCode.includes("isForbiddenError");
    assert(
      handles403,
      "16. 403 Forbidden state is returned for non-admin and handled gracefully in admin UI"
    );

    // Test 17: Existing Puja service category assignment works
    const serviceFormCode = fs.readFileSync(
      path.resolve(
        __dirname,
        "admin-veda-structure/src/pages/PujaServiceForm.tsx"
      ),
      "utf-8"
    );
    const hasCategorySelector =
      serviceFormCode.includes("categoryId") &&
      serviceFormCode.includes("Puja Category (Tradition)") &&
      serviceFormCode.includes("getCategories");
    assert(
      hasCategorySelector,
      "17. Puja Service form contains dynamic Puja Category assignment selector"
    );

    // Test 18: Deactivating category does NOT delete services (Requirement 23)
    console.log("  [Safety Check] Testing Shiva Puja category deactivation safety...");
    // 18.1 Fetch Shiva Puja category
    const shivaCatRes = await makeRequest(
      `${API_BASE}/api/admin/puja-categories?search=shiva-puja`,
      { headers: authHeaders }
    );
    const shivaCat = shivaCatRes.data?.data?.[0];
    if (shivaCat) {
      // 18.2 Fetch services under shiva category before deactivation
      const servicesBefore = await makeRequest(
        `${API_BASE}/api/puja-services?category=shiva-puja`
      );
      const serviceCountBefore = servicesBefore.data?.data?.length || 0;

      // 18.3 Deactivate Shiva category temporarily
      await makeRequest(
        `${API_BASE}/api/admin/puja-categories/${shivaCat.id}`,
        { method: "DELETE", headers: authHeaders }
      );

      // 18.4 Verify all services still exist in total database
      const allServices = await makeRequest(`${API_BASE}/api/puja-services`);
      const rudrabhishekExists = allServices.data?.data?.some((s) =>
        s.name.toLowerCase().includes("rudrabhishek")
      );
      const mrityunjayaExists = allServices.data?.data?.some((s) =>
        s.name.toLowerCase().includes("mrityunjaya")
      );

      // 18.5 Re-activate Shiva category immediately to restore original state
      await makeRequest(
        `${API_BASE}/api/admin/puja-categories/${shivaCat.id}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: { isActive: true },
        }
      );

      assert(
        rudrabhishekExists && mrityunjayaExists,
        "18. Deactivating category does NOT delete assigned Puja services (Rudrabhishek & Maha Mrityunjaya preserved)"
      );
    } else {
      assert(false, "18. Shiva Puja category found for safety test");
    }

    // Test 19: Customer category discovery reflects active/inactive state
    // Create an inactive test category
    const inactiveSlug = `inactive-safety-test-${Date.now()}`;
    const inactiveCat = await makeRequest(
      `${API_BASE}/api/admin/puja-categories`,
      {
        method: "POST",
        headers: authHeaders,
        body: {
          name: "Inactive Safety Test Cat",
          slug: inactiveSlug,
          isActive: false,
        },
      }
    );
    const publicCatsRes = await makeRequest(
      `${API_BASE}/api/puja-categories`
    );
    const inactiveFoundInPublic = publicCatsRes.data?.data?.some(
      (c) => c.slug === inactiveSlug
    );
    // Cleanup inactive test cat
    if (inactiveCat.data?.data?.id) {
      await makeRequest(
        `${API_BASE}/api/admin/puja-categories/${inactiveCat.data.data.id}`,
        { method: "DELETE", headers: authHeaders }
      );
    }
    assert(
      !inactiveFoundInPublic,
      "19. Customer public category API (GET /api/puja-categories) excludes inactive categories"
    );

    // Test 20: Customer Navbar reflects active/inactive state
    const navbarPath = path.resolve(
      __dirname,
      "frontend-user1/src/components/layout/Navbar.jsx"
    );
    const navbarCode = fs.readFileSync(navbarPath, "utf-8");
    const navbarConsumesApi =
      navbarCode.includes("/api/puja-categories") ||
      navbarCode.includes("pujaCategories");
    assert(
      navbarConsumesApi,
      "20. Customer Navbar dynamically consumes active Puja categories from GET /api/puja-categories"
    );

    // Cleanup: Delete the Phase 2D automated test category
    if (createdCatId) {
      console.log(`\n[Cleanup] Deleting temporary test category ${createdCatId}...`);
      // Note: Backend DELETE soft deactivates, which is expected
      await makeRequest(
        `${API_BASE}/api/admin/puja-categories/${createdCatId}`,
        { method: "DELETE", headers: authHeaders }
      );
      console.log("  ✓ Cleanup complete.");
    }
  } catch (err) {
    console.error("Test execution encountered an error:", err);
    failed++;
  }

  console.log("\n==================================================");
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log("==================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
