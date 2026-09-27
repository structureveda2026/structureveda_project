import crypto from "crypto";
import db, { RitualBooking, PujaService } from "../models/index.js";
import { calculateRitualPriceInternal } from "../services/ritualPricing.service.js";
import {
  serializeRitualPriceCalculation,
  serializeRitualBookingCreation,
  serializeRitualBookingDetail,
} from "../serializers/ritualBooking.serializer.js";

const VALID_MODES = ["remote", "customer_home", "veda_structure", "temple", "kashi", "other"];
const VALID_LOCATION_TYPES = ["remote", "customer_home", "veda_structure", "temple", "kashi", "other"];

/**
 * Generates an uppercase deterministic/unique booking reference
 * Format: VEDA-PUJA-XXXXXXXX
 */
export const generateUniqueBookingReference = (serviceType = "PUJA") => {
  const timestampPart = Date.now().toString(36).toUpperCase().slice(-4);
  const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `VEDA-${serviceType.toUpperCase()}-${timestampPart}${randomPart}`;
};

/**
 * POST /api/ritual-bookings/calculate-price
 * Calculates authoritative price without trusting frontend values
 */
export const calculateRitualPrice = async (req, res) => {
  try {
    const { serviceSlug, durationHours, panditCount = 1, addons = [] } = req.body;

    if (!serviceSlug || !String(serviceSlug).trim()) {
      return res.status(400).json({
        success: false,
        message: "serviceSlug is required",
      });
    }

    const service = await PujaService.findOne({
      where: {
        slug: String(serviceSlug).trim().toLowerCase(),
      },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Puja service not found",
      });
    }

    if (!service.isActive) {
      return res.status(404).json({
        success: false,
        message: "Puja service is currently inactive",
      });
    }

    const priceData = calculateRitualPriceInternal({
      service,
      durationHours,
      panditCount,
      addons,
    });

    return res.status(200).json({
      success: true,
      data: serializeRitualPriceCalculation(priceData),
    });
  } catch (error) {
    console.error("Calculate ritual price error:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to calculate ritual price",
    });
  }
};

/**
 * POST /api/ritual-bookings
 * Creates a new ritual booking in a PostgreSQL transaction
 */
