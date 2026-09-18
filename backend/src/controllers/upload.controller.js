import storageService from "../services/storage/index.js";

/**
 * Controller for handling authenticated admin image uploads.
 * Supports single image upload or multiple gallery image uploads.
 * Preserves user-selected ordering for multiple files.
 */
export const uploadImagesHandler = async (req, res) => {
  try {
    const rawFiles = req.files || (req.file ? [req.file] : []);

    if (!rawFiles || rawFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const folder = req.body.folder || req.query.folder || "veda-structure/uploads";
    const isExplicitMultiple =
      req.query.type === "multiple" ||
      req.body.type === "multiple" ||
      rawFiles.some((f) => f.fieldname === "files" || f.fieldname === "images") ||
      rawFiles.length > 1;

    // Upload files sequentially to preserve user-selected order
    const uploadedImages = [];
    for (const file of rawFiles) {
      const result = await storageService.uploadImage(file, { folder });
      uploadedImages.push(result);
    }

    // Single image response format
    if (!isExplicitMultiple && uploadedImages.length === 1) {
      return res.status(200).json({
        success: true,
        data: uploadedImages[0],
      });
    }

    // Multiple image response format
    return res.status(200).json({
      success: true,
      count: uploadedImages.length,
      data: uploadedImages,
    });
  } catch (error) {
    console.error("Upload controller error:", error.message || error);

    if (error.message && error.message.includes("Cloudinary image storage is not configured")) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary image storage is not configured.",
      });
    }

    const isMultiple = req.files && req.files.length > 1;
    return res.status(500).json({
      success: false,
      message: isMultiple
        ? "Some gallery images failed to upload."
        : error.message || "Image upload failed. Please try again.",
    });
  }
};

/**
 * Controller for deleting an image from storage using publicId.
 */
export const deleteImageHandler = async (req, res) => {
  try {
    const publicId = req.body?.publicId || req.query?.publicId;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required to delete an image.",
      });
    }

    const result = await storageService.deleteImage(publicId);

    return res.status(200).json({
      success: true,
      message: "Image removed from storage.",
      data: result,
    });
  } catch (error) {
    console.error("Delete image error:", error.message || error);

    if (error.message && error.message.includes("Cloudinary image storage is not configured")) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary image storage is not configured.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete image from storage.",
    });
  }
};
