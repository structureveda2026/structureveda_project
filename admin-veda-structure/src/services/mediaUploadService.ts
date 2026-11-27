import api from "./api";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.vedastructure.com/api";

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export function resolvePublicLibraryUrl(): string {
  const envUrl = import.meta.env.VITE_PUBLIC_LIBRARY_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    const { hostname, port } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      const defaultClientPort = port === "5174" ? "5173" : "5174";
      return `http://${hostname}:${defaultClientPort}`;
    }
  }
  return "https://library.vedastructure.com";
}

export const PUBLIC_LIBRARY_URL = resolvePublicLibraryUrl();

/**
 * Resolves an uploaded media URL or relative `/uploads/...` path against API_ORIGIN.
 * Legacy bare keys (e.g. "deity-shiva.jpg") return "" so callers can show a clean fallback.
 */
export function resolveMediaUrl(value?: string | null): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
    const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${API_ORIGIN}${normalized}`;
  }
  return "";
}

export function isUploadedImageUrl(value?: string | null): boolean {
  return Boolean(resolveMediaUrl(value));
}

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
