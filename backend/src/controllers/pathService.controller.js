import { Op } from "sequelize";
import { PathService, PathPurpose } from "../models/index.js";
import {
  serializePublicPathServiceListing,
  serializePublicPathServiceDetail,
  serializePublicPathPurpose,
} from "../serializers/pathService.serializer.js";

const VALID_MODES = ["kashi", "remote", "all"];
const VALID_SORTS = [
  "featured",
  "price-asc",
  "price-desc",
  "name-asc",
  "name-desc",
  "newest",
  "oldest",
];

/**
 * GET /api/path-services
 * Public catalogue listing with filtering, search, sorting, and pagination
 */
export const getPathServices = async (req, res) => {
  try {
    const {
      search,
      purpose,
      format,
      duration,
      days,
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

    // 2. Base Query Construction
    const where = {
      isActive: true,
    };

    // Format filter (containment in JSONB availableFormats array)
    if (typeof format !== "undefined" && format !== "" && format !== "all" && format !== "All") {
      const cleanFormat = String(format).trim();
      where.availableFormats = {
        [Op.contains]: [cleanFormat],
      };
    }

    // Days / Duration filter
    if (typeof days !== "undefined" && days !== "" && days !== "all" && days !== "All") {
      const daysNum = parseInt(String(days).trim(), 10);
      if (isNaN(daysNum) || daysNum <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid days parameter. Must be a positive integer.",
        });
      }

      where[Op.and] = [
        ...(where[Op.and] || []),
        { minimumDays: { [Op.lte]: daysNum } },
        { maximumDays: { [Op.gte]: daysNum } },
      ];
    } else if (duration && String(duration).trim() && String(duration).trim().toLowerCase() !== "all") {
      const cleanDuration = `%${String(duration).trim()}%`;
      // Search in chapterStructure or dailyHours or scripture
      where[Op.or] = [
        ...(where[Op.or] || []),
        { dailyHours: { [Op.iLike]: cleanDuration } },
        { chapterStructure: { [Op.iLike]: cleanDuration } },
      ];
    }

    // Mode / Location filter
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

    // Featured filter
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

    // Search filter across name, scripture, pathType, shortDescription, description, purposeSummary
    if (search && String(search).trim()) {
      const searchTerm = `%${String(search).trim()}%`;
      const searchConditions = [
        { name: { [Op.iLike]: searchTerm } },
        { slug: { [Op.iLike]: searchTerm } },
        { scripture: { [Op.iLike]: searchTerm } },
        { pathType: { [Op.iLike]: searchTerm } },
        { purposeSummary: { [Op.iLike]: searchTerm } },
        { shortDescription: { [Op.iLike]: searchTerm } },
        { description: { [Op.iLike]: searchTerm } },
      ];

      if (where[Op.or]) {
        where[Op.and] = [...(where[Op.and] || []), { [Op.or]: searchConditions }];
      } else {
        where[Op.or] = searchConditions;
      }
    }

    // Purpose filter
    if (purpose && String(purpose).trim() && String(purpose).trim().toLowerCase() !== "all") {
      const cleanPurpose = String(purpose).trim().toLowerCase();

      const matchedPurpose = await PathPurpose.findOne({
        where: { slug: cleanPurpose, isActive: true },
      });

      const purposeConditions = [
        { purposeCategory: cleanPurpose },
        { purposeCategories: { [Op.contains]: [cleanPurpose] } },
      ];

      if (matchedPurpose) {
        purposeConditions.push({ purposeId: matchedPurpose.id });
      }

      if (where[Op.or]) {
        where[Op.and] = [...(where[Op.and] || []), { [Op.or]: purposeConditions }];
      } else {
        where[Op.or] = purposeConditions;
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
      case "newest":
        order = [["createdAt", "DESC"]];
        break;
      case "oldest":
        order = [["createdAt", "ASC"]];
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

    // 4. Execution
    const offset = (pageNum - 1) * limitNum;
    const { count: total, rows: services } = await PathService.findAndCountAll({
      where,
      order,
      limit: limitNum,
      offset,
      include: [
        {
          model: PathPurpose,
          as: "purposeDetails",
          attributes: ["id", "name", "slug", "description", "iconName", "displayOrder", "isActive"],
        },
      ],
      distinct: true,
    });

    const totalPages = Math.ceil(total / limitNum) || 1;
    const serialized = services.map(serializePublicPathServiceListing);

    return res.status(200).json({
      success: true,
      count: serialized.length,
      total,
      items: serialized,
      data: serialized,
      page: pageNum,
      currentPage: pageNum,
      limit: limitNum,
      totalPages,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error in getPathServices:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching Path service catalogue",
    });
  }
};

/**
 * GET /api/path-services/purposes
 * Returns all active Path purposes ordered by displayOrder
 */
export const getPathPurposes = async (req, res) => {
  try {
    const purposes = await PathPurpose.findAll({
      where: { isActive: true },
      order: [
        ["displayOrder", "ASC"],
        ["name", "ASC"],
      ],
    });

    return res.status(200).json({
      success: true,
      count: purposes.length,
      items: purposes.map(serializePublicPathPurpose),
      data: purposes.map(serializePublicPathPurpose),
    });
  } catch (error) {
    console.error("Error in getPathPurposes:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching Path purposes",
    });
  }
};

/**
 * GET /api/path-services/:slug
 * Returns detail of a single active Path service by its slug
 */
export const getPathServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || !String(slug).trim()) {
      return res.status(404).json({
        success: false,
        message: "Path service slug is required",
      });
    }

    const cleanSlug = String(slug).trim().toLowerCase();

    const service = await PathService.findOne({
      where: {
        slug: cleanSlug,
        isActive: true,
      },
      include: [
        {
          model: PathPurpose,
          as: "purposeDetails",
          attributes: ["id", "name", "slug", "description", "iconName", "displayOrder", "isActive"],
        },
      ],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Path service not found: '${cleanSlug}'`,
      });
    }

    const serialized = serializePublicPathServiceDetail(service);

    return res.status(200).json({
      success: true,
      data: serialized,
      item: serialized,
    });
  } catch (error) {
    console.error(`Error in getPathServiceBySlug (${req.params?.slug}):`, error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching Path service details",
    });
  }
};

export default {
  getPathServices,
  getPathPurposes,
  getPathServiceBySlug,
};
