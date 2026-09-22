import { Op } from "sequelize";
import sequelize from "../config/database.js";
import { PujaService, PujaPurpose } from "../models/index.js";
import {
  serializeAdminPujaServiceListing,
  serializeAdminPujaServiceDetail,
  normalizeFaqs,
} from "../serializers/pujaService.serializer.js";

const VALID_MODES = ["in_person", "remote", "hybrid"];
const VALID_ADMIN_SORTS = [
  "name-asc",
  "name-desc",
  "price-asc",
  "price-desc",
  "created-newest",
  "created-oldest",
];

export const isValidUUID = (str) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(str || ""));
};

export const sanitizeSlug = (str) => {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * GET /api/admin/puja-services
 * Admin listing of all Puja services (both active and inactive) with filtering and sorting
 */
export const getAdminPujaServices = async (req, res) => {
  try {
    const {
      search,
      purpose,
      isActive,
      isFeatured,
      mode,
      sortBy = "created-newest",
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

    // 2. Query Filtering
    const where = {};

    // isActive filter
    if (typeof isActive !== "undefined" && isActive !== "") {
      const trimmedActive = String(isActive).trim().toLowerCase();
      if (trimmedActive !== "true" && trimmedActive !== "false") {
        return res.status(400).json({
          success: false,
          message: "Invalid isActive parameter. Must be true or false.",
        });
      }
      where.isActive = trimmedActive === "true";
    }

    // isFeatured filter
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

    // mode filter
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

    // search filter
    if (search && String(search).trim()) {
      const searchTerm = `%${String(search).trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchTerm } },
        { slug: { [Op.iLike]: searchTerm } },
        { deity: { [Op.iLike]: searchTerm } },
        { purposeSummary: { [Op.iLike]: searchTerm } },
        { shortDescription: { [Op.iLike]: searchTerm } },
      ];
    }

    // purpose filter (by purpose slug)
    const purposeInclude = {
      model: PujaPurpose,
      as: "purposeDetails",
      required: false,
    };

    if (purpose && String(purpose).trim()) {
      purposeInclude.where = { slug: String(purpose).trim().toLowerCase() };
      purposeInclude.required = true;
    }

    // 3. Sorting Whitelist Validation
    const trimmedSort = String(sortBy).trim().toLowerCase();
    if (!VALID_ADMIN_SORTS.includes(trimmedSort)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sortBy parameter. Must be one of: name-asc, name-desc, price-asc, price-desc, created-newest, created-oldest.",
      });
    }

    let order = [];
    switch (trimmedSort) {
      case "name-asc":
        order = [["name", "ASC"]];
        break;
      case "name-desc":
        order = [["name", "DESC"]];
        break;
      case "price-asc":
        order = [["startingPrice", "ASC"], ["name", "ASC"]];
        break;
      case "price-desc":
        order = [["startingPrice", "DESC"], ["name", "ASC"]];
        break;
      case "created-newest":
        order = [["created_at", "DESC"]];
        break;
      case "created-oldest":
        order = [["created_at", "ASC"]];
        break;
    }

    // 4. Query Execution
    const offset = (pageNum - 1) * limitNum;
    const { count, rows } = await PujaService.findAndCountAll({
      where,
      include: [purposeInclude],
      order,
      limit: limitNum,
      offset,
      distinct: true,
    });

    const serializedData = rows.map(serializeAdminPujaServiceListing);
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
    console.error("Admin get puja services error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load Puja services list",
    });
  }
};

/**
 * GET /api/admin/puja-services/:id
 * Admin detail view for a specific service by UUID
 */
export const getAdminPujaServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Puja service ID format. Must be a valid UUID.",
      });
    }

    const service = await PujaService.findByPk(id, {
      include: [
        {
          model: PujaPurpose,
          as: "purposeDetails",
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
      data: serializeAdminPujaServiceDetail(service),
    });
  } catch (error) {
    console.error("Admin get puja service by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load Puja service details",
    });
  }
};

/**
 * POST /api/admin/puja-services
 * Create a new Puja Service record
 */
export const createAdminPujaService = async (req, res) => {
  try {
    const {
      name,
      slug,
      eyebrow,
      tagline,
      shortDescription,
      fullDescription,
      deity,
      purposeId,
      purposeSummary,
      availableDurations = [],
      duration,
      durationHours = [],
      locationType,
      location,
      availableMode = "hybrid",
      isKashiAvailable = true,
      startingPrice,
      isFeatured = false,
      isActive = true,
      bannerImage,
      galleryImages = [],
      whatsIncluded = [],
      whyPerform = [],
      significance = [],
      procedureSteps = [],
      faqs = [],
    } = req.body;

    // 1. Required Field Validations
    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Puja service name is required.",
      });
    }

    const rawSlug = slug || name;
    const formattedSlug = sanitizeSlug(rawSlug);
    if (!formattedSlug) {
      return res.status(400).json({
        success: false,
        message: "A valid slug is required.",
      });
    }

    if (!deity || !String(deity).trim()) {
      return res.status(400).json({
        success: false,
        message: "Deity is required.",
      });
    }

    if (typeof startingPrice === "undefined" || startingPrice === null || startingPrice === "") {
      return res.status(400).json({
        success: false,
        message: "Starting price is required.",
      });
    }

    const priceNum = Number(startingPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({
        success: false,
        message: "Starting price must be a valid non-negative number.",
      });
    }

    const trimmedMode = String(availableMode || "").trim().toLowerCase();
    if (!VALID_MODES.includes(trimmedMode)) {
      return res.status(400).json({
        success: false,
        message: "Available mode must be one of: in_person, remote, hybrid.",
      });
    }

    // 2. Purpose Validation
    if (purposeId) {
      if (!isValidUUID(purposeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid purposeId format. Must be a valid UUID.",
        });
      }
      const purpose = await PujaPurpose.findByPk(purposeId);
      if (!purpose) {
        return res.status(400).json({
          success: false,
          message: "Specified purposeId does not exist.",
        });
      }
    }

    // 3. Array & Content Validations
    if (typeof durationHours !== "undefined" && durationHours !== null) {
      if (!Array.isArray(durationHours)) {
        return res.status(400).json({
          success: false,
          message: "durationHours must be an array of positive integers.",
        });
      }
      for (const h of durationHours) {
        if (typeof h !== "number" || !Number.isInteger(h) || h <= 0) {
          return res.status(400).json({
            success: false,
            message: "durationHours elements must be positive integers greater than zero.",
          });
        }
      }
    }

    if (typeof availableDurations !== "undefined" && availableDurations !== null) {
      if (!Array.isArray(availableDurations) || availableDurations.some((d) => typeof d !== "string")) {
        return res.status(400).json({
          success: false,
          message: "availableDurations must be an array of strings.",
        });
      }
    }

    const jsonbArrayFields = ["whatsIncluded", "whyPerform", "significance", "procedureSteps", "faqs"];
    for (const field of jsonbArrayFields) {
      if (typeof req.body[field] !== "undefined" && req.body[field] !== null) {
        if (!Array.isArray(req.body[field])) {
          return res.status(400).json({
            success: false,
            message: `${field} must be an array.`,
          });
        }
      }
    }

    // 4. Media Validations
    if (bannerImage) {
      if (typeof bannerImage !== "string") {
        return res.status(400).json({
          success: false,
          message: "bannerImage must be a URL string or null.",
        });
      }
      if (bannerImage.startsWith("data:")) {
        return res.status(400).json({
          success: false,
          message: "Base64 image data is not allowed. Upload through /api/admin/uploads/images first.",
        });
      }
    }

    if (galleryImages) {
      if (!Array.isArray(galleryImages)) {
        return res.status(400).json({
          success: false,
          message: "galleryImages must be an array of URL strings.",
        });
      }
      for (const img of galleryImages) {
        if (typeof img !== "string" || img.startsWith("data:")) {
          return res.status(400).json({
            success: false,
            message: "galleryImages elements must be valid URL strings. Base64 is not allowed.",
          });
        }
      }
    }

    // 5. Slug Uniqueness Check
    const existingSlug = await PujaService.findOne({ where: { slug: formattedSlug } });
    if (existingSlug) {
      return res.status(409).json({
        success: false,
        message: "Puja service slug already exists",
      });
    }

    // 6. Persistence in Transaction
    const newService = await sequelize.transaction(async (t) => {
      return await PujaService.create(
        {
          name: name.trim(),
          slug: formattedSlug,
          eyebrow: eyebrow ? String(eyebrow).trim() : null,
          tagline: tagline ? String(tagline).trim() : null,
          shortDescription: shortDescription ? String(shortDescription).trim() : null,
          fullDescription: fullDescription ? String(fullDescription).trim() : null,
          deity: deity.trim(),
          purposeId: purposeId || null,
          purposeSummary: purposeSummary ? String(purposeSummary).trim() : null,
          availableDurations: Array.isArray(availableDurations) ? availableDurations : [],
          duration: duration ? String(duration).trim() : null,
          durationHours: Array.isArray(durationHours) ? durationHours : [],
          locationType: locationType ? String(locationType).trim() : null,
          location: location ? String(location).trim() : null,
          availableMode: trimmedMode,
          isKashiAvailable: Boolean(isKashiAvailable),
          startingPrice: priceNum,
          isFeatured: Boolean(isFeatured),
          isActive: Boolean(isActive),
          bannerImage: bannerImage ? String(bannerImage).trim() : null,
          galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
          whatsIncluded: Array.isArray(whatsIncluded) ? whatsIncluded : [],
          whyPerform: Array.isArray(whyPerform) ? whyPerform : [],
          significance: Array.isArray(significance) ? significance : [],
          procedureSteps: Array.isArray(procedureSteps) ? procedureSteps : [],
          faqs: normalizeFaqs(faqs),
        },
        { transaction: t }
      );
    });

    // Reload with purpose association
    await newService.reload({
      include: [{ model: PujaPurpose, as: "purposeDetails" }],
    });

    return res.status(201).json({
      success: true,
      message: "Puja service created successfully",
      data: serializeAdminPujaServiceDetail(newService),
    });
  } catch (error) {
    console.error("Admin create puja service error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while creating the Puja service.",
    });
  }
};

/**
 * PUT /api/admin/puja-services/:id
 * Update an existing Puja Service (partial updates supported)
 */
export const updateAdminPujaService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Puja service ID format. Must be a valid UUID.",
      });
    }

    const service = await PujaService.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Puja service not found",
      });
    }

    const updateFields = {};
    const body = req.body;

    // 1. Name validation
    if (typeof body.name !== "undefined") {
      if (!body.name || !String(body.name).trim()) {
        return res.status(400).json({
          success: false,
          message: "Puja service name cannot be empty.",
        });
      }
      updateFields.name = String(body.name).trim();
    }

    // 2. Slug validation and uniqueness
    if (typeof body.slug !== "undefined") {
      const formattedSlug = sanitizeSlug(body.slug);
      if (!formattedSlug) {
        return res.status(400).json({
          success: false,
          message: "A valid non-empty slug is required.",
        });
      }

      if (formattedSlug !== service.slug) {
        const conflict = await PujaService.findOne({
          where: {
            slug: formattedSlug,
            id: { [Op.ne]: id },
          },
        });
        if (conflict) {
          return res.status(409).json({
            success: false,
            message: "Puja service slug already exists",
          });
        }
        updateFields.slug = formattedSlug;
      }
    }

    // 3. Deity validation
    if (typeof body.deity !== "undefined") {
      if (!body.deity || !String(body.deity).trim()) {
        return res.status(400).json({
          success: false,
          message: "Deity cannot be empty.",
        });
      }
      updateFields.deity = String(body.deity).trim();
    }

    // 4. Starting price validation
    if (typeof body.startingPrice !== "undefined") {
      const priceNum = Number(body.startingPrice);
      if (isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({
          success: false,
          message: "Starting price must be a valid non-negative number.",
        });
      }
      updateFields.startingPrice = priceNum;
    }

    // 5. Available mode validation
    if (typeof body.availableMode !== "undefined") {
      const trimmedMode = String(body.availableMode).trim().toLowerCase();
      if (!VALID_MODES.includes(trimmedMode)) {
        return res.status(400).json({
          success: false,
          message: "Available mode must be one of: in_person, remote, hybrid.",
        });
      }
      updateFields.availableMode = trimmedMode;
    }

    // 6. Purpose ID validation
    if (typeof body.purposeId !== "undefined") {
      if (body.purposeId !== null) {
        if (!isValidUUID(body.purposeId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid purposeId format. Must be a valid UUID.",
          });
        }
        const purpose = await PujaPurpose.findByPk(body.purposeId);
        if (!purpose) {
          return res.status(400).json({
            success: false,
            message: "Specified purposeId does not exist.",
          });
        }
        updateFields.purposeId = body.purposeId;
      } else {
        updateFields.purposeId = null;
      }
    }

    // 7. Duration validation
    if (typeof body.durationHours !== "undefined") {
      if (body.durationHours !== null) {
        if (!Array.isArray(body.durationHours)) {
          return res.status(400).json({
            success: false,
            message: "durationHours must be an array of positive integers.",
          });
        }
        for (const h of body.durationHours) {
          if (typeof h !== "number" || !Number.isInteger(h) || h <= 0) {
            return res.status(400).json({
              success: false,
              message: "durationHours elements must be positive integers greater than zero.",
            });
          }
        }
        updateFields.durationHours = body.durationHours;
      } else {
        updateFields.durationHours = [];
      }
    }

    if (typeof body.availableDurations !== "undefined") {
      if (body.availableDurations !== null) {
        if (!Array.isArray(body.availableDurations) || body.availableDurations.some((d) => typeof d !== "string")) {
          return res.status(400).json({
            success: false,
            message: "availableDurations must be an array of strings.",
          });
        }
        updateFields.availableDurations = body.availableDurations;
      } else {
        updateFields.availableDurations = [];
      }
    }

    // 8. JSONB content arrays validation
    const jsonbArrayFields = ["whatsIncluded", "whyPerform", "significance", "procedureSteps", "faqs"];
    for (const field of jsonbArrayFields) {
      if (typeof body[field] !== "undefined") {
        if (body[field] !== null) {
          if (!Array.isArray(body[field])) {
            return res.status(400).json({
              success: false,
              message: `${field} must be an array.`,
            });
          }
          updateFields[field] = field === "faqs" ? normalizeFaqs(body[field]) : body[field];
        } else {
          updateFields[field] = [];
        }
      }
    }

    // 9. Media validations
    if (typeof body.bannerImage !== "undefined") {
      if (body.bannerImage !== null) {
        if (typeof body.bannerImage !== "string") {
          return res.status(400).json({
            success: false,
            message: "bannerImage must be a URL string or null.",
          });
        }
        if (body.bannerImage.startsWith("data:")) {
          return res.status(400).json({
            success: false,
            message: "Base64 image data is not allowed. Upload through /api/admin/uploads/images first.",
          });
        }
        updateFields.bannerImage = String(body.bannerImage).trim();
      } else {
        updateFields.bannerImage = null;
      }
    }

    if (typeof body.galleryImages !== "undefined") {
      if (body.galleryImages !== null) {
        if (!Array.isArray(body.galleryImages)) {
          return res.status(400).json({
            success: false,
            message: "galleryImages must be an array of URL strings.",
          });
        }
        for (const img of body.galleryImages) {
          if (typeof img !== "string" || img.startsWith("data:")) {
            return res.status(400).json({
              success: false,
              message: "galleryImages elements must be valid URL strings. Base64 is not allowed.",
            });
          }
        }
        updateFields.galleryImages = body.galleryImages;
      } else {
        updateFields.galleryImages = [];
      }
    }

    // 10. String & Boolean fields
    if (typeof body.eyebrow !== "undefined") updateFields.eyebrow = body.eyebrow ? String(body.eyebrow).trim() : null;
    if (typeof body.tagline !== "undefined") updateFields.tagline = body.tagline ? String(body.tagline).trim() : null;
    if (typeof body.shortDescription !== "undefined") updateFields.shortDescription = body.shortDescription ? String(body.shortDescription).trim() : null;
    if (typeof body.fullDescription !== "undefined") updateFields.fullDescription = body.fullDescription ? String(body.fullDescription).trim() : null;
    if (typeof body.purposeSummary !== "undefined") updateFields.purposeSummary = body.purposeSummary ? String(body.purposeSummary).trim() : null;
    if (typeof body.duration !== "undefined") updateFields.duration = body.duration ? String(body.duration).trim() : null;
    if (typeof body.locationType !== "undefined") updateFields.locationType = body.locationType ? String(body.locationType).trim() : null;
    if (typeof body.location !== "undefined") updateFields.location = body.location ? String(body.location).trim() : null;
    if (typeof body.isKashiAvailable !== "undefined") updateFields.isKashiAvailable = Boolean(body.isKashiAvailable);
    if (typeof body.isFeatured !== "undefined") updateFields.isFeatured = Boolean(body.isFeatured);
    if (typeof body.isActive !== "undefined") updateFields.isActive = Boolean(body.isActive);

    // 11. Execute Update within Transaction
    await sequelize.transaction(async (t) => {
      await service.update(updateFields, { transaction: t });
    });

    // Reload with associations
    await service.reload({
      include: [{ model: PujaPurpose, as: "purposeDetails" }],
    });

    return res.status(200).json({
      success: true,
      message: "Puja service updated successfully",
      data: serializeAdminPujaServiceDetail(service),
    });
  } catch (error) {
    console.error("Admin update puja service error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating the Puja service.",
    });
  }
};

/**
 * DELETE /api/admin/puja-services/:id
 * Soft delete by setting isActive = false
 */
export const deleteAdminPujaService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Puja service ID format. Must be a valid UUID.",
      });
    }

    const service = await PujaService.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Puja service not found",
      });
    }

    // Soft delete behavior: deactivate the service
    await service.update({ isActive: false });

    return res.status(200).json({
      success: true,
      message: "Puja service deactivated successfully",
      data: {
        id: service.id,
        slug: service.slug,
        name: service.name,
        isActive: false,
      },
    });
  } catch (error) {
    console.error("Admin delete puja service error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while deactivating the Puja service.",
    });
  }
};
