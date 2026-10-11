const fs = require("fs");
const path = require("path");

const curationDir = path.join(__dirname, "src/modules/library/data/heritage_curation");
const rigvedaFile = path.join(curationDir, "rigveda_curated.json");
const yajurvedaFile = path.join(curationDir, "yajurveda_curated.json");
const samavedaFile = path.join(curationDir, "samaveda_curated.json");
const atharvavedaFile = path.join(curationDir, "atharvaveda_curated.json");

function readJsonSafe(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading JSON from", filePath, e.message);
    return null;
  }
}

async function mergeAndSeed() {
  console.log("=== VEDIC HERITAGE DATA MERGE & SEED ===");
  
  const rv = readJsonSafe(rigvedaFile);
  const yj = readJsonSafe(yajurvedaFile);
  const sv = readJsonSafe(samavedaFile);
  const av = readJsonSafe(atharvavedaFile);

  const missing = [];
  if (!rv) missing.push("rigveda_curated.json");
  if (!yj) missing.push("yajurveda_curated.json");
  if (!sv) missing.push("samaveda_curated.json");
  if (!av) missing.push("atharvaveda_curated.json");

  if (missing.length > 0) {
    console.log("Waiting for files to be written by subagents:", missing.join(", "));
    return false;
  }

  // Combine all nodes
  const allNodes = [
    ...(rv.nodes || []),
    ...(yj.nodes || []),
    ...(sv.nodes || []),
    ...(av.nodes || []),
  ];

  // Combine all mantras
  const allMantras = [
    ...(rv.mantras || []),
    ...(yj.mantras || []),
    ...(sv.mantras || []),
    ...(av.mantras || []),
  ];

  console.log(`Successfully collected:`);
  console.log(`- Rigveda: ${rv.nodes?.length || 0} nodes, ${rv.mantras?.length || 0} mantras`);
  console.log(`- Yajurveda: ${yj.nodes?.length || 0} nodes, ${yj.mantras?.length || 0} mantras`);
  console.log(`- Samaveda: ${sv.nodes?.length || 0} nodes, ${sv.mantras?.length || 0} mantras`);
  console.log(`- Atharvaveda: ${av.nodes?.length || 0} nodes, ${av.mantras?.length || 0} mantras`);
  console.log(`Total Curated: ${allNodes.length} nodes, ${allMantras.length} mantras`);

  // De-duplicate nodes and mantras by ID
  const nodeMap = new Map();
  allNodes.forEach((n) => nodeMap.set(n.id, n));
  const finalNodes = Array.from(nodeMap.values());

  const mantraMap = new Map();
  allMantras.forEach((m) => mantraMap.set(m.id, m));
  const finalMantras = Array.from(mantraMap.values());

  console.log(`Deduplicated count: ${finalNodes.length} nodes, ${finalMantras.length} mantras`);

  // 1. Read existing initialVedicHeritageData.js to retain INITIAL_VEDAS and merge nodes/mantras
  const existingDataPath = path.join(__dirname, "src/modules/library/data/initialVedicHeritageData.js");
  const existing = require(existingDataPath);

  // Merge with existing nodes and mantras
  const mergedNodesMap = new Map();
  (existing.INITIAL_VEDA_NODES || []).forEach(n => mergedNodesMap.set(n.id, n));
  finalNodes.forEach(n => mergedNodesMap.set(n.id, n));
  const combinedNodes = Array.from(mergedNodesMap.values());

  const mergedMantrasMap = new Map();
  (existing.INITIAL_VEDA_MANTRAS || []).forEach(m => mergedMantrasMap.set(m.id, m));
  finalMantras.forEach(m => mergedMantrasMap.set(m.id, m));
  const combinedMantras = Array.from(mergedMantrasMap.values());

  console.log(`Final combined dataset: ${combinedNodes.length} nodes, ${combinedMantras.length} mantras across 4 Vedas.`);

  // Write updated initialVedicHeritageData.js
  const exportContent = `/**
 * Comprehensive Authentic Vedic Heritage Dataset
 * Sourced from the Government of India's Vedic Heritage Portal (vedicheritage.gov.in)
 * Covering all 4 Vedas: Rigveda, Yajurveda, Samaveda, and Atharvaveda
 */

export const INITIAL_VEDAS = ${JSON.stringify(existing.INITIAL_VEDAS, null, 2)};

export const INITIAL_VEDA_NODES = ${JSON.stringify(combinedNodes, null, 2)};

export const INITIAL_VEDA_MANTRAS = ${JSON.stringify(combinedMantras, null, 2)};

module.exports = {
  INITIAL_VEDAS,
  INITIAL_VEDA_NODES,
  INITIAL_VEDA_MANTRAS,
};
`;

  fs.writeFileSync(existingDataPath, exportContent, "utf-8");
  console.log("Updated initialVedicHeritageData.js successfully!");

  // 2. Synchronize frontend veda-library
  const vedaLibraryDir = path.resolve(__dirname, "../../veda-library/src/data");
  if (fs.existsSync(vedaLibraryDir)) {
    const vedaLibMantraFile = path.join(vedaLibraryDir, "vedicMantrasData.js");
    const frontendContent = `/**
 * Authentic Vedic Mantras Dataset
 * Sourced from the Government of India's Vedic Heritage Portal (vedicheritage.gov.in)
 * 3-Language translations (Hindi, English, Hinglish) & Padapatha
 */

export const ALL_VEDIC_MANTRAS = ${JSON.stringify(combinedMantras, null, 2)};

export const VEDIC_MANTRAS = {};
ALL_VEDIC_MANTRAS.forEach((m) => {
  VEDIC_MANTRAS[m.id] = m;
});

export function getMantraById(id) {
  return VEDIC_MANTRAS[id] || ALL_VEDIC_MANTRAS.find((m) => m.id === id) || null;
}

export function getMantrasByVeda(vedaId) {
  return ALL_VEDIC_MANTRAS.filter((m) => m.vedaId === vedaId);
}

export function getMantrasByNode(nodeId) {
  return ALL_VEDIC_MANTRAS.filter((m) => m.nodeId === nodeId);
}

export default VEDIC_MANTRAS;
`;
    fs.writeFileSync(vedaLibMantraFile, frontendContent, "utf-8");
    console.log("Updated veda-library/src/data/vedicMantrasData.js successfully!");
  }

  // 3. Run seeding to database if DB is reachable
  try {
    const VedaService = require("./src/modules/library/services/veda.service.js").default;
    if (VedaService && typeof VedaService.seedDefaultVedicHeritage === "function") {
      console.log("Seeding to database...");
      const seedResult = await VedaService.seedDefaultVedicHeritage(true);
      console.log("Database seed result:", seedResult);
    }
  } catch (dbErr) {
    console.log("Database direct seed note (will be served via authentic static fallback):", dbErr.message);
  }

  return true;
}

mergeAndSeed()
  .then((res) => {
    if (res) console.log("Merge and seed script completed successfully.");
    else console.log("Waiting for remaining subagents...");
  })
  .catch((e) => console.error(e));
