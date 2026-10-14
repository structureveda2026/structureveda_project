import UpanishadDarshanService from "../services/upanishadDarshan.service.js";

export class UpanishadDarshanAdminController {
  /**
   * GET / - List all Upanishads and Darshanas
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
        status: req.query.status || "ALL",
      });

      return res.status(200).json({
        success: true,
        data: result.texts,
        pagination: result.pagination,
        message: "Texts retrieved successfully",
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.getAllTexts error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch texts",
        error: error.message,
      });
    }
  }

  /**
   * GET /taxonomy - Get complete taxonomy tree of Upanishads and Darshanas
   */
  static async getTaxonomyTree(req, res) {
    try {
      const taxonomy = UpanishadDarshanService.getTaxonomyTree();
      return res.status(200).json({
        success: true,
        data: taxonomy,
        message: "Taxonomy tree retrieved successfully",
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.getTaxonomyTree error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch taxonomy tree",
        error: error.message,
      });
    }
  }

  /**
   * GET /:id - Get text by ID or slug with full hierarchy tree
   */
  static async getTextBySlugOrId(req, res) {
    try {
      const { id } = req.params;
      const text = await UpanishadDarshanService.getTextBySlugOrId(id);

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
      console.error("UpanishadDarshanAdminController.getTextBySlugOrId error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch text details",
        error: error.message,
      });
    }
  }

  /**
   * GET /:id/tree - Get text hierarchy tree
   */
  static async getTextTree(req, res) {
    try {
      const { id } = req.params;
      const text = await UpanishadDarshanService.getTextTree(id);

      if (!text) {
        return res.status(404).json({
          success: false,
          message: `Text with ID or slug "${id}" not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: text,
        message: "Text tree retrieved successfully",
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.getTextTree error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch text tree",
        error: error.message,
      });
    }
  }

  /**
   * POST / - Create text in Veda model
   */
  static async createText(req, res) {
    try {
      let category = req.body.category;
      if (!category) {
        if (req.baseUrl.includes("darshan")) {
          category = "darshana";
        } else if (req.baseUrl.includes("upanishad") && !req.baseUrl.includes("darshan")) {
          category = "upanishad";
        }
      }

      const newText = await UpanishadDarshanService.createText({
        ...req.body,
        category,
      });

      return res.status(201).json({
        success: true,
        data: newText,
        message: "Text created successfully",
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.createText error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create text",
      });
    }
  }

  /**
   * PUT /:id - Update text in Veda model
   */
  static async updateText(req, res) {
    try {
      const { id } = req.params;
      const updatedText = await UpanishadDarshanService.updateText(id, req.body);

      return res.status(200).json({
        success: true,
        data: updatedText,
        message: "Text updated successfully",
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.updateText error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update text",
      });
    }
  }

  /**
   * DELETE /:id - Delete text or mark as INACTIVE
   */
  static async deleteText(req, res) {
    try {
      const { id } = req.params;
      await UpanishadDarshanService.deleteText(id);

      return res.status(200).json({
        success: true,
        message: `Text "${id}" deleted or marked INACTIVE successfully`,
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.deleteText error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete text",
      });
    }
  }

  /**
   * Tree Node: POST /nodes or POST /:id/nodes
   */
  static async createNode(req, res) {
    try {
      const vedaId = req.params.id || req.body.vedaId || req.body.textId;
      const node = await UpanishadDarshanService.createNode({
        ...req.body,
        vedaId,
      });

      return res.status(201).json({
        success: true,
        data: node,
        message: "Node created successfully",
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.createNode error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create node",
      });
    }
  }

  /**
   * Tree Node: PUT /nodes/:id
   */
  static async updateNode(req, res) {
    try {
      const id = req.params.nodeId || req.params.id;
      const updatedNode = await UpanishadDarshanService.updateNode(id, req.body);

      return res.status(200).json({
        success: true,
        data: updatedNode,
        message: "Node updated successfully",
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.updateNode error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update node",
      });
    }
  }

  /**
   * Tree Node: DELETE /nodes/:id
   */
  static async deleteNode(req, res) {
    try {
      const id = req.params.nodeId || req.params.id;
      await UpanishadDarshanService.deleteNode(id);

      return res.status(200).json({
        success: true,
        message: `Node "${id}" deleted successfully`,
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.deleteNode error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete node",
      });
    }
  }

  /**
   * GET /:id/mantras or GET /mantras - List mantras/sutras
   */
  static async getMantras(req, res) {
    try {
      const textId = req.params.id || req.query.textId || req.query.vedaId;
      const result = await UpanishadDarshanService.getMantras({
        ...req.query,
        textId,
        status: req.query.status || "ALL",
      });

      return res.status(200).json({
        success: true,
        data: result.mantras,
        pagination: result.pagination,
        message: "Mantras retrieved successfully",
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.getMantras error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mantras",
        error: error.message,
      });
    }
  }

  /**
   * GET /mantras/:id - Get single mantra/sutra
   */
  static async getMantraById(req, res) {
    try {
      const id = req.params.mantraId || req.params.id;
      const mantra = await UpanishadDarshanService.getMantraById(id);

      if (!mantra) {
        return res.status(404).json({
          success: false,
          message: `Mantra/Sutra "${id}" not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: mantra,
        message: "Mantra retrieved successfully",
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.getMantraById error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mantra",
        error: error.message,
      });
    }
  }

  /**
   * POST /:id/mantras or POST /mantras - Create mantra/sutra
   */
  static async createMantra(req, res) {
    try {
      const textId = req.params.id || req.body.textId || req.body.vedaId;
      const newMantra = await UpanishadDarshanService.createMantra({
        ...req.body,
        vedaId: textId,
      });

      return res.status(201).json({
        success: true,
        data: newMantra,
        message: "Mantra/Sutra created successfully",
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.createMantra error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create mantra",
      });
    }
  }

  /**
   * PUT /mantras/:id - Update mantra/sutra
   */
  static async updateMantra(req, res) {
    try {
      const id = req.params.mantraId || req.params.id;
      const updatedMantra = await UpanishadDarshanService.updateMantra(id, req.body);

      return res.status(200).json({
        success: true,
        data: updatedMantra,
        message: "Mantra updated successfully",
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.updateMantra error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update mantra",
      });
    }
  }

  /**
   * DELETE /mantras/:id - Delete mantra/sutra
   */
  static async deleteMantra(req, res) {
    try {
      const id = req.params.mantraId || req.params.id;
      await UpanishadDarshanService.deleteMantra(id);

      return res.status(200).json({
        success: true,
        message: `Mantra "${id}" deleted successfully`,
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.deleteMantra error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete mantra",
      });
    }
  }

  /**
   * POST /mantras/bulk-upload or POST /:id/mantras/bulk-upload
   */
  static async bulkUpload(req, res) {
    try {
      const vedaId = req.params.id || req.body.vedaId || req.body.textId;
      const list = Array.isArray(req.body.mantras)
        ? req.body.mantras
        : Array.isArray(req.body.sutras)
        ? req.body.sutras
        : Array.isArray(req.body)
        ? req.body
        : [];

      if (!list || list.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide an array of mantras/sutras in req.body.mantras or as a JSON array.",
        });
      }

      const preparedList = list.map((item) => ({
        ...item,
        vedaId: item.vedaId || vedaId,
      }));

      const results = await UpanishadDarshanService.bulkUpload(preparedList);

      return res.status(200).json({
        success: true,
        data: results,
        message: `Bulk upload completed: ${results.created} created, ${results.updated} updated`,
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.bulkUpload error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to process bulk upload",
      });
    }
  }

  /**
   * POST /seed - Seed default Upanishads and Darshanas into DB
   */
  static async seedArchive(req, res) {
    try {
      const overwrite = Boolean(req.body?.overwrite || req.query?.overwrite);
      const stats = await UpanishadDarshanService.seedArchive(overwrite);

      return res.status(200).json({
        success: true,
        data: stats,
        message: "Upanishad & Darshan archive seeded successfully",
      });
    } catch (error) {
      console.error("UpanishadDarshanAdminController.seedArchive error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to seed archive",
        error: error.message,
      });
    }
  }
}

export default UpanishadDarshanAdminController;
