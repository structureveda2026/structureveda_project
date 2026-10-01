import { Op } from "sequelize";
import { HomaService, HomaPurpose } from "../models/index.js";
import {
  serializePublicHomaServiceListing,
  serializePublicHomaServiceDetail,
  serializePublicHomaPurpose,
} from "../serializers/homaService.serializer.js";

const VALID_MODES = ["kashi", "remote", "all"];
const VALID_SORTS = ["featured", "price-asc", "price-desc", "name-asc", "name-desc"];

/**
 * GET /api/homa-services
 * Public catalogue listing with filtering, search, sorting, and pagination
 */
export const getPublicHomaServices = async (req, res) => {
  try {
    const {
      search,
      purpose,
      count: requestedCount,
      havanCount,
      days: requestedDays,
      mode,
      location,
      isFeatured,
      featured,
      sortBy = "featured",
      page = "1",
      limit = "20",
    } = req.query;

    // 1. Pagination Validation
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum <= 0 || String(pageNum) !== String(page).trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid page parameter. Must be a positive integer.",
      });
    }

    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum <= 0 || limitNum > 100 || String(limitNum) !== String(limit).trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid limit parameter. Must be an integer between 1 and 100.",
      });
    }

    // 2. Filter Validation & Query Construction
    const where = {
      isActive: true,
    };

    // Havan Count filter (containment in JSONB array)
    const rawCount = requestedCount !== undefined ? requestedCount : havanCount;
    if (typeof rawCount !== "undefined" && rawCount !== "" && rawCount !== "all" && rawCount !== "All") {
      const countNum = parseInt(String(rawCount).trim(), 10);
      if (isNaN(countNum) || countNum <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid count parameter. Must be a positive integer.",
        });
      }

      where.availableHavanCounts = {
        [Op.contains]: [countNum],
      };
    }

    // Days filter (containment in JSONB array)
    if (typeof requestedDays !== "undefined" && requestedDays !== "" && requestedDays !== "all" && requestedDays !== "All") {
      const daysNum = parseInt(String(requestedDays).trim(), 10);
      if (isNaN(daysNum) || daysNum <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid days parameter. Must be a positive integer.",
        });
      }

      where.availableDays = {
        [Op.contains]: [daysNum],
      };
    }

    // Mode / Location filter validation (kashi or remote)
    const rawMode = mode !== undefined ? mode : location;
    if (typeof rawMode !== "undefined" && rawMode !== "" && rawMode !== "all" && rawMode !== "All") {
      const trimmedMode = String(rawMode).trim().toLowerCase();
      if (!VALID_MODES.includes(trimmedMode)) {
        return res.status(400).json({
          success: false,
          message: "Invalid mode parameter. Must be one of: kashi, remote, all.",
        });
      }
      if (trimmedMode === "kashi") {
        where.isKashiAvailable = true;
      } else if (trimmedMode === "remote") {
        where.isRemoteAvailable = true;
      }
    }

    // Featured filter validation
    const rawFeatured = isFeatured !== undefined ? isFeatured : featured;
    if (typeof rawFeatured !== "undefined" && rawFeatured !== "" && rawFeatured !== "all") {
      const trimmedFeatured = String(rawFeatured).trim().toLowerCase();
      if (trimmedFeatured !== "true" && trimmedFeatured !== "false") {
        return res.status(400).json({
          success: false,
          message: "Invalid isFeatured parameter. Must be true or false.",
        });
      }
      where.isFeatured = trimmedFeatured === "true";
    }

    // Search filter (case-insensitive across name, homaType, purposeSummary, shortDescription, description)
    if (search && String(search).trim()) {
      const searchTerm = `%${String(search).trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchTerm } },
        { homaType: { [Op.iLike]: searchTerm } },
        { purposeSummary: { [Op.iLike]: searchTerm } },
        { shortDescription: { [Op.iLike]: searchTerm } },
        { description: { [Op.iLike]: searchTerm } },
      ];
    }

    // Purpose category filter
    if (purpose && String(purpose).trim() && String(purpose).trim().toLowerCase() !== "all") {
      const cleanPurpose = String(purpose).trim().toLowerCase();

      const matchedPurpose = await HomaPurpose.findOne({
        where: { slug: cleanPurpose, isActive: true },
      });

      if (matchedPurpose) {
        where[Op.or] = [
          ...(where[Op.or] ? [where[Op.or]] : []),
          { purposeId: matchedPurpose.id },
          { purposeCategory: cleanPurpose },
          { purposeCategories: { [Op.contains]: [cleanPurpose] } },
        ];
      } else {
        where[Op.or] = [
          ...(where[Op.or] ? [where[Op.or]] : []),
          { purposeCategory: cleanPurpose },
          { purposeCategories: { [Op.contains]: [cleanPurpose] } },
        ];
      }
    }

    // 3. Sorting Resolution
    if (!VALID_SORTS.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sortBy parameter: '${sortBy}'. Allowed: ${VALID_SORTS.join(", ")}`,
      });
    }

    let order = [];
    switch (sortBy) {
      case "price-asc":
        order = [["startingPrice", "ASC"], ["name", "ASC"]];
        break;
      case "price-desc":
        order = [["startingPrice", "DESC"], ["name", "ASC"]];
        break;
      case "name-asc":
        order = [["name", "ASC"]];
        break;
      case "name-desc":
        order = [["name", "DESC"]];
        break;
      case "featured":
      default:
        order = [
          ["isFeatured", "DESC"],
          ["startingPrice", "ASC"],
          ["name", "ASC"],
        ];
        break;
    }

    // 4. Database Query Execution
    const offset = (pageNum - 1) * limitNum;
    const { count: total, rows: services } = await HomaService.findAndCountAll({
      where,
      order,
      limit: limitNum,
      offset,
      include: [
        {
          model: HomaPurpose,
          as: "purposeDetails",
          attributes: ["id", "name", "slug", "description", "iconName"],
        },
      ],
      distinct: true,
    });

    const totalPages = Math.ceil(total / limitNum) || 1;
    const serialized = services.map(serializePublicHomaServiceListing);

    return res.status(200).json({
      success: true,
      count: serialized.length,
      total,
      totalPages,
      currentPage: pageNum,
      data: serialized,
    });
  } catch (error) {
    console.error("Error in getPublicHomaServices:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching Homa service catalogue",
    });
  }
};

