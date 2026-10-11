import { YagyaCategory } from "../models/index.js";
import { serializePublicYagyaCategory } from "../serializers/yagyaService.serializer.js";

/**
 * GET /api/yagya-categories
 * Public list of all active Yagya categories, deterministically ordered by displayOrder then name
 */
export const getPublicYagyaCategories = async (req, res) => {
  try {
    const categories = await YagyaCategory.findAll({
      where: {
        isActive: true,
      },
      order: [
        ["displayOrder", "ASC"],
        ["name", "ASC"],
      ],
    });

    const serialized = categories.map(serializePublicYagyaCategory);

    return res.status(200).json({
      success: true,
      count: serialized.length,
      data: serialized,
    });
  } catch (error) {
    console.error("Public get yagya categories error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load yagya categories",
    });
  }
};

/**
 * GET /api/yagya-categories/:slug
 * Public retrieval of a single active Yagya category by its slug
 */
export const getPublicYagyaCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || !String(slug).trim()) {
      return res.status(404).json({
        success: false,
        message: "Yagya category not found",
      });
    }

    const category = await YagyaCategory.findOne({
      where: {
        slug: String(slug).trim().toLowerCase(),
        isActive: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Yagya category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializePublicYagyaCategory(category),
    });
  } catch (error) {
    console.error("Public get yagya category by slug error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load yagya category details",
    });
  }
};
