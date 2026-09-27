import { Op } from "sequelize";
import sequelize from "../config/database.js";
import { YagyaService, YagyaPurpose } from "../models/index.js";
import {
  serializeAdminYagyaServiceListing,
  serializeAdminYagyaServiceDetail,
  normalizeFaqs,
} from "../serializers/yagyaService.serializer.js";

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
 * GET /api/admin/yagya-services
 * Admin listing of all Yagya services (both active and inactive)
 */
export const getAdminYagyaServices = async (req, res) => {
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

    if (search && String(search).trim()) {
      const searchTerm = `%${String(search).trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchTerm } },
        { slug: { [Op.iLike]: searchTerm } },
        { deity: { [Op.iLike]: searchTerm } },
        { purposeSummary: { [Op.iLike]: searchTerm } },
      ];
    }

    const purposeInclude = {
      model: YagyaPurpose,
      as: "purposeDetails",
      required: false,
    };

    if (purpose && String(purpose).trim()) {
      const pVal = String(purpose).trim();
      if (isValidUUID(pVal)) {
        purposeInclude.where = { id: pVal };
      } else {
        purposeInclude.where = { slug: pVal.toLowerCase() };
      }
      purposeInclude.required = true;
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
    const { count, rows } = await YagyaService.findAndCountAll({
      where,
      include: [purposeInclude],
      order,
      limit: limitNum,
      offset,
      distinct: true,
    });

    const serializedData = rows.map(serializeAdminYagyaServiceListing);
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
    console.error("Admin get yagya services error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load yagya services",
    });
  }
};

/**
 * GET /api/admin/yagya-services/:id
 */
export const getAdminYagyaServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Yagya service ID format. Must be a valid UUID.",
      });
    }

    const service = await YagyaService.findByPk(id, {
      include: [{ model: YagyaPurpose, as: "purposeDetails", required: false }],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Yagya service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeAdminYagyaServiceDetail(service),
    });
  } catch (error) {
    console.error("Admin get yagya service by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load yagya service details",
    });
  }
};

/**
 * POST /api/admin/yagya-services
 */
export const createAdminYagyaService = async (req, res) => {
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
      availableDurations,
      durationDisplay,
      dailyRitualHours = 5,
      dailyHoursDisplay = "5 Hours / Day",
      panditRequirement,
      locationType,
      location,
      availableMode = "hybrid",
      isKashiAvailable = true,
      isRemoteAvailable = true,
      startingPrice,
      pricingTiers,
      isFeatured = false,
      isActive = true,
      bannerImage,
      galleryImages,
      samagri,
      prasad,
      dailySchedule,
      whatsIncluded,
      whyPerform,
      significance,
      procedureSteps,
      faqs,
    } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Service name is required.",
      });
    }

    if (!deity || !String(deity).trim()) {
      return res.status(400).json({
        success: false,
        message: "Deity name is required.",
      });
    }

    const finalSlug = slug ? sanitizeSlug(slug) : sanitizeSlug(name);
    if (!finalSlug) {
      return res.status(400).json({
        success: false,
        message: "A valid slug could not be generated from the service name.",
      });
    }

    const existingSlug = await YagyaService.findOne({ where: { slug: finalSlug } });
    if (existingSlug) {
      return res.status(409).json({
        success: false,
        message: `A Yagya service with slug '${finalSlug}' already exists.`,
      });
    }

    const newService = await YagyaService.create({
      name: String(name).trim(),
      slug: finalSlug,
      eyebrow: eyebrow ? String(eyebrow).trim() : null,
      tagline: tagline ? String(tagline).trim() : null,
      shortDescription: shortDescription ? String(shortDescription).trim() : null,
      fullDescription: fullDescription ? String(fullDescription).trim() : null,
      deity: String(deity).trim(),
      purposeId: purposeId || null,
      purposeSummary: purposeSummary ? String(purposeSummary).trim() : null,
      availableDurations: Array.isArray(availableDurations) ? availableDurations : [3, 5, 7],
      durationDisplay: durationDisplay ? String(durationDisplay).trim() : "3 / 5 / 7 Days",
      dailyRitualHours: parseInt(dailyRitualHours, 10) || 5,
      dailyHoursDisplay: dailyHoursDisplay ? String(dailyHoursDisplay).trim() : "5 Hours / Day",
      panditRequirement: panditRequirement || {},
      locationType: locationType ? String(locationType).trim() : "Kashi Kshetras & Sacred Mandaps",
      location: location ? String(location).trim() : "Kashi (Varanasi)",
      availableMode: VALID_MODES.includes(availableMode) ? availableMode : "hybrid",
      isKashiAvailable: Boolean(isKashiAvailable),
      isRemoteAvailable: Boolean(isRemoteAvailable),
      startingPrice: Number(startingPrice) || 0,
      pricingTiers: Array.isArray(pricingTiers) ? pricingTiers : [],
      isFeatured: Boolean(isFeatured),
      isActive: Boolean(isActive),
      bannerImage: bannerImage || null,
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      samagri: Array.isArray(samagri) ? samagri : [],
      prasad: prasad ? String(prasad).trim() : null,
      dailySchedule: Array.isArray(dailySchedule) ? dailySchedule : [],
      whatsIncluded: Array.isArray(whatsIncluded) ? whatsIncluded : [],
      whyPerform: Array.isArray(whyPerform) ? whyPerform : [],
      significance: Array.isArray(significance) ? significance : [],
      procedureSteps: Array.isArray(procedureSteps) ? procedureSteps : [],
      faqs: normalizeFaqs(faqs),
    });

    return res.status(201).json({
      success: true,
      message: "Yagya service created successfully.",
      data: serializeAdminYagyaServiceDetail(newService),
    });
  } catch (error) {
    console.error("Admin create yagya service error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Yagya service",
    });
  }
};

/**
 * PUT /api/admin/yagya-services/:id
 */
export const updateAdminYagyaService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Yagya service ID format.",
      });
    }

    const service = await YagyaService.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Yagya service not found.",
      });
    }

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
      availableDurations,
      durationDisplay,
      dailyRitualHours,
      dailyHoursDisplay,
      panditRequirement,
      locationType,
      location,
      availableMode,
      isKashiAvailable,
      isRemoteAvailable,
      startingPrice,
      pricingTiers,
      isFeatured,
      isActive,
      bannerImage,
      galleryImages,
      samagri,
      prasad,
      dailySchedule,
      whatsIncluded,
      whyPerform,
      significance,
      procedureSteps,
      faqs,
    } = req.body;

    if (name) service.name = String(name).trim();
    if (slug) {
      const sanitized = sanitizeSlug(slug);
      if (sanitized !== service.slug) {
        const conflict = await YagyaService.findOne({ where: { slug: sanitized } });
        if (conflict) {
          return res.status(409).json({
            success: false,
            message: `Slug '${sanitized}' is already in use.`,
          });
        }
        service.slug = sanitized;
      }
    }
    if (typeof eyebrow !== "undefined") service.eyebrow = eyebrow ? String(eyebrow).trim() : null;
    if (typeof tagline !== "undefined") service.tagline = tagline ? String(tagline).trim() : null;
    if (typeof shortDescription !== "undefined") service.shortDescription = shortDescription ? String(shortDescription).trim() : null;
    if (typeof fullDescription !== "undefined") service.fullDescription = fullDescription ? String(fullDescription).trim() : null;
    if (deity) service.deity = String(deity).trim();
    if (typeof purposeId !== "undefined") service.purposeId = purposeId || null;
    if (typeof purposeSummary !== "undefined") service.purposeSummary = purposeSummary ? String(purposeSummary).trim() : null;
    if (Array.isArray(availableDurations)) service.availableDurations = availableDurations;
    if (typeof durationDisplay !== "undefined") service.durationDisplay = durationDisplay ? String(durationDisplay).trim() : null;
    if (typeof dailyRitualHours !== "undefined") service.dailyRitualHours = parseInt(dailyRitualHours, 10) || 5;
    if (typeof dailyHoursDisplay !== "undefined") service.dailyHoursDisplay = dailyHoursDisplay ? String(dailyHoursDisplay).trim() : null;
    if (typeof panditRequirement !== "undefined") service.panditRequirement = panditRequirement;
    if (typeof locationType !== "undefined") service.locationType = locationType ? String(locationType).trim() : null;
    if (typeof location !== "undefined") service.location = location ? String(location).trim() : null;
    if (availableMode && VALID_MODES.includes(availableMode)) service.availableMode = availableMode;
    if (typeof isKashiAvailable !== "undefined") service.isKashiAvailable = Boolean(isKashiAvailable);
    if (typeof isRemoteAvailable !== "undefined") service.isRemoteAvailable = Boolean(isRemoteAvailable);
    if (typeof startingPrice !== "undefined") service.startingPrice = Number(startingPrice) || 0;
    if (Array.isArray(pricingTiers)) service.pricingTiers = pricingTiers;
    if (typeof isFeatured !== "undefined") service.isFeatured = Boolean(isFeatured);
    if (typeof isActive !== "undefined") service.isActive = Boolean(isActive);
    if (typeof bannerImage !== "undefined") service.bannerImage = bannerImage || null;
    if (Array.isArray(galleryImages)) service.galleryImages = galleryImages;
    if (Array.isArray(samagri)) service.samagri = samagri;
    if (typeof prasad !== "undefined") service.prasad = prasad ? String(prasad).trim() : null;
    if (Array.isArray(dailySchedule)) service.dailySchedule = dailySchedule;
    if (Array.isArray(whatsIncluded)) service.whatsIncluded = whatsIncluded;
    if (Array.isArray(whyPerform)) service.whyPerform = whyPerform;
    if (Array.isArray(significance)) service.significance = significance;
    if (Array.isArray(procedureSteps)) service.procedureSteps = procedureSteps;
    if (Array.isArray(faqs)) service.faqs = normalizeFaqs(faqs);

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Yagya service updated successfully.",
      data: serializeAdminYagyaServiceDetail(service),
    });
  } catch (error) {
    console.error("Admin update yagya service error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update Yagya service",
    });
  }
};

/**
 * DELETE /api/admin/yagya-services/:id
 * Soft delete (isActive: false)
 */
export const deleteAdminYagyaService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Yagya service ID format.",
      });
    }

    const service = await YagyaService.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Yagya service not found.",
      });
    }

    service.isActive = false;
    await service.save();

    return res.status(200).json({
      success: true,
      message: "Yagya service deactivated successfully (soft-delete).",
    });
  } catch (error) {
    console.error("Admin delete yagya service error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete Yagya service",
    });
  }
};
