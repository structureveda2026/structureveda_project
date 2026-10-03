import { PujaCategory } from "../models/index.js";
import { serializePublicPujaCategory } from "../serializers/pujaService.serializer.js";

/**
 * GET /api/puja-categories
 * Public list of all active Puja categories, deterministically ordered by displayOrder then name
 */
export const getPublicPujaCategories = async (req, res) => {
  try {
    const categories = await PujaCategory.findAll({
      where: {
        isActive: true,
      },
      order: [
        ["displayOrder", "ASC"],
        ["name", "ASC"],
      ],
    });

    const serialized = categories.map(serializePublicPujaCategory);

    return res.status(200).json({
      success: true,
      count: serialized.length,
      data: serialized,
    });
  } catch (error) {
    console.error("Public get puja categories error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load puja categories",
    });
  }
};

/**
 * GET /api/puja-categories/:slug
 * Public retrieval of a single active Puja category by its slug
 */
export const getPublicPujaCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || !String(slug).trim()) {
      return res.status(404).json({
        success: false,
        message: "Puja category not found",
      });
    }

    const category = await PujaCategory.findOne({
      where: {
        slug: String(slug).trim().toLowerCase(),
        isActive: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Puja category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializePublicPujaCategory(category),
    });
  } catch (error) {
    console.error("Public get puja category by slug error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load puja category details",
    });
  }
};
