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
} from "../controllers/blogPostAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Require admin authentication & authorization
router.use(authenticate, authorizeAdmin);

// Stats & Aggregations
router.get("/stats", getBlogStats);

// CRUD
router.get("/", getAdminBlogPosts);
router.get("/:id", getAdminBlogPostById);
router.post("/", createBlogPost);
router.put("/:id", updateBlogPost);
router.delete("/:id", deleteBlogPost);

// Quick toggles
router.patch("/:id/status", toggleBlogStatus);
router.patch("/:id/featured", toggleBlogFeatured);

export default router;
