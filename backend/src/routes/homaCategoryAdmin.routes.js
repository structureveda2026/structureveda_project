import express from "express";
import {
  getAdminHomaCategories,
  getAdminHomaCategoryById,
  createAdminHomaCategory,
  updateAdminHomaCategory,
  deleteAdminHomaCategory,
} from "../controllers/homaCategoryAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin endpoints require authentication & admin authorization
router.use(authenticate, authorizeAdmin);

// GET /api/admin/homa-categories
router.get("/", getAdminHomaCategories);

// GET /api/admin/homa-categories/:id
router.get("/:id", getAdminHomaCategoryById);

// POST /api/admin/homa-categories
router.post("/", createAdminHomaCategory);

// PUT /api/admin/homa-categories/:id
router.put("/:id", updateAdminHomaCategory);

// DELETE /api/admin/homa-categories/:id
router.delete("/:id", deleteAdminHomaCategory);

export default router;
