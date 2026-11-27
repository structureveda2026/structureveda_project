import { isCloudinaryConfigured } from "../../config/cloudinary.config.js";
import { CloudinaryStorageProvider } from "./cloudinary.provider.js";
import { LocalStorageProvider } from "./local.provider.js";

/**
 * Storage service factory.
 * Export an instance of the active storage provider.
 * When Cloudinary is not configured or STORAGE_PROVIDER is local,
 * gracefully falls back to LocalStorageProvider.
 */
export const storageService =
  isCloudinaryConfigured() && process.env.STORAGE_PROVIDER !== "local"
    ? new CloudinaryStorageProvider()
    : new LocalStorageProvider();

export default storageService;
