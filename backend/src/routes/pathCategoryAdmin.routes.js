import express from "express";
import {
  getAdminPathCategories,
  getAdminPathCategoryById,
  createAdminPathCategory,
  updateAdminPathCategory,
  deleteAdminPathCategory,
} from "../controllers/pathCategoryAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin endpoints require authentication & admin authorization
router.use(authenticate, authorizeAdmin);

// GET /api/admin/path-categories
router.get("/", getAdminPathCategories);

// GET /api/admin/path-categories/:id
router.get("/:id", getAdminPathCategoryById);

// POST /api/admin/path-categories
router.post("/", createAdminPathCategory);

// PUT /api/admin/path-categories/:id
router.put("/:id", updateAdminPathCategory);

// DELETE /api/admin/path-categories/:id
router.delete("/:id", deleteAdminPathCategory);

export default router;
