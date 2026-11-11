import { Op } from "sequelize";
import { PujaBooking, UpcomingPuja, PujaPackage, User } from "../models/index.js";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_BOOKING_STATUSES = ["Pending", "Confirmed", "Cancelled", "Completed"];

/**
 * Normalizes a Community Puja Booking for administrative listing/details.
 */
export const serializeAdminCommunityPujaBooking = (booking) => {
  const puja = booking.puja || {};
  const pkg = booking.package || {};

  return {
    id: booking.id,
    bookingReference: booking.bookingReference,
    pujaId: booking.pujaId,
    puja: {
      id: puja.id,
      name: puja.name || "Upcoming Community Puja",
      slug: puja.slug || null,
      ceremonyDate: puja.ceremonyDate || null,
      startDateTime: puja.startDateTime || null,
      location: puja.location || null,
      temple: puja.temple || null,
      deity: puja.deity || null,
      bannerImage: puja.bannerImage || null,
    },
    packageId: booking.packageId,
    package: {
      id: pkg.id,
      name: pkg.name || "Default Package",
      price: Number(pkg.price || booking.amount || 0),
      maxDevotees: Number(pkg.maxDevotees || 1),
      description: pkg.description || null,
      features: Array.isArray(pkg.features) ? pkg.features : [],
    },
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
      name: booking.primaryDevoteeName || "",
      phone: booking.primaryPhone || "",
      email: booking.primaryEmail || null,
    },
    devotees: Array.isArray(booking.devotees) ? booking.devotees : [],
    devoteeCount: Array.isArray(booking.devotees) ? booking.devotees.length : 1,
    sankalpPurpose: booking.sankalpPurpose || null,
    shippingAddress: booking.shippingAddress || {},
    amount: Number(booking.amount || pkg.price || 0),
    currency: "INR",
    bookingStatus: booking.bookingStatus || "Confirmed",
    paymentStatus: booking.paymentStatus || "Pending",
    paymentGateway: "Not Integrated",
    prasadStatus: booking.prasadStatus || "Pending",
    prasadTrackingNumber: booking.prasadTrackingNumber || null,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
};

/**
 * GET /api/admin/community-puja-bookings
 * Filterable, paginated list of all community puja registrations.
 */
export const getAllCommunityPujaBookings = async (req, res) => {
  try {
    const {
      search,
      pujaId,
      packageId,
      bookingStatus,
      paymentStatus,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sortBy = "createdAt-desc",
    } = req.query;

    const where = {};
    const pujaWhere = {};

    // 1. Puja Filter
    if (pujaId && String(pujaId).trim()) {
      const cleanPujaId = String(pujaId).trim();
      if (UUID_REGEX.test(cleanPujaId)) {
        where.pujaId = cleanPujaId;
      } else {
        pujaWhere.slug = cleanPujaId.toLowerCase();
      }
    }

    // 2. Package Filter
    if (packageId && String(packageId).trim()) {
      where.packageId = String(packageId).trim();
    }

    // 3. Status Filters
    if (bookingStatus && String(bookingStatus).trim()) {
      where.bookingStatus = String(bookingStatus).trim();
    }
    if (paymentStatus && String(paymentStatus).trim()) {
      where.paymentStatus = String(paymentStatus).trim();
    }

    // 4. Date Range Filters (on created_at or associated puja ceremony_date)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (startDate && endDate) {
      if (datePattern.test(startDate) && datePattern.test(endDate)) {
        where.createdAt = {
          [Op.between]: [new Date(`${startDate}T00:00:00.000Z`), new Date(`${endDate}T23:59:59.999Z`)],
        };
      }
    } else if (startDate && datePattern.test(startDate)) {
      where.createdAt = { [Op.gte]: new Date(`${startDate}T00:00:00.000Z`) };
    } else if (endDate && datePattern.test(endDate)) {
      where.createdAt = { [Op.lte]: new Date(`${endDate}T23:59:59.999Z`) };
    }

    // 5. Search Filter (Reference, Devotee Name, Phone, Email)
    if (search && typeof search === "string" && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      where[Op.or] = [
        { bookingReference: { [Op.iLike]: term } },
        { primaryDevoteeName: { [Op.iLike]: term } },
        { primaryPhone: { [Op.iLike]: term } },
        { primaryEmail: { [Op.iLike]: term } },
      ];
    }

    // 6. Sorting
    let order = [["createdAt", "DESC"]];
    if (sortBy === "createdAt-asc") {
      order = [["createdAt", "ASC"]];
    } else if (sortBy === "amount-desc") {
      order = [["amount", "DESC"]];
    } else if (sortBy === "amount-asc") {
      order = [["amount", "ASC"]];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const offset = (pageNum - 1) * limitNum;

    const { count, rows: bookings } = await PujaBooking.findAndCountAll({
      where,
      order,
      limit: limitNum,
      offset,
      include: [
        {
          model: UpcomingPuja,
          as: "puja",
          where: Object.keys(pujaWhere).length > 0 ? pujaWhere : undefined,
          attributes: ["id", "name", "slug", "ceremonyDate", "startDateTime", "location", "temple", "deity"],
        },
        {
          model: PujaPackage,
          as: "package",
          attributes: ["id", "name", "price", "maxDevotees", "description"],
        },
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
      data: bookings.map(serializeAdminCommunityPujaBooking),
    });
  } catch (error) {
    console.error("Get all community puja bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load community puja bookings catalogue.",
    });
  }
};

/**
 * GET /api/admin/community-puja-bookings/:id
 * Retrieve details for a specific community puja registration by UUID or bookingReference.
 */
export const getAdminCommunityPujaBookingById = async (req, res) => {
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
      booking = await PujaBooking.findByPk(cleanId, {
        include: [
          {
            model: UpcomingPuja,
            as: "puja",
          },
          {
            model: PujaPackage,
            as: "package",
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "fullName", "email", "phone"],
          },
        ],
      });
    }

    if (!booking) {
      booking = await PujaBooking.findOne({
        where: { bookingReference: cleanId.toUpperCase() },
        include: [
          {
            model: UpcomingPuja,
            as: "puja",
          },
          {
            model: PujaPackage,
            as: "package",
          },
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
        message: `Community puja booking '${cleanId}' was not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeAdminCommunityPujaBooking(booking),
    });
  } catch (error) {
    console.error("Get admin community puja booking by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load community puja booking details.",
    });
  }
};

