import express from "express";
import VedaMantraAdminController from "../controllers/vedaMantra.admin.controller.js";
import { authenticate, authorizeAdmin } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Require Admin Authentication & Admin Role
router.use(authenticate, authorizeAdmin);

// Bulk upload
router.post("/bulk-upload", VedaMantraAdminController.bulkUpload);

// Mantra CRUD
router.get("/", VedaMantraAdminController.getMantras);
router.get("/:id", VedaMantraAdminController.getMantraById);
router.post("/", VedaMantraAdminController.createMantra);
router.put("/:id", VedaMantraAdminController.updateMantra);
router.delete("/:id", VedaMantraAdminController.deleteMantra);

export default router;
