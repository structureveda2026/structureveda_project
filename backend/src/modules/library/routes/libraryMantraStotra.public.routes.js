import express from "express";
import {
  getPublicItems,
  getPublicItemByIdOrSlug,
} from "../controllers/libraryMantraStotra.controller.js";

const router = express.Router();

router.get("/", getPublicItems);
router.get("/:idOrSlug", getPublicItemByIdOrSlug);

export default router;
