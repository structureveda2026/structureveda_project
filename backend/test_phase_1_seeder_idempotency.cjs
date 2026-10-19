process.env.NODE_ENV = "test";

const assert = require("assert");

async function testSeederIdempotency() {
  console.log("\n========================================================");
  console.log(" Testing Astrologer Seeder Idempotency & Safety");
  console.log("========================================================\n");

  const modelsMod = await import("./src/models/index.js");
  const { Astrologer, AstrologerPackage, sequelize } = modelsMod.default;

  // 1. Snapshot counts before running
  const countAstrologersBefore = await Astrologer.count();
  const countPackagesBefore = await AstrologerPackage.count();
  console.log(`[STATE] Astrologers in DB before test: ${countAstrologersBefore}`);
  console.log(`[STATE] Packages in DB before test: ${countPackagesBefore}`);

  assert(countAstrologersBefore >= 2, "Must have at least 2 astrologers");
  assert(countPackagesBefore >= 8, "Must have at least 8 packages");

  // Snapshot Vishal's bio and price to prove seeder will not mutate or overwrite
  const vishalBefore = await Astrologer.findOne({ where: { code: "ast-vishal" } });
  const pkgBefore = await AstrologerPackage.findOne({
    where: { astrologerId: vishalBefore.id, packageKey: "complete" },
  });

  // 2. Test Sequelize CLI Seeder (backend/seeders/20261016223000-seed-astrologers.cjs)
  console.log("\n[TEST 1] Testing Sequelize CLI seeder up() idempotency...");
  const seeder = require("./seeders/20261016223000-seed-astrologers.cjs");
  assert(typeof seeder.up === "function", "Seeder must have up function");
  assert(typeof seeder.down === "function", "Seeder must have down function");

  const queryInterface = sequelize.getQueryInterface();

  // Spy on bulkInsert to verify no duplicate inserts are made
  let bulkInsertCount = 0;
  const originalBulkInsert = queryInterface.bulkInsert;
  queryInterface.bulkInsert = async function (table, rows, options) {
    bulkInsertCount++;
    return originalBulkInsert.call(this, table, rows, options);
  };

  try {
    await seeder.up(queryInterface, sequelize.Sequelize);
  } finally {
    queryInterface.bulkInsert = originalBulkInsert;
  }

  assert.strictEqual(
    bulkInsertCount,
    0,
    "Idempotent seeder must NOT call bulkInsert when records already exist!"
  );
  console.log(" -> [PASS] Sequelize CLI seeder performed 0 inserts and detected all existing records.");

  // 3. Test standalone seed script (backend/src/scripts/seedAstrologers.js)
  console.log("\n[TEST 2] Testing standalone seedAstrologers() script idempotency...");
  const scriptMod = await import("./src/scripts/seedAstrologers.js");
  assert(typeof scriptMod.seedAstrologers === "function");

  await scriptMod.seedAstrologers();
  console.log(" -> [PASS] Standalone seedAstrologers() script executed without errors.");

  // 4. Verify DB state is completely unchanged
  const countAstrologersAfter = await Astrologer.count();
  const countPackagesAfter = await AstrologerPackage.count();

  assert.strictEqual(countAstrologersBefore, countAstrologersAfter, "Astrologer count must not change");
  assert.strictEqual(countPackagesBefore, countPackagesAfter, "Package count must not change");

  const vishalAfter = await Astrologer.findOne({ where: { code: "ast-vishal" } });
  const pkgAfter = await AstrologerPackage.findOne({
    where: { astrologerId: vishalBefore.id, packageKey: "complete" },
  });

  assert.strictEqual(vishalBefore.name, vishalAfter.name);
  assert.strictEqual(vishalBefore.title, vishalAfter.title);
  assert.strictEqual(Number(pkgBefore.price), Number(pkgAfter.price));
  console.log(" -> [PASS] Existing records remain completely intact and unmodified.");

  console.log("\n========================================================");
  console.log(" ALL SEEDER IDEMPOTENCY TESTS PASSED SUCCESSFULLY!");
  console.log("========================================================\n");

  await sequelize.close();
  process.exit(0);
}

testSeederIdempotency().catch((err) => {
  console.error("\n[FAIL] Seeder test failed:", err);
  process.exit(1);
});
