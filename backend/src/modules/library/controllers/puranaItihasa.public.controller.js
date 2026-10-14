import PuranaItihasaService from "../services/puranaItihasa.service.js";

export class PuranaItihasaPublicController {
  /**
   * GET / - Get all active Purana and Itihasa texts
   */
  static async getAllTexts(req, res) {
    try {
      let category = req.query.category;
      if (!category) {
        if (req.baseUrl.includes("purana") && !req.baseUrl.includes("itihasa")) {
          category = "purana";
        } else if (req.baseUrl.includes("itihasa") && !req.baseUrl.includes("purana")) {
          category = "itihasa";
        }
      }

      const result = await PuranaItihasaService.getAllTexts({
        ...req.query,
        category,
        status: "ACTIVE",
      });

      return res.status(200).json({
        success: true,
        data: result.texts,
        pagination: result.pagination,
        message: "Texts retrieved successfully",
      });
    } catch (error) {
      console.error("PuranaItihasaPublicController.getAllTexts error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch texts",
        error: error.message,
      });
    }
  }

  /**
   * GET /taxonomy - Get complete taxonomy tree
   */
  static async getTaxonomyTree(req, res) {
    try {
      const taxonomy = PuranaItihasaService.getTaxonomyTree();
      return res.status(200).json({
        success: true,
        data: taxonomy,
        message: "Taxonomy tree retrieved successfully",
      });
    } catch (error) {
      console.error("PuranaItihasaPublicController.getTaxonomyTree error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch taxonomy tree",
        error: error.message,
      });
    }
  }

  /**
   * GET /:id - Get text details by ID or slug with full node hierarchy tree and shloka count
   */
  static async getTextBySlugOrId(req, res) {
    try {
      const { id } = req.params;
      const text = await PuranaItihasaService.getTextBySlugOrId(id);

      if (!text) {
        return res.status(404).json({
          success: false,
          message: `Text with ID or slug "${id}" not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: text,
        message: "Text details retrieved successfully",
      });
    } catch (error) {
      console.error("PuranaItihasaPublicController.getTextBySlugOrId error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch text details",
        error: error.message,
      });
    }
  }

  /**
   * GET /:id/shlokas or GET /shlokas - Get paginated shlokas
   */
  static async getShlokas(req, res) {
    try {
      const textId = req.params.id || req.query.textId;
      const result = await PuranaItihasaService.getShlokas({
        ...req.query,
        textId,
        status: "ACTIVE",
      });

      return res.status(200).json({
        success: true,
        data: result.shlokas,
        pagination: result.pagination,
        message: "Shlokas retrieved successfully",
      });
    } catch (error) {
      console.error("PuranaItihasaPublicController.getShlokas error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch shlokas",
        error: error.message,
      });
    }
  }

  /**
   * GET /shlokas/:shlokaId - Get single shloka by ID with siblings
   */
  static async getShlokaById(req, res) {
    try {
      const id = req.params.shlokaId || req.params.id;
      const shloka = await PuranaItihasaService.getShlokaById(id);

      if (!shloka) {
        return res.status(404).json({
          success: false,
          message: `Shloka "${id}" not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: shloka,
        message: "Shloka retrieved successfully",
      });
    } catch (error) {
      console.error("PuranaItihasaPublicController.getShlokaById error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch shloka",
        error: error.message,
      });
    }
  }
}

export default PuranaItihasaPublicController;
