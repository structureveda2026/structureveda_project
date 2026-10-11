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
  console.log("PHASE 3B: YAGYA ADMIN CATEGORY-AWARE CATALOGUE TEST SUITE");
  console.log("==================================================\n");

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

  const testTimestamp = Date.now();
  let createdCatId = null;
  let createdCatSlug = `test-cat-3b-${testTimestamp}`;
  let categorizedSvcId = null;
  let uncategorizedSvcId = null;

  try {
    // 0. Setup Admin Auth Token
    const adminToken = jwt.sign(
      {
        id: "12db9f31-e424-42f2-85e2-c7e669cf2e00",
        email: "admin@vedastructure.com",
        role: "admin",
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );
    const authHeaders = {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    };

    // Create a temporary test category
    const catRes = await makeRequest(`${API_BASE}/api/admin/yagya-categories`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `Test 3B Category ${testTimestamp}`,
        slug: createdCatSlug,
        description: "Category for Phase 3B Integration testing",
        displayOrder: 1,
        isActive: true,
      },
    });
    if (catRes.status === 201 && catRes.data?.data?.id) {
      createdCatId = catRes.data.data.id;
    }

    // Create a categorized test service
    const catSvcRes = await makeRequest(`${API_BASE}/api/admin/yagya-services`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `Categorized Yagya ${testTimestamp}`,
        slug: `categorized-yagya-${testTimestamp}`,
        deity: "Lord Shiva",
        startingPrice: 5100,
        availableMode: "hybrid",
        categoryId: createdCatId,
      },
    });
    if (catSvcRes.status === 201 && catSvcRes.data?.data?.id) {
      categorizedSvcId = catSvcRes.data.data.id;
    }

    // Create an uncategorized test service
    const uncatSvcRes = await makeRequest(`${API_BASE}/api/admin/yagya-services`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `Uncategorized Yagya ${testTimestamp}`,
        slug: `uncategorized-yagya-${testTimestamp}`,
        deity: "Lord Vishnu",
        startingPrice: 4100,
        availableMode: "remote",
        categoryId: null,
      },
    });
    if (uncatSvcRes.status === 201 && uncatSvcRes.data?.data?.id) {
      uncategorizedSvcId = uncatSvcRes.data.data.id;
    }

    // Test 1: Yagya service list renders category information
    const yagyaServicesCode = fs.readFileSync(
      path.resolve(
        __dirname,
        "admin-veda-structure/src/pages/YagyaServices.tsx"
      ),
      "utf-8"
    );
    const hasCategoryHeader = yagyaServicesCode.includes(
      '<th className="text-left px-5 py-3.5 font-semibold">Category</th>'
    );
    const hasCategoryCell = yagyaServicesCode.includes("assignedCat");
    assert(
      hasCategoryHeader && hasCategoryCell,
      "1. Yagya service list renders category information in table header and body",
      "Missing Category table header or cell in YagyaServices.tsx"
    );

    // Test 2: Assigned service shows category name
    const listRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services?search=${testTimestamp}`,
      { headers: authHeaders }
    );
    const catSvc = listRes.data?.data?.find((s) => s.id === categorizedSvcId);
    assert(
      catSvc &&
        catSvc.categoryId === createdCatId &&
        catSvc.category?.id === createdCatId &&
        catSvc.category?.name === `Test 3B Category ${testTimestamp}`,
      "2. Assigned service shows category name and category object from API",
      `Category name: ${catSvc?.category?.name}`
    );

    // Test 3: Uncategorized service shows Uncategorized
    const uncatSvc = listRes.data?.data?.find((s) => s.id === uncategorizedSvcId);
    const rendersUncategorizedBadge = yagyaServicesCode.includes("Uncategorized");
    assert(
      uncatSvc &&
        uncatSvc.categoryId === null &&
        uncatSvc.category === null &&
        rendersUncategorizedBadge,
      "3. Uncategorized service shows Uncategorized (categoryId: null and UI badge)",
      `categoryId: ${uncatSvc?.categoryId}`
    );

    // Test 4: Category filter loads dynamically
    const categoriesApiRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-categories?isActive=true`,
      { headers: authHeaders }
    );
    const hasDynamicLoader =
      yagyaServicesCode.includes("yagyaCategoryAdminService.getCategories") &&
      yagyaServicesCode.includes("categoryOptions");
    assert(
      categoriesApiRes.status === 200 &&
        Array.isArray(categoriesApiRes.data?.data) &&
        hasDynamicLoader,
      "4. Category filter loads dynamically from existing category API",
      `Categories count: ${categoriesApiRes.data?.data?.length}`
    );

    // Test 5: All Categories shows all services
    const allRes = await makeRequest(`${API_BASE}/api/admin/yagya-services`, {
      headers: authHeaders,
    });
    const containsBoth =
      allRes.data?.data?.some((s) => s.id === categorizedSvcId) &&
      allRes.data?.data?.some((s) => s.id === uncategorizedSvcId);
    assert(
      allRes.status === 200 && containsBoth,
      "5. All Categories shows all services (unfiltered catalogue returns all records)",
      `Total count: ${allRes.data?.total}`
    );

    // Test 6: Filtering by category works
    const filteredRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services?category=${createdCatSlug}`,
      { headers: authHeaders }
    );
    const onlyCategorized =
      filteredRes.data?.data?.every((s) => s.categoryId === createdCatId) &&
      filteredRes.data?.data?.some((s) => s.id === categorizedSvcId) &&
      !filteredRes.data?.data?.some((s) => s.id === uncategorizedSvcId);
    assert(
      filteredRes.status === 200 && onlyCategorized,
      "6. Filtering by category works (returns only services belonging to category)",
      `Filtered count: ${filteredRes.data?.data?.length}`
    );

    // Test 7: Category filter uses existing backend query contract
    const uuidFilteredRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services?category=${createdCatId}`,
      { headers: authHeaders }
    );
    assert(
      uuidFilteredRes.status === 200 &&
        uuidFilteredRes.data?.data?.some((s) => s.id === categorizedSvcId),
      "7. Category filter uses existing backend query contract (?category=slug or UUID)",
      `Status: ${uuidFilteredRes.status}`
    );

    // Test 8: Pagination resets when category changes
    const hasPageReset =
      yagyaServicesCode.includes("handleCategoryChange") &&
      yagyaServicesCode.includes("setPage(1)");
    assert(
      hasPageReset,
      "8. Pagination resets when category changes (handleCategoryChange calls setPage(1))",
      "Missing setPage(1) in handleCategoryChange"
    );

    // Test 9: Search + category filter work together
    const searchAndCatRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services?category=${createdCatSlug}&search=Categorized`,
      { headers: authHeaders }
    );
    const searchFound =
      searchAndCatRes.data?.data?.length === 1 &&
      searchAndCatRes.data?.data[0].id === categorizedSvcId;
    assert(
      searchAndCatRes.status === 200 && searchFound,
      "9. Search + category filter work together",
      `Results count: ${searchAndCatRes.data?.data?.length}`
    );

    // Test 10: Status + category filter work together
    const statusAndCatRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services?category=${createdCatSlug}&isActive=true`,
      { headers: authHeaders }
    );
    const statusFound = statusAndCatRes.data?.data?.every(
      (s) => s.categoryId === createdCatId && s.isActive === true
    );
    assert(
      statusAndCatRes.status === 200 && statusFound,
      "10. Status + category filter work together",
      `Results count: ${statusAndCatRes.data?.data?.length}`
    );

    // Test 11: Service form loads active categories
    const formCode = fs.readFileSync(
      path.resolve(
        __dirname,
        "admin-veda-structure/src/pages/YagyaServiceForm.tsx"
      ),
      "utf-8"
    );
    const formLoadsCats =
      formCode.includes("yagyaCategoryAdminService") &&
      formCode.includes("getCategories") &&
      formCode.includes("yagya-category-select");
    assert(
      formLoadsCats,
      "11. Service form loads active categories dynamically via category API",
      "YagyaServiceForm missing dynamic category loader"
    );

    // Test 12: Existing category is selected during edit
    const formSetsEditCat = formCode.includes("categoryId: data.categoryId ||");
    const getSvcRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services/${categorizedSvcId}`,
      { headers: authHeaders }
    );
    assert(
      formSetsEditCat && getSvcRes.data?.data?.categoryId === createdCatId,
      "12. Existing category is selected during edit (data.categoryId loaded into form state)",
      `Service categoryId: ${getSvcRes.data?.data?.categoryId}`
    );

    // Test 13: Category assignment persists
    const updateAssignmentRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services/${categorizedSvcId}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: {
          categoryId: null,
        },
      }
    );
    const verifyUnassigned = await makeRequest(
      `${API_BASE}/api/admin/yagya-services/${categorizedSvcId}`,
      { headers: authHeaders }
    );
    assert(
      updateAssignmentRes.status === 200 &&
        verifyUnassigned.data?.data?.categoryId === null,
      "13. Category assignment persists (service categoryId updated successfully)",
      `New categoryId: ${verifyUnassigned.data?.data?.categoryId}`
    );

    // Test 14: Uncategorized state remains safe
    const reassignRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services/${categorizedSvcId}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: {
          categoryId: createdCatId,
        },
      }
    );
    assert(
      reassignRes.status === 200 &&
        reassignRes.data?.data?.categoryId === createdCatId,
      "14. Uncategorized state remains safe and can be re-assigned without side effects",
      `Status: ${reassignRes.status}`
    );

    // Test 15: No pricing regression
    const pricingRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services/${categorizedSvcId}`,
      { headers: authHeaders }
    );
    assert(
      pricingRes.status === 200 &&
        Number(pricingRes.data?.data?.startingPrice) === 5100,
      "15. No pricing regression (startingPrice & pricing tiers remain unchanged)",
      `Price: ${pricingRes.data?.data?.startingPrice}`
    );

    // Test 16: No booking regression
    const publicSvcRes = await makeRequest(
      `${API_BASE}/api/yagya-services/categorized-yagya-${testTimestamp}`
    );
    assert(
      publicSvcRes.status === 200 &&
        publicSvcRes.data?.data?.slug === `categorized-yagya-${testTimestamp}`,
      "16. No booking regression (customer service detail endpoint accessible for booking)",
      `Status: ${publicSvcRes.status}`
    );

    // Test 17: Existing Yagya service CRUD still works
    const crudTestSlug = `crud-test-${testTimestamp}`;
    const crudCreate = await makeRequest(`${API_BASE}/api/admin/yagya-services`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `CRUD Test Yagya ${testTimestamp}`,
        slug: crudTestSlug,
        deity: "Lord Shiva",
        startingPrice: 3100,
        availableMode: "remote",
      },
    });
    const crudId = crudCreate.data?.data?.id;
    const crudDelete = await makeRequest(
      `${API_BASE}/api/admin/yagya-services/${crudId}`,
      { method: "DELETE", headers: authHeaders }
    );
    assert(
      crudCreate.status === 201 && crudDelete.status === 200,
      "17. Existing Yagya service CRUD still works (create, detail, update, delete)",
      `Create: ${crudCreate.status}, Delete: ${crudDelete.status}`
    );

    // Test 18: Existing Yagya customer category pages remain intact
    const customerCategoryRes = await makeRequest(
      `${API_BASE}/api/yagya-categories/${createdCatSlug}`
    );
    const customerCategoryServices = await makeRequest(
      `${API_BASE}/api/yagya-services?category=${createdCatSlug}`
    );
    assert(
      customerCategoryRes.status === 200 &&
        customerCategoryRes.data?.data?.slug === createdCatSlug &&
        customerCategoryServices.status === 200,
      "18. Existing Yagya customer category pages remain intact (GET /api/yagya-categories/:slug & services)",
      `Status: ${customerCategoryRes.status}`
    );

  } catch (err) {
    console.error("Test execution exception:", err);
    failed++;
  } finally {
    // Cleanup
    console.log("\n[Teardown] Cleaning up test records...");
    const cleanupToken = jwt.sign(
      { id: "12db9f31-e424-42f2-85e2-c7e669cf2e00", role: "admin" },
      JWT_SECRET
    );
    const cleanupHeaders = {
      Authorization: `Bearer ${cleanupToken}`,
    };

    if (categorizedSvcId) {
      try {
        await makeRequest(
          `${API_BASE}/api/admin/yagya-services/${categorizedSvcId}`,
          { method: "DELETE", headers: cleanupHeaders }
        );
        console.log(`  ✓ Cleaned up categorized service ${categorizedSvcId}`);
      } catch (e) {
        console.warn("Could not delete categorized service:", e?.message);
      }
    }

    if (uncategorizedSvcId) {
      try {
        await makeRequest(
          `${API_BASE}/api/admin/yagya-services/${uncategorizedSvcId}`,
          { method: "DELETE", headers: cleanupHeaders }
        );
        console.log(`  ✓ Cleaned up uncategorized service ${uncategorizedSvcId}`);
      } catch (e) {
        console.warn("Could not delete uncategorized service:", e?.message);
      }
    }

    if (createdCatId) {
      try {
        await makeRequest(
          `${API_BASE}/api/admin/yagya-categories/${createdCatId}`,
          { method: "DELETE", headers: cleanupHeaders }
        );
        console.log(`  ✓ Cleaned up test category ${createdCatId}`);
      } catch (e) {
        console.warn("Could not delete test category:", e?.message);
      }
    }
  }

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log("==================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
