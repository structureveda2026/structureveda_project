import { Op } from "sequelize";
import { HomaService, HomaPurpose } from "../models/index.js";
import {
  serializeAdminHomaServiceListing,
  serializeAdminHomaServiceDetail,
  normalizeFaqs,
} from "../serializers/homaService.serializer.js";

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
 * Validates availableHavanCounts array
 */
export const validateAvailableHavanCounts = (counts) => {
  if (!Array.isArray(counts) || counts.length === 0) {
    return { valid: false, message: "availableHavanCounts must be a non-empty array of positive integers." };
  }
  const seen = new Set();
  for (const c of counts) {
    const num = Number(c);
    if (!Number.isInteger(num) || num <= 0) {
      return { valid: false, message: "availableHavanCounts elements must be positive integers greater than zero." };
    }
    if (seen.has(num)) {
      return { valid: false, message: `Duplicate count detected in availableHavanCounts: ${num}.` };
    }
    seen.add(num);
  }
  return { valid: true };
};

/**
 * Validates availableDays array
 */
export const validateAvailableDays = (days) => {
  if (!Array.isArray(days) || days.length === 0) {
    return { valid: false, message: "availableDays must be a non-empty array of positive integers." };
  }
  const seen = new Set();
  for (const d of days) {
    const num = Number(d);
    if (!Number.isInteger(num) || num <= 0) {
      return { valid: false, message: "availableDays elements must be positive integers greater than zero." };
    }
    if (seen.has(num)) {
      return { valid: false, message: `Duplicate day detected in availableDays: ${num}.` };
    }
    seen.add(num);
  }
  return { valid: true };
};

/**
 * Validates Havan Count / Duration Coupling
 * Rule: 1 Havan cannot be configured as a multi-day ceremony.
 * If availableHavanCounts contains only 1, availableDays must not contain values > 1.
 * If availableDays contains values > 1, availableHavanCounts must contain at least one Havan count > 1.
 */
export const validateHavanDayCoupling = (counts, days) => {
  const numCounts = counts.map(Number);
  const numDays = days.map(Number);

  const hasMultiDay = numDays.some((d) => d > 1);
  const isOnlyOneHavan = numCounts.length === 1 && numCounts[0] === 1;
  const hasMultiHavan = numCounts.some((c) => c > 1);

  if (isOnlyOneHavan && hasMultiDay) {
    return {
      valid: false,
      message: "1 Havan cannot be configured as a multi-day ceremony. availableDays cannot contain values greater than 1 when availableHavanCounts is [1].",
    };
  }

  if (hasMultiDay && !hasMultiHavan) {
    return {
      valid: false,
      message: "Multi-day ceremonies require at least one Havan count greater than 1 in availableHavanCounts.",
    };
  }

  return { valid: true };
};

/**
 * Validates logical pandit constraints
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
 * Validates pricing inputs
 */
export const validatePricing = (basePrice, perHavanPrice, perDayPrice) => {
  if (typeof basePrice === "undefined" || basePrice === null || basePrice === "") {
    return { valid: false, message: "basePrice is required." };
  }
  const base = Number(basePrice);
  if (isNaN(base) || base < 0) {
    return { valid: false, message: "basePrice must be a valid non-negative number." };
  }

  if (typeof perHavanPrice !== "undefined" && perHavanPrice !== null && perHavanPrice !== "") {
    const havan = Number(perHavanPrice);
    if (isNaN(havan) || havan < 0) {
      return { valid: false, message: "perHavanPrice must be a valid non-negative number." };
    }
  }

  if (typeof perDayPrice !== "undefined" && perDayPrice !== null && perDayPrice !== "") {
    const day = Number(perDayPrice);
    if (isNaN(day) || day < 0) {
      return { valid: false, message: "perDayPrice must be a valid non-negative number." };
    }
  }

  return { valid: true };
};

/**
 * Validates media image URLs (rejects base64 data payloads)
 */
export const validateMedia = (bannerImage, galleryImages) => {
  if (bannerImage != null && bannerImage !== "") {
    if (typeof bannerImage !== "string") {
      return { valid: false, message: "bannerImage must be a URL string." };
    }
    if (bannerImage.startsWith("data:")) {
      return { valid: false, message: "Base64 image data is not allowed. Upload through /api/admin/uploads/images first." };
    }
  }

  if (galleryImages != null) {
    if (!Array.isArray(galleryImages)) {
      return { valid: false, message: "galleryImages must be an array of URL strings." };
    }
    for (const img of galleryImages) {
      if (typeof img !== "string") {
        return { valid: false, message: "galleryImages elements must be URL strings." };
      }
      if (img.startsWith("data:")) {
        return { valid: false, message: "Base64 image data is not allowed in galleryImages." };
      }
    }
  }
  return { valid: true };
};

