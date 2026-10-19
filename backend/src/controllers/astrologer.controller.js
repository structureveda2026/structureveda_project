import { Astrologer, AstrologerPackage } from "../models/index.js";
import {
  serializePublicAstrologerListing,
  serializePublicAstrologerDetail,
  serializePublicAstrologerPackage,
} from "../serializers/astrologer.serializer.js";

/**
 * GET /api/astrologers
 * Lists all active astrologers with summary details and active package counts
 */
export const getPublicAstrologers = async (req, res) => {
  try {
    const astrologers = await Astrologer.findAll({
      where: {
        isActive: true,
      },
      order: [
        ["displayOrder", "ASC"],
        ["name", "ASC"],
      ],
      include: [
        {
          model: AstrologerPackage,
          as: "packages",
          where: { isActive: true },
          required: false,
        },
      ],
    });

    const data = astrologers.map(serializePublicAstrologerListing);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Error fetching public astrologers:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load astrologer profiles at this time.",
    });
  }
};

/**
 * GET /api/astrologers/:slug
 * Fetches one active astrologer profile by slug with all full bio data and active packages
 */
export const getPublicAstrologerBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== "string" || !slug.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid astrologer slug parameter is required.",
      });
    }

    const cleanSlug = slug.trim().toLowerCase();

    const astrologer = await Astrologer.findOne({
      where: {
        slug: cleanSlug,
        isActive: true,
      },
      include: [
        {
          model: AstrologerPackage,
          as: "packages",
          where: { isActive: true },
          required: false,
        },
      ],
    });

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: `Astrologer profile '${cleanSlug}' was not found or is currently inactive.`,
      });
    }

    const data = serializePublicAstrologerDetail(astrologer);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching public astrologer by slug:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load astrologer details at this time.",
    });
  }
};

/**
 * GET /api/astrologers/:slug/packages
 * Fetches active consultation packages for an active astrologer
 */
export const getPublicAstrologerPackages = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== "string" || !slug.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid astrologer slug parameter is required.",
      });
    }

    const cleanSlug = slug.trim().toLowerCase();

    const astrologer = await Astrologer.findOne({
      where: {
        slug: cleanSlug,
        isActive: true,
      },
      attributes: ["id", "code", "slug", "name"],
    });

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: `Astrologer '${cleanSlug}' was not found or is currently inactive.`,
      });
    }

    const packages = await AstrologerPackage.findAll({
      where: {
        astrologerId: astrologer.id,
        isActive: true,
      },
      order: [
        ["displayOrder", "ASC"],
        ["price", "ASC"],
      ],
    });

    const data = packages.map(serializePublicAstrologerPackage);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Error fetching astrologer packages:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load consultation packages at this time.",
    });
  }
};

/**
 * GET /api/astrologers/:slug/slots
 * Fetches available booking slots and working hours for an active astrologer
 */
export const getPublicAstrologerSlots = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== "string" || !slug.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid astrologer slug parameter is required.",
      });
    }

    const cleanSlug = slug.trim().toLowerCase();

    const astrologer = await Astrologer.findOne({
      where: {
        slug: cleanSlug,
        isActive: true,
      },
      attributes: ["id", "code", "slug", "name", "availableTimeSlots"],
    });

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: `Astrologer '${cleanSlug}' was not found or is currently inactive.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        astrologerCode: astrologer.code,
        astrologerName: astrologer.name,
        availableTimeSlots: Array.isArray(astrologer.availableTimeSlots)
          ? astrologer.availableTimeSlots
          : [],
      },
    });
  } catch (error) {
    console.error("Error fetching astrologer slots:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load consultation slots at this time.",
    });
  }
};
