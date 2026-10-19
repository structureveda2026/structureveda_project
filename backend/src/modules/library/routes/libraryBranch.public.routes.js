import express from "express";
import {
  getPublicSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  reorderSubcategories,
} from "../controllers/libraryBranch.controller.js";

const router = express.Router();

// Reorder routes (must come BEFORE generic /:id route)
router.put("/:categorySlug/subcategories/reorder", reorderSubcategories);
router.put("/mantra-stotra/subcategories/reorder", (req, res) => {
  req.params.categorySlug = "mantra-stotra";
  return reorderSubcategories(req, res);
});
router.put("/reorder", (req, res) => {
  req.params.categorySlug = "mantra-stotra";
  return reorderSubcategories(req, res);
});

// GET /api/library/categories/:categorySlug/subcategories
router.get("/:categorySlug/subcategories", getPublicSubcategories);
router.get("/mantra-stotra/subcategories", (req, res) => {
  req.params.categorySlug = "mantra-stotra";
  return getPublicSubcategories(req, res);
});

// POST /api/library/categories/:categorySlug/subcategories
router.post("/:categorySlug/subcategories", createSubcategory);
router.post("/mantra-stotra/subcategories", (req, res) => {
  req.params.categorySlug = "mantra-stotra";
  return createSubcategory(req, res);
});

// PUT /api/library/categories/:categorySlug/subcategories/:id
router.put("/:categorySlug/subcategories/:id", updateSubcategory);
router.put("/mantra-stotra/subcategories/:id", (req, res) => {
  req.params.categorySlug = "mantra-stotra";
  return updateSubcategory(req, res);
});

// DELETE /api/library/categories/:categorySlug/subcategories/:id
router.delete("/:categorySlug/subcategories/:id", deleteSubcategory);
router.delete("/mantra-stotra/subcategories/:id", (req, res) => {
  req.params.categorySlug = "mantra-stotra";
  return deleteSubcategory(req, res);
});

export default router;
