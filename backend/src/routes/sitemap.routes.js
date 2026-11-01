import express from "express";
import { getSitemapXml } from "../controllers/sitemap.controller.js";

const router = express.Router();

// GET /sitemap.xml or GET /api/sitemap.xml
router.get("/", getSitemapXml);

export default router;
