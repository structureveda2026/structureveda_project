import crypto from "crypto";
import db, { RitualBooking, PujaService, YagyaService } from "../models/index.js";
import {
  calculateRitualPriceInternal,
  calculateYagyaPriceInternal,
  deriveCompletionDate,
} from "../services/ritualPricing.service.js";
import {
  serializeRitualPriceCalculation,
  serializeRitualBookingCreation,
  serializeRitualBookingDetail,
} from "../serializers/ritualBooking.serializer.js";

const VALID_MODES = ["remote", "customer_home", "veda_structure", "temple", "kashi", "other"];
const VALID_LOCATION_TYPES = ["remote", "customer_home", "veda_structure", "temple", "kashi", "other"];

/**
 * Generates an uppercase deterministic/unique booking reference
 * Format: VEDA-PUJA-XXXXXXXX or VEDA-YAGYA-XXXXXXXX
 */
export const generateUniqueBookingReference = (serviceType = "PUJA") => {
  const cleanType = String(serviceType).trim().toUpperCase();
  const timestampPart = Date.now().toString(36).toUpperCase().slice(-4);
  const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `VEDA-${cleanType}-${timestampPart}${randomPart}`;
};

/**
 * POST /api/ritual-bookings/calculate-price
 * Calculates authoritative price without trusting frontend values
 */
