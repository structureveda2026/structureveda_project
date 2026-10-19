import { Op } from "sequelize";
import { Astrologer, AstrologerPackage } from "../models/index.js";
import {
  serializeAdminAstrologerListing,
  serializeAdminAstrologerDetail,
} from "../serializers/astrologer.serializer.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const findAstrologerByIdOrIdentifier = async (identifier) => {
  if (!identifier) return null;
  const cleanId = String(identifier).trim();

  if (UUID_REGEX.test(cleanId)) {
    const byPk = await Astrologer.findByPk(cleanId, {
      include: [{ model: AstrologerPackage, as: "packages" }],
    });
    if (byPk) return byPk;
  }

  // Fallback lookup by code or slug
  return await Astrologer.findOne({
    where: {
      [Op.or]: [{ code: cleanId }, { slug: cleanId }],
    },
    include: [{ model: AstrologerPackage, as: "packages" }],
  });
};

/**
 * GET /api/admin/astrologers
 * Lists all astrologers (active & inactive) with optional filters and sorting
 */
export const getAdminAstrologers = async (req, res) => {
  try {
    const { search, isActive, sortBy = "displayOrder-asc" } = req.query;

    const where = {};

    // 1. Status Filter
    if (typeof isActive !== "undefined" && isActive !== "") {
      if (isActive === "true" || isActive === true) {
        where.isActive = true;
      } else if (isActive === "false" || isActive === false) {
        where.isActive = false;
      }
    }

    // 2. Search Filter
    if (search && typeof search === "string" && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: term } },
        { title: { [Op.iLike]: term } },
        { slug: { [Op.iLike]: term } },
        { code: { [Op.iLike]: term } },
        { holySeat: { [Op.iLike]: term } },
        { location: { [Op.iLike]: term } },
      ];
    }

    // 3. Sorting
    let order = [["displayOrder", "ASC"], ["name", "ASC"]];
    if (sortBy === "name-asc") {
      order = [["name", "ASC"]];
    } else if (sortBy === "name-desc") {
      order = [["name", "DESC"]];
    } else if (sortBy === "experience-desc") {
      order = [["experienceYears", "DESC"]];
    } else if (sortBy === "created-newest") {
      order = [["createdAt", "DESC"]];
    } else if (sortBy === "created-oldest") {
      order = [["createdAt", "ASC"]];
    }

    const astrologers = await Astrologer.findAll({
      where,
      order,
      include: [{ model: AstrologerPackage, as: "packages" }],
    });

    const data = astrologers.map(serializeAdminAstrologerListing);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Admin: Error fetching astrologers:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load astrologers catalogue.",
    });
  }
};

/**
 * GET /api/admin/astrologers/:id
 * Fetches full profile details for an astrologer by id/slug/code
 */
export const getAdminAstrologerById = async (req, res) => {
  try {
    const { id } = req.params;
    const astrologer = await findAstrologerByIdOrIdentifier(id);

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: `Astrologer '${id}' was not found.`,
      });
    }

    const data = serializeAdminAstrologerDetail(astrologer);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Admin: Error fetching astrologer by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load astrologer details.",
    });
  }
};

/**
 * PATCH /api/admin/astrologers/:id
 * Updates allowed profile fields for an astrologer
 */
