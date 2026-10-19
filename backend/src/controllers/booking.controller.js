import { Op } from "sequelize";
import sequelize from "../config/database.js";
import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";
import { Astrologer, AstrologerPackage } from "../models/index.js";
import {
  getCanonicalSlotLockKey,
  acquireSlotAdvisoryLock,
  checkSlotConflict,
  getTodayDateInKolkata,
} from "../utils/slotConcurrency.js";
import {
  initiateCashfreeRefund,
  fetchCashfreeRefund,
  fetchCashfreeOrderRefunds,
} from "../services/cashfree.service.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Baseline configuration kept as fallback for astrologer code mapping & reference prefixes
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

const maskPhone = (phone) => {
  if (!phone) return null;
  const str = String(phone).trim();
  if (str.length <= 4) return "****";
  return str.slice(0, 3) + "******" + str.slice(-4);
};

const maskEmail = (email) => {
  if (!email) return null;
  const str = String(email).trim();
  const parts = str.split("@");
  if (parts.length !== 2) return "****";
  const [local, domain] = parts;
  const maskedLocal =
    local.length > 2
      ? `${local[0]}***${local[local.length - 1]}`
      : `${local[0]}***`;
  return `${maskedLocal}@${domain}`;
};

const generateUniqueBookingReference = async (prefix = "VB", transaction = null) => {
  let isUnique = false;
  let reference = "";

  while (!isUnique) {
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    reference = `${prefix}-${randomSixDigits}`;

    const existing = await Booking.findOne({
      where: { bookingReference: reference },
      transaction,
    });
    if (!existing) {
      isUnique = true;
    }
  }

  return reference;
};

/**
 * POST /api/bookings
 * Create new astrologer consultation booking backed by database prices
 */
