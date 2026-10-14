import express from "express";
import VedaPublicController from "../controllers/veda.public.controller.js";

const router = express.Router();

// Public Veda & Grantha Endpoints
router.get("/vedas", VedaPublicController.getVedas);
router.get("/vedas/:slug", VedaPublicController.getVedaBySlug);
router.get("/vedas/:slug/tree", VedaPublicController.getVedaBySlug);
router.get("/nodes/:nodeId", VedaPublicController.getNodeDetails);

// Public Grantha Category Endpoints (/api/library/granthas, etc.)
router.get("/granthas", VedaPublicController.getGranthas);
router.get("/granthas/:slug", VedaPublicController.getVedaBySlug);
router.get("/granthas/:slug/tree", VedaPublicController.getVedaBySlug);

router.get("/puranas", VedaPublicController.getPuranas);
router.get("/puranas/:slug", VedaPublicController.getVedaBySlug);

router.get("/itihasas", VedaPublicController.getItihasas);
router.get("/itihasas/:slug", VedaPublicController.getVedaBySlug);

router.get("/upanishads", VedaPublicController.getUpanishads);
router.get("/upanishads/:slug", VedaPublicController.getVedaBySlug);

router.get("/darshanas", VedaPublicController.getDarshanas);
router.get("/darshanas/:slug", VedaPublicController.getVedaBySlug);

// Public Mantra Endpoints
router.get("/mantras", VedaPublicController.getMantras);
router.get("/mantras/:id", VedaPublicController.getMantraById);

// Root text endpoints (when mounted directly as /api/vedas, /api/granthas, etc.)
router.get("/", VedaPublicController.getVedas);
router.get("/:slug", VedaPublicController.getVedaBySlug);
router.get("/:slug/tree", VedaPublicController.getVedaBySlug);

export default router;
