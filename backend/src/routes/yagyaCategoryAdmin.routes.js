import express from "express";
import {
  getAdminYagyaCategories,
  getAdminYagyaCategoryById,
  createAdminYagyaCategory,
  updateAdminYagyaCategory,
  deleteAdminYagyaCategory,
} from "../controllers/yagyaCategoryAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin endpoints require authentication & admin authorization
router.use(authenticate, authorizeAdmin);

// GET /api/admin/yagya-categories
router.get("/", getAdminYagyaCategories);

// GET /api/admin/yagya-categories/:id
router.get("/:id", getAdminYagyaCategoryById);

// POST /api/admin/yagya-categories
router.post("/", createAdminYagyaCategory);

// PUT /api/admin/yagya-categories/:id
router.put("/:id", updateAdminYagyaCategory);

// DELETE /api/admin/yagya-categories/:id
router.delete("/:id", deleteAdminYagyaCategory);

export default router;
