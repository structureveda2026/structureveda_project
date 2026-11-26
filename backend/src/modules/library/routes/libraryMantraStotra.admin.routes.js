import express from "express";
import {
  getAdminItems,
  getAdminItemByIdOrSlug,
  createItem,
  updateItem,
  deleteItem,
  seedItems,
} from "../controllers/libraryMantraStotra.controller.js";
import { authenticate, authorizeAdmin } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate, authorizeAdmin);

// Seed route MUST come before /:idOrSlug
router.post("/seed", seedItems);

router.get("/", getAdminItems);
router.get("/:idOrSlug", getAdminItemByIdOrSlug);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
