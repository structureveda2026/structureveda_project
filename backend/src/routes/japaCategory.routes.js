import express from "express";
import {
  getPublicJapaCategories,
  getPublicJapaCategoryBySlug,
} from "../controllers/japaCategory.controller.js";

const router = express.Router();

router.get("/", getPublicJapaCategories);
router.get("/:slug", getPublicJapaCategoryBySlug);

export default router;
