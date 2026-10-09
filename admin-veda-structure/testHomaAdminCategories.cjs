require("../backend/node_modules/dotenv").config({
  path: __dirname + "/../backend/.env",
});
const http = require("http");
const fs = require("fs");
const path = require("path");
const jwt = require("../backend/node_modules/jsonwebtoken");

const db = require("../backend/src/models/index.js").default;
const { User } = db;

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

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_change_this";

async function runTests() {
  console.log("\n==================================================");
  console.log("HOMA CATEGORY SYSTEM — PHASE 5");
  console.log("ADMIN CATEGORY SYSTEM & SERVICE INTEGRATION TESTS");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;
  let createdCatId = null;
  const testTimestamp = Date.now();
  const testSlug = `test-homa-cat-${testTimestamp}`;
  const testName = `Test Fire Homa Category ${testTimestamp}`;
  const updatedTestName = `Updated Fire Homa Category ${testTimestamp}`;

  function assert(condition, name, details = "") {
    if (condition) {
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${name} ${details ? "- " + details : ""}`);
      failed++;
    }
  }

  // 0. Setup Auth Tokens
  console.log("[Setup] Finding DB Admin & User accounts...");
  let adminUser = await User.findOne({ where: { role: "admin", isActive: true } });
  if (!adminUser) {
    adminUser = await User.create({
      fullName: "Homa Admin Test User",
      email: `admin_homa_test_${Date.now()}@vedastructure.com`,
      password: "hashed_password_123",
      role: "admin",
      isActive: true,
    });
  }

  let regularUser = await User.findOne({ where: { role: "user", isActive: true } });
  if (!regularUser) {
    regularUser = await User.create({
      fullName: "Homa Customer Test User",
      email: `customer_homa_test_${Date.now()}@vedastructure.com`,
      password: "hashed_password_123",
      role: "user",
      isActive: true,
    });
  }

  const adminToken = jwt.sign(
    {
      id: adminUser.id,
      email: adminUser.email,
      role: "admin",
    },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  const userToken = jwt.sign(
    {
      id: regularUser.id,
      email: regularUser.email,
      role: "user",
    },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  const authHeaders = {
    Authorization: `Bearer ${adminToken}`,
    "Content-Type": "application/json",
  };

  const userAuthHeaders = {
    Authorization: `Bearer ${userToken}`,
    "Content-Type": "application/json",
  };

  try {
    // =========================================================================
    // SECTION 1: STATIC CODE & ARCHITECTURE AUDIT
    // =========================================================================
    console.log("\n--- SECTION 1: Admin Frontend Code & Architectural Integrity ---");

    const adminSrc = path.join(__dirname, "src");

    // 1. Service file exists
    const serviceFilePath = path.join(adminSrc, "services", "homaCategoryAdminService.ts");
    assert(fs.existsSync(serviceFilePath), "1.1 homaCategoryAdminService.ts file exists");
    const serviceCode = fs.readFileSync(serviceFilePath, "utf8");
    assert(
      serviceCode.includes("getCategories") &&
      serviceCode.includes("getCategoryById") &&
      serviceCode.includes("createCategory") &&
      serviceCode.includes("updateCategory") &&
      serviceCode.includes("deleteCategory"),
      "1.2 homaCategoryAdminService implements all required CRUD methods"
    );
    assert(
      serviceCode.includes("SUPPORTED_CATEGORY_ICONS") && serviceCode.includes("ICON_MAP"),
      "1.3 homaCategoryAdminService exports SUPPORTED_CATEGORY_ICONS and ICON_MAP"
    );

    // 2. Icon component
    const iconFilePath = path.join(adminSrc, "components", "HomaCategoryIcon.tsx");
    assert(fs.existsSync(iconFilePath), "1.4 HomaCategoryIcon.tsx component exists");
    const iconCode = fs.readFileSync(iconFilePath, "utf8");
    assert(
      iconCode.includes("HomaCategoryIcon") && iconCode.includes("Flame"),
      "1.5 HomaCategoryIcon handles dynamic icons and Flame fallback"
    );

    // 3. Category Management Pages
    const categoriesPagePath = path.join(adminSrc, "pages", "HomaCategories.tsx");
    assert(fs.existsSync(categoriesPagePath), "1.6 HomaCategories.tsx page exists");
    const categoriesCode = fs.readFileSync(categoriesPagePath, "utf8");
    assert(
      categoriesCode.includes("homaCategoryAdminService") &&
      categoriesCode.includes("ConfirmDialog") &&
      categoriesCode.includes("SearchBar") &&
      categoriesCode.includes("FilterDropdown"),
      "1.7 HomaCategories implements search, status filter, table, and ConfirmDialog"
    );

    const formPagePath = path.join(adminSrc, "pages", "HomaCategoryForm.tsx");
    assert(fs.existsSync(formPagePath), "1.8 HomaCategoryForm.tsx page exists");
    const formCode = fs.readFileSync(formPagePath, "utf8");
    assert(
      formCode.includes("slugify") &&
      formCode.includes("mediaUploadService") &&
      (formCode.includes("validate") || formCode.includes("validateForm")),
      "1.9 HomaCategoryForm handles create/edit, auto-slugify, image upload, and validation"
    );

    const detailPagePath = path.join(adminSrc, "pages", "HomaCategoryDetail.tsx");
    assert(fs.existsSync(detailPagePath), "1.10 HomaCategoryDetail.tsx page exists");
    const detailCode = fs.readFileSync(detailPagePath, "utf8");
    assert(
      detailCode.includes("homaCategoryAdminService") &&
      detailCode.includes("homaServiceCatalogueService") &&
      detailCode.includes("getHomaServices"),
      "1.11 HomaCategoryDetail displays category detail and loads associated Homa services"
    );

    // 4. HomaServices catalogue integration
    const servicesPagePath = path.join(adminSrc, "pages", "HomaServices.tsx");
    const servicesCode = fs.readFileSync(servicesPagePath, "utf8");
    assert(
      servicesCode.includes("categorySlug") &&
      servicesCode.includes("HomaCategoryIcon") &&
      servicesCode.includes("homaCategoryAdminService"),
      "1.12 HomaServices.tsx integrates category state, icons, and dynamic category dropdown"
    );
    assert(
      servicesCode.includes("<th className=\"text-left px-5 py-3.5 font-semibold\">Category</th>") ||
      servicesCode.includes("Category</th>"),
      "1.13 HomaServices table contains Category header column"
    );
    assert(
      servicesCode.includes("Uncategorized"),
      "1.14 HomaServices table displays Uncategorized fallback badge"
    );

    // 5. HomaServiceForm integration & Purpose separation
    const serviceFormPath = path.join(adminSrc, "pages", "HomaServiceForm.tsx");
    const serviceFormCode = fs.readFileSync(serviceFormPath, "utf8");
    assert(
      serviceFormCode.includes("categoryId") &&
      serviceFormCode.includes("homaCategoryAdminService"),
      "1.15 HomaServiceForm has categoryId in form state and loads categories dynamically"
    );
    assert(
      serviceFormCode.includes("id=\"homa-category\"") &&
      serviceFormCode.includes("id=\"homa-purpose\""),
      "1.16 HomaServiceForm has distinct Category and Purpose select dropdowns (Strict Separation)"
    );
    assert(
      serviceFormCode.includes("categoryId: form.categoryId ? form.categoryId : null") ||
      serviceFormCode.includes("categoryId: form.categoryId || null"),
      "1.17 HomaServiceForm properly serializes categoryId in submission payload"
    );

    // 6. HomaServiceDetail integration
    const serviceDetailPath = path.join(adminSrc, "pages", "HomaServiceDetail.tsx");
    const serviceDetailCode = fs.readFileSync(serviceDetailPath, "utf8");
    assert(
      serviceDetailCode.includes("Homa Category") &&
      serviceDetailCode.includes("HomaCategoryIcon"),
      "1.18 HomaServiceDetail displays Category distinctly with HomaCategoryIcon"
    );
    assert(
      serviceDetailCode.includes("Primary Purpose") &&
      serviceDetailCode.includes("Homa Category"),
      "1.19 HomaServiceDetail preserves independent Purpose and Category presentation"
    );

    // 7. App.tsx Routes
    const appPath = path.join(adminSrc, "App.tsx");
    const appCode = fs.readFileSync(appPath, "utf8");
    assert(
      appCode.includes("path=\"homa/categories\"") &&
      appCode.includes("path=\"homa/categories/new\"") &&
      appCode.includes("path=\"homa/categories/:id\"") &&
      appCode.includes("path=\"homa/categories/:id/edit\""),
      "1.20 App.tsx registers canonical Homa Category management routes"
    );
    assert(
      appCode.includes("path=\"homa-categories\"") &&
      appCode.includes("path=\"homa-categories/new\""),
      "1.21 App.tsx registers direct alias routes for homa-categories"
    );

    // 8. Sidebar.tsx Navigation
    const sidebarPath = path.join(adminSrc, "components", "Sidebar.tsx");
    const sidebarCode = fs.readFileSync(sidebarPath, "utf8");
    assert(
      sidebarCode.includes("label: \"Homa Categories\", path: \"/admin/homa/categories\""),
      "1.22 Sidebar.tsx contains Homa Categories menu item"
    );
    assert(
      sidebarCode.includes("/admin/homa/categories") &&
      sidebarCode.includes("/admin/homa-categories"),
      "1.23 Sidebar.tsx tracks Homa Categories route matches for active states"
    );

    // =========================================================================
    // SECTION 2: LIVE BACKEND SECURITY & CATEGORY API VERIFICATION
    // =========================================================================
    console.log("\n--- SECTION 2: Security & Category Admin Endpoints ---");

    // 2.1 Unauthorized request
    const unauthRes = await makeRequest(`${API_BASE}/api/admin/homa-categories`);
    assert(
      unauthRes.status === 401,
      "2.1 GET /api/admin/homa-categories rejects unauthenticated request with 401",
      `Status: ${unauthRes.status}`
    );

    // 2.2 Customer/non-admin request
    const forbiddenRes = await makeRequest(`${API_BASE}/api/admin/homa-categories`, {
      headers: userAuthHeaders,
    });
    assert(
      forbiddenRes.status === 403,
      "2.2 GET /api/admin/homa-categories rejects non-admin token with 403 Forbidden",
      `Status: ${forbiddenRes.status}`
    );

    // 2.3 Admin list categories
    const listRes = await makeRequest(`${API_BASE}/api/admin/homa-categories`, {
      headers: authHeaders,
    });
    assert(
      listRes.status === 200 && Array.isArray(listRes.data?.data),
      "2.3 GET /api/admin/homa-categories returns 200 and data array",
      `Status: ${listRes.status}`
    );

    const categories = listRes.data?.data || [];
    assert(categories.length >= 7, "2.4 Admin category list returns at least 7 canonical categories", `Count: ${categories.length}`);

    // Verify canonical categories exist
    const canonicalSlugs = [
      "shiva-rudra-homa",
      "ganapati-homa",
      "durga-chandi-homa",
      "lakshmi-kubera-homa",
      "navagraha-planetary-homa",
      "vastu-griha-homa",
      "ayushya-longevity-homa",
    ];
    const returnedSlugs = categories.map((c) => c.slug);
    const allCanonicalPresent = canonicalSlugs.every((s) => returnedSlugs.includes(s));
    assert(
      allCanonicalPresent,
      "2.5 All 7 canonical Homa categories are present in admin response",
      `Found: ${returnedSlugs.join(", ")}`
    );

    // 2.6 Active filter
    const activeRes = await makeRequest(`${API_BASE}/api/admin/homa-categories?isActive=true`, {
      headers: authHeaders,
    });
    assert(
      activeRes.status === 200 && activeRes.data?.data?.every((c) => c.isActive === true),
      "2.6 Admin categories filtering by isActive=true returns only active categories"
    );

    // =========================================================================
    // SECTION 3: LIVE CATEGORY CRUD CYCLE
    // =========================================================================
    console.log("\n--- SECTION 3: Live Category CRUD Operations ---");

    // 3.1 Create Category
    const createPayload = {
      name: testName,
      slug: testSlug,
      description: "Test description for Phase 5 verification.",
      iconName: "Flame",
      displayOrder: 99,
      isActive: true,
    };
    const createRes = await makeRequest(`${API_BASE}/api/admin/homa-categories`, {
      method: "POST",
      headers: authHeaders,
      body: createPayload,
    });
    assert(
      createRes.status === 201 && createRes.data?.data?.id,
      "3.1 POST /api/admin/homa-categories creates category with 201 Created",
      `Status: ${createRes.status}`
    );
    createdCatId = createRes.data?.data?.id;

    // 3.2 Duplicate Slug Rejection
    const dupRes = await makeRequest(`${API_BASE}/api/admin/homa-categories`, {
      method: "POST",
      headers: authHeaders,
      body: createPayload,
    });
    assert(
      dupRes.status === 400 || dupRes.status === 409,
      "3.2 POST duplicate category slug correctly rejected with 400 or 409",
      `Status: ${dupRes.status}`
    );

    // 3.3 Get Category by ID
    const getRes = await makeRequest(`${API_BASE}/api/admin/homa-categories/${createdCatId}`, {
      headers: authHeaders,
    });
    assert(
      getRes.status === 200 && getRes.data?.data?.name === testName,
      "3.3 GET /api/admin/homa-categories/:id returns category details",
      `Status: ${getRes.status}`
    );

    // 3.4 Update Category
    const updatePayload = {
      name: updatedTestName,
      description: "Updated description for Phase 5 verification.",
      displayOrder: 100,
    };
    const updateRes = await makeRequest(`${API_BASE}/api/admin/homa-categories/${createdCatId}`, {
      method: "PUT",
      headers: authHeaders,
      body: updatePayload,
    });
    assert(
      updateRes.status === 200 && updateRes.data?.data?.name === updatedTestName,
      "3.4 PUT /api/admin/homa-categories/:id updates category details",
      `Status: ${updateRes.status}`
    );

    // 3.5 Deactivate Category
    const deactRes = await makeRequest(`${API_BASE}/api/admin/homa-categories/${createdCatId}`, {
      method: "PUT",
      headers: authHeaders,
      body: { isActive: false },
    });
    assert(
      deactRes.status === 200 && deactRes.data?.data?.isActive === false,
      "3.5 PUT deactivates category (isActive: false)",
      `Status: ${deactRes.status}`
    );

    // 3.6 Re-activate Category
    const reactRes = await makeRequest(`${API_BASE}/api/admin/homa-categories/${createdCatId}`, {
      method: "PUT",
      headers: authHeaders,
      body: { isActive: true },
    });
    assert(
      reactRes.status === 200 && reactRes.data?.data?.isActive === true,
      "3.6 PUT re-activates category (isActive: true)",
      `Status: ${reactRes.status}`
    );

    // 3.7 Delete Category (cleanup)
    const delRes = await makeRequest(`${API_BASE}/api/admin/homa-categories/${createdCatId}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    assert(
      delRes.status === 200 || delRes.status === 204,
      "3.7 DELETE /api/admin/homa-categories/:id removes category cleanly",
      `Status: ${delRes.status}`
    );
    createdCatId = null;

    // =========================================================================
    // SECTION 4: HOMA SERVICES ↔ CATEGORY INTEGRATION & FILTERING
    // =========================================================================
    console.log("\n--- SECTION 4: Service ↔ Category Live Integration & Purpose Separation ---");

    // 4.1 Admin services list includes category data
    const servicesRes = await makeRequest(`${API_BASE}/api/admin/homa-services`, {
      headers: authHeaders,
    });
    assert(
      servicesRes.status === 200 && Array.isArray(servicesRes.data?.data),
      "4.1 GET /api/admin/homa-services returns 200 with service listing",
      `Status: ${servicesRes.status}`
    );

    const homaServices = servicesRes.data?.data || [];
    assert(homaServices.length >= 8, "4.2 Admin services returns canonical homa services", `Count: ${homaServices.length}`);

    // 4.3 Services have categoryId and category object populated
    const categorizedServices = homaServices.filter((s) => s.categoryId && s.category);
    assert(
      categorizedServices.length >= 8,
      "4.3 All canonical Homa services have categoryId and category object serialized",
      `Categorized: ${categorizedServices.length}/${homaServices.length}`
    );

    // 4.4 Filter by category slug
    const filteredRes = await makeRequest(`${API_BASE}/api/admin/homa-services?category=shiva-rudra-homa`, {
      headers: authHeaders,
    });
    assert(
      filteredRes.status === 200 && Array.isArray(filteredRes.data?.data),
      "4.4 GET /api/admin/homa-services?category=shiva-rudra-homa filters correctly",
      `Status: ${filteredRes.status}`
    );
    const shivaServices = filteredRes.data?.data || [];
    assert(
      shivaServices.length >= 2 &&
      shivaServices.every((s) => s.category?.slug === "shiva-rudra-homa"),
      "4.5 All returned services in filtered response match requested category slug",
      `Found: ${shivaServices.length}`
    );

    // 4.6 Strict separation: Category and Purpose both exist independently
    const sampleService = categorizedServices[0];
    assert(
      sampleService.categoryId !== undefined &&
      sampleService.purposeId !== undefined &&
      sampleService.categoryId !== sampleService.purposeId,
      "4.6 Category and Purpose co-exist independently with separate IDs",
      `Category: ${sampleService.category?.name}, Purpose: ${sampleService.purpose || sampleService.purposeSummary}`
    );

    // 4.7 Detail endpoint returns complete Category and Purpose objects
    const detailSvcRes = await makeRequest(`${API_BASE}/api/admin/homa-services/${sampleService.id}`, {
      headers: authHeaders,
    });
    assert(
      detailSvcRes.status === 200 &&
      detailSvcRes.data?.data?.category &&
      detailSvcRes.data?.data?.categoryId,
      "4.7 GET /api/admin/homa-services/:id includes full category relation",
      `Status: ${detailSvcRes.status}`
    );
    const detailData = detailSvcRes.data?.data;
    assert(
      detailData?.category?.name && detailData?.category?.slug && detailData?.category?.iconName,
      "4.8 Service detail category relation includes name, slug, and iconName"
    );

  } catch (err) {
    console.error("Test execution encountered an error:", err);
    failed++;
  } finally {
    // Safety cleanup in case of unexpected abort
    if (createdCatId) {
      try {
        await makeRequest(`${API_BASE}/api/admin/homa-categories/${createdCatId}`, {
          method: "DELETE",
          headers: authHeaders,
        });
        console.log("[Cleanup] Deleted test category:", createdCatId);
      } catch (cleanupErr) {
        console.warn("[Cleanup] Failed to delete test category:", cleanupErr);
      }
    }
  }

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log("==================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
