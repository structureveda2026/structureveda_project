import { Op } from "sequelize";
import sequelize from "../config/database.js";
import { RitualBooking, User } from "../models/index.js";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_SERVICE_TYPES = ["PUJA", "YAGYA", "HOMA", "JAPA", "PATH"];
const VALID_BOOKING_STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

/**
 * Normalizes a single ritual booking instance for administrative consumption.
 */
export const serializeAdminRitualBooking = (booking) => {
  const yajman = booking.yajmanDetails || {};
  return {
    id: booking.id,
    bookingReference: booking.bookingReference,
    serviceType: booking.serviceType,
    serviceId: booking.serviceId,
    serviceSlug: booking.serviceSlug,
    serviceName: booking.serviceName,
    userId: booking.userId || null,
    user: booking.user
      ? {
          id: booking.user.id,
          fullName: booking.user.fullName,
          email: booking.user.email,
          phone: booking.user.phone,
        }
      : null,
    customer: {
      name: yajman.name ? String(yajman.name).trim() : "",
      phone: yajman.phone || yajman.mobile || "",
      email: yajman.email || null,
      gotra: yajman.gotra || null,
      rashi: yajman.rashi || null,
      nakshatra: yajman.nakshatra || null,
      address: yajman.address || null,
      city: yajman.city || null,
      state: yajman.state || null,
      pincode: yajman.pincode || null,
    },
    bookingDate: booking.bookingDate,
    bookingTime: booking.bookingTime,
    durationSelected: booking.durationSelected,
    durationHours: booking.durationHours,
    panditCount: booking.panditCount,
    arrangementMode: booking.arrangementMode,
    locationType: booking.locationType,
    venueDetails: booking.venueDetails || {},
    sankalpDetails: booking.sankalpDetails || {},
    familyMembers: Array.isArray(booking.familyMembers) ? booking.familyMembers : [],
    addons: Array.isArray(booking.addons) ? booking.addons : [],
    pricing: {
      basePrice: Number(booking.basePrice),
      panditAddonPrice: Number(booking.panditAddonPrice),
      addonsTotal: Number(booking.addonsTotal),
      totalAmount: Number(booking.totalAmount),
      currency: booking.currency || "INR",
    },
    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,
    paymentGateway: booking.paymentGateway || "Cashfree",
    transactionId: booking.transactionId || null,
    paymentSessionId: booking.paymentSessionId || null,
    prasadStatus: booking.prasadStatus || "Pending",
    prasadTrackingNumber: booking.prasadTrackingNumber || null,
    notes: booking.notes || null,
    createdAt: booking.created_at || booking.createdAt,
    updatedAt: booking.updated_at || booking.updatedAt,
  };
};

/**
 * GET /api/admin/ritual-bookings
 * Filterable, paginated catalogue of all ritual bookings (Puja, Yagya, Homa, Japa, Path).
 */
export const getAllRitualBookings = async (req, res) => {
  try {
    const {
      search,
      serviceType,
      bookingStatus,
      paymentStatus,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sortBy = "createdAt-desc",
    } = req.query;

    const where = {};

    // 1. Service Type Filter
    if (serviceType && String(serviceType).trim()) {
      const cleanType = String(serviceType).trim().toUpperCase();
      if (!VALID_SERVICE_TYPES.includes(cleanType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid serviceType '${serviceType}'. Allowed: ${VALID_SERVICE_TYPES.join(", ")}`,
        });
      }
      where.serviceType = cleanType;
    }

    // 2. Booking Status Filter
    if (bookingStatus && String(bookingStatus).trim()) {
      where.bookingStatus = String(bookingStatus).trim();
    }

    // 3. Payment Status Filter
    if (paymentStatus && String(paymentStatus).trim()) {
      where.paymentStatus = String(paymentStatus).trim();
    }

    // 4. Date Range Filters (bookingDate)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (startDate && endDate) {
      if (!datePattern.test(startDate) || !datePattern.test(endDate)) {
        return res.status(400).json({
          success: false,
          message: "Dates must be in YYYY-MM-DD format.",
        });
      }
      where.bookingDate = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      if (!datePattern.test(startDate)) {
        return res.status(400).json({
          success: false,
          message: "startDate must be in YYYY-MM-DD format.",
        });
      }
      where.bookingDate = { [Op.gte]: startDate };
    } else if (endDate) {
      if (!datePattern.test(endDate)) {
        return res.status(400).json({
          success: false,
          message: "endDate must be in YYYY-MM-DD format.",
        });
      }
      where.bookingDate = { [Op.lte]: endDate };
    }

    // 5. Search Filter (Reference, Service Name, Devotee Details)
    if (search && typeof search === "string" && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      where[Op.or] = [
        { bookingReference: { [Op.iLike]: term } },
        { serviceName: { [Op.iLike]: term } },
        { serviceSlug: { [Op.iLike]: term } },
        sequelize.where(
          sequelize.cast(sequelize.col("RitualBooking.yajman_details"), "text"),
          { [Op.iLike]: term }
        ),
      ];
    }

    // 6. Sorting
    let order = [["created_at", "DESC"]];
    if (sortBy === "createdAt-asc") {
      order = [["created_at", "ASC"]];
    } else if (sortBy === "date-desc") {
      order = [["booking_date", "DESC"], ["booking_time", "DESC"]];
    } else if (sortBy === "date-asc") {
      order = [["booking_date", "ASC"], ["booking_time", "ASC"]];
    } else if (sortBy === "amount-desc") {
      order = [["total_amount", "DESC"]];
    } else if (sortBy === "amount-asc") {
      order = [["total_amount", "ASC"]];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const offset = (pageNum - 1) * limitNum;

    const { count, rows: bookings } = await RitualBooking.findAndCountAll({
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
      data: bookings.map(serializeAdminRitualBooking),
    });
  } catch (error) {
    console.error("Get all ritual bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load ritual bookings catalogue.",
    });
  }
};

/**
 * GET /api/admin/ritual-bookings/:id
 * Retrieve administrative details for a specific ritual booking by UUID or bookingReference.
 */
export const getAdminRitualBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !String(id).trim()) {
      return res.status(400).json({
        success: false,
        message: "Booking ID or reference is required.",
      });
    }

    const cleanId = String(id).trim();

    let booking = null;
    if (UUID_REGEX.test(cleanId)) {
      booking = await RitualBooking.findByPk(cleanId, {
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
      booking = await RitualBooking.findOne({
        where: { bookingReference: cleanId.toUpperCase() },
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
        message: `Ritual booking '${cleanId}' was not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeAdminRitualBooking(booking),
    });
  } catch (error) {
    console.error("Get admin ritual booking by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load ritual booking details.",
    });
  }
};