/**
 * Derives availableLocations array consistent with boolean availability flags
 */
export const deriveAvailableLocations = (isKashiAvailable, isRemoteAvailable, explicitLocations) => {
  const kashi = typeof isKashiAvailable !== "undefined" ? Boolean(isKashiAvailable) : true;
  const remote = typeof isRemoteAvailable !== "undefined" ? Boolean(isRemoteAvailable) : true;

  if (Array.isArray(explicitLocations) && explicitLocations.length > 0) {
    return explicitLocations.filter((loc) => {
      const lower = String(loc).toLowerCase();
      if (lower === "kashi" && !kashi) return false;
      if (lower === "remote" && !remote) return false;
      return true;
    });
  }

  const locations = [];
  if (kashi) locations.push("kashi");
  if (remote) locations.push("remote");
  return locations;
};

/**
 * GET /api/admin/homa-services
 * Admin listing of all Homa services with filtering, search, and pagination
 */
export const getAdminHomaServices = async (req, res) => {
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

    // Search filter: name, slug, homaType, purposeSummary, shortDescription, description
    if (search && String(search).trim()) {
      const searchTerm = `%${String(search).trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchTerm } },
        { slug: { [Op.iLike]: searchTerm } },
        { homaType: { [Op.iLike]: searchTerm } },
        { purposeSummary: { [Op.iLike]: searchTerm } },
        { shortDescription: { [Op.iLike]: searchTerm } },
        { description: { [Op.iLike]: searchTerm } },
      ];
    }

    const purposeInclude = {
      model: HomaPurpose,
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
    const { count, rows } = await HomaService.findAndCountAll({
      where,
      include: [purposeInclude],
      order,
      limit: limitNum,
      offset,
      distinct: true,
    });

    const serializedData = rows.map(serializeAdminHomaServiceListing);
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
    console.error("Admin get homa services error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load homa services",
    });
  }
};

/**
 * GET /api/admin/homa-services/:id
 * Retrieve a single Homa service by primary key UUID
 */
export const getAdminHomaServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Homa service ID format. Must be a valid UUID.",
      });
    }

    const service = await HomaService.findByPk(id, {
      include: [{ model: HomaPurpose, as: "purposeDetails", required: false }],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Homa service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeAdminHomaServiceDetail(service),
    });
  } catch (error) {
    console.error("Admin get homa service by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load homa service details",
    });
  }
};

/**
 * POST /api/admin/homa-services
 * Create a new Homa service record
 */
export const createAdminHomaService = async (req, res) => {
  try {
    const {
      name,
      slug,
      homaType = "Vedic Homa",
      shortDescription,
      description,
      purposeId,
      purposeSummary,
      purposeCategory,
      purposeCategories,
      availableHavanCounts,
      availableDays,
      minimumPandits = 2,
      recommendedPandits = 3,
      maximumPandits = 11,
      requiredSkills,
      dailyHours = "3 – 4 Hours Daily",
      havanCapacityPerPandit,
      basePrice,
      perHavanPrice = 0,
      perDayPrice = 0,
      isKashiAvailable = true,
      isRemoteAvailable = true,
      availableLocations,
      isFeatured = false,
      isActive = true,
      bannerImage,
      galleryImages,
      samagri,
      prasad,
      sankalpaFields,
      seo,
      faqs,
    } = req.body;

    // 1. Mandatory Identity Validations
    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Service name is required.",
      });
    }

    // 2. Slug Generation and Uniqueness
    const finalSlug = slug ? sanitizeSlug(slug) : sanitizeSlug(name);
    if (!finalSlug) {
      return res.status(400).json({
        success: false,
        message: "A valid slug could not be generated from the service name.",
      });
    }

    const existingSlug = await HomaService.findOne({ where: { slug: finalSlug } });
    if (existingSlug) {
      return res.status(409).json({
        success: false,
        message: `A Homa service with slug '${finalSlug}' already exists.`,
      });
    }

    // 3. Purpose Validation
    if (purposeId) {
      if (!isValidUUID(purposeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid purposeId format. Must be a valid UUID.",
        });
      }
      const purpose = await HomaPurpose.findByPk(purposeId);
      if (!purpose) {
        return res.status(400).json({
          success: false,
          message: "Specified purposeId does not exist in Homa purposes.",
        });
      }
    }

    // 4. Havan Counts Validation
    const countsValidation = validateAvailableHavanCounts(availableHavanCounts);
    if (!countsValidation.valid) {
      return res.status(400).json({
        success: false,
        message: countsValidation.message,
      });
    }
    const resolvedHavanCounts = availableHavanCounts.map(Number);

    // 5. Days Validation
    const daysValidation = validateAvailableDays(availableDays);
    if (!daysValidation.valid) {
      return res.status(400).json({
        success: false,
        message: daysValidation.message,
      });
    }
    const resolvedDays = availableDays.map(Number);

    // 6. Havan / Day Coupling Validation
    const couplingValidation = validateHavanDayCoupling(resolvedHavanCounts, resolvedDays);
    if (!couplingValidation.valid) {
      return res.status(400).json({
        success: false,
        message: couplingValidation.message,
      });
    }

    // 7. Pandit Range Validation
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

    // 8. Pricing Validation & Synchronization
    const pricingValidation = validatePricing(basePrice, perHavanPrice, perDayPrice);
    if (!pricingValidation.valid) {
      return res.status(400).json({
        success: false,
        message: pricingValidation.message,
      });
    }
    const resolvedBasePrice = Number(basePrice);
    const resolvedPerHavanPrice = Number(perHavanPrice || 0);
    const resolvedPerDayPrice = Number(perDayPrice || 0);
    // CRITICAL: startingPrice must remain synchronized with basePrice
    const resolvedStartingPrice = resolvedBasePrice;

    // 9. Location Synchronization
    const resolvedLocations = deriveAvailableLocations(
      isKashiAvailable,
      isRemoteAvailable,
      availableLocations
    );

    // 10. Media Validation
    const mediaValidation = validateMedia(bannerImage, galleryImages);
    if (!mediaValidation.valid) {
      return res.status(400).json({
        success: false,
        message: mediaValidation.message,
      });
    }

    // 11. JSONB Field Type Validations
    if (typeof purposeCategories !== "undefined" && purposeCategories !== null && !Array.isArray(purposeCategories)) {
      return res.status(400).json({
        success: false,
        message: "purposeCategories must be an array.",
      });
    }

    if (typeof samagri !== "undefined" && samagri !== null && !Array.isArray(samagri)) {
      return res.status(400).json({
        success: false,
        message: "samagri must be an array.",
      });
    }

    if (typeof faqs !== "undefined" && faqs !== null && !Array.isArray(faqs)) {
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

    // 12. Persistence
    const newService = await HomaService.create({
      name: String(name).trim(),
      slug: finalSlug,
      homaType: homaType ? String(homaType).trim() : "Vedic Homa",
      shortDescription: shortDescription ? String(shortDescription).trim() : null,
      description: description ? String(description).trim() : null,
      purposeId: purposeId || null,
      purposeSummary: purposeSummary ? String(purposeSummary).trim() : null,
      purposeCategory: purposeCategory ? String(purposeCategory).trim() : null,
      purposeCategories: Array.isArray(purposeCategories) ? purposeCategories : [],
      availableHavanCounts: resolvedHavanCounts,
      availableDays: resolvedDays,
      minimumPandits: parseInt(minimumPandits, 10) || 2,
      recommendedPandits: parseInt(recommendedPandits, 10) || 3,
      maximumPandits: parseInt(maximumPandits, 10) || 11,
      requiredSkills: requiredSkills ? String(requiredSkills).trim() : null,
      dailyHours: dailyHours ? String(dailyHours).trim() : "3 – 4 Hours Daily",
      havanCapacityPerPandit: havanCapacityPerPandit ? String(havanCapacityPerPandit).trim() : null,
      startingPrice: resolvedStartingPrice,
      basePrice: resolvedBasePrice,
      perHavanPrice: resolvedPerHavanPrice,
      perDayPrice: resolvedPerDayPrice,
      isKashiAvailable: typeof isKashiAvailable !== "undefined" ? Boolean(isKashiAvailable) : true,
      isRemoteAvailable: typeof isRemoteAvailable !== "undefined" ? Boolean(isRemoteAvailable) : true,
      availableLocations: resolvedLocations,
      isFeatured: Boolean(isFeatured),
      isActive: typeof isActive !== "undefined" ? Boolean(isActive) : true,
      bannerImage: bannerImage ? String(bannerImage).trim() : null,
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      samagri: Array.isArray(samagri) ? samagri : [],
      prasad: prasad ? String(prasad).trim() : null,
      sankalpaFields: typeof sankalpaFields === "object" && sankalpaFields !== null ? sankalpaFields : {},
      seo: typeof seo === "object" && seo !== null ? seo : {},
      faqs: normalizeFaqs(faqs),
    });

    const detailedService = await HomaService.findByPk(newService.id, {
      include: [{ model: HomaPurpose, as: "purposeDetails", required: false }],
    });

    return res.status(201).json({
      success: true,
      message: "Homa service created successfully.",
      data: serializeAdminHomaServiceDetail(detailedService || newService),
    });
  } catch (error) {
    console.error("Admin create homa service error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Homa service",
    });
  }
};

/**
 * PUT /api/admin/homa-services/:id
 * Update an existing Homa service with merged revalidation
 */
export const updateAdminHomaService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Homa service ID format. Must be a valid UUID.",
      });
    }

    const service = await HomaService.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Homa service not found.",
      });
    }

    const {
      name,
      slug,
      homaType,
      shortDescription,
      description,
      purposeId,
      purposeSummary,
      purposeCategory,
      purposeCategories,
      availableHavanCounts,
      availableDays,
      minimumPandits,
      recommendedPandits,
      maximumPandits,
      requiredSkills,
      dailyHours,
      havanCapacityPerPandit,
      basePrice,
      perHavanPrice,
      perDayPrice,
      isKashiAvailable,
      isRemoteAvailable,
      availableLocations,
      isFeatured,
      isActive,
      bannerImage,
      galleryImages,
      samagri,
      prasad,
      sankalpaFields,
      seo,
      faqs,
    } = req.body;

    // 1. Identity
    if (typeof name !== "undefined") {
      if (!name || !String(name).trim()) {
        return res.status(400).json({
          success: false,
          message: "Service name cannot be empty.",
        });
      }
      service.name = String(name).trim();
    }

    if (typeof homaType !== "undefined") {
      service.homaType = homaType ? String(homaType).trim() : "Vedic Homa";
    }

    // 2. Slug update & conflict check
    if (typeof slug !== "undefined") {
      const sanitized = sanitizeSlug(slug);
      if (!sanitized) {
        return res.status(400).json({
          success: false,
          message: "A valid slug is required.",
        });
      }
      if (sanitized !== service.slug) {
        const conflict = await HomaService.findOne({
          where: {
            slug: sanitized,
            id: { [Op.ne]: id },
          },
        });
        if (conflict) {
          return res.status(409).json({
            success: false,
            message: `Slug '${sanitized}' is already in use.`,
          });
        }
        service.slug = sanitized;
      }
    }

    // 3. Purpose Validation
    if (typeof purposeId !== "undefined") {
      if (purposeId === null || purposeId === "") {
        service.purposeId = null;
      } else {
        if (!isValidUUID(purposeId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid purposeId format. Must be a valid UUID.",
          });
        }
        const purpose = await HomaPurpose.findByPk(purposeId);
        if (!purpose) {
          return res.status(400).json({
            success: false,
            message: "Specified purposeId does not exist in Homa purposes.",
          });
        }
        service.purposeId = purposeId;
      }
    }

    // 4. Havan Counts & Days Merged Revalidation
    let effHavanCounts = service.availableHavanCounts;
    if (typeof availableHavanCounts !== "undefined") {
      const countsValidation = validateAvailableHavanCounts(availableHavanCounts);
      if (!countsValidation.valid) {
        return res.status(400).json({
          success: false,
          message: countsValidation.message,
        });
      }
      effHavanCounts = availableHavanCounts.map(Number);
    }

    let effDays = service.availableDays;
    if (typeof availableDays !== "undefined") {
      const daysValidation = validateAvailableDays(availableDays);
      if (!daysValidation.valid) {
        return res.status(400).json({
          success: false,
          message: daysValidation.message,
        });
      }
      effDays = availableDays.map(Number);
    }

    // CRITICAL: Coupling validation on merged result!
    const couplingValidation = validateHavanDayCoupling(effHavanCounts, effDays);
    if (!couplingValidation.valid) {
      return res.status(400).json({
        success: false,
        message: couplingValidation.message,
      });
    }

    service.availableHavanCounts = effHavanCounts;
    service.availableDays = effDays;

    // 5. Pandit Range Merged Revalidation
    const effMin = typeof minimumPandits !== "undefined" ? minimumPandits : service.minimumPandits;
    const effRec = typeof recommendedPandits !== "undefined" ? recommendedPandits : service.recommendedPandits;
    const effMax = typeof maximumPandits !== "undefined" ? maximumPandits : service.maximumPandits;

    const panditValidation = validatePanditCounts(effMin, effRec, effMax);
    if (!panditValidation.valid) {
      return res.status(400).json({
        success: false,
        message: panditValidation.message,
      });
    }

    if (typeof minimumPandits !== "undefined") service.minimumPandits = parseInt(minimumPandits, 10);
    if (typeof recommendedPandits !== "undefined") service.recommendedPandits = parseInt(recommendedPandits, 10);
    if (typeof maximumPandits !== "undefined") service.maximumPandits = parseInt(maximumPandits, 10);

    // 6. Pricing Merged Revalidation
    const effBase = typeof basePrice !== "undefined" ? basePrice : service.basePrice;
    const effHavanPrice = typeof perHavanPrice !== "undefined" ? perHavanPrice : service.perHavanPrice;
    const effDayPrice = typeof perDayPrice !== "undefined" ? perDayPrice : service.perDayPrice;

    const pricingValidation = validatePricing(effBase, effHavanPrice, effDayPrice);
    if (!pricingValidation.valid) {
      return res.status(400).json({
        success: false,
        message: pricingValidation.message,
      });
    }

    if (typeof basePrice !== "undefined") {
      const bNum = Number(basePrice);
      service.basePrice = bNum;
      // startingPrice must remain synchronized with basePrice
      service.startingPrice = bNum;
    }
    if (typeof perHavanPrice !== "undefined") service.perHavanPrice = Number(perHavanPrice);
    if (typeof perDayPrice !== "undefined") service.perDayPrice = Number(perDayPrice);

    // 7. Location
    if (typeof isKashiAvailable !== "undefined") service.isKashiAvailable = Boolean(isKashiAvailable);
    if (typeof isRemoteAvailable !== "undefined") service.isRemoteAvailable = Boolean(isRemoteAvailable);

    service.availableLocations = deriveAvailableLocations(
      service.isKashiAvailable,
      service.isRemoteAvailable,
      typeof availableLocations !== "undefined" ? availableLocations : service.availableLocations
    );

    // 8. Media
    const mediaValidation = validateMedia(
      typeof bannerImage !== "undefined" ? bannerImage : null,
      typeof galleryImages !== "undefined" ? galleryImages : null
    );
    if (!mediaValidation.valid) {
      return res.status(400).json({
        success: false,
        message: mediaValidation.message,
      });
    }

    if (typeof bannerImage !== "undefined") service.bannerImage = bannerImage ? String(bannerImage).trim() : null;
    if (typeof galleryImages !== "undefined") service.galleryImages = Array.isArray(galleryImages) ? galleryImages : [];

    // 9. Optional string & JSONB fields
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
    if (typeof requiredSkills !== "undefined") service.requiredSkills = requiredSkills ? String(requiredSkills).trim() : null;
    if (typeof dailyHours !== "undefined") service.dailyHours = dailyHours ? String(dailyHours).trim() : "3 – 4 Hours Daily";
    if (typeof havanCapacityPerPandit !== "undefined") service.havanCapacityPerPandit = havanCapacityPerPandit ? String(havanCapacityPerPandit).trim() : null;
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

    const reloaded = await HomaService.findByPk(id, {
      include: [{ model: HomaPurpose, as: "purposeDetails", required: false }],
    });

    return res.status(200).json({
      success: true,
      message: "Homa service updated successfully.",
      data: serializeAdminHomaServiceDetail(reloaded || service),
    });
  } catch (error) {
    console.error("Admin update homa service error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update Homa service",
    });
  }
};

/**
 * DELETE /api/admin/homa-services/:id
 * Soft delete (isActive: false)
 */
export const deleteAdminHomaService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Homa service ID format. Must be a valid UUID.",
      });
    }

    const service = await HomaService.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Homa service not found.",
      });
    }

    service.isActive = false;
    await service.save();

    return res.status(200).json({
      success: true,
      message: "Homa service deactivated successfully (soft-delete).",
    });
  } catch (error) {
    console.error("Admin delete homa service error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete Homa service",
    });
  }
};
