const path = require("path");
const http = require("http");
const fs = require("fs");

const backendDir = path.resolve(
  __dirname.includes("modules")
    ? path.join(__dirname, "../../../../../backend")
    : path.join(__dirname, "../backend")
);
const adminSrcDir = path.resolve(
  __dirname.includes("modules")
    ? path.join(__dirname, "../../../..")
    : path.join(__dirname, ".")
);

require(path.join(backendDir, "node_modules/dotenv")).config({
  path: path.join(backendDir, ".env"),
});

const jwt = require(path.join(backendDir, "node_modules/jsonwebtoken"));
const db = require(path.join(backendDir, "src/models/index.js")).default;
const { User, PathCategory, PathService } = db;

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
  console.log("PATH CATEGORY SYSTEM — PHASE 5");
  console.log("ADMIN CATEGORY SYSTEM & SERVICE INTEGRATION TESTS");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;
  let createdCatId = null;
  const testTimestamp = Date.now();
  const testSlug = `test-path-cat-${testTimestamp}`;
  const testName = `Test Scripture Path Category ${testTimestamp}`;
  const updatedTestName = `Updated Scripture Path Category ${testTimestamp}`;

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
      fullName: "Path Admin Test User",
      email: `admin_path_test_${Date.now()}@vedastructure.com`,
      password: "hashed_password_123",
      role: "admin",
      isActive: true,
    });
  }

  let regularUser = await User.findOne({ where: { role: "user", isActive: true } });
  if (!regularUser) {
    regularUser = await User.create({
      fullName: "Path Customer Test User",
      email: `customer_path_test_${Date.now()}@vedastructure.com`,
      password: "hashed_password_123",
      role: "user",
      isActive: true,
    });
  }

  const adminToken = jwt.sign(
    { id: adminUser.id, role: adminUser.role, email: adminUser.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  const customerToken = jwt.sign(
    { id: regularUser.id, role: regularUser.role, email: regularUser.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  const adminHeaders = {
    Authorization: `Bearer ${adminToken}`,
    "Content-Type": "application/json",
  };

  const customerHeaders = {
    Authorization: `Bearer ${customerToken}`,
    "Content-Type": "application/json",
  };

  // ==========================================
  // SECTION 1: ADMIN CATEGORY API & SECURITY
  // ==========================================
  console.log("\n[Section 1: Admin Category API & Security]");

  // 1.1 Unauthenticated requests return 401
  const unauthRes = await makeRequest(`${API_BASE}/api/admin/path-categories`);
  assert(unauthRes.status === 401, "1.1 Unauthenticated GET /api/admin/path-categories returns 401");

  // 1.2 Non-admin requests return 403
  const forbiddenRes = await makeRequest(`${API_BASE}/api/admin/path-categories`, {
    headers: customerHeaders,
  });
  assert(forbiddenRes.status === 403, "1.2 Non-admin GET /api/admin/path-categories returns 403 Forbidden");

  // 1.3 Authenticated admin list categories returns 200
  const listRes = await makeRequest(`${API_BASE}/api/admin/path-categories`, {
    headers: adminHeaders,
  });
  assert(
    listRes.status === 200 && listRes.data?.success === true && Array.isArray(listRes.data?.data),
    "1.3 Admin GET /api/admin/path-categories returns 200 with category list"
  );
  assert(
    listRes.data?.data?.length >= 7,
    "1.4 Category list includes at least the 7 canonical Path categories"
  );

  // 1.5 Create Category via Admin API
  const createPayload = {
    name: testName,
    slug: testSlug,
    description: "Vedic recitation category created by automated admin test",
    iconName: "BookOpen",
    displayOrder: 99,
    isActive: true,
  };
  const createRes = await makeRequest(`${API_BASE}/api/admin/path-categories`, {
    method: "POST",
    headers: adminHeaders,
    body: createPayload,
  });
  assert(
    (createRes.status === 201 || createRes.status === 200) &&
      createRes.data?.success === true &&
      createRes.data?.data?.slug === testSlug,
    "1.5 Admin POST /api/admin/path-categories successfully creates category",
    JSON.stringify(createRes.data)
  );
  if (createRes.data?.data?.id) {
    createdCatId = createRes.data.data.id;
  }

  // 1.6 Duplicate slug rejected with 409
  const dupSlugRes = await makeRequest(`${API_BASE}/api/admin/path-categories`, {
    method: "POST",
    headers: adminHeaders,
    body: createPayload,
  });
  assert(
    dupSlugRes.status === 409,
    "1.6 Duplicate slug creation rejected with 409 Conflict"
  );

  // 1.7 Duplicate name rejected with 409
  const dupNameRes = await makeRequest(`${API_BASE}/api/admin/path-categories`, {
    method: "POST",
    headers: adminHeaders,
    body: {
      ...createPayload,
      slug: `diff-slug-${Date.now()}`,
    },
  });
  assert(
    dupNameRes.status === 409,
    "1.7 Duplicate category name creation rejected with 409 Conflict"
  );

  // 1.8 Get Category by ID returns 200
  const getByIdRes = await makeRequest(
    `${API_BASE}/api/admin/path-categories/${createdCatId}`,
    { headers: adminHeaders }
  );
  assert(
    getByIdRes.status === 200 &&
      getByIdRes.data?.success === true &&
      getByIdRes.data?.data?.id === createdCatId,
    "1.8 Admin GET /api/admin/path-categories/:id returns single category"
  );

  // 1.9 Update Category returns 200
  const updateRes = await makeRequest(
    `${API_BASE}/api/admin/path-categories/${createdCatId}`,
    {
      method: "PUT",
      headers: adminHeaders,
      body: {
        name: updatedTestName,
        iconName: "Scroll",
        displayOrder: 100,
      },
    }
  );
  assert(
    updateRes.status === 200 &&
      updateRes.data?.success === true &&
      updateRes.data?.data?.name === updatedTestName &&
      updateRes.data?.data?.iconName === "Scroll",
    "1.9 Admin PUT /api/admin/path-categories/:id updates category details"
  );

  // 1.10 Soft deactivate category via DELETE returns 200
  const deleteRes = await makeRequest(
    `${API_BASE}/api/admin/path-categories/${createdCatId}`,
    {
      method: "DELETE",
      headers: adminHeaders,
    }
  );
  assert(
    deleteRes.status === 200 &&
      deleteRes.data?.success === true &&
      deleteRes.data?.data?.isActive === false,
    "1.10 Admin DELETE /api/admin/path-categories/:id soft-deactivates category"
  );

  // 1.11 Reactivate category via PUT
  const reactivateRes = await makeRequest(
    `${API_BASE}/api/admin/path-categories/${createdCatId}`,
    {
      method: "PUT",
      headers: adminHeaders,
      body: { isActive: true },
    }
  );
  assert(
    reactivateRes.status === 200 &&
      reactivateRes.data?.success === true &&
      reactivateRes.data?.data?.isActive === true,
    "1.11 Admin PUT /api/admin/path-categories/:id reactivates category"
  );

  // ==========================================
  // SECTION 2: SERVICE INTEGRATION & REASSIGNMENT
  // ==========================================
  console.log("\n[Section 2: Service Integration & Reassignment]");

  // 2.1 Admin service listing returns category fields
  const adminServicesRes = await makeRequest(
    `${API_BASE}/api/admin/path-services?limit=10`,
    { headers: adminHeaders }
  );
  assert(
    adminServicesRes.status === 200 &&
      adminServicesRes.data?.success === true &&
      Array.isArray(adminServicesRes.data?.data),
    "2.1 GET /api/admin/path-services returns services list"
  );
  const sampleService = adminServicesRes.data.data[0];
  assert(
    sampleService && sampleService.categoryId !== undefined,
    "2.2 Service listing item contains categoryId"
  );

  // 2.3 Filter services by category slug
  const filterCatRes = await makeRequest(
    `${API_BASE}/api/admin/path-services?category=shiva-rudri-path`,
    { headers: adminHeaders }
  );
  assert(
    filterCatRes.status === 200 && filterCatRes.data?.success === true,
    "2.3 GET /api/admin/path-services?category=:slug filters by category"
  );
  const shivaServices = filterCatRes.data.data;
  assert(
    shivaServices.length >= 1 &&
      shivaServices.every(
        (s) =>
          s.categorySlug === "shiva-rudri-path" ||
          s.category?.slug === "shiva-rudri-path"
      ),
    "2.4 Returned services strictly belong to shiva-rudri-path category"
  );

  // 2.5 Reassign service category and preserve purpose
  const targetService = adminServicesRes.data.data.find(
    (s) => s.slug === "sundarkand-path"
  );
  if (targetService) {
    const originalCatId = targetService.categoryId;
    const originalPurpose = targetService.purposeSummary;

    // Reassign to test category
    const reassignRes = await makeRequest(
      `${API_BASE}/api/admin/path-services/${targetService.id}`,
      {
        method: "PUT",
        headers: adminHeaders,
        body: { categoryId: createdCatId },
      }
    );
    assert(
      reassignRes.status === 200 && reassignRes.data?.success === true,
      "2.5 Reassign service categoryId via PUT /api/admin/path-services/:id"
    );

    // Verify detail
    const detailCheck = await makeRequest(
      `${API_BASE}/api/admin/path-services/${targetService.id}`,
      { headers: adminHeaders }
    );
    assert(
      detailCheck.data?.data?.categoryId === createdCatId,
      "2.6 Service detail reflects newly assigned categoryId"
    );
    assert(
      detailCheck.data?.data?.purposeSummary === originalPurpose,
      "2.7 Purpose field remains completely distinct and unaffected by category change"
    );

    // Restore original categoryId
    await makeRequest(
      `${API_BASE}/api/admin/path-services/${targetService.id}`,
      {
        method: "PUT",
        headers: adminHeaders,
        body: { categoryId: originalCatId },
      }
    );
  }

  // ==========================================
  // SECTION 3: FRONTEND FILES & ARCHITECTURE
  // ==========================================
  console.log("\n[Section 3: Frontend Files & Architecture]");

  // 3.1 pathCategoryAdminService.ts exists and exports methods
  const serviceFilePath = path.join(
    adminSrcDir,
    "src/services/pathCategoryAdminService.ts"
  );
  assert(
    fs.existsSync(serviceFilePath),
    "3.1 pathCategoryAdminService.ts exists"
  );
  const serviceContent = fs.readFileSync(serviceFilePath, "utf8");
  assert(
    serviceContent.includes("getCategories") &&
      serviceContent.includes("getCategoryById") &&
      serviceContent.includes("createCategory") &&
      serviceContent.includes("updateCategory") &&
      serviceContent.includes("deleteCategory") &&
      serviceContent.includes("SUPPORTED_CATEGORY_ICONS"),
    "3.2 pathCategoryAdminService.ts implements complete typed CRUD and supported icons"
  );

  // 3.3 PathCategoryIcon.tsx exists
  const iconCompPath = path.join(
    adminSrcDir,
    "src/components/PathCategoryIcon.tsx"
  );
  assert(fs.existsSync(iconCompPath), "3.3 PathCategoryIcon.tsx exists");
  const iconContent = fs.readFileSync(iconCompPath, "utf8");
  assert(
    iconContent.includes("BookOpen") && iconContent.includes("ICON_MAP"),
    "3.4 PathCategoryIcon.tsx supports icon mapping with safe fallback"
  );

  // 3.5 PathCategories.tsx exists
  const listPagePath = path.join(adminSrcDir, "src/pages/PathCategories.tsx");
  assert(fs.existsSync(listPagePath), "3.5 PathCategories.tsx exists");
  const listPageContent = fs.readFileSync(listPagePath, "utf8");
  assert(
    listPageContent.includes("SearchBar") &&
      listPageContent.includes("FilterDropdown") &&
      listPageContent.includes("ConfirmDialog") &&
      listPageContent.includes("PathCategoryIcon"),
    "3.6 PathCategories.tsx includes search, status filters, and confirmation dialogs"
  );

  // 3.7 PathCategoryForm.tsx exists
  const formPagePath = path.join(adminSrcDir, "src/pages/PathCategoryForm.tsx");
  assert(fs.existsSync(formPagePath), "3.7 PathCategoryForm.tsx exists");
  const formPageContent = fs.readFileSync(formPagePath, "utf8");
  assert(
    formPageContent.includes("slugify") &&
      (formPageContent.includes("uploadImage") ||
        formPageContent.includes("uploadMediaFile")) &&
      formPageContent.includes("SUPPORTED_CATEGORY_ICONS") &&
      formPageContent.includes("displayOrder"),
    "3.8 PathCategoryForm.tsx includes slug generation, media upload, icon picker, and order"
  );

  // 3.9 PathCategoryDetail.tsx exists
  const detailPagePath = path.join(
    adminSrcDir,
    "src/pages/PathCategoryDetail.tsx"
  );
  assert(fs.existsSync(detailPagePath), "3.9 PathCategoryDetail.tsx exists");
  const detailPageContent = fs.readFileSync(detailPagePath, "utf8");
  assert(
    detailPageContent.includes("PathCategoryIcon") &&
      detailPageContent.includes("getPathServices") &&
      detailPageContent.includes("StatusBadge"),
    "3.10 PathCategoryDetail.tsx shows metadata, status, and associated Path services"
  );

  // 3.11 App.tsx route registration
  const appTsxPath = path.join(adminSrcDir, "src/App.tsx");
  assert(fs.existsSync(appTsxPath), "3.11 App.tsx exists");
  const appTsxContent = fs.readFileSync(appTsxPath, "utf8");
  assert(
    appTsxContent.includes('path="path/categories"') &&
      appTsxContent.includes('path="path/categories/new"') &&
      appTsxContent.includes('path="path/categories/:id"') &&
      appTsxContent.includes('path="path/categories/:id/edit"') &&
      appTsxContent.includes('path="path-categories"') &&
      appTsxContent.includes('path="path-categories/new"') &&
      appTsxContent.includes('path="path-categories/:id"') &&
      appTsxContent.includes('path="path-categories/:id/edit"'),
    "3.12 App.tsx registers both nested and direct aliases for all Path category routes"
  );

  // 3.13 Sidebar.tsx navigation registration
  const sidebarPath = path.join(adminSrcDir, "src/components/Sidebar.tsx");
  assert(fs.existsSync(sidebarPath), "3.13 Sidebar.tsx exists");
  const sidebarContent = fs.readFileSync(sidebarPath, "utf8");
  assert(
    sidebarContent.includes('label: "Path Categories"') &&
      sidebarContent.includes('path: "/admin/path/categories"') &&
      sidebarContent.includes("/admin/path-categories"),
    "3.14 Sidebar.tsx includes Path Categories navigation and active route recognition"
  );

  // 3.15 PathServices.tsx category integration
  const pathServicesPath = path.join(adminSrcDir, "src/pages/PathServices.tsx");
  const pathServicesContent = fs.readFileSync(pathServicesPath, "utf8");
  assert(
    pathServicesContent.includes("categorySlug") &&
      pathServicesContent.includes("PathCategoryIcon") &&
      pathServicesContent.includes("pathCategoryAdminService") &&
      pathServicesContent.includes("Uncategorized"),
    "3.15 PathServices.tsx contains category filter, URL synchronization, and category column badge"
  );

  // 3.16 PathServiceForm.tsx category selector
  const pathServiceFormPath = path.join(
    adminSrcDir,
    "src/pages/PathServiceForm.tsx"
  );
  const pathServiceFormContent = fs.readFileSync(pathServiceFormPath, "utf8");
  assert(
    pathServiceFormContent.includes("categoryId") &&
      pathServiceFormContent.includes("pathCategoryAdminService") &&
      pathServiceFormContent.includes("Liturgical Category"),
    "3.16 PathServiceForm.tsx includes Liturgical Category selector loaded dynamically"
  );

  // 3.17 PathServiceDetail.tsx category display
  const pathServiceDetailPath = path.join(
    adminSrcDir,
    "src/pages/PathServiceDetail.tsx"
  );
  const pathServiceDetailContent = fs.readFileSync(
    pathServiceDetailPath,
    "utf8"
  );
  assert(
    pathServiceDetailContent.includes("Liturgical Category") &&
      pathServiceDetailContent.includes("PathCategoryIcon"),
    "3.17 PathServiceDetail.tsx displays Liturgical Category in details card"
  );

  // ==========================================
  // SECTION 4: STRICT ISOLATION & INTEGRITY
  // ==========================================
  console.log("\n[Section 4: Strict Isolation & Integrity]");

  const pricingServicePath = path.join(
    backendDir,
    "src/services/ritualPricing.service.js"
  );
  assert(
    fs.existsSync(pricingServicePath),
    "4.1 ritualPricing.service.js exists"
  );
  const pricingContent = fs.readFileSync(pricingServicePath, "utf8");
  assert(
    !pricingContent.includes("pathCategoryAdminService"),
    "4.2 Pricing service is completely isolated and untouched by admin category system"
  );

  // Clean up created test category from database
  if (createdCatId) {
    console.log(`\n[Cleanup] Removing temporary test category ID: ${createdCatId}`);
    try {
      await PathCategory.destroy({ where: { id: createdCatId } });
      console.log("  ✓ Test fixture cleaned up successfully");
    } catch (e) {
      console.warn("  ! Note: Could not delete test fixture:", e.message);
    }
  }

  console.log("\n==================================================");
  console.log(`PATH ADMIN PHASE 5 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner encountered fatal error:", err);
  process.exit(1);
});
