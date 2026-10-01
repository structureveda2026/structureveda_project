import express from "express";
import {
  getAdminPathServices,
  getAdminPathServiceById,
  createAdminPathService,
  updateAdminPathService,
  deleteAdminPathService,
} from "../controllers/pathServiceAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// All Path Service administration endpoints require authentication & admin authorization
router.use(authenticate, authorizeAdmin);

// GET /api/admin/path-services
router.get("/", getAdminPathServices);

// GET /api/admin/path-services/:id
router.get("/:id", getAdminPathServiceById);

// POST /api/admin/path-services
router.post("/", createAdminPathService);

// PUT /api/admin/path-services/:id
router.put("/:id", updateAdminPathService);

// DELETE /api/admin/path-services/:id
router.delete("/:id", deleteAdminPathService);

export default router;
