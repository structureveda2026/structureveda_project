import express from "express";
import {
  getPublicItems,
  getPublicItemByIdOrSlug,
  getPublicTypes,
} from "../controllers/libraryMantraStotra.controller.js";

const router = express.Router();

router.get("/", getPublicItems);
router.get("/types", getPublicTypes);
router.get("/:idOrSlug", getPublicItemByIdOrSlug);

export default router;
