import express from "express";
import { getPublicSections } from "../controllers/librarySection.controller.js";

const router = express.Router();

router.get("/", getPublicSections);

export default router;
