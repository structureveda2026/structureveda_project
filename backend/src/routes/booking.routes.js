import express from "express";
import {
  createBooking,
  getBookingByReferenceOrId,
  getMyBookings,
  getAllBookings,
} from "../controllers/booking.controller.js";
import {
  authenticate,
  optionalAuthenticate,
  authorizeAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Create new astrologer booking (supports optional authenticated user or guest)
router.post("/", optionalAuthenticate, createBooking);

// Get current authenticated user bookings
router.get("/my-bookings", authenticate, getMyBookings);

// Admin: Get all bookings
router.get("/", authenticate, authorizeAdmin, getAllBookings);

// Get booking by ID or reference code
router.get("/:identifier", getBookingByReferenceOrId);

export default router;
