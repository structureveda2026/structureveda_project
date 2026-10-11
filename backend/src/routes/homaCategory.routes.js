import express from "express";
import {
  getPublicHomaCategories,
  getPublicHomaCategoryBySlug,
} from "../controllers/homaCategory.controller.js";

const router = express.Router();

router.get("/", getPublicHomaCategories);
router.get("/:slug", getPublicHomaCategoryBySlug);

export default router;