export const createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
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
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message:
          "Missing required booking details. Please complete all required fields.",
      });
    }

    // 2. Resolve astrologer from PostgreSQL database
    let astrologer = null;
    const cleanAstroId = String(astrologerId).trim();

    if (UUID_REGEX.test(cleanAstroId)) {
      astrologer = await Astrologer.findOne({
        where: { id: cleanAstroId, isActive: true },
        transaction,
      });
    }
    if (!astrologer) {
      astrologer = await Astrologer.findOne({
        where: {
          [Op.or]: [{ code: cleanAstroId }, { slug: cleanAstroId.toLowerCase() }],
          isActive: true,
        },
        transaction,
      });
    }

    if (!astrologer) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Astrologer '${cleanAstroId}' is invalid or currently inactive.`,
      });
    }

    // 3. Resolve package from PostgreSQL database (strictly scoped to this astrologer)
    let pkg = null;
    const cleanPkgId = String(packageId).trim();

    if (UUID_REGEX.test(cleanPkgId)) {
      pkg = await AstrologerPackage.findOne({
        where: { id: cleanPkgId, astrologerId: astrologer.id, isActive: true },
        transaction,
      });
    }
    if (!pkg) {
      pkg = await AstrologerPackage.findOne({
        where: {
          packageKey: cleanPkgId.toLowerCase(),
          astrologerId: astrologer.id,
          isActive: true,
        },
        transaction,
      });
    }

    if (!pkg) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Invalid or inactive package '${cleanPkgId}' selected for ${astrologer.name}.`,
      });
    }

    // 4. Validate Consultation Date and Time Slot
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const cleanDate = String(consultationDate).trim();
    if (!datePattern.test(cleanDate)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "consultationDate must be in YYYY-MM-DD format.",
      });
    }
    const todayStr = getTodayDateInKolkata();
    if (cleanDate < todayStr) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "consultationDate cannot be in the past.",
      });
    }

    const requestedTime = String(consultationTime).trim();
    if (
      Array.isArray(astrologer.availableTimeSlots) &&
      astrologer.availableTimeSlots.length > 0
    ) {
      const match = astrologer.availableTimeSlots.some(
        (slot) => slot.trim().toLowerCase() === requestedTime.toLowerCase()
      );
      if (!match) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `The selected time slot '${requestedTime}' is not valid for ${astrologer.name}.`,
        });
      }
    }

    // 5. Concurrency Protection: Acquire transaction-scoped advisory lock & check for slot conflict
    const slotLockKey = getCanonicalSlotLockKey(astrologer.code, cleanDate, requestedTime);
    await acquireSlotAdvisoryLock(sequelize, slotLockKey, transaction);

    const slotConflict = await checkSlotConflict({
      Booking,
      astrologerId: astrologer.code,
      consultationDate: cleanDate,
      consultationTime: requestedTime,
      transaction,
    });

    if (slotConflict) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: `The consultation slot '${requestedTime}' on ${cleanDate} is already reserved or booked. Please select another slot.`,
      });
    }

    // 6. Server-side price calculation (Never trust client-submitted amount)
    let calculatedAmount = Number(pkg.price);
    const astroAddOnPrices =
      astrologer.addOnPricing &&
      typeof astrologer.addOnPricing === "object" &&
      Object.keys(astrologer.addOnPricing).length > 0
        ? astrologer.addOnPricing
        : ASTROLOGER_CONFIG[astrologer.code]?.addOnPrices || {
            addOnCouple: 3100,
            addOnReport: 500,
            addOnExpress: 400,
          };

    const resolvedAddOns = {
      addOnCouple: Boolean(addOns.addOnCouple),
      addOnReport: Boolean(addOns.addOnReport),
      addOnExpress: Boolean(addOns.addOnExpress),
    };

    if (resolvedAddOns.addOnCouple) {
      calculatedAmount += Number(astroAddOnPrices.addOnCouple || 3100);
    }
    if (resolvedAddOns.addOnReport) {
      calculatedAmount += Number(astroAddOnPrices.addOnReport || 500);
    }
    if (resolvedAddOns.addOnExpress) {
      calculatedAmount += Number(astroAddOnPrices.addOnExpress || 400);
    }

    calculatedAmount = Number(calculatedAmount.toFixed(2));

    // 7. Generate unique booking reference with astrologer prefix
    const refPrefix =
      astrologer.code === "ast-anurag"
        ? "AB"
        : ASTROLOGER_CONFIG[astrologer.code]?.refPrefix || "VB";
    const bookingReference = await generateUniqueBookingReference(
      refPrefix,
      transaction
    );

    // 8. Associate authenticated user if logged in
    const userId = req.user ? req.user.id : null;

    // 9. Create booking record in PostgreSQL with immutable snapshot of tier details
    const booking = await Booking.create(
      {
        bookingReference,
        userId,
        astrologerId: astrologer.code,
        astrologerName: astrologerName || astrologer.name,
        packageId: pkg.packageKey,
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
        consultationTime: requestedTime,
        consultationMode,
        selectedTopics: Array.isArray(selectedTopics) ? selectedTopics : [],
        bookingStatus: "Pending", // Awaiting payment verification
        paymentStatus: "Pending", // Awaiting payment gateway transaction
        paymentMethod: "Online",
        notes: notes ? notes.trim() : null,
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Consultation booking created successfully",
      data: booking,
    });
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("Create booking error:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "This consultation slot was concurrently booked by another request. Please choose another slot.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the consultation booking",
    });
  }
};

/**
 * GET /api/bookings/:identifier
 * Public status lookup with strict privacy sanitization
 * Authenticated admins and booking owners receive full record; unauthenticated callers receive masked non-sensitive view
 */
