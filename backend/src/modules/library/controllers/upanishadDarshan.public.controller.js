import UpanishadDarshanService from "../services/upanishadDarshan.service.js";

export class UpanishadDarshanPublicController {
  /**
   * GET / - Public text listing (Upanishads & Darshanas)
   */
  static async getAllTexts(req, res) {
    try {
      let category = req.query.category;
      if (!category) {
        if (req.baseUrl.includes("darshan")) {
          category = "darshana";
        } else if (req.baseUrl.includes("upanishad") && !req.baseUrl.includes("darshan")) {
          category = "upanishad";
        }
      }

      const result = await UpanishadDarshanService.getAllTexts({
        ...req.query,
        category,
        status: "ACTIVE",
      });

      return res.status(200).json({
        success: true,
        data: result.texts,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("UpanishadDarshanPublicController.getAllTexts error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch texts",
        error: error.message,
      });
    }
  }

  /**
   * GET /taxonomy - Complete authentic taxonomy
   */
  static async getTaxonomyTree(req, res) {
    try {
      const taxonomy = UpanishadDarshanService.getTaxonomyTree();
      return res.status(200).json({
        success: true,
        data: taxonomy,
      });
    } catch (error) {
      console.error("UpanishadDarshanPublicController.getTaxonomyTree error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch taxonomy tree",
        error: error.message,
      });
    }
  }

  /**
   * GET /:id - Single text details with tree
   */
  static async getTextBySlugOrId(req, res) {
    try {
      const { id } = req.params;
      const text = await UpanishadDarshanService.getTextBySlugOrId(id);

      if (!text) {
        return res.status(404).json({
          success: false,
          message: `Text "${id}" not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: text,
      });
    } catch (error) {
      console.error("UpanishadDarshanPublicController.getTextBySlugOrId error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch text",
        error: error.message,
      });
    }
  }

  /**
   * GET /:id/mantras or GET /mantras
   */
  static async getMantras(req, res) {
    try {
      const textId = req.params.id || req.query.textId || req.query.vedaId;
      const result = await UpanishadDarshanService.getMantras({
        ...req.query,
        textId,
        status: "ACTIVE",
      });

      return res.status(200).json({
        success: true,
        data: result.mantras,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("UpanishadDarshanPublicController.getMantras error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mantras",
        error: error.message,
      });
    }
  }

  /**
   * GET /mantras/:id
   */
  static async getMantraById(req, res) {
    try {
      const id = req.params.mantraId || req.params.id;
      const mantra = await UpanishadDarshanService.getMantraById(id);

      if (!mantra) {
        return res.status(404).json({
          success: false,
          message: `Mantra "${id}" not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: mantra,
      });
    } catch (error) {
      console.error("UpanishadDarshanPublicController.getMantraById error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mantra",
        error: error.message,
      });
    }
  }
}

export default UpanishadDarshanPublicController;
