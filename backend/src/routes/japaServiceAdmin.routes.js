import express from "express";
import {
  getAdminJapaServices,
  getAdminJapaServiceById,
  createAdminJapaService,
  updateAdminJapaService,
  deleteAdminJapaService,
} from "../controllers/japaServiceAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// All Japa Service administration endpoints require authentication & admin authorization
router.use(authenticate, authorizeAdmin);

// GET /api/admin/japa-services
router.get("/", getAdminJapaServices);

// GET /api/admin/japa-services/:id
router.get("/:id", getAdminJapaServiceById);

// POST /api/admin/japa-services
router.post("/", createAdminJapaService);

// PUT /api/admin/japa-services/:id
router.put("/:id", updateAdminJapaService);

// DELETE /api/admin/japa-services/:id
router.delete("/:id", deleteAdminJapaService);

export default router;
