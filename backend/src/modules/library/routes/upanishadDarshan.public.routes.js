import express from "express";
import UpanishadDarshanPublicController from "../controllers/upanishadDarshan.public.controller.js";

const router = express.Router();

// Taxonomy Tree (must precede /:id)
router.get("/taxonomy", UpanishadDarshanPublicController.getTaxonomyTree);

// Direct Mantra / Sutra operations by mantra ID
router.get("/mantras/:mantraId", UpanishadDarshanPublicController.getMantraById);

// Text-scoped Mantra operations
router.get("/:id/mantras", UpanishadDarshanPublicController.getMantras);
router.get("/:id/sutras", UpanishadDarshanPublicController.getMantras);

// Root Text operations
router.get("/", UpanishadDarshanPublicController.getAllTexts);

// Text operations by Text ID / Slug
router.get("/:id", UpanishadDarshanPublicController.getTextBySlugOrId);

export default router;
