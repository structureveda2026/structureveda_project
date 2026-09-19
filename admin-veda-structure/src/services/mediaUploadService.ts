import api from "./api";

export interface UploadedImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

export interface UploadOptions {
  folder?: string;
  onProgress?: (current: number, total: number) => void;
}

export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Validates file format and size on the client side for instant feedback.
 */
export const validateImageFile = (file: File): void => {
  if (!file) {
    throw new Error("Please select an image.");
  }

  const name = file.name.toLowerCase();
  const hasValidExt = ALLOWED_IMAGE_EXTENSIONS.some((ext) =>
    name.endsWith(ext),
  );
  const hasValidMime = ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase());

  if (!hasValidExt && !hasValidMime) {
    throw new Error("Only JPG, PNG and WEBP images are supported.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`Image size must be below ${MAX_IMAGE_SIZE_MB} MB.`);
  }
};

/**
 * Uploads a single image to the backend storage endpoint.
 * Communicates with POST /api/admin/uploads/images via multipart/form-data.
 */
export const uploadImage = async (
  file: File,
  options: UploadOptions = {},
): Promise<UploadedImage> => {
  validateImageFile(file);

  const formData = new FormData();
  formData.append("file", file);

  if (options.folder) {
    formData.append("folder", options.folder);
  }

  const res = await api.upload("/admin/uploads/images", formData);

  if (!res.success || !res.data) {
    throw new Error(res.message || "Image upload failed. Please try again.");
  }

  return res.data as UploadedImage;
};

/**
 * Uploads multiple images sequentially to provide granular progress updates
 * (e.g. "Uploading 2 of 5...") and preserve precise order.
 */
export const uploadImages = async (
  files: File[],
  options: UploadOptions = {},
): Promise<UploadedImage[]> => {
  if (!files || files.length === 0) {
    throw new Error("Please select an image.");
  }

  // Pre-validate all files
  for (const file of files) {
    validateImageFile(file);
  }

  const total = files.length;
  const results: UploadedImage[] = [];

  for (let i = 0; i < total; i++) {
    if (options.onProgress) {
      options.onProgress(i + 1, total);
    }
    const uploaded = await uploadImage(files[i], { folder: options.folder });
    results.push(uploaded);
  }

  return results;
};

/**
 * Deletes an uploaded image from storage using its public identifier.
 */
export const deleteImage = async (publicId: string): Promise<boolean> => {
  if (!publicId) return false;
  try {
    const res = await api.del(
      `/admin/uploads/images?publicId=${encodeURIComponent(publicId)}`,
    );
    return Boolean(res.success);
  } catch (error) {
    console.warn("Failed to delete image from storage:", error);
    return false;
  }
};

export default {
  uploadImage,
  uploadImages,
  deleteImage,
  validateImageFile,
  MAX_IMAGE_SIZE_MB,
  ALLOWED_IMAGE_EXTENSIONS,
};
