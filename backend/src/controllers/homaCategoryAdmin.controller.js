import { Op } from "sequelize";
import { HomaCategory, HomaService } from "../models/index.js";
import { serializeAdminHomaCategory } from "../serializers/homaService.serializer.js";

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
 * GET /api/admin/homa-categories
 * Admin listing of all categories (both active and inactive)
 */
export const getAdminHomaCategories = async (req, res) => {
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

    const categories = await HomaCategory.findAll({
      where,
      order: [
        ["displayOrder", "ASC"],
        ["name", "ASC"],
      ],
    });

    const serialized = categories.map(serializeAdminHomaCategory);

    return res.status(200).json({
      success: true,
      count: serialized.length,
      data: serialized,
    });
  } catch (error) {
    console.error("Admin get homa categories error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve Homa categories",
    });
  }
};

/**
 * GET /api/admin/homa-categories/:id
 * Admin detail view of a single category by ID
 */
export const getAdminHomaCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format. Must be a valid UUID.",
      });
    }

    const category = await HomaCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Homa category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeAdminHomaCategory(category),
    });
  } catch (error) {
    console.error("Admin get homa category by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve Homa category details",
    });
  }
};

/**
 * POST /api/admin/homa-categories
 * Admin creation of a new Homa category
 */
export const createAdminHomaCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      image,
      iconName = "Flame",
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
    const existingName = await HomaCategory.findOne({
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

    const existingSlug = await HomaCategory.findOne({ where: { slug: formattedSlug } });
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
    const category = await HomaCategory.create({
      name: trimmedName,
      slug: formattedSlug,
      description: description ? String(description).trim() : null,
      image: image ? String(image).trim() : null,
      iconName: iconName ? String(iconName).trim() : "Flame",
      displayOrder: parsedOrder,
      isActive: Boolean(isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Homa category created successfully",
      data: serializeAdminHomaCategory(category),
    });
  } catch (error) {
    console.error("Admin create homa category error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create Homa category",
    });
  }
};

/**
 * PUT /api/admin/homa-categories/:id
 * Admin update of an existing category
 */
export const updateAdminHomaCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format. Must be a valid UUID.",
      });
    }

    const category = await HomaCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Homa category not found",
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
        const existingName = await HomaCategory.findOne({
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
        const existingSlug = await HomaCategory.findOne({
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
      updateFields.iconName = iconName ? String(iconName).trim() : "Flame";
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
      message: "Homa category updated successfully",
      data: serializeAdminHomaCategory(category),
    });
  } catch (error) {
    console.error("Admin update homa category error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update Homa category",
    });
  }
};

/**
 * DELETE /api/admin/homa-categories/:id
 * Admin deactivation (soft delete) of a category
 */
export const deleteAdminHomaCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format. Must be a valid UUID.",
      });
    }

    const category = await HomaCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Homa category not found",
      });
    }

    // Soft delete: Deactivate category so historical relationships and existing services are never broken
    await category.update({ isActive: false });

    return res.status(200).json({
      success: true,
      message: "Homa category deactivated successfully",
      data: {
        id: category.id,
        slug: category.slug,
        name: category.name,
        isActive: false,
      },
    });
  } catch (error) {
    console.error("Admin delete homa category error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to deactivate Homa category",
    });
  }
};

export default {
  getAdminHomaCategories,
  getAdminHomaCategoryById,
  createAdminHomaCategory,
  updateAdminHomaCategory,
  deleteAdminHomaCategory,
};
