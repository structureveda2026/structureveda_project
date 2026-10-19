import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
  handleCashfreeWebhook,
  getPaymentBookingStatus,
} from "../controllers/payment.controller.js";
import { optionalAuthenticate } from "../middleware/auth.middleware.js";
import { paymentInitiationLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

// GET /api/payments/booking-status/:bookingReference (Phase 2D)
// Minimal, safe booking status recovery endpoint for page reloads.
router.get("/booking-status/:bookingReference", optionalAuthenticate, getPaymentBookingStatus);

// POST /api/payments/create-order
// Creates or recovers a Cashfree Sandbox order for an existing Pending booking with rate limiting.
router.post("/create-order", paymentInitiationLimiter, optionalAuthenticate, createPaymentOrder);

// POST /api/payments/verify
// Verifies Cashfree payment status server-side after frontend checkout.
// Checks real Cashfree Sandbox order status, validates amount, and updates DB.
router.post("/verify", optionalAuthenticate, verifyPayment);

// POST /api/payments/webhook
// Receives asynchronous server-to-server notifications from Cashfree.
// Validates HMAC-SHA256 signature, validates amount, and updates DB idempotently.
router.post("/webhook", handleCashfreeWebhook);

export default router;

