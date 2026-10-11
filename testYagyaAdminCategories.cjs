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
  console.log("PHASE 3A: YAGYA ADMIN CATEGORY TEST SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;
  let createdCatId = null;
  let createdServiceId = null;
  const testTimestamp = Date.now();
  const testSlug = `test-yagya-cat-${testTimestamp}`;
  const testName = `Test Rudra Yagya Category ${testTimestamp}`;
  const updatedTestName = `Updated Rudra Yagya Category ${testTimestamp}`;

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
    console.log("  ✓ Tokens generated successfully.\n");

    const authHeaders = {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    };

    // Test 1: Admin category list loads
    const listRes = await makeRequest(`${API_BASE}/api/admin/yagya-categories`, {
      headers: authHeaders,
    });
    assert(
      listRes.status === 200 &&
        listRes.data?.success === true &&
        Array.isArray(listRes.data?.data),
      "1. Admin category list loads",
      `Status: ${listRes.status}`
    );

    // Test 2: Authentication required
    const unauthRes = await makeRequest(`${API_BASE}/api/admin/yagya-categories`);
    assert(
      unauthRes.status === 401,
      "2. Authentication required (401 without token)",
      `Status: ${unauthRes.status}`
    );

    // Test 3: Unauthorized admin blocked
    const forbiddenRes = await makeRequest(`${API_BASE}/api/admin/yagya-categories`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    assert(
      forbiddenRes.status === 403,
      "3. Unauthorized admin blocked (403 for non-admin role)",
      `Status: ${forbiddenRes.status}`
    );

    // Test 4: Search works
    const searchRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-categories?search=shiva`,
      { headers: authHeaders }
    );
    const shivaFound = searchRes.data?.data?.every(
      (c) =>
        c.name.toLowerCase().includes("shiva") ||
        c.slug.toLowerCase().includes("shiva") ||
        (c.description && c.description.toLowerCase().includes("shiva"))
    );
    assert(
      searchRes.status === 200 && (searchRes.data?.data?.length === 0 || shivaFound),
      "4. Search works correctly with query filter",
      `Count: ${searchRes.data?.data?.length}`
    );

    // Test 5: Status filter works
    const activeRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-categories?isActive=true`,
      { headers: authHeaders }
    );
    const allActive = activeRes.data?.data?.every((c) => c.isActive === true);
    assert(
      activeRes.status === 200 && allActive,
      "5. Status filter works (isActive=true returns only active)",
      `Count: ${activeRes.data?.data?.length}`
    );

    // Test 6: Create category
    const createRes = await makeRequest(`${API_BASE}/api/admin/yagya-categories`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: testName,
        slug: testSlug,
        description: "Specialized Vedic Rudra Yagya category for healing and peace.",
        iconName: "Flame",
        displayOrder: 99,
        isActive: true,
      },
    });
    if (createRes.status === 201 && createRes.data?.data?.id) {
      createdCatId = createRes.data.data.id;
    }
    assert(
      createRes.status === 201 &&
        createRes.data?.success === true &&
        createRes.data?.data?.slug === testSlug,
      "6. Create category",
      `Status: ${createRes.status}, Message: ${createRes.data?.message}`
    );

    // Test 7: Required validation
    const missingNameRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-categories`,
      {
        method: "POST",
        headers: authHeaders,
        body: {
          slug: `test-missing-name-${Date.now()}`,
          description: "Missing required category name",
        },
      }
    );
    assert(
      missingNameRes.status === 400 && missingNameRes.data?.success === false,
      "7. Required validation (rejects empty name with 400)",
      `Status: ${missingNameRes.status}`
    );

    // Test 8: Slug generation verification in frontend files
    const formCode = fs.readFileSync(
      path.resolve(
        __dirname,
        "admin-veda-structure/src/pages/YagyaCategoryForm.tsx"
      ),
      "utf-8"
    );
    const hasSlugGen =
      formCode.includes("slugify") &&
      formCode.includes("handleNameChange") &&
      formCode.includes("slugManuallyEdited");
    assert(
      hasSlugGen,
      "8. Slug generation (auto-generates slug from name and allows manual edit)",
      "YagyaCategoryForm missing auto-slug logic"
    );

    // Test 9: Duplicate slug error
    const dupRes = await makeRequest(`${API_BASE}/api/admin/yagya-categories`, {
      method: "POST",
      headers: authHeaders,
      body: {
        name: `Duplicate Slug Test ${testTimestamp}`,
        slug: testSlug,
        description: "Attempting duplicate slug creation",
      },
    });
    assert(
      dupRes.status === 409 && dupRes.data?.success === false,
      "9. Duplicate slug error (returns 409 conflict)",
      `Status: ${dupRes.status}`
    );

    // Test 10: Edit category
    const updateRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-categories/${createdCatId}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: {
          name: updatedTestName,
          description: "Updated description for Rudra Yagya category.",
          displayOrder: 88,
        },
      }
    );
    assert(
      updateRes.status === 200 &&
        updateRes.data?.data?.name === updatedTestName &&
        updateRes.data?.data?.displayOrder === 88,
      "10. Edit category (updates fields and returns 200)",
      `Status: ${updateRes.status}, Error: ${JSON.stringify(updateRes.data)}`
    );

    // Test 11: View category
    const viewRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-categories/${createdCatId}`,
      { headers: authHeaders }
    );
    assert(
      viewRes.status === 200 &&
        viewRes.data?.data?.id === createdCatId &&
        viewRes.data?.data?.name === updatedTestName,
      "11. View category (returns complete detail payload)",
      `Status: ${viewRes.status}`
    );

    // Test 12: Deactivate category
    const deactRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-categories/${createdCatId}`,
      {
        method: "DELETE",
        headers: authHeaders,
      }
    );
    const checkDeactRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-categories/${createdCatId}`,
      { headers: authHeaders }
    );
    assert(
      deactRes.status === 200 && checkDeactRes.data?.data?.isActive === false,
      "12. Deactivate category (soft deletes with isActive: false)",
      `Status: ${deactRes.status}, isActive: ${checkDeactRes.data?.data?.isActive}`
    );

    // Test 13: Reactivate category
    const reactRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-categories/${createdCatId}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: {
          isActive: true,
        },
      }
    );
    const checkReactRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-categories/${createdCatId}`,
      { headers: authHeaders }
    );
    assert(
      reactRes.status === 200 && checkReactRes.data?.data?.isActive === true,
      "13. Reactivate category (restores isActive: true)",
      `Status: ${reactRes.status}, isActive: ${checkReactRes.data?.data?.isActive}`
    );

    // Test 14: Display order
    const orderRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-categories/${createdCatId}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: {
          displayOrder: 15,
        },
      }
    );
    assert(
      orderRes.status === 200 && orderRes.data?.data?.displayOrder === 15,
      "14. Display order (persists custom displayOrder numeric field)",
      `DisplayOrder: ${orderRes.data?.data?.displayOrder}`
    );

    // Test 15: Image handling if supported
    const imageRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-categories/${createdCatId}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: {
          image: "https://res.cloudinary.com/veda/image/upload/v1/yagya/categories/test.jpg",
        },
      }
    );
    assert(
      imageRes.status === 200 &&
        imageRes.data?.data?.image ===
          "https://res.cloudinary.com/veda/image/upload/v1/yagya/categories/test.jpg",
      "15. Image handling if supported (accepts and stores Cloudinary image URL)",
      `Image: ${imageRes.data?.data?.image}`
    );

    // Test 16: Yagya service category assignment
    const svcSlug = `test-svc-assign-${Date.now()}`;
    const createSvcRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services`,
      {
        method: "POST",
        headers: authHeaders,
        body: {
          name: "Test Assignment Yagya",
          slug: svcSlug,
          deity: "Lord Shiva",
          startingPrice: 5100,
          availableMode: "hybrid",
          categoryId: createdCatId,
        },
      }
    );
    if (createSvcRes.status === 201 && createSvcRes.data?.data?.id) {
      createdServiceId = createSvcRes.data.data.id;
    }
    assert(
      createSvcRes.status === 201 &&
        createSvcRes.data?.data?.categoryId === createdCatId,
      "16. Yagya service category assignment (assigns categoryId on create/update)",
      `Status: ${createSvcRes.status}, categoryId: ${createSvcRes.data?.data?.categoryId}`
    );

    // Test 17: Inactive category safety
    await makeRequest(
      `${API_BASE}/api/admin/yagya-categories/${createdCatId}`,
      {
        method: "DELETE",
        headers: authHeaders,
      }
    );
    const verifySvcRes = await makeRequest(
      `${API_BASE}/api/admin/yagya-services/${createdServiceId}`,
      { headers: authHeaders }
    );
    assert(
      verifySvcRes.status === 200 &&
        verifySvcRes.data?.data?.id === createdServiceId &&
        verifySvcRes.data?.data?.categoryId === createdCatId,
      "17. Inactive category safety (deactivating category preserves Yagya services and foreign keys)",
      `Service exists: ${!!verifySvcRes.data?.data?.id}`
    );

    // Test 18: Public API excludes inactive category
    const publicCatRes = await makeRequest(`${API_BASE}/api/yagya-categories`);
    const foundInPublic = publicCatRes.data?.data?.some(
      (c) => c.id === createdCatId || c.slug === testSlug
    );
    assert(
      publicCatRes.status === 200 && !foundInPublic,
      "18. Public API excludes inactive category (deactivated category hidden from customer endpoints)",
      `Found in public: ${foundInPublic}`
    );

    // Test 19: Existing Yagya services remain intact
    const allSvcRes = await makeRequest(`${API_BASE}/api/admin/yagya-services`, {
      headers: authHeaders,
    });
    const testSvcStillExists = allSvcRes.data?.data?.some(
      (s) => s.id === createdServiceId
    );
    assert(
      allSvcRes.status === 200 && testSvcStillExists,
      "19. Existing Yagya services remain intact (catalogue services intact after category lifecycle events)",
      `Test service intact: ${testSvcStillExists}`
    );

    // Test 20: Sidebar/routes are registered correctly
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
    const sidebarOk =
      sidebarContent.includes("/admin/yagya/categories") &&
      sidebarContent.includes("Yagya Categories") &&
      sidebarContent.includes("All Yagya");
    const routesOk =
      appContent.includes("yagya/categories") &&
      appContent.includes("YagyaCategories") &&
      appContent.includes("YagyaCategoryForm") &&
      appContent.includes("YagyaCategoryDetail");
    assert(
      sidebarOk && routesOk,
      "20. Sidebar/routes are registered correctly (Yagya Categories in Sidebar and App routes)",
      `sidebarOk: ${sidebarOk}, routesOk: ${routesOk}`
    );

  } catch (err) {
    console.error("Test execution exception:", err);
    failed++;
  } finally {
    // Cleanup created test records
    console.log("\n[Teardown] Cleaning up test records...");
    if (createdServiceId) {
      try {
        await makeRequest(
          `${API_BASE}/api/admin/yagya-services/${createdServiceId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${jwt.sign(
                { id: "12db9f31-e424-42f2-85e2-c7e669cf2e00", role: "admin" },
                JWT_SECRET
              )}`,
            },
          }
        );
        console.log(`  ✓ Cleaned up test service ${createdServiceId}`);
      } catch (err) {
        console.warn("Could not delete test service:", err?.message);
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
