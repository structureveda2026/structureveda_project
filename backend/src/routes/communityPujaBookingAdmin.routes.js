import express from "express";
import {
  getAllCommunityPujaBookings,
  getAdminCommunityPujaBookingById,
} from "../controllers/communityPujaBookingAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// All Community Puja booking administration endpoints require admin authentication & authorization
router.use(authenticate, authorizeAdmin);

// GET /api/admin/community-puja-bookings
router.get("/", getAllCommunityPujaBookings);

// GET /api/admin/community-puja-bookings/:id
router.get("/:id", getAdminCommunityPujaBookingById);

export default router;

