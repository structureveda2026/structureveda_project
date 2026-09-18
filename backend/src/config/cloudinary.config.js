import { v2 as cloudinary } from "cloudinary";

/**
 * Check if Cloudinary credentials are fully configured in the environment.
 * @returns {boolean}
 */
export const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Configure and return the Cloudinary v2 instance.
 * Credentials are read strictly on the server side and never exposed.
 */
let isInitialized = false;

export const getCloudinaryClient = () => {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary image storage is not configured.");
  }

  if (!isInitialized) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    isInitialized = true;
  }

  return cloudinary;
};

export default cloudinary;
