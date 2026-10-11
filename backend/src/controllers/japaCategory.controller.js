import { JapaCategory } from "../models/index.js";
import { serializePublicJapaCategory } from "../serializers/japaService.serializer.js";

/**
 * GET /api/japa-categories
 * Public list of all active Japa categories, deterministically ordered by displayOrder then name
 */
export const getPublicJapaCategories = async (req, res) => {
  try {
    const categories = await JapaCategory.findAll({
      where: {
        isActive: true,
      },
      order: [
        ["displayOrder", "ASC"],
        ["name", "ASC"],
      ],
    });

    const serialized = categories.map(serializePublicJapaCategory);

    return res.status(200).json({
      success: true,
      count: serialized.length,
      data: serialized,
    });
  } catch (error) {
    console.error("Public get japa categories error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load japa categories",
    });
  }
};

/**
 * GET /api/japa-categories/:slug
 * Public retrieval of a single active Japa category by its slug
 */
export const getPublicJapaCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || !String(slug).trim()) {
      return res.status(404).json({
        success: false,
        message: "Japa category not found",
      });
    }

    const category = await JapaCategory.findOne({
      where: {
        slug: String(slug).trim().toLowerCase(),
        isActive: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Japa category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializePublicJapaCategory(category),
    });
  } catch (error) {
    console.error("Public get japa category by slug error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load japa category details",
    });
  }
};
