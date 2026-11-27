import express from "express";
import {
  getAdminSubcategories,
  getAdminSubcategoryDetail,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  reorderSubcategories,
} from "../controllers/libraryBranch.controller.js";
import { authenticate, authorizeAdmin } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate, authorizeAdmin);

// Specific Reorder routes (must come BEFORE generic /:id route)
router.put("/:categorySlug/subcategories/reorder", reorderSubcategories);
router.put("/mantra-stotra/subcategories/reorder", (req, res) => {
  req.params.categorySlug = "mantra-stotra";
  return reorderSubcategories(req, res);
});
router.put("/reorder", (req, res) => {
  req.params.categorySlug = "mantra-stotra";
  return reorderSubcategories(req, res);
});

// Specific aliases for /mantra-stotra/subcategories (before dynamic /:categorySlug)
router.get("/mantra-stotra/subcategories", (req, res) => {
  req.params.categorySlug = "mantra-stotra";
  return getAdminSubcategories(req, res);
});
router.get("/mantra-stotra/subcategories/:slug", (req, res) => {
  req.params.categorySlug = "mantra-stotra";
  return getAdminSubcategoryDetail(req, res);
});
router.post("/mantra-stotra/subcategories", (req, res) => {
  req.params.categorySlug = "mantra-stotra";
  return createSubcategory(req, res);
});
router.put("/mantra-stotra/subcategories/:id", (req, res) => {
  req.params.categorySlug = "mantra-stotra";
  return updateSubcategory(req, res);
});
router.delete("/mantra-stotra/subcategories/:id", (req, res) => {
  req.params.categorySlug = "mantra-stotra";
  return deleteSubcategory(req, res);
});

// CRUD for branches
router.get("/:categorySlug/subcategories", getAdminSubcategories);
router.get("/:categorySlug/subcategories/:slug", getAdminSubcategoryDetail);
router.post("/:categorySlug/subcategories", createSubcategory);
router.put("/:categorySlug/subcategories/:id", updateSubcategory);
router.delete("/:categorySlug/subcategories/:id", deleteSubcategory);

export default router;
