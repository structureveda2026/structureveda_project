import VedaService from "../services/veda.service.js";
import Veda from "../models/veda.model.js";

export class VedaAdminController {
  /**
   * GET /api/admin/library/vedas
   */
  static async getVedas(req, res) {
    try {
      const vedas = await VedaService.getAdminVedas();
      return res.status(200).json({
        success: true,
        data: vedas,
      });
    } catch (error) {
      console.error("VedaAdminController.getVedas error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch admin Vedas",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/library/vedas/:id
   */
  static async getVedaById(req, res) {
    try {
      const { id } = req.params;
      const veda = await Veda.findByPk(id);
      if (!veda) {
        return res.status(404).json({
          success: false,
          message: `Veda "${id}" not found`,
        });
      }
      return res.status(200).json({
        success: true,
        data: veda,
      });
    } catch (error) {
      console.error("VedaAdminController.getVedaById error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch Veda",
        error: error.message,
      });
    }
  }

  /**
   * POST /api/admin/library/vedas
   */
  static async createVeda(req, res) {
    try {
      const veda = await VedaService.createVeda(req.body);
      return res.status(201).json({
        success: true,
        message: "Veda created successfully",
        data: veda,
      });
    } catch (error) {
      console.error("VedaAdminController.createVeda error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create Veda",
      });
    }
  }

  /**
   * PUT /api/admin/library/vedas/:id
   */
  static async updateVeda(req, res) {
    try {
      const { id } = req.params;
      const veda = await VedaService.updateVeda(id, req.body);
      return res.status(200).json({
        success: true,
        message: "Veda updated successfully",
        data: veda,
      });
    } catch (error) {
      console.error("VedaAdminController.updateVeda error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update Veda",
      });
    }
  }

  /**
   * DELETE /api/admin/library/vedas/:id
   */
  static async deleteVeda(req, res) {
    try {
      const { id } = req.params;
      await VedaService.deleteVeda(id);
      return res.status(200).json({
        success: true,
        message: "Veda deleted successfully",
      });
    } catch (error) {
      console.error("VedaAdminController.deleteVeda error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete Veda",
      });
    }
  }

  /**
   * GET /api/admin/library/vedas/:id/tree
   */
  static async getVedaTree(req, res) {
    try {
      const { id } = req.params;
      const vedaWithTree = await VedaService.getVedaBySlug(id);
      if (!vedaWithTree) {
        return res.status(404).json({
          success: false,
          message: `Veda "${id}" not found`,
        });
      }
      return res.status(200).json({
        success: true,
        data: vedaWithTree,
      });
    } catch (error) {
      console.error("VedaAdminController.getVedaTree error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch Veda tree",
        error: error.message,
      });
    }
  }

  /**
   * POST /api/admin/library/nodes
   */
  static async createNode(req, res) {
    try {
      const node = await VedaService.createNode(req.body);
      return res.status(201).json({
        success: true,
        message: "Node created successfully",
        data: node,
      });
    } catch (error) {
      console.error("VedaAdminController.createNode error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create node",
      });
    }
  }

  /**
   * PUT /api/admin/library/nodes/:id
   */
  static async updateNode(req, res) {
    try {
      const { id } = req.params;
      const node = await VedaService.updateNode(id, req.body);
      return res.status(200).json({
        success: true,
        message: "Node updated successfully",
        data: node,
      });
    } catch (error) {
      console.error("VedaAdminController.updateNode error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update node",
      });
    }
  }

  /**
   * DELETE /api/admin/library/nodes/:id
   */
  static async deleteNode(req, res) {
    try {
      const { id } = req.params;
      await VedaService.deleteNode(id);
      return res.status(200).json({
        success: true,
        message: "Node deleted successfully",
      });
    } catch (error) {
      console.error("VedaAdminController.deleteNode error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete node",
      });
    }
  }

  /**
   * POST /api/admin/library/seed-vedas
   */
  static async seedVedas(req, res) {
    try {
      const { overwrite = false } = req.body;
      const result = await VedaService.seedDefaultVedicHeritage(overwrite);
      return res.status(200).json({
        success: true,
        message: "Default Vedic heritage dataset seeded successfully",
        data: result,
      });
    } catch (error) {
      console.error("VedaAdminController.seedVedas error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to seed Vedic heritage dataset",
        error: error.message,
      });
    }
  }
}

export default VedaAdminController;
