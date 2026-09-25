import express from "express";
import {
  calculateRitualPrice,
  createRitualBooking,
  getRitualBookingByReference,
} from "../controllers/ritualBooking.controller.js";
import { optionalAuthenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * IMPORTANT ROUTE ORDER:
 * Specific static routes (/calculate-price) MUST be mounted before parameterized /:bookingReference
 */
router.post("/calculate-price", optionalAuthenticate, calculateRitualPrice);
router.post("/", optionalAuthenticate, createRitualBooking);
router.get("/:bookingReference", optionalAuthenticate, getRitualBookingByReference);

export default router;
