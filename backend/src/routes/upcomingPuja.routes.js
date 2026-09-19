import express from "express";
import {
  getPublicUpcomingPujas,
  getPublicUpcomingPujaBySlug,
  createPujaBooking,
} from "../controllers/upcomingPuja.controller.js";
import { optionalAuthenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Read-Only Endpoints
router.get("/", getPublicUpcomingPujas);
router.get("/:slug", getPublicUpcomingPujaBySlug);

// Public/Guest or Authenticated Booking Endpoints
router.post("/book", optionalAuthenticate, createPujaBooking);
router.post("/:slug/book", optionalAuthenticate, createPujaBooking);

export default router;
