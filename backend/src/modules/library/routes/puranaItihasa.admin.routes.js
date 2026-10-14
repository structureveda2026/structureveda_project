import express from "express";
import PuranaItihasaAdminController from "../controllers/puranaItihasa.admin.controller.js";
import { authenticate, authorizeAdmin } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Require Admin Authentication & Admin Role
router.use(authenticate, authorizeAdmin);

// Seed dataset
router.post("/seed", PuranaItihasaAdminController.seedArchive);

// Taxonomy Tree (must precede /:id)
router.get("/taxonomy", PuranaItihasaAdminController.getTaxonomyTree);

// Bulk upload shlokas
router.post("/shlokas/bulk-upload", PuranaItihasaAdminController.bulkUploadShlokas);

// Direct Shloka operations by shloka ID
router.get("/shlokas/:shlokaId", PuranaItihasaAdminController.getShlokaById);
router.put("/shlokas/:shlokaId", PuranaItihasaAdminController.updateShloka);
router.delete("/shlokas/:shlokaId", PuranaItihasaAdminController.deleteShloka);

// Tree Node operations (Kandas, Parvas, Skandhas, Adhyayas)
router.post("/nodes", PuranaItihasaAdminController.createNode);
router.put("/nodes/:nodeId", PuranaItihasaAdminController.updateNode);
router.delete("/nodes/:nodeId", PuranaItihasaAdminController.deleteNode);

// Text-scoped Shloka & Node operations
router.get("/:id/tree", PuranaItihasaAdminController.getTextTree);
router.get("/:id/shlokas", PuranaItihasaAdminController.getShlokas);
router.post("/:id/shlokas", PuranaItihasaAdminController.createShloka);
router.post("/:id/shlokas/bulk-upload", PuranaItihasaAdminController.bulkUploadShlokas);
router.post("/:id/nodes", PuranaItihasaAdminController.createNode);

// Root Text operations
router.get("/", PuranaItihasaAdminController.getAllTexts);
router.post("/", PuranaItihasaAdminController.createText);

// Text operations by Text ID / Slug
router.get("/:id", PuranaItihasaAdminController.getTextBySlugOrId);
router.put("/:id", PuranaItihasaAdminController.updateText);
router.delete("/:id", PuranaItihasaAdminController.deleteText);

export default router;
