import express from "express";
import {
  getPublicAstrologers,
  getPublicAstrologerBySlug,
  getPublicAstrologerPackages,
  getPublicAstrologerSlots,
} from "../controllers/astrologer.controller.js";

const router = express.Router();

router.get("/", getPublicAstrologers);
router.get("/:slug/packages", getPublicAstrologerPackages);
router.get("/:slug/slots", getPublicAstrologerSlots);
router.get("/:slug", getPublicAstrologerBySlug);

export default router;