export const getBookingByReferenceOrId = async (req, res) => {
  try {
    const { identifier } = req.params;

    let booking = await Booking.findOne({
      where: { bookingReference: identifier },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "phone"],
        },
      ],
    });

    if (!booking && UUID_REGEX.test(identifier)) {
      booking = await Booking.findByPk(identifier, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullName", "email", "phone"],
          },
        ],
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Authorization & Privacy Check:
    // If caller is authenticated admin or matching booking owner, return full record
    const isOwner = req.user && req.user.id && booking.userId === req.user.id;
    const isAdmin = req.user && req.user.role === "admin";

    if (isOwner || isAdmin) {
      return res.status(200).json({
        success: true,
        data: booking,
      });
    }

    // Public sanitized response: protect sensitive birth details, notes, and mask contact info
    const sanitizedBooking = {
      id: booking.id,
      bookingReference: booking.bookingReference,
      astrologerId: booking.astrologerId,
      astrologerName: booking.astrologerName,
      packageId: booking.packageId,
      packageName: booking.packageName,
      duration: booking.duration,
      amount: Number(booking.amount),
      addOns: booking.addOns,
      fullName: booking.fullName,
      phone: maskPhone(booking.phone),
      email: maskEmail(booking.email),
      reportLanguage: booking.reportLanguage,
      consultationDate: booking.consultationDate,
      consultationTime: booking.consultationTime,
      consultationMode: booking.consultationMode,
      selectedTopics: booking.selectedTopics,
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      transactionId: booking.transactionId,
      createdAt: booking.createdAt,
    };

    return res.status(200).json({
      success: true,
      data: sanitizedBooking,
    });
  } catch (error) {
    console.error("Get booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load booking details",
    });
  }
};

/**
 * GET /api/bookings/my-bookings
 * Get current authenticated user's bookings
 */
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

/**
 * GET /api/bookings/admin
 * GET /api/bookings (Admin only)
 * Filterable, paginated catalogue of all consultation bookings
 */
export const getAllBookings = async (req, res) => {
  try {
    const {
      search,
      astrologerId,
      bookingStatus,
      paymentStatus,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sortBy = "createdAt-desc",
    } = req.query;

    const where = {};

    // 1. Astrologer Filter
    if (astrologerId && String(astrologerId).trim()) {
      where.astrologerId = String(astrologerId).trim();
    }

    // 2. Status Filters
    if (bookingStatus && String(bookingStatus).trim()) {
      where.bookingStatus = String(bookingStatus).trim();
    }

    if (paymentStatus && String(paymentStatus).trim()) {
      where.paymentStatus = String(paymentStatus).trim();
    }

    // 3. Date range filters
    if (startDate && endDate) {
      where.consultationDate = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      where.consultationDate = { [Op.gte]: startDate };
    } else if (endDate) {
      where.consultationDate = { [Op.lte]: endDate };
    }

    // 4. Search Filter
    if (search && typeof search === "string" && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      where[Op.or] = [
        { bookingReference: { [Op.iLike]: term } },
        { fullName: { [Op.iLike]: term } },
        { phone: { [Op.iLike]: term } },
        { email: { [Op.iLike]: term } },
        { packageName: { [Op.iLike]: term } },
      ];
    }

    // 5. Sorting
    let order = [["createdAt", "DESC"]];
    if (sortBy === "createdAt-asc") {
      order = [["createdAt", "ASC"]];
    } else if (sortBy === "date-desc") {
      order = [["consultationDate", "DESC"], ["consultationTime", "DESC"]];
    } else if (sortBy === "date-asc") {
      order = [["consultationDate", "ASC"], ["consultationTime", "ASC"]];
    } else if (sortBy === "amount-desc") {
      order = [["amount", "DESC"]];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const offset = (pageNum - 1) * limitNum;

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
      order,
      limit: limitNum,
      offset,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "phone"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      total: count,
      totalPages: Math.ceil(count / limitNum),
      page: pageNum,
      data: bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load bookings catalogue",
    });
  }
};

/**
 * GET /api/bookings/admin/:id
 * Admin detail view for a specific booking
 */
export const getAdminBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    let booking = await Booking.findOne({
      where: { bookingReference: id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "phone"],
        },
      ],
    });

    if (!booking && UUID_REGEX.test(id)) {
      booking = await Booking.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullName", "email", "phone"],
          },
        ],
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking '${id}' was not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Admin get booking by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load booking details.",
    });
  }
};

