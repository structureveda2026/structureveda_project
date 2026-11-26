import LibraryMantraStotraService from "../services/libraryMantraStotra.service.js";

const handleControllerError = (res, error, fallbackMessage) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      message: error.errors?.[0]?.message || error.message || "Duplicate record conflict",
    });
  }
  if (error?.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: error.errors?.[0]?.message || error.message || "Validation failed",
    });
  }
  return res.status(error?.statusCode || 500).json({
    success: false,
    message: error?.message || fallbackMessage,
  });
};

/**
 * Public listing of mantras & stotras
 */
export const getPublicItems = async (req, res) => {
  try {
    const result = await LibraryMantraStotraService.getItems(req.query, false);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in getPublicItems:", error);
    return handleControllerError(res, error, "Failed to fetch mantras/stotras");
  }
};

/**
 * Public single item detail (increments viewsCount)
 */
export const getPublicItemByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const item = await LibraryMantraStotraService.getItemByIdOrSlug(idOrSlug, false, true);
    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error in getPublicItemByIdOrSlug:", error);
    return handleControllerError(res, error, "Failed to fetch item");
  }
};

/**
 * Admin listing of mantras & stotras
 */
export const getAdminItems = async (req, res) => {
  try {
    const result = await LibraryMantraStotraService.getItems(req.query, true);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in getAdminItems:", error);
    return handleControllerError(res, error, "Failed to fetch mantras/stotras");
  }
};

/**
 * Admin single item detail
 */
export const getAdminItemByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const item = await LibraryMantraStotraService.getItemByIdOrSlug(idOrSlug, true, false);
    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error in getAdminItemByIdOrSlug:", error);
    return handleControllerError(res, error, "Failed to fetch item");
  }
};

/**
 * Admin create item
 */
export const createItem = async (req, res) => {
  try {
    const item = await LibraryMantraStotraService.createItem(req.body);
    return res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    console.error("Error in createItem:", error);
    if (!error.statusCode && error.name !== "SequelizeUniqueConstraintError") {
      error.statusCode = 400;
    }
    return handleControllerError(res, error, "Failed to create item");
  }
};

/**
 * Admin update item
 */
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await LibraryMantraStotraService.updateItem(id, req.body);
    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: item,
    });
  } catch (error) {
    console.error("Error in updateItem:", error);
    if (!error.statusCode && error.name !== "SequelizeUniqueConstraintError") {
      error.statusCode = 400;
    }
    return handleControllerError(res, error, "Failed to update item");
  }
};

/**
 * Admin delete item
 */
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await LibraryMantraStotraService.deleteItem(id);
    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteItem:", error);
    return handleControllerError(res, error, "Failed to delete item");
  }
};

/**
 * Admin trigger seed
 */
export const seedItems = async (req, res) => {
  try {
    const overwrite = req.body?.overwrite === true || req.query?.overwrite === "true";
    const result = await LibraryMantraStotraService.seedDefaults(overwrite);
    return res.status(200).json({
      success: true,
      message: "Mantra/Stotra items seeded successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in seedItems:", error);
    return handleControllerError(res, error, "Failed to seed items");
  }
};

export default {
  getPublicItems,
  getPublicItemByIdOrSlug,
  getAdminItems,
  getAdminItemByIdOrSlug,
  createItem,
  updateItem,
  deleteItem,
  seedItems,
};
