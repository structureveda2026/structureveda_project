import api from "../../services/api";

// ---------------------------------------------------------------------------
// createPaymentOrder
//
// POST /api/payments/create-order
//
// Sends only the bookingReference to the backend.
// The backend determines the authoritative amount — never the frontend.
//
// Returns: { success, data: { cfOrderId, paymentSessionId, orderAmount, orderStatus, bookingReference } }
// ---------------------------------------------------------------------------
const createPaymentOrder = async (bookingReference) => {
  const response = await api.post("/payments/create-order", { bookingReference });
  return response.data;
};

// ---------------------------------------------------------------------------
// verifyPayment
//
// POST /api/payments/verify
//
// Sends only the bookingReference to the backend.
// The backend verifies the real status directly with Cashfree and updates the DB.
//
// Returns: { success, confirmed, message, data }
// ---------------------------------------------------------------------------
const verifyPayment = async (bookingReference) => {
  const response = await api.post("/payments/verify", { bookingReference });
  return response.data;
};

// ---------------------------------------------------------------------------
// getBookingStatus (Phase 2D)
//
// GET /api/payments/booking-status/:bookingReference
//
// Retrieves safe, authoritative booking state for recovery on page reload.
// Returns: { success, data: { bookingReference, bookingStatus, paymentStatus, amount, ... } }
// ---------------------------------------------------------------------------
const getBookingStatus = async (bookingReference) => {
  const response = await api.get(`/payments/booking-status/${bookingReference}`);
  return response.data;
};

const paymentService = {
  createPaymentOrder,
  verifyPayment,
  getBookingStatus,
};

export default paymentService;


