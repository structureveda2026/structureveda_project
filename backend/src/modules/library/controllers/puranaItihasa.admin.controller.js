import PuranaItihasaService from "../services/puranaItihasa.service.js";

export class PuranaItihasaAdminController {
  /**
   * GET / - Get all Purana and Itihasa texts
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
        status: req.query.status || "ALL",
      });

      return res.status(200).json({
        success: true,
        data: result.texts,
        pagination: result.pagination,
        message: "Texts retrieved successfully",
      });
    } catch (error) {
      console.error("PuranaItihasaAdminController.getAllTexts error:", error);
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
      console.error("PuranaItihasaAdminController.getTaxonomyTree error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch taxonomy tree",
        error: error.message,
      });
    }
  }

  /**
   * GET /:id - Get text by ID or slug with full node hierarchy tree and shloka count
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
      console.error("PuranaItihasaAdminController.getTextBySlugOrId error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch text details",
        error: error.message,
      });
    }
  }

  /**
   * POST / - Create text in Veda model
   */
  static async createText(req, res) {
    try {
      const newText = await PuranaItihasaService.createText(req.body);
      return res.status(201).json({
        success: true,
        data: newText,
        message: "Text created successfully",
      });
    } catch (error) {
      console.error("PuranaItihasaAdminController.createText error:", error);
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
      const updatedText = await PuranaItihasaService.updateText(id, req.body);
      return res.status(200).json({
        success: true,
        data: updatedText,
        message: "Text updated successfully",
      });
    } catch (error) {
      console.error("PuranaItihasaAdminController.updateText error:", error);
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
      await PuranaItihasaService.deleteText(id);
      return res.status(200).json({
        success: true,
        message: `Text "${id}" deleted or marked INACTIVE successfully`,
      });
    } catch (error) {
      console.error("PuranaItihasaAdminController.deleteText error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete text",
      });
    }
  }

  /**
   * GET /:id/shlokas - Get paginated shlokas for a text
   */
  static async getShlokas(req, res) {
    try {
      const textId = req.params.id || req.query.textId;
      const result = await PuranaItihasaService.getShlokas({
        ...req.query,
        textId,
        status: req.query.status || "ALL",
      });

      return res.status(200).json({
        success: true,
        data: result.shlokas,
        pagination: result.pagination,
        message: "Shlokas retrieved successfully",
      });
    } catch (error) {
      console.error("PuranaItihasaAdminController.getShlokas error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch shlokas",
        error: error.message,
      });
    }
  }

  /**
   * GET /shlokas/:shlokaId - Get single shloka by ID
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
      console.error("PuranaItihasaAdminController.getShlokaById error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch shloka",
        error: error.message,
      });
    }
  }

  /**
   * POST /:id/shlokas - Create shloka for a text
   */
  static async createShloka(req, res) {
    try {
      const textId = req.params.id || req.body.textId || req.body.vedaId;
      const newShloka = await PuranaItihasaService.createShloka({
        ...req.body,
        vedaId: textId,
      });

      return res.status(201).json({
        success: true,
        data: newShloka,
        message: "Shloka created successfully",
      });
    } catch (error) {
      console.error("PuranaItihasaAdminController.createShloka error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create shloka",
      });
    }
  }

  /**
   * PUT /shlokas/:shlokaId - Update shloka
   */
  static async updateShloka(req, res) {
    try {
      const id = req.params.shlokaId || req.params.id;
      const updatedShloka = await PuranaItihasaService.updateShloka(id, req.body);

      return res.status(200).json({
        success: true,
        data: updatedShloka,
        message: "Shloka updated successfully",
      });
    } catch (error) {
      console.error("PuranaItihasaAdminController.updateShloka error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update shloka",
      });
    }
  }

  /**
   * DELETE /shlokas/:shlokaId - Delete shloka
   */
  static async deleteShloka(req, res) {
    try {
      const id = req.params.shlokaId || req.params.id;
      await PuranaItihasaService.deleteShloka(id);

      return res.status(200).json({
        success: true,
        message: `Shloka "${id}" deleted successfully`,
      });
    } catch (error) {
      console.error("PuranaItihasaAdminController.deleteShloka error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete shloka",
      });
    }
  }

  /**
   * GET /:id/tree - Get text with full hierarchy tree
   */
  static async getTextTree(req, res) {
    try {
      const { id } = req.params;
      const text = await PuranaItihasaService.getTextTree(id);

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
      console.error("PuranaItihasaAdminController.getTextTree error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch text tree",
        error: error.message,
      });
    }
  }

  /**
   * POST /nodes or POST /:id/nodes - Create tree node (Kanda, Parva, Skandha, Adhyaya)
   */
  static async createNode(req, res) {
    try {
      const vedaId = req.params.id || req.body.vedaId || req.body.textId;
      const node = await PuranaItihasaService.createNode({
        ...req.body,
        vedaId,
      });

      return res.status(201).json({
        success: true,
        data: node,
        message: "Node created successfully",
      });
    } catch (error) {
      console.error("PuranaItihasaAdminController.createNode error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create node",
      });
    }
  }

  /**
   * PUT /nodes/:nodeId - Update tree node
   */
  static async updateNode(req, res) {
    try {
      const id = req.params.nodeId || req.params.id;
      const updatedNode = await PuranaItihasaService.updateNode(id, req.body);

      return res.status(200).json({
        success: true,
        data: updatedNode,
        message: "Node updated successfully",
      });
    } catch (error) {
      console.error("PuranaItihasaAdminController.updateNode error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update node",
      });
    }
  }

  /**
   * DELETE /nodes/:nodeId - Delete tree node
   */
  static async deleteNode(req, res) {
    try {
      const id = req.params.nodeId || req.params.id;
      await PuranaItihasaService.deleteNode(id);

      return res.status(200).json({
        success: true,
        message: `Node "${id}" deleted successfully`,
      });
    } catch (error) {
      console.error("PuranaItihasaAdminController.deleteNode error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete node",
      });
    }
  }

  /**
   * POST /shlokas/bulk-upload or POST /:id/shlokas/bulk-upload
   */
  static async bulkUploadShlokas(req, res) {
    try {
      const vedaId = req.params.id || req.body.vedaId || req.body.textId;
      const shlokas = Array.isArray(req.body.shlokas)
        ? req.body.shlokas
        : Array.isArray(req.body)
        ? req.body
        : [];

      if (!shlokas || shlokas.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide an array of shlokas in req.body.shlokas or as a JSON array.",
        });
      }

      const preparedList = shlokas.map((s) => ({
        ...s,
        vedaId: s.vedaId || vedaId,
      }));

      const results = await PuranaItihasaService.bulkUpload(preparedList);

      return res.status(200).json({
        success: true,
        data: results,
        message: `Bulk upload completed: ${results.created} created, ${results.updated} updated`,
      });
    } catch (error) {
      console.error("PuranaItihasaAdminController.bulkUploadShlokas error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to process bulk upload",
      });
    }
  }

  /**
   * POST /seed - Seed archive from puranaItihasaCompleteData.js
   */
  static async seedArchive(req, res) {
    try {
      const overwrite = Boolean(req.body?.overwrite || req.query?.overwrite);
      const stats = await PuranaItihasaService.seedArchive(overwrite);

      return res.status(200).json({
        success: true,
        data: stats,
        message: "Purana & Itihasa archive seeded successfully",
      });
    } catch (error) {
      console.error("PuranaItihasaAdminController.seedArchive error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to seed archive",
        error: error.message,
      });
    }
  }
}

export default PuranaItihasaAdminController;
