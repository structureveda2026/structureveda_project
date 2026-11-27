import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { StorageProvider } from "./storage.interface.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_ROOT = path.resolve(__dirname, "../../../uploads");

export class LocalStorageProvider extends StorageProvider {
  constructor() {
    super();
    if (!fs.existsSync(UPLOADS_ROOT)) {
      fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
    }
  }

  /**
   * Upload an image file buffer to local disk.
   */
  async uploadImage(file, options = {}) {
    if (!file || !file.buffer) {
      throw new Error("File buffer is required for local upload.");
    }

    const rawFolder = options.folder || "uploads";
    const cleanFolder = String(rawFolder)
      .replace(/\\/g, "/")
      .replace(/\.\./g, "")
      .replace(/^\/+|\/+$/g, "")
      .replace(/[^a-zA-Z0-9_\-\/]/g, "") || "uploads";

    const targetDir = path.join(UPLOADS_ROOT, cleanFolder);
    await fs.promises.mkdir(targetDir, { recursive: true });

    let ext = path.extname(file.originalname || "").toLowerCase();
    if (!ext || ext === ".") {
      if (file.mimetype === "image/png") ext = ".png";
      else if (file.mimetype === "image/webp") ext = ".webp";
      else if (file.mimetype === "image/gif") ext = ".gif";
      else ext = ".jpg";
    }

    const baseName = path
      .basename(file.originalname || "image", ext)
      .toLowerCase()
      .replace(/[^a-z0-9_\-]/g, "")
      .slice(0, 30);
    const safeBase = baseName || "image";

    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeBase}${ext}`;
    const filePath = path.join(targetDir, filename);

    await fs.promises.writeFile(filePath, file.buffer);

    const publicId = path.posix.join(cleanFolder, filename);
    const baseUrl = (options.baseUrl || process.env.API_PUBLIC_URL || "").replace(/\/+$/, "");
    const url = baseUrl ? `${baseUrl}/uploads/${publicId}` : `/uploads/${publicId}`;

    return {
      url,
      publicId,
      format: ext.replace(/^\./, ""),
      bytes: file.size || file.buffer.length,
    };
  }

  /**
   * Delete an image from local storage.
   */
  async deleteImage(publicId) {
    if (!publicId) {
      return { success: false, message: "Public ID is required." };
    }

    const normalized = String(publicId).replace(/\\/g, "/").replace(/\.\./g, "");
    const resolvedPath = path.resolve(UPLOADS_ROOT, normalized);

    if (resolvedPath === UPLOADS_ROOT || !resolvedPath.startsWith(UPLOADS_ROOT + path.sep)) {
      return { success: false, message: "Invalid public ID traversal." };
    }

    try {
      await fs.promises.unlink(resolvedPath);
      return { success: true, message: "Image removed from local storage." };
    } catch (err) {
      if (err.code === "ENOENT") {
        return { success: true, message: "Image not found on disk." };
      }
      throw err;
    }
  }
}

export default LocalStorageProvider;
