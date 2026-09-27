import express from "express";
import {
  getPublicYagyaServices,
  getPublicYagyaPurposes,
  getPublicYagyaServiceBySlug,
} from "../controllers/yagyaService.controller.js";

const router = express.Router();

// Specific subpath "/purposes" must be registered BEFORE dynamic parameter ":slug"
router.get("/purposes", getPublicYagyaPurposes);
router.get("/", getPublicYagyaServices);
router.get("/:slug", getPublicYagyaServiceBySlug);

export default router;
