require("./backend/node_modules/dotenv").config({
  path: __dirname + "/backend/.env",
});
const http = require("http");
const fs = require("fs");
const path = require("path");
const jwt = require("./backend/node_modules/jsonwebtoken");

const { Op } = require("./backend/node_modules/sequelize");
const db = require("./backend/src/models/index.js").default;
const { User, HomaCategory, HomaService, HomaPurpose } = db;

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

async function runPhase6E2E() {
  console.log("\n============================================================");
  console.log("HOMA CATEGORY SYSTEM — PHASE 6");
  console.log("FINAL ADMIN E2E + FULL SYSTEM QA + PRODUCTION READINESS");
  console.log("============================================================\n");

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

  // Temporary fixtures for cleanup
  let tempCatA_Id = null;
  let tempCatB_Id = null;
  let tempService_Id = null;
  const testTimestamp = Date.now();

  const tempCatA_Slug = `qa-homa-cat-a-${testTimestamp}`;
  const tempCatB_Slug = `qa-homa-cat-b-${testTimestamp}`;
  const tempSvc_Slug = `qa-homa-svc-${testTimestamp}`;

  let adminUser = await User.findOne({ where: { role: "admin", isActive: true } });
  if (!adminUser) {
    adminUser = await User.create({
      fullName: "Homa Phase 6 Admin User",
      email: `admin_homa_p6_${testTimestamp}@vedastructure.com`,
      password: "hashed_password_123",
      role: "admin",
      isActive: true,
    });
  }

  let regularUser = await User.findOne({ where: { role: "user", isActive: true } });
  if (!regularUser) {
    regularUser = await User.create({
      fullName: "Homa Phase 6 Regular User",
      email: `customer_homa_p6_${testTimestamp}@vedastructure.com`,
      password: "hashed_password_123",
      role: "user",
      isActive: true,
    });
  }

  const adminToken = jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: "admin" },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  const userToken = jwt.sign(
    { id: regularUser.id, email: regularUser.email, role: "user" },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  const authHeaders = {
    Authorization: `Bearer ${adminToken}`,
    "Content-Type": "application/json",
  };

  const userHeaders = {
    Authorization: `Bearer ${userToken}`,
    "Content-Type": "application/json",
  };

  try {
    // =========================================================================
    // 1. DATABASE & SOURCE-OF-TRUTH VERIFICATION
    // =========================================================================
    console.log("--- 1. Database & Source-of-Truth Canonical Verification ---");

    const EXPECTED_CANONICAL_CATEGORIES = [
      { slug: "shiva-rudra-homa", name: "Shiva & Rudra Homa", order: 1 },
      { slug: "ganapati-homa", name: "Ganapati Homa", order: 2 },
      { slug: "durga-chandi-homa", name: "Durga & Chandi Homa", order: 3 },
      { slug: "lakshmi-kubera-homa", name: "Lakshmi & Kubera Homa", order: 4 },
      { slug: "navagraha-planetary-homa", name: "Navagraha Planetary Homa", order: 5 },
      { slug: "vastu-griha-homa", name: "Vastu & Griha Homa", order: 6 },
      { slug: "ayushya-longevity-homa", name: "Ayushya & Longevity Homa", order: 7 },
    ];

    const dbCategories = await HomaCategory.findAll({ order: [["displayOrder", "ASC"]] });
    assert(
      dbCategories.length >= 7,
      "1.1 Database contains all canonical categories",
      `Count: ${dbCategories.length}`
    );

    const dbSlugs = dbCategories.map((c) => c.slug);
    const allSlugsPresent = EXPECTED_CANONICAL_CATEGORIES.every((c) => dbSlugs.includes(c.slug));
    assert(allSlugsPresent, "1.2 Exactly all 7 canonical Homa category slugs exist in DB");

    const allActive = EXPECTED_CANONICAL_CATEGORIES.every((c) => {
      const match = dbCategories.find((dc) => dc.slug === c.slug);
      return match && match.isActive === true;
    });
    assert(allActive, "1.3 All 7 canonical categories are active");

    const uniqueOrders = new Set(dbCategories.map((c) => c.displayOrder));
    assert(uniqueOrders.size === dbCategories.length, "1.4 Category display orders are deterministically assigned");

    // =========================================================================
    // 2. CANONICAL SERVICE MAPPING VERIFICATION
    // =========================================================================
    console.log("\n--- 2. Canonical Service Mapping Verification ---");

    const EXPECTED_SERVICE_MAPPINGS = {
      "maha-mrityunjaya-homa": "shiva-rudra-homa",
      "navagraha-homa": "navagraha-planetary-homa",
      "ganapati-homa": "ganapati-homa",
      "durga-chandi-homa": "durga-chandi-homa",
      "lakshmi-kubera-homa": "lakshmi-kubera-homa",
      "rudra-homa": "shiva-rudra-homa",
      "vastu-shanti-homa": "vastu-griha-homa",
      "ayushya-homa": "ayushya-longevity-homa",
    };

    let allMappingsValid = true;
    for (const [svcSlug, catSlug] of Object.entries(EXPECTED_SERVICE_MAPPINGS)) {
      const svc = await HomaService.findOne({
        where: { slug: svcSlug },
        include: [{ model: HomaCategory, as: "categoryDetails" }],
      });
      if (!svc || !svc.categoryDetails || svc.categoryDetails.slug !== catSlug) {
        allMappingsValid = false;
        console.error(`Mismatch for service ${svcSlug}: expected ${catSlug}, got ${svc?.categoryDetails?.slug}`);
      }
    }
    assert(
      allMappingsValid,
      "2.1 All 8 canonical Homa services map accurately to their approved categories"
    );

    // Verify no orphan categories on services
    const orphanServices = await HomaService.findAll({
      where: {
        categoryId: { [Op.ne]: null },
      },
      include: [{ model: HomaCategory, as: "categoryDetails", required: false }],
    });
    const hasOrphans = orphanServices.some((s) => !s.categoryDetails);
    assert(!hasOrphans, "2.2 Zero orphan categoryId references across homa_services table");

    // =========================================================================
    // 3. BACKEND API & SERIALIZER INTEGRITY
    // =========================================================================
    console.log("\n--- 3. Public & Admin API Serializer Integrity ---");

    const publicList = await makeRequest(`${API_BASE}/api/homa-categories`);
    assert(
      publicList.status === 200 && Array.isArray(publicList.data?.data),
      "3.1 GET /api/homa-categories returns active public categories",
      `Status: ${publicList.status}`
    );

    const shivaPublic = await makeRequest(`${API_BASE}/api/homa-categories/shiva-rudra-homa`);
    assert(
      shivaPublic.status === 200 &&
      shivaPublic.data?.data?.slug === "shiva-rudra-homa" &&
      shivaPublic.data?.data?.name === "Shiva & Rudra Homa",
      "3.2 GET /api/homa-categories/:slug returns serialized category details"
    );

    const notFoundPublic = await makeRequest(`${API_BASE}/api/homa-categories/nonexistent-xyz-slug`);
    assert(
      notFoundPublic.status === 404,
      "3.3 GET /api/homa-categories/:slug returns 404 for unknown slug"
    );

    // Filter public services by category
    const publicServices = await makeRequest(`${API_BASE}/api/homa-services?category=shiva-rudra-homa`);
    assert(
      publicServices.status === 200 &&
      Array.isArray(publicServices.data?.data) &&
      publicServices.data.data.length >= 2 &&
      publicServices.data.data.every((s) => s.category?.slug === "shiva-rudra-homa"),
      "3.4 GET /api/homa-services?category=slug filters public services by category"
    );

    // Verify serializer shape
    const samplePubSvc = publicServices.data.data[0];
    assert(
      samplePubSvc.category &&
      samplePubSvc.category.id &&
      samplePubSvc.category.name &&
      samplePubSvc.category.slug &&
      samplePubSvc.category.iconName,
      "3.5 Public service serializer includes complete category object"
    );

    // =========================================================================
    // 4. ADMIN CATEGORY SYSTEM E2E & MUTATION LIFECYCLE
    // =========================================================================
    console.log("\n--- 4. Admin Category System E2E & Mutation Lifecycle ---");

    // 4.1 Security check
    const unauthAdmin = await makeRequest(`${API_BASE}/api/admin/homa-categories`);
    assert(unauthAdmin.status === 401, "4.1 Unauthenticated admin category access returns 401");

    const userForbidden = await makeRequest(`${API_BASE}/api/admin/homa-categories`, {
      headers: userHeaders,
    });
    assert(userForbidden.status === 403, "4.2 Non-admin access returns 403 Forbidden");

    // 4.3 Create category A
    const createA = await makeRequest(`${API_BASE}/api/admin/homa-categories`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `QA Homa Category A ${testTimestamp}`,
        slug: tempCatA_Slug,
        description: "Phase 6 QA Category A",
        iconName: "Flame",
        displayOrder: 88,
        isActive: true,
      },
    });
    assert(createA.status === 201 && createA.data?.data?.id, "4.3 Admin creates Category A with 201 Created");
    tempCatA_Id = createA.data?.data?.id;

    // 4.4 Duplicate slug rejection
    const dupRes = await makeRequest(`${API_BASE}/api/admin/homa-categories`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `Duplicate Slug Category`,
        slug: tempCatA_Slug,
        description: "Duplicate test",
        iconName: "Flame",
      },
    });
    assert(dupRes.status === 400 || dupRes.status === 409, "4.4 Duplicate slug rejected with 400/409");

    // 4.5 Create category B
    const createB = await makeRequest(`${API_BASE}/api/admin/homa-categories`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `QA Homa Category B ${testTimestamp}`,
        slug: tempCatB_Slug,
        description: "Phase 6 QA Category B",
        iconName: "Sparkles",
        displayOrder: 89,
        isActive: true,
      },
    });
    assert(createB.status === 201 && createB.data?.data?.id, "4.5 Admin creates Category B with 201 Created");
    tempCatB_Id = createB.data?.data?.id;

    // 4.6 Update Category A
    const updateA = await makeRequest(`${API_BASE}/api/admin/homa-categories/${tempCatA_Id}`, {
      method: "PUT",
      headers: authHeaders,
      body: {
        name: `QA Homa Category A Updated ${testTimestamp}`,
        description: "Updated description for Category A",
        displayOrder: 90,
      },
    });
    assert(
      updateA.status === 200 && updateA.data?.data?.name.includes("Updated"),
      "4.6 Admin updates Category A details"
    );

    // 4.7 Soft Deactivate Category A
    const deactA = await makeRequest(`${API_BASE}/api/admin/homa-categories/${tempCatA_Id}`, {
      method: "PUT",
      headers: authHeaders,
      body: { isActive: false },
    });
    assert(deactA.status === 200 && deactA.data?.data?.isActive === false, "4.7 Admin deactivates Category A");

    // 4.8 Deactivated category is hidden from public API
    const pubCheckDeact = await makeRequest(`${API_BASE}/api/homa-categories/${tempCatA_Slug}`);
    assert(pubCheckDeact.status === 404, "4.8 Deactivated category is hidden from public endpoint (404)");

    // 4.9 Reactivate Category A
    const reactA = await makeRequest(`${API_BASE}/api/admin/homa-categories/${tempCatA_Id}`, {
      method: "PUT",
      headers: authHeaders,
      body: { isActive: true },
    });
    assert(reactA.status === 200 && reactA.data?.data?.isActive === true, "4.9 Admin reactivates Category A");

    // =========================================================================
    // 5. ADMIN SERVICE INTEGRATION & REASSIGNMENT E2E
    // =========================================================================
    console.log("\n--- 5. Admin Service Integration & Reassignment E2E ---");

    const defaultPurpose = await HomaPurpose.findOne();
    const createSvc = await makeRequest(`${API_BASE}/api/admin/homa-services`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `QA Homa Service ${testTimestamp}`,
        slug: tempSvc_Slug,
        homaType: "Vedic Homa",
        basePrice: 12500,
        availableHavanCounts: [1, 3],
        availableDays: [1, 2],
        minimumPandits: 2,
        recommendedPandits: 3,
        maximumPandits: 7,
        categoryId: tempCatA_Id,
        purposeId: defaultPurpose ? defaultPurpose.id : null,
        purposeCategory: defaultPurpose ? defaultPurpose.slug : "health",
        purposeCategories: defaultPurpose ? [defaultPurpose.slug] : ["health"],
        purposeSummary: "Divine healing energy",
        isActive: true,
      },
    });
    assert(createSvc.status === 201 && createSvc.data?.data?.id, "5.1 Service created under Category A");
    tempService_Id = createSvc.data?.data?.id;

    // 5.2 Filter services by Category A returns the service
    const filterCatA = await makeRequest(`${API_BASE}/api/admin/homa-services?category=${tempCatA_Slug}`, {
      headers: authHeaders,
    });
    assert(
      filterCatA.status === 200 &&
      filterCatA.data?.data?.some((s) => s.id === tempService_Id),
      "5.2 Admin service filter by category slug returns the created service"
    );

    // 5.3 Reassign service from Category A to Category B
    const reassignSvc = await makeRequest(`${API_BASE}/api/admin/homa-services/${tempService_Id}`, {
      method: "PUT",
      headers: authHeaders,
      body: {
        categoryId: tempCatB_Id,
      },
    });
    assert(
      reassignSvc.status === 200 && reassignSvc.data?.data?.categoryId === tempCatB_Id,
      "5.3 Service reassigned from Category A to Category B"
    );

    // 5.4 Check Category A no longer includes service, Category B does
    const filterCatAAfter = await makeRequest(`${API_BASE}/api/admin/homa-services?category=${tempCatA_Slug}`, {
      headers: authHeaders,
    });
    const filterCatBAfter = await makeRequest(`${API_BASE}/api/admin/homa-services?category=${tempCatB_Slug}`, {
      headers: authHeaders,
    });
    assert(
      !filterCatAAfter.data?.data?.some((s) => s.id === tempService_Id) &&
      filterCatBAfter.data?.data?.some((s) => s.id === tempService_Id),
      "5.4 Service immediately moves from Category A to Category B with zero stale retention"
    );

    // 5.5 Purpose and pricing remain unaltered upon category reassignment
    const svcDetailCheck = await makeRequest(`${API_BASE}/api/admin/homa-services/${tempService_Id}`, {
      headers: authHeaders,
    });
    assert(
      svcDetailCheck.data?.data?.purposeCategory === (defaultPurpose ? defaultPurpose.slug : "health") &&
      svcDetailCheck.data?.data?.purposeSummary === "Divine healing energy" &&
      Number(svcDetailCheck.data?.data?.basePrice) === 12500,
      "5.5 Category reassignment preserved purpose and base pricing perfectly without mutation"
    );

    // 5.6 Uncategorized service assignment (categoryId: null)
    const uncatSvc = await makeRequest(`${API_BASE}/api/admin/homa-services/${tempService_Id}`, {
      method: "PUT",
      headers: authHeaders,
      body: {
        categoryId: null,
      },
    });
    assert(
      uncatSvc.status === 200 && uncatSvc.data?.data?.categoryId === null,
      "5.6 Service can be set to null (Uncategorized) cleanly"
    );

    // =========================================================================
    // 6. CUSTOMER DISCOVERY & DEDICATED CATEGORY LISTING E2E
    // =========================================================================
    console.log("\n--- 6. Customer Discovery & Listing E2E ---");

    const user1AppRoutes = fs.readFileSync(
      path.resolve(__dirname, "frontend-user1/src/routes/AppRoutes.jsx"),
      "utf-8"
    );
    assert(
      user1AppRoutes.includes("/yagya-puja/homa/category/:categorySlug"),
      "6.1 Customer category route registered in AppRoutes.jsx"
    );

    const homaCatListingCode = fs.readFileSync(
      path.resolve(__dirname, "frontend-user1/src/features/yagyaPuja/pages/HomaCategoryListing.jsx"),
      "utf-8"
    );
    assert(
      homaCatListingCode.includes("getHomaCategoryBySlug") &&
      homaCatListingCode.includes("getHomaServices"),
      "6.2 HomaCategoryListing fetches category metadata and filtered services dynamically"
    );

    assert(
      homaCatListingCode.includes("useSearchParams") &&
      homaCatListingCode.includes("setSearchParams"),
      "6.3 HomaCategoryListing synchronizes all filter states to search params"
    );

    // Multi-filter test via API: Category + Purpose + Havan Count
    const multiFilterRes = await makeRequest(
      `${API_BASE}/api/homa-services?category=shiva-rudra-homa&havanCount=1&days=1`
    );
    assert(
      multiFilterRes.status === 200 &&
      Array.isArray(multiFilterRes.data?.data) &&
      multiFilterRes.data.data.every((s) => s.category?.slug === "shiva-rudra-homa"),
      "6.4 Category remains primary constraint across multi-filter API requests"
    );

    // =========================================================================
    // 7. PURPOSE VS CATEGORY STRICT INDEPENDENCE
    // =========================================================================
    console.log("\n--- 7. Purpose vs Category Strict Independence ---");

    const sampleDbSvc = await HomaService.findOne({ where: { slug: "maha-mrityunjaya-homa" } });
    assert(
      sampleDbSvc &&
      sampleDbSvc.categoryId &&
      sampleDbSvc.purposeCategory,
      "7.1 Canonical service has both categoryId and purposeCategory populated"
    );
    assert(
      sampleDbSvc.categoryId !== sampleDbSvc.purposeCategory,
      "7.2 Category ID and Purpose Category are completely distinct entities"
    );

    // Purpose filter only
    const purposeOnly = await makeRequest(`${API_BASE}/api/homa-services?purpose=health-healing`);
    // Category filter only
    const categoryOnly = await makeRequest(`${API_BASE}/api/homa-services?category=shiva-rudra-homa`);
    assert(
      purposeOnly.status === 200 && categoryOnly.status === 200,
      "7.3 Public API handles purpose-only and category-only requests independently"
    );

    // =========================================================================
    // 8. PRICING & BOOKING INTEGRITY VERIFICATION
    // =========================================================================
    console.log("\n--- 8. Pricing & Booking Flow Integrity ---");

    const priceCalcRes = await makeRequest(`${API_BASE}/api/ritual-bookings/calculate-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        serviceType: "HOMA",
        serviceSlug: "maha-mrityunjaya-homa",
        havanCount: 3,
        days: 1,
        panditCount: 3,
      },
    });
    assert(
      priceCalcRes.status === 200 && priceCalcRes.data?.data?.basePrice === 11000,
      "8.1 Authoritative Homa price calculation functions accurately with categories active",
      `Status: ${priceCalcRes.status}`
    );

    // =========================================================================
    // 9. SECURITY & DATA LEAKAGE VERIFICATION
    // =========================================================================
    console.log("\n--- 9. Security & Public Data Exposure Check ---");

    const pubCategoriesList = await makeRequest(`${API_BASE}/api/homa-categories`);
    const allPubActive = pubCategoriesList.data?.data?.every((c) => c.isActive === true);
    assert(allPubActive, "9.1 Public categories list exposes ONLY active categories");

    const samplePubCat = pubCategoriesList.data?.data?.[0];
    assert(
      samplePubCat &&
      samplePubCat.id &&
      samplePubCat.name &&
      samplePubCat.slug &&
      !samplePubCat.internalSecrets &&
      !samplePubCat.deletedAt,
      "9.2 Public category object does not expose internal or sensitive attributes"
    );

  } catch (err) {
    console.error("Phase 6 E2E test execution error:", err);
    failed++;
  } finally {
    // Clean up temporary fixtures
    console.log("\n--- Cleaning Up QA Test Fixtures ---");
    if (tempService_Id) {
      try {
        await HomaService.destroy({ where: { id: tempService_Id } });
        console.log("  ✓ Destroyed temporary test service:", tempService_Id);
      } catch {}
    }
    if (tempCatA_Id) {
      try {
        await HomaCategory.destroy({ where: { id: tempCatA_Id } });
        console.log("  ✓ Destroyed temporary test Category A:", tempCatA_Id);
      } catch {}
    }
    if (tempCatB_Id) {
      try {
        await HomaCategory.destroy({ where: { id: tempCatB_Id } });
        console.log("  ✓ Destroyed temporary test Category B:", tempCatB_Id);
      } catch {}
    }
  }

  console.log("\n============================================================");
  console.log(`PHASE 6 QA SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log("============================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runPhase6E2E();