export const updateAdminAstrologer = async (req, res) => {
  try {
    const { id } = req.params;
    const astrologer = await findAstrologerByIdOrIdentifier(id);

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: `Astrologer '${id}' was not found.`,
      });
    }

    const body = req.body || {};
    const updates = {};

    // Validate and sanitize supported fields
    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name must be a non-empty string.",
        });
      }
      updates.name = body.name.trim();
    }

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title must be a non-empty string.",
        });
      }
      updates.title = body.title.trim();
    }

    if (body.eyebrow !== undefined) {
      updates.eyebrow = typeof body.eyebrow === "string" ? body.eyebrow.trim() : null;
    }

    if (body.quote !== undefined) {
      updates.quote = typeof body.quote === "string" ? body.quote.trim() : null;
    }

    if (body.description !== undefined) {
      updates.description = typeof body.description === "string" ? body.description.trim() : null;
    }

    if (body.experienceYears !== undefined) {
      const exp = parseInt(body.experienceYears, 10);
      if (isNaN(exp) || exp < 0) {
        return res.status(400).json({
          success: false,
          message: "Experience years must be a non-negative integer.",
        });
      }
      updates.experienceYears = exp;
    }

    if (body.holySeat !== undefined) {
      if (typeof body.holySeat !== "string" || !body.holySeat.trim()) {
        return res.status(400).json({
          success: false,
          message: "Holy Seat must be a non-empty string.",
        });
      }
      updates.holySeat = body.holySeat.trim();
    }

    if (body.location !== undefined) {
      updates.location = typeof body.location === "string" ? body.location.trim() : "India";
    }

    if (body.rating !== undefined) {
      const r = parseFloat(body.rating);
      if (isNaN(r) || r < 0 || r > 5.0) {
        return res.status(400).json({
          success: false,
          message: "Rating must be a number between 0.0 and 5.0.",
        });
      }
      updates.rating = r;
    }

    if (body.reviewsCount !== undefined) {
      updates.reviewsCount = String(body.reviewsCount || "0+").trim();
    }

    if (body.sessionsCount !== undefined) {
      updates.sessionsCount = String(body.sessionsCount || "0+").trim();
    }

    if (body.profileImage !== undefined) {
      updates.profileImage = typeof body.profileImage === "string" && body.profileImage.trim() ? body.profileImage.trim() : null;
    }

    if (body.portraitImage !== undefined) {
      updates.portraitImage = typeof body.portraitImage === "string" && body.portraitImage.trim() ? body.portraitImage.trim() : null;
    }

    if (body.secondaryImage !== undefined) {
      updates.secondaryImage = typeof body.secondaryImage === "string" && body.secondaryImage.trim() ? body.secondaryImage.trim() : null;
    }

    if (body.languages !== undefined) {
      if (!Array.isArray(body.languages)) {
        return res.status(400).json({
          success: false,
          message: "Languages must be an array of strings.",
        });
      }
      updates.languages = body.languages.map(String).map((s) => s.trim()).filter(Boolean);
    }

    if (body.specializations !== undefined) {
      if (!Array.isArray(body.specializations)) {
        return res.status(400).json({
          success: false,
          message: "Specializations must be an array of strings.",
        });
      }
      updates.specializations = body.specializations.map(String).map((s) => s.trim()).filter(Boolean);
    }

    if (body.expertise !== undefined) {
      if (!Array.isArray(body.expertise)) {
        return res.status(400).json({
          success: false,
          message: "Expertise must be an array of strings.",
        });
      }
      updates.expertise = body.expertise.map(String).map((s) => s.trim()).filter(Boolean);
    }

    if (body.bioParagraphs !== undefined) {
      if (!Array.isArray(body.bioParagraphs)) {
        return res.status(400).json({
          success: false,
          message: "Bio paragraphs must be an array of strings.",
        });
      }
      updates.bioParagraphs = body.bioParagraphs.map(String).map((s) => s.trim()).filter(Boolean);
    }

    if (body.pillars !== undefined) {
      if (!Array.isArray(body.pillars)) {
        return res.status(400).json({
          success: false,
          message: "Pillars must be an array of objects ({ title, desc }).",
        });
      }
      updates.pillars = body.pillars.map((item) => ({
        title: typeof item.title === "string" ? item.title.trim() : "",
        desc: typeof item.desc === "string" ? item.desc.trim() : (typeof item.description === "string" ? item.description.trim() : ""),
      })).filter((p) => p.title || p.desc);
    }

    if (body.faqs !== undefined) {
      if (!Array.isArray(body.faqs)) {
        return res.status(400).json({
          success: false,
          message: "FAQs must be an array of objects ({ q, a }).",
        });
      }
      updates.faqs = body.faqs.map((item) => ({
        q: typeof item.q === "string" ? item.q.trim() : (typeof item.question === "string" ? item.question.trim() : ""),
        a: typeof item.a === "string" ? item.a.trim() : (typeof item.answer === "string" ? item.answer.trim() : ""),
      })).filter((f) => f.q || f.a);
    }

    if (body.availableTimeSlots !== undefined) {
      if (!Array.isArray(body.availableTimeSlots)) {
        return res.status(400).json({
          success: false,
          message: "Available time slots must be an array of strings.",
        });
      }
      updates.availableTimeSlots = body.availableTimeSlots.map(String).map((s) => s.trim()).filter(Boolean);
    }

    if (body.addOnPricing !== undefined) {
      if (typeof body.addOnPricing !== "object" || body.addOnPricing === null || Array.isArray(body.addOnPricing)) {
        return res.status(400).json({
          success: false,
          message: "Add-on pricing must be an object with numeric prices.",
        });
      }
      const rawAddOns = body.addOnPricing;
      const sanitizedAddOns = {};
      for (const [key, val] of Object.entries(rawAddOns)) {
        const num = Number(val);
        if (!isNaN(num) && num >= 0) {
          sanitizedAddOns[key] = num;
        }
      }
      updates.addOnPricing = sanitizedAddOns;
    }

    if (body.displayOrder !== undefined) {
      const orderNum = parseInt(body.displayOrder, 10);
      if (isNaN(orderNum) || orderNum < 0) {
        return res.status(400).json({
          success: false,
          message: "Display order must be a non-negative integer.",
        });
      }
      updates.displayOrder = orderNum;
    }

    if (body.isActive !== undefined) {
      if (typeof body.isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be a boolean (true or false).",
        });
      }
      updates.isActive = body.isActive;
    }

    // Apply updates
    await astrologer.update(updates);

    // Reload with associations
    await astrologer.reload({
      include: [{ model: AstrologerPackage, as: "packages" }],
    });

    const data = serializeAdminAstrologerDetail(astrologer);

    return res.status(200).json({
      success: true,
      message: "Astrologer profile updated successfully.",
      data,
    });
  } catch (error) {
    console.error("Admin: Error updating astrologer:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update astrologer profile.",
    });
  }
};

