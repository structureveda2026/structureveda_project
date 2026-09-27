import express from "express";
import {
  getAdminYagyaServices,
  getAdminYagyaServiceById,
  createAdminYagyaService,
  updateAdminYagyaService,
  deleteAdminYagyaService,
} from "../controllers/yagyaServiceAdmin.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate, authorizeAdmin);

router.get("/", getAdminYagyaServices);
router.get("/:id", getAdminYagyaServiceById);
router.post("/", createAdminYagyaService);
router.put("/:id", updateAdminYagyaService);
router.delete("/:id", deleteAdminYagyaService);

export default router;
