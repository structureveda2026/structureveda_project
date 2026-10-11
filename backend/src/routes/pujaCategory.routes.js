import express from "express";
import {
  getPublicPujaCategories,
  getPublicPujaCategoryBySlug,
} from "../controllers/pujaCategory.controller.js";

const router = express.Router();

router.get("/", getPublicPujaCategories);
router.get("/:slug", getPublicPujaCategoryBySlug);

export default router;
