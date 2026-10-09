import express from "express";
import {
  getAdminJapaCategories,
  getAdminJapaCategoryById,
  createAdminJapaCategory,
  updateAdminJapaCategory,
  deleteAdminJapaCategory,
} from "../controllers/japaCategoryAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin endpoints require authentication & admin authorization
router.use(authenticate, authorizeAdmin);

// GET /api/admin/japa-categories
router.get("/", getAdminJapaCategories);

// GET /api/admin/japa-categories/:id
router.get("/:id", getAdminJapaCategoryById);

// POST /api/admin/japa-categories
router.post("/", createAdminJapaCategory);

// PUT /api/admin/japa-categories/:id
router.put("/:id", updateAdminJapaCategory);

// DELETE /api/admin/japa-categories/:id
router.delete("/:id", deleteAdminJapaCategory);

export default router;
