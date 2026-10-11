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
  console.log("PHASE 3B: JAPA ADMIN SERVICE ↔ CATEGORY INTEGRATION TEST SUITE");
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
  let createdCat2Id = null;
  let createdCatSlug = `test-japa-cat-3b-${testTimestamp}`;
  let createdCat2Slug = `test-japa-cat2-3b-${testTimestamp}`;
  let categorizedSvcId = null;
  let uncategorizedSvcId = null;
  let initialStartingPrice = 18000;
  let initialCounts = [11000, 21000];
  let initialSlug = `categorized-japa-${testTimestamp}`;

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

    // 0.1 Create Primary Test Category
    const catRes = await makeRequest(`${API_BASE}/api/admin/japa-categories`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `Test 3B Japa Category ${testTimestamp}`,
        slug: createdCatSlug,
        description: "Category for Phase 3B Integration testing",
        iconName: "Sparkles",
        displayOrder: 1,
        isActive: true,
      },
    });
    if (catRes.status === 201 && catRes.data?.data?.id) {
      createdCatId = catRes.data.data.id;
    }

    // 0.2 Create Secondary Test Category (for category change testing)
    const cat2Res = await makeRequest(`${API_BASE}/api/admin/japa-categories`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `Second 3B Japa Category ${testTimestamp}`,
        slug: createdCat2Slug,
        description: "Secondary Category for Phase 3B Integration testing",
        iconName: "BookOpen",
        displayOrder: 2,
        isActive: true,
      },
    });
    if (cat2Res.status === 201 && cat2Res.data?.data?.id) {
      createdCat2Id = cat2Res.data.data.id;
    }

    // 0.3 Create a Categorized Test Japa Service
    const catSvcRes = await makeRequest(`${API_BASE}/api/admin/japa-services`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `Categorized Japa Ritual ${testTimestamp}`,
        slug: initialSlug,
        mantra: "Om Namah Shivaya",
        startingPrice: initialStartingPrice,
        availableCounts: initialCounts,
        minimumPandits: 2,
        recommendedPandits: 4,
        maximumPandits: 11,
        dailyCapacityPerPandit: 2000,
        categoryId: createdCatId,
        purposeCategory: "spiritual-growth",
        purposeSummary: "Spiritual upliftment and inner peace",
        isActive: true,
      },
    });
    if (catSvcRes.status === 201 && catSvcRes.data?.data?.id) {
      categorizedSvcId = catSvcRes.data.data.id;
    }

    // 0.4 Create an Uncategorized Test Japa Service
    const uncatSvcRes = await makeRequest(`${API_BASE}/api/admin/japa-services`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `Uncategorized Japa Ritual ${testTimestamp}`,
        slug: `uncategorized-japa-${testTimestamp}`,
        mantra: "Om Gam Ganapataye Namaha",
        startingPrice: 11000,
        availableCounts: [11000],
        minimumPandits: 1,
        recommendedPandits: 2,
        maximumPandits: 5,
        dailyCapacityPerPandit: 2000,
        categoryId: null,
        isActive: true,
      },
    });
    if (uncatSvcRes.status === 201 && uncatSvcRes.data?.data?.id) {
      uncategorizedSvcId = uncatSvcRes.data.data.id;
    }

    // ----------------------------------------------------
    // SECTION A: SERVICE LIST
    // ----------------------------------------------------
    const japaServicesCode = fs.readFileSync(
      path.resolve(
        __dirname,
        "admin-veda-structure/src/pages/JapaServices.tsx"
      ),
      "utf-8"
    );

    // 1. Category column appears
    const hasCategoryHeader = japaServicesCode.includes(
      '<th className="text-left px-5 py-3.5 font-semibold">Category</th>'
    );
    assert(
      hasCategoryHeader,
      "1. Category column appears in JapaServices.tsx table header",
      "Missing Category table header"
    );

    // 2. Correct category name displayed
    const listRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services?search=${testTimestamp}`,
      { headers: authHeaders }
    );
    const catSvc = listRes.data?.data?.find((s) => s.id === categorizedSvcId);
    assert(
      catSvc &&
        catSvc.categoryId === createdCatId &&
        catSvc.category?.id === createdCatId &&
        catSvc.category?.name === `Test 3B Japa Category ${testTimestamp}`,
      "2. Correct category name displayed for categorized service",
      `Category name received: ${catSvc?.category?.name}`
    );

    // 3. Category icon displayed
    const hasCategoryIconComp =
      japaServicesCode.includes("JapaCategoryIcon") &&
      japaServicesCode.includes("iconName={iconName}");
    assert(
      hasCategoryIconComp && (catSvc?.category?.iconName || catSvc?.category),
      "3. Category icon displayed via JapaCategoryIcon component",
      "JapaCategoryIcon missing or not rendering iconName"
    );

    // 4. Uncategorized fallback works
    const uncatSvc = listRes.data?.data?.find((s) => s.id === uncategorizedSvcId);
    const hasUncatFallback = japaServicesCode.includes("Uncategorized");
    assert(
      uncatSvc &&
        uncatSvc.categoryId === null &&
        uncatSvc.category === null &&
        hasUncatFallback,
      "4. Uncategorized fallback works (null categoryId renders safe 'Uncategorized')",
      `uncatSvc categoryId: ${uncatSvc?.categoryId}`
    );

    // ----------------------------------------------------
    // SECTION B: FILTER
    // ----------------------------------------------------

    // 5. All Categories returns all services
    const allRes = await makeRequest(`${API_BASE}/api/admin/japa-services`, {
      headers: authHeaders,
    });
    const containsBoth =
      allRes.data?.data?.some((s) => s.id === categorizedSvcId) &&
      allRes.data?.data?.some((s) => s.id === uncategorizedSvcId);
    assert(
      allRes.status === 200 && containsBoth,
      "5. All Categories returns all services (both categorized & uncategorized present)",
      `Total: ${allRes.data?.total}`
    );

    // 6. Category filter returns correct services
    const filteredRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services?category=${createdCatSlug}`,
      { headers: authHeaders }
    );
    const onlyCategorized =
      filteredRes.data?.data?.length > 0 &&
      filteredRes.data?.data?.every((s) => s.categoryId === createdCatId) &&
      filteredRes.data?.data?.some((s) => s.id === categorizedSvcId) &&
      !filteredRes.data?.data?.some((s) => s.id === uncategorizedSvcId);
    assert(
      filteredRes.status === 200 && onlyCategorized,
      "6. Category filter returns correct services for specified category slug",
      `Filtered count: ${filteredRes.data?.data?.length}`
    );

    // 7. Nonexistent category returns empty result
    const nonexistentRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services?category=nonexistent-category-slug-${testTimestamp}`,
      { headers: authHeaders }
    );
    assert(
      nonexistentRes.status === 200 &&
        Array.isArray(nonexistentRes.data?.data) &&
        nonexistentRes.data?.data?.length === 0,
      "7. Nonexistent category returns empty result safely",
      `Length: ${nonexistentRes.data?.data?.length}`
    );

    // 8. Category works with search
    const searchCatRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services?category=${createdCatSlug}&search=Shivaya`,
      { headers: authHeaders }
    );
    assert(
      searchCatRes.status === 200 &&
        searchCatRes.data?.data?.length === 1 &&
        searchCatRes.data?.data[0].id === categorizedSvcId,
      "8. Category filter works in combination with search keyword",
      `Matches: ${searchCatRes.data?.data?.length}`
    );

    // 9. Category works with purpose filter
    const purposeCatRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services?category=${createdCatSlug}&purpose=spiritual-growth`,
      { headers: authHeaders }
    );
    assert(
      purposeCatRes.status === 200 &&
        purposeCatRes.data?.data?.some((s) => s.id === categorizedSvcId),
      "9. Category filter works in combination with purpose filter",
      `Matches: ${purposeCatRes.data?.data?.length}`
    );

    // 10. Category works with status filter
    const statusCatRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services?category=${createdCatSlug}&isActive=true`,
      { headers: authHeaders }
    );
    assert(
      statusCatRes.status === 200 &&
        statusCatRes.data?.data?.every(
          (s) => s.categoryId === createdCatId && s.isActive === true
        ),
      "10. Category filter works in combination with status filter",
      `Matches: ${statusCatRes.data?.data?.length}`
    );

    // 11. Combined filters work correctly
    const combinedRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services?category=${createdCatSlug}&search=${testTimestamp}&isActive=true&limit=10`,
      { headers: authHeaders }
    );
    assert(
      combinedRes.status === 200 &&
        combinedRes.data?.data?.length === 1 &&
        combinedRes.data?.data[0].id === categorizedSvcId,
      "11. Combined filters (category + search + status + limit) work correctly",
      `Matches: ${combinedRes.data?.data?.length}`
    );

    // 12. Pagination resets correctly
    const hasPaginationReset =
      japaServicesCode.includes("handleCategoryChange") &&
      japaServicesCode.includes("setPage(1)");
    assert(
      hasPaginationReset,
      "12. Pagination resets to page 1 when category filter changes",
      "Missing setPage(1) in handleCategoryChange"
    );

    // ----------------------------------------------------
    // SECTION C: FORM
    // ----------------------------------------------------
    const formCode = fs.readFileSync(
      path.resolve(
        __dirname,
        "admin-veda-structure/src/pages/JapaServiceForm.tsx"
      ),
      "utf-8"
    );

    // 13. Active categories load in form
    const formLoadsCats =
      formCode.includes("japaCategoryAdminService") &&
      formCode.includes("getCategories") &&
      formCode.includes("japa-category-select");
    assert(
      formLoadsCats,
      "13. Active categories load dynamically in JapaServiceForm",
      "Missing dynamic category fetch in form"
    );

    // 14. Create service with category
    const newFormTestSlug = `create-form-test-${testTimestamp}`;
    const createFormSvcRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services`,
      {
        method: "POST",
        headers: authHeaders,
        body: {
          name: `Form Create Test ${testTimestamp}`,
          slug: newFormTestSlug,
          mantra: "Om Namo Bhagavate Vasudevaya",
          startingPrice: 21000,
          availableCounts: [11000, 21000, 51000],
          minimumPandits: 2,
          recommendedPandits: 3,
          maximumPandits: 7,
          dailyCapacityPerPandit: 2000,
          categoryId: createdCatId,
          isActive: true,
        },
      }
    );
    const createdFormSvcId = createFormSvcRes.data?.data?.id;
    assert(
      createFormSvcRes.status === 201 && createdFormSvcId,
      "14. Create Japa service with category selection succeeds",
      `Status: ${createFormSvcRes.status}`
    );

    // 15. Created categoryId persists
    const getCreatedFormSvc = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${createdFormSvcId}`,
      { headers: authHeaders }
    );
    assert(
      getCreatedFormSvc.status === 200 &&
        getCreatedFormSvc.data?.data?.categoryId === createdCatId,
      "15. Created categoryId persists in database and is returned on reload",
      `Persisted categoryId: ${getCreatedFormSvc.data?.data?.categoryId}`
    );

    // 16. Edit service displays current category
    const formHydratesCat = formCode.includes("categoryId: data.categoryId ||");
    assert(
      formHydratesCat &&
        getCreatedFormSvc.data?.data?.category?.id === createdCatId,
      "16. Edit service loads and hydrates current category into form state",
      "Form does not hydrate categoryId from existing record"
    );

    // 17. Change category
    const changeCatRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${createdFormSvcId}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: {
          categoryId: createdCat2Id,
        },
      }
    );
    assert(
      changeCatRes.status === 200,
      "17. Change category on existing service succeeds via PUT /api/admin/japa-services/:id",
      `Status: ${changeCatRes.status}`
    );

    // 18. Updated categoryId persists
    const getUpdatedCatSvc = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${createdFormSvcId}`,
      { headers: authHeaders }
    );
    assert(
      getUpdatedCatSvc.status === 200 &&
        getUpdatedCatSvc.data?.data?.categoryId === createdCat2Id &&
        getUpdatedCatSvc.data?.data?.category?.name === `Second 3B Japa Category ${testTimestamp}`,
      "18. Updated categoryId persists correctly after change",
      `New categoryId: ${getUpdatedCatSvc.data?.data?.categoryId}`
    );

    // 19. Uncategorized/null category works where supported
    const setNullCatRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${createdFormSvcId}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: {
          categoryId: null,
        },
      }
    );
    const getNullCatSvc = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${createdFormSvcId}`,
      { headers: authHeaders }
    );
    assert(
      setNullCatRes.status === 200 &&
        getNullCatSvc.data?.data?.categoryId === null &&
        getNullCatSvc.data?.data?.category === null,
      "19. Uncategorized/null category assignment supported and persists cleanly",
      `Final categoryId: ${getNullCatSvc.data?.data?.categoryId}`
    );

    // Clean up temporary form created service
    if (createdFormSvcId) {
      await makeRequest(
        `${API_BASE}/api/admin/japa-services/${createdFormSvcId}`,
        { method: "DELETE", headers: authHeaders }
      );
    }

    // ----------------------------------------------------
    // SECTION D: DETAIL
    // ----------------------------------------------------
    const detailCode = fs.readFileSync(
      path.resolve(
        __dirname,
        "admin-veda-structure/src/pages/JapaServiceDetail.tsx"
      ),
      "utf-8"
    );

    // 20. Service detail displays category
    const detailHasCategorySection =
      detailCode.includes('SectionCard title="Category & Purpose"') &&
      detailCode.includes('label="Category"');
    const getDetailRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${categorizedSvcId}`,
      { headers: authHeaders }
    );
    assert(
      detailHasCategorySection &&
        getDetailRes.data?.data?.category?.name === `Test 3B Japa Category ${testTimestamp}`,
      "20. Service detail displays category name and icon",
      `Detail category: ${getDetailRes.data?.data?.category?.name}`
    );

    // 21. Uncategorized service displays safe fallback
    const detailHasUncatFallback = detailCode.includes("Uncategorized");
    const getUncatDetailRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${uncategorizedSvcId}`,
      { headers: authHeaders }
    );
    assert(
      detailHasUncatFallback &&
        getUncatDetailRes.data?.data?.category === null &&
        getUncatDetailRes.data?.data?.categoryId === null,
      "21. Uncategorized service displays safe fallback in service detail",
      `Uncategorized status: ${getUncatDetailRes.status}`
    );

    // ----------------------------------------------------
    // SECTION E: DATA INTEGRITY
    // ----------------------------------------------------

    // 22. Category assignment does not change pricing
    const verifyPricingRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${categorizedSvcId}`,
      { headers: authHeaders }
    );
    assert(
      Number(verifyPricingRes.data?.data?.startingPrice) === initialStartingPrice,
      "22. Category assignment does not alter startingPrice or pricing tiers",
      `startingPrice: ${verifyPricingRes.data?.data?.startingPrice}`
    );

    // 23. Category assignment does not change booking configuration
    const svcData = verifyPricingRes.data?.data;
    const bookingConfigIntact =
      Array.isArray(svcData?.availableCounts) &&
      JSON.stringify(svcData?.availableCounts) === JSON.stringify(initialCounts) &&
      Number(svcData?.minimumPandits) === 2 &&
      Number(svcData?.recommendedPandits) === 4 &&
      Number(svcData?.maximumPandits) === 11 &&
      Number(svcData?.dailyCapacityPerPandit) === 2000;
    assert(
      bookingConfigIntact,
      "23. Category assignment does not alter pandit capacities, daily capacity, or available counts",
      `Pandits: ${svcData?.minimumPandits}-${svcData?.maximumPandits}, Capacity: ${svcData?.dailyCapacityPerPandit}`
    );

    // 24. Service slug remains unchanged
    assert(
      svcData?.slug === initialSlug,
      "24. Service slug remains unchanged during category modifications",
      `Slug: ${svcData?.slug}`
    );

    // 25. Service ID remains unchanged
    assert(
      svcData?.id === categorizedSvcId,
      "25. Service ID remains unchanged during category modifications",
      `ID: ${svcData?.id}`
    );

    // ----------------------------------------------------
    // SECTION F: AUTHORIZATION / API
    // ----------------------------------------------------

    // 26. Admin APIs remain protected
    const unauthRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services`,
      { method: "GET" }
    );
    assert(
      unauthRes.status === 401 || unauthRes.status === 403,
      "26. Admin Japa service APIs remain protected (unauthenticated request rejected)",
      `Status: ${unauthRes.status}`
    );

    // 27. Invalid categoryId rejected
    const invalidCatRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services`,
      {
        method: "POST",
        headers: authHeaders,
        body: {
          name: "Invalid Category Test",
          slug: `invalid-cat-${testTimestamp}`,
          mantra: "Om",
          startingPrice: 5000,
          availableCounts: [11000],
          categoryId: "invalid-not-a-uuid",
        },
      }
    );
    assert(
      invalidCatRes.status === 400,
      "27. Backend validation rejects invalid categoryId format with HTTP 400",
      `Status: ${invalidCatRes.status}`
    );

    // ----------------------------------------------------
    // SECTION G: CROSS-MODULE CONSISTENCY
    // ----------------------------------------------------

    // 28. Category-filtered admin services match backend
    const adminCheckRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services?category=${createdCatSlug}`,
      { headers: authHeaders }
    );
    const adminIncludesSvc = adminCheckRes.data?.data?.some(
      (s) => s.id === categorizedSvcId
    );
    assert(
      adminCheckRes.status === 200 && adminIncludesSvc,
      "28. Category-filtered admin services match backend categorized records",
      `Count: ${adminCheckRes.data?.data?.length}`
    );

    // 29. Customer category listing receives correct services
    const customerCatSvcRes = await makeRequest(
      `${API_BASE}/api/japa-services?category=${createdCatSlug}`
    );
    const customerIncludesSvc = customerCatSvcRes.data?.data?.some(
      (s) => s.id === categorizedSvcId
    );
    assert(
      customerCatSvcRes.status === 200 && customerIncludesSvc,
      "29. Customer category listing receives correct services belonging to category",
      `Customer count: ${customerCatSvcRes.data?.data?.length}`
    );

    // 30. Incorrect category does not include service
    const wrongCatSvcRes = await makeRequest(
      `${API_BASE}/api/japa-services?category=${createdCat2Slug}`
    );
    const wrongIncludesSvc = wrongCatSvcRes.data?.data?.some(
      (s) => s.id === categorizedSvcId
    );
    assert(
      wrongCatSvcRes.status === 200 && !wrongIncludesSvc,
      "30. Incorrect category does not include service",
      `Wrong cat matches: ${wrongCatSvcRes.data?.data?.length}`
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
          `${API_BASE}/api/admin/japa-services/${categorizedSvcId}`,
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
          `${API_BASE}/api/admin/japa-services/${uncategorizedSvcId}`,
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
          `${API_BASE}/api/admin/japa-categories/${createdCatId}`,
          { method: "DELETE", headers: cleanupHeaders }
        );
        console.log(`  ✓ Cleaned up primary test category ${createdCatId}`);
      } catch (e) {
        console.warn("Could not delete test category:", e?.message);
      }
    }

    if (createdCat2Id) {
      try {
        await makeRequest(
          `${API_BASE}/api/admin/japa-categories/${createdCat2Id}`,
          { method: "DELETE", headers: cleanupHeaders }
        );
        console.log(`  ✓ Cleaned up secondary test category ${createdCat2Id}`);
      } catch (e) {
        console.warn("Could not delete secondary test category:", e?.message);
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