/**
 * PATCH /api/admin/astrologers/:id/status
 * Quick toggle for astrologer active status
 */
export const updateAdminAstrologerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive boolean parameter is required in request body.",
      });
    }

    const astrologer = await findAstrologerByIdOrIdentifier(id);

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: `Astrologer '${id}' was not found.`,
      });
    }

    await astrologer.update({ isActive });

    return res.status(200).json({
      success: true,
      message: `Astrologer has been ${isActive ? "activated" : "deactivated"} successfully.`,
      data: {
        id: astrologer.id,
        code: astrologer.code,
        slug: astrologer.slug,
        isActive: astrologer.isActive,
      },
    });
  } catch (error) {
    console.error("Admin: Error toggling astrologer status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update astrologer status.",
    });
  }
};

/**
 * POST /api/admin/astrologers
 * Creates a new astrologer profile with validation and conflict checks
 */
export const createAdminAstrologer = async (req, res) => {
  try {
    const body = req.body || {};

    // 1. Mandatory Fields
    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Astrologer name is required.",
      });
    }

    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Astrologer title/credential is required.",
      });
    }

    const trimmedName = body.name.trim();

    // 2. Slug generation / sanitization
    let candidateSlug =
      body.slug && typeof body.slug === "string" && body.slug.trim()
        ? body.slug
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
        : trimmedName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

    if (!candidateSlug) {
      candidateSlug = `astrologer-${Date.now()}`;
    }

    // 3. Code generation / sanitization
    let candidateCode =
      body.code && typeof body.code === "string" && body.code.trim()
        ? body.code
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_-]+/g, "-")
            .replace(/^-|-$/g, "")
        : `ast-${candidateSlug.slice(0, 30)}`;

    // Check for existing slug or code
    const existing = await Astrologer.findOne({
      where: {
        [Op.or]: [{ slug: candidateSlug }, { code: candidateCode }],
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `An astrologer with slug '${candidateSlug}' or code '${candidateCode}' already exists.`,
      });
    }

    // 4. Sanitize arrays and objects
    const languages = Array.isArray(body.languages)
      ? body.languages
          .map(String)
          .map((s) => s.trim())
          .filter(Boolean)
      : ["Hindi", "English"];

    const specializations = Array.isArray(body.specializations)
      ? body.specializations
          .map(String)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const expertise = Array.isArray(body.expertise)
      ? body.expertise
          .map(String)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const bioParagraphs = Array.isArray(body.bioParagraphs)
      ? body.bioParagraphs
          .map(String)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const pillars = Array.isArray(body.pillars)
      ? body.pillars
          .map((item) => ({
            title: typeof item.title === "string" ? item.title.trim() : "",
            desc:
              typeof item.desc === "string"
                ? item.desc.trim()
                : typeof item.description === "string"
                ? item.description.trim()
                : "",
          }))
          .filter((p) => p.title || p.desc)
      : [];

    const faqs = Array.isArray(body.faqs)
      ? body.faqs
          .map((item) => ({
            q:
              typeof item.q === "string"
                ? item.q.trim()
                : typeof item.question === "string"
                ? item.question.trim()
                : "",
            a:
              typeof item.a === "string"
                ? item.a.trim()
                : typeof item.answer === "string"
                ? item.answer.trim()
                : "",
          }))
          .filter((f) => f.q || f.a)
      : [];

    const availableTimeSlots = Array.isArray(body.availableTimeSlots)
      ? body.availableTimeSlots
          .map(String)
          .map((s) => s.trim())
          .filter(Boolean)
      : [
          "10:00 AM - 10:30 AM",
          "11:30 AM - 12:00 PM",
          "02:00 PM - 02:30 PM",
          "03:30 PM - 04:00 PM",
          "05:00 PM - 05:30 PM",
          "06:30 PM - 07:00 PM",
          "08:00 PM - 08:30 PM",
        ];

    const addOnPricing =
      typeof body.addOnPricing === "object" &&
      body.addOnPricing !== null &&
      !Array.isArray(body.addOnPricing)
        ? body.addOnPricing
        : { addOnCouple: 3100, addOnReport: 500, addOnExpress: 400 };

    const newAstrologer = await Astrologer.create({
      code: candidateCode,
      slug: candidateSlug,
      name: trimmedName,
      title: body.title.trim(),
      eyebrow: typeof body.eyebrow === "string" ? body.eyebrow.trim() : null,
      quote: typeof body.quote === "string" ? body.quote.trim() : null,
      description:
        typeof body.description === "string" ? body.description.trim() : null,
      experienceYears: !isNaN(Number(body.experienceYears))
        ? Math.max(0, Number(body.experienceYears))
        : 0,
      holySeat:
        typeof body.holySeat === "string" && body.holySeat.trim()
          ? body.holySeat.trim()
          : "Vedic Tradition",
      location:
        typeof body.location === "string" && body.location.trim()
          ? body.location.trim()
          : "India",
      languages,
      specializations,
      expertise,
      rating: !isNaN(Number(body.rating))
        ? Math.min(5.0, Math.max(1.0, Number(body.rating)))
        : 5.0,
      reviewsCount:
        typeof body.reviewsCount === "string" && body.reviewsCount.trim()
          ? body.reviewsCount.trim()
          : "0+",
      sessionsCount:
        typeof body.sessionsCount === "string" && body.sessionsCount.trim()
          ? body.sessionsCount.trim()
          : "0+",
      profileImage:
        typeof body.profileImage === "string" ? body.profileImage.trim() : null,
      portraitImage:
        typeof body.portraitImage === "string"
          ? body.portraitImage.trim()
          : null,
      secondaryImage:
        typeof body.secondaryImage === "string"
          ? body.secondaryImage.trim()
          : null,
      bioParagraphs,
      pillars,
      faqs,
      availableTimeSlots,
      addOnPricing,
      displayOrder: !isNaN(Number(body.displayOrder))
        ? Math.max(0, Number(body.displayOrder))
        : 1,
      isActive: typeof body.isActive === "boolean" ? body.isActive : true,
    });

    const data = serializeAdminAstrologerDetail(newAstrologer);

    return res.status(201).json({
      success: true,
      message: "Astrologer profile created successfully.",
      data,
    });
  } catch (error) {
    console.error("Admin: Error creating astrologer:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "An astrologer with this code or slug already exists.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create astrologer profile.",
    });
  }
};
