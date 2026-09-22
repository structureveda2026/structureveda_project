import express from "express";
import {
  getAdminPujaServices,
  getAdminPujaServiceById,
  createAdminPujaService,
  updateAdminPujaService,
  deleteAdminPujaService,
} from "../controllers/pujaServiceAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// All Puja Service administration endpoints require authentication & admin authorization
router.use(authenticate, authorizeAdmin);

// GET /api/admin/puja-services
router.get("/", getAdminPujaServices);

// GET /api/admin/puja-services/:id
router.get("/:id", getAdminPujaServiceById);

// POST /api/admin/puja-services
router.post("/", createAdminPujaService);

// PUT /api/admin/puja-services/:id
router.put("/:id", updateAdminPujaService);

// DELETE /api/admin/puja-services/:id
router.delete("/:id", deleteAdminPujaService);

export default router;
