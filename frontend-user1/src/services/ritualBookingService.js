import api from "./api";

/**
 * Calculates authoritative pricing for a ritual booking configuration.
 * POST /api/ritual-bookings/calculate-price
 *
 * @param {Object} calculationPayload
 * @param {string} calculationPayload.serviceType - "PUJA"
 * @param {string} calculationPayload.serviceId - UUID of the service
 * @param {string} calculationPayload.serviceSlug - Service slug
 * @param {number} [calculationPayload.durationHours] - Duration in hours
 * @param {string} [calculationPayload.durationSelected] - Selected duration string
 * @param {number} [calculationPayload.panditCount] - Number of officiating purohits (min 1)
 * @param {string} [calculationPayload.arrangementMode] - Canonical mode (e.g. "kashi", "remote", etc.)
 * @param {string} [calculationPayload.locationType] - Canonical location (e.g. "kashi", "customer_home", etc.)
 * @param {Array} [calculationPayload.addons] - Array of addon items
 * @param {AbortSignal} [signal] - Optional AbortSignal for stale request cancellation
 * @returns {Promise<Object>} Backend response containing authoritative price breakdown
 */
export const calculatePrice = async (calculationPayload, signal) => {
  const response = await api.post("/ritual-bookings/calculate-price", calculationPayload, {
    signal,
  });
  return response.data;
};

/**
 * Creates a pending ritual booking record in the backend.
 * POST /api/ritual-bookings
 *
 * NOTE: Created for future use in Phase 4B.3. Phase 4B.1 does not invoke this.
 *
 * @param {Object} bookingPayload - Full booking data matching backend contract
 * @returns {Promise<Object>} Created booking response including bookingReference
 */
export const createRitualBooking = async (bookingPayload) => {
  const response = await api.post("/ritual-bookings", bookingPayload);
  return response.data;
};

/**
 * Fetches an existing ritual booking by its unique bookingReference.
 * GET /api/ritual-bookings/:bookingReference
 *
 * NOTE: Created for future use in Phase 4B.3/4B.4. Phase 4B.1 does not invoke this.
 *
 * @param {string} bookingReference - E.g. "VEDA-PUJA-XXXXXXXX"
 * @returns {Promise<Object>} Booking record details
 */
export const getRitualBooking = async (bookingReference) => {
  const response = await api.get(`/ritual-bookings/${encodeURIComponent(bookingReference)}`);
  return response.data;
};

/**
 * Creates a Cashfree payment order for an existing booking reference.
 * POST /api/payments/create-order
 *
 * @param {string} bookingReference - e.g. "VEDA-PUJA-XXXXXXXX"
 * @returns {Promise<Object>} Payment order response including paymentSessionId
 */
export const createPaymentOrder = async (bookingReference) => {
  const response = await api.post("/payments/create-order", { bookingReference });
  return response.data;
};

/**
 * Verifies payment status with backend for a booking reference.
 * POST /api/payments/verify
 *
 * @param {string} bookingReference - e.g. "VEDA-PUJA-XXXXXXXX"
 * @returns {Promise<Object>} Verification response { success, confirmed, message, data }
 */
export const verifyPayment = async (bookingReference) => {
  const response = await api.post("/payments/verify", { bookingReference });
  return response.data;
};

/**
 * Retrieves safe, authoritative booking state for recovery or status check.
 * GET /api/payments/booking-status/:bookingReference
 *
 * @param {string} bookingReference - e.g. "VEDA-PUJA-XXXXXXXX"
 * @returns {Promise<Object>} Safe status response { success, data: { bookingReference, bookingStatus, paymentStatus, amount, ... } }
 */
export const getBookingStatus = async (bookingReference) => {
  const response = await api.get(`/payments/booking-status/${encodeURIComponent(bookingReference)}`);
  return response.data;
};

const ritualBookingService = {
  calculatePrice,
  createRitualBooking,
  getRitualBooking,
  createPaymentOrder,
  verifyPayment,
  getBookingStatus,
};

export default ritualBookingService;