export const createRitualBooking = async (req, res) => {
  try {
    const {
      serviceSlug,
      configuration,
      yajman,
      sankalp,
      familyMembers = [],
      location,
      addons = [],
    } = req.body;

    // 1. Validate serviceSlug
    if (!serviceSlug || !String(serviceSlug).trim()) {
      return res.status(400).json({
        success: false,
        message: "serviceSlug is required",
      });
    }

    // 2 & 3. Validate PujaService exists and is active
    const service = await PujaService.findOne({
      where: {
        slug: String(serviceSlug).trim().toLowerCase(),
      },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Puja service not found",
      });
    }

    if (!service.isActive) {
      return res.status(404).json({
        success: false,
        message: "Puja service is currently inactive",
      });
    }

    // 4. Validate Configuration object
    if (!configuration || typeof configuration !== "object") {
      return res.status(400).json({
        success: false,
        message: "Booking configuration is required",
      });
    }

    const {
      date,
      timeSlot,
      durationHours,
      durationSelected,
      panditCount = 1,
      arrangementMode,
    } = configuration;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date).trim())) {
      return res.status(400).json({
        success: false,
        message: "Valid booking date (YYYY-MM-DD) is required",
      });
    }

    if (!timeSlot || !String(timeSlot).trim()) {
      return res.status(400).json({
        success: false,
        message: "Valid booking time slot is required",
      });
    }

    if (!durationSelected || !String(durationSelected).trim()) {
      return res.status(400).json({
        success: false,
        message: "durationSelected is required",
      });
    }

    if (!arrangementMode || !VALID_MODES.includes(String(arrangementMode).trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid arrangementMode. Allowed: ${VALID_MODES.join(", ")}`,
      });
    }

    // 5. Authoritative price calculation & duration/pandit validation
    let priceData;
    try {
      priceData = calculateRitualPriceInternal({
        service,
        durationHours,
        panditCount,
        addons,
      });
    } catch (pricingError) {
      return res.status(400).json({
        success: false,
        message: pricingError.message,
      });
    }

    // 6. Validate Location
    if (!location || typeof location !== "object") {
      return res.status(400).json({
        success: false,
        message: "Location information is required",
      });
    }

    const { locationType, venueDetails = {} } = location;
    if (!locationType || !VALID_LOCATION_TYPES.includes(String(locationType).trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid locationType. Allowed: ${VALID_LOCATION_TYPES.join(", ")}`,
      });
    }

    if (
      (locationType === "customer_home" || locationType === "other") &&
      (!venueDetails ||
        !venueDetails.address ||
        !String(venueDetails.address).trim() ||
        !venueDetails.city ||
        !String(venueDetails.city).trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Home/Other location requires street address and city details in venueDetails",
      });
    }

    // 7. Validate Yajman Details
    if (!yajman || typeof yajman !== "object") {
      return res.status(400).json({
        success: false,
        message: "Yajman details are required",
      });
    }

    if (!yajman.name || !String(yajman.name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Yajman name is required",
      });
    }

    if (!yajman.mobile || !String(yajman.mobile).trim()) {
      return res.status(400).json({
        success: false,
        message: "Yajman mobile number is required",
      });
    }

    if (yajman.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(yajman.email).trim())) {
      return res.status(400).json({
        success: false,
        message: "Invalid Yajman email format",
      });
    }

    // 8. Validate Sankalp Details
    if (!sankalp || typeof sankalp !== "object") {
      return res.status(400).json({
        success: false,
        message: "Sankalp details are required",
      });
    }

    if (!sankalp.purpose && !sankalp.mainIntention) {
      return res.status(400).json({
        success: false,
        message: "Sankalp purpose or main intention is required",
      });
    }

    // 9. Validate Family Members (Array + defined structure)
    if (!Array.isArray(familyMembers)) {
      return res.status(400).json({
        success: false,
        message: "familyMembers must be an array",
      });
    }

    for (let i = 0; i < familyMembers.length; i++) {
      const member = familyMembers[i];
      if (!member || typeof member !== "object" || !member.name || !String(member.name).trim()) {
        return res.status(400).json({
          success: false,
          message: `Family member at position ${i + 1} must have a valid name`,
        });
      }
    }

    // 10. Validate Addons (Array)
    if (!Array.isArray(addons)) {
      return res.status(400).json({
        success: false,
        message: "addons must be an array",
      });
    }

    // 11. Associate User ID (Authenticated or Guest)
    const userId = req.user ? req.user.id : null;

    // 12. Create Booking inside a Sequelize Transaction
    const newBooking = await db.sequelize.transaction(async (t) => {
      let bookingReference = generateUniqueBookingReference("PUJA");

      // Verify reference uniqueness (safeguard)
      let existing = await RitualBooking.findOne({
        where: { bookingReference },
        transaction: t,
      });

      let attempts = 0;
      while (existing && attempts < 5) {
        bookingReference = generateUniqueBookingReference("PUJA");
        existing = await RitualBooking.findOne({
          where: { bookingReference },
          transaction: t,
        });
        attempts++;
      }

      const created = await RitualBooking.create(
        {
          bookingReference,
          serviceType: "PUJA",
          serviceId: service.id,
          serviceSlug: service.slug,
          serviceName: service.name,
          userId,
          bookingDate: String(date).trim(),
          bookingTime: String(timeSlot).trim(),
          durationSelected: String(durationSelected).trim(),
          durationHours: parseInt(durationHours, 10),
          panditCount: parseInt(panditCount, 10) || 1,
          arrangementMode: String(arrangementMode).trim().toLowerCase(),
          locationType: String(locationType).trim().toLowerCase(),
          venueDetails: venueDetails || {},
          yajmanDetails: yajman,
          sankalpDetails: sankalp,
          familyMembers: familyMembers || [],
          addons: addons || [],
          basePrice: priceData.basePrice,
          panditAddonPrice: priceData.panditAddonPrice,
          addonsTotal: priceData.addonsTotal,
          totalAmount: priceData.totalAmount,
          currency: "INR",
          bookingStatus: "Pending",
          paymentStatus: "Pending",
          paymentGateway: "Cashfree",
        },
        { transaction: t }
      );

      return created;
    });

    return res.status(201).json({
      success: true,
      message: "Ritual booking created successfully",
      data: serializeRitualBookingCreation(newBooking, priceData.formattedTotal),
    });
  } catch (error) {
    console.error("Create ritual booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create ritual booking",
    });
  }
};

/**
 * GET /api/ritual-bookings/:bookingReference
 * Retrieves ritual booking details by reference
 */
export const getRitualBookingByReference = async (req, res) => {
  try {
    const { bookingReference } = req.params;

    if (!bookingReference || !String(bookingReference).trim()) {
      return res.status(404).json({
        success: false,
        message: "Booking reference is required",
      });
    }

    const booking = await RitualBooking.findOne({
      where: {
        bookingReference: String(bookingReference).trim().toUpperCase(),
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Ritual booking not found",
      });
    }

    // Security & Authorization:
    // If the booking is attached to a registered user:
    // - Authenticated owner or admin can view
    // - Unauthenticated guest or another user is restricted
    if (booking.userId) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required to view this booking",
        });
      }

      if (req.user.id !== booking.userId && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to view this booking",
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: serializeRitualBookingDetail(booking),
    });
  } catch (error) {
    console.error("Get ritual booking by reference error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load booking details",
    });
  }
};
