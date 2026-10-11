import VedaService from "../services/veda.service.js";
import VedaMantraService from "../services/vedaMantra.service.js";

export class VedaPublicController {
  /**
   * GET /api/library/vedas
   * List all active Vedas (defaults category to 'veda' unless specified)
   */
  static async getVedas(req, res) {
    try {
      const category = req.query.category || "veda";
      const vedas = await VedaService.getAllVedas({
        ...req.query,
        category,
      });
      return res.status(200).json({
        success: true,
        data: vedas,
      });
    } catch (error) {
      console.error("VedaPublicController.getVedas error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch Vedas",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/library/granthas
   * List all Granthas (optionally filtered by query category)
   */
  static async getGranthas(req, res) {
    try {
      const granthas = await VedaService.getAllVedas(req.query);
      return res.status(200).json({
        success: true,
        data: granthas,
      });
    } catch (error) {
      console.error("VedaPublicController.getGranthas error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch Granthas",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/library/puranas
   * List all Mahapuranas
   */
  static async getPuranas(req, res) {
    try {
      const puranas = await VedaService.getAllVedas({
        ...req.query,
        category: "purana",
      });
      return res.status(200).json({
        success: true,
        data: puranas,
      });
    } catch (error) {
      console.error("VedaPublicController.getPuranas error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch Puranas",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/library/itihasas
   * List all Itihasas (Ramayana, Mahabharata, Gita)
   */
  static async getItihasas(req, res) {
    try {
      const itihasas = await VedaService.getAllVedas({
        ...req.query,
        category: "itihasa",
      });
      return res.status(200).json({
        success: true,
        data: itihasas,
      });
    } catch (error) {
      console.error("VedaPublicController.getItihasas error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch Itihasas",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/library/upanishads
   * List all Mukhya Upanishads
   */
  static async getUpanishads(req, res) {
    try {
      const upanishads = await VedaService.getAllVedas({
        ...req.query,
        category: "upanishad",
      });
      return res.status(200).json({
        success: true,
        data: upanishads,
      });
    } catch (error) {
      console.error("VedaPublicController.getUpanishads error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch Upanishads",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/library/darshanas
   * List all Shad-Darshanas
   */
  static async getDarshanas(req, res) {
    try {
      const darshanas = await VedaService.getAllVedas({
        ...req.query,
        category: "darshana",
      });
      return res.status(200).json({
        success: true,
        data: darshanas,
      });
    } catch (error) {
      console.error("VedaPublicController.getDarshanas error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch Darshanas",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/library/vedas/:slug
   * Get single Veda with full nested hierarchy tree
   */
  static async getVedaBySlug(req, res) {
    try {
      const { slug } = req.params;
      const veda = await VedaService.getVedaBySlug(slug);

      if (!veda) {
        return res.status(404).json({
          success: false,
          message: `Veda with slug/id "${slug}" not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: veda,
      });
    } catch (error) {
      console.error("VedaPublicController.getVedaBySlug error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch Veda details",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/library/nodes/:nodeId
   * Get node details (Sukta / Adhyaya / Shakha) with child mantras & breadcrumbs
   */
  static async getNodeDetails(req, res) {
    try {
      const { nodeId } = req.params;
      const node = await VedaService.getNodeById(nodeId);

      if (!node) {
        return res.status(404).json({
          success: false,
          message: `Node with id "${nodeId}" not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: node,
      });
    } catch (error) {
      console.error("VedaPublicController.getNodeDetails error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch node details",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/library/mantras
   * Search / filter mantras across all Vedas
   */
  static async getMantras(req, res) {
    try {
      const result = await VedaMantraService.getMantras(req.query);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("VedaPublicController.getMantras error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mantras",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/library/mantras/:id
   * Get single mantra with 3 languages, padapatha, and siblings
   */
  static async getMantraById(req, res) {
    try {
      const { id } = req.params;
      const mantra = await VedaMantraService.getMantraById(id);

      if (!mantra) {
        return res.status(404).json({
          success: false,
          message: `Mantra with id "${id}" not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: mantra,
      });
    } catch (error) {
      console.error("VedaPublicController.getMantraById error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mantra details",
        error: error.message,
      });
    }
  }
}

export default VedaPublicController;