export const calculateRitualPrice = async (req, res) => {
  try {
    const {
      serviceType: rawServiceType,
      serviceId,
      serviceSlug,
      durationHours,
      durationSelected,
      days,
      dailyHours,
      panditCount,
      arrangementMode,
      locationType,
      addons = [],
    } = req.body;

    const serviceType = (rawServiceType || "PUJA").toString().trim().toUpperCase();

    if (!["PUJA", "YAGYA"].includes(serviceType)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported serviceType: ${serviceType}. Supported: PUJA, YAGYA`,
      });
    }

    if (!serviceSlug || !String(serviceSlug).trim()) {
      return res.status(400).json({
        success: false,
        message: "serviceSlug is required",
      });
    }

    if (serviceType === "PUJA") {
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

      if (serviceId && service.id !== serviceId) {
        return res.status(400).json({
          success: false,
          message: "serviceId does not match serviceSlug",
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
        panditCount: panditCount != null ? panditCount : 1,
        addons,
      });

      return res.status(200).json({
        success: true,
        data: serializeRitualPriceCalculation(priceData),
      });
    }

    // YAGYA Service Price Calculation
    const service = await YagyaService.findOne({
      where: {
        slug: String(serviceSlug).trim().toLowerCase(),
      },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Yagya service not found",
      });
    }

    if (serviceId && service.id !== serviceId) {
      return res.status(400).json({
        success: false,
        message: "serviceId does not match serviceSlug",
      });
    }

    if (!service.isActive) {
      return res.status(404).json({
        success: false,
        message: "Yagya service is currently inactive",
      });
    }

    // Validate arrangementMode and locationType if provided
    if (arrangementMode && !VALID_MODES.includes(String(arrangementMode).trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid arrangementMode: ${arrangementMode}. Allowed: ${VALID_MODES.join(", ")}`,
      });
    }

    if (locationType && !VALID_LOCATION_TYPES.includes(String(locationType).trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid locationType: ${locationType}. Allowed: ${VALID_LOCATION_TYPES.join(", ")}`,
      });
    }

    // Check service-specific arrangement capability
    const mode = arrangementMode ? String(arrangementMode).trim().toLowerCase() : null;
    if (mode === "kashi" && service.isKashiAvailable === false) {
      return res.status(400).json({
        success: false,
        message: "Kashi arrangement mode is not available for this Yagya",
      });
    }
    if (mode === "remote" && service.isRemoteAvailable === false) {
      return res.status(400).json({
        success: false,
        message: "Remote arrangement mode is not available for this Yagya",
      });
    }

    // Resolve days from days parameter or durationSelected
    let resolvedDays = days;
    if (resolvedDays == null && durationSelected) {
      const match = String(durationSelected).match(/\d+/);
      if (match) resolvedDays = parseInt(match[0], 10);
    }

    const priceData = calculateYagyaPriceInternal({
      service,
      days: resolvedDays,
      durationHours,
      dailyHours,
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
      serviceType: rawServiceType,
      serviceId,
      serviceSlug,
      configuration,
      yajman,
      sankalp,
      familyMembers = [],
      location,
      addons = [],
    } = req.body;

    const serviceType = (rawServiceType || "PUJA").toString().trim().toUpperCase();

    if (!["PUJA", "YAGYA"].includes(serviceType)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported serviceType: ${serviceType}. Supported: PUJA, YAGYA`,
      });
    }

    // 1. Validate serviceSlug
    if (!serviceSlug || !String(serviceSlug).trim()) {
      return res.status(400).json({
        success: false,
        message: "serviceSlug is required",
      });
    }

    // 2. Validate Configuration object
    if (!configuration || typeof configuration !== "object") {
      return res.status(400).json({
        success: false,
        message: "Booking configuration is required",
      });
    }

    // -------------------------------------------------------------------------
    // PUJA BOOKING BRANCH (Preserved 100% Unchanged)
    // -------------------------------------------------------------------------
    if (serviceType === "PUJA") {
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

      if (serviceId && service.id !== serviceId) {
        return res.status(400).json({
          success: false,
          message: "serviceId does not match serviceSlug",
        });
      }

      if (!service.isActive) {
        return res.status(404).json({
          success: false,
          message: "Puja service is currently inactive",
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

      // Authoritative price calculation & duration/pandit validation
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

      // Validate Location
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

      // Validate Yajman Details
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

      // Validate Sankalp Details
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

      // Validate Family Members
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

      if (!Array.isArray(addons)) {
        return res.status(400).json({
          success: false,
          message: "addons must be an array",
        });
      }

      const userId = req.user ? req.user.id : null;

      const newBooking = await db.sequelize.transaction(async (t) => {
        let bookingReference = generateUniqueBookingReference("PUJA");

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
            yajmanDetails: { ...yajman, phone: yajman.phone || yajman.mobile, mobile: yajman.mobile || yajman.phone },
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
    }

    // -------------------------------------------------------------------------
    // YAGYA BOOKING BRANCH (Phase 5D)
    // -------------------------------------------------------------------------
    const service = await YagyaService.findOne({
      where: {
        slug: String(serviceSlug).trim().toLowerCase(),
      },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Yagya service not found",
      });
    }

    if (serviceId && service.id !== serviceId) {
      return res.status(400).json({
        success: false,
        message: "serviceId does not match serviceSlug",
      });
    }

    if (!service.isActive) {
      return res.status(404).json({
        success: false,
        message: "Yagya service is currently inactive",
      });
    }

    const {
      date,
      timeSlot,
      days,
      durationHours,
      dailyHours,
      durationSelected,
      completionDate,
      panditCount,
      arrangementMode,
    } = configuration;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date).trim())) {
      return res.status(400).json({
        success: false,
        message: "Valid Yagya commencement date (YYYY-MM-DD) is required",
      });
    }

    if (!timeSlot || !String(timeSlot).trim()) {
      return res.status(400).json({
        success: false,
        message: "Valid daily commencement time is required",
      });
    }

    if (!arrangementMode || !VALID_MODES.includes(String(arrangementMode).trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid arrangementMode. Allowed: ${VALID_MODES.join(", ")}`,
      });
    }

    const cleanMode = String(arrangementMode).trim().toLowerCase();
    if (cleanMode === "kashi" && service.isKashiAvailable === false) {
      return res.status(400).json({
        success: false,
        message: "Kashi arrangement mode is not available for this Yagya",
      });
    }
    if (cleanMode === "remote" && service.isRemoteAvailable === false) {
      return res.status(400).json({
        success: false,
        message: "Remote arrangement mode is not available for this Yagya",
      });
    }

    // Resolve days from days or durationSelected
    let resolvedDays = days;
    if (resolvedDays == null && durationSelected) {
      const match = String(durationSelected).match(/\d+/);
      if (match) resolvedDays = parseInt(match[0], 10);
    }

    // Authoritative server-side price calculation
    let priceData;
    try {
      priceData = calculateYagyaPriceInternal({
        service,
        days: resolvedDays,
        durationHours,
        dailyHours,
        panditCount,
        addons,
      });
    } catch (pricingError) {
      return res.status(400).json({
        success: false,
        message: pricingError.message,
      });
    }

    // Completion date validation: server-derived
    const derivedCompletion = deriveCompletionDate(String(date).trim(), priceData.days);
    if (completionDate && String(completionDate).trim() !== derivedCompletion) {
      return res.status(400).json({
        success: false,
        message: `Completion date mismatch. For commencement ${date} and ${priceData.days} days, completion date must be ${derivedCompletion}.`,
      });
    }

    // Validate Location
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

    // Validate Yajman Details
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

    // Validate Sankalp Details
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

    // Validate Family Members
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

    if (!Array.isArray(addons)) {
      return res.status(400).json({
        success: false,
        message: "addons must be an array",
      });
    }

    const userId = req.user ? req.user.id : null;

    // Enrich sankalp details with Yagya operational metadata (canonical JSONB reuse)
    const enrichedSankalp = {
      ...sankalp,
      yagyaMetadata: {
        days: priceData.days,
        dailyHours: priceData.dailyHours,
        completionDate: derivedCompletion,
        selectedPricingTier: priceData.pricingTier,
      },
    };

    // Create Booking inside a Sequelize Transaction
    const newBooking = await db.sequelize.transaction(async (t) => {
      let bookingReference = generateUniqueBookingReference("YAGYA");

      let existing = await RitualBooking.findOne({
        where: { bookingReference },
        transaction: t,
      });

      let attempts = 0;
      while (existing && attempts < 5) {
        bookingReference = generateUniqueBookingReference("YAGYA");
        existing = await RitualBooking.findOne({
          where: { bookingReference },
          transaction: t,
        });
        attempts++;
      }

      const created = await RitualBooking.create(
        {
          bookingReference,
          serviceType: "YAGYA",
          serviceId: service.id,
          serviceSlug: service.slug,
          serviceName: service.name,
          userId,
          bookingDate: String(date).trim(),
          bookingTime: String(timeSlot).trim(),
          durationSelected: priceData.durationSelected,
          durationHours: priceData.durationHours,
          panditCount: priceData.panditCount,
          arrangementMode: cleanMode,
          locationType: String(locationType).trim().toLowerCase(),
          venueDetails: venueDetails || {},
          yajmanDetails: { ...yajman, phone: yajman.phone || yajman.mobile, mobile: yajman.mobile || yajman.phone },
          sankalpDetails: enrichedSankalp,
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
      message: "Yagya ritual booking created successfully",
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
