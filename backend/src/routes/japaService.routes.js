import express from "express";
import {
  getPublicJapaServices,
  getPublicJapaPurposes,
  getPublicJapaServiceBySlug,
} from "../controllers/japaService.controller.js";

const router = express.Router();

// Specific subpath "/purposes" MUST be registered BEFORE dynamic parameter ":slug"
router.get("/purposes", getPublicJapaPurposes);
router.get("/", getPublicJapaServices);
router.get("/:slug", getPublicJapaServiceBySlug);

export default router;
