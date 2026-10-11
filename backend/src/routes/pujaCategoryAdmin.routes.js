import express from "express";
import {
  getAdminPujaCategories,
  getAdminPujaCategoryById,
  createAdminPujaCategory,
  updateAdminPujaCategory,
  deleteAdminPujaCategory,
} from "../controllers/pujaCategoryAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin endpoints require authentication & admin authorization
router.use(authenticate, authorizeAdmin);

// GET /api/admin/puja-categories
router.get("/", getAdminPujaCategories);

// GET /api/admin/puja-categories/:id
router.get("/:id", getAdminPujaCategoryById);

// POST /api/admin/puja-categories
router.post("/", createAdminPujaCategory);

// PUT /api/admin/puja-categories/:id
router.put("/:id", updateAdminPujaCategory);

// DELETE /api/admin/puja-categories/:id
router.delete("/:id", deleteAdminPujaCategory);

export default router;
