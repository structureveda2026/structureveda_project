import express from "express";
import { getUnifiedBookings } from "../controllers/unifiedBookingAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// All Unified Booking administration endpoints require admin authentication & authorization
router.use(authenticate, authorizeAdmin);

// GET /api/admin/bookings/all
router.get("/all", getUnifiedBookings);

// GET /api/admin/bookings (alias)
router.get("/", getUnifiedBookings);

export default router;

