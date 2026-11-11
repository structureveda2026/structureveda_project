import express from "express";
import {
  getAllRitualBookings,
  getAdminRitualBookingById,
  updateRitualBookingStatus,
} from "../controllers/ritualBookingAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// All ritual booking administration endpoints require admin authentication & authorization
router.use(authenticate, authorizeAdmin);

// GET /api/admin/ritual-bookings
router.get("/", getAllRitualBookings);

// GET /api/admin/ritual-bookings/:id
router.get("/:id", getAdminRitualBookingById);

// PATCH /api/admin/ritual-bookings/:id/status
router.patch("/:id/status", updateRitualBookingStatus);

export default router;

