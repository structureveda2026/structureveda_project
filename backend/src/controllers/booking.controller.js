import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";

// Server-side source of truth for astrologer package pricing and add-ons
const ASTROLOGER_CONFIG = {
  "ast-vishal": {
    name: "Vishal Bhardwaj",
    refPrefix: "VB",
    packages: {
      essential: {
        title: "Essential Vedic Clarity",
        duration: "30 Minutes",
        price: 1100,
      },
      complete: {
        title: "Complete Kundali Guidance",
        duration: "60 Minutes (1 Hr)",
        price: 2100,
      },
      premium: {
        title: "Deep-Dive Life & Destiny",
        duration: "90 Minutes",
        price: 5100,
      },
      comprehensive: {
        title: "Family & Enterprise Session",
        duration: "3 Hours",
        price: 11000,
      },
    },
    addOnPrices: {
      addOnCouple: 3100,
      addOnReport: 500,
      addOnExpress: 400,
    },
  },
  "ast-anurag": {
    name: "Acharya Anurag Bhardwaj",
    refPrefix: "AB",
    packages: {
      essential: {
        title: "Essential Vedic Clarity",
        duration: "30 Minutes",
        price: 1100,
      },
      complete: {
        title: "Complete Kundali Guidance",
        duration: "60 Minutes (1 Hr)",
        price: 2100,
      },
      premium: {
        title: "Deep-Dive Life & Destiny",
        duration: "90 Minutes",
        price: 5100,
      },
      comprehensive: {
        title: "Family & Enterprise Session",
        duration: "3 Hours",
        price: 11000,
      },
    },
    addOnPrices: {
      addOnCouple: 3100,
      addOnReport: 500,
      addOnExpress: 400,
    },
  },
};

const generateUniqueBookingReference = async (prefix = "VB") => {
  let isUnique = false;
  let reference = "";

  while (!isUnique) {
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    reference = `${prefix}-${randomSixDigits}`;

    const existing = await Booking.findOne({ where: { bookingReference: reference } });
    if (!existing) {
      isUnique = true;
    }
  }

  return reference;
};

export const createBooking = async (req, res) => {
  try {
    const {
      astrologerId = "ast-vishal",
      astrologerName,
      packageId,
      fullName,
      gender,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      reportLanguage = "Hindi (हिंदी)",
      phone,
      email,
      consultationDate,
      consultationTime,
      consultationMode = "Video Call (Google Meet / Zoom)",
      selectedTopics = [],
      addOns = {},
      notes,
    } = req.body;

    // 1. Mandatory field validation
    if (
      !packageId ||
      !fullName ||
      !gender ||
      !dateOfBirth ||
      !placeOfBirth ||
      !phone ||
      !consultationDate ||
      !consultationTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking details. Please complete all required fields.",
      });
    }

    // 2. Validate astrologer & package configuration on the server
    const astroConfig = ASTROLOGER_CONFIG[astrologerId] || ASTROLOGER_CONFIG["ast-vishal"];
    const pkg = astroConfig.packages[packageId];

    if (!pkg) {
      return res.status(400).json({
        success: false,
        message: `Invalid package '${packageId}' selected for astrologer.`,
      });
    }

    // 3. Server-side price calculation (Never trust client-submitted amount)
    let calculatedAmount = pkg.price;
    const resolvedAddOns = {
      addOnCouple: Boolean(addOns.addOnCouple),
      addOnReport: Boolean(addOns.addOnReport),
      addOnExpress: Boolean(addOns.addOnExpress),
    };

    if (resolvedAddOns.addOnCouple) calculatedAmount += astroConfig.addOnPrices.addOnCouple;
    if (resolvedAddOns.addOnReport) calculatedAmount += astroConfig.addOnPrices.addOnReport;
    if (resolvedAddOns.addOnExpress) calculatedAmount += astroConfig.addOnPrices.addOnExpress;

    // 4. Generate unique booking reference
    const bookingReference = await generateUniqueBookingReference(astroConfig.refPrefix);

    // 5. Associate authenticated user if logged in
    const userId = req.user ? req.user.id : null;

    // 6. Create booking record in PostgreSQL
    const booking = await Booking.create({
      bookingReference,
      userId,
      astrologerId,
      astrologerName: astrologerName || astroConfig.name,
      packageId,
      packageName: pkg.title,
      duration: pkg.duration,
      amount: calculatedAmount,
      addOns: resolvedAddOns,
      fullName: fullName.trim(),
      gender,
      dateOfBirth,
      timeOfBirth: timeOfBirth || "Unknown",
      placeOfBirth: placeOfBirth.trim(),
      reportLanguage,
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : null,
      consultationDate,
      consultationTime,
      consultationMode,
      selectedTopics: Array.isArray(selectedTopics) ? selectedTopics : [],
      bookingStatus: "Confirmed",
      paymentStatus: "Pending", // No gateway integrated yet; pending real transaction
      paymentMethod: "Online",
      notes: notes ? notes.trim() : null,
    });

    return res.status(201).json({
      success: true,
      message: "Consultation booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the consultation booking",
    });
  }
};

export const getBookingByReferenceOrId = async (req, res) => {
  try {
    const { identifier } = req.params;

    let booking = await Booking.findOne({
      where: { bookingReference: identifier },
      include: [{ model: User, as: "user", attributes: ["id", "fullName", "email", "phone"] }],
    });

    if (!booking) {
      booking = await Booking.findByPk(identifier, {
        include: [{ model: User, as: "user", attributes: ["id", "fullName", "email", "phone"] }],
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load booking details",
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to view your bookings",
      });
    }

    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get user bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load user bookings",
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      order: [["createdAt", "DESC"]],
      include: [{ model: User, as: "user", attributes: ["id", "fullName", "email", "phone"] }],
    });

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load bookings",
    });
  }
};
