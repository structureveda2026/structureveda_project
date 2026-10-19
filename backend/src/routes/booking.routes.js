import express from "express";
import {
  createBooking,
  getBookingByReferenceOrId,
  getMyBookings,
  getAllBookings,
  getAdminBookingById,
  updateBookingStatus,
  rescheduleBooking,
  initiateBookingRefund,
  verifyBookingRefund,
} from "../controllers/booking.controller.js";
import {
  authenticate,
  optionalAuthenticate,
  authorizeAdmin,
} from "../middleware/auth.middleware.js";
import { bookingLookupLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

// Create new astrologer booking (supports optional authenticated user or guest)
router.post("/", optionalAuthenticate, createBooking);

// Get current authenticated user bookings
router.get("/my-bookings", authenticate, getMyBookings);

// Admin: Booking catalogue and management
router.get("/admin", authenticate, authorizeAdmin, getAllBookings);
router.get("/admin/:id", authenticate, authorizeAdmin, getAdminBookingById);
router.patch("/admin/:id/status", authenticate, authorizeAdmin, updateBookingStatus);
router.patch("/admin/:id/reschedule", authenticate, authorizeAdmin, rescheduleBooking);
router.post("/admin/:id/initiate-refund", authenticate, authorizeAdmin, initiateBookingRefund);
router.post("/admin/:id/verify-refund", authenticate, authorizeAdmin, verifyBookingRefund);

// Backward-compatible admin listing (e.g. GET /api/bookings with admin credentials)
router.get("/", authenticate, authorizeAdmin, getAllBookings);

// Public / User booking lookup with privacy-sanitization and anti-enumeration rate limiting
router.get("/:identifier", bookingLookupLimiter, optionalAuthenticate, getBookingByReferenceOrId);

export default router;
