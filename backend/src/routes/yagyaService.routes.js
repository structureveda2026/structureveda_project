import express from "express";
import {
  getPublicYagyaServices,
  getPublicYagyaPurposes,
  getPublicYagyaServiceBySlug,
} from "../controllers/yagyaService.controller.js";
import { getPublicYagyaCategories } from "../controllers/yagyaCategory.controller.js";

const router = express.Router();

// Specific subpaths must be registered BEFORE dynamic parameter ":slug"
router.get("/purposes", getPublicYagyaPurposes);
router.get("/categories", getPublicYagyaCategories);
router.get("/", getPublicYagyaServices);
router.get("/:slug", getPublicYagyaServiceBySlug);

export default router;
