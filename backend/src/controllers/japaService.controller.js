import { Op } from "sequelize";
import { JapaService, JapaPurpose } from "../models/index.js";
import {
  serializePublicJapaServiceListing,
  serializePublicJapaServiceDetail,
  serializePublicJapaPurpose,
} from "../serializers/japaService.serializer.js";

const VALID_MODES = ["kashi", "remote", "all"];
const VALID_SORTS = ["featured", "price-asc", "price-desc", "name-asc"];

/**
 * GET /api/japa-services
 * Public catalogue listing with filtering, search, sorting, and pagination
 */
export const getPublicJapaServices = async (req, res) => {
  try {
    const {
      search,
      purpose,
      count: requestedCount,
      mode,
      isFeatured,
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

    // Japa Count filter validation (PostgreSQL JSONB containment e.g. [11000])
    if (typeof requestedCount !== "undefined" && requestedCount !== "" && requestedCount !== "All") {
      const countNum = parseInt(String(requestedCount).trim(), 10);
      if (isNaN(countNum) || countNum <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid count parameter. Must be a positive integer.",
        });
      }

      where.availableCounts = {
        [Op.contains]: [countNum],
      };
    }

    // Mode filter validation (kashi or remote)
    if (typeof mode !== "undefined" && mode !== "" && mode !== "All") {
      const trimmedMode = String(mode).trim().toLowerCase();
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
    if (typeof isFeatured !== "undefined" && isFeatured !== "") {
      const trimmedFeatured = String(isFeatured).trim().toLowerCase();
      if (trimmedFeatured !== "true" && trimmedFeatured !== "false") {
        return res.status(400).json({
          success: false,
          message: "Invalid isFeatured parameter. Must be true or false.",
        });
      }
      where.isFeatured = trimmedFeatured === "true";
    }

    // Search filter (case-insensitive across name, mantra, purpose_summary, short_description, description)
    if (search && String(search).trim()) {
      const searchTerm = `%${String(search).trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchTerm } },
        { mantra: { [Op.iLike]: searchTerm } },
        { purposeSummary: { [Op.iLike]: searchTerm } },
        { shortDescription: { [Op.iLike]: searchTerm } },
        { description: { [Op.iLike]: searchTerm } },
      ];
    }

    // Purpose filter
    const purposeInclude = {
      model: JapaPurpose,
      as: "purposeDetails",
      where: { isActive: true },
      required: false,
    };

    if (purpose && String(purpose).trim() && purpose !== "All" && purpose !== "All Purposes") {
      const targetPurpose = String(purpose).trim().toLowerCase();
      // Match by slug on association, or purpose_category field, or in purpose_categories array
      where[Op.and] = where[Op.and] || [];
      where[Op.and].push({
        [Op.or]: [
          { purposeCategory: targetPurpose },
          { purposeCategories: { [Op.contains]: [targetPurpose] } },
          { '$purposeDetails.slug$': targetPurpose },
        ],
      });
      purposeInclude.required = false;
    }

    // 3. Sorting Whitelist Validation & Construction
    const trimmedSort = String(sortBy).trim().toLowerCase();
    if (!VALID_SORTS.includes(trimmedSort)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sortBy parameter. Must be one of: featured, price-asc, price-desc, name-asc.",
      });
    }

    let order = [];
    switch (trimmedSort) {
      case "featured":
        order = [
          ["isFeatured", "DESC"],
          ["startingPrice", "ASC"],
          ["name", "ASC"],
        ];
        break;
      case "price-asc":
        order = [
          ["startingPrice", "ASC"],
          ["name", "ASC"],
        ];
        break;
      case "price-desc":
        order = [
          ["startingPrice", "DESC"],
          ["name", "ASC"],
        ];
        break;
      case "name-asc":
        order = [["name", "ASC"]];
        break;
    }

    // 4. Execute Query with Count
    const offset = (pageNum - 1) * limitNum;
    const { count, rows } = await JapaService.findAndCountAll({
      where,
      include: [purposeInclude],
      order,
      limit: limitNum,
      offset,
      distinct: true,
    });

    const serializedData = rows.map(serializePublicJapaServiceListing);
    const totalPages = Math.ceil(count / limitNum) || 1;

    return res.status(200).json({
      success: true,
      count: serializedData.length,
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: serializedData,
    });
  } catch (error) {
    console.error("Public get japa services error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load japa services",
    });
  }
};

/**
 * GET /api/japa-services/:slug
 * Public detail view for a specific Japa service by slug
 */
export const getPublicJapaServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || !String(slug).trim()) {
      return res.status(404).json({
        success: false,
        message: "Japa service not found",
      });
    }

    const service = await JapaService.findOne({
      where: {
        slug: String(slug).trim().toLowerCase(),
        isActive: true,
      },
      include: [
        {
          model: JapaPurpose,
          as: "purposeDetails",
          where: { isActive: true },
          required: false,
        },
      ],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Japa service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializePublicJapaServiceDetail(service),
    });
  } catch (error) {
    console.error("Public get japa service by slug error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load japa service details",
    });
  }
};

/**
 * GET /api/japa-services/purposes
 * Public list of active Japa purpose categories
 */
export const getPublicJapaPurposes = async (req, res) => {
  try {
    const purposes = await JapaPurpose.findAll({
      where: {
        isActive: true,
      },
      order: [["displayOrder", "ASC"]],
    });

    const serialized = purposes.map(serializePublicJapaPurpose);

    return res.status(200).json({
      success: true,
      count: serialized.length,
      data: serialized,
    });
  } catch (error) {
    console.error("Public get japa purposes error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load japa purposes",
    });
  }
};
