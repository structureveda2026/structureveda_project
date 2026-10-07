import express from "express";
import VedaPublicController from "../controllers/veda.public.controller.js";

const router = express.Router();

// Public Veda Endpoints
router.get("/vedas", VedaPublicController.getVedas);
router.get("/vedas/:slug", VedaPublicController.getVedaBySlug);
router.get("/vedas/:slug/tree", VedaPublicController.getVedaBySlug);
router.get("/nodes/:nodeId", VedaPublicController.getNodeDetails);

// Public Mantra Endpoints
router.get("/mantras", VedaPublicController.getMantras);
router.get("/mantras/:id", VedaPublicController.getMantraById);

export default router;
