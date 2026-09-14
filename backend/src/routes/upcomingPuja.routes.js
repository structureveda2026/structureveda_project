import express from "express";
import {
  getPublicUpcomingPujas,
  getPublicUpcomingPujaBySlug,
} from "../controllers/upcomingPuja.controller.js";

const router = express.Router();

// Public Read-Only Endpoints
router.get("/", getPublicUpcomingPujas);
router.get("/:slug", getPublicUpcomingPujaBySlug);

export default router;
