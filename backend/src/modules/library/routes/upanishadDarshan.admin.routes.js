import express from "express";
import UpanishadDarshanAdminController from "../controllers/upanishadDarshan.admin.controller.js";
import { authenticate, authorizeAdmin } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Require Admin Authentication & Admin Role
router.use(authenticate, authorizeAdmin);

// Seed dataset
router.post("/seed", UpanishadDarshanAdminController.seedArchive);

// Taxonomy Tree (must precede /:id)
router.get("/taxonomy", UpanishadDarshanAdminController.getTaxonomyTree);

// Bulk upload mantras or sutras
router.post("/mantras/bulk-upload", UpanishadDarshanAdminController.bulkUpload);
router.post("/sutras/bulk-upload", UpanishadDarshanAdminController.bulkUpload);

// Direct Mantra / Sutra operations by mantra ID
router.get("/mantras/:mantraId", UpanishadDarshanAdminController.getMantraById);
router.put("/mantras/:mantraId", UpanishadDarshanAdminController.updateMantra);
router.delete("/mantras/:mantraId", UpanishadDarshanAdminController.deleteMantra);

// Tree Node operations (Padas, Vallis, Khandas, Adhyayas)
router.post("/nodes", UpanishadDarshanAdminController.createNode);
router.put("/nodes/:nodeId", UpanishadDarshanAdminController.updateNode);
router.delete("/nodes/:nodeId", UpanishadDarshanAdminController.deleteNode);

// Text-scoped Mantra & Node operations
router.get("/:id/tree", UpanishadDarshanAdminController.getTextTree);
router.get("/:id/mantras", UpanishadDarshanAdminController.getMantras);
router.post("/:id/mantras", UpanishadDarshanAdminController.createMantra);
router.post("/:id/mantras/bulk-upload", UpanishadDarshanAdminController.bulkUpload);
router.get("/:id/sutras", UpanishadDarshanAdminController.getMantras);
router.post("/:id/sutras", UpanishadDarshanAdminController.createMantra);
router.post("/:id/sutras/bulk-upload", UpanishadDarshanAdminController.bulkUpload);
router.post("/:id/nodes", UpanishadDarshanAdminController.createNode);

// Root Text operations
router.get("/", UpanishadDarshanAdminController.getAllTexts);
router.post("/", UpanishadDarshanAdminController.createText);

// Text operations by Text ID / Slug
router.get("/:id", UpanishadDarshanAdminController.getTextBySlugOrId);
router.put("/:id", UpanishadDarshanAdminController.updateText);
router.delete("/:id", UpanishadDarshanAdminController.deleteText);

export default router;
