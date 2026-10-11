import api from "@/services/api";
import type { Veda, VedaNode } from "../types/veda.types";

export const VedaAdminService = {
  /**
   * Get list of all Vedas with node & mantra count statistics
   */
  async getVedas(): Promise<Veda[]> {
    const res = await api.get("/admin/library/vedas");
    return res.data || [];
  },

  /**
   * Get single Veda by ID
   */
  async getVedaById(id: string): Promise<Veda> {
    const res = await api.get(`/admin/library/vedas/${id}`);
    return res.data;
  },

  /**
   * Get Veda with full nested hierarchy tree (for tree manager)
   */
  async getVedaTree(id: string): Promise<Veda> {
    const res = await api.get(`/admin/library/vedas/${id}/tree`);
    return res.data;
  },

  /**
   * Create Veda
   */
  async createVeda(data: Partial<Veda>): Promise<Veda> {
    const res = await api.post("/admin/library/vedas", data);
    return res.data;
  },

  /**
   * Update Veda
   */
  async updateVeda(id: string, data: Partial<Veda>): Promise<Veda> {
    const res = await api.put(`/admin/library/vedas/${id}`, data);
    return res.data;
  },

  /**
   * Delete Veda
   */
  async deleteVeda(id: string): Promise<boolean> {
    await api.delete(`/admin/library/vedas/${id}`);
    return true;
  },

  /**
   * Create Node in tree (Shakha, Sukta, Adhyaya, Kanda, etc.)
   */
  async createNode(data: Partial<VedaNode>): Promise<VedaNode> {
    const res = await api.post("/admin/library/vedas/nodes", data);
    return res.data;
  },

  /**
   * Update Node in tree
   */
  async updateNode(id: string, data: Partial<VedaNode>): Promise<VedaNode> {
    const res = await api.put(`/admin/library/vedas/nodes/${id}`, data);
    return res.data;
  },

  /**
   * Delete Node in tree
   */
  async deleteNode(id: string): Promise<boolean> {
    await api.delete(`/admin/library/vedas/nodes/${id}`);
    return true;
  },

  /**
   * Seed / Reset default Rigveda & Yajurveda authentic Vedic heritage datasets
   */
  async seedDefaultVedas(overwrite = false): Promise<any> {
    const res = await api.post("/admin/library/vedas/seed-vedas", { overwrite });
    return res.data;
  },
};

export default VedaAdminService;
