import express from "express";
import {
  getPublicJapaServices,
  getPublicJapaPurposes,
  getPublicJapaServiceBySlug,
} from "../controllers/japaService.controller.js";
import { getPublicJapaCategories } from "../controllers/japaCategory.controller.js";

const router = express.Router();

// Specific subpaths must be registered BEFORE dynamic parameter ":slug"
router.get("/purposes", getPublicJapaPurposes);
router.get("/categories", getPublicJapaCategories);
router.get("/", getPublicJapaServices);
router.get("/:slug", getPublicJapaServiceBySlug);

export default router;
