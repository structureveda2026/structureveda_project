import { PathCategory } from "../models/index.js";
import { serializePublicPathCategory } from "../serializers/pathService.serializer.js";

/**
 * GET /api/path-categories
 * Public list of all active Path categories, deterministically ordered by displayOrder then name
 */
export const getPublicPathCategories = async (req, res) => {
  try {
    const categories = await PathCategory.findAll({
      where: {
        isActive: true,
      },
      order: [
        ["displayOrder", "ASC"],
        ["name", "ASC"],
      ],
    });

    const serialized = categories.map(serializePublicPathCategory);

    return res.status(200).json({
      success: true,
      count: serialized.length,
      data: serialized,
    });
  } catch (error) {
    console.error("Public get path categories error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load path categories",
    });
  }
};

/**
 * GET /api/path-categories/:slug
 * Public retrieval of a single active Path category by its slug
 */
export const getPublicPathCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || !String(slug).trim()) {
      return res.status(404).json({
        success: false,
        message: "Path category not found",
      });
    }

    const category = await PathCategory.findOne({
      where: {
        slug: String(slug).trim().toLowerCase(),
        isActive: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Path category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializePublicPathCategory(category),
    });
  } catch (error) {
    console.error("Public get path category by slug error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load path category details",
    });
  }
};

export default {
  getPublicPathCategories,
  getPublicPathCategoryBySlug,
};
