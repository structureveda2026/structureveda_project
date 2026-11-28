import express from "express";
import {
  getAdminSections,
  createAdminSection,
  deleteAdminSection,
} from "../controllers/librarySection.controller.js";

const router = express.Router();

router.get("/", getAdminSections);
router.post("/", createAdminSection);
router.delete("/:id", deleteAdminSection);

export default router;
