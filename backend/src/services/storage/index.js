import { CloudinaryStorageProvider } from "./cloudinary.provider.js";

/**
 * Storage service factory.
 * Export an instance of the active storage provider.
 * To replace Cloudinary with Bunny, R2, or S3 in future,
 * simply change this provider instantiation.
 */
export const storageService = new CloudinaryStorageProvider();

export default storageService;
