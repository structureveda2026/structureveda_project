import express from "express";
import {
  getPathServices,
  getPathPurposes,
  getPathServiceBySlug,
} from "../controllers/pathService.controller.js";

const router = express.Router();

// GET /api/path-services/purposes (MUST precede /:slug to avoid collision)
router.get("/purposes", getPathPurposes);

// GET /api/path-services
router.get("/", getPathServices);

// GET /api/path-services/:slug
router.get("/:slug", getPathServiceBySlug);

export default router;
