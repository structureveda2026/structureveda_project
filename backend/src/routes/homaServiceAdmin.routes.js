import express from "express";
import {
  getAdminHomaServices,
  getAdminHomaServiceById,
  createAdminHomaService,
  updateAdminHomaService,
  deleteAdminHomaService,
} from "../controllers/homaServiceAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// All Homa Service administration endpoints require authentication & admin authorization
router.use(authenticate, authorizeAdmin);

// GET /api/admin/homa-services
router.get("/", getAdminHomaServices);

// GET /api/admin/homa-services/:id
router.get("/:id", getAdminHomaServiceById);

// POST /api/admin/homa-services
router.post("/", createAdminHomaService);

// PUT /api/admin/homa-services/:id
router.put("/:id", updateAdminHomaService);

// DELETE /api/admin/homa-services/:id
router.delete("/:id", deleteAdminHomaService);

export default router;
