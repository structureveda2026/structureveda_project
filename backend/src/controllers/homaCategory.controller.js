import { HomaCategory } from "../models/index.js";
import { serializePublicHomaCategory } from "../serializers/homaService.serializer.js";

/**
 * GET /api/homa-categories
 * Public list of all active Homa categories, deterministically ordered by displayOrder then name
 */
export const getPublicHomaCategories = async (req, res) => {
  try {
    const categories = await HomaCategory.findAll({
      where: {
        isActive: true,
      },
      order: [
        ["displayOrder", "ASC"],
        ["name", "ASC"],
      ],
    });

    const serialized = categories.map(serializePublicHomaCategory);

    return res.status(200).json({
      success: true,
      count: serialized.length,
      data: serialized,
    });
  } catch (error) {
    console.error("Public get homa categories error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load homa categories",
    });
  }
};

/**
 * GET /api/homa-categories/:slug
 * Public retrieval of a single active Homa category by its slug
 */
export const getPublicHomaCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || !String(slug).trim()) {
      return res.status(404).json({
        success: false,
        message: "Homa category not found",
      });
    }

    const category = await HomaCategory.findOne({
      where: {
        slug: String(slug).trim().toLowerCase(),
        isActive: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Homa category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializePublicHomaCategory(category),
    });
  } catch (error) {
    console.error("Public get homa category by slug error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load homa category details",
    });
  }
};

export default {
  getPublicHomaCategories,
  getPublicHomaCategoryBySlug,
};
