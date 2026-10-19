import express from "express";
import {
  getAdminAstrologers,
  getAdminAstrologerById,
  createAdminAstrologer,
  updateAdminAstrologer,
  updateAdminAstrologerStatus,
} from "../controllers/astrologerAdmin.controller.js";
import {
  getAdminAstrologerPackages,
  getAdminAstrologerPackageById,
  createAdminAstrologerPackage,
  updateAdminAstrologerPackage,
  updateAdminAstrologerPackageStatus,
  deleteAdminAstrologerPackage,
} from "../controllers/astrologerPackageAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Enforce authentication & admin authorization on all admin astrologer endpoints
router.use(authenticate, authorizeAdmin);

// Astrologer profile endpoints
router.get("/", getAdminAstrologers);
router.post("/", createAdminAstrologer);
router.get("/:id", getAdminAstrologerById);
router.patch("/:id/status", updateAdminAstrologerStatus);
router.patch("/:id", updateAdminAstrologer);
router.put("/:id", updateAdminAstrologer);

// Astrologer package management endpoints (scoped to astrologer)
router.get("/:id/packages", getAdminAstrologerPackages);
router.post("/:id/packages", createAdminAstrologerPackage);
router.get("/:id/packages/:packageId", getAdminAstrologerPackageById);
router.patch("/:id/packages/:packageId", updateAdminAstrologerPackage);
router.put("/:id/packages/:packageId", updateAdminAstrologerPackage);
router.patch("/:id/packages/:packageId/status", updateAdminAstrologerPackageStatus);
router.delete("/:id/packages/:packageId", deleteAdminAstrologerPackage);

export default router;
