import VedaMantraService from "../services/vedaMantra.service.js";

export class VedaMantraAdminController {
  /**
   * GET /api/admin/library/mantras
   */
  static async getMantras(req, res) {
    try {
      const result = await VedaMantraService.getMantras({
        ...req.query,
        status: req.query.status || "ALL",
      });
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("VedaMantraAdminController.getMantras error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch admin mantras",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/library/mantras/:id
   */
  static async getMantraById(req, res) {
    try {
      const { id } = req.params;
      const mantra = await VedaMantraService.getMantraById(id);
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
      console.error("VedaMantraAdminController.getMantraById error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch mantra",
        error: error.message,
      });
    }
  }

  /**
   * POST /api/admin/library/mantras
   */
  static async createMantra(req, res) {
    try {
      const mantra = await VedaMantraService.createMantra(req.body);
      return res.status(201).json({
        success: true,
        message: "Mantra created successfully",
        data: mantra,
      });
    } catch (error) {
      console.error("VedaMantraAdminController.createMantra error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create mantra",
      });
    }
  }

  /**
   * PUT /api/admin/library/mantras/:id
   */
  static async updateMantra(req, res) {
    try {
      const { id } = req.params;
      const mantra = await VedaMantraService.updateMantra(id, req.body);
      return res.status(200).json({
        success: true,
        message: "Mantra updated successfully",
        data: mantra,
      });
    } catch (error) {
      console.error("VedaMantraAdminController.updateMantra error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update mantra",
      });
    }
  }

  /**
   * DELETE /api/admin/library/mantras/:id
   */
  static async deleteMantra(req, res) {
    try {
      const { id } = req.params;
      await VedaMantraService.deleteMantra(id);
      return res.status(200).json({
        success: true,
        message: "Mantra deleted successfully",
      });
    } catch (error) {
      console.error("VedaMantraAdminController.deleteMantra error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete mantra",
      });
    }
  }

  /**
   * POST /api/admin/library/mantras/bulk-upload
   */
  static async bulkUpload(req, res) {
    try {
      const { mantras } = req.body;
      const list = Array.isArray(mantras) ? mantras : req.body;
      const result = await VedaMantraService.bulkUpload(list);
      return res.status(200).json({
        success: true,
        message: `Bulk upload completed: ${result.created} created, ${result.updated} updated`,
        data: result,
      });
    } catch (error) {
      console.error("VedaMantraAdminController.bulkUpload error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to process bulk upload",
      });
    }
  }
}

export default VedaMantraAdminController;
