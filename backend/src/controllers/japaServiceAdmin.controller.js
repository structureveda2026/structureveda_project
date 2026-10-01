import { Op } from "sequelize";
import { JapaService, JapaPurpose } from "../models/index.js";
import {
  serializeAdminJapaServiceListing,
  serializeAdminJapaServiceDetail,
  normalizeFaqs,
} from "../serializers/japaService.serializer.js";

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
 * Validates availableCounts array
 */
export const validateAvailableCounts = (counts) => {
  if (!Array.isArray(counts) || counts.length === 0) {
    return { valid: false, message: "availableCounts must be a non-empty array of positive integers." };
  }
  const seen = new Set();
  for (const c of counts) {
    const num = Number(c);
    if (!Number.isInteger(num) || num <= 0) {
      return { valid: false, message: "availableCounts elements must be positive integers greater than zero." };
    }
    if (seen.has(num)) {
      return { valid: false, message: `Duplicate count detected in availableCounts: ${num}.` };
    }
    seen.add(num);
  }
  return { valid: true };
};

/**
 * Validates variants array against customer pricing engine contract
 */
export const validateVariants = (variants) => {
  if (!Array.isArray(variants)) {
    return { valid: false, message: "variants must be an array." };
  }
  for (const v of variants) {
    if (!v || typeof v !== "object" || Array.isArray(v)) {
      return { valid: false, message: "Each variant must be an object." };
    }
    const count = Number(v.count);
    if (!Number.isInteger(count) || count <= 0) {
      return { valid: false, message: "Variant count must be a positive integer." };
    }
    const price = Number(v.startingPrice);
    if (isNaN(price) || price < 0) {
      return { valid: false, message: "Variant startingPrice must be a non-negative number." };
    }
    if (v.minimumPandits != null) {
      const minP = Number(v.minimumPandits);
      if (!Number.isInteger(minP) || minP <= 0) {
        return { valid: false, message: "Variant minimumPandits must be a positive integer." };
      }
    }
    if (v.recommendedPandits != null) {
      const recP = Number(v.recommendedPandits);
      if (!Number.isInteger(recP) || recP <= 0) {
        return { valid: false, message: "Variant recommendedPandits must be a positive integer." };
      }
    }
    if (v.dailyCapacity != null) {
      const cap = Number(v.dailyCapacity);
      if (!Number.isInteger(cap) || cap <= 0) {
        return { valid: false, message: "Variant dailyCapacity must be a positive integer." };
      }
    }
  }
  return { valid: true };
};

/**
 * Validates logical pandit and capacity constraints
 */
