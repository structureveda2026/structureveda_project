import express from "express";
import {
  getAdminUpcomingPujas,
  getAdminUpcomingPujaById,
  createUpcomingPuja,
  updateUpcomingPuja,
  deleteUpcomingPuja,
} from "../controllers/upcomingPujaAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// All Upcoming Puja administration endpoints require admin authentication & authorization
router.use(authenticate, authorizeAdmin);

// GET /admin/upcoming-pujas
router.get("/", getAdminUpcomingPujas);

// GET /admin/upcoming-pujas/:id
router.get("/:id", getAdminUpcomingPujaById);

// POST /admin/upcoming-pujas
router.post("/", createUpcomingPuja);

// PUT /admin/upcoming-pujas/:id
router.put("/:id", updateUpcomingPuja);

// DELETE /admin/upcoming-pujas/:id
router.delete("/:id", deleteUpcomingPuja);

export default router;
