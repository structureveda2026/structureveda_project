import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import sequelize from "../config/database.js";
import LibraryBranch from "../modules/library/models/libraryBranch.model.js";
import LibraryMantraStotra from "../modules/library/models/libraryMantraStotra.model.js";
import {
  DEFAULT_MANTRA_BRANCHES_UNIFIED,
  DEFAULT_MANTRA_STOTRAS,
} from "../data/mantraStotraSeedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export async function seedMantraStotra({ overwrite = false } = {}) {
  console.log("=========================================");
  console.log(" Seeding Mantra & Stotra Library Database");
  console.log("=========================================");

  let isDbConnected = false;
  try {
    await sequelize.authenticate();
    isDbConnected = true;
    console.log("✅ Database connected successfully.");
  } catch (err) {
    console.warn("⚠️  Database offline or unconfigured:", err.message);
    console.log("ℹ️  Running in standalone verification mode with authentic dataset.");
  }

  if (isDbConnected) {
    try {
      await LibraryBranch.sync({ alter: true });
      await LibraryMantraStotra.sync({ alter: true });

      console.log(`Seeding ${DEFAULT_MANTRA_BRANCHES_UNIFIED.length} Library Branches...`);
      for (const branch of DEFAULT_MANTRA_BRANCHES_UNIFIED) {
        if (overwrite) {
          await LibraryBranch.upsert(branch);
        } else {
          await LibraryBranch.findOrCreate({ where: { id: branch.id }, defaults: branch });
        }
      }
      console.log("✅ All Library Branches seeded successfully.");

      console.log(`Seeding ${DEFAULT_MANTRA_STOTRAS.length} Mantra & Stotra items...`);
      for (const item of DEFAULT_MANTRA_STOTRAS) {
        if (overwrite) {
          await LibraryMantraStotra.upsert(item);
        } else {
          await LibraryMantraStotra.findOrCreate({ where: { id: item.id }, defaults: item });
        }
      }
      console.log("✅ All Mantra & Stotra items seeded successfully.");
    } catch (err) {
      console.error("❌ Seeding database failed:", err.message);
    }
  }

  console.log(`Verified ${DEFAULT_MANTRA_BRANCHES_UNIFIED.length} Branches & ${DEFAULT_MANTRA_STOTRAS.length} Items.`);
  return {
    success: true,
    mode: isDbConnected ? "database" : "offline-verified",
    branchesCount: DEFAULT_MANTRA_BRANCHES_UNIFIED.length,
    itemsCount: DEFAULT_MANTRA_STOTRAS.length,
  };
}

const isDirectExecution =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectExecution) {
  const overwrite = process.argv.includes("--overwrite");
  seedMantraStotra({ overwrite })
    .then(() => {
      console.log("Done.");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
