import express from "express";
import PuranaItihasaPublicController from "../controllers/puranaItihasa.public.controller.js";

const router = express.Router();

// Taxonomy Tree (must precede /:id)
router.get("/taxonomy", PuranaItihasaPublicController.getTaxonomyTree);

// Direct Shloka operations by shloka ID
router.get("/shlokas/:shlokaId", PuranaItihasaPublicController.getShlokaById);

// General Shloka search / filter
router.get("/shlokas", PuranaItihasaPublicController.getShlokas);

// Text-scoped Shlokas
router.get("/:id/shlokas", PuranaItihasaPublicController.getShlokas);

// Root Text operations
router.get("/", PuranaItihasaPublicController.getAllTexts);

// Single Text details by Text ID / Slug
router.get("/:id", PuranaItihasaPublicController.getTextBySlugOrId);

export default router;
