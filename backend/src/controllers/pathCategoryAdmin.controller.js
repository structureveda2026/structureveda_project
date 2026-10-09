import { Op } from "sequelize";
import { PathCategory, PathService } from "../models/index.js";
import { serializeAdminPathCategory } from "../serializers/pathService.serializer.js";

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
 * GET /api/admin/path-categories
 * Admin listing of all categories (both active and inactive)
 */
export const getAdminPathCategories = async (req, res) => {
  try {
    const { isActive, status, search } = req.query;

    const where = {};

    const activeParam = typeof isActive !== "undefined" && isActive !== "" ? isActive : status;
    if (typeof activeParam !== "undefined" && activeParam !== "") {
      const trimmedActive = String(activeParam).trim().toLowerCase();
      if (trimmedActive === "true" || trimmedActive === "active") {
        where.isActive = true;
      } else if (trimmedActive === "false" || trimmedActive === "inactive") {
        where.isActive = false;
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

    const categories = await PathCategory.findAll({
      where,
      order: [
        ["displayOrder", "ASC"],
        ["name", "ASC"],
      ],
    });

    const serialized = categories.map(serializeAdminPathCategory);

    return res.status(200).json({
      success: true,
      count: serialized.length,
      data: serialized,
    });
  } catch (error) {
    console.error("Admin get path categories error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve Path categories",
    });
  }
};

/**
 * GET /api/admin/path-categories/:id
 * Admin detail view of a single category by ID
 */
export const getAdminPathCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format. Must be a valid UUID.",
      });
    }

    const category = await PathCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Path category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeAdminPathCategory(category),
    });
  } catch (error) {
    console.error("Admin get path category by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve Path category details",
    });
  }
};

/**
 * POST /api/admin/path-categories
 * Admin creation of a new Path category
 */
export const createAdminPathCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      image,
      iconName = "BookOpen",
      displayOrder = 0,
      isActive = true,
    } = req.body;

    // 1. Name validation & uniqueness
    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const trimmedName = String(name).trim();
    const existingName = await PathCategory.findOne({
      where: { name: { [Op.iLike]: trimmedName } },
    });
    if (existingName) {
      return res.status(409).json({
        success: false,
        message: "A category with this name already exists.",
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

    const existingSlug = await PathCategory.findOne({ where: { slug: formattedSlug } });
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
    const category = await PathCategory.create({
      name: trimmedName,
      slug: formattedSlug,
      description: description ? String(description).trim() : null,
      image: image ? String(image).trim() : null,
      iconName: iconName ? String(iconName).trim() : "BookOpen",
      displayOrder: parsedOrder,
      isActive: Boolean(isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Path category created successfully",
      data: serializeAdminPathCategory(category),
    });
  } catch (error) {
    console.error("Admin create path category error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create Path category",
    });
  }
};

/**
 * PUT /api/admin/path-categories/:id
 * Admin update of an existing category
 */
export const updateAdminPathCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format. Must be a valid UUID.",
      });
    }

    const category = await PathCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Path category not found",
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
      const trimmedName = String(name).trim();
      if (trimmedName.toLowerCase() !== category.name.toLowerCase()) {
        const existingName = await PathCategory.findOne({
          where: {
            name: { [Op.iLike]: trimmedName },
            id: { [Op.ne]: id },
          },
        });
        if (existingName) {
          return res.status(409).json({
            success: false,
            message: "A category with this name already exists.",
          });
        }
      }
      updateFields.name = trimmedName;
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
        const existingSlug = await PathCategory.findOne({
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
      }
      updateFields.slug = formattedSlug;
    }

    if (typeof description !== "undefined") {
      updateFields.description = description ? String(description).trim() : null;
    }

    if (typeof image !== "undefined") {
      updateFields.image = image ? String(image).trim() : null;
    }

    if (typeof iconName !== "undefined") {
      updateFields.iconName = iconName ? String(iconName).trim() : "BookOpen";
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
      message: "Path category updated successfully",
      data: serializeAdminPathCategory(category),
    });
  } catch (error) {
    console.error("Admin update path category error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update Path category",
    });
  }
};

/**
 * DELETE /api/admin/path-categories/:id
 * Admin deactivation (soft delete) of a category
 */
export const deleteAdminPathCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format. Must be a valid UUID.",
      });
    }

    const category = await PathCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Path category not found",
      });
    }

    // Soft delete: Deactivate category so historical relationships and existing services are never broken
    await category.update({ isActive: false });

    return res.status(200).json({
      success: true,
      message: "Path category deactivated successfully",
      data: {
        id: category.id,
        slug: category.slug,
        name: category.name,
        isActive: false,
      },
    });
  } catch (error) {
    console.error("Admin delete path category error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to deactivate Path category",
    });
  }
};

export default {
  getAdminPathCategories,
  getAdminPathCategoryById,
  createAdminPathCategory,
  updateAdminPathCategory,
  deleteAdminPathCategory,
};
