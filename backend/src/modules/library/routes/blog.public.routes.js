import express from "express";
import {
  getPublicBlogPosts,
  getPublicBlogPostBySlug,
  getBlogCategories,
} from "../controllers/blog.public.controller.js";

const router = express.Router();

// Categories aggregation
router.get("/categories/list", getBlogCategories);

// Listing & Single article
router.get("/", getPublicBlogPosts);
router.get("/:slug", getPublicBlogPostBySlug);

export default router;