/**
 * PATCH /api/admin/ritual-bookings/:id/status
 * Update ritual booking status with strict state-machine validation.
 *
 * Rules:
 * - Payment status CANNOT be altered through this endpoint.
 * - An unpaid booking (paymentStatus !== "Paid") CANNOT be transitioned to "Confirmed".
 * - Completed or Cancelled bookings cannot have their status altered.
 */
export const updateRitualBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingStatus, notes } = req.body || {};

    if (!bookingStatus || typeof bookingStatus !== "string" || !bookingStatus.trim()) {
      return res.status(400).json({
        success: false,
        message: "bookingStatus is required.",
      });
    }

    const targetStatus = bookingStatus.trim();
    if (!VALID_BOOKING_STATUSES.includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid bookingStatus '${targetStatus}'. Allowed: ${VALID_BOOKING_STATUSES.join(", ")}`,
      });
    }

    const cleanId = String(id).trim();
    let booking = null;
    if (UUID_REGEX.test(cleanId)) {
      booking = await RitualBooking.findByPk(cleanId);
    }
    if (!booking) {
      booking = await RitualBooking.findOne({
        where: { bookingReference: cleanId.toUpperCase() },
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Ritual booking '${cleanId}' was not found.`,
      });
    }

    const currentStatus = booking.bookingStatus;

    // Idempotent check
    if (currentStatus === targetStatus) {
      if (notes !== undefined && String(notes).trim() !== (booking.notes || "")) {
        await booking.update({ notes: String(notes).trim() });
      }
      return res.status(200).json({
        success: true,
        message: `Booking is already '${targetStatus}'.`,
        data: serializeAdminRitualBooking(booking),
      });
    }

    // Terminal State Guards
    if (currentStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled bookings cannot be modified or reopened.",
      });
    }

    if (currentStatus === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Completed ceremonies cannot have their status altered.",
      });
    }

    // Transition: Pending -> Confirmed
    if (currentStatus === "Pending" && targetStatus === "Confirmed") {
      if (booking.paymentStatus !== "Paid") {
        return res.status(400).json({
          success: false,
          message: "Cannot mark booking as Confirmed without a verified payment.",
        });
      }
    }

    // Transition: Confirmed -> Pending (Forbidden)
    if (currentStatus === "Confirmed" && targetStatus === "Pending") {
      return res.status(400).json({
        success: false,
        message: "Confirmed bookings cannot be reverted to Pending.",
      });
    }

    // Transition: Pending -> Completed (Forbidden without being confirmed)
    if (currentStatus === "Pending" && targetStatus === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot complete an unconfirmed ceremony. Confirm after payment first.",
      });
    }

    // Prepare updates
    const updates = { bookingStatus: targetStatus };

    if (notes !== undefined) {
      updates.notes = String(notes || "").trim();
    } else {
      const prevNotes = booking.notes ? `${booking.notes}\n` : "";
      updates.notes = `${prevNotes}[ADMIN ACTION] Status updated from '${currentStatus}' to '${targetStatus}' on ${new Date().toISOString()}.`;
    }

    await booking.update(updates);

    return res.status(200).json({
      success: true,
      message: `Booking status updated to '${targetStatus}'.`,
      data: serializeAdminRitualBooking(booking),
    });
  } catch (error) {
    console.error("Update ritual booking status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update ritual booking status.",
    });
  }
};
