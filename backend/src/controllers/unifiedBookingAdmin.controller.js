import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

const VALID_SOURCE_TYPES = ["RITUAL", "COMMUNITY_PUJA", "CONSULTATION"];
const VALID_SERVICE_CATEGORIES = [
  "PUJA",
  "YAGYA",
  "HOMA",
  "JAPA",
  "PATH",
  "COMMUNITY_PUJA",
  "CONSULTATION",
];

/**
 * GET /api/admin/bookings/all
 * Normalized aggregation endpoint returning bookings across all three models:
 * 1. RitualBooking (Puja, Yagya, Homa, Japa, Path)
 * 2. PujaBooking (Upcoming Community Puja)
 * 3. Booking (Astrologer Consultations)
 */
export const getUnifiedBookings = async (req, res) => {
  try {
    const {
      sourceType,
      serviceCategory,
      bookingStatus,
      paymentStatus,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sortBy = "createdAt-desc",
    } = req.query;

    const replacements = {};

    // Validate sourceType if provided
    let cleanSourceType = null;
    if (sourceType && String(sourceType).trim()) {
      cleanSourceType = String(sourceType).trim().toUpperCase();
      if (cleanSourceType !== "ALL" && !VALID_SOURCE_TYPES.includes(cleanSourceType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid sourceType '${sourceType}'. Allowed: ALL, ${VALID_SOURCE_TYPES.join(", ")}`,
        });
      }
    }

    // Validate serviceCategory if provided
    let cleanCategory = null;
    if (serviceCategory && String(serviceCategory).trim()) {
      cleanCategory = String(serviceCategory).trim().toUpperCase();
      if (!VALID_SERVICE_CATEGORIES.includes(cleanCategory)) {
        return res.status(400).json({
          success: false,
          message: `Invalid serviceCategory '${serviceCategory}'. Allowed: ${VALID_SERVICE_CATEGORIES.join(", ")}`,
        });
      }
    }

    // Determine which sources are in scope based on sourceType and serviceCategory
    const includeRitual =
      (!cleanSourceType || cleanSourceType === "ALL" || cleanSourceType === "RITUAL") &&
      (!cleanCategory || ["PUJA", "YAGYA", "HOMA", "JAPA", "PATH"].includes(cleanCategory));

    const includeCommunityPuja =
      (!cleanSourceType || cleanSourceType === "ALL" || cleanSourceType === "COMMUNITY_PUJA") &&
      (!cleanCategory || cleanCategory === "COMMUNITY_PUJA");

    const includeConsultation =
      (!cleanSourceType || cleanSourceType === "ALL" || cleanSourceType === "CONSULTATION") &&
      (!cleanCategory || cleanCategory === "CONSULTATION");

    if (!includeRitual && !includeCommunityPuja && !includeConsultation) {
      return res.status(200).json({
        success: true,
        count: 0,
        total: 0,
        totalPages: 0,
        page: parseInt(page, 10) || 1,
        data: [],
      });
    }

    // Construct common where conditions with replacements
    const subqueries = [];

    // Common filter parameters
    if (bookingStatus && String(bookingStatus).trim()) {
      replacements.bookingStatus = String(bookingStatus).trim();
    }
    if (paymentStatus && String(paymentStatus).trim()) {
      replacements.paymentStatus = String(paymentStatus).trim();
    }
    if (search && String(search).trim()) {
      replacements.searchPattern = `%${String(search).trim().toLowerCase()}%`;
    }
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (startDate && datePattern.test(startDate)) {
      replacements.startDate = startDate;
    }
    if (endDate && datePattern.test(endDate)) {
      replacements.endDate = endDate;
    }

    // 1. RITUAL BOOKINGS SUBQUERY
    if (includeRitual) {
      const ritualWheres = [];
      if (cleanCategory && ["PUJA", "YAGYA", "HOMA", "JAPA", "PATH"].includes(cleanCategory)) {
        ritualWheres.push(`service_type = :cleanCategory`);
        replacements.cleanCategory = cleanCategory;
      }
      if (replacements.bookingStatus) {
        ritualWheres.push(`booking_status = :bookingStatus`);
      }
      if (replacements.paymentStatus) {
        ritualWheres.push(`payment_status = :paymentStatus`);
      }
      if (replacements.startDate) {
        ritualWheres.push(`booking_date >= :startDate`);
      }
      if (replacements.endDate) {
        ritualWheres.push(`booking_date <= :endDate`);
      }
      if (replacements.searchPattern) {
        ritualWheres.push(`(
          LOWER(booking_reference) LIKE :searchPattern OR
          LOWER(service_name) LIKE :searchPattern OR
          LOWER(COALESCE(yajman_details->>'name', '')) LIKE :searchPattern OR
          LOWER(COALESCE(yajman_details->>'phone', yajman_details->>'mobile', '')) LIKE :searchPattern OR
          LOWER(COALESCE(yajman_details->>'email', '')) LIKE :searchPattern
        )`);
      }

      const ritualWhereClause = ritualWheres.length > 0 ? `WHERE ${ritualWheres.join(" AND ")}` : "";

      subqueries.push(`
        SELECT 
          'RITUAL' as "sourceType",
          id::text as "recordId",
          booking_reference as "bookingReference",
          COALESCE(yajman_details->>'name', '') as "customerName",
          COALESCE(yajman_details->>'phone', yajman_details->>'mobile', '') as "customerPhone",
          (yajman_details->>'email') as "customerEmail",
          service_name as "serviceName",
          service_type as "serviceCategory",
          booking_date::text as "bookingDate",
          booking_time as "bookingTime",
          total_amount::numeric(10,2) as "amount",
          currency,
          booking_status as "bookingStatus",
          payment_status as "paymentStatus",
          payment_gateway as "paymentGateway",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM ritual_bookings
        ${ritualWhereClause}
      `);
    }

    // 2. COMMUNITY PUJA BOOKINGS SUBQUERY
    if (includeCommunityPuja) {
      const pujaWheres = [];
      if (replacements.bookingStatus) {
        pujaWheres.push(`pb.booking_status = :bookingStatus`);
      }
      if (replacements.paymentStatus) {
        pujaWheres.push(`pb.payment_status = :paymentStatus`);
      }
      if (replacements.startDate) {
        pujaWheres.push(`COALESCE(up.ceremony_date, pb."createdAt"::date) >= :startDate::date`);
      }
      if (replacements.endDate) {
        pujaWheres.push(`COALESCE(up.ceremony_date, pb."createdAt"::date) <= :endDate::date`);
      }
      if (replacements.searchPattern) {
        pujaWheres.push(`(
          LOWER(pb.booking_reference) LIKE :searchPattern OR
          LOWER(COALESCE(up.name, '')) LIKE :searchPattern OR
          LOWER(COALESCE(pb.primary_devotee_name, '')) LIKE :searchPattern OR
          LOWER(COALESCE(pb.primary_phone, '')) LIKE :searchPattern OR
          LOWER(COALESCE(pb.primary_email, '')) LIKE :searchPattern
        )`);
      }

      const pujaWhereClause = pujaWheres.length > 0 ? `WHERE ${pujaWheres.join(" AND ")}` : "";

      subqueries.push(`
        SELECT
          'COMMUNITY_PUJA' as "sourceType",
          pb.id::text as "recordId",
          pb.booking_reference as "bookingReference",
          COALESCE(pb.primary_devotee_name, '') as "customerName",
          COALESCE(pb.primary_phone, '') as "customerPhone",
          pb.primary_email as "customerEmail",
          COALESCE(up.name, 'Upcoming Community Puja') as "serviceName",
          'COMMUNITY_PUJA' as "serviceCategory",
          COALESCE(up.ceremony_date::text, pb."createdAt"::date::text) as "bookingDate",
          null as "bookingTime",
          pb.amount::numeric(10,2) as "amount",
          'INR' as currency,
          pb.booking_status as "bookingStatus",
          pb.payment_status as "paymentStatus",
          'Not Integrated' as "paymentGateway",
          pb."createdAt" as "createdAt",
          pb."updatedAt" as "updatedAt"
        FROM puja_bookings pb
        LEFT JOIN upcoming_pujas up ON pb.puja_id = up.id
        ${pujaWhereClause}
      `);
    }

    // 3. CONSULTATION BOOKINGS SUBQUERY
    if (includeConsultation) {
      const astroWheres = [];
      if (replacements.bookingStatus) {
        astroWheres.push(`b."bookingStatus" = :bookingStatus`);
      }
      if (replacements.paymentStatus) {
        astroWheres.push(`b."paymentStatus" = :paymentStatus`);
      }
      if (replacements.startDate) {
        astroWheres.push(`b."consultationDate" >= :startDate`);
      }
      if (replacements.endDate) {
        astroWheres.push(`b."consultationDate" <= :endDate`);
      }
      if (replacements.searchPattern) {
        astroWheres.push(`(
          LOWER(b."bookingReference") LIKE :searchPattern OR
          LOWER(CONCAT(b."astrologerName", ' - ', b."packageName")) LIKE :searchPattern OR
          LOWER(COALESCE(b."fullName", '')) LIKE :searchPattern OR
          LOWER(COALESCE(b.phone, '')) LIKE :searchPattern OR
          LOWER(COALESCE(b.email, '')) LIKE :searchPattern
        )`);
      }

      const astroWhereClause = astroWheres.length > 0 ? `WHERE ${astroWheres.join(" AND ")}` : "";

      subqueries.push(`
        SELECT
          'CONSULTATION' as "sourceType",
          b.id::text as "recordId",
          b."bookingReference" as "bookingReference",
          COALESCE(b."fullName", '') as "customerName",
          COALESCE(b.phone, '') as "customerPhone",
          b.email as "customerEmail",
          CONCAT(b."astrologerName", ' - ', b."packageName") as "serviceName",
          'CONSULTATION' as "serviceCategory",
          b."consultationDate"::text as "bookingDate",
          b."consultationTime" as "bookingTime",
          b.amount::numeric(10,2) as "amount",
          'INR' as currency,
          b."bookingStatus" as "bookingStatus",
          b."paymentStatus" as "paymentStatus",
          COALESCE(b."paymentMethod", 'Cashfree') as "paymentGateway",
          b."createdAt" as "createdAt",
          b."updatedAt" as "updatedAt"
        FROM bookings b
        ${astroWhereClause}
      `);
    }

    const unifiedSql = subqueries.join(" UNION ALL ");

    // Sorting definition
    let orderBySql = 'ORDER BY "createdAt" DESC';
    if (sortBy === "createdAt-asc") {
      orderBySql = 'ORDER BY "createdAt" ASC';
    } else if (sortBy === "amount-desc") {
      orderBySql = 'ORDER BY "amount" DESC';
    } else if (sortBy === "amount-asc") {
      orderBySql = 'ORDER BY "amount" ASC';
    } else if (sortBy === "date-desc") {
      orderBySql = 'ORDER BY "bookingDate" DESC, "createdAt" DESC';
    } else if (sortBy === "date-asc") {
      orderBySql = 'ORDER BY "bookingDate" ASC, "createdAt" ASC';
    }

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const offset = (pageNum - 1) * limitNum;

    replacements.limit = limitNum;
    replacements.offset = offset;

    // Count Query
    const countQuery = `SELECT COUNT(*) as total FROM (${unifiedSql}) as unified_count`;
    const [countRows] = await sequelize.query(countQuery, {
      replacements,
      type: QueryTypes.SELECT,
    });
    const total = parseInt(countRows?.total || 0, 10);

    // Data Query
    const dataQuery = `
      SELECT * FROM (${unifiedSql}) as unified_records
      ${orderBySql}
      LIMIT :limit OFFSET :offset
    `;
    const rows = await sequelize.query(dataQuery, {
      replacements,
      type: QueryTypes.SELECT,
    });

    const normalizedRows = rows.map((r) => ({
      sourceType: r.sourceType,
      recordId: r.recordId,
      bookingReference: r.bookingReference,
      customerName: r.customerName,
      customerPhone: r.customerPhone,
      customerEmail: r.customerEmail,
      serviceName: r.serviceName,
      serviceCategory: r.serviceCategory,
      bookingDate: r.bookingDate,
      bookingTime: r.bookingTime,
      amount: Number(r.amount),
      currency: r.currency || "INR",
      bookingStatus: r.bookingStatus,
      paymentStatus: r.paymentStatus,
      paymentGateway: r.paymentGateway,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      count: normalizedRows.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      page: pageNum,
      data: normalizedRows,
    });
  } catch (error) {
    console.error("Get unified bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load unified bookings catalogue.",
    });
  }
};

