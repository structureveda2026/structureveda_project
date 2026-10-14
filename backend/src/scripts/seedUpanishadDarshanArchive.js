import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import sequelize from "../config/database.js";
import Veda from "../modules/library/models/veda.model.js";
import VedaNode from "../modules/library/models/vedaNode.model.js";
import VedaMantra from "../modules/library/models/vedaMantra.model.js";
import {
  INITIAL_UPANISHADS,
  INITIAL_DARSHANAS,
  INITIAL_GRANTHA_NODES,
  INITIAL_GRANTHA_MANTRAS,
} from "../modules/library/data/initialGranthaHeritageData.js";

/**
 * Seed Upanishads & Darshanas into PostgreSQL Database
 */
export async function seedUpanishadDarshanArchive() {
  console.log("================================================================================");
  console.log("UPANISHAD & DARSHANA PHILOSOPHY DATABASE SEEDER");
  console.log("================================================================================");
  console.log(`Dataset Summary:`);
  console.log(`  • Mukhya Upanishads: ${INITIAL_UPANISHADS.length}`);
  console.log(`  • Shad-Darshanas:    ${INITIAL_DARSHANAS.length}`);
  const allTexts = [...INITIAL_UPANISHADS, ...INITIAL_DARSHANAS];
  const allTextIds = new Set(allTexts.map((t) => t.id));
  const nodes = INITIAL_GRANTHA_NODES.filter((n) => allTextIds.has(n.vedaId));
  const mantras = INITIAL_GRANTHA_MANTRAS.filter((m) => allTextIds.has(m.vedaId));

  console.log(`  • Hierarchy Nodes:   ${nodes.length} (Khandas, Vallis, Padas, Adhyayas)`);
  console.log(`  • Mantras / Sutras:  ${mantras.length}`);
  console.log("================================================================================\n");

  try {
    console.log("Connecting to PostgreSQL database...");
    await sequelize.authenticate();
    console.log("Database connection established successfully.\n");
  } catch (authErr) {
    console.warn(`[WARN] Database connection could not be established: ${authErr.message}`);
    console.warn("   Static fallback mode remains fully active.\n");
    return {
      success: false,
      reason: authErr.message,
      textsCount: allTexts.length,
      nodesCount: nodes.length,
      mantrasCount: mantras.length,
    };
  }

  try {
    // 1. Sync models
    console.log("Synchronizing database tables...");
    await Veda.sync();
    await VedaNode.sync();
    await VedaMantra.sync();
    console.log("Tables synchronized successfully.\n");

    // 2. Upsert texts
    console.log("1. Upserting Upanishads and Darshanas...");
    let seededTexts = 0;
    for (const t of allTexts) {
      await Veda.upsert({
        ...t,
        category: t.category === "darshan" ? "darshana" : t.category,
      });
      seededTexts++;
    }
    console.log(`Seeded ${seededTexts} texts.\n`);

    // 3. Upsert nodes
    console.log("2. Upserting tree nodes...");
    let seededNodes = 0;
    for (const n of nodes) {
      await VedaNode.upsert(n);
      seededNodes++;
    }
    console.log(`Seeded ${seededNodes} hierarchy nodes.\n`);

    // 4. Upsert mantras / sutras
    console.log("3. Upserting mantras and sutras...");
    let seededMantras = 0;
    for (const m of mantras) {
      await VedaMantra.upsert(m);
      seededMantras++;
    }
    console.log(`Seeded ${seededMantras} mantras and sutras.\n`);

    console.log("================================================================================");
    console.log("UPANISHAD & DARSHANA SEEDING COMPLETED SUCCESSFULLY!");
    console.log("================================================================================");

    return {
      success: true,
      textsCount: seededTexts,
      nodesCount: seededNodes,
      mantrasCount: seededMantras,
    };
  } catch (err) {
    console.error("Error during seeding:", err);
    return {
      success: false,
      error: err.message,
    };
  }
}

// Direct execution
if (process.argv[1] && process.argv[1].endsWith("seedUpanishadDarshanArchive.js")) {
  seedUpanishadDarshanArchive()
    .then((result) => {
      console.log("Result:", result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export default seedUpanishadDarshanArchive;
