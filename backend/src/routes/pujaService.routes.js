import express from "express";
import {
  getPublicPujaServices,
  getPublicPujaPurposes,
  getPublicPujaServiceBySlug,
} from "../controllers/pujaService.controller.js";

const router = express.Router();

// Specific subpath "/purposes" must be registered BEFORE dynamic parameter ":slug"
router.get("/purposes", getPublicPujaPurposes);
router.get("/", getPublicPujaServices);
router.get("/:slug", getPublicPujaServiceBySlug);

export default router;
