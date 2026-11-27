import LibraryBranchService from "../services/libraryBranch.service.js";

/**
 * GET /api/library/categories/:categorySlug/subcategories
 * Public endpoint to get branches/subcategories
 */
export const getPublicSubcategories = async (req, res) => {
  try {
    const { categorySlug = "mantra-stotra" } = req.params;
    const branches = await LibraryBranchService.getSubcategories(categorySlug, false, req.query);
    return res.status(200).json({
      success: true,
      data: branches,
    });
  } catch (error) {
    console.error("Error in getPublicSubcategories:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subcategories",
      error: error.message,
    });
  }
};

/**
 * GET /api/library/categories/:categorySlug/subcategories/:slug
 * Public endpoint to get single branch detail + its items
 */
export const getPublicSubcategoryDetail = async (req, res) => {
  try {
    const { categorySlug = "mantra-stotra", slug } = req.params;
    const data = await LibraryBranchService.getSubcategoryBySlug(categorySlug, slug, false);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in getPublicSubcategoryDetail:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch branch detail",
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/library/categories/:categorySlug/subcategories
 * Admin endpoint
 */
export const getAdminSubcategories = async (req, res) => {
  try {
    const { categorySlug = "mantra-stotra" } = req.params;
    const branches = await LibraryBranchService.getSubcategories(categorySlug, true, req.query);
    return res.status(200).json({
      success: true,
      data: branches,
    });
  } catch (error) {
    console.error("Error in getAdminSubcategories:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subcategories",
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/library/categories/:categorySlug/subcategories/:slug
 * Admin endpoint for single branch detail + items (including DRAFT/INACTIVE)
 */
export const getAdminSubcategoryDetail = async (req, res) => {
  try {
    const { categorySlug = "mantra-stotra", slug } = req.params;
    const data = await LibraryBranchService.getSubcategoryBySlug(categorySlug, slug, true);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in getAdminSubcategoryDetail:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch branch detail",
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/library/categories/:categorySlug/subcategories
 */
export const createSubcategory = async (req, res) => {
  try {
    const { categorySlug = "mantra-stotra" } = req.params;
    const branch = await LibraryBranchService.createSubcategory({
      ...req.body,
      categorySlug,
    });
    return res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: branch,
    });
  } catch (error) {
    console.error("Error in createSubcategory:", error);
    const status =
      error?.name === "SequelizeUniqueConstraintError" ? 409 : error.statusCode || 400;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to create branch",
    });
  }
};

/**
 * PUT /api/admin/library/categories/:categorySlug/subcategories/:id
 */
export const updateSubcategory = async (req, res) => {
  try {
    const { categorySlug = "mantra-stotra", id } = req.params;
    const branch = await LibraryBranchService.updateSubcategory(id, req.body, categorySlug);
    return res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: branch,
    });
  } catch (error) {
    console.error("Error in updateSubcategory:", error);
    const status =
      error?.name === "SequelizeUniqueConstraintError" ? 409 : error.statusCode || 400;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to update branch",
    });
  }
};

/**
 * DELETE /api/admin/library/categories/:categorySlug/subcategories/:id
 */
export const deleteSubcategory = async (req, res) => {
  try {
    const { categorySlug = "mantra-stotra", id } = req.params;
    await LibraryBranchService.deleteSubcategory(id, categorySlug);
    return res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteSubcategory:", error);
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Failed to delete branch",
    });
  }
};

/**
 * PUT /api/admin/library/categories/:categorySlug/subcategories/reorder
 * PUT /api/library/categories/:categorySlug/subcategories/reorder
 */
export const reorderSubcategories = async (req, res) => {
  try {
    const { categorySlug = "mantra-stotra" } = req.params;
    const { orderedIds, items } = req.body || {};
    const listToReorder = orderedIds || items || (Array.isArray(req.body) ? req.body : []);
    const updated = await LibraryBranchService.reorderSubcategories(categorySlug, listToReorder);
    return res.status(200).json({
      success: true,
      message: "Branches reordered successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error in reorderSubcategories:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to reorder branches",
    });
  }
};

export default {
  getPublicSubcategories,
  getPublicSubcategoryDetail,
  getAdminSubcategories,
  getAdminSubcategoryDetail,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  reorderSubcategories,
};
