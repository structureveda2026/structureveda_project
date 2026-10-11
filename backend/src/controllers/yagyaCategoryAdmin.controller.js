import { Op } from "sequelize";
import { YagyaCategory, YagyaService } from "../models/index.js";
import { serializeAdminYagyaCategory } from "../serializers/yagyaService.serializer.js";

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
 * GET /api/admin/yagya-categories
 * Admin listing of all categories (both active and inactive)
 */
export const getAdminYagyaCategories = async (req, res) => {
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

    const categories = await YagyaCategory.findAll({
      where,
      order: [
        ["displayOrder", "ASC"],
        ["name", "ASC"],
      ],
    });

    const serialized = categories.map(serializeAdminYagyaCategory);

    return res.status(200).json({
      success: true,
      count: serialized.length,
      data: serialized,
    });
  } catch (error) {
    console.error("Admin get yagya categories error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve Yagya categories",
    });
  }
};

/**
 * GET /api/admin/yagya-categories/:id
 * Admin detail view of a single category by ID
 */
export const getAdminYagyaCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format. Must be a valid UUID.",
      });
    }

    const category = await YagyaCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Yagya category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeAdminYagyaCategory(category),
    });
  } catch (error) {
    console.error("Admin get yagya category by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve Yagya category details",
    });
  }
};

/**
 * POST /api/admin/yagya-categories
 * Admin creation of a new Yagya category
 */
export const createAdminYagyaCategory = async (req, res) => {
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

    const existingSlug = await YagyaCategory.findOne({ where: { slug: formattedSlug } });
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
    const category = await YagyaCategory.create({
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
      message: "Yagya category created successfully",
      data: serializeAdminYagyaCategory(category),
    });
  } catch (error) {
    console.error("Admin create yagya category error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create Yagya category",
    });
  }
};

/**
 * PUT /api/admin/yagya-categories/:id
 * Admin update of an existing category
 */
export const updateAdminYagyaCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format. Must be a valid UUID.",
      });
    }

    const category = await YagyaCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Yagya category not found",
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
        const existingSlug = await YagyaCategory.findOne({
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
      message: "Yagya category updated successfully",
      data: serializeAdminYagyaCategory(category),
    });
  } catch (error) {
    console.error("Admin update yagya category error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update Yagya category",
    });
  }
};

/**
 * DELETE /api/admin/yagya-categories/:id
 * Admin deactivation (soft delete) of a category
 */
export const deleteAdminYagyaCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format. Must be a valid UUID.",
      });
    }

    const category = await YagyaCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Yagya category not found",
      });
    }

    // Soft delete: Deactivate category so historical relationships and existing services are never broken
    await category.update({ isActive: false });

    return res.status(200).json({
      success: true,
      message: "Yagya category deactivated successfully",
      data: {
        id: category.id,
        slug: category.slug,
        name: category.name,
        isActive: false,
      },
    });
  } catch (error) {
    console.error("Admin delete yagya category error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to deactivate Yagya category",
    });
  }
};
