import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";
import { upload, handleUploadErrors } from "../middleware/upload.middleware.js";
import {
  uploadImagesHandler,
  deleteImageHandler,
} from "../controllers/upload.controller.js";

const router = express.Router();

// Enforce authentication & admin authorization for all upload endpoints
router.use(authenticate, authorizeAdmin);

// POST /api/admin/uploads/images (supports single file or multiple files)
router.post(
  "/images",
  upload.any(),
  handleUploadErrors,
  uploadImagesHandler
);

// DELETE /api/admin/uploads/images
router.delete(
  "/images",
  deleteImageHandler
);

export default router;
