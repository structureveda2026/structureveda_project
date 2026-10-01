import express from "express";
import {
  getPublicHomaServices,
  getPublicHomaPurposes,
  getPublicHomaServiceBySlug,
} from "../controllers/homaService.controller.js";

const router = express.Router();

// GET /api/homa-services/purposes (MUST precede /:slug to avoid collision)
router.get("/purposes", getPublicHomaPurposes);

// GET /api/homa-services
router.get("/", getPublicHomaServices);

// GET /api/homa-services/:slug
router.get("/:slug", getPublicHomaServiceBySlug);

export default router;