/**
 * GET /api/homa-services/purposes
 * Returns all active Homa purposes ordered by displayOrder
 */
export const getPublicHomaPurposes = async (req, res) => {
  try {
    const purposes = await HomaPurpose.findAll({
      where: { isActive: true },
      order: [
        ["displayOrder", "ASC"],
        ["name", "ASC"],
      ],
    });

    return res.status(200).json({
      success: true,
      count: purposes.length,
      data: purposes.map(serializePublicHomaPurpose),
    });
  } catch (error) {
    console.error("Error in getPublicHomaPurposes:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching Homa purposes",
    });
  }
};

/**
 * GET /api/homa-services/:slug
 * Returns detail of a single active Homa service by its slug
 */
export const getPublicHomaServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || !String(slug).trim()) {
      return res.status(400).json({
        success: false,
        message: "Homa service slug is required",
      });
    }

    const cleanSlug = String(slug).trim().toLowerCase();

    const service = await HomaService.findOne({
      where: {
        slug: cleanSlug,
        isActive: true,
      },
      include: [
        {
          model: HomaPurpose,
          as: "purposeDetails",
          attributes: ["id", "name", "slug", "description", "iconName", "displayOrder", "isActive"],
        },
      ],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Homa service not found: '${cleanSlug}'`,
      });
    }

    return res.status(200).json({
      success: true,
      data: serializePublicHomaServiceDetail(service),
    });
  } catch (error) {
    console.error(`Error in getPublicHomaServiceBySlug (${req.params?.slug}):`, error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching Homa service details",
    });
  }
};

export default {
  getPublicHomaServices,
  getPublicHomaPurposes,
  getPublicHomaServiceBySlug,
};
