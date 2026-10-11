import express from "express";
import {
  getPublicPathCategories,
  getPublicPathCategoryBySlug,
} from "../controllers/pathCategory.controller.js";

const router = express.Router();

router.get("/", getPublicPathCategories);
router.get("/:slug", getPublicPathCategoryBySlug);

export default router;
