import express from "express";
import {
  getPublicBlogPosts,
  getPublicBlogPostBySlug,
  getBlogCategories,
} from "../controllers/blogPost.controller.js";

const router = express.Router();

// Categories
router.get("/categories/list", getBlogCategories);

// Listing & Single blog
router.get("/", getPublicBlogPosts);
router.get("/:slug", getPublicBlogPostBySlug);

export default router;
