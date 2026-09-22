import { Op } from "sequelize";
import { PujaService, PujaPurpose } from "../models/index.js";
import {
  serializePublicPujaServiceListing,
  serializePublicPujaServiceDetail,
  serializePublicPujaPurpose,
} from "../serializers/pujaService.serializer.js";

const VALID_MODES = ["in_person", "remote", "hybrid"];
const VALID_SORTS = ["featured", "price-asc", "price-desc", "name-asc"];

/**
 * GET /api/puja-services
 * Public catalogue listing with filtering, search, sorting, and pagination
 */
export const getPublicPujaServices = async (req, res) => {
  try {
    const {
      search,
      purpose,
      duration,
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

    // Duration filter validation (PostgreSQL integer array containment)
    if (typeof duration !== "undefined" && duration !== "") {
      const trimmedDuration = String(duration).trim();
      const durationNum = parseInt(trimmedDuration, 10);
      if (isNaN(durationNum) || durationNum <= 0 || String(durationNum) !== trimmedDuration) {
        return res.status(400).json({
          success: false,
          message: "Invalid duration parameter. Must be a positive integer.",
        });
      }

      where.durationHours = {
        [Op.contains]: [durationNum],
      };
    }

    // Mode filter validation
    if (typeof mode !== "undefined" && mode !== "") {
      const trimmedMode = String(mode).trim().toLowerCase();
      if (!VALID_MODES.includes(trimmedMode)) {
        return res.status(400).json({
          success: false,
          message: "Invalid mode parameter. Must be one of: in_person, remote, hybrid.",
        });
      }
      where.availableMode = trimmedMode;
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

    // Search filter (case-insensitive across name, deity, purpose_summary, short_description)
    if (search && String(search).trim()) {
      const searchTerm = `%${String(search).trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchTerm } },
        { deity: { [Op.iLike]: searchTerm } },
        { purposeSummary: { [Op.iLike]: searchTerm } },
        { shortDescription: { [Op.iLike]: searchTerm } },
      ];
    }

    // Purpose filter (resolved via active PujaPurpose association)
    const purposeInclude = {
      model: PujaPurpose,
      as: "purposeDetails",
      where: { isActive: true },
      required: false,
    };

    if (purpose && String(purpose).trim()) {
      purposeInclude.where.slug = String(purpose).trim().toLowerCase();
      purposeInclude.required = true; // Inner join when filtering by purpose
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
    const { count, rows } = await PujaService.findAndCountAll({
      where,
      include: [purposeInclude],
      order,
      limit: limitNum,
      offset,
      distinct: true,
    });

    const serializedData = rows.map(serializePublicPujaServiceListing);
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
    console.error("Public get puja services error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load puja services",
    });
  }
};

/**
 * GET /api/puja-services/:slug
 * Public detail view for a specific ritual service by slug
 */
export const getPublicPujaServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || !String(slug).trim()) {
      return res.status(404).json({
        success: false,
        message: "Puja service not found",
      });
    }

    const service = await PujaService.findOne({
      where: {
        slug: String(slug).trim().toLowerCase(),
        isActive: true,
      },
      include: [
        {
          model: PujaPurpose,
          as: "purposeDetails",
          where: { isActive: true },
          required: false,
        },
      ],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Puja service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializePublicPujaServiceDetail(service),
    });
  } catch (error) {
    console.error("Public get puja service by slug error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load puja service details",
    });
  }
};

/**
 * GET /api/puja-services/purposes
 * Public list of active purpose categories
 */
export const getPublicPujaPurposes = async (req, res) => {
  try {
    const purposes = await PujaPurpose.findAll({
      where: {
        isActive: true,
      },
      order: [["displayOrder", "ASC"]],
    });

    const serialized = purposes.map(serializePublicPujaPurpose);

    return res.status(200).json({
      success: true,
      count: serialized.length,
      data: serialized,
    });
  } catch (error) {
    console.error("Public get puja purposes error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load puja purposes",
    });
  }
};
