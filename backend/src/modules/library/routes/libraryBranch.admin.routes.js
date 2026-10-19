import express from "express";
import {
  getAdminSubcategories,
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

// CRUD for branches
router.get("/:categorySlug/subcategories", getAdminSubcategories);
router.post("/:categorySlug/subcategories", createSubcategory);
router.put("/:categorySlug/subcategories/:id", updateSubcategory);
router.delete("/:categorySlug/subcategories/:id", deleteSubcategory);

// Aliases for /mantra-stotra/subcategories
router.get("/mantra-stotra/subcategories", (req, res) => {
  req.params.categorySlug = "mantra-stotra";
  return getAdminSubcategories(req, res);
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

export default router;