/**
 * PATCH /api/bookings/admin/:id/status
 * Admin update for booking status with permitted transitions
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingStatus, paymentStatus, notes } = req.body || {};

    const PERMITTED_STATUSES = [
      "Pending",
      "Confirmed",
      "Completed",
      "Cancelled",
      "Rescheduled",
      "Payment Review Required",
    ];

    if (!bookingStatus || !PERMITTED_STATUSES.includes(bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid bookingStatus. Permitted values: ${PERMITTED_STATUSES.join(
          ", "
        )}.`,
      });
    }

    let booking = await Booking.findOne({ where: { bookingReference: id } });
    if (!booking && UUID_REGEX.test(id)) {
      booking = await Booking.findByPk(id);
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking '${id}' was not found.`,
      });
    }

    // Permitted state transitions check
    const current = booking.bookingStatus;
    if (current === "Cancelled" && bookingStatus !== "Cancelled") {
      return res.status(400).json({
        success: false,
        message:
          "Cancelled bookings cannot be reactivated directly. Client must create a new booking.",
      });
    }

    if (current === "Completed" && bookingStatus !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Completed bookings cannot be modified to a previous status.",
      });
    }

    const updates = { bookingStatus };

    // Support payment status updates safely (e.g. Refund Pending / Refunded / Partially Refunded)
    if (paymentStatus) {
      const PERMITTED_PAYMENT_STATUSES = [
        "Pending",
        "Paid",
        "Refund Pending",
        "Refund Failed",
        "Partially Refunded",
        "Refunded",
        "Failed",
      ];
      if (!PERMITTED_PAYMENT_STATUSES.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid paymentStatus. Permitted values: ${PERMITTED_PAYMENT_STATUSES.join(", ")}.`,
        });
      }

      // SECURITY ENFORCEMENT: Independent verification with Cashfree gateway
      if (paymentStatus === "Refunded") {
        const orderId = booking.bookingReference;
        let verifiedRefunds = [];
        try {
          const refunds = await fetchCashfreeOrderRefunds(orderId);
          verifiedRefunds = refunds.filter(
            (r) => r.refund_status?.toUpperCase() === "SUCCESS"
          );
        } catch (fetchRefundErr) {
          console.warn("Could not query Cashfree order refunds during status update:", fetchRefundErr.message);
        }

        if (verifiedRefunds.length === 0) {
          return res.status(422).json({
            success: false,
            message: "Cannot mark payment as Refunded. Cashfree has not independently verified refund success for this booking. Current status remains 'Refund Pending'.",
          });
        }

        const cumulativeRefunded = verifiedRefunds.reduce(
          (sum, r) => sum + Number(r.refund_amount || 0),
          0
        );
        const orderTotal = Number(booking.amount);
        const isFull = cumulativeRefunded >= orderTotal - 0.01;
        const resolvedPaymentStatus = isFull ? "Refunded" : "Partially Refunded";

        const latestSuccess = verifiedRefunds[verifiedRefunds.length - 1];
        const refundArnNote = latestSuccess.refund_arn
          ? ` (ARN: ${latestSuccess.refund_arn})`
          : "";
        const gatewayLog = `[GATEWAY REFUND CONFIRMED] Cashfree Refund ID: ${latestSuccess.cf_refund_id || latestSuccess.refund_id} (Cumulative: ₹${cumulativeRefunded}/₹${orderTotal})${refundArnNote} verified on ${new Date().toISOString()}.`;
        updates.notes = updates.notes ? `${updates.notes}\n${gatewayLog}` : gatewayLog;
        updates.paymentStatus = resolvedPaymentStatus;
      } else {
        updates.paymentStatus = paymentStatus;
      }
    } else if (bookingStatus === "Cancelled" && booking.paymentStatus === "Paid") {
      // Automatic safe transition: if cancelling a paid booking without explicit paymentStatus, set to Refund Pending
      updates.paymentStatus = "Refund Pending";
    }

    if (notes !== undefined) {
      updates.notes = String(notes || "").trim();
    }

    // CONC-ADM-01: If transitioning to "Confirmed", acquire slot advisory lock & validate no slot conflict exists
    if (bookingStatus === "Confirmed" && current !== "Confirmed") {
      const lockKey = getCanonicalSlotLockKey(
        booking.astrologerId,
        booking.consultationDate,
        booking.consultationTime
      );
      const transaction = await sequelize.transaction();
      try {
        await acquireSlotAdvisoryLock(sequelize, lockKey, transaction);

        const conflict = await checkSlotConflict({
          Booking,
          astrologerId: booking.astrologerId,
          consultationDate: booking.consultationDate,
          consultationTime: booking.consultationTime,
          excludeBookingId: booking.id,
          transaction,
        });

        if (conflict) {
          await transaction.rollback();
          return res.status(409).json({
            success: false,
            message: `Cannot confirm booking: the slot '${booking.consultationTime}' on ${booking.consultationDate} is occupied by booking ${conflict.bookingReference} (${conflict.bookingStatus}). Please reschedule to an available slot first.`,
          });
        }

        await booking.update(updates, { transaction });
        await transaction.commit();

        return res.status(200).json({
          success: true,
          message: `Booking status updated to '${bookingStatus}'.`,
          data: booking,
        });
      } catch (confirmTxErr) {
        if (!transaction.finished) await transaction.rollback();
        throw confirmTxErr;
      }
    }

    await booking.update(updates);

    return res.status(200).json({
      success: true,
      message: `Booking status updated to '${bookingStatus}'.`,
      data: booking,
    });
  } catch (error) {
    console.error("Admin update booking status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update booking status.",
    });
  }
};

/**
 * PATCH /api/bookings/admin/:id/reschedule
 * Admin reschedule booking date and slot with collision protection
 */
