import express from "express";
import {
  getPublicPujaServices,
  getPublicPujaPurposes,
  getPublicPujaServiceBySlug,
} from "../controllers/pujaService.controller.js";
import { getPublicPujaCategories } from "../controllers/pujaCategory.controller.js";

const router = express.Router();

// Specific subpaths must be registered BEFORE dynamic parameter ":slug"
router.get("/purposes", getPublicPujaPurposes);
router.get("/categories", getPublicPujaCategories);
router.get("/", getPublicPujaServices);
router.get("/:slug", getPublicPujaServiceBySlug);

export default router;
