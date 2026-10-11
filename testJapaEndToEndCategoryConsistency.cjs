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
  console.log("PHASE 3C: JAPA E2E CATEGORY & SERVICE CONSISTENCY QA");
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
  let catA_Slug = `e2e-japa-cat-a-${testTimestamp}`;
  let catB_Id = null;
  let catB_Slug = `e2e-japa-cat-b-${testTimestamp}`;
  let serviceA_Id = null;
  let serviceA_Slug = `e2e-japa-svc-a-${testTimestamp}`;
  let uncatServiceId = null;
  let uncatServiceSlug = `e2e-japa-svc-uncat-${testTimestamp}`;

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
    // ------------------------------------------------------------------
    // Setup: Create two temporary categories A & B
    // ------------------------------------------------------------------
    const createCatA = await makeRequest(`${API_BASE}/api/admin/japa-categories`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `E2E Japa Category A ${testTimestamp}`,
        slug: catA_Slug,
        description: "Primary category for E2E consistency verification",
        iconName: "Sparkles",
        displayOrder: 1,
        isActive: true,
      },
    });
    if (createCatA.status === 201 && createCatA.data?.data?.id) {
      catA_Id = createCatA.data.data.id;
    }

    const createCatB = await makeRequest(`${API_BASE}/api/admin/japa-categories`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `E2E Japa Category B ${testTimestamp}`,
        slug: catB_Slug,
        description: "Secondary category for reassignment verification",
        iconName: "BookOpen",
        displayOrder: 2,
        isActive: true,
      },
    });
    if (createCatB.status === 201 && createCatB.data?.data?.id) {
      catB_Id = createCatB.data.data.id;
    }

    // Setup: Create a categorized service under Category A
    const createSvcA = await makeRequest(`${API_BASE}/api/admin/japa-services`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `E2E Japa Service A ${testTimestamp}`,
        slug: serviceA_Slug,
        mantra: "Om Namah Shivaya",
        startingPrice: 15000,
        availableCounts: [11000, 21000, 51000],
        minimumPandits: 2,
        recommendedPandits: 4,
        maximumPandits: 11,
        dailyCapacityPerPandit: 2000,
        categoryId: catA_Id,
        purposeCategory: "peace",
        purposeSummary: "Supreme peace and meditative clarity",
        isActive: true,
      },
    });
    if (createSvcA.status === 201 && createSvcA.data?.data?.id) {
      serviceA_Id = createSvcA.data.data.id;
    }

    // Setup: Create an uncategorized service
    const createUncatSvc = await makeRequest(`${API_BASE}/api/admin/japa-services`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `E2E Uncategorized Japa ${testTimestamp}`,
        slug: uncatServiceSlug,
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
    if (createUncatSvc.status === 201 && createUncatSvc.data?.data?.id) {
      uncatServiceId = createUncatSvc.data.data.id;
    }

    // ------------------------------------------------------------------
    // Test 1: Category source consistency
    // ------------------------------------------------------------------
    const japaServicesCode = fs.readFileSync(
      path.resolve(__dirname, "admin-veda-structure/src/pages/JapaServices.tsx"),
      "utf-8"
    );
    const japaFormCode = fs.readFileSync(
      path.resolve(__dirname, "admin-veda-structure/src/pages/JapaServiceForm.tsx"),
      "utf-8"
    );
    const usesDynamicService =
      japaServicesCode.includes("japaCategoryAdminService.getCategories") &&
      japaFormCode.includes("japaCategoryAdminService");
    assert(
      usesDynamicService,
      "1. Category source consistency (Admin components load categories dynamically from category API)",
      "Categories must be fetched from japaCategoryAdminService, not hardcoded"
    );

    // ------------------------------------------------------------------
    // Test 2: Category slug consistency
    // ------------------------------------------------------------------
    const catARes = await makeRequest(`${API_BASE}/api/japa-categories/${catA_Slug}`);
    assert(
      catARes.status === 200 &&
        catARes.data?.data?.slug === catA_Slug &&
        catARes.data?.data?.name === `E2E Japa Category A ${testTimestamp}`,
      "2. Category slug consistency (Public API slug matches admin registered slug)",
      `Slug: ${catARes.data?.data?.slug}`
    );

    // ------------------------------------------------------------------
    // Test 3: Categorized service relationship
    // ------------------------------------------------------------------
    const svcAAdminRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${serviceA_Id}`,
      { headers: authHeaders }
    );
    assert(
      svcAAdminRes.status === 200 &&
        svcAAdminRes.data?.data?.categoryId === catA_Id &&
        svcAAdminRes.data?.data?.category?.name === `E2E Japa Category A ${testTimestamp}`,
      "3. Categorized service relationship (service has valid categoryId and matches category details)",
      `categoryId: ${svcAAdminRes.data?.data?.categoryId}`
    );

    // ------------------------------------------------------------------
    // Test 4: All canonical services categorized
    // ------------------------------------------------------------------
    const canonicalServicesRes = await makeRequest(`${API_BASE}/api/admin/japa-services?limit=50`, {
      headers: authHeaders,
    });
    const CANONICAL_SLUGS = [
      "shiva-panchakshari-japa",
      "maha-lakshmi-shri-suktam-japa",
      "ganapati-atharvashirsha-japa",
      "hanuman-mantra-japa",
      "durga-saptashati-mantra-japa",
      "gayatri-mantra-japa",
      "navagraha-mantra-japa",
      "maha-mrityunjaya-japa",
    ];
    const canonicalServices = canonicalServicesRes.data?.data?.filter((s) =>
      CANONICAL_SLUGS.includes(s.slug)
    );
    const allCanonicalCategorized =
      canonicalServices &&
      canonicalServices.length === 8 &&
      canonicalServices.every((s) => s.categoryId !== null && s.category !== null);
    assert(
      allCanonicalCategorized,
      "4. All canonical services categorized (all 8 canonical Japa services have non-null categoryId)",
      `Canonical count: ${canonicalServices?.length}, All categorized: ${allCanonicalCategorized}`
    );

    // ------------------------------------------------------------------
    // Test 5: Uncategorized behavior
    // ------------------------------------------------------------------
    const uncatAdminRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${uncatServiceId}`,
      { headers: authHeaders }
    );
    assert(
      uncatAdminRes.status === 200 &&
        uncatAdminRes.data?.data?.categoryId === null &&
        uncatAdminRes.data?.data?.category === null &&
        japaServicesCode.includes("Uncategorized"),
      "5. Uncategorized behavior (uncategorized service has categoryId: null and safe UI badge)",
      `categoryId: ${uncatAdminRes.data?.data?.categoryId}`
    );

    // ------------------------------------------------------------------
    // Test 6: Category detail
    // ------------------------------------------------------------------
    const catDetailAdminRes = await makeRequest(
      `${API_BASE}/api/admin/japa-categories/${catA_Id}`,
      { headers: authHeaders }
    );
    const catDetailCode = fs.readFileSync(
      path.resolve(__dirname, "admin-veda-structure/src/pages/JapaCategoryDetail.tsx"),
      "utf-8"
    );
    const hasManageServicesLink = catDetailCode.includes("/admin/japa-services?category=");
    assert(
      catDetailAdminRes.status === 200 &&
        catDetailAdminRes.data?.data?.slug === catA_Slug &&
        hasManageServicesLink,
      "6. Category detail (GET /api/admin/japa-categories/:id returns full payload and detail links to manage services)",
      `Manage Services link present: ${hasManageServicesLink}`
    );

    // ------------------------------------------------------------------
    // Test 7: Customer category listing
    // ------------------------------------------------------------------
    const pubCatAServices = await makeRequest(
      `${API_BASE}/api/japa-services?category=${catA_Slug}`
    );
    const pubSvcAFound = pubCatAServices.data?.data?.some((s) => s.id === serviceA_Id);
    assert(
      pubCatAServices.status === 200 && pubSvcAFound,
      "7. Customer category listing (public services endpoint filters by category slug)",
      `Public count: ${pubCatAServices.data?.data?.length}`
    );

    // ------------------------------------------------------------------
    // Test 8: Admin category list
    // ------------------------------------------------------------------
    const adminCatList = await makeRequest(`${API_BASE}/api/admin/japa-categories`, {
      headers: authHeaders,
    });
    const foundCatAInAdmin = adminCatList.data?.data?.some((c) => c.id === catA_Id);
    assert(
      adminCatList.status === 200 && foundCatAInAdmin,
      "8. Admin category list (GET /api/admin/japa-categories returns all categories including test categories)",
      `Total admin categories: ${adminCatList.data?.data?.length}`
    );

    // ------------------------------------------------------------------
    // Test 9: Admin service filtering
    // ------------------------------------------------------------------
    const catAServicesRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services?category=${catA_Slug}`,
      { headers: authHeaders }
    );
    const svcAListedInCatA = catAServicesRes.data?.data?.some((s) => s.id === serviceA_Id);
    const uncatNotListedInCatA = !catAServicesRes.data?.data?.some((s) => s.id === uncatServiceId);
    assert(
      catAServicesRes.status === 200 && svcAListedInCatA && uncatNotListedInCatA,
      "9. Admin service filtering (GET /api/admin/japa-services?category=<slug> returns only matching services)",
      `Services count in Cat A: ${catAServicesRes.data?.data?.length}`
    );

    // ------------------------------------------------------------------
    // Test 10: Service reassignment
    // ------------------------------------------------------------------
    const reassignRes = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${serviceA_Id}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: { categoryId: catB_Id },
      }
    );
    const catASvcAfterMove = await makeRequest(
      `${API_BASE}/api/admin/japa-services?category=${catA_Slug}`,
      { headers: authHeaders }
    );
    const catBSvcAfterMove = await makeRequest(
      `${API_BASE}/api/admin/japa-services?category=${catB_Slug}`,
      { headers: authHeaders }
    );
    const noLongerInA = !catASvcAfterMove.data?.data?.some((s) => s.id === serviceA_Id);
    const nowInB = catBSvcAfterMove.data?.data?.some((s) => s.id === serviceA_Id);
    assert(
      reassignRes.status === 200 && noLongerInA && nowInB,
      "10. Service reassignment (moving service from Category A to B updates catalogue queries and removes from old category)",
      `noLongerInA: ${noLongerInA}, nowInB: ${nowInB}`
    );

    // ------------------------------------------------------------------
    // Test 11: Wrong-category exclusion
    // ------------------------------------------------------------------
    const pubCatBServices = await makeRequest(
      `${API_BASE}/api/japa-services?category=${catB_Slug}`
    );
    const pubCatAServicesAfterMove = await makeRequest(
      `${API_BASE}/api/japa-services?category=${catA_Slug}`
    );
    const excludedFromA = !pubCatAServicesAfterMove.data?.data?.some((s) => s.id === serviceA_Id);
    const includedInB = pubCatBServices.data?.data?.some((s) => s.id === serviceA_Id);
    const uncatExcludedFromB = !pubCatBServices.data?.data?.some((s) => s.id === uncatServiceId);
    assert(
      excludedFromA && includedInB && uncatExcludedFromB,
      "11. Wrong-category exclusion (service does not leak into other categories or include uncategorized)",
      `excludedFromA: ${excludedFromA}, includedInB: ${includedInB}`
    );

    // ------------------------------------------------------------------
    // Test 12: Inactive category hiding
    // ------------------------------------------------------------------
    await makeRequest(`${API_BASE}/api/admin/japa-categories/${catA_Id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    const publicAfterDeact = await makeRequest(`${API_BASE}/api/japa-categories`);
    const isHiddenFromPublic = !publicAfterDeact.data?.data?.some((c) => c.id === catA_Id);
    const publicCatSlug404 = await makeRequest(`${API_BASE}/api/japa-categories/${catA_Slug}`);
    assert(
      isHiddenFromPublic && publicCatSlug404.status === 404,
      "12. Inactive category hiding (soft-deactivated category excluded from public listing and returns 404 on slug query)",
      `Hidden: ${isHiddenFromPublic}, 404: ${publicCatSlug404.status === 404}`
    );

    // ------------------------------------------------------------------
    // Test 13: Reactivation
    // ------------------------------------------------------------------
    await makeRequest(`${API_BASE}/api/admin/japa-categories/${catA_Id}`, {
      method: "PUT",
      headers: authHeaders,
      body: { isActive: true },
    });
    const publicAfterReact = await makeRequest(`${API_BASE}/api/japa-categories`);
    const isRestoredInPublic = publicAfterReact.data?.data?.some((c) => c.id === catA_Id);
    const publicCatSlug200 = await makeRequest(`${API_BASE}/api/japa-categories/${catA_Slug}`);
    assert(
      isRestoredInPublic && publicCatSlug200.status === 200,
      "13. Reactivation (reactivated category appears again in public discovery endpoints and slug endpoint)",
      `Restored: ${isRestoredInPublic}, 200: ${publicCatSlug200.status === 200}`
    );

    // ------------------------------------------------------------------
    // Test 14: Service preservation
    // ------------------------------------------------------------------
    // Move service back to Category A, deactivate Category A, verify service is preserved
    await makeRequest(`${API_BASE}/api/admin/japa-services/${serviceA_Id}`, {
      method: "PUT",
      headers: authHeaders,
      body: { categoryId: catA_Id },
    });
    await makeRequest(`${API_BASE}/api/admin/japa-categories/${catA_Id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    const svcAAfterDeact = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${serviceA_Id}`,
      { headers: authHeaders }
    );
    assert(
      svcAAfterDeact.status === 200 &&
        svcAAfterDeact.data?.data?.id === serviceA_Id &&
        svcAAfterDeact.data?.data?.categoryId === catA_Id,
      "14. Service preservation (services preserved after category deactivation without cascade deletion)",
      `Service exists: ${!!svcAAfterDeact.data?.data?.id}`
    );
    // Reactivate Category A
    await makeRequest(`${API_BASE}/api/admin/japa-categories/${catA_Id}`, {
      method: "PUT",
      headers: authHeaders,
      body: { isActive: true },
    });

    // ------------------------------------------------------------------
    // Test 15: Pricing preservation
    // ------------------------------------------------------------------
    const pricingLookup = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${serviceA_Id}`,
      { headers: authHeaders }
    );
    const svcAData = pricingLookup.data?.data;
    assert(
      Number(svcAData?.startingPrice) === 15000,
      "15. Pricing preservation (authoritative starting price and pricing integrity intact after category operations)",
      `Base price: ₹${svcAData?.startingPrice}`
    );

    // ------------------------------------------------------------------
    // Test 16: Booking preservation
    // ------------------------------------------------------------------
    const bookingConfigIntact =
      Array.isArray(svcAData?.availableCounts) &&
      svcAData?.availableCounts.length === 3 &&
      Number(svcAData?.minimumPandits) === 2 &&
      Number(svcAData?.recommendedPandits) === 4 &&
      Number(svcAData?.maximumPandits) === 11 &&
      Number(svcAData?.dailyCapacityPerPandit) === 2000;
    assert(
      bookingConfigIntact,
      "16. Booking preservation (pandit capacities, recitation counts, and capacity configuration preserved)",
      `Counts: ${svcAData?.availableCounts?.length}, Pandits: ${svcAData?.minimumPandits}-${svcAData?.maximumPandits}`
    );

    // ------------------------------------------------------------------
    // Test 17: Service detail consistency
    // ------------------------------------------------------------------
    const pubDetailRes = await makeRequest(`${API_BASE}/api/japa-services/${serviceA_Slug}`);
    assert(
      pubDetailRes.status === 200 &&
        pubDetailRes.data?.data?.slug === serviceA_Slug &&
        pubDetailRes.data?.data?.category?.id === catA_Id &&
        pubDetailRes.data?.data?.category?.name === `E2E Japa Category A ${testTimestamp}`,
      "17. Service detail consistency (GET /api/japa-services/:slug returns full ritual data with matching category)",
      `Category ID in detail: ${pubDetailRes.data?.data?.category?.id}`
    );

    // ------------------------------------------------------------------
    // Test 18: Category CRUD consistency
    // ------------------------------------------------------------------
    const catCrudSlug = `e2e-japa-cat-crud-${testTimestamp}`;
    const catCrudCreate = await makeRequest(`${API_BASE}/api/admin/japa-categories`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `E2E Japa Category CRUD ${testTimestamp}`,
        slug: catCrudSlug,
        description: "CRUD test category",
        displayOrder: 5,
        isActive: true,
      },
    });
    const catCrudId = catCrudCreate.data?.data?.id;
    const catCrudUpdate = await makeRequest(
      `${API_BASE}/api/admin/japa-categories/${catCrudId}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: { description: "Updated description" },
      }
    );
    const catCrudDelete = await makeRequest(
      `${API_BASE}/api/admin/japa-categories/${catCrudId}`,
      { method: "DELETE", headers: authHeaders }
    );
    assert(
      catCrudCreate.status === 201 &&
        catCrudUpdate.status === 200 &&
        catCrudDelete.status === 200,
      "18. Category CRUD consistency (Phase 3A category create, update, soft-delete full lifecycle)",
      `Create: ${catCrudCreate.status}, Update: ${catCrudUpdate.status}, Delete: ${catCrudDelete.status}`
    );

    // ------------------------------------------------------------------
    // Test 19: Admin service CRUD consistency
    // ------------------------------------------------------------------
    const crudTestSlug = `e2e-japa-crud-${testTimestamp}`;
    const crudCreate = await makeRequest(`${API_BASE}/api/admin/japa-services`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `E2E Japa CRUD Service ${testTimestamp}`,
        slug: crudTestSlug,
        mantra: "Om Tat Sat",
        startingPrice: 12000,
        availableCounts: [11000],
        minimumPandits: 1,
        recommendedPandits: 2,
        maximumPandits: 5,
        dailyCapacityPerPandit: 2000,
      },
    });
    const crudId = crudCreate.data?.data?.id;
    const crudDetail = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${crudId}`,
      { headers: authHeaders }
    );
    const crudDelete = await makeRequest(
      `${API_BASE}/api/admin/japa-services/${crudId}`,
      { method: "DELETE", headers: authHeaders }
    );
    assert(
      crudCreate.status === 201 &&
        crudDetail.status === 200 &&
        crudDelete.status === 200,
      "19. Admin service CRUD consistency (Phase 3B service create, detail, soft-delete full lifecycle)",
      `Create: ${crudCreate.status}, Detail: ${crudDetail.status}, Delete: ${crudDelete.status}`
    );

    // ------------------------------------------------------------------
    // Test 20: Customer/admin parity
    // ------------------------------------------------------------------
    const adminSvcCatA = await makeRequest(
      `${API_BASE}/api/admin/japa-services?category=${catA_Slug}`,
      { headers: authHeaders }
    );
    const pubSvcCatA = await makeRequest(
      `${API_BASE}/api/japa-services?category=${catA_Slug}`
    );
    const adminCatAIds = new Set(adminSvcCatA.data?.data?.map((s) => s.id));
    const pubCatAIds = new Set(pubSvcCatA.data?.data?.map((s) => s.id));
    const parityMatches =
      adminCatAIds.size === pubCatAIds.size &&
      [...adminCatAIds].every((id) => pubCatAIds.has(id));
    assert(
      parityMatches && adminCatAIds.has(serviceA_Id),
      "20. Customer/admin parity (services under category match 100% across Admin and Public catalogue queries)",
      `Admin count: ${adminCatAIds.size}, Public count: ${pubCatAIds.size}`
    );

  } catch (err) {
    console.error("Test execution exception:", err);
    failed++;
  } finally {
    // ------------------------------------------------------------------
    // Teardown
    // ------------------------------------------------------------------
    console.log("\n[Teardown] Cleaning up E2E test records...");
    const cleanupHeaders = {
      Authorization: `Bearer ${adminToken}`,
    };

    if (serviceA_Id) {
      try {
        await makeRequest(
          `${API_BASE}/api/admin/japa-services/${serviceA_Id}`,
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
          `${API_BASE}/api/admin/japa-services/${uncatServiceId}`,
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
          `${API_BASE}/api/admin/japa-categories/${catA_Id}`,
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
          `${API_BASE}/api/admin/japa-categories/${catB_Id}`,
          { method: "DELETE", headers: cleanupHeaders }
        );
        console.log(`  ✓ Cleaned up category B ${catB_Id}`);
      } catch (e) {
        console.warn("Could not delete category B:", e?.message);
      }
    }

    // Force purge any remaining test fixtures with e2e- prefix
    const { execSync } = require("child_process");
    try {
      execSync('node --env-file=.env -e "import(\'./src/models/index.js\').then(async ({ JapaService, JapaCategory }) => { const { Op } = await import(\'sequelize\'); await JapaService.destroy({ where: { slug: { [Op.like]: \'e2e-%\' } }, force: true }); await JapaCategory.destroy({ where: { slug: { [Op.like]: \'e2e-%\' } }, force: true }); process.exit(0); });"', { cwd: path.resolve(__dirname, "backend") });
      console.log("  ✓ Force purged any remaining e2e- test residues from database.");
    } catch (_) {}
  }

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log("==================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