export const rescheduleBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { consultationDate, consultationTime, notes } = req.body || {};

    if (!consultationDate || !consultationTime) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Both consultationDate and consultationTime are required.",
      });
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const cleanDate = String(consultationDate).trim();
    if (!datePattern.test(cleanDate)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "consultationDate must be in YYYY-MM-DD format.",
      });
    }
    const todayStr = getTodayDateInKolkata();
    if (cleanDate < todayStr) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Cannot reschedule to a past date.",
      });
    }

    let booking = await Booking.findOne({
      where: { bookingReference: id },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!booking && UUID_REGEX.test(id)) {
      booking = await Booking.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
    }

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: `Booking '${id}' was not found.`,
      });
    }

    if (booking.bookingStatus === "Cancelled") {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Cannot reschedule a cancelled booking.",
      });
    }

    if (booking.bookingStatus === "Completed") {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Cannot reschedule an already completed booking.",
      });
    }

    // Lookup astrologer to verify slot validity
    const astrologer = await Astrologer.findOne({
      where: { code: booking.astrologerId },
      transaction,
    });

    const newTime = String(consultationTime).trim();
    if (
      astrologer &&
      Array.isArray(astrologer.availableTimeSlots) &&
      astrologer.availableTimeSlots.length > 0
    ) {
      const match = astrologer.availableTimeSlots.some(
        (s) => s.trim().toLowerCase() === newTime.toLowerCase()
      );
      if (!match) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Slot '${newTime}' is not among configured consultation slots for ${astrologer.name}.`,
        });
      }
    }

    // Concurrency Protection: Acquire advisory lock on target slot & check collision
    const slotLockKey = getCanonicalSlotLockKey(booking.astrologerId, cleanDate, newTime);
    await acquireSlotAdvisoryLock(sequelize, slotLockKey, transaction);

    const conflict = await checkSlotConflict({
      Booking,
      astrologerId: booking.astrologerId,
      consultationDate: cleanDate,
      consultationTime: newTime,
      excludeBookingId: booking.id,
      transaction,
    });

    if (conflict) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: `The slot '${newTime}' on ${cleanDate} is already reserved or booked by another consultation.`,
      });
    }

    const updates = {
      consultationDate: cleanDate,
      consultationTime: newTime,
      bookingStatus: "Rescheduled",
    };
    if (notes !== undefined) {
      updates.notes = String(notes || "").trim();
    } else if (booking.bookingStatus === "Payment Review Required") {
      const prevNotes = booking.notes ? `${booking.notes}\n` : "";
      updates.notes = `${prevNotes}[ADMIN ACTION] Resolved Payment Review Required by rescheduling to ${cleanDate} ${newTime}.`;
    }

    await booking.update(updates, { transaction });
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: `Booking rescheduled to ${cleanDate} at ${newTime}.`,
      data: booking,
    });
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("Admin reschedule booking error:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "This consultation slot was concurrently booked by another request. Please choose another slot.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to reschedule booking.",
    });
  }
};

/**
 * POST /api/bookings/admin/:id/initiate-refund
 * Admin initiate refund via Cashfree with idempotency protection
 */
export const initiateBookingRefund = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { refundAmount, refundNote, refundSpeed } = req.body || {};

    let booking = await Booking.findOne({
      where: { bookingReference: id },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!booking && UUID_REGEX.test(id)) {
      booking = await Booking.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
    }

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: `Booking '${id}' was not found.`,
      });
    }

    // Idempotency: If already refunded, exit safely
    if (booking.paymentStatus === "Refunded") {
      await transaction.rollback();
      return res.status(200).json({
        success: true,
        message: "Payment for this booking has already been verified as Refunded.",
        data: booking,
      });
    }

    // Concurrency guard: If a refund is already in progress, prevent duplicate initiation
    if (booking.paymentStatus === "Refund In Progress") {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: "A refund initiation is already in progress for this booking. Please wait a moment and verify status.",
        data: booking,
      });
    }

    // Only Paid, Refund Pending, Refund Failed, or Partially Refunded bookings can be refunded
    const refundableStatuses = ["Paid", "Refund Pending", "Refund Failed", "Partially Refunded"];
    if (!refundableStatuses.includes(booking.paymentStatus)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot initiate refund for booking with payment status '${booking.paymentStatus}'. Must be Paid, Refund Pending, Refund Failed, or Partially Refunded.`,
      });
    }

    const effectiveAmount = refundAmount ? Number(refundAmount) : Number(booking.amount);
    const orderId = booking.bookingReference;

    // Check existing refunds on Cashfree to prevent duplicate pending refunds and determine attempt count
    let existingRefunds = [];
    try {
      existingRefunds = await fetchCashfreeOrderRefunds(orderId);
    } catch (fetchErr) {
      console.warn("Could not query Cashfree refunds prior to initiation:", fetchErr.message);
    }

    // If an existing refund is already PENDING / ONHOLD on Cashfree, block duplicate initiation
    const activePendingRefund = existingRefunds.find((r) =>
      ["PENDING", "ONHOLD"].includes(r.refund_status?.toUpperCase())
    );
    if (activePendingRefund) {
      const activeId = activePendingRefund.cf_refund_id || activePendingRefund.refund_id;
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: `A refund (${activeId}) is already pending with Cashfree. Please verify its status before initiating a new refund.`,
        data: booking,
      });
    }

    // Calculate cumulative successful refunds
    const successfulRefunds = existingRefunds.filter(
      (r) => r.refund_status?.toUpperCase() === "SUCCESS"
    );
    const cumulativeRefunded = successfulRefunds.reduce(
      (sum, r) => sum + Number(r.refund_amount || 0),
      0
    );
    const orderTotal = Number(booking.amount);
    if (cumulativeRefunded >= orderTotal - 0.01 && orderTotal > 0) {
      await booking.update({ paymentStatus: "Refunded" }, { transaction });
      await transaction.commit();
      return res.status(200).json({
        success: true,
        message: `Booking has already been fully refunded on Cashfree (₹${cumulativeRefunded}/₹${orderTotal}).`,
        data: booking,
      });
    }

    // Formulate persistent deterministic refund identity
    const cleanOrderId = orderId.replace(/[^a-zA-Z0-9]/g, "");
    const attemptIndex = existingRefunds.length + 1;
    const deterministicRefundId = `ref_${cleanOrderId}_${attemptIndex}`;

    // Atomically set in-flight state in DB
    const prevNotes = booking.notes ? `${booking.notes}\n` : "";
    await booking.update(
      {
        paymentStatus: "Refund In Progress",
        notes: `${prevNotes}[REFUND INITIATING] Attempting refund ID ${deterministicRefundId} for ₹${effectiveAmount}...`,
      },
      { transaction }
    );
    await transaction.commit();

    // Call Cashfree API with deterministic refund ID
    let refundData;
    try {
      refundData = await initiateCashfreeRefund({
        orderId,
        refundAmount: effectiveAmount,
        refundId: deterministicRefundId,
        refundNote: refundNote || `Refund for consultation ${orderId}`,
        refundSpeed: refundSpeed || "STANDARD",
      });
    } catch (cfErr) {
      console.error("Cashfree refund initiation error:", cfErr?.response?.data || cfErr.message);
      const errMsg = cfErr?.response?.data?.message || cfErr.message;

      const current = await Booking.findOne({ where: { bookingReference: orderId } });
      const currentNotes = current?.notes ? `${current.notes}\n` : "";
      await current?.update({
        paymentStatus: "Refund Failed",
        notes: `${currentNotes}[GATEWAY REFUND INITIATION ERROR] ${errMsg} at ${new Date().toISOString()}`,
      });

      return res.status(502).json({
        success: false,
        message: `Failed to initiate refund with Cashfree: ${errMsg}`,
        data: current,
      });
    }

    const cfRefundStatus = refundData.refund_status?.toUpperCase();
    const cfRefundId = refundData.cf_refund_id || refundData.refund_id || deterministicRefundId;

    let finalPaymentStatus = "Refund Pending";
    if (cfRefundStatus === "SUCCESS") {
      const newCumulative = cumulativeRefunded + effectiveAmount;
      finalPaymentStatus = newCumulative >= orderTotal - 0.01 ? "Refunded" : "Partially Refunded";
    } else if (cfRefundStatus === "FAILED" || cfRefundStatus === "CANCELLED") {
      finalPaymentStatus = "Refund Failed";
    }

    const currentBooking = await Booking.findOne({ where: { bookingReference: orderId } });
    const currentNotes = currentBooking?.notes ? `${currentBooking.notes}\n` : "";
    const logEntry = `[GATEWAY REFUND INITIATED] [LATEST_REFUND_ID: ${cfRefundId}] Status: ${cfRefundStatus}, Amount: ₹${effectiveAmount} on ${new Date().toISOString()}.`;

    await currentBooking?.update({
      paymentStatus: finalPaymentStatus,
      bookingStatus: currentBooking.bookingStatus === "Payment Review Required" ? "Cancelled" : currentBooking.bookingStatus,
      notes: `${currentNotes}${logEntry}`,
    });

    return res.status(200).json({
      success: true,
      message: `Refund initiated. Gateway status: ${cfRefundStatus}. Payment status set to '${finalPaymentStatus}'.`,
      data: {
        bookingReference: currentBooking.bookingReference,
        bookingStatus: currentBooking.bookingStatus,
        paymentStatus: finalPaymentStatus,
        cfRefundId,
        gatewayStatus: cfRefundStatus,
      },
    });
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("Admin initiate refund error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while initiating refund.",
    });
  }
};

