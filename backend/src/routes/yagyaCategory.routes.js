import express from "express";
import {
  getPublicYagyaCategories,
  getPublicYagyaCategoryBySlug,
} from "../controllers/yagyaCategory.controller.js";

const router = express.Router();

router.get("/", getPublicYagyaCategories);
router.get("/:slug", getPublicYagyaCategoryBySlug);

export default router;
