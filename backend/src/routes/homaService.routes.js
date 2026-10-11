import express from "express";
import {
  getPublicHomaServices,
  getPublicHomaPurposes,
  getPublicHomaServiceBySlug,
} from "../controllers/homaService.controller.js";
import { getPublicHomaCategories } from "../controllers/homaCategory.controller.js";

const router = express.Router();

// Specific subpaths must be registered BEFORE dynamic parameter ":slug"
router.get("/purposes", getPublicHomaPurposes);
router.get("/categories", getPublicHomaCategories);
router.get("/", getPublicHomaServices);
router.get("/:slug", getPublicHomaServiceBySlug);

export default router;
