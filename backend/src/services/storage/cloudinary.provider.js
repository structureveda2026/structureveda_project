import { StorageProvider } from "./storage.interface.js";
import { getCloudinaryClient, isCloudinaryConfigured } from "../../config/cloudinary.config.js";

export class CloudinaryStorageProvider extends StorageProvider {
  constructor() {
    super();
  }

  /**
   * Upload an image to Cloudinary using the official SDK uploader.
   * Converts buffer to base64 Data URI for reliable HTTP transfer with configured timeout.
   * @param {Object} file - Multer file object ({ buffer, originalname, mimetype, size })
   * @param {Object} options - Upload options e.g. { folder: "veda-structure/upcoming-pujas/banners" }
   * @returns {Promise<{ url: string, publicId: string, width: number, height: number, format: string, bytes: number }>}
   */
  async uploadImage(file, options = {}) {
    if (!file || !file.buffer) {
      throw new Error("Please select an image file to upload.");
    }

    if (!isCloudinaryConfigured()) {
      throw new Error("Cloudinary image storage is not configured.");
    }

    const cloudinary = getCloudinaryClient();
    const folder = options.folder || "veda-structure/uploads";
    const mime = file.mimetype || "image/jpeg";
    const dataUri = `data:${mime};base64,${file.buffer.toString("base64")}`;

    try {
      const result = await cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        timeout: 60000,
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error.message || error);
      throw new Error("Image upload failed. Please try again.");
    }
  }

  /**
   * Delete an image from Cloudinary by public ID.
   * @param {string} publicId
   * @returns {Promise<{ success: boolean, message?: string }>}
   */
  async deleteImage(publicId) {
    if (!publicId) {
      throw new Error("Image publicId is required for deletion.");
    }

    if (!isCloudinaryConfigured()) {
      throw new Error("Cloudinary image storage is not configured.");
    }

    const cloudinary = getCloudinaryClient();

    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        timeout: 30000,
      });

      return {
        success: result.result === "ok" || result.result === "not found",
        message: result.result,
      };
    } catch (error) {
      console.error("Cloudinary delete error:", error.message || error);
      throw new Error("Failed to delete image from storage.");
    }
  }
}