/**
 * POST /api/bookings/admin/:id/verify-refund
 * Admin verify refund status directly with Cashfree
 */
export const verifyBookingRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refundId } = req.body || {};

    let booking = await Booking.findOne({ where: { bookingReference: id } });
    if (!booking && UUID_REGEX.test(id)) {
      booking = await Booking.findByPk(id);
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking '${id}' was not found.`,
      });
    }

    // Idempotency: If already confirmed as fully Refunded
    if (booking.paymentStatus === "Refunded") {
      return res.status(200).json({
        success: true,
        verified: true,
        message: "Refund is already confirmed as fully successful.",
        data: booking,
      });
    }

    const orderId = booking.bookingReference;

    // CASH-VER-01: Verify specific persisted refund identity
    let targetRefundId = refundId;
    if (!targetRefundId && booking.notes) {
      const match = booking.notes.match(/\[LATEST_REFUND_ID:\s*([^\]]+)\]/);
      if (match) {
        targetRefundId = match[1].trim();
      }
    }

    let targetRefund = null;
    if (targetRefundId) {
      try {
        targetRefund = await fetchCashfreeRefund(orderId, targetRefundId);
      } catch (err) {
        console.warn(`Could not fetch specific refund ${targetRefundId} from Cashfree:`, err.message);
      }
    }

    // Fallback: If no specific refund identity was persisted, inspect order refunds safely
    if (!targetRefund) {
      const refunds = await fetchCashfreeOrderRefunds(orderId);
      if (refunds.length === 0) {
        return res.status(404).json({
          success: false,
          verified: false,
          message: `No refunds found on Cashfree for booking reference ${orderId}.`,
        });
      }
      // Pick the latest refund attempt
      targetRefund = refunds[refunds.length - 1];
    }

    const gatewayStatus = targetRefund.refund_status?.toUpperCase();
    const prevNotes = booking.notes ? `${booking.notes}\n` : "";

    if (gatewayStatus === "SUCCESS") {
      let cumulativeRefunded = Number(targetRefund.refund_amount || 0);
      try {
        const allRefunds = await fetchCashfreeOrderRefunds(orderId);
        const successful = allRefunds.filter((r) => r.refund_status?.toUpperCase() === "SUCCESS");
        if (successful.length > 0) {
          cumulativeRefunded = successful.reduce((sum, r) => sum + Number(r.refund_amount || 0), 0);
        }
      } catch {
        // Fallback
      }

      const orderTotal = Number(booking.amount);
      const isFull = cumulativeRefunded >= orderTotal - 0.01;
      const targetPaymentStatus = isFull ? "Refunded" : "Partially Refunded";

      const arn = targetRefund.refund_arn ? ` (ARN: ${targetRefund.refund_arn})` : "";
      const logEntry = `[GATEWAY REFUND VERIFIED] Cashfree Refund ID: ${targetRefund.cf_refund_id || targetRefund.refund_id} (Amount: ₹${targetRefund.refund_amount}, Cumulative: ₹${cumulativeRefunded}/₹${orderTotal})${arn} verified on ${new Date().toISOString()}.`;

      await booking.update({
        paymentStatus: targetPaymentStatus,
        notes: `${prevNotes}${logEntry}`,
      });

      return res.status(200).json({
        success: true,
        verified: true,
        isFullRefund: isFull,
        message: `Refund confirmed by Cashfree. Booking payment status updated to '${targetPaymentStatus}'.`,
        data: booking,
      });
    }

    if (gatewayStatus === "FAILED" || gatewayStatus === "CANCELLED") {
      await booking.update({
        paymentStatus: "Refund Failed",
        notes: `${prevNotes}[GATEWAY REFUND FAILED] Cashfree reported status ${gatewayStatus} on ${new Date().toISOString()}.`,
      });

      return res.status(200).json({
        success: true,
        verified: false,
        message: `Cashfree reported refund status as '${gatewayStatus}'. Payment status updated to 'Refund Failed'.`,
        data: booking,
      });
    }

    // Still pending / on hold in Cashfree
    return res.status(200).json({
      success: true,
      verified: false,
      message: `Refund is currently '${gatewayStatus}' in Cashfree. Payment status remains 'Refund Pending'.`,
      data: booking,
    });
  } catch (error) {
    console.error("Admin verify refund error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while verifying refund status.",
    });
  }
};
