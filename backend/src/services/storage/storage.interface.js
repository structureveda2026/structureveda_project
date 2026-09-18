/**
 * Base abstract class defining the storage provider contract.
 * All storage implementations (Cloudinary, Bunny, Cloudflare R2, AWS S3)
 * must implement this contract to be swappable.
 */
export class StorageProvider {
  /**
   * Upload an image file to the storage provider.
   * @param {Object} file - File object containing buffer, originalname, mimetype, size
   * @param {Object} [options] - Provider options e.g. { folder: string }
   * @returns {Promise<{ url: string, publicId: string, width?: number, height?: number, format?: string, bytes?: number }>}
   */
  async uploadImage(file, options = {}) {
    throw new Error("Method 'uploadImage(file, options)' must be implemented.");
  }

  /**
   * Delete an image from storage using its provider public identifier.
   * @param {string} publicId - Storage provider unique identifier
   * @returns {Promise<{ success: boolean, message?: string }>}
   */
  async deleteImage(publicId) {
    throw new Error("Method 'deleteImage(publicId)' must be implemented.");
  }
}