export const validatePanditCapacity = (min, rec, max, dailyCapacity) => {
  if (dailyCapacity != null) {
    const cap = Number(dailyCapacity);
    if (!Number.isInteger(cap) || cap <= 0) {
      return { valid: false, message: "dailyCapacityPerPandit must be a positive integer greater than zero." };
    }
  }
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
 * GET /api/admin/japa-services
 * Admin listing of all Japa services (active and inactive) with filtering, search, and pagination
 */
export const getAdminJapaServices = async (req, res) => {
  try {
    const {
      search,
      purpose,
      isActive,
      isFeatured,
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

    if (search && String(search).trim()) {
      const searchTerm = `%${String(search).trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchTerm } },
        { slug: { [Op.iLike]: searchTerm } },
        { mantra: { [Op.iLike]: searchTerm } },
        { purposeSummary: { [Op.iLike]: searchTerm } },
        { shortDescription: { [Op.iLike]: searchTerm } },
        { description: { [Op.iLike]: searchTerm } },
      ];
    }

    const purposeInclude = {
      model: JapaPurpose,
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
    }

    const offset = (pageNum - 1) * limitNum;
    const { count, rows } = await JapaService.findAndCountAll({
      where,
      include: [purposeInclude],
      order,
      limit: limitNum,
      offset,
      distinct: true,
    });

    const serializedData = rows.map(serializeAdminJapaServiceListing);
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
    console.error("Admin get japa services error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load japa services",
    });
  }
};

/**
 * GET /api/admin/japa-services/:id
 * Retrieve a single Japa service by primary key UUID
 */
export const getAdminJapaServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Japa service ID format. Must be a valid UUID.",
      });
    }

    const service = await JapaService.findByPk(id, {
      include: [{ model: JapaPurpose, as: "purposeDetails", required: false }],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Japa service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeAdminJapaServiceDetail(service),
    });
  } catch (error) {
    console.error("Admin get japa service by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load japa service details",
    });
  }
};

/**
 * POST /api/admin/japa-services
 * Create a new Japa service record
 */
export const createAdminJapaService = async (req, res) => {
  try {
    const {
      name,
      slug,
      mantra,
      mantraMeaning,
      shortDescription,
      description,
      purposeId,
      purposeSummary,
      purposeCategory,
      purposeCategories,
      availableCounts,
      variants,
      dailyCapacityPerPandit = 2000,
      minimumPandits = 2,
      recommendedPandits = 4,
      maximumPandits = 11,
      requiredSkills,
      dailyHours = "4 Hours Daily",
      completionWindow,
      startingPrice,
      isKashiAvailable = true,
      isRemoteAvailable = true,
      isFeatured = false,
      isActive = true,
      bannerImage,
      galleryImages,
      samagri,
      prasad,
      seo,
      faqs,
    } = req.body;

    // 1. Mandatory Identity & Mantra Validations
    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Service name is required.",
      });
    }

    if (!mantra || !String(mantra).trim()) {
      return res.status(400).json({
        success: false,
        message: "Mantra is required.",
      });
    }

    // 2. Starting Price Validation
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

    // 3. Slug Generation and Uniqueness
    const finalSlug = slug ? sanitizeSlug(slug) : sanitizeSlug(name);
    if (!finalSlug) {
      return res.status(400).json({
        success: false,
        message: "A valid slug could not be generated from the service name.",
      });
    }

    const existingSlug = await JapaService.findOne({ where: { slug: finalSlug } });
    if (existingSlug) {
      return res.status(409).json({
        success: false,
        message: `A Japa service with slug '${finalSlug}' already exists.`,
      });
    }

    // 4. Purpose Validation
    if (purposeId) {
      if (!isValidUUID(purposeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid purposeId format. Must be a valid UUID.",
        });
      }
      const purpose = await JapaPurpose.findByPk(purposeId);
      if (!purpose) {
        return res.status(400).json({
          success: false,
          message: "Specified purposeId does not exist in Japa purposes.",
        });
      }
    }

    // 5. Japa availableCounts Validation
    let resolvedCounts = [11000, 21000, 51000, 125000];
    if (typeof availableCounts !== "undefined" && availableCounts !== null) {
      const countsValidation = validateAvailableCounts(availableCounts);
      if (!countsValidation.valid) {
        return res.status(400).json({
          success: false,
          message: countsValidation.message,
        });
      }
      resolvedCounts = availableCounts.map(Number);
    }

    // 6. Variants Validation
    let resolvedVariants = [];
    if (typeof variants !== "undefined" && variants !== null) {
      const variantsValidation = validateVariants(variants);
      if (!variantsValidation.valid) {
        return res.status(400).json({
          success: false,
          message: variantsValidation.message,
        });
      }
      resolvedVariants = variants;
    }

    // 7. Pandit and Capacity Validation
    const panditValidation = validatePanditCapacity(
      minimumPandits,
      recommendedPandits,
      maximumPandits,
      dailyCapacityPerPandit
    );
    if (!panditValidation.valid) {
      return res.status(400).json({
        success: false,
        message: panditValidation.message,
      });
    }

    // 8. Media Validation
    const mediaValidation = validateMedia(bannerImage, galleryImages);
    if (!mediaValidation.valid) {
      return res.status(400).json({
        success: false,
        message: mediaValidation.message,
      });
    }

    // 9. JSONB Field Type Validations
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

    // 10. Persistence
    const newService = await JapaService.create({
      name: String(name).trim(),
      slug: finalSlug,
      mantra: String(mantra).trim(),
      mantraMeaning: mantraMeaning ? String(mantraMeaning).trim() : null,
      shortDescription: shortDescription ? String(shortDescription).trim() : null,
      description: description ? String(description).trim() : null,
      purposeId: purposeId || null,
      purposeSummary: purposeSummary ? String(purposeSummary).trim() : null,
      purposeCategory: purposeCategory ? String(purposeCategory).trim() : null,
      purposeCategories: Array.isArray(purposeCategories) ? purposeCategories : [],
      availableCounts: resolvedCounts,
      variants: resolvedVariants,
      dailyCapacityPerPandit: parseInt(dailyCapacityPerPandit, 10) || 2000,
      minimumPandits: parseInt(minimumPandits, 10) || 2,
      recommendedPandits: parseInt(recommendedPandits, 10) || 4,
      maximumPandits: parseInt(maximumPandits, 10) || 11,
      requiredSkills: requiredSkills ? String(requiredSkills).trim() : null,
      dailyHours: dailyHours ? String(dailyHours).trim() : "4 Hours Daily",
      completionWindow: completionWindow ? String(completionWindow).trim() : null,
      startingPrice: priceNum,
      isKashiAvailable: typeof isKashiAvailable !== "undefined" ? Boolean(isKashiAvailable) : true,
      isRemoteAvailable: typeof isRemoteAvailable !== "undefined" ? Boolean(isRemoteAvailable) : true,
      isFeatured: Boolean(isFeatured),
      isActive: typeof isActive !== "undefined" ? Boolean(isActive) : true,
      bannerImage: bannerImage ? String(bannerImage).trim() : null,
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      samagri: Array.isArray(samagri) ? samagri : [],
      prasad: prasad ? String(prasad).trim() : null,
      seo: typeof seo === "object" && seo !== null && !Array.isArray(seo) ? seo : {},
      faqs: normalizeFaqs(faqs),
    });

    const detailedService = await JapaService.findByPk(newService.id, {
      include: [{ model: JapaPurpose, as: "purposeDetails", required: false }],
    });

    return res.status(201).json({
      success: true,
      message: "Japa service created successfully.",
      data: serializeAdminJapaServiceDetail(detailedService || newService),
    });
  } catch (error) {
    console.error("Admin create japa service error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Japa service",
    });
  }
};

/**
 * PUT /api/admin/japa-services/:id
 * Update an existing Japa service
 */
export const updateAdminJapaService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Japa service ID format.",
      });
    }

    const service = await JapaService.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Japa service not found.",
      });
    }

    const {
      name,
      slug,
      mantra,
      mantraMeaning,
      shortDescription,
      description,
      purposeId,
      purposeSummary,
      purposeCategory,
      purposeCategories,
      availableCounts,
      variants,
      dailyCapacityPerPandit,
      minimumPandits,
      recommendedPandits,
      maximumPandits,
      requiredSkills,
      dailyHours,
      completionWindow,
      startingPrice,
      isKashiAvailable,
      isRemoteAvailable,
      isFeatured,
      isActive,
      bannerImage,
      galleryImages,
      samagri,
      prasad,
      seo,
      faqs,
    } = req.body;

    // 1. Identity & Mantra
    if (typeof name !== "undefined") {
      if (!name || !String(name).trim()) {
        return res.status(400).json({
          success: false,
          message: "Service name cannot be empty.",
        });
      }
      service.name = String(name).trim();
    }

    if (typeof mantra !== "undefined") {
      if (!mantra || !String(mantra).trim()) {
        return res.status(400).json({
          success: false,
          message: "Mantra cannot be empty.",
        });
      }
      service.mantra = String(mantra).trim();
    }

    // 2. Slug update
    if (typeof slug !== "undefined") {
      const sanitized = sanitizeSlug(slug);
      if (!sanitized) {
        return res.status(400).json({
          success: false,
          message: "A valid slug is required.",
        });
      }
      if (sanitized !== service.slug) {
        const conflict = await JapaService.findOne({
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

    // 3. Starting Price
    if (typeof startingPrice !== "undefined") {
      const priceNum = Number(startingPrice);
      if (isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({
          success: false,
          message: "Starting price must be a valid non-negative number.",
        });
      }
      service.startingPrice = priceNum;
    }

    // 4. Purpose Validation
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
        const purpose = await JapaPurpose.findByPk(purposeId);
        if (!purpose) {
          return res.status(400).json({
            success: false,
            message: "Specified purposeId does not exist in Japa purposes.",
          });
        }
        service.purposeId = purposeId;
      }
    }

    // 5. Japa availableCounts
    if (typeof availableCounts !== "undefined") {
      const countsValidation = validateAvailableCounts(availableCounts);
      if (!countsValidation.valid) {
        return res.status(400).json({
          success: false,
          message: countsValidation.message,
        });
      }
      service.availableCounts = availableCounts.map(Number);
    }

    // 6. Variants
    if (typeof variants !== "undefined") {
      const variantsValidation = validateVariants(variants);
      if (!variantsValidation.valid) {
        return res.status(400).json({
          success: false,
          message: variantsValidation.message,
        });
      }
      service.variants = variants;
    }

    // 7. Pandit and Capacity Validation
    const effMin = typeof minimumPandits !== "undefined" ? minimumPandits : service.minimumPandits;
    const effRec = typeof recommendedPandits !== "undefined" ? recommendedPandits : service.recommendedPandits;
    const effMax = typeof maximumPandits !== "undefined" ? maximumPandits : service.maximumPandits;
    const effCap = typeof dailyCapacityPerPandit !== "undefined" ? dailyCapacityPerPandit : service.dailyCapacityPerPandit;

    const panditValidation = validatePanditCapacity(effMin, effRec, effMax, effCap);
    if (!panditValidation.valid) {
      return res.status(400).json({
        success: false,
        message: panditValidation.message,
      });
    }

    if (typeof minimumPandits !== "undefined") service.minimumPandits = parseInt(minimumPandits, 10);
    if (typeof recommendedPandits !== "undefined") service.recommendedPandits = parseInt(recommendedPandits, 10);
    if (typeof maximumPandits !== "undefined") service.maximumPandits = parseInt(maximumPandits, 10);
    if (typeof dailyCapacityPerPandit !== "undefined") service.dailyCapacityPerPandit = parseInt(dailyCapacityPerPandit, 10);

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

    // 9. Optional text & JSONB fields
    if (typeof mantraMeaning !== "undefined") service.mantraMeaning = mantraMeaning ? String(mantraMeaning).trim() : null;
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
    if (typeof dailyHours !== "undefined") service.dailyHours = dailyHours ? String(dailyHours).trim() : "4 Hours Daily";
    if (typeof completionWindow !== "undefined") service.completionWindow = completionWindow ? String(completionWindow).trim() : null;
    if (typeof isKashiAvailable !== "undefined") service.isKashiAvailable = Boolean(isKashiAvailable);
    if (typeof isRemoteAvailable !== "undefined") service.isRemoteAvailable = Boolean(isRemoteAvailable);
    if (typeof isFeatured !== "undefined") service.isFeatured = Boolean(isFeatured);
    if (typeof isActive !== "undefined") service.isActive = Boolean(isActive);
    if (typeof samagri !== "undefined") {
      if (!Array.isArray(samagri)) {
        return res.status(400).json({ success: false, message: "samagri must be an array." });
      }
      service.samagri = samagri;
    }
    if (typeof prasad !== "undefined") service.prasad = prasad ? String(prasad).trim() : null;
    if (typeof seo !== "undefined") {
      service.seo = typeof seo === "object" && seo !== null && !Array.isArray(seo) ? seo : {};
    }
    if (typeof faqs !== "undefined") {
      if (!Array.isArray(faqs)) {
        return res.status(400).json({ success: false, message: "faqs must be an array." });
      }
      service.faqs = normalizeFaqs(faqs);
    }

    await service.save();

    const reloaded = await JapaService.findByPk(id, {
      include: [{ model: JapaPurpose, as: "purposeDetails", required: false }],
    });

    return res.status(200).json({
      success: true,
      message: "Japa service updated successfully.",
      data: serializeAdminJapaServiceDetail(reloaded || service),
    });
  } catch (error) {
    console.error("Admin update japa service error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update Japa service",
    });
  }
};

/**
 * DELETE /api/admin/japa-services/:id
 * Soft delete (isActive: false)
 */
export const deleteAdminJapaService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Japa service ID format.",
      });
    }

    const service = await JapaService.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Japa service not found.",
      });
    }

    service.isActive = false;
    await service.save();

    return res.status(200).json({
      success: true,
      message: "Japa service deactivated successfully (soft-delete).",
    });
  } catch (error) {
    console.error("Admin delete japa service error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete Japa service",
    });
  }
};
