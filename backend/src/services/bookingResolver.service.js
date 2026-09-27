import Booking from "../models/bookingModel.js";
import RitualBooking from "../models/ritualBookingModel.js";

/**
 * Custom error class for booking resolution failures.
 */
export class BookingResolverError extends Error {
  constructor(message, code = "RESOLVER_ERROR", statusCode = 400) {
    super(message);
    this.name = "BookingResolverError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Supported booking entity types for the normalized adapter layer.
 */
export const BOOKING_TYPES = Object.freeze({
  CONSULTATION: "CONSULTATION",
  RITUAL: "RITUAL",
});

/**
 * Normalizes and parses incoming booking references.
 * Trims whitespace, uppercases base reference, and preserves retry suffixes (e.g., VB-123456_829102).
 *
 * @param {string} rawRef - Raw reference string
 * @returns {{ rawRef: string, baseRef: string, retrySuffix: string|null, hasRetrySuffix: boolean }}
 */
export const parseBookingReference = (rawRef) => {
  if (!rawRef || typeof rawRef !== "string" || !rawRef.trim()) {
    throw new BookingResolverError(
      "Booking reference is required.",
      "MISSING_REFERENCE",
      400
    );
  }

  const trimmed = rawRef.trim();
  const [basePart, ...suffixParts] = trimmed.split("_");
  const baseRef = basePart.trim().toUpperCase();
  const retrySuffix = suffixParts.length > 0 ? suffixParts.join("_").trim() : null;

  if (!baseRef) {
    throw new BookingResolverError(
      "Invalid booking reference format.",
      "INVALID_REFERENCE",
      400
    );
  }

  return {
    rawRef: trimmed,
    baseRef,
    retrySuffix,
    hasRetrySuffix: Boolean(retrySuffix),
  };
};

/**
 * Creates a normalized adapter for an Astrologer Consultation Booking (bookings table).
 *
 * @param {Object} booking - Sequelize Booking instance
 * @returns {Object} Normalized Consultation Adapter
 */
export const createConsultationAdapter = (booking) => {
  if (!booking) {
    throw new BookingResolverError(
      "Cannot create ConsultationAdapter without a Booking instance.",
      "INVALID_ENTITY",
      500
    );
  }

  const rawPhone = booking.phone ? String(booking.phone).trim() : "";
  const normalizedPhone = rawPhone.replace(/\D/g, "").slice(-10);
  const authoritativeAmount = Number(booking.amount);

  return {
    type: BOOKING_TYPES.CONSULTATION,
    reference: booking.bookingReference,
    entity: booking,
    userId: booking.userId || null,
    authoritativeAmount: Number(authoritativeAmount.toFixed(2)),
    customerDetails: {
      name: booking.fullName ? String(booking.fullName).trim() : "",
      phone: rawPhone,
      normalizedPhone,
      email: booking.email ? String(booking.email).trim() : null,
    },
    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,
    transactionId: booking.transactionId || null,
    paymentMethod: booking.paymentMethod || null,
    paymentGateway: "Cashfree",
    returnUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/astrologers/vishal-bhardwaj/booking-status?order_id={order_id}`,
    orderNote: `Astrologer consultation booking - ${booking.bookingReference}`,

    canAccess(user) {
      if (!this.userId) return true; // guest booking
      if (!user) return false;
      return user.id === this.userId || user.role === "admin";
    },

    async setPendingSession(orderId, paymentSessionId = null) {
      await booking.update({
        transactionId: orderId,
      });
      this.transactionId = orderId;
      return this;
    },

    async markConfirmed(cfPaymentId, paymentGroup = null) {
      const paymentMethod = paymentGroup
        ? (paymentGroup.startsWith("Cashfree") ? paymentGroup : `Cashfree ${paymentGroup.toUpperCase()}`)
        : "Cashfree Online";

      await booking.update({
        bookingStatus: "Confirmed",
        paymentStatus: "Paid",
        transactionId: String(cfPaymentId),
        paymentMethod,
      });

      this.bookingStatus = "Confirmed";
      this.paymentStatus = "Paid";
      this.transactionId = String(cfPaymentId);
      this.paymentMethod = paymentMethod;
      return this;
    },
  };
};

/**
 * Creates a normalized adapter for a Generic Ritual Booking (ritual_bookings table).
 *
 * @param {Object} ritualBooking - Sequelize RitualBooking instance
 * @returns {Object} Normalized Ritual Booking Adapter
 */
export const createRitualBookingAdapter = (ritualBooking) => {
  if (!ritualBooking) {
    throw new BookingResolverError(
      "Cannot create RitualBookingAdapter without a RitualBooking instance.",
      "INVALID_ENTITY",
      500
    );
  }

  const yajman = ritualBooking.yajmanDetails || {};
  const rawPhone = yajman.phone ? String(yajman.phone).trim() : "";
  const normalizedPhone = rawPhone.replace(/\D/g, "").slice(-10);
  const authoritativeAmount = Number(ritualBooking.totalAmount);
  const serviceSlug = ritualBooking.serviceSlug || "puja";
  const serviceType = ritualBooking.serviceType || "PUJA";

  return {
    type: BOOKING_TYPES.RITUAL,
    reference: ritualBooking.bookingReference,
    entity: ritualBooking,
    userId: ritualBooking.userId || null,
    authoritativeAmount: Number(authoritativeAmount.toFixed(2)),
    customerDetails: {
      name: yajman.name ? String(yajman.name).trim() : "",
      phone: rawPhone,
      normalizedPhone,
      email: yajman.email ? String(yajman.email).trim() : null,
    },
    bookingStatus: ritualBooking.bookingStatus,
    paymentStatus: ritualBooking.paymentStatus,
    transactionId: ritualBooking.transactionId || null,
    paymentSessionId: ritualBooking.paymentSessionId || null,
    paymentGateway: ritualBooking.paymentGateway || "Cashfree",
    paymentMethod: null, // RitualBooking does not have paymentMethod column
    returnUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/yagya-puja/puja/${serviceSlug}/booking-status?order_id={order_id}`,
    orderNote: `${serviceType} Booking - ${ritualBooking.serviceName || serviceSlug} (${ritualBooking.bookingReference})`,

    canAccess(user) {
      if (!this.userId) return true; // guest booking
      if (!user) return false;
      return user.id === this.userId || user.role === "admin";
    },

    async setPendingSession(orderId, paymentSessionId = null) {
      const updateData = {
        transactionId: orderId,
      };
      if (paymentSessionId) {
        updateData.paymentSessionId = paymentSessionId;
      }
      await ritualBooking.update(updateData);
      this.transactionId = orderId;
      if (paymentSessionId) {
        this.paymentSessionId = paymentSessionId;
      }
      return this;
    },

    async markConfirmed(cfPaymentId, paymentGroup = null) {
      // RitualBooking schema has paymentGateway, not paymentMethod
      await ritualBooking.update({
        bookingStatus: "Confirmed",
        paymentStatus: "Paid",
        transactionId: String(cfPaymentId),
        paymentGateway: "Cashfree",
      });

      this.bookingStatus = "Confirmed";
      this.paymentStatus = "Paid";
      this.transactionId = String(cfPaymentId);
      this.paymentGateway = "Cashfree";
      return this;
    },
  };
};

/**
 * Resolves a booking reference to a normalized adapter.
 * Uses reference prefixes as routing hints, verifies existence against the database,
 * and returns the appropriate normalized adapter.
 *
 * @param {string} rawReference - Raw booking reference (e.g. "VB-123456", "VEDA-PUJA-XXXXXXXX")
 * @returns {Promise<Object>} Normalized Adapter (Consultation or Ritual)
 * @throws {BookingResolverError} On missing, invalid, or not found references
 */
export const resolveBookingEntity = async (rawReference) => {
  const parsedRef = parseBookingReference(rawReference);
  const { baseRef, retrySuffix, hasRetrySuffix } = parsedRef;

  // Prefix routing hints:
  // VEDA-* hints generic RitualBooking (PUJA, YAGYA, HOMA, JAPA, PATH)
  // VB-* and AB-* hint Astrologer Consultation Booking
  const isVedaPrefix = baseRef.startsWith("VEDA-");
  const isConsultationPrefix = baseRef.startsWith("VB-") || baseRef.startsWith("AB-");

  let booking = null;
  let resolvedType = null;

  try {
    if (isVedaPrefix) {
      // 1. Primary: RitualBooking
      booking = await RitualBooking.findOne({
        where: { bookingReference: baseRef },
      });
      if (booking) {
        resolvedType = BOOKING_TYPES.RITUAL;
      }
    } else if (isConsultationPrefix) {
      // 2. Primary: Booking
      booking = await Booking.findOne({
        where: { bookingReference: baseRef },
      });
      if (booking) {
        resolvedType = BOOKING_TYPES.CONSULTATION;
      }
    } else {
      // 3. Fallback for non-standard or legacy references
      booking = await Booking.findOne({
        where: { bookingReference: baseRef },
      });
      if (booking) {
        resolvedType = BOOKING_TYPES.CONSULTATION;
      } else {
        booking = await RitualBooking.findOne({
          where: { bookingReference: baseRef },
        });
        if (booking) {
          resolvedType = BOOKING_TYPES.RITUAL;
        }
      }
    }
  } catch (dbError) {
    console.error("Booking resolver database error:", dbError);
    throw new BookingResolverError(
      "Database lookup failed while resolving booking.",
      "DATABASE_ERROR",
      500
    );
  }

  if (!booking) {
    throw new BookingResolverError(
      `Booking not found for reference: ${baseRef}`,
      "NOT_FOUND",
      404
    );
  }

  // Create corresponding normalized adapter
  const adapter =
    resolvedType === BOOKING_TYPES.RITUAL
      ? createRitualBookingAdapter(booking)
      : createConsultationAdapter(booking);

  adapter.retrySuffix = retrySuffix;
  adapter.hasRetrySuffix = hasRetrySuffix;

  return adapter;
};

/**
 * Safe helper that resolves booking entity or returns null if not found.
 *
 * @param {string} rawReference
 * @returns {Promise<Object|null>}
 */
export const findBookingEntity = async (rawReference) => {
  try {
    return await resolveBookingEntity(rawReference);
  } catch (err) {
    if (err instanceof BookingResolverError && err.code === "NOT_FOUND") {
      return null;
    }
    throw err;
  }
};

export default {
  resolveBookingEntity,
  findBookingEntity,
  createConsultationAdapter,
  createRitualBookingAdapter,
  parseBookingReference,
  BookingResolverError,
  BOOKING_TYPES,
};
