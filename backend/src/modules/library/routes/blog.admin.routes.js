import express from "express";
import {
  getAdminBlogPosts,
  getBlogStats,
  getAdminBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  toggleBlogStatus,
  toggleBlogFeatured,
} from "../controllers/blog.admin.controller.js";
import { authenticate, authorizeAdmin } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Require Admin Authentication & Admin Role
router.use(authenticate, authorizeAdmin);

// Stats & Aggregations
router.get("/stats", getBlogStats);

// Standard CRUD
router.get("/", getAdminBlogPosts);
router.get("/:id", getAdminBlogPostById);
router.post("/", createBlogPost);
router.put("/:id", updateBlogPost);
router.delete("/:id", deleteBlogPost);

// Quick status toggles
router.patch("/:id/status", toggleBlogStatus);
router.patch("/:id/featured", toggleBlogFeatured);

export default router;
