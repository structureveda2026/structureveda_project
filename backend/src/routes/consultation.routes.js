import express from "express";
import {
  createConsultation,
  getConsultations,
  getConsultationById,
  markConsultationRead,
} from "../controllers/consultation.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", createConsultation);
router.get("/", authenticate, authorizeAdmin, getConsultations);
router.get("/:id", authenticate, authorizeAdmin, getConsultationById);
router.patch("/:id/read", authenticate, authorizeAdmin, markConsultationRead);

export default router;
