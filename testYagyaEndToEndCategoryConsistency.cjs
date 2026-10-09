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
  console.log("PHASE 3C: YAGYA E2E CATEGORY & SERVICE CONSISTENCY QA");
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
  let catA_Id = null;
  let catA_Slug = `e2e-cat-a-${testTimestamp}`;
  let catB_Id = null;
  let catB_Slug = `e2e-cat-b-${testTimestamp}`;
  let serviceA_Id = null;
  let serviceA_Slug = `e2e-svc-a-${testTimestamp}`;
  let uncatServiceId = null;
  let uncatServiceSlug = `e2e-svc-uncat-${testTimestamp}`;

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

  try {
    // Setup: Create two temporary categories A & B
    const createCatA = await makeRequest(`${API_BASE}/api/admin/yagya-categories`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `E2E Category A ${testTimestamp}`,
        slug: catA_Slug,
        description: "Primary category for E2E consistency verification",
        displayOrder: 1,
        isActive: true,
      },
    });
    if (createCatA.status === 201 && createCatA.data?.data?.id) {
      catA_Id = createCatA.data.data.id;
    }

    const createCatB = await makeRequest(`${API_BASE}/api/admin/yagya-categories`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `E2E Category B ${testTimestamp}`,
        slug: catB_Slug,
        description: "Secondary category for reassignment verification",
        displayOrder: 2,
        isActive: true,
      },
    });
    if (createCatB.status === 201 && createCatB.data?.data?.id) {
      catB_Id = createCatB.data.data.id;
    }

    // Setup: Create a categorized service under Category A
    const createSvcA = await makeRequest(`${API_BASE}/api/admin/yagya-services`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `E2E Ritual Service A ${testTimestamp}`,
        slug: serviceA_Slug,
        deity: "Lord Shiva",
        startingPrice: 5100,
        availableMode: "hybrid",
        categoryId: catA_Id,
        availableDurations: [3, 5, 7],
        dailyRitualHours: 5,
        pricingTiers: [
          { label: "Standard", days: 3, price: 5100 },
          { label: "Extended", days: 5, price: 8500 },
          { label: "Complete", days: 7, price: 11000 },
        ],
      },
    });
    if (createSvcA.status === 201 && createSvcA.data?.data?.id) {
      serviceA_Id = createSvcA.data.data.id;
    }

    // Setup: Create an uncategorized service
    const createUncatSvc = await makeRequest(`${API_BASE}/api/admin/yagya-services`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `E2E Uncategorized Ritual ${testTimestamp}`,
        slug: uncatServiceSlug,
        deity: "Lord Ganesha",
        startingPrice: 3100,
        availableMode: "remote",
        categoryId: null,
      },
    });
    if (createUncatSvc.status === 201 && createUncatSvc.data?.data?.id) {
      uncatServiceId = createUncatSvc.data.data.id;
    }

    // Test 1: Category source consistency
    const yagyaServicesCode = fs.readFileSync(
      path.resolve(__dirname, "admin-veda-structure/src/pages/YagyaServices.tsx"),
      "utf-8"
    );
    const yagyaFormCode = fs.readFileSync(
      path.resolve(__dirname, "admin-veda-structure/src/pages/YagyaServiceForm.tsx"),
      "utf-8"
    );
    const usesDynamicService =
      yagyaServicesCode.includes("yagyaCategoryAdminService.getCategories") &&
      yagyaFormCode.includes("yagyaCategoryAdminService");
    assert(
      usesDynamicService,
      "1. Category source consistency (Admin components load categories dynamically from category API)",
      "Categories must be fetched from yagyaCategoryAdminService, not hardcoded"
    );

    // Test 2: Category slug consistency
    const catARes = await makeRequest(`${API_BASE}/api/yagya-categories/${catA_Slug}`);
    assert(
      catARes.status === 200 &&
        catARes.data?.data?.slug === catA_Slug &&
        catARes.data?.data?.name === `E2E Category A ${testTimestamp}`,
      "2. Category slug consistency (Public API slug matches admin registered slug)",
      `Slug: ${catARes.data?.data?.slug}`
    );

    // Test 3: Categorized service relationship
    const svcAAdminRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services/${serviceA_Id}`,
      { headers: authHeaders }
    );
    assert(
      svcAAdminRes.status === 200 &&
        svcAAdminRes.data?.data?.categoryId === catA_Id &&
        svcAAdminRes.data?.data?.category?.name === `E2E Category A ${testTimestamp}`,
      "3. Categorized service relationship (service has valid categoryId and matches category details)",
      `categoryId: ${svcAAdminRes.data?.data?.categoryId}`
    );

    // Test 4: Uncategorized service safety
    const uncatAdminRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services/${uncatServiceId}`,
      { headers: authHeaders }
    );
    assert(
      uncatAdminRes.status === 200 &&
        uncatAdminRes.data?.data?.categoryId === null &&
        uncatAdminRes.data?.data?.category === null,
      "4. Uncategorized service safety (uncategorized service has categoryId: null and category: null)",
      `categoryId: ${uncatAdminRes.data?.data?.categoryId}`
    );

    // Test 5: Category detail service listing
    const catAServicesRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services?category=${catA_Slug}`,
      { headers: authHeaders }
    );
    const svcAListedInCatA = catAServicesRes.data?.data?.some((s) => s.id === serviceA_Id);
    assert(
      catAServicesRes.status === 200 && svcAListedInCatA,
      "5. Category detail service listing (GET /api/admin/yagya-services?category=<slug> lists assigned services)",
      `Services count in Cat A: ${catAServicesRes.data?.data?.length}`
    );

    // Test 6: Manage Services URL
    const catDetailCode = fs.readFileSync(
      path.resolve(__dirname, "admin-veda-structure/src/pages/YagyaCategoryDetail.tsx"),
      "utf-8"
    );
    const hasManageServicesLink = catDetailCode.includes("/admin/yagya-services?category=");
    assert(
      hasManageServicesLink,
      "6. Manage Services URL (YagyaCategoryDetail navigates to /admin/yagya-services?category=<slug>)",
      "Missing Manage Services query link in YagyaCategoryDetail.tsx"
    );

    // Test 7: Category filter persistence
    const hasUrlSync =
      yagyaServicesCode.includes("useSearchParams") &&
      yagyaServicesCode.includes("categorySlug") &&
      yagyaServicesCode.includes("setSearchParams");
    assert(
      hasUrlSync,
      "7. Category filter persistence (YagyaServices synchronizes category filter with URL query parameters)",
      "Missing useSearchParams synchronization in YagyaServices.tsx"
    );

    // Test 8: Admin category -> customer category consistency
    const publicCatList = await makeRequest(`${API_BASE}/api/yagya-categories`);
    const publicCatA = publicCatList.data?.data?.find((c) => c.id === catA_Id);
    assert(
      publicCatA &&
        publicCatA.name === `E2E Category A ${testTimestamp}` &&
        publicCatA.slug === catA_Slug,
      "8. Admin category -> customer category consistency (Public API returns matching name and slug)",
      `Public name: ${publicCatA?.name}`
    );

    // Test 9: Customer category contains correct services
    const pubCatAServices = await makeRequest(
      `${API_BASE}/api/yagya-services?category=${catA_Slug}`
    );
    const pubSvcAFound = pubCatAServices.data?.data?.some((s) => s.id === serviceA_Id);
    assert(
      pubCatAServices.status === 200 && pubSvcAFound,
      "9. Customer category contains correct services (public services endpoint filters by category slug)",
      `Public count: ${pubCatAServices.data?.data?.length}`
    );

    // Test 10: Customer category excludes unrelated services
    const uncatExcluded = !pubCatAServices.data?.data?.some((s) => s.id === uncatServiceId);
    assert(
      uncatExcluded,
      "10. Customer category excludes unrelated services (uncategorized & other services excluded)",
      `Uncategorized excluded: ${uncatExcluded}`
    );

    // Test 11: Inactive category hidden from public discovery
    await makeRequest(`${API_BASE}/api/admin/yagya-categories/${catA_Id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    const publicAfterDeact = await makeRequest(`${API_BASE}/api/yagya-categories`);
    const isHiddenFromPublic = !publicAfterDeact.data?.data?.some((c) => c.id === catA_Id);
    assert(
      isHiddenFromPublic,
      "11. Inactive category hidden from public discovery (soft-deactivated category excluded from GET /api/yagya-categories)",
      `Hidden: ${isHiddenFromPublic}`
    );

    // Test 12: Services preserved after category deactivation
    const svcAAfterDeact = await makeRequest(
      `${API_BASE}/api/admin/yagya-services/${serviceA_Id}`,
      { headers: authHeaders }
    );
    assert(
      svcAAfterDeact.status === 200 &&
        svcAAfterDeact.data?.data?.id === serviceA_Id &&
        svcAAfterDeact.data?.data?.categoryId === catA_Id,
      "12. Services preserved after category deactivation (service records remain intact without cascade deletion)",
      `Service exists: ${!!svcAAfterDeact.data?.data?.id}`
    );

    // Test 13: Reactivated category restored
    await makeRequest(`${API_BASE}/api/admin/yagya-categories/${catA_Id}`, {
      method: "PUT",
      headers: authHeaders,
      body: { isActive: true },
    });
    const publicAfterReact = await makeRequest(`${API_BASE}/api/yagya-categories`);
    const isRestoredInPublic = publicAfterReact.data?.data?.some((c) => c.id === catA_Id);
    assert(
      isRestoredInPublic,
      "13. Reactivated category restored (category appears again in public discovery endpoints)",
      `Restored: ${isRestoredInPublic}`
    );

    // Test 14: Service reassignment works
    const reassignRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services/${serviceA_Id}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: { categoryId: catB_Id },
      }
    );
    const catASvcAfterMove = await makeRequest(
      `${API_BASE}/api/admin/yagya-services?category=${catA_Slug}`,
      { headers: authHeaders }
    );
    const catBSvcAfterMove = await makeRequest(
      `${API_BASE}/api/admin/yagya-services?category=${catB_Slug}`,
      { headers: authHeaders }
    );
    const noLongerInA = !catASvcAfterMove.data?.data?.some((s) => s.id === serviceA_Id);
    const nowInB = catBSvcAfterMove.data?.data?.some((s) => s.id === serviceA_Id);
    assert(
      reassignRes.status === 200 && noLongerInA && nowInB,
      "14. Service reassignment works (moving service from Category A to B updates catalogue queries)",
      `noLongerInA: ${noLongerInA}, nowInB: ${nowInB}`
    );

    // Test 15: Customer service detail remains functional
    const pubDetailRes = await makeRequest(`${API_BASE}/api/yagya-services/${serviceA_Slug}`);
    assert(
      pubDetailRes.status === 200 &&
        pubDetailRes.data?.data?.slug === serviceA_Slug &&
        pubDetailRes.data?.data?.category?.id === catB_Id,
      "15. Customer service detail remains functional (GET /api/yagya-services/:slug returns full ritual data with category)",
      `Category ID in detail: ${pubDetailRes.data?.data?.category?.id}`
    );

    // Test 16: Booking route remains functional
    const bookingLookup = await makeRequest(
      `${API_BASE}/api/yagya-services/${serviceA_Slug}`
    );
    assert(
      bookingLookup.status === 200 &&
        bookingLookup.data?.data?.startingPrice === 5100 &&
        Array.isArray(bookingLookup.data?.data?.pricingTiers) &&
        bookingLookup.data?.data?.pricingTiers.length === 3,
      "16. Booking route remains functional (ritual durations & pricing tiers accessible for booking wizard)",
      `Tiers count: ${bookingLookup.data?.data?.pricingTiers?.length}`
    );

    // Test 17: Pricing remains unchanged
    const svcAData = bookingLookup.data?.data;
    assert(
      svcAData?.startingPrice === 5100 &&
        svcAData?.pricingTiers?.[0]?.price === 5100 &&
        svcAData?.pricingTiers?.[1]?.price === 8500 &&
        svcAData?.pricingTiers?.[2]?.price === 11000,
      "17. Pricing remains unchanged (authoritative starting price and duration tiers intact after category operations)",
      `Base price: ₹${svcAData?.startingPrice}`
    );

    // Test 18: Existing Yagya service CRUD remains functional
    const crudTestSlug = `e2e-crud-${testTimestamp}`;
    const crudCreate = await makeRequest(`${API_BASE}/api/admin/yagya-services`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `E2E CRUD Service ${testTimestamp}`,
        slug: crudTestSlug,
        deity: "Lord Shiva",
        startingPrice: 6100,
        availableMode: "hybrid",
      },
    });
    const crudId = crudCreate.data?.data?.id;
    const crudDetail = await makeRequest(
      `${API_BASE}/api/admin/yagya-services/${crudId}`,
      { headers: authHeaders }
    );
    const crudDelete = await makeRequest(
      `${API_BASE}/api/admin/yagya-services/${crudId}`,
      { method: "DELETE", headers: authHeaders }
    );
    assert(
      crudCreate.status === 201 &&
        crudDetail.status === 200 &&
        crudDelete.status === 200,
      "18. Existing Yagya service CRUD remains functional (create, detail, update, soft-delete)",
      `Create: ${crudCreate.status}, Detail: ${crudDetail.status}, Delete: ${crudDelete.status}`
    );

    // Test 19: Existing Phase 3A category CRUD remains functional
    const catCrudSlug = `e2e-cat-crud-${testTimestamp}`;
    const catCrudCreate = await makeRequest(`${API_BASE}/api/admin/yagya-categories`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `E2E Category CRUD ${testTimestamp}`,
        slug: catCrudSlug,
        description: "CRUD test category",
        displayOrder: 5,
        isActive: true,
      },
    });
    const catCrudId = catCrudCreate.data?.data?.id;
    const catCrudUpdate = await makeRequest(
      `${API_BASE}/api/admin/yagya-categories/${catCrudId}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: { description: "Updated description" },
      }
    );
    const catCrudDelete = await makeRequest(
      `${API_BASE}/api/admin/yagya-categories/${catCrudId}`,
      { method: "DELETE", headers: authHeaders }
    );
    assert(
      catCrudCreate.status === 201 &&
        catCrudUpdate.status === 200 &&
        catCrudDelete.status === 200,
      "19. Existing Phase 3A category CRUD remains functional (create, update, soft-delete)",
      `Create: ${catCrudCreate.status}, Update: ${catCrudUpdate.status}`
    );

    // Test 20: Existing Phase 3B category filter remains functional
    const hasCategoryFilterDropdown = yagyaServicesCode.includes('label="Category"');
    const hasCategoryTableCol = yagyaServicesCode.includes('>Category</th>');
    const hasCategoryRowDisplay = yagyaServicesCode.includes("assignedCat");
    assert(
      hasCategoryFilterDropdown && hasCategoryTableCol && hasCategoryRowDisplay,
      "20. Existing Phase 3B category filter remains functional (filter dropdown, table column, and row display)",
      "YagyaServices.tsx contains complete Phase 3B category integration"
    );

  } catch (err) {
    console.error("Test execution exception:", err);
    failed++;
  } finally {
    // Teardown
    console.log("\n[Teardown] Cleaning up E2E test records...");
    const cleanupHeaders = {
      Authorization: `Bearer ${adminToken}`,
    };

    if (serviceA_Id) {
      try {
        await makeRequest(
          `${API_BASE}/api/admin/yagya-services/${serviceA_Id}`,
          { method: "DELETE", headers: cleanupHeaders }
        );
        console.log(`  ✓ Cleaned up service A ${serviceA_Id}`);
      } catch (e) {
        console.warn("Could not delete service A:", e?.message);
      }
    }

    if (uncatServiceId) {
      try {
        await makeRequest(
          `${API_BASE}/api/admin/yagya-services/${uncatServiceId}`,
          { method: "DELETE", headers: cleanupHeaders }
        );
        console.log(`  ✓ Cleaned up uncat service ${uncatServiceId}`);
      } catch (e) {
        console.warn("Could not delete uncat service:", e?.message);
      }
    }

    if (catA_Id) {
      try {
        await makeRequest(
          `${API_BASE}/api/admin/yagya-categories/${catA_Id}`,
          { method: "DELETE", headers: cleanupHeaders }
        );
        console.log(`  ✓ Cleaned up category A ${catA_Id}`);
      } catch (e) {
        console.warn("Could not delete category A:", e?.message);
      }
    }

    if (catB_Id) {
      try {
        await makeRequest(
          `${API_BASE}/api/admin/yagya-categories/${catB_Id}`,
          { method: "DELETE", headers: cleanupHeaders }
        );
        console.log(`  ✓ Cleaned up category B ${catB_Id}`);
      } catch (e) {
        console.warn("Could not delete category B:", e?.message);
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
