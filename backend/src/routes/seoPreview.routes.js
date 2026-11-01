import express from "express";
import { getCrawlerPreview } from "../controllers/seoPreview.controller.js";

const router = express.Router();

// GET /api/seo/crawler-preview?type=:type&slug=:slug
router.get("/crawler-preview", getCrawlerPreview);

export default router;
