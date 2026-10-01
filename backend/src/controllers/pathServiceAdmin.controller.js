import { Op } from "sequelize";
import { PathService, PathPurpose } from "../models/index.js";
import {
  serializeAdminPathServiceListing,
  serializeAdminPathServiceDetail,
  normalizeFaqs,
} from "../serializers/pathService.serializer.js";

const VALID_ADMIN_SORTS = [
  "name-asc",
  "name-desc",
  "price-asc",
  "price-desc",
  "created-newest",
  "created-oldest",
];

const VALID_CANONICAL_MODES = ["kashi", "remote"];

const ALLOWED_PATH_FORMATS = [
  "single_session",
  "same_day",
  "multi_day",
  "akhand_path",
  "custom_request",
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
 * Validates availableFormats array
 */
export const validateAvailableFormats = (formats) => {
  if (!Array.isArray(formats) || formats.length === 0) {
    return { valid: false, message: "availableFormats must be a non-empty array of strings." };
  }
  const seen = new Set();
  for (const fmt of formats) {
    if (typeof fmt !== "string" || !fmt.trim()) {
      return { valid: false, message: "availableFormats elements must be non-empty strings." };
    }
    const clean = fmt.trim().toLowerCase();
    if (!ALLOWED_PATH_FORMATS.includes(clean)) {
      return {
        valid: false,
        message: `Invalid recitation format '${fmt}'. Allowed formats: ${ALLOWED_PATH_FORMATS.join(", ")}.`,
      };
    }
    if (seen.has(clean)) {
      return { valid: false, message: `Duplicate format detected in availableFormats: '${fmt}'.` };
    }
    seen.add(clean);
  }
  return { valid: true };
};

/**
 * Validates logical schedule duration constraints (days)
 */
export const validateDays = (min, rec, max) => {
  const minD = Number(min);
  const recD = Number(rec);
  const maxD = Number(max);

  if (!Number.isInteger(minD) || minD <= 0) {
    return { valid: false, message: "minimumDays must be a positive integer greater than zero." };
  }
  if (!Number.isInteger(recD) || recD <= 0) {
    return { valid: false, message: "recommendedDays must be a positive integer greater than zero." };
  }
  if (!Number.isInteger(maxD) || maxD <= 0) {
    return { valid: false, message: "maximumDays must be a positive integer greater than zero." };
  }
  if (minD > recD) {
    return { valid: false, message: `minimumDays (${minD}) cannot be greater than recommendedDays (${recD}).` };
  }
  if (recD > maxD) {
    return { valid: false, message: `recommendedDays (${recD}) cannot be greater than maximumDays (${maxD}).` };
  }
  return { valid: true };
};

/**
 * Validates single-session coupling rule:
 * If the service supports only single_session or same_day, maximumDays must be 1.
 */
export const validateSingleSessionCoupling = (formats, maxDays) => {
  const cleanFormats = (formats || []).map((f) => String(f).trim().toLowerCase());
  const hasOnlySingleOrSameDay =
    cleanFormats.length > 0 &&
    cleanFormats.every((f) => f === "single_session" || f === "same_day");

  if (hasOnlySingleOrSameDay && Number(maxDays) > 1) {
    return {
      valid: false,
      message: "Single-session and same-day Path recitations must have maximumDays equal to 1 (maximumDays must be 1).",
    };
  }
  return { valid: true };
};

/**
 * Validates logical pandit scholar constraints
 */
export const validatePanditCounts = (min, rec, max) => {
  const minP = Number(min);
  const recP = Number(rec);
  const maxP = Number(max);

  if (!Number.isInteger(minP) || minP <= 0) {
    return { valid: false, message: "minimumPandits must be a positive integer greater than zero." };
  }
  if (!Number.isInteger(recP) || recP <= 0) {
    return { valid: false, message: "recommendedPandits must be a positive integer greater than zero." };
  }
  if (!Number.isInteger(maxP) || maxP <= 0) {
    return { valid: false, message: "maximumPandits must be a positive integer greater than zero." };
  }
  if (minP > recP) {
    return { valid: false, message: `minimumPandits (${minP}) cannot be greater than recommendedPandits (${recP}).` };
  }
  if (recP > maxP) {
    return { valid: false, message: `recommendedPandits (${recP}) cannot be greater than maximumPandits (${maxP}).` };
  }
  return { valid: true };
};

/**
 * Validates authoritative pricing input (startingPrice only)
 */
export const validatePricing = (startingPrice) => {
  if (typeof startingPrice === "undefined" || startingPrice === null || startingPrice === "") {
    return { valid: false, message: "startingPrice is required." };
  }
  const price = Number(startingPrice);
  if (isNaN(price) || price < 0) {
    return { valid: false, message: "startingPrice must be a valid non-negative number." };
  }
  return { valid: true };
};

/**
 * Derives and synchronizes availableLocations array from boolean flags
 */
export const deriveAvailableLocations = (kashi, remote, explicitLocations) => {
  if (Array.isArray(explicitLocations) && explicitLocations.length > 0) {
    return explicitLocations.filter((loc) => {
      const clean = String(loc).trim().toLowerCase();
      if (clean === "kashi" && !kashi) return false;
      if (clean === "remote" && !remote) return false;
      return true;
    });
  }

  const locations = [];
  if (kashi) locations.push("kashi");
  if (remote) locations.push("remote");
  return locations;
};

/**
 * Validates media inputs
 */
export const validateMedia = (bannerImage, galleryImages) => {
  if (bannerImage !== null && typeof bannerImage !== "undefined" && bannerImage !== "") {
    if (typeof bannerImage !== "string" || !bannerImage.trim().startsWith("http")) {
      return { valid: false, message: "bannerImage must be a valid URL string." };
    }
  }

  if (typeof galleryImages !== "undefined" && galleryImages !== null) {
    if (!Array.isArray(galleryImages)) {
      return { valid: false, message: "galleryImages must be an array of URL strings." };
    }
    for (const img of galleryImages) {
      if (typeof img !== "string" || !img.trim().startsWith("http")) {
        return { valid: false, message: "Each gallery image must be a valid URL string." };
      }
    }
  }

  return { valid: true };
};

/**
 * GET /api/admin/path-services
 * Admin listing of all Path services with filtering, search, and pagination
 */
export const getAdminPathServices = async (req, res) => {
  try {
    const {
      search,
      purpose,
      isActive,
      status,
      isFeatured,
      featured,
      sortBy = "created-newest",
      page = "1",
      limit = "20",
    } = req.query;

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

    const where = {};

    // Active status filter (supports isActive, status: "active" | "inactive" | "all")
    const activeParam = typeof isActive !== "undefined" && isActive !== "" ? isActive : status;
    if (typeof activeParam !== "undefined" && activeParam !== "") {
      const trimmedActive = String(activeParam).trim().toLowerCase();
      if (trimmedActive === "true" || trimmedActive === "active") {
        where.isActive = true;
      } else if (trimmedActive === "false" || trimmedActive === "inactive") {
        where.isActive = false;
      } else if (trimmedActive !== "all") {
        return res.status(400).json({
          success: false,
          message: "Invalid isActive/status parameter. Must be true, false, active, inactive, or all.",
        });
      }
    }

    // Featured status filter (supports isFeatured, featured: "featured" | "not featured" | "all")
    const featuredParam = typeof isFeatured !== "undefined" && isFeatured !== "" ? isFeatured : featured;
    if (typeof featuredParam !== "undefined" && featuredParam !== "") {
      const trimmedFeatured = String(featuredParam).trim().toLowerCase();
      if (trimmedFeatured === "true" || trimmedFeatured === "featured") {
        where.isFeatured = true;
      } else if (trimmedFeatured === "false" || trimmedFeatured === "not featured" || trimmedFeatured === "not_featured") {
        where.isFeatured = false;
      } else if (trimmedFeatured !== "all") {
        return res.status(400).json({
          success: false,
          message: "Invalid isFeatured parameter. Must be true, false, featured, not featured, or all.",
        });
      }
    }

    // Search filter: name, slug, scripture, pathType, purposeSummary, shortDescription, description
    if (search && String(search).trim()) {
      const searchTerm = `%${String(search).trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchTerm } },
        { slug: { [Op.iLike]: searchTerm } },
        { scripture: { [Op.iLike]: searchTerm } },
        { pathType: { [Op.iLike]: searchTerm } },
        { purposeSummary: { [Op.iLike]: searchTerm } },
        { shortDescription: { [Op.iLike]: searchTerm } },
        { description: { [Op.iLike]: searchTerm } },
      ];
    }

    const purposeInclude = {
      model: PathPurpose,
      as: "purposeDetails",
      required: false,
    };

    if (purpose && String(purpose).trim()) {
      const pVal = String(purpose).trim();
      if (isValidUUID(pVal)) {
        purposeInclude.where = { id: pVal };
        purposeInclude.required = true;
      } else {
        const lower = pVal.toLowerCase();
        where[Op.or] = [
          { purposeCategory: lower },
          { purposeCategories: { [Op.contains]: [lower] } },
          { "$purposeDetails.slug$": lower },
        ];
      }
    }

    let order = [["created_at", "DESC"]];
    switch (sortBy) {
      case "created-oldest":
      case "oldest":
        order = [["created_at", "ASC"]];
        break;
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
      case "created-newest":
      case "newest":
      default:
        order = [["created_at", "DESC"]];
        break;
    }

    const offset = (pageNum - 1) * limitNum;
    const { count, rows } = await PathService.findAndCountAll({
      where,
      include: [purposeInclude],
      order,
      limit: limitNum,
      offset,
      distinct: true,
    });

    const totalPages = Math.ceil(count / limitNum) || 1;

    return res.status(200).json({
      success: true,
      count: rows.length,
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: rows.map(serializeAdminPathServiceListing),
    });
  } catch (error) {
    console.error("Admin get path services error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve Path services",
    });
  }
};

export const listPathServices = getAdminPathServices;

/**
 * GET /api/admin/path-services/:id
 * Retrieve a single Path service record for admin detail/edit
 */
export const getAdminPathServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Path service ID format. Must be a valid UUID.",
      });
    }

    const service = await PathService.findByPk(id, {
      include: [
        {
          model: PathPurpose,
          as: "purposeDetails",
          required: false,
        },
      ],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Path service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeAdminPathServiceDetail(service),
    });
  } catch (error) {
    console.error("Admin get path service by id error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve Path service",
    });
  }
};

export const getPathService = getAdminPathServiceById;

/**
 * POST /api/admin/path-services
 * Create a new Path service record
 */
export const createAdminPathService = async (req, res) => {
  try {
    const {
      name,
      slug,
      pathType = "Vedic Path",
      scripture,
      shortDescription,
      description,
      purposeId,
      purposeSummary,
      purposeCategory,
      purposeCategories = [],
      availableFormats,
      availableDurations = [],
      chapterStructure,
      totalChapters,
      totalSections,
      totalVerses,
      estimatedRecitationHours,
      dailyRecitationTarget,
      minimumDays = 1,
      recommendedDays = 1,
      maximumDays = 1,
      minimumPandits = 2,
      recommendedPandits = 2,
      maximumPandits = 5,
      requiredSkills,
      dailyHours = "3 – 4 Hours Daily",
      dailyRecitationCapacity,
      samagri = [],
      prasad,
      sankalpaFields = {},
      isKashiAvailable = true,
      isRemoteAvailable = true,
      availableLocations,
      startingPrice,
      isFeatured = false,
      isActive = true,
      bannerImage,
      galleryImages = [],
      seo = {},
      faqs = [],
    } = req.body;

    // 1. Core Field Validations
    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "name is required and cannot be empty.",
      });
    }
    if (String(name).trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: "name must not exceed 200 characters.",
      });
    }

    if (!scripture || !String(scripture).trim()) {
      return res.status(400).json({
        success: false,
        message: "scripture is required and cannot be empty.",
      });
    }
    if (String(scripture).trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: "scripture must not exceed 200 characters.",
      });
    }

    // 2. Slug Generation & Uniqueness Validation
    let finalSlug = slug ? sanitizeSlug(slug) : sanitizeSlug(name);
    if (!finalSlug) {
      return res.status(400).json({
        success: false,
        message: "A valid slug could not be derived. Please provide a non-empty name or slug.",
      });
    }

    const existingSlug = await PathService.findOne({ where: { slug: finalSlug } });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: `A Path service with slug '${finalSlug}' already exists. Slugs must be unique.`,
      });
    }

    // 3. Purpose Resolution
    let resolvedPurposeId = null;
    let resolvedPurposeCategory = purposeCategory || null;
    let resolvedPurposeCategories = Array.isArray(purposeCategories) ? [...purposeCategories] : [];

    if (purposeId) {
      if (!isValidUUID(purposeId)) {
        return res.status(400).json({
          success: false,
          message: "purposeId must be a valid UUID.",
        });
      }
      const purposeRecord = await PathPurpose.findByPk(purposeId);
      if (!purposeRecord) {
        return res.status(400).json({
          success: false,
          message: `Purpose with id '${purposeId}' does not exist.`,
        });
      }
      resolvedPurposeId = purposeRecord.id;
      if (!resolvedPurposeCategory) {
        resolvedPurposeCategory = purposeRecord.slug;
      }
      if (!resolvedPurposeCategories.includes(purposeRecord.slug)) {
        resolvedPurposeCategories.unshift(purposeRecord.slug);
      }
    }

    // 4. Formats Validation
    const formatValidation = validateAvailableFormats(availableFormats);
    if (!formatValidation.valid) {
      return res.status(400).json({
        success: false,
        message: formatValidation.message,
      });
    }

    // 5. Days Validation
    const daysValidation = validateDays(minimumDays, recommendedDays, maximumDays);
    if (!daysValidation.valid) {
      return res.status(400).json({
        success: false,
        message: daysValidation.message,
      });
    }

    // 6. Single-Session Coupling Validation
    const couplingValidation = validateSingleSessionCoupling(availableFormats, maximumDays);
    if (!couplingValidation.valid) {
      return res.status(400).json({
        success: false,
        message: couplingValidation.message,
      });
    }

    // 7. Pandit Counts Validation
    const panditValidation = validatePanditCounts(
      minimumPandits,
      recommendedPandits,
      maximumPandits
    );
    if (!panditValidation.valid) {
      return res.status(400).json({
        success: false,
        message: panditValidation.message,
      });
    }

    // 8. Pricing Validation
    const pricingValidation = validatePricing(startingPrice);
    if (!pricingValidation.valid) {
      return res.status(400).json({
        success: false,
        message: pricingValidation.message,
      });
    }
    const resolvedStartingPrice = Number(startingPrice);

    // 9. Location Validation & Synchronization
    if (!isKashiAvailable && !isRemoteAvailable) {
      return res.status(400).json({
        success: false,
        message: "At least one arrangement mode (isKashiAvailable or isRemoteAvailable) must be enabled.",
      });
    }

    const resolvedLocations = deriveAvailableLocations(
      Boolean(isKashiAvailable),
      Boolean(isRemoteAvailable),
      availableLocations
    );
    if (resolvedLocations.length === 0) {
      return res.status(400).json({
        success: false,
        message: "availableLocations must contain at least one valid canonical mode ('kashi', 'remote').",
      });
    }

    // 10. Scripture Structure Numeric Validations
    if (totalChapters != null && totalChapters !== "") {
      const num = Number(totalChapters);
      if (!Number.isInteger(num) || num < 0) {
        return res.status(400).json({
          success: false,
          message: "totalChapters must be a non-negative integer.",
        });
      }
    }
    if (totalSections != null && totalSections !== "") {
      const num = Number(totalSections);
      if (!Number.isInteger(num) || num < 0) {
        return res.status(400).json({
          success: false,
          message: "totalSections must be a non-negative integer.",
        });
      }
    }
    if (totalVerses != null && totalVerses !== "") {
      const num = Number(totalVerses);
      if (!Number.isInteger(num) || num < 0) {
        return res.status(400).json({
          success: false,
          message: "totalVerses must be a non-negative integer.",
        });
      }
    }
    if (estimatedRecitationHours != null && estimatedRecitationHours !== "") {
      const num = Number(estimatedRecitationHours);
      if (isNaN(num) || num < 0) {
        return res.status(400).json({
          success: false,
          message: "estimatedRecitationHours must be a non-negative number.",
        });
      }
    }

    // 11. Media Validation
    const mediaValidation = validateMedia(bannerImage, galleryImages);
    if (!mediaValidation.valid) {
      return res.status(400).json({
        success: false,
        message: mediaValidation.message,
      });
    }

    // 12. JSONB Field Type Validations
    if (typeof availableDurations !== "undefined" && !Array.isArray(availableDurations)) {
      return res.status(400).json({
        success: false,
        message: "availableDurations must be an array.",
      });
    }

    if (typeof samagri !== "undefined" && !Array.isArray(samagri)) {
      return res.status(400).json({
        success: false,
        message: "samagri must be an array.",
      });
    }

    if (typeof faqs !== "undefined" && !Array.isArray(faqs)) {
      return res.status(400).json({
        success: false,
        message: "faqs must be an array.",
      });
    }

    if (typeof sankalpaFields !== "undefined" && sankalpaFields !== null && (typeof sankalpaFields !== "object" || Array.isArray(sankalpaFields))) {
      return res.status(400).json({
        success: false,
        message: "sankalpaFields must be an object.",
      });
    }

    if (typeof seo !== "undefined" && seo !== null && (typeof seo !== "object" || Array.isArray(seo))) {
      return res.status(400).json({
        success: false,
        message: "seo must be an object.",
      });
    }

    // 13. Persistence
    const newService = await PathService.create({
      name: String(name).trim(),
      slug: finalSlug,
      pathType: String(pathType || "Vedic Path").trim(),
      scripture: String(scripture).trim(),
      shortDescription: shortDescription ? String(shortDescription).trim() : null,
      description: description ? String(description).trim() : null,
      purposeId: resolvedPurposeId,
      purposeSummary: purposeSummary ? String(purposeSummary).trim() : null,
      purposeCategory: resolvedPurposeCategory,
      purposeCategories: resolvedPurposeCategories,
      availableFormats,
      availableDurations: Array.isArray(availableDurations) ? availableDurations : [],
      chapterStructure: chapterStructure ? String(chapterStructure).trim() : null,
      totalChapters: totalChapters != null && totalChapters !== "" ? parseInt(totalChapters, 10) : null,
      totalSections: totalSections != null && totalSections !== "" ? parseInt(totalSections, 10) : null,
      totalVerses: totalVerses != null && totalVerses !== "" ? parseInt(totalVerses, 10) : null,
      estimatedRecitationHours: estimatedRecitationHours != null && estimatedRecitationHours !== "" ? Number(estimatedRecitationHours) : null,
      dailyRecitationTarget: dailyRecitationTarget ? String(dailyRecitationTarget).trim() : null,
      minimumDays: parseInt(minimumDays, 10),
      recommendedDays: parseInt(recommendedDays, 10),
      maximumDays: parseInt(maximumDays, 10),
      minimumPandits: parseInt(minimumPandits, 10),
      recommendedPandits: parseInt(recommendedPandits, 10),
      maximumPandits: parseInt(maximumPandits, 10),
      requiredSkills: requiredSkills ? String(requiredSkills).trim() : null,
      dailyHours: String(dailyHours || "3 – 4 Hours Daily").trim(),
      dailyRecitationCapacity: dailyRecitationCapacity ? String(dailyRecitationCapacity).trim() : null,
      samagri: Array.isArray(samagri) ? samagri : [],
      prasad: prasad ? String(prasad).trim() : null,
      sankalpaFields: typeof sankalpaFields === "object" && sankalpaFields !== null ? sankalpaFields : {},
      isKashiAvailable: Boolean(isKashiAvailable),
      isRemoteAvailable: Boolean(isRemoteAvailable),
      availableLocations: resolvedLocations,
      startingPrice: resolvedStartingPrice,
      isFeatured: Boolean(isFeatured),
      isActive: Boolean(isActive),
      bannerImage: bannerImage ? String(bannerImage).trim() : null,
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      seo: typeof seo === "object" && seo !== null ? seo : {},
      faqs: normalizeFaqs(faqs),
    });

    const reloaded = await PathService.findByPk(newService.id, {
      include: [
        {
          model: PathPurpose,
          as: "purposeDetails",
          required: false,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Path service created successfully.",
      data: serializeAdminPathServiceDetail(reloaded || newService),
    });
  } catch (error) {
    console.error("Admin create path service error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Path service",
    });
  }
};

export const createPathService = createAdminPathService;

/**
 * PUT /api/admin/path-services/:id
 * Update an existing Path service record
 */
export const updateAdminPathService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Path service ID format. Must be a valid UUID.",
      });
    }

    const service = await PathService.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Path service not found.",
      });
    }

    const {
      name,
      slug,
      pathType,
      scripture,
      shortDescription,
      description,
      purposeId,
      purposeSummary,
      purposeCategory,
      purposeCategories,
      availableFormats,
      availableDurations,
      chapterStructure,
      totalChapters,
      totalSections,
      totalVerses,
      estimatedRecitationHours,
      dailyRecitationTarget,
      minimumDays,
      recommendedDays,
      maximumDays,
      minimumPandits,
      recommendedPandits,
      maximumPandits,
      requiredSkills,
      dailyHours,
      dailyRecitationCapacity,
      samagri,
      prasad,
      sankalpaFields,
      isKashiAvailable,
      isRemoteAvailable,
      availableLocations,
      startingPrice,
      isFeatured,
      isActive,
      bannerImage,
      galleryImages,
      seo,
      faqs,
    } = req.body;

    // 1. Name & Scripture
    if (typeof name !== "undefined") {
      if (!name || !String(name).trim()) {
        return res.status(400).json({ success: false, message: "name cannot be empty." });
      }
      if (String(name).trim().length > 200) {
        return res.status(400).json({ success: false, message: "name must not exceed 200 characters." });
      }
      service.name = String(name).trim();
    }

    if (typeof scripture !== "undefined") {
      if (!scripture || !String(scripture).trim()) {
        return res.status(400).json({ success: false, message: "scripture cannot be empty." });
      }
      if (String(scripture).trim().length > 200) {
        return res.status(400).json({ success: false, message: "scripture must not exceed 200 characters." });
      }
      service.scripture = String(scripture).trim();
    }

    if (typeof pathType !== "undefined") {
      service.pathType = String(pathType || "Vedic Path").trim();
    }

    // 2. Slug Validation
    if (typeof slug !== "undefined") {
      const cleanSlug = sanitizeSlug(slug);
      if (!cleanSlug) {
        return res.status(400).json({ success: false, message: "slug cannot be empty." });
      }
      if (cleanSlug !== service.slug) {
        const existing = await PathService.findOne({ where: { slug: cleanSlug } });
        if (existing && existing.id !== service.id) {
          return res.status(400).json({
            success: false,
            message: `A Path service with slug '${cleanSlug}' already exists. Slugs must be unique.`,
          });
        }
        service.slug = cleanSlug;
      }
    }

    // 3. Purpose Resolution
    if (typeof purposeId !== "undefined") {
      if (purposeId === null || purposeId === "") {
        service.purposeId = null;
      } else {
        if (!isValidUUID(purposeId)) {
          return res.status(400).json({ success: false, message: "purposeId must be a valid UUID." });
        }
        const purposeRecord = await PathPurpose.findByPk(purposeId);
        if (!purposeRecord) {
          return res.status(400).json({
            success: false,
            message: `Purpose with id '${purposeId}' does not exist.`,
          });
        }
        service.purposeId = purposeRecord.id;
        if (!purposeCategory) {
          service.purposeCategory = purposeRecord.slug;
        }
        if (Array.isArray(service.purposeCategories) && !service.purposeCategories.includes(purposeRecord.slug)) {
          service.purposeCategories = [purposeRecord.slug, ...service.purposeCategories];
        }
      }
    }

    // 4. Formats Validation
    const effFormats = typeof availableFormats !== "undefined" ? availableFormats : service.availableFormats;
    const formatValidation = validateAvailableFormats(effFormats);
    if (!formatValidation.valid) {
      return res.status(400).json({ success: false, message: formatValidation.message });
    }
    service.availableFormats = effFormats;

    // 5. Days Validation
    const effMinDays = typeof minimumDays !== "undefined" ? minimumDays : service.minimumDays;
    const effRecDays = typeof recommendedDays !== "undefined" ? recommendedDays : service.recommendedDays;
    const effMaxDays = typeof maximumDays !== "undefined" ? maximumDays : service.maximumDays;

    const daysValidation = validateDays(effMinDays, effRecDays, effMaxDays);
    if (!daysValidation.valid) {
      return res.status(400).json({ success: false, message: daysValidation.message });
    }

    // 6. Single-Session Coupling Validation
    const couplingValidation = validateSingleSessionCoupling(effFormats, effMaxDays);
    if (!couplingValidation.valid) {
      return res.status(400).json({ success: false, message: couplingValidation.message });
    }

    service.minimumDays = parseInt(effMinDays, 10);
    service.recommendedDays = parseInt(effRecDays, 10);
    service.maximumDays = parseInt(effMaxDays, 10);

    // 7. Pandit Counts Validation
    const effMinP = typeof minimumPandits !== "undefined" ? minimumPandits : service.minimumPandits;
    const effRecP = typeof recommendedPandits !== "undefined" ? recommendedPandits : service.recommendedPandits;
    const effMaxP = typeof maximumPandits !== "undefined" ? maximumPandits : service.maximumPandits;

    const panditValidation = validatePanditCounts(effMinP, effRecP, effMaxP);
    if (!panditValidation.valid) {
      return res.status(400).json({ success: false, message: panditValidation.message });
    }

    service.minimumPandits = parseInt(effMinP, 10);
    service.recommendedPandits = parseInt(effRecP, 10);
    service.maximumPandits = parseInt(effMaxP, 10);

    // 8. Pricing Validation
    if (typeof startingPrice !== "undefined") {
      const pricingValidation = validatePricing(startingPrice);
      if (!pricingValidation.valid) {
        return res.status(400).json({ success: false, message: pricingValidation.message });
      }
      service.startingPrice = Number(startingPrice);
    }

    // 9. Location Validation & Synchronization
    const effKashi = typeof isKashiAvailable !== "undefined" ? Boolean(isKashiAvailable) : service.isKashiAvailable;
    const effRemote = typeof isRemoteAvailable !== "undefined" ? Boolean(isRemoteAvailable) : service.isRemoteAvailable;

    if (!effKashi && !effRemote) {
      return res.status(400).json({
        success: false,
        message: "At least one arrangement mode (isKashiAvailable or isRemoteAvailable) must be enabled.",
      });
    }

    service.isKashiAvailable = effKashi;
    service.isRemoteAvailable = effRemote;
    service.availableLocations = deriveAvailableLocations(
      effKashi,
      effRemote,
      typeof availableLocations !== "undefined" ? availableLocations : service.availableLocations
    );

    // 10. Scripture Structure Numeric Fields
    if (typeof totalChapters !== "undefined") {
      if (totalChapters === null || totalChapters === "") {
        service.totalChapters = null;
      } else {
        const num = Number(totalChapters);
        if (!Number.isInteger(num) || num < 0) {
          return res.status(400).json({ success: false, message: "totalChapters must be a non-negative integer." });
        }
        service.totalChapters = parseInt(totalChapters, 10);
      }
    }

    if (typeof totalSections !== "undefined") {
      if (totalSections === null || totalSections === "") {
        service.totalSections = null;
      } else {
        const num = Number(totalSections);
        if (!Number.isInteger(num) || num < 0) {
          return res.status(400).json({ success: false, message: "totalSections must be a non-negative integer." });
        }
        service.totalSections = parseInt(totalSections, 10);
      }
    }

    if (typeof totalVerses !== "undefined") {
      if (totalVerses === null || totalVerses === "") {
        service.totalVerses = null;
      } else {
        const num = Number(totalVerses);
        if (!Number.isInteger(num) || num < 0) {
          return res.status(400).json({ success: false, message: "totalVerses must be a non-negative integer." });
        }
        service.totalVerses = parseInt(totalVerses, 10);
      }
    }

    if (typeof estimatedRecitationHours !== "undefined") {
      if (estimatedRecitationHours === null || estimatedRecitationHours === "") {
        service.estimatedRecitationHours = null;
      } else {
        const num = Number(estimatedRecitationHours);
        if (isNaN(num) || num < 0) {
          return res.status(400).json({ success: false, message: "estimatedRecitationHours must be a non-negative number." });
        }
        service.estimatedRecitationHours = Number(estimatedRecitationHours);
      }
    }

    // 11. Media Validation
    const mediaValidation = validateMedia(
      typeof bannerImage !== "undefined" ? bannerImage : null,
      typeof galleryImages !== "undefined" ? galleryImages : null
    );
    if (!mediaValidation.valid) {
      return res.status(400).json({ success: false, message: mediaValidation.message });
    }

    if (typeof bannerImage !== "undefined") service.bannerImage = bannerImage ? String(bannerImage).trim() : null;
    if (typeof galleryImages !== "undefined") service.galleryImages = Array.isArray(galleryImages) ? galleryImages : [];

    // 12. Optional string & JSONB fields
    if (typeof shortDescription !== "undefined") service.shortDescription = shortDescription ? String(shortDescription).trim() : null;
    if (typeof description !== "undefined") service.description = description ? String(description).trim() : null;
    if (typeof purposeSummary !== "undefined") service.purposeSummary = purposeSummary ? String(purposeSummary).trim() : null;
    if (typeof purposeCategory !== "undefined") service.purposeCategory = purposeCategory ? String(purposeCategory).trim() : null;
    if (typeof purposeCategories !== "undefined") {
      if (!Array.isArray(purposeCategories)) {
        return res.status(400).json({ success: false, message: "purposeCategories must be an array." });
      }
      service.purposeCategories = purposeCategories;
    }
    if (typeof availableDurations !== "undefined") {
      if (!Array.isArray(availableDurations)) {
        return res.status(400).json({ success: false, message: "availableDurations must be an array." });
      }
      service.availableDurations = availableDurations;
    }
    if (typeof chapterStructure !== "undefined") service.chapterStructure = chapterStructure ? String(chapterStructure).trim() : null;
    if (typeof dailyRecitationTarget !== "undefined") service.dailyRecitationTarget = dailyRecitationTarget ? String(dailyRecitationTarget).trim() : null;
    if (typeof requiredSkills !== "undefined") service.requiredSkills = requiredSkills ? String(requiredSkills).trim() : null;
    if (typeof dailyHours !== "undefined") service.dailyHours = dailyHours ? String(dailyHours).trim() : "3 – 4 Hours Daily";
    if (typeof dailyRecitationCapacity !== "undefined") service.dailyRecitationCapacity = dailyRecitationCapacity ? String(dailyRecitationCapacity).trim() : null;
    if (typeof isFeatured !== "undefined") service.isFeatured = Boolean(isFeatured);
    if (typeof isActive !== "undefined") service.isActive = Boolean(isActive);
    if (typeof samagri !== "undefined") {
      if (!Array.isArray(samagri)) {
        return res.status(400).json({ success: false, message: "samagri must be an array." });
      }
      service.samagri = samagri;
    }
    if (typeof prasad !== "undefined") service.prasad = prasad ? String(prasad).trim() : null;
    if (typeof sankalpaFields !== "undefined") {
      if (typeof sankalpaFields !== "object" || sankalpaFields === null || Array.isArray(sankalpaFields)) {
        return res.status(400).json({ success: false, message: "sankalpaFields must be an object." });
      }
      service.sankalpaFields = sankalpaFields;
    }
    if (typeof seo !== "undefined") {
      if (typeof seo !== "object" || seo === null || Array.isArray(seo)) {
        return res.status(400).json({ success: false, message: "seo must be an object." });
      }
      service.seo = seo;
    }
    if (typeof faqs !== "undefined") {
      if (!Array.isArray(faqs)) {
        return res.status(400).json({ success: false, message: "faqs must be an array." });
      }
      service.faqs = normalizeFaqs(faqs);
    }

    await service.save();

    const reloaded = await PathService.findByPk(id, {
      include: [{ model: PathPurpose, as: "purposeDetails", required: false }],
    });

    return res.status(200).json({
      success: true,
      message: "Path service updated successfully.",
      data: serializeAdminPathServiceDetail(reloaded || service),
    });
  } catch (error) {
    console.error("Admin update path service error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update Path service",
    });
  }
};

export const updatePathService = updateAdminPathService;

/**
 * DELETE /api/admin/path-services/:id
 * Soft delete (isActive: false)
 */
export const deleteAdminPathService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Path service ID format. Must be a valid UUID.",
      });
    }

    const service = await PathService.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Path service not found.",
      });
    }

    service.isActive = false;
    await service.save();

    return res.status(200).json({
      success: true,
      message: "Path service deactivated successfully (soft-delete).",
    });
  } catch (error) {
    console.error("Admin delete path service error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete Path service",
    });
  }
};

export const deletePathService = deleteAdminPathService;

export default {
  isValidUUID,
  sanitizeSlug,
  validateAvailableFormats,
  validateDays,
  validateSingleSessionCoupling,
  validatePanditCounts,
  validatePricing,
  deriveAvailableLocations,
  validateMedia,
  getAdminPathServices,
  listPathServices,
  getAdminPathServiceById,
  getPathService,
  createAdminPathService,
  createPathService,
  updateAdminPathService,
  updatePathService,
  deleteAdminPathService,
  deletePathService,
};
