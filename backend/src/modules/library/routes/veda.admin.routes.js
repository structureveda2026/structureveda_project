import express from "express";
import VedaAdminController from "../controllers/veda.admin.controller.js";
import { authenticate, authorizeAdmin } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Require Admin Authentication & Admin Role
router.use(authenticate, authorizeAdmin);

// Seed default dataset
router.post("/seed-vedas", VedaAdminController.seedVedas);

// Tree Node operations
router.post("/nodes", VedaAdminController.createNode);
router.put("/nodes/:id", VedaAdminController.updateNode);
router.delete("/nodes/:id", VedaAdminController.deleteNode);

// Veda CRUD
router.get("/vedas", VedaAdminController.getVedas);
router.get("/vedas/:id", VedaAdminController.getVedaById);
router.get("/vedas/:id/tree", VedaAdminController.getVedaTree);
router.post("/vedas", VedaAdminController.createVeda);
router.put("/vedas/:id", VedaAdminController.updateVeda);
router.delete("/vedas/:id", VedaAdminController.deleteVeda);

// Direct root route mappings for /api/admin/library/vedas
router.get("/", VedaAdminController.getVedas);
router.post("/", VedaAdminController.createVeda);
router.get("/:id", VedaAdminController.getVedaById);
router.put("/:id", VedaAdminController.updateVeda);
router.delete("/:id", VedaAdminController.deleteVeda);
router.get("/:id/tree", VedaAdminController.getVedaTree);

export default router;
