import { Op } from "sequelize";
import { JapaCategory, JapaService } from "../models/index.js";
import { serializeAdminJapaCategory } from "../serializers/japaService.serializer.js";

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
 * GET /api/admin/japa-categories
 * Admin listing of all categories (both active and inactive)
 */
export const getAdminJapaCategories = async (req, res) => {
  try {
    const { isActive, search } = req.query;

    const where = {};

    if (typeof isActive !== "undefined" && isActive !== "") {
      const trimmedActive = String(isActive).trim().toLowerCase();
      if (trimmedActive === "true" || trimmedActive === "false") {
        where.isActive = trimmedActive === "true";
      }
    }

    if (search && String(search).trim()) {
      const searchTerm = `%${String(search).trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchTerm } },
        { slug: { [Op.iLike]: searchTerm } },
        { description: { [Op.iLike]: searchTerm } },
      ];
    }

    const categories = await JapaCategory.findAll({
      where,
      order: [
        ["displayOrder", "ASC"],
        ["name", "ASC"],
      ],
    });

    const serialized = categories.map(serializeAdminJapaCategory);

    return res.status(200).json({
      success: true,
      count: serialized.length,
      data: serialized,
    });
  } catch (error) {
    console.error("Admin get japa categories error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve Japa categories",
    });
  }
};

/**
 * GET /api/admin/japa-categories/:id
 * Admin detail view of a single category by ID
 */
export const getAdminJapaCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format. Must be a valid UUID.",
      });
    }

    const category = await JapaCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Japa category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeAdminJapaCategory(category),
    });
  } catch (error) {
    console.error("Admin get japa category by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve Japa category details",
    });
  }
};

/**
 * POST /api/admin/japa-categories
 * Admin creation of a new Japa category
 */
export const createAdminJapaCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      image,
      iconName = "Sparkles",
      displayOrder = 0,
      isActive = true,
    } = req.body;

    // 1. Name validation
    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    // 2. Slug sanitization & uniqueness
    const rawSlug = slug || name;
    const formattedSlug = sanitizeSlug(rawSlug);
    if (!formattedSlug) {
      return res.status(400).json({
        success: false,
        message: "A valid non-empty slug is required.",
      });
    }

    const existingSlug = await JapaCategory.findOne({ where: { slug: formattedSlug } });
    if (existingSlug) {
      return res.status(409).json({
        success: false,
        message: "A category with this slug already exists.",
      });
    }

    // 3. Display order validation
    let parsedOrder = 0;
    if (typeof displayOrder !== "undefined" && displayOrder !== null && displayOrder !== "") {
      parsedOrder = parseInt(displayOrder, 10);
      if (isNaN(parsedOrder)) {
        return res.status(400).json({
          success: false,
          message: "displayOrder must be an integer.",
        });
      }
    }

    // 4. Create category
    const category = await JapaCategory.create({
      name: String(name).trim(),
      slug: formattedSlug,
      description: description ? String(description).trim() : null,
      image: image ? String(image).trim() : null,
      iconName: iconName ? String(iconName).trim() : "Sparkles",
      displayOrder: parsedOrder,
      isActive: Boolean(isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Japa category created successfully",
      data: serializeAdminJapaCategory(category),
    });
  } catch (error) {
    console.error("Admin create japa category error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create Japa category",
    });
  }
};

/**
 * PUT /api/admin/japa-categories/:id
 * Admin update of an existing category
 */
export const updateAdminJapaCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format. Must be a valid UUID.",
      });
    }

    const category = await JapaCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Japa category not found",
      });
    }

    const {
      name,
      slug,
      description,
      image,
      iconName,
      displayOrder,
      isActive,
    } = req.body;

    const updateFields = {};

    if (typeof name !== "undefined") {
      if (!name || !String(name).trim()) {
        return res.status(400).json({
          success: false,
          message: "Category name cannot be empty.",
        });
      }
      updateFields.name = String(name).trim();
    }

    if (typeof slug !== "undefined") {
      const formattedSlug = sanitizeSlug(slug);
      if (!formattedSlug) {
        return res.status(400).json({
          success: false,
          message: "A valid non-empty slug is required.",
        });
      }

      if (formattedSlug !== category.slug) {
        const existingSlug = await JapaCategory.findOne({
          where: {
            slug: formattedSlug,
            id: { [Op.ne]: id },
          },
        });
        if (existingSlug) {
          return res.status(409).json({
            success: false,
            message: "A category with this slug already exists.",
          });
        }
        updateFields.slug = formattedSlug;
      }
    }

    if (typeof description !== "undefined") {
      updateFields.description = description ? String(description).trim() : null;
    }

    if (typeof image !== "undefined") {
      updateFields.image = image ? String(image).trim() : null;
    }

    if (typeof iconName !== "undefined") {
      updateFields.iconName = iconName ? String(iconName).trim() : "Sparkles";
    }

    if (typeof displayOrder !== "undefined") {
      const parsedOrder = parseInt(displayOrder, 10);
      if (isNaN(parsedOrder)) {
        return res.status(400).json({
          success: false,
          message: "displayOrder must be an integer.",
        });
      }
      updateFields.displayOrder = parsedOrder;
    }

    if (typeof isActive !== "undefined") {
      updateFields.isActive = Boolean(isActive);
    }

    await category.update(updateFields);

    return res.status(200).json({
      success: true,
      message: "Japa category updated successfully",
      data: serializeAdminJapaCategory(category),
    });
  } catch (error) {
    console.error("Admin update japa category error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update Japa category",
    });
  }
};

/**
 * DELETE /api/admin/japa-categories/:id
 * Admin deactivation (soft delete) of a category
 */
export const deleteAdminJapaCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format. Must be a valid UUID.",
      });
    }

    const category = await JapaCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Japa category not found",
      });
    }

    // Soft delete: Deactivate category so historical relationships and existing services are never broken
    await category.update({ isActive: false });

    return res.status(200).json({
      success: true,
      message: "Japa category deactivated successfully",
      data: {
        id: category.id,
        slug: category.slug,
        name: category.name,
        isActive: false,
      },
    });
  } catch (error) {
    console.error("Admin delete japa category error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to deactivate Japa category",
    });
  }
};
