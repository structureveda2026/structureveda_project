import VedaService from "../services/veda.service.js";
import VedaMantraService from "../services/vedaMantra.service.js";

export class VedaPublicController {
  /**
   * GET /api/library/vedas
   * List all active Vedas
   */
  static async getVedas(req, res) {
    try {
      const vedas = await VedaService.getAllVedas(req.query);
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
